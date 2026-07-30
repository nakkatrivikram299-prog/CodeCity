import { useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import { soundFX } from '../utils/SoundFX.js';
import { 
  Settings as SettingsIcon, 
  Monitor, 
  Volume2, 
  Key, 
  Palette, 
  Check,
  Save
} from 'lucide-react';

export default function Settings() {
  const [graphicsQuality, setGraphicsQuality] = useState('high');
  const [themePreset, setThemePreset] = useState('cyberpunk');
  const [githubToken, setGithubToken] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    soundFX.playSelect();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="min-h-screen bg-base text-ink flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        <div className="flex items-center justify-between pb-6 border-b border-glass-border">
          <div>
            <h1 className="text-3xl font-extrabold font-display text-white">
              System Settings
            </h1>
            <p className="text-sm text-ink-muted mt-1">
              Configure WebGL 3D rendering pipeline, sound parameters, and GitHub tokens.
            </p>
          </div>

          <button
            onClick={handleSave}
            className="btn-primary"
          >
            {saved ? <Check className="h-4 w-4 text-state-success" /> : <Save className="h-4 w-4" />}
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>

        <div className="space-y-6">
          
          {/* Graphics Quality */}
          <div className="glass-panel p-6 space-y-4">
            <h3 className="text-base font-bold font-display text-white flex items-center gap-2">
              <Monitor className="h-4 w-4 text-accent-bright" />
              WebGL 3D Rendering Performance
            </h3>

            <div className="grid grid-cols-3 gap-3">
              {['high', 'medium', 'low'].map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    soundFX.playSelect();
                    setGraphicsQuality(q);
                  }}
                  className={`rounded-xl border p-4 text-center capitalize transition-all ${
                    graphicsQuality === q
                      ? 'border-accent-bright bg-accent/20 text-white font-bold shadow-glow-sm'
                      : 'border-glass-border bg-base-100/50 text-ink-muted hover:border-accent/40'
                  }`}
                >
                  <span className="block text-sm font-mono">{q} Bloom</span>
                  <span className="text-[10px] text-ink-muted">
                    {q === 'high' ? 'Post-processing bloom & shadows' : q === 'medium' ? 'Standard lighting' : 'Fast FPS mode'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Theme Preset */}
          <div className="glass-panel p-6 space-y-4">
            <h3 className="text-base font-bold font-display text-white flex items-center gap-2">
              <Palette className="h-4 w-4 text-purple-400" />
              Cyber Theme Preset
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { id: 'cyberpunk', name: 'Cyber Blue', color: 'from-blue-600 to-cyan-400' },
                { id: 'matrix', name: 'Matrix Green', color: 'from-emerald-600 to-teal-400' },
                { id: 'vaporwave', name: 'Vapor Sunset', color: 'from-purple-600 to-pink-400' },
                { id: 'dark', name: 'Vacuum Black', color: 'from-slate-800 to-slate-900' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    soundFX.playSelect();
                    setThemePreset(t.id);
                  }}
                  className={`rounded-xl border p-3 flex flex-col items-center gap-2 transition-all ${
                    themePreset === t.id
                      ? 'border-accent-bright bg-base-200 text-white font-bold shadow-glow-sm'
                      : 'border-glass-border bg-base-100/50 text-ink-muted hover:border-accent/40'
                  }`}
                >
                  <div className={`h-8 w-full rounded-lg bg-gradient-to-r ${t.color}`} />
                  <span className="text-xs font-mono">{t.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* GitHub Token input */}
          <div className="glass-panel p-6 space-y-4">
            <h3 className="text-base font-bold font-display text-white flex items-center gap-2">
              <Key className="h-4 w-4 text-amber-400" />
              GitHub Personal Access Token (Optional)
            </h3>
            <p className="text-xs text-ink-muted">
              Higher rate-limits for fetching private or organization repositories directly into your 3D city skyline.
            </p>

            <input
              type="password"
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxx"
              value={githubToken}
              onChange={(e) => setGithubToken(e.target.value)}
              className="input-field font-mono text-xs"
            />
          </div>

        </div>

      </main>
    </div>
  );
}
