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
  // Wegfindung im Spiel: Breitensuche über begehbare Kacheln vom Ziel aus, dann ein Zwischenziel mit freier Sicht
  await page.evaluate(() => {
    window.__nav = (tx, ty) => {
      const W = window.__abstieg.Wd.W, Wd = window.__abstieg.Wd, MW = Wd.MW, MH = Wd.MH, TS = Wd.TS, h = W.hero;
      const ok = (x, y) => x >= 0 && y >= 0 && x < MW && y < MH && (W.tiles[y][x] === 1 || W.tiles[y][x] === 5);
      let gx = Math.floor(tx / TS), gy = Math.floor(ty / TS);
      if (!ok(gx, gy)) { let best = null, bd = 1e9; for (let y = gy - 4; y <= gy + 4; y++) for (let x = gx - 4; x <= gx + 4; x++) if (ok(x, y)) { const d = Math.abs(x - gx) + Math.abs(y - gy); if (d < bd) { bd = d; best = [x, y]; } } if (!best) return null; [gx, gy] = best; }
      const dist = new Int32Array(MW * MH).fill(-1), q = [gy * MW + gx]; dist[q[0]] = 0;
      for (let i = 0; i < q.length; i++) { const k = q[i], x = k % MW, y = (k - x) / MW; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy; if (!ok(nx, ny)) continue; const nk = ny * MW + nx; if (dist[nk] >= 0) continue; dist[nk] = dist[k] + 1; q.push(nk); } }
      let cx = Math.floor(h.x / TS), cy = Math.floor(h.y / TS); if (dist[cy * MW + cx] < 0) return { x: tx, y: ty, d: -1 };
      const d0 = dist[cy * MW + cx]; if (d0 <= 1) return { x: tx, y: ty, d: d0 };
      const clear = (x1, y1) => { const n = Math.ceil(Math.hypot(x1 - h.x, y1 - h.y) / 6); for (let i = 1; i <= n; i++) { const px = h.x + (x1 - h.x) * i / n, py = h.y + (y1 - h.y) * i / n; for (const [ox, oy] of [[-13, -13], [13, -13], [-13, 13], [13, 13]]) if (!ok(Math.floor((px + ox) / TS), Math.floor((py + oy) / TS))) return false; } return true; };
      let wp = null;
      for (let step = 0; step < 8; step++) {
        let nb = null, nd = dist[cy * MW + cx];
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = cx + dx, ny = cy + dy; if (!ok(nx, ny)) continue; const v = dist[ny * MW + nx]; if (v >= 0 && v < nd) { nd = v; nb = [nx, ny]; } }
        if (!nb) break; [cx, cy] = nb;
        const px = (cx + 0.5) * TS, py = (cy + 0.5) * TS;
        if (!wp || clear(px, py)) wp = { x: px, y: py, d: d0 }; else break;
      }
      return wp || { x: tx, y: ty, d: d0 };
    };
  });
  const nav = (x, y) => page.evaluate(([x, y]) => window.__nav(x, y), [x, y]);
  const keysToward = (s, p, extra) => { const dx = p.x - s.hx, dy = p.y - s.hy; const ax = Math.abs(dx), ay = Math.abs(dy); return Object.assign({ KeyD: dx > 3 && ax > ay * 0.3, KeyA: dx < -3 && ax > ay * 0.3, KeyS: dy > 3 && ay > ax * 0.3, KeyW: dy < -3 && ay > ax * 0.3 }, extra || {}); };
  async function walkTo(tx, ty, maxMs) {
    const t0 = Date.now();
    while (Date.now() - t0 < maxMs) {
      const s = await state(); if (!s || s.over) return s;
      if (s.ov) return s;
      if (Math.hypot(tx - s.hx, ty - s.hy) < 14) { await setKeys({}); return s; }
      // Gegner in der Nähe? Dann kämpfen (über den Weg um Hindernisse herum).
      const m = s.mons.map(m => ({ m, d: Math.hypot(m.x - s.hx, m.y - s.hy) })).sort((a, b) => a.d - b.d)[0];
      if (m && m.d < 260) {
        const close = m.d < 44; const p = close ? null : await nav(m.m.x, m.m.y);
        await setKeys(close || !p ? { Space: true } : keysToward(s, p, { Space: true }));
        await page.evaluate(() => { for (let i = 0; i < 4; i++) window.__abstieg.Wd.useSkill(i); });
        if (s.hp < s.maxHp * 0.35) await page.evaluate(() => window.__abstieg.Wd.usePotion());
        await page.waitForTimeout(80); continue;
      }
      const p = await nav(tx, ty); if (!p) { await setKeys({}); return s; }
      await setKeys(keysToward(s, p, { Space: false }));
      await page.waitForTimeout(60);
    }
    await setKeys({}); return await state();
  }
  async function closeOverlays(tag) {
    for (let i = 0; i < 6; i++) {
      const s = await state(); if (!s || !s.ov) return;
      const sel = ['#overlay [data-b]', '#overlay [data-rep]', '#overlay #bBook', '#overlay [data-pick]', '#overlay #bEq', '#overlay #bHeal', '#overlay [data-c]', '#overlay #bOk', '#overlay #bClose'].map(q => q + ':not([disabled])');
      let done = false;
      for (const q of sel) { const l = page.locator(q); if (await l.count()) { if (tag && !shots[tag]) { shots[tag] = 1; await shot(tag); } await l.first().click(); await page.waitForTimeout(150); done = true; break; } }
      if (!done) { await shot('xx-overlay'); log.push('unbekanntes Overlay'); return; }
    }
  }
  const shots = {}, log = []; let kills = 0, floorsSeen = 1;
  const t0 = Date.now();
  outer: while (Date.now() - t0 < 240000) {
    let s = await state(); if (!s) break; if (s.over) break;
    if (process.env.DBG && global.__lp === Math.round(s.hx) + ',' + Math.round(s.hy) && !s.ov && !(global.__dumped > 2) && Date.now() - t0 > 20000) { global.__dumped = (global.__dumped || 0) + 1; const dump = await page.evaluate(() => { const W = window.__abstieg.Wd.W, h = W.hero, tx = Math.floor(h.x / 32), ty = Math.floor(h.y / 32); const rows = []; for (let y = ty - 6; y <= ty + 6; y++) { let r = ''; for (let x = tx - 10; x <= tx + 10; x++) r += (x === tx && y === ty) ? 'H' : (W.tiles[y] ? W.tiles[y][x] : '#'); rows.push(r); } return rows.join('\n') + '\nrooms ' + JSON.stringify(W.rooms.map(r => [r.i, r.type, r.cx, r.cy, r.visited, r.anchor])) + '\npaused ' + W.paused + ' simDt ' + window.A.FX.simDt(0.016) + ' near ' + (W.near && W.near.kind) + '\npicks ' + JSON.stringify(W.picks.map(p => [Math.round(p.x), Math.round(p.y), p.z, p.vz, p.kind])); }); console.log(dump); }
    global.__lp = Math.round(s.hx) + ',' + Math.round(s.hy);
    if (process.env.DBG) console.log('t', Math.round((Date.now() - t0) / 1000), 'hero', Math.round(s.hx), Math.round(s.hy), 'room', s.room && s.room.i, s.room && s.room.type, 'active', s.active, 'ov', s.ov, 'mons', s.mons.length, 'picks', s.picks.length);
    if (s.ov) { await closeOverlays(s.near === 'stairs' ? '09-abstieg' : (await page.locator('#overlay [data-b]').count()) ? '08-segen' : (await page.locator('#overlay [data-pick]').count()) ? '08-faehigkeit' : (await page.locator('#overlay #bEq').count()) ? '06-gefunden' : null); continue; }
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
    const todo = s.rooms.filter(r => r.i !== cur.i && (!r.visited || (['treasure', 'rest', 'event', 'shrine'].includes(r.type) && !r.used) || (['fight', 'elite', 'boss'].includes(r.type) && !r.cleared)));
    const stairsOk = s.rooms.every(r => !['fight', 'elite', 'boss'].includes(r.type) || r.cleared);
    if (prop && (prop.kind !== 'stairs' || stairsOk || todo.length === 0)) {
      await walkTo(prop.x, prop.y + 30, 5000);
      s = await state(); if (s && s.near) { if (prop.kind === 'merchant' && !shots.shop) { shots.shop = 1; } await page.keyboard.press('KeyE'); await page.waitForTimeout(200); if (prop.kind === 'merchant') { await shot('11-haendler'); const buy = page.locator('#overlay [data-buy]:not([disabled])'); if (await buy.count()) { await buy.first().click(); await page.waitForTimeout(100); } await page.click('#bClose'); await page.waitForTimeout(150); cur.props[0].used = true; await page.evaluate(() => { const W = window.__abstieg.Wd.W; W.near && (W.near.used = true); }); }
        if (prop.kind === 'forge') { await shot('14-schmiede'); const f = page.locator('#overlay [data-f="stats"]:not([disabled]), #overlay [data-f="power"]:not([disabled])'); if (await f.count()) { await f.first().click(); await page.waitForTimeout(150); await shot('14-schmiede-danach'); } await page.click('#bClose'); await page.waitForTimeout(150); await page.evaluate(() => { const W = window.__abstieg.Wd.W; W.near && (W.near.used = true); }); } }
      continue;
    }
    // Nächsten Raum ansteuern (Nachbar bevorzugt, sonst über Kanten laufen)
    const target = todo.sort((a, b) => (Math.abs(a.cx - cur.cx) + Math.abs(a.cy - cur.cy)) - (Math.abs(b.cx - cur.cx) + Math.abs(b.cy - cur.cy)))[0];
    if (!target) { const st = s.rooms.flatMap(r => r.props).find(p => p.kind === 'stairs' && !p.hidden); if (st) { const rr = s.rooms.find(r => r.props.includes(st)); await goRoom(s, cur, rr); await walkTo(st.x, st.y + 30, 5000); const s2 = await state(); if (s2 && s2.near === 'stairs') { await page.keyboard.press('KeyE'); await page.waitForTimeout(200); } continue; } log.push('nichts mehr zu tun'); break; }
    await goRoom(s, cur, target);
  }
  async function goRoom(s, cur, target) {
    const r = await page.evaluate((i) => { const q = window.__abstieg.Wd.W.rooms[i]; return { x: (q.anchor.tx + 0.5) * 32, y: (q.anchor.ty + 1.5) * 32 }; }, target.i);
    await walkTo(r.x, r.y, 12000);
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
