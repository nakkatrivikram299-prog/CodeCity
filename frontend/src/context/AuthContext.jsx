import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api.js';

/** @typedef {{ id: string, username: string, name: string, avatarUrl: string, email: string|null, level: number, xp: number }} CodeCityUser */

/**
 * @typedef {Object} AuthContextValue
 * @property {CodeCityUser|null} user
 * @property {boolean} isAuthenticated
 * @property {boolean} isLoading
 * @property {() => void} loginWithGithub
 * @property {() => Promise<void>} logout
 * @property {(token: string) => Promise<void>} completeOAuthLogin
 * @property {() => Promise<void>} refreshUser
 */

const AuthContext = createContext(/** @type {AuthContextValue|null} */ (null));

const TOKEN_STORAGE_KEY = 'codecity_access_token';

/**
 * Provides authentication state for the whole app.
 * Holds the JWT in memory + localStorage, attaches it to the axios instance,
 * and exposes the GitHub OAuth redirect flow.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(/** @type {CodeCityUser|null} */ (null));
  const [isLoading, setIsLoading] = useState(true);

  const setToken = useCallback((token) => {
    if (token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      delete api.defaults.headers.common.Authorization;
    }
  }, []);

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    try {
      const { data } = await api.get('/api/users/me');
      setUser(data);
    } catch {
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [setToken]);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const loginWithGithub = useCallback(() => {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    const redirectUri = `${window.location.origin}/auth/callback`;
    const scope = 'read:user,repo,read:org';
    const state = crypto.randomUUID();
    sessionStorage.setItem('codecity_oauth_state', state);
    const url = new URL('https://github.com/login/oauth/authorize');
    url.searchParams.set('client_id', clientId);
    url.searchParams.set('redirect_uri', redirectUri);
    url.searchParams.set('scope', scope);
    url.searchParams.set('state', state);
    window.location.href = url.toString();
  }, []);

  /** Exchanges a backend-issued JWT (delivered after the GitHub callback) for a session. */
  const completeOAuthLogin = useCallback(
    async (token) => {
      setToken(token);
      await refreshUser();
    },
    [refreshUser, setToken]
  );

  const logout = useCallback(async () => {
    try {
      await api.post('/api/auth/logout');
    } catch {
      // Best-effort server-side session invalidation; local logout still proceeds.
    }
    setToken(null);
    setUser(null);
  }, [setToken]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      loginWithGithub,
      logout,
      completeOAuthLogin,
      refreshUser,
    }),
    [user, isLoading, loginWithGithub, logout, completeOAuthLogin, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/** @returns {AuthContextValue} */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
