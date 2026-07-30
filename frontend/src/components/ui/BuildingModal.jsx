import { useState } from 'react';
import { 
  X, 
  Trophy, 
  Github, 
  ExternalLink, 
  Users, 
  Star, 
  Flame, 
  FileText, 
  Video, 
  MessageSquare, 
  Award, 
  CheckCircle2, 
  Send,
  Sparkles,
  Heart,
  Code2
} from 'lucide-react';
import { soundFX } from '../../utils/SoundFX.js';

export default function BuildingModal({ building, onClose }) {
  if (!building) return null;

  const [activeTab, setActiveTab] = useState('overview');
  const [upvotes, setUpvotes] = useState(building.votes || 100);
  const [hasVoted, setHasVoted] = useState(false);

  const [comments, setComments] = useState(building.comments || []);
  const [newCommentText, setNewCommentText] = useState('');

  const handleUpvote = () => {
    soundFX.playWarp();
    if (!hasVoted) {
      setUpvotes((prev) => prev + 1);
      setHasVoted(true);
    } else {
      setUpvotes((prev) => prev - 1);
      setHasVoted(false);
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (newCommentText.trim()) {
      soundFX.playSelect();
      setComments((prev) => [
        { user: 'Neo Architect (You)', text: newCommentText.trim(), time: 'Just now' },
        ...prev,
      ]);
      setNewCommentText('');
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col border-l border-glass-border bg-base-100/95 p-6 backdrop-blur-2xl shadow-2xl transition-all animate-in slide-in-from-right duration-300">
      {/* Top Accent Line */}
      <div className="led-strip" />

      {/* Header */}
      <div className="flex items-start justify-between pb-4 border-b border-glass-border">
        <div className="flex items-start gap-3">
          <img
            src={building.teamLogo}
            alt={building.teamName}
            className="h-12 w-12 rounded-2xl bg-base-200 border-2 border-accent/40 object-cover shadow-glow-sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-mono uppercase font-bold text-accent-bright border-accent/40 bg-accent/10">
                {building.domainLabel} Domain
              </span>
              <span className="rounded-full bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 text-[10px] font-mono text-amber-300 font-bold">
                {building.award}
              </span>
            </div>
            <h2 className="text-xl font-extrabold font-display text-white mt-1">
              {building.name}
            </h2>
            <div className="flex items-center gap-2 text-xs text-ink-muted font-mono mt-0.5">
              <span className="text-white font-semibold">{building.teamName}</span>
              <span>•</span>
              <span className="text-accent-bright">{building.college}</span>
            </div>
          </div>
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

      {/* Tab Navigation */}
      <div className="flex items-center gap-1 border-b border-glass-border pt-3 pb-2 text-xs font-mono">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'team', label: 'Team & Stack' },
          { id: 'demo', label: 'Demo & Pitch' },
          { id: 'scores', label: 'Scores & Votes' },
          { id: 'comments', label: `Comments (${comments.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              soundFX.playSelect();
              setActiveTab(tab.id);
            }}
            className={`rounded-lg px-3 py-1.5 transition-all ${
              activeTab === tab.id
                ? 'bg-accent/25 text-accent-bright font-bold border border-accent/40 shadow-glow-sm'
                : 'text-ink-muted hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Body */}
      <div className="flex-1 overflow-y-auto py-5 space-y-5">
        
        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-mono text-ink-muted uppercase tracking-wider mb-2">Project Summary</h4>
              <p className="text-xs text-ink/90 leading-relaxed rounded-xl border border-glass-border bg-base-200/50 p-4">
                {building.description}
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-glass-border bg-base-200/60 p-3 text-center">
                <span className="text-xs font-mono text-ink-muted block uppercase">Community Votes</span>
                <span className="text-lg font-bold font-mono text-amber-400 mt-0.5 block">★ {upvotes}</span>
              </div>
              <div className="rounded-xl border border-glass-border bg-base-200/60 p-3 text-center">
                <span className="text-xs font-mono text-ink-muted block uppercase">GitHub Stars</span>
                <span className="text-lg font-bold font-mono text-accent-bright mt-0.5 block">⚡ {building.stars}</span>
              </div>
              <div className="rounded-xl border border-glass-border bg-base-200/60 p-3 text-center">
                <span className="text-xs font-mono text-ink-muted block uppercase">Judge Score</span>
                <span className="text-lg font-bold font-mono text-emerald-400 mt-0.5 block">97.5 / 100</span>
              </div>
            </div>

            {/* Hackathon Event Info */}
            <div className="rounded-xl border border-accent/30 bg-accent/10 p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-accent-bright uppercase font-bold block">Hackathon Track</span>
                <span className="text-sm font-bold text-white font-display">{building.hackathonBadge}</span>
              </div>
              <span className="rounded-full bg-accent/20 px-3 py-1 text-xs font-mono font-bold text-accent-light border border-accent/40">
                Verified Entry
              </span>
            </div>
          </div>
        )}

        {/* Tab 2: Team Members & Technology Stack */}
        {activeTab === 'team' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-mono text-ink-muted uppercase tracking-wider mb-2">Team Roster</h4>
              <div className="space-y-2">
                {building.teamMembers.map((m, i) => (
                  <div key={i} className="flex items-center justify-between rounded-xl border border-glass-border bg-base-200/60 p-3">
                    <div className="flex items-center gap-3">
                      <img src={m.avatar} alt={m.name} className="h-9 w-9 rounded-full bg-base-100 border border-accent/30 object-cover" />
                      <div>
                        <span className="text-xs font-bold text-white block">{m.name}</span>
                        <span className="text-[10px] text-ink-muted font-mono">{building.college}</span>
                      </div>
                    </div>
                    <span className="rounded-full bg-white/5 border border-glass-border px-2.5 py-0.5 text-[10px] font-mono text-accent-bright font-semibold">
                      {m.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-mono text-ink-muted uppercase tracking-wider mb-2">Technology Stack</h4>
              <div className="flex flex-wrap gap-2">
                {building.techStack.map((tech, i) => (
                  <span key={i} className="rounded-xl border border-glass-border bg-base-200/80 px-3 py-1 text-xs font-mono text-ink font-semibold">
                    ⚡ {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Live Demo & Presentation Slides */}
        {activeTab === 'demo' && (
          <div className="space-y-4">
            <div className="rounded-xl border border-glass-border bg-base-200/60 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-ink-muted uppercase tracking-wider flex items-center gap-1.5">
                  <Video className="h-4 w-4 text-accent-bright" /> Pitch & Demo Video
                </span>
                <a href={building.videoUrl} target="_blank" rel="noreferrer" className="text-xs font-mono text-accent-bright flex items-center gap-1">
                  Watch Full HD <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <div className="h-40 w-full rounded-lg bg-base-300 flex items-center justify-center border border-glass-border text-xs text-ink-muted font-mono">
                🎬 [ Interactive Video Player Embed ]
              </div>
            </div>

            <div className="rounded-xl border border-glass-border bg-base-200/60 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-ink-muted uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-purple-400" /> Presentation Deck
                </span>
                <a href={building.pptUrl} target="_blank" rel="noreferrer" className="text-xs font-mono text-purple-300 flex items-center gap-1">
                  Open Slides <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <div className="h-36 w-full rounded-lg bg-base-300 flex items-center justify-center border border-glass-border text-xs text-ink-muted font-mono">
                📊 [ PPT Slide Deck Viewer ]
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Judges' Scores & Community Upvotes */}
        {activeTab === 'scores' && (
          <div className="space-y-4">
            <h4 className="text-xs font-mono text-ink-muted uppercase tracking-wider">Judges' Evaluation Breakdown</h4>
            <div className="space-y-3">
              {Object.entries(building.judgesScores).map(([criteria, score]) => (
                <div key={criteria} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="capitalize text-ink-muted">{criteria}</span>
                    <span className="text-emerald-400 font-bold">{score} / 100</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-base-200 overflow-hidden border border-glass-border">
                    <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Comments & Discussions */}
        {activeTab === 'comments' && (
          <div className="space-y-4">
            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                placeholder="Write a comment or feedback..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                className="input-field text-xs flex-1"
              />
              <button type="submit" className="btn-primary text-xs px-3">
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {comments.map((c, i) => (
                <div key={i} className="rounded-xl border border-glass-border bg-base-200/50 p-3 space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-accent-bright">{c.user}</span>
                    <span className="text-[10px] text-ink-muted">{c.time}</span>
                  </div>
                  <p className="text-xs text-ink leading-relaxed">{c.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Footer Action Buttons */}
      <div className="pt-4 border-t border-glass-border flex items-center gap-3">
        <button
          onClick={handleUpvote}
          className={`flex-1 flex items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-bold font-mono transition-all ${
            hasVoted
              ? 'border-rose-500 bg-rose-500/20 text-rose-300 shadow-glow-sm'
              : 'border-glass-border bg-base-200/60 text-white hover:border-rose-500/50 hover:text-rose-400'
          }`}
        >
          <Heart className={`h-4 w-4 ${hasVoted ? 'fill-rose-400 text-rose-400' : ''}`} />
          {hasVoted ? 'Upvoted!' : 'Upvote Project'} ({upvotes})
        </button>

        <a
          href={building.githubUrl}
          target="_blank"
          rel="noreferrer"
          onClick={() => soundFX.playSelect()}
          className="btn-secondary py-2.5 px-4 text-xs"
        >
          <Github className="h-4 w-4" />
          GitHub
        </a>

        <a
          href={building.liveDemoUrl}
          target="_blank"
          rel="noreferrer"
          onClick={() => soundFX.playSelect()}
          className="btn-primary py-2.5 px-4 text-xs"
        >
          <ExternalLink className="h-4 w-4" />
          Live Demo
        </a>
      </div>
    </div>
  );
}
