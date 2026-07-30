import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  LayoutDashboard, 
  User, 
  Users, 
  Settings, 
  LogOut, 
  Search, 
  Volume2, 
  VolumeX, 
  Sparkles,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { soundFX } from '../utils/SoundFX.js';

export default function Navbar({ onSearchGithub }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');
  const [soundOn, setSoundOn] = useState(soundFX.enabled);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      soundFX.playWarp();
      if (onSearchGithub) {
        onSearchGithub(searchInput.trim());
      } else {
        navigate(`/city?user=${encodeURIComponent(searchInput.trim())}`);
      }
    }
  };

  const toggleAudio = () => {
    const newState = soundFX.toggleSound();
    setSoundOn(newState);
    if (newState) soundFX.playSelect();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-glass-border bg-base/80 backdrop-blur-xl transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <NavLink 
            to="/city" 
            className="group flex items-center gap-2.5 text-lg font-bold tracking-wider text-white transition hover:opacity-90"
            onMouseEnter={() => soundFX.playHover()}
            onClick={() => soundFX.playSelect()}
          >
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent-bright via-accent to-accent-deep shadow-glow-sm transition group-hover:scale-105">
              <Building2 className="h-5 w-5 text-white" />
              <div className="absolute -inset-0.5 rounded-xl bg-accent-bright/30 blur-sm group-hover:opacity-100 opacity-60 transition" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-ink to-accent-light">
                CODECITY
              </span>
              <span className="text-[9px] font-mono tracking-widest text-accent-bright uppercase font-semibold">
                3D Skyline
              </span>
            </div>
          </NavLink>

          {/* Search Input for Any Public GitHub User */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center relative">
            <Search className="absolute left-3 h-4 w-4 text-ink-muted" />
            <input
              type="text"
              placeholder="Load GitHub city (e.g. torvalds)..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="h-9 w-64 rounded-full border border-glass-border bg-base-100/70 pl-9 pr-4 text-xs text-ink placeholder:text-ink-faint focus:border-accent-bright focus:bg-base-200 focus:outline-none transition-all shadow-inner"
            />
            <button
              type="submit"
              className="ml-2 hidden"
            />
          </form>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 rounded-full border border-glass-border bg-base-100/60 p-1 backdrop-blur-md">
          <NavLink
            to="/city"
            onMouseEnter={() => soundFX.playHover()}
            onClick={() => soundFX.playSelect()}
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                isActive
                  ? 'bg-accent/20 text-accent-bright border border-accent/40 shadow-glow-sm font-semibold'
                  : 'text-ink-muted hover:text-white hover:bg-white/5'
              }`
            }
          >
            <Building2 className="h-3.5 w-3.5" />
            3D City
          </NavLink>

          <NavLink
            to="/dashboard"
            onMouseEnter={() => soundFX.playHover()}
            onClick={() => soundFX.playSelect()}
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                isActive
                  ? 'bg-accent/20 text-accent-bright border border-accent/40 shadow-glow-sm font-semibold'
                  : 'text-ink-muted hover:text-white hover:bg-white/5'
              }`
            }
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            Dashboard
          </NavLink>

          <NavLink
            to="/profile"
            onMouseEnter={() => soundFX.playHover()}
            onClick={() => soundFX.playSelect()}
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                isActive
                  ? 'bg-accent/20 text-accent-bright border border-accent/40 shadow-glow-sm font-semibold'
                  : 'text-ink-muted hover:text-white hover:bg-white/5'
              }`
            }
          >
            <User className="h-3.5 w-3.5" />
            Profile
          </NavLink>

          <NavLink
            to="/team"
            onMouseEnter={() => soundFX.playHover()}
            onClick={() => soundFX.playSelect()}
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                isActive
                  ? 'bg-accent/20 text-accent-bright border border-accent/40 shadow-glow-sm font-semibold'
                  : 'text-ink-muted hover:text-white hover:bg-white/5'
              }`
            }
          >
            <Users className="h-3.5 w-3.5" />
            Metropolis
          </NavLink>

          <NavLink
            to="/settings"
            onMouseEnter={() => soundFX.playHover()}
            onClick={() => soundFX.playSelect()}
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                isActive
                  ? 'bg-accent/20 text-accent-bright border border-accent/40 shadow-glow-sm font-semibold'
                  : 'text-ink-muted hover:text-white hover:bg-white/5'
              }`
            }
          >
            <Settings className="h-3.5 w-3.5" />
            Settings
          </NavLink>
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {/* Audio FX Toggle */}
          <button
            onClick={toggleAudio}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-glass-border bg-base-100/60 text-ink-muted transition hover:border-accent-bright hover:text-accent-bright"
            title={soundOn ? "Mute UI Sounds" : "Enable UI Sounds"}
          >
            {soundOn ? <Volume2 className="h-4 w-4 text-accent-bright" /> : <VolumeX className="h-4 w-4 text-ink-faint" />}
          </button>

          {/* User Badge / Level */}
          {user ? (
            <div className="flex items-center gap-2.5 rounded-full border border-glass-border bg-base-100/80 p-1 pr-3">
              <img
                src={user.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.username}`}
                alt={user.username}
                className="h-7 w-7 rounded-full bg-base-200 border border-accent/30 object-cover"
              />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-white leading-tight">
                  {user.username}
                </span>
                <span className="flex items-center gap-1 text-[10px] font-mono text-accent-bright">
                  <Zap className="h-2.5 w-2.5 fill-accent-bright" />
                  Lv. {user.level || 1}
                </span>
              </div>
              <button
                onClick={() => {
                  soundFX.playSelect();
                  logout();
                }}
                className="ml-2 text-ink-muted hover:text-state-danger transition"
                title="Log out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <NavLink
              to="/login"
              className="btn-primary py-1.5 px-4 text-xs font-semibold"
            >
              Sign In
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
}
