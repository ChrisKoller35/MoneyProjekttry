// Der Abstieg – Welt-Bosse: jeder Boss hat eine eigene Mechanik mit Bodenanzeige und wird ab halbem Leben wütend.
// Die Welt (world.js) ruft step() für jeden Boss und tick() einmal pro Bild; draw.js ruft drawGround/drawTop/lights.
'use strict';
window.A = window.A || {};

A.Bosses = (function () {
  const TAU = Math.PI * 2, PX = 2, TS = 32, EY = 0.6;   // EY: Bodenkreise sind flach (wie der Meteor)
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const L = (de, en) => (A.LANG === 'de' ? de : en);
  let api = null;   // Werkzeuge aus world.js: hit, moveEnt, blocked, reachable, inside, float, addEffect, shoot, ringShot, freeSpot
  const W = () => api.W;
  function bind(a) { api = a; }

  // ---------- Bodenanzeigen ----------
  // W.bfx: tele (Kreis, schlägt bei 'at' ein), pool (bleibende Pfütze), beam (drehender Strahl), flood (Flut), wind (Sog)
  function add(o) { const w = W(); (w.bfx || (w.bfx = [])).push(o); return o; }
  function tele(m, x, y, r, delay, dmg, o) { const w = W(); return add(Object.assign({ kind: 'tele', from: m, x, y, r, t0: w.t, at: w.t + delay, dmg, col: '#ff0044' }, o || {})); }
  function pool(x, y, r, dur, kind) {
    const w = W(), list = w.bfx.filter(b => b.kind === 'pool');
    if (list.length >= 9) list[0].until = Math.min(list[0].until, w.t + 0.4);   // nicht den ganzen Raum zukleistern
    return add({ kind: 'pool', pk: kind, x, y, r, t0: w.t, until: w.t + dur, tick: w.t + 0.3 });
  }
  const inEll = (b, e, pad) => { const rx = b.r + (pad || 0), ry = rx * EY; return ((e.x - b.x) / rx) ** 2 + ((e.y - b.y) / ry) ** 2 < 1; };
  // freie Stelle im Kampfraum, die der Held erreichen kann
  function roomSpot(rr) {
    const w = W(), r = w.active; if (!r) return null;
    for (let k = 0; k < 40; k++) {
      const x = (r.x + 1.5 + Math.random() * (r.w - 3)) * TS, y = (r.y + 1.5 + Math.random() * (r.h - 3)) * TS;
      if (!api.blocked(x, y, rr || 16) && api.reachable(x, y) && api.inside(r, x, y)) return { x, y };
    }
    return null;
  }
  // Stelle in der Nähe von (x, y), auf freiem Boden
  function near(x, y, spread) { const a = Math.random() * TAU, d = spread * (0.5 + Math.random() * 0.5); const [nx, ny] = api.freeSpot(x + Math.cos(a) * d, y + Math.sin(a) * d * EY * 1.4, 12); return { x: nx, y: ny }; }

  // ---------- Wut-Phase ----------
  function enrage(m, s) {
    s.p2 = true; m.speed *= 1.2; if (m.ringCd) m.ringCd *= 0.8;
    if (A.FX) { A.FX.banner(m.name, L('wird wütend!', 'is enraged!'), '#e43b44', 2); A.FX.shake(0.6); A.FX.ev('nova', { e: m, r: 120, color: '#e43b44', magic: true }); }
    api.float(m.x, m.y - 70, L('Wut!', 'Rage!'), '#e43b44', 20);
  }

  // ---------- Verhalten je Boss (true = steht still, keine normalen Angriffe) ----------
  function step(m, dt, d) {
    const w = W(), h = w.hero;
    const s = m.bs || (m.bs = { t: 2.2, t2: 6, busy: 0 });
    if (!s.p2 && m.hp < m.maxHp * 0.5) enrage(m, s);
    const k = s.p2 ? 0.7 : 1;
    s.t -= dt; s.t2 -= dt;
    if (s.busy > w.t) return true;
    switch (m.mid) {
      case 'schleimkoenig': {   // Bauchplatscher: springt auf den Helden, landet mit Schleim-Pfütze
        if (s.jump) {
          const j = s.jump, q = clamp((w.t - j.t0) / (j.at - j.t0), 0, 1);
          m.x = j.x0 + (j.x1 - j.x0) * q; m.y = j.y0 + (j.y1 - j.y0) * q; m.hop = Math.sin(q * Math.PI) * 110;
          if (q >= 1) { s.jump = null; m.hop = 0; m.cd = 0.8; if (s.p2) api.ringShot(m, 10, '#3fbf5a'); }
          return true;
        }
        if (s.t <= 0 && d < 640) {
          s.t = 5.5 * k;
          const [x1, y1] = api.freeSpot(h.x, h.y, m.r);
          tele(m, x1, y1, 82, 1.1, m.atk * 1.5, { col: '#3fbf5a', pool: 'slime', poolDur: 6, poolR: 70 });
          s.jump = { x0: m.x, y0: m.y, x1, y1, t0: w.t + 0.25, at: w.t + 1.1 };
          api.float(m.x, m.y - 60, L('Bauchplatscher!', 'Belly flop!'), '#9be37a', 15);
          return true;
        }
        return false;
      }
      case 'dornenmutter': {   // Ranken brechen unter dem Helden aus dem Boden und halten fest
        if (s.t <= 0 && d < 640) {
          s.t = 4.6 * k; const n = s.p2 ? 5 : 3;
          tele(m, h.x, h.y, 50, 1.05, m.atk * 1.2, { col: '#a2e05a', root: 0.9, vine: true });
          for (let i = 1; i < n; i++) { const p = near(h.x + (h.moving ? h.fx * 60 : 0), h.y + (h.moving ? h.fy * 40 : 0), 120); tele(m, p.x, p.y, 50, 1.05 + i * 0.05, m.atk * 1.2, { col: '#a2e05a', root: 0.9, vine: true }); }
        }
        if (s.p2 && s.t2 <= 0) {   // Rankenpeitsche: eine Reihe vom Boss zum Helden
          s.t2 = 6.5; const a = Math.atan2(h.y - m.y, h.x - m.x);
          for (let i = 1; i <= 8; i++) { const x = m.x + Math.cos(a) * i * 52, y = m.y + Math.sin(a) * i * 52; if (api.blocked(x, y, 4)) break; tele(m, x, y, 38, 0.8 + i * 0.08, m.atk, { col: '#a2e05a', root: 0.6, vine: true }); }
        }
        return false;
      }
      case 'sandpharao': {   // Sandsäulen in einer Reihe, Sandsog zum Pharao
        if (s.t <= 0 && d < 640) {
          s.t = 5 * k; const a0 = Math.atan2(h.y - m.y, h.x - m.x), arms = s.p2 ? [-0.45, 0, 0.45] : [0];
          for (const da of arms) for (let i = 1; i <= 9; i++) { const x = m.x + Math.cos(a0 + da) * i * 54, y = m.y + Math.sin(a0 + da) * i * 54; if (api.blocked(x, y, 4)) break; tele(m, x, y, 40, 0.85 + i * 0.09, m.atk * 1.1, { col: '#feae34', sand: true }); }
          m.swing = 0.3;
        }
        if (s.t2 <= 0) {
          s.t2 = (s.p2 ? 8 : 11); s.busy = w.t + 2.6;
          add({ kind: 'wind', from: m, t0: w.t, until: w.t + 2.6, pow: s.p2 ? 95 : 75 });
          api.float(m.x, m.y - 60, L('Sandsog!', 'Sand pull!'), '#feae34', 16);
          if (s.p2) for (let i = 0; i < 2; i++) { const p = near(m.x, m.y, 140); pool(p.x, p.y, 62, 9, 'sand'); }
          return true;
        }
        return false;
      }
      case 'kraken': {   // Tentakel unter dem Helden, Flut: nur in den hellen Kreisen ist man sicher
        if (s.t <= 0 && d < 640) { s.t = 3.6 * k; tele(m, h.x, h.y, 46, 0.85, m.atk * 1.2, { col: '#b55088', slow: true, tentacle: true }); }
        if (s.t2 <= 0) {
          s.t2 = s.p2 ? 10 : 13;
          const safes = [];
          for (let i = 0; i < 30 && safes.length < (s.p2 ? 2 : 3); i++) { const p = roomSpot(20); if (p && safes.every(o => Math.hypot(o.x - p.x, o.y - p.y) > 170)) safes.push({ x: p.x, y: p.y, r: 66 }); }
          if (!safes.length) return false;
          add({ kind: 'flood', from: m, t0: w.t, at: w.t + 3.2, safes, dmg: m.atk * 2.2, r: w.active });
          if (A.FX) A.FX.banner(L('Die Flut kommt!', 'The tide rises!'), L('Schnell in einen hellen Kreis!', 'Get into a bright circle!'), '#2ce8f5', 2.2);
        }
        return false;
      }
      case 'rostkoenig': {   // Hammerschlag hinterlässt Lava, in der Wut regnet Glut
        if (s.t <= 0 && d < 640) {
          s.t = 5.8 * k; m.swing = 0.3; const n = s.p2 ? 4 : 3;
          tele(m, h.x, h.y, 64, 1.2, m.atk * 1.3, { col: '#f77622', pool: 'lava', poolDur: s.p2 ? 10 : 7, poolR: 58, hammer: true });
          for (let i = 1; i < n; i++) { const p = near(h.x, h.y, 150); tele(m, p.x, p.y, 64, 1.2 + i * 0.12, m.atk * 1.3, { col: '#f77622', pool: 'lava', poolDur: s.p2 ? 10 : 7, poolR: 58, hammer: true }); }
          api.float(m.x, m.y - 60, L('Hammerschlag!', 'Hammer slam!'), '#feae34', 15);
        }
        if (s.p2 && s.t2 <= 0) { s.t2 = 4.5; for (let i = 0; i < 6; i++) { const p = roomSpot(10); if (p) tele(m, p.x, p.y, 36, 1.3 + Math.random() * 0.5, m.atk, { col: '#feae34', ember: true }); } }
        return false;
      }
      case 'waechter': {   // Leerenstrahl: steht still und dreht einen Strahl durch den Raum (in der Wut zwei)
        if (s.t2 <= 0 && d < 700) {
          s.t2 = s.p2 ? 9 : 11; const dur = 3.6, warm = 1.1;
          add({ kind: 'beam', from: m, t0: w.t, warm: w.t + warm, until: w.t + warm + dur, a: Math.atan2(h.y - m.y, h.x - m.x) + (Math.random() < 0.5 ? 0.7 : -0.7), spin: (Math.random() < 0.5 ? 1 : -1) * (s.p2 ? 1.15 : 0.9), n: s.p2 ? 2 : 1, len: 560, w: 15, dmg: m.atk * 0.75, hitT: 0 });
          s.busy = w.t + warm + dur; m.state = 'chase';
          api.float(m.x, m.y - 60, L('Leerenstrahl!', 'Void beam!'), '#e0a4ff', 16);
          return true;
        }
        return false;
      }
    }
    return false;
  }

  // ---------- Ablauf der Anzeigen (einmal pro Bild) ----------
  function tick(dt) {
    const w = W(); if (!w || !w.bfx || !w.bfx.length) return;
    const h = w.hero, boss = w.mons.find(m => m.boss && m.alive);
    if (!boss) { w.bfx = w.bfx.filter(b => b.kind === 'pool'); for (const b of w.bfx) b.until = Math.min(b.until, w.t + 0.8); }
    for (const b of w.bfx) {
      if (b.kind === 'tele' && w.t >= b.at) {
        b.done = true;
        if (h.alive && inEll(b, h, 6)) {
          api.hit(b.from, h, b.dmg, { kind: 'phys' });
          if (b.root) { h.rootUntil = w.t + b.root; api.float(h.x, h.y - 44, L('Festgehalten!', 'Rooted!'), '#a2e05a', 13); }
          if (b.slow) { h.slowUntil = w.t + 1.6; h.slowPow = 0.55; }
        }
        if (b.pool) pool(b.x, b.y, b.poolR || b.r, b.poolDur || 6, b.pool);
        if (A.FX) {
          A.FX.ev('boom', { x: b.x, y: b.y, r: b.r, color: b.col, soft: !!(b.vine || b.tentacle) });
          if (b.vine) A.FX.burst(b.x, b.y, 14, { color: ['#63c74d', '#a2e05a', '#3e8948'], smin: 30, smax: 90, z: 2, vz: 160, g: 420, life: 0.7 });
          if (b.tentacle) A.FX.burst(b.x, b.y, 14, { color: ['#b55088', '#68386c', '#2ce8f5'], smin: 30, smax: 90, z: 2, vz: 180, g: 420, life: 0.7 });
          if (b.sand) A.FX.smoke(b.x, b.y, 4, '#e4a672', 6);
          if (b.hammer) { A.FX.shake(0.35); A.FX.rocks(b.x, b.y, 4, 50, ['#8a3a1a', '#5d275d', '#f77622']); }
        }
      } else if (b.kind === 'pool') {
        if (w.t > b.until) { b.done = true; continue; }
        if (h.alive && inEll(b, h, 0) && w.t >= b.tick) {
          b.tick = w.t + 0.5;
          if (b.pk === 'lava') api.addEffect(h, 'burn', Math.max(1, Math.round(h.maxHp * 0.04)), 1.2);
          else { h.slowUntil = w.t + 0.6; h.slowPow = b.pk === 'sand' ? 0.45 : 0.55; }
        }
      } else if (b.kind === 'wind') {
        if (w.t > b.until || !b.from.alive) { b.done = true; continue; }
        const dx = b.from.x - h.x, dy = b.from.y - h.y, dd = Math.hypot(dx, dy) || 1;
        if (h.alive && dd > b.from.r + h.r + 6) api.moveEnt(h, dx / dd * b.pow * dt, dy / dd * b.pow * dt);
        if (A.FX && !A.FX.low && Math.random() < dt * 40) { const a = Math.random() * TAU, rr = 160 + Math.random() * 200; A.FX.part({ kind: 'spark', add: false, x: b.from.x + Math.cos(a) * rr, y: b.from.y + Math.sin(a) * rr * 0.7, vx: -Math.cos(a) * 260, vy: -Math.sin(a) * 180, life: 0.6, color: Math.random() < 0.5 ? '#e4a672' : '#ead4aa', drag: 0.5 }); }
      } else if (b.kind === 'beam') {
        if (w.t > b.until || !b.from.alive) { b.done = true; continue; }
        if (w.t < b.warm) continue;
        b.a += b.spin * dt;
        if (h.alive && w.t >= b.hitT) for (let i = 0; i < b.n; i++) {
          const a = b.a + i * Math.PI, ex = Math.cos(a), ey = Math.sin(a), px = h.x - b.from.x, py = h.y - b.from.y, along = px * ex + py * ey;
          if (along > 0 && along < b.len && Math.abs(px * ey - py * ex) < b.w + h.r * 0.6) { b.hitT = w.t + 0.35; api.hit(b.from, h, b.dmg, { kind: 'magic', noDodge: true }); break; }
        }
      } else if (b.kind === 'flood') {
        if (b.fired) { if (w.t > b.at + 0.8) b.done = true; continue; }
        if (w.t >= b.at) {
          b.fired = true;
          if (h.alive && !b.safes.some(o => inEll(o, h, 4))) { api.hit(b.from, h, b.dmg, { kind: 'magic', noDodge: true }); h.slowUntil = w.t + 2; h.slowPow = 0.5; api.float(h.x, h.y - 44, L('Weggespült!', 'Swept away!'), '#2ce8f5', 15); }
          if (A.FX) { A.FX.shake(0.7); const r = b.r; if (r) for (let i = 0; i < 26; i++) { const x = (r.x + 1 + Math.random() * (r.w - 2)) * TS, y = (r.y + 1 + Math.random() * (r.h - 2)) * TS; if (!b.safes.some(o => inEll(o, { x, y }, 0))) A.FX.burst(x, y, 4, { color: ['#2ce8f5', '#ffffff', '#0099db'], smin: 20, smax: 70, z: 2, vz: 140, g: 380, life: 0.6 }); } }
        }
      }
    }
    w.bfx = w.bfx.filter(b => !b.done);
  }

  // ---------- Zeichnen (Retro-Look: b = Bild, g = Leuchten) ----------
  const POOL = { lava: ['#f77622', '#feae34', 0.6], slime: ['#3fbf5a', '#9be37a', 0.42], sand: ['#c28569', '#e4a672', 0.5], ink: ['#2e2a4a', '#68386c', 0.55] };
  function ell(c, x, y, R, fill) { c.beginPath(); c.ellipse(Math.round(x), Math.round(y), Math.max(0.5, R), Math.max(0.5, R * EY), 0, 0, TAU); if (fill) c.fill(); else c.stroke(); }
  function drawGround(dr, w, cx, cy) {
    if (!w.bfx || !w.bfx.length) return;
    const b = dr.b, g = dr.g, t = dr.t;
    for (const o of w.bfx) {
      if (o.kind === 'pool') {
        const [c1, c2, al] = POOL[o.pk] || POOL.slime, x = o.x / PX - cx, y = o.y / PX - cy, R = o.r / PX;
        const life = clamp((o.until - w.t) / 0.8, 0, 1) * clamp((w.t - o.t0) / 0.3, 0, 1);
        b.globalAlpha = al * life; b.fillStyle = c1; ell(b, x, y, R, true);
        b.globalAlpha = al * 0.8 * life; b.fillStyle = c2; ell(b, x + Math.sin(t + o.x) * 2, y, R * 0.55, true);
        if (o.pk === 'lava') { g.globalAlpha = (0.35 + Math.sin(t * 4 + o.x) * 0.1) * life; g.strokeStyle = '#feae34'; g.lineWidth = 1; ell(g, x, y, R); }
        g.fillStyle = c2;   // Blasen
        for (let i = 0; i < 5; i++) { const a = i * 2.39 + o.x, rr = R * (0.2 + (i * 0.37 % 0.7)), q = (t * 0.8 + i * 0.21) % 1; g.globalAlpha = (1 - q) * 0.7 * life; g.fillRect(Math.round(x + Math.cos(a) * rr), Math.round(y + Math.sin(a) * rr * EY - q * 5), 1, 1); }
      } else if (o.kind === 'tele') {
        const x = o.x / PX - cx, y = o.y / PX - cy, R = o.r / PX, p = clamp((w.t - o.t0) / (o.at - o.t0), 0, 1);
        b.globalAlpha = 0.2; b.fillStyle = o.col; ell(b, x, y, R, true);
        b.globalAlpha = 0.4; ell(b, x, y, R * p, true);
        g.globalAlpha = 0.6 + 0.4 * Math.sin(t * (10 + p * 20)); g.strokeStyle = o.col; g.lineWidth = 1; ell(g, x, y, R);
        if (o.vine) { g.fillStyle = '#63c74d'; for (let i = 0; i < 6; i++) { const a = i / 6 * TAU + o.x; g.globalAlpha = p; g.fillRect(Math.round(x + Math.cos(a) * R * 0.6), Math.round(y + Math.sin(a) * R * 0.6 * EY - p * 3), 1, Math.round(1 + p * 3)); } }
      } else if (o.kind === 'flood' && o.r) {
        const r = o.r, x0 = r.x * TS / PX - cx, y0 = r.y * TS / PX - cy, ww = r.w * TS / PX, hh = r.h * TS / PX;
        const p = o.fired ? 1 - clamp((w.t - o.at) / 0.8, 0, 1) : clamp((w.t - o.t0) / (o.at - o.t0), 0, 1);
        b.globalAlpha = (o.fired ? 0.55 : 0.08 + p * 0.3) * (o.fired ? p : 1); b.fillStyle = '#0099db'; b.fillRect(Math.round(x0), Math.round(y0), Math.round(ww), Math.round(hh));
        g.globalAlpha = 0.25 + p * 0.3; g.strokeStyle = '#2ce8f5'; g.lineWidth = 1;   // Wellenlinien
        for (let yy = y0 + 6; yy < y0 + hh; yy += 14) { g.beginPath(); for (let xx = x0; xx <= x0 + ww; xx += 4) { const wy = yy + Math.sin(xx * 0.15 + t * 4 + yy) * 1.5; if (xx === x0) g.moveTo(xx, wy); else g.lineTo(xx, wy); } g.stroke(); }
        if (!o.fired) for (const s of o.safes) {   // sichere Kreise: hell und pulsierend
          const sx = s.x / PX - cx, sy = s.y / PX - cy, R = s.r / PX;
          b.globalAlpha = 0.5; b.fillStyle = '#c8f5ff'; ell(b, sx, sy, R, true);
          g.globalAlpha = 0.7 + Math.sin(t * 8) * 0.3; g.strokeStyle = '#ffffff'; g.lineWidth = 2; ell(g, sx, sy, R + Math.sin(t * 6) * 1.5);
        }
      }
    }
    b.globalAlpha = 1; g.globalAlpha = 1;
  }
  function drawTop(dr, w, cx, cy) {
    if (!w.bfx || !w.bfx.length) return;
    const g = dr.g, t = dr.t;
    for (const o of w.bfx) {
      if (o.kind !== 'beam') continue;
      const m = o.from, x = m.x / PX - cx, y = m.y / PX - cy - 10, warm = w.t < o.warm;
      for (let i = 0; i < o.n; i++) {
        const a = o.a + i * Math.PI, x1 = x + Math.cos(a) * o.len / PX, y1 = y + Math.sin(a) * o.len / PX;
        if (warm) { g.globalAlpha = 0.4 + 0.4 * Math.sin(t * 30); g.strokeStyle = '#ff0044'; g.lineWidth = 1; g.setLineDash([3, 3]); g.beginPath(); g.moveTo(x, y); g.lineTo(x1, y1); g.stroke(); g.setLineDash([]); continue; }
        for (const [lw, col, al] of [[o.w / PX * 2, '#68386c', 0.6], [o.w / PX, '#b55088', 0.85], [2, '#ffffff', 1]]) { g.globalAlpha = al; g.strokeStyle = col; g.lineWidth = lw + Math.sin(t * 40) * 0.6; g.beginPath(); g.moveTo(x, y); g.lineTo(x1, y1); g.stroke(); }
      }
    }
    g.globalAlpha = 1;
  }
  // Licht im Dunkeln: Lava, Strahlen, Flut
  function lights(w, Lt) {
    for (const o of w.bfx || []) {
      if (o.kind === 'pool' && o.pk === 'lava') Lt(o.x, o.y, o.r / PX * 1.3, '#f77622', 0.45);
      else if (o.kind === 'tele') Lt(o.x, o.y, o.r / PX, o.col, 0.25);
      else if (o.kind === 'beam' && w.t >= o.warm) for (let i = 0; i < o.n; i++) for (let k = 1; k <= 4; k++) { const a = o.a + i * Math.PI; Lt(o.from.x + Math.cos(a) * o.len * k / 4, o.from.y + Math.sin(a) * o.len * k / 4, 40, '#b55088', 0.5); }
      else if (o.kind === 'flood' && !o.fired) for (const s of o.safes) Lt(s.x, s.y, s.r / PX * 1.4, '#c8f5ff', 0.6);
    }
  }

  // 3D-Look: Warnkreise, Pfützen und sichere Kreise als flache Ringe, Strahlen als Teilchen-Linie (src3d/draw3.js, jedes Bild)
  const POOL3 = { lava: '#f77622', slime: '#3fbf5a', sand: '#e4a672', ink: '#68386c' };
  function rings(w, ring, U) {
    const F = A.FX;
    for (const o of w.bfx || []) {
      if (o.kind === 'tele') { const p = clamp((w.t - o.t0) / (o.at - o.t0), 0, 1); ring(o.x * U, o.y * U, o.r * U, o.col, 0.75, 0.05, EY); ring(o.x * U, o.y * U, o.r * U * p, o.col, 0.4, 0.05, EY); }
      else if (o.kind === 'pool') ring(o.x * U, o.y * U, o.r * U, POOL3[o.pk] || POOL3.slime, 0.55 * clamp((o.until - w.t) / 0.8, 0, 1) * clamp((w.t - o.t0) / 0.3, 0, 1), 0.04, EY);
      else if (o.kind === 'flood' && !o.fired) for (const sf of o.safes) ring(sf.x * U, sf.y * U, sf.r * U, '#ffffff', 0.7 + Math.sin(w.t * 8) * 0.3, 0.06, EY);
      else if (o.kind === 'beam' && F && o.from.alive) {
        const warm = w.t < o.warm;
        for (let i = 0; i < o.n; i++) { const a = o.a + i * Math.PI; for (let k = 1; k <= 14; k++) { const q = k / 14; if ((warm && k % 2) || Math.random() < 0.45) continue; F.part({ add: true, x: o.from.x + Math.cos(a) * o.len * q, y: o.from.y + Math.sin(a) * o.len * q, z: 16, life: 0.1, color: warm ? '#ff0044' : k % 3 ? '#b55088' : '#ffffff', size: warm ? 3 : 4, drag: 0 }); } }
      }
    }
  }

  return { bind, step, tick, drawGround, drawTop, lights, rings };
})();
