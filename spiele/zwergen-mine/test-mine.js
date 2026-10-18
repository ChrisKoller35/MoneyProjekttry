const { chromium } = require('/opt/node-tools/node_modules/playwright');
const out = process.argv[2];
const file = 'file:///home/user/moneyprojekttry/spiele/zwergen-mine/index.html';
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, locale: 'de-CH' });
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(file); await page.waitForTimeout(600);
  await page.screenshot({ path: `${out}/1-start.png` });
  // 60 Mal tippen auf den Felsen
  for (let i = 0; i < 60; i++) { await page.mouse.click(195, 300); await page.waitForTimeout(25); }
  await page.waitForTimeout(300);
  let s = await page.evaluate(() => ({ gold: window.__mine.S.gold, depth: window.__mine.S.depth }));
  console.log('nach 60 tipps', JSON.stringify(s));
  await page.screenshot({ path: `${out}/2-graben.png` });
  // Zwerg kaufen
  await page.click('[data-tab="dwarf"]'); await page.waitForTimeout(200);
  const btn = page.locator('.buy').first();
  console.log('kaufbar', await btn.getAttribute('class'));
  await btn.click(); await page.waitForTimeout(200);
  s = await page.evaluate(() => ({ gold: window.__mine.S.gold, dw: window.__mine.S.dw }));
  console.log('nach kauf', JSON.stringify(s));
  await page.screenshot({ path: `${out}/3-zwerge.png` });
  // Schnell vorspulen: Gold schenken, viele Zwerge, bis Boss
  await page.evaluate(() => { const S = window.__mine.S; S.gold += 1e6; });
  await page.waitForTimeout(300);
  for (let i = 0; i < 12; i++) { await page.locator('.buy').first().click(); await page.waitForTimeout(30); }
  await page.click('[data-tab="pick"]'); await page.waitForTimeout(100);
  for (let i = 0; i < 25; i++) { await page.locator('.buy').first().click(); await page.waitForTimeout(20); }
  // Tippen bis Tiefe 10 (Boss)
  for (let i = 0; i < 400; i++) {
    const d = await page.evaluate(() => window.__mine.S.depth);
    if (d >= 10) break;
    await page.mouse.click(195, 300);
    await page.waitForTimeout(15);
  }
  await page.waitForTimeout(400);
  s = await page.evaluate(() => ({ gold: window.__mine.S.gold, depth: window.__mine.S.depth, hp: window.__mine.S.hp }));
  console.log('boss', JSON.stringify(s));
  await page.screenshot({ path: `${out}/4-boss.png` });
  // Truhe erzwingen
  await page.evaluate(() => window.__mine.spawnChest());
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${out}/5-truhe.png` });
  await page.evaluate(() => window.__mine.openChest());
  await page.waitForTimeout(300);
  // Boss besiegen
  for (let i = 0; i < 600; i++) {
    const d = await page.evaluate(() => window.__mine.S.depth);
    if (d >= 11) break;
    await page.mouse.click(195, 300); await page.waitForTimeout(10);
  }
  await page.waitForTimeout(300);
  s = await page.evaluate(() => ({ gems: window.__mine.S.gems, depth: window.__mine.S.depth, farm: window.__mine.S.farm }));
  console.log('nach boss', JSON.stringify(s));
  await page.screenshot({ path: `${out}/6-nach-boss.png` });
  await page.click('[data-tab="gem"]'); await page.waitForTimeout(200);
  await page.screenshot({ path: `${out}/7-steine.png` });
  // Offline-Belohnung: Speicherstand alt machen, neu laden
  await page.evaluate(() => { const S = window.__mine.S; S.saved = Date.now() - 3600 * 1000; localStorage.setItem('zwergenmine.v1', JSON.stringify(S)); });
  await page.reload(); await page.waitForTimeout(800);
  const toast = await page.locator('#toast').isVisible();
  console.log('offline-toast', toast);
  await page.screenshot({ path: `${out}/8-zurueck.png` });
  // Desktop
  const desk = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await desk.goto(file); await desk.waitForTimeout(500);
  await desk.screenshot({ path: `${out}/9-desktop.png` });
  console.log('errors', JSON.stringify(errors));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
