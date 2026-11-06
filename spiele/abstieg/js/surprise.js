// Der Abstieg – Überraschungen in der Welt (ab Ebenen-Bau 8, run.lvVer):
// - Krüge zum Zerschlagen, je Welt eigene (Krug, Korb, Urne, Amphore, Erzkübel, Seelenglas; Daten A.POTS in data.js).
//   Anlaufen, Schlag, Schuss, Flasche oder Explosion zerschlägt sie. Drin: Gold, Bonbons, selten ein Trank oder ein Stück,
//   Krempel mit Spruch, ein Tier, das wegflitzt. Knallkrug (rot, Zündschnur): zischt kurz und explodiert, trifft Gegner und dich.
//   Goldener Krug: viel Gold. Krüge stehen als letzte Dinge im Raum (Reihenfolge im Spielstand), zerbrochen bleibt zerbrochen (props used).
// - Mimik: im Schatzraum ab Ebene 3 beisst manchmal die Truhe (fest aus dem Startwert der Ebene). Die Türen gehen zu;
//   ist sie besiegt, gibt es Bonus-Beute und die Truhe öffnet sich normal (run.tamed merkt sich den Raum).
// - Goldwicht: einmal je Ebene vielleicht in einem Kampfraum; rennt mit seinem Sack weg und verliert bei jedem Treffer Gold.
//   Erwischt = Gold-Regen und ein gutes Stück; nach 9 Sekunden springt er in ein Loch (run.gwFloor).
'use strict';
window.A = window.A || {};

