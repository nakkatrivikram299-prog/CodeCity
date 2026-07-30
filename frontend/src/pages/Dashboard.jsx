import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import api from '../services/api.js';
import { soundFX } from '../utils/SoundFX.js';
import { 
  Building2, 
  Star, 
  GitFork, 
  Activity, 
  Code2, 
  Zap, 
  Search, 
  ArrowUpRight, 
  Layers,
  Flame,
  Award
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, Tooltip } from 'recharts';

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [repos, setRepos] = useState([]);
  const [searchFilter, setSearchFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [statsRes, reposRes] = await Promise.all([
          api.get('/api/users/me/stats'),
          api.get('/api/repos')
        ]);
        setStats(statsRes.data);
        setRepos(reposRes.data || []);
      } catch {
        // Fallback
      } finally {
        setIsLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const filteredRepos = repos.filter(
    (r) =>
      r.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (r.language && r.language.toLowerCase().includes(searchFilter.toLowerCase()))
  );

  // Compute language breakdown for Pie chart
  const languageCounts = {};
  repos.forEach((r) => {
    const lang = r.language || 'Other';
    languageCounts[lang] = (languageCounts[lang] || 0) + 1;
  });

  const pieData = Object.entries(languageCounts).map(([name, value]) => ({ name, value }));
  const PIE_COLORS = ['#38BDF8', '#3B82F6', '#A78BFA', '#FBBF24', '#F87171', '#34D399'];

  // Mock commit timeline data
  const activityTimeline = [
    { day: 'Mon', commits: 14 },
    { day: 'Tue', commits: 22 },
    { day: 'Wed', commits: 18 },
    { day: 'Thu', commits: 35 },
    { day: 'Fri', commits: 28 },
    { day: 'Sat', commits: 12 },
    { day: 'Sun', commits: 19 },
  ];

  return (
    <div className="min-h-screen bg-base text-ink flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-glass-border">
          <div>
            <div className="flex items-center gap-2 text-accent-bright font-mono text-xs font-bold uppercase tracking-wider">
              <Zap className="h-4 w-4 fill-accent-bright" />
              Cyber Architecture Telemetry
            </div>
            <h1 className="text-3xl font-extrabold font-display text-white mt-1">
              Skyline Dashboard
            </h1>
            <p className="text-sm text-ink-muted mt-1">
              Real-time repository telemetry, code velocity, and district breakdown.
            </p>
          </div>

          <button
            onClick={() => {
              soundFX.playWarp();
              navigate('/city');
            }}
            className="btn-primary"
          >
            <Building2 className="h-4 w-4" />
            Enter 3D City Matrix
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          <div className="glass-panel p-5">
            <div className="led-strip" />
            <div className="flex items-center justify-between text-ink-muted text-xs font-mono uppercase tracking-wider mb-2">
              <span>Total Repositories</span>
              <Building2 className="h-4 w-4 text-accent-bright" />
            </div>
            <div className="text-3xl font-bold font-mono text-white">
              {stats?.totalRepos || repos.length}
            </div>
            <div className="text-[11px] text-accent-light font-mono mt-1">
              Active Skyscrapers
            </div>
          </div>

          <div className="glass-panel p-5">
            <div className="led-strip" />
            <div className="flex items-center justify-between text-ink-muted text-xs font-mono uppercase tracking-wider mb-2">
              <span>Total Commits</span>
              <Activity className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-bold font-mono text-white">
              {stats?.totalCommits || 184}
            </div>
            <div className="text-[11px] text-emerald-400 font-mono mt-1">
              Light Pulses
            </div>
          </div>

          <div className="glass-panel p-5">
            <div className="led-strip" />
            <div className="flex items-center justify-between text-ink-muted text-xs font-mono uppercase tracking-wider mb-2">
              <span>Total Stars</span>
              <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
            </div>
            <div className="text-3xl font-bold font-mono text-white">
              {(stats?.totalStars || 21400).toLocaleString()}
            </div>
            <div className="text-[11px] text-amber-400 font-mono mt-1">
              Skyline Rating
            </div>
          </div>

          <div className="glass-panel p-5">
            <div className="led-strip" />
            <div className="flex items-center justify-between text-ink-muted text-xs font-mono uppercase tracking-wider mb-2">
              <span>Architect Level</span>
              <Award className="h-4 w-4 text-purple-400" />
            </div>
            <div className="text-3xl font-bold font-mono text-white">
              Lv. {stats?.level || 12}
            </div>
            <div className="text-[11px] text-purple-300 font-mono mt-1">
              {stats?.xp || 4850} / {(stats?.level || 12) * 500} XP
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Commit Velocity Area Chart */}
          <div className="lg:col-span-2 glass-panel p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold font-display text-white">
                  Commit Velocity (Weekly Churn)
                </h3>
                <p className="text-xs text-ink-muted">
                  Daily code push telemetry across all districts.
                </p>
              </div>
              <span className="flex items-center gap-1 text-xs font-mono text-accent-bright bg-accent/10 px-3 py-1 rounded-full border border-accent/30 font-semibold">
                <Flame className="h-3.5 w-3.5 text-amber-400" /> 18 Day Streak
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityTimeline}>
                  <defs>
                    <linearGradient id="colorVelocity" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#8792A6" fontSize={11} />
                  <YAxis stroke="#8792A6" fontSize={11} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0D1220', borderColor: 'rgba(96,165,250,0.3)', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="commits" stroke="#38bdf8" strokeWidth={2} fillOpacity={1} fill="url(#colorVelocity)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Language Distribution Pie Chart */}
          <div className="glass-panel p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold font-display text-white mb-1">
                Technology Stack Ratio
              </h3>
              <p className="text-xs text-ink-muted mb-4">
                Language footprint forming the cityscape.
              </p>
            </div>

            <div className="h-52 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0D1220', borderRadius: '8px', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs font-mono">
              {pieData.slice(0, 4).map((entry, idx) => (
                <div key={entry.name} className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }} />
                  <span className="text-ink-muted">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Repositories List */}
        <div className="glass-panel p-6 space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-lg font-bold font-display text-white">
              Repository Skylines ({filteredRepos.length})
            </h3>

            {/* Filter Search */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-ink-muted" />
              <input
                type="text"
                placeholder="Filter repositories or languages..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="input-field pl-9 py-2 text-xs w-64"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRepos.map((repo) => (
              <div 
                key={repo.id}
                className="group relative rounded-xl border border-glass-border bg-base-100/50 p-4 transition-all hover:border-accent-bright/50 hover:bg-base-200/60"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-accent-bright font-bold">
                      {repo.district} district
                    </span>
                    <h4 className="text-base font-bold text-white font-display group-hover:text-accent-bright transition">
                      {repo.name}
                    </h4>
                  </div>
                  <span className="rounded-full bg-white/5 border border-glass-border px-2 py-0.5 text-[10px] font-mono text-ink-muted">
                    {repo.language}
                  </span>
                </div>

                <p className="text-xs text-ink-muted my-3 line-clamp-2">
                  {repo.description || 'No description provided.'}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-glass-border text-xs font-mono text-ink-muted">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-amber-400">
                      <Star className="h-3.5 w-3.5 fill-amber-400" /> {repo.starsCount}
                    </span>
                    <span className="flex items-center gap-1 text-accent-bright">
                      <GitFork className="h-3.5 w-3.5" /> {repo.forksCount}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      soundFX.playWarp();
                      navigate('/city');
                    }}
                    className="flex items-center gap-1 text-accent-light hover:text-white font-semibold transition"
                  >
                    View 3D
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
