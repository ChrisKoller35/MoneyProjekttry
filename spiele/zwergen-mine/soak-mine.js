// Zwergen-Mine: Dauertest mit allem Zufall an (Maulwurf, Kobold, besondere Felsen, Sprüche, Beute, Helden) in allen Blöcken
// Aufruf: node soak-mine.js   (Ende: «errors 0» und Exit 0)
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const errs = [];
  for (const blk of ['stein', 'vulkan', 'eis', 'wasser', 'stern']) {
    const p = await b.newPage({ viewport: { width: 390, height: 844 }, locale: 'de-CH', hasTouch: true });
    p.on('pageerror', e => errs.push(blk + ': ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(blk + ' console: ' + m.text()); });
    await p.goto('file://' + path.join(__dirname, 'index.html')); await p.waitForTimeout(300);
    await p.evaluate((blk) => { const m = window.__mine, S = m.S; S.tips = { tap: 1, dwarf: 1, boss: 1, gem: 1, move: 1, end: 1 }; S.unl = { vulkan: 1, eis: 1, wasser: 1, stern: 1 }; S.gems = 500; S.best = 120; if (blk !== 'stein') m.startBlock(blk); S.pick = 30; S.dw = [30, 20, 10, 5, 0, 0, 0, 0]; S.up.dyn = S.up.bier = true; S.gold = 1e9; m.buildPanel(); }, blk);
    for (let i = 0; i < 40; i++) {
      await p.evaluate((i) => {
        const m = window.__mine, S = m.S, T = window.__mineTrader, t = document.getElementById('toast');
        for (let k = 0; k < 25; k++) m.tap();
        if (i % 7 === 1) window.__mineMole.spawn();
        if (i % 7 === 3 && window.__mineMole.mole) window.__mineMole.catch();
        if (i % 9 === 2) { T.spawn(); }
        if (i % 9 === 4 && T.trader && T.trader.ph === 'wait') { T.open(); document.getElementById(i % 2 ? 'tTrade' : 'tChase').click(); }
        if (i % 5 === 0) window.__mineSpecial.spawn(['gold', 'kristall', 'panzer'][i % 3]);
        if (i % 6 === 0) window.__mineQuote.say(['mole','boss','lava','frost','idle','deep','many','rich','plain'][i % 9]);
        if (i % 8 === 5) m.useDyn(); if (i % 8 === 6) m.useBeer();
        if (i % 10 === 7) { for (const h of m.HEROES) m.heroBuy(h.k); m.heroTake(m.HEROES[i % 5].k); }
        if (i % 11 === 8) { m.showHeroes(); } if (i % 11 === 9) { t.style.display = 'none'; m.showGear(); } if (i % 11 === 10) t.style.display = 'none';
        if (i % 13 === 5) { if (S.blk === 'vulkan') m.startLava(); if (S.blk === 'eis') m.startFrost(); }
        if (i % 12 === 11) { m.spawnChest(); m.openChest(); }
        if (i === 20) m.jump(95); if (i === 30) m.jump(145);
        document.querySelector('[data-tab="' + ['pick', 'dwarf', 'gem', 'goal'][i % 4] + '"]').click();
      }, i);
      await p.waitForTimeout(120);
    }
    const st = await p.evaluate(() => { const S = window.__mine.S; return { d: S.depth, gems: S.gems, gear: Object.keys(S.gear).length, hero: S.hero.on, gold: isFinite(S.gold) && S.gold >= 0 }; });
    console.log(blk, JSON.stringify(st));
    await p.close();
  }
  console.log('errors', errs.length, errs.slice(0, 5)); await b.close();
  process.exit(errs.length ? 1 : 0);
})();
