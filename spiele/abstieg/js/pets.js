// Der Abstieg – Begleiter (A.PETS in data.js): Tiere aus Käfigen, mit Treue-Stufen, die für immer bleiben.
// game.js führt den Spielstand (meta.pets: Treue je Tier, meta.petSel: wer aus der Tierhütte mitkommt, run.pets: wer gerade dabei ist).
// world.js lässt die Tiere als Helfer laufen (W.allies mit a.pet) und ruft die Haken (step, tick, onKill, reveal, cageRoom);
// draw.js zeichnet sie (drawAlly, drawGround, drawCage, lights) und fragt die Eule nach der Karte (owlSees).
'use strict';
window.A = window.A || {};

A.Pets = (function () {
  const TAU = Math.PI * 2, PX = 2, EY = 0.6;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const L = (de, en) => (A.LANG === 'de' ? de : en);
  let api = null;   // Werkzeuge aus world.js: hit, float, fx, shoot, moveEnt, mkAlly, heroPower, freeSpot, clearLine, drop
  const W = () => api && api.W;
  const G = () => A.Game;
  function bind(a) { api = a; }
  const P = (id) => A.PETS[id];
  const ids = () => Object.keys(A.PETS);
  const live = (m) => m.alive && !(m.spawn > 0);
  const fight = (w) => !!(w && w.active && w.mons.some(live));
  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  function add(o) { const w = W(); (w.petfx || (w.petfx = [])).push(o); return o; }

  // ---------- Treue (bleibt für immer, im Lager-Spielstand) ----------
  const rec = (id) => { const m = G().meta; return m && m.pets ? m.pets[id] : null; };
  const found = (id) => !!P(id) && !!rec(id);   // nur Tiere, die diese Version kennt (Spielstand einer neueren Version)
  const xpOf = (id) => (rec(id) && rec(id).xp) || 0;
  function treue(id) { const xp = xpOf(id); let lv = 1; for (let i = 1; i < A.PET_TREUE.length; i++) if (xp >= A.PET_TREUE[i]) lv = i + 1; return lv; }
  // Fortschritt zur nächsten Stufe als [geschafft, nötig]; null auf der höchsten Stufe
  function progress(id) { const lv = treue(id); if (lv >= A.PET_TREUE.length) return null; const a = A.PET_TREUE[lv - 1], b = A.PET_TREUE[lv]; return [Math.floor(xpOf(id) - a), b - a]; }
  const T = (id, n) => treue(id) >= n;   // kann das Tier diesen Trick schon?
  function count() { return ids().filter(found).length; }
  const me = () => G().metaEffects();
  function slots() { return 1 + (me().petSlots || 0); }
  function startN() { return Math.min(slots(), me().petStart || 0); }
  function dmgMul(id) { return (1 + A.PET_GROW * (treue(id) - 1)) * (1 + (me().petDmg || 0)); }
  const withMe = () => ((G().run && G().run.pets) || []).filter(P);

  // ---------- Tierhütte: wer kommt von Anfang an mit? ----------
  // Die Wahl im Lager; fehlt eine, kommen die ersten gefundenen Tiere
  function sel() {
    const n = startN(); if (!n) return [];
    const out = (G().meta.petSel || []).filter(id => found(id) && !away(id)).slice(0, n);   // wer auf Reise ist (v41), bleibt draussen
    for (const id of ids()) if (out.length < n && found(id) && !away(id) && !out.includes(id)) out.push(id);
    return out;
  }
  // Ein Tier wählen: ist kein Platz mehr frei, bleibt das zuerst gewählte zu Hause
  function choose(id) {
    const n = startN(); if (!found(id) || !n || away(id)) return;
    const s = sel().filter(x => x !== id); s.push(id);
    G().meta.petSel = s.slice(-n); G().saveMeta();
  }
  function startPets() { return sel().slice(0, slots()); }

  // ---------- Expeditionen (v41, A.EXPEDITIONS) ----------
  // meta.exp[id] = { k, t0, end } (Zeit in ms, echte Uhr). Unterwegs ist ein Tier weder im Team der Tierhütte noch in einem Käfig.
  const now = () => Date.now();
  function trips() { const m = G().meta; if (!m.exp || typeof m.exp !== 'object') m.exp = {}; return m.exp; }
  const tripX = (e) => e && A.EXPEDITIONS.find(x => x.id === e.k);
  function away(id) { const m = G().meta, e = m && m.exp && m.exp[id]; return !!(e && tripX(e) && isFinite(e.end)); }
  function tripOf(id) {
    if (!away(id)) return null; const e = trips()[id], X = tripX(e), left = Math.max(0, e.end - now());
    return { X, left, done: left <= 0, pct: clamp(1 - left / (X.h * 3600e3), 0, 1) };
  }
  const busy = () => ids().filter(away).length;
  const inRun = (id) => { const r = G().run; return !!(r && !r.over && (r.pets || []).includes(id)); };   // gerade mit in der Tiefe (Lauf zum Weiterspielen)
  function canSend(id) { return found(id) && !away(id) && !sel().includes(id) && !inRun(id) && busy() < A.EXP_MAX; }
  function send(id, k) {
    const X = A.EXPEDITIONS.find(x => x.id === k); if (!X || !canSend(id)) return false;
    const t = now(); trips()[id] = { k, t0: t, end: t + X.h * 3600e3 }; G().saveMeta(); return true;
  }
  // Abholen: Seelenfunken, Treue und manchmal ein Mitbringsel für den nächsten Lauf (meta.gift); fest aus der Startzeit gewürfelt
  function claim(id) {
    const tr = tripOf(id); if (!tr || !tr.done) return null;
    const m = G().meta, e = trips()[id], X = tr.X, rng = new A.RNG(((Math.floor(e.t0 / 1000) ^ 0x3c6ef372) >>> 0) || 3);
    const sparks = rng.int(X.sparks[0], X.sparks[1]);
    let gift = null; if (X.gift > 0 && rng.chance(X.gift)) { gift = X.item > 0 && rng.chance(X.item) && !((m.gift && m.gift.item) >= A.EXP_MAX * 2) ? A.EXP_ITEM : rng.pick(A.EXP_GIFTS); const g = m.gift && typeof m.gift === 'object' ? m.gift : (m.gift = {}); g[gift.k] = (g[gift.k] || 0) + gift.n; }   // warten schon 6 Stücke: Tränke oder Gold
    delete m.exp[id]; m.sparks += sparks;
    const up = gain(id, X.treue);
    G().saveMeta();
    return { sparks, treue: X.treue, up, lv: treue(id), gift, line: A.t(A.EXP_LINES[id] || A.EXP_LINES._) };
  }
  const tripsBack = () => ids().filter(id => { const tr = tripOf(id); return tr && tr.done; }).length;

  // ---------- Käfige ----------
  // In welchem Kampfraum steht der Käfig? Fest aus dem Startwert der Ebene (der Spielstand zählt die Dinge im Raum der Reihe nach)
  function cageRoom(rooms, seed) {
    const list = rooms.filter(r => r.type === 'fight' || r.type === 'elite'); if (!list.length) return null;
    return new A.RNG((((seed >>> 0) ^ 0x5bd1e995) >>> 0) || 7).pick(list);
  }
  // Gibt es auf der neuen Ebene einen Käfig? Ab Ebene 2; wer noch nie ein Tier gefunden hat, findet auf Ebene 2 sicher eins
  function cageOnFloor(r) {
    if (r.floor < 2) return false;
    if (r.floor === 2 && !count()) return true;
    return r.rng.chance(A.PET_CAGE);
  }
  // Der Raum ist gesäubert: der Käfig taucht auf
  function reveal(p) {
    api.float(p.x, p.y - 44, L('Ein Käfig!', 'A cage!'), '#fee761', 16);
    if (A.FX) { A.FX.smoke(p.x, p.y - 10, 8, '#8b9bb4', 5); A.FX.part({ kind: 'ring', x: p.x, y: p.y - 6, life: 0.45, size: 60, color: '#fee761', add: true }); }
    if (A.Sound.open) A.Sound.open();
  }
  // Was sitzt drin? Nie ein Tier, das schon dabei ist; noch nie gefundene viel öfter
  function cagePick() {
    const have = withMe(), list = ids().filter(id => !have.includes(id) && !away(id));   // Tiere auf Reise sitzen in keinem Käfig
    if (!list.length) return null;
    return G().run.rng.weighted(list, id => found(id) ? 1 : 4);
  }
  // Käfig offen: das Tier ist gefunden; ein neues bringt Seelenfunken, ein bekanntes freut sich (+10 Treue)
  function free(id) {
    const m = G().meta, r = G().run; m.pets = m.pets || {};
    const first = !m.pets[id];
    if (first) { m.pets[id] = { xp: 0, n: 1 }; m.sparks += A.PET_SPARKS; r.petSparks = (r.petSparks || 0) + A.PET_SPARKS; }
    else { m.pets[id].n = (m.pets[id].n || 0) + 1; gain(id, 10); }
    G().saveMeta(); G().save();
    return { first, n: count(), sparks: first ? A.PET_SPARKS : 0 };
  }
  // Mitnehmen; out: dieses Tier geht dafür ins Lager
  function join(id, out) {
    const r = G().run, list = withMe().filter(x => x !== out && x !== id);
    list.push(id); r.pets = list.slice(-slots()); G().save();
  }

  // ---------- Treue wächst ----------
  function gain(id, n) {
    const p = rec(id); if (!p || !(n > 0)) return false;
    const before = treue(id); p.xp = Math.round(((p.xp || 0) + n) * 100) / 100;
    const now = treue(id); if (now > before) levelUp(id, now);
    return now > before;
  }
  function levelUp(id, lv) {
    const w = W(), Pt = P(id), a = w && w.allies.find(x => x.pet === id && !x.gone);
    const trick = lv === 3 ? Pt.t3 : lv === 5 ? Pt.t5 : null;
    // die Meldung wartet, bis keine andere läuft («Raum gesäubert» oder «Stufe» kommen oft im selben Moment und würden sie überdecken)
    if (w) (w.petNews || (w.petNews = [])).push([A.t(Pt.name) + ': ' + L('Treue ', 'Loyalty ') + lv + '!', trick ? L('Neuer Trick: ', 'New trick: ') + A.t(trick).split(':')[0] : L(`Beisst jetzt ${Math.round(A.PET_GROW * 100)} % fester zu`, `Now bites ${Math.round(A.PET_GROW * 100)}% harder`), Pt.col]);
    if (a) { api.float(a.x, a.y - 30, '♥', '#e43b44', 20); if (A.FX) A.FX.burst(a.x, a.y - 12, 14, { color: ['#e43b44', '#f6757a', '#ffffff'], smin: 30, smax: 120, life: 0.6, add: true, kind: 'spark', drag: 3 }); }
    if (A.Sound.level && w) A.Sound.level();
  }
  // Gegner besiegt: alle Tiere, die dabei sind, gewinnen Treue; hat Flitz (Langfinger) ihn kurz vorher gebissen, fällt doppelt Gold
  function onKill(e, rw) {
    const list = withMe(); if (!list.length) return;
    const k = (e.boss ? A.PET_XP.boss : e.elite ? A.PET_XP.elite : A.PET_XP.kill) * (1 + (me().petXp || 0));
    for (const id of list) gain(id, k);
    G().saveMeta();
    const bit = e.bit && e.bit.flitz, w = W();
    if (list.includes('flitz') && T('flitz', 3) && bit != null && w && w.t - bit < 4 && rw && rw.gold > 0) {
      const n = Math.max(1, rw.coins || 1);
      for (let i = 0; i < n; i++) api.drop({ kind: 'gold', val: Math.ceil(rw.gold / n) }, e.x, e.y, 60 + Math.random() * 90);
      if (!(w.langT > w.t)) { w.langT = w.t + 1.2; api.float(e.x, e.y - e.r - 40, L('Langfinger!', 'Sticky fingers!'), '#f77622', 12); }   // nicht öfter als alle 1.2 Sekunden
    }
    // Moppel (Goldnase): der letzte Gegner im Raum ist gefallen, er buddelt 2-4 Münzen aus (einmal je Raum, auch wenn danach noch Gegner nachkommen)
    if (list.includes('moppel') && T('moppel', 3) && w && w.active && w.moleRoom !== w.active && !w.mons.some(m => m.alive)) {
      w.moleRoom = w.active;
      const a = w.allies.find(x => x.pet === 'moppel' && !x.gone) || e, n = 2 + Math.floor(Math.random() * 3), val = Math.max(2, Math.round(2 + w.floor * 0.8));
      for (let i = 0; i < n; i++) api.drop({ kind: 'gold', val }, a.x, a.y, 50 + Math.random() * 80);
      api.float(a.x, a.y - 34, L('Goldnase!', 'Gold nose!'), '#fee761', 13);
      if (A.FX) A.FX.burst(a.x, a.y + 4, 8, { color: ['#733e39', '#8a5a3c', '#fee761'], smin: 20, smax: 90, life: 0.45, z: 2, vz: 90, g: 400, size: 2 });
    }
  }

  // ---------- Verhalten im Kampf ----------
  // Rückgabe true: das Tier ist in diesem Bild schon versorgt (Sprung, Rolle, Feuer aus der Ferne); false: läuft und beisst wie jeder Helfer (world.js allyStep)
  function target(a, maxD) {
    const w = W(); let best = null, bd = maxD;
    for (const m of w.mons) { if (!live(m)) continue; const d = dist(a, m); if (d < bd && api.clearLine(a, m)) { bd = d; best = m; } }
    return best;
  }
  const power = (a) => api.heroPower(W().hero) * a.pow;
  function step(a, dt) {
    const w = W(), h = w.hero;
    if (a.leap) { leapStep(a, dt, w); return true; }
    if (a.roll) { rollStep(a, dt, w); return true; }
    if (a.zz) { zigStep(a, dt, w); return true; }
    if (a.ram) { ramStep(a, dt, w); return true; }
    if (a.dive) { diveStep(a, dt, w); return true; }
    if (a.pet === 'moppel') return mole(a, dt, w, h);   // vor dem Abstand: taucht immer auf, wenn kein Kampf mehr ist
    if (dist(a, h) > 420) return false;   // zu weit weg: erst zum Helden
    if (a.pet === 'lotte') return goat(a, dt, w);
    if (a.pet === 'pfeffer') return parrot(a, dt, w, h);
    if (a.pet === 'flitz') return flitz(a, dt, w);
    if (a.pet === 'huhu') return owl(a, dt, w);
    if (a.pet === 'glut') return drake(a, dt, w, h);
    if (a.pet === 'brunhilde') return toad(a, dt, w);
    if (a.pet === 'stachel') return hog(a, dt, w);
    return false;
  }
  // Flitz: Zickzack durch bis zu 5 Gegner
  function flitz(a, dt, w) {
    if (T('flitz', 5) && fight(w) && (a.zzT = (a.zzT == null ? 3 : a.zzT) - dt) <= 0) {
      const list = chainFrom(a, 5);
      if (list.length) { a.zzT = 6; a.zz = { list, i: 0 }; api.float(a.x, a.y - 30, L('Zickzack!', 'Zigzag!'), '#f77622', 13); return true; }
      a.zzT = 0.5;
    }
    return false;
  }
  function chainFrom(a, n) {
    const w = W(), out = []; let cur = a;
    for (let i = 0; i < n; i++) {
      let best = null, bd = i ? 230 : 320;
      for (const m of w.mons) { if (!live(m) || out.includes(m)) continue; const d = dist(cur, m); if (d < bd) { bd = d; best = m; } }
      if (!best) break; out.push(best); cur = best;
    }
    return out;
  }
  function zigStep(a, dt, w) {
    const z = a.zz, m = z.list[z.i];
    a.moving = true;
    if (!m || !m.alive) { if (++z.i >= z.list.length) endZig(a); return; }
    const d = dist(a, m) || 1, sp = 950 * dt;
    a.fx = (m.x - a.x) / d; a.fy = (m.y - a.y) / d;
    if (A.FX && !A.FX.low) A.FX.part({ add: true, x: a.x, y: a.y - 6, vx: 0, vy: 0, life: 0.25, color: Math.random() < 0.5 ? '#f77622' : '#feae34', size: 2 });
    if (d > sp + m.r) { a.x += a.fx * sp; a.y += a.fy * sp; return; }
    a.x = m.x - a.fx * m.r; a.y = m.y - a.fy * m.r; a.swing = 0.2;
    api.hit(a, m, power(a) * 2.5, { kind: 'phys', color: '#f77622' });
    w.fx.push({ kind: 'claw', x: a.x, y: a.y, fx: a.fx, fy: a.fy, r: a.r + m.r + 10, life: 0.2, ally: true, col: '#f77622' });
    if (++z.i >= z.list.length) endZig(a);
  }
  function endZig(a) { a.zz = null; [a.x, a.y] = api.freeSpot(a.x, a.y, a.r); }
  // Huhu: fliegt, Schuhu-Schrei betäubt alle rundum
  function owl(a, dt, w) {
    if (T('huhu', 5) && fight(w) && (a.hootT = (a.hootT == null ? 4 : a.hootT) - dt) <= 0) {
      a.hootT = 8; let n = 0;
      for (const m of w.mons) if (live(m) && dist(a, m) < 240 + m.r) { m.stun = Math.max(m.stun, m.boss ? 0.4 : 1.5); n++; }
      api.float(a.x, a.y - 44, L('Schuhu!', 'Hoo-hoo!'), '#e4a672', 16);
      add({ kind: 'ring', x: a.x, y: a.y, t0: w.t, until: w.t + 0.6, r: 240, col: '#e4a672' });
      if (A.Sound.hoot) A.Sound.hoot(); void n;
    }
    return false;
  }
  // Was sieht die Eule? 0 nichts, 1 geheime Räume, 2 die ganze Ebene
  function owlSees() { if (!withMe().includes('huhu')) return 0; return T('huhu', 3) ? 2 : 1; }
  // Glut: spuckt Feuer aus der Ferne, hält Abstand
  function drake(a, dt, w, h) {
    const tgt = target(a, 380); if (!tgt) return false;
    if (T('glut', 5) && (a.breathT = (a.breathT == null ? 3 : a.breathT) - dt) <= 0) { a.breathT = 7; breath(a, tgt, w); }
    const d = dist(a, tgt) || 1, nx = (tgt.x - a.x) / d, ny = (tgt.y - a.y) / d, sp = 220 * (a.spd || 1) * dt;
    a.fx = nx; a.fy = ny; a.moving = false;
    if (d > 240) { api.moveEnt(a, nx * sp, ny * sp); a.moving = true; }
    else if (d < 110) { api.moveEnt(a, -nx * sp * 0.8, -ny * sp * 0.8); a.moving = true; }
    if (a.cd <= 0 && d < 320) {
      a.cd = a.rate; a.swing = 0.2;
      api.shoot(a, tgt.x, tgt.y, power(a), { kind: 'magic', color: '#f77622', speed: 320, r: 5, life: 1.2, burn: 0.3, blast: T('glut', 3) ? 50 : 0 });
    }
    void h;
    return true;
  }
  function breath(a, tgt, w) {
    const d = dist(a, tgt) || 1, nx = (tgt.x - a.x) / d, ny = (tgt.y - a.y) / d, p0 = power(a);
    for (let i = 1; i <= 4; i++) w.zones.push({ kind: 'fire', x: a.x + nx * 42 * i, y: a.y + ny * 42 * i + 4, r: 28 + i * 4, t0: w.t, until: w.t + 3, tick: w.t + 0.1 * i, dmg: p0 * 0.5, col: '#f77622' });
    for (const m of w.mons) {
      if (!live(m)) continue; const dx = m.x - a.x, dy = m.y - a.y, along = dx * nx + dy * ny, side = Math.abs(dx * ny - dy * nx);
      if (along > 0 && along < 200 && side < 36 + along * 0.25 + m.r) api.hit(a, m, p0 * 1.6, { kind: 'magic', burn: 0.6, color: '#f77622' });
    }
    api.float(a.x, a.y - 34, L('Feueratem!', 'Fire breath!'), '#f77622', 14);
    if (A.FX) for (let i = 0; i < 26; i++) { const k = Math.random(), s = 40 + Math.random() * 160; A.FX.part({ add: true, x: a.x + nx * 10, y: a.y - 6 + ny * 10, vx: nx * s * (0.6 + k) + (Math.random() - 0.5) * 60, vy: ny * s * (0.6 + k) + (Math.random() - 0.5) * 60, life: 0.5 + Math.random() * 0.3, color: ['#fee761', '#feae34', '#f77622', '#e43b44'][i % 4], drag: 1.5, size: 2 }); }
    if (A.Sound.roar) A.Sound.roar();
  }
  // Brunhilde: springt Gegnern auf den Kopf; Zunge holt Fernkämpfer heran; Königssprung erschüttert den Raum
  function toad(a, dt, w) {
    const tgt = target(a, 330);
    if (T('brunhilde', 5) && tgt && fight(w) && (a.royalT = (a.royalT == null ? 4 : a.royalT) - dt) <= 0) {
      a.royalT = 9; let sx = 0, sy = 0, n = 0;
      for (const m of w.mons) if (live(m) && dist(a, m) < 420) { sx += m.x; sy += m.y; n++; }
      if (n) { jump(a, sx / n, sy / n, true); api.float(a.x, a.y - 34, L('Königssprung!', 'Royal leap!'), '#fee761', 15); return true; }
    }
    if (T('brunhilde', 3) && fight(w) && (a.tongueT = (a.tongueT == null ? 2 : a.tongueT) - dt) <= 0) {
      let far = null, fd = 50;   // der Weiteste in Reichweite (nicht der, auf dem sie gerade sitzt)
      for (const m of w.mons) { if (!live(m) || m.boss) continue; const d = dist(a, m); if (d > fd && d < 340 && api.clearLine(a, m)) { fd = d; far = m; } }
      if (far) { a.tongueT = 5; tongue(a, far, w); } else a.tongueT = 0.5;
    }
    if (tgt && a.cd <= 0 && dist(a, tgt) < 280) { a.cd = a.rate; jump(a, tgt.x, tgt.y, false); return true; }
    return false;
  }
  function jump(a, x, y, big) {
    const [x1, y1] = api.freeSpot(x, y, a.r);
    a.leap = { x0: a.x, y0: a.y, x1, y1, t: 0, dur: big ? 0.9 : 0.45, big };
    a.fx = x1 >= a.x ? 1 : -1; a.fy = 0;
    if (A.Sound.swing) A.Sound.swing();
  }
  function leapStep(a, dt, w) {
    const J = a.leap; J.t += dt; const k = clamp(J.t / J.dur, 0, 1);
    a.x = J.x0 + (J.x1 - J.x0) * k; a.y = J.y0 + (J.y1 - J.y0) * k; a.z = Math.sin(k * Math.PI) * (J.big ? 90 : 30); a.moving = true;
    if (k < 1) return;
    a.leap = null; a.z = 0; a.swing = 0.2;
    const R = J.big ? 430 : 58, p0 = power(a) * (J.big ? 2 : 1);
    for (const m of w.mons) if (live(m) && dist(a, m) < R + m.r) api.hit(a, m, p0, { kind: 'phys', color: '#63c74d', stun: J.big ? (m.boss ? 0.3 : 0.9) : 0 });
    if (A.FX) {
      A.FX.shake(J.big ? 0.45 : 0.06);
      A.FX.part({ kind: 'ring', x: a.x, y: a.y + 4, life: J.big ? 0.6 : 0.3, size: J.big ? 300 : 70, color: '#63c74d', add: true });
      A.FX.burst(a.x, a.y + 4, J.big ? 22 : 8, { color: ['#8b9bb4', '#c0cbdc', '#63c74d'], smin: 30, smax: J.big ? 200 : 90, life: 0.5, z: 2, vz: 80, g: 400, size: 2 });
      if (J.big) A.FX.rocks(a.x, a.y, 10, 120, ['#5a6988', '#8b9bb4', '#3a4466']);
    }
    if (J.big && A.Sound.stomp) A.Sound.stomp(); else if (A.Sound.gulp) A.Sound.gulp(0.4);
  }
  function tongue(a, m, w) {
    add({ kind: 'tongue', a, m, t0: w.t, until: w.t + 0.35 });
    m.stun = Math.max(m.stun, 1.4);
    api.hit(a, m, power(a) * 0.6, { kind: 'phys', color: '#f6757a', noKb: true });
    api.float(m.x, m.y - m.r - 26, L('Schlabber!', 'Slurp!'), '#f6757a', 13);
    if (A.Sound.gulp) A.Sound.gulp(0.7);
  }
  // Stachel: rollt als Kugel durch die Gegner; Flipperkugel prallt von den Wänden ab
  function hog(a, dt, w) {
    const tgt = target(a, 320); if (!tgt) return false;
    if (T('stachel', 5) && fight(w) && (a.pinT = (a.pinT == null ? 3 : a.pinT) - dt) <= 0) { a.pinT = 10; roll(a, tgt, true); api.float(a.x, a.y - 34, L('Flipperkugel!', 'Pinball!'), '#e4a672', 15); return true; }
    if (a.cd <= 0 && dist(a, tgt) < 260) { a.cd = a.rate; roll(a, tgt, false); return true; }
    return false;
  }
  function roll(a, tgt, big) {
    const d = dist(a, tgt) || 1;
    a.roll = { dx: (tgt.x - a.x) / d, dy: (tgt.y - a.y) / d, t: big ? 3 : 0.75, big, sp: big ? 520 : 430, hits: new Map() };
    if (big) a.r = 15;
  }
  function rollStep(a, dt, w) {
    const R = a.roll; R.t -= dt; a.moving = true; a.fx = R.dx; a.fy = R.dy;
    const ex = R.dx * R.sp * dt, ey = R.dy * R.sp * dt, bx = a.x, by = a.y;
    api.moveEnt(a, ex, 0); const mx = a.x - bx; api.moveEnt(a, 0, ey); const my = a.y - by;
    const hitX = Math.abs(ex) > 0.5 && Math.abs(mx) < Math.abs(ex) * 0.4, hitY = Math.abs(ey) > 0.5 && Math.abs(my) < Math.abs(ey) * 0.4;
    if (hitX || hitY) {
      if (R.big) { if (hitX) R.dx = -R.dx; if (hitY) R.dy = -R.dy; if (A.FX) A.FX.shake(0.05); if (A.Sound.klong) A.Sound.klong(); }
      else R.t = Math.min(R.t, 0.02);
    }
    for (const m of w.mons) {
      if (!live(m) || dist(a, m) > a.r + m.r + 4 || (R.hits.get(m) || 0) > w.t) continue;
      R.hits.set(m, w.t + (R.big ? 0.35 : 99));
      api.hit(a, m, power(a) * (R.big ? 1.2 : 1), { kind: 'phys', color: '#b86f50' });
    }
    if (A.FX && !A.FX.low && Math.random() < 0.6) A.FX.part({ x: a.x - R.dx * 8, y: a.y + 6, z: 1, vx: (Math.random() - 0.5) * 30, vy: 0, vz: 30, g: 200, life: 0.3, color: '#8b9bb4', size: 1 });
    if (R.t > 0) return;
    a.roll = null; a.r = 10; [a.x, a.y] = api.freeSpot(a.x, a.y, a.r);
    if (T('stachel', 3)) for (let i = 0; i < 8; i++) { const ang = i / 8 * TAU; api.shoot(a, a.x + Math.cos(ang) * 100, a.y + Math.sin(ang) * 100, power(a) * 0.45, { kind: 'phys', color: '#e4a672', speed: 380, life: 0.6, r: 4, quiet: i > 0 }); }
  }
  // Moppel: im Kampf unter der Erde (nur ein wandernder Erdhügel), taucht unter dem Gegner auf, beisst, betäubt und buddelt sich wieder ein.
  // Ohne Kampf (Raum gesäubert, neuer Raum, Held weit weg) taucht er immer auf und läuft wie jeder Helfer.
  function mole(a, dt, w, h) {
    if (!fight(w) || dist(a, h) > 420) { if (a.under) surface(a); a.slide = null; a.upT = 0; return false; }
    if (a.upT > 0) { a.upT -= dt; a.moving = false; if (a.upT <= 0) dig(a); return true; }   // kurz oben: Biss, dann wieder runter
    if (!a.under) dig(a);
    if (T('moppel', 5) && !a.slide && (a.slideT = (a.slideT == null ? 4 : a.slideT) - dt) <= 0) {
      const list = chainFrom(a, 3); a.slideT = list.length ? 9 : 0.5;
      if (list.length) { a.slide = list; a.slideEnd = w.t + 3; api.float(a.x, a.y - 30, L('Erdrutsch!', 'Landslide!'), '#8a5a3c', 14); }
    }
    if (a.slide) { a.slide = a.slide.filter(live); if (!a.slide.length || w.t > a.slideEnd) a.slide = null; }   // nach 3 Sekunden Schluss (ein Ziel hinter Wasser erreicht er sonst nie)
    const big = !!a.slide, m = big ? a.slide[0] : target(a, 400) || h, d = dist(a, m) || 1, sp = (big ? 520 : 300) * (a.spd || 1) * dt;
    a.fx = (m.x - a.x) / d; a.fy = (m.y - a.y) / d; a.moving = d > 30;
    if (a.moving) api.moveEnt(a, a.fx * Math.min(sp, d), a.fy * Math.min(sp, d));
    if (a.moving && A.FX && !A.FX.low && Math.random() < 0.3) A.FX.part({ x: a.x, y: a.y + 4, z: 1, vx: (Math.random() - 0.5) * 30, vy: 0, vz: 40, g: 300, life: 0.3, color: '#733e39', size: 1 });
    if (m !== h && d < 60 && (big || a.cd <= 0)) { if (big) a.slide.shift(); pop(a, m, big); }
    return true;
  }
  function pop(a, m, big) {
    [a.x, a.y] = api.freeSpot(m.x, m.y + m.r * 0.5, a.r);
    a.under = false; a.upT = big ? 0.3 : 0.45; a.cd = a.rate; a.swing = 0.2; a.moving = false; a.fx = m.x >= a.x ? 1 : -1; a.fy = 0;
    api.hit(a, m, power(a) * (big ? 2 : 1), { kind: 'phys', color: '#8a5a3c', stun: m.boss ? 0.25 : 0.5 });
    dirt(a, true);
  }
  function dig(a) { a.under = true; dirt(a, false); }
  function surface(a) { a.under = false; [a.x, a.y] = api.freeSpot(a.x, a.y, a.r); dirt(a, true); }
  function dirt(a, big) {
    if (A.FX) A.FX.burst(a.x, a.y + 4, big ? 10 : 5, { color: ['#733e39', '#8a5a3c', '#3e2731'], smin: 20, smax: big ? 110 : 60, life: 0.45, z: 2, vz: 90, g: 400, size: 2 });
    if (big && A.Sound.gulp) A.Sound.gulp(0.3);
  }
  // Lotte: senkt den Kopf, nimmt Anlauf und rennt geradeaus durch die Gegner (prallt nicht ab); Doppelbock: hin und gleich wieder zurück
  function goat(a, dt, w) {
    const tgt = target(a, 340); if (!tgt) return false;
    if (T('lotte', 5) && fight(w) && (a.bockT = (a.bockT == null ? 4 : a.bockT) - dt) <= 0) { a.bockT = 10; charge(a, tgt, true); api.float(a.x, a.y - 34, L('Doppelbock!', 'Double buck!'), '#e4e4e4', 15); return true; }
    if (a.cd <= 0 && dist(a, tgt) < 280) { a.cd = a.rate; charge(a, tgt, false); return true; }
    return false;
  }
  function charge(a, tgt, back) {
    const d = dist(a, tgt) || 1;
    a.ram = { dx: (tgt.x - a.x) / d, dy: (tgt.y - a.y) / d, wind: 0.4, t: 1, back, hits: new Set() };
    a.fx = a.ram.dx; a.fy = a.ram.dy; api.fx('windup', { m: a });
  }
  function ramStep(a, dt, w) {
    const R = a.ram; a.fx = R.dx; a.fy = R.dy;
    if (R.wind > 0) { R.wind -= dt; a.moving = false; return; }   // Kopf gesenkt, scharrt
    R.t -= dt; a.moving = true;
    const sp = 400 * (a.spd || 1) * dt, bx = a.x, by = a.y;
    api.moveEnt(a, R.dx * sp, R.dy * sp);
    const wall = Math.hypot(a.x - bx, a.y - by) < sp * 0.4;
    for (const m of w.mons) {
      if (!live(m) || R.hits.has(m) || dist(a, m) > a.r + m.r + 6) continue;
      R.hits.add(m);
      // Dickschädel: steht hinter dem Gegner eine Wand oder Säule, wird er dagegen gedrückt
      const px = m.x + R.dx * (m.r + 12), py = m.y + R.dy * (m.r + 12), fs = T('lotte', 3) ? api.freeSpot(px, py, m.r) : null, pin = !!fs && (fs[0] !== px || fs[1] !== py);
      api.hit(a, m, power(a) * (pin ? 2 : 1), { kind: 'phys', color: '#e4e4e4', stun: pin ? 0.4 : 0 });
      if (pin) { api.float(m.x, m.y - m.r - 26, L('Bumm!', 'Bonk!'), '#e4e4e4', 13); if (A.FX) A.FX.shake(0.08); }
    }
    if (R.t > 0 && !wall) return;
    if (R.back && !R.turned) { R.turned = true; R.dx = -R.dx; R.dy = -R.dy; R.t = 1; R.wind = 0.15; R.hits.clear(); return; }
    a.ram = null; [a.x, a.y] = api.freeSpot(a.x, a.y, a.r);
    if (wall && A.FX) A.FX.shake(0.04);
  }
  // Pfeffer: kreist 40-60 px um den Helden und spuckt Sonnenblumenkerne; Sturzflug auf den Gegner mit dem meisten Leben
  function parrot(a, dt, w, h) {
    if (T('pfeffer', 5) && fight(w) && (a.diveT = (a.diveT == null ? 3 : a.diveT) - dt) <= 0) {
      let big = null; for (const m of w.mons) if (live(m) && dist(h, m) < 450 && (!big || m.hp > big.hp)) big = m;
      a.diveT = big ? 8 : 0.5;
      if (big) { a.dive = { m: big, d0: Math.max(1, dist(a, big) - big.r), z: 11, up: 0 }; api.float(a.x, a.y - 40, 'Kraaa!', '#63c74d', 16); if (A.Sound.squeak) A.Sound.squeak(); return true; }
    }
    a.ang = (a.ang || Math.random() * TAU) + dt * 1.4;
    const R = 50 + Math.sin(w.t * 0.9) * 10, gx = h.x + Math.cos(a.ang) * R, gy = h.y + Math.sin(a.ang) * R * 0.7, gd = Math.hypot(gx - a.x, gy - a.y), sp = 260 * (a.spd || 1) * dt;
    a.moving = gd > 4;
    if (a.moving) api.moveEnt(a, (gx - a.x) / gd * Math.min(sp, gd), (gy - a.y) / gd * Math.min(sp, gd));
    const tgt = target(a, 360);
    if (!tgt) { if (a.moving) { a.fx = gx >= a.x ? 1 : -1; a.fy = 0; } return true; }
    a.fx = tgt.x >= a.x ? 1 : -1; a.fy = 0;
    if (a.cd <= 0) {
      a.cd = a.rate; a.swing = 0.2;
      const a0 = Math.atan2(tgt.y - a.y, tgt.x - a.x), n = T('pfeffer', 3) ? 3 : 1;
      for (let i = 0; i < n; i++) { const an = a0 + (i - (n - 1) / 2) * 0.3; api.shoot(a, a.x + Math.cos(an) * 100, a.y + Math.sin(an) * 100, power(a), { kind: 'phys', color: '#fee761', speed: 400, r: 3, life: 1, quiet: i > 0 }); }
    }
    return true;
  }
  function diveStep(a, dt, w) {
    const D = a.dive, m = D.m; a.moving = true;
    if (D.up > 0) { D.up -= dt; D.z = 11 * (1 - Math.max(0, D.up) / 0.35); if (D.up <= 0) a.dive = null; return; }   // zurück in die Luft
    if (!live(m)) { a.dive = null; [a.x, a.y] = api.freeSpot(a.x, a.y, a.r); return; }
    const d = dist(a, m) || 1, sp = 720 * dt;
    a.fx = (m.x - a.x) / d; a.fy = (m.y - a.y) / d; D.z = 11 * clamp((d - m.r) / D.d0, 0, 1);
    if (d > sp + m.r) { a.x += a.fx * sp; a.y += a.fy * sp; return; }
    a.x = m.x - a.fx * m.r; a.y = m.y - a.fy * m.r; a.swing = 0.2; D.up = 0.35; D.z = 0;
    api.hit(a, m, api.heroPower(w.hero) * 4, { kind: 'phys', color: '#63c74d', stun: m.boss ? 0.3 : 0.8 });
    [a.x, a.y] = api.freeSpot(a.x, a.y, a.r);
    if (A.FX) { A.FX.shake(0.1); A.FX.burst(a.x, a.y - 6, 10, { color: ['#63c74d', '#e43b44', '#fee761'], smin: 30, smax: 120, life: 0.5, z: 4, vz: 60, g: 200, size: 1 }); }
  }
  // Gacker: legt im Kampf Eier, daraus schlüpfen Küken (oder Gold)
  function hen(a, dt, w) {
    if (!fight(w) || (a.eggT = (a.eggT == null ? 3 : a.eggT) - dt) > 0) return;
    a.eggT = 6; a.eggN = (a.eggN || 0) + 1;
    const gold = T('gacker', 5) && a.eggN % 4 === 0;
    add({ kind: 'egg', x: a.x - a.fx * 8, y: a.y + 4, t0: w.t, at: w.t + 1.4, gold });
    api.float(a.x, a.y - 28, L('Gack!', 'Cluck!'), '#fee761', 12);
    if (A.Sound.cluck) A.Sound.cluck();
  }
  function hatch(o, w) {
    const h = w.hero; o.done = true;
    if (A.FX) A.FX.burst(o.x, o.y - 4, 8, { color: o.gold ? ['#fee761', '#feae34', '#ffffff'] : ['#ffffff', '#c0cbdc', '#fee761'], smin: 30, smax: 100, life: 0.4, z: 4, vz: 90, g: 400, size: 1 });
    if (o.gold) {
      const val = Math.max(2, Math.round(2 + w.floor * 0.8));
      for (let i = 0; i < 6; i++) api.drop({ kind: 'gold', val }, o.x, o.y, 70 + Math.random() * 90);
      api.float(o.x, o.y - 30, L('Goldenes Ei!', 'Golden egg!'), '#fee761', 15);
      if (A.Sound.coin) A.Sound.coin();
      return;
    }
    const n = T('gacker', 3) ? 2 : 1;
    for (let i = 0; i < n; i++) {
      const k = api.mkAlly(h, 0.14 * dmgMul('gacker'), w.t + 9, false);
      k.kid = true; k.r = 6; k.col = '#fee761'; k.rate = 0.45; k.spd = 1.45; k.spawn = 0.15;
      [k.x, k.y] = api.freeSpot(o.x + (i ? 10 : -10), o.y, k.r);
      k.mag = k.atk = Math.max(1, Math.round(api.heroPower(h) * k.pow));
      w.allies.push(k);
    }
    api.float(o.x, o.y - 24, L('Piep!', 'Peep!'), '#fee761', 12);
  }

  // ---------- Jedes Bild ----------
  // Tiere, die dabei sind, als Helfer in der Welt halten; Eier, Zungen und Schreie laufen lassen
  function tick(dt) {
    const w = W(); if (!w || !w.hero) return; const h = w.hero, want = withMe();
    if (w.petNews && w.petNews.length && A.FX && !A.FX.banners.length) { const [a, b, c] = w.petNews.shift(); A.FX.banner(a, b, c, 2.8); }
    for (const a of w.allies) if (a.pet && !a.gone && !want.includes(a.pet)) { a.gone = true; api.fx('appear', { m: a }); }
    want.forEach((id, i) => {
      let a = w.allies.find(x => x.pet === id && !x.gone);
      if (!a) {
        const Pt = P(id); if (!Pt) return;
        a = api.mkAlly(h, Pt.pow, 0, false);
        Object.assign(a, { pet: id, col: Pt.col, rate: Pt.rate, spd: Pt.spd, r: 10, fly: !!Pt.fly });
        [a.x, a.y] = api.freeSpot(h.x - h.fx * 26 + (i ? 22 : -22), h.y + 14, a.r);
        w.allies.push(a);
      }
      a.pow = P(id).pow * dmgMul(id); a.mag = a.atk = Math.max(1, Math.round(api.heroPower(h) * a.pow));
      if (id === 'gacker') hen(a, dt, w);
    });
    if (!w.petfx || !w.petfx.length) return;
    for (const o of w.petfx) {
      if (o.kind === 'egg') { if (w.t >= o.at) hatch(o, w); }
      else if (o.kind === 'tongue') {
        if (w.t > o.until) { o.done = true; continue; }
        const m = o.m, a = o.a, d = dist(a, m) || 1;
        if (m.alive && d > a.r + m.r + 6 && w.t > o.t0 + 0.08) api.moveEnt(m, (a.x - m.x) / d * 900 * dt, (a.y - m.y) / d * 900 * dt);
      }
      else if (w.t > o.until) o.done = true;
    }
    w.petfx = w.petfx.filter(o => !o.done);
  }

  // ---------- Zeichnen im Retro-Look ----------
  const ell = (c, x, y, r, fill) => { c.beginPath(); c.ellipse(Math.round(x), Math.round(y), Math.max(1, r), Math.max(1, r * EY), 0, 0, TAU); if (fill) c.fill(); else c.stroke(); };
  function drawAlly(dr, a, cx, cy) {
    if (!a.pet && !a.kid) return false;
    const w = W(), b = dr.b, t = dr.t, flip = a.fx < 0, x = a.x / PX - cx, y = a.y / PX - cy + 7;
    let alpha = a.spawn > 0 ? clamp(1 - a.spawn / 0.35, 0, 1) : 1;
    if (a.kid) {   // Küken: blinkt, bevor es verschwindet
      if (w && a.until - w.t < 1.5 && Math.floor(t * 14) % 2) alpha *= 0.4;
      const s = A.Art.sprite('pet_chick', a.moving ? Math.floor(t * 12) % 2 : 0), hop = a.moving ? Math.abs(Math.sin(t * 14 + a.x)) * 2 : 0;
      dr.shadow(x, y, 3); dr.blit(s, x, y - hop, flip, { alpha });
      return true;
    }
    if (a.pet === 'moppel' && a.under) {   // unter der Erde: nur ein wandernder Erdhügel, ohne Schatten
      dr.blit(A.Art.sprite('pet_molehill'), x + (a.moving ? Math.round(Math.sin(t * 18)) : 0), y, false, { alpha });
      return true;
    }
    const Pt = P(a.pet), fl = a.pet === 'huhu' || a.pet === 'pfeffer'; let name = Pt.spr, frame = 0, z = (a.z || 0) / PX, sc = 1;
    const ox = a.swing > 0 ? a.fx * Math.sin((1 - a.swing / 0.2) * Math.PI) * 3 : 0;
    if (a.pet === 'huhu') { frame = Math.floor(t * 7) % 2; z += a.swing > 0 ? 3 : 11 + Math.sin(t * 3 + a.x * 0.01) * 2; }
    else if (a.pet === 'pfeffer') { frame = Math.floor(t * 7) % 2; z += a.dive ? a.dive.z : a.swing > 0 ? 8 : 11 + Math.sin(t * 3 + a.x * 0.01) * 2; }
    else if (a.pet === 'lotte') {   // Kopf gesenkt beim Anlauf und Rammen, dabei staubt es
      frame = a.ram ? 1 : 0; if (a.moving && !a.ram) z += Math.abs(Math.sin(t * 10 + a.x * 0.01)) * 2;
      if (a.ram && a.ram.wind <= 0 && A.FX && !A.FX.low && Math.random() < 0.4) A.FX.smoke(a.x - a.fx * 10, a.y + 6, 1, '#c0cbdc', 3);
    }
    else if (a.pet === 'stachel' && a.roll) { name = 'pet_hogball'; frame = Math.floor(t * 14) % 2; if (a.roll.big) sc = 2; }
    else if (a.pet === 'brunhilde') { frame = a.leap ? 1 : 0; if (a.moving && !a.leap) z += Math.abs(Math.sin(t * 7 + a.x * 0.01)) * 4; }
    else if (a.pet === 'glut') frame = Math.floor(t * (a.moving ? 8 : 3)) % 2;
    else frame = a.moving ? Math.floor(t * (a.pet === 'flitz' ? 14 : 9)) % 2 : 0;
    const spr = A.Art.sprite(name, frame);
    dr.shadow(x, y, (fl ? 4 : 6) * sc);
    dr.outlineGlow(spr, x + ox, y - z, flip, Pt.col, sc);
    dr.blit(spr, x + ox, y - z, flip, { alpha, sx: sc, sy: sc });
    // Treue 5: ein kleiner Stern funkelt über dem Tier
    if (T(a.pet, 5) && Math.sin(t * 2 + a.x * 0.01) > 0.6) { const g = dr.g; g.globalAlpha = 0.8; g.fillStyle = '#fee761'; const sx = Math.round(x + ox), sy = Math.round(y - z - spr.h * sc - 3); g.fillRect(sx - 1, sy, 3, 1); g.fillRect(sx, sy - 1, 1, 3); g.globalAlpha = 1; }
    return true;
  }
  function drawGround(dr, w, cx, cy) {
    const list = w.petfx; if (!list || !list.length) return;
    const b = dr.b, g = dr.g, t = dr.t;
    for (const o of list) {
      if (o.kind === 'egg') {
        const x = o.x / PX - cx, y = o.y / PX - cy, k = clamp((w.t - o.t0) / (o.at - o.t0), 0, 1), wob = k > 0.6 ? Math.round(Math.sin(t * 40) * (k - 0.6) * 4) : 0;
        const s = o.gold ? A.Art.sprite('pet_egg', 0, { '5': '#be4a2f', '6': '#fee761' }, 'gold') : A.Art.sprite('pet_egg');
        dr.shadow(x, y, 3); b.drawImage(s.img, Math.round(x - s.w / 2 + wob), Math.round(y - s.h));
        if (o.gold) { g.globalAlpha = 0.5 + Math.sin(t * 8) * 0.3; g.fillStyle = '#ffffff'; g.fillRect(Math.round(x + 1), Math.round(y - s.h + 2), 1, 1); g.globalAlpha = 1; }
      } else if (o.kind === 'tongue') {
        const a = o.a, m = o.m, k = clamp((w.t - o.t0) / 0.1, 0, 1) * clamp((o.until - w.t) / 0.12, 0, 1);
        const x0 = a.x / PX - cx + a.fx * 4, y0 = a.y / PX - cy + 1, x1 = x0 + (m.x / PX - cx - x0) * k, y1 = y0 + (m.y / PX - cy - 4 - y0) * k;
        b.strokeStyle = '#181425'; b.lineWidth = 3; b.beginPath(); b.moveTo(Math.round(x0), Math.round(y0)); b.lineTo(Math.round(x1), Math.round(y1)); b.stroke();
        b.strokeStyle = '#f6757a'; b.lineWidth = 1; b.beginPath(); b.moveTo(Math.round(x0), Math.round(y0)); b.lineTo(Math.round(x1), Math.round(y1)); b.stroke();
        b.fillStyle = '#e43b44'; b.fillRect(Math.round(x1) - 1, Math.round(y1) - 1, 3, 3);
      } else if (o.kind === 'ring') {
        const k = clamp((w.t - o.t0) / (o.until - o.t0), 0, 1), x = o.x / PX - cx, y = o.y / PX - cy + 6;
        g.globalAlpha = 0.7 * (1 - k); g.strokeStyle = o.col; g.lineWidth = 2; ell(g, x, y, o.r / PX * (0.2 + 0.8 * k));
        g.globalAlpha = 0.4 * (1 - k); g.lineWidth = 1; ell(g, x, y, o.r / PX * (0.1 + 0.7 * k)); g.globalAlpha = 1;
      }
    }
    b.lineWidth = 1;
  }
  // Käfig: rüttelt ab und zu, im Dunkeln blinzeln zwei Augen; offen ist er leer und grau
  function drawCage(dr, p, near, x, y) {
    const b = dr.b, g = dr.g, t = dr.t;
    const spr = p.used ? A.Art.sprite('cage', 0, { y: '#5a6988', Y: '#8b9bb4' }, 'open') : A.Art.sprite('cage');
    let wob = 0;
    if (!p.used) { const c = (t + p.x * 0.013) % 2.6; if (c < 0.35) wob = Math.round(Math.sin(c * 50) * 1.5); if (near) wob = Math.round(Math.sin(t * 20)); }
    const left = Math.round(x + wob - spr.w / 2), top = Math.round(y + 5 - spr.h);
    dr.shadow(x, y + 4, 10);
    if (near && !p.used) dr.outlineGlow(spr, x + wob, y + 5, false, '#fee761');
    b.globalAlpha = p.used ? 0.75 : 1; b.drawImage(spr.img, left, top); b.globalAlpha = 1;
    if (!p.used && Math.sin(t * 1.7 + p.x) > -0.85) { g.fillStyle = '#fee761'; g.fillRect(left + 8, top + 6, 1, 1); g.fillRect(left + 12, top + 6, 1, 1); }
    if (!p.used && A.FX && !A.FX.low && Math.random() < 0.03) A.FX.part({ x: p.x + (Math.random() - 0.5) * 30, y: p.y + 6, z: 20, vx: 0, vy: 0, vz: 0, g: 160, life: 0.5, color: '#feae34', size: 1 });   // Stroh rieselt
    return top;
  }
  function lights(w, Lt) {
    for (const o of w.petfx || []) {
      if (o.kind === 'egg' && o.gold) Lt(o.x, o.y - 6, 22, '#fee761', 0.55);
      else if (o.kind === 'ring') Lt(o.x, o.y, o.r / PX * 0.8, o.col, 0.35 * clamp((o.until - w.t) / 0.6, 0, 1));
    }
    for (const r of w.rooms) for (const p of r.props) if (p.kind === 'cage' && !p.hidden && !p.used) Lt(p.x, p.y - 8, 26, '#fee761', 0.35 + Math.sin(w.t * 2) * 0.08);
  }

  // ---------- Texte für die Oberfläche ----------
  function name(id) { return A.t(P(id).name); }
  function tricks(id) { const Pt = P(id); return [{ lv: 1, text: A.t(Pt.text) }, { lv: 3, text: A.t(Pt.t3) }, { lv: 5, text: A.t(Pt.t5) }]; }

  return { bind, found, treue, progress, count, slots, startN, dmgMul, sel, choose, startPets, away, inRun, tripOf, busy, canSend, send, claim, tripsBack, cageRoom, cageOnFloor, reveal, cagePick, free, join, gain, onKill, step, tick, owlSees, drawAlly, drawGround, drawCage, lights, name, tricks, withMe };
})();
