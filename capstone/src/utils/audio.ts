/**
 * Tactile, satisfying Web Audio sound synthesizer
 * Features crisp mechanical clicks, resonant radar pings, and rewarding chimes.
 * Robustly handles browser autoplay policy by unlocking AudioContext on user gestures
 * and ensuring AudioContext is running before scheduling audio nodes.
 */

class SoundFX {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;
  private lastClickTime: number = 0;

  constructor() {
    if (typeof window !== 'undefined') {
      const unlock = () => {
        this.unlockAudio();
      };
      // Attach eager unlock on multiple gesture events
      ['pointerdown', 'mousedown', 'touchstart', 'keydown', 'click'].forEach((evt) => {
        window.addEventListener(evt, unlock, { capture: true, passive: true });
      });
    }
  }

  public unlockAudio(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    try {
      if (!this.ctx) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    } catch {
      // Audio fallback
    }
    return this.ctx;
  }

  /**
   * Helper that guarantees AudioContext is running before executing synthesis.
   * Solves the browser issue where sounds scheduled while suspended get dropped.
   */
  private playWithContext(fn: (ctx: AudioContext, now: number) => void) {
    if (!this.enabled) return;
    try {
      const ctx = this.unlockAudio();
      if (!ctx) return;

      const execute = () => {
        try {
          // Add a tiny lookahead offset (5ms) so audio hardware buffers smoothly
          const now = Math.max(ctx.currentTime, 0) + 0.005;
          fn(ctx, now);
        } catch (err) {
          console.warn('Audio playback error:', err);
        }
      };

      if (ctx.state === 'suspended') {
        ctx.resume().then(execute).catch(() => {});
      } else {
        execute();
      }
    } catch (err) {
      console.warn('Web Audio error:', err);
    }
  }

  /**
   * Crisp, tactile mechanical click sound for buttons and switches
   * Debounced to avoid double-firing from captured and bubbling events.
   */
  playClick() {
    const wallNow = Date.now();
    if (wallNow - this.lastClickTime < 35) return;
    this.lastClickTime = wallNow;

    this.playWithContext((ctx, now) => {
      // 1. High transient snap (mechanical switch click)
      const snapOsc = ctx.createOscillator();
      const snapGain = ctx.createGain();
      snapOsc.type = 'sine';
      snapOsc.frequency.setValueAtTime(1800, now);
      snapOsc.frequency.exponentialRampToValueAtTime(320, now + 0.05);

      snapGain.gain.setValueAtTime(0.35, now);
      snapGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

      snapOsc.connect(snapGain);
      snapGain.connect(ctx.destination);
      snapOsc.start(now);
      snapOsc.stop(now + 0.065);

      // 2. Low tactile body thud (weighty switch bottoming-out)
      const thudOsc = ctx.createOscillator();
      const thudGain = ctx.createGain();
      thudOsc.type = 'triangle';
      thudOsc.frequency.setValueAtTime(220, now);
      thudOsc.frequency.exponentialRampToValueAtTime(80, now + 0.07);

      thudGain.gain.setValueAtTime(0.28, now);
      thudGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

      thudOsc.connect(thudGain);
      thudGain.connect(ctx.destination);
      thudOsc.start(now);
      thudOsc.stop(now + 0.085);
    });
  }

  /**
   * Resonant radar ping for countermeasures and targets
   */
  playPing() {
    this.playWithContext((ctx, now) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, now); // E5
      osc.frequency.exponentialRampToValueAtTime(987.77, now + 0.12); // B5

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.23);
    });
  }

  /**
   * High-tech countermeasure deployment frequency sweep
   */
  playCountermeasure() {
    this.playWithContext((ctx, now) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.07);
      osc.frequency.exponentialRampToValueAtTime(1320, now + 0.16);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    });
  }

  /**
   * Rewarding harmonic chime for correct matches and drill completion
   */
  playMatchChime() {
    this.playWithContext((ctx, now) => {
      const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 (Bright C Major)
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const noteStart = now + idx * 0.07;
        const noteDuration = 0.32;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteStart);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.setValueAtTime(0.32, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + noteDuration);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(noteStart);
        osc.stop(noteStart + noteDuration);
      });
    });
  }

  /**
   * Gentle, warm success chime for login and signup confirmation
   * Calm harmonic major arpeggio with soft sine wave envelope
   */
  playSuccessChime() {
    this.playWithContext((ctx, now) => {
      const freqs = [392.0, 523.25, 659.25, 783.99]; // G4, C5, E5, G5 (warm C major)
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const noteStart = now + idx * 0.08;
        const noteDuration = 0.4;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteStart);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.setValueAtTime(0.0001, noteStart);
        gain.gain.linearRampToValueAtTime(0.24, noteStart + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + noteDuration);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(noteStart);
        osc.stop(noteStart + noteDuration);
      });
    });
  }

  /**
   * Soft, neutral notice tone for validation reminders or retry notices
   * Non-punitive, warm sine tone that is gentle and accessible
   */
  playSoftNoticeTone() {
    this.playWithContext((ctx, now) => {
      const freqs = [440.0, 392.0]; // A4 -> G4 (gentle descending step)
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const noteStart = now + idx * 0.12;
        const noteDuration = 0.28;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteStart);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.setValueAtTime(0.0001, noteStart);
        gain.gain.linearRampToValueAtTime(0.2, noteStart + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + noteDuration);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(noteStart);
        osc.stop(noteStart + noteDuration);
      });
    });
  }
}

export const soundFx = new SoundFX();
