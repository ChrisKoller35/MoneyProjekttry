// Zufall mit Startwert, damit Tests wiederholbar sind
'use strict';
window.A = window.A || {};
A.RNG = class {
  constructor(seed) { this.s = (seed >>> 0) || 1; }
  next() { let x = this.s; x ^= x << 13; x ^= x >>> 17; x ^= x << 5; this.s = x >>> 0; return this.s / 4294967296; }
  int(a, b) { return a + Math.floor(this.next() * (b - a + 1)); }
  pick(arr) { return arr[Math.floor(this.next() * arr.length)]; }
  chance(p) { return this.next() < p; }
  shuffle(arr) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(this.next() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  weighted(list, w) { const tot = list.reduce((s, x) => s + w(x), 0); let r = this.next() * tot; for (const x of list) { r -= w(x); if (r <= 0) return x; } return list[list.length - 1]; }
};
A.rng = new A.RNG(Date.now());
