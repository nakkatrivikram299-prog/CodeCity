/**
 * Web Audio API synthesizer for cyberpunk UI sound effects.
 * Requires zero external audio files.
 */
class SoundManager {
  constructor() {
    this.audioCtx = null;
    this.enabled = true;
  }

  init() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  toggleSound() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  playHover() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.audioCtx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.02, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.05);
    } catch {
      // Audio context might be restricted before user gesture
    }
  }

  playSelect() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.audioCtx) return;

      const osc1 = this.audioCtx.createOscillator();
      const osc2 = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc1.type = 'square';
      osc2.type = 'sawtooth';

      osc1.frequency.setValueAtTime(523.25, this.audioCtx.currentTime); // C5
      osc1.frequency.exponentialRampToValueAtTime(1046.5, this.audioCtx.currentTime + 0.12); // C6

      osc2.frequency.setValueAtTime(659.25, this.audioCtx.currentTime); // E5
      osc2.frequency.exponentialRampToValueAtTime(1318.5, this.audioCtx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.04, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.15);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(this.audioCtx.currentTime + 0.15);
      osc2.stop(this.audioCtx.currentTime + 0.15);
    } catch {
      // Ignore
    }
  }

  playWarp() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, this.audioCtx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.05, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.3);
    } catch {
      // Ignore
    }
  }
}

export const soundFX = new SoundManager();
