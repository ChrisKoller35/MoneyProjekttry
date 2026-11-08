// Der Abstieg – Zuschauer und Gönner (v42): Der Abstieg ist eine Show.
// - Spektakel füllt das Auge oben im Bild (run.hype bis A.HYPE_MAX): mehrere Gegner kurz nacheinander, Elite, Hauptmann, Boss,
//   ein Raum ohne Kratzer, knapp überlebt, Goldwicht erwischt, Mimik gezähmt (Werte A.HYPE in data.js).
// - Ist es voll, kracht nach dem Kampf eine Kiste von oben herunter (Beute am Boden, kind 'crate', bleibt beim Schliessen liegen).
//   Drin: ein Zettel von einem Gönner (A.SPONSORS) und sein Geschenk. Jede Kiste bringt einen Fan (meta.fans, für immer);
//   bei bestimmten Fan-Zahlen stellt sich ein neuer Gönner vor.
// world.js ruft onKill, onRoom (über game.js roomCleared), step und meldet eine aufgehobene Kiste an ui.js (hooks.onCrate) → open.
// Auge und Wahl des Gönners ziehen keine Zahlen aus run.rng (nur ein Geschenk mit Stück würfelt wie jeder Fund).
'use strict';
window.A = window.A || {};

A.Show = (function () {
  const L = (de, en) => (A.LANG === 'de' ? de : en);
  const G = () => A.Game;
  let api = null;   // Werkzeuge aus world.js: float, fx, drop, freeSpot, heroPower, refreshHero
  const W = () => api && api.W;
  function bind(a) { api = a; }
  const run = () => G() && G().run;
  const live = (r) => !!(r && !r.over);

  // ---------- Gönner ----------
  const fans = () => Math.max(0, Math.floor(+(G().meta.fans) || 0));
  const open_ = (S) => fans() >= (S.fans || 0);
  const sponsors = () => A.SPONSORS.filter(open_);
  // Wer schickt diese Kiste? Fest aus Startwert, Kisten-Zahl und Ebene (nie zweimal derselbe hintereinander, wenn es mehr gibt)
  function pickSponsor(r) {
    const list = sponsors(); if (!list.length) return A.SPONSORS[0];
    const pat = A.patronOf(r), P = pat && list.find(s => s.id === pat); if (P) return P;   // Gönner dieses Laufs (v43) schickt alle Kisten
    let k = (((r.seed >>> 0) ^ Math.imul((r.crates || 0) + 1, 0x9e3779b1) ^ Math.imul(r.floor, 7919)) >>> 0) % list.length;
    if (list.length > 1 && list[k].id === r.lastSp) k = (k + 1) % list.length;
    return list[k];
  }

  // ---------- Spektakel ----------
  // n Punkte fürs Auge; text schwebt über dem Helden («Dreifach! +10»)
  // Show-Texte über dem Helden: was im selben Augenblick kommt, steht übereinander statt aufeinander
  function sfloat(text, col, size) {
    const w = W(), h = w && w.hero; if (!h || !api) return;
    const s = w.show || (w.show = {}); s.ft = (s.ft || []).filter(t => w.t - t >= 0 && w.t - t < 0.7);
    api.float(h.x, h.y - 92 - 18 * s.ft.length, text, col, size); s.ft.push(w.t);
  }
  function hype(n, text) {
    const r = run(), w = W(); if (!live(r) || !w || !(n > 0)) return;
    n = Math.round(n * (1 + A.patronVal('hype', r)));   // Kistenregen (v43)
    r.hype = Math.min(A.HYPE_MAX, (r.hype || 0) + n);
    r.hypeTot = (r.hypeTot || 0) + n;
    if (text) sfloat(text + ' +' + n, '#2ce8f5', 13);
    if (r.hype >= A.HYPE_MAX && !r.crateDue) { r.crateDue = true; sfloat(L('Die Zuschauer toben!', 'The crowd goes wild!'), '#fee761', 16); if (A.Sound.level) A.Sound.level(); }
  }
  // Gegner besiegt (world.js checkDeath): Mehrfach-Kills (eine Serie ohne lange Pause; 3, 5 und 8 zählen je Serie einmal), Elite, Hauptmann, Boss, Goldwicht, Mimik; Knall-Ladung des Barons
  function onKill(e) {
    const r = run(), w = W(); if (!live(r) || !w || !e || e.side !== 'enemy') return;
    const s = w.show || (w.show = {});
    s.n = s.last != null && w.t - s.last <= A.HYPE_MULTI_T ? (s.n || 0) + 1 : 1; s.last = w.t;   // Serie: reisst ab, wenn eine Pause länger ist
    const n = s.n, H = A.HYPE;
    if (n === 3) { hype(H.multi3, L('Dreifach!', 'Triple!')); G().questEvent('triple'); }
    else if (n === 5) hype(H.multi5, L('Gemetzel!', 'Carnage!'));
    else if (n === 8) hype(H.multi8, L('Wahnsinn!', 'Madness!'));
    if (e.boss) r.bossKills = (r.bossKills || 0) + 1;   // für den Tageswunsch (v43)
    if (e.boss) hype(H.boss, L('Boss!', 'Boss!'));
    else if (e.captain) hype(H.captain, L('Hauptmann!', 'Captain!'));
    else if (e.elite) hype(H.elite, L('Elite!', 'Elite!'));
    if (e.gw) hype(H.goldimp, L('Erwischt!', 'Caught!'));
    if (e.mimicOf) hype(H.mimic, L('Gezähmt!', 'Tamed!'));
    // Baron von Knall: die nächsten Besiegten gehen hoch (wie das Talent Kettenreaktion)
    if ((r.knall || 0) > 0 && !e.boss && w.hero && w.hero.alive) {
      r.knall--; w.marks.push({ kind: 'boom', x: e.x, y: e.y, r: 78, at: w.t + 0.15, dmg: api.heroPower(w.hero) * 0.6, col: '#f77622', opts: { kette: true } });
      if (!r.knall) sfloat(L('Knall-Ladung leer', 'Bang charge empty'), '#f77622', 13);
    }
    // Feuerwerk (v43, Baron von Knall als Gönner): jeder n-te Besiegte geht hoch
    else if (A.patronVal('boom', r) > 0 && !e.boss && w.hero && w.hero.alive) {
      r.patKills = (r.patKills || 0) + 1;
      if (r.patKills % A.patronVal('boom', r) === 0) w.marks.push({ kind: 'boom', x: e.x, y: e.y, r: 78, at: w.t + 0.15, dmg: api.heroPower(w.hero) * 0.6, col: '#f77622', opts: { kette: true } });
    }
  }
  // Raum gesäubert (game.js roomCleared, bevor das Auftragsbrett die Werte zurücksetzt)
  function onRoom(room, st) {
    if (!st || !room || !['fight', 'elite', 'boss'].includes(room.type)) return;
    const H = A.HYPE;
    if (st.dmgRoom === 0) { if (room.type === 'boss') hype(H.bossClean, L('Ohne Kratzer!', 'Not a scratch!')); else hype(H.clean, L('Sauber!', 'Clean!')); }
    if (st.low) hype(H.close, L('Knapp!', 'Close call!'));
  }

  // ---------- Die Kiste ----------
  // Jedes Bild (world.js step): ist das Auge voll und kein Kampf, kracht die Kiste neben dem Helden herunter
  function step() {
    const r = run(), w = W(); if (!live(r) || !w || !w.hero || !w.hero.alive || w.paused) return;
    if (r.crateDue && !w.active && !w.picks.some(p => p.kind === 'crate')) {
      const S = pickSponsor(r), h = w.hero;
      const [x, y] = api.freeSpot(h.x + (h.fx >= 0 ? 44 : -44), h.y - 8, 15);
      w.picks.push({ kind: 'crate', sp: S.id, x, y, vx: 0, vy: 0, z: 420, vz: -60, t: 0 });
      r.crateDue = false; r.hype = 0; r.lastSp = S.id; G().save();
      sfloat(L(`Eine Kiste ${A.t(S.von)}!`, `A crate ${A.t(S.von)}!`), '#fee761', 15);
    }
    for (const p of w.picks) if (p.kind === 'crate' && !p.landed && p.z <= 0 && p.t > 0.1) {   // gelandet: Staub und Wackeln
      p.landed = true;
      if (A.FX) { A.FX.shake(0.35); A.FX.smoke(p.x, p.y - 4, 12, '#8b9bb4', 6); A.FX.part({ kind: 'ring', x: p.x, y: p.y, life: 0.4, size: 70, color: '#c0cbdc', add: false }); }
      if (A.Sound.thud) A.Sound.thud(); else if (A.Sound.open) A.Sound.open();
    }
  }
  // Aufgehoben (ui.js): Zettel lesen, Geschenk bekommen, Fan dazu. Gibt zurück, was das Fenster zeigt.
  function open(p) {
    const r = run(), w = W(), m = G().meta; if (!r || !p) return null;
    const S = A.SPONSORS.find(s => s.id === p.sp) || A.SPONSORS[0], h = w && w.hero;
    r.crates = (r.crates || 0) + 1;
    const before = sponsors().map(s => s.id);
    m.fans = fans() + 1;
    const fresh = sponsors().filter(s => !before.includes(s.id));
    let got = '';
    const x = p.x, y = p.y;
    switch (S.gift) {
      case 'pots': r.potions += 2; got = L('+2 Tränke', '+2 potions'); break;
      case 'gold': { const g = 30 + 12 * r.floor; for (let i = 0; i < 6; i++) api.drop({ kind: 'gold', val: Math.ceil(g / 6) }, x, y, 70 + i * 12); got = L(`${g} Gold`, `${g} gold`); break; }
      case 'knall': r.knall = (r.knall || 0) + A.SPONSOR_KNALL; got = L(`Die nächsten ${A.SPONSOR_KNALL} Besiegten explodieren`, `The next ${A.SPONSOR_KNALL} you defeat explode`); break;
      case 'item': { const ord = ['common', 'good', 'rare', 'epic', 'legendary'], min = (S.tier || 1) >= 2 ? 'rare' : 'good'; let rar = G().rollRarity(S.tier || 1); if (!ord.includes(rar)) rar = min; if (ord.indexOf(rar) < ord.indexOf(min)) rar = min;   // ein Geschenk ist nie gewöhnlich und nie verflucht
        const it = G().randomItem(rar); api.drop({ kind: 'item', it }, x, y, 40); got = L('ein Stück', 'an item'); break; }
      case 'rage': r.rageFloor = r.floor; if (api.refreshHero) api.refreshHero(); got = L(`+${Math.round(A.SPONSOR_RAGE * 100)} % Schaden auf dieser und der nächsten Ebene`, `+${Math.round(A.SPONSOR_RAGE * 100)}% damage on this floor and the next`); break;
      case 'heal': if (h) { h.hp = h.maxHp; r.hp = h.hp; } for (let i = 0; i < 8; i++) api.drop({ kind: 'candy' }, x, y, 60 + i * 10); got = L('volles Leben und Bonbons', 'full health and candy'); break;
      case 'sparks': { const n = 10 + 2 * r.floor; r.showSparks = (r.showSparks || 0) + n; got = L(`+${n} Seelenfunken am Ende`, `+${n} soul sparks at the end`); break; }
      case 'shield': if (h) { h.shield = Math.max(h.shield || 0, Math.round(h.maxHp * 0.6)); api.fx('shield', { e: h }); } got = L('Schild: 60 % deines Lebens', 'Shield: 60% of your health'); break;   // lebt auf dem Helden wie beim Schutzengel
      case 'fate': r.fatePts = (r.fatePts || 0) + 1; r.fateLater = false; if (h) api.float(h.x, h.y - 62, L('+1 Schicksalspunkt', '+1 fate point'), '#fee761', 15, 'u_star'); got = L('+1 Schicksalspunkt', '+1 fate point'); break;   // die Oberfläche holt ihn über fateOpen ab
      case 'buffet': { const g = 20 + 8 * r.floor; r.potions += 1; for (let i = 0; i < 6; i++) api.drop({ kind: 'candy' }, x, y, 60 + i * 10); for (let i = 0; i < 4; i++) api.drop({ kind: 'gold', val: Math.ceil(g / 4) }, x, y, 70 + i * 14); got = L(`+1 Trank, Bonbons und ${g} Gold`, `+1 potion, candy and ${g} gold`); break; }
      default: r.potions += 1; got = L('+1 Trank', '+1 potion');
    }
    if (A.FX && w) { A.FX.burst(x, y - 10, 18, { color: ['#c28569', '#8a4836', '#fee761'], smin: 40, smax: 160, life: 0.6, kind: 'spark', add: true }); A.FX.smoke(x, y - 6, 8, '#c0cbdc', 5); }
    G().saveMeta(); G().save();
    return { S, got, fresh, fans: m.fans };
  }

  // ---------- Anzeige ----------
  // Zuschauer: reine Show-Zahl aus Tiefe und Spektakel
  function viewers(r) { r = r || run(); if (!r) return 0; return Math.round((180 + r.floor * 140) * (1 + (r.hypeTot || 0) / 90)); }
  const fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, A.LANG === 'de' ? '’' : ',');
  return { bind, hype, onKill, onRoom, step, open, viewers, fmt, sponsors, pickSponsor, fans };
})();
