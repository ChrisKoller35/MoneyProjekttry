// Der Abstieg – Welten mit Eigenheiten: jede Welt spielt sich anders (Daten in data.js, A.WORLD_FX).
// Graue Gewölbe: Steinschlag (Schatten wächst, Stein kracht, trifft alle). Dschungel: Wolkenbruch (Feuer erlischt, Blitze härter, Schlamm zäh).
// Wüstengrab: Treibsand zieht zur Mitte, Sandsturm weht Helden, Gegner und Geschosse weg. Versunkene Stadt: Strömung im seichten Wasser, Wasser löscht Feuer.
// Vulkanschmiede: Ausbrüche (glühende Kreise, Lava schlägt ein). Abgrund: Finsternis (nur das eigene Licht, rote Augen im Dunkeln).
// Dazu steht in jedem Kampfraum ein Welt-Ding (A.WORLD_FX tool), das die Eigenheit gegen die Gegner dreht: Pfeiler, Blitzstein, Sandhorn,
// Schleuse, Lavafass, Seelenlaterne. Hinlaufen und berühren, einmal je Raum.
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
  const pct = (m) => m.boss ? 0.05 : (m.elite || m.captain || m.traits) ? 0.12 : 0.28;   // Anteil am Leben, den Steine, Lava und Welt-Dinge abziehen
  const noBurn = (e) => { if (e.effects.some(f => f.kind === 'burn')) e.effects = e.effects.filter(f => f.kind !== 'burn'); };

  // ---------- jede Sekunde 60 Mal ----------
  function tick(dt, stopped) {
    const w = W(); if (!w || !w.hero) return;
    const k = kind(w); if (!k) return;
    const s = st(w), h = w.hero, live = w.mons.filter(m => m.alive);
    if (!w.active) s.marks = s.marks.filter(o => o.done);   // Raum gesäubert: nichts schlägt mehr ein
    if (stopped) { for (const o of s.marks) if (!o.done) { o.t0 += dt; o.at += dt; } return; }   // Zeitstopp der Totenmaske: Steine und Lava hängen in der Luft
    if (w.active !== s.room) { s.room = w.active; s.dropT = 2.5; s.lamp = null; s.tool = w.active && w.active.type !== 'boss' ? placeTool(w, s) : null; }   // neuer Kampf: erst durchatmen
    const tl = s.tool;
    if (tl && !tl.used && w.t >= tl.at && h.alive && Math.hypot(h.x - tl.x, (h.y - tl.y) / EY) < h.r + 18) useTool(w, s, tl);
    if (s.teach && w.t >= s.teach.at) { const f = A.WORLD_FX[w.world.id]; s.teachText = A.t(f.tool) + ': ' + A.t(f.toolTip); w.hint = s.teachText; s.teachUntil = w.t + 7; s.teach = null; }   // erstes Welt-Ding der Ebene erklären
    if (s.teachText && (w.t >= s.teachUntil || (tl && tl.used)) && w.hint === s.teachText) { w.hint = ''; s.teachText = null; }
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
    if (h.alive && !o.mine && inEll(o, h)) { const d = api.hit(src, h, h.maxHp * (rock ? 0.1 : 0.11), opts); if (!rock && d > 0) api.addEffect(h, 'burn', Math.max(1, Math.round(h.maxHp * 0.025)), 2.2); }
    for (const m of w.mons.slice()) {
      if (!m.alive || m.spawn > 0 || m.fly || !inEll(o, m)) continue;
      if (o.hit && o.hit.has(m)) continue; (o.hit || (o.hit = new Set())).add(m);   // Kinder, die beim Treffer entstehen (Schleimkönig), nicht gleich mittreffen
      const d = api.hit(src, m, m.maxHp * pct(m) * (o.pow || 1), opts); if (d > 0 && !rock) api.addEffect(m, 'burn', Math.max(1, Math.round(m.maxHp * 0.03)), 2.2);
      if (d > 0 && !m.boss) m.stun = Math.max(m.stun || 0, rock ? 0.5 : 0.25);
    }
    if (A.FX) {
      A.FX.shake(rock ? 0.3 : 0.25);
      if (rock) { A.FX.rocks(o.x, o.y, 9, 26, ['#8b9bb4', '#5a6988', '#c0cbdc']); A.FX.smoke(o.x, o.y, 6, '#8b9bb4', 5); }
      else A.FX.ev('boom', { x: o.x, y: o.y, r: o.r, color: '#f77622' });
    }
    if (A.Sound && rock && A.Sound.stomp) A.Sound.stomp();
  }
  // ---------- Welt-Dinge: einmal je Kampfraum, berühren und die Welt hilft dir ----------
  function placeTool(w, s) {
    const a = w.active, h = w.hero; if (!a || !A.WORLD_FX[w.world.id].tool) return null;
    for (let i = 0; i < 48; i++) {   // erst weit weg vom Helden, später auch näher
      const x0 = (a.x + 2 + Math.random() * Math.max(1, a.w - 4)) * TS, y0 = (a.y + 2 + Math.random() * Math.max(1, a.h - 4)) * TS, [x, y] = api.freeSpot(x0, y0, 14);
      if (tileAt(w, x, y) === 5 || Math.hypot(x - h.x, y - h.y) < (i < 24 ? 150 : 90) || x < a.x * TS + 40 || x > (a.x + a.w) * TS - 40 || y < a.y * TS + 40 || y > (a.y + a.h) * TS - 40) continue;
      const o = { kind: kind(w), x, y, at: w.t + 0.8, used: false };
      if (!s.taught) { s.taught = true; s.teach = o; }   // erstes Mal auf der Ebene: Name und was es tut
      return o;
    }
    return null;
  }
  function useTool(w, s, o) {
    o.used = true; o.usedT = w.t;
    const h = w.hero, k = o.kind, f = A.WORLD_FX[w.world.id], live = w.mons.filter(m => m.alive && !(m.spawn > 0));
    const near = (n, rmax) => live.filter(m => !rmax || Math.hypot(m.x - o.x, m.y - o.y) < rmax).sort((p, q) => Math.hypot(p.x - o.x, p.y - o.y) - Math.hypot(q.x - o.x, q.y - o.y)).slice(0, n);
    const src = { side: 'tool', crit: 0, alive: false, atk: 0, mag: 0, x: o.x, y: o.y };
    api.float(o.x, o.y - 44, A.t(f.tool) + '!', f.col, 16);
    if (A.FX) A.FX.flash(o.x, o.y, 120, f.col, 0.35);
    if (k === 'steinschlag' || k === 'ausbruch') {   // Steine oder Lava auf die nächsten Gegner, dich treffen sie nicht
      const rock = k === 'steinschlag';
      for (const m of near(5)) s.marks.push({ kind: rock ? 'rock' : 'lava', x: m.x, y: m.y, r: rock ? 48 : 54, t0: w.t, at: w.t + 0.75, mine: true, pow: 1.3 });
      if (A.FX) { A.FX.shake(0.25); if (rock) A.FX.rocks(o.x, o.y, 8, 20, ['#8b9bb4', '#5a6988', '#c0cbdc']); else A.FX.ev('boom', { x: o.x, y: o.y, r: 40, color: '#f77622' }); }
      if (A.Sound && A.Sound.stomp) A.Sound.stomp();
    } else if (k === 'regen') {   // Blitze in die nächsten Gegner, im Regen mehr
      for (const m of near(raining(w) ? 5 : 3)) {
        w.bolts.push({ x0: m.x + (Math.random() - 0.5) * 40, y0: m.y - 420, x1: m.x, y1: m.y - 6, life: 0.32, max: 0.32, col: '#c0f8ff', seed: Math.random() * 99 });
        w.bolts.push({ x0: o.x, y0: o.y - 22, x1: m.x, y1: m.y - 10, life: 0.25, max: 0.25, col: '#7fd8ff', seed: Math.random() * 99 });
        const d = api.hit(src, m, m.maxHp * pct(m) * 1.1, { kind: 'magic', zap: true, noCrit: true, noKb: true, color: '#c0f8ff' });
        if (d > 0 && !m.boss) m.stun = Math.max(m.stun || 0, 0.7);
      }
      if (A.FX) A.FX.shake(0.3); if (A.Sound && A.Sound.thunder) A.Sound.thunder();
    } else if (k === 'sturm') {   // Sandböe: alle in der Nähe fliegen weg und sind eine Weile langsam
      for (const m of near(99, 340)) {
        const dx = m.x - o.x, dy = m.y - o.y, d = Math.hypot(dx, dy) || 1, pw = m.boss ? 0 : m.giant ? 0.4 : m.elite ? 0.7 : 1;
        m.kbx = dx / d * 950 * pw; m.kby = dy / d * 950 * pw; m.kbT = 0.15; m.slowUntil = w.t + 3.5; m.slowPow = 0.5;
        api.hit(src, m, m.maxHp * pct(m) * 0.4, { kind: 'phys', noCrit: true, noKb: true, color: '#ead4aa' });
      }
      if (A.FX) { for (let i = 0; i < 40; i++) { const an = Math.random() * TAU, sp = 200 + Math.random() * 260; A.FX.part({ add: false, x: o.x, y: o.y - 8, vx: Math.cos(an) * sp, vy: Math.sin(an) * sp * 0.7, life: 0.7, color: i % 3 ? '#ead4aa' : '#c8945a', drag: 2 }); } A.FX.shake(0.3); }
      if (A.Sound && A.Sound.windup) A.Sound.windup();
    } else if (k === 'stroemung') {   // Welle: alle im Raum umgeworfen, du wirst geheilt und gelöscht
      for (const m of live) { const d = api.hit(src, m, m.maxHp * pct(m) * 0.45, { kind: 'magic', noCrit: true, noKb: true, color: '#2ce8f5' }); if (d > 0 && !m.boss) m.stun = Math.max(m.stun || 0, 1.6); if (A.FX) A.FX.burst(m.x, m.y, 5, { color: ['#2ce8f5', '#ffffff', '#0099db'], smin: 20, smax: 70, z: 2, vz: 140, g: 380, life: 0.6 }); }
      noBurn(h); if (api.heal) api.heal(h, Math.round(h.maxHp * 0.1));
      if (A.FX) { A.FX.part({ kind: 'ring', x: o.x, y: o.y, life: 0.6, size: 420, color: '#2ce8f5', add: true }); A.FX.shake(0.35); }
    } else if (k === 'finsternis') {   // Laterne: blendet alle im Licht, sie nehmen mehr Schaden; der Raum bleibt hell
      for (const m of near(99, 300)) { if (!m.boss) m.stun = Math.max(m.stun || 0, 2); m.litUntil = w.t + 8; }
      s.lamp = { x: o.x, y: o.y };
      if (A.FX) { A.FX.flash(o.x, o.y, 300, '#fee761', 0.7); A.FX.part({ kind: 'ring', x: o.x, y: o.y, life: 0.5, size: 600, color: '#fee761', add: true }); }
    }
  }
  // ---------- für die Endphase der Bosse (bosses.js) ----------
  // ein Stein oder Lavabrocken an (x, y), mit der üblichen Vorwarnung
  function drop(kind, x, y) { const w = W(); if (!w) return; const s = st(w), rock = kind === 'rock', [fx, fy] = api.freeSpot(x, y, 10); s.marks.push({ kind: rock ? 'rock' : 'lava', x: fx, y: fy, r: rock ? 44 : 50, t0: w.t, at: w.t + (rock ? 1.25 : 1.35) }); }
  // Regen oder Sandsturm bleiben an, bis der Boss fällt
  function force() { const w = W(), k = kind(w); if (!k) return; const s = st(w); s.forced = true; if (k === 'regen' || k === 'sturm') { if (!s.on) { s.on = true; s.start = w.t; s.wind = Math.random() < 0.5 ? -1 : 1; } s.until = w.t + 1e6; s.flipT = w.t + 3; } }
  // Licht aus (Wächter): einige Sekunden fast völlige Dunkelheit
  function blackout(sec) { const w = W(); if (!w) return; const s = st(w); s.blackUntil = w.t + sec; s.forced = true; }
  // Schaden: im Regen treffen Blitze härter; wen die Seelenlaterne blendet, der nimmt mehr Schaden
  function pre(from, to, opts) {
    const w = W(); let mul = 1;
    if (opts && opts.zap && raining()) mul *= 1.3;
    if (w && to.side === 'enemy' && to.litUntil > w.t) mul *= 1.25;
    return mul !== 1 ? { mul } : null;
  }
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
    if (s.tool) drawTool(b, g, t, w, s.tool, cx, cy);
    b.globalAlpha = 1; g.globalAlpha = 1;
  }
  // Welt-Dinge, aus Rechtecken gemalt (Fuss bei x, y)
  function drawTool(b, g, t, w, o, cx, cy) {
    const x = Math.round(o.x / PX - cx), y = Math.round(o.y / PX - cy), used = o.used, col = A.WORLD_FX[w.world.id].col;
    const fade = clamp(1 - (o.at - w.t) / 0.8, 0, 1); if (fade <= 0) return;
    const R = (c, x0, y0, ww, hh) => { b.fillStyle = c; b.fillRect(x + x0, y + y0, ww, hh); };
    const G = (c, a, x0, y0, ww, hh) => { g.globalAlpha = a * fade; g.fillStyle = c; g.fillRect(x + x0, y + y0, ww, hh); };
    const pulse = 0.5 + 0.5 * Math.sin(t * 5);
    b.globalAlpha = 0.35 * fade; b.fillStyle = '#08060e'; b.beginPath(); b.ellipse(x, y, 8, 2.5, 0, 0, TAU); b.fill();
    b.globalAlpha = fade;
    if (o.kind === 'steinschlag') {
      if (!used) { R('#3a4466', -6, -3, 12, 3); R('#8b9bb4', -4, -19, 8, 16); R('#c0cbdc', -4, -19, 2, 16); R('#5a6988', 2, -19, 2, 16); R('#5a6988', -6, -22, 12, 3); R('#c0cbdc', -6, -22, 12, 1); R('#262b44', -1, -16, 1, 3); R('#262b44', 0, -13, 1, 2); R('#262b44', -1, -11, 1, 3); R('#262b44', 1, -9, 1, 2); }
      else { R('#3a4466', -6, -3, 12, 3); R('#8b9bb4', -4, -8, 8, 5); R('#c0cbdc', -4, -8, 2, 5); R('#5a6988', 4, -4, 4, 3); R('#8b9bb4', -9, -3, 3, 2); R('#5a6988', 6, -2, 3, 2); }
    } else if (o.kind === 'regen') {
      R('#3a4466', -4, -18, 8, 15); R('#3a4466', -3, -21, 6, 3); R('#3a4466', -2, -23, 4, 2); R('#5a6988', -4, -18, 2, 15); R('#5a6988', -3, -21, 1, 3); R('#3e8948', -4, -6, 8, 3); R('#63c74d', -4, -6, 3, 1); R('#262b44', -5, -3, 10, 2);
      if (!used) { const a = 0.55 + 0.45 * pulse; G('#7fd8ff', a, -1, -17, 2, 3); G('#7fd8ff', a, 0, -14, 2, 3); G('#7fd8ff', a, -1, -11, 2, 3); G('#ffffff', a * 0.6, 0, -14, 1, 1); }
      else { R('#181425', -1, -17, 2, 3); R('#181425', 0, -14, 2, 3); R('#181425', -1, -11, 2, 3); }
    } else if (o.kind === 'sturm') {
      R('#733e39', -5, -8, 1, 6); R('#733e39', 4, -8, 1, 6); R('#733e39', -5, -9, 10, 2);
      if (used) b.globalAlpha = 0.6 * fade;
      R('#c8945a', -7, -13, 3, 2); R('#ead4aa', -4, -14, 4, 3); R('#ead4aa', 0, -15, 3, 5); R('#ead4aa', 3, -17, 4, 9); R('#c8945a', 5, -16, 2, 7); R('#feae34', 1, -15, 1, 5); R('#ffffff', -3, -14, 3, 1);
      b.globalAlpha = fade; if (used) { R('#c8945a', -8, -2, 16, 2); R('#ead4aa', -5, -3, 10, 1); }
    } else if (o.kind === 'stroemung') {
      R('#0099db', -7, -3, 14, 2); R('#733e39', -7, -16, 2, 14); R('#733e39', 5, -16, 2, 14);
      const py = used ? -24 : -14;
      R('#a05b53', -5, py, 10, 10); R('#733e39', -5, py + 3, 10, 1); R('#733e39', -5, py + 6, 10, 1); R('#be4a2f', -5, py, 10, 1);
      R('#8b9bb4', -3, -20 + (used ? -10 : 0), 6, 1); R('#8b9bb4', -3, -17 + (used ? -10 : 0), 6, 1); R('#8b9bb4', -3, -20 + (used ? -10 : 0), 1, 4); R('#8b9bb4', 2, -20 + (used ? -10 : 0), 1, 4); R('#c0cbdc', -1, -19 + (used ? -10 : 0), 2, 2);
      if (used) { R('#2ce8f5', -5, -12, 10, 9); R('#c0f8ff', -5 + Math.floor((t * 12) % 9), -11, 2, 1); R('#c0f8ff', -4 + Math.floor((t * 9 + 4) % 8), -7, 2, 1); }
    } else if (o.kind === 'ausbruch') {
      if (!used) { R('#733e39', -5, -14, 10, 12); R('#a05b53', -3, -14, 1, 12); R('#a05b53', 1, -14, 1, 12); R('#3a4466', -5, -12, 10, 1); R('#3a4466', -5, -5, 10, 1); R('#3a4466', -5, -3, 10, 1); G('#feae34', 0.7 + 0.3 * pulse, -4, -15, 8, 2); G('#f77622', 0.8, 2, -13, 1, 3 + Math.floor(pulse * 2)); }
      else { G('#f77622', 0.45 + 0.2 * pulse, -7, -3, 14, 3); R('#733e39', -6, -6, 3, 4); R('#733e39', 3, -5, 3, 3); R('#3a4466', -1, -4, 3, 1); }
    } else if (o.kind === 'finsternis') {
      R('#262b44', -3, -3, 6, 2); R('#262b44', -1, -24, 2, 22); R('#262b44', -1, -24, 6, 1); R('#3a4466', 3, -23, 5, 7); R('#262b44', 3, -16, 5, 1);
      if (used) { G('#fee761', 0.9, 4, -22, 3, 5); G('#ffffff', 0.8, 5, -21, 1, 2); } else { R('#5a3c6e', 4, -22, 3, 5); G('#b55088', 0.3 + 0.3 * pulse, 4, -22, 3, 5); }
    }
    // noch nicht benutzt: Ring am Boden und ein hüpfender Pfeil
    if (!used && w.t >= o.at) {
      g.globalAlpha = 0.25 + 0.35 * pulse; g.strokeStyle = col; g.lineWidth = 1; g.beginPath(); g.ellipse(x + 0.5, y + 0.5, 11, 11 * EY, 0, 0, TAU); g.stroke();
      const ay = y - 34 + Math.round(Math.sin(t * 4) * 2); g.globalAlpha = 0.9; g.fillStyle = col; g.fillRect(x - 2, ay, 5, 1); g.fillRect(x - 1, ay + 1, 3, 1); g.fillRect(x, ay + 2, 1, 1);
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
        if (!m.alive || m.spawn > 0 || Math.hypot(m.x - h.x, m.y - h.y) < (s.blackUntil > w.t ? 70 : 200) || (s.lamp && Math.hypot(m.x - s.lamp.x, m.y - s.lamp.y) < 280)) continue;   // ausserhalb des eigenen Lichts und der Laterne
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
    const o = s.tool, col = A.WORLD_FX[w.world.id].col;
    if (o && w.t >= o.at) { if (!o.used) Lt(o.x, o.y - 24, 26, k === 'finsternis' ? '#b55088' : col, 0.35); else if (k === 'ausbruch') Lt(o.x, o.y, 28, '#f77622', 0.5); }
    if (s.lamp) { Lt(s.lamp.x + 10, s.lamp.y - 40, 230, '#fee761', 0.9); Lt(s.lamp.x + 10, s.lamp.y - 40, 70, '#ffffff', 0.5); }
    if (k === 'finsternis' && h.alive) { const bl = s.blackUntil > w.t; Lt(h.x, h.y - 8, bl ? 64 : 118, '#d8b0ff', 0.75); Lt(h.x, h.y - 8, bl ? 34 : 60, '#ffffff', 0.3); }
  }
  // Hinweis beim Betreten der Welt (Oberfläche)
  function tip(w) { const f = info(w); return f ? A.t(f.tip) : ''; }
  function nameOf(w) { const f = info(w); return f ? A.t(f.name) : ''; }

  return { bind, kind, info, tick, drop, useTool, force, blackout, pre, slow, ambient, drawGround, drawTop, lights, tip, nameOf, raining, storm, flow, sandMid };
})();
