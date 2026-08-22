import bgmOpening from '../assets/bgm/开头.mp3';
import bgmGame from '../assets/bgm/正式游戏bgm.mp3';
import bgmWin from '../assets/bgm/获胜bgm.mp3';
import bgmDefeat from '../assets/bgm/战败cg.mp3';
import sfxSurprise from '../assets/sfx/惊喜.mp3';
import sfxShock from '../assets/sfx/震惊.mp3';

type SfxName =
  | 'click'
  | 'spend'
  | 'clue'
  | 'warning'
  | 'judgment'
  | 'correct'
  | 'wrong'
  | 'reveal';

export type BgmName = 'opening' | 'game' | 'win' | 'defeat';

let ctx: AudioContext | null = null;
let muted = localStorage.getItem('lhe-muted') === '1';

function ensureCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

function tone(freq: number, dur: number, type: OscillatorType = 'sine', gain = 0.1, delay = 0, slideTo?: number) {
  const ac = ensureCtx();
  if (!ac || muted) return;
  const t0 = ac.currentTime + delay;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

const recipes: Record<SfxName, () => void> = {
  click: () => {
    tone(720, 0.05, 'triangle', 0.06);
    tone(960, 0.04, 'triangle', 0.04, 0.03);
  },
  spend: () => {
    tone(880, 0.09, 'square', 0.05);
    tone(520, 0.12, 'square', 0.05, 0.07);
    tone(300, 0.16, 'sine', 0.07, 0.15);
  },
  clue: () => {
    tone(523, 0.1, 'sine', 0.08);
    tone(659, 0.1, 'sine', 0.08, 0.08);
    tone(784, 0.16, 'sine', 0.09, 0.16);
  },
  warning: () => {
    tone(140, 0.3, 'sawtooth', 0.07);
    tone(140, 0.3, 'sawtooth', 0.07, 0.4);
  },
  judgment: () => {
    tone(98, 0.7, 'sine', 0.12);
    tone(147, 0.7, 'sine', 0.07, 0.1);
    tone(196, 0.5, 'triangle', 0.05, 0.2);
  },
  correct: () => {
    tone(523, 0.12, 'triangle', 0.09);
    tone(659, 0.12, 'triangle', 0.09, 0.1);
    tone(784, 0.12, 'triangle', 0.09, 0.2);
    tone(1047, 0.3, 'triangle', 0.1, 0.3);
  },
  wrong: () => {
    tone(360, 0.2, 'sawtooth', 0.07);
    tone(240, 0.35, 'sawtooth', 0.08, 0.16, 180);
  },
  reveal: () => {
    tone(60, 1.1, 'sawtooth', 0.14, 0, 240);
    tone(523, 0.2, 'sine', 0.08, 0.5);
    tone(784, 0.2, 'sine', 0.08, 0.68);
    tone(1047, 0.5, 'sine', 0.1, 0.86);
  },
};

const clipRegistry: Record<'surprise' | 'shock', string> = {
  surprise: sfxSurprise,
  shock: sfxShock,
};

function playClip(name: 'surprise' | 'shock') {
  if (muted) return;
  const a = new Audio(clipRegistry[name]);
  a.loop = false;
  a.volume = 1;
  void a.play().catch((err) => {
    console.warn('[sfx clip] playback failed:', err);
  });
}

export const sfx = {
  clip: playClip,
  play(name: SfxName) {
    try {
      recipes[name]();
    } catch {
      /* ignore */
    }
  },
  get muted() {
    return muted;
  },
  setMuted(v: boolean) {
    muted = v;
    localStorage.setItem('lhe-muted', v ? '1' : '0');
    bgm.syncMuted();
  },
};

const bgmSources: Record<BgmName, string> = {
  opening: bgmOpening,
  game: bgmGame,
  win: bgmWin,
  defeat: bgmDefeat,
};

let bgmEl: HTMLAudioElement | null = null;
let bgmTrack: BgmName | null = null;
let bgmPending = false;
let unlockBound = false;

function bindUnlock() {
  if (unlockBound) return;
  unlockBound = true;
  const retry = () => {
    if (!bgmPending || !bgmEl) return;
    void bgmEl
      .play()
      .then(() => {
        bgmPending = false;
      })
      .catch(() => {
        /* wait for next gesture */
      });
  };
  window.addEventListener('pointerdown', retry);
  window.addEventListener('keydown', retry);
}

export const bgm = {
  play(name: BgmName) {
    try {
      if (!bgmEl) {
        bgmEl = new Audio();
        bgmEl.loop = true;
        bgmEl.volume = 0.45;
        bgmEl.muted = muted;
      }
      if (bgmTrack !== name) {
        bgmTrack = name;
        bgmEl.src = bgmSources[name];
        bgmEl.currentTime = 0;
      }
      if (muted || !bgmEl.paused) return;
      void bgmEl
        .play()
        .then(() => {
          bgmPending = false;
        })
        .catch(() => {
          bgmPending = true;
          bindUnlock();
        });
    } catch {
      /* ignore */
    }
  },
  syncMuted() {
    if (!bgmEl) return;
    bgmEl.muted = muted;
    if (muted) return;
    if (bgmTrack && bgmEl.paused) {
      void bgmEl.play().catch(() => {
        bgmPending = true;
        bindUnlock();
      });
    }
  },
};
