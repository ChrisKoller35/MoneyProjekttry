// Der Abstieg – Kampfszene auf dem Canvas: Figuren aus einfachen Formen, Abspielen der Kampf-Ereignisse
'use strict';
window.A = window.A || {};

A.Arena = class {
  constructor(canvas) {
    this.cv = canvas; this.ctx = canvas.getContext('2d');
    this.ents = []; this.floats = []; this.flashes = {}; this.lunge = {}; this.t = 0; this.speed = 1;
    this.queue = []; this.playing = false; this.onDone = null; this.wait = 0; this.caption = '';
    this.shakeT = 0; this.floor = 1; this.bg = '#1a1420';
    this.resize();
    new ResizeObserver(() => this.resize()).observe(canvas);
    this.last = performance.now();
    const loop = (now) => { requestAnimationFrame(loop); const dt = Math.min(0.05, (now - this.last) / 1000); this.last = now; this.step(dt); this.draw(); };
    requestAnimationFrame(loop);
  }
  resize() {
    const r = this.cv.getBoundingClientRect(); const d = Math.min(2, window.devicePixelRatio || 1);
    this.W = r.width; this.H = r.height; this.cv.width = Math.round(r.width * d); this.cv.height = Math.round(r.height * d);
    this.ctx.setTransform(d, 0, 0, d, 0, 0);
    this.layout();
  }
  setup(ents, floor) {
    this.ents = ents.map(e => Object.assign({}, e, { sh: 0, fx: [], st: false, dead: false, alpha: 1 }));
    this.floor = floor; this.floats = []; this.flashes = {}; this.lunge = {}; this.caption = '';
    this.layout();
  }
  layout() {
    const W = this.W, H = this.H;
    const groups = { 'hero-front': [], 'hero-back': [], 'enemy-front': [], 'enemy-back': [] };
    for (const e of this.ents) { if (!e.dead) groups[e.side + '-' + e.row].push(e); }
    const xs = { 'hero-front': W * 0.34, 'hero-back': W * 0.17, 'enemy-front': W * 0.64, 'enemy-back': W * 0.82 };
    for (const k of Object.keys(groups)) {
      const g = groups[k]; const n = g.length;
      g.forEach((e, i) => { e.tx = xs[k]; e.ty = H * 0.62 - (n - 1) * 34 + i * 68; if (e.x == null) { e.x = e.tx; e.y = e.ty; } });
    }
  }
  play(events, onDone) {
    this.queue = events.slice(); this.playing = true; this.onDone = onDone; this.wait = 0;
  }
  step(dt) {
    this.t += dt;
    for (const e of this.ents) { e.x += ((e.tx || e.x) - e.x) * Math.min(1, dt * 8); e.y += ((e.ty || e.y) - e.y) * Math.min(1, dt * 8); if (e.dead) e.alpha = Math.max(0, e.alpha - dt * 2); }
    for (const f of this.floats) { f.y -= 30 * dt; f.life -= dt; }
    this.floats = this.floats.filter(f => f.life > 0);
    for (const k of Object.keys(this.flashes)) { this.flashes[k] -= dt; if (this.flashes[k] <= 0) delete this.flashes[k]; }
    for (const k of Object.keys(this.lunge)) { this.lunge[k] -= dt * 4; if (this.lunge[k] <= 0) delete this.lunge[k]; }
    this.shakeT = Math.max(0, this.shakeT - dt);
    if (!this.playing) return;
    this.wait -= dt * this.speed;
    while (this.wait <= 0 && this.queue.length) {
      const ev = this.queue.shift();
      this.wait += this.apply(ev);
    }
    if (!this.queue.length && this.wait <= 0) { this.playing = false; if (this.onDone) { const f = this.onDone; this.onDone = null; f(); } }
  }
  find(id) { return this.ents.find(e => e.id === id); }
  apply(ev) {
    const sync = () => { if (!ev.hp) return; for (const e of this.ents) { const s = ev.hp[e.id]; if (s) { e.hp = s.hp; e.sh = s.sh; e.fx = s.fx; e.st = s.st; } } };
    switch (ev.t) {
      case 'start': return 0.3;
      case 'round': this.caption = (A.LANG === 'de' ? 'Runde ' : 'Round ') + ev.n; return 0.25;
      case 'act': { const e = this.find(ev.who); if (e) { this.lunge[e.id] = 1; if (ev.skill) { const sk = A.SKILLS[ev.skill]; this.float(e.x, e.y - 48, A.t(sk.name), '#ffe08a', 15); } } return ev.skill ? 0.35 : 0.2; }
      case 'hit': { sync(); const to = this.find(ev.to); if (to) { this.flashes[to.id] = 0.25; const col = ev.kind === 'poison' ? '#9be37a' : ev.kind === 'burn' ? '#ff8a3d' : ev.kind === 'magic' ? '#7fd8ff' : ev.kind === 'thorns' ? '#c9c9c9' : ev.kind === 'curse' ? '#ff5f5f' : ev.crit ? '#ffb347' : '#ffffff'; this.float(to.x, to.y - 30, (ev.crit ? '✦' : '') + '−' + ev.dmg + (ev.absorbed ? ' (' + ev.absorbed + '🛡)' : ''), col, ev.crit ? 24 : 18); if (to.side === 'hero' && ev.dmg > 0) this.shakeT = 0.15; } return ev.kind === 'poison' || ev.kind === 'burn' || ev.kind === 'curse' ? 0.15 : 0.3; }
      case 'miss': { const to = this.find(ev.to); if (to) this.float(to.x, to.y - 30, A.LANG === 'de' ? 'daneben' : 'miss', '#bbb', 14); return 0.25; }
      case 'heal': { sync(); const e = this.find(ev.who); if (e) this.float(e.x, e.y - 30, '+' + ev.amt, '#6fdc7a', 18); return 0.25; }
      case 'shield': { sync(); const e = this.find(ev.who); if (e) this.float(e.x, e.y - 30, '🛡 ' + ev.amt, '#9fd8ff', 16); return 0.25; }
      case 'effect': { sync(); const e = this.find(ev.who); if (e) this.float(e.x, e.y - 50, ev.kind === 'poison' ? '☠' : ev.kind === 'burn' ? '🔥' : ev.kind === 'stun' ? '💫' : '', '#fff', 18); return 0.15; }
      case 'buff': { const e = this.find(ev.who); if (e) this.float(e.x, e.y - 50, '▲', '#ffe08a', 18); return 0.2; }
      case 'skip': { const e = this.find(ev.who); if (e) this.float(e.x, e.y - 50, '💫', '#fff', 16); return 0.2; }
      case 'steal': { const e = this.find(ev.who); if (e) this.float(e.x, e.y - 50, '💰?', '#f5c542', 16); return 0.2; }
      case 'revive': { sync(); const e = this.find(ev.who); if (e) this.float(e.x, e.y - 50, '✚ 1', '#f5c542', 22); return 0.5; }
      case 'spawn': { const s = Object.assign({}, ev.ent, { sh: 0, fx: [], st: false, dead: false, alpha: 1 }); this.ents.push(s); this.layout(); s.x = s.tx; s.y = s.ty; return 0.4; }
      case 'say': { this.caption = ev.text; return 0.6; }
      case 'die': { sync(); const e = this.find(ev.who); if (e) { e.dead = true; e.hp = 0; } this.layout(); return 0.35; }
      case 'end': { sync(); this.caption = ev.won ? A.t(A.UI.victory) : ev.fled ? '…' : A.t(A.UI.defeat); return 0.6; }
      default: return 0;
    }
  }
  float(x, y, text, color, size) { this.floats.push({ x: x + (Math.random() - 0.5) * 20, y, text, color, size, life: 1.1 }); }

  draw() {
    const c = this.ctx, W = this.W, H = this.H;
    c.save();
    if (this.shakeT > 0) c.translate((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6);
    // Höhle
    const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#120e18'); g.addColorStop(1, '#2a2030');
    c.fillStyle = g; c.fillRect(-10, -10, W + 20, H + 20);
    c.fillStyle = 'rgba(0,0,0,0.3)'; c.fillRect(-10, H * 0.72, W + 20, H);
    for (let i = 0; i < 18; i++) { const x = (i * 71 + this.floor * 13) % W, y = (i * 37) % (H * 0.6); c.fillStyle = 'rgba(255,255,255,0.03)'; c.beginPath(); c.ellipse(x, y, 20 + (i % 4) * 8, 10 + (i % 3) * 5, i, 0, Math.PI * 2); c.fill(); }
    // Fackeln
    for (const fx of [W * 0.08, W * 0.92]) { const fl = 0.8 + Math.sin(this.t * 9 + fx) * 0.1; const lg = c.createRadialGradient(fx, H * 0.18, 2, fx, H * 0.18, 80); lg.addColorStop(0, `rgba(255,170,70,${0.25 * fl})`); lg.addColorStop(1, 'rgba(255,170,70,0)'); c.fillStyle = lg; c.fillRect(fx - 80, H * 0.18 - 80, 160, 160); c.fillStyle = '#ffcf6b'; c.beginPath(); c.arc(fx, H * 0.18, 4, 0, Math.PI * 2); c.fill(); }
    // Figuren (hinten zuerst)
    const sorted = this.ents.slice().sort((a, b) => a.y - b.y);
    for (const e of sorted) this.drawEntity(e);
    // Schwebende Zahlen
    for (const f of this.floats) {
      c.globalAlpha = Math.min(1, f.life * 1.5); c.font = `900 ${f.size}px system-ui, sans-serif`; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.lineWidth = 4; c.strokeStyle = 'rgba(0,0,0,0.7)'; c.strokeText(f.text, f.x, f.y); c.fillStyle = f.color; c.fillText(f.text, f.x, f.y);
    }
    c.globalAlpha = 1;
    // Überschrift
    if (this.caption) { c.font = '800 15px system-ui, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'top'; c.fillStyle = 'rgba(255,255,255,0.85)'; c.fillText(this.caption, W / 2, 10); }
    c.restore();
  }
  drawEntity(e) {
    const c = this.ctx;
    const lung = this.lunge[e.id] || 0;
    const dir = e.side === 'hero' ? 1 : -1;
    const x = e.x + Math.sin(lung * Math.PI) * 26 * dir, y = e.y + (e.dead ? 0 : Math.sin(this.t * 2.5 + e.x) * 2);
    const s = e.boss ? 1.6 : e.elite ? 1.2 : 1;
    c.save(); c.globalAlpha = e.alpha;
    // Schatten
    c.fillStyle = 'rgba(0,0,0,0.35)'; c.beginPath(); c.ellipse(e.x, e.y + 26 * s, 22 * s, 7 * s, 0, 0, Math.PI * 2); c.fill();
    c.translate(x, y); c.scale(s * (e.side === 'hero' ? 1 : -1), s);
    const flash = this.flashes[e.id] > 0;
    this.drawShape(e.shape, e.color, e.raceColor, flash, e.st);
    c.restore();
    if (e.dead) return;
    // Lebensbalken
    const bw = 54 * s, bx = e.x - bw / 2, by = e.y - 36 * s;
    c.fillStyle = 'rgba(0,0,0,0.6)'; c.fillRect(bx - 1, by - 1, bw + 2, 8);
    c.fillStyle = e.side === 'hero' ? '#6fdc7a' : e.boss ? '#ff5f5f' : '#ff8a6a'; c.fillRect(bx, by, bw * Math.max(0, e.hp / e.maxHp), 6);
    if (e.sh > 0) { c.fillStyle = '#9fd8ff'; c.fillRect(bx, by + 6, bw * Math.min(1, e.sh / e.maxHp), 2); }
    c.font = '700 10px system-ui, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'bottom'; c.fillStyle = '#fff';
    c.fillText((e.boss ? '👑 ' : '') + e.name, e.x, by - 3);
    if (e.fx && e.fx.length) { c.font = '12px system-ui'; c.fillText(e.fx.map(k => k === 'poison' ? '☠' : k === 'burn' ? '🔥' : '').join(''), e.x + bw / 2 + 10, by + 8); }
  }
  drawShape(shape, color, color2, flash, stunned) {
    const c = this.ctx;
    const col = flash ? '#ffffff' : color;
    const eye = () => { c.fillStyle = '#fff'; c.beginPath(); c.arc(6, -6, 3.5, 0, Math.PI * 2); c.fill(); c.fillStyle = '#111'; c.beginPath(); c.arc(7, -6, 1.6, 0, Math.PI * 2); c.fill(); };
    switch (shape) {
      case 'hero':
        c.fillStyle = '#3b2b20'; c.fillRect(-8, 12, 6, 12); c.fillRect(2, 12, 6, 12);
        c.fillStyle = col; this.rr(-11, -8, 22, 22, 6);
        c.fillStyle = color2 || '#e8b98a'; c.beginPath(); c.arc(0, -16, 9, 0, Math.PI * 2); c.fill();
        c.fillStyle = '#222'; c.fillRect(2, -18, 3, 3);
        c.fillStyle = col; c.beginPath(); c.arc(0, -19, 9.5, Math.PI, 0); c.fill();
        c.fillStyle = '#c7ccd6'; c.fillRect(12, -14, 3, 26); c.fillRect(9, -16, 9, 3);
        break;
      case 'blob': c.fillStyle = col; c.beginPath(); c.moveTo(-18, 14); c.quadraticCurveTo(-20, -18, 0, -16); c.quadraticCurveTo(20, -18, 18, 14); c.closePath(); c.fill(); c.fillStyle = 'rgba(255,255,255,0.3)'; c.beginPath(); c.arc(-6, -6, 4, 0, Math.PI * 2); c.fill(); eye(); break;
      case 'rat': c.fillStyle = col; c.beginPath(); c.ellipse(0, 4, 18, 11, 0, 0, Math.PI * 2); c.fill(); c.beginPath(); c.arc(14, -2, 8, 0, Math.PI * 2); c.fill(); c.fillStyle = '#e8a0a0'; c.beginPath(); c.arc(16, -9, 4, 0, Math.PI * 2); c.fill(); c.strokeStyle = col; c.lineWidth = 2; c.beginPath(); c.moveTo(-18, 6); c.quadraticCurveTo(-30, 0, -28, -10); c.stroke(); eye(); break;
      case 'bat': c.fillStyle = col; c.beginPath(); c.moveTo(0, 0); c.lineTo(-24, -12); c.lineTo(-16, 2); c.lineTo(-8, -4); c.lineTo(0, 6); c.lineTo(8, -4); c.lineTo(16, 2); c.lineTo(24, -12); c.closePath(); c.fill(); c.beginPath(); c.arc(0, -4, 7, 0, Math.PI * 2); c.fill(); c.fillStyle = '#ff5f5f'; c.fillRect(-4, -6, 2, 2); c.fillRect(2, -6, 2, 2); break;
      case 'mushroom': c.fillStyle = '#e8dcc0'; c.fillRect(-7, -2, 14, 22); c.fillStyle = col; c.beginPath(); c.arc(0, -4, 20, Math.PI, 0); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.arc(-8, -12, 3, 0, Math.PI * 2); c.arc(6, -16, 2.5, 0, Math.PI * 2); c.fill(); c.fillStyle = '#222'; c.fillRect(-4, 4, 2, 3); c.fillRect(2, 4, 2, 3); c.fillStyle = '#8a5a2b'; c.fillRect(10, -6, 3, 24); break;
      case 'skeleton': c.fillStyle = col; c.beginPath(); c.arc(0, -14, 9, 0, Math.PI * 2); c.fill(); c.fillRect(-2, -6, 4, 18); for (let i = 0; i < 3; i++) c.fillRect(-10, -2 + i * 6, 20, 2); c.fillRect(-9, 12, 5, 12); c.fillRect(4, 12, 5, 12); c.fillStyle = '#111'; c.fillRect(-5, -17, 3, 3); c.fillRect(2, -17, 3, 3); c.fillStyle = '#c7ccd6'; c.fillRect(12, -10, 3, 22); break;
      case 'moth': c.fillStyle = col; c.beginPath(); c.ellipse(-12, -2, 12, 8, -0.4, 0, Math.PI * 2); c.ellipse(12, -2, 12, 8, 0.4, 0, Math.PI * 2); c.fill(); c.fillStyle = '#5a3a2a'; c.beginPath(); c.ellipse(0, 0, 4, 12, 0, 0, Math.PI * 2); c.fill(); c.fillStyle = '#ffe08a'; c.beginPath(); c.arc(-10, -2, 3, 0, Math.PI * 2); c.arc(10, -2, 3, 0, Math.PI * 2); c.fill(); break;
      case 'spider': c.strokeStyle = col; c.lineWidth = 2.5; for (let i = 0; i < 4; i++) { const a = -0.8 + i * 0.55; for (const d of [-1, 1]) { c.beginPath(); c.moveTo(0, 0); c.lineTo(d * Math.cos(a) * 20, Math.sin(a) * 20 + 4); c.stroke(); } } c.fillStyle = col; c.beginPath(); c.ellipse(0, 2, 11, 9, 0, 0, Math.PI * 2); c.fill(); c.fillStyle = '#ff5f5f'; c.fillRect(-4, -3, 2, 2); c.fillRect(2, -3, 2, 2); c.fillRect(-1, -5, 2, 2); break;
      case 'golem': c.fillStyle = col; this.rr(-16, -8, 32, 30, 5); c.fillStyle = col; this.rr(-10, -22, 20, 16, 4); c.fillStyle = '#ffcf6b'; c.fillRect(-5, -16, 4, 3); c.fillRect(2, -16, 4, 3); c.fillStyle = col; this.rr(-24, -6, 9, 22, 3); this.rr(15, -6, 9, 22, 3); c.fillStyle = 'rgba(0,0,0,0.2)'; c.fillRect(-12, 0, 8, 3); c.fillRect(2, 8, 10, 3); break;
      case 'ghost': c.fillStyle = col; c.globalAlpha *= 0.85; c.beginPath(); c.arc(0, -8, 14, Math.PI, 0); c.lineTo(14, 14); for (let i = 0; i < 4; i++) c.lineTo(14 - (i + 0.5) * 7, 8 + (i % 2) * 6); c.lineTo(-14, 14); c.closePath(); c.fill(); c.fillStyle = '#111'; c.beginPath(); c.arc(-5, -8, 2.5, 0, Math.PI * 2); c.arc(5, -8, 2.5, 0, Math.PI * 2); c.fill(); break;
      case 'worm': c.fillStyle = col; for (let i = 0; i < 4; i++) { c.beginPath(); c.arc(-18 + i * 11, 8 - i * 5, 10, 0, Math.PI * 2); c.fill(); } c.beginPath(); c.arc(16, -10, 12, 0, Math.PI * 2); c.fill(); c.fillStyle = '#3a1a1a'; c.beginPath(); c.arc(20, -8, 6, 0, Math.PI * 2); c.fill(); c.fillStyle = '#fff'; for (let i = 0; i < 5; i++) { c.beginPath(); c.moveTo(14 + i * 3, -8); c.lineTo(15.5 + i * 3, -3); c.lineTo(17 + i * 3, -8); c.fill(); } break;
      case 'kobold': c.fillStyle = col; this.rr(-9, -4, 18, 18, 5); c.beginPath(); c.arc(0, -12, 8, 0, Math.PI * 2); c.fill(); c.beginPath(); c.moveTo(-8, -14); c.lineTo(-16, -24); c.lineTo(-4, -18); c.fill(); c.beginPath(); c.moveTo(8, -14); c.lineTo(16, -24); c.lineTo(4, -18); c.fill(); c.fillStyle = '#111'; c.fillRect(2, -14, 3, 3); c.fillStyle = '#f5c542'; c.beginPath(); c.arc(14, 4, 5, 0, Math.PI * 2); c.fill(); break;
      default: c.fillStyle = col; c.beginPath(); c.arc(0, 0, 16, 0, Math.PI * 2); c.fill(); eye();
    }
    if (stunned) { c.fillStyle = '#ffe08a'; c.font = '14px system-ui'; c.textAlign = 'center'; c.fillText('💫', 0, -30); }
  }
  rr(x, y, w, h, r) { const c = this.ctx; c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); c.fill(); }
};