A.Surprise = (function () {
  const L = (de, en) => (A.LANG === 'de' ? de : en);
  const G = () => A.Game;
  const TS = 32, TAU = Math.PI * 2;
  let api = null;   // Werkzeuge aus world.js: hit, float, fx, drop, moveEnt, blocked, reachable, addMon, setDoors
  const W = () => api && api.W;
  function bind(a) { api = a; }
  const st = (w) => w.sur || (w.sur = { fuses: [], crit: [], saveAt: 0, gwSeen: false });
  const potsOf = (r) => (r ? r._pots || (r._pots = r.props.filter(p => p.kind === 'pot')) : []);
  const potKind = (w) => A.POTS[w.world.id] || A.POTS.stone;

  // Eingänge: der gerade Weg von jeder Tür in den Raum (Gang im Raum-Rechteck plus 5 Kacheln, eine Kachel Rand) bleibt frei.
  // Türen kommen zu viert (2 x 2 Kacheln an der Zellgrenze, levels.js) und liegen immer ausserhalb des Raum-Rechtecks.
  function entryLanes(r, tiles, MW) {
    const lane = new Set(), D = r.doors || [];
    const walkT = (x, y) => { const v = tiles[y] ? tiles[y][x] : 0; return v === 1 || v === 5; };
    const inR = (x, y) => x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h;
    for (let k = 0; k + 3 < D.length; k += 4) {
      const g = D.slice(k, k + 4), xs = g.map(q => q[0]), ys = g.map(q => q[1]);
      const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
      const ax = x1 < r.x ? 1 : x0 > r.x + r.w - 1 ? -1 : 0, ay = ax ? 0 : y1 < r.y ? 1 : y0 > r.y + r.h - 1 ? -1 : 0;
      if (!ax && !ay) continue;
      let x = ax > 0 ? r.x : ax < 0 ? r.x + r.w - 1 : x0, y = ay > 0 ? r.y : ay < 0 ? r.y + r.h - 1 : y0, open = -1;
      for (let n = 0; inR(x, y); n++, x += ax, y += ay) {
        // noch im Gang: links und rechts davon Wand; danach ist man im Raum
        const side = ax ? walkT(x, y0 - 1) || walkT(x, y1 + 1) : walkT(x0 - 1, y) || walkT(x1 + 1, y);
        if (open < 0 && side) open = n;
        if (open >= 0 && n > open + 4) break;
        if (ax) { for (let yy = y0 - 1; yy <= y1 + 1; yy++) lane.add(yy * MW + x); }
        else { for (let xx = x0 - 1; xx <= x1 + 1; xx++) lane.add(y * MW + xx); }
      }
    }
    return lane;
  }

  // ---------- Ebene bauen (world.js genFloor, nur ab Ebenen-Bau 8) ----------
  // Fest aus dem Startwert der Ebene: ein Spielstand baut dieselben Krüge an dieselben Stellen
  function place(rooms, tiles, reach, seed, floor) {
    const MW = tiles[0].length, run = G().run, tamed = (run && run.tamedFloor === floor && run.tamed) || [];
    const near = (x, y, list, d) => list.some(q => Math.max(Math.abs(q[0] - x), Math.abs(q[1] - y)) < d);
    for (const r of rooms) {
      if (r.type === 'boss') continue;
      const rng = new A.RNG((((((seed >>> 0) ^ 0x5c3d71a9) >>> 0) + r.i * 7919) >>> 0) || 7);
      // Truhe mit Zähnen (der Wurf kommt immer, auch wenn sie schon besiegt ist: sonst stehen die Krüge anders)
      if (r.type === 'treasure' && floor >= A.MIMIC_FROM) { const c = r.props.find(p => p.kind === 'chest' && !p.secret); if (c && rng.chance(A.MIMIC_CHANCE) && !tamed.includes(r.i)) c.mimic = true; }
      const cnt = A.POT_COUNT[r.type]; if (!cnt) continue;
      const n = rng.int(cnt[0], cnt[1]) + (r.w * r.h > 220 ? 1 : 0);
      if (n <= 0) continue;
      // frei: Boden (kein Gefahr-Boden), erreichbar, weg von Türen, Eingängen, Dingen und dem Startpunkt; am liebsten an einer Wand
      const busy = r.props.map(p => [Math.floor(p.x / TS), Math.floor(p.y / TS)]).concat([[r.anchor.tx, r.anchor.ty], [r.anchor.tx, r.anchor.ty + 1]]);
      const lane = entryLanes(r, tiles, MW), cand = [];
      for (let y = r.y; y < r.y + r.h; y++) for (let x = r.x; x < r.x + r.w; x++) {
        if (tiles[y][x] !== 1 || (r.type !== 'secret' && reach && !reach[y * MW + x])) continue;
        if (lane.has(y * MW + x) || near(x, y, busy, 3) || near(x, y, r.doors || [], 3)) continue;
        let wall = 0; for (let yy = y - 1; yy <= y + 1; yy++) for (let xx = x - 1; xx <= x + 1; xx++) { const v = tiles[yy] ? tiles[yy][xx] : 0; if (v === 0 || v === 3 || v === 4) wall++; }
        cand.push([x, y, wall]);
      }
      const order = rng.shuffle(cand.filter(c => c[2] > 0)).concat(rng.shuffle(cand.filter(c => !c[2])));
      const got = [];
      for (const c of order) {
        if (got.length >= n) break;
        if (near(c[0], c[1], got, 1)) continue;
        if (got.length && !near(c[0], c[1], got, 3) && rng.chance(0.35)) continue;   // gern in kleinen Gruppen
        got.push(c);
      }
      const fight = r.type === 'fight' || r.type === 'elite';
      for (const [x, y] of got) {
        const k = rng.next(), jx = Math.round((rng.next() - 0.5) * 8), jy = Math.round((rng.next() - 0.5) * 6);
        const v = r.type === 'secret' ? (k < 0.25 ? 'gold' : null) : fight && floor >= 2 && k < A.POT_BOOM ? 'boom' : k > 1 - A.POT_GOLDEN ? 'gold' : null;
        const p = { kind: 'pot', x: (x + 0.5) * TS + jx, y: (y + 0.5) * TS + jy, room: r.i, used: false };
        if (v) p.v = v;
        r.props.push(p);
      }
    }
  }

  // ---------- Zerschlagen ----------
  function smash(p) {
    const w = W(); if (!w || p.used || p.lit != null) return;
    const s = st(w);
    if (p.v === 'boom') {   // Knallkrug: erst zischen, dann knallen
      p.lit = w.t; s.fuses.push(p);
      api.float(p.x, p.y - 30, L('Zisch …', 'Hiss …'), '#e43b44', 14);
      if (A.Sound.fuse) A.Sound.fuse();
      return;
    }
    breakOpen(p, w, s);
    loot(p, w);
  }
  function breakOpen(p, w, s) {
    p.used = true; p.brokeT = w.t; s.saveAt = w.t + 1.5;   // run.rooms schreibt die Oberfläche jeden Frame; gespeichert wird kurz danach
    A.Achieve.add('pots');
    const P = potKind(w);
    if (A.FX) { A.FX.burst(p.x, p.y - 8, 10, { color: P.bits, smin: 40, smax: 130, z: 6, vz: 160, g: 520, life: 0.7, size: 2 }); A.FX.smoke(p.x, p.y - 6, 3, '#c0cbdc', 3); }
    if (A.Sound.glass) A.Sound.glass(false);
  }
  function goldMul(w) { const d = G().derived(); return (1 + 0.25 * (w.floor - 1)) * (1 + ((d && d.goldPct) || 0) / 100); }
  function coins(x, y, n, lo, hi, gm) { for (let i = 0; i < n; i++) api.drop({ kind: 'gold', val: Math.max(1, Math.round((lo + Math.random() * (hi - lo)) * gm)) }, x, y, 50 + Math.random() * 90); }
  function loot(p, w) {
    const gm = goldMul(w), P = potKind(w), say = (t, col, size) => api.float(p.x, p.y - 34, t, col || '#fee761', size || 13);
    if (p.v === 'gold') {
      coins(p.x, p.y - 6, 8 + Math.floor(Math.random() * 3), 1.5, 3, gm);
      if (Math.random() < 0.35) api.drop({ kind: 'item', it: G().randomItem(G().rollRarity(1)) }, p.x, p.y, 50);
      say((P.gold ? A.t(P.gold) : L('Goldener ' + A.t(P.name), 'Golden ' + A.t(P.name).toLowerCase())) + '!', '#fee761', 16);
      if (A.FX) A.FX.flash(p.x, p.y - 8, 90, '#fee761', 0.45);
      if (A.Sound.coin) A.Sound.coin();
      return;
    }
    const k = Math.random();
    if (k < 0.46) coins(p.x, p.y - 6, 1 + Math.floor(Math.random() * 2), 0.8, 2, gm);
    else if (k < 0.58) { api.drop({ kind: 'candy' }, p.x, p.y - 6, 60); if (Math.random() < 0.5) api.drop({ kind: 'candy' }, p.x, p.y - 6, 70); }
    else if (k < 0.60) api.drop({ kind: 'potion' }, p.x, p.y - 6, 50);
    else if (k < 0.625) api.drop({ kind: 'item', it: G().randomItem() }, p.x, p.y, 50);
    else if (k < 0.71) { coins(p.x, p.y - 6, 1, 1, 1, 1); const j = A.POT_JUNK[Math.floor(Math.random() * A.POT_JUNK.length)]; say(A.t(j), '#c0cbdc', 12); }
    else if (k < 0.79) critter(p, w, P);
    else if (Math.random() < 0.3) say(L('Leer.', 'Empty.'), '#8b9bb4', 12);
  }
  // Ein Tier flitzt aus dem Krug, weg vom Helden (nur zum Anschauen)
  function critter(p, w, P) {
    const h = w.hero, d = Math.hypot(p.x - h.x, p.y - h.y) || 1, a = Math.atan2((p.y - h.y) / d, (p.x - h.x) / d) + (Math.random() - 0.5) * 0.9;
    st(w).crit.push({ id: P.critter, x: p.x, y: p.y, r: 5, dx: Math.cos(a), dy: Math.sin(a), t: 0, life: 1.8 });
    const t = { ratte: L('Quiek!', 'Squeak!'), frosch: L('Quak!', 'Croak!'), krabbe: L('Klack klack!', 'Click clack!'), fledermaus: L('Fiep!', 'Eep!') }[P.critter] || '!';
    api.float(p.x, p.y - 34, t, '#ffffff', 13);
    if (A.Sound.squeak) A.Sound.squeak();
  }
  function explode(p) {
    const w = W(), s = st(w), R = 92, h = w.hero;
    breakOpen(p, w, s);
    const src = { side: 'pot', crit: 0, alive: false, atk: 0, mag: 0, x: p.x, y: p.y };
    for (const m of w.mons.slice()) {
      if (!m.alive || m.spawn > 0 || Math.hypot(m.x - p.x, m.y - p.y) > R + m.r) continue;
      const pct = m.boss ? 0.05 : m.elite || m.traits ? 0.14 : 0.35;
      api.hit(src, m, Math.max(1, m.maxHp * pct), { kind: 'magic', noCrit: true, color: '#feae34' });
    }
    if (h.alive && Math.hypot(h.x - p.x, h.y - p.y) < R * 0.75) api.hit(src, h, Math.max(1, h.maxHp * 0.08), { kind: 'magic', noCrit: true, color: '#feae34' });
    api.fx('boom', { x: p.x, y: p.y, r: R, color: '#feae34' });
    api.float(p.x, p.y - 40, L('Knallkrug!', 'Boom jar!'), '#feae34', 16);
    if (A.FX) A.FX.shake(0.25);
    blast(p.x, p.y, R);   // Kettenreaktion: die Nachbarn gehen mit
  }
  // Treffer-Flächen des Helden: Hieb (Kegel), Schuss, Explosion, Flasche
  function arc(h, radius) {
    const w = W(); if (!w) return;
    for (const p of potsOf(w.room)) {
      if (p.used) continue; const d = Math.hypot(p.x - h.x, p.y - h.y); if (d > radius + 10) continue;
      const dot = ((p.x - h.x) * h.fx + (p.y - h.y) * h.fy) / (d || 1);
      if (dot < 0.2 && d > h.r + 16) continue;
      smash(p);
    }
  }
  function shot(s) {
    const w = W(); if (!w) return;
    for (const p of potsOf(w.room)) if (!p.used && Math.abs(p.x - s.x) < s.r + 10 && Math.abs(p.y - 6 - s.y) < s.r + 12) smash(p);
  }
  function blast(x, y, r) {
    const w = W(); if (!w || !w.rooms) return;
    for (const rr of w.rooms) for (const p of potsOf(rr)) if (!p.used && Math.hypot(p.x - x, p.y - y) < r + 8) smash(p);
  }

  // ---------- Jeden Frame (world.js step) ----------
  function tick(dt) {
    const w = W(); if (!w) return;
    const s = st(w), h = w.hero;
    if (h.alive) for (const p of potsOf(w.room)) if (!p.used && Math.hypot(p.x - h.x, p.y - h.y) < h.r + 10) smash(p);   // durchlaufen
    if (s.fuses.length) { for (const p of s.fuses) if (!p.used && w.t >= p.lit + 0.9) explode(p); s.fuses = s.fuses.filter(p => !p.used); }
    for (const c of s.crit) { c.t += dt; const sp = 190 * dt; api.moveEnt(c, c.dx * sp, c.dy * sp); }
    if (s.crit.length) s.crit = s.crit.filter(c => c.t < c.life);
    if (s.saveAt && w.t >= s.saveAt) { s.saveAt = 0; G().save(); }
  }

  // ---------- Mimik (ui.js useProp, bevor die Truhe aufgeht) ----------
  function wake(p) {
    const w = W(); if (!w || !p.mimic || w.active) return false;
    const r = w.rooms[p.room], base = A.MONSTERS.find(m => m.id === 'mimik'); if (!r || !base) return false;
    const e = G().monsterEntity(base, w.floor, false, 96); e.mimicOf = p;
    const pm = A.Pacts.hpMul(e); if (pm !== 1) { e.maxHp = Math.round(e.maxHp * pm); e.hp = e.maxHp; }   // Gierschlund (pacts.js)
    p.hidden = true; w.near = null;   // die Truhe ist jetzt der Gegner; ist der Raum frei, taucht sie wieder auf (world.js)
    const m = api.addMon(e, p.x, p.y); m.spawn = 0.3; m.cd = 0.7;
    w.active = r; w.stats.dmgRoom = 0; w.stats.low = false; r.lockT = null; api.setDoors(r, 2); api.fx('lock', { r }); w.hint = ''; r.monsters = 1;
    api.fightStart();   // wie beim Betreten eines Kampfraums: Schutzengel, Set-Schild, Würfel, Legenden
    api.float(p.x, p.y - 46, L('Die Truhe hat Zähne!', 'The chest has teeth!'), '#e43b44', 17);
    if (A.FX) { A.FX.shake(0.35); A.FX.banner(L('Mimik!', 'Mimic!'), L('Die Truhe beisst zurück', 'The chest bites back'), '#e43b44', 2.2); A.FX.burst(p.x, p.y - 10, 14, { color: ['#b86f50', '#733e39', '#ffffff'], smin: 40, smax: 150, z: 6, vz: 150, g: 500, life: 0.6, size: 2 }); }
    if (A.Sound.roar) A.Sound.roar();
    return true;
  }
  // Zeichen am Truhen-Bild (draw.js): ab und zu leckt sie sich kurz die Lippen
  function tell(dr, p, x, top, t) {
    const c = (t * 0.8 + p.x * 0.013) % 4.2; if (c > 0.35) return;
    const b = dr.b; b.fillStyle = '#e43b44'; b.fillRect(Math.round(x + 1), Math.round(top + 5), 3, 1); b.fillStyle = '#f6757a'; b.fillRect(Math.round(x + 3), Math.round(top + 6), 1, 1);
  }

  // ---------- Goldwicht ----------
  // spawnRoom (world.js): vielleicht ein Goldwicht mehr im Kampfraum (höchstens einer je Ebene)
  function extra(r, f, list) {
    const run = G().run; if (!run || (run.lvVer || 0) < 8 || r.type !== 'fight' || f < A.GOLDWICHT_FROM || run.gwFloor === f) return;
    if (!run.rng.chance(A.GOLDWICHT_CHANCE)) return;
    const base = A.MONSTERS.find(m => m.id === 'goldwicht'); if (!base) return;
    run.gwFloor = f;
    const e = G().monsterEntity(base, f, false, 77); e.gw = true; list.push(e);
  }
  // Weglaufen: Richtung mit viel freiem Weg und weit weg vom Helden
  function away(m, h, not) {
    let best = null, bs = -1e9;
    for (let i = 0; i < 12; i++) {
      const a = i / 12 * TAU, dx = Math.cos(a), dy = Math.sin(a);
      if (not && dx * not[0] + dy * not[1] > 0.9) continue;
      let free = 0, close = 1e9;
      for (let d = 16; d <= 160; d += 16) {
        const x = m.x + dx * d, y = m.y + dy * d;
        if (api.blocked(x, y, m.r) || !api.reachable(x, y)) break;
        free = d; close = Math.min(close, Math.hypot(x - h.x, y - h.y));
      }
      // weit weg vom Helden zählt am meisten; nie dem Helden in die Arme laufen
      const score = Math.hypot(m.x + dx * free - h.x, m.y + dy * free - h.y) + free * 0.5 - (close < 64 ? 260 : 0);
      if (score > bs) { bs = score; best = [dx, dy]; }
    }
    return best || [1, 0];
  }
  function step(m, dt, d) {
    const w = W(), h = w.hero, s = st(w);
    if (m.gwT == null) {
      m.gwT = w.t + A.GOLDWICHT_TIME; m.gwHp = m.hp; m.speed = Math.round(h.speed * 0.8);
      api.float(m.x, m.y - 40, L('Meins! Alles meins!', 'Mine! All mine!'), '#fee761', 14);
      if (!s.gwSeen && A.FX) { s.gwSeen = true; A.FX.banner(L('Ein Goldwicht!', 'A gold gremlin!'), L('Erwisch ihn, bevor er abhaut', 'Catch him before he runs off'), '#fee761', 2.4); }
    }
    // getroffen: Gold fällt aus dem Sack
    if (m.hp < m.gwHp) {
      m.gwDrop = (m.gwDrop || 0) + (m.gwHp - m.hp) / m.maxHp; m.gwHp = m.hp;
      let n = 0; while (m.gwDrop >= 0.12 && n < 4) { m.gwDrop -= 0.12; n++; }
      if (n) { coins(m.x, m.y - 8, n, 1, 2, goldMul(w)); if (Math.random() < 0.35) api.float(m.x, m.y - 44, L('Aua, mein Gold!', 'Ow, my gold!'), '#fee761', 13); }
    }
    if (w.t >= m.gwT) { vanish(m, w); return true; }
    if (w.t > m.gwT - 2.2 && !m.gwWarn) { m.gwWarn = true; api.float(m.x, m.y - 44, L('Gleich bin ich weg!', 'Almost gone!'), '#fee761', 13); }
    if (!m.gwDir || (m.gwDirT = (m.gwDirT || 0) - dt) <= 0) { m.gwDir = away(m, h); m.gwDirT = d < 120 ? 0.25 : 0.6; }
    const sp = m.speed * api.slowMul(m) * api.hazardSlow(m) * dt * (d < 150 ? 1.15 : 0.8), x0 = m.x, y0 = m.y;   // Frost und Schlamm bremsen auch ihn
    api.moveEnt(m, m.gwDir[0] * sp, m.gwDir[1] * sp); m.fx = m.gwDir[0]; m.fy = m.gwDir[1];
    if (Math.hypot(m.x - x0, m.y - y0) < sp * 0.4) { m.gwDir = away(m, h, m.gwDir); m.gwDirT = 0.4; }
    if (A.FX && !A.FX.low && Math.random() < 0.3) A.FX.part({ kind: 'spark', add: true, x: m.x + (Math.random() - 0.5) * 16, y: m.y - 6, vx: 0, vy: -15, life: 0.45, color: Math.random() < 0.5 ? '#fee761' : '#ffffff', drag: 1 });
    return true;
  }
  function vanish(m, w) {
    m.alive = false; m.hp = 0; m.alpha = 0; m.gone = true;   // weg, ohne Leiche
    api.float(m.x, m.y - 44, L('Tschüssi!', 'Toodles!'), '#fee761', 15);
    if (A.FX) { A.FX.smoke(m.x, m.y - 6, 10, '#3e2731', 5); A.FX.part({ kind: 'ring', x: m.x, y: m.y - 4, life: 0.4, size: 40, color: '#fee761', add: true }); }
    if (A.Sound.pop) A.Sound.pop();
  }

  // ---------- Besiegt (world.js checkDeath) ----------
  function onDeath(e) {
    const w = W(); if (!w) return;
    if (e.gw) {
      coins(e.x, e.y - 8, 14 + Math.floor(Math.random() * 5), 2, 4, goldMul(w));
      api.drop({ kind: 'item', it: G().randomItem(G().rollRarity(2)) }, e.x, e.y, 60);
      api.float(e.x, e.y - e.r - 60, L('Jackpot!', 'Jackpot!'), '#fee761', 20);
      if (A.FX) { A.FX.flash(e.x, e.y - 8, 140, '#fee761', 0.55); A.FX.burst(e.x, e.y - 10, 24, { color: ['#fee761', '#feae34', '#ffffff'], smin: 50, smax: 180, life: 0.7, add: true, kind: 'spark', drag: 3 }); }
      A.Achieve.add('gwicht'); G().saveMeta();
    }
    if (e.mimicOf) {
      const p = e.mimicOf, run = G().run;
      p.mimic = false;
      if (run) { if (run.tamedFloor !== w.floor) { run.tamedFloor = w.floor; run.tamed = []; } if (!run.tamed.includes(p.room)) run.tamed.push(p.room); }
      coins(e.x, e.y - 8, 8, 2, 3, goldMul(w));
      api.drop({ kind: 'item', it: G().randomItem(G().rollRarity(1)) }, e.x, e.y, 50);
      api.float(p.x, p.y - 60, L('Jetzt ist sie brav.', 'Good chest.'), '#fee761', 14);
      A.Achieve.add('mimics'); G().saveMeta(); G().save();
    }
  }

  // ---------- Zeichnen (draw.js) ----------
  function palOf(w, p) { return p.v === 'boom' ? A.POT_BOOM_PAL : p.v === 'gold' ? A.POT_GOLD_PAL : potKind(w).pal; }
  // ganzer Krug (in der Tiefen-Reihenfolge mit Figuren)
  function draw(dr, p, w, x, y) {
    const P = potKind(w), b = dr.b, t = dr.t;
    const spr = A.Art.sprite(P.spr, 0, palOf(w, p), 'pot' + w.world.id + (p.v || ''));
    const left = Math.round(x - spr.w / 2), top = Math.round(y + 4 - spr.h);
    dr.shadow(x, y + 3, 5);
    if (p.lit != null) {   // Knallkrug brennt: blinkt und zittert
      const k = t - p.lit, on = Math.floor(k * 14) % 2 === 0, j = Math.round(Math.sin(k * 60));
      b.drawImage(on ? A.Art.white(spr) : spr.img, left + j, top);
      if (A.FX && !A.FX.low && Math.random() < 0.6) A.FX.part({ kind: 'spark', add: true, x: p.x, y: p.y - spr.h * 2, vx: (Math.random() - 0.5) * 50, vy: -40 - Math.random() * 40, life: 0.3, color: Math.random() < 0.5 ? '#fee761' : '#f77622', drag: 2 });
      return top;
    }
    b.drawImage(spr.img, left, top);
    const g = dr.g;
    if (p.v === 'boom') {   // Zündschnur: dunkler Docht, oben ein Funke (der leuchtet)
      const sx = Math.round(x), sp = Math.floor(t * 6 + p.x) % 2 ? '#fee761' : '#f77622';
      b.fillStyle = '#3e2731'; b.fillRect(sx, top - 2, 1, 2); b.fillStyle = sp; b.fillRect(sx, top - 3, 1, 1);
      g.fillStyle = sp; g.fillRect(sx, top - 3, 1, 1);
    }
    else if (p.v === 'gold' && Math.floor(t * 3 + p.x) % 4 === 0) { g.fillStyle = '#ffffff'; const k = Math.floor(t * 12) % 3; g.fillRect(left + 2 + k * 2, top + 3 + k, 1, 1); }
    return top;
  }
  // Scherben am Boden und die Tiere, die weglaufen
  function drawGround(dr, w, cx, cy) {
    const P = potKind(w), b = dr.b, bits = A.Art.sprite('pot_bits', 0, P.pal, 'bits' + w.world.id);
    for (const r of w.rooms) for (const p of potsOf(r)) {
      if (!p.used) continue;
      const x = p.x / 2 - cx, y = p.y / 2 - cy;
      b.globalAlpha = 0.85; b.drawImage(bits.img, Math.round(x - bits.w / 2), Math.round(y + 3 - bits.h)); b.globalAlpha = 1;
    }
  }
  function drawList(list, dr, w, cx, cy) {
    const s = w.sur; if (!s || !s.crit.length) return;
    for (const c of s.crit) list.push({ y: c.y / 2 + 4, f: () => {
      const n = A.Art.monFrames(c.id) || 1, spr = A.Art.monSprite(c.id, Math.floor(c.t * 12) % n), img = c.dx < 0 ? A.Art.flipped(spr) : spr.img;
      const x = c.x / 2 - cx, y = c.y / 2 - cy, a = Math.max(0, Math.min(1, (c.life - c.t) / 0.4));
      dr.b.globalAlpha = a; dr.b.drawImage(img, Math.round(x - spr.w * 0.35), Math.round(y - spr.h * 0.7), Math.round(spr.w * 0.7), Math.round(spr.h * 0.7)); dr.b.globalAlpha = 1;
    } });
  }
  function lights(w, Lt) {
    for (const r of w.rooms) for (const p of potsOf(r)) {
      if (p.used) continue;
      if (p.lit != null) Lt(p.x, p.y - 12, 60, '#f77622', 0.7);
      else if (p.v === 'boom') Lt(p.x, p.y - 22, 14, '#f77622', 0.35);
      else if (p.v === 'gold') Lt(p.x, p.y - 10, 26, '#fee761', 0.35 + Math.sin(w.t * 3 + p.x) * 0.08);
      else if (w.world.id === 'abyss') Lt(p.x, p.y - 10, 22, '#2ce8f5', 0.3);   // Seelenglas leuchtet ein wenig
    }
  }

  return { bind, place, smash, arc, shot, blast, tick, wake, tell, extra, step, onDeath, draw, drawGround, drawList, lights, potsOf };
})();
