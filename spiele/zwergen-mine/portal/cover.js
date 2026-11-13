// Zwergen-Mine: Titelbilder fürs Einreichen, aus dem Spiel selbst erzeugt (keine KI-Bilder).
// Aufruf: node portal/cover.js [ordner]   schreibt cover-1920x1080.png, cover-800x1200.png, cover-800x800.png und shot-1..5.png
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const path = require('path'), fs = require('fs');
const out = process.argv[2] || path.join(__dirname, 'dist', 'bilder');
fs.mkdirSync(out, { recursive: true });
const file = 'file://' + path.join(__dirname, '..', 'index.html');
// [Block, Tiefe]: fünf Welten, jede in einer hübschen Schicht
const SCENES = [['stein', 75], ['vulkan', 85], ['eis', 65], ['wasser', 115], ['stern', 135]];

(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const shots = [];
  for (const [blk, depth] of SCENES) {
    const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, locale: 'en-US' });
    await p.addInitScript(() => { window.__mineNoNews = true; });
    await p.goto(file); await p.waitForTimeout(300);
    await p.evaluate(([blk, depth]) => {
      const m = window.__mine, S = m.S;
      window.__mineSpecial.off = window.__mineMole.off = window.__mineTrader.off = window.__mineGear.off = true;
      S.tips = { tap: 1, dwarf: 1, boss: 1, gem: 1, move: 1, end: 1 }; S.unl = { vulkan: 1, eis: 1, wasser: 1, stern: 1 };
      S.rankSeen = 99; S.blk = blk; S.gems = 128; S.gold = 4.2e9; S.crowns = 37; S.crownsAll = 60; S.pick = 40;
      for (const d of m.DWARVES) S.dw[d.k] = 12;
      for (const h of m.HEROES) S.hero.lv[h.k] = 3; S.hero.on = m.HEROES[['stein', 'vulkan', 'eis', 'wasser', 'stern'].indexOf(blk)].k; S.hero.seen = 5;
      m.jump(depth - 1); m.buildPanel();
      
    }, [blk, depth]);
    await p.waitForTimeout(4200);
    await p.evaluate(() => { window.__mine.tap(); }); await p.waitForTimeout(260);
    const n = shots.length + 1;
    await p.screenshot({ path: path.join(out, `shot-${n}.png`) });
    shots.push((await p.locator('#scene').screenshot()).toString('base64'));
    await p.close();
  }
  const img = (i) => `<img src="data:image/png;base64,${shots[i]}">`;
  const page = (w, h, order) => `<!doctype html><meta charset="utf-8"><style>
    html,body{margin:0;width:${w}px;height:${h}px;overflow:hidden;background:#140f1c;font-family:system-ui,"Segoe UI",Roboto,sans-serif}
    .row{position:absolute;inset:0;display:flex}
    .row div{flex:1;overflow:hidden;position:relative;border-right:${Math.round(w / 240)}px solid #140f1c}
    .row div:last-child{border:0}
    .row img{position:absolute;left:50%;top:50%;height:100%;transform:translate(-44%,-50%)}
    .shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(20,15,28,.0) 55%,rgba(20,15,28,.9) 88%)}
    h1{position:absolute;left:0;right:0;bottom:${Math.round(h * 0.05)}px;margin:0;text-align:center;white-space:nowrap;font-weight:900;letter-spacing:.02em;
       font-size:${Math.round(Math.min(w / 8.8, h / 6.5))}px;line-height:1;color:#f5c542;
       text-shadow:0 ${Math.round(h / 120)}px 0 #7a4a12,0 ${Math.round(h / 60)}px ${Math.round(h / 30)}px rgba(0,0,0,.7);-webkit-text-stroke:${Math.max(2, Math.round(w / 500))}px #3a2408}
  </style><div class="row">${order.map(i => `<div>${img(i)}</div>`).join('')}</div><div class="shade"></div><h1>Zwergen-Mine</h1>`;
  for (const [w, h, order] of [[1920, 1080, [0, 1, 2, 3, 4]], [800, 1200, [1, 4]], [800, 800, [0, 1, 4]]]) {
    const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
    await p.setContent(page(w, h, order)); await p.waitForTimeout(300);
    await p.screenshot({ path: path.join(out, `cover-${w}x${h}.png`) });
    await p.close();
  }
  await b.close();
  console.log('Bilder in ' + out);
})();
