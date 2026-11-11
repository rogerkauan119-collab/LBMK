// Sintetizador Web Audio API para efeitos sonoros 8-bits (SFX: ON/OFF)
class RetroSoundEngine {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  playTone(freq: number, durationMs: number, type: OscillatorType = 'square', volume = 0.04) {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationMs / 1000);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + durationMs / 1000);
    } catch {
      // Ignora caso o navegador bloqueie áudio antes de interação
    }
  }

  click(enabled: boolean) {
    if (!enabled) return;
    this.playTone(540, 55, 'square', 0.035);
  }

  hover(enabled: boolean) {
    if (!enabled) return;
    this.playTone(330, 30, 'triangle', 0.02);
  }

  success(enabled: boolean) {
    if (!enabled) return;
    this.playTone(523.25, 70, 'square', 0.04); // C5
    setTimeout(() => this.playTone(659.25, 80, 'square', 0.04), 75); // E5
    setTimeout(() => this.playTone(783.99, 130, 'square', 0.045), 155); // G5
  }

  levelUp(enabled: boolean) {
    if (!enabled) return;
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((n, idx) => {
      setTimeout(() => this.playTone(n, 90, 'square', 0.05), idx * 80);
    });
  }

  error(enabled: boolean) {
    if (!enabled) return;
    this.playTone(190, 120, 'sawtooth', 0.045);
    setTimeout(() => this.playTone(145, 180, 'sawtooth', 0.045), 110);
  }
}

export const soundFX = new RetroSoundEngine();
