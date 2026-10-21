// Der Abstieg – Vergleich: Was ändert sich am Helden, wenn er ein Stück anlegt?
// Rechnet die Heldenwerte (game.js derived) einmal wie jetzt und einmal mit dem neuen Stück am Platz, also mit Element-Boni (gear.js),
// Kräften, Trophäen und Legenden (legends.js), und fällt ein Urteil: besser, schlechter, anders (Vor- und Nachteile) oder gleich.
// Punkte sind grob «Prozent Stärke»: mehr Schaden zählt so viel wie mehr Leben, Gold und Erfahrung zählen wenig.
// ui.js zeigt das Ergebnis an; hier wird nichts verändert oder gespeichert.
'use strict';
window.A = window.A || {};

A.Compare = (function () {
  const L = (de, en) => (A.LANG === 'de' ? de : en);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lnPts = (a, b) => 100 * Math.log(Math.max(1e-6, b) / Math.max(1e-6, a));   // Unterschied in Prozent (in beide Richtungen gleich gross)
  const rate = (spd) => clamp(1.05 - spd * 0.03, 0.32, 1.05);   // Sekunden zwischen zwei Angriffen (world.js)
  const MAGIC = { weber: true, rufer: true };   // diese Klassen kämpfen mit Zauberkraft, die anderen mit Angriff (Braumeister: mit dem höheren Wert)

  // Werte, die ein Stück ändern kann. pts: Punkte aus altem und neuem Wert, w: Punkte je Einheit, pct: mit Prozentzeichen
  const ROWS = [
    { k: 'maxHp', name: () => A.t(A.UI.hp), pts: (a, b) => lnPts(a, b) },
    { k: 'atk', name: () => A.t(A.UI.derived.atk), dmg: true },
    { k: 'mag', name: () => A.t(A.UI.derived.mag), dmg: true },
    { k: 'def', name: () => A.t(A.UI.derived.def), pts: (a, b) => lnPts(1 + 0.04 * Math.max(0, a), 1 + 0.04 * Math.max(0, b)) },
    { k: 'spd', name: () => A.t(A.UI.derived.spd), pts: (a, b) => 0.5 * lnPts(1 / rate(a), 1 / rate(b)) + 0.25 * lnPts(150 + 4 * a, 150 + 4 * b) },
    { k: 'crit', name: () => A.t(A.UI.derived.crit), pct: true, pts: (a, b) => lnPts(1 + 0.75 * clamp(a, 0, 90) / 100, 1 + 0.75 * clamp(b, 0, 90) / 100) },
    { k: 'dodge', name: () => A.t(A.UI.derived.dodge), pct: true, pts: (a, b) => 100 * Math.log((1 - clamp(a, 0, 75) / 100) / (1 - clamp(b, 0, 75) / 100)) },
    { k: 'lifesteal', name: () => L('Lebensraub', 'Lifesteal'), pct: true, w: 1.2 },
    { k: 'regen', name: () => L('Erholung', 'Regeneration'), pct: true, w: 4 },
    { k: 'thorns', name: () => L('Dornen', 'Thorns'), pct: true, w: 0.12 },
    { k: 'poisonOnHit', name: () => L('Gift-Treffer', 'Poison hits'), w: 1 },
    { k: 'startShield', name: () => L('Start-Schild', 'Starting shield'), pct: true, w: 0.25 },
    { k: 'goldPct', name: () => L('Gold-Bonus', 'Gold bonus'), pct: true, w: 0.05 },
    { k: 'xpPct', name: () => L('Erfahrung', 'Experience'), pct: true, w: 0.08 },
    { k: 'luck', name: () => A.t(A.UI.stat.luck), w: 0.8 },
    { k: 'dropPct', name: () => L('Item-Chance', 'Item chance'), pct: true, w: 0.5 },
  ];
  // Element-Boni: Stufe 1 von Schatten und Stein steckt schon in den Werten (Volltreffer, Ausweichen, Leben, Rüstung)
  const elPts = (el, tier) => tier >= 3 ? 9 : tier === 2 ? 7 : el === 'schatten' || el === 'stein' ? 0 : el === 'blitz' ? 2 : 5;
  const PW_PTS = { goldmagnet: 2, glueckspilz: 3, phoenix: 10 };

  // Welche Plätze kommen in Frage? Schmuck hat zwei: ist einer frei, kommt das Stück dorthin (wie G.equip), sonst gibt es zwei Möglichkeiten
  function slots(it) {
    const g = A.Game.run.gear;
    if (it.slot !== 'trinket' && it.slot !== 'trinket2') return [it.slot];
    if (!g.trinket) return ['trinket'];
    if (!g.trinket2) return ['trinket2'];
    return ['trinket', 'trinket2'];
  }
  // Heldenwerte, wenn it am Platz slot steckt (nur kurz eingesetzt, danach ist alles wie vorher)
  function heroWith(it, slot) {
    const r = A.Game.run, keep = r.gear[slot];
    r.gear[slot] = it;
    try { return A.Game.derived(); } finally { r.gear[slot] = keep; }
  }
  const power = (cls, d) => MAGIC[cls] ? d.mag : cls === 'brau' ? Math.max(d.atk, d.mag) : d.atk;
  const union = (a, b) => Object.keys(Object.assign({}, a, b));

  // Was kommt dazu, was fällt weg: Element-Boni, Kräfte, Legenden, Trophäen und die zweite Chance
  function effects(it, old, d0, d1, r) {
    const out = [];
    for (const el of Object.keys(A.ELEMENTS)) {
      const a = d0.gear.tier[el] || 0, b = d1.gear.tier[el] || 0, n = d1.gear.count[el] || 0;
      for (let i = a; i < b; i++) out.push({ kind: 'el', el, tier: i + 1, n, up: true, pts: elPts(el, i + 1) });
      for (let i = b; i < a; i++) out.push({ kind: 'el', el, tier: i + 1, n, up: false, pts: -elPts(el, i + 1) });
      if (a === b && b < 3 && it.el === el && !(old && old.el === el)) out.push({ kind: 'elnext', el, tier: b + 1, n, pts: 0 });   // kein neuer Bonus, aber ein Teil näher dran
    }
    const p0 = d0.gear.pw, p1 = d1.gear.pw;
    for (const id of union(p0, p1)) {
      const P = A.POWERS[id]; if (!P) continue;
      const a = p0[id], b = p1[id], w = PW_PTS[id] || 6;
      if (a == null) out.push({ kind: 'pw', id, v: b, up: true, pts: w });
      else if (b == null) out.push({ kind: 'pw', id, v: a, up: false, pts: -w });
      else if (a !== b) { const up = P.low ? b < a : b > a; out.push({ kind: 'pw', id, v: b, from: a, up, pts: up ? 2 : -2 }); }
    }
    for (const id of union(d0.leg, d1.leg)) if (!!d0.leg[id] !== !!d1.leg[id]) out.push({ kind: 'leg', id, up: !!d1.leg[id], pts: d1.leg[id] ? 12 : -12 });
    for (const key of union(d0.tro, d1.tro)) if (!!d0.tro[key] !== !!d1.tro[key]) out.push({ kind: 'tro', key, up: !!d1.tro[key], pts: d1.tro[key] ? 7 : -7 });
    if ((d0.revive > 0) !== (d1.revive > 0)) out.push({ kind: 'revive', up: d1.revive > 0, used: !!r.reviveUsed, pts: r.reviveUsed ? 0 : d1.revive > 0 ? 10 : -10 });
    return out;
  }

  // Vergleich für einen Platz: Zeilen (Wert vorher und nachher), Effekte, Punkte und Urteil
  function of(it, slot) {
    const r = A.Game.run;
    slot = slot || slots(it)[0];
    const old = r.gear[slot] && r.gear[slot] !== it ? r.gear[slot] : null;
    const d0 = A.Game.derived(), d1 = heroWith(it, slot);
    const cls = r.cls, pp = lnPts(power(cls, d0), power(cls, d1));
    const rows = [];
    for (const R of ROWS) {
      const va = d0[R.k] || 0, vb = d1[R.k] || 0, a = Math.round(va), b = Math.round(vb);
      if (a === b) continue;
      rows.push({ k: R.k, name: R.name(), a, b, diff: b - a, pct: !!R.pct, pts: R.dmg ? 0 : R.pts ? R.pts(va, vb) : R.w * (vb - va), dmg: !!R.dmg });
    }
    // Angriff und Zauberkraft: zählt nur der Wert, mit dem die Klasse kämpft. Ändern sich beide, bekommt der stärkere die Punkte
    const dm = rows.filter(x => x.dmg);
    if (dm.length) {
      const main = MAGIC[cls] ? 'mag' : cls === 'brau' ? (dm.length === 1 ? dm[0].k : d1.mag > d1.atk ? 'mag' : 'atk') : 'atk';
      for (const x of dm) { x.pts = x.k === main ? pp : 0; x.muted = x.k !== main || Math.abs(pp) < 0.05; }
    }
    const fx = effects(it, old, d0, d1, r);
    const all = rows.map(x => x.pts).concat(fx.map(x => x.pts));
    const pos = all.filter(p => p > 0).reduce((s, p) => s + p, 0), neg = -all.filter(p => p < 0).reduce((s, p) => s + p, 0);
    const score = pos - neg;
    // Kleine Nachteile neben grossen Vorteilen (oder umgekehrt) kippen das Urteil nicht; erst echte Vor- und Nachteile machen es «anders»
    const verdict = pos < 1 && neg < 1 ? 'same' : neg <= Math.max(0.75, pos * 0.2) ? 'better' : pos <= Math.max(0.75, neg * 0.2) ? 'worse' : 'mixed';
    const lean = verdict !== 'mixed' ? null : score > (pos + neg) * 0.15 ? 'up' : score < -(pos + neg) * 0.15 ? 'down' : 'even';
    return { it, slot, old, rows, fx, pos, neg, score, verdict, lean, why: why(rows, fx, verdict) };
  }
  // alle Möglichkeiten (zwei bei vollem Schmuck), die beste zuerst
  function all(it) { return slots(it).map(s => of(it, s)).sort((a, b) => b.score - a.score); }

  // Kurze Begründung aus den wichtigsten Unterschieden: «Mehr Angriff und mehr Leben.» oder «Mehr Angriff, aber weniger Tempo.»
  function label(x) {
    if (x.k) return x.pts > 0 ? L('mehr ', 'more ') + x.name : L('weniger ', 'less ') + x.name;
    const E = x.el && A.ELEMENTS[x.el];
    if (x.kind === 'el') return x.up ? L(`${A.t(E.name)}-Bonus`, `${A.t(E.name)} bonus`) : L(`${A.t(E.name)}-Bonus weg`, `${A.t(E.name)} bonus lost`);
    if (x.kind === 'pw') return x.from != null ? (x.up ? L('stärkere Kraft', 'stronger power') : L('schwächere Kraft', 'weaker power')) : x.up ? L('eine neue Kraft', 'a new power') : L('eine Kraft weg', 'a power lost');
    if (x.kind === 'leg') return x.up ? L('eine Legende', 'a legend') : L('Legende weg', 'legend lost');
    if (x.kind === 'tro') return x.up ? L('eine Trophäen-Kraft', 'a trophy power') : L('Trophäen-Kraft weg', 'trophy power lost');
    if (x.kind === 'revive') return x.up ? L('eine zweite Chance', 'a second chance') : L('zweite Chance weg', 'second chance lost');
    return '';
  }
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const and = (list) => list.length > 1 ? list.slice(0, -1).join(', ') + L(' und ', ' and ') + list[list.length - 1] : list[0] || '';
  function why(rows, fx, verdict) {
    if (verdict === 'same') return L('Ändert fast nichts.', 'Changes almost nothing.');
    // Kleinkram (unter einem halben Punkt) nur nennen, wenn sonst nichts da ist
    const items = rows.concat(fx).filter(x => x.pts).sort((a, b) => Math.abs(b.pts) - Math.abs(a.pts));
    const pick = (f) => { const all = items.filter(f), big = all.filter(x => Math.abs(x.pts) >= 0.5); return (big.length ? big : all).map(label); };
    const ups = pick(x => x.pts > 0), downs = pick(x => x.pts < 0);
    if (verdict === 'better') return cap(and(ups.slice(0, 2))) + '.';
    if (verdict === 'worse') return cap(and(downs.slice(0, 2))) + '.';
    return cap(and(ups.slice(0, 2))) + L(', aber ', ', but ') + downs[0] + '.';   // der grösste Nachteil reicht hier, die Zeilen darunter zeigen alle
  }

  return { slots, of, all };
})();
