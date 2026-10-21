// Der Abstieg – Elite-Gegner mit Eigenschaften (A.ELITE_TRAITS in data.js): je tiefer, desto mehr Eigenschaften,
// jede mit eigener Wirkung, Warnkreis am Boden und eigenem Aussehen. game.js ruft make() beim Bauen des Gegners,
// world.js ruft onAdd/step/onHurt/onDeal/onDeath und tick() einmal pro Bild; draw.js zeichnet.
'use strict';
window.A = window.A || {};

A.Elites = (function () {
  const TAU = Math.PI * 2, PX = 2, EY = 0.6;   // EY: Bodenkreise sind flach (wie bei den Bossen)
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const L = (de, en) => (A.LANG === 'de' ? de : en);
  let api = null;   // Werkzeuge aus world.js: hit, heal, addEffect, float, fx, moveEnt, freeSpot, addMon
  const W = () => api.W;
  function bind(a) { api = a; }
  const TR = (id) => A.ELITE_TRAITS[id];
  const has = (m, id) => !!(m.traits && m.traits.indexOf(id) >= 0);

  // ---------- Auswürfeln ----------
  // Welt 1: eine Eigenschaft, ab Ebene 5 zwei, ab Ebene 15 drei, in den Welten II (ab Ebene 25) eine mehr
  function count(f) { return Math.min(4, 1 + (f >= 5 ? 1 : 0) + (f >= 15 ? 1 : 0) + (A.worldRound(f) >= 1 ? 1 : 0)); }
  function roll(base, n, rng) {
    const out = [], ids = Object.keys(A.ELITE_TRAITS);
    const ok = (id) => !out.includes(id)
      && !(base.rooted && (id === 'flink' || id === 'blinzelnd'))
      && !(base.teleport && id === 'blinzelnd') && !(base.summon && id === 'beschwoerer')
      && !(TR(id).heal && out.some(o => TR(o).heal))   // höchstens eine, die ihn am Leben hält
      && !(id === 'flink' && out.includes('riese')) && !(id === 'riese' && out.includes('flink'));
    for (let k = 0; k < n; k++) { const pool = ids.filter(ok); if (!pool.length) break; out.push(rng.pick(pool)); }
    return out;
  }
  // Werte beim Bauen (game.js monsterEntity; Leben und Angriff einer Elite sind dort schon erhöht); forced: feste Eigenschaften (Probe, Tests)
  function make(e, base, floor, n, rng, forced) {
    const tr = forced ? forced.filter(id => A.ELITE_TRAITS[id]) : roll(base, n, rng);
    e.traits = tr; e.eliteKind = tr[0]; e.name = A.t(base.name);
    e.maxHp = Math.round(e.maxHp * (1 + 0.12 * (tr.length - 1)));   // mehr Eigenschaften, etwas mehr Leben
    for (const id of tr) {
      if (id === 'flink') e.spd += 5;
      else if (id === 'gepanzert') { e.def += Math.round(6 + floor * 0.5); e.kbImmune = true; }
      else if (id === 'giftig') e.poisonOnHit += 3;
      else if (id === 'feurig') e.burn = Math.max(e.burn, 0.3);
      else if (id === 'frostig') e.slowOnHit = true;
      else if (id === 'beschwoerer') { const pool = A.monsterPool(floor).filter(x => !x.rooted && x.id !== base.id); e.summon = (pool.length ? rng.pick(pool) : base).id; e.summonCd = 7; }
      else if (id === 'blinzelnd') e.teleport = true;
      else if (id === 'vampir') e.lifesteal = 35;
      else if (id === 'riese') { e.giant = true; e.maxHp = Math.round(e.maxHp * 1.6); e.atk = Math.round(e.atk * 1.2); e.mag = Math.round(e.mag * 1.2); e.spd = Math.max(0, e.spd - 1); }
    }
    if (tr.includes('schild')) e.shieldCap = Math.round(e.maxHp * 0.3);
    e.hp = e.maxHp;
    return e;
  }
  // Beim Hinstellen in den Raum (world.js addMon): Zeitgeber, voller Schild
  function onAdd(m) {
    if (!m.traits) return;
    m.ef = { fire: 2 + Math.random() * 2, frost: 2.5 + Math.random() * 2.5, storm: 2 + Math.random() * 2, stomp: 2 + Math.random(), heal: 3, busy: 0, hurtT: -9, spin: Math.random() * TAU, bladeT: 0, trail: 0, lx: m.x, ly: m.y, ghosts: [], gT: 0 };
    if (m.shieldCap) m.shield = m.shieldCap;
  }

  // ---------- Bodenanzeigen ----------
  // W.efx: tele (Warnkreis, wirkt bei 'at'), puddle (Gift- oder Eispfütze), beam (Heilstrahl)
  function add(o) { const w = W(); (w.efx || (w.efx = [])).push(o); return o; }
  const inEll = (b, e, pad) => { const rx = b.r + (pad || 0), ry = rx * EY; return ((e.x - b.x) / rx) ** 2 + ((e.y - b.y) / ry) ** 2 < 1; };
  function near(x, y, spread) { const a = Math.random() * TAU, d = spread * (0.5 + Math.random() * 0.5); const [nx, ny] = api.freeSpot(x + Math.cos(a) * d, y + Math.sin(a) * d * EY * 1.4, 12); return { x: nx, y: ny }; }
  function puddle(src, pk, x, y, r, dur, dmg) {
    const w = W(), mine = (w.efx || []).filter(b => b.kind === 'puddle' && b.src === src);
    if (mine.length >= 10) mine[0].until = Math.min(mine[0].until, w.t + 0.3);   // nicht den ganzen Raum zukleistern
    add({ kind: 'puddle', pk, src, x, y, r, t0: w.t, until: w.t + dur, tick: w.t + 0.2, dmg });
  }
  const say = (m, text, color) => api.float(m.x, m.y - (m.giant ? 86 : 60), text, color, 15);
  // Absender für Treffer, wenn der Gegner schon weg ist (Explosion nach dem Tod)
  const ghostOf = (m) => ({ side: 'enemy', alive: false, x: m.x, y: m.y, r: 0, crit: 5, atk: m.atk, mag: m.mag, name: m.name });
  // Klingenwirbel: drei Klingen auf einer flachen Bahn um den Gegner
  const bladeR = (m) => m.r + 30;
  function blade(m, i) { const a = m.ef.spin + i / 3 * TAU, R = bladeR(m); return { x: m.x + Math.cos(a) * R, y: m.y + Math.sin(a) * R * 0.7 }; }

  // ---------- Fähigkeiten mit Anlauf (aus world.js monSpecial, nicht während einer Betäubung) ----------
  // true = holt gerade aus und steht still
  function step(m, dt, d) {
    const w = W(), h = w.hero, s = m.ef; if (!s) return false;
    if (s.busy > w.t) return true;
    const k = m.raged ? 0.7 : 1;
    s.fire -= dt; s.frost -= dt; s.storm -= dt; s.stomp -= dt; s.heal -= dt;
    if (has(m, 'feurig') && s.fire <= 0 && d < 220) {   // bleibt stehen, glüht auf, Feuerring um sich
      s.fire = 6 * k; s.busy = w.t + 1;
      add({ kind: 'tele', fx: 'fire', from: m, follow: m, x: m.x, y: m.y, r: 100, t0: w.t, at: w.t + 1, dmg: m.atk * 1.3, col: '#f77622' });
      say(m, L('Feuerring!', 'Ring of fire!'), '#f77622'); return true;
    }
    if (has(m, 'riese') && s.stomp <= 0 && d < 160) {   // Stampfer: Kreis um ihn, wirft um
      s.stomp = 6.5 * k; s.busy = w.t + 0.9;
      add({ kind: 'tele', fx: 'stomp', from: m, follow: m, x: m.x, y: m.y, r: 125, t0: w.t, at: w.t + 0.9, dmg: m.atk * 1.3, col: '#e4a672' });
      say(m, L('Stampfer!', 'Stomp!'), '#e4a672'); return true;
    }
    if (has(m, 'frostig') && s.frost <= 0 && d < 420) {   // Eiskreis unter dem Helden
      s.frost = 6.5 * k;
      add({ kind: 'tele', fx: 'frost', from: m, x: h.x, y: h.y, r: 66, t0: w.t, at: w.t + 1.1, dmg: m.atk * 0.8, col: '#9be8ff' });
    }
    if (has(m, 'gewitter') && s.storm <= 0 && d < 460) {   // drei Blitze: unter dem Helden und dort, wo er hinläuft
      s.storm = 5.5 * k;
      for (let i = 0; i < 3; i++) {
        const p = i ? near(h.x + (h.moving ? h.fx * 50 : 0), h.y + (h.moving ? h.fy * 35 : 0), 110) : { x: h.x, y: h.y };
        add({ kind: 'tele', fx: 'storm', from: m, x: p.x, y: p.y, r: 40, t0: w.t, at: w.t + 0.9 + i * 0.18, dmg: m.atk * 1.1, col: '#7fd8ff' });
      }
      say(m, L('Gewitter!', 'Thunderstorm!'), '#7fd8ff');
    }
    if (has(m, 'heiler') && s.heal <= 0) { s.heal = 3.5; healPulse(m); }
    return false;
  }
  // Heiler: heilt verletzte Gegner in der Nähe (grüne Strahlen) und ein wenig sich selbst
  function healPulse(m) {
    const w = W(); let n = 0;
    for (const o of w.mons) {
      if (o === m || !o.alive || o.spawn > 0 || o.hp >= o.maxHp || Math.hypot(o.x - m.x, o.y - m.y) > 190) continue;
      api.heal(o, Math.max(1, Math.round(o.maxHp * 0.12))); n++;
      add({ kind: 'beam', x0: m.x, y0: m.y - 14, x1: o.x, y1: o.y - 12, t0: w.t, until: w.t + 0.45, col: '#c8f5a0' });
    }
    if (m.hp < m.maxHp) { api.heal(m, Math.max(1, Math.round(m.maxHp * 0.04))); n++; }
    if (n && A.FX) { A.FX.part({ kind: 'ring', x: m.x, y: m.y, life: 0.5, size: 190, color: '#c8f5a0', add: true }); A.FX.flash(m.x, m.y, 80, '#63c74d', 0.25); if (A.Sound) A.Sound.heal(); }
  }
  // Getroffen (world.js hit, vor der Todes-Prüfung): Schild-Pause, Funken an der Rüstung, Wut und Spiegelbilder bei halbem Leben
  function onHurt(m, dmg) {
    const w = W(), s = m.ef; if (!s) return;
    s.hurtT = w.t;
    if (dmg > 0 && has(m, 'gepanzert') && A.FX && Math.random() < 0.6) { A.FX.burst(m.x, m.y - 12, 5, { color: ['#ffffff', '#c0cbdc', '#fee761'], smin: 70, smax: 180, life: 0.22, add: true, kind: 'spark', drag: 5 }); if (A.Sound && Math.random() < 0.35) A.Sound.clink(); }
    if (m.hp <= 0 || m.hp >= m.maxHp * 0.5) return;
    if (has(m, 'wuetend') && !m.raged) rage(m);
    if (has(m, 'spiegel') && !m.mirrored) mirror(m);
  }
  function rage(m) {
    m.raged = true; m.speed *= 1.35; m.atk = Math.round(m.atk * 1.35); m.mag = Math.round(m.mag * 1.35); m.spd += 2;
    say(m, L('Rasend!', 'Frenzy!'), '#e43b44');
    if (A.FX) { A.FX.ev('nova', { e: m, r: 90, color: '#e43b44', magic: true }); A.FX.shake(0.3); }
    if (A.Sound) A.Sound.roar();
  }
  function mirror(m) {
    m.mirrored = true; const w = W(), base = A.MONSTERS.find(x => x.id === m.mid); if (!base) return;
    for (let i = 0; i < 2; i++) {
      const c = A.Game.monsterEntity(base, w.floor, false, 70 + i);
      c.maxHp = c.hp = Math.max(1, Math.round(m.maxHp * 0.22)); c.atk = Math.round(m.atk * 0.6); c.mag = Math.round(m.mag * 0.6); c.mirror = true;
      const a = Math.random() * TAU, mm = api.addMon(c, m.x + Math.cos(a) * 46, m.y + Math.sin(a) * 34); mm.spawn = 0.35;
      api.fx('appear', { m: mm });
    }
    say(m, L('Spiegelbilder!', 'Mirror images!'), '#ffffff');
    if (A.FX) A.FX.flash(m.x, m.y, 90, '#ffffff', 0.3);
  }
  // Trifft den Helden (world.js hit): beim Vampir fliegen rote Tropfen zu ihm
  function onDeal(m, to, dmg) {
    if (!(dmg > 0) || !has(m, 'vampir') || !A.FX) return;
    for (let i = 0; i < 6; i++) A.FX.part({ add: true, x: to.x + (Math.random() - 0.5) * 10, y: to.y - 10, vx: (m.x - to.x) * 2.4 + (Math.random() - 0.5) * 40, vy: (m.y - to.y) * 2.4 - 20, life: 0.4, color: Math.random() < 0.5 ? '#e43b44' : '#f6757a', drag: 1, size: 2 });
  }
  // Besiegt (world.js checkDeath): Explosiv platzt kurz danach
  function onDeath(m) {
    if (!has(m, 'explosiv')) return;
    const w = W();
    add({ kind: 'tele', fx: 'bomb', from: ghostOf(m), x: m.x, y: m.y, r: 90, t0: w.t, at: w.t + 1.2, dmg: m.atk * 2, col: '#feae34' });
    api.float(m.x, m.y - 50, L('Gleich knallt es!', 'About to blow!'), '#feae34', 16);
    if (A.Sound) A.Sound.fuse();
  }

  // ---------- Ablauf (einmal pro Bild) ----------
  function tick(dt) {
    const w = W(); if (!w) return; const h = w.hero;
    for (const m of w.mons) {
      const s = m.ef; if (!s || !m.alive || m.spawn > 0) continue;
      // Schild lädt nach, wenn er eine Weile nicht getroffen wurde
      if (m.shieldCap && m.shield <= 0 && w.t - s.hurtT > 4.5) { m.shield = m.shieldCap; api.fx('shield', { e: m }); say(m, L('Schild!', 'Shield!'), '#2ce8f5'); }
      if (has(m, 'klingen')) {
        s.spin += dt * (m.stun > 0 ? 1.5 : 3.4);
        if (h.alive && w.t >= s.bladeT) for (let i = 0; i < 3; i++) { const p = blade(m, i); if (Math.hypot(h.x - p.x, h.y - p.y) < h.r + 9) { s.bladeT = w.t + 0.55; api.hit(m, h, m.atk * 0.45, { kind: 'phys' }); api.fx('wallhit', { x: p.x, y: p.y, color: '#ffffff' }); break; } }
      }
      // Giftspur und Nachbilder nur, wenn er sich bewegt
      const mv = Math.hypot(m.x - s.lx, m.y - s.ly); s.lx = m.x; s.ly = m.y;
      if (has(m, 'giftig') && !m.fly) { s.trail += Math.min(mv, 40); if (s.trail > 30) { s.trail = 0; puddle(m, 'poison', m.x, m.y + 8, 24, 3.5, Math.max(1, Math.round(m.atk * 0.25))); } }
      if (has(m, 'flink') && (s.gT -= dt) <= 0 && mv > 0.3) { s.gT = 0.06; s.ghosts.push({ x: m.x, y: m.y, t: w.t, flip: m.fx < 0 }); if (s.ghosts.length > 5) s.ghosts.shift(); }
      if (m.raged && A.FX && !A.FX.low && Math.random() < dt * 10) A.FX.part({ kind: 'smoke', x: m.x + (Math.random() - 0.5) * m.r, y: m.y - 22, vx: 0, vy: -20, life: 0.5, size: 2, grow: 5, color: '#e43b44', drag: 1 });
      if (s.busy > w.t && A.FX && !A.FX.low && Math.random() < dt * 30) { const c = has(m, 'feurig') ? '#feae34' : '#e4a672', a = Math.random() * TAU; A.FX.part({ add: true, x: m.x + Math.cos(a) * m.r * 1.6, y: m.y + Math.sin(a) * m.r, vx: -Math.cos(a) * 40, vy: -Math.sin(a) * 30, z: 4, vz: 30, life: 0.4, color: c, drag: 1 }); }
    }
    const list = w.efx; if (!list || !list.length) return;
    for (const b of list) {
      if (b.kind === 'tele') {
        if (b.follow) { if (!b.follow.alive) { b.done = true; continue; } b.x = b.follow.x; b.y = b.follow.y; }   // besiegt, bevor er zuschlägt: nichts passiert
        if (w.t >= b.at) { b.done = true; fire(b); }
      } else if (b.kind === 'puddle') {
        if (w.t > b.until) { b.done = true; continue; }
        if (h.alive && !h.fly && w.t >= b.tick && inEll(b, h, 0)) { b.tick = w.t + 0.5; if (b.pk === 'poison') api.addEffect(h, 'poison', b.dmg, 2); else { h.slowUntil = w.t + 0.6; h.slowPow = 0.5; } }
      } else if (w.t > b.until) b.done = true;
    }
    w.efx = list.filter(b => !b.done);
  }
  // Ein Warnkreis ist abgelaufen: jetzt wirkt er
  function fire(b) {
    const w = W(), h = w.hero, me = h.alive && inEll(b, h, 6), F = A.FX, S = A.Sound;
    if (b.fx === 'fire') {
      if (me) { api.hit(b.from, h, b.dmg, { kind: 'magic', color: '#f77622' }); api.addEffect(h, 'burn', Math.max(1, Math.round(b.dmg * 0.15)), 2.5); }
      if (F) { F.ev('nova', { e: { x: b.x, y: b.y }, r: b.r, color: '#f77622', magic: true }); F.burst(b.x, b.y, 22, { color: ['#fee761', '#feae34', '#f77622'], smin: 60, smax: 200, z: 4, vz: 120, g: 160, life: 0.7, add: true }); }
    } else if (b.fx === 'stomp') {
      if (me) { api.hit(b.from, h, b.dmg, { kind: 'phys' }); h.stun = Math.max(h.stun, 0.5); const dx = h.x - b.x, dy = h.y - b.y, dd = Math.hypot(dx, dy) || 1; api.moveEnt(h, dx / dd * 46, dy / dd * 46); api.float(h.x, h.y - 44, L('Umgehauen!', 'Knocked down!'), '#e4a672', 13); }
      if (F) { F.shake(0.55); F.rocks(b.x, b.y, 6, 90); F.part({ kind: 'ring', x: b.x, y: b.y, life: 0.45, size: b.r, color: '#e4a672', add: true }); F.smoke(b.x, b.y + 6, 8, '#8b9bb4', 6); }
      if (S) S.stomp();
    } else if (b.fx === 'frost') {
      if (me) { api.hit(b.from, h, b.dmg, { kind: 'magic', color: '#9be8ff' }); h.rootUntil = w.t + 0.9; h.slowUntil = w.t + 2.2; h.slowPow = 0.5; api.float(h.x, h.y - 44, L('Eingefroren!', 'Frozen!'), '#9be8ff', 14); }
      puddle(b.from, 'ice', b.x, b.y, b.r * 0.9, 4, 0);
      if (F) { F.burst(b.x, b.y, 18, { color: ['#ffffff', '#9be8ff', '#2ce8f5'], smin: 40, smax: 160, z: 2, vz: 120, g: 380, life: 0.6 }); F.part({ kind: 'ring', x: b.x, y: b.y, life: 0.35, size: b.r, color: '#9be8ff', add: true }); F.flash(b.x, b.y, 70, '#9be8ff', 0.25); }
      if (S) S.glass(false);
    } else if (b.fx === 'storm') {
      if (me) api.hit(b.from, h, b.dmg, { kind: 'magic', color: '#7fd8ff' });
      w.bolts.push({ x0: b.x + (Math.random() - 0.5) * 60, y0: b.y - 300, x1: b.x, y1: b.y - 4, life: 0.3, max: 0.3, col: '#c8f5ff', seed: Math.random() * 99 });
      if (F) {
        for (let k = 0; k < 10; k++) F.part({ add: true, x: b.x + (Math.random() - 0.5) * 6, y: b.y, z: k * 14, life: 0.25, color: k % 2 ? '#ffffff' : '#7fd8ff', size: 2, drag: 0 });   // Blitz als Säule
        F.burst(b.x, b.y, 10, { color: ['#ffffff', '#7fd8ff'], smin: 60, smax: 200, life: 0.3, add: true, kind: 'spark', drag: 5 });
        F.flash(b.x, b.y, 90, '#c8f5ff', 0.25); F.shake(0.18); F.decal(b.x, b.y, 'splat', '#262b44', 4);
      }
      if (S) S.thunder();
    } else if (b.fx === 'bomb') {
      if (me) api.hit(b.from, h, b.dmg, { kind: 'phys' });
      for (const o of w.mons) if (o.alive && !(o.spawn > 0) && inEll(b, o, o.r * 0.5)) api.hit(b.from, o, b.dmg * 0.6, { kind: 'magic', color: '#feae34' });   // trifft auch die anderen Gegner
      if (F) { F.ev('boom', { x: b.x, y: b.y, r: b.r, color: '#feae34' }); F.shake(0.5); F.rocks(b.x, b.y, 6, 70, ['#5d275d', '#b13e53', '#f77622']); F.smoke(b.x, b.y, 8, '#5a6988', 6); }
    }
  }

  // ---------- Farbe ----------
  // Schein und Name wechseln langsam durch alle Eigenschaften; rasend: rot, Spiegelbild: weiss
  function col(m, t) {
    if (m.mirror) return '#ffffff';
    if (!m.traits || !m.traits.length) return '#fee761';
    if (m.raged) return '#e43b44';
    const n = m.traits.length;
    return TR(m.traits[n > 1 ? Math.floor((t || 0) * 0.8 + (m.x || 0) * 0.002) % n : 0]).col;
  }

  // ---------- Zeichnen (Retro-Look: b = Bild, g = Leuchten) ----------
  function ell(c, x, y, R, fill) { c.beginPath(); c.ellipse(Math.round(x), Math.round(y), Math.max(0.5, R), Math.max(0.5, R * EY), 0, 0, TAU); if (fill) c.fill(); else c.stroke(); }
  const PUD = { poison: ['#265c42', '#63c74d', 0.42], ice: ['#9be8ff', '#ffffff', 0.3] };
  function drawGround(dr, w, cx, cy) {
    const list = w.efx; if (!list || !list.length) return;
    const b = dr.b, g = dr.g, t = dr.t;
    for (const o of list) {
      if (o.kind === 'beam') continue;
      const x = o.x / PX - cx, y = o.y / PX - cy, R = o.r / PX;
      if (o.kind === 'puddle') {
        const [c1, c2, al] = PUD[o.pk] || PUD.poison, life = clamp((o.until - w.t) / 0.6, 0, 1) * clamp((w.t - o.t0) / 0.25, 0, 1);
        b.globalAlpha = al * life; b.fillStyle = c1; ell(b, x, y, R, true);
        b.globalAlpha = al * 0.7 * life; b.fillStyle = c2; ell(b, x + Math.sin(t * 2 + o.x), y, R * 0.5, true);
        if (o.pk === 'ice') { g.globalAlpha = 0.35 * life; g.strokeStyle = '#ffffff'; g.lineWidth = 1; ell(g, x, y, R); }
        else { g.fillStyle = '#63c74d'; for (let i = 0; i < 3; i++) { const q = (t * 0.7 + i * 0.33 + o.x * 0.01) % 1; g.globalAlpha = (1 - q) * 0.7 * life; g.fillRect(Math.round(x + Math.cos(i * 2.1 + o.x) * R * 0.5), Math.round(y + Math.sin(i * 2.1 + o.x) * R * 0.3 - q * 5), 1, 1); } }
        continue;
      }
      // Warnkreis: füllt sich, bis er wirkt; Bombe blinkt immer schneller
      const p = clamp((w.t - o.t0) / (o.at - o.t0), 0, 1), bl = o.fx === 'bomb' && Math.floor(t * (6 + p * 18)) % 2 ? 0.5 : 1;
      b.globalAlpha = 0.18 * bl; b.fillStyle = o.col; ell(b, x, y, R, true);
      b.globalAlpha = 0.38 * bl; ell(b, x, y, R * p, true);
      g.globalAlpha = 0.6 + 0.4 * Math.sin(t * (10 + p * 20)); g.strokeStyle = o.col; g.lineWidth = 1; ell(g, x, y, R);
      if (o.fx === 'fire') { g.fillStyle = '#feae34'; for (let i = 0; i < 14; i++) { const a = i / 14 * TAU + t; g.globalAlpha = p; g.fillRect(Math.round(x + Math.cos(a) * R), Math.round(y + Math.sin(a) * R * EY - p * 3), 1, Math.round(1 + p * 2)); } }
      else if (o.fx === 'frost') { g.fillStyle = '#ffffff'; for (let i = 0; i < 6; i++) { if ((Math.floor(t * 8) + i) % 3) continue; const a = i * 1.05 + o.x, rr = R * (0.3 + (i % 3) * 0.25); g.globalAlpha = 0.8; g.fillRect(Math.round(x + Math.cos(a) * rr), Math.round(y + Math.sin(a) * rr * EY), 1, 1); } }
      else if (o.fx === 'storm') {   // dunkle Wolke über der Stelle, darin zuckt es
        const yy = y - 30 - (1 - p) * 6; b.globalAlpha = 0.35 + p * 0.35; b.fillStyle = '#262b44'; ell(b, x - 3, yy, 7, true); ell(b, x + 4, yy - 1, 6, true); ell(b, x, yy - 3, 6, true);
        if (Math.random() < 0.2 + p * 0.5) { g.globalAlpha = 0.8; g.fillStyle = '#c8f5ff'; g.fillRect(Math.round(x + (Math.random() - 0.5) * 10), Math.round(yy + 2), 1, 2); }
      }
    }
    b.globalAlpha = 1; g.globalAlpha = 1;
  }
  // über allem: Heilstrahlen
  function drawTop(dr, w, cx, cy) {
    const g = dr.g;
    for (const o of w.efx || []) {
      if (o.kind !== 'beam') continue;
      const a = clamp((o.until - w.t) / 0.45, 0, 1);
      g.globalAlpha = a * 0.8; g.strokeStyle = o.col; g.lineWidth = 2; g.beginPath(); g.moveTo(o.x0 / PX - cx, o.y0 / PX - cy); g.lineTo(o.x1 / PX - cx, o.y1 / PX - cy); g.stroke();
      g.globalAlpha = a; g.strokeStyle = '#ffffff'; g.lineWidth = 1; g.stroke();
    }
    g.globalAlpha = 1;
  }
  // unter der Figur: Nachbilder (Flink)
  function drawUnder(dr, m, spr, cx, cy, sc, lift) {
    const s = m.ef; if (!s || !s.ghosts.length) return;
    const b = dr.b, w = W(), ww = Math.round(spr.w * sc), hh = Math.round(spr.h * sc);
    for (const gh of s.ghosts) {
      const age = w.t - gh.t; if (age > 0.3) continue;
      const k = gh.flip ? 'ghF' : 'gh'; if (!spr[k]) spr[k] = A.Art.silhouette(gh.flip ? A.Art.flipped(spr) : spr.img, '#fee761');
      b.globalAlpha = (1 - age / 0.3) * 0.35; b.drawImage(spr[k], Math.round(gh.x / PX - cx - ww / 2), Math.round(gh.y / PX - cy + (m.giant ? 12 : 8) - lift - hh), ww, hh);
    }
    b.globalAlpha = 1;
  }
  // über der Figur: Schildblase, kreisende Klingen
  function drawOver(dr, m, spr, dx, dy, sx, sy, cx, cy) {
    const b = dr.b, g = dr.g, t = dr.t;
    if (m.shield > 0 && m.shieldCap) {
      const hh = spr.h * sy, R = Math.max(spr.w * sx, hh) * 0.62, yy = dy - hh * 0.5, q = clamp(m.shield / m.shieldCap, 0, 1);
      g.globalAlpha = 0.25 + 0.3 * q + Math.sin(t * 5) * 0.05; g.strokeStyle = '#2ce8f5'; g.lineWidth = 1; g.beginPath(); g.ellipse(Math.round(dx), Math.round(yy), R, R * 0.95, 0, 0, TAU); g.stroke();
      g.globalAlpha = 0.6 * q; g.fillStyle = '#ffffff'; g.fillRect(Math.round(dx - R * 0.5), Math.round(yy - R * 0.6), 2, 1);
      g.globalAlpha = 1;
    }
    if (has(m, 'klingen') && m.ef) {
      const R = bladeR(m) / PX;
      g.globalAlpha = 0.12; g.strokeStyle = '#c0cbdc'; g.lineWidth = 1; g.beginPath(); g.ellipse(Math.round(m.x / PX - cx), Math.round(m.y / PX - cy) - 6, R, R * 0.7, 0, 0, TAU); g.stroke(); g.globalAlpha = 1;
      for (let i = 0; i < 3; i++) {
        const p = blade(m, i), x = Math.round(p.x / PX - cx), y = Math.round(p.y / PX - cy) - 6, sp = A.Art.sprite('ef_blade', Math.floor(t * 14 + i));
        b.drawImage(sp.img, x - (sp.w >> 1), y - (sp.h >> 1));
        g.globalAlpha = 0.35; g.fillStyle = '#ffffff'; g.fillRect(x - 1, y - 1, 3, 3); g.globalAlpha = 1;
      }
    }
  }
  // Licht im Dunkeln: Warnkreise, Giftpfützen, Schild, Wut, Ausholen
  function lights(w, Lt) {
    for (const o of w.efx || []) {
      if (o.kind === 'tele') Lt(o.x, o.y, o.r / PX, o.col, 0.25 + 0.25 * clamp((w.t - o.t0) / (o.at - o.t0), 0, 1));
      else if (o.kind === 'puddle' && o.pk === 'poison') Lt(o.x, o.y, o.r / PX, '#63c74d', 0.12);
    }
    for (const m of w.mons) {
      if (!m.alive || !m.ef) continue;
      if (m.shield > 0 && m.shieldCap) Lt(m.x, m.y - 14, 30, '#2ce8f5', 0.3);
      if (m.raged) Lt(m.x, m.y - 10, 34, '#e43b44', 0.35 + Math.sin(w.t * 8) * 0.1);
      if (m.ef.busy > w.t) Lt(m.x, m.y - 10, 50, has(m, 'feurig') ? '#f77622' : '#e4a672', 0.6);
    }
  }

  // ---------- Oberfläche (volle Auflösung) ----------
  // Name und Bildchen der Eigenschaften über dem Kopf
  function label(dr, m, toS) {
    const c = dr.ctx, d = dr.dpr; let [x, y] = toS(m.x, m.y, m._lblUp || (m.giant ? 80 : 46)); y -= m._lblDy || 0;   // Höhe setzt draw.js beim Zeichnen
    c.textAlign = 'center'; c.font = dr.font(11 * d); c.lineWidth = 3 * d; c.strokeStyle = '#181425'; c.strokeText(m.name, x, y); c.fillStyle = col(m, dr.t); c.fillText(m.name, x, y);
    if (!m.traits) return;
    const s = Math.max(1, Math.round(d)), n = m.traits.length, iw = 9 * s, gap = 2 * d, tot = n * iw + (n - 1) * gap;
    c.imageSmoothingEnabled = false;
    m.traits.forEach((id, i) => { const ic = A.Art.sprite(TR(id).icon); c.drawImage(ic.img, Math.round(x - tot / 2 + i * (iw + gap)), Math.round(y - 8 * d - iw), ic.w * s, ic.h * s); });
  }
  // Balken oben (wie beim Boss, kleiner): Name, Leben, Eigenschaften mit Bildchen und ein Hinweis, der durchwechselt
  function bar(dr, w) {
    const m = w.mons.find(o => o.alive && o.traits && !(o.spawn > 0)); if (!m) return;
    const c = dr.ctx, d = dr.dpr, dw = dr.dw, t = dr.t;
    const [cx, bwid, LL, RR] = dr.topBox(Math.min(dw * 0.62, 300 * d)), x0 = cx - bwid / 2, y0 = (dr.topPad + 30) * d, hh = 7 * d;
    const at = (wd) => clamp(cx, LL + wd / 2, RR - wd / 2);   // Mitte einer Zeile, ohne unter die Minikarte zu rutschen
    c.textAlign = 'center'; c.textBaseline = 'middle';
    c.font = `${Math.round(21 * d)}px "Jacquard 24", serif`; c.lineWidth = 4 * d; c.strokeStyle = '#181425'; c.strokeText(m.name, cx, y0 - 13 * d); c.fillStyle = col(m, t); c.fillText(m.name, cx, y0 - 13 * d);
    c.fillStyle = '#181425'; c.fillRect(x0 - 2 * d, y0 - 2 * d, bwid + 4 * d, hh + 4 * d);
    c.fillStyle = '#3e2731'; c.fillRect(x0, y0, bwid, hh);
    const fr = clamp(m.hp / m.maxHp, 0, 1); if (m._barT == null || m._barT < fr) m._barT = fr; else m._barT = Math.max(fr, m._barT - (dr.dt || 0.016) * 0.5);
    c.fillStyle = '#ffffff'; c.fillRect(x0, y0, bwid * m._barT, hh);
    c.fillStyle = m.raged ? '#e43b44' : '#feae34'; c.fillRect(x0, y0, bwid * fr, hh);
    c.fillStyle = 'rgba(255,255,255,0.25)'; c.fillRect(x0, y0, bwid * fr, d);
    if (m.shield > 0) { c.fillStyle = '#2ce8f5'; c.fillRect(x0, y0 + hh - 2 * d, bwid * clamp(m.shield / m.maxHp, 0, 1), 2 * d); }
    // Eigenschaften in ihrer Farbe; passt die Zeile nicht (Handy), geht es in einer zweiten Zeile weiter
    const s = Math.max(1, Math.round(1.6 * d)), gap = 10 * d, lh = 15 * d;
    c.font = dr.font(11 * d); c.lineWidth = 3 * d; c.imageSmoothingEnabled = false;
    const items = m.traits.map(id => { const ic = A.Art.sprite(TR(id).icon), tx = A.t(TR(id).name); return { id, ic, tx, w: ic.w * s + 3 * d + c.measureText(tx).width }; });
    const rows = [[]]; let rw = 0;
    for (const it of items) { const row = rows[rows.length - 1]; if (row.length && rw + gap + it.w > RR - LL) { rows.push([it]); rw = it.w; } else { rw += (row.length ? gap : 0) + it.w; row.push(it); } }
    const cur = m.traits[Math.floor(t / 2.5) % m.traits.length];   // Hinweis: alle 2,5 Sekunden die nächste Eigenschaft
    let y1 = y0 + hh + 13 * d;
    c.textAlign = 'left';
    rows.forEach((row, ri) => {
      const wd = row.reduce((a, it) => a + it.w, 0) + gap * (row.length - 1); let x = at(wd) - wd / 2;
      for (const it of row) {
        c.globalAlpha = it.id === cur || m.traits.length === 1 ? 1 : 0.72;
        c.drawImage(it.ic.img, Math.round(x), Math.round(y1 - it.ic.h * s / 2), it.ic.w * s, it.ic.h * s); const tx = x + it.ic.w * s + 3 * d; c.strokeText(it.tx, tx, y1); c.fillStyle = TR(it.id).col; c.fillText(it.tx, tx, y1); x += it.w + gap;
      }
      if (ri < rows.length - 1) y1 += lh;
    });
    c.globalAlpha = 1;
    const tip = A.t(TR(cur).tip);
    c.textAlign = 'center'; c.font = dr.font(10.5 * d, 500); const tw = c.measureText(tip).width, tx = at(tw);
    c.strokeText(tip, tx, y1 + 14 * d); c.fillStyle = '#ead4aa'; c.fillText(tip, tx, y1 + 14 * d);
  }

  return { bind, count, make, onAdd, step, onHurt, onDeal, onDeath, tick, col, drawGround, drawTop, drawUnder, drawOver, lights, label, bar, has };
})();
