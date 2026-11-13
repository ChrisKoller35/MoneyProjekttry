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
  const calm = (pg) => pg.evaluate(() => { window.__mineSpecial.off = true; window.__mineMole.off = true; window.__mineQuote.off = true; window.__mineTrader.off = true; window.__mineGear.off = true; window.__minePet.off = true; });

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

  // 2b) Zwergen-Spruch (Sprechblase über einem Zwerg)
  await page.evaluate(() => window.__mineQuote.say('plain'));
  await page.waitForTimeout(150);
  const quoteText = await page.evaluate(() => window.__mineQuote.quote && window.__mineQuote.quote.text);
  check(!!quoteText && ['Steine. Wieder Steine. Überraschung.', 'Graben ist meditativ. Sagt niemand.', 'Wer zuletzt hackt, zahlt die Runde.'].includes(quoteText), `Zwergen-Spruch sichtbar (${quoteText})`);
  await shot('03b-spruch');
  check((await page.evaluate(() => window.__mineQuote.key)) === 'plain', 'Spruch-Lage am Anfang: plain');

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
  check((await page.evaluate(() => window.__mine.GOALS.length)) === 60, '60 Ziele');

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

  // 9d4) Runde 2: Kronen-Laden, Gletscher, Grotte
  await page.evaluate(() => { window.__mine.S.crowns = 400; });
  await page.click('#crownPill'); await page.waitForTimeout(300);
  await page.click('#tShop'); await page.waitForTimeout(300);
  check((await page.locator('#toast').textContent()).includes('Kronen-Laden') && await page.locator('[data-buy="kraft"]').isEnabled(), 'Kronen-Laden öffnet sich aus der Karte');
  await shot('26-kronen-laden');
  const dmg0 = await page.evaluate(() => window.__mine.F.pickDmg(window.__mine.S.pick, window.__mine.S));
  await page.click('[data-buy="kraft"]'); await page.waitForTimeout(200);
  for (const k of ['start', 'gilde', 'lager', 'turm', 'helm', 'gpick']) { await page.click(`[data-buy="${k}"]`); await page.waitForTimeout(150); }
  s = await S();
  const dmg1 = await page.evaluate(() => window.__mine.F.pickDmg(window.__mine.S.pick, window.__mine.S));
  const si = await page.evaluate(() => window.__mine.storeInfo());
  check(Math.abs(dmg1 / dmg0 - 1.2) < 0.001 && s.crownsAll === 34 && s.crowns < 400 && s.shop.helm === 1 && s.shop.lager === 1, `Kronen-Kraft +20 %, Punktestand bleibt (${s.crowns} Kronen übrig, Punkte ${s.crownsAll})`);
  check(si.cap === Math.floor(18 * 1.25) && si.rate === 1.25, `Grösseres Lager 18 h und Turm-Antrieb +25 % (${si.cap}, ${si.rate}/h)`);
  await shot('27-laden-gekauft');
  await page.click('#tBack'); await page.waitForTimeout(300);
  check(await page.locator('[data-unl="eis"]').isEnabled() && await page.locator('[data-unl="wasser"]').isEnabled(), 'Gletscher und Grotte lassen sich freischalten');
  await page.click('[data-unl="eis"]'); await page.waitForTimeout(200);
  await page.click('[data-go="eis"]'); await page.waitForTimeout(300);
  if (await page.locator('#tYes').isVisible()) { await page.click('#tYes'); await page.waitForTimeout(300); }
  s = await S();
  check(s.blk === 'eis' && s.depth <= 2 && s.gold >= 1000 && s.gold < 1500 && s.dw[0] === 10, `Gletscher startet mit Startkapital und Gilde (Gold ${s.gold}, Gräber ${s.dw[0]})`);
  check((await page.evaluate(() => window.__mine.layerAt(5).name)) === 'Schnee', 'Gletscher hat eigene Schichten (Schnee)');
  const ice = await page.evaluate(() => {
    const m = window.__mine; m.S.dw = m.S.dw.map(() => 0); m.jump(33); window.__mineSpecial.spawn(null); m.freeze();
    const hp = m.S.hp, d = m.F.pickDmg(m.S.pick, m.S); m.tap(); const half = (hp - m.S.hp) / d;
    m.S.up.dyn = true; m.S.cdDyn = 0; m.useDyn(); return { half, melted: !m.frozen, b: m.banners() };
  });
  check([0.5, 2.5].some(x => Math.abs(ice.half - x) < 0.01) && ice.melted && ice.b.includes('Eis geschmolzen!'), `Eis halbiert den Schaden, Dynamit schmilzt es (×${ice.half})`);
  await page.evaluate(() => { window.__mine.jump(34); window.__mine.freeze(); }); await page.waitForTimeout(2600);
  await shot('28-gletscher-eis');
  const fr = await page.evaluate(async () => {
    const m = window.__mine; m.S.dw[0] = 50; m.startFrost(); const hp0 = m.S.hp; await new Promise(r => setTimeout(r, 500)); const cold = hp0 - m.S.hp;
    m.S.up.bier = true; m.S.cdBeer = 0; m.useBeer(); const hp1 = m.S.hp; await new Promise(r => setTimeout(r, 500)); const warm = hp1 - m.S.hp;
    return { frost: m.frost, cold, warm, dps: m.F.totalDps(m.S) };
  });
  check(fr.frost > 10 && fr.cold > 0 && fr.cold < fr.dps * 0.5 * 0.4 && fr.warm > fr.cold * 6, `Kälte: Zwerge frieren, Bier wärmt (${Math.round(fr.cold)} / ${Math.round(fr.warm)})`);
  await page.waitForTimeout(400); await shot('29-kaelte');
  await page.evaluate(() => { const m = window.__mine; m.S.crowns += 50; });
  await page.click('#crownPill'); await page.waitForTimeout(300);
  await page.click('[data-unl="wasser"]'); await page.waitForTimeout(200);
  await page.click('[data-go="wasser"]'); await page.waitForTimeout(300);
  if (await page.locator('#tYes').isVisible()) { await page.click('#tYes'); await page.waitForTimeout(300); }
  const gr = await page.evaluate(() => { const m = window.__mine; return { blk: m.S.blk, name: m.layerAt(5).name, chest: m.F.chestEvery(m.S), chestStein: m.F.chestEvery(Object.assign({}, m.S, { blk: 'stein' })) }; });
  check(gr.blk === 'wasser' && gr.name === 'Tropfstein' && gr.chest * 2 === gr.chestStein, `Grotte: eigene Schichten, doppelt so viele Truhen (${gr.chest} s)`);
  await page.evaluate(() => { const m = window.__mine; m.S.dw = m.S.dw.map(() => 0); m.jump(40); }); await page.waitForTimeout(400);
  await page.evaluate(() => { window.__mine.S.hp = window.__mine.F.rockHp(40); }); await page.waitForTimeout(2600);
  await shot('30-grotte-boss-wasser');
  const fl = await page.evaluate(() => { const m = window.__mine; m.failBoss(); return { d: m.S.depth, b: m.banners() }; });
  check(fl.d === 38 && fl.b.includes('Das Wasser steigt!'), `Grotte: verlorener Boss heisst 2 Tiefen zurück (${fl.d})`);
  await page.evaluate(() => window.__mine.retryBoss());

  // 9e) Ton aus, wenn das Fenster nicht mehr vorne ist
  const foc = await page.evaluate(() => { const m = window.__mine; window.dispatchEvent(new Event('blur')); const a = m.focus; window.dispatchEvent(new Event('focus')); return [a, m.focus]; });
  check(foc[0] === false && foc[1] === true, 'Ton aus, wenn man woanders hinklickt');

  // 9e2) Werbung des Portals: Spiel pausiert und ist stumm, danach geht es weiter
  const ad = await page.evaluate(async () => {
    const m = window.__mine; window.dispatchEvent(new Event('zm-ad-start')); const on = m.paused && m.adOn, hp = m.S.hp, rt = m.S.runTime;
    await new Promise(r => setTimeout(r, 300)); const still = m.S.runTime === rt;
    window.dispatchEvent(new Event('zm-ad-end')); await new Promise(r => setTimeout(r, 300));
    return { on, still, off: !m.paused && !m.adOn, runs: m.S.runTime > rt };
  });
  check(ad.on && ad.still && ad.off && ad.runs, 'Werbung des Portals: Pause und stumm, danach läuft das Spiel weiter');

  // 9e3) Krämer: kein Schnäppchen mit leerem Beutel
  const cheap = await page.evaluate(() => {
    const m = window.__mine, x = window.__mineTrader, g = m.S.gold; m.S.gold = 1; x.spawn('gems'); x.open();
    const price = x.trader.price, dis = document.getElementById('tTrade').disabled, gems = m.S.gems;
    document.getElementById('tChase').click(); x.trader && (x.trader.ph = 'leave'); const same = m.S.gems === gems; m.S.gold = g;
    return { price, dis, same };
  });
  check(cheap.price > 1 && cheap.dis && cheap.same, 'Krämer: mit leerem Beutel gibt es keine billigen Steine (Preis ' + cheap.price + ')');

  // 9e4) In der Werbe-Pause tut die Leertaste nichts
  await page.evaluate(() => window.dispatchEvent(new Event('zm-ad-start')));
  const tp0 = await page.evaluate(() => window.__mine.S.taps); await page.keyboard.press('Space');
  const tp1 = await page.evaluate(() => { const t = window.__mine.S.taps; window.dispatchEvent(new Event('zm-ad-end')); return t; });
  check(tp1 === tp0, 'Werbe-Pause: Leertaste gräbt nicht');

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

  // 9j1) Mauli: ab 5 erwischten Maulwürfen arbeitet einer für die Mine
  const pt = await page.evaluate(async () => {
    const m = window.__mine, x = window.__mineMole, p = window.__minePet; const keep = m.S.st.moles;
    await new Promise(r => setTimeout(r, 700));
    m.S.st.moles = 3; const lv0 = p.lv, none = p.give();
    m.S.st.moles = 4; m.S.gold = 1e6; x.spawn(); await new Promise(r => setTimeout(r, 900)); x.catch();
    const lv1 = p.lv, ban = m.banners().join('|'), g = m.S.gold, got = p.give(), up = m.S.gold - g, shown = !!p.pet;
    m.S.st.moles = 9; x.mole && 0; const lv9 = p.lv; m.S.st.moles = 10; const lv10 = p.lv; m.S.st.moles = 999; const lvMax = p.lv;
    m.S.st.moles = 5; document.querySelector('[data-tab="dwarf"]').click();
    const row = document.getElementById('panel').textContent.includes('Mauli');
    return { lv0, none, lv1, ban, got, up, shown, lv9, lv10, lvMax, row, keep };
  });
  check(pt.lv0 === 0 && pt.none === 0 && pt.lv1 === 1 && pt.ban.includes('wechselt die Seite'), 'Mauli: der fünfte erwischte Maulwurf wechselt die Seite');
  check(pt.got > 0 && Math.abs(pt.up - pt.got) < 1 && pt.shown, `Mauli bringt einen Sack Gold (${pt.got})`);
  check(pt.lv9 === 1 && pt.lv10 === 2 && pt.lvMax === 10 && pt.row, 'Mauli: Stufe steigt alle 5 Maulwürfe bis 10, Zeile im Reiter «Zwerge»');
  await page.waitForTimeout(500); await shot('24a-mauli');
  await page.evaluate(() => { window.__minePet.show(); }); await page.waitForTimeout(200); await shot('24a2-mauli-fenster');
  await page.evaluate((k) => { document.getElementById('tClose').click(); window.__mine.S.st.moles = k + 1; }, pt.keep);

  // 9j2) Kobold-Krämer: Steine gegen Gold, Bier, Würfel; Verjagen lässt Münzen fallen
  const kb = await page.evaluate(() => {
    const m = window.__mine, x = window.__mineTrader; m.jump(25); m.S.gold = 1e9; const gems = m.S.gems;
    x.spawn('gems'); x.open();
    return { open: document.getElementById('toast').style.display === 'block', talk: x.trader.ph === 'talk', gems, has: !!document.getElementById('tTrade') };
  });
  check(kb.open && kb.talk && kb.has, 'Kobold-Krämer: Angebot öffnet sich');
  await shot('24b-kobold');
  const kg = await page.evaluate((gems) => { const m = window.__mine, x = window.__mineTrader; document.getElementById('tTrade').click(); return { gems: m.S.gems - gems, gold: m.S.gold, ph: x.trader && x.trader.ph }; }, kb.gems);
  check(kg.gems === 2 && Math.abs(kg.gold - 7e8) < 1 && kg.ph === 'leave', 'Kobold: 30 % Gold gegen 2 Steine (Tiefe 25)');
  const kc = await page.evaluate(() => {
    const m = window.__mine, x = window.__mineTrader;
    m.S.gold = 1e9; x.spawn('beer'); x.open(); document.getElementById('tChase').click();
    const chased = m.S.gold > 1e9 && x.trader && x.trader.ph === 'leave';
    m.S.gold = 1e9; x.spawn('dice'); x.open(); document.getElementById('tTrade').click(); const dice = [5e8, 1.5e9].includes(Math.round(m.S.gold));
    const offers = []; for (let i = 0; i < 30; i++) { x.spawn(); offers.push(x.trader.offer); }
    const repeat = offers.some((o, i) => i && o === offers[i - 1]);
    window.__mineTrader.trader && (window.__mineTrader.trader.ph = 'leave');
    return { chased, dice, repeat };
  });
  check(kc.chased, 'Kobold verjagt: lässt Münzen fallen und geht');
  check(kc.dice && !kc.repeat, 'Koboldwürfel: Gold ×1,5 oder ×0,5; nie zweimal dasselbe Angebot');
  await page.waitForTimeout(1000);

  // 9j3) Helden-Zwerge: mit Steinen anheuern, aufwerten, genau einer kommt mit
  await page.click('[data-tab="dwarf"]'); await page.waitForTimeout(300);
  check((await page.locator('.card', { hasText: 'Helden-Zwerge' }).count()) === 1, 'Zeile «Helden-Zwerge» im Reiter «Zwerge»');
  const hz = await page.evaluate(() => {
    const m = window.__mine, S = m.S, F = m.F, keepG = S.gems, keepH = JSON.stringify(S.hero);
    S.hero = { lv: {}, on: '', seen: 5 }; S.gems = 100; S.up.zeit = false;
    const tap0 = F.pickDmg(5, S), dps0 = F.dwarfDps(0, 10, S), gold0 = F.rockGold(25, S), chest0 = F.chestMult(S), time0 = F.bossTime(10, S);
    const b1 = m.heroBuy('borin'), on1 = S.hero.on, g1 = S.gems; m.heroBuy('borin');
    const tap2 = F.pickDmg(5, S) / tap0, g2 = S.gems;
    m.heroBuy('thrain'); const stillBorin = S.hero.on === 'borin', dpsOff = F.dwarfDps(0, 10, S) / dps0;
    m.heroTake('thrain'); const dpsOn = F.dwarfDps(0, 10, S) / dps0, tapOff = F.pickDmg(5, S) / tap0;
    S.gems = 1000; m.heroBuy('gundi'); m.heroTake('gundi'); const gold = F.rockGold(25, S) / gold0;
    m.heroBuy('flinka'); m.heroTake('flinka'); const chest = F.chestMult(S) / chest0;
    m.heroBuy('dvala'); m.heroTake('dvala'); const time = F.bossTime(10, S) - time0;
    for (let i = 0; i < 9; i++) m.heroBuy('dvala'); const max = S.hero.lv.dvala, timeMax = F.bossTime(10, S) - time0;
    const locked = (() => { const b = S.best; S.best = 10; S.hero.lv = {}; const r = m.heroBuy('borin'); S.best = b; return !r; })();
    S.hero = { lv: { borin: 2, thrain: 1 }, on: 'borin', seen: 5 }; m.showHeroes();
    return { b1, on1, g1, g2, tap2, stillBorin, dpsOff, dpsOn, tapOff, gold, chest, time, max, timeMax, locked, keepG, keepH };
  });
  const near = (a, b) => Math.abs(a - b) < 0.02;
  check(hz.b1 && hz.on1 === 'borin' && hz.g1 === 96 && hz.g2 === 88 && near(hz.tap2, 1.5), 'Held anheuern (4 Steine), Stufe 2 (8 Steine): Borin Tippen +50 %');
  check(hz.stillBorin && near(hz.dpsOff, 1) && near(hz.dpsOn, 1.15) && near(hz.tapOff, 1), 'Nur der Held, der mitkommt, wirkt (Thrain Zwerge +15 %)');
  check(near(hz.gold, 1.15) && near(hz.chest, 1.3) && hz.time === 3 && hz.max === 5 && hz.timeMax === 15 && hz.locked, 'Gundi Gold, Flinka Truhen, Dvala Boss-Zeit; höchstens Stufe 5; gesperrt unter Tiefe 20');
  await page.waitForTimeout(300);
  check((await page.locator('#toast').textContent()).includes('Borin der Starke') && (await page.locator('#toast [data-take="thrain"]').count()) === 1, 'Helden-Fenster zeigt Helden und «Mitnehmen»');
  await shot('24c-helden');
  await page.click('#toast [data-take="thrain"]'); await page.waitForTimeout(200);
  check(await page.evaluate(() => window.__mine.S.hero.on === 'thrain'), 'Klick auf «Mitnehmen» wechselt den Helden');
  await page.click('#tClose'); await page.waitForTimeout(600);
  await shot('24d-held-am-felsen');
  await page.evaluate((h) => { const S = window.__mine.S; S.hero = JSON.parse(h.keepH); S.gems = h.keepG; window.__mine.buildPanel(); }, hz);

  // 9j4) Beute: Ausrüstung von Bossen, das bessere Stück bleibt, schwächere werden zu einem Stein
  const bt = await page.evaluate(() => {
    const m = window.__mine, S = m.S, F = m.F, G = window.__mineGear, keep = JSON.stringify(S.gear), keepG = S.gems;
    S.gear = {}; const tap0 = F.pickDmg(5, S), dps0 = F.dwarfDps(0, 10, S), gold0 = F.rockGold(25, S);
    const a = G.give({ k: 'pick', r: 1, v: 15 }), tap = F.pickDmg(5, S) / tap0;
    const g0 = S.gems, b = G.give({ k: 'pick', r: 0, v: 8 }), melted = S.gems - g0, still = S.gear.pick.v;
    const c = G.give({ k: 'pick', r: 3, v: 50 }), best = S.gear.pick.v;
    G.give({ k: 'helm', r: 2, v: 30 }); G.give({ k: 'amu', r: 0, v: 10 });
    const dps = F.dwarfDps(0, 10, S) / dps0, gold = F.rockGold(25, S) / gold0;
    let ok = true; const seen = [0, 0, 0, 0];
    for (let i = 0; i < 3000; i++) { const it = G.roll(i % 2 === 0); seen[it.r]++; const R = G.RARITY[it.r]; if (!(it.v >= R.lo && it.v <= R.hi) || !['pick', 'helm', 'amu'].includes(it.k)) ok = false; }
    m.showGear();
    return { a, tap, b, melted, still, c, best, dps, gold, ok, seen, keep, keepG };
  });
  check(bt.a && near(bt.tap, 1.15) && !bt.b && bt.melted === 1 && bt.still === 15 && bt.c && bt.best === 50, 'Beute: besseres Stück bleibt (Tippen +15 %), schwächeres wird zu einem Stein');
  check(near(bt.dps, 1.35) && near(bt.gold, 1.15) && bt.ok && bt.seen.every(n => n > 0) && bt.seen[0] > bt.seen[3], 'Helm stärkt Zwerge, Amulett Gold (je mit Set +5 %); Würfel bleibt in den Grenzen, Legendär ist am seltensten');
  await page.waitForTimeout(300);
  check((await page.locator('#toast').textContent()).includes('Urgrossvaters Donnerhacke'), 'Ausrüstungs-Fenster zeigt die Stücke');
  await shot('24e-ausruestung');
  await page.click('#tClose'); await page.waitForTimeout(200);
  await page.evaluate((h) => { const S = window.__mine.S; S.gear = JSON.parse(h.keep); S.gems = h.keepG; window.__mine.buildPanel(); }, bt);

  // 9j5) Ränge: Punktestand gibt Titel, jeder Rang +10 % Gold und Graben
  const rk = await page.evaluate(() => {
    const m = window.__mine, S = m.S, F = m.F, keep = [S.crownsAll, S.rankSeen];
    S.crownsAll = 0; const r0 = F.rank(S), tap0 = F.pickDmg(5, S), gold0 = F.rockGold(25, S);
    S.crownsAll = 9; const r9 = F.rank(S); S.crownsAll = 10; const r10 = F.rank(S); S.crownsAll = 60; const r60 = F.rank(S), tap = F.pickDmg(5, S) / tap0, gold = F.rockGold(25, S) / gold0;
    S.crownsAll = 1e9; const top = F.rank(S);
    S.crownsAll = 30; S.rankSeen = 1; m.rankCheck(); const banner = m.banners().some(b => b.includes('Neuer Rang')), seen = S.rankSeen;
    m.showRecords(); const txt = document.getElementById('toast').textContent; document.getElementById('toast').style.display = 'none';
    S.crownsAll = keep[0]; S.rankSeen = keep[1];
    return { r0, r9, r10, r60, tap, gold, top, banner, seen, txt };
  });
  check(rk.r0 === 0 && rk.r9 === 0 && rk.r10 === 1 && rk.r60 === 3 && rk.top === 9 && near(rk.tap, 1.3) && Math.abs(rk.gold - 1.3) < 0.05, 'Ränge: 10 Kronen = Rang 2, 60 = Rang 4 (+30 % Gold und Graben), höchstens Rang 10');
  check(rk.banner && rk.seen === 2 && rk.txt.includes('Rang 3: Hauer') && rk.txt.includes('Vorarbeiter'), 'Neuer Rang: Banner einmal, Rekorde zeigen Titel und nächsten Rang');

  // 9j6) Sternenschacht: Zwerge halb so schnell, jeder 10. Tipp ist ein Sternschlag (×15)
  const sn = await page.evaluate(() => {
    const m = window.__mine, S = m.S, F = m.F, keep = JSON.stringify(S);
    S.dw = [20, 5, 0, 0, 0, 0, 0, 0]; const dps0 = F.totalDps(S);
    S.unl.stern = true; m.startBlock('stern'); S.dw = [20, 5, 0, 0, 0, 0, 0, 0];
    const dps = F.totalDps(S) / dps0, name = m.layerAt(1).name, heart = m.layerAt(145).name;
    S.gu.crit = 0; S.pick = 0; m.jump(60); const hp0 = S.hp, per = F.pickDmg(0, S); const hits = [];
    for (let i = 0; i < 10; i++) { const h = S.hp; m.tap(); hits.push(Math.round((h - S.hp) / per)); }
    const cost = m.BLOCKS.find(b => b.k === 'stern').cost;
    return { dps, name, heart, hits, cost, n: m.starN, keep };
  });
  check(near(sn.dps, 0.5) && sn.name === 'Sternenstaub' && sn.heart === 'Herz des Sterns' && sn.cost === 100, 'Sternenschacht: 100 Kronen, Zwerge halb so schnell, eigene Schichten');
  check(sn.hits.filter(h => h >= 15).length === 1 && sn.hits[9] >= 15 && sn.hits.slice(0, 9).every(h => h < 15) && sn.n === 0, 'Sternenschacht: der 10. Tipp ist ein Sternschlag (×15) ' + JSON.stringify(sn.hits));
  await page.evaluate(() => { for (let i = 0; i < 6; i++) window.__mine.tap(); }); await page.waitForTimeout(500);
  await shot('24f-sternenschacht');
  await page.evaluate((k) => { const m = window.__mine, o = JSON.parse(k); for (const key of Object.keys(m.S)) delete m.S[key]; Object.assign(m.S, o); m.jump(o.depth); m.buildPanel(); }, sn.keep);
  await page.waitForTimeout(300);

  // 9j7) Ziele für Helden, Beute und Ränge
  const zg = await page.evaluate(() => {
    const m = window.__mine, S = m.S, F = m.F, G = (id) => F.goalProgress(m.GOALS.find(g => g.id === id), S), keep = [JSON.stringify(S.hero), JSON.stringify(S.gear), S.crownsAll];
    S.hero = { lv: {}, on: '', seen: 5 }; S.gear = {}; S.crownsAll = 0; const zero = [G('e1'), G('g3'), G('q4'), G('a3')];
    S.hero.lv = { borin: 2, dvala: 1 }; S.gear = { pick: { r: 3, v: 50 }, amu: { r: 0, v: 6 } }; S.crownsAll = 60;
    const now = [G('e3'), G('g3'), G('q4'), G('a3')];
    S.hero = JSON.parse(keep[0]); S.gear = JSON.parse(keep[1]); S.crownsAll = keep[2];
    return { zero, now };
  });
  check(zg.zero.join() === '0,0,0,1' && zg.now.join() === '2,2,4,4', 'Ziele zählen Helden, Ausrüstung, Seltenheit und Rang ' + JSON.stringify(zg));

  // 9j8) Schmiede (8 Steine je Wurf, nur Besseres bleibt) und Treue-Serie (Tage in Folge)
  const fg = await page.evaluate(() => {
    const m = window.__mine, S = m.S, G = window.__mineGear, keep = [JSON.stringify(S.gear), S.gems, JSON.stringify(S.daily), S.streak];
    S.gear = { helm: { r: 1, v: 15 } }; S.gems = 8 * 60 + 3; let never = true, wins = 0;
    for (let i = 0; i < 60; i++) { const before = S.gear.helm.v, r = G.forge('helm'); if (!r || S.gear.helm.v < before || (r.win !== (S.gear.helm.v > before))) never = false; if (r && r.win) wins++; }
    const left = S.gems, poor = G.forge('helm') === null, onlyHelm = Object.keys(S.gear).join() === 'helm';
    const day = (d) => { const x = new Date(); x.setDate(x.getDate() - d); return x.getFullYear() + '-' + String(x.getMonth() + 1).padStart(2, '0') + '-' + String(x.getDate()).padStart(2, '0'); };
    S.gems = 0; S.streak = 3; S.daily.day = day(1); m.ensureDaily(); const s1 = S.streak, g1 = S.gems;
    S.gems = 0; S.streak = 9; S.daily.day = day(1); m.ensureDaily(); const g2 = S.gems;
    S.gems = 0; S.streak = 5; S.daily.day = day(3); m.ensureDaily(); const s3 = S.streak, g3 = S.gems;
    S.gear = { helm: { r: 1, v: 15 }, pick: { r: 3, v: 50 } }; S.gems = 20; document.getElementById('toast').style.display = 'none'; m.showGear();
    return { never, wins, left, poor, onlyHelm, s1, g1, g2, s3, g3, keep };
  });
  check(fg.never && fg.left === 3 && fg.poor && fg.onlyHelm, 'Schmiede: 8 Steine je Wurf, das Stück wird nie schlechter, ohne Steine geht nichts (' + fg.wins + ' Verbesserungen in 60 Würfen)');
  check(fg.s1 === 4 && fg.g1 === 4 && fg.g2 === 7 && fg.s3 === 1 && fg.g3 === 1, 'Treue-Serie: Tag 4 in Folge gibt 4 Steine, höchstens 7, eine Lücke fängt bei 1 an');
  await page.waitForTimeout(300);
  check((await page.locator('#toast [data-forge]').count()) === 3, 'Ausrüstungs-Fenster hat drei Schmiede-Knöpfe');
  await shot('24g-schmiede');
  await page.click('#toast [data-forge="amu"]'); await page.waitForTimeout(200);
  check(await page.evaluate(() => window.__mine.S.gems === 12 && !!window.__mine.S.gear.amu), 'Schmieden füllt einen leeren Platz');
  await page.click('#tClose'); await page.waitForTimeout(200);
  await page.evaluate((k) => { const S = window.__mine.S; S.gear = JSON.parse(k[0]); S.gems = k[1]; S.daily = JSON.parse(k[2]); S.streak = k[3]; window.__mine.buildPanel(); }, fg.keep);

  // 9j6) Ausrüstungs-Sets: drei Stücke, die schwächste Güte zählt
  const st = await page.evaluate(() => {
    const m = window.__mine, S = m.S, F = m.F, G = window.__mineGear, keep = JSON.stringify(S.gear), keepG = S.gems;
    document.getElementById('toast').style.display = 'none';
    S.gear = { pick: { r: 3, v: 50 }, helm: { r: 1, v: 15 } }; const none = [F.gearSet(S), F.gear(S, 'pick'), F.gear(S, 'amu')];
    G.give({ k: 'amu', r: 0, v: 6 }); const one = [F.gearSet(S), F.gear(S, 'pick'), F.gear(S, 'amu')], ban = m.banners().join('|');
    S.gear.amu = { r: 2, v: 30 }; const two = [F.gearSet(S), F.gear(S, 'helm')];
    S.gear.helm = { r: 3, v: 50 }; S.gear.amu = { r: 3, v: 50 }; const four = [F.gearSet(S), F.gear(S, 'helm')];
    const goals = [F.goalProgress(m.GOALS.find(g => g.id === 's4'), S), F.goalProgress(m.GOALS.find(g => g.id === 'm5'), S) === S.st.moles];
    S.gear = { pick: { r: 1, v: 15 }, helm: { r: 1, v: 15 }, amu: { r: 2, v: 30 } }; m.showGear();
    const txt = document.getElementById('toast').textContent;
    return { none, one, two, four, ban, goals, txt, keep, keepG, empty: F.gear({}, 'pick') + F.gearSet({}) };
  });
  check(st.none.join() === '0,50,0' && st.one.join() === '1,55,11' && st.ban.includes('Set Stufe 1'), 'Set: drei Plätze belegt gibt Stufe 1 und +5 % auf jedes Stück ' + JSON.stringify(st.one));
  check(st.two.join() === '2,25' && st.four.join() === '4,90' && st.goals.join() === '4,true' && st.empty === 0, 'Set: schwächste Güte zählt, legendär +40 %, ohne Ausrüstung nichts');
  check(st.txt.includes('Set Stufe 2') && st.txt.includes('Episch'), 'Ausrüstungs-Fenster zeigt die Set-Stufe und den nächsten Schritt');
  await page.waitForTimeout(200); await shot('24h-set');
  await page.evaluate((h) => { const S = window.__mine.S; document.getElementById('toast').style.display = 'none'; S.gear = JSON.parse(h.keep); S.gems = h.keepG; window.__mine.buildPanel(); }, st);

  // 9k) Fundstücke: Sammlung im Reiter «Ziele», keine Fundstücke im Herz
  const fd = await page.evaluate(() => { const m = window.__mine; const n0 = Object.keys(m.S.finds).length; for (let i = 0; i < 40; i++) { m.S.maxDepth = 141 + (i % 9); m.onNewMax(); } m.jump(33); return { n: Object.keys(m.S.finds).length - n0 }; });
  check(fd.n === 0, 'Im Herz des Berges gibt es keine Fundstücke');
  await page.click('[data-tab="goal"]'); await page.waitForTimeout(300);
  await page.locator('.card', { hasText: 'Fundstücke' }).locator('.buy').click(); await page.waitForTimeout(300);
  check((await page.locator('#toast').textContent()).includes('/ 42'), 'Sammlung der Fundstücke öffnet sich (42)');
  await shot('25-fundstuecke');
  await page.click('#tClose'); await page.waitForTimeout(200);

  // 9l) Tagesziele: drei je Tag, Lohn in Steinen, Bonus für alle drei, neuer Tag würfelt neu, Gilde-Startzwerge zählen nicht
  await page.click('[data-tab="goal"]'); await page.waitForTimeout(300);
  check((await page.locator('.card', { hasText: 'Heute:' }).count()) === 3, 'Drei Tagesziele oben im Reiter «Ziele»');
  await shot('31-tagesziele');
  const dy = await page.evaluate(() => {
    const m = window.__mine, S = m.S, n = S.daily.goals.length;
    S.daily.done = {}; S.daily.bonus = false; const moles0 = S.st.moles; S.daily.base = { taps: S.taps, boss: S.st.bosses, chest: S.st.chests, mole: S.st.moles, dw: S.dw.reduce((a, b) => a + b, 0) }; m.checkDaily(); const g0 = S.gems, early = Object.keys(S.daily.done).length;
    for (const g of S.daily.goals) { if (g.type === 'taps') S.taps += g.n; if (g.type === 'boss') S.st.bosses += g.n; if (g.type === 'chest') S.st.chests += g.n; if (g.type === 'dw') S.dw[0] += g.n; if (g.type === 'mole') S.st.moles += g.n; }
    m.checkDaily(); S.st.moles = moles0; const sum = S.daily.goals.reduce((a, g) => a + g.gems, 0);
    const got = S.gems - g0, bonus = S.daily.bonus;
    m.checkDaily(); const twice = S.gems - g0;
    const day = S.daily.day; S.daily.day = '2000-01-01'; m.ensureDaily(); const rolled = S.daily.day === day && Object.keys(S.daily.done).length === 0;
    S.daily.day = '2999-01-01'; m.ensureDaily(); const noBack = S.daily.day === '2999-01-01';
    S.daily.day = day;
    S.shop.gilde = 2; S.daily.goals = [{ id: 'dw5', type: 'dw', n: 5, gems: 2 }]; S.daily.base.dw = S.dw.reduce((a, b) => a + b, 0); S.daily.done = {};
    m.startBlock('stein'); const dwp = m.dailyProgress(S.daily.goals[0]); const startDw = S.dw[0];
    S.shop.gilde = 0;
    return { n, early, got, sum, ok: early === 0 && got === sum + 5 && bonus, twice: twice === got, rolled, noBack, dwp, startDw };
  });
  check(dy.n === 3 && dy.ok && dy.twice, 'Tagesziele geben Steine, alle drei +5 extra, nur einmal');
  const dm = await page.evaluate(() => { const m = window.__mine, S = m.S, keep = JSON.stringify(S.daily), k = S.st.moles;
    S.daily.goals = [{ id: 'mole1', type: 'mole', n: 1, gems: 2 }]; S.daily.base = { mole: k }; S.daily.done = {}; const p0 = m.dailyProgress(S.daily.goals[0]);
    S.st.moles = k + 1; const p1 = m.dailyProgress(S.daily.goals[0]); document.querySelector('[data-tab="goal"]').click(); const txt = document.getElementById('panel').textContent.includes('Erwische 1 Maulwurf');
    S.st.moles = k; S.daily = JSON.parse(keep); m.buildPanel(); return { p0, p1, txt }; });
  check(dm.p0 === 0 && dm.p1 === 1 && dm.txt, 'Tagesziel «Erwische 1 Maulwurf» zählt erwischte Maulwürfe');
  check(dy.rolled && dy.noBack, 'Neuer Tag würfelt neue Tagesziele, Uhr zurück nicht');
  check(dy.startDw === 20 && dy.dwp === 0, 'Gilde-Startzwerge zählen nicht fürs Zwerge-Tagesziel');
  await page.click('[data-tab="pick"]'); await page.waitForTimeout(200);

  // 10) Alle 14 Schichten ansehen (eigene Felsform, Erzmuster, Stollen-Deko)
  check(await page.evaluate(() => window.__mine.LOOKS.length === 14), '14 Schicht-Looks');
  for (const d of [5, 15, 25, 35, 45, 55, 65, 75, 85, 95, 105, 115, 125, 135]) {
    await page.evaluate((d) => window.__mine.jump(d), d); await page.waitForTimeout(500);
    await page.screenshot({ path: `${out}/15-look-${String(d).padStart(3, '0')}.png`, clip: { x: 0, y: 0, width: 390, height: 520 } });
  }
  for (const d of [61, 91, 111, 131]) {
    await page.evaluate((d) => window.__mine.jump(d), d); await page.waitForTimeout(1200);
    await shot(`15-schicht-${d}`);
  }

  // 11) Offline-Belohnung (eigener Browser-Kontext, Spielstand vor dem Laden gesetzt)
  const withSave = async (save, news) => {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, locale: 'de-CH' });
    await ctx.addInitScript(([sv, news]) => { window.__mineNoNews = !news; if (!localStorage.getItem('zwergenmine.v1')) localStorage.setItem('zwergenmine.v1', sv); }, [JSON.stringify(save), !!news]);
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

  // 12c) Was ist neu: alter Spielstand sieht einmal die Neuigkeiten, danach nicht mehr
  const nw = await withSave({ gold: 500, gems: 3, depth: 22, maxDepth: 22, pick: 12, dw: [10, 6, 2, 0, 0, 0, 0, 0], gu: { power: 0, gold: 0, crit: 0, offline: 0, chest: 0 }, taps: 900, saved: Date.now(), up: {}, goals: {}, heir: 0, st: { bosses: 2, chests: 1, prest: 0, time: 900 }, best: 22, tips: { tap: 1, dwarf: 1, boss: 1, gem: 1 }, ver: 10 }, true);
  await nw.waitForTimeout(900);
  const nt = await nw.locator('#toast').textContent();
  check(await nw.locator('#toast').isVisible() && nt.includes('Was ist neu?') && nt.includes('Helden-Zwerge') && nt.includes('Ränge') && !nt.includes('Maulwurf'), 'Was ist neu: Spielstand von Version 10 sieht nur die neueren Sachen');
  await nw.screenshot({ path: `${out}/17f-was-ist-neu.png` });
  await nw.click('#tClose'); await nw.waitForTimeout(200);
  check(await nw.evaluate(() => window.__mine.S.ver === window.__mine.VERSION && JSON.parse(localStorage.getItem('zwergenmine.v1')).ver === window.__mine.VERSION), 'Was ist neu: nach dem Schliessen gemerkt');

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
