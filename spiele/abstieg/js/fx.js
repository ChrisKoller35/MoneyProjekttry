// Der Abstieg – Effekte: Funken, Rauch, Flecken am Boden, kurze Lichtblitze, Bildschirmwackeln,
// Treffer-Pause (das Spiel hält bei harten Treffern ganz kurz an), Einblendungen. Ruft auch die Töne auf.
'use strict';
window.A = window.A || {};

A.FX = (function () {
  const P = [];            // Teilchen (Weltkoordinaten)
  const flashes = [];      // kurze Lichter
  const banners = [];      // grosse Einblendungen
  let decals = [];         // Flecken, die der Zeichner in den Boden malt
  let trauma = 0, stopT = 0, slowT = 0, hurtT = 0, healT = 0, lowFx = false, t = 0;
  const MAX = 420;
  const rnd = (a, b) => a + Math.random() * (b - a);
  const S = () => A.Sound;
  // Farben je Gegner (Fleck und Splitter)
  const GORE = {
    schleimer: ['#63c74d', '#3e8948', '#c8f5a0'], schleimkoenig: ['#63c74d', '#3e8948', '#265c42'],
    ratte: ['#a22633', '#e43b44', '#b86f50'], fledermaus: ['#a22633', '#68386c', '#b55088'],
    pilzkrieger: ['#b55088', '#ead4aa', '#68386c'], knochen: ['#ead4aa', '#c0cbdc', '#8b9bb4'],
    glutmotte: ['#f77622', '#feae34', '#fee761'], spinne: ['#63c74d', '#3a4466', '#262b44'],
    rostgolem: ['#be4a2f', '#d77643', '#733e39'], rostkoenig: ['#a22633', '#e43b44', '#feae34'],
    schattenfaenger: ['#68386c', '#b55088', '#262b44'], spiegelgeist: ['#c0cbdc', '#ffffff', '#0099db'],
    tunnelwurm: ['#a22633', '#b86f50', '#733e39'], kobolddieb: ['#a22633', '#e4a672', '#feae34'],
  };
  const gore = (e) => GORE[e.mid] || ['#a22633', '#e43b44', '#c0cbdc'];

  function part(o) {
    if (P.length >= (lowFx ? MAX / 2 : MAX)) P.shift();
    const p = Object.assign({ x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, g: 0, drag: 2, life: 0.5, size: 1, color: '#fff', add: false, kind: 'px', stick: false, grow: 0 }, o);
    p.max = p.life; P.push(p); return p;
  }
  // Teilchen in alle Richtungen (oder in eine Richtung dir mit Streuung spread)
  function burst(x, y, n, o) {
    for (let i = 0; i < n; i++) {
      const a = o.dir != null ? o.dir + rnd(-(o.spread || 0.8), o.spread || 0.8) : Math.random() * Math.PI * 2;
      const sp = rnd(o.smin || 40, o.smax || 160);
      part(Object.assign({}, o, { x: x + rnd(-2, 2), y: y + rnd(-2, 2), vx: Math.cos(a) * sp, vy: Math.sin(a) * sp * 0.75, vz: o.vz != null ? rnd(o.vz * 0.5, o.vz) : 0, z: o.z || 0, color: Array.isArray(o.color) ? o.color[Math.floor(Math.random() * o.color.length)] : o.color, life: rnd((o.life || 0.5) * 0.6, o.life || 0.5), size: o.size || (Math.random() < 0.3 ? 2 : 1) }));
    }
  }
  function smoke(x, y, n, color, size) { for (let i = 0; i < n; i++) part({ kind: 'smoke', x: x + rnd(-6, 6), y: y + rnd(-4, 4), vx: rnd(-20, 20), vy: rnd(-25, -5), life: rnd(0.35, 0.6), size: size || rnd(3, 5), grow: 8, color: color || '#8b9bb4', drag: 3 }); }
  function flash(x, y, r, color, life) { flashes.push({ x, y, r, color, life, max: life }); }
  function shake(a) { trauma = Math.min(1, trauma + a); }
  function freeze(s) { stopT = Math.max(stopT, s); }
  function banner(text, sub, color, life) { banners.length = 0; banners.push({ text, sub, color: color || '#fee761', life: life || 1.8, max: life || 1.8 }); }
  function decal(x, y, kind, color, r) { decals.push({ x, y, kind, color, r: r || 3 }); }

  // ---------- Ereignisse aus der Spielwelt ----------
  const throttle = {};
  function once(k, ms) { const n = performance.now(); if (throttle[k] && n - throttle[k] < ms) return false; throttle[k] = n; return true; }
  function ev(name, d) {
    d = d || {};
    switch (name) {
      case 'hit': {
        const to = d.to, from = d.from || {};
        const dir = from.x != null ? Math.atan2(to.y - from.y, to.x - from.x) : null;
        if (d.kind === 'poison' || d.kind === 'burn') { burst(to.x, to.y - 8, 3, { color: d.kind === 'poison' ? ['#63c74d', '#3e8948'] : ['#f77622', '#feae34'], smin: 10, smax: 40, life: 0.5, vz: 30, g: 0, add: d.kind === 'burn' }); return; }
        if (to.side === 'hero') {
          burst(to.x, to.y - 6, 8, { color: ['#e43b44', '#a22633', '#ff0044'], smin: 50, smax: 140, life: 0.4, dir, spread: 1.2, z: 8, vz: 90, g: 380, stick: true });
          if (d.kind === 'magic') { const c = d.color || '#c77dff'; part({ kind: 'ring', x: to.x, y: to.y - 6, life: 0.28, size: 36, color: c, add: true }); burst(to.x, to.y - 6, 10, { color: [c, '#ffffff'], smin: 60, smax: 180, life: 0.3, add: true, kind: 'spark', drag: 5 }); flash(to.x, to.y - 6, 60, c, 0.2); }
          hurtT = 0.45; shake(0.38); freeze(0.05); S().hurt(); return;
        }
        const g = gore(to);
        burst(to.x, to.y - 6, d.crit ? 12 : 6, { color: ['#ffffff', '#fee761', '#feae34'], smin: 80, smax: d.crit ? 260 : 180, life: 0.22, dir, spread: 0.9, add: true, kind: 'spark', drag: 6 });
        burst(to.x, to.y - 4, d.crit ? 9 : 5, { color: g, smin: 40, smax: 140, life: 0.6, dir, spread: 1.1, z: 6, vz: 110, g: 420, stick: true });
        flash(to.x, to.y - 6, d.crit ? 46 : 30, d.crit ? '#feae34' : '#ffffff', 0.09);
        if (d.kind === 'magic') { // Zauber-Einschlag: farbiger Ring, Sternfunken, Glut, die nach oben steigt
          const c = d.color || '#7fd8ff';
          part({ kind: 'ring', x: to.x, y: to.y - 6, life: 0.28, size: 40, color: c, add: true });
          part({ kind: 'ring', x: to.x, y: to.y - 6, life: 0.16, size: 22, color: '#ffffff', add: true });
          burst(to.x, to.y - 6, 12, { color: [c, c, '#ffffff'], smin: 60, smax: 200, life: 0.3, add: true, kind: 'spark', drag: 5 });
          burst(to.x, to.y - 6, 6, { color: [c, '#ffffff'], smin: 5, smax: 30, vz: 70, g: -60, life: 0.7, add: true });
          flash(to.x, to.y - 6, 70, c, 0.22);
        }
        if (from.side === 'hero') { freeze(d.crit ? 0.075 : (d.kind === 'magic' ? 0.02 : 0.035)); shake(d.crit ? 0.28 : 0.1); }
        S().hit(d.crit);
        return;
      }
      case 'miss': smoke(d.to.x, d.to.y, 2, '#c0cbdc', 2); S().miss(); return;
      case 'death': {
        const e = d.e, g = gore(e), big = e.boss ? 3 : e.elite ? 1.6 : 1;
        burst(e.x, e.y - 6, Math.round(16 * big), { color: g, smin: 50, smax: 200 * Math.min(1.6, big), life: 0.8, z: 8, vz: 160, g: 420, stick: true, size: 2 });
        burst(e.x, e.y - 6, Math.round(10 * big), { color: ['#ffffff', '#fee761'], smin: 60, smax: 240, life: 0.3, add: true, kind: 'spark', drag: 5 });
        smoke(e.x, e.y, Math.round(4 * big), '#5a6988', e.boss ? 8 : 4);
        decal(e.x, e.y + 6, e.mid === 'knochen' ? 'bones' : 'splat', g[0], e.boss ? 12 : e.elite ? 7 : 5);
        flash(e.x, e.y, 60 * big, g[0], 0.18);
        shake(e.boss ? 1 : 0.22); freeze(e.boss ? 0.2 : 0.05); if (e.boss) slowT = 1.3;
        S().die(e.boss);
        return;
      }
      case 'spawn': { const m = d.m; part({ kind: 'rune', x: m.x, y: m.y + 8, life: 0.7, size: m.boss ? 22 : 12, color: m.boss ? '#e43b44' : '#b55088', add: true }); smoke(m.x, m.y, 3, '#68386c', 4); if (once('spawn', 200)) S().spawn(); return; }
      case 'appear': { const m = d.m; burst(m.x, m.y - 6, 10, { color: ['#b55088', '#f6757a', '#68386c'], smin: 30, smax: 120, life: 0.5, add: true, kind: 'spark' }); smoke(m.x, m.y, 4, '#3a4466', 5); return; }
      case 'lock': shake(0.35); S().lock(); return;
      case 'cleared': S().cleared(); setTimeout(() => S().open(), 250); banner(A.LANG === 'de' ? 'Raum gesäubert' : 'Room cleared', null, '#fee761', 1.4); return;
      case 'swing': if (d.magic) S().cast(); else S().swing(); return;
      case 'shoot': {
        const f = d.from;
        if (d.magic && f) { // Zauber-Blitz an der Hand: kleine Rune, Funken in Schussrichtung, Lichtblitz
          const x = f.x + (d.dx || 0) * 14, y = f.y - 12 + (d.dy || 0) * 8, c = d.color || '#7fd8ff';
          burst(x, y, f.side === 'hero' ? 8 : 4, { color: [c, '#ffffff'], smin: 40, smax: 130, life: 0.22, dir: Math.atan2(d.dy || 0, d.dx || 1), spread: 0.7, add: true, kind: 'spark', drag: 6 });
          part({ kind: 'ring', x, y, life: 0.18, size: 22, color: c, add: true });
          if (f.side === 'hero') part({ kind: 'rune', x: f.x, y: f.y + 10, life: 0.4, size: 9, color: c, add: true });
          flash(x, y, f.side === 'hero' ? 44 : 30, c, 0.12);
        }
        if (f && f.side === 'hero') { if (d.magic) S().cast(); else S().shoot(); } else if (once('eshot', 120)) S().shoot(); return;
      }
      case 'coin': S().coin(); burst(d.x, d.y - 10, 3, { color: ['#fee761', '#ffffff'], smin: 20, smax: 60, life: 0.3, add: true, kind: 'spark' }); return;
      case 'pickPotion': S().potion(); return;
      case 'drop': S().drop(d.rarity); if (d.rarity === 'epic' || d.rarity === 'legendary') { flash(d.x, d.y, 90, d.color, 0.5); burst(d.x, d.y, 16, { color: [d.color, '#ffffff'], smin: 40, smax: 160, life: 0.6, add: true, kind: 'spark' }); } return;
      case 'pickItem': S().loot(d.rarity); return;
      case 'level': {
        const h = d.h; S().level(); shake(0.2);
        for (let i = 0; i < 40; i++) part({ kind: 'spark', add: true, x: h.x + rnd(-14, 14), y: h.y + rnd(-4, 8), vx: rnd(-10, 10), vy: rnd(-160, -60), life: rnd(0.6, 1.1), color: Math.random() < 0.5 ? '#fee761' : '#feae34', drag: 1 });
        part({ kind: 'ring', x: h.x, y: h.y, life: 0.6, size: 70, color: '#fee761', add: true });
        flash(h.x, h.y, 120, '#fee761', 0.8);
        banner((A.LANG === 'de' ? 'Stufe ' : 'Level ') + d.level, A.LANG === 'de' ? 'Werte verteilen: Helden-Knopf' : 'Spend points: hero button', '#fee761', 2.2);
        return;
      }
      case 'heal': { const e = d.e; if (d.n < 3 && !d.loud) return; burst(e.x, e.y, 8, { color: ['#63c74d', '#c8f5a0'], smin: 10, smax: 40, vz: 80, z: 4, g: -40, life: 0.8, add: true, kind: 'plus' }); healT = 0.35; if (d.loud) S().heal(); return; }
      case 'shield': part({ kind: 'ring', x: d.e.x, y: d.e.y, life: 0.45, size: 46, color: '#2ce8f5', add: true }); flash(d.e.x, d.e.y, 60, '#2ce8f5', 0.3); S().shield(); return;
      case 'buff': burst(d.e.x, d.e.y, 18, { color: ['#e43b44', '#feae34', '#fee761'], smin: 40, smax: 120, life: 0.5, add: true, kind: 'spark' }); S().buff(); return;
      case 'nova': { // Flächenzauber / Wirbel: zwei Wellen, Bodenrune, Funkenkranz, bei Feuer aufsteigende Glut
        const e = d.e, R = d.r || 170, c = d.color || '#ffffff';
        part({ kind: 'ring', x: e.x, y: e.y, life: 0.35, size: R, color: c, add: true });
        part({ kind: 'ring', x: e.x, y: e.y, life: 0.55, size: R * 1.15, color: '#ffffff', add: true });
        if (d.magic) part({ kind: 'rune', x: e.x, y: e.y + 10, life: 0.7, size: 26, color: c, add: true });
        for (let i = 0; i < 28; i++) { const a = i / 28 * Math.PI * 2, sp = rnd(220, 320); part({ kind: 'spark', add: true, x: e.x + Math.cos(a) * 14, y: e.y + Math.sin(a) * 10, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp * 0.6, life: rnd(0.25, 0.4), color: i % 3 ? c : '#ffffff', drag: 4 }); }
        if (d.magic) for (let i = 0; i < 18; i++) { const a = Math.random() * Math.PI * 2, rr = rnd(20, R * 0.9); part({ add: true, x: e.x + Math.cos(a) * rr, y: e.y + Math.sin(a) * rr * 0.6, vx: rnd(-8, 8), vy: 0, vz: rnd(40, 90), z: 2, life: rnd(0.6, 1.1), color: Math.random() < 0.5 ? c : '#fee761', size: Math.random() < 0.3 ? 2 : 1, drag: 1 }); }
        else smoke(e.x, e.y + 8, 6, '#8b9bb4', 4);
        flash(e.x, e.y, R * 0.9, c, 0.3); shake(0.3); S().nova(); return;
      }
      case 'potion': burst(d.e.x, d.e.y - 10, 12, { color: ['#e43b44', '#f6757a', '#ffffff'], smin: 10, smax: 50, vz: 60, g: -30, life: 0.7, add: true }); S().potion(); return;
      case 'step': part({ kind: 'smoke', x: d.e.x + rnd(-4, 4), y: d.e.y + 14, vx: -d.e.fx * 15, vy: rnd(-8, 0), life: 0.35, size: 2, grow: 4, color: '#8b9bb4', drag: 4 }); return;
      case 'windup': if (once('windup', 160)) S().windup(); return;
      case 'strike': { // Gegner schlägt zu: Staub am Boden, beim Boss Erdstoss mit Wackeln
        const m = d.m; smoke(m.x + m.fx * 14, m.y + 10, m.boss ? 8 : 2, '#8b9bb4', m.boss ? 6 : 3);
        if (m.boss) { part({ kind: 'ring', x: m.x + m.fx * 20, y: m.y + 10, life: 0.4, size: 90, color: '#feae34', add: true }); burst(m.x + m.fx * 20, m.y + 6, 14, { color: ['#c0cbdc', '#8b9bb4', '#733e39'], smin: 60, smax: 180, life: 0.6, z: 2, vz: 120, g: 420 }); shake(0.45); }
        return;
      }
      case 'ignite': S().ignite(); return;
      case 'wallhit': burst(d.x, d.y, 5, { color: [d.color || '#ffffff', '#ffffff'], smin: 30, smax: 100, life: 0.25, add: true, kind: 'spark', drag: 4 }); return;
      case 'stun': return;
    }
  }

  function update(dt) {
    t += dt;
    trauma = Math.max(0, trauma - dt * 1.6); hurtT = Math.max(0, hurtT - dt); healT = Math.max(0, healT - dt);
    for (const p of P) {
      p.life -= dt;
      p.x += p.vx * dt; p.y += p.vy * dt; const k = Math.max(0, 1 - p.drag * dt); p.vx *= k; p.vy *= k;
      if (p.g) { p.vz -= p.g * dt; p.z += p.vz * dt; if (p.z <= 0 && p.g > 0) { if (p.stick) { decal(p.x, p.y, 'drop', p.color, p.size); p.life = 0; } else { p.z = 0; p.vz = -p.vz * 0.4; } } }
      else if (p.vz) p.z += p.vz * dt;
      if (p.grow) p.size += p.grow * dt;
    }
    for (let i = P.length - 1; i >= 0; i--) if (P[i].life <= 0) P.splice(i, 1);
    for (const f of flashes) f.life -= dt; for (let i = flashes.length - 1; i >= 0; i--) if (flashes[i].life <= 0) flashes.splice(i, 1);
    for (const b of banners) b.life -= dt; for (let i = banners.length - 1; i >= 0; i--) if (banners[i].life <= 0) banners.splice(i, 1);
  }
  // Spielzeit für diesen Schritt: 0 während der Treffer-Pause, langsamer bei Zeitlupe
  function simDt(dt) {
    if (stopT > 0) { stopT -= dt; return 0; }
    if (slowT > 0) { slowT -= dt; return dt * 0.35; }
    return dt;
  }
  function reset() { P.length = 0; flashes.length = 0; banners.length = 0; decals = []; trauma = 0; stopT = 0; slowT = 0; hurtT = 0; }
  function takeDecals() { const d = decals; decals = []; return d; }
  return {
    P, flashes, banners, ev, update, simDt, reset, takeDecals, burst, smoke, part, flash, shake, freeze, banner, decal,
    get trauma() { return trauma; }, get hurt() { return hurtT; }, get healGlow() { return healT; },
    set low(v) { lowFx = v; }, get low() { return lowFx; },
  };
})();
