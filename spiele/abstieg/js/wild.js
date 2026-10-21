// Der Abstieg – Zehn verrückte Stücke (A.LEGENDS mit src 'wild' in data.js): Bienen, Bananenschalen, Gartenzwerge, Seifenblasen,
// Kisti, Gewitterwolke, Piñata, Sparschwein, Party-Tröte und Fliegenklatsche. Sie fallen überall (game.js wildLegend), ab Welt 2 viel öfter.
// world.js ruft die Haken (tick, step, onAttack, onKill, onHurt, onCoin, onRoomStart); draw.js zeichnet, was dabei entsteht
// (W.wild: Schalen, Blasen, Klatsche; W.bees; W.cloud; Zwerge und Kisti laufen als Helfer in W.allies mit a.leg).
'use strict';
window.A = window.A || {};

A.Wild = (function () {
  const TAU = Math.PI * 2, PX = 2;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const L = (de, en) => (A.LANG === 'de' ? de : en);
  let api = null;   // Werkzeuge aus world.js: hit, heal, kill, float, fx, shoot, moveEnt, mkAlly, heroPower, freeSpot, clearLine, drop
  const W = () => api && api.W;
  function bind(a) { api = a; }
  const live = (m) => m.alive && !(m.spawn > 0);
  const fight = (w) => !!(w && w.active && w.mons.some(live));
  const has = (h, id) => !!(h && h.leg && h.leg[id]);
  const pow = (h) => api.heroPower(h);
  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  function add(o) { const w = W(); (w.wild || (w.wild = [])).push(o); return o; }
  const list = (w, kind) => (w.wild || []).filter(o => o.kind === kind && !o.done);
  const CONF = ['#e43b44', '#feae34', '#fee761', '#63c74d', '#2ce8f5', '#b55088', '#ffffff'];
  const CANDY = ['#e43b44', '#63c74d', '#2ce8f5', '#feae34', '#b55088'];
  const PIG_MAX = 40, CLOUD_Z = 74;

  // nächster Gegner (skip: diese nicht); seen: nur mit freier Sicht
  function nearest(x, y, maxD, skip, seen) {
    const w = W(); let best = null, bd = maxD;
    for (const m of w.mons) {
      if (!live(m) || (skip && skip.has(m))) continue;
      const d = Math.hypot(m.x - x, m.y - y); if (d < bd && (!seen || api.clearLine(seen, m))) { bd = d; best = m; }
    }
    return best;
  }
  function confetti(x, y, n, sp) {
    if (A.FX) A.FX.burst(x, y, n, { color: CONF, smin: 40, smax: sp || 180, z: 8, vz: 160, g: 380, life: 0.9, size: 2, drag: 1.5 });
  }

  // ---------- Bienenkorb-Helm: Bienen schwirren um den Kopf und stechen ----------
  function bees(w, h, dt, inFight) {
    const bs = w.bees || (w.bees = []), mad = h.beeMad > w.t, n = has(h, 'bienen') && h.alive ? (mad ? 12 : 6) : 0;
    while (bs.length < n) bs.push({ x: h.x + (Math.random() - 0.5) * 16, y: h.y, z: 40, ph: Math.random() * TAU, sp: 2.5 + Math.random() * 2, cd: 0.3 + Math.random(), m: null, fx: 1 });
    if (bs.length > n) bs.length = n;
    if (!n) return;
    // Ziele: die drei nächsten Gegner, jede Biene bleibt bei ihrem, bis er fällt
    const near = inFight ? w.mons.filter(m => live(m) && dist(m, h) < 380).sort((a, b) => dist(a, h) - dist(b, h)).slice(0, 3) : [];
    bs.forEach((b, i) => {
      b.cd -= dt; b.ph += dt * b.sp;
      if (b.m && (!live(b.m) || !near.includes(b.m))) b.m = null;
      if (!b.m && near.length) b.m = near[i % near.length];
      const m = b.m;
      const tx = m ? m.x + Math.cos(b.ph * 1.7) * (m.r + 6) : h.x + Math.cos(b.ph) * 18;
      const ty = m ? m.y + Math.sin(b.ph * 1.7) * (m.r + 6) * 0.6 : h.y + Math.sin(b.ph) * 8;
      const tz = m ? 14 + Math.sin(b.ph * 3) * 6 : 42 + Math.sin(b.ph * 2) * 5;
      const k = Math.min(1, dt * (m ? 6 : 8)); const ox = b.x;
      b.x += (tx - b.x) * k; b.y += (ty - b.y) * k; b.z += (tz - b.z) * k;
      if (Math.abs(b.x - ox) > 0.05) b.fx = b.x > ox ? 1 : -1;
      if (m && b.cd <= 0 && Math.hypot(m.x - b.x, m.y - b.y) < m.r + 12) {
        b.cd = 1 + Math.random() * 0.5;
        api.hit(h, m, pow(h) * (mad ? 0.12 : 0.1), { kind: 'phys', proc: true, noKb: true, poison: 0.3, color: '#fee761' });
      }
    });
  }

  // ---------- Affenstiefel: Bananenschalen ----------
  function peels(w, h, dt, inFight) {
    if (!has(h, 'banane') || !inFight || !h.moving || !h.alive) return;
    if ((h.peelT = (h.peelT == null ? 0.6 : h.peelT) - dt) > 0) return;
    h.peelT = 0.9;
    const mine = list(w, 'peel'); if (mine.length >= 6) mine[0].done = true;   // die älteste verschwindet
    add({ kind: 'peel', x: h.x - h.fx * 16, y: h.y - h.fy * 10, t0: w.t, until: w.t + 15, flip: Math.random() < 0.5 });
  }
  function slip(o, w) {
    if (w.t < o.t0 + 0.4) return;
    for (const m of w.mons) {
      if (!live(m) || m.fly || m.slipUntil > w.t || dist(m, o) > m.r + 10) continue;
      o.done = true;
      const dur = m.boss ? 0.5 : m.giant ? 0.9 : 1.6;
      m.stun = Math.max(m.stun, dur); m.slip0 = w.t; m.slipUntil = w.t + dur;
      if (m.state === 'windup') m.state = 'chase';
      api.hit(w.hero, m, pow(w.hero) * 0.5, { kind: 'phys', proc: true, noKb: true, color: '#fee761' });
      api.float(m.x, m.y - m.r - 26, L('Rutsch!', 'Slip!'), '#fee761', 14);
      if (A.Sound.slip) A.Sound.slip();
      return;
    }
  }

  // ---------- Zipfelmütze: Gartenzwerge werfen Steinchen ----------
  function gnomes(w, h, dt, inFight) {
    const mine = w.allies.filter(a => a.leg === 'zwerg' && !a.gone);
    if (!has(h, 'zwerg') || !h.alive) { for (const a of mine) { a.gone = true; api.fx('appear', { m: a }); } return; }
    if (!inFight) {   // nach dem Kampf gehen die Zwerge wieder
      for (const a of mine) if ((a.leaveT = (a.leaveT == null ? 1.5 : a.leaveT) - dt) <= 0) { a.gone = true; api.fx('appear', { m: a }); }
      return;
    }
    for (const a of mine) a.leaveT = null;
    if ((h.gnomeT = (h.gnomeT == null ? 1.5 : h.gnomeT) - dt) > 0 || mine.length >= 3) return;
    h.gnomeT = 6;
    const a = api.mkAlly(h, 0.32, 0, false);
    Object.assign(a, { leg: 'zwerg', gnome: true, r: 8, col: '#e43b44', rate: 1.3 });
    [a.x, a.y] = api.freeSpot(h.x + (Math.random() - 0.5) * 80, h.y + 16 + Math.random() * 24, a.r);
    w.allies.push(a);
    api.float(a.x, a.y - 30, L('Zwerg!', 'Gnome!'), '#e43b44', 12);
  }
  // Zwerge bleiben stehen, wo sie aufgestellt wurden, und werfen auf den nächsten Gegner, den sie sehen
  function gnomeStep(a) {
    const w = W(), m = nearest(a.x, a.y, 340, null, a);
    a.moving = false;
    if (m) a.fx = m.x >= a.x ? 1 : -1;
    if (m && a.cd <= 0) {
      a.cd = a.rate; a.swing = 0.25;
      api.shoot(a, m.x, m.y, pow(w.hero) * a.pow, { kind: 'phys', pebble: true, proc: true, quiet: true, noKb: true, color: '#8b9bb4', speed: 330, r: 4, life: 1.3 });
    }
    return true;
  }

  // ---------- Blubber-Teekessel: Seifenblasen fangen Gegner ----------
  function bubbles(w, h, dt, inFight) {
    const mine = list(w, 'bubble');
    if (has(h, 'blasen') && inFight && h.alive && (h.bubT = (h.bubT == null ? 1 : h.bubT) - dt) <= 0) {
      h.bubT = 2.2;
      if (mine.filter(o => !o.m).length < 4) {
        const m = nearest(h.x, h.y, 500); const ang = m ? Math.atan2(m.y - h.y, m.x - h.x) + (Math.random() - 0.5) : Math.random() * TAU;
        add({ kind: 'bubble', x: h.x, y: h.y, z: 34, r: 6, vx: Math.cos(ang), vy: Math.sin(ang), t0: w.t, until: w.t + 7, m: null, ph: Math.random() * TAU });
        if (A.Sound.blub) A.Sound.blub();
      }
    }
    for (const o of mine) {
      if (o.m) { hold(o, w, h); continue; }
      if (!inFight || w.t > o.until) { pop(o, false); continue; }
      // schwebt langsam auf den nächsten Gegner zu, prallt von Wänden ab
      const m = nearest(o.x, o.y, 300);
      if (m) { const d = dist(o, m) || 1, k = Math.min(1, dt * 1.5); o.vx += ((m.x - o.x) / d - o.vx) * k; o.vy += ((m.y - o.y) / d - o.vy) * k; const l = Math.hypot(o.vx, o.vy) || 1; o.vx /= l; o.vy /= l; }
      const sp = 80 * dt, bx = o.x, by = o.y;
      api.moveEnt(o, o.vx * sp, o.vy * sp);
      if (Math.abs(o.x - bx) < Math.abs(o.vx * sp) * 0.5) o.vx = -o.vx;
      if (Math.abs(o.y - by) < Math.abs(o.vy * sp) * 0.5) o.vy = -o.vy;
      o.z = Math.max(16, o.z - dt * 30);
      for (const mm of w.mons) {
        if (!live(mm) || mm.bub || dist(o, mm) > mm.r + 14) continue;
        if (mm.boss) { api.hit(h, mm, pow(h) * 0.8, { kind: 'magic', proc: true, noKb: true, stun: 0.3, color: '#9be8ff' }); pop(o, true); break; }   // Bosse sind zu gross
        o.m = mm; o.cap = w.t; o.until = w.t + 2.5; mm.bub = o; mm.stun = Math.max(mm.stun, 2.6);
        if (mm.state === 'windup') mm.state = 'chase';
        api.float(mm.x, mm.y - mm.r - 30, L('Blubb!', 'Blub!'), '#9be8ff', 14);
        if (A.Sound.blub) A.Sound.blub();
        break;
      }
    }
  }
  // gefangen: der Gegner schwebt hilflos, dann platzt die Blase mit Wucht
  function hold(o, w, h) {
    const m = o.m;
    if (!m.alive) { pop(o, false); return; }
    o.x = m.x; o.y = m.y;
    m.lift = (26 + Math.sin(w.t * 4 + o.ph) * 5) * clamp((w.t - o.cap) / 0.4, 0, 1);
    m.stun = Math.max(m.stun, 0.1);
    if (w.t < o.until) return;
    pop(o, true);
    m.stun = Math.max(m.stun, 0.35);
    api.hit(h, m, pow(h) * 1.6, { kind: 'magic', proc: true, noDodge: true, noKb: true, color: '#9be8ff' });
    for (const mm of w.mons) if (mm !== m && live(mm) && dist(mm, o) < 80 + mm.r) api.hit(h, mm, pow(h) * 0.6, { kind: 'magic', proc: true, noKb: true, color: '#9be8ff' });
  }
  function pop(o, loud) {
    const m = o.m, z = m ? 30 : o.z;
    o.done = true; if (m) { m.lift = 0; m.bub = null; o.m = null; }
    if (A.FX) {
      A.FX.burst(o.x, o.y - z, loud ? 18 : 8, { color: ['#c0f8ff', '#ffffff', '#f6757a', '#9be8ff'], smin: 30, smax: loud ? 170 : 80, life: 0.4, add: true, kind: 'spark', drag: 3 });
      if (loud) { A.FX.part({ kind: 'ring', x: o.x, y: o.y, life: 0.35, size: 80, color: '#9be8ff', add: true }); A.FX.shake(0.1); }
    }
    if (loud) api.float(o.x, o.y - 56, L('PLOPP!', 'POP!'), '#9be8ff', 16);
    if (A.Sound.pop) A.Sound.pop();
  }

  // ---------- Kisti: die hungrige Truhe ----------
  function kisti(w, h) {
    const a = w.allies.find(x => x.leg === 'kisti' && !x.gone);
    if (!has(h, 'kisti') || !h.alive) { if (a) { a.gone = true; api.fx('appear', { m: a }); } return; }
    if (a) return;
    const k = api.mkAlly(h, 0.5, 0, false);
    Object.assign(k, { leg: 'kisti', r: 10, col: '#feae34', rate: 0.8, spd: 1.1 });
    [k.x, k.y] = api.freeSpot(h.x - h.fx * 28, h.y + 12, k.r);
    w.allies.push(k);
  }
  // Rückgabe false: beisst wie jeder Helfer (Gegner in der Nähe oder keine Münze in Sicht)
  function kistiStep(a, dt) {
    const w = W(), h = w.hero;
    if (a.chew > 0) a.chew -= dt;
    if (nearest(a.x, a.y, 80) || dist(a, h) > 300) return false;   // zu weit weg: erst zurück zum Helden
    let best = null, bd = 170;
    for (const p of w.picks) { if (p.kind !== 'gold' || p.t < 0.45 || p.z > 4 || p.noKisti) continue; const d = dist(a, p); if (d < bd && api.clearLine(a, p)) { bd = d; best = p; } }
    if (!best) return false;
    if (a.coin !== best) { a.coin = best; a.coinT = 0; }
    if ((a.coinT += dt) > 2.5) { best.noKisti = true; return false; }   // kommt nicht hin (Säule, Ecke): liegen lassen
    const d = bd || 1; a.fx = (best.x - a.x) / d; a.fy = (best.y - a.y) / d; a.moving = true;
    if (d > a.r + 6) { api.moveEnt(a, a.fx * 290 * dt, a.fy * 290 * dt); return true; }
    eat(a, best, w, h);
    return true;
  }
  function eat(a, p, w, h) {
    const i = w.picks.indexOf(p); if (i >= 0) w.picks.splice(i, 1);
    const r = A.Game.run; r.gold += p.val; r.kisti = (r.kisti || 0) + 1; a.chew = 0.3;
    api.fx('coin', { x: a.x, y: a.y });
    A.Combos.onCoin(h); onCoin(h, p.val);
    if (r.kisti < 20) { api.float(a.x, a.y - 26, L('Mampf! ', 'Munch! ') + r.kisti + '/20', '#feae34', 11); return; }
    r.kisti = 0;
    api.drop({ kind: 'item', it: A.Game.randomItem(A.Game.rollRarity(0.5)) }, a.x, a.y, 70);
    api.float(a.x, a.y - 34, L('Bäh! Ein Item!', 'Bleh! An item!'), '#feae34', 15);
    if (A.FX) A.FX.burst(a.x, a.y - 10, 14, { color: ['#feae34', '#fee761', '#ffffff'], smin: 40, smax: 140, life: 0.5, z: 6, vz: 100, g: 380 });
    if (A.Sound.gulp) A.Sound.gulp(0.8);
  }

  // ---------- Gewitterwolke an der Leine ----------
  function cloud(w, h, dt, inFight) {
    if (!has(h, 'wolke') || !h.alive) { w.cloud = null; return; }
    const c = w.cloud || (w.cloud = { x: h.x, y: h.y, n: 0, flash: 0 });
    const k = Math.min(1, dt * 3); c.x += (h.x - h.fx * 22 - c.x) * k; c.y += (h.y - 2 - c.y) * k;
    if (c.flash > 0) c.flash -= dt;
    if (A.FX && !A.FX.low && Math.random() < dt * 12) A.FX.part({ x: c.x + (Math.random() - 0.5) * 26, y: c.y, z: CLOUD_Z - 8, vx: 0, vy: 0, vz: -120, g: 300, life: 0.35, color: '#7fd8ff', size: 1 });   // Nieselregen
    if (!inFight) return;
    if ((h.cloudT = (h.cloudT == null ? 0.6 : h.cloudT) - dt) > 0) return;
    const m = nearest(c.x, c.y, 330); if (!m) { h.cloudT = 0.2; return; }
    h.cloudT = 1.4; c.n++; c.flash = 0.15;
    zap(c.x, c.y - CLOUD_Z, m, pow(h) * 0.55, h, w);
    if (c.n % 5) return;
    const done = new Set([m]); let cur = m;   // jeder 5. Blitz springt auf drei weitere
    for (let i = 0; i < 3; i++) { const nx = nearest(cur.x, cur.y, 200, done); if (!nx) break; done.add(nx); zap(cur.x, cur.y - 10, nx, pow(h) * 0.45, h, w); cur = nx; }
    api.float(m.x, m.y - m.r - 40, L('Kawumm!', 'Kaboom!'), '#fee761', 15);
    if (A.Sound.thunder) A.Sound.thunder();
  }
  function zap(x, y, m, dmg, h, w) {
    w.bolts.push({ x0: x, y0: y, x1: m.x, y1: m.y - 10, life: 0.25, max: 0.25, col: '#fee761', seed: Math.random() * 99 });
    api.hit(h, m, dmg, { kind: 'magic', proc: true, noKb: true, color: '#fee761' });
    api.fx('zap', { x: m.x, y: m.y, color: '#fee761' });
  }

  // ---------- Party-Tröte ----------
  function horn(w, h, dt, inFight) {
    if (!has(h, 'troete') || !inFight || !h.alive) return;
    if ((h.hornT = (h.hornT == null ? 2 : h.hornT) - dt) > 0) return;
    h.hornT = 7; w.toot = w.t;
    const R = 160;
    for (const m of w.mons) {
      if (!live(m) || dist(m, h) > R + m.r) continue;
      api.hit(h, m, pow(h) * 0.4, { kind: 'magic', proc: true, noKb: true, stun: m.boss ? 0.2 : 0.9, color: '#fee761' });
      const d = dist(m, h) || 1, p = m.boss ? 60 : m.kbImmune ? 0 : m.giant ? 160 : 560;
      m.kbx = (m.x - h.x) / d * p; m.kby = (m.y - h.y) / d * p; m.kbT = 0.25;
    }
    api.float(h.x, h.y - 62, L('TRÖÖÖT!', 'TOOOOT!'), '#fee761', 18);
    confetti(h.x, h.y - 30, 34, 240);
    if (A.FX) { A.FX.part({ kind: 'ring', x: h.x, y: h.y, life: 0.45, size: R, color: '#ffffff', add: true }); A.FX.part({ kind: 'ring', x: h.x, y: h.y, life: 0.6, size: R * 0.8, color: '#fee761', add: true }); A.FX.shake(0.15); }
    if (A.Sound.honk) A.Sound.honk();
  }

  // ---------- Fliegenklatsche der Riesen: jeder 4. normale Angriff ----------
  function onAttack(h) {
    const w = W(); if (!w || !has(h, 'klatsche') || h.atkN % 4 !== 0) return;
    add({ kind: 'swat', x: h.x, y: h.y, ang: Math.atan2(h.fy, h.fx), t0: w.t, at: w.t + 0.1, until: w.t + 0.6, hit: false });
    if (A.Sound.swing) A.Sound.swing();
  }
  function swat(o, w) {
    const h = w.hero, nx = Math.cos(o.ang), ny = Math.sin(o.ang); let n = 0;
    o.hit = true;
    for (const m of w.mons) {
      if (!live(m)) continue;
      const dx = m.x - o.x, dy = m.y - o.y, along = dx * nx + dy * ny, side = Math.abs(dx * ny - dy * nx);
      if (along < 10 || along > 150 + m.r || side > 34 + m.r) continue;
      n++;
      if (!m.boss && m.hp < m.maxHp * 0.3) { m.flat = true; api.kill(m, L('Platt!', 'Flat!'), '#e4a672'); continue; }
      api.hit(h, m, pow(h) * 2.2, { kind: 'phys', proc: true, stun: m.boss ? 0.2 : 0.5, color: '#63c74d' });
    }
    const ex = o.x + nx * 100, ey = o.y + ny * 100;
    api.float(ex, ey - 40, L('KLATSCH!', 'SWAT!'), '#63c74d', 17);
    if (A.FX) { A.FX.smoke(ex, ey, 8, '#8b9bb4', 5); A.FX.shake(n ? 0.3 : 0.15); A.FX.burst(ex, ey, 12, { color: ['#c0cbdc', '#8b9bb4', '#63c74d'], smin: 40, smax: 160, life: 0.5, z: 2, vz: 90, g: 400, size: 2 }); }
    if (A.Sound.swat) A.Sound.swat();
  }

  // ---------- Piñata-Keule und Sparschwein ----------
  // Gegner besiegt: Konfetti und Bonbons (world.js hebt sie auf und heilt)
  function onKill(e) {
    const w = W(), h = w && w.hero; if (!h || !has(h, 'pinata')) return;
    const n = e.boss ? 12 : e.elite ? 8 : 3;
    for (let i = 0; i < n; i++) api.drop({ kind: 'candy', col: CANDY[Math.floor(Math.random() * CANDY.length)] }, e.x, e.y, 60 + Math.random() * 110);
    confetti(e.x, e.y - 12, e.boss ? 60 : e.elite ? 36 : 18);
    if (A.Sound.pop) A.Sound.pop();
  }
  // Münze aufgehoben (vom Helden oder von Kisti): eine Münze mehr im Sparschwein
  function onCoin(h, val) {
    if (!has(h, 'sparschwein')) return;
    const r = A.Game.run, p = r.piggy || (r.piggy = { n: 0, gold: 0 });
    if (p.n >= PIG_MAX) return;
    p.n++; p.gold += Math.max(1, Math.round((val || 1) * 0.5)); h.pigT = W().t;
  }
  // Der Held wurde getroffen: Bienen werden sauer, ein harter Treffer lässt das Sparschwein platzen
  function onHurt(h, from, dmg) {
    const w = W(); if (!w) return;
    if (has(h, 'bienen') && from && from.side === 'enemy') {
      if (!(h.beeMad > w.t)) { api.float(h.x, h.y - 60, L('Die Bienen sind sauer!', 'The bees are angry!'), '#fee761', 13); if (A.Sound.buzz) A.Sound.buzz(); }
      h.beeMad = w.t + 5;
    }
    const p = A.Game.run && A.Game.run.piggy;
    if (has(h, 'sparschwein') && p && p.n >= 5 && dmg >= h.maxHp * 0.06) burstPig(h, p, w);
  }
  function burstPig(h, p, w) {
    const k = Math.min(16, 6 + Math.floor(p.n / 3)), dmg = pow(h) * (0.25 + p.n * 0.02), a0 = Math.random() * TAU;
    const src = { x: h.x, y: h.y, r: 6, side: 'hero', tal: {}, crit: h.crit };
    for (let i = 0; i < k; i++) { const a = a0 + i / k * TAU; api.shoot(src, h.x + Math.cos(a) * 100, h.y + Math.sin(a) * 100, dmg, { kind: 'phys', coin: true, proc: true, quiet: true, color: '#feae34', speed: 380, life: 0.8, r: 5 }); }
    const c = Math.min(8, p.n), val = Math.max(1, Math.ceil(p.gold / c));
    for (let i = 0; i < c; i++) api.drop({ kind: 'gold', val }, h.x, h.y - 20, 80 + Math.random() * 120);
    api.float(h.x, h.y - 64, L('Sparschwein platzt!', 'Piggy bank bursts!'), '#feae34', 16);
    if (A.FX) { A.FX.shake(0.25); A.FX.burst(h.x, h.y - 46, 16, { color: ['#f6757a', '#ffffff', '#feae34', '#fee761'], smin: 50, smax: 180, life: 0.5, z: 30, vz: 120, g: 420, size: 2 }); }
    if (A.Sound.glass) A.Sound.glass(true);
    p.n = 0; p.gold = 0;
  }

  // ---------- Jedes Bild ----------
  function onRoomStart(h) { h.gnomeT = 1.5; h.hornT = 2; h.cloudT = 0.6; h.bubT = 1; h.peelT = 0.6; }
  function tick(dt) {
    const w = W(); if (!w || !w.hero) return; const h = w.hero, inFight = fight(w);
    bees(w, h, dt, inFight);
    peels(w, h, dt, inFight);
    gnomes(w, h, dt, inFight);
    bubbles(w, h, dt, inFight);
    kisti(w, h);
    cloud(w, h, dt, inFight);
    horn(w, h, dt, inFight);
    if (!w.wild || !w.wild.length) return;
    for (const o of w.wild) {
      if (o.kind === 'peel') { if (w.t > o.until) o.done = true; else slip(o, w); }
      else if (o.kind === 'swat') { if (!o.hit) { o.x = h.x; o.y = h.y; if (w.t >= o.at) swat(o, w); } if (w.t > o.until) o.done = true; }
    }
    w.wild = w.wild.filter(o => !o.done);
  }
  // Helfer mit eigenem Verhalten (world.js allyStep); true: in diesem Bild schon versorgt
  function step(a, dt) {
    if (a.leg === 'zwerg') return gnomeStep(a);
    if (a.leg === 'kisti') return kistiStep(a, dt);
    return false;
  }

  // ---------- Zeichnen im Retro-Look (dr.b = Bild, dr.g = Leuchten) ----------
  // Ausgerutscht: der Gegner überschlägt sich, liegt auf dem Rücken und dreht sich beim Aufstehen zurück
  function drawSlip(dr, m, spr, x, y, flip, sx, sy, alpha) {
    const w = W(), b = dr.b, k = w.t - m.slip0, left = m.slipUntil - w.t;
    let rot = Math.PI, hop = 0;
    if (k < 0.3) { const q = k / 0.3; rot = q * Math.PI; hop = Math.sin(q * Math.PI) * 8; }
    else if (left < 0.2) { const q = 1 - left / 0.2; rot = Math.PI + q * Math.PI; hop = Math.sin(q * Math.PI) * 4; }
    const img = m.flash > 0 ? A.Art.white(spr, flip) : flip ? A.Art.flipped(spr) : spr.img, wd = Math.round(spr.w * sx), ht = Math.round(spr.h * sy);
    b.save(); b.globalAlpha = alpha; b.translate(Math.round(x), Math.round(y - ht / 2 - hop)); b.rotate(flip ? -rot : rot);
    b.drawImage(img, -Math.round(wd / 2), -Math.round(ht / 2), wd, ht); b.restore();
  }
  // Kisti hüpft und klappt beim Beissen und Fressen den Deckel auf; Zwerge wachsen aus dem Boden
  function drawAlly(dr, a, cx, cy) {
    if (a.leg !== 'kisti' && a.leg !== 'zwerg') return false;
    const t = dr.t, flip = a.fx < 0, x = a.x / PX - cx, y = a.y / PX - cy + 7;
    const up = a.spawn > 0 ? clamp(1 - a.spawn / 0.35, 0, 1) : 1;
    if (a.leg === 'zwerg') {
      const spr = A.Art.sprite('gnome', a.swing > 0 ? 1 : 0);
      dr.shadow(x, y, 4); dr.blit(spr, x, y, flip, { sy: Math.max(0.1, up), alpha: up });
      return true;
    }
    const spr = A.Art.sprite('kisti', a.swing > 0 || a.chew > 0 ? 1 : 0), hop = a.moving ? Math.abs(Math.sin(t * 10 + a.x * 0.01)) * 3 : 0;
    const ox = a.swing > 0 ? a.fx * Math.sin((1 - a.swing / 0.2) * Math.PI) * 3 : 0;
    dr.shadow(x, y, 6);
    dr.outlineGlow(spr, x + ox, y - hop, flip, '#feae34');
    dr.blit(spr, x + ox, y - hop, flip, { alpha: up });
    return true;
  }
  function drawGround(dr, w, cx, cy) {
    if (w.cloud) dr.shadow(w.cloud.x / PX - cx, w.cloud.y / PX - cy + 7, 7);
    const ls = w.wild; if (!ls || !ls.length) return;
    const b = dr.b, t = dr.t, spr = A.Art.sprite('banana');
    for (const o of ls) {
      if (o.kind !== 'peel' || o.done) continue;
      if (o.until - w.t < 1.5 && Math.floor(t * 12) % 2) continue;   // blinkt, bevor sie verschwindet
      const x = o.x / PX - cx, y = o.y / PX - cy + 7, fall = (1 - clamp((w.t - o.t0) / 0.25, 0, 1)) * 8;
      b.drawImage(o.flip ? A.Art.flipped(spr) : spr.img, Math.round(x - spr.w / 2), Math.round(y - spr.h - fall));
    }
  }
  const circ = (c, x, y, r, fill) => { c.beginPath(); c.arc(Math.round(x), Math.round(y), Math.max(1, r), 0, TAU); if (fill) c.fill(); else c.stroke(); };
  function drawTop(dr, w, cx, cy) {
    const b = dr.b, g = dr.g, t = dr.t, h = w.hero;
    for (const o of w.wild || []) {
      if (o.done) continue;
      if (o.kind === 'bubble') {
        let x, y, R;
        if (o.m) {
          const m = o.m, spr = A.Art.monSprite(m.mid, 0), sc = m.boss || m.giant ? 2 : 1;
          R = Math.max(spr.w, spr.h) * sc / 2 + 3; x = m.x / PX - cx; y = m.y / PX - cy + (m.giant ? 12 : m.elite ? 8 : 7) - (m.lift || 0) / PX - spr.h * sc / 2;
        } else { R = 6; x = o.x / PX - cx; y = (o.y - o.z) / PX - cy + Math.sin(t * 3 + o.ph) * 1.5; }
        const wob = Math.sin(t * 5 + o.ph) * 0.6;
        b.globalAlpha = 0.16; b.fillStyle = '#9be8ff'; circ(b, x, y, R + wob, true);
        b.globalAlpha = 0.75; b.strokeStyle = '#c0f8ff'; b.lineWidth = 1; circ(b, x, y, R + wob);
        b.globalAlpha = 0.6; b.strokeStyle = '#f6757a'; b.beginPath(); b.arc(Math.round(x), Math.round(y), Math.max(1, R - 1 + wob), 0.2 + t, 1.1 + t); b.stroke();
        b.globalAlpha = 1; b.fillStyle = '#ffffff'; b.fillRect(Math.round(x - R * 0.45), Math.round(y - R * 0.55), 2, 1); b.fillRect(Math.round(x - R * 0.55), Math.round(y - R * 0.4), 1, 1);
        g.globalAlpha = 0.35; g.strokeStyle = '#9be8ff'; circ(g, x, y, R + 1); g.globalAlpha = 1;
      } else if (o.kind === 'swat') {
        const spr = A.Art.sprite('swatter'), S = 3, k = o.hit ? 1 : clamp((w.t - o.t0) / 0.1, 0, 1), fade = clamp((o.until - w.t) / 0.2, 0, 1);
        b.save(); b.globalAlpha = fade; b.translate(Math.round(o.x / PX - cx), Math.round(o.y / PX - cy - 4)); b.rotate(o.ang + Math.PI / 2);
        b.drawImage(spr.img, -Math.round(spr.w * S / 2), -Math.round(spr.h * S * (0.35 + 0.65 * k)), spr.w * S, Math.round(spr.h * S * (0.35 + 0.65 * k)));
        b.restore();
      }
    }
    // Gewitterwolke an der Leine (die Leine leuchtet beim Blitz)
    const c = w.cloud;
    if (c && h) {
      const x = c.x / PX - cx, y = (c.y - CLOUD_Z) / PX - cy, hx = h.x / PX - cx + h.fx * 4, hy = h.y / PX - cy - 4;
      b.strokeStyle = c.flash > 0 ? '#ffffff' : '#8f6a4a'; b.lineWidth = 1;
      b.beginPath(); b.moveTo(Math.round(hx), Math.round(hy)); b.quadraticCurveTo(Math.round((hx + x) / 2), Math.round(Math.max(hy, y) + 4), Math.round(x), Math.round(y + 2)); b.stroke();
      const spr = A.Art.sprite('cloud', Math.floor(t * 2) % 2);
      dr.blit(spr, x, y + 4, false, { white: c.flash > 0 });
      if (c.flash > 0) { g.globalAlpha = 0.8; g.fillStyle = '#fee761'; g.fillRect(Math.round(x - 6), Math.round(y - 1), 12, 3); g.globalAlpha = 1; }
    }
    // Bienen: gelb-schwarz, flatternde Flügel, sauer mit rotem Stachel
    if (w.bees && w.bees.length) {
      const mad = h && h.beeMad > w.t;
      for (const bee of w.bees) {
        const x = Math.round(bee.x / PX - cx), y = Math.round((bee.y - bee.z) / PX - cy);
        b.fillStyle = '#181425'; b.fillRect(x - 2, y - 1, 5, 3);
        b.fillStyle = '#fee761'; b.fillRect(x - 1, y, 3, 1); b.fillStyle = '#181425'; b.fillRect(x, y, 1, 1);
        if (mad) { b.fillStyle = '#e43b44'; b.fillRect(bee.fx > 0 ? x - 3 : x + 3, y, 1, 1); }
        if (Math.floor(t * 30 + bee.ph * 3) % 2) { g.globalAlpha = 0.8; g.fillStyle = '#ffffff'; g.fillRect(x - 1, y - 2, 1, 1); g.fillRect(x + 1, y - 2, 1, 1); g.globalAlpha = 1; }
      }
    }
    if (!h || !h.alive) return;
    // Sparschwein über dem Kopf: wird mit jeder Münze grösser
    if (has(h, 'sparschwein')) {
      const p = (A.Game.run && A.Game.run.piggy) || { n: 0 }, spr = A.Art.sprite('piggy'), s = 1 + p.n / PIG_MAX * 0.35;
      const bounce = h.pigT != null && w.t - h.pigT < 0.25 ? Math.sin((w.t - h.pigT) / 0.25 * Math.PI) * 3 : 0;
      const x = h.x / PX - cx, y = h.y / PX - cy + 7 - 24 * (h.legBig ? 1.3 : 1) - bounce;
      dr.blit(spr, x, y, h.fx < 0, { sx: s, sy: s });
      if (p.n >= 5 && Math.floor(t * 4 + h.x * 0.01) % 3 === 0) { g.fillStyle = '#fee761'; g.fillRect(Math.round(x + 2), Math.round(y - spr.h * s - 1), 1, 1); }
    }
    // Tröte: kurz nach dem Tröten am Mund
    if (w.toot != null && w.t - w.toot < 0.5) {
      const spr = A.Art.sprite('i_troete'), x = h.x / PX - cx + h.fx * 8, y = h.y / PX - cy - 6;
      dr.blit(spr, x, y, h.fx < 0, { sx: 0.75, sy: 0.75 });
    }
  }
  function lights(w, Lt) {
    const c = w.cloud;
    if (c) Lt(c.x, c.y - CLOUD_Z, c.flash > 0 ? 60 : 24, c.flash > 0 ? '#fee761' : '#7fd8ff', c.flash > 0 ? 0.8 : 0.25);
    for (const o of w.wild || []) if (o.kind === 'bubble' && !o.done) Lt(o.x, o.y - (o.m ? 30 : o.z), o.m ? 30 : 14, '#9be8ff', 0.3);
  }

  return { bind, has, tick, step, onAttack, onKill, onHurt, onCoin, onRoomStart, drawSlip, drawAlly, drawGround, drawTop, lights };
})();
