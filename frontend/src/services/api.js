import axios from 'axios';

/**
 * Shared axios instance for all backend REST calls.
 * Base URL is proxied to the FastAPI backend in dev (see vite.config.js) and
 * points at the deployed API origin in production via VITE_API_URL.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('codecity_access_token');
      delete api.defaults.headers.common.Authorization;
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
