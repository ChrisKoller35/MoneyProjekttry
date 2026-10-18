// Bildschirmfotos für Vorher/Nachher-Vergleiche: Titel, Heldenwahl, Kampf, Beute, Heldenblatt – am Handy und am PC.
// Aufruf: node shots.js <html-datei> <bilder-ordner> [handy|pc|beide] [retro|3d]
const path = require('path'), fs = require('fs');
const file = 'file://' + path.resolve(process.argv[2] || path.join(__dirname, 'dist', 'index.html'));
const out = process.argv[3] || '.';
const which = process.argv[4] || 'beide';
const look = process.argv[5] || 'retro';
const pw = require('/opt/node-tools/node_modules/playwright');
const exe = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
fs.mkdirSync(out, { recursive: true });

async function session(browser, tag, vp) {
  const page = await browser.newPage(vp);
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('dialog', d => d.accept());
  const shot = (n) => page.screenshot({ path: `${out}/${tag}-${n}.png` });
  await page.goto(file + '?look=' + look); await page.waitForTimeout(900);
  await shot('1-titel');
  await page.click('#bNew'); await page.waitForTimeout(500);
  await shot('2-held');
  await page.click('#bStart'); await page.waitForTimeout(1200);
  await shot('3-start');
  // In einen Kampfraum neben dem Start setzen
  await page.evaluate(() => {
    const W = window.__abstieg.Wd.W, TS = window.A.World.TS;
    const s = W.start; const ns = W.edges.map(([p, q]) => (p.x === s.cx && p.y === s.cy) ? q : (q.x === s.cx && q.y === s.cy) ? p : null).filter(Boolean);
    let r = W.rooms.find(r => r.type === 'fight' && ns.some(n => n.x === r.cx && n.y === r.cy)) || W.rooms.find(r => r.type === 'fight' || r.type === 'elite');
    W.hero.x = (r.x + r.w / 2) * TS; W.hero.y = (r.y + r.h / 2) * TS + 20;
  });
  const K = (k) => page.evaluate((k) => { const K = window.A.Input.keys; for (const n of ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'Space']) K[n] = !!k[n]; }, k);
  const toward = async (ms) => {
    const t0 = Date.now();
    while (Date.now() - t0 < ms) {
      const s = await page.evaluate(() => { const W = window.__abstieg.Wd.W; const h = W.hero; const m = W.mons.filter(m => m.alive).sort((a, b) => Math.hypot(a.x - h.x, a.y - h.y) - Math.hypot(b.x - h.x, b.y - h.y))[0]; if (h.hp < h.maxHp * 0.5) h.hp = h.maxHp; return m ? { dx: m.x - h.x, dy: m.y - h.y } : null; });
      if (!s) break; const d = Math.hypot(s.dx, s.dy); const far = d > 40;
      await K({ KeyD: far && s.dx > 8, KeyA: far && s.dx < -8, KeyS: far && s.dy > 8, KeyW: far && s.dy < -8, Space: true });
      await page.waitForTimeout(50);
    }
  };
  await page.waitForTimeout(500);
  await toward(1100);
  await page.evaluate(() => window.__abstieg.Wd.useSkill(0));
  await page.waitForTimeout(120);
  await shot('4-kampf');
  // Raum leeren: Gegner fast tot machen und weiter schlagen
  await page.evaluate(() => { for (const m of window.__abstieg.Wd.W.mons) m.hp = 1; });
  await toward(3500);
  await K({}); await page.waitForTimeout(400);
  await page.evaluate(() => { const ov = document.getElementById('overlay'); if (ov.classList.contains('on')) { const b = ov.querySelector('#bBag') || ov.querySelector('#bClose'); b && b.click(); } });
  await page.waitForTimeout(300);
  await shot('5-beute');
  // Gefundenes Item aufheben (Fenster)
  await page.evaluate(() => { const W = window.__abstieg.Wd.W; const p = W.picks.find(p => p.kind === 'item'); if (p) { W.hero.x = p.x; W.hero.y = p.y; } });
  await page.waitForTimeout(500);
  if (await page.locator('#overlay.on').count()) await shot('6-gefunden');
  await page.evaluate(() => { const ov = document.getElementById('overlay'); if (ov.classList.contains('on')) { const b = ov.querySelector('#bEq') || ov.querySelector('#bClose'); b && b.click(); } });
  await page.waitForTimeout(200);
  await page.keyboard.press('KeyI'); await page.waitForTimeout(300);
  await shot('7-heldenblatt');
  await page.close();
  return errors;
}

(async () => {
  const browser = await pw.chromium.launch({ executablePath: exe, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const errs = [];
  if (which !== 'pc') errs.push(...await session(browser, 'handy', { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true, locale: 'de-CH' }));
  if (which !== 'handy') errs.push(...await session(browser, 'pc', { viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1, locale: 'de-CH' }));
  await browser.close();
  console.log('errors', JSON.stringify(errs.slice(0, 8)));
  if (errs.length) process.exit(1);
})().catch(e => { console.error(e); process.exit(1); });
