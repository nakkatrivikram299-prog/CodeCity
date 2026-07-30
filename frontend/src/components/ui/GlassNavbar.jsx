import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  LogIn, 
  User, 
  Sparkles,
  Volume2,
  VolumeX
} from 'lucide-react';
import { soundFX } from '../../utils/SoundFX.js';
import { useAuth } from '../../context/AuthContext.jsx';

export default function GlassNavbar({ 
  searchQuery, 
  onSearchChange, 
  isNight, 
  onToggleNight, 
  onSelectBuildingById 
}) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [soundOn, setSoundOn] = useState(soundFX.enabled);

  const toggleAudio = () => {
    const newState = soundFX.toggleSound();
    setSoundOn(newState);
    if (newState) soundFX.playSelect();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-glass-border bg-base/80 backdrop-blur-xl transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* CodeCity Smart City Brand */}
        <div className="flex items-center gap-6">
          <NavLink
            to="/"
            className="group flex items-center gap-2.5 text-lg font-bold tracking-wider text-white transition hover:opacity-90"
            onMouseEnter={() => soundFX.playHover()}
            onClick={() => soundFX.playSelect()}
          >
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent-bright via-accent to-accent-deep shadow-glow-sm transition group-hover:scale-105">
              <Building2 className="h-5 w-5 text-white" />
              <div className="absolute -inset-0.5 rounded-xl bg-accent-bright/30 blur-sm opacity-60 group-hover:opacity-100 transition" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-ink to-accent-light">
                CODECITY
              </span>
              <span className="text-[9px] font-mono tracking-widest text-accent-bright uppercase font-semibold">
                Smart City Platform
              </span>
            </div>
          </NavLink>

          {/* Search bar */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-ink-muted" />
            <input
              type="text"
              placeholder="Search buildings & features..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-9 w-64 rounded-full border border-glass-border bg-base-100/70 pl-9 pr-4 text-xs text-ink placeholder:text-ink-faint focus:border-accent-bright focus:bg-base-200 focus:outline-none transition-all shadow-inner"
            />
          </div>
        </div>

        {/* Center Indicator */}
        <div className="hidden lg:flex items-center gap-2 rounded-full border border-glass-border bg-base-100/60 px-4 py-1.5 backdrop-blur-md">
          <div className="relative flex h-2 w-2 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </div>
          <span className="font-mono text-xs font-semibold text-white">
            12 Active Smart Buildings
          </span>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          
          {/* Day / Night Mode Toggle */}
          <button
            onClick={() => {
              soundFX.playSelect();
              onToggleNight();
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-glass-border bg-base-100/60 text-ink-muted transition hover:border-accent-bright hover:text-accent-bright"
            title={isNight ? "Switch to Day Mode" : "Switch to Night Mode"}
          >
            {isNight ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-accent-bright" />}
          </button>

          {/* Audio FX Toggle */}
          <button
            onClick={toggleAudio}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-glass-border bg-base-100/60 text-ink-muted transition hover:border-accent-bright hover:text-accent-bright"
            title={soundOn ? "Mute UI Sounds" : "Enable UI Sounds"}
          >
            {soundOn ? <Volume2 className="h-4 w-4 text-accent-bright" /> : <VolumeX className="h-4 w-4 text-ink-faint" />}
          </button>

          {/* Notifications Dropdown Toggle */}
          <div className="relative">
            <button
              onClick={() => {
                soundFX.playSelect();
                setShowNotifications(!showNotifications);
              }}
              className="relative flex h-9 w-9 items-center justify-center rounded-full border border-glass-border bg-base-100/60 text-ink-muted transition hover:border-accent-bright hover:text-white"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-glass-border bg-base-100/95 p-4 backdrop-blur-2xl shadow-2xl z-50 animate-in fade-in zoom-in duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-glass-border">
                  <span className="text-xs font-bold font-display text-white">Notifications</span>
                  <span className="text-[10px] font-mono text-accent-bright">3 Unread</span>
                </div>
                <div className="mt-3 space-y-2 max-h-56 overflow-y-auto">
                  <div className="rounded-xl border border-glass-border bg-base-200/50 p-2.5 text-xs">
                    <span className="font-bold text-accent-bright">🏆 Hackathon Invitation</span>
                    <p className="text-[11px] text-ink-muted mt-0.5">Cyber AI Sprint 2026 registration is live!</p>
                  </div>
                  <div className="rounded-xl border border-glass-border bg-base-200/50 p-2.5 text-xs">
                    <span className="font-bold text-emerald-400">🤖 AI Audit Complete</span>
                    <p className="text-[11px] text-ink-muted mt-0.5">Your repo received 96/100 Quality rating.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sign In Button / User Profile Badge */}
          <button
            onClick={() => {
              soundFX.playSelect();
              navigate('/login');
            }}
            className="flex items-center gap-2 rounded-full border border-accent/50 bg-accent/15 px-3 py-1.5 hover:bg-accent/25 hover:border-accent-bright transition shadow-glow-sm"
          >
            <LogIn className="h-4 w-4 text-accent-bright" />
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-white leading-tight">
                {user ? user.username || 'Architect' : 'Sign In'}
              </span>
              <span className="text-[9px] font-mono text-accent-bright">
                {user ? 'Lv. 14' : 'Login / Auth'}
              </span>
            </div>
          </button>

        </div>
      </div>
    </header>
  );
}
