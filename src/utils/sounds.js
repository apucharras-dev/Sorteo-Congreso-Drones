const SOUND_FILES = {
  start: '/sounds/sorteo-inicio.mp3',
  tick: '/sounds/nombre-pasando.mp3',
  reveal: '/sounds/seleccion-final.mp3',
  confirm: '/sounds/ganador-confirmado.mp3',
};

class SoundManager {
  constructor() {
    this.enabled = true;
    this.cache = {};
  }

  setEnabled(enabled) {
    this.enabled = enabled;
  }

  _getAudio(key) {
    if (!this.cache[key]) {
      const audio = new Audio(SOUND_FILES[key]);
      audio.preload = 'auto';
      this.cache[key] = audio;
    }
    return this.cache[key];
  }

  play(key) {
    if (!this.enabled) return;
    try {
      const audio = this._getAudio(key);
      audio.currentTime = 0;
      audio.play().catch(() => {});
    } catch {
      // Silently fail if sound files don't exist
    }
  }
}

export const soundManager = new SoundManager();
