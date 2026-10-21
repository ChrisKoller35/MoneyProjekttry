// Der Abstieg – Legendäre Gegenstände (A.LEGENDS in data.js): 20 Einzelstücke, die die Spielweise spürbar verändern.
// Fundorte: Weltenbosse (je ihr eigenes Stück), Elite-Gegner (je Eigenschaft eins) und Truhen in geheimen Räumen (je Welt eins).
// game.js baut die Items und führt die Sammlung (meta.legFound); world.js ruft die Haken (pre, guard, onHit, onKill, onHurt, onSkill,
// onAttack, onRoomStart, tick ...); draw.js zeichnet, was dabei entsteht (W.legfx: Amboss, Ente, Tinte, Leerenloch).
'use strict';
window.A = window.A || {};

A.Legends = (function () {
  const TAU = Math.PI * 2, PX = 2, EY = 0.6;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const L = (de, en) => (A.LANG === 'de' ? de : en);
  let api = null;   // Werkzeuge aus world.js: hit, heal, kill, float, fx, shoot, moveEnt, mkAlly, heroPower, castSkill, addEffect
  const W = () => api && api.W;
  function bind(a) { api = a; }
  const LG = (id) => A.LEGENDS[id];
  const live = (m) => m.alive && !(m.spawn > 0);
  const real = (o) => !o.proc && (o.kind === 'phys' || o.kind === 'magic');   // echte Treffer (keine Zusatz-Treffer, kein Gift-/Brand-Ticken)
  const has = (h, id) => !!(h && h.leg && h.leg[id]);
  const fight = (w) => !!(w && w.active && w.mons.some(live));
  const pow = (h) => api.heroPower(h);
  const tier = (h, el) => (h && h.gear && h.gear.tier[el]) || 0;
  function add(o) { const w = W(); (w.legfx || (w.legfx = [])).push(o); return o; }

  // ---------- Werte (game.js derived) ----------
  // Welche Legenden trägt der Held? Alle Merkmale werden jedes Mal neu gesetzt, damit nach dem Ablegen nichts hängen bleibt
  function worn(r) { const out = {}; if (!r || !r.gear) return out; for (const s of A.SLOTS) { const it = r.gear[s]; if (it && it.legend && LG(it.legend)) out[it.legend] = true; } return out; }
  function apply(d, r) {
    const lg = worn(r);
    d.leg = lg;
    d.legBig = !!lg.riesenpilz; if (d.legBig) d.maxHp = Math.round(d.maxHp * 1.3);
    d.fly = !!lg.teppich;
    d.burnImmune = !!lg.grillschuerze;
    if (lg.strickjacke) d.thorns *= 2;
    if (lg.pfannen) d.dodge = 0;
    return d;
  }

  // ---------- Texte für die Oberfläche ----------
  function hint(id) {
    const g = LG(id); if (!g) return '';
    if (g.src === 'boss') return L('Vom Weltenboss ', 'From the world boss ') + A.t(A.BOSSES[g.boss].name);
    if (g.src === 'elite') return L('Von Elite-Gegnern mit der Eigenschaft ', 'From elites with the trait ') + A.t(A.ELITE_TRAITS[g.trait].name);
    if (g.src === 'wild') return L('Kann überall auftauchen: in Truhen, bei Elite-Gegnern, nach Kämpfen und bei Weltenbossen. Ab Welt 2 viel öfter.', 'Can turn up anywhere: in chests, from elites, after fights and from world bosses. Much more often from world 2.');
    return L('Aus einem geheimen Raum in ', 'From a secret room in ') + A.t(A.WORLDS[g.world].name);
  }

  // ---------- Treffer ----------
  // vor der Schadensrechnung: Würfel (6: doppelter Schaden, 5: mehr Volltreffer) und Prahlhans
  function pre(from, to, opts) {
    const w = W(); if (!w || from !== w.hero || to.side !== 'enemy' || !from.leg) return null;
    let mul = 1, crit = 0;
    const dc = from.dice;
    if (dc && dc.n === 6 && dc.until > w.t) mul *= 2;
    if (dc && dc.n === 5) crit += 30;
    if (from.leg.prahlhans && from.brag) mul *= 1 + 0.08 * from.brag;
    return mul === 1 && !crit ? null : { mul, crit };
  }
  // Treffer am Helden abfangen: Tintenwolke (Gegner sieht nichts) und Bratpfannen (jeder dritte prallt ab)
  function guard(from, to, opts) {
    const w = W(); if (!w || to !== w.hero || !from || from.side !== 'enemy' || (opts.kind !== 'phys' && opts.kind !== 'magic')) return null;
    if (from.blindUntil > w.t && Math.random() < 0.5) {
      api.float(to.x, to.y - to.r - 8, L('daneben', 'miss'), '#c0cbdc', 12); api.fx('miss', { to }); A.Gear.onDodge(to); A.Combos.onDodge(to);
      return -1;
    }
    if (has(to, 'pfannen') && (to.panN = (to.panN || 0) + 1) % 3 === 0) {
      api.float(to.x, to.y - to.r - 14, L('Klong!', 'Clang!'), '#c0cbdc', 16);
      if (A.Sound.klong) A.Sound.klong();
      if (A.FX) A.FX.burst(to.x + (from.x - to.x) * 0.3, to.y - 14 + (from.y - to.y) * 0.3, 10, { color: ['#ffffff', '#fee761', '#c0cbdc'], smin: 60, smax: 180, life: 0.3, add: true, kind: 'spark', drag: 4 });
      to.flash = 0.06;
      return 0;
    }
    return null;
  }
  // nach einem echten Treffer des Helden
  function onHit(h, to, dmg, crit, opts) {
    const w = W(); if (!h.leg || to.side !== 'enemy' || !real(opts)) return;
    const lg = h.leg;
    // Blitzableiter: der normale Angriff springt als Blitz weiter (einmal pro Angriff, auch wenn der Schlag mehrere trifft)
    if (lg.blitzableiter && opts.basic && h.rodN !== h.atkN) { h.rodN = h.atkN; rod(h, to, Math.max(1, dmg) * 0.5, tier(h, 'blitz') >= 2 ? 3 : 2); }
    // Schneekugel: jeder 5. Treffer friert ein; Eingefrorene oder Betäubte unter 30 % zerspringen
    if (lg.schneekugel) {
      if (to.alive && to.hp > 0 && (h.snowN = (h.snowN || 0) + 1) >= 5) { h.snowN = 0; freeze(to, to.boss ? 0.3 : 1); }
      shatter(h, to);
    }
    // Voodoo-Puppe: alle anderen spüren ein Fünftel davon (jeder Gegner höchstens alle 0.25 Sekunden)
    if (lg.voodoo && dmg > 0) for (const o of w.mons) {
      if (o === to || !live(o) || o.vooT > w.t) continue;
      o.vooT = w.t + 0.25;
      api.hit(h, o, dmg * 0.2, { kind: 'magic', proc: true, noKb: true, noDodge: true, noCrit: true, color: '#b55088' });
      if (A.FX && !A.FX.low && Math.random() < 0.5) A.FX.part({ add: true, x: o.x + (Math.random() - 0.5) * 10, y: o.y - 16, vx: 0, vy: -30, life: 0.4, color: '#b55088', drag: 1 });
    }
  }
  function rod(h, first, dmg, n) {
    const w = W(), done = new Set([first]); let cur = first;
    for (let i = 0; i < n; i++) {
      let best = null, bd = 190;
      for (const m of w.mons) { if (!live(m) || done.has(m)) continue; const d = Math.hypot(m.x - cur.x, m.y - cur.y); if (d < bd) { bd = d; best = m; } }
      if (!best) break; done.add(best);
      w.bolts.push({ x0: cur.x, y0: cur.y - 10, x1: best.x, y1: best.y - 10, life: 0.25, max: 0.25, col: '#7fd8ff', seed: Math.random() * 99 });
      api.hit(h, best, dmg, { kind: 'magic', proc: true, noKb: true, color: '#7fd8ff' }); cur = best;
    }
    if (done.size > 1) api.fx('zap', { x: first.x, y: first.y, color: '#7fd8ff' });
  }
  function freeze(m, d) {
    const w = W(); m.stun = Math.max(m.stun, d); m.frozenUntil = w.t + d;
    api.float(m.x, m.y - m.r - 24, L('Eingefroren!', 'Frozen!'), '#9be8ff', 12);
    if (A.FX) A.FX.burst(m.x, m.y - 8, 12, { color: ['#9be8ff', '#ffffff', '#2ce8f5'], smin: 30, smax: 110, life: 0.5, add: true, kind: 'spark', drag: 4 });
  }
  function shatter(h, m) {
    const w = W();
    if (!m.alive || m.hp <= 0 || m.boss || !(m.frozenUntil > w.t || m.stun > 0) || m.hp >= m.maxHp * 0.3) return;
    const x = m.x, y = m.y;
    api.kill(m, L('Zerspringt!', 'Shatters!'), '#9be8ff');
    const src = { x, y, r: 4, side: 'hero', tal: {} }, a0 = Math.random() * TAU;
    for (let i = 0; i < 3; i++) { const a = a0 + i / 3 * TAU; api.shoot(src, x + Math.cos(a) * 100, y + Math.sin(a) * 100, pow(h) * 0.6, { kind: 'magic', proc: true, noKb: true, color: '#9be8ff', speed: 380, life: 0.7, r: 5 }); }
    if (A.FX) { A.FX.burst(x, y - 10, 18, { color: ['#9be8ff', '#ffffff', '#2ce8f5'], smin: 60, smax: 200, life: 0.5, z: 8, vz: 120, g: 400 }); A.FX.shake(0.15); }
    if (A.Sound.glass) A.Sound.glass(true);
  }
  // Gegner besiegt
  function onKill(e) {
    const w = W(), h = w && w.hero; if (!h || !h.alive || !h.leg) return;
    if (h.leg.prahlhans && w.active) { h.brag = Math.min(10, (h.brag || 0) + 1); api.float(h.x, h.y - 60, L('Prahlhans ', 'Braggart ') + '+' + h.brag * 8 + ' %', '#feae34', 12); }
    if (h.leg.waechterauge && (h.eyeN = (h.eyeN || 0) + 1) >= 4) {
      h.eyeN = 0;
      add({ kind: 'rift', x: e.x, y: e.y, r: 120, t0: w.t, at: w.t + 1.6 });
      api.float(e.x, e.y - 40, L('Leerenloch!', 'Void rift!'), '#e0a4ff', 14);
      if (A.Sound.summon) A.Sound.summon();
    }
  }
  // Held getroffen
  function onHurt(h, from, dmg) {
    const w = W(); if (!h.leg || !h.alive || h.hp <= 0) return;
    const enemy = from && from.side === 'enemy';
    if (h.leg.prahlhans && h.brag && dmg > h.maxHp * 0.1) { h.brag = Math.floor(h.brag / 2); api.float(h.x, h.y - 60, L('Prahlerei halbiert', 'Bragging halved'), '#c0cbdc', 12); }
    if (h.leg.strickjacke && enemy && !(h.vineT > w.t)) { h.vineT = w.t + 4; vines(h); }
    if (h.leg.bademantel && enemy && !(h.inkT > w.t)) {
      h.inkT = w.t + 4;
      add({ kind: 'ink', x: h.x, y: h.y + 6, r: 110, t0: w.t, until: w.t + 3 });
      api.float(h.x, h.y - 56, L('Tinte!', 'Ink!'), '#e0a4ff', 14);
      if (A.FX) A.FX.burst(h.x, h.y - 10, 16, { color: ['#2e2a4a', '#68386c', '#3e2731'], smin: 60, smax: 200, life: 0.6, z: 10, vz: 120, g: 380, size: 2 });
      if (A.Sound.gulp) A.Sound.gulp(0.6);
    }
  }
  // Strickjacke: Ranken aus dem Boden halten alle Gegner rundum fest
  function vines(h) {
    const w = W(), R = 130;
    w.zones.push({ kind: 'grab', vine: true, x: h.x, y: h.y + 6, r: R, t0: w.t, until: w.t + 1.5, tick: w.t, col: '#63c74d' });
    for (const m of w.mons) if (live(m) && Math.hypot(m.x - h.x, m.y - h.y) < R + m.r) api.hit(h, m, pow(h) * 0.8, { kind: 'magic', proc: true, noKb: true, stun: m.boss ? 0.5 : 1.5, slow: true, slowDur: 2.5, color: '#63c74d' });
    api.float(h.x, h.y - 58, L('Ranken!', 'Vines!'), '#a2e05a', 14);
    if (A.FX) A.FX.burst(h.x, h.y, 16, { color: ['#63c74d', '#a2e05a', '#3e8948'], smin: 40, smax: 130, z: 2, vz: 150, g: 420, life: 0.7 });
  }
  // Zauber gewirkt: das Spiegelbild wirkt Angriffs-Zauber kurz danach noch einmal mit halber Kraft
  const NO_MIRROR = ['shield', 'heal', 'buff', 'dash', 'ally', 'sacrifice', 'rally', 'brew', 'summon', 'wonder'];
  function onSkill(h, id) {
    const w = W(), sk = A.SKILLS[id]; if (!has(h, 'spiegelscherbe') || !sk || NO_MIRROR.includes(sk.kind) || sk.zone === 'heal') return;
    (w.legQ || (w.legQ = [])).push({ at: w.t + 0.4, id });
  }
  // normaler Angriff: Faktor (Münzfresser frisst im Kampf 1 Gold)
  function onAttack(h) {
    const w = W(); if (!has(h, 'muenzfresser') || !fight(w)) return 1;
    const r = A.Game.run;
    if (r.gold > 0) {
      r.gold--;
      if (A.FX && !A.FX.low) A.FX.part({ x: h.x + h.fx * 10, y: h.y - 4, z: 18, vx: h.fx * 40, vy: 0, vz: 90, g: 400, life: 0.5, color: '#feae34', size: 2 });
      return 1.6;
    }
    if (!(h.coinT > w.t)) { h.coinT = w.t + 4; api.float(h.x, h.y - 56, L('Hunger! Kein Gold', 'Hungry! No gold'), '#c0cbdc', 12); }
    return 0.7;
  }
  // Kampf beginnt: Würfel, Zeitgeber zurück auf Anfang
  const DICE = [
    null,
    { de: 'Die Gönner lachen. Ein paar Münzen.', en: 'The patrons laugh. A few coins.' },
    { de: 'Schneller schlagen!', en: 'Faster attacks!' },
    { de: 'Alle Gegner verlieren Leben!', en: 'All enemies lose health!' },
    { de: 'Schild!', en: 'Shield!' },
    { de: 'Mehr Volltreffer!', en: 'More crits!' },
    { de: 'Doppelter Schaden!', en: 'Double damage!' },
  ];
  function onRoomStart(h) {
    const w = W(); if (!h.leg) return;
    h.brag = 0; h.stopT = 4; h.anvT = 1.5; h.duckT = 2; h.ratT = 1; h.dice = null;
    if (h.leg.wuerfel) roll(h, 1 + Math.floor(Math.random() * 6));
    void w;
  }
  function roll(h, n) {
    const w = W(), run = A.Game.run;
    h.dice = { n, until: n === 6 ? w.t + 12 : 1e9 };
    api.float(h.x, h.y - 76, L('Würfel: ', 'Die: ') + n, '#fee761', 20);
    api.float(h.x, h.y - 56, A.t(DICE[n]), '#ead4aa', 13);
    if (n === 1) { const g = 20 + run.floor * 3; run.gold += g; api.float(h.x, h.y - 38, '+' + g, '#feae34', 13, 'coin'); }
    else if (n === 3) for (const m of w.mons) { if (!m.alive) continue; const k = Math.round(m.maxHp * (m.boss ? 0.1 : 0.3)); m.hp = Math.max(1, m.hp - k); api.float(m.x, m.y - 30, '-' + k, '#b55088', 14); }
    else if (n === 4) { h.shield = Math.max(h.shield, Math.round(h.maxHp * 0.5)); api.fx('shield', { e: h }); }
    if (A.FX) { A.FX.burst(h.x, h.y - 50, 14, { color: ['#fee761', '#ffffff', '#feae34'], smin: 40, smax: 140, life: 0.5, add: true, kind: 'spark', drag: 3 }); }
    if (A.Sound.buy) A.Sound.buy();
  }
  // Tempo: Würfel 2 macht den Angriff schneller, der Riesenpilz macht langsamer
  function atkMul(h) { const dc = h.dice; return dc && dc.n === 2 ? 1 / 1.5 : 1; }
  function moveMul(h) { return h.legBig ? 0.85 : 1; }
  // Gebiss des Grafen: Heilung über das volle Leben hinaus wird zum Schild (bis 40 %)
  function overheal(h, excess) {
    if (!has(h, 'gebiss') || excess <= 0) return;
    const cap = Math.round(h.maxHp * 0.4); if (h.shield >= cap) return;
    const add2 = Math.max(1, Math.round(Math.min(excess, cap - h.shield)));
    h.shield += add2;
    const w = W(); if (!(h.fangT > w.t)) { h.fangT = w.t + 0.8; api.float(h.x, h.y - h.r - 22, '+' + add2, '#2ce8f5', 12); }
  }

  // ---------- Quietsche-Ente: Nahkämpfer in der Nähe prügeln auf sie ein, statt auf dich ----------
  function lure(m, dt) {
    const w = W(); if (m.boss || m.kind !== 'melee' || m.rooted) return false;
    let duck = null, bd = 300;
    for (const o of w.legfx || []) if (o.kind === 'duck' && !o.done) { const d = Math.hypot(o.x - m.x, o.y - m.y); if (d < bd) { bd = d; duck = o; } }
    if (!duck) return false;
    const d = bd || 1, nx = (duck.x - m.x) / d, ny = (duck.y - m.y) / d;
    m.fx = nx; m.fy = ny; m.state = 'chase';
    if (d > m.r + 12) api.moveEnt(m, nx * m.speed * dt, ny * m.speed * dt);
    else if ((m.duckCd = (m.duckCd || 0) - dt) <= 0) {
      m.duckCd = 0.8 + Math.random() * 0.3; m.swing = 0.2; duck.hits = (duck.hits || 0) + 1; duck.squash = w.t;
      api.float(duck.x + (Math.random() - 0.5) * 20, duck.y - 26, L('Quietsch!', 'Squeak!'), '#fee761', 12);
      if (A.Sound.squeak) A.Sound.squeak();
    }
    return true;
  }

  // ---------- Zeitstopp (Totenmaske): 0 = läuft, 1 = Gegner stehen still (Bosse wieder wach), 2 = alles steht ----------
  function stopped() { const w = W(); const s = w && w.legStop; if (!s || w.t >= s.until) return 0; return w.t < s.boss ? 2 : 1; }
  function timeStop(h) {
    const w = W();
    w.legStop = { t0: w.t, until: w.t + 2, boss: w.t + 0.8 };
    for (const m of w.mons) { if (!m.alive) continue; const d = m.boss ? 0.8 : 2; m.stun = Math.max(m.stun, d); m.sandUntil = w.t + d; }
    api.float(h.x, h.y - 64, L('Die Zeit steht still!', 'Time stands still!'), '#feae34', 16);
    if (A.FX) { A.FX.shake(0.2); A.FX.part({ kind: 'ring', x: h.x, y: h.y, life: 0.6, size: 160, color: '#feae34', add: true }); }
    if (A.Sound.descend) A.Sound.descend();
  }

  // ---------- Jedes Bild ----------
  function tick(dt) {
    const w = W(); if (!w) return; const h = w.hero; if (!h) return;
    const lg = h.leg || {}, inFight = fight(w);
    pudding(w, h, lg, dt);
    // Zeitstopp: Warnkreise der Gegner bleiben stehen (die Zeit läuft für sie nicht weiter)
    const st = stopped();
    if (st) {
      for (const b of w.efx || []) shift(b, dt);
      if (st === 2) for (const b of w.bfx || []) shift(b, dt);
      if (A.FX && !A.FX.low) for (const m of w.mons) if (m.alive && m.sandUntil > w.t && Math.random() < dt * 8) A.FX.part({ x: m.x + (Math.random() - 0.5) * m.r * 2, y: m.y, z: 10 + Math.random() * 20, vx: 0, vy: 0, vz: -10, g: 120, life: 0.6, color: Math.random() < 0.5 ? '#e4a672' : '#ead4aa', size: 1 });
    }
    if (!inFight) { h.dice = null; h.brag = 0; }
    if (h.alive && inFight) {
      if (lg.totenmaske && (h.stopT = (h.stopT == null ? 4 : h.stopT) - dt) <= 0) { h.stopT = 15; timeStop(h); }
      if (lg.amboss && (h.anvT = (h.anvT == null ? 1.5 : h.anvT) - dt) <= 0) {
        h.anvT = 4; let tg = null;
        for (const m of w.mons) if (live(m) && Math.hypot(m.x - h.x, m.y - h.y) < 420 && (!tg || m.hp > tg.hp)) tg = m;
        if (tg) add({ kind: 'anvil', tgt: tg, x: tg.x, y: tg.y, t0: w.t, at: w.t + 0.7 });
      }
      if (lg.latschen && (h.duckT = (h.duckT == null ? 2 : h.duckT) - dt) <= 0) {
        h.duckT = 9; add({ kind: 'duck', x: h.x - h.fx * 10, y: h.y + 4, t0: w.t, until: w.t + 3, hits: 0 });
        api.float(h.x, h.y - 52, L('Quietsch!', 'Squeak!'), '#fee761', 13); if (A.Sound.squeak) A.Sound.squeak();
      }
      if (lg.floete && (h.ratT = (h.ratT == null ? 1 : h.ratT) - dt) <= 0) {
        h.ratT = 7; const p = h.cls === 'rufer' ? 0.5 : 0.25;   // der Rufer kann mit Dienern am besten
        for (let i = 0; i < 3; i++) { const a = Math.atan2(h.fy, h.fx) + Math.PI + (i - 1) * 0.9; const r = A.Classes.summon(h, 'ratte', p, 8, h.x + Math.cos(a) * 40, h.y + Math.sin(a) * 30); r.col = '#c28569'; }
        api.float(h.x, h.y - 56, L('Ratten, folgt mir!', 'Rats, follow me!'), '#c28569', 13);
      }
      if (lg.grillschuerze && (h.grillT = (h.grillT || 0) - dt) <= 0) {
        h.grillT = 0.5;   // wer in der Nähe steht, fängt Feuer (brennt noch kurz nach, wenn er weggeht)
        for (const m of w.mons) if (live(m) && Math.hypot(m.x - h.x, m.y - h.y) < 85 + m.r) api.addEffect(m, 'burn', Math.max(1, Math.round(pow(h) * 0.25)), 1.2);
      }
    }
    if (lg.grillschuerze && h.alive && A.FX && !A.FX.low && Math.random() < dt * (inFight ? 22 : 6)) { const a = Math.random() * TAU, rr = 30 + Math.random() * 55; A.FX.part({ add: true, x: h.x + Math.cos(a) * rr, y: h.y + Math.sin(a) * rr * 0.6, vx: 0, vy: -26 - Math.random() * 20, life: 0.5, color: Math.random() < 0.5 ? '#feae34' : '#f77622', drag: 0.8 }); }
    // Spiegelbild wirkt nach
    if (w.legQ && w.legQ.length) {
      for (const q of w.legQ) if (w.t >= q.at) { q.done = true; if (h.alive && h.skills.includes(q.id)) { api.castSkill(h, q.id, 0.5); api.float(h.x - 18, h.y - 50, L('Spiegel!', 'Mirror!'), '#ffffff', 12); add({ kind: 'mirror', x: h.x - h.fx * 18, y: h.y, t0: w.t, until: w.t + 0.45, flip: h.fx < 0 }); } }
      w.legQ = w.legQ.filter(q => !q.done);
    }
    // Amboss, Ente, Tinte, Leerenloch
    for (const o of w.legfx || []) {
      if (o.kind === 'anvil') {
        if (!o.hit) {
          if (o.tgt.alive && w.t < o.at - 0.15) { o.x = o.tgt.x; o.y = o.tgt.y; }
          if (w.t >= o.at) { o.hit = true; o.until = w.t + 0.5; anvil(h, o); }
        } else if (w.t > o.until) o.done = true;
      } else if (o.kind === 'duck') {
        if (w.t >= o.until) { o.done = true; boomAt(h, o.x, o.y, 100, pow(h) * 2.5, '#fee761'); api.float(o.x, o.y - 30, L('Quietsch-BUMM!', 'Squeak-BOOM!'), '#feae34', 16); if (A.FX) A.FX.shake(0.35); }
      } else if (o.kind === 'ink') {
        if (w.t > o.until) { o.done = true; continue; }
        for (const m of w.mons) if (live(m) && Math.hypot(m.x - o.x, (m.y - o.y) / EY) < o.r + m.r) m.blindUntil = w.t + 1;
        if (A.FX && Math.random() < dt * 14) { const a = Math.random() * TAU, rr = Math.random() * o.r * 0.85; A.FX.part({ kind: 'smoke', x: o.x + Math.cos(a) * rr, y: o.y + Math.sin(a) * rr * EY, vx: (Math.random() - 0.5) * 10, vy: -6, life: 1.1, size: 4, grow: 8, color: Math.random() < 0.6 ? '#2e2a4a' : '#68386c', drag: 1 }); }
      } else if (o.kind === 'rift') {
        if (w.t < o.at) {
          for (const m of w.mons) { if (!live(m) || m.boss) continue; const dx = o.x - m.x, dy = o.y - m.y, d = Math.hypot(dx, dy); if (d < o.r + 40 && d > 8) api.moveEnt(m, dx / d * 150 * dt, dy / d * 150 * dt); }
          if (A.FX && !A.FX.low && Math.random() < dt * 30) { const a = Math.random() * TAU, rr = o.r * (0.7 + Math.random() * 0.5); A.FX.part({ kind: 'spark', add: true, x: o.x + Math.cos(a) * rr, y: o.y + Math.sin(a) * rr * EY, vx: -Math.cos(a) * 160, vy: -Math.sin(a) * 100, life: 0.45, color: Math.random() < 0.5 ? '#b55088' : '#e0a4ff', drag: 0.5 }); }
        } else {
          o.done = true; boomAt(h, o.x, o.y, o.r, pow(h) * 2.5, '#b55088');
          if (A.FX) { A.FX.shake(0.4); A.FX.flash(o.x, o.y, o.r, '#b55088', 0.3); }
        }
      } else if (o.kind === 'mirror') { if (w.t > o.until) o.done = true; }
    }
    if (w.legfx && w.legfx.length) w.legfx = w.legfx.filter(o => !o.done);
  }
  function shift(b, dt) { for (const k of ['at', 't0', 'until', 'warm', 'hitT', 'tick']) if (typeof b[k] === 'number') b[k] += dt; }
  function boomAt(h, x, y, r, dmg, col) {
    const w = W();
    for (const m of w.mons) if (live(m) && Math.hypot(m.x - x, m.y - y) < r + m.r) api.hit(h, m, dmg, { kind: 'magic', proc: true, color: col });
    api.fx('boom', { x, y, r, color: col });
    A.Combos.onBoom(x, y, r, dmg, { proc: true });   // Domino (combos.js)
  }
  // Der Amboss schlägt ein: grosser Schaden, kurz betäubt, Rüstung verbeult; daneben gibt es etwas ab
  function anvil(h, o) {
    const w = W(), t = o.tgt;
    if (t.alive && Math.hypot(t.x - o.x, t.y - o.y) < t.r + 36) {
      api.hit(h, t, pow(h) * 2, { kind: 'magic', proc: true, noDodge: true, noKb: true, stun: t.boss ? 0.3 : 1, color: '#c0cbdc' });
      t.shred = Math.min(15, (t.shred || 0) + 3);
    }
    for (const m of w.mons) if (m !== t && live(m) && Math.hypot(m.x - o.x, m.y - o.y) < 56 + m.r) api.hit(h, m, pow(h) * 0.6, { kind: 'magic', proc: true, color: '#c0cbdc' });
    api.float(o.x, o.y - 44, L('Klong!', 'Clang!'), '#c0cbdc', 16);
    if (A.Sound.klong) A.Sound.klong(true);
    if (A.FX) { A.FX.shake(0.3); A.FX.rocks(o.x, o.y, 6, 50, ['#5a6988', '#8b9bb4', '#3a4466']); A.FX.burst(o.x, o.y - 6, 12, { color: ['#ffffff', '#fee761', '#c0cbdc'], smin: 60, smax: 200, life: 0.35, add: true, kind: 'spark', drag: 4 }); }
  }

  // ---------- Pudding: der Sohn des Schleimkönigs ----------
  // Ein Begleiter in W.allies (leg: 'pudding'); world.js lässt ihn laufen und beissen. Hier: da sein, wachsen und angeschlagene Gegner verschlucken.
  // Kombo Königsfamilie (Krone des Schleimkönigs dazu, combos.js): grosse Krone, stärker, grösser, verschluckt schon unter 25 %, spuckt Baby-Schleime
  function pudding(w, h, lg, dt) {
    let p = w.allies.find(a => a.leg === 'pudding' && !a.gone);
    if (!lg.pudding || !h.alive) { if (p) { p.gone = true; api.fx('appear', { m: p }); } return; }
    if (!p) { p = api.mkAlly(h, 0.6, 0, false); p.leg = 'pudding'; p.r = 12; p.col = '#feae34'; p.rate = 0.75; p.eatT = 0; w.allies.push(p); }
    const n = w.pudN || 0, royal = A.Combos.on(h, 'koenigsfamilie');
    p.royal = royal; p.pow = 0.6 * (1 + 0.1 * n) * (royal ? 1.3 : 1); p.size = (1 + 0.06 * n) * (royal ? 1.2 : 1);
    if (royal && A.FX && !A.FX.low && Math.random() < dt * 4) A.FX.part({ add: true, x: p.x + (Math.random() - 0.5) * 16, y: p.y, z: 18 + Math.random() * 10, vx: 0, vy: 0, vz: 20, life: 0.5, color: Math.random() < 0.5 ? '#fee761' : '#ffffff', drag: 1 });
    if ((p.eatT -= dt) > 0 || p.spawn > 0) return;
    for (const m of w.mons) {
      if (!live(m) || m.boss || m.hp >= m.maxHp * (royal ? 0.25 : 0.15) || Math.hypot(m.x - p.x, m.y - p.y) > p.r + m.r + 14) continue;
      p.eatT = 1; p.gulp = w.t;
      const mx = m.x, my = m.y;
      api.kill(m, L('Happs!', 'Gulp!'), '#feae34');
      A.Combos.onGulp(p, mx, my);
      if (n < 10) { w.pudN = n + 1; api.float(p.x, p.y - 34, L('Pudding wächst!', 'Pudding grows!') + ' ' + (n + 1) + '/10', '#fee761', 12); }
      if (A.FX) A.FX.burst(p.x, p.y - 8, 14, { color: ['#fee761', '#feae34', '#9be37a'], smin: 40, smax: 140, life: 0.5, z: 6, vz: 100, g: 380 });
      if (A.Sound.gulp) A.Sound.gulp();
      break;
    }
  }

  // ---------- Zeichnen im Retro-Look (dr.b = Bild, dr.g = Leuchten) ----------
  const ell = (c, x, y, r, fill) => { c.beginPath(); c.ellipse(Math.round(x), Math.round(y), Math.max(1, r), Math.max(1, r * EY), 0, 0, TAU); if (fill) c.fill(); else c.stroke(); };
  function drawGround(dr, w, cx, cy) {
    const list = w.legfx; if (!list || !list.length) return;
    const b = dr.b, g = dr.g, t = dr.t;
    for (const o of list) {
      const x = o.x / PX - cx, y = o.y / PX - cy;
      if (o.kind === 'ink') {
        const life = clamp((o.until - w.t) / 0.6, 0, 1) * clamp((w.t - o.t0) / 0.2, 0, 1), R = o.r / PX;
        b.globalAlpha = 0.42 * life; b.fillStyle = '#181425'; ell(b, x, y, R, true);
        b.globalAlpha = 0.3 * life; b.fillStyle = '#2e2a4a';
        for (let i = 0; i < 6; i++) { const a = i / 6 * TAU + t * 0.4, rr = R * 0.55; ell(b, x + Math.cos(a) * rr, y + Math.sin(a) * rr * EY, R * 0.45, true); }
        g.globalAlpha = 0.25 * life; g.strokeStyle = '#68386c'; g.lineWidth = 1; ell(g, x, y, R);
      } else if (o.kind === 'rift') {
        const p = clamp((w.t - o.t0) / (o.at - o.t0), 0, 1), R = o.r / PX;
        b.globalAlpha = 0.5; b.fillStyle = '#181425'; ell(b, x, y, 3 + p * 10, true);
        g.globalAlpha = 0.5 + 0.3 * Math.sin(t * 20); g.strokeStyle = '#b55088'; g.lineWidth = 1; ell(g, x, y, R * (1 - p * 0.7));
        g.fillStyle = '#e0a4ff'; for (let i = 0; i < 10; i++) { const a = -t * (3 + p * 6) + i / 10 * TAU, rr = R * (0.35 + 0.65 * ((i * 0.37 + t * 0.8) % 1)) * (1 - p * 0.6); g.globalAlpha = 0.8; g.fillRect(Math.round(x + Math.cos(a) * rr), Math.round(y + Math.sin(a) * rr * EY), 1, 1); }
      } else if (o.kind === 'anvil' && !o.hit) {   // Schatten wächst, Warnkreis
        const p = clamp((w.t - o.t0) / (o.at - o.t0), 0, 1);
        b.globalAlpha = 0.2 + p * 0.4; b.fillStyle = '#08060e'; ell(b, x, y + 2, 3 + p * 8, true);
        g.globalAlpha = 0.6 + 0.3 * Math.sin(t * 24); g.strokeStyle = '#c0cbdc'; g.lineWidth = 1; ell(g, x, y + 2, 14);
      } else if (o.kind === 'duck') {
        const spr = A.Art.sprite('duck'), sq = o.squash != null && w.t - o.squash < 0.15, end = o.until - w.t;
        dr.shadow(x, y, 4);
        const blink = end < 0.8 && Math.floor(t * (10 + (0.8 - end) * 30)) % 2;
        dr.blit(spr, x, y + 1, false, { sx: sq ? 1.3 : 1, sy: sq ? 0.65 : 1, white: blink });
      }
    }
    b.globalAlpha = 1; g.globalAlpha = 1;
  }
  function drawTop(dr, w, cx, cy) {
    const list = w.legfx; if (!list || !list.length) return;
    const b = dr.b, g = dr.g;
    for (const o of list) {
      const x = o.x / PX - cx, y = o.y / PX - cy;
      if (o.kind === 'anvil') {
        const spr = A.Art.sprite('i_amboss');
        if (!o.hit) { const p = clamp((w.t - o.t0) / (o.at - o.t0), 0, 1), up = (1 - p * p) * 90; dr.blit(spr, x, y - up, false, { sx: 1.4, sy: 1.4 }); }
        else { const k = clamp((o.until - w.t) / 0.5, 0, 1); dr.blit(spr, x, y + 2, false, { sx: 1.4, sy: 1.4 * (0.85 + 0.15 * k), alpha: k }); }
      } else if (o.kind === 'mirror') {
        const run = A.Game.run; if (!run) continue;
        const spr = A.Art.heroSprite(run.race, run.cls, 0), k = clamp((o.until - w.t) / 0.45, 0, 1);
        dr.blit(spr, x, y + 7, o.flip, { white: true, alpha: 0.55 * k });
        g.globalAlpha = 0.4 * k; g.fillStyle = '#ffffff'; g.fillRect(Math.round(x) - 1, Math.round(y - 14), 2, 2); g.globalAlpha = 1;
      }
    }
    b.globalAlpha = 1;
  }
  // Pudding im Retro-Look: goldener Schleim mit kleiner Krone, wächst mit jedem Happen
  function drawAlly(dr, a, cx, cy) {
    if (a.leg !== 'pudding') return false;
    const b = dr.b, w = W(), x = a.x / PX - cx, y = a.y / PX - cy + 7, t = dr.t;
    const spr = A.Art.sprite('pudding', 0), sz = a.size || 1, flip = a.fx < 0;
    const q = Math.sin(t * 8 + a.x * 0.1), gul = a.gulp != null && w.t - a.gulp < 0.3 ? 1 - (w.t - a.gulp) / 0.3 : 0;
    let alpha = 1; if (a.spawn > 0) alpha = clamp(1 - a.spawn / 0.35, 0, 1);
    let ox = 0; if (a.swing > 0) ox = a.fx * Math.sin((1 - a.swing / 0.2) * Math.PI) * 3;
    const sx = sz * (1 + q * 0.08 + gul * 0.35), sy = sz * (1 - q * 0.1 - gul * 0.2);
    dr.shadow(x, y, 5 * sz);
    dr.outlineGlow(spr, x + ox, y, flip, '#feae34', sz);
    dr.blit(spr, x + ox, y, flip, { sx, sy, alpha });
    const cr = A.Art.sprite('crown'), cs = a.royal ? 2 : 1;   // Königsfamilie: die grosse Krone
    b.drawImage(cr.img, Math.round(x + ox - cr.w * cs / 2), Math.round(y - spr.h * sy - cr.h * cs + 3 + cs), cr.w * cs, cr.h * cs);
    return true;
  }
  // Licht im Dunkeln
  function lights(w, Lt) {
    const h = w.hero;
    for (const o of w.legfx || []) {
      if (o.kind === 'rift') Lt(o.x, o.y, o.r / PX, '#b55088', 0.35 + 0.25 * clamp((w.t - o.t0) / (o.at - o.t0), 0, 1));
      else if (o.kind === 'anvil' && !o.hit) Lt(o.x, o.y, 22, '#c0cbdc', 0.3);
      else if (o.kind === 'duck') Lt(o.x, o.y - 6, 18, '#fee761', 0.4);
    }
    for (const a of w.allies || []) if (a.leg === 'pudding') Lt(a.x, a.y - 8, a.royal ? 40 : 30, '#feae34', a.royal ? 0.6 : 0.45);
    if (h && h.alive && has(h, 'grillschuerze')) Lt(h.x, h.y, 50, '#f77622', 0.25 + Math.sin(w.t * 9) * 0.05);
    if (stopped()) Lt(h.x, h.y, 140, '#feae34', 0.12);
  }
  // Oberfläche: Zeitstopp färbt das Bild sandig
  function overlay(dr, w) {
    if (!stopped()) return;
    const c = dr.ctx, s = w.legStop, k = clamp(Math.min((w.t - s.t0) / 0.15, (s.until - w.t) / 0.3), 0, 1);
    c.globalAlpha = 1; c.fillStyle = `rgba(228,166,114,${0.16 * k})`; c.fillRect(0, 0, dr.dw, dr.dh);
  }

  return { bind, worn, apply, hint, pre, guard, onHit, onKill, onHurt, onSkill, onAttack, onRoomStart, atkMul, moveMul, overheal, lure, stopped, tick, drawGround, drawTop, drawAlly, lights, overlay, roll };
})();
