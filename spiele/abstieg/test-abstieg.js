// Browser-Test: steuert den Helden automatisch durch die Ebenen (läuft zu Gegnern, schlägt, nutzt Fähigkeiten,
// benutzt Truhen/Feuer/Treppe), macht Bildschirmfotos, meldet Fehler.
// Aufruf: node test-abstieg.js <bilder-ordner> [playwright-pfad] [chromium-pfad] [retro|3d]
const path = require('path'), fs = require('fs');
const out = process.argv[2] || '.';
const pw = require(process.argv[3] || '/opt/node-tools/node_modules/playwright');
const exe = process.argv[4] || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const look = process.argv[5] || 'retro';
const file = 'file://' + path.join(__dirname, 'dist', 'index.html') + '?look=' + look;
fs.mkdirSync(out, { recursive: true });

(async () => {
  const browser = await pw.chromium.launch({ executablePath: exe, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, locale: 'de-CH' });
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('dialog', d => d.accept());
  const shot = (n) => page.screenshot({ path: `${out}/${n}.png` });
  await page.goto(file); await page.waitForTimeout(400);
  await shot('01-titel');
  await page.click('#bNew'); await page.waitForTimeout(200);
  await shot('02-held');
  await page.click('[data-cls="klinge"]'); await page.waitForTimeout(100);
  await page.click('#bStart'); await page.waitForTimeout(600);
  await shot('03-ebene');

  // Steuerung von aussen: wir setzen die Tasten direkt über das Eingabe-Objekt
  const setKeys = (k) => page.evaluate((k) => { const K = window.__abstieg.Wd && window.A.Input.keys; for (const n of ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'Space']) K[n] = !!k[n]; }, k);
  const state = () => page.evaluate(() => {
    const W = window.__abstieg.Wd.W, r = window.__abstieg.G.run; if (!W || !r) return null;
    const h = W.hero; const mons = W.mons.filter(m => m.alive).map(m => ({ x: m.x, y: m.y, hp: m.hp }));
    return { floor: r.floor, hp: h.hp, maxHp: h.maxHp, level: r.level, gold: r.gold, over: r.over, points: r.points, pend: r.pendingSkillPick, hx: h.x, hy: h.y, mons, near: W.near ? W.near.kind : null, paused: W.paused, active: !!W.active, room: W.room ? { type: W.room.type, cleared: W.room.cleared, i: W.room.i } : null, rooms: W.rooms.map(q => ({ i: q.i, cx: q.cx, cy: q.cy, type: q.type, cleared: q.cleared, used: q.used, visited: q.visited, x: q.x, y: q.y, w: q.w, h: q.h, props: q.props.map(p => ({ kind: p.kind, x: p.x, y: p.y, used: p.used, hidden: p.hidden })) })), edges: W.edges, ov: document.getElementById('overlay').classList.contains('on'), picks: W.picks.map(p => ({ x: p.x, y: p.y, kind: p.kind })) };
  });
  const TS = 32;
  // Ziel: Punkt in Weltkoordinaten; wir laufen in Richtung Zielpunkt (mit Tür-Zwischenzielen)
  function doorBetween(a, b) { const r = a, q = b; if (r.cy === q.cy) { const l = Math.min(r.cx, q.cx); return { x: (l * 15 + 15) * TS, y: (r.cy * 11 + 6) * TS }; } const t = Math.min(r.cy, q.cy); return { x: (r.cx * 15 + 8) * TS, y: (t * 11 + 11) * TS }; }
  function roomCenter(r) { return { x: (r.x + r.w / 2) * TS, y: (r.y + r.h / 2) * TS }; }
  async function walkTo(tx, ty, maxMs) {
    const t0 = Date.now();
    while (Date.now() - t0 < maxMs) {
      const s = await state(); if (!s || s.over) return s;
      if (s.ov) return s;
      const dx = tx - s.hx, dy = ty - s.hy; if (Math.hypot(dx, dy) < 14) { await setKeys({}); return s; }
      // Gegner in der Nähe? Dann kämpfen.
      const m = s.mons.map(m => ({ m, d: Math.hypot(m.x - s.hx, m.y - s.hy) })).sort((a, b) => a.d - b.d)[0];
      if (m && m.d < 260) { const ex = m.m.x - s.hx, ey = m.m.y - s.hy; const close = m.d < 44; await setKeys({ KeyD: !close && ex > 8, KeyA: !close && ex < -8, KeyS: !close && ey > 8, KeyW: !close && ey < -8, Space: true }); await page.evaluate(() => { for (let i = 0; i < 3; i++) window.__abstieg.Wd.useSkill(i); }); if (s.hp < s.maxHp * 0.35) await page.evaluate(() => window.__abstieg.Wd.usePotion()); await page.waitForTimeout(80); continue; }
      await setKeys({ KeyD: dx > 6, KeyA: dx < -6, KeyS: dy > 6, KeyW: dy < -6, Space: false });
      await page.waitForTimeout(60);
    }
    await setKeys({}); return await state();
  }
  async function closeOverlays(tag) {
    for (let i = 0; i < 6; i++) {
      const s = await state(); if (!s || !s.ov) return;
      const sel = ['#overlay [data-pick]', '#overlay #bEq', '#overlay #bHeal', '#overlay [data-c]', '#overlay #bOk', '#overlay #bClose'].map(q => q + ':not([disabled])');
      let done = false;
      for (const q of sel) { const l = page.locator(q); if (await l.count()) { if (tag && !shots[tag]) { shots[tag] = 1; await shot(tag); } await l.first().click(); await page.waitForTimeout(150); done = true; break; } }
      if (!done) { await shot('xx-overlay'); log.push('unbekanntes Overlay'); return; }
    }
  }
  const shots = {}, log = []; let kills = 0, floorsSeen = 1;
  const t0 = Date.now();
  outer: while (Date.now() - t0 < 150000) {
    let s = await state(); if (!s) break; if (s.over) break;
    if (s.ov) { await closeOverlays(s.near === 'stairs' ? '09-abstieg' : (await page.locator('#overlay [data-pick]').count()) ? '08-faehigkeit' : (await page.locator('#overlay #bEq').count()) ? '06-gefunden' : null); continue; }
    if (s.points > 0 && !shots.sheet) { shots.sheet = 1; await page.keyboard.press('KeyI'); await page.waitForTimeout(200); await shot('07-heldenblatt'); const b = page.locator('#overlay [data-sp]'); while (await b.count()) { await b.first().click(); await page.waitForTimeout(60); } await page.click('#bClose'); await page.waitForTimeout(150); continue; }
    if (s.floor > floorsSeen) { floorsSeen = s.floor; await page.waitForTimeout(300); await shot('10-ebene' + s.floor); }
    // Zielraum: unbesuchter oder unbenutzter Raum, zuletzt Treppe
    const cur = s.rooms.find(r => r.i === s.room.i);
    if (s.active) { const m = s.mons[0]; if (m) { await walkTo(m.x, m.y, 4000); } else await page.waitForTimeout(100); if (!shots.kampf) { shots.kampf = 1; await page.waitForTimeout(200); await shot('05-kampf'); } continue; }
    // Beute aufheben
    if (s.picks.length) { const p = s.picks[0]; await walkTo(p.x, p.y, 3000); continue; }
    // Etwas benutzen?
    const prop = cur.props.find(p => !p.used && !p.hidden && p.kind !== 'sign' && (p.kind !== 'stairs' || s.rooms.every(r => r.type !== 'fight' && r.type !== 'elite' || r.cleared || !adjacentReachable(r))));
    function adjacentReachable() { return true; }
    const todo = s.rooms.filter(r => r.i !== cur.i && (!r.visited || (['treasure', 'rest', 'event'].includes(r.type) && !r.used) || (['fight', 'elite', 'boss'].includes(r.type) && !r.cleared)));
    const stairsOk = s.rooms.every(r => !['fight', 'elite', 'boss'].includes(r.type) || r.cleared);
    if (prop && (prop.kind !== 'stairs' || stairsOk || todo.length === 0)) {
      await walkTo(prop.x, prop.y + 30, 5000);
      s = await state(); if (s && s.near) { if (prop.kind === 'merchant' && !shots.shop) { shots.shop = 1; } await page.keyboard.press('KeyE'); await page.waitForTimeout(200); if (prop.kind === 'merchant') { await shot('11-haendler'); const buy = page.locator('#overlay [data-buy]:not([disabled])'); if (await buy.count()) { await buy.first().click(); await page.waitForTimeout(100); } await page.click('#bClose'); await page.waitForTimeout(150); cur.props[0].used = true; await page.evaluate(() => { const W = window.__abstieg.Wd.W; W.near && (W.near.used = true); }); } }
      continue;
    }
    // Nächsten Raum ansteuern (Nachbar bevorzugt, sonst über Kanten laufen)
    const target = todo.sort((a, b) => (Math.abs(a.cx - cur.cx) + Math.abs(a.cy - cur.cy)) - (Math.abs(b.cx - cur.cx) + Math.abs(b.cy - cur.cy)))[0];
    if (!target) { const st = s.rooms.flatMap(r => r.props).find(p => p.kind === 'stairs' && !p.hidden); if (st) { const rr = s.rooms.find(r => r.props.includes(st)); await goRoom(s, cur, rr); await walkTo(st.x, st.y + 30, 5000); const s2 = await state(); if (s2 && s2.near === 'stairs') { await page.keyboard.press('KeyE'); await page.waitForTimeout(200); } continue; } log.push('nichts mehr zu tun'); break; }
    await goRoom(s, cur, target);
  }
  async function goRoom(s, cur, target) {
    // Weg über Kanten (Breitensuche)
    const key = (r) => r.cx + ',' + r.cy; const adj = {}; for (const [p, q] of s.edges) { (adj[p.x + ',' + p.y] = adj[p.x + ',' + p.y] || []).push(q.x + ',' + q.y); (adj[q.x + ',' + q.y] = adj[q.x + ',' + q.y] || []).push(p.x + ',' + p.y); }
    const prev = { [key(cur)]: null }; const qq = [key(cur)];
    while (qq.length) { const k = qq.shift(); for (const n of adj[k] || []) if (!(n in prev)) { prev[n] = k; qq.push(n); } }
    const pathK = []; let k = key(target); if (!(k in prev)) { log.push('kein Weg'); return; } while (k) { pathK.unshift(k); k = prev[k]; }
    for (let i = 1; i < pathK.length; i++) {
      const a = s.rooms.find(r => key(r) === pathK[i - 1]), b = s.rooms.find(r => key(r) === pathK[i]);
      const d = doorBetween(a, b); const ca = roomCenter(a), cb = roomCenter(b);
      // zur Tür hin (erst auf Türlinie), dann hindurch, dann zur Raummitte
      if (a.cy === b.cy) { await walkTo(ca.x, d.y, 4000); await walkTo(d.x, d.y, 4000); await walkTo(cb.x, d.y, 4000); } else { await walkTo(d.x, ca.y, 4000); await walkTo(d.x, d.y, 4000); await walkTo(d.x, cb.y, 4000); }
      const st = await state(); if (!st || st.over || st.ov || st.active) return;
    }
  }
  await setKeys({});
  const fin = await state();
  if (fin && fin.over || !fin) { await page.waitForTimeout(800); await shot('12-ende'); const bc = page.locator('#bCamp'); if (await bc.count()) { await bc.click(); await page.waitForTimeout(200); await shot('13-lager'); } }
  const meta = await page.evaluate(() => window.__abstieg.G.meta);
  const run = await page.evaluate(() => { const r = window.__abstieg.G.run; return r ? { floor: r.floor, level: r.level, kills: r.kills, over: r.over, hp: r.hp } : null; });
  console.log(JSON.stringify({ run, meta: { sparks: meta.sparks, runs: meta.runs, best: meta.best, kills: meta.totalKills }, log, secs: Math.round((Date.now() - t0) / 1000) }));
  console.log('errors', JSON.stringify(errors.slice(0, 5)));
  await browser.close();
  if (errors.length) process.exit(1);
})().catch(e => { console.error(e); process.exit(1); });
