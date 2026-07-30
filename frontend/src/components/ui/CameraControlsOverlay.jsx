import { DOMAINS } from '../../data/projectsData.js';
import { RotateCcw } from 'lucide-react';
import { soundFX } from '../../utils/SoundFX.js';

export default function CameraControlsOverlay({ 
  onResetView, 
  activeDomain, 
  onDomainChange 
}) {
  return (
    <div className="absolute top-4 left-4 z-30 flex flex-wrap items-center gap-2 max-w-4xl">
      {/* City Status Badge */}
      <div className="flex items-center gap-2 rounded-full border border-glass-border bg-base-100/80 px-3.5 py-1.5 backdrop-blur-xl shadow-glass">
        <div className="relative flex h-2.5 w-2.5 items-center justify-center">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </div>
        <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
          Hackathon Innovation Metropolis
        </span>
      </div>

      {/* Domain Category Filter Buttons */}
      <div className="hidden sm:flex flex-wrap items-center gap-1 rounded-full border border-glass-border bg-base-100/80 p-1 backdrop-blur-xl shadow-glass">
        {DOMAINS.map((d) => (
          <button
            key={d.id}
            onClick={() => {
              soundFX.playSelect();
              onDomainChange(d.id);
            }}
            className={`rounded-full px-3 py-1 text-xs font-mono transition-all ${
              activeDomain === d.id
                ? 'bg-accent text-white font-bold shadow-glow-sm'
                : 'text-ink-muted hover:text-white hover:bg-white/5'
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Reset Camera Button */}
      <button
        onClick={() => {
          soundFX.playWarp();
          onResetView();
        }}
        className="flex items-center gap-1.5 rounded-full border border-glass-border bg-base-100/80 px-3 py-1.5 text-xs font-mono text-ink-muted backdrop-blur-xl hover:border-accent-bright hover:text-white transition"
        title="Reset Camera View"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        Reset View
      </button>
    </div>
  );
}
