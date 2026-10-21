// Der Abstieg – Eigene Spielweise zweier Klassen: Rufer (Diener: Skelette und Geister) und Braumeister (Flaschen im Bogen, Sprengfass, Tränke).
// Die Zahlen stehen in data.js (A.SKILLS, A.CLASSES). world.js ruft die Haken: attack, skill, lobStep, mark, pre, onKill, onPotion, atkMul, moveMul.
'use strict';
window.A = window.A || {};

A.Classes = (function () {
  const L = (de, en) => (A.LANG === 'de' ? de : en);
  let api = null;   // Werkzeuge aus world.js: hit, heal, boom, shoot, float, fx, nearestMon, frontPoint, freeSpot, tile, heroPower
  const W = () => api && api.W;
  function bind(a) { api = a; }
  const live = (m) => m.alive && !(m.spawn > 0);
  const real = (o) => !o.proc && (o.kind === 'phys' || o.kind === 'magic');   // echte Treffer (kein Gift-/Brand-Ticken)

  // ---------- Rufer: Diener ----------
  // Diener sind Begleiter in W.allies mit minion: true; world.js lässt sie laufen und zuschlagen (allyStep).
  // Höchstens 7 gleichzeitig; ein neuer verdrängt den, der am wenigsten Zeit übrig hat.
  const MAX_MINIONS = 7;
  const LOOK = { skel: { spd: 0.85, rate: 0.75 }, geist: { spd: 1.2, rate: 0.6 }, ratte: { spd: 1.35, rate: 0.5 } };   // Ratten: Flöte des Rattenfängers (legends.js)
  function minions() { const w = W(); return w ? w.allies.filter(a => a.minion && !a.gone) : []; }
  function summon(h, look, pow, dur, x, y) {
    const w = W(), lk = LOOK[look] || LOOK.skel;
    [x, y] = api.freeSpot(x, y, 11);
    const rat = look === 'ratte', list = minions().filter(m => (m.look === 'ratte') === rat);   // Ratten haben ihre eigene Obergrenze
    if (list.length >= (rat ? 6 : MAX_MINIONS)) { const old = list.sort((p, q) => p.until - q.until)[0]; old.gone = true; api.fx('appear', { m: old }); }
    const a = { side: 'hero', ally: true, minion: true, look, hp: 1e9, maxHp: 1e9, x, y, r: 11, fx: h.fx < 0 ? -1 : 1, fy: 0, pow, until: w.t + dur, perm: false,
      cd: 0.3 + Math.random() * 0.3, swing: 0, alive: true, crit: 0, spawn: 0.4, spd: lk.spd, rate: lk.rate, col: '#e0a4ff' };
    w.allies.push(a);
    api.fx('raise', { m: a, color: look === 'geist' ? '#e0a4ff' : rat ? '#c28569' : '#b55088' });
    return a;
  }
  // Besiegte Gegner stehen manchmal (20 %) als Geist auf, nach einem Seelenpfeil immer
  function onKill(e) {
    const w = W(), h = w && w.hero; if (!h || !h.alive || h.cls !== 'rufer' || e.boss) return;
    if (!e.raiseMe && Math.random() >= 0.2) return;
    summon(h, 'geist', 0.35, 8, e.x, e.y);
    api.float(e.x, e.y - 44, L('Steht auf!', 'Rises!'), '#e0a4ff', 13);
  }

  // ---------- Braumeister: Flaschen ----------
  // Eine Flasche fliegt im Bogen zum Ziel (folgt ihm ein wenig) und zerplatzt dort: Schaden in der Fläche, je nach Sorte Brand, Gift, Frost oder eine Lache
  function throwFlask(h, tx, ty, tgt, dmg, spec) {
    const w = W(), d = Math.hypot(tx - h.x, ty - h.y) || 1, life = Math.max(0.25, d / 360);
    w.shots.push({ x: h.x + h.fx * 6, y: h.y - 2, vx: (tx - h.x) / life, vy: (ty - h.y) / life, r: 5, side: 'hero', from: h, dmg,
      opts: Object.assign({ kind: 'magic', lob: true }, spec), life, life0: life, peak: Math.min(64, 26 + d * 0.22),
      spin: (Math.random() < 0.5 ? -1 : 1) * (9 + Math.random() * 5), color: spec.col, tgt: tgt || null });
    h.thrownT = w.t;
  }
  function lobStep(s, dt) {
    if (s.tgt && live(s.tgt) && s.life > 0.08) { const k = Math.min(1, dt * 5); s.vx += ((s.tgt.x - s.x) / s.life - s.vx) * k; s.vy += ((s.tgt.y - s.y) / s.life - s.vy) * k; }
    const nx = s.x + s.vx * dt, ny = s.y + s.vy * dt, v = api.tile(nx, ny);
    if (v === 0 || v === 2) s.life = 0;   // an Wand oder Gitter zerschellt; über Säulen und Gruben fliegt sie hinweg
    else { s.x = nx; s.y = ny; s.life -= dt; }
    if (s.life <= 0 && !s.boomed) { s.boomed = true; land(s); }
  }
  function land(s) {
    const w = W(), h = w.hero, o = s.opts;
    for (const m of w.mons) {
      if (!live(m) || Math.hypot(m.x - s.x, m.y - s.y) > o.r + m.r) continue;
      api.hit(h, m, s.dmg, { kind: 'magic', color: o.col, basic: o.basic, burn: o.burn, poison: o.poison, slow: o.slow || !!o.freeze, slowDur: o.freeze ? 2.5 : 1.6, noKb: !o.basic });
      if (o.freeze && m.alive && m.hp > 0) { const d = m.boss ? 0.3 : o.freeze; m.stun = Math.max(m.stun, d); m.frozenUntil = w.t + d; }
    }
    if (o.zone) w.zones.push({ kind: o.zone, x: s.x, y: s.y + 4, r: o.r, t0: w.t, until: w.t + o.zdur, tick: w.t + 0.25, dmg: o.zdmg, col: o.col });
    api.fx('flask', { x: s.x, y: s.y, r: o.r, color: o.col, big: !o.basic });
  }
  // Normaler Angriff des Braumeisters: Flasche werfen; jede 4. ist eine Überraschung (Brand, Gift oder Frost)
  const SURPRISE = [{ col: '#f77622', burn: 0.5 }, { col: '#63c74d', poison: 1.2 }, { col: '#9be8ff', slow: true }];
  function attack(h, mul, big) {
    if (h.cls !== 'brau') return false;
    const m = api.nearestMon(h.x, h.y, 360), tx = m ? m.x : h.x + h.fx * 150, ty = m ? m.y : h.y + h.fy * 150;
    h.flaskN = (h.flaskN || 0) + 1;
    const spec = Object.assign({ basic: true, r: big ? 62 : 46, col: '#feae34' }, h.flaskN % 4 === 0 ? SURPRISE[Math.floor(Math.random() * SURPRISE.length)] : null);
    const dmg = api.heroPower(h) * 0.85 * mul;
    throwFlask(h, tx, ty, m, dmg, spec);
    if (h.tal.spalt) for (const da of [-0.4, 0.4]) {   // Gespaltener Schlag: zwei Extra-Flaschen links und rechts
      const dx = tx - h.x, dy = ty - h.y, c = Math.cos(da), s = Math.sin(da);
      throwFlask(h, h.x + dx * c - dy * s, h.y + dx * s + dy * c, null, dmg * 0.5, Object.assign({}, spec, { r: 40 }));
    }
    api.fx('swing', {});
    return true;
  }
  // Rausch: schneller laufen und angreifen (Heiltrunk, jeder Trank des Braumeisters)
  function rush(h, sec) { const w = W(); h.brewUntil = Math.max(h.brewUntil || 0, w.t + sec); api.float(h.x, h.y - 62, L('Rausch!', 'Rush!'), '#feae34', 14); }
  function onPotion(h) { if (h.cls === 'brau') rush(h, 6); }
  function atkMul(h) { const w = W(); return w && h.brewUntil > w.t ? 0.7 : 1; }
  function moveMul(h) { const w = W(); return w && h.brewUntil > w.t ? 1.25 : 1; }
  // Wundertrank: eins von vier zufälligen Dingen
  const WONDERS = ['riese', 'feuer', 'glueck', 'blasen'];
  function wonder(h, sk, dmg) {
    const w = W(), k = WONDERS[Math.floor(Math.random() * WONDERS.length)];
    api.fx('potion', { e: h });
    if (k === 'riese') { h.giantUntil = w.t + 8; api.float(h.x, h.y - 66, L('Riesenwuchs!', 'Giant growth!'), '#feae34', 16); if (A.FX) A.FX.shake(0.3); }
    else if (k === 'feuer') {
      const a0 = Math.atan2(h.fy, h.fx);
      for (let i = 0; i < 7; i++) { const a = a0 + (i - 3) * 0.16; api.shoot(h, h.x + Math.cos(a) * 100, h.y + Math.sin(a) * 100, dmg, { kind: 'magic', color: '#f77622', burn: 0.4, speed: 470, life: 0.65, r: 6 }); }
      api.float(h.x, h.y - 66, L('Feuerspucke!', 'Fire breath!'), '#f77622', 16);
    }
    else if (k === 'glueck') {
      h.luckyN = 5; api.float(h.x, h.y - 66, L('Glückssträhne!', 'Lucky streak!'), '#63c74d', 16);
      if (A.FX) A.FX.burst(h.x, h.y - 10, 18, { color: ['#63c74d', '#fee761', '#ffffff'], smin: 40, smax: 140, life: 0.6, add: true, kind: 'spark' });
    }
    else {
      for (const m of w.mons) if (live(m) && Math.hypot(m.x - h.x, m.y - h.y) < 140 + m.r) api.hit(h, m, dmg, { kind: 'magic', color: '#9be8ff', slow: true, slowDur: 3 });
      api.fx('nova', { e: h, r: 140, color: '#9be8ff', magic: true });
      if (A.FX) for (let i = 0; i < 16; i++) { const a = Math.random() * Math.PI * 2, rr = 20 + Math.random() * 110; A.FX.part({ kind: 'ring', add: true, x: h.x + Math.cos(a) * rr, y: h.y + Math.sin(a) * rr * 0.6, vz: 30 + Math.random() * 40, life: 0.6 + Math.random() * 0.5, size: 6 + Math.random() * 8, color: '#9be8ff' }); }
      api.float(h.x, h.y - 66, L('Blubberblasen!', 'Bubbles!'), '#9be8ff', 16);
    }
    return true;
  }

  // ---------- Zauber beider Klassen (useSkill in world.js fragt zuerst hier) ----------
  function skill(h, id, sk, P, pw) {
    const w = W(), up = pw / sk.pow;   // Verstärkung am Schrein: +30 % je Stufe
    switch (sk.kind) {
      case 'summon': {
        const n = sk.n || 1, a0 = Math.atan2(h.fy, h.fx), wide = n > 3;
        for (let i = 0; i < n; i++) { const a = a0 + (i - (n - 1) / 2) * (wide ? 0.62 : 0.9), d = wide ? 58 : 44; summon(h, sk.look, pw, sk.dur, h.x + Math.cos(a) * d, h.y + Math.sin(a) * d * 0.8); }
        if (A.FX) { A.FX.part({ kind: 'rune', x: h.x, y: h.y + 10, life: 0.8, size: wide ? 30 : 20, color: sk.col, add: true }); if (wide) A.FX.shake(0.3); }
        return true;
      }
      case 'grab': {
        const m = api.nearestMon(h.x, h.y, 360), p = m ? { x: m.x, y: m.y } : api.frontPoint(h, 90);
        w.zones.push({ kind: 'grab', x: p.x, y: p.y + 6, r: sk.radius, t0: w.t, until: w.t + sk.dur, tick: w.t, col: sk.col });
        for (const o of w.mons) if (live(o) && Math.hypot(o.x - p.x, o.y - p.y) < sk.radius + o.r) api.hit(h, o, P * pw, { kind: 'magic', color: sk.col, noKb: true, stun: o.boss ? 0.5 : sk.hold, slow: true, slowDur: sk.dur });
        api.fx('boom', { x: p.x, y: p.y, r: sk.radius, color: sk.col, soft: true });
        return true;
      }
      case 'rally': {
        api.heal(h, Math.round(h.maxHp * pw), true);
        const list = minions();
        for (const a of list) { a.rallyUntil = w.t + sk.dur; a.until += sk.extend || 0; w.bolts.push({ x0: h.x, y0: h.y - 14, x1: a.x, y1: a.y - 8, life: 0.4, max: 0.4, col: sk.col, seed: Math.random() * 99 }); }
        api.float(h.x, h.y - 62, list.length ? L('Seelenband!', 'Soul bond!') : L('Keine Diener', 'No minions'), sk.col, 13);
        if (A.FX) A.FX.part({ kind: 'ring', x: h.x, y: h.y, life: 0.45, size: 60, color: sk.col, add: true });
        return true;
      }
      case 'sacrifice': {
        const list = minions();
        if (!list.length) { h.cds[id] = w.t + 1; api.float(h.x, h.y - 62, L('Keine Diener!', 'No minions!'), '#c0cbdc', 13); return true; }
        for (const a of list) {
          a.gone = true; api.boom(a.x, a.y, sk.radius, P * pw, {}, sk.col);
          if (A.FX) A.FX.burst(a.x, a.y - 8, 10, { color: ['#d9c8f0', '#c0cbdc', '#ffffff'], smin: 60, smax: 180, life: 0.5, z: 6, vz: 120, g: 420 });
        }
        api.heal(h, Math.round(h.maxHp * 0.05 * list.length), true);
        if (A.FX) A.FX.shake(0.35);
        return true;
      }
      case 'lob': {
        const m = api.nearestMon(h.x, h.y, 380), tx = m ? m.x : h.x + h.fx * 160, ty = m ? m.y : h.y + h.fy * 160;
        throwFlask(h, tx, ty, m, P * pw, { r: sk.radius, col: sk.col, zone: sk.zone, zdmg: P * (sk.zpow || 0) * up, zdur: sk.zdur, freeze: sk.freeze });
        api.fx('swing', {});
        return true;
      }
      case 'brew': api.heal(h, Math.round(h.maxHp * pw), true); rush(h, sk.dur); api.fx('potion', { e: h }); return true;
      case 'barrel': {
        const m = api.nearestMon(h.x, h.y, 320), p = m ? { x: m.x, y: m.y } : api.frontPoint(h, 80), [x, y] = api.freeSpot(p.x, p.y, 10);
        w.marks.push({ kind: 'barrel', x, y, sx: h.x, sy: h.y, r: sk.radius, t0: w.t, at: w.t + 1.25, dmg: P * pw, col: sk.col });
        api.fx('keg', {});
        return true;
      }
      case 'wonder': return wonder(h, sk, P * pw);
    }
    return false;
  }
  // Sprengfass: explodiert, wenn die Lunte abgebrannt ist
  function mark(k) {
    if (k.kind !== 'barrel') return false;
    api.boom(k.x, k.y, k.r, k.dmg, { burn: 0.5 }, '#feae34');
    if (A.FX) {
      A.FX.shake(0.55); A.FX.rocks(k.x, k.y, 8, 70, ['#733e39', '#b86f50', '#feae34']); A.FX.smoke(k.x, k.y, 8, '#3a4466', 7);
      A.FX.burst(k.x, k.y - 6, 18, { color: ['#733e39', '#b86f50', '#3e2731'], smin: 80, smax: 260, life: 0.7, z: 6, vz: 160, g: 420 });
    }
    return true;
  }
  // vor der Schadensrechnung: Riesenwuchs (+50 %) und Glückssträhne (sicherer Volltreffer)
  function pre(from, to, opts) {
    const w = W(); if (!w || from !== w.hero || to.side !== 'enemy' || !real(opts)) return null;
    let mul = 1, force = false;
    if (from.giantUntil > w.t) mul *= 1.5;
    if (from.luckyN > 0) { from.luckyN--; force = true; }
    return mul === 1 && !force ? null : { mul, force };
  }

  return { bind, MAX_MINIONS, minions, summon, skill, attack, lobStep, mark, pre, onKill, onPotion, atkMul, moveMul };
})();
