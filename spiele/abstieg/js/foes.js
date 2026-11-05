// Der Abstieg – Hauptleute und schlauere Feinde. Hauptleute (A.CAPTAINS in data.js): je Welt ein Offizier mit Namen, festen Elite-Eigenschaften,
// einer eigenen Masche und Sprüchen; er wartet auf der dritten Ebene jeder Welt im Elite-Raum. Reaktionen normaler Gegner: Flucht unter 30 % Leben
// (flee), Rache, wenn ein Kumpel daneben fällt (alle), Sporenwolke, wenn ein Pilz brennt (spores), Panzer bei 30 % (shell).
// world.js ruft captainRoom/makeCaptain beim Füllen des Raums, step/flee/speedMul im Gegner-Schritt, guard/pre/onHurt in der Treffer-Rechnung, onDeath beim Tod.
'use strict';
window.A = window.A || {};

A.Foes = (function () {
  const TAU = Math.PI * 2, EY = 0.6;
  const L = (de, en) => (A.LANG === 'de' ? de : en);
  let api = null;   // Werkzeuge aus world.js: hit, heal, addEffect, float, fx, moveEnt, freeSpot, addMon, clearLine
  const W = () => api.W;
  const G = () => A.Game;
  function bind(a) { api = a; }
  const CAP = (id) => A.CAPTAINS.find(c => c.id === id);
  const say = (m, text, color, size) => api.float(m.x, m.y - (m.giant ? 90 : 62), text, color || m.color, size || 15);

  // ---------- Hauptleute ----------
  // Welcher Hauptmann wartet auf dieser Ebene? (dritte Ebene jeder Welt, auch in den Welten II, III ...)
  function captainFor(floor) { return (Math.max(1, floor) - 1) % A.FLOORS_PER_WORLD === A.CAPTAIN_FLOOR ? A.CAPTAINS.find(c => c.world === A.worldOf(floor).id) || null : null; }
  // Der erste Elite-Raum der Ebene gehört ihm
  function captainRoom(w) { return captainFor(w.floor) && w.rooms.find(r => r.type === 'elite') || null; }
  // Sprüche: {el} = Element, das der Held am meisten trägt, {build} = sein Build-Name
  function line(cap, key) {
    const tx = cap.lines && cap.lines[key]; if (!tx) return '';
    const r = G().run, cnt = r ? A.Gear.counts(r) : {}, el = Object.keys(cnt).sort((a, b) => cnt[b] - cnt[a])[0];
    return A.t(tx).replace('{el}', el ? A.t(A.ELEMENTS[el].name) : L('Angst', 'fear')).replace('{build}', r ? A.Build.name(A.Build.profile(r)) : '???');
  }
  // Bauen (world.js spawnRoom): Grund-Gegner mit festen Eigenschaften, mehr Leben, eigener Name und Farbe
  function makeCaptain(cap, floor) {
    const base = A.MONSTERS.find(m => m.id === cap.base) || A.MONSTERS[0];
    const e = G().monsterEntity(base, floor, cap.traits.slice(), 1);
    e.captain = cap.id; e.name = A.t(cap.name); e.color = cap.col;
    e.maxHp = Math.round(e.maxHp * cap.hpMul); e.hp = e.maxHp;
    if (e.shieldCap) e.shieldCap = Math.round(e.maxHp * 0.3);   // Schildträger: 30 % des echten Lebens
    e.atk = Math.round(e.atk * 1.15); e.mag = Math.round(e.mag * 1.15);
    if (cap.summon) { e.summon = cap.summon; e.summonCd = 6; }
    if (cap.resist) { const r = G().run, cnt = r ? A.Gear.counts(r) : {}, el = Object.keys(cnt).sort((a, b) => cnt[b] - cnt[a])[0]; if (el && cnt[el] >= 2) e.resistEl = el; }
    e.cs = { t: 3, half: false, low: false, phase: null, whisper: 5 };
    return e;
  }
  // Auftritt (world.js spawnRoom): grosse Einblendung mit seiner Masche, dann der erste Spruch
  function onSpawn(m) {
    const cap = CAP(m.captain); if (!cap) return;
    setTimeout(() => { const w = W(); if (!w || !m.alive || !A.FX) return; A.FX.banner(m.name, A.t(cap.trick), cap.col, 3.5); say(m, line(cap, 'enter'), cap.col, 16); if (A.Sound && A.Sound.roar) A.Sound.roar(); }, 900);
  }

  // Masche je Hauptmann (world.js monSpecial, nach den Elite-Eigenschaften): true = steht still oder bewegt sich selbst
  function step(m, dt, d, nx, ny) {
    if ((m.shell || m.shellT) && shellStep(m, dt)) return true;   // Panzer (Krabbe und Krabbenkaiser)
    const w = W(), h = w.hero, s = m.cs, cap = CAP(m.captain); if (!s || !cap) return false;
    s.t -= dt;
    if (cap.sig === 'charge') {   // Sturmangriff: kurz ausholen, dann in gerader Linie auf die Stelle des Helden
      if (s.phase === 'wind') {
        s.pt -= dt; if (s.pt <= 0) { s.phase = 'dash'; s.pt = 0.42; s.hitDone = false; s.lx = m.x; s.ly = m.y; }
        return true;
      }
      if (s.phase === 'dash') {
        s.pt -= dt; api.moveEnt(m, s.dx * 640 * dt, s.dy * 640 * dt);
        const moved = Math.hypot(m.x - s.lx, m.y - s.ly); s.lx = m.x; s.ly = m.y;
        if (!s.hitDone && h.alive && Math.hypot(h.x - m.x, h.y - m.y) < m.r + h.r + 12) { s.hitDone = true; api.hit(m, h, m.atk * 1.6, { kind: 'phys', stun: 0.4 }); api.fx('strike', { m }); if (A.FX) A.FX.shake(0.4); }
        if (s.pt <= 0 || moved < 1) { s.phase = null; s.t = 6; m.cd = 0.6; if (A.FX) A.FX.rocks(m.x, m.y, 4, 60); }
        if (A.FX && !A.FX.low) A.FX.smoke(m.x, m.y + 8, 1, '#e4a672', 3);
        return true;
      }
      if (s.t <= 0 && d > 90 && d < 440 && api.clearLine(m, h)) { s.phase = 'wind'; s.pt = 0.7; s.dx = nx; s.dy = ny; m.fx = nx; m.fy = ny; say(m, L('Sturmangriff!', 'Charge!'), cap.col, 16); api.fx('windup', { m }); return true; }
    }
    if (cap.sig === 'whisper' && (s.whisper -= dt) <= 0 && d < 420 && h.alive) {   // Flüstern: Abklingzeiten verlängern
      s.whisper = 7; let n = 0; for (const k in h.cds) if (h.cds[k] > w.t) { h.cds[k] += 1.5; n++; }   // cds = Zeitpunkt, ab dem der Zauber wieder geht
      api.float(h.x, h.y - 46, n ? L('Flüstern... langsamer...', 'Whispers... slower...') : L('Flüstern...', 'Whispers...'), cap.col, 14);
      if (A.FX) { A.FX.flash(h.x, h.y, 70, cap.col, 0.3); A.FX.ev('nova', { e: m, r: 80, color: cap.col, magic: true }); }
      return false;
    }
    return false;
  }
  // Panzer (Krabbe und Krabbenkaiser): solange er drin ist, steht er still; danach heilt er sich einmal
  function shellStep(m, dt) {
    if (!(m.shellT > W().t)) return false;
    if (A.FX && !A.FX.low && Math.random() < dt * 8) A.FX.part({ kind: 'ring', x: m.x, y: m.y, life: 0.4, size: m.r * 2.4, color: '#2ce8f5', add: true });
    return true;
  }

  // Treffer-Rechnung (world.js hit): Panzer fängt alles ab
  function guard(from, to, opts) {
    if (to.side !== 'enemy' || !(to.shellT > W().t)) return null;
    api.float(to.x, to.y - to.r - 10, L('Panzer', 'Shell'), '#2ce8f5', 12); return 0;
  }
  // Sandak: Treffer mit dem Lieblings-Element des Helden halbiert (ein Spruch, nicht bei jedem Treffer)
  function pre(from, to, opts) {
    if (from.side === 'enemy' && from.revT > W().t && to.side === 'hero') return { mul: 1.25 };   // Rache: 25 % mehr Schaden
    if (!to.resistEl || from !== W().hero || opts.kind === 'poison' || opts.kind === 'burn' || opts.kind === 'thorns') return null;
    if (!(to.resistSaid > W().t)) { to.resistSaid = W().t + 3; say(to, L(`${A.t(A.ELEMENTS[to.resistEl].name)}? Kitzelt.`, `${A.t(A.ELEMENTS[to.resistEl].name)}? Tickles.`), '#c0cbdc', 13); }
    return { mul: 0.55 };
  }
  // Getroffen (world.js hit, vor der Todes-Prüfung): Sprüche und Maschen bei halbem Leben und bei 30 %, Sporenwolke, Panzer
  function onHurt(m, from, dmg, opts) {
    const w = W(); if (!m.alive || m.hp <= 0) return;
    const cap = m.captain ? CAP(m.captain) : null, s = m.cs;
    if ((m.spores || (cap && cap.sig === 'spores')) && opts && opts.kind === 'burn' && !(m.sporeT > w.t)) spores(m, cap);
    if ((m.shell || (cap && cap.sig === 'shell')) && !m.shelled && m.hp < m.maxHp * 0.3) {
      m.shelled = true; m.shellT = w.t + (cap ? 2.5 : 1.2);
      say(m, cap ? line(cap, 'low') : L('Panzer zu!', 'Shell shut!'), '#2ce8f5', 14); api.fx('shield', { e: m });
    }
    if (!cap || !s) return;
    if (!s.half && m.hp < m.maxHp * 0.5) {
      s.half = true; say(m, line(cap, 'half'), cap.col, 16);
      if (cap.sig === 'swarm') { m.fleeUntil = w.t + 1.6; m.fleeing = true; m.state = 'chase'; summonPack(m, cap.summon || 'ratte', 3); }
    }
    if (!s.low && m.hp < m.maxHp * 0.3) {
      s.low = true;
      if (cap.sig === 'forge') { rage(m); say(m, line(cap, 'low'), '#e43b44', 16); summonPack(m, cap.summon || 'glutwicht', 2); }
    }
  }
  function rage(m) {
    m.raged = true; m.speed *= 1.3; m.atk = Math.round(m.atk * 1.3); m.mag = Math.round(m.mag * 1.3);
    if (A.FX) { A.FX.ev('nova', { e: m, r: 100, color: '#e43b44', magic: true }); A.FX.shake(0.4); }
    if (A.Sound && A.Sound.roar) A.Sound.roar();
  }
  function summonPack(m, mid, n) {
    const base = A.MONSTERS.find(x => x.id === mid); if (!base) return;
    for (let i = 0; i < n; i++) {
      const c = G().monsterEntity(base, W().floor, false, 60 + i), a = Math.random() * TAU;
      const mm = api.addMon(c, m.x + Math.cos(a) * 56, m.y + Math.sin(a) * 42); mm.summoned = true; mm.spawn = 0.4 + i * 0.1; api.fx('spawn', { m: mm });
    }
  }
  // Sporenwolke: Giftpfütze um den Pilz (Elites.tick wertet sie aus) und sofort Gift, wer drinsteht
  function spores(m, cap) {
    const w = W(), h = w.hero, r = cap ? 80 : 60, dmg = Math.max(1, Math.round(m.atk * (cap ? 0.4 : 0.3)));
    m.sporeT = w.t + 3;
    (w.efx || (w.efx = [])).push({ kind: 'puddle', pk: 'poison', src: m, x: m.x, y: m.y + 6, r, t0: w.t, until: w.t + 3.5, tick: w.t + 0.2, dmg });
    if (h.alive && ((h.x - m.x) / r) ** 2 + ((h.y - m.y) / (r * EY)) ** 2 < 1.2) api.addEffect(h, 'poison', dmg, 3);
    say(m, L('Sporen!', 'Spores!'), '#63c74d', 14);
    if (A.FX) { A.FX.burst(m.x, m.y - 8, 18, { color: ['#63c74d', '#b86fa0', '#d06bb0'], smin: 40, smax: 150, z: 3, vz: 90, g: 120, life: 0.8, add: true }); A.FX.ev('nova', { e: m, r, color: '#63c74d', magic: true }); }
  }

  // ---------- Reaktionen normaler Gegner ----------
  // Flucht (world.js monSpecial): unter 30 % Leben rennt er 1,8 Sekunden vom Helden weg; wer ihn dabei erwischt, zählt für «Keine Flucht»
  function flee(m, dt, d, nx, ny) {
    const w = W();
    if (m.flee && !m.fled && m.state !== 'leap' && m.hp > 0 && m.hp < m.maxHp * 0.3 && !m.captain) { m.fled = true; m.state = 'chase'; m.fleeUntil = w.t + 1.8; m.fleeing = true; say(m, m.mid === 'kobolddieb' ? L('Tschüss!', 'Bye!') : L('Hilfe!', 'Help!'), '#fee761', 13); }
    if (!(m.fleeUntil > w.t)) { if (m.fleeing) { m.fleeing = false; m.fdir = null; m.cd = Math.min(m.cd, 0.3); } return false; }
    if (!m.fdir) m.fdir = fleeDir(m, w.hero);
    const sp = m.speed * 1.25 * dt, x0 = m.x, y0 = m.y;
    api.moveEnt(m, m.fdir[0] * sp, m.fdir[1] * sp); m.fx = m.fdir[0]; m.fy = m.fdir[1];
    if (Math.hypot(m.x - x0, m.y - y0) < sp * 0.4) m.fdir = fleeDir(m, w.hero, m.fdir);   // Wand: andere Richtung
    return true;
  }
  // Richtung mit dem meisten freien Weg, möglichst weg vom Helden (8 Richtungen, bis 150 px weit geprüft)
  function fleeDir(m, h, not) {
    let best = null, bs = -1e9;
    for (let i = 0; i < 8; i++) {
      const a = i / 8 * TAU, dx = Math.cos(a), dy = Math.sin(a);
      if (not && dx * not[0] + dy * not[1] > 0.9) continue;
      let free = 0; for (let d = 16; d <= 150; d += 16) { if (api.blocked(m.x + dx * d, m.y + dy * d, m.r) || !api.reachable(m.x + dx * d, m.y + dy * d)) break; free = d; }
      const away = Math.hypot(m.x + dx * free - h.x, m.y + dy * free - h.y);
      const score = free * 2 + away; if (score > bs) { bs = score; best = [dx, dy]; }
    }
    return best || [(m.x - h.x) / (Math.hypot(m.x - h.x, m.y - h.y) || 1), (m.y - h.y) / (Math.hypot(m.x - h.x, m.y - h.y) || 1)];
  }
  // Rache: schneller und stärker, solange sie dauert
  function speedMul(m) { return m.revT > W().t ? 1.3 : 1; }
  // Beim Tod (world.js checkDeath): Hauptmann zählt und spricht, Kumpels in der Nähe nehmen Rache, fliehende Opfer zählen
  function onDeath(e) {
    const w = W(), m = G().meta;
    if (e.fleeUntil > w.t) { A.Achieve.add('fleeKills'); api.float(e.x, e.y - e.r - 44, L('Erwischt!', 'Caught!'), '#fee761', 13); }
    if (e.captain) {
      const cap = CAP(e.captain); if (cap) say(e, line(cap, 'die'), cap.col, 16);
      m.capt = m.capt || {}; m.capt[e.captain] = (m.capt[e.captain] || 0) + 1; A.Achieve.add('captains');
      if (A.FX) { A.FX.banner(L('Hauptmann besiegt!', 'Captain defeated!'), `${e.name} · +${A.CAPTAIN_SPARKS} ${A.t(A.UI.meta)}`, cap ? cap.col : '#fee761', 3); A.FX.shake(0.5); }
      return;
    }
    if (e.summoned || e.mirror) return;
    let n = 0;
    for (const o of w.mons) {
      if (o === e || !o.alive || o.boss || o.captain || o.revenged || o.spawn > 0 || Math.hypot(o.x - e.x, o.y - e.y) > 180) continue;
      o.revenged = true; o.revT = w.t + 4;   // 4 s schneller (speedMul) und stärker (pre)
      if (n++ < 2) say(o, L('Rache!', 'Revenge!'), '#e43b44', 13);
      if (A.FX && !A.FX.low) A.FX.part({ kind: 'smoke', x: o.x, y: o.y - 20, vx: 0, vy: -24, life: 0.5, size: 2, grow: 5, color: '#e43b44', drag: 1 });
    }
  }
  // Einmal pro Bild (world.js tick): Heilung nach dem Panzer, Rauch an Rächern
  function tick(dt) {
    const w = W(); if (!w) return;
    for (const o of w.mons) {
      if (!o.alive) continue;
      // Panzer vorbei: einmal heilen (hier, damit es auch während einer Elite-Masche passiert)
      if (o.shellT && !(o.shellT > w.t) && !o.shellHealed) { o.shellHealed = true; api.heal(o, Math.max(1, Math.round(o.maxHp * (o.captain ? 0.12 : 0.1))), true); say(o, L('Besser.', 'Better.'), '#63c74d', 13); }
      if (A.FX && !A.FX.low && o.revT > w.t && Math.random() < dt * 6) A.FX.part({ kind: 'smoke', x: o.x + (Math.random() - 0.5) * o.r, y: o.y - 18, vx: 0, vy: -20, life: 0.45, size: 2, grow: 4, color: '#e43b44', drag: 1 });
    }
  }

  // ---------- Texte (Lager, Chronik) ----------
  const count = () => { const m = G().meta; return A.CAPTAINS.filter(c => ((m.capt || {})[c.id] || 0) > 0).length; };
  function nameOf(id) { const c = CAP(id); return c ? A.t(c.name) : id; }

  return { bind, captainFor, captainRoom, makeCaptain, onSpawn, step, guard, pre, onHurt, flee, speedMul, onDeath, tick, count, nameOf, line };
})();
