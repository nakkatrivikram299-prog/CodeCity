import { soundFX } from '../../utils/SoundFX.js';
import { Compass } from 'lucide-react';

export default function MiniMap({ buildings, selectedBuilding, onSelectBuilding }) {
  // Map gridPos [-35..35] to SVG coordinates [10..150]
  const mapCoord = (val) => ((val + 35) / 70) * 140 + 10;

  return (
    <div className="fixed bottom-6 right-6 z-40 hidden sm:block">
      <div className="flex flex-col gap-1 rounded-2xl border border-glass-border bg-base-100/90 p-3 backdrop-blur-2xl shadow-2xl">
        <div className="flex items-center justify-between px-1 pb-1 text-[10px] font-mono text-ink-muted uppercase font-bold border-b border-glass-border/50">
          <span className="flex items-center gap-1">
            <Compass className="h-3 w-3 text-accent-bright" /> Smart Mini-Map
          </span>
          <span className="text-accent-bright">12 Nodes</span>
        </div>

        <svg className="h-36 w-36 bg-base-200/50 rounded-xl border border-glass-border">
          {/* Road grid lines */}
          <line x1="10" y1="80" x2="150" y2="80" stroke="rgba(96,165,250,0.2)" strokeWidth="4" />
          <line x1="10" y1="45" x2="150" y2="45" stroke="rgba(96,165,250,0.2)" strokeWidth="3" />
          <line x1="10" y1="115" x2="150" y2="115" stroke="rgba(96,165,250,0.2)" strokeWidth="3" />
          
          <line x1="80" y1="10" x2="80" y2="150" stroke="rgba(96,165,250,0.2)" strokeWidth="4" />
          <line x1="45" y1="10" x2="45" y2="150" stroke="rgba(96,165,250,0.2)" strokeWidth="3" />
          <line x1="115" y1="10" x2="115" y2="150" stroke="rgba(96,165,250,0.2)" strokeWidth="3" />

          {/* Central Roundabout */}
          <circle cx="80" cy="80" r="12" fill="none" stroke="#38BDF8" strokeWidth="1.5" />

          {/* Building Nodes */}
          {buildings.map((b) => {
            const cx = mapCoord(b.gridPos[0]);
            const cy = mapCoord(b.gridPos[1]);
            const isSelected = selectedBuilding?.id === b.id;

            return (
              <g
                key={b.id}
                className="cursor-pointer transition-transform hover:scale-125"
                onClick={() => {
                  soundFX.playSelect();
                  onSelectBuilding(b);
                }}
              >
                {isSelected && (
                  <circle cx={cx} cy={cy} r="8" fill="none" stroke="#38BDF8" strokeWidth="1.5" className="animate-ping" />
                )}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isSelected ? "5" : "3.5"}
                  fill={b.color}
                  stroke="#FFFFFF"
                  strokeWidth="0.5"
                />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
