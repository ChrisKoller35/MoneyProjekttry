// Der Abstieg – Ausrüstung für eigene Builds: Elemente auf Items (2, 4 und 6 Teile schalten Boni frei) und besondere Kräfte.
// Die Zahlen stehen in data.js (A.ELEMENTS, A.POWERS). game.js fragt summary/mods ab, world.js ruft die Haken (pre, onHit, onKill …).
'use strict';
window.A = window.A || {};

A.Gear = (function () {
  const L = (de, en) => (A.LANG === 'de' ? de : en);
  const TAU = Math.PI * 2;
  let api = null;   // Werkzeuge aus world.js: hit, heal, addEffect, float, fx, shoot, mkAlly, statOf
  const W = () => api && api.W;
  function bind(a) { api = a; }

  // ---------- Was trägt der Held? ----------
  function worn(r) { return r && r.gear ? A.SLOTS.map(s => r.gear[s]).filter(Boolean) : []; }
  function counts(r) { const c = {}; for (const it of worn(r)) if (it.el) c[it.el] = (c[it.el] || 0) + 1; return c; }
  function tierOf(n) { return n >= 6 ? 3 : n >= 4 ? 2 : n >= 2 ? 1 : 0; }
  // Stufen je Element und die Kräfte. Gleiche Kräfte stapeln: das beste Stück zählt ganz, jedes weitere halb
  // (bei «low», kleiner ist besser: jedes weitere Stück nimmt ein Viertel weg); cap/minv in data.js setzen Grenzen. pwN: auf wie vielen Stücken
  function summary(r) {
    const count = counts(r), tier = {}, pw = {}, pwN = {}, vals = {};
    for (const el in count) tier[el] = tierOf(count[el]);
    for (const it of worn(r)) { if (it.power && A.POWERS[it.power.id]) (vals[it.power.id] = vals[it.power.id] || []).push(it.power.v); }
    for (const id in vals) {
      const P = A.POWERS[id], v = vals[id].slice().sort((a, b) => P.low ? a - b : b - a), n = v.length;
      pwN[id] = n;
      if (n === 1) pw[id] = v[0];
      else if (P.low) pw[id] = Math.max(P.minv || 2, Math.round(v[0] * Math.pow(0.75, n - 1)));
      else pw[id] = Math.min(P.cap || 1e9, v[0] + v.slice(1).reduce((s, x) => s + Math.round(x / 2), 0));
    }
    return { count, tier, pw, pwN };
  }
  // Werte für das Heldenblatt (game.js derived)
  function mods(r) {
    const s = summary(r), t = s.tier, m = {};
    if (t.schatten >= 1) { m.crit = 8; m.dodge = 5; }
    if (t.stein >= 1) { m.hpPct = 15; m.def = 3; }
    if (t.blitz >= 1) m.spd = 2;
    if (s.pw.goldmagnet) m.goldPct = s.pw.goldmagnet;
    if (s.pw.glueckspilz) m.dropPct = s.pw.glueckspilz;
    return m;
  }
  function cdMul(r) { return tierOf(counts(r || A.Game.run).blitz || 0) >= 3 ? 0.75 : 1; }
  function powerText(p) { const P = A.POWERS[p.id]; return P ? A.t(P.text).replace('{v}', p.v) : ''; }

  // ---------- Im Kampf ----------
  const T = (h, el) => (h && h.gear && h.gear.tier[el]) || 0;
  const P = (h, id) => (h && h.gear && h.gear.pw[id]) || 0;
  const power = (h) => Math.max(api.statOf(h, 'atk'), api.statOf(h, 'mag'));
  const live = (m) => m.alive && !(m.spawn > 0);
  const real = (o) => !o.proc && (o.kind === 'phys' || o.kind === 'magic');   // echte Treffer (keine Zusatz-Treffer, kein Gift-/Brand-Ticken)

  // vor der Schadensrechnung: Faktor, erzwungener Volltreffer, mehr Volltreffer-Schaden
  function pre(from, to, opts) {
    const w = W(); if (!w) return null; const h = w.hero;
    if (to.side === 'hero') return T(to, 'stein') >= 3 ? { mul: 0.8 } : null;
    let mul = 1, force = false, critAdd = 0;
    if (opts.kind === 'poison' && T(h, 'gift') >= 3) mul *= 2;
    if (from === h && real(opts)) {
      if (opts.basic && h.sbUntil > w.t) { mul *= 1 + P(h, 'zauberklinge') / 100; h.sbUntil = 0; api.float(to.x, to.y - to.r - 30, L('Zauberklinge!', 'Spellblade!'), '#feae34', 12); }
      if ((to.elite || to.boss) && P(h, 'riesentoeter')) mul *= 1 + P(h, 'riesentoeter') / 100;
      if (w.souls) mul *= 1 + w.souls / 100;
      if (T(h, 'eis') >= 3 && (to.slowUntil > w.t || to.stun > 0)) mul *= 1.4;
      if (h.nextCrit) { force = true; h.nextCrit = false; }
      if (T(h, 'schatten') >= 3) critAdd = 0.6;
    }
    return mul === 1 && !force && !critAdd ? null : { mul, force, critAdd };
  }
  // nach einem echten Treffer des Helden
  function onHit(h, to, dmg, crit, opts) {
    const w = W(); if (!real(opts) || to.side !== 'enemy') return;
    const pw = power(h);
    if (T(h, 'feuer') >= 1) api.addEffect(to, 'burn', Math.max(1, Math.round(pw * 0.15)), 2);
    if (T(h, 'gift') >= 1) api.addEffect(to, 'poison', Math.max(1, Math.round(pw * 0.2)), 3);
    if (T(h, 'eis') >= 1) { to.slowUntil = Math.max(to.slowUntil || 0, w.t + 1.5); to.slowPow = Math.min(to.slowPow || 1, 0.6); }
    if (T(h, 'eis') >= 2 && (h.iceN = (h.iceN || 0) + 1) >= 4 && to.alive && to.hp > 0) {
      h.iceN = 0; const d = to.boss ? 0.3 : 1; to.stun = Math.max(to.stun, d); to.frozenUntil = w.t + d;
      api.float(to.x, to.y - to.r - 24, L('Eingefroren!', 'Frozen!'), '#9be8ff', 12);
      if (A.FX) A.FX.burst(to.x, to.y - 8, 12, { color: ['#9be8ff', '#ffffff', '#2ce8f5'], smin: 30, smax: 110, life: 0.5, add: true, kind: 'spark', drag: 4 });
    }
    if (crit && T(h, 'schatten') >= 3) for (const k in h.cds) h.cds[k] -= 0.4;
    if (crit && P(h, 'vampirkuss')) api.heal(h, Math.max(1, Math.round(h.maxHp * P(h, 'vampirkuss') / 100)));
    if (P(h, 'raserei')) { h.rageN = Math.min(5, (h.rageUntil > w.t ? h.rageN || 0 : 0) + 1); h.rageUntil = w.t + 2; }
    if (P(h, 'panzerbrecher')) to.shred = Math.min(P(h, 'panzerbrecher') * 5, (to.shred || 0) + P(h, 'panzerbrecher'));
    if (P(h, 'nachbeben') && (h.quakeN = (h.quakeN || 0) + 1) >= P(h, 'nachbeben')) { h.quakeN = 0; quake(h, to.x, to.y, 72, pw * 0.8); }
  }
  // Erdstoss um einen Punkt (Nachbeben, Stein 6)
  function quake(h, x, y, r, dmg) {
    const w = W();
    for (const m of w.mons) if (live(m) && Math.hypot(m.x - x, m.y - y) < r + m.r) api.hit(h, m, dmg, { kind: 'phys', proc: true, color: '#c0cbdc' });
    if (A.FX) { A.FX.ev('boom', { x, y, r, color: '#c0cbdc' }); A.FX.rocks(x, y, 5, r * 0.6); }
  }
  function boomAt(h, x, y, r, dmg, col) {
    const w = W();
    for (const m of w.mons) if (live(m) && Math.hypot(m.x - x, m.y - y) < r + m.r) api.hit(h, m, dmg, { kind: 'magic', proc: true, color: col });
    api.fx('boom', { x, y, r, color: col });
    A.Combos.onBoom(x, y, r, dmg, { proc: true });   // Domino (combos.js)
  }
  // Blitz springt von Gegner zu Gegner
  function zap(h, dmg, n, col) {
    const w = W(); let from = h; const done = new Set();
    for (let i = 0; i < n; i++) {
      let best = null, bd = i ? 190 : 400;
      for (const m of w.mons) { if (!live(m) || done.has(m)) continue; const d = Math.hypot(m.x - from.x, m.y - from.y); if (d < bd) { bd = d; best = m; } }
      if (!best) break; done.add(best);
      w.bolts.push({ x0: from.x, y0: from.y - 12, x1: best.x, y1: best.y - 10, life: 0.28, max: 0.28, col, seed: Math.random() * 99 });
      api.hit(h, best, dmg, { kind: 'magic', proc: true, color: col }); from = best;
    }
    if (done.size) api.fx('zap', { x: h.x, y: h.y, color: col });
  }
  function nearest(h, maxD) { let best = null, bd = maxD; for (const m of W().mons) { if (!live(m)) continue; const d = Math.hypot(m.x - h.x, m.y - h.y); if (d < bd) { bd = d; best = m; } } return best; }

  function onKill(e) {
    const w = W(), h = w && w.hero; if (!h || !h.alive || !h.gear) return;
    const pw = power(h), now = w.t;
    const burning = e.effects.some(f => f.kind === 'burn' && f.until > now), poisoned = e.effects.some(f => f.kind === 'poison' && f.until > now);
    if (burning && T(h, 'feuer') >= 2) boomAt(h, e.x, e.y, 76, pw * 0.6, '#f77622');
    if (poisoned && T(h, 'gift') >= 2) w.zones.push({ kind: 'poison', x: e.x, y: e.y + 6, r: 62, t0: now, until: now + 3, tick: now + 0.3, dmg: pw * 0.3, col: '#63c74d' });
    if (poisoned && T(h, 'gift') >= 3) {
      const near = w.mons.filter(m => live(m) && m !== e && Math.hypot(m.x - e.x, m.y - e.y) < 170).sort((a, b) => Math.hypot(a.x - e.x, a.y - e.y) - Math.hypot(b.x - e.x, b.y - e.y)).slice(0, 2);
      for (const m of near) { api.addEffect(m, 'poison', Math.max(1, Math.round(pw * 0.2)), 3); w.bolts.push({ x0: e.x, y0: e.y - 10, x1: m.x, y1: m.y - 10, life: 0.3, max: 0.3, col: '#63c74d', seed: Math.random() * 99 }); }
    }
    if (P(h, 'seelensammler')) w.souls = Math.min(P(h, 'seelensammler'), (w.souls || 0) + 1);
    if (P(h, 'sturmlauf')) h.runUntil = now + 3;
  }
  function onDodge(h) { if (T(h, 'schatten') >= 2 && !h.nextCrit) { h.nextCrit = true; api.float(h.x, h.y - 52, L('Konter bereit!', 'Counter ready!'), '#e0a4ff', 12); } }
  function onHurt(h, from) {
    const w = W(); if (!h.alive || h.hp <= 0) return;
    if (T(h, 'eis') >= 3 && from && from.side === 'enemy' && !(h.novaT > w.t)) {
      h.novaT = w.t + 4; const pw = power(h);
      for (const m of w.mons) if (live(m) && Math.hypot(m.x - h.x, m.y - h.y) < 140 + m.r) api.hit(h, m, pw * 0.6, { kind: 'magic', proc: true, slow: true, slowDur: 2, color: '#9be8ff' });
      api.fx('nova', { e: h, r: 140, color: '#9be8ff', magic: true });
    }
    if (P(h, 'zweiterwind') && h.hp < h.maxHp * 0.3) {
      const key = w.active || w.room; if (h.windRoom !== key) { h.windRoom = key; api.heal(h, Math.round(h.maxHp * P(h, 'zweiterwind') / 100), true); api.float(h.x, h.y - 52, L('Zweiter Wind!', 'Second wind!'), '#63c74d', 14); }
    }
  }
  function onShieldBreak(h) { if (T(h, 'stein') >= 3) { quake(h, h.x, h.y, 120, power(h) * 1.5); api.float(h.x, h.y - 52, L('Erdbeben!', 'Earthquake!'), '#c0cbdc', 14); } }
  function onRoomStart(h) { if (T(h, 'stein') >= 2) { h.shield = Math.max(h.shield, Math.round(h.maxHp * 0.3)); api.fx('shield', { e: h }); } }
  function onSkill(h) {
    const w = W(), pw = power(h);
    if (P(h, 'zauberklinge')) h.sbUntil = w.t + 5;
    const n = P(h, 'funkenflug');
    if (n) {
      const tg = w.mons.filter(m => live(m) && Math.hypot(m.x - h.x, m.y - h.y) < 400);
      for (let i = 0; i < n; i++) {
        const m = tg.length ? tg[i % tg.length] : null, a = m ? Math.atan2(m.y - h.y, m.x - h.x) + (Math.random() - 0.5) * 0.5 : Math.random() * TAU;
        api.shoot(h, h.x + Math.cos(a) * 100, h.y + Math.sin(a) * 100, pw * 0.4, { kind: 'magic', proc: true, color: '#feae34', speed: 420, life: 0.9, r: 4 });
      }
    }
    if (T(h, 'blitz') >= 3) zap(h, pw * 0.8, 4, '#fee761');
  }
  // Angriffs- und Lauftempo
  function atkMul(h) { const w = W(); let k = T(h, 'blitz') >= 1 ? 0.9 : 1; if (P(h, 'raserei') && h.rageUntil > w.t) k /= 1 + (h.rageN || 0) * P(h, 'raserei') / 100; return k; }
  function moveMul(h) { return h.runUntil > W().t ? 1 + P(h, 'sturmlauf') / 100 : 1; }
  // Phönix: einmal pro Ebene wieder aufstehen
  function phoenix(h) {
    const r = A.Game.run; if (!P(h, 'phoenix') || r.phoenixFloor === r.floor) return false;
    r.phoenixFloor = r.floor; h.hp = Math.round(h.maxHp * P(h, 'phoenix') / 100); h.inv = 2;
    api.float(h.x, h.y - 50, L('Phönix!', 'Phoenix!'), '#feae34', 20);
    api.fx('nova', { e: h, r: 160, color: '#f77622', magic: true });
    return true;
  }
  // regelmässige Dinge im Kampf: Meteor (Feuer 6), Blitz (Blitz 4), Schattenwolf, Wirbelklingen
  function tick(dt) {
    const w = W(); if (!w) return; const h = w.hero; if (!h || !h.alive || !h.gear) return;
    if (!w.active || !w.mons.some(live)) return;
    if (T(h, 'feuer') >= 3 && (h.metT = (h.metT == null ? 2 : h.metT) - dt) <= 0) {
      h.metT = 5; const m = nearest(h, 480);
      if (m) w.marks.push({ kind: 'meteor', x: m.x, y: m.y, r: 80, t0: w.t, at: w.t + 0.85, dmg: power(h) * 1.5, burn: 0.5, col: '#f77622', opts: { proc: true } });
    }
    if (T(h, 'blitz') >= 2 && (h.zapT = (h.zapT == null ? 1 : h.zapT) - dt) <= 0) { h.zapT = 3; zap(h, power(h) * 0.6, 3, '#fee761'); }
    if (P(h, 'schattenwolf') && (h.wolfT = (h.wolfT == null ? 1.5 : h.wolfT) - dt) <= 0) {
      h.wolfT = P(h, 'schattenwolf'); const a = api.mkAlly(h, 0.6, w.t + 6, false); a.shadow = true; w.allies.push(a);
      api.float(h.x, h.y - 50, L('Schattenwolf!', 'Shadow wolf!'), '#e0a4ff', 13);
    }
    if (P(h, 'wirbelklingen') && (h.bladeT = (h.bladeT == null ? 1 : h.bladeT) - dt) <= 0) {
      h.bladeT = P(h, 'wirbelklingen');
      for (let i = 0; i < 3; i++) w.orbs.push({ kind: 'blade', a: i / 3 * TAU, R: 52, spin: 5, dmg: power(h) * 0.45, until: w.t + 4, col: '#c0cbdc', hits: new Map() });
    }
  }

  return { bind, worn, counts, tierOf, summary, mods, cdMul, powerText, pre, onHit, onKill, onDodge, onHurt, onShieldBreak, onRoomStart, onSkill, atkMul, moveMul, phoenix, tick };
})();
