// Der Abstieg – Töne aus Code (Web Audio): Schläge, Treffer, Münzen, Türen, Stufenaufstieg.
// Keine Tondateien; alles wird beim Abspielen erzeugt. Lautstärke bewusst leise.
'use strict';
window.A = window.A || {};

A.Sound = (function () {
  let ac = null, master = null, noiseBuf = null, coinCombo = 0, coinT = 0, lastHit = 0;
  const on = () => !A.Game || A.Game.meta.sound;
  function ctx() {
    if (ac) { if (ac.state === 'suspended') ac.resume(); return ac; }
    try {
      ac = new (window.AudioContext || window.webkitAudioContext)();
      master = ac.createGain(); master.gain.value = 0.55;
      const comp = ac.createDynamicsCompressor(); comp.threshold.value = -18; comp.ratio.value = 4;
      master.connect(comp); comp.connect(ac.destination);
      noiseBuf = ac.createBuffer(1, ac.sampleRate, ac.sampleRate);
      const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    } catch (e) { ac = null; }
    return ac;
  }
  // Ton: Frequenz von f0 nach f1 in dur Sekunden
  function tone(f0, f1, dur, type, vol, delay) {
    const a = ctx(); if (!a) return; const t = a.currentTime + (delay || 0);
    const o = a.createOscillator(), g = a.createGain();
    o.type = type || 'square'; o.frequency.setValueAtTime(f0, t); if (f1 && f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol || 0.1, t + 0.008); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + dur + 0.02);
  }
  // Rauschen mit Filter (Zischen, Schlag, Wusch)
  function noise(dur, vol, type, f0, f1, delay, q) {
    const a = ctx(); if (!a) return; const t = a.currentTime + (delay || 0);
    const s = a.createBufferSource(); s.buffer = noiseBuf; s.playbackRate.value = 0.8 + Math.random() * 0.4;
    const fl = a.createBiquadFilter(); fl.type = type || 'lowpass'; fl.frequency.setValueAtTime(f0 || 1200, t); if (f1) fl.frequency.exponentialRampToValueAtTime(f1, t + dur); fl.Q.value = q || 1;
    const g = a.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol || 0.2, t + 0.005); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(fl); fl.connect(g); g.connect(master); s.start(t, Math.random() * 0.5); s.stop(t + dur + 0.02);
  }
  const r = (a, b) => a + Math.random() * (b - a);
  const S = {
    init() { ctx(); },
    click() { if (!on()) return; tone(900, 700, 0.05, 'triangle', 0.06); },
    swing() { if (!on()) return; noise(0.13, 0.12, 'bandpass', r(900, 1300), 3500, 0, 1.5); },
    shoot() { if (!on()) return; noise(0.08, 0.1, 'highpass', 2500, 5000); tone(r(500, 560), 300, 0.06, 'triangle', 0.04); },
    cast() { if (!on()) return; tone(r(380, 420), 1100, 0.18, 'sine', 0.07); tone(r(760, 840), 2000, 0.14, 'triangle', 0.025, 0.02); },
    hit(crit) {
      if (!on()) return; const now = performance.now(); if (now - lastHit < 35) return; lastHit = now;
      noise(0.07, 0.22, 'lowpass', 2400, 500); tone(r(160, 200), 60, 0.1, 'sine', 0.22);
      if (crit) { tone(1500, 1300, 0.12, 'square', 0.04); tone(2250, 2000, 0.1, 'triangle', 0.04, 0.02); }
    },
    hurt() { if (!on()) return; tone(220, 80, 0.18, 'sawtooth', 0.09); noise(0.12, 0.18, 'lowpass', 1200, 300); },
    miss() { if (!on()) return; noise(0.1, 0.06, 'highpass', 3000, 6000); },
    die(big) { if (!on()) return; tone(big ? 200 : r(300, 360), big ? 40 : 90, big ? 0.6 : 0.22, 'square', big ? 0.1 : 0.06); noise(big ? 0.7 : 0.2, big ? 0.3 : 0.15, 'lowpass', big ? 900 : 1600, 200); },
    coin() {
      if (!on()) return; const now = performance.now(); coinCombo = now - coinT < 450 ? Math.min(coinCombo + 1, 10) : 0; coinT = now;
      const f = 1100 * Math.pow(1.06, coinCombo); tone(f, f, 0.06, 'square', 0.035); tone(f * 1.5, f * 1.5, 0.12, 'square', 0.03, 0.05);
    },
    loot(rarity) { if (!on()) return; const n = { common: 2, good: 3, rare: 3, epic: 4, legendary: 5, cursed: 3 }[rarity] || 2; const base = rarity === 'cursed' ? 300 : 523; for (let i = 0; i < n; i++) tone(base * Math.pow(rarity === 'cursed' ? 0.84 : 1.26, i), 0, 0.16, 'triangle', 0.06, i * 0.07); },
    drop(rarity) { if (!on()) return; if (rarity === 'epic' || rarity === 'legendary') { tone(1568, 0, 0.5, 'sine', 0.05); tone(2093, 0, 0.6, 'sine', 0.04, 0.08); } else tone(880, 0, 0.12, 'triangle', 0.04); },
    potion() { if (!on()) return; for (let i = 0; i < 4; i++) tone(r(300, 500), r(700, 900), 0.07, 'sine', 0.05, i * 0.06); },
    heal() { if (!on()) return; tone(523, 0, 0.2, 'sine', 0.05); tone(659, 0, 0.2, 'sine', 0.05, 0.08); tone(784, 0, 0.3, 'sine', 0.05, 0.16); },
    shield() { if (!on()) return; tone(300, 600, 0.25, 'triangle', 0.06); noise(0.25, 0.05, 'bandpass', 2000, 4000, 0, 4); },
    buff() { if (!on()) return; tone(220, 440, 0.3, 'sawtooth', 0.05); tone(330, 660, 0.3, 'square', 0.03, 0.03); },
    nova() { if (!on()) return; noise(0.4, 0.2, 'lowpass', 4000, 200); tone(120, 50, 0.35, 'sine', 0.2); },
    lock() { if (!on()) return; tone(110, 70, 0.3, 'square', 0.08); noise(0.3, 0.25, 'lowpass', 900, 150); tone(440, 420, 0.25, 'square', 0.03, 0.05); },
    open() { if (!on()) return; tone(196, 392, 0.25, 'square', 0.04); noise(0.25, 0.08, 'bandpass', 600, 2500, 0, 2); },
    cleared() { if (!on()) return; [523, 659, 784, 1047].forEach((f, i) => tone(f, 0, 0.18, 'square', 0.04, i * 0.08)); },
    level() { if (!on()) return; [392, 523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, 0, 0.25, 'triangle', 0.06, i * 0.06)); tone(1568, 0, 0.6, 'sine', 0.04, 0.4); },
    ignite() { if (!on()) return; noise(0.35, 0.08, 'bandpass', 400, 1800, 0, 1); },
    spawn() { if (!on()) return; tone(r(150, 180), r(300, 340), 0.3, 'sine', 0.05); noise(0.3, 0.06, 'bandpass', 300, 1200, 0, 3); },
    windup() { if (!on()) return; tone(r(250, 290), r(400, 440), 0.12, 'sawtooth', 0.025); },
    step() { if (!on()) return; noise(0.04, 0.025, 'lowpass', r(500, 800), 200); },
    descend() { if (!on()) return; tone(400, 60, 0.9, 'sine', 0.1); noise(0.9, 0.12, 'lowpass', 1500, 100); },
    lose() { if (!on()) return; [392, 330, 262, 196].forEach((f, i) => tone(f, f * 0.98, 0.3, 'triangle', 0.07, i * 0.18)); tone(98, 49, 1.2, 'sawtooth', 0.06, 0.6); },
    buy() { if (!on()) return; tone(988, 0, 0.06, 'square', 0.04); tone(1319, 0, 0.12, 'square', 0.04, 0.06); },
    win() { this.cleared(); },
  };
  window.addEventListener('pointerdown', () => S.init(), { once: true });
  window.addEventListener('keydown', () => S.init(), { once: true });
  return S;
})();
