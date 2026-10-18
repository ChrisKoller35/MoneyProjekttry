// Zwergen-Mine: automatischer Durchlauf mit Bildschirmfotos (Handy + PC)
// Aufruf: node test-mine.js <ordner-fuer-bilder>
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const out = process.argv[2] || '.';
const file = 'file://' + __dirname + '/index.html';
const fails = [];
const check = (ok, what) => { console.log((ok ? 'OK   ' : 'FEHL ') + what); if (!ok) fails.push(what); };

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, locale: 'de-CH' });
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  const S = () => page.evaluate(() => JSON.parse(JSON.stringify(window.__mine.S)));
  const shot = (n) => page.screenshot({ path: `${out}/${n}.png` });

  await page.goto(file); await page.waitForTimeout(600);
  await shot('01-start');

  // 1) Tippen
  for (let i = 0; i < 60; i++) { await page.mouse.click(195, 300); await page.waitForTimeout(45); }
  await page.waitForTimeout(300);
  let s = await S();
  check(s.gold > 0 && s.taps >= 50, `Tippen bringt Gold (${s.taps} Tipps, Gold ${Math.round(s.gold)}, Tiefe ${s.depth})`);
  await shot('02-graben');

  // 2) Zwerg kaufen
  await page.click('[data-tab="dwarf"]'); await page.waitForTimeout(200);
  await page.locator('.buy').first().click(); await page.waitForTimeout(200);
  s = await S();
  check(s.dw[0] === 1, 'Erster Zwerg gekauft');
  await shot('03-zwerge');

  // 3) Vorspulen bis Boss auf Tiefe 10
  await page.evaluate(() => { window.__mine.S.gold += 1e6; });
  for (let i = 0; i < 12; i++) { await page.locator('.buy').first().click(); await page.waitForTimeout(20); }
  await page.click('[data-tab="pick"]'); await page.waitForTimeout(100);
  for (let i = 0; i < 25; i++) { await page.locator('.buy').first().click(); await page.waitForTimeout(15); }
  for (let i = 0; i < 600; i++) {
    const d = await page.evaluate(() => window.__mine.S.depth);
    if (d >= 10) break;
    await page.mouse.click(195, 300); await page.waitForTimeout(12);
  }
  await page.waitForTimeout(400);
  s = await S();
  check(s.depth === 10, 'Boss auf Tiefe 10 erreicht');
  await shot('04-boss');

  // 4) Truhe
  await page.evaluate(() => window.__mine.spawnChest()); await page.waitForTimeout(300);
  await shot('05-truhe');
  await page.evaluate(() => window.__mine.openChest()); await page.waitForTimeout(300);
  s = await S();
  check(s.st.chests === 1, 'Truhe geöffnet und gezählt');

  // 5) Boss besiegen
  for (let i = 0; i < 800; i++) {
    const d = await page.evaluate(() => window.__mine.S.depth);
    if (d >= 11) break;
    await page.mouse.click(195, 300); await page.waitForTimeout(10);
  }
  await page.waitForTimeout(300);
  s = await S();
  check(s.depth === 11 && s.st.bosses === 1 && s.gems > 0, `Boss besiegt (Steine ${s.gems})`);
  await shot('06-nach-boss');

  // 6) Werkzeuge: Liste ansehen, Dynamit und Bierfass kaufen
  await page.evaluate(() => { const m = window.__mine; m.S.gold += 5e4; m.jump(26); });
  await page.click('[data-tab="pick"]'); await page.waitForTimeout(300);
  await shot('07-werkzeuge');
  const buyTool = async (name) => {
    const card = page.locator('.card', { hasText: name }).first();
    await card.locator('.buy').click(); await page.waitForTimeout(250);
  };
  await buyTool('Dynamit'); await buyTool('Bierfass');
  s = await S();
  check(s.up.dyn && s.up.bier, 'Dynamit und Bierfass gekauft');
  await page.waitForTimeout(700);
  check(await page.locator('#dynBtn.show').isVisible() && await page.locator('#beerBtn.show').isVisible(), 'Knöpfe für Dynamit und Bierfass sichtbar');
  await shot('08-faehigkeiten');
  const hpBefore = (await S()).hp;
  await page.click('#dynBtn'); await page.waitForTimeout(150);
  s = await S();
  check(s.cdDyn > 80 && (s.hp < hpBefore || s.depth > 26), 'Dynamit macht Schaden und lädt neu');
  await page.click('#beerBtn'); await page.waitForTimeout(400);
  s = await S();
  check(s.cdBeer > 170, 'Bierfass startet');
  await shot('09-bier');

  // 7) Ziele
  await page.click('[data-tab="goal"]'); await page.waitForTimeout(300);
  s = await S();
  check(Object.keys(s.goals).length >= 3, `Ziele erreicht: ${Object.keys(s.goals).join(', ')}`);
  await shot('10-ziele');

  // 8) Grossboss auf Tiefe 50
  await page.evaluate(() => window.__mine.jump(50)); await page.waitForTimeout(500);
  s = await S();
  const hp49 = await page.evaluate(() => window.__mine.F.rockHp(49));
  check(s.depth === 50 && s.hp > hp49 * 5, 'Grossboss auf Tiefe 50 (zehnfach so stark)');
  await shot('11-grossboss');

  // 9) Umzug in neue Mine (Erbstücke)
  await page.evaluate(() => { window.__mine.S.maxDepth = 100; window.__mine.S.best = 100; window.__mine.buildPanel(); });
  await page.click('[data-tab="goal"]'); await page.waitForTimeout(300);
  await shot('12-umzug-moeglich');
  await page.locator('.card.prest .buy').click(); await page.waitForTimeout(300);
  check(await page.locator('#tYes').isVisible(), 'Rückfrage vor dem Umzug');
  await shot('13-umzug-frage');
  await page.click('#tYes'); await page.waitForTimeout(600);
  s = await S();
  check(s.heir === 49 && s.depth === 1 && s.gold === 0 && s.st.prest === 1 && s.gems > 0, `Umzug: ${s.heir} Erbstücke, Tiefe ${s.depth}, Steine behalten ${s.gems}`);
  check(s.runs.length === 1 && s.runs[0].d === 100 && s.recBase === 100 && s.best === 100, 'Umzug merkt sich die Mine für die Rekorde');
  await page.waitForTimeout(300);
  check(await page.locator('#best').textContent() === '🏆100', 'Rekord oben neben der Tiefe sichtbar');
  await shot('14-neue-mine');

  // 9b) Rekorde ansehen (Klick auf die Tiefe und Reiter «Ziele»)
  await page.click('#depthPill'); await page.waitForTimeout(300);
  const recText = await page.locator('#toast').textContent();
  check(await page.locator('#tClose').isVisible() && recText.includes('Mine 1') && recText.includes('100'), 'Rekorde öffnen sich mit Klick auf die Tiefe');
  await shot('14b-rekorde');
  await page.click('#tClose'); await page.waitForTimeout(200);
  check(!(await page.locator('#toast').isVisible()), 'Rekorde schliessen');
  await page.click('[data-tab="goal"]'); await page.waitForTimeout(200);
  await page.locator('.card', { hasText: 'Rekorde' }).locator('.buy').click(); await page.waitForTimeout(200);
  check(await page.locator('#tClose').isVisible(), 'Rekorde auch im Reiter «Ziele»');
  await page.click('#tClose'); await page.waitForTimeout(200);
  check((await page.evaluate(() => window.__mine.GOALS.length)) === 47, '47 Ziele');

  // 9c) Alten Rekord in der neuen Mine knacken
  const rec = await page.evaluate(() => { const m = window.__mine; m.jump(100); m.S.hp = 1; m.tap(); return { best: m.S.best, b: m.banners() }; });
  check(rec.best === 101 && rec.b.includes('Neuer Rekord!'), `Meldung «Neuer Rekord!» (${rec.b.join(', ')})`);
  for (let i = 0; i < 60; i++) { if ((await page.evaluate(() => window.__mine.banners()[0])) === 'Neuer Rekord!') break; await page.waitForTimeout(150); }
  await page.waitForTimeout(400);
  await shot('14c-neuer-rekord');

  // 9d) Ring II ab Tiefe 141: neue Farben, Edelsteine, weicherer Anstieg
  const ring = await page.evaluate(() => {
    const m = window.__mine; m.jump(140); m.S.hp = 1;
    const exp = m.S.gems + m.F.bossGems(140, m.S) + m.F.ringGems(1);
    const layerMsgs = () => m.banners().filter(t => t === 'Neue Schicht').length, before = layerMsgs(); m.tap();
    return { gems: m.S.gems, exp, b: m.banners(), extraLayerMsg: layerMsgs() > before, name: m.layerAt(141).name, same: m.layerAt(141).rock === m.layerAt(1).rock,
      grow: m.F.rockHp(142) / m.F.rockHp(141), growOld: m.F.rockHp(139) / m.F.rockHp(138), far: m.F.rockHp(2000) };
  });
  check(ring.name === 'Erde II' && !ring.same, `Ring II hat eigene Farben (${ring.name})`);
  check(ring.gems === ring.exp && ring.b.includes('Ring II erreicht!') && !ring.extraLayerMsg, `Ring II gibt einmal Edelsteine (${ring.gems} von ${ring.exp}, ${ring.b.join(', ')})`);
  check(Math.abs(ring.grow - 1.15) < 0.01 && Math.abs(ring.growOld - 1.21 * 1.025) < 0.01 && isFinite(ring.far), `Fels wächst ab 140 langsamer (${ring.grow.toFixed(3)} statt ${ring.growOld.toFixed(3)})`);
  for (let i = 0; i < 60; i++) { if ((await page.evaluate(() => window.__mine.banners()[0])) === 'Ring II erreicht!') break; await page.waitForTimeout(150); }
  await page.waitForTimeout(500);
  await shot('14d-ring-2');
  for (const d of [161, 201, 251, 281, 431]) {
    await page.evaluate((d) => window.__mine.jump(d), d); await page.waitForTimeout(2800);
    await shot(`14e-ring-tiefe-${d}`);
  }

  // 9e) Ton aus, wenn das Fenster nicht mehr vorne ist
  const foc = await page.evaluate(() => { const m = window.__mine; window.dispatchEvent(new Event('blur')); const a = m.focus; window.dispatchEvent(new Event('focus')); return [a, m.focus]; });
  check(foc[0] === false && foc[1] === true, 'Ton aus, wenn man woanders hinklickt');

  // 10) Spätere Schichten ansehen
  for (const d of [61, 91, 111, 131]) {
    await page.evaluate((d) => window.__mine.jump(d), d); await page.waitForTimeout(1200);
    await shot(`15-schicht-${d}`);
  }

  // 11) Offline-Belohnung (eigener Browser-Kontext, Spielstand vor dem Laden gesetzt)
  const withSave = async (save) => {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, locale: 'de-CH' });
    await ctx.addInitScript((sv) => { if (!localStorage.getItem('zwergenmine.v1')) localStorage.setItem('zwergenmine.v1', sv); }, JSON.stringify(save));
    const p = await ctx.newPage(); p.on('pageerror', e => errors.push('ctx pageerror: ' + e.message));
    await p.goto(file); await p.waitForTimeout(1200); return p;
  };
  const off = await withSave({ gold: 500, gems: 3, depth: 22, maxDepth: 22, pick: 12, dw: [10, 6, 2, 0, 0, 0, 0, 0], gu: { power: 0, gold: 0, crit: 0, offline: 0, chest: 0 }, taps: 900, saved: Date.now() - 3600 * 1000, up: { spitze: true }, goals: {}, heir: 0, st: { bosses: 2, chests: 1, prest: 0 } });
  check(await off.locator('#toast').isVisible(), 'Offline-Belohnung erscheint');
  await off.screenshot({ path: `${out}/16-zurueck.png` });

  // 12) Alter Spielstand (vor dem Ausbau) lädt
  const old = await withSave({ gold: 5000, gems: 12, depth: 34, maxDepth: 34, pick: 20, dw: [10, 5, 2, 0, 0, 0], gu: { power: 1, gold: 0, crit: 0, offline: 0, chest: 0 }, taps: 3000, saved: Date.now(), farm: false });
  s = await old.evaluate(() => JSON.parse(JSON.stringify(window.__mine.S)));
  check(s.depth === 34 && s.st.bosses === 3 && s.dw.length === 8 && s.goals.d25, `Alter Spielstand lädt (Bosse ${s.st.bosses}, Ziele ${Object.keys(s.goals).length}, Steine ${s.gems})`);
  await old.screenshot({ path: `${out}/17-alter-stand.png` });

  // 13) Englisch
  const en = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, locale: 'en-US' });
  en.on('pageerror', e => errors.push('en pageerror: ' + e.message));
  await en.goto(file); await en.waitForTimeout(500);
  await en.evaluate(() => { const m = window.__mine; m.S.gold = 1e9; m.S.maxDepth = 60; m.jump(60); });
  await en.click('[data-tab="goal"]'); await en.waitForTimeout(300);
  await en.screenshot({ path: `${out}/18-englisch-ziele.png` });
  await en.click('[data-tab="pick"]'); await en.waitForTimeout(300);
  await en.screenshot({ path: `${out}/19-englisch-werkzeuge.png` });

  // 14) PC
  const desk = await browser.newPage({ viewport: { width: 1280, height: 720 }, locale: 'de-CH' });
  desk.on('pageerror', e => errors.push('desk pageerror: ' + e.message));
  await desk.goto(file); await desk.waitForTimeout(400);
  await desk.evaluate(() => { const m = window.__mine; m.S.gold = 1e7; m.S.up.dyn = true; m.S.up.bier = true; m.jump(42); });
  await desk.keyboard.press('KeyD'); await desk.waitForTimeout(100);
  await desk.keyboard.press('KeyB'); await desk.waitForTimeout(600);
  const ds = await desk.evaluate(() => ({ cdDyn: window.__mine.S.cdDyn, cdBeer: window.__mine.S.cdBeer }));
  check(ds.cdDyn > 0 && ds.cdBeer > 0, 'Tasten D und B funktionieren am PC');
  await desk.screenshot({ path: `${out}/20-desktop.png` });
  await desk.click('#depthPill'); await desk.waitForTimeout(300);
  check(await desk.locator('#tClose').isVisible(), 'Rekorde am PC');
  await desk.screenshot({ path: `${out}/21-desktop-rekorde.png` });

  check(errors.length === 0, 'Keine Fehler im Browser ' + JSON.stringify(errors));
  await browser.close();
  console.log(fails.length ? `\n${fails.length} FEHLER` : '\nALLES OK');
  process.exit(fails.length ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
