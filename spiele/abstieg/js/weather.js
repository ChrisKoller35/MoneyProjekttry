// Der Abstieg – Welten mit Eigenheiten: jede Welt spielt sich anders (Daten in data.js, A.WORLD_FX).
// Graue Gewölbe: Steinschlag (Schatten wächst, Stein kracht, trifft alle). Dschungel: Wolkenbruch (Feuer erlischt, Blitze härter, Schlamm zäh).
// Wüstengrab: Treibsand zieht zur Mitte, Sandsturm weht Helden, Gegner und Geschosse weg. Versunkene Stadt: Strömung im seichten Wasser, Wasser löscht Feuer.
// Vulkanschmiede: Ausbrüche (glühende Kreise, Lava schlägt ein). Abgrund: Finsternis (nur das eigene Licht, rote Augen im Dunkeln).
// Nichts davon steht im Spielstand: alles läuft nur während der Ebene.
'use strict';
window.A = window.A || {};

A.Weather = (function () {
  const PX = 2, TAU = Math.PI * 2, TS = 32;
  const L = (de, en) => (A.LANG === 'de' ? de : en);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const rnd = (a, b) => a + Math.random() * (b - a);
  const hash = (x, y) => { let h = Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
  let api = null;
  const W = () => api && api.W;
  function bind(a) { api = a; }

  // Welche Eigenheit hat die laufende Ebene? (Steinschlag erst ab Ebene 2: die allererste Ebene bleibt ruhig)
  function kind(w) { w = w || W(); const f = w && A.WORLD_FX[w.world.id]; if (!f || (f.from && w.floor < f.from)) return null; return f.id; }
  function info(w) { w = w || W(); return w && kind(w) ? A.WORLD_FX[w.world.id] : null; }
  // Spätere Durchgänge (Welten II, III …): alles kommt öfter
  function pace(w) { return 1 + 0.25 * Math.min(4, A.worldRound(w.floor)); }
  function st(w) { return w.wx || (w.wx = { on: false, next: w.t + rnd(10, 16), until: 0, wind: 0, dropT: 3, marks: [], drops: [] }); }
  function raining(w) { w = w || W(); return !!w && kind(w) === 'regen' && st(w).on; }
  function storm(w) { w = w || W(); return !!w && kind(w) === 'sturm' && st(w).on; }
  const pushable = (e) => e.alive && !e.fly && !e.boss && !e.rooted && !(e.spawn > 0) && e.state !== 'leap';
  // Schieben (Strömung, Treibsand, Wind): nie im Boss-Raum (Flut des Kraken, Pharao), und wer gebremst oder festgehalten ist, wird nur sanft geschoben – er soll immer rauskommen
  const pushMul = (w, e) => (w.active && w.active.type === 'boss') ? 0 : (e.rootUntil > w.t || e.stun > 0 || (e.slowUntil && e.slowUntil > w.t)) ? 0.3 : 1;
  const EY = 0.6;   // Warnkreise sind flache Ellipsen (wie bei Bossen und Elite): Treffer genau in der gezeichneten Fläche
  const inEll = (o, e) => { const R = o.r + (e.r || 0) * 0.6, dx = (e.x - o.x) / R, dy = (e.y - o.y) / (R * EY); return dx * dx + dy * dy < 1; };
  // Farben mischen (Grundlicht blendet mit dem Wetter über)
  const mix = (a, b, k) => { const p = (h) => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)); const A1 = p(a), B1 = p(b); return '#' + A1.map((v, i) => Math.round(v + (B1[i] - v) * k).toString(16).padStart(2, '0')).join(''); };
  const tileAt = (w, x, y) => { const tx = Math.floor(x / TS), ty = Math.floor(y / TS); return (w.tiles[ty] || [])[tx]; };
  const onHaz = (w, e) => tileAt(w, e.x, e.y + (e.r || 0) * 0.5) === 5;
  const noBurn = (e) => { if (e.effects.some(f => f.kind === 'burn')) e.effects = e.effects.filter(f => f.kind !== 'burn'); };

  // ---------- jede Sekunde 60 Mal ----------
  function tick(dt, stopped) {
    const w = W(); if (!w || !w.hero) return;
    const k = kind(w); if (!k) return;
    const s = st(w), h = w.hero, live = w.mons.filter(m => m.alive);
    if (!w.active) s.marks = s.marks.filter(o => o.done);   // Raum gesäubert: nichts schlägt mehr ein
    if (stopped) { for (const o of s.marks) if (!o.done) { o.t0 += dt; o.at += dt; } return; }   // Zeitstopp der Totenmaske: Steine und Lava hängen in der Luft
    if (w.active !== s.room) { s.room = w.active; s.dropT = 2.5; }   // neuer Kampf: erst durchatmen
    // Wetter, das kommt und geht: Wolkenbruch und Sandsturm
    // Endphase eines Bosses (bosses.js): Wetter bleibt, bis der Boss fällt
    if (s.forced && !w.mons.some(m => m.boss && m.alive)) { s.forced = false; s.until = Math.min(s.until, w.t + 1); s.blackUntil = 0; }
    if (s.forced && k === 'sturm' && w.t >= s.flipT) { s.flipT = w.t + 3; s.wind = -s.wind; }
    if (k === 'regen' || k === 'sturm') {
      if (!s.on && w.t >= s.next) {
        s.on = true; s.start = w.t; s.until = w.t + (k === 'regen' ? 9 : 7); s.wind = (Math.random() < 0.5 ? -1 : 1);
        api.float(h.x, h.y - 52, k === 'regen' ? L('Wolkenbruch!', 'Downpour!') : L('Sandsturm!', 'Sandstorm!'), A.WORLD_FX[w.world.id].col, 17);
        if (A.Sound && A.Sound.thunder && k === 'regen') A.Sound.thunder(); else if (A.Sound && A.Sound.windup) A.Sound.windup();
        if (k === 'regen' && A.FX) A.FX.flash(h.x, h.y, 400, '#c0f8ff', 0.25);
      } else if (s.on && w.t >= s.until) { s.on = false; s.next = w.t + rnd(16, 24) / pace(w); }
    }
    if (k === 'regen' && s.on) { noBurn(h); for (const m of live) noBurn(m); }
    if (k === 'sturm') {
      // Treibsand zieht zur Mitte des Flecks
      for (const e of [h, ...live]) { if (!pushable(e) || !onHaz(w, e)) continue; const c = sandMid(w, e); const dx = c[0] - e.x, dy = c[1] - e.y, d = Math.hypot(dx, dy); const k2 = 28 * pushMul(w, e) * dt; if (d > 6 && k2) api.moveEnt(e, dx / d * k2, dy / d * k2); }
      if (s.on) {
        const wx = s.wind * 32 * dt;
        for (const e of [h, ...live]) if (pushable(e) && pushMul(w, e)) api.moveEnt(e, wx * pushMul(w, e), Math.sin(w.t * 1.3) * 6 * dt * pushMul(w, e));
        for (const sh of w.shots) if (!sh.opts.lob) sh.vx += s.wind * 150 * dt;
      }
    }
    if (k === 'stroemung') {
      for (const e of [h, ...live]) {
        if (!e.alive || e.fly || !onHaz(w, e)) continue;
        noBurn(e);
        if (!pushable(e)) continue;
        const [dx, dy] = flow(w, e.x, e.y), k2 = 55 * pushMul(w, e) * dt; if (k2) api.moveEnt(e, dx * k2, dy * k2);
      }
    }
    // Von oben: Steinschlag und Lava – nur, wenn gekämpft wird
    if ((k === 'steinschlag' || k === 'ausbruch') && w.active && h.alive) {
      s.dropT -= dt;
      if (s.dropT <= 0) {
        const rock = k === 'steinschlag', R = rock ? 44 : 50, warn = rock ? 1.25 : 1.35;
        s.dropT = (rock ? rnd(5.5, 7.5) : rnd(6.5, 8.5)) / pace(w);
        const spots = [[h.x + rnd(-26, 26), h.y + rnd(-14, 14)]];
        const tg = live.filter(m => !(m.spawn > 0));
        if (rock) { if (tg.length && Math.random() < 0.6) { const m = tg[Math.floor(Math.random() * tg.length)]; spots.push([m.x + rnd(-20, 20), m.y + rnd(-15, 15)]); } }
        else for (let i = 0; i < 2; i++) { const a = w.active, x = (a.x + 1 + Math.random() * (a.w - 2)) * TS, y = (a.y + 1 + Math.random() * (a.h - 2)) * TS; spots.push([x, y]); }
        for (const [x0, y0] of spots) { const [x, y] = api.freeSpot(x0, y0, 10); s.marks.push({ kind: rock ? 'rock' : 'lava', x, y, r: R, t0: w.t, at: w.t + warn }); }
        if (A.Sound && A.Sound.windup) A.Sound.windup();
      }
    }
    // Einschlag
    for (const o of s.marks) if (w.t >= o.at && !o.done) { o.done = true; impact(w, o); }
    s.marks = s.marks.filter(o => !o.done || w.t < o.at + 0.5);
  }
  // Mitte des Treibsand-Flecks unter einer Figur: zusammenhängende Kacheln einmal suchen, dann gemerkt
  function sandMid(w, e) {
    const tx = Math.floor(e.x / TS), ty = Math.floor((e.y + (e.r || 0) * 0.5) / TS), MW = w.tiles[0].length, s = st(w), key = ty * MW + tx;
    const memo = s.sand || (s.sand = {});
    if (memo[key]) return memo[key];
    if ((w.tiles[ty] || [])[tx] !== 5) return [e.x, e.y];
    const todo = [[tx, ty]], seen = new Set([key]), cells = [];
    while (todo.length && cells.length < 400) {
      const [x, y] = todo.pop(); cells.push([x, y]);
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy, k = ny * MW + nx; if (!seen.has(k) && (w.tiles[ny] || [])[nx] === 5) { seen.add(k); todo.push([nx, ny]); } }
    }
    const ax = cells.reduce((a, c) => a + c[0] + 0.5, 0) / cells.length, ay = cells.reduce((a, c) => a + c[1] + 0.5, 0) / cells.length;
    let best = cells[0], bd = 1e9; for (const c of cells) { const d = (c[0] + 0.5 - ax) ** 2 + (c[1] + 0.5 - ay) ** 2; if (d < bd) { bd = d; best = c; } }   // Mitte liegt immer auf Sand (Ring- und U-Formen)
    const mid = [(best[0] + 0.5) * TS, (best[1] + 0.5) * TS];
    for (const [x, y] of cells) memo[y * MW + x] = mid;
    return mid;
  }
  // Strömung: jede Zelle der Karte fliesst in eine eigene Richtung (fest je Ebene)
  function flow(w, x, y) {
    const cx = Math.floor(x / TS / A.World.CW), cy = Math.floor(y / TS / A.World.CH), a = Math.floor(hash(cx + w.seed % 97, cy * 7 + w.floor) * 4) * Math.PI / 2 + 0.35;
    return [Math.cos(a), Math.sin(a)];
  }
  function impact(w, o) {
    const h = w.hero, rock = o.kind === 'rock';
    const src = { side: o.kind, crit: 0, alive: false, atk: 0, mag: 0 };
    const opts = { kind: rock ? 'phys' : 'magic', noCrit: true, noKb: true, color: rock ? '#c0cbdc' : '#f77622' };
    if (h.alive && inEll(o, h)) { const d = api.hit(src, h, h.maxHp * (rock ? 0.1 : 0.11), opts); if (!rock && d > 0) api.addEffect(h, 'burn', Math.max(1, Math.round(h.maxHp * 0.025)), 2.2); }
    for (const m of w.mons.slice()) {
      if (!m.alive || m.spawn > 0 || m.fly || !inEll(o, m)) continue;
      if (o.hit && o.hit.has(m)) continue; (o.hit || (o.hit = new Set())).add(m);   // Kinder, die beim Treffer entstehen (Schleimkönig), nicht gleich mittreffen
      const pct = m.boss ? 0.05 : (m.elite || m.captain || m.traits) ? 0.12 : 0.28;
      const d = api.hit(src, m, m.maxHp * pct, opts); if (d > 0 && !rock) api.addEffect(m, 'burn', Math.max(1, Math.round(m.maxHp * 0.03)), 2.2);
      if (d > 0 && !m.boss) m.stun = Math.max(m.stun || 0, rock ? 0.5 : 0.25);
    }
    if (A.FX) {
      A.FX.shake(rock ? 0.3 : 0.25);
      if (rock) { A.FX.rocks(o.x, o.y, 9, 26, ['#8b9bb4', '#5a6988', '#c0cbdc']); A.FX.smoke(o.x, o.y, 6, '#8b9bb4', 5); }
      else A.FX.ev('boom', { x: o.x, y: o.y, r: o.r, color: '#f77622' });
    }
    if (A.Sound && rock && A.Sound.stomp) A.Sound.stomp();
  }
  // ---------- für die Endphase der Bosse (bosses.js) ----------
  // ein Stein oder Lavabrocken an (x, y), mit der üblichen Vorwarnung
  function drop(kind, x, y) { const w = W(); if (!w) return; const s = st(w), rock = kind === 'rock', [fx, fy] = api.freeSpot(x, y, 10); s.marks.push({ kind: rock ? 'rock' : 'lava', x: fx, y: fy, r: rock ? 44 : 50, t0: w.t, at: w.t + (rock ? 1.25 : 1.35) }); }
  // Regen oder Sandsturm bleiben an, bis der Boss fällt
  function force() { const w = W(), k = kind(w); if (!k) return; const s = st(w); s.forced = true; if (k === 'regen' || k === 'sturm') { if (!s.on) { s.on = true; s.start = w.t; s.wind = Math.random() < 0.5 ? -1 : 1; } s.until = w.t + 1e6; s.flipT = w.t + 3; } }
  // Licht aus (Wächter): einige Sekunden fast völlige Dunkelheit
  function blackout(sec) { const w = W(); if (!w) return; const s = st(w); s.blackUntil = w.t + sec; s.forced = true; }
  // Schaden: im Regen treffen Blitze härter
  function pre(from, to, opts) { return opts && opts.zap && raining() ? { mul: 1.3 } : null; }
  // Gefahr-Boden: im Regen wird Schlamm zäher
  function slow(hz, base) { return hz === 'mud' && raining() ? Math.min(base, 0.45) : base; }
  // Grundlicht: Finsternis im Abgrund, Regen und Sandsturm dunkeln ab
  function ambient(col) {
    const w = W(), k = w && kind(w); if (!k) return col;
    if (k === 'finsternis') return st(w).blackUntil > w.t ? '#07050b' : w.active && w.active.type === 'boss' ? '#2a2040' : '#16111f';   // Wächter-Endphase: Licht aus
    const s = st(w), f = s.on ? clamp((s.until - w.t) / 1, 0, 1) * clamp((w.t - s.start) / 1, 0, 1) : 0;   // weich über- und ausblenden
    if (k === 'regen' && f > 0) return mix(col, '#2c4436', f);
    if (k === 'sturm' && f > 0) return mix(col, '#6a5644', f);
    return col;
  }

  // ---------- Zeichnen ----------
  function drawGround(dr, w, cx, cy) {
    const k = kind(w); if (!k) return;
    const b = dr.b, g = dr.g, t = dr.t, s = st(w);
    // Warnungen: wachsender Schatten (Stein) oder glühender Kreis (Lava)
    for (const o of s.marks) {
      if (o.done) continue;
      const q = clamp((w.t - o.t0) / (o.at - o.t0), 0, 1), x = Math.round(o.x / PX - cx), y = Math.round(o.y / PX - cy), R = o.r / PX;
      if (o.kind === 'rock') {
        b.globalAlpha = 0.25 + 0.45 * q; b.fillStyle = '#08060e'; b.beginPath(); b.ellipse(x, y, R * (0.35 + 0.65 * q), R * EY * (0.35 + 0.65 * q), 0, 0, TAU); b.fill();
        g.globalAlpha = 0.25 + 0.4 * q; g.strokeStyle = '#c0cbdc'; g.lineWidth = 1; g.beginPath(); g.ellipse(x + 0.5, y + 0.5, R, R * EY, 0, 0, TAU); g.stroke();
      } else {
        b.globalAlpha = 0.18 + 0.3 * q; b.fillStyle = '#be4a2f'; b.beginPath(); b.ellipse(x, y, R * q, R * EY * q, 0, 0, TAU); b.fill();
        g.globalAlpha = 0.45 + 0.45 * Math.abs(Math.sin(t * (6 + q * 14))); g.strokeStyle = q > 0.7 ? '#fee761' : '#f77622'; g.lineWidth = 1; g.beginPath(); g.ellipse(x + 0.5, y + 0.5, R, R * EY, 0, 0, TAU); g.stroke();
      }
    }
    // Strömung und Treibsand: bewegte Striche und Wirbel auf dem Gefahr-Boden
    if (k === 'stroemung' || k === 'sturm') {
      const T = 16, x0 = Math.max(0, Math.floor(cx / T)), y0 = Math.max(0, Math.floor(cy / T)), x1 = Math.min(A.World.MW - 1, Math.ceil((cx + dr.bw) / T)), y1 = Math.min(A.World.MH - 1, Math.ceil((cy + dr.bh) / T));
      for (let ty = y0; ty <= y1; ty++) for (let tx = x0; tx <= x1; tx++) {
        if (w.tiles[ty][tx] !== 5) continue;
        const px = tx * T - cx, py = ty * T - cy, ph = hash(tx, ty);
        if (k === 'stroemung') {
          const [fx, fy] = flow(w, (tx + 0.5) * TS, (ty + 0.5) * TS);
          for (let i = 0; i < 2; i++) { const q = ((t * 0.9 + ph + i * 0.5) % 1), ox = 8 + fx * (q - 0.5) * 16 + (i ? 3 : -3) * fy, oy = 8 + fy * (q - 0.5) * 16 + (i ? -3 : 3) * fx; g.globalAlpha = 0.5 * Math.sin(q * Math.PI); g.fillStyle = '#c0f8ff'; g.fillRect(Math.round(px + ox), Math.round(py + oy), Math.abs(fx) > 0.5 ? 3 : 1, Math.abs(fx) > 0.5 ? 1 : 3); }
        } else {
          const [mx, my] = sandMid(w, { x: (tx + 0.5) * TS, y: (ty + 0.5) * TS, r: 0 }); const ang = t * 1.2 + ph * TAU, rr = 3 + (ph * 4);
          const vx = (mx / PX - cx) - (px + 8), vy = (my / PX - cy) - (py + 8), q = (t * 0.4 + ph) % 1;
          b.globalAlpha = 0.5; b.fillStyle = '#6e4a2a'; b.fillRect(Math.round(px + 8 + Math.cos(ang) * rr + vx * q * 0.6), Math.round(py + 8 + Math.sin(ang) * rr * 0.6 + vy * q * 0.6), 2, 1);
        }
      }
    }
    b.globalAlpha = 1; g.globalAlpha = 1;
  }
  function drawTop(dr, w, cx, cy) {
    const k = kind(w); if (!k) return;
    const b = dr.b, g = dr.g, t = dr.t, s = st(w), bw = dr.bw, bh = dr.bh;
    // fallende Steine und Lavabrocken
    for (const o of s.marks) {
      if (o.done) continue;
      const left = o.at - w.t; if (left > 0.4) continue;
      const z = left / 0.4 * 110, x = Math.round(o.x / PX - cx), y = Math.round(o.y / PX - cy - z);
      if (o.kind === 'rock') { b.globalAlpha = 1; b.fillStyle = '#181425'; b.fillRect(x - 5, y - 9, 11, 10); b.fillStyle = '#5a6988'; b.fillRect(x - 4, y - 8, 9, 8); b.fillStyle = '#8b9bb4'; b.fillRect(x - 4, y - 8, 6, 3); b.fillStyle = '#c0cbdc'; b.fillRect(x - 3, y - 8, 2, 1); }
      else { g.globalAlpha = 0.6; g.fillStyle = '#f77622'; g.fillRect(x - 1, y - 14, 3, 12); g.globalAlpha = 1; g.fillStyle = '#feae34'; g.fillRect(x - 3, y - 5, 7, 6); g.fillStyle = '#fee761'; g.fillRect(x - 1, y - 4, 3, 3); }
    }
    // Regen: schräge Striche über das ganze Bild, Spritzer am Boden
    if (k === 'regen' && s.on) {
      const fade = clamp((s.until - w.t) / 1, 0, 1) * clamp((w.t - s.start) / 1, 0, 1);
      // auf der Leucht-Ebene: das dunkle Regenlicht schluckt sie sonst
      g.strokeStyle = '#9fc8ff'; g.lineWidth = 1;
      for (let grp = 0; grp < 3; grp++) {   // drei Helligkeiten, je ein Pfad
        g.globalAlpha = (0.22 + grp * 0.08) * fade; g.beginPath();
        for (let i = grp; i < 120; i += 3) { const x = ((i * 53.7 + t * 50) % (bw + 20)) - 10, y = ((i * 91.3 + t * (300 + (i % 5) * 30)) % (bh + 20)) - 10; g.moveTo(Math.round(x) + 0.5, Math.round(y)); g.lineTo(Math.round(x - 2) + 0.5, Math.round(y + 7)); }
        g.stroke();
      }
      for (let i = 0; i < 16; i++) { const q = (t * 2.5 + i * 0.37) % 1, x = Math.floor(hash(i, Math.floor(t * 2.5 + i * 0.37)) * bw), y = Math.floor(hash(i + 50, Math.floor(t * 2.5 + i * 0.37)) * bh); g.globalAlpha = 0.45 * (1 - q) * fade; g.beginPath(); g.ellipse(x + 0.5, y + 0.5, 1 + q * 3, 0.5 + q * 1.2, 0, 0, TAU); g.stroke(); }
    }
    // Sandsturm: gelber Schleier und Sandschwaden im Wind
    if (k === 'sturm' && s.on) {
      const fade = clamp((s.until - w.t) / 1, 0, 1) * clamp((w.t - s.start) / 1, 0, 1);
      g.globalAlpha = 0.1 * fade; g.fillStyle = '#d8a060'; g.fillRect(0, 0, bw, bh);   // Staubschleier (Leucht-Ebene, sonst schluckt ihn das Licht)
      for (let i = 0; i < 110; i++) {
        const sp = 140 + (i % 7) * 25, x = (((i * 71.3 + s.wind * t * sp) % (bw + 40)) + bw + 40) % (bw + 40) - 20, y = (i * 37.9 + Math.sin(t * 1.5 + i) * 6) % bh;
        g.globalAlpha = (0.2 + (i % 3) * 0.1) * fade; g.fillStyle = i % 4 ? '#ead4aa' : '#c8945a'; g.fillRect(Math.round(x), Math.round(y), 4 + (i % 4) * 2, 1);
      }
    }
    // Finsternis: Gegner im Dunkeln verraten sich durch rote Augen
    if (k === 'finsternis') {
      const h = w.hero;
      for (const m of w.mons) {
        if (!m.alive || m.spawn > 0 || Math.hypot(m.x - h.x, m.y - h.y) < (s.blackUntil > w.t ? 70 : 200)) continue;   // ausserhalb des eigenen Lichts
        const x = Math.round(m.x / PX - cx), y = Math.round(m.y / PX - cy - m.r / PX * 1.6), blink = Math.sin(t * 1.7 + m.x) > 0.95;
        if (blink) continue;
        g.globalAlpha = 0.95; g.fillStyle = '#ff0044'; g.fillRect(x - 3, y, 2, 1); g.fillRect(x + 2, y, 2, 1);
        g.globalAlpha = 0.35; g.fillRect(x - 4, y - 1, 4, 3); g.fillRect(x + 1, y - 1, 4, 3);
      }
    }
    b.globalAlpha = 1; g.globalAlpha = 1;
  }
  function lights(w, Lt) {
    const k = kind(w); if (!k) return;
    const s = st(w), h = w.hero;
    for (const o of s.marks) if (!o.done && o.kind === 'lava') Lt(o.x, o.y, o.r / PX * 1.4, '#f77622', 0.25 + 0.45 * clamp((w.t - o.t0) / (o.at - o.t0), 0, 1));
    if (k === 'finsternis' && h.alive) { const bl = s.blackUntil > w.t; Lt(h.x, h.y - 8, bl ? 64 : 118, '#d8b0ff', 0.75); Lt(h.x, h.y - 8, bl ? 34 : 60, '#ffffff', 0.3); }
  }
  // Hinweis beim Betreten der Welt (Oberfläche)
  function tip(w) { const f = info(w); return f ? A.t(f.tip) : ''; }
  function nameOf(w) { const f = info(w); return f ? A.t(f.name) : ''; }

  return { bind, kind, info, tick, drop, force, blackout, pre, slow, ambient, drawGround, drawTop, lights, tip, nameOf, raining, storm, flow, sandMid };
})();
