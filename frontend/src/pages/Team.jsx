import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import api from '../services/api.js';
import { soundFX } from '../utils/SoundFX.js';
import { 
  Users, 
  Building2, 
  Plus, 
  UserPlus, 
  Copy, 
  Check, 
  ShieldCheck, 
  ArrowUpRight 
} from 'lucide-react';

export default function Team() {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTeams() {
      try {
        const { data } = await api.get('/api/teams');
        setTeams(data || []);
      } catch {
        // Fallback
      } finally {
        setIsLoading(false);
      }
    }
    loadTeams();
  }, []);

  const copyInvite = (code) => {
    soundFX.playSelect();
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="min-h-screen bg-base text-ink flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-glass-border">
          <div>
            <div className="flex items-center gap-2 text-accent-bright font-mono text-xs font-bold uppercase tracking-wider">
              <Users className="h-4 w-4 text-accent-bright" />
              Collaborative Metropolis
            </div>
            <h1 className="text-3xl font-extrabold font-display text-white mt-1">
              Team & Guild Skylines
            </h1>
            <p className="text-sm text-ink-muted mt-1">
              Merge individual developer cities into shared high-density engineering metropolises.
            </p>
          </div>

          <button
            onClick={() => soundFX.playSelect()}
            className="btn-primary"
          >
            <Plus className="h-4 w-4" />
            Create Team Guild
          </button>
        </div>

        {/* Teams List */}
        <div className="space-y-6">
          {teams.map((team) => (
            <div key={team.id} className="glass-panel p-6 space-y-6">
              <div className="led-strip" />

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-glass-border">
                <div>
                  <h3 className="text-xl font-bold font-display text-white">
                    {team.name}
                  </h3>
                  <p className="text-xs text-ink-muted mt-1">
                    {team.description}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => copyInvite(team.inviteCode)}
                    className="flex items-center gap-1.5 rounded-lg border border-glass-border bg-white/5 px-3 py-2 text-xs font-mono text-ink-muted hover:border-accent-bright hover:text-white transition"
                  >
                    {copiedCode ? <Check className="h-3.5 w-3.5 text-state-success" /> : <Copy className="h-3.5 w-3.5" />}
                    Code: {team.inviteCode}
                  </button>

                  <button
                    onClick={() => {
                      soundFX.playWarp();
                      navigate('/city');
                    }}
                    className="btn-primary text-xs py-2"
                  >
                    <Building2 className="h-4 w-4" />
                    Enter Team Metropolis
                  </button>
                </div>
              </div>

              {/* Members */}
              <div>
                <span className="text-xs font-mono text-ink-muted uppercase tracking-wider block mb-3">
                  Guild Architects ({team.membersCount})
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {(team.members || []).map((m) => (
                    <div key={m.id} className="flex items-center gap-3 rounded-xl border border-glass-border bg-base-100/60 p-3">
                      <img
                        src={m.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${m.username}`}
                        alt={m.username}
                        className="h-9 w-9 rounded-full bg-base-200 border border-accent/30 object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white truncate">
                            {m.name || m.username}
                          </span>
                          <span className="text-[10px] font-mono text-accent-bright uppercase font-bold">
                            {m.role}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-ink-muted">
                          @{m.username}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>

      </main>
    </div>
  );
}
