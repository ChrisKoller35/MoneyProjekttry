// Der Abstieg – Dein Build: das Spiel erkennt, was der Held spielt (Richtungen wie Feuer, Gift, Dornen, Diener …), gibt dem Build
// einen frechen Namen («Brennender Igel») und lehnt Beute, Händler, Truhen und Schrein daran an. Fehlt einer Kombo nur noch ein
// Element (oder ging eines verloren), zieht der Kombo-Magnet: das Element fällt öfter. Richtungen und Zuordnungen in data.js (A.BUILD_DIRS), Gewichte hier.
'use strict';
window.A = window.A || {};

A.Build = (function () {
  const L = (de, en) => (A.LANG === 'de' ? de : en);
  const D = () => A.BUILD_DIRS;
  // Punkte je Fund: Element auf der Ausrüstung je Stück, Kraft, Zauber, Talent, Legende, Trophäe, Klasse; Fokus des Spielers obendrauf
  const W = { el: 1, pw: 1, sp: 1, tal: 1.5, leg: 1.5, tro: 1.5, cls: 1, focus: 3 };

  // Zu welchen Richtungen gehört ein Ding (kind: el, pw, sp, tal, leg, tro, cls)?
  function dirsOf(kind, id) { const out = []; for (const k in D()) if ((D()[k][kind] || []).includes(id)) out.push(k); return out; }

  // ---------- Profil: Punkte je Richtung, die stärksten zwei, Name ----------
  function profile(r, d) {
    r = r || A.Game.run;
    const empty = { score: {}, top: [], total: 0, first: null, second: null };
    if (!r) return empty;
    d = d || A.Game.derived(r);
    const sc = {}, add = (kind, id, w) => { for (const k of dirsOf(kind, id)) sc[k] = (sc[k] || 0) + w; };
    const cnt = (d.gear && d.gear.count) || A.Gear.counts(r);
    for (const el in cnt) add('el', el, W.el * cnt[el]);
    for (const id in ((d.gear && d.gear.pw) || {})) add('pw', id, W.pw);
    for (const id of r.known || []) add('sp', id, W.sp);
    for (const id of r.talents || []) add('tal', id, W.tal);
    for (const id in (d.leg || {})) add('leg', id, W.leg);
    for (const boss in A.TROPHIES) if (d.tro && d.tro[A.TROPHIES[boss].power]) add('tro', boss, W.tro);
    add('cls', r.cls, W.cls);
    if (r.focus && D()[r.focus]) sc[r.focus] = (sc[r.focus] || 0) + W.focus;
    const top = Object.keys(sc).filter(k => sc[k] > 0).sort((a, b) => sc[b] - sc[a] || a.localeCompare(b));
    const first = top[0] && sc[top[0]] >= A.BUILD_MIN ? top[0] : null;
    const second = first && top[1] && sc[top[1]] >= A.BUILD_MIN && sc[top[1]] >= sc[first] * 0.5 ? top[1] : null;
    return { score: sc, top, total: top.reduce((s, k) => s + sc[k], 0), first, second, focus: r.focus || null };
  }
  // Die Richtungen des Builds als Ids (für die Chronik) und der Name daraus
  function ids(p) { return [p.first, p.second].filter(Boolean); }
  function nameOf(list) {
    const a = list && D()[list[0]], b = list && D()[list[1]];
    if (!a) return L('Noch kein Build', 'No build yet');
    return b ? `${A.t(b.adj)} ${A.t(a.noun)}` : A.t(a.noun);
  }
  function name(p) { return nameOf(ids(p)); }
  function dirName(k) { return D()[k] ? A.t(D()[k].name) : k; }
  function strong(p) { return !!p.first && p.score[p.first] >= A.BUILD_STRONG; }
  // «Feuer 5 · Dornen 3»: die stärksten drei Richtungen mit Punkten
  function summary(p) { return p.top.slice(0, 3).map(k => `${dirName(k)} ${Math.round(p.score[k] * 10) / 10}`).join(' · '); }

  // ---------- Wünsche: welche Elemente und Kräfte passen, und wo der Kombo-Magnet zieht ----------
  // els/pws: Element bzw. Kraft -> Punkte der Richtung; magnet: Element -> Kombo, der nur noch dieses Element fehlt
  // Merkzettel: derived() ist nicht billig, und Listen (Beutel, Händler) fragen je Stück; solange sich am Helden nichts ändert, gilt die letzte Antwort
  let memo = { r: null, sig: '', w: null };
  function sig(r) { return [r.cls, r.focus || '', (r.known || []).join(), (r.talents || []).join(), (r.combos || []).join(), A.SLOTS.map(s => { const it = r.gear[s]; return it ? `${it.uid}:${it.el || ''}:${it.power ? it.power.id : ''}` : ''; }).join()].join('|'); }
  function wants(r, d) {
    r = r || A.Game.run; if (!r) return null;
    if (!d) { const g = sig(r); if (memo.r === r && memo.sig === g) return memo.w; memo = { r, sig: g, w: null }; }
    d = d || A.Game.derived(r);
    const p = profile(r, d), els = {}, pws = {}, magnet = {};
    for (const k of ids(p)) { const dir = D()[k]; for (const el of dir.el || []) els[el] = (els[el] || 0) + p.score[k]; for (const id of dir.pw || []) pws[id] = (pws[id] || 0) + p.score[k]; }
    for (const x of A.Combos.list(r, d)) if ((x.st === 'near' || x.st === 'rest') && x.miss.length === 1 && x.miss[0].el) magnet[x.miss[0].el] = x.id;   // near: fast da; rest: war erweckt, ein Teil ging verloren
    const w = { p, els, pws, magnet, any: !!p.first || Object.keys(magnet).length > 0 };
    if (memo.r === r && !memo.w) memo.w = w;
    return w;
  }
  // Gewichte beim Würfeln (game.js rollElement / rollPower): passende Elemente bis dreimal, Magnet-Elemente dreimal so oft; passende Kräfte bis dreimal
  function elMul(el, r, w) { w = w || wants(r); if (!w) return 1; return (1 + 0.25 * Math.min(w.els[el] || 0, 8)) * (w.magnet[el] ? 3 : 1); }
  function pwMul(id, r, w) { w = w || wants(r); if (!w) return 1; return 1 + 0.25 * Math.min(w.pws[id] || 0, 8); }

  // Trägt der Held auf dem Platz des Stücks schon dieses Element? Dann bringt das Stück der Kombo nichts (Schmuck: beide Plätze)
  function heldThere(it, r) {
    if (!r || !r.gear) return false;
    const has = (s) => !!(r.gear[s] && r.gear[s].el === it.el);
    return it.slot === 'trinket' || it.slot === 'trinket2' ? has('trinket') && has('trinket2') : has(it.slot);
  }
  // Passt ein Stück? { kind: 'combo', el, combo } (Kombo-Magnet), { kind: 'build', dir } (Element oder Kraft der stärksten Richtungen) oder null
  function fits(it, r, w) {
    if (!it || it.legend || it.trophy) return null;
    w = w || wants(r); if (!w) return null;
    if (it.el && w.magnet[it.el] && !heldThere(it, r || A.Game.run)) return { kind: 'combo', el: it.el, combo: w.magnet[it.el] };
    if (!w.p.first) return null;
    for (const k of ids(w.p)) { const dir = D()[k]; if ((it.el && (dir.el || []).includes(it.el)) || (it.power && (dir.pw || []).includes(it.power.id))) return { kind: 'build', dir: k }; }
    return null;
  }
  // Passt ein Segen (Talent oder Zauber) zum Build?
  function boonFits(b, p) {
    if (!b || !p || !p.first) return false;
    const kind = b.type === 'talent' ? 'tal' : b.type === 'spell' ? 'sp' : null; if (!kind) return false;
    return dirsOf(kind, b.id).some(k => k === p.first || k === p.second);
  }
  // Text zum Fund (Fund-Fenster, Händler)
  function fitText(f) {
    if (!f) return '';
    if (f.kind === 'combo') return L(`Kombo-Teil: ${A.t(A.ELEMENTS[f.el].name)} für «${A.t(A.COMBOS[f.combo].name)}»`, `Combo part: ${A.t(A.ELEMENTS[f.el].name)} for “${A.t(A.COMBOS[f.combo].name)}”`);
    return L(`Passt zu deinem Build (${dirName(f.dir)})`, `Fits your build (${dirName(f.dir)})`);
  }

  return { W, dirsOf, profile, ids, nameOf, name, dirName, strong, summary, wants, elMul, pwMul, fits, boonFits, fitText };
})();
