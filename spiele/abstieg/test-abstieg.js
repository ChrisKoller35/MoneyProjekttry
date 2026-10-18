// Browser-Test: spielt einen Durchlauf automatisch (immer erste Wahl), macht Bildschirmfotos, meldet Fehler.
// Aufruf: node test-abstieg.js <bilder-ordner> [playwright-pfad] [chromium-pfad]
const path = require('path'), fs = require('fs');
const out = process.argv[2] || '.';
const pw = require(process.argv[3] || '/opt/node-tools/node_modules/playwright');
const exe = process.argv[4] || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const file = 'file://' + path.join(__dirname, 'dist', 'index.html');
fs.mkdirSync(out, { recursive: true });

(async () => {
  const browser = await pw.chromium.launch({ executablePath: exe });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, locale: 'de-CH' });
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('dialog', d => d.accept());
  const shot = (n) => page.screenshot({ path: `${out}/${n}.png` });
  const txt = async (s) => (await page.locator(s).first().textContent().catch(() => '')) || '';
  await page.goto(file); await page.waitForTimeout(500);
  await shot('01-titel');
  await page.click('#bNew'); await page.waitForTimeout(200);
  await shot('02-held');
  await page.click('[data-cls="schuetze"]'); await page.waitForTimeout(100);
  await page.click('#bStart'); await page.waitForTimeout(300);
  await shot('03-karte');
  await page.evaluate(() => window.__abstieg.setSpeed(3));
  await page.click('#cbar [data-sp="3"]').catch(() => {});

  let shots = 0, rooms = 0, fights = 0, deaths = 0;
  const log = [];
  for (let step = 0; step < 400; step++) {
    const r = await page.evaluate(() => { const r = window.__abstieg.G.run; return r ? { floor: r.floor, step: r.step, hp: r.hp, over: r.over, level: r.level, gold: r.gold, points: r.points, pend: r.pendingSkillPick } : null; });
    const combatOn = await page.evaluate(() => document.getElementById('combat').classList.contains('on'));
    const ovOn = await page.evaluate(() => document.getElementById('overlay').classList.contains('on'));
    if (combatOn) { await page.waitForTimeout(300); if (shots < 1 && fights === 1) { await shot('05-kampf'); shots++; } continue; }
    if (ovOn) {
      // Belohnung, Fähigkeit, Ausrüsten, Abstieg, Heldenblatt
      const take = page.locator('#overlay [data-take]'); if (await take.count()) { if (fights === 1) await shot('06-belohnung'); await take.first().click(); await page.waitForTimeout(150); continue; }
      const pick = page.locator('#overlay [data-pick]'); if (await pick.count()) { await shot('08-faehigkeit'); await pick.first().click(); await page.waitForTimeout(150); continue; }
      const eq = page.locator('#overlay #bEq'); if (await eq.count()) { await eq.click(); await page.waitForTimeout(150); continue; }
      const sp = page.locator('#overlay [data-sp]'); if (await sp.count()) { await sp.first().click(); await page.waitForTimeout(100); continue; }
      const ok = page.locator('#overlay #bOk'); if (await ok.count()) { await shot('09-abstieg'); await ok.click(); await page.waitForTimeout(200); continue; }
      const close = page.locator('#overlay #bClose'); if (await close.count()) { await close.click(); await page.waitForTimeout(150); continue; }
      log.push('unbekanntes Overlay'); await shot('xx-overlay'); break;
    }
    if (!r) { // Titel oder Lager
      if (await page.locator('#bCamp').count()) { await shot('11-ende'); await page.click('#bCamp'); await page.waitForTimeout(200); await shot('12-lager'); deaths++; break; }
      break;
    }
    if (r.over) { await shot('11-ende'); const bc = page.locator('#bCamp'); if (await bc.count()) await bc.click(); await page.waitForTimeout(200); await shot('12-lager'); deaths++; break; }
    // Statpunkte ausgeben
    if (r.points > 0 && await page.locator('#bSheet').count()) { await page.click('#bSheet'); await page.waitForTimeout(150); if (!shots) { await shot('07-heldenblatt'); } continue; }
    const choice = page.locator('.choice'); if (await choice.count()) { rooms++; const n = await choice.count(); const idx = Math.min(n - 1, step % n); await choice.nth(idx).click(); await page.waitForTimeout(200); continue; }
    if (await page.locator('#bFight').count()) { fights++; if (fights === 1) await shot('04-aufstellung'); await page.click('#bFight'); await page.waitForTimeout(300); continue; }
    if (await page.locator('#bHeal').count()) { await page.click('#bHeal'); await page.waitForTimeout(150); continue; }
    const evc = page.locator('[data-c]'); if (await evc.count()) { await shot('10-ereignis'); await evc.first().click(); await page.waitForTimeout(150); continue; }
    const buy = page.locator('[data-buy]:not([disabled])'); if (await buy.count()) { await buy.first().click(); await page.waitForTimeout(150); continue; }
    for (const b of ['#bLeave', '#bOk']) { if (await page.locator(b).count()) { await page.click(b); await page.waitForTimeout(150); break; } }
  }
  const meta = await page.evaluate(() => window.__abstieg.G.meta);
  console.log(JSON.stringify({ rooms, fights, deaths, meta: { sparks: meta.sparks, runs: meta.runs, best: meta.best }, log }));
  console.log('errors', JSON.stringify(errors));
  await browser.close();
  if (errors.length) process.exit(1);
})().catch(e => { console.error(e); process.exit(1); });
