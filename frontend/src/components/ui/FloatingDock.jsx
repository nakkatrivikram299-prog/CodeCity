import { 
  Building2, 
  Trophy, 
  Users, 
  Cpu, 
  Award, 
  ShoppingBag, 
  User,
  Compass
} from 'lucide-react';
import { soundFX } from '../../utils/SoundFX.js';

export default function FloatingDock({ onSelectBuildingById, onResetView }) {
  const dockItems = [
    { id: 'reset', label: 'City Core', icon: Compass, action: onResetView },
    { id: 'hackathon-center', label: 'MediVision AI', icon: Trophy, buildingId: 'proj-1' },
    { id: 'team-hub', label: 'NeuroPulse Core', icon: Users, buildingId: 'proj-2' },
    { id: 'ai-judge-center', label: 'AgriSense IoT', icon: Cpu, buildingId: 'proj-3' },
    { id: 'leaderboard-tower', label: 'VaultPay Chain', icon: Award, buildingId: 'proj-4' },
    { id: 'marketplace', label: 'Aegis Guardian', icon: ShoppingBag, buildingId: 'proj-5' },
    { id: 'profile-building', label: 'EduSphere 3D', icon: User, buildingId: 'proj-6' },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2">
      <div className="flex items-center gap-2 rounded-full border border-glass-border bg-base-100/85 p-2 backdrop-blur-2xl shadow-2xl transition-all">
        {dockItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => {
                soundFX.playWarp();
                if (item.action) {
                  item.action();
                } else if (item.buildingId) {
                  onSelectBuildingById(item.buildingId);
                }
              }}
              onMouseEnter={() => soundFX.playHover()}
              className="group relative flex h-11 w-11 items-center justify-center rounded-2xl border border-glass-border bg-white/5 transition-all duration-200 hover:-translate-y-1.5 hover:scale-110 hover:border-accent-bright hover:bg-accent/20 hover:shadow-glow-sm"
              title={item.label}
            >
              <Icon className="h-5 w-5 text-ink transition group-hover:text-accent-bright" />
              
              {/* Tooltip Label */}
              <span className="absolute -top-9 scale-0 rounded-lg border border-glass-border bg-base/90 px-2.5 py-1 text-[10px] font-mono text-white opacity-0 transition-all duration-200 group-hover:scale-100 group-hover:opacity-100 whitespace-nowrap shadow-md">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
