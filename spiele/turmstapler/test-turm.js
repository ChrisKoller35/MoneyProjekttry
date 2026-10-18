const { chromium } = require('/opt/node-tools/node_modules/playwright');
const path = require('path');
const out = process.argv[2];
const file = 'file://' + path.resolve('/home/user/moneyprojekttry/spiele/turmstapler/index.html');

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true });
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errors.push(m.type() + ': ' + m.text()); });
  await page.goto(file);
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${out}/1-start.png` });

  // Start per Tippen auf den Bildschirm
  await page.mouse.click(195, 300);
  await page.waitForTimeout(200);
  console.log('state after start', await page.evaluate(() => window.__turmstapler.state));

  // 25 Blöcke setzen: tippen, wenn der Block ungefähr über dem Turm steht
  let placed = 0, tries = 0;
  while (placed < 25 && tries < 4000) {
    tries++;
    const ok = await page.evaluate(() => {
      const g = window.__turmstapler; const m = g.mover; if (!m) return false;
      // Zielposition: zentriert über dem obersten Block -> wir lesen sie aus der Schattenlinie nicht, sondern nähern an
      return true;
    });
    const info = await page.evaluate(() => {
      const g = window.__turmstapler; const m = g.mover; if (!m) return null;
      return { x: m.x, w: m.w, dir: m.dir, speed: m.speed, blocks: g.blocks, W: window.innerWidth };
    });
    if (!info) break;
    // oberster Block: wir kennen ihn nicht direkt; nehmen an, er ist nahe der Mitte (Start) -> wir tippen, wenn mover.x ~ Mitte - w/2 ± Toleranz
    const topX = await page.evaluate(() => { const c = document.getElementById('c'); return window.__topX ? window.__topX() : null; });
    const target = (info.W / 2 - info.w / 2);
    const dist = Math.abs(info.x - target);
    if (dist < info.speed * 1.2 + (placed % 5 === 0 ? 0 : 6)) {
      await page.evaluate(() => window.__turmstapler.tap());
      placed++;
      await page.waitForTimeout(120);
    } else {
      await page.waitForTimeout(8);
    }
  }
  const mid = await page.evaluate(() => ({ state: window.__turmstapler.state, score: window.__turmstapler.score, blocks: window.__turmstapler.blocks }));
  console.log('mid', JSON.stringify(mid), 'placed', placed, 'tries', tries);
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${out}/2-spiel.png` });

  // Absichtlich verlieren: tippen, wenn der Block weit weg ist
  for (let i = 0; i < 400; i++) {
    const s = await page.evaluate(() => window.__turmstapler.state);
    if (s === 2) break;
    const info = await page.evaluate(() => { const m = window.__turmstapler.mover; return m ? { x: m.x, w: m.w, W: window.innerWidth } : null; });
    if (!info) break;
    const target = info.W / 2 - info.w / 2;
    if (Math.abs(info.x - target) > info.w + 10) { await page.evaluate(() => window.__turmstapler.tap()); await page.waitForTimeout(150); }
    else await page.waitForTimeout(10);
  }
  await page.waitForTimeout(1200);
  const end = await page.evaluate(() => ({ state: window.__turmstapler.state, score: window.__turmstapler.score, best: window.__turmstapler.best }));
  console.log('end', JSON.stringify(end));
  await page.screenshot({ path: `${out}/3-vorbei.png` });

  // Neustart per Klick, dann Desktop-Grösse prüfen
  await page.mouse.click(195, 574);
  await page.waitForTimeout(300);
  console.log('state after replay', await page.evaluate(() => window.__turmstapler.state));

  const desk = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await desk.goto(file); await desk.waitForTimeout(500);
  await desk.keyboard.press('Space'); await desk.waitForTimeout(300);
  for (let i = 0; i < 6; i++) { await desk.waitForTimeout(350); await desk.keyboard.press('Space'); }
  await desk.waitForTimeout(300);
  await desk.screenshot({ path: `${out}/4-desktop.png` });
  console.log('desktop', JSON.stringify(await desk.evaluate(() => ({ state: window.__turmstapler.state, score: window.__turmstapler.score }))));

  console.log('errors', JSON.stringify(errors));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
