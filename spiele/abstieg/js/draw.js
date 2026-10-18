// Der Abstieg – Zeichnen der Welt: Kamera, Kacheln, Figuren aus einfachen Formen, Effekte, Minikarte
'use strict';
window.A = window.A || {};

A.Draw = class {
  constructor(canvas) {
    this.cv = canvas; this.ctx = canvas.getContext('2d'); this.t = 0;
    this.resize(); new ResizeObserver(() => this.resize()).observe(canvas);
  }
  resize() {
    const r = this.cv.getBoundingClientRect(); const d = Math.min(2, window.devicePixelRatio || 1);
    this.W = r.width; this.H = r.height; this.cv.width = Math.round(r.width * d); this.cv.height = Math.round(r.height * d);
    this.ctx.setTransform(d, 0, 0, d, 0, 0);
  }
  draw(W, dt) {
    const c = this.ctx, TS = A.World.TS; this.t += dt;
    if (!W) return;
    const h = W.hero;
    const zoom = this.W < 500 ? 1.15 : 1.35;
    const vw = this.W / zoom, vh = this.H / zoom;
    const mapW = A.World.MW * TS, mapH = A.World.MH * TS;
    let camX = Math.max(0, Math.min(mapW - vw, h.x - vw / 2)), camY = Math.max(0, Math.min(mapH - vh, h.y - vh / 2));
    if (mapW < vw) camX = (mapW - vw) / 2; if (mapH < vh) camY = (mapH - vh) / 2;
    c.save();
    c.fillStyle = '#0c0910'; c.fillRect(0, 0, this.W, this.H);
    c.scale(zoom, zoom);
    if (W.shake > 0) c.translate((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6);
    c.translate(-camX, -camY);
    // Kacheln
    const x0 = Math.max(0, Math.floor(camX / TS)), y0 = Math.max(0, Math.floor(camY / TS)), x1 = Math.min(A.World.MW - 1, Math.ceil((camX + vw) / TS)), y1 = Math.min(A.World.MH - 1, Math.ceil((camY + vh) / TS));
    const fl = W.floor;
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
      const t = W.tiles[y][x]; const px = x * TS, py = y * TS;
      if (t === 1 || t === 2) {
        const v = ((x * 7 + y * 13 + fl * 3) % 5);
        c.fillStyle = v === 0 ? '#2b2334' : v === 1 ? '#2e2638' : '#29222f'; c.fillRect(px, py, TS, TS);
        if (v === 3) { c.fillStyle = 'rgba(0,0,0,0.12)'; c.fillRect(px + 6, py + 8, 10, 4); }
        if (t === 2) { c.fillStyle = '#5a2a2a'; for (let i = 0; i < 3; i++) c.fillRect(px + 5 + i * 10, py, 4, TS); c.fillStyle = '#7a3a3a'; c.fillRect(px, py + 14, TS, 4); }
      } else {
        const below = y + 1 < A.World.MH && W.tiles[y + 1][x] === 1;
        c.fillStyle = '#15101b'; c.fillRect(px, py, TS, TS);
        if (below) { c.fillStyle = '#3d3048'; c.fillRect(px, py + 12, TS, TS - 12); c.fillStyle = '#4a3a58'; c.fillRect(px, py + 12, TS, 3); }
        const above = y > 0 && W.tiles[y - 1][x] === 1; if (above) { c.fillStyle = 'rgba(0,0,0,0.35)'; c.fillRect(px, py, TS, 6); }
      }
    }
    // Schatten der Räume (Rand)
    for (const r of W.rooms) {
      const rx = r.x * TS, ry = r.y * TS, rw = r.w * TS, rh = r.h * TS;
      if (rx + rw < camX || rx > camX + vw || ry + rh < camY || ry > camY + vh) continue;
      const g = c.createRadialGradient(rx + rw / 2, ry + rh / 2, rh * 0.3, rx + rw / 2, ry + rh / 2, rw * 0.7); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.35)');
      c.fillStyle = g; c.fillRect(rx, ry, rw, rh);
      // Fackeln an den Ecken
      for (const [tx, ty] of [[rx + 10, ry + 6], [rx + rw - 10, ry + 6]]) { const f = 0.8 + Math.sin(this.t * 9 + tx) * 0.15; const lg = c.createRadialGradient(tx, ty, 2, tx, ty, 70); lg.addColorStop(0, `rgba(255,170,70,${0.22 * f})`); lg.addColorStop(1, 'rgba(255,170,70,0)'); c.fillStyle = lg; c.fillRect(tx - 70, ty - 70, 140, 140); c.fillStyle = '#ffcf6b'; c.beginPath(); c.arc(tx, ty, 3, 0, Math.PI * 2); c.fill(); }
      for (const p of r.props) if (!p.hidden) this.drawProp(p, W);
    }
    // Beute
    for (const p of W.picks) {
      if (p.kind === 'gold') { c.fillStyle = '#f5c542'; c.beginPath(); c.arc(p.x, p.y + Math.sin(this.t * 6 + p.x) * 2, 5, 0, Math.PI * 2); c.fill(); c.fillStyle = '#b8902a'; c.fillRect(p.x - 1, p.y - 2 + Math.sin(this.t * 6 + p.x) * 2, 2, 4); }
      else if (p.kind === 'potion') { c.font = '18px system-ui'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('🧪', p.x, p.y + Math.sin(this.t * 4) * 3); }
      else { const col = A.RARITY[p.it.rarity].color; const g = c.createRadialGradient(p.x, p.y, 2, p.x, p.y, 26); g.addColorStop(0, col + 'aa'); g.addColorStop(1, col + '00'); c.fillStyle = g; c.fillRect(p.x - 26, p.y - 26, 52, 52); c.save(); c.translate(p.x, p.y + Math.sin(this.t * 4 + p.x) * 3); c.rotate(Math.PI / 4); c.fillStyle = col; c.fillRect(-7, -7, 14, 14); c.fillStyle = '#fff'; c.fillRect(-3, -3, 6, 6); c.restore(); }
    }
    // Figuren (nach y sortiert)
    const ents = [h, ...W.mons].sort((a, b) => a.y - b.y);
    for (const e of ents) this.drawEntity(e, W);
    // Geschosse
    for (const s of W.shots) { c.fillStyle = s.color; c.beginPath(); c.arc(s.x, s.y, s.r, 0, Math.PI * 2); c.fill(); c.fillStyle = 'rgba(255,255,255,0.5)'; c.beginPath(); c.arc(s.x - s.vx * 0.02, s.y - s.vy * 0.02, s.r * 0.6, 0, Math.PI * 2); c.fill(); }
    // Effekte
    for (const f of W.fx) {
      if (f.kind === 'slash') { const a = Math.atan2(f.fy, f.fx); c.strokeStyle = f.color; c.globalAlpha = f.life / 0.18; c.lineWidth = 4; c.beginPath(); c.arc(f.x, f.y, f.r - 10, a - 1.1, a + 1.1); c.stroke(); c.globalAlpha = 1; }
      else if (f.kind === 'ring') { c.strokeStyle = f.color; c.globalAlpha = f.life / 0.4; c.lineWidth = 3; c.beginPath(); c.arc(f.x, f.y, f.r * (1.2 - f.life), 0, Math.PI * 2); c.stroke(); c.globalAlpha = 1; }
      else if (f.kind === 'poof') { c.fillStyle = f.color; c.globalAlpha = f.life * 2; for (let i = 0; i < 6; i++) { const a = i * 1.05; c.beginPath(); c.arc(f.x + Math.cos(a) * (0.4 - f.life) * 60, f.y + Math.sin(a) * (0.4 - f.life) * 60, 3, 0, Math.PI * 2); c.fill(); } c.globalAlpha = 1; }
    }
    // Schwebende Texte
    for (const f of W.floats) { c.globalAlpha = Math.min(1, f.life * 1.5); c.font = `900 ${f.size}px system-ui, sans-serif`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineWidth = 3; c.strokeStyle = 'rgba(0,0,0,0.7)'; c.strokeText(f.text, f.x, f.y); c.fillStyle = f.color; c.fillText(f.text, f.x, f.y); }
    c.globalAlpha = 1;
    c.restore();
    // Hinweis oben
    if (W.hint) { c.font = '700 13px system-ui, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'top'; c.fillStyle = 'rgba(0,0,0,0.5)'; const tw = c.measureText(W.hint).width; c.fillRect(this.W / 2 - tw / 2 - 8, 6, tw + 16, 22); c.fillStyle = '#ffe08a'; c.fillText(W.hint, this.W / 2, 10); }
    this.minimap(W);
  }
  minimap(W) {
    const c = this.ctx, s = 14, pad = 8, x0 = this.W - pad - A.World.MW / A.World.CW * s * 1.6 - 4, y0 = pad;
    c.fillStyle = 'rgba(0,0,0,0.45)'; c.fillRect(x0 - 4, y0 - 4, 3 * s * 1.6 + 8, 3 * s * 1.2 + 8);
    const COL = { start: '#6fdc7a', fight: '#a596b8', elite: '#ff8a6a', boss: '#ff5f5f', treasure: '#f5c542', shop: '#57a6ff', rest: '#ff8a3d', event: '#c77dff', stairs: '#e8e2d0' };
    for (const r of W.rooms) {
      const rx = x0 + r.cx * s * 1.6, ry = y0 + r.cy * s * 1.2;
      c.fillStyle = r.visited ? COL[r.type] : 'rgba(255,255,255,0.18)'; c.globalAlpha = r.visited ? (r.cleared || r.used ? 0.5 : 1) : 1;
      c.fillRect(rx, ry, s * 1.4, s);
      c.globalAlpha = 1;
    }
    for (const [p, q] of W.edges) { c.strokeStyle = 'rgba(255,255,255,0.4)'; c.lineWidth = 2; c.beginPath(); c.moveTo(x0 + p.x * s * 1.6 + s * 0.7, y0 + p.y * s * 1.2 + s / 2); c.lineTo(x0 + q.x * s * 1.6 + s * 0.7, y0 + q.y * s * 1.2 + s / 2); c.stroke(); }
    const hr = W.room; if (hr) { c.strokeStyle = '#fff'; c.lineWidth = 2; c.strokeRect(x0 + hr.cx * s * 1.6 - 1, y0 + hr.cy * s * 1.2 - 1, s * 1.4 + 2, s + 2); }
  }
  drawProp(p, W) {
    const c = this.ctx; c.save(); c.translate(p.x, p.y);
    const near = W.near === p;
    if (near) { c.strokeStyle = '#ffe08a'; c.lineWidth = 2; c.setLineDash([4, 4]); c.beginPath(); c.arc(0, 0, 30, 0, Math.PI * 2); c.stroke(); c.setLineDash([]); }
    c.globalAlpha = p.used ? 0.5 : 1;
    switch (p.kind) {
      case 'chest': c.fillStyle = '#6b4a2a'; this.rr(-16, -10, 32, 22, 4); c.fillStyle = p.used ? '#4a3a2a' : '#8a6a3a'; this.rr(-16, -14, 32, 10, 4); c.fillStyle = '#f5c542'; c.fillRect(-3, -6, 6, 8); break;
      case 'fire': { const f = Math.sin(this.t * 12) * 3; c.fillStyle = '#5a3a2a'; c.fillRect(-14, 6, 28, 5); c.fillStyle = p.used ? '#666' : '#ff8a3d'; c.beginPath(); c.moveTo(-10, 8); c.quadraticCurveTo(-6, -8 - f, 0, -18 - f); c.quadraticCurveTo(6, -8 + f, 10, 8); c.fill(); if (!p.used) { c.fillStyle = '#ffe08a'; c.beginPath(); c.moveTo(-5, 8); c.quadraticCurveTo(0, -4 - f, 0, -9 - f); c.quadraticCurveTo(3, -2, 5, 8); c.fill(); const lg = c.createRadialGradient(0, 0, 5, 0, 0, 90); lg.addColorStop(0, 'rgba(255,150,60,0.25)'); lg.addColorStop(1, 'rgba(255,150,60,0)'); c.fillStyle = lg; c.fillRect(-90, -90, 180, 180); } break; }
      case 'merchant': c.fillStyle = '#4a3a5a'; this.rr(-22, -4, 44, 16, 4); c.fillStyle = '#c9a54a'; this.rr(-9, -22, 18, 20, 5); c.fillStyle = '#e8b98a'; c.beginPath(); c.arc(0, -28, 8, 0, Math.PI * 2); c.fill(); c.fillStyle = '#7a3a7a'; c.beginPath(); c.moveTo(-12, -32); c.lineTo(12, -32); c.lineTo(0, -46); c.fill(); c.font = '12px system-ui'; c.textAlign = 'center'; c.fillStyle = '#fff'; c.fillText('🛒', 0, 8); break;
      case 'statue': c.fillStyle = '#6a6a7a'; this.rr(-14, 6, 28, 10, 2); c.fillStyle = '#8a8a9a'; this.rr(-8, -24, 16, 30, 4); c.beginPath(); c.arc(0, -30, 7, 0, Math.PI * 2); c.fill(); c.fillStyle = '#c77dff'; c.beginPath(); c.arc(0, -30, 2, 0, Math.PI * 2); c.fill(); c.font = '12px system-ui'; c.textAlign = 'center'; c.fillStyle = '#fff'; c.fillText('❓', 0, -44); break;
      case 'stairs': c.fillStyle = '#050308'; this.rr(-22, -16, 44, 32, 6); c.fillStyle = '#3a3048'; for (let i = 0; i < 4; i++) c.fillRect(-18 + i * 4, -12 + i * 6, 36 - i * 8, 4); c.font = '14px system-ui'; c.textAlign = 'center'; c.fillStyle = '#fff'; c.fillText('⬇️', 0, -28); break;
      case 'sign': c.fillStyle = '#6b4a2a'; c.fillRect(-2, -4, 4, 16); this.rr(-24, -20, 48, 18, 3); c.fillStyle = '#e8dcc0'; c.font = '700 11px system-ui'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(p.text, 0, -11); break;
    }
    c.restore();
  }
  drawEntity(e, W) {
    const c = this.ctx;
    const s = e.boss ? 1.7 : e.elite ? 1.25 : 1;
    const swing = e.swing > 0 ? Math.sin(e.swing / 0.2 * Math.PI) * 10 : 0;
    const x = e.x + e.fx * swing, y = e.y + e.fy * swing + (e.alive ? Math.sin(this.t * 3 + e.x) * 1.5 : 0);
    c.save(); c.globalAlpha = e.alpha == null ? 1 : e.alpha;
    if (e.side === 'hero' && e.inv > 0 && Math.floor(this.t * 20) % 2) c.globalAlpha = 0.5;
    c.fillStyle = 'rgba(0,0,0,0.35)'; c.beginPath(); c.ellipse(e.x, e.y + 18 * s, 16 * s, 6 * s, 0, 0, Math.PI * 2); c.fill();
    c.translate(x, y - 6 * s); c.scale(s * (e.fx < 0 ? -1 : 1), s);
    if (e.state === 'windup') { c.strokeStyle = '#ff5f5f'; c.lineWidth = 2; c.beginPath(); c.arc(0, 0, 22, 0, Math.PI * 2); c.stroke(); }
    this.drawShape(e.shape, e.color, e.raceColor, e.flash > 0, e.stun > 0);
    c.restore();
    if (!e.alive) return;
    const bw = 40 * s, bx = e.x - bw / 2, by = e.y - 34 * s;
    if (e.side !== 'hero' || e.hp < e.maxHp || e.shield > 0) {
      c.fillStyle = 'rgba(0,0,0,0.6)'; c.fillRect(bx - 1, by - 1, bw + 2, 6);
      c.fillStyle = e.side === 'hero' ? '#6fdc7a' : e.boss ? '#ff5f5f' : '#ff8a6a'; c.fillRect(bx, by, bw * Math.max(0, e.hp / e.maxHp), 4);
      if (e.shield > 0) { c.fillStyle = '#9fd8ff'; c.fillRect(bx, by + 4, bw * Math.min(1, e.shield / e.maxHp), 2); }
    }
    if (e.side !== 'hero') { c.font = '700 9px system-ui, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'bottom'; c.fillStyle = '#fff'; c.fillText((e.boss ? '👑 ' : '') + e.name, e.x, by - 2); }
    if (e.effects && e.effects.length) { c.font = '11px system-ui'; c.textAlign = 'left'; c.fillText(e.effects.map(k => k.kind === 'poison' ? '☠' : '🔥').join(''), bx + bw + 3, by + 6); }
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
      case 'golem': c.fillStyle = col; this.rr(-16, -8, 32, 30, 5); this.rr(-10, -22, 20, 16, 4); c.fillStyle = '#ffcf6b'; c.fillRect(-5, -16, 4, 3); c.fillRect(2, -16, 4, 3); c.fillStyle = col; this.rr(-24, -6, 9, 22, 3); this.rr(15, -6, 9, 22, 3); c.fillStyle = 'rgba(0,0,0,0.2)'; c.fillRect(-12, 0, 8, 3); c.fillRect(2, 8, 10, 3); break;
      case 'ghost': c.fillStyle = col; c.globalAlpha *= 0.85; c.beginPath(); c.arc(0, -8, 14, Math.PI, 0); c.lineTo(14, 14); for (let i = 0; i < 4; i++) c.lineTo(14 - (i + 0.5) * 7, 8 + (i % 2) * 6); c.lineTo(-14, 14); c.closePath(); c.fill(); c.fillStyle = '#111'; c.beginPath(); c.arc(-5, -8, 2.5, 0, Math.PI * 2); c.arc(5, -8, 2.5, 0, Math.PI * 2); c.fill(); break;
      case 'worm': c.fillStyle = col; for (let i = 0; i < 4; i++) { c.beginPath(); c.arc(-18 + i * 11, 8 - i * 5, 10, 0, Math.PI * 2); c.fill(); } c.beginPath(); c.arc(16, -10, 12, 0, Math.PI * 2); c.fill(); c.fillStyle = '#3a1a1a'; c.beginPath(); c.arc(20, -8, 6, 0, Math.PI * 2); c.fill(); c.fillStyle = '#fff'; for (let i = 0; i < 5; i++) { c.beginPath(); c.moveTo(14 + i * 3, -8); c.lineTo(15.5 + i * 3, -3); c.lineTo(17 + i * 3, -8); c.fill(); } break;
      case 'kobold': c.fillStyle = col; this.rr(-9, -4, 18, 18, 5); c.beginPath(); c.arc(0, -12, 8, 0, Math.PI * 2); c.fill(); c.beginPath(); c.moveTo(-8, -14); c.lineTo(-16, -24); c.lineTo(-4, -18); c.fill(); c.beginPath(); c.moveTo(8, -14); c.lineTo(16, -24); c.lineTo(4, -18); c.fill(); c.fillStyle = '#111'; c.fillRect(2, -14, 3, 3); c.fillStyle = '#f5c542'; c.beginPath(); c.arc(14, 4, 5, 0, Math.PI * 2); c.fill(); break;
      default: c.fillStyle = col; c.beginPath(); c.arc(0, 0, 16, 0, Math.PI * 2); c.fill(); eye();
    }
    if (stunned) { c.fillStyle = '#ffe08a'; c.font = '14px system-ui'; c.textAlign = 'center'; c.fillText('💫', 0, -30); }
  }
  rr(x, y, w, h, r) { const c = this.ctx; c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); c.fill(); }
};
