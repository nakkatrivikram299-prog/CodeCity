import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import { soundFX } from '../utils/SoundFX.js';
import { Building2, User, Mail, Lock, ArrowRight } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const { completeOAuthLogin } = useAuth();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    soundFX.playSelect();
    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/api/auth/register', {
        username,
        email,
        password,
        name: username,
      });
      await completeOAuthLogin(data.access_token);
      navigate('/city');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to register account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base text-ink flex flex-col justify-center items-center p-4 relative overflow-hidden">
      
      <div className="relative z-10 w-full max-w-md glass-panel p-8 space-y-6 shadow-2xl">
        <div className="led-strip" />

        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent shadow-glow mb-2">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold font-display text-white">
            Create Architect Account
          </h1>
          <p className="text-xs text-ink-muted">
            Join CodeCity and visualize your repositories in 3D.
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-state-danger/10 border border-state-danger/30 p-3 text-xs text-state-danger text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          <div>
            <label className="stat-label mb-1.5 block">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-ink-muted" />
              <input
                type="text"
                required
                placeholder="cyber_titan"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field pl-9"
              />
            </div>
          </div>

          <div>
            <label className="stat-label mb-1.5 block">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-ink-muted" />
              <input
                type="email"
                required
                placeholder="titan@codecity.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-9"
              />
            </div>
          </div>

          <div>
            <label className="stat-label mb-1.5 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-ink-muted" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-9"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-sm font-semibold"
          >
            {loading ? 'Creating Skyline...' : 'Initialize Architect Session'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="text-center text-xs text-ink-muted">
          Already have an account?{' '}
          <NavLink to="/login" className="text-accent-bright font-semibold hover:underline">
            Sign In
          </NavLink>
        </div>
      </div>
    </div>
  );
}
