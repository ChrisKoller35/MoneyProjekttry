// Der Abstieg – Die Welt: Ebenen aus Räumen, Held in Echtzeit steuern, Gegner, Angriffe, Beute.
'use strict';
window.A = window.A || {};

A.World = (function () {
  const TS = 32, CW = A.Levels.CW, CH = A.Levels.CH, GX = A.Levels.GX, GY = A.Levels.GY;   // Kachelgrösse, Zellen-Grösse in Kacheln, Raster
  const MW = GX * CW, MH = GY * CH;                     // Karte in Kacheln
  const G = () => A.Game;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  let W = null;      // aktueller Zustand der Ebene
  let hooks = {};    // Rückrufe an die Oberfläche: onItem, onProp, onCleared, onDeath, onLevel, onDescend
  const fx = (name, d) => { if (A.FX) A.FX.ev(name, d); };   // Effekte und Töne (fx.js)

  // ---------- Ebene bauen (Räume und Formen in levels.js) ----------
  function genFloor(floor, seed, saved) {
    const wd = A.worldOf(floor);
    const lv = A.Levels.gen(floor, seed, wd);
    const { rooms, tiles, edges } = lv;
    // Gegenstände im Raum, auf dem Ankerpunkt (freier Boden nahe der Mitte)
    for (const r of rooms) {
      const cx = (r.anchor.tx + 0.5) * TS, cy = (r.anchor.ty + 0.5) * TS;
      const kind = { treasure: 'chest', shop: 'merchant', rest: 'fire', event: 'statue', stairs: 'stairs', shrine: 'shrine' }[r.type];
      if (kind) r.props.push({ kind, x: cx, y: cy, room: r.i, used: false });
      if (r.type === 'boss') r.props.push({ kind: 'stairs', x: cx, y: cy, room: r.i, used: false, hidden: true });
      if (r.type === 'start') r.props.push({ kind: 'sign', x: cx, y: cy - TS * 2, room: r.i, used: false, text: A.LANG === 'de' ? 'Ebene ' + floor : 'Floor ' + floor });
    }
    if (saved) for (const s of saved) { const r = rooms[s.i]; if (!r) continue; r.cleared = s.cleared; r.used = s.used; r.visited = s.visited; r.props.forEach((p, k) => { if (s.props && s.props[k]) p.used = true; if (p.hidden && r.cleared) p.hidden = false; }); }
    return { floor, seed, world: wd, rooms, tiles, start: lv.start, edges, reach: lv.reach };
  }
  function saveRooms() { return W.rooms.map(r => ({ i: r.i, cleared: r.cleared, used: r.used, visited: r.visited, props: r.props.map(p => p.used) })); }

  // ---------- Start einer Ebene ----------
  function enter(floor, seed, saved, hooksIn) {
    hooks = hooksIn || hooks;
    const f = genFloor(floor, seed, saved);
    if (A.FX) A.FX.reset();
    W = Object.assign(f, { t: 0, hero: null, mons: [], shots: [], picks: [], floats: [], fx: [], shake: 0, paused: false, near: null, stats: { crits: 0, dmgRoom: 0 }, room: null, active: null, hint: '' });
    const sr = f.start;
    W.hero = mkHero((sr.anchor.tx + 0.5) * TS, (sr.anchor.ty + 1.5) * TS);
    sr.visited = true; W.room = sr;
    return W;
  }
  function mkHero(x, y) {
    const r = G().run;
    const h = { side: 'hero', x, y, r: 12, vx: 0, vy: 0, fx: 1, fy: 0, hp: r.hp, shield: 0, atkCd: 0, cds: {}, effects: [], buffs: {}, stun: 0, inv: 0, flash: 0, swing: 0, alive: true, moving: false, shape: 'hero' };
    refreshHero(h);
    h.shield = Math.round(h.maxHp * h.startShield / 100);
    return h;
  }
  function refreshHero(h) {
    h = h || W.hero; const d = G().derived(), r = G().run, cls = A.CLASSES.find(c => c.id === r.cls), race = A.RACES.find(x => x.id === r.race);
    Object.assign(h, d, { melee: cls.row === 'front', magic: cls.id === 'weber' || cls.id === 'rufer', color: cls.color, raceColor: race.color, name: A.t(race.name) + ' ' + A.t(cls.name), skills: r.active.filter(Boolean) });
    h.hp = Math.min(h.hp, h.maxHp); h.speed = 150 + d.spd * 4; h.atkRate = clamp(1.05 - d.spd * 0.03, 0.32, 1.05);
  }

  // ---------- Kacheln und Kollision ----------
  // begehbar: 1 Boden, 5 Gefahr-Boden; Geschosse halten nur Wände (0), Türen (2) und Hindernisse (3) auf
  function tile(x, y) { const tx = Math.floor(x / TS), ty = Math.floor(y / TS); if (tx < 0 || ty < 0 || tx >= MW || ty >= MH) return 0; return W.tiles[ty][tx]; }
  function solid(x, y) { const v = tile(x, y); return v !== 1 && v !== 5; }
  function shotSolid(x, y) { const v = tile(x, y); return v === 0 || v === 2 || v === 3; }
  function blocked(x, y, r) { return solid(x - r, y - r) || solid(x + r, y - r) || solid(x - r, y + r) || solid(x + r, y + r); }
  function moveEnt(e, dx, dy) {
    if (dx && !blocked(e.x + dx, e.y, e.r)) e.x += dx; else if (dx) { const s = Math.sign(dx); let k = 0; while (!blocked(e.x + s, e.y, e.r) && k++ < 40) e.x += s; }
    if (dy && !blocked(e.x, e.y + dy, e.r)) e.y += dy; else if (dy) { const s = Math.sign(dy); let k = 0; while (!blocked(e.x, e.y + s, e.r) && k++ < 40) e.y += s; }
  }
  function roomOf(x, y) { const cx = Math.floor(x / TS / CW), cy = Math.floor(y / TS / CH); return W.rooms.find(r => r.cx === cx && r.cy === cy) || null; }
  function inside(r, x, y) { const tx = x / TS, ty = y / TS; return tx >= r.x + 0.5 && tx <= r.x + r.w - 0.5 && ty >= r.y + 0.5 && ty <= r.y + r.h - 0.5; }
  function setDoors(r, v) { for (const [x, y] of r.doors) W.tiles[y][x] = v; }
  // freie Sicht zwischen zwei Punkten (für Gegner: direkt laufen oder dem Wegenetz folgen)
  function clearLine(a, b) { const d = dist(a, b), n = Math.ceil(d / 14); for (let i = 1; i < n; i++) { const k = i / n; if (solid(a.x + (b.x - a.x) * k, a.y + (b.y - a.y) * k)) return false; } return true; }
  // Wegenetz: Schritte von jeder Kachel bis zum Helden (neu berechnet, wenn der Held die Kachel wechselt)
  function updateFlow() {
    const h = W.hero, hx = Math.floor(h.x / TS), hy = Math.floor(h.y / TS), k0 = hy * MW + hx;
    if (W.flowAt === k0) return; W.flowAt = k0;
    const fl = W.flow || (W.flow = new Int16Array(MW * MH)); fl.fill(-1);
    const q = [k0]; fl[k0] = 0;
    for (let qi = 0; qi < q.length; qi++) {
      const k = q[qi], x = k % MW, y = (k - x) / MW, d = fl[k]; if (d > 60) continue;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= MW || ny >= MH) continue; const nk = ny * MW + nx; if (fl[nk] >= 0) continue; const v = W.tiles[ny][nx]; if (v !== 1 && v !== 5) continue; fl[nk] = d + 1; q.push(nk); }
    }
  }
  // Richtung zum Helden über das Wegenetz (um Säulen, Gruben und Mauern herum)
  function flowDir(m) {
    const fl = W.flow; if (!fl) return null; const x = Math.floor(m.x / TS), y = Math.floor(m.y / TS); const here = fl[y * MW + x];
    let best = null, bd = here >= 0 ? here : 1e9;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, 1], [1, -1], [-1, -1]]) {
      const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= MW || ny >= MH) continue; const v = fl[ny * MW + nx]; if (v < 0 || v >= bd) continue;
      if (dx && dy && (fl[y * MW + nx] < 0 || fl[ny * MW + x] < 0)) continue;   // keine Ecken schneiden
      bd = v; best = [dx, dy];
    }
    if (!best) return null;
    const tx = (x + best[0] + 0.5) * TS - m.x, ty = (y + best[1] + 0.5) * TS - m.y, l = Math.hypot(tx, ty) || 1;
    return [tx / l, ty / l];
  }
  // Gefahr-Boden unter einer Figur: bremst (Treibsand, Schlamm, seichtes Wasser, Schatten) oder brennt (Glut)
  function hazardAt(e) { return tile(e.x, e.y + (e.r || 0) * 0.5) === 5 ? W.world.hazard : null; }
  function hazardSlow(e) { const hz = hazardAt(e); if (!hz || e.fly) return 1; const H = A.HAZARDS[hz]; return H && H.slow ? H.slow : 1; }

  // ---------- Gegner ----------
  function reachable(x, y) { const tx = Math.floor(x / TS), ty = Math.floor(y / TS); return !W.reach || !!W.reach[ty * MW + tx]; }
  function spawnRoom(r) {
    const run = G().run, rng = run.rng, f = run.floor;
    const list = [];
    if (r.type === 'boss') list.push(G().monsterEntity(A.bossOf(f), f, false, 1));
    else {
      const pool = A.monsterPool(f);
      const n = r.type === 'elite' ? rng.int(2, 3) : f <= 1 ? rng.int(2, 3) : f <= 3 ? rng.int(3, 4) : rng.int(3, 5) + (r.w * r.h > 130 && f >= 6 ? 1 : 0);
      for (let i = 0; i < n; i++) list.push(G().monsterEntity(rng.pick(pool), f, r.type === 'elite' && i === 0, i + 1));
    }
    list.forEach((m, i) => {
      let x, y, tries = 0;
      do { x = (r.x + 1 + rng.next() * (r.w - 2)) * TS; y = (r.y + 1 + rng.next() * (r.h - 2)) * TS; } while ((dist({ x, y }, W.hero) < 130 || blocked(x, y, 26) || !reachable(x, y)) && tries++ < 60);
      const mm = addMon(m, x, y); mm.spawn = 0.5 + i * 0.12; fx('spawn', { m: mm });
    });
    r.monsters = list.length;
  }
  function freeSpot(x, y, r) {
    if (!blocked(x, y, r) && reachable(x, y)) return [x, y];
    for (let d = 8; d < 260; d += 8) for (let a = 0; a < 8; a++) { const nx = x + Math.cos(a * Math.PI / 4) * d, ny = y + Math.sin(a * Math.PI / 4) * d; if (!blocked(nx, ny, r) && reachable(nx, ny)) return [nx, ny]; }
    return [x, y];
  }
  function addMon(m, x, y) {
    [x, y] = freeSpot(x, y, m.boss ? 24 : m.elite ? 17 : 14);
    Object.assign(m, { x, y, r: m.boss ? 24 : m.elite ? 17 : 14, hp: m.hp, shield: 0, effects: [], buffs: {}, stun: 0, flash: 0, alive: true, state: 'idle', st: 0, cd: 1 + Math.random(), fx: -1, fy: 0, speed: m.rooted ? 0 : (m.kind === 'melee' ? 62 : 55) + m.spd * 7, inv: 0, swing: 0, alpha: 1, skT: 2.5 + Math.random() * 2, sumT: 4 });
    W.mons.push(m); return m;
  }
  // Besondere Fähigkeiten von Gegnern und Bossen: Ring aus Geschossen, Fächer, Sprung, Beschwören, Verschwinden
  function ringShot(m, n, col) { for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2 + W.t; shoot(m, m.x + Math.cos(a) * 100, m.y + Math.sin(a) * 100, m.atk * 0.8, { kind: 'magic', speed: 190, r: 6, color: col || '#c77dff', life: 2.4 }); } }
  function monSpecial(m, dt, d, nx, ny) {
    const h = W.hero;
    m.skT -= dt;
    if (m.ring && m.skT <= 0 && d < 520) { m.skT = m.ringCd || 5; m.swing = 0.3; ringShot(m, m.ring, m.color); fx('nova', { e: m, r: 60, color: m.color, magic: true }); }
    if (m.summon) {
      m.sumT -= dt;
      const alive = W.mons.filter(o => o.alive && o.summoned).length;
      if (m.sumT <= 0 && alive < (m.boss ? 3 : 2)) {
        m.sumT = m.summonCd || 9; const base = A.MONSTERS.find(x => x.id === m.summon);
        if (base) for (let i = 0; i < (m.boss ? 2 : 1); i++) { const s = G().monsterEntity(base, W.floor, false, 80 + i); const a = Math.random() * Math.PI * 2; const mm = addMon(s, m.x + Math.cos(a) * 60, m.y + Math.sin(a) * 50); mm.summoned = true; mm.spawn = 0.5; fx('spawn', { m: mm }); }
        float(m.x, m.y - 60, A.LANG === 'de' ? 'Ruft Hilfe!' : 'Calls for help!', '#fee761', 14);
      }
    }
    if (m.teleport && m.skT <= 0 && !m.ring) { m.skT = 4 + Math.random() * 2; blink(m); }
    if (m.teleport && m.ring && m.hp < m.maxHp * 0.5 && (m.tpT = (m.tpT || 6) - dt) <= 0) { m.tpT = 6; blink(m); }
    if (m.leap && m.state !== 'leap' && m.cd <= 0 && d > 70 && d < 260 && clearLine(m, h)) { m.state = 'leap'; m.st = 0.32; m.lx = nx; m.ly = ny; m.cd = 2.2; fx('windup', { m }); return true; }
    if (m.state === 'leap') { m.st -= dt; moveEnt(m, m.lx * 520 * dt, m.ly * 520 * dt); if (m.st <= 0) { m.state = 'chase'; if (dist(m, h) < m.r + h.r + 14) hit(m, h, m.atk * 1.2, { kind: 'phys' }); fx('strike', { m }); } return true; }
    return false;
  }
  function blink(m) {
    const h = W.hero; fx('appear', { m });
    for (let k = 0; k < 20; k++) { const a = Math.random() * Math.PI * 2, rr = 120 + Math.random() * 120; const x = h.x + Math.cos(a) * rr, y = h.y + Math.sin(a) * rr; if (!blocked(x, y, m.r) && reachable(x, y) && roomOf(x, y) === W.active) { m.x = x; m.y = y; break; } }
    m.spawn = 0.25; fx('spawn', { m });
  }

  // ---------- Gegner-Verhalten ----------
  function monStep(m, dt) {
    const h = W.hero;
    if (m.flash > 0) m.flash -= dt; if (m.swing > 0) m.swing -= dt;
    if (m.spawn > 0) { m.spawn -= dt; if (m.spawn <= 0) fx('appear', { m }); return; }
    m.cd -= dt;
    if (m.kbT > 0) { m.kbT -= dt; if (!m.rooted) moveEnt(m, m.kbx * dt, m.kby * dt); }
    if (m.stun > 0) { m.stun -= dt; return; }
    const d = dist(m, h) || 1, nx = (h.x - m.x) / d, ny = (h.y - m.y) / d;
    if (d < 420) { m.fx = nx; m.fy = ny; }
    if (monSpecial(m, dt, d, nx, ny)) return;
    if (m.state === 'windup') { m.st -= dt; if (m.st <= 0) { m.state = 'chase'; m.cd = m.boss ? 1.1 : 1.3 - m.spd * 0.03; m.swing = 0.2; W.fx.push({ kind: 'claw', x: m.x, y: m.y, fx: m.fx, fy: m.fy, r: m.r + h.r + 22, life: 0.22, big: m.boss || m.elite }); fx('strike', { m }); if (d < m.r + h.r + 22) hit(m, h, m.atk, { kind: 'phys', slow: m.slowOnHit }); } return; }
    // Laufrichtung: direkt, wenn frei; sonst über das Wegenetz um Hindernisse herum
    let mx = nx, my = ny;
    if (!m.fly && !clearLine(m, h)) { const fd = flowDir(m); if (fd) { mx = fd[0]; my = fd[1]; } }
    const sp = m.speed * slowMul(m) * hazardSlow(m);
    if (m.kind === 'melee') {
      if (d > m.r + h.r + 4) moveEnt(m, mx * sp * dt, my * sp * dt);
      else if (m.cd <= 0) { m.state = 'windup'; m.st = m.stMax = m.boss ? 0.55 : 0.42; fx('windup', { m }); }
    } else {
      const want = 170, see = clearLine(m, h);
      if (!see) moveEnt(m, mx * sp * dt, my * sp * dt);
      else if (d < want - 30) moveEnt(m, -nx * sp * 0.8 * dt, -ny * sp * 0.8 * dt);
      else if (d > want + 40) moveEnt(m, nx * sp * dt, ny * sp * dt);
      else { const px = -ny, py = nx; const s = Math.sin(W.t * 1.3 + m.x) > 0 ? 1 : -1; moveEnt(m, px * s * sp * 0.4 * dt, py * s * sp * 0.4 * dt); }
      if (m.cd <= 0 && d < 340 && see) {
        m.cd = (m.boss ? 1.4 : 2.1) - m.spd * 0.05; m.swing = 0.2;
        const col = m.kind === 'magic' ? '#c77dff' : '#ffb08a', n = m.spread || 1;
        for (let i = 0; i < n; i++) { const a = Math.atan2(ny, nx) + (i - (n - 1) / 2) * 0.28; shoot(m, m.x + Math.cos(a) * 100, m.y + Math.sin(a) * 100, m.atk, { kind: m.kind === 'magic' ? 'magic' : 'phys', speed: 230, r: 6, color: m.shotCol || col, life: 1.8, burn: m.burn ? 0.3 : 0 }); }
      }
    }
    // Gefahr-Boden: Glut brennt auch Gegner
    if (hazardAt(m) && A.HAZARDS[W.world.hazard].burn && !m.fly && (m.hzT = (m.hzT || 0) - dt) <= 0) { m.hzT = 1; addEffect(m, 'burn', Math.max(1, Math.round(m.maxHp * 0.04)), 1.2); }
    // Gegner nicht übereinander
    for (const o of W.mons) { if (o === m || !o.alive) continue; const dd = dist(m, o); if (dd < m.r + o.r && dd > 0) { moveEnt(m, (m.x - o.x) / dd * 40 * dt, (m.y - o.y) / dd * 40 * dt); } }
  }
  function slowMul(e) { return e.slowUntil && e.slowUntil > W.t ? (e.slowPow || 0.5) : 1; }

  // ---------- Treffer-Rechnung ----------
  function statOf(e, k) { const b = e.buffs && e.buffs[k]; let v = e[k] || 0; if (b && b.until > W.t) v = b.mul ? v * (1 + b.mul) : v + b.add; return v; }
  function float(x, y, text, color, size, icon) { W.floats.push({ x: x + (Math.random() - 0.5) * 16, y, text, color: color || '#fff', size: size || 16, life: 1, max: 1, icon }); }
  function hit(from, to, raw, opts) {
    opts = opts || {};
    if (!to.alive || to.spawn > 0) return 0;
    if (!opts.noDodge && Math.random() < clamp(statOf(to, 'dodge'), 0, 75) / 100) { float(to.x, to.y - to.r - 8, A.LANG === 'de' ? 'daneben' : 'miss', '#c0cbdc', 12); fx('miss', { to }); return -1; }
    let dmg = raw * (0.9 + Math.random() * 0.2);
    dmg = dmg * 100 / (100 + Math.max(0, statOf(to, 'def')) * 4);
    let crit = false;
    if (Math.random() < clamp(statOf(from, 'crit') + (opts.critBonus || 0), 0, 90) / 100) { dmg *= 1.75; crit = true; if (from.side === 'hero') { W.stats.crits++; G().questEvent('crit'); } }
    if (opts.execute && to.hp / to.maxHp < opts.execute && !to.boss) dmg = to.hp + 1;
    dmg = Math.max(1, Math.round(dmg));
    let absorbed = 0;
    if (to.shield > 0) { absorbed = Math.min(to.shield, dmg); to.shield -= absorbed; dmg -= absorbed; }
    to.hp -= dmg; to.flash = 0.12;
    const col = opts.kind === 'poison' ? '#63c74d' : opts.kind === 'burn' ? '#f77622' : to.side === 'hero' ? '#e43b44' : crit ? '#feae34' : opts.kind === 'magic' ? '#2ce8f5' : '#ffffff';
    if (dmg > 0) float(to.x, to.y - to.r - 10, (to.side === 'hero' ? '-' : '') + dmg + (crit ? '!' : ''), col, crit ? 21 : to.side === 'hero' ? 17 : opts.kind === 'poison' || opts.kind === 'burn' ? 12 : 15);
    if (absorbed) float(to.x, to.y - to.r - 22, String(absorbed), '#2ce8f5', 12);
    if (to.side === 'hero') { W.stats.dmgRoom += dmg; W.shake = 0.15; }
    fx('hit', { from, to, dmg, crit, kind: opts.kind, color: opts.color });
    // Rückstoss für getroffene Gegner
    if (to.side === 'enemy' && from && from.side === 'hero' && opts.kind !== 'poison' && opts.kind !== 'burn') {
      const k = Math.hypot(to.x - from.x, to.y - from.y) || 1, pow = (crit ? 300 : 190) * (to.boss ? 0.12 : to.mid === 'rostgolem' ? 0.35 : to.elite ? 0.6 : 1);
      to.kbx = (to.x - from.x) / k * pow; to.kby = (to.y - from.y) / k * pow; to.kbT = 0.12;
    }
    if (dmg > 0 && opts.kind !== 'poison' && opts.kind !== 'burn' && opts.kind !== 'thorns') {
      if (from.lifesteal && from.alive) heal(from, Math.max(1, Math.round(dmg * from.lifesteal / 100)));
      if (from.poisonOnHit) addEffect(to, 'poison', Math.max(1, Math.round(from.poisonOnHit * (1 + W.floor * 0.3))), 3);
      if (from.burn) addEffect(to, 'burn', Math.max(1, Math.round(statOf(from, 'mag') * from.burn)), 2);
      if (opts.poison) addEffect(to, 'poison', Math.max(1, Math.round(statOf(from, 'atk') * opts.poison / 3)), 3);
      if (opts.burn) addEffect(to, 'burn', Math.max(1, Math.round(statOf(from, 'mag') * opts.burn)), 2);
      if (opts.stun) { to.stun = Math.max(to.stun, opts.stun); }
      if (opts.slow) { to.slowUntil = W.t + (opts.slowDur || 1.6); to.slowPow = 0.55; }
      if (to.thorns && opts.kind !== 'magic' && from.alive) { const back = Math.max(1, Math.round(dmg * to.thorns / 100)); from.hp -= back; from.flash = 0.1; float(from.x, from.y - from.r - 10, '-' + back, '#c0cbdc', 13); checkDeath(from); }
      if (to.healOnPhys && opts.kind !== 'magic') heal(to, Math.round(to.maxHp * to.healOnPhys));
      if (from.steal && to.side === 'hero') { const g = Math.min(G().run.gold, 5 + W.floor * 3); if (g > 0) { G().run.gold -= g; float(from.x, from.y - from.r - 24, '-' + g, '#feae34', 13, 'coin'); } }
      if (to.side === 'hero' && from.side === 'enemy') { const k = Math.hypot(to.x - from.x, to.y - from.y) || 1; moveEnt(to, (to.x - from.x) / k * 10, (to.y - from.y) / k * 10); }
    }
    if (to.split && !to.didSplit && to.hp <= to.maxHp / 2) { to.didSplit = true; const base = A.MONSTERS.find(m => m.id === (to.splitInto || 'schleimer')); for (let i = 0; i < 2; i++) { const s = G().monsterEntity(base, W.floor, false, 90 + i); addMon(s, to.x + (i ? 40 : -40), to.y + 20); } float(to.x, to.y - 50, A.LANG === 'de' ? 'Teilt sich!' : 'Splits!', '#9be37a', 16); }
    checkDeath(to);
    return dmg;
  }
  function heal(e, n, loud) { if (!e.alive || n <= 0) return; const b = e.hp; e.hp = Math.min(e.maxHp, e.hp + n); if (e.hp > b) { float(e.x, e.y - e.r - 10, '+' + (e.hp - b), '#63c74d', 14); fx('heal', { e, n: e.hp - b, loud }); } }
  function addEffect(e, kind, dmg, sec) { const cur = e.effects.find(x => x.kind === kind); if (cur) { cur.dmg = Math.max(cur.dmg, dmg); cur.until = W.t + sec; } else e.effects.push({ kind, dmg, until: W.t + sec, tick: W.t + 1 }); }
  function checkDeath(e) {
    if (e.hp > 0 || !e.alive) return;
    if (e.side === 'hero') {
      if (e.revive > 0 && !G().run.reviveUsed) { G().run.reviveUsed = true; e.hp = Math.round(e.maxHp * 0.3); e.revive = 0; e.inv = 1.5; float(e.x, e.y - 40, A.LANG === 'de' ? 'Zweite Chance!' : 'Second chance!', '#f5c542', 18); return; }
      e.alive = false; e.hp = 0; W.paused = true; if (hooks.onDeath) hooks.onDeath(); return;
    }
    e.alive = false; e.hp = 0;
    const rw = G().killReward(e);
    for (let i = 0; i < rw.coins; i++) drop({ kind: 'gold', val: Math.ceil(rw.gold / rw.coins) }, e.x, e.y, 60 + Math.random() * 90);
    for (const it of rw.items) drop({ kind: 'item', it }, e.x, e.y, 50);
    if (rw.potion) drop({ kind: 'potion' }, e.x, e.y, 50);
    float(e.x, e.y - e.r - 30, '+' + rw.xp + ' ' + A.t(A.UI.xp), '#e0a4ff', 12);
    fx('death', { e });
    if (rw.levels && hooks.onLevel) hooks.onLevel(rw.levels);
  }

  // Beute fliegt im Bogen heraus und hüpft
  function drop(p, x, y, sp) {
    const a = Math.random() * Math.PI * 2;
    Object.assign(p, { x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp * 0.7, z: 8, vz: 150 + Math.random() * 90, t: 0 });
    W.picks.push(p);
    if (p.kind === 'item') fx('drop', { rarity: p.it.rarity, color: A.RARITY[p.it.rarity].color, x, y });
    return p;
  }

  // ---------- Angriffe des Helden ----------
  function nearestMon(x, y, maxD) { let best = null, bd = maxD || 1e9; for (const m of W.mons) { if (!m.alive) continue; const d = dist({ x, y }, m); if (d < bd) { bd = d; best = m; } } return best; }
  function faceTarget(h) { const m = nearestMon(h.x, h.y, 320); if (m) { const d = dist(h, m) || 1; h.fx = (m.x - h.x) / d; h.fy = (m.y - h.y) / d; } }
  function arc(h, radius, pow, opts) {
    let n = 0;
    for (const m of W.mons) {
      if (!m.alive || m.spawn > 0) continue; const d = dist(h, m); if (d > radius + m.r) continue;
      const dot = ((m.x - h.x) * h.fx + (m.y - h.y) * h.fy) / (d || 1);
      if (dot < 0.2 && d > h.r + m.r + 6) continue;
      hit(h, m, (opts && opts.magic ? statOf(h, 'mag') : statOf(h, 'atk')) * pow, opts); n++;
    }
    W.fx.push({ kind: 'slash', x: h.x, y: h.y, fx: h.fx, fy: h.fy, r: radius, life: 0.18, color: opts && opts.magic ? '#7fd8ff' : '#fff' });
    fx('swing', { magic: opts && opts.magic });
    return n;
  }
  function shoot(from, tx, ty, dmg, opts) {
    const d = Math.hypot(tx - from.x, ty - from.y) || 1;
    const sp = opts.speed || 420;
    if (!opts.color) opts.color = opts.kind === 'magic' ? '#7fd8ff' : '#e8dcc0';
    fx('shoot', { from, magic: opts.kind === 'magic', color: opts.color, dx: (tx - from.x) / d, dy: (ty - from.y) / d });
    W.shots.push({ x: from.x + (tx - from.x) / d * (from.r + 4), y: from.y + (ty - from.y) / d * (from.r + 4), vx: (tx - from.x) / d * sp, vy: (ty - from.y) / d * sp, r: opts.r || 5, side: from.side, from, dmg, opts, life: opts.life || 1.0, color: opts.color || (opts.kind === 'magic' ? '#7fd8ff' : '#e8dcc0') });
  }
  function heroAttack() {
    const h = W.hero; if (!h.alive || h.atkCd > 0 || h.stun > 0) return false;
    if (!h.moving) faceTarget(h);
    h.atkCd = h.atkRate; h.swing = 0.2;
    if (h.melee) arc(h, 58, 1, { kind: 'phys' });
    else { const m = nearestMon(h.x, h.y, 340); const tx = m ? m.x : h.x + h.fx * 100, ty = m ? m.y : h.y + h.fy * 100; shoot(h, tx, ty, h.magic ? statOf(h, 'mag') : statOf(h, 'atk'), { kind: h.magic ? 'magic' : 'phys' }); }
    return true;
  }
  function useSkill(idx) {
    const h = W.hero, id = h.skills[idx]; if (!id || !h.alive || h.stun > 0) return false;
    if ((h.cds[id] || 0) > W.t) return false;
    const sk = A.SKILLS[id]; h.cds[id] = W.t + sk.cd * 2; h.swing = 0.25;
    if (!h.moving) faceTarget(h);
    float(h.x, h.y - 44, A.t(sk.name), '#fee761', 12);
    const magic = sk.kind === 'magic';
    if (sk.kind === 'shield') { h.shield = Math.max(h.shield, Math.round(h.maxHp * sk.pow)); float(h.x, h.y - 30, String(h.shield), '#2ce8f5', 15); fx('shield', { e: h }); }
    else if (sk.kind === 'heal') heal(h, Math.round(h.maxHp * sk.pow), true);
    else if (sk.kind === 'buff') { h.buffs[sk.stat] = sk.stat === 'dodge' ? { add: sk.pow, until: W.t + sk.dur * 2 } : { mul: sk.pow, until: W.t + sk.dur * 2 }; fx('buff', { e: h }); }
    else if (sk.kind === 'multi' || sk.multi) { if (h.melee && !magic) h.spinT = W.t; const nc = magic ? (id === 'entladung' ? '#c77dff' : '#f77622') : '#ffffff'; fx('nova', { e: h, r: 170, color: nc, magic }); let n = 0; for (const m of W.mons) { if (m.alive && !(m.spawn > 0) && dist(h, m) < 170 + m.r) { hit(h, m, (magic ? statOf(h, 'mag') : statOf(h, 'atk')) * sk.pow, { kind: magic ? 'magic' : 'phys', burn: sk.burn, color: nc }); n++; } } }
    else { // Einzelziel (attack / magic)
      const opts = { kind: magic ? 'magic' : 'phys', critBonus: sk.critBonus, poison: sk.poison, stun: sk.stun, burn: sk.burn, execute: sk.execute };
      let pow = sk.pow; if (sk.bonusMissingHp) pow *= 1 + sk.bonusMissingHp * (1 - h.hp / h.maxHp);
      const hits = sk.hits || 1;
      if (h.melee && !magic) { for (let i = 0; i < hits; i++) arc(h, 70, pow, opts); }
      else { const m = nearestMon(h.x, h.y, 360); const tx = m ? m.x : h.x + h.fx * 100, ty = m ? m.y : h.y + h.fy * 100; for (let i = 0; i < hits; i++) shoot(h, tx + (i ? (Math.random() - 0.5) * 30 : 0), ty + (i ? (Math.random() - 0.5) * 30 : 0), (magic ? statOf(h, 'mag') : statOf(h, 'atk')) * pow, Object.assign({ r: 7, speed: 460, color: magic ? '#c77dff' : '#ffe08a' }, opts)); }
    }
    return true;
  }
  function usePotion() { const h = W.hero; if (!G().usePotion()) return false; fx('potion', { e: h }); const d = G().derived(); heal(h, Math.round(d.maxHp * 0.4) - (h.hp - G().run.hp > 0 ? 0 : 0)); h.hp = G().run.hp = Math.max(h.hp, G().run.hp); return true; }

  // ---------- Hauptschritt ----------
  function step(dt, input) {
    if (!W || W.paused) return;
    W.t += dt;
    const h = W.hero;
    if (W.shake > 0) W.shake -= dt; if (h.flash > 0) h.flash -= dt; if (h.inv > 0) h.inv -= dt; if (h.swing > 0) h.swing -= dt;
    h.atkCd -= dt;
    // Bewegung
    let mx = input.mx, my = input.my; const len = Math.hypot(mx, my);
    if (h.stun > 0) { h.stun -= dt; mx = my = 0; }
    h.moving = len > 0.15;
    if (h.moving) { mx /= Math.max(1, len); my /= Math.max(1, len); const sp = h.speed * slowMul(h) * hazardSlow(h); moveEnt(h, mx * sp * dt, my * sp * dt); h.fx = mx / (len > 1 ? 1 : len); h.fy = my / (len > 1 ? 1 : len); const l2 = Math.hypot(h.fx, h.fy) || 1; h.fx /= l2; h.fy /= l2; h.stepT = (h.stepT || 0) - dt; if (h.stepT <= 0) { h.stepT = 0.24; fx('step', { e: h }); } }
    if (input.attack) heroAttack();
    // Gefahr-Boden unter dem Helden
    const hz = hazardAt(h); h.onHazard = hz;
    if (hz && A.HAZARDS[hz].burn && (h.hzT = (h.hzT || 0) - dt) <= 0) { h.hzT = 1; addEffect(h, 'burn', Math.max(1, Math.round(h.maxHp * 0.03)), 1.2); }
    if (W.active) updateFlow();
    // Regeneration / Effekte
    if (!h.regenT || W.t > h.regenT) { h.regenT = W.t + 2; if (h.regen) { if (h.regen > 0) heal(h, Math.max(1, Math.round(h.maxHp * h.regen / 100))); else { h.hp = Math.max(1, h.hp - Math.max(1, Math.round(h.maxHp * -h.regen / 100))); float(h.x, h.y - 20, '−' + Math.round(h.maxHp * -h.regen / 100), '#ff5f5f', 12); } } }
    for (const e of [h, ...W.mons]) { if (!e.alive) continue; for (const ef of e.effects) { if (W.t >= ef.tick) { ef.tick += 1; hit({ side: ef.kind, crit: 0, alive: false }, e, ef.dmg, { kind: ef.kind, noDodge: true }); } } e.effects = e.effects.filter(ef => ef.until > W.t); }
    // Gegner
    for (const m of W.mons) if (m.alive) monStep(m, dt);
    W.mons = W.mons.filter(m => m.alive || (m.alpha -= dt * 2) > 0);
    // Geschosse
    for (const s of W.shots) {
      s.x += s.vx * dt; s.y += s.vy * dt; s.life -= dt;
      if (shotSolid(s.x, s.y)) { s.life = 0; fx('wallhit', { x: s.x, y: s.y, color: s.color }); continue; }
      if (s.side === 'hero') { for (const m of W.mons) { if (m.alive && !(m.spawn > 0) && dist(s, m) < m.r + s.r) { hit(s.from, m, s.dmg, s.opts); s.life = 0; break; } } }
      else if (h.alive && dist(s, h) < h.r + s.r) { hit(s.from, h, s.dmg, s.opts); s.life = 0; }
    }
    W.shots = W.shots.filter(s => s.life > 0);
    // Beute aufsammeln
    for (const p of W.picks) {
      p.t += dt;
      if (p.vz != null && (p.z > 0 || p.vz !== 0)) {   // Hüpfen nach dem Herausfallen
        const nx = p.x + p.vx * dt, ny = p.y + p.vy * dt; if (!solid(nx, ny)) { p.x = nx; p.y = ny; } else { p.vx = -p.vx * 0.5; p.vy = -p.vy * 0.5; }
        p.vz -= 700 * dt; p.z += p.vz * dt; if (p.z <= 0) { p.z = 0; p.vz = Math.abs(p.vz) > 60 ? -p.vz * 0.42 : 0; p.vx *= 0.6; p.vy *= 0.6; }
      }
      const d = dist(p, h);
      if (p.kind === 'gold' && d < 110 && p.t > 0.45) { p.x += (h.x - p.x) / d * 300 * dt; p.y += (h.y - p.y) / d * 300 * dt; }
      if (d < h.r + 10 && p.t > 0.3 && !(p.z > 4)) {
        if (p.kind === 'gold') { G().run.gold += p.val; p.done = true; float(h.x, h.y - 30, '+' + p.val, '#feae34', 12, 'coin'); fx('coin', { x: h.x, y: h.y }); }
        else if (p.kind === 'potion') { G().run.potions++; p.done = true; float(h.x, h.y - 30, '+1', '#e43b44', 13, 'potion'); fx('pickPotion', { x: h.x, y: h.y }); }
        else if (p.kind === 'item' && !W.paused) { p.done = true; W.paused = true; fx('pickItem', { rarity: p.it.rarity }); if (hooks.onItem) hooks.onItem(p.it); }
      }
    }
    W.picks = W.picks.filter(p => !p.done);
    for (const f of W.floats) { f.y -= 28 * dt; f.life -= dt; } W.floats = W.floats.filter(f => f.life > 0);
    for (const f of W.fx) f.life -= dt; W.fx = W.fx.filter(f => f.life > 0);
    // Raum-Logik
    const r = roomOf(h.x, h.y);
    if (r && r !== W.room) { W.room = r; }
    if (r && !r.visited && inside(r, h.x, h.y)) { r.visited = true; if (['fight', 'elite', 'boss'].includes(r.type) && !r.cleared) { W.active = r; W.stats.dmgRoom = 0; r.lockT = null; setDoors(r, 2); spawnRoom(r); fx('lock', { r }); W.hint = ''; } G().save(); }
    if (W.active && !W.mons.some(m => m.alive)) { const a = W.active; W.active = null; a.cleared = true; setDoors(a, 1); W.hint = '';
      const loot = G().roomCleared(a, W.stats); for (const it of loot.items) drop({ kind: 'item', it }, (a.x + a.w / 2) * TS + (Math.random() - 0.5) * 60, (a.y + a.h / 2) * TS + (Math.random() - 0.5) * 40, 40);
      fx('cleared', { r: a });
      a.props.forEach(p => { if (p.hidden) p.hidden = false; });
      if (hooks.onCleared) hooks.onCleared(a); }
    // In der Nähe von etwas?
    W.near = null;
    for (const rr of W.rooms) for (const p of rr.props) { if (p.hidden || p.used || p.kind === 'sign') continue; if (dist(p, h) < 46) W.near = p; }
    G().run.hp = h.hp;
  }
  function interact() { if (!W.near) return false; const p = W.near; if (hooks.onProp) hooks.onProp(p); return true; }
  function markUsed(p) { p.used = true; const r = W.rooms[p.room]; r.used = true; G().save(); }

  return {
    get W() { return W; }, TS, CW, CH, MW, MH, enter, step, interact, markUsed, heroAttack, useSkill, usePotion, refreshHero, saveRooms, statOf, float, dist, nearestMon,
    pause(v) { if (W) W.paused = v; },
  };
})();
