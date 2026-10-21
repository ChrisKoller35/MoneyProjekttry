// Der Abstieg – Kombos (A.COMBOS in data.js): zwei passende Teile wecken am Schrein eine neue Kraft, die es nur zusammen gibt.
// Teile: passiver Segen, Element (2 Ausrüstungs-Teile), Zauber (das Zauberbuch reicht), Legende, Trophäe oder die eigene Klasse.
// Sind beide Teile da, ist die Kombo bereit und erwacht am nächsten Schrein (game.js takeCombos, ui.js zeigt das goldene Fenster).
// Erwacht wirkt sie, solange beide Teile da sind (fehlt eins, ruht sie). Das Kombo-Buch im Lager zählt jede Kombo (meta.comboFound).
// world.js, classes.js, legends.js und gear.js rufen die Haken (pre, onKill, onHurt, onDodge, onBoom, onMeteor, onChainHit, onShotHit, onCoin,
// onEcho, onAttack, onAllyGone, onGulp, tick ...); draw.js zeichnet, was dabei entsteht (W.cbfx: Raketen, Blutkugeln, Giftpilze; Baby-Schleime, Schattenklone).
'use strict';
window.A = window.A || {};

A.Combos = (function () {
  const TAU = Math.PI * 2, PX = 2, EY = 0.6;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const L = (de, en) => (A.LANG === 'de' ? de : en);
  let api = null;   // Werkzeuge aus world.js: hit, heal, boom, float, fx, heroPower, castSkill, statOf, freeSpot
  const W = () => api && api.W;
  function bind(a) { api = a; }
  const C = (id) => A.COMBOS[id];
  const live = (m) => m.alive && !(m.spawn > 0);
  const on = (h, id) => !!(h && h.combo && h.combo[id]);
  const fight = (w) => !!(w && w.active && w.mons.some(live));
  const pow = (h) => api.heroPower(h);
  function add(o) { const w = W(); (w.cbfx || (w.cbfx = [])).push(o); return o; }
  function later(o) { const w = W(); (w.cbQ || (w.cbQ = [])).push(o); }
  function nearest(x, y, maxD) { let best = null, bd = maxD; for (const m of W().mons) { if (!live(m)) continue; const d = Math.hypot(m.x - x, m.y - y); if (d < bd) { bd = d; best = m; } } return best; }
  let popT = 0;   // Knall der Raketen nicht zu oft hintereinander

  // ---------- Teile ----------
  const EL_MIN = 2;   // so viele Ausrüstungs-Teile eines Elements braucht ein Element-Teil
  const CLS_ICON = { klinge: 'i_schwert', schuetze: 'i_bogen', weber: 'i_stab', rufer: 's_skel', brau: 's_wonder' };
  function hasPart(p, r, d) {
    if (p.tal) return (r.talents || []).includes(p.tal);
    if (p.el) return ((d.gear && d.gear.count[p.el]) || 0) >= EL_MIN;
    if (p.spell) return (r.known || []).includes(p.spell);
    if (p.leg) return !!(d.leg && d.leg[p.leg]);
    if (p.tro) { const T = A.TROPHIES[p.tro]; return !!(T && d.tro && d.tro[T.power]); }
    if (p.cls) return r.cls === p.cls;
    return false;
  }
  function partName(p) {
    if (p.tal) return A.t(A.TALENTS[p.tal].name);
    if (p.el) return L(`${A.t(A.ELEMENTS[p.el].name)} (${EL_MIN} Teile)`, `${A.t(A.ELEMENTS[p.el].name)} (${EL_MIN} pieces)`);
    if (p.spell) return L('Zauber ', 'Spell ') + A.t(A.SKILLS[p.spell].name);
    if (p.leg) return A.t(A.LEGENDS[p.leg].name);
    if (p.tro) return A.t(A.TROPHIES[p.tro].name);
    return A.t(A.CLASSES.find(c => c.id === p.cls).name);
  }
  // Wo gibt es das fehlende Teil?
  function partWhere(p) {
    if (p.tal) return L('Segen am Schrein', 'shrine blessing');
    if (p.spell) return L('am Schrein, das Zauberbuch reicht', 'at the shrine, the spell book is enough');
    if (p.el) return L('Ausrüstung oder Schmiede', 'gear or forge');
    if (p.leg) return A.Legends.hint(p.leg);
    if (p.tro) return L('Trophäe vom ', 'trophy from ') + A.t(A.BOSSES[p.tro].name);
    return L('nur diese Klasse', 'this class only');
  }
  function partIcon(p) {
    if (p.tal) return A.TALENTS[p.tal].icon || 'u_star';
    if (p.el) return A.ELEMENTS[p.el].icon;
    if (p.spell) return A.SKILLS[p.spell].icon || 's_strike';
    if (p.leg) return 'i_' + A.LEGENDS[p.leg].ico;
    if (p.tro) return p.tro === 'schleimkoenig' ? 'crown' : A.Art.itemIcon(A.TROPHIES[p.tro].base);
    return CLS_ICON[p.cls] || 'u_star';
  }
  function recipe(id) { return C(id).need.map(partName).join(' + '); }

  // ---------- Stand (game.js derived, Heldenblatt, Schrein) ----------
  // full: beide Teile da; on: ausserdem schon am Schrein erwacht (run.combos) – nur diese wirken
  function evaluate(r, d) {
    const full = {}, act = {}, woke = r.combos || [];
    for (const id in A.COMBOS) if (C(id).need.every(p => hasPart(p, r, d))) { full[id] = true; if (woke.includes(id)) act[id] = true; }
    return { full, on: act };
  }
  // Für das Heldenblatt: wirkt, bereit (erwacht am nächsten Schrein), ruht (erwacht, aber ein Teil fehlt), fast (ein Teil fehlt noch)
  function list(r, d) {
    const out = [], woke = r.combos || [], ord = { on: 0, ready: 1, rest: 2, near: 3 };
    for (const id in A.COMBOS) {
      const miss = C(id).need.filter(p => !hasPart(p, r, d));
      if (miss.some(p => p.cls)) continue;   // gehört zu einer anderen Klasse
      const st = !miss.length ? (woke.includes(id) ? 'on' : 'ready') : woke.includes(id) ? 'rest' : miss.length === 1 ? 'near' : null;
      if (st) out.push({ id, st, miss });
    }
    return out.sort((a, b) => ord[a.st] - ord[b.st]);
  }
  // Welche Kombos würde ein Segen am Schrein ganz machen?
  function completes(b, r, d) {
    if (!b || (b.type !== 'talent' && b.type !== 'spell')) return [];
    const key = b.type === 'talent' ? 'tal' : 'spell', out = [];
    for (const id in A.COMBOS) {
      const need = C(id).need; if (!need.some(p => p[key] === b.id)) continue;
      if (need.every(p => p[key] === b.id || hasPart(p, r, d))) out.push(id);
    }
    return out;
  }

  // ---------- Treffer ----------
  // vor der Schadensrechnung: Vampirfürst (+6 % je Blutkugel) und Todesmut (unter 35 % Leben ist jeder Treffer ein Volltreffer)
  function pre(from, to, opts) {
    const w = W(); if (!w || from !== w.hero || to.side !== 'enemy' || !from.combo) return null;
    let mul = 1, force = false;
    if (from.bloodUntil > w.t && from.bloodN) mul *= 1 + 0.06 * from.bloodN;
    if (on(from, 'todesmut') && from.hp < from.maxHp * 0.35 && (opts.kind === 'phys' || opts.kind === 'magic')) force = true;
    return mul === 1 && !force ? null : { mul, force };
  }
  // Geschoss ohne Schuss-Ton (es kommen oft viele auf einmal)
  function bolt(h, x, y, a, dmg, o) {
    const sp = o.speed || 420;
    W().shots.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, r: o.r || 4, side: 'hero', from: h, dmg, opts: Object.assign({ kind: 'magic', proc: true }, o), life: o.life || 0.8, color: o.color });
  }
  // eigener Begleiter (Baby-Schleim, Schattenklon): world.js lässt ihn laufen und beissen wie den Geisterwolf, gezeichnet wird er hier
  function ally(h, p, dur, x, y) {
    const w = W(), [ax, ay] = api.freeSpot(x, y, 10);
    const a = { side: 'hero', ally: true, hp: 1e9, maxHp: 1e9, x: ax, y: ay, r: 10, fx: h.fx, fy: 0, pow: p, until: w.t + dur, perm: false, cd: 0.25, swing: 0, alive: true, crit: 0, spawn: 0.25 };
    w.allies.push(a);
    return a;
  }
  // Gegner besiegt: Blutkugel (Vampirfürst), Fadenfunke (Fadensturm)
  function onKill(e) {
    const w = W(), h = w && w.hero; if (!h || !h.alive || !h.combo) return;
    if (on(h, 'vampirfuerst')) { const a = Math.random() * TAU; add({ kind: 'blood', x: e.x, y: e.y - 10, vx: Math.cos(a) * 130, vy: Math.sin(a) * 90 - 40, t0: w.t }); }
    if (on(h, 'fadensturm')) later({ kind: 'thread', at: w.t + 0.12, x: e.x, y: e.y });
  }
  // Held getroffen: Kaktus schiesst Steinstacheln
  function onHurt(h, from) {
    const w = W(); if (!on(h, 'kaktus') || !h.alive || h.hp <= 0 || !from || from.side !== 'enemy' || h.cactT > w.t) return;
    h.cactT = w.t + 1.2;
    const a0 = Math.random() * TAU;
    for (let i = 0; i < 6; i++) { const a = a0 + i / 6 * TAU; bolt(h, h.x + Math.cos(a) * 14, h.y + Math.sin(a) * 10, a, pow(h) * 0.5, { kind: 'phys', color: '#a2e05a', speed: 400, life: 0.6 }); }
    api.float(h.x, h.y - 56, L('Stachelig!', 'Prickly!'), '#a2e05a', 13);
    if (A.FX) A.FX.burst(h.x, h.y - 8, 12, { color: ['#a2e05a', '#8b9bb4', '#c0cbdc'], smin: 60, smax: 170, life: 0.4, z: 6, vz: 90, g: 380 });
  }
  // Held weicht aus: ein Schattenklon springt heraus
  function onDodge(h) {
    const w = W(); if (!on(h, 'schattenklon') || !h.alive || h.cloneT > w.t || !fight(w)) return;
    h.cloneT = w.t + 1.5;
    const c = ally(h, 0.6, 4, h.x - h.fx * 26, h.y + 6);
    c.cb = 'clone'; c.col = '#b55088'; c.rate = 0.5; c.spd = 1.3; c.r = 11;
    api.float(h.x, h.y - 60, L('Schattenklon!', 'Shadow clone!'), '#e0a4ff', 13);
    if (A.FX) A.FX.burst(c.x, c.y - 10, 14, { color: ['#b55088', '#68386c', '#e0a4ff'], smin: 50, smax: 160, life: 0.45, add: true, kind: 'spark', drag: 3 });
  }

  // ---------- Explosionen ----------
  // Nach jeder Explosion (world.js boom, Legenden, Ausrüstung): Raketen der Kettenreaktion, Blitze des Feuerballs, Domino, Knochen
  function onBoom(x, y, r, dmg, opts) {
    const w = W(), h = w && w.hero; if (!h || !h.alive || !h.combo) return;
    if (opts.kette && on(h, 'feuerwerk')) rockets(h, x, y);
    if (opts.fb && on(h, 'plasmaball')) plasma(h, x, y, dmg * 0.5);
    if (on(h, 'domino') && (opts.domino || 0) < 2 && Math.random() < 0.35) {
      const a = Math.random() * TAU, d = 45 + Math.random() * 45;
      w.marks.push({ kind: 'boom', x: x + Math.cos(a) * d, y: y + Math.sin(a) * d * EY, r: Math.max(54, r * 0.85), at: w.t + 0.22, dmg: dmg * 0.7, col: '#feae34', opts: { proc: true, domino: (opts.domino || 0) + 1 } });
    }
    if (opts.bone && A.FX) A.FX.burst(x, y - 8, 16, { color: ['#ead4aa', '#c0cbdc', '#e0a4ff'], smin: 60, smax: 200, life: 0.6, z: 6, vz: 140, g: 420 });
  }
  // Feuerwerk: 4 Raketen fliegen im Bogen zu Gegnern in der Nähe und zerplatzen bunt
  const FW = ['#fee761', '#f77622', '#2ce8f5', '#f6757a', '#63c74d', '#c77dff', '#ffffff'];
  function rockets(h, x, y) {
    const w = W(), tg = w.mons.filter(m => live(m) && Math.hypot(m.x - x, m.y - y) < 300), k0 = Math.floor(Math.random() * 4);
    for (let i = 0; i < 4; i++) {
      const m = tg.length ? tg[(k0 + i) % tg.length] : null, a = Math.random() * TAU, d = 50 + Math.random() * 80;
      add({ kind: 'rocket', x0: x, y0: y, x, y, z: 0, tx: m ? m.x : x + Math.cos(a) * d, ty: m ? m.y : y + Math.sin(a) * d * EY, tgt: m, t0: w.t + i * 0.07, at: w.t + 0.45 + i * 0.07,
        col: FW[Math.floor(Math.random() * FW.length)], arc: 50 + Math.random() * 40, side: (Math.random() < 0.5 ? -1 : 1) * (20 + Math.random() * 30), tr: [] });
    }
    if (A.Sound.ignite) A.Sound.ignite();
  }
  function rocketStep(o, w, h) {
    if (w.t < o.t0) return;
    if (o.tgt && live(o.tgt)) { o.tx = o.tgt.x; o.ty = o.tgt.y; }
    const p = clamp((w.t - o.t0) / (o.at - o.t0), 0, 1), s = Math.sin(Math.PI * p), dx = o.tx - o.x0, dy = o.ty - o.y0, dl = Math.hypot(dx, dy) || 1;
    o.x = o.x0 + dx * p - dy / dl * o.side * s; o.y = o.y0 + dy * p + dx / dl * o.side * s * EY; o.z = o.arc * s;
    o.tr.push([o.x, o.y - o.z]); if (o.tr.length > 10) o.tr.shift();
    if (A.FX && !A.FX.low && Math.random() < 0.5) A.FX.part({ add: true, x: o.x, y: o.y, z: o.z, vx: (Math.random() - 0.5) * 20, vy: 0, vz: -30, life: 0.3, color: Math.random() < 0.5 ? o.col : '#fee761', drag: 2 });
    if (p >= 1) { o.done = true; if (h.alive) pop(h, o.x, o.y, o.col); }
  }
  function pop(h, x, y, col) {
    const w = W(), r = 58, dmg = pow(h) * 0.4;
    for (const m of w.mons) if (live(m) && Math.hypot(m.x - x, m.y - y) < r + m.r) api.hit(h, m, dmg, { kind: 'magic', proc: true, burn: 0.4, color: col });
    api.fx('boom', { x, y, r, color: col, soft: true });
    if (A.FX) {
      const c2 = FW[Math.floor(Math.random() * FW.length)];
      for (let i = 0; i < 24; i++) { const a = i / 24 * TAU, sp = 90 + Math.random() * 100; A.FX.part({ add: true, x, y, z: 26, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp * EY, vz: 40 + Math.random() * 40, g: 160, life: 0.55 + Math.random() * 0.3, color: i % 2 ? col : c2, drag: 2.2, size: Math.random() < 0.3 ? 2 : 1 }); }
      A.FX.flash(x, y - 20, r, col, 0.18);
    }
    const now = performance.now(); if (now - popT > 70) { popT = now; if (A.Sound.glass) A.Sound.glass(false); }
    onBoom(x, y, r, dmg, { proc: true });
  }
  // Plasmaball: aus der Feuerball-Explosion springen Blitze in die 3 nächsten Gegner
  function plasma(h, x, y, dmg) {
    const w = W(), tg = w.mons.filter(m => live(m) && Math.hypot(m.x - x, m.y - y) < 260).sort((a, b) => Math.hypot(a.x - x, a.y - y) - Math.hypot(b.x - x, b.y - y)).slice(0, 3);
    for (const m of tg) {
      w.bolts.push({ x0: x, y0: y - 10, x1: m.x, y1: m.y - 10, life: 0.3, max: 0.3, col: '#c77dff', seed: Math.random() * 99 });
      api.hit(h, m, dmg, { kind: 'magic', proc: true, noKb: true, color: '#c77dff' });
    }
    if (tg.length) api.fx('zap', { x, y, color: '#c77dff' });
  }
  // Kettenblitz trifft: kleine Plasma-Explosion
  function onChainHit(m, dmg) {
    const w = W(), h = w && w.hero; if (!on(h, 'plasmaball')) return;
    api.boom(m.x, m.y, 52, dmg * 0.4, { proc: true }, '#c77dff');
  }
  // Meteor schlägt ein: Meteorschauer bringt 2 kleine Brocken mit (auf Gegner in der Nähe, sonst daneben)
  function onMeteor(k) {
    const w = W(), h = w && w.hero; if (k.mini || !on(h, 'meteorschauer')) return;
    const near = w.mons.filter(m => live(m) && Math.hypot(m.x - k.x, m.y - k.y) < 220).sort(() => Math.random() - 0.5);
    for (let i = 0; i < 2; i++) {
      const m = near[i], a = Math.random() * TAU, d = 60 + Math.random() * 40;
      w.marks.push({ kind: 'meteor', mini: true, x: m ? m.x : k.x + Math.cos(a) * d, y: m ? m.y : k.y + Math.sin(a) * d * EY, r: 54, t0: w.t, at: w.t + 0.35 + i * 0.2, dmg: k.dmg * 0.35, burn: k.burn, col: k.col, opts: { proc: true } });
    }
  }

  // ---------- Geschosse, Münzen, Zauber, Angriffe ----------
  // Pfeilhagel: ein normaler Pfeil teilt sich beim Treffer in 2 weitere (die teilen sich nicht noch einmal)
  function onShotHit(s, m) {
    const w = W(), h = w && w.hero; if (s.from !== h || !s.opts.basic || !on(h, 'pfeilhagel')) return;
    const a0 = Math.atan2(s.vy, s.vx), sp = Math.hypot(s.vx, s.vy) || 420;
    for (const da of [-0.5, 0.5]) { const a = a0 + da; bolt(h, m.x + Math.cos(a) * (m.r + 6), m.y + Math.sin(a) * (m.r + 6), a, s.dmg * 0.5, { kind: s.opts.kind, color: s.color, speed: sp, life: 0.45 }); }
  }
  // Goldregen: jede Münze im Kampf schiesst einen Goldsplitter auf den nächsten Gegner
  function onCoin(h) {
    const w = W(); if (!on(h, 'goldregen') || !fight(w)) return;
    const m = nearest(h.x, h.y, 420); if (!m) return;
    bolt(h, h.x, h.y - 6, Math.atan2(m.y - h.y, m.x - h.x), pow(h) * 0.4, { kind: 'magic', color: '#feae34', speed: 560, life: 0.9 });
    if (A.FX) A.FX.burst(h.x, h.y - 18, 4, { color: ['#fee761', '#feae34', '#ffffff'], smin: 30, smax: 90, life: 0.3, add: true, kind: 'spark', drag: 4 });
  }
  // Zauberecho: mit Echokaskade öfter, und das Echo wirkt den Zauber gleich noch einmal (nicht bei Schutz-, Heil- und Helfer-Zaubern)
  const NO_ECHO = ['shield', 'heal', 'buff', 'dash', 'ally', 'sacrifice', 'rally', 'brew', 'summon', 'wonder'];
  function echoChance(h) { return on(h, 'echokaskade') ? 0.4 : 0.25; }
  function onEcho(h, id) {
    const w = W(), sk = A.SKILLS[id]; if (!on(h, 'echokaskade') || !sk || NO_ECHO.includes(sk.kind) || sk.zone === 'heal') return;
    later({ kind: 'echo', at: w.t + 0.3, id });
  }
  // Wirbelwind: jeder 4. Schlag schleudert die kreisenden Klingen weit hinaus und zurück (world.js orbStep fragt swirl)
  function onAttack(h) {
    const w = W(); if (!on(h, 'wirbelwind') || h.atkN % 4 !== 0 || !w.orbs.some(o => o.perm)) return;
    w.cbSwirl = { t0: w.t, until: w.t + 0.9 };
    api.float(h.x, h.y - 58, L('Wirbelwind!', 'Whirlwind!'), '#c0cbdc', 13);
    if (A.FX) A.FX.part({ kind: 'ring', x: h.x, y: h.y, life: 0.5, size: 150, color: '#c0cbdc', add: true });
    if (A.Sound.swing) A.Sound.swing();
  }
  function swirl() { const w = W(), s = w && w.cbSwirl; if (!s || w.t >= s.until) return 0; return Math.sin(Math.PI * (w.t - s.t0) / (s.until - s.t0)); }
  // Begleiter geht (Zeit abgelaufen oder verdrängt): Knochenknall lässt Diener zerplatzen
  function onAllyGone(a) {
    const w = W(), h = w && w.hero; if (!a.minion || !on(h, 'knochenknall') || !h.alive || !fight(w)) return;
    w.marks.push({ kind: 'boom', x: a.x, y: a.y, r: 72, at: w.t + 0.05, dmg: pow(h) * 0.6, col: '#e0a4ff', opts: { raise: true, proc: true, bone: true } });
  }
  // Pudding verschluckt einen Gegner: Königsfamilie spuckt einen Baby-Schleim aus (bis 4)
  function onGulp(p, x, y) {
    const w = W(), h = w && w.hero; if (!on(h, 'koenigsfamilie')) return;
    const kids = w.allies.filter(a => a.cb === 'baby' && !a.gone);
    if (kids.length >= 4) { const old = kids.sort((q, r) => q.until - r.until)[0]; old.gone = true; api.fx('appear', { m: old }); }
    const b = ally(h, 0.3, 15, x, y);
    b.cb = 'baby'; b.r = 8; b.col = '#9be37a'; b.rate = 0.55; b.spd = 1.25; b.fx = p.fx;
    api.float(x, y - 30, L('Ein Enkel!', 'A grandchild!'), '#9be37a', 12);
    if (A.FX) A.FX.burst(x, y - 6, 10, { color: ['#9be37a', '#63c74d', '#fee761'], smin: 40, smax: 120, life: 0.45, z: 4, vz: 90, g: 380 });
  }
  // Zahlen für andere Dateien
  function wolves(h) { return on(h, 'rudel') ? 3 : 1; }               // Treuer Begleiter (world.js syncPerm)
  function surpriseEvery(h) { return on(h, 'brauerei') ? 3 : 4; }     // Überraschungs-Flaschen (classes.js)
  function bounces(h) { return on(h, 'brauerei') ? 2 : 0; }           // so oft springt eine Überraschung weiter

  // ---------- Jedes Bild ----------
  function tick(dt) {
    const w = W(); if (!w) return; const h = w.hero; if (!h) return;
    const inFight = fight(w);
    if (h.alive && h.combo) {
      if (inFight) {
        if (on(h, 'gewitterklingen')) storm(w, h, dt);
        if (on(h, 'meteorschauer') && (h.cbMetT = (h.cbMetT == null ? 3 : h.cbMetT) - dt) <= 0) { h.cbMetT = 7; shower(w, h); }
        if (on(h, 'pilzteppich') && h.moving && (h.shroomT = (h.shroomT || 0) - dt) <= 0) { h.shroomT = 1.3; plant(w, h); }
      } else h.cbMetT = 3;
      if (on(h, 'permafrost')) permafrost(w, h, dt);
      todesmut(w, h, dt);
    }
    // Warteschlange: Echo-Echo und Fadenfunken
    if (w.cbQ && w.cbQ.length) {
      for (const q of w.cbQ) if (w.t >= q.at) { q.done = true; if (h.alive) queued(q, w, h); }
      w.cbQ = w.cbQ.filter(q => !q.done);
    }
    // Raketen, Blutkugeln, Giftpilze
    for (const o of w.cbfx || []) {
      if (o.done) continue;
      if (o.kind === 'rocket') rocketStep(o, w, h);
      else if (o.kind === 'blood') bloodStep(o, w, h, dt);
      else if (o.kind === 'shroom') shroomStep(o, w, h);
    }
    if (w.cbfx && w.cbfx.length) w.cbfx = w.cbfx.filter(o => !o.done);
  }
  function queued(q, w, h) {
    if (q.kind === 'echo') {
      if (!h.skills.includes(q.id)) return;
      api.castSkill(h, q.id, 0.6);
      api.float(h.x + 16, h.y - 50, L('Echo-Echo!', 'Echo-echo!'), '#2ce8f5', 12);
      if (A.FX) A.FX.part({ kind: 'ring', x: h.x, y: h.y, life: 0.4, size: 70, color: '#2ce8f5', add: true });
    } else if (q.kind === 'thread') {   // Fadenfunke springt zum nächsten Gegner; fällt der, springt der nächste weiter (onKill)
      const m = nearest(q.x, q.y, 320); if (!m) return;
      w.bolts.push({ x0: q.x, y0: q.y - 8, x1: m.x, y1: m.y - 10, life: 0.3, max: 0.3, col: '#7fd8ff', seed: Math.random() * 99 });
      api.hit(h, m, api.statOf(h, 'mag') * 0.7, { kind: 'magic', proc: true, noKb: true, color: '#7fd8ff' });
      api.fx('zap', { x: m.x, y: m.y, color: '#7fd8ff' });
    }
  }
  // Gewitterklingen: jede kreisende Klinge blitzt alle 1,2 Sekunden einen Gegner in der Nähe an
  function storm(w, h, dt) {
    for (const o of w.orbs) {
      if (!o.perm || o.x == null) continue;
      if (A.FX && !A.FX.low && Math.random() < dt * 10) A.FX.part({ add: true, x: o.x + (Math.random() - 0.5) * 8, y: o.y, z: 12 + Math.random() * 6, vx: (Math.random() - 0.5) * 40, vy: (Math.random() - 0.5) * 30, life: 0.2, color: Math.random() < 0.6 ? '#fee761' : '#ffffff', drag: 2 });
      if ((o.zapT = (o.zapT == null ? 0.6 : o.zapT) - dt) > 0) continue;
      const m = nearest(o.x, o.y, 170); if (!m) { o.zapT = 0.2; continue; }
      o.zapT = 1.2;
      w.bolts.push({ x0: o.x, y0: o.y - 14, x1: m.x, y1: m.y - 10, life: 0.22, max: 0.22, col: '#fee761', seed: Math.random() * 99 });
      api.hit(h, m, pow(h) * 0.5, { kind: 'magic', proc: true, noKb: true, color: '#fee761' });
      api.fx('zap', { x: m.x, y: m.y, color: '#fee761' });
    }
  }
  // Meteorschauer: ein Meteor auf den Gegner mit dem meisten Leben
  function shower(w, h) {
    let tg = null;
    for (const m of w.mons) if (live(m) && Math.hypot(m.x - h.x, m.y - h.y) < 480 && (!tg || m.hp > tg.hp)) tg = m;
    if (!tg) return;
    w.marks.push({ kind: 'meteor', x: tg.x, y: tg.y, r: 90, t0: w.t, at: w.t + 0.85, dmg: pow(h) * 2, burn: 0.5, col: '#f77622', opts: { proc: true } });
    api.float(h.x, h.y - 60, L('Meteorschauer!', 'Meteor shower!'), '#f77622', 13);
  }
  // Pilzteppich: in der Giftspur wachsen Giftpilze (höchstens 8, der älteste macht Platz)
  function plant(w, h) {
    const list = (w.cbfx || []).filter(o => o.kind === 'shroom' && !o.done);
    if (list.length >= 8) list[0].done = true;
    add({ kind: 'shroom', x: h.x - h.fx * 12, y: h.y + 10, t0: w.t, until: w.t + 14, seed: Math.random() * 9 });
  }
  function shroomStep(o, w, h) {
    if (w.t > o.until) { o.done = true; return; }
    if (w.t - o.t0 < 0.4 || !h.alive) return;   // wächst noch
    for (const m of w.mons) if (live(m) && Math.hypot(m.x - o.x, m.y - o.y) < m.r + 12) { o.done = true; shroomPop(h, o); return; }
  }
  function shroomPop(h, o) {
    const w = W(), r = 56;
    for (const m of w.mons) if (live(m) && Math.hypot(m.x - o.x, m.y - o.y) < r + m.r) api.hit(h, m, pow(h) * 0.6, { kind: 'magic', proc: true, poison: 0.8, color: '#63c74d' });
    w.zones.push({ kind: 'poison', x: o.x, y: o.y, r: 60, t0: w.t, until: w.t + 3, tick: w.t + 0.3, dmg: pow(h) * 0.3, col: '#63c74d' });
    api.fx('boom', { x: o.x, y: o.y, r, color: '#63c74d', soft: true });
    if (A.FX) A.FX.burst(o.x, o.y - 6, 14, { color: ['#63c74d', '#a2e05a', '#b55088', '#e0a4ff'], smin: 30, smax: 110, life: 0.8, z: 6, vz: 60, g: -10, size: 2 });
    api.float(o.x, o.y - 26, L('Puff!', 'Poof!'), '#a2e05a', 12);
    if (A.Sound.gulp) A.Sound.gulp(0.5);
  }
  // Blutkugel: fliegt kurz heraus, dann zum Helden; heilt 2 % und gibt 4 Sekunden +6 % Schaden (bis 5-mal)
  function bloodStep(o, w, h, dt) {
    const age = w.t - o.t0;
    if (age < 0.25) { o.x += o.vx * dt; o.y += o.vy * dt; o.vx *= 1 - dt * 4; o.vy *= 1 - dt * 4; }
    else {
      const dx = h.x - o.x, dy = h.y - 10 - o.y, d = Math.hypot(dx, dy) || 1, sp = (300 + 700 * age) * dt;
      if (d <= sp + 10 || age > 3 || !h.alive) { o.done = true; if (h.alive) drink(w, h); return; }
      o.x += dx / d * sp; o.y += dy / d * sp;
    }
    if (A.FX && !A.FX.low && Math.random() < dt * 20) A.FX.part({ add: true, x: o.x, y: o.y, vx: 0, vy: 0, life: 0.25, color: '#e43b44', drag: 1 });
  }
  function drink(w, h) {
    h.bloodN = Math.min(5, (h.bloodUntil > w.t ? h.bloodN || 0 : 0) + 1); h.bloodUntil = w.t + 4;
    api.heal(h, Math.max(1, Math.round(h.maxHp * 0.02)));
    if (A.FX) A.FX.burst(h.x, h.y - 12, 6, { color: ['#e43b44', '#ff0044', '#f6757a'], smin: 20, smax: 70, life: 0.35, add: true, kind: 'spark', drag: 4 });
  }
  // Permafrost: wer 1,5 Sekunden in der Frostaura steht, friert ein; danach kurz Ruhe, damit er nicht für immer festsitzt
  function permafrost(w, h, dt) {
    for (const m of w.mons) {
      if (!live(m)) continue;
      const t0 = m.pfT || 0;
      if (t0 < 0) { m.pfT = Math.min(0, t0 + dt); continue; }
      const near = Math.hypot(m.x - h.x, m.y - h.y) < 110 + m.r;   // so gross ist die Frostaura (world.js)
      m.pfT = near ? t0 + dt : Math.max(0, t0 - dt);
      if (near && A.FX && !A.FX.low && Math.random() < dt * 5 * (1 + m.pfT * 3)) A.FX.part({ add: true, x: m.x + (Math.random() - 0.5) * m.r * 2, y: m.y, z: Math.random() * 24, vx: 0, vy: 0, vz: 16, life: 0.45, color: Math.random() < 0.5 ? '#9be8ff' : '#ffffff', drag: 1 });
      if (m.pfT < 1.5) continue;
      m.pfT = -1.6;
      const d = m.boss ? 0.35 : 1.2; m.stun = Math.max(m.stun, d); m.frozenUntil = w.t + d;
      api.float(m.x, m.y - m.r - 24, L('Permafrost!', 'Permafrost!'), '#9be8ff', 12);
      if (A.FX) A.FX.burst(m.x, m.y - 8, 14, { color: ['#9be8ff', '#ffffff', '#2ce8f5'], smin: 30, smax: 120, life: 0.5, add: true, kind: 'spark', drag: 4 });
      if (A.Sound.glass) A.Sound.glass(false);
    }
  }
  // Todesmut: unter 35 % Leben glüht der Held rot (die Volltreffer kommen aus pre)
  function todesmut(w, h, dt) {
    const brave = on(h, 'todesmut') && h.hp < h.maxHp * 0.35;
    if (brave && !h.braveOn) {
      api.float(h.x, h.y - 66, L('Todesmut!', 'Death wish!'), '#e43b44', 16);
      if (A.FX) A.FX.burst(h.x, h.y - 10, 16, { color: ['#e43b44', '#ff0044', '#fee761'], smin: 60, smax: 180, life: 0.45, add: true, kind: 'spark', drag: 3 });
    }
    h.braveOn = brave;
    if (brave && A.FX && !A.FX.low && Math.random() < dt * 16) A.FX.part({ add: true, x: h.x + (Math.random() - 0.5) * 24, y: h.y, z: 4 + Math.random() * 16, vx: 0, vy: 0, vz: 40, life: 0.45, color: Math.random() < 0.5 ? '#e43b44' : '#ff0044', drag: 1 });
  }

  // ---------- Bilder (Pixel-Raster wie in art.js) ----------
  A.Art.R.cb_pilz = [[
    '...VVV...',
    '.VVlVVVV.',
    'VVVVVVlVV',
    'VlVVVVVVV',
    'vvvvvvvvv',
    '...sss...',
    '...sss...',
  ]];
  A.Art.R.cb_baby = [[
    '...Y.Y...',
    '...YYY...',
    '..lllll..',
    '.ll0l0ll.',
    'lllllllll',
    'lGllllllG',
    '.GGGGGGG.',
  ]];

  // ---------- Zeichnen im Retro-Look (dr.b = Bild, dr.g = Leuchten) ----------
  function drawGround(dr, w, cx, cy) {
    const list = w.cbfx; if (!list || !list.length) return;
    const t = dr.t, spr = A.Art.sprite('cb_pilz');
    for (const o of list) {
      if (o.kind !== 'shroom' || o.done) continue;
      const x = o.x / PX - cx, y = o.y / PX - cy, grow = clamp((w.t - o.t0) / 0.4, 0.1, 1), wob = Math.sin(t * 3 + o.seed) * 0.06, end = o.until - w.t;
      dr.shadow(x, y, 3 * grow);
      dr.blit(spr, x, y + 1, false, { sx: grow * (1 + wob), sy: grow * (1 - wob), alpha: end < 1.5 && Math.floor(t * 12) % 2 ? 0.45 : 1 });
    }
  }
  function drawTop(dr, w, cx, cy) {
    const b = dr.b, g = dr.g, h = w.hero, k = swirl();
    if (k > 0 && h) { const x = h.x / PX - cx, y = h.y / PX - cy - 7, R = (48 + 90 * k) / PX; g.globalAlpha = 0.35 * k; g.strokeStyle = '#c0cbdc'; g.lineWidth = 1; g.beginPath(); g.ellipse(Math.round(x), Math.round(y), R, R * 0.7, 0, 0, TAU); g.stroke(); }
    for (const o of w.cbfx || []) {
      if (o.kind === 'rocket') {
        if (w.t < o.t0 || !o.tr.length || o.done) continue;
        g.fillStyle = o.col; b.fillStyle = o.col;
        o.tr.forEach(([px, py], i) => {   // Schweif: hinten dünn und blass, vorne dick
          const k = (i + 1) / o.tr.length, sz = k > 0.6 ? 2 : 1, tx = Math.round(px / PX - cx), ty = Math.round(py / PX - cy);
          b.globalAlpha = k * 0.5; b.fillRect(tx, ty, sz, sz); g.globalAlpha = k * 0.8; g.fillRect(tx, ty, sz, sz);
        });
        const x = Math.round(o.x / PX - cx), y = Math.round((o.y - o.z) / PX - cy);
        b.globalAlpha = 1; b.fillStyle = '#181425'; b.fillRect(x - 1, y - 1, 4, 4); b.fillStyle = o.col; b.fillRect(x, y, 2, 2);
        g.globalAlpha = 0.5; g.fillStyle = o.col; g.fillRect(x - 1, y - 1, 4, 4); g.globalAlpha = 1; g.fillStyle = '#ffffff'; g.fillRect(x, y, 1, 1);
      } else if (o.kind === 'blood') {
        const x = Math.round(o.x / PX - cx), y = Math.round(o.y / PX - cy);
        b.globalAlpha = 1; b.fillStyle = '#181425'; b.fillRect(x - 2, y - 2, 4, 4); b.fillStyle = '#a22633'; b.fillRect(x - 1, y - 1, 2, 2);
        g.globalAlpha = 0.9; g.fillStyle = '#ff0044'; g.fillRect(x - 1, y - 1, 1, 1);
      }
    }
    b.globalAlpha = 1; g.globalAlpha = 1;
  }
  // Baby-Schleim (grün, mit Mini-Krone) und Schattenklon (der Held in Lila, halb durchsichtig)
  function drawAlly(dr, a, cx, cy) {
    if (a.cb !== 'baby' && a.cb !== 'clone') return false;
    const w = W(), b = dr.b, t = dr.t, x = a.x / PX - cx, y = a.y / PX - cy + 7, flip = a.fx < 0;
    let alpha = 1; if (a.spawn > 0) alpha = clamp(1 - a.spawn / 0.25, 0, 1);
    if (w && a.until - w.t < 1.2 && Math.floor(t * 14) % 2) alpha *= 0.4;   // läuft ab: blinkt
    const ox = a.swing > 0 ? a.fx * Math.sin((1 - a.swing / 0.2) * Math.PI) * 3 : 0;
    if (a.cb === 'baby') {
      const spr = A.Art.sprite('cb_baby'), hop = a.moving ? Math.round(Math.abs(Math.sin(t * 12 + a.x * 0.1)) * 2) : 0, q = Math.sin(t * 9 + a.x * 0.1);
      dr.shadow(x, y, 4);
      dr.outlineGlow(spr, x + ox, y - hop, flip, '#9be37a');
      dr.blit(spr, x + ox, y - hop, flip, { sx: 1 + q * 0.08, sy: 1 - q * 0.08, alpha });
      return true;
    }
    const run = A.Game.run; if (!run) return true;
    const frame = a.moving ? [1, 2, 3, 2][Math.floor(t * 10) % 4] : 0, spr = A.Art.heroSprite(run.race, run.cls, frame);
    dr.shadow(x, y, 6);
    dr.outlineGlow(spr, x + ox, y, flip, '#b55088');
    dr.blit(spr, x + ox, y, flip, { alpha: 0.45 * alpha });
    const k = flip ? 'cbShadeF' : 'cbShade'; if (!spr[k]) spr[k] = A.Art.silhouette(flip ? A.Art.flipped(spr) : spr.img, '#68386c');
    b.globalAlpha = 0.5 * alpha; b.drawImage(spr[k], Math.round(x + ox - spr.w / 2), Math.round(y - spr.h)); b.globalAlpha = 1;
    if (A.FX && !A.FX.low && Math.random() < 0.2) A.FX.part({ add: true, x: a.x + (Math.random() - 0.5) * 16, y: a.y, vx: 0, vy: -20, life: 0.45, color: Math.random() < 0.5 ? '#b55088' : '#e0a4ff', drag: 1 });
    return true;
  }
  // Licht im Dunkeln
  function lights(w, Lt) {
    const h = w.hero;
    for (const o of w.cbfx || []) {
      if (o.kind === 'rocket' && w.t >= o.t0) Lt(o.x, o.y - o.z, 26, o.col, 0.7);
      else if (o.kind === 'blood') Lt(o.x, o.y, 16, '#e43b44', 0.6);
      else if (o.kind === 'shroom') Lt(o.x, o.y - 4, 14, '#63c74d', 0.25);
    }
    if (h && h.alive && h.braveOn) Lt(h.x, h.y - 8, 56, '#e43b44', 0.25 + Math.sin(w.t * 8) * 0.06);
    if (h && h.alive && h.bloodUntil > w.t) Lt(h.x, h.y - 8, 40, '#a22633', 0.08 * (h.bloodN || 1));
  }

  return { bind, on, evaluate, list, completes, hasPart, partName, partWhere, partIcon, recipe, pre, onKill, onHurt, onDodge, onBoom, onMeteor, onChainHit, onShotHit, onCoin,
    echoChance, onEcho, onAttack, swirl, onAllyGone, onGulp, wolves, surpriseEvery, bounces, tick, drawGround, drawTop, drawAlly, lights };
})();
