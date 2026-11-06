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
  // Zufall abschalten (besondere Felsen, Maulwurf), damit die Prüfungen gleich bleiben; eigene Prüfungen weiter unten
  const calm = (pg) => pg.evaluate(() => { window.__mineSpecial.off = true; window.__mineMole.off = true; });

  await page.goto(file); await calm(page); await page.waitForTimeout(600);
  await shot('01-start');
  const tipNow = () => page.evaluate(() => window.__mine.tip);
  check((await tipNow()) === 'tap' && (await page.locator('#tip').textContent()).includes('Tippe auf den Felsen'), 'Tipp am Anfang: auf den Felsen tippen');

  // 1) Tippen
  for (let i = 0; i < 60; i++) { await page.mouse.click(195, 300); await page.waitForTimeout(45); }
  await page.waitForTimeout(300);
  let s = await S();
  check(s.gold > 0 && s.taps >= 50, `Tippen bringt Gold (${s.taps} Tipps, Gold ${Math.round(s.gold)}, Tiefe ${s.depth})`);
  check((await tipNow()) === 'dwarf' && await page.locator('.tab[data-tab="dwarf"].hint').isVisible(), 'Danach Tipp: ersten Zwerg kaufen (Reiter leuchtet)');
  await shot('02-graben');

  // 2) Zwerg kaufen
  await page.click('[data-tab="dwarf"]'); await page.waitForTimeout(200);
  await page.locator('.buy').first().click(); await page.waitForTimeout(150);
  const sparks = await page.locator('.spark').count();
  await page.waitForTimeout(500);
  s = await S();
  check(s.dw[0] === 1 && sparks > 0, `Erster Zwerg gekauft (${sparks} Funken)`);
  check((await tipNow()) !== 'dwarf', 'Zwergen-Tipp verschwindet nach dem Kauf');
  await shot('03-zwerge');

  // 3) Vorspulen bis Boss auf Tiefe 10 (Fundstücke können vorher Steine bringen; den Steine-Tipp hier überspringen, damit der Boss-Tipp sicher kommt)
  await page.evaluate(() => { window.__mine.S.tips.gem = true; });
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
  check((await tipNow()) === 'boss', 'Tipp beim ersten Boss');
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
  await page.evaluate(() => { window.__mine.S.maxDepth = 100; window.__mine.S.best = 100; window.__mine.S.blkBest = 100; window.__mine.buildPanel(); });
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

  // 9d) Letzte Schicht ab Tiefe 141: Herz des Berges, einmal Steine, Fels wächst langsamer
  const ring = await page.evaluate(() => {
    const m = window.__mine; m.jump(140); m.S.hp = 1;
    const exp = m.S.gems + m.F.bossGems(140, m.S) + m.F.ringGems(1);
    const layerMsgs = () => m.banners().filter(t => t === 'Neue Schicht').length, before = layerMsgs(); m.tap();
    return { gems: m.S.gems, exp, b: m.banners(), extraLayerMsg: layerMsgs() > before, name: m.layerAt(141).name, glow: m.layerAt(141).glow,
      grow: m.F.rockHp(142) / m.F.rockHp(141), growOld: m.F.rockHp(139) / m.F.rockHp(138), far: m.F.rockHp(2000) };
  });
  check(ring.name === 'Herz des Berges' && ring.glow, `Letzte Schicht heisst «${ring.name}» und leuchtet`);
  check(ring.gems === ring.exp && ring.b.includes('Letzte Schicht!') && !ring.extraLayerMsg, `Letzte Schicht gibt einmal Edelsteine (${ring.gems} von ${ring.exp}, ${ring.b.join(', ')})`);
  check(Math.abs(ring.grow - 1.15) < 0.01 && Math.abs(ring.growOld - 1.21 * 1.025) < 0.01 && isFinite(ring.far), `Fels wächst ab 140 langsamer (${ring.grow.toFixed(3)} statt ${ring.growOld.toFixed(3)})`);
  for (let i = 0; i < 60; i++) { if ((await page.evaluate(() => window.__mine.banners()[0])) === 'Letzte Schicht!') break; await page.waitForTimeout(150); }
  await page.waitForTimeout(500);
  await shot('14d-letzte-schicht');

  // 9d2) Endboss auf Tiefe 150, Block geschafft, Förderturm, Karte, Vulkan
  const eb = await page.evaluate(() => { const m = window.__mine; m.jump(160); return { d: m.S.depth, boss: m.bossActive, b: m.banners() }; });
  check(eb.d === 150 && eb.boss && eb.b.includes('Endboss!'), `Endboss auf Tiefe 150, tiefer geht es nicht (${eb.d}, ${eb.b.join(', ')})`);
  for (let i = 0; i < 60; i++) { if ((await page.evaluate(() => window.__mine.banners()[0])) === 'Endboss!') break; await page.waitForTimeout(150); }
  await page.waitForTimeout(400);
  await shot('14e-endboss');
  const fin = await page.evaluate(() => { const m = window.__mine; m.S.hp = 1; m.tap(); return JSON.parse(JSON.stringify({ S: m.S, b: m.banners(), boss: m.bossActive, canMove: m.F.canPrestige(m.S) })); });
  check(fin.S.blockDone && fin.S.depth === 150 && fin.S.towers.length === 1 && fin.S.towers[0].k === 'stein' && fin.S.crowns === 10 && fin.S.crownsAll === 10 && !fin.boss && fin.b.includes('Block geschafft!'),
    `Endboss besiegt: Block geschafft, Förderturm, 👑 ${fin.S.crowns} (${fin.b.join(', ')})`);
  check(!fin.canMove, 'Nach dem geschafften Block kein Umzug mehr in diesem Block');
  await page.waitForTimeout(400); await shot('14f-block-geschafft');
  await page.waitForTimeout(1800);
  check(await page.locator('#tMap').isVisible() && (await page.locator('#toast').textContent()).includes('Alter Berg geschafft!'), 'Fenster «Alter Berg geschafft!» erscheint');
  await shot('14g-block-fenster');
  await page.click('#tMap'); await page.waitForTimeout(300);
  check(await page.locator('[data-unl="vulkan"]').isEnabled() && await page.locator('#tTake').isDisabled(), 'Karte: Vulkan kann für 10 Kronen freigeschaltet werden, Lager noch leer');
  await shot('14h-karte');
  await page.click('[data-unl="vulkan"]'); await page.waitForTimeout(300);
  s = await S();
  check(s.unl.vulkan && s.crowns === 0 && s.crownsAll === 10, `Vulkan freigeschaltet, Punktestand bleibt (${s.crowns} / ${s.crownsAll})`);
  await shot('14i-karte-vulkan-frei');
  const gemsBefore = s.gems;
  await page.click('[data-go="vulkan"]'); await page.waitForTimeout(500);
  s = await S();
  check(s.blk === 'vulkan' && !s.blockDone && s.depth === 1 && s.heir === 0 && s.gold === 0 && s.gems === gemsBefore && s.goals.k1 && !(await page.locator('#toast').isVisible()),
    `Vulkan startet bei Tiefe 1, Steine und Ziele bleiben (${s.gems} Steine)`);
  check((await page.evaluate(() => window.__mine.layerAt(5).name)) === 'Asche', 'Vulkan hat eigene Schichten (Asche)');
  await page.waitForTimeout(2600); await shot('14j-vulkan');
  const lv = await page.evaluate(async () => {
    const m = window.__mine; m.S.dw[0] = 50; m.jump(33); m.startLava(); const hp = m.S.hp;
    await new Promise(r => setTimeout(r, 500)); return { lava: m.lava, same: m.S.hp === hp, b: m.banners() };
  });
  check(lv.lava > 8 && lv.same && lv.b.includes('Lava-Ausbruch!'), `Lava-Ausbruch: Zwerge in Deckung (${lv.b.join(', ')})`);
  for (let i = 0; i < 30; i++) { if ((await page.evaluate(() => window.__mine.banners()[0])) === 'Lava-Ausbruch!') break; await page.waitForTimeout(100); }
  await page.waitForTimeout(700); await shot('14k-lava');
  const lt = await page.evaluate(() => { const m = window.__mine; const hp = m.S.hp; m.tap(); return (hp - m.S.hp) / m.F.pickDmg(m.S.pick, m.S); });
  check([3, 15].some(x => Math.abs(lt - x) < 0.01), `Bei Lava zählt ein Tipp dreifach (×${lt.toFixed(1)})`);
  await page.evaluate(() => window.__mine.jump(145)); await page.waitForTimeout(2600); await shot('14l-vulkan-herz');

  // 9d3) Förderturm: Lager füllt sich mit der Zeit, höchstens 12 Stunden, Uhr zurück schenkt nichts
  const tw = await page.evaluate(() => {
    const m = window.__mine, tw = m.S.towers[0], now = Date.now(), r = {};
    tw.since = now - 5.5 * 3600e3; r.n1 = m.storeInfo().n; r.got1 = m.collectAll(); r.left = Math.round((Date.now() - tw.since) / 60000);
    tw.since = Date.now() - 30 * 3600e3; r.n2 = m.storeInfo().n; m.collectAll();
    tw.since = Date.now() + 1e8; r.n3 = m.storeInfo().n; r.back = Math.abs(tw.since - Date.now()) < 5000;
    tw.since = Date.now() - 7.2 * 3600e3; r.crowns = m.S.crowns; r.all = m.S.crownsAll; return r;
  });
  check(tw.n1 === 5 && tw.got1 === 5 && tw.left === 30, `Lager nach 5,5 h: 5 Kronen, Rest bleibt (${JSON.stringify(tw)})`);
  check(tw.n2 === 12 && tw.n3 === 0 && tw.back && tw.crowns === 17 && tw.all === 27, 'Lager höchstens 12 Stunden, Uhr zurückstellen bringt nichts');
  await page.waitForTimeout(700);
  check(await page.locator('#crownPill .dot.show').isVisible(), 'Grüner Punkt an der Krone, wenn Kronen im Lager sind');
  await page.click('#crownPill'); await page.waitForTimeout(300);
  check((await page.locator('#toast').textContent()).includes('Abholen 👑 +7'), 'Karte zeigt Abholen +7');
  await shot('14m-karte-lager');
  await page.click('#tTake'); await page.waitForTimeout(300);
  s = await S();
  check(s.crowns === 24 && s.crownsAll === 34, `Abholen bringt Kronen (${s.crowns} / ${s.crownsAll})`);
  await page.click('#tClose'); await page.waitForTimeout(200);
  await page.click('#depthPill'); await page.waitForTimeout(300);
  const recT = await page.locator('#toast').textContent();
  check(recT.includes('Punktestand') && recT.includes('34') && recT.includes('Alter Berg'), 'Rekorde zeigen Punktestand und geschaffte Blöcke');
  await shot('14n-rekorde-punkte');
  await page.click('#tClose'); await page.waitForTimeout(200);

  // 9e) Ton aus, wenn das Fenster nicht mehr vorne ist
  const foc = await page.evaluate(() => { const m = window.__mine; window.dispatchEvent(new Event('blur')); const a = m.focus; window.dispatchEvent(new Event('focus')); return [a, m.focus]; });
  check(foc[0] === false && foc[1] === true, 'Ton aus, wenn man woanders hinklickt');

  // 9f) Ganz neu anfangen (mit Rückfrage; Abbrechen lässt alles stehen)
  await page.evaluate(() => { const m = window.__mine; m.S.heir = 49; m.S.best = 230; });
  await page.click('#depthPill'); await page.waitForTimeout(300);
  await shot('14o-rekorde-neustart-knopf');
  await page.click('#tReset'); await page.waitForTimeout(200);
  check(await page.locator('#tYes').isVisible(), 'Rückfrage vor dem Neuanfang');
  await shot('14p-neustart-frage');
  await page.click('#tNo'); await page.waitForTimeout(200);
  s = await S();
  check(s.heir === 49 && s.best > 100, 'Abbrechen löscht nichts');
  await page.click('#depthPill'); await page.waitForTimeout(300);
  await page.click('#tReset'); await page.waitForTimeout(200);
  await page.click('#tYes'); await page.waitForTimeout(500);
  s = await S();
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('zwergenmine.v1')));
  check(s.depth === 1 && s.gold === 0 && s.gems === 0 && s.heir === 0 && s.best === 1 && s.runs.length === 0 && Object.keys(s.goals).length === 0 && stored.heir === 0 && stored.depth === 1 && s.towers.length === 0 && s.crownsAll === 0 && s.blk === 'stein',
    `Ganz neu anfangen löscht alles (Tiefe ${s.depth}, Steine ${s.gems}, Erbstücke ${s.heir}, Ziele ${Object.keys(s.goals).length})`);
  await shot('14q-neues-spiel');
  await page.reload(); await calm(page); await page.waitForTimeout(800);
  s = await S();
  check(s.depth === 1 && s.heir === 0 && s.best === 1, 'Nach dem Neuladen bleibt es ein neues Spiel');

  // 9g) Boss zu stark: Karte oben in der Liste, Nochmal-Knopf, Zwerge greifen von selbst an
  await page.click('[data-tab="pick"]'); await page.waitForTimeout(200);
  await page.evaluate(() => { const m = window.__mine; m.S.dw[0] = 1; m.jump(20); m.failBoss(); });
  await page.waitForTimeout(400);
  const stuck = page.locator('.card.stuck');
  check(await stuck.isVisible() && (await stuck.textContent()).includes('Boss auf Tiefe 20 zu stark') && (await stuck.textContent()).includes('%'), 'Karte «Boss zu stark» mit Kraft-Anzeige');
  await shot('14r-boss-zu-stark');
  await stuck.locator('.buy').click(); await page.waitForTimeout(300);
  s = await S();
  check(!s.farm && s.depth === 20 && !(await page.locator('.card.stuck').count()), 'Nochmal-Knopf startet den Boss');
  await page.evaluate(() => window.__mine.failBoss()); await page.waitForTimeout(200);
  const auto = await page.evaluate(async () => { const m = window.__mine; m.S.dw[0] = 30; await new Promise(r => setTimeout(r, 1200)); return { farm: m.S.farm, b: m.banners() }; });
  check(!auto.farm && auto.b.includes('Jetzt schaffen sie es!'), 'Zwerge greifen von selbst an, sobald sie stark genug sind');

  // 9h) Umzug lohnt sich: Hinweis, leuchtender Reiter, Text in der Karte
  if (await page.locator('#tip').isVisible()) await page.click('#tipOk');   // offenen Tipp wegklicken
  await page.evaluate(() => { const m = window.__mine; m.S.dw[0] = 0; m.jump(100); m.failBoss(); m.S.lastMaxAt = m.S.runTime - 120; m.buildPanel(); });
  await page.waitForTimeout(900);
  check(await page.evaluate(() => window.__mine.moveWorth()) && (await tipNow()) === 'move' && await page.locator('.tab[data-tab="goal"].hint').isVisible(), `Hinweis: neue Mine lohnt sich (${await tipNow()})`);
  check((await page.locator('.card.stuck').textContent()).includes('neue Mine'), 'Boss-Karte nennt die neue Mine');
  await shot('14s-umzug-lohnt-sich');
  await page.click('[data-tab="goal"]'); await page.waitForTimeout(700);
  const prestText = await page.locator('.card.prest').textContent();
  check((await tipNow()) === null && prestText.includes('Lohnt sich jetzt!'), `Im Reiter «Ziele»: Lohnt sich jetzt! (${await tipNow()}, ${prestText.slice(0, 60)})`);
  await shot('14t-ziele-umzug');

  // 9i) Besondere Felsen: Goldader ×4, Kristall-Schwachstelle ×8, Panzerfels nur mit Dynamit
  if (await page.locator('#tip').isVisible()) await page.click('#tipOk');
  await page.click('[data-tab="pick"]'); await page.waitForTimeout(200);
  const sp = await page.evaluate(() => {
    const m = window.__mine, x = window.__mineSpecial, r = {};
    m.S.dw = m.S.dw.map(() => 0); m.jump(33); x.spawn('gold'); m.S.hp = 1; const g0 = m.S.gold; m.tap();
    r.goldOk = Math.abs((m.S.gold - g0) / m.F.rockGold(33, m.S) - 4) < 0.01;
    x.spawn('panzer'); const hp = m.S.hp; m.tap(); r.panzerTap = m.S.hp === hp; r.kind = x.kind;
    return r;
  });
  check(sp.goldOk, 'Goldader gibt vierfach Gold');
  check(sp.panzerTap && sp.kind === 'panzer', 'Panzerfels: Tippen macht nichts');
  await page.waitForTimeout(500); await shot('22-panzerfels');
  const pz = await page.evaluate(() => { const m = window.__mine; m.S.up.dyn = true; m.S.cdDyn = 0; const d = m.S.depth; m.useDyn(); return { next: m.S.depth === d + 1, kind: window.__mineSpecial.kind }; });
  check(pz.next && pz.kind !== 'panzer', 'Panzerfels platzt mit Dynamit');
  await page.evaluate(() => window.__mineSpecial.spawn('kristall')); await page.waitForTimeout(400);
  await shot('23-kristall');
  const w = await page.evaluate(() => { const r = document.getElementById('scene').getBoundingClientRect(), p = window.__mineSpecial.weakSpot(); return { x: r.left + p.x, y: r.top + p.y, hp: window.__mine.S.hp, dmg: window.__mine.F.pickDmg(window.__mine.S.pick, window.__mine.S) }; });
  await page.mouse.click(w.x, w.y); await page.waitForTimeout(100);
  const hpK = (await S()).hp;
  check(w.hp - hpK >= w.dmg * 7.9, `Kristall: Treffer auf die Schwachstelle zählt achtfach (×${((w.hp - hpK) / w.dmg).toFixed(1)})`);

  // 9j) Maulwurf: klaut Gold, antippen bringt es doppelt zurück
  const ml = await page.evaluate(async () => {
    const m = window.__mine, x = window.__mineMole; m.S.gold = 1e6; const g0 = m.S.gold; x.spawn();
    await new Promise(r => setTimeout(r, 900)); const out = x.mole && x.mole.out, sack = x.mole ? x.mole.sack : 0, g1 = m.S.gold;
    return { out, sack, stole: g1 < g0 };
  });
  check(ml.out && ml.sack > 0 && ml.stole, `Maulwurf klaut einen Sack Gold (${ml.sack})`);
  await page.waitForTimeout(300); await shot('24-maulwurf');
  const mc = await page.evaluate(() => { const m = window.__mine, x = window.__mineMole, g = m.S.gold, sack = x.mole.sack; x.catch(); return { back: Math.abs(m.S.gold - g - 2 * sack) < 1, moles: m.S.st.moles }; });
  check(mc.back && mc.moles === 1, 'Maulwurf erwischt: Sack doppelt zurück');

  // 9k) Fundstücke: Sammlung im Reiter «Ziele», keine Fundstücke im Herz
  const fd = await page.evaluate(() => { const m = window.__mine; const n0 = Object.keys(m.S.finds).length; for (let i = 0; i < 40; i++) { m.S.maxDepth = 141 + (i % 9); m.onNewMax(); } m.jump(33); return { n: Object.keys(m.S.finds).length - n0 }; });
  check(fd.n === 0, 'Im Herz des Berges gibt es keine Fundstücke');
  await page.click('[data-tab="goal"]'); await page.waitForTimeout(300);
  await page.locator('.card', { hasText: 'Fundstücke' }).locator('.buy').click(); await page.waitForTimeout(300);
  check((await page.locator('#toast').textContent()).includes('/ 42'), 'Sammlung der Fundstücke öffnet sich (42)');
  await shot('25-fundstuecke');
  await page.click('#tClose'); await page.waitForTimeout(200);

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
    await p.goto(file); await calm(p); await p.waitForTimeout(1200); return p;
  };
  const off = await withSave({ gold: 500, gems: 3, depth: 22, maxDepth: 22, pick: 12, dw: [10, 6, 2, 0, 0, 0, 0, 0], gu: { power: 0, gold: 0, crit: 0, offline: 0, chest: 0 }, taps: 900, saved: Date.now() - 3600 * 1000, up: { spitze: true }, goals: {}, heir: 0, st: { bosses: 2, chests: 1, prest: 0 } });
  check(await off.locator('#toast').isVisible(), 'Offline-Belohnung erscheint');
  await off.screenshot({ path: `${out}/16-zurueck.png` });

  // 12) Alter Spielstand (vor dem Ausbau) lädt
  const old = await withSave({ gold: 5000, gems: 12, depth: 34, maxDepth: 34, pick: 20, dw: [10, 5, 2, 0, 0, 0], gu: { power: 1, gold: 0, crit: 0, offline: 0, chest: 0 }, taps: 3000, saved: Date.now(), farm: false });
  s = await old.evaluate(() => JSON.parse(JSON.stringify(window.__mine.S)));
  check(s.depth === 34 && s.st.bosses === 3 && s.dw.length === 8 && s.goals.d25, `Alter Spielstand lädt (Bosse ${s.st.bosses}, Ziele ${Object.keys(s.goals).length}, Steine ${s.gems})`);
  check((await old.evaluate(() => window.__mine.tip)) === null && !(await old.locator('#tip').isVisible()), 'Alter Spielstand: keine Anfänger-Tipps');
  await old.screenshot({ path: `${out}/17-alter-stand.png` });

  // 12b) Alter Spielstand, der das Herz des Berges schon besiegt hat (Rekord 230): Alter Berg geschafft
  const deep = await withSave({ gold: 1e30, gems: 400, depth: 228, maxDepth: 230, pick: 150, dw: [100, 100, 100, 100, 100, 100, 50, 20], gu: { power: 20, gold: 20, crit: 5, offline: 3, chest: 3 }, taps: 90000, saved: Date.now(), up: { spitze: true }, goals: { d200: true }, heir: 300, st: { bosses: 80, chests: 90, prest: 6, time: 30000 }, best: 230, recBase: 180, runs: [{ n: 6, d: 180, h: 144, t: 5000 }], runTime: 9000, lastMaxAt: 8000, tips: {} });
  await deep.waitForTimeout(800);
  s = await deep.evaluate(() => JSON.parse(JSON.stringify(window.__mine.S)));
  check(s.blockDone && s.depth === 150 && s.towers.length === 1 && s.crowns === 10 && s.best === 230 && s.heir === 300 && s.goals.k1, `Rekord 230: Alter Berg geschafft, 👑 ${s.crowns}, Tiefe ${s.depth}`);
  check((await deep.locator('#toast').textContent()).includes('Neu: Blöcke und Kronen!') && await deep.locator('#tMap').isVisible(), 'Erklärung «Neu: Blöcke und Kronen!» für alte Spielstände');
  await deep.screenshot({ path: `${out}/17b-alter-stand-230.png` });
  await deep.click('#tMap'); await deep.waitForTimeout(400);
  await deep.screenshot({ path: `${out}/17c-alter-stand-karte.png` });
  await deep.click('#tClose'); await deep.waitForTimeout(800);
  check(await deep.locator('#blockBtn').isVisible(), 'Knopf «Nächster Block» sichtbar');
  await deep.screenshot({ path: `${out}/17d-alter-stand-naechster-block.png` });
  const moved = await withSave({ gold: 5000, gems: 50, depth: 80, maxDepth: 80, pick: 60, dw: [50, 30, 10, 5, 2, 0, 0, 0], gu: { power: 5, gold: 5, crit: 0, offline: 0, chest: 0 }, taps: 20000, saved: Date.now(), up: {}, goals: {}, heir: 120, st: { bosses: 40, chests: 20, prest: 3, time: 9000 }, best: 200, recBase: 200, runs: [], runTime: 600, lastMaxAt: 500, tips: {} });
  await moved.waitForTimeout(800);
  s = await moved.evaluate(() => JSON.parse(JSON.stringify(window.__mine.S)));
  check(!s.blockDone && s.depth === 80 && s.towers.length === 1 && s.heir === 120 && s.blkBest === 80, `Rekord 200, jetzt Tiefe 80: Turm da, man gräbt weiter (${s.depth})`);
  const mid = await withSave({ gold: 5000, gems: 50, depth: 120, maxDepth: 120, pick: 60, dw: [50, 30, 10, 5, 2, 0, 0, 0], gu: { power: 5, gold: 5, crit: 0, offline: 0, chest: 0 }, taps: 20000, saved: Date.now(), up: {}, goals: {}, heir: 120, st: { bosses: 40, chests: 20, prest: 3, time: 9000 }, best: 120, recBase: 100, runs: [], runTime: 600, lastMaxAt: 500, tips: {} });
  s = await mid.evaluate(() => JSON.parse(JSON.stringify(window.__mine.S)));
  check(s.towers.length === 0 && s.blkBest === 120 && s.crowns === 0 && !(await mid.locator('#tMap').count()), 'Rekord 120: noch kein Block geschafft');
  await mid.waitForTimeout(600);
  await mid.screenshot({ path: `${out}/17e-tiefe-120.png` });

  // 13) Englisch
  const en = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, locale: 'en-US' });
  en.on('pageerror', e => errors.push('en pageerror: ' + e.message));
  await en.goto(file); await calm(en); await en.waitForTimeout(500);
  check((await en.locator('#tip').textContent()).includes('Tap the rock'), 'Tipp auf Englisch');
  await en.evaluate(() => { const m = window.__mine; m.S.gold = 1e9; m.S.maxDepth = 60; m.jump(60); });
  await en.click('[data-tab="goal"]'); await en.waitForTimeout(300);
  await en.screenshot({ path: `${out}/18-englisch-ziele.png` });
  await en.click('[data-tab="pick"]'); await en.waitForTimeout(300);
  await en.screenshot({ path: `${out}/19-englisch-werkzeuge.png` });
  await en.evaluate(() => { const m = window.__mine; m.S.towers.push({ k: 'stein', since: Date.now() - 3 * 3600e3 }); m.S.crowns = 12; m.showRealm(); });
  await en.waitForTimeout(300);
  check((await en.locator('#toast').textContent()).includes('Your Realm') && (await en.locator('#toast').textContent()).includes('Volcano'), 'Karte auf Englisch');
  await en.screenshot({ path: `${out}/19b-englisch-karte.png` });

  // 14) PC
  const desk = await browser.newPage({ viewport: { width: 1280, height: 720 }, locale: 'de-CH' });
  desk.on('pageerror', e => errors.push('desk pageerror: ' + e.message));
  await desk.goto(file); await calm(desk); await desk.waitForTimeout(400);
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
