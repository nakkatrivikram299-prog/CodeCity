import { useState } from 'react';
import { 
  X, 
  Star, 
  GitFork, 
  AlertCircle, 
  ExternalLink, 
  Activity, 
  Cpu, 
  Zap, 
  ShieldCheck, 
  Code2, 
  Sparkles,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { soundFX } from '../utils/SoundFX.js';

export default function RepoModal({ repo, onClose, onSimulateCommit }) {
  if (!repo) return null;

  const districtColors = {
    ai: 'from-purple-500 to-indigo-600 border-purple-400 text-purple-300',
    backend: 'from-sky-500 to-blue-600 border-sky-400 text-sky-300',
    frontend: 'from-blue-500 to-cyan-500 border-blue-400 text-blue-300',
    blockchain: 'from-amber-500 to-yellow-600 border-amber-400 text-amber-300',
    security: 'from-red-500 to-rose-600 border-red-400 text-red-300',
    tools: 'from-emerald-500 to-teal-600 border-emerald-400 text-emerald-300',
  };

  const districtBadgeStyle = districtColors[repo.district] || districtColors.frontend;

  // Generate chart data from commits
  const commitData = (repo.recentCommits || []).map((c, i) => ({
    name: `C${i + 1}`,
    additions: c.additions || 50,
    deletions: c.deletions || 10,
  }));

  // Calculate building stats
  const buildingHeight = Math.min(24, Math.max(4, Math.floor(Math.log2(repo.size + 10) * 1.8)));
  const qualityScore = Math.min(99, 70 + Math.floor((repo.starsCount % 25) + (repo.size % 10)));

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-glass-border bg-base-100/90 p-6 backdrop-blur-2xl shadow-2xl transition-all animate-in slide-in-from-right duration-300">
      {/* LED scan line at top */}
      <div className="led-strip" />

      {/* Header */}
      <div className="flex items-start justify-between pb-4 border-b border-glass-border">
        <div className="flex flex-col gap-1 pr-4">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-mono uppercase font-bold ${districtBadgeStyle}`}>
              <Cpu className="h-3 w-3" />
              {repo.district} district
            </span>
            <span className="rounded-full bg-white/5 border border-glass-border px-2 py-0.5 text-[10px] font-mono text-ink-muted">
              {repo.language || 'Code'}
            </span>
          </div>
          <h2 className="text-xl font-bold font-display text-white mt-1 leading-snug">
            {repo.name}
          </h2>
          <p className="text-xs text-ink-muted leading-relaxed line-clamp-2">
            {repo.description || 'No description available.'}
          </p>
        </div>
        <button
          onClick={() => {
            soundFX.playSelect();
            onClose();
          }}
          className="rounded-lg p-1.5 text-ink-muted hover:bg-white/10 hover:text-white transition"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Main Content scroll area */}
      <div className="flex-1 overflow-y-auto py-5 space-y-5">
        
        {/* Metric Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-glass-border bg-base-200/60 p-3 flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-1 text-amber-400 mb-1">
              <Star className="h-4 w-4 fill-amber-400" />
            </div>
            <span className="text-lg font-bold font-mono text-white">
              {repo.starsCount?.toLocaleString() || 0}
            </span>
            <span className="text-[10px] text-ink-muted uppercase tracking-wider">Stars</span>
          </div>

          <div className="rounded-xl border border-glass-border bg-base-200/60 p-3 flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-1 text-accent-bright mb-1">
              <GitFork className="h-4 w-4" />
            </div>
            <span className="text-lg font-bold font-mono text-white">
              {repo.forksCount?.toLocaleString() || 0}
            </span>
            <span className="text-[10px] text-ink-muted uppercase tracking-wider">Forks</span>
          </div>

          <div className="rounded-xl border border-glass-border bg-base-200/60 p-3 flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-1 text-purple-400 mb-1">
              <Zap className="h-4 w-4 fill-purple-400" />
            </div>
            <span className="text-lg font-bold font-mono text-white">
              {buildingHeight} fl
            </span>
            <span className="text-[10px] text-ink-muted uppercase tracking-wider">Height</span>
          </div>
        </div>

        {/* AI Skyscraper Architecture Audit */}
        <div className="rounded-xl border border-accent/30 bg-accent/5 p-4 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-accent-bright font-semibold text-xs uppercase tracking-wider">
              <Sparkles className="h-4 w-4" />
              AI Skyscraper Audit
            </div>
            <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <CheckCircle2 className="h-3 w-3" /> {qualityScore}/100 Quality
            </span>
          </div>
          <p className="text-xs text-ink/90 leading-relaxed">
            This repository forms a <span className="text-accent-light font-medium">{buildingHeight}-story high-density spire</span> in the <span className="text-accent-bright capitalize">{repo.district}</span> district. Code integrity rating is optimal with low churn density.
          </p>
        </div>

        {/* Commit Velocity Chart */}
        <div className="rounded-xl border border-glass-border bg-base-200/50 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-ink-muted uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5 text-accent-bright" />
              Commit Velocity
            </span>
            <span className="text-[10px] text-accent-bright font-mono">
              {(repo.recentCommits || []).length} Commits
            </span>
          </div>

          <div className="h-36 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={commitData}>
                <defs>
                  <linearGradient id="colorAdd" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#4B5468" fontSize={10} tickLine={false} />
                <YAxis stroke="#4B5468" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0D1220', borderColor: 'rgba(96,165,250,0.3)', borderRadius: '8px', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="additions" stroke="#38bdf8" fillOpacity={1} fill="url(#colorAdd)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Commits Log */}
        <div className="rounded-xl border border-glass-border bg-base-200/50 p-4 space-y-3">
          <span className="text-xs font-mono text-ink-muted uppercase tracking-wider block">
            Skyline Activity Feed
          </span>
          <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
            {(repo.recentCommits || []).map((commit, i) => (
              <div key={commit.id || i} className="flex flex-col gap-1 rounded-lg bg-base-100/70 p-2.5 border border-glass-border/50 text-xs">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-mono font-bold text-accent-light">
                    #{commit.sha?.substring(0, 7) || 'latest'}
                  </span>
                  <span className="text-emerald-400 font-mono">
                    +{commit.additions || 12} -{commit.deletions || 2}
                  </span>
                </div>
                <p className="text-ink text-xs line-clamp-1">
                  {commit.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-4 border-t border-glass-border flex items-center gap-3">
        <button
          onClick={() => {
            soundFX.playWarp();
            if (onSimulateCommit) onSimulateCommit(repo);
          }}
          className="flex-1 btn-secondary py-2 text-xs"
        >
          <Flame className="h-4 w-4 text-amber-400" />
          Pulse Light
        </button>

        <a
          href={`https://github.com/${repo.fullName}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => soundFX.playSelect()}
          className="flex-1 btn-primary py-2 text-xs"
        >
          <ExternalLink className="h-4 w-4" />
          GitHub Repo
        </a>
      </div>
    </div>
  );
}
