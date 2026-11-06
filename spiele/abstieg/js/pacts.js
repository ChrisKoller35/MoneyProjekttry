// Der Abstieg – Pakte (A.PACTS in data.js): ab Ebene 3 steht manchmal ein Pakt-Altar versteckt in einem Kampfraum.
// Ist der Raum gesäubert, taucht er auf; er bietet 3 Pakte an (fest aus dem Startwert der Ebene). Ein Pakt gilt bis zum Ende des Durchlaufs:
// Fluch und Lohn, dazu je Pakt +15 % Seelenfunken am Ende. Höchstens 3 Pakte je Durchlauf (run.pacts).
// game.js: mods in derived, potMul in potionPct, Funken in finishRun, Altar in newFloor (run.pact, ab lvVer 7);
// world.js: Altar in genFloor, mehr Leben und ein Gegner mehr beim Betreten, härtere Treffer in hit; boons.js: Abklingzeit
window.A = window.A || {};
A.Pacts = (function () {
  const L = (de, en) => A.LANG === 'de' ? de : en;
  const G = () => A.Game;
  const run = (r) => r || (G() && G().run);
  // unterschriebene Pakte (unbekannte Ids aus einer neueren Version werden übersprungen)
  function list(r) { r = run(r); return ((r && r.pacts) || []).filter(id => A.PACTS[id]); }
  function has(id, r) { return list(r).includes(id); }
  // Lohn: Werte wie die Segen (Game.derived)
  function mods(r) { const o = {}; for (const id of list(r)) for (const k in (A.PACTS[id].m || {})) o[k] = (o[k] || 0) + A.PACTS[id].m[k]; return o; }
  // Fluch: Summe eines Werts
  function val(k, r) { let v = 0; for (const id of list(r)) { const x = A.PACTS[id].x; if (x && x[k]) v += x[k]; } return v; }
  function potMul(r) { let m = 1; for (const id of list(r)) { const x = A.PACTS[id].x; if (x && x.potMul) m *= x.potMul; } return m; }
  const cdMul = (r) => 1 + val('cd', r);
  const hurtMul = (r) => 1 + val('hurt', r);
  // Lebens-Faktor für einen Gegner, der beim Betreten eines Raums erscheint
  function hpMul(m, r) { return 1 + val('mhp', r) + (m.boss || m.captain ? val('bossHp', r) : 0); }
  const extra = (r) => val('extra', r);
  const sparkPct = (r) => list(r).length * A.PACT_SPARKS;

  // Steht auf der neuen Ebene ein Altar? Ab Ebene 3, nicht auf Boss-Ebenen, nicht mehr, wenn alle Pakte unterschrieben sind
  function onFloor(r) {
    if (r.floor < A.PACT_FROM || A.isBossFloor(r.floor) || list(r).length >= A.PACT_MAX) return false;
    return r.rng.chance(A.PACT_CHANCE);
  }
  // In welchem Kampfraum? Fest aus dem Startwert der Ebene, möglichst nicht im Raum mit dem Käfig
  function room(rooms, seed, avoid) {
    const all = rooms.filter(x => x.type === 'fight' || x.type === 'elite'), list = all.filter(x => x !== avoid);
    const pool = list.length ? list : all; if (!pool.length) return null;
    return new A.RNG((((seed >>> 0) ^ 0x2f6b9a31) >>> 0) || 11).pick(pool);
  }
  // Die 3 Angebote des Altars dieser Ebene (ohne die schon unterschriebenen)
  function offer(r) {
    r = run(r); const free = Object.keys(A.PACTS).filter(id => !has(id, r));
    return new A.RNG((((r.floorSeed >>> 0) ^ 0x7c3ab1d5) >>> 0) || 5).shuffle(free).slice(0, 3);
  }
  function sign(id) {
    const r = run(); if (!r || !A.PACTS[id] || has(id, r) || list(r).length >= A.PACT_MAX) return false;
    r.pacts = list(r).concat(id);
    const P = A.PACTS[id]; if (P.fate) { r.fatePts = (r.fatePts || 0) + P.fate; r.fateLater = false; }
    G().save(); return true;
  }
  // Der Raum ist gesäubert: der Altar taucht auf
  function reveal(p, api) {
    api.float(p.x, p.y - 44, L('Ein Pakt-Altar!', 'A pact altar!'), '#e43b44', 16);
    if (A.FX) { A.FX.smoke(p.x, p.y - 10, 10, '#3e2731', 5); A.FX.part({ kind: 'ring', x: p.x, y: p.y - 6, life: 0.5, size: 64, color: '#e43b44', add: true }); }
    if (A.Sound.open) A.Sound.open();
  }

  // ---------- Bild ----------
  // Altar: Kerzen flackern, die Rune glüht; benutzt ist er dunkel und die Kerzen sind aus
  function draw(dr, p, near, x, y) {
    const b = dr.b, g = dr.g, t = dr.t, on = !p.used;
    const spr = A.Art.sprite('pactaltar', on ? Math.floor(t * 3 + p.x) % 2 : 2);
    const left = Math.round(x - spr.w / 2), top = Math.round(y + 5 - spr.h);
    dr.shadow(x, y + 4, 11);
    if (near && on) dr.outlineGlow(spr, x, y + 5, false, '#e43b44');
    b.globalAlpha = on ? 1 : 0.8; b.drawImage(spr.img, left, top); b.globalAlpha = 1;
    if (on) {
      g.globalAlpha = 0.55 + Math.sin(t * 3 + p.x) * 0.25; g.fillStyle = '#ff0044'; g.fillRect(left + 7, top + 10, 3, 3); g.globalAlpha = 1;
      if (A.FX && !A.FX.low && Math.random() < 0.06) A.FX.part({ kind: 'px', add: true, x: p.x + (Math.random() - 0.5) * 30, y: p.y - 4, vx: 0, vy: -20 - Math.random() * 20, life: 0.9, color: Math.random() < 0.5 ? '#e43b44' : '#68386c', drag: 0.3 });
    }
    return top;
  }
  function lights(w, Lt) {
    for (const r of w.rooms) for (const p of r.props) if (p.kind === 'pact' && !p.hidden && !p.used) Lt(p.x, p.y - 10, 34, '#e43b44', 0.4 + Math.sin(w.t * 3) * 0.08);
  }

  // ---------- Texte ----------
  const name = (id) => A.t(A.PACTS[id].name);
  const curse = (id) => A.t(A.PACTS[id].curse);
  const gift = (id) => A.t(A.PACTS[id].gift);

  return { list, has, mods, val, potMul, cdMul, hurtMul, hpMul, extra, sparkPct, onFloor, room, offer, sign, reveal, draw, lights, name, curse, gift };
})();
