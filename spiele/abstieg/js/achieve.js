// Der Abstieg – Auftragsbrett und Chronik: 30 Erfolge über alle Durchläufe (Liste A.ACHIEVEMENTS in data.js) mit ihren Zählern,
// Einblendung im Dungeon, und die Chronik der letzten Durchläufe samt Zahlen fürs ganze Spielerleben.
// Dauerhaft in meta.stats (Zähler), meta.ach (erreichte Erfolge mit Zeit), meta.achNew (noch nicht im Lager angeschaut), meta.chron (Durchläufe).
'use strict';
window.A = window.A || {};

A.Achieve = (function () {
  const G = () => A.Game;
  const L = (d, e) => (A.LANG === 'de' ? d : e);
  let ui = { overlayOpen: () => false };
  const news = [];   // erreichte Erfolge, die im Dungeon noch eingeblendet werden (sobald keine andere Einblendung läuft)
  let acc = 0;
  const stats = () => { const m = G().meta; return m.stats || (m.stats = {}); };
  function add(key, n) { const s = stats(); s[key] = (s[key] || 0) + (n == null ? 1 : n); }
  function most(key, v) { const s = stats(); if (v > (s[key] || 0)) s[key] = v; }

  // ---------- Zähler ----------
  // Alles, wogegen die Erfolge geprüft werden; die laufende Ebene zählt schon, nicht erst am Ende des Durchlaufs
  function values() {
    const Gm = G(), m = Gm.meta, s = m.stats || {}, r = Gm.run;
    return {
      best: Math.max(m.best || 0, r ? r.floor : 0), won: m.won || 0, kills: m.totalKills || 0,
      bosses: s.bosses || 0, pennants: Object.keys(A.BANNERS).filter(id => (m.troph[id] || 0) > 0).length,
      elites: s.elites || 0, cleanRooms: s.cleanRooms || 0, cleanBoss: s.cleanBoss || 0, cleanFloors: s.cleanFloors || 0,
      secrets: s.secrets || 0, legs: Gm.legCount(), wild: Object.keys(A.LEGENDS).filter(id => A.LEGENDS[id].src === 'wild' && (m.legFound[id] || 0) > 0).length,
      combos: Gm.comboCount(), bookPages: Gm.bookPages(), gold: s.gold || 0, goldRun: s.goldRun || 0, campRank: Gm.campRank(),
      cls5: A.CLASSES.filter(c => ((s.clsBest || {})[c.id] || 0) >= 5).length, races: A.RACES.filter(x => ((s.raceRuns || {})[x.id] || 0) > 0).length,
      pets: A.Pets.count(), treue5: Object.keys(A.PETS).filter(id => A.Pets.found(id) && A.Pets.treue(id) >= 5).length,
      death1: s.death1 || 0, nearDeath: s.nearDeath || 0,
      // Hauptleute und Reaktionen (foes.js): besiegte Hauptleute, verschiedene Hauptleute, fliehende Gegner erwischt
      captains: s.captains || 0, captKinds: A.Foes.count(), fleeKills: s.fleeKills || 0,
      // Dein Build (build.js): meiste Teile eines Elements, Kombos im laufenden Durchlauf, tiefste Ebene mit starkem Build
      elMax: r ? Math.max(0, ...Object.values(A.Gear.counts(r))) : 0, runCombos: r ? (r.combos || []).length : 0, buildBest: s.buildBest || 0,
      // Überraschungen (surprise.js): zerschlagene Krüge, besiegte Mimiks, erwischte Goldwichte
      pots: s.pots || 0, mimics: s.mimics || 0, gwicht: s.gwicht || 0,
    };
  }
  const done = (id) => !!(G().meta.ach || {})[id];
  const count = () => A.ACHIEVEMENTS.filter(a => done(a.id)).length;
  function progress(a, v) { v = v || values(); return [Math.min(a.n, v[a.stat] || 0), a.n]; }   // [ist, soll]

  // Prüfen: neu erreichte Erfolge gutschreiben (Seelenfunken sofort), merken und zum Einblenden vormerken
  // quiet (Titel, Lager): nur dem Lager gutschreiben, keine Einblendung und nichts dem laufenden Durchlauf anrechnen
  function check(quiet) {
    const Gm = G(), m = Gm.meta, v = values(), out = [];
    m.ach = m.ach || {};
    for (const a of A.ACHIEVEMENTS) if (!m.ach[a.id] && (v[a.stat] || 0) >= a.n) { m.ach[a.id] = Date.now(); m.sparks += a.sparks; out.push(a); }
    if (!out.length) return out;
    m.achNew = (m.achNew || []).concat(out.map(a => a.id));
    const r = Gm.run;
    if (r && !quiet) { r.achSparks = (r.achSparks || 0) + out.reduce((s, a) => s + a.sparks, 0); r.achIds = (r.achIds || []).concat(out.map(a => a.id)); if (!r.over) { news.push(...out); Gm.save(); } }
    Gm.saveMeta();
    return out;
  }
  // Jeden Frame aus der Oberfläche (nur im Dungeon): Spielzeit, Gold-Zähler, alle halbe Sekunde prüfen, Einblendung sobald frei
  function tick(dt, paused) {
    const Gm = G(), r = Gm.run; if (!r || r.over) return;
    if (!paused) r.playT = (r.playT || 0) + dt;
    if (r.goldSeen == null) r.goldSeen = r.gold;
    if (r.gold > r.goldSeen) add('gold', r.gold - r.goldSeen);
    r.goldSeen = r.gold; most('goldRun', r.gold);
    if ((acc += dt) >= 0.5) { acc = 0; if (A.Build.strong(A.Build.profile(r))) most('buildBest', r.floor); check(); }
    if (news.length && !paused && A.FX && !A.FX.banners.length && !ui.overlayOpen()) {
      const a = news.shift();
      A.FX.banner(L('Erfolg: ', 'Achievement: ') + A.t(a.name), `${A.t(a.text)} · +${a.sparks} ${A.t(A.UI.meta)}`, '#fee761', 3.2);
      if (A.Sound.level) A.Sound.level();
    }
  }
  function clearNew() { const m = G().meta; if (m.achNew && m.achNew.length) { m.achNew = []; G().saveMeta(); } }

  // ---------- Haken aus game.js und world.js ----------
  function onRun(r) {
    const s = stats(); s.raceRuns = s.raceRuns || {}; s.clsRuns = s.clsRuns || {}; s.clsBest = s.clsBest || {};
    s.raceRuns[r.race] = (s.raceRuns[r.race] || 0) + 1; s.clsRuns[r.cls] = (s.clsRuns[r.cls] || 0) + 1; s.clsBest[r.cls] = Math.max(s.clsBest[r.cls] || 0, 1);
    r.achSparks = 0; r.achIds = []; r.floorDmg = 0; r.goldSeen = r.gold; r.playT = 0; news.length = 0;
  }
  // Ebene verlassen (vor dem Abstieg): ganze Ebene ohne Schaden? (ab Ebene 3 und nur, wenn wirklich gekämpft wurde)
  function onFloorDone(r) { if ((r.floorDmg || 0) === 0 && r.floor >= 3 && (r.floorKills || 0) >= 5) add('cleanFloors'); }
  function onFloor(r) { r.floorDmg = 0; const s = stats(); s.clsBest = s.clsBest || {}; s.clsBest[r.cls] = Math.max(s.clsBest[r.cls] || 0, r.floor); }
  function onKill(e) { if (e.boss) add('bosses'); else if (e.elite) add('elites'); }
  function onRoom(room, st) {
    if (!st) return;
    if (st.dmgRoom === 0) { add('cleanRooms'); if (room.type === 'boss') add('cleanBoss'); }
    if (st.low) { st.low = false; add('nearDeath'); }
    G().saveMeta();
  }
  // Der Held wurde getroffen: Schaden auf dieser Ebene, fast tot?, und wer es war (für die Chronik)
  function onHurt(h, from, dmg, st) {
    const r = G().run; if (r) r.floorDmg = (r.floorDmg || 0) + dmg;
    if (st && h.alive && h.hp > 0 && h.hp < h.maxHp * 0.05) st.low = true;
    h.lastFrom = from ? { mid: from.mid || null, boss: !!from.boss, elite: !!(from.elite || from.traits), cap: from.captain || null, kind: from.side === 'enemy' ? 'mon' : (from.side || 'mon') } : null;
  }
  function onDeath(h) { const r = G().run; if (r) r.deathBy = h.lastFrom || null; }
  function onSecret() { add('secrets'); G().saveMeta(); }
  // Ende eines Durchlaufs (Tod oder aufgegeben): Spielzeit, Anfängerpech, letzte Prüfung
  function onEnd(r, quit) {
    if (!quit && r.floor === 1 && !r.won) add('death1');
    add('time', Math.round(r.playT || 0));
    news.length = 0;
    check();
  }
  // Eintrag in die Chronik (neueste zuerst, höchstens A.ACH_CHRON)
  function record(r, quit) {
    const m = G().meta;
    const e = { t: Date.now(), race: r.race, cls: r.cls, floor: r.floor, level: r.level, kills: r.kills, gold: r.gold, won: !!r.won, by: quit ? null : (r.deathBy || null), quit: !!quit,
      sparks: quit ? 0 : (r.sparksEarned || 0), dur: Math.round(r.playT || 0), pets: (r.pets || []).slice(0, 2), ach: (r.achIds || []).slice(), bd: A.Build.ids(A.Build.profile(r)) };
    if (A.gradeOf(r)) e.grade = A.gradeOf(r);   // Grad und Heimkehren (v39); fehlt bei älteren Einträgen
    if (r.home && !quit) { e.home = r.home; e.by = null; }
    m.chron = m.chron || []; m.chron.unshift(e); if (m.chron.length > A.ACH_CHRON) m.chron.length = A.ACH_CHRON;
    return e;
  }

  // ---------- Chronik ----------
  function chron() { return (G().meta.chron || []).slice(); }
  // Zahlen fürs ganze Spielerleben
  function life() {
    const m = G().meta, s = m.stats || {}, runs = s.clsRuns || {};
    const fav = A.CLASSES.map(c => [c, runs[c.id] || 0]).sort((a, b) => b[1] - a[1])[0];
    return { runs: m.runs || 0, won: m.won || 0, best: m.best || 0, kills: m.totalKills || 0, bosses: s.bosses || 0, elites: s.elites || 0, gold: s.gold || 0, time: s.time || 0, secrets: s.secrets || 0, fav: fav && fav[1] ? fav[0] : null, ach: count(), achMax: A.ACHIEVEMENTS.length };
  }
  // Woran ein Durchlauf endete, als Satz
  function causeText(e) {
    if (e.quit) return L('aufgegeben', 'abandoned');
    if (e.home === 'exit') return L('durch den Ausgang heimgekehrt', 'went home through the exit');
    if (e.home) return L('heimgekehrt', 'went home');
    const by = e.by;
    if (by && by.kind === 'burn') return L('in Flammen aufgegangen', 'went up in flames');
    if (by && by.kind === 'poison') return L('am Gift gestorben', 'died of poison');
    if (by && by.kind === 'rock') return L('vom Steinschlag erwischt', 'hit by falling rocks');
    if (by && by.kind === 'lava') return L('vom Vulkan geröstet', 'roasted by the volcano');
    if (by && by.kind === 'pot') return L('von einem Knallkrug zerlegt', 'blown up by a jar');
    const B = by && by.mid && A.BOSSES[by.mid], M = by && by.mid && A.MONSTERS.find(x => x.id === by.mid);
    const name = by && by.cap ? A.Foes.nameOf(by.cap) : B ? A.t(B.name) : M ? (by.elite ? A.t(A.UI.elitePrefix) + '-' : '') + A.t(M.name) : null;
    return name ? L(`${name} hat dich erwischt`, `caught by ${name}`) : L('gefallen', 'fallen');
  }
  function timeText(sec) {
    sec = Math.round(sec || 0);
    if (sec < 60) return L('unter 1 min', 'under 1 min');
    const m = Math.round(sec / 60), h = Math.floor(m / 60), mi = m % 60;
    return h ? `${h} h ${mi} min` : `${mi} min`;
  }
  // Wann: heute als Uhrzeit, sonst Datum
  function whenText(t) {
    const d = new Date(t), now = new Date(), two = (n) => (n < 10 ? '0' : '') + n;
    if (d.toDateString() === now.toDateString()) return L('heute ', 'today ') + two(d.getHours()) + ':' + two(d.getMinutes());
    const y = new Date(now); y.setDate(now.getDate() - 1);
    if (d.toDateString() === y.toDateString()) return L('gestern', 'yesterday');
    return A.LANG === 'de' ? `${d.getDate()}.${d.getMonth() + 1}.` : `${d.getMonth() + 1}/${d.getDate()}`;
  }

  function bind(api) { ui = Object.assign(ui, api); }
  return { bind, add, values, check, tick, progress, done, count, clearNew, news, onRun, onFloorDone, onFloor, onKill, onRoom, onHurt, onDeath, onSecret, onEnd, record, chron, life, causeText, timeText, whenText };
})();
