// Der Abstieg – Die Welt: Ebenen aus Räumen, Held in Echtzeit steuern, Gegner, Angriffe, Beute.
'use strict';
window.A = window.A || {};

A.World = (function () {
  const TS = 32, CW = 15, CH = 11, GX = 3, GY = 3;   // Kachelgrösse, Zellen-Grösse in Kacheln, Raster
  const MW = GX * CW, MH = GY * CH;                     // Karte in Kacheln
  const G = () => A.Game;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  let W = null;      // aktueller Zustand der Ebene
  let hooks = {};    // Rückrufe an die Oberfläche: onItem, onProp, onCleared, onDeath, onLevel, onDescend
  const fx = (name, d) => { if (A.FX) A.FX.ev(name, d); };   // Effekte und Töne (fx.js)

  // ---------- Ebene bauen ----------
  function genFloor(floor, seed, saved) {
    const rng = new A.RNG(seed);
    const n = Math.min(GX * GY - 1, 5 + floor);
    const key = (c) => c.x + ',' + c.y;
    const start = { x: rng.int(0, GX - 1), y: rng.int(0, GY - 1) };
    const cells = [start], edges = [];
    let guard = 0;
    while (cells.length < n && guard++ < 500) {
      const from = rng.pick(cells);
      for (const [dx, dy] of rng.shuffle([[1, 0], [-1, 0], [0, 1], [0, -1]])) {
        const c = { x: from.x + dx, y: from.y + dy };
        if (c.x < 0 || c.y < 0 || c.x >= GX || c.y >= GY || cells.some(p => key(p) === key(c))) continue;
        cells.push(c); edges.push([from, c]); break;
      }
    }
    // Ein paar Extra-Verbindungen für Rundwege
    for (let i = 0; i < cells.length; i++) for (let j = i + 1; j < cells.length; j++) {
      const a = cells[i], b = cells[j];
      if (Math.abs(a.x - b.x) + Math.abs(a.y - b.y) !== 1) continue;
      if (edges.some(([p, q]) => (key(p) === key(a) && key(q) === key(b)) || (key(p) === key(b) && key(q) === key(a)))) continue;
      if (rng.chance(0.3)) edges.push([a, b]);
    }
    // Entfernung vom Start
    const distMap = { [key(start)]: 0 }; const queue = [start];
    while (queue.length) { const c = queue.shift(); for (const [p, q] of edges) { const o = key(p) === key(c) ? q : key(q) === key(c) ? p : null; if (o && distMap[key(o)] == null) { distMap[key(o)] = distMap[key(c)] + 1; queue.push(o); } } }
    const far = cells.slice().sort((a, b) => distMap[key(b)] - distMap[key(a)])[0];
    // Raumtypen
    const types = {}; types[key(start)] = 'start'; types[key(far)] = A.BOSSES[floor] ? 'boss' : 'stairs';
    const rest = cells.filter(c => !types[key(c)]);
    const pool = ['fight', 'fight'];
    const extra = rng.shuffle(['shop', 'rest', 'treasure', 'event', floor >= 2 ? 'elite' : 'fight', 'fight']);
    while (pool.length < rest.length) pool.push(extra.shift() || 'fight');
    rng.shuffle(rest).forEach((c, i) => types[key(c)] = pool[i]);
    // Kacheln: 0 Wand, 1 Boden, 2 verschlossene Tür
    const tiles = []; for (let y = 0; y < MH; y++) { tiles.push(new Array(MW).fill(0)); }
    const rooms = cells.map((c, i) => {
      const r = { i, cx: c.x, cy: c.y, type: types[key(c)], x: c.x * CW + 1, y: c.y * CH + 1, w: CW - 2, h: CH - 2, doors: [], cleared: false, used: false, visited: false, props: [] };
      for (let y = r.y; y < r.y + r.h; y++) for (let x = r.x; x < r.x + r.w; x++) tiles[y][x] = 1;
      return r;
    });
    const roomAt = (c) => rooms.find(r => r.cx === c.x && r.cy === c.y);
    for (const [p, q] of edges) {
      const a = roomAt(p), b = roomAt(q); const door = [];
      if (p.y === q.y) { const l = Math.min(p.x, q.x); const x0 = l * CW + CW - 1; const yy = p.y * CH + 5; door.push([x0, yy], [x0 + 1, yy], [x0, yy + 1], [x0 + 1, yy + 1]); }
      else { const t = Math.min(p.y, q.y); const y0 = t * CH + CH - 1; const xx = p.x * CW + 7; door.push([xx, y0], [xx, y0 + 1], [xx + 1, y0], [xx + 1, y0 + 1]); }
      for (const [x, y] of door) tiles[y][x] = 1;
      a.doors.push(...door); b.doors.push(...door);
    }
    // Möbel in den Ecken (Fässer, Kisten, Töpfe): Hindernisse, auch Deckung gegen Geschosse
    const rngF = new A.RNG((seed ^ 0x7f4a7c15) >>> 0 || 3);
    for (const r of rooms) {
      r.furn = [];
      for (const [tx, ty] of [[r.x, r.y], [r.x + r.w - 1, r.y], [r.x, r.y + r.h - 1], [r.x + r.w - 1, r.y + r.h - 1]]) {
        if (!rngF.chance(0.4) || tiles[ty][tx] !== 1) continue;
        tiles[ty][tx] = 3; r.furn.push({ tx, ty, kind: rngF.pick(['barrel', 'crate', 'pot', 'barrel']) });
      }
    }
    // Gegenstände im Raum
    for (const r of rooms) {
      const cx = (r.x + r.w / 2) * TS, cy = (r.y + r.h / 2) * TS;
      const kind = { treasure: 'chest', shop: 'merchant', rest: 'fire', event: 'statue', stairs: 'stairs' }[r.type];
      if (kind) r.props.push({ kind, x: cx, y: cy, room: r.i, used: false });
      if (r.type === 'boss') r.props.push({ kind: 'stairs', x: cx, y: cy, room: r.i, used: false, hidden: true });
      if (r.type === 'start') r.props.push({ kind: 'sign', x: cx, y: cy - TS * 2, room: r.i, used: false, text: A.LANG === 'de' ? 'Ebene ' + floor : 'Floor ' + floor });
    }
    if (saved) for (const s of saved) { const r = rooms[s.i]; if (!r) continue; r.cleared = s.cleared; r.used = s.used; r.visited = s.visited; r.props.forEach((p, k) => { if (s.props && s.props[k]) p.used = true; if (p.hidden && r.cleared) p.hidden = false; }); }
    const sr = rooms.find(r => r.type === 'start');
    return { floor, seed, rooms, tiles, start: sr, edges };
  }
  function saveRooms() { return W.rooms.map(r => ({ i: r.i, cleared: r.cleared, used: r.used, visited: r.visited, props: r.props.map(p => p.used) })); }

  // ---------- Start einer Ebene ----------
  function enter(floor, seed, saved, hooksIn) {
    hooks = hooksIn || hooks;
    const f = genFloor(floor, seed, saved);
    if (A.FX) A.FX.reset();
    W = Object.assign(f, { t: 0, hero: null, mons: [], shots: [], picks: [], floats: [], fx: [], shake: 0, paused: false, near: null, stats: { crits: 0, dmgRoom: 0 }, room: null, active: null, hint: '' });
    const sr = f.start;
    W.hero = mkHero((sr.x + sr.w / 2) * TS, (sr.y + sr.h / 2 + 1) * TS);
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
  function tile(x, y) { const tx = Math.floor(x / TS), ty = Math.floor(y / TS); if (tx < 0 || ty < 0 || tx >= MW || ty >= MH) return 0; return W.tiles[ty][tx]; }
  function solid(x, y) { return tile(x, y) !== 1; }
  function blocked(x, y, r) { return solid(x - r, y - r) || solid(x + r, y - r) || solid(x - r, y + r) || solid(x + r, y + r); }
  function moveEnt(e, dx, dy) {
    if (dx && !blocked(e.x + dx, e.y, e.r)) e.x += dx; else if (dx) { const s = Math.sign(dx); while (!blocked(e.x + s, e.y, e.r)) e.x += s; }
    if (dy && !blocked(e.x, e.y + dy, e.r)) e.y += dy; else if (dy) { const s = Math.sign(dy); while (!blocked(e.x, e.y + s, e.r)) e.y += s; }
  }
  function roomOf(x, y) { const cx = Math.floor(x / TS / CW), cy = Math.floor(y / TS / CH); return W.rooms.find(r => r.cx === cx && r.cy === cy) || null; }
  function inside(r, x, y) { const tx = x / TS, ty = y / TS; return tx >= r.x + 0.5 && tx <= r.x + r.w - 0.5 && ty >= r.y + 0.5 && ty <= r.y + r.h - 0.5; }
  function setDoors(r, v) { for (const [x, y] of r.doors) W.tiles[y][x] = v; }

  // ---------- Gegner ----------
  function spawnRoom(r) {
    const run = G().run, rng = run.rng, f = run.floor;
    const list = [];
    if (r.type === 'boss') list.push(G().monsterEntity(A.BOSSES[f], f, false, 1));
    else {
      const pool = A.MONSTERS.filter(m => f >= m.floors[0] && f <= m.floors[1]);
      const n = r.type === 'elite' ? rng.int(2, 3) : f <= 1 ? rng.int(2, 3) : f <= 3 ? rng.int(3, 4) : rng.int(3, 5);
      for (let i = 0; i < n; i++) list.push(G().monsterEntity(rng.pick(pool), f, r.type === 'elite' && i === 0, i + 1));
    }
    list.forEach((m, i) => {
      let x, y, tries = 0;
      do { x = (r.x + 1 + rng.next() * (r.w - 2)) * TS; y = (r.y + 1 + rng.next() * (r.h - 2)) * TS; } while ((dist({ x, y }, W.hero) < 130 || blocked(x, y, 26)) && tries++ < 40);
      const mm = addMon(m, x, y); mm.spawn = 0.5 + i * 0.12; fx('spawn', { m: mm });
    });
    r.monsters = list.length;
  }
  function freeSpot(x, y, r) {
    if (!blocked(x, y, r)) return [x, y];
    for (let d = 8; d < 200; d += 8) for (let a = 0; a < 8; a++) { const nx = x + Math.cos(a * Math.PI / 4) * d, ny = y + Math.sin(a * Math.PI / 4) * d; if (!blocked(nx, ny, r)) return [nx, ny]; }
    return [x, y];
  }
  function addMon(m, x, y) {
    [x, y] = freeSpot(x, y, m.boss ? 24 : m.elite ? 17 : 14);
    Object.assign(m, { x, y, r: m.boss ? 24 : m.elite ? 17 : 14, hp: m.hp, shield: 0, effects: [], buffs: {}, stun: 0, flash: 0, alive: true, state: 'idle', st: 0, cd: 1 + Math.random(), fx: -1, fy: 0, speed: (m.kind === 'melee' ? 62 : 55) + m.spd * 7, inv: 0, swing: 0, alpha: 1 });
    W.mons.push(m); return m;
  }

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
      if (to.thorns && opts.kind !== 'magic' && from.alive) { const back = Math.max(1, Math.round(dmg * to.thorns / 100)); from.hp -= back; from.flash = 0.1; float(from.x, from.y - from.r - 10, '-' + back, '#c0cbdc', 13); checkDeath(from); }
      if (to.healOnPhys && opts.kind !== 'magic') heal(to, Math.round(to.maxHp * to.healOnPhys));
      if (from.steal && to.side === 'hero') { const g = Math.min(G().run.gold, 5 + W.floor * 3); if (g > 0) { G().run.gold -= g; float(from.x, from.y - from.r - 24, '-' + g, '#feae34', 13, 'coin'); } }
      if (to.side === 'hero' && from.side === 'enemy') { const k = Math.hypot(to.x - from.x, to.y - from.y) || 1; moveEnt(to, (to.x - from.x) / k * 10, (to.y - from.y) / k * 10); }
    }
    if (to.split && !to.didSplit && to.hp <= to.maxHp / 2) { to.didSplit = true; const base = A.MONSTERS.find(m => m.id === 'schleimer'); for (let i = 0; i < 2; i++) { const s = G().monsterEntity(base, W.floor, false, 90 + i); addMon(s, to.x + (i ? 40 : -40), to.y + 20); } float(to.x, to.y - 50, A.LANG === 'de' ? 'Teilt sich!' : 'Splits!', '#9be37a', 16); }
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

  // ---------- Gegner-Verhalten ----------
  function monStep(m, dt) {
    const h = W.hero;
    if (m.flash > 0) m.flash -= dt; if (m.swing > 0) m.swing -= dt;
    if (m.spawn > 0) { m.spawn -= dt; if (m.spawn <= 0) fx('appear', { m }); return; }
    m.cd -= dt;
    if (m.kbT > 0) { m.kbT -= dt; moveEnt(m, m.kbx * dt, m.kby * dt); }
    if (m.stun > 0) { m.stun -= dt; return; }
    const d = dist(m, h) || 1, nx = (h.x - m.x) / d, ny = (h.y - m.y) / d;
    if (d < 420) { m.fx = nx; m.fy = ny; }
    if (m.state === 'windup') { m.st -= dt; if (m.st <= 0) { m.state = 'chase'; m.cd = m.boss ? 1.1 : 1.3 - m.spd * 0.03; m.swing = 0.2; W.fx.push({ kind: 'claw', x: m.x, y: m.y, fx: m.fx, fy: m.fy, r: m.r + h.r + 22, life: 0.22, big: m.boss || m.elite }); fx('strike', { m }); if (d < m.r + h.r + 22) hit(m, h, m.atk, { kind: 'phys' }); } return; }
    if (m.kind === 'melee') {
      if (d > m.r + h.r + 4) moveEnt(m, nx * m.speed * dt, ny * m.speed * dt);
      else if (m.cd <= 0) { m.state = 'windup'; m.st = m.stMax = m.boss ? 0.55 : 0.42; fx('windup', { m }); }
    } else {
      const want = 170;
      if (d < want - 30) moveEnt(m, -nx * m.speed * 0.8 * dt, -ny * m.speed * 0.8 * dt);
      else if (d > want + 40) moveEnt(m, nx * m.speed * dt, ny * m.speed * dt);
      else { const px = -ny, py = nx; const s = Math.sin(W.t * 1.3 + m.x) > 0 ? 1 : -1; moveEnt(m, px * s * m.speed * 0.4 * dt, py * s * m.speed * 0.4 * dt); }
      if (m.cd <= 0 && d < 330) { m.cd = (m.boss ? 1.4 : 2.1) - m.spd * 0.05; m.swing = 0.2; shoot(m, h.x, h.y, m.atk, { kind: m.kind === 'magic' ? 'magic' : 'phys', speed: 230, r: 6, color: m.kind === 'magic' ? '#c77dff' : '#ffb08a', life: 1.8 }); }
    }
    // Gegner nicht übereinander
    for (const o of W.mons) { if (o === m || !o.alive) continue; const dd = dist(m, o); if (dd < m.r + o.r && dd > 0) { moveEnt(m, (m.x - o.x) / dd * 40 * dt, (m.y - o.y) / dd * 40 * dt); } }
  }

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
    if (h.moving) { mx /= Math.max(1, len); my /= Math.max(1, len); moveEnt(h, mx * h.speed * dt, my * h.speed * dt); h.fx = mx / (len > 1 ? 1 : len); h.fy = my / (len > 1 ? 1 : len); const l2 = Math.hypot(h.fx, h.fy) || 1; h.fx /= l2; h.fy /= l2; h.stepT = (h.stepT || 0) - dt; if (h.stepT <= 0) { h.stepT = 0.24; fx('step', { e: h }); } }
    if (input.attack) heroAttack();
    // Regeneration / Effekte
    if (!h.regenT || W.t > h.regenT) { h.regenT = W.t + 2; if (h.regen) { if (h.regen > 0) heal(h, Math.max(1, Math.round(h.maxHp * h.regen / 100))); else { h.hp = Math.max(1, h.hp - Math.max(1, Math.round(h.maxHp * -h.regen / 100))); float(h.x, h.y - 20, '−' + Math.round(h.maxHp * -h.regen / 100), '#ff5f5f', 12); } } }
    for (const e of [h, ...W.mons]) { if (!e.alive) continue; for (const ef of e.effects) { if (W.t >= ef.tick) { ef.tick += 1; hit({ side: ef.kind, crit: 0, alive: false }, e, ef.dmg, { kind: ef.kind, noDodge: true }); } } e.effects = e.effects.filter(ef => ef.until > W.t); }
    // Gegner
    for (const m of W.mons) if (m.alive) monStep(m, dt);
    W.mons = W.mons.filter(m => m.alive || (m.alpha -= dt * 2) > 0);
    // Geschosse
    for (const s of W.shots) {
      s.x += s.vx * dt; s.y += s.vy * dt; s.life -= dt;
      if (solid(s.x, s.y)) { s.life = 0; fx('wallhit', { x: s.x, y: s.y, color: s.color }); continue; }
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
        else if (p.kind === 'potion') { G().run.potions++; p.done = true; float(h.x, h.y - 30, '+1', '#e43b44', 13, 'potion'); fx('pickPotion'); }
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
