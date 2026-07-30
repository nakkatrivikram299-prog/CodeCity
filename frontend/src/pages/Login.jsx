import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import { soundFX } from '../utils/SoundFX.js';
import { 
  Building2, 
  Github, 
  Zap, 
  Sparkles, 
  ArrowRight, 
  Lock, 
  User, 
  Globe 
} from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { loginWithGithub, completeOAuthLogin } = useAuth();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    soundFX.playSelect();
    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/api/auth/login', {
        username_or_email: username,
        password: password,
      });
      await completeOAuthLogin(data.access_token);
      navigate('/city');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid login credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoGuestMode = async () => {
    soundFX.playWarp();
    setLoading(true);
    try {
      const { data } = await api.post('/api/auth/demo-token');
      await completeOAuthLogin(data.access_token);
      navigate('/city');
    } catch {
      navigate('/city?user=torvalds');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base text-ink flex flex-col justify-center items-center p-4 relative overflow-hidden">
      
      {/* Background Neon Grids */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.25),rgba(255,255,255,0))]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      {/* Main Glass Login Card */}
      <div className="relative z-10 w-full max-w-md glass-panel p-8 space-y-6 shadow-2xl">
        <div className="led-strip" />

        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-bright via-accent to-accent-deep shadow-glow mb-2">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold font-display text-white tracking-wider">
            CODECITY
          </h1>
          <p className="text-xs text-ink-muted">
            Turn GitHub repositories into a living 3D futuristic skyline.
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-state-danger/10 border border-state-danger/30 p-3 text-xs text-state-danger text-center">
            {error}
          </div>
        )}

        {/* Standard Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="stat-label mb-1.5 block">Username or Email</label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-ink-muted" />
              <input
                type="text"
                required
                placeholder="neo_architect"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
            {loading ? 'Entering Matrix...' : 'Sign In to CodeCity'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-glass-border w-full" />
          <span className="bg-base-100 px-3 text-[10px] font-mono text-ink-muted uppercase">OR</span>
        </div>

        {/* GitHub OAuth & Instant Guest Demo Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => {
              soundFX.playSelect();
              loginWithGithub();
            }}
            className="btn-secondary w-full py-2.5 text-xs font-semibold"
          >
            <Github className="h-4 w-4 text-white" />
            Continue with GitHub
          </button>

          <button
            onClick={handleDemoGuestMode}
            className="w-full rounded-xl border border-accent/40 bg-accent/10 py-2.5 text-xs font-semibold text-accent-bright transition-all hover:bg-accent/20 hover:border-accent-bright shadow-glow-sm flex items-center justify-center gap-2"
          >
            <Sparkles className="h-4 w-4 text-amber-400" />
            Instant Guest / Explore Demo City
          </button>
        </div>

        {/* Signup Link */}
        <div className="text-center text-xs text-ink-muted">
          Don't have an architect account?{' '}
          <NavLink to="/register" className="text-accent-bright font-semibold hover:underline">
            Register now
          </NavLink>
        </div>
      </div>
    </div>
  );
}
