import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import { soundFX } from '../utils/SoundFX.js';
import { 
  User, 
  Award, 
  Flame, 
  Zap, 
  ShieldCheck, 
  Star, 
  Terminal, 
  CheckCircle2,
  Lock
} from 'lucide-react';

const ACHIEVEMENTS = [
  { id: '1', title: 'City Founder', desc: 'Constructed your first 3D repository skyline.', icon: '🏙️', unlocked: true },
  { id: '2', title: 'Polyglot Titan', desc: 'Maintained repositories across 5+ languages.', icon: '⚡', unlocked: true },
  { id: '3', title: 'Star Hunter', desc: 'Accumulated over 1,000+ total GitHub stars.', icon: '⭐', unlocked: true },
  { id: '4', title: 'Cyber Security Sentinel', desc: 'Deployed security & auth proxy services.', icon: '🛡️', unlocked: true },
  { id: '5', title: 'AI Architect', desc: 'Integrated deep neural models into city grid.', icon: '🤖', unlocked: true },
  { id: '6', title: 'Quantum Committer', desc: 'Reached 100+ commits streak milestone.', icon: '🔥', unlocked: false },
];

export default function Profile() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const { data } = await api.get('/api/users/me/stats');
        setStats(data);
      } catch {
        // Fallback
      }
    }
    loadStats();
  }, []);

  const level = user?.level || stats?.level || 12;
  const xp = user?.xp || stats?.xp || 4850;
  const nextXp = level * 500;
  const xpProgress = Math.min(100, Math.floor((xp / nextXp) * 100));

  return (
    <div className="min-h-screen bg-base text-ink flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Profile Card */}
        <div className="glass-panel p-8 relative overflow-hidden">
          <div className="led-strip" />
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
            
            {/* Avatar */}
            <div className="relative group">
              <img
                src={user?.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.username || 'architect'}`}
                alt={user?.username}
                className="h-28 w-28 rounded-2xl border-2 border-accent-bright bg-base-200 object-cover shadow-glow"
              />
              <div className="absolute -bottom-2 -right-2 rounded-full bg-accent px-2.5 py-0.5 font-mono text-[10px] font-bold text-white shadow-glow-sm">
                Lv. {level}
              </div>
            </div>

            {/* User info */}
            <div className="flex-1 text-center md:text-left space-y-2">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <h1 className="text-2xl font-extrabold font-display text-white">
                    {user?.name || user?.username || 'Cyber Architect'}
                  </h1>
                  <span className="font-mono text-xs text-accent-bright">
                    @{user?.username || 'cyber_architect'}
                  </span>
                </div>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 font-mono text-xs font-semibold text-purple-300">
                  <Zap className="h-3.5 w-3.5 fill-purple-400" />
                  Senior Cyber Architect
                </span>
              </div>

              <p className="text-xs text-ink-muted leading-relaxed max-w-xl">
                {user?.bio || 'Building living 3D code cities, distributed backend pipelines, and interactive spatial software.'}
              </p>

              {/* XP Progress Bar */}
              <div className="pt-3 space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-ink-muted">Architect XP Progress</span>
                  <span className="text-accent-bright font-bold">{xp} / {nextXp} XP ({xpProgress}%)</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-base-200 overflow-hidden border border-glass-border">
                  <div 
                    className="h-full bg-gradient-to-r from-accent via-accent-bright to-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${xpProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="glass-panel p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-glass-border pb-3">
            <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-400" />
              Architect Badges & Achievements
            </h3>
            <span className="font-mono text-xs text-accent-bright">
              5 of 6 Unlocked
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ACHIEVEMENTS.map((item) => (
              <div
                key={item.id}
                onMouseEnter={() => soundFX.playHover()}
                className={`rounded-xl border p-4 transition-all ${
                  item.unlocked
                    ? 'border-glass-border bg-base-100/60 hover:border-accent-bright/50'
                    : 'border-glass-border/40 bg-base-200/20 opacity-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white font-display">
                        {item.title}
                      </h4>
                      {item.unlocked ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <Lock className="h-4 w-4 text-ink-faint" />
                      )}
                    </div>
                    <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
