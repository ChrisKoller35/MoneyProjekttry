// Der Abstieg – Pixel-Grafik aus Code: Farbpalette, Figuren, Gegenstände, Symbole.
// Jede Figur ist ein kleines Raster aus Buchstaben (ein Buchstabe = eine Farbe, '.' = durchsichtig).
// Beim Start wird daraus ein Bild gebaut, mit dunklem Rand (Umriss), weisser Treffer-Version und Farbvarianten.
'use strict';
window.A = window.A || {};

A.Art = (function () {
  // Palette (angelehnt an die bekannte 32-Farben-Palette «Endesga 32»)
  const PAL = {
    '0': '#181425', '1': '#262b44', '2': '#3a4466', '3': '#5a6988', '4': '#8b9bb4', '5': '#c0cbdc', '6': '#ffffff',
    r: '#a22633', R: '#e43b44', w: '#f6757a', x: '#ff0044',
    o: '#be4a2f', O: '#d77643', f: '#f77622', y: '#feae34', Y: '#fee761',
    n: '#3e2731', N: '#733e39', m: '#b86f50', M: '#e4a672', s: '#ead4aa', e: '#e8b796', E: '#c28569',
    g: '#265c42', G: '#3e8948', l: '#63c74d', t: '#193c3e',
    b: '#124e89', B: '#0099db', c: '#2ce8f5', v: '#68386c', V: '#b55088', k: '#3e2731',
  };
  const OUTLINE = '#181425';

  // ---------- Bauen ----------
  function hexToRgb(h) { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
  function mk(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
  // rows: Liste von Zeilen; pal: zusätzliche/ersetzte Farben; outline: Umrissfarbe oder false
  function build(rows, pal, outline) {
    const P = Object.assign({}, PAL, pal || {});
    const h = rows.length, w = Math.max(...rows.map(r => r.length));
    const o = outline === false ? 0 : 1;
    const cv = mk(w + o * 2, h + o * 2), ctx = cv.getContext('2d');
    const img = ctx.createImageData(cv.width, cv.height), d = img.data;
    const solid = new Uint8Array(cv.width * cv.height);
    for (let y = 0; y < h; y++) for (let x = 0; x < rows[y].length; x++) {
      const ch = rows[y][x]; if (ch === '.' || ch === ' ') continue;
      const col = P[ch]; if (!col) continue;
      const [r, g, b] = hexToRgb(col); const i = ((y + o) * cv.width + x + o);
      d[i * 4] = r; d[i * 4 + 1] = g; d[i * 4 + 2] = b; d[i * 4 + 3] = 255; solid[i] = 1;
    }
    if (o) {
      const [r, g, b] = hexToRgb(outline || OUTLINE);
      for (let y = 0; y < cv.height; y++) for (let x = 0; x < cv.width; x++) {
        const i = y * cv.width + x; if (solid[i]) continue;
        if ((x > 0 && solid[i - 1]) || (x < cv.width - 1 && solid[i + 1]) || (y > 0 && solid[i - cv.width]) || (y < cv.height - 1 && solid[i + cv.width])) { d[i * 4] = r; d[i * 4 + 1] = g; d[i * 4 + 2] = b; d[i * 4 + 3] = 255; }
      }
    }
    ctx.putImageData(img, 0, 0);
    return cv;
  }
  function silhouette(cv, color) {
    const c = mk(cv.width, cv.height), x = c.getContext('2d');
    x.drawImage(cv, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = color; x.fillRect(0, 0, c.width, c.height);
    return c;
  }
  function flipX(cv) { const c = mk(cv.width, cv.height), x = c.getContext('2d'); x.translate(cv.width, 0); x.scale(-1, 1); x.drawImage(cv, 0, 0); return c; }
  function scaled(cv, s) { const c = mk(cv.width * s, cv.height * s), x = c.getContext('2d'); x.imageSmoothingEnabled = false; x.drawImage(cv, 0, 0, c.width, c.height); return c; }

  // ---------- Figuren-Raster ----------
  // Platzhalter in Rastern: S/T Haut (Rasse), C/D/H Stoff bzw. Hauptfarbe (Klasse/Gegner)
  const R = {};
  const LEG = {
    idle: ['.....22..22.....', '.....22..22.....', '.....NNN.NNN....'],
    a: ['.....22..22.....', '....22....22....', '...NNN.....NNN..'],
    b: ['......2222......', '......2..2......', '......NNNNN.....'],
    p: ['.....22..22.....', '.....22..22.....', '....NNN.NNN.....'],
  };
  const knightTop = [
    '......DC........',
    '.....DCHC.......',
    '....3444443.....',
    '...345555543....',
    '...3455SSSS4....',
    '...345SSS0S4....',
    '...345SSSST4....',
    '....34TTT43.....',
    '...4DCCCCCD4....',
    '...4DCCHCCD4....',
    '...3DCCCCCD3....',
    '...S1yyyyy1S....',
    '....DCCCCCD.....',
  ];
  const archerTop = [
    '................',
    '.....DCCCD......',
    '....DCCCCCC.....',
    '...DCCCCCCCC....',
    '...DCCSSSSSC....',
    '...DCSSSS0S.....',
    '...DCSSSSST.....',
    '....DCTSSTD.....',
    '..NNDCCCCCD.....',
    '..NmDCHCCCDS....',
    '..NNDCCCCCD.....',
    '....1mmmmm1.....',
    '....DCCCCCD.....',
  ];
  const weaverTop = [
    '.........C......',
    '........CC......',
    '.......CCD......',
    '......CCCCD.....',
    '.....CCHCCCD....',
    '..DDDDDDDDDDD...',
    '....SSSSSST.....',
    '....SSSS0SS.....',
    '....TSSSSST.....',
    '....DCCCCCD.....',
    '...SDCCHCCDS....',
    '...DCCCCCCCD....',
    '...DCCYCCCCD....',
  ];
  const weaverLegs = {
    idle: ['..DCCCCCCCCCD...', '..DDCCCCCCCDD...', '...NN.....NN....'],
    a: ['..DCCCCCCCCCD...', '..DDCCCCCCCDD...', '..NN.......NN...'],
    b: ['..DCCCCCCCCCD...', '..DDCCCCCCCDD...', '....NN...NN.....'],
    p: ['..DCCCCCCCCCD...', '..DDCCCCCCCDD...', '...NN.....NN....'],
  };
  R.hero_klinge = ['idle', 'a', 'p', 'b'].map(k => knightTop.concat(LEG[k]));
  R.hero_schuetze = ['idle', 'a', 'p', 'b'].map(k => archerTop.concat(LEG[k]));
  R.hero_weber = ['idle', 'a', 'p', 'b'].map(k => weaverTop.concat(weaverLegs[k]));

  R.slime = [[
    '......CCCC......',
    '....CCHHCCCC....',
    '...CCH6HCCCCC...',
    '..CCCHHCCCCCCC..',
    '..CCCCCCC0CC0C..',
    '.CCCCCCCC0CC0CC.',
    '.CCCCCCCCCCCCCC.',
    '.DCCCCCCCCCCCCD.',
    '.DDCCCCCCCCCCDD.',
    '..DDDDDDDDDDDD..',
  ]];
  R.rat = [[
    '..........mm....',
    '.........mwm....',
    '....mmmmmmmmm...',
    '..mmMMmmmmmm0m..',
    '..mmmmmmmmmmmmw.',
    'w.NmmmmmmmmmmN..',
    '.wNNmmmmmmmmN...',
    '..wNNNNNNNNN....',
    '....N.N..N.N....',
  ], [
    '..........mm....',
    '.........mwm....',
    '....mmmmmmmmm...',
    '..mmMMmmmmmm0m..',
    '..mmmmmmmmmmmmw.',
    '.wNmmmmmmmmmmN..',
    'w.NNmmmmmmmmN...',
    '..wNNNNNNNNN....',
    '...N.N....N.N...',
  ]];
  R.bat = [[
    'C..............C',
    'CC............CC',
    'CCC...C..C...CCC',
    '.CCC..CCCC..CCC.',
    '..CCCCCRCRCCCC..',
    '...CCCCCCCCCC...',
    '.....CCCCCC.....',
    '......CCCC......',
    '......D..D......',
  ], [
    '................',
    '......C..C......',
    '......CCCC......',
    '....CCCRCRCC....',
    '..CCCCCCCCCCCC..',
    '.CCCDCCCCCCDCCC.',
    'CCD..CCCCCC..DCC',
    'CD....CCCC....DC',
    'C.....D..D.....C',
  ]];
  R.mushroom = [[
    '.....CCCCCC.....',
    '...CCC6CCCCCC...',
    '..CC66CCCC6CCC..',
    '..CCCCCCCCCCCC..',
    '..DDDDDDDDDDDD..',
    '.....ssssss.....',
    '.....sss0s0.....',
    '.....ssssss.N...',
    '.....ssEEss.N...',
    '....GssssssGN...',
    '....G.ssss.GN...',
    '......ssss..N...',
    '......MM.MM.....',
  ], [
    '.....CCCCCC.....',
    '...CCC6CCCCCC...',
    '..CC66CCCC6CCC..',
    '..CCCCCCCCCCCC..',
    '..DDDDDDDDDDDD..',
    '.....ssssss.....',
    '.....sss0s0.....',
    '.....ssssss..N..',
    '.....ssEEss..N..',
    '....GssssssG.N..',
    '....G.ssss.GGN..',
    '......ssss......',
    '.....MM...MM....',
  ]];
  R.skeleton = [[
    '.....ssss.......',
    '....ssssss......',
    '....s00s00......',
    '....ssssss......',
    '.....s0s0s......',
    '......ss.....5..',
    '....ssssss...5..',
    '...s.s0s0.s..5..',
    '...s.ssss.s..5..',
    '...s.s0s0.s.s5..',
    '......ss....N...',
    '.....s..s.......',
    '.....s..s.......',
    '....ss..ss......',
  ], [
    '.....ssss.......',
    '....ssssss......',
    '....s00s00......',
    '....ssssss......',
    '.....s0s0s......',
    '......ss.....5..',
    '....ssssss...5..',
    '...s.s0s0.s..5..',
    '...s.ssss.s..5..',
    '...s.s0s0.s.s5..',
    '......ss....N...',
    '.....s..s.......',
    '....s....s......',
    '...ss....ss.....',
  ]];
  R.moth = [[
    '.....N...N......',
    '......N.N.......',
    '..fff.nNn.fff...',
    '.fYYffnNnffYYf..',
    'ffYOYfnNnfYOYff.',
    'fffYffnNnffYfff.',
    '.fffffnNnfffff..',
    '..fff.nNn.fff...',
    '...f..nNn..f....',
    '.......n........',
  ], [
    '.....N...N......',
    '......N.N.......',
    '......nNn.......',
    '...fffnNnfff....',
    '..fYOYnNnYOYf...',
    '..ffYfnNnfYff...',
    '...fffnNnfff....',
    '......nNn.......',
    '......nNn.......',
    '.......n........',
  ]];
  R.spider = [[
    '1..............1',
    '.1....2222....1.',
    '..1..233332..1..',
    '111.22222222.111',
    '...12R2RR2R221..',
    '1111222222221111',
    '...1222222221...',
    '..1..222222..1..',
    '.1....2222....1.',
    '1.....1..1.....1',
  ], [
    '.1............1.',
    '..1...2222...1..',
    '1..1.233332.1..1',
    '.11.22222222.11.',
    '...12R2RR2R221..',
    '.111222222221111',
    '1..1222222221..1',
    '...1.222222.1...',
    '..1...2222...1..',
    '.1....1..1....1.',
  ]];
  R.golem = [[
    '.......NNNNN........',
    '......NoOOOoN.......',
    '......NoYoYoN.......',
    '......NooooON.......',
    '...NNNNNNNNNNNNN....',
    '..NoOOOoooooOOOoN...',
    '..NoOOoooooooOOoN...',
    '..NoOoNoooooNoOoN...',
    '..NooNooYYooNooN....',
    '..NNoNoooooooNoNN...',
    '..NoNNoooooooNNoN...',
    '..NoN.NoooooN.NoN...',
    '..OoN.NNNNNNN.NoO...',
    '..OON.No...oN.NOO...',
    '......No...oN.......',
    '.....NNo...oNN......',
    '.....NNN...NNN......',
  ], [
    '.......NNNNN........',
    '......NoOOOoN.......',
    '......NoYoYoN.......',
    '......NooooON.......',
    '...NNNNNNNNNNNNN....',
    '..NoOOOoooooOOOoN...',
    '..NoOOoooooooOOoN...',
    '..NoOoNoooooNoOoN...',
    '..NooNooYYooNooN....',
    '..NNoNoooooooNoNN...',
    '..NoNNoooooooNNoN...',
    '..NoN.NoooooN.NoN...',
    '..OoN.NNNNNNN.NoO...',
    '..OON.No...oN.NOO...',
    '.....No.....oN......',
    '....NNo.....oNN.....',
    '....NNN.....NNN.....',
  ]];
  R.ghost = [[
    '....CCCCC.....',
    '...CHHCCCCC...',
    '..CHHCCCCCCC..',
    '..CHCCCCCCCC..',
    '.CCCCC0CC0CC..',
    '.CCCCC0CC0CC..',
    '.CCCCCCCCCCCC.',
    '.CCCCCC00CCCC.',
    '.CCCCCCCCCCCC.',
    '.DCCCCCCCCCCC.',
    '.DCCCCCCCCCCD.',
    '.DDCCCCCCCCDD.',
    '.D.DDCD.DCDD..',
    '.D..D.D..D.D..',
  ], [
    '....CCCCC.....',
    '...CHHCCCCC...',
    '..CHHCCCCCCC..',
    '..CHCCCCCCCC..',
    '.CCCCC0CC0CC..',
    '.CCCCC0CC0CC..',
    '.CCCCCCCCCCCC.',
    '.CCCCCC00CCCC.',
    '.CCCCCCCCCCCC.',
    '.DCCCCCCCCCCC.',
    '.DCCCCCCCCCCD.',
    '.DDCCCCCCCCDD.',
    '..DD.DCD.DCDD.',
    '..D..D..D..D..',
  ]];
  R.worm = [[
    '...........NNNN...',
    '..........NmmmmN..',
    '.........NmnnnnmN.',
    '.........mnsnsnnm.',
    '.........mnnnnnnm.',
    '.........NmsnsnmN.',
    '....NN....NmmmmN..',
    '...NmmN..NmmmmN...',
    '..NmMMmNNmMMmN....',
    '..NmmmmmmmmmmN....',
    '...NNmmmmmmNN.....',
    '..nnnNNNNNNnnn....',
    '.nnnnnnnnnnnnnn...',
  ], [
    '..........NNNN....',
    '.........NmmmmN...',
    '........NmnnnnmN..',
    '........mnsnsnnm..',
    '........mnnnnnnm..',
    '........NmsnsnmN..',
    '....NN...NmmmmN...',
    '...NmmN.NmmmmN....',
    '..NmMMmNmMMmN.....',
    '..NmmmmmmmmmN.....',
    '...NNmmmmmmNN.....',
    '..nnnNNNNNNnnn....',
    '.nnnnnnnnnnnnnn...',
  ]];
  R.kobold = [[
    '.....2222.....',
    '....222222....',
    'MM.22MMMMM....',
    '.MMMMMY0MM....',
    '..MMMMMMMMw...',
    '...MMMMMM.....',
    '...222222.....',
    '..N2222222.5..',
    '.NN2222222M5..',
    '.NN.22222..5..',
    '....m..m......',
    '...mm..mm.....',
  ], [
    '.....2222.....',
    '....222222....',
    'MM.22MMMMM....',
    '.MMMMMY0MM....',
    '..MMMMMMMMw...',
    '...MMMMMM.....',
    '...222222.....',
    '..N2222222.5..',
    '.NN2222222M5..',
    '.NN.22222..5..',
    '.....mm.m.....',
    '....mm...mm...',
  ]];
  R.crown = [[
    'Y..Y..Y',
    'YY.Y.YY',
    'yYYYYYy',
    'yRyByRy',
    'yyyyyyy',
  ]];

  // ---------- Waffen (zeigen nach rechts, Griff links) ----------
  R.w_sword = [[
    '.y.........',
    'NyY55555556',
    'NyY44444445',
    '.y.........',
  ]];
  R.w_bow = [[
    '..NN...',
    '.N..5..',
    'N...5..',
    'N...5..',
    'm...5..',
    'm...5..',
    'N...5..',
    'N...5..',
    '.N..5..',
    '..NN...',
  ]];
  R.w_staff = [[
    '..cB..',
    '.cBBc.',
    '..cB..',
    '..N...',
    '..m...',
    '..N...',
    '..m...',
    '..N...',
    '..m...',
    '..N...',
    '..m...',
    '..N...',
  ]];
  R.arrow = [['N.......', 'NmmmmmM5', 'N.......']];

  // ---------- Dinge im Raum ----------
  R.chest = [[
    '..NNNNNNNNNNNN..',
    '.NmmmmmmmmmmmmN.',
    '.NMMMMMMMMMMMMN.',
    '.NmmmmmmmmmmmmN.',
    '.yyyyyyyyyyyyyy.',
    '.NnnnnnyYynnnnN.',
    '.NmmmmmyyymmmmN.',
    '.NmmmmmmmmmmmmN.',
    '.NmmmmmmmmmmmmN.',
    '.yyyyyyyyyyyyyy.',
    '.NNNNNNNNNNNNNN.',
  ], [
    '..NNNNNNNNNNNN..',
    '.NmmmmmmmmmmmmN.',
    '.yyyyyyyyyyyyyy.',
    '.N000yYy0yY000N.',
    '.NnYyYYyYYyYnnN.',
    '.yyyyyyyyyyyyyy.',
    '.NmmmmmmmmmmmmN.',
    '.NmmmmmmmmmmmmN.',
    '.NmmmmmmmmmmmmN.',
    '.yyyyyyyyyyyyyy.',
    '.NNNNNNNNNNNNNN.',
  ]];
  R.flame = [[
    '...Y....',
    '...YY...',
    '..YYf...',
    '..fYYf..',
    '.ffYYff.',
    '.fYYYYf.',
    'ofYY6Yfo',
    'ofY66Yfo',
    '.ofYYfo.',
    '..offo..',
  ], [
    '....Y...',
    '...YY...',
    '...fYY..',
    '..fYYf..',
    '.ffYYff.',
    '.fYYYYf.',
    'ofY6YYfo',
    'ofY66Yfo',
    '.ofYYfo.',
    '..offo..',
  ], [
    '........',
    '...Y....',
    '..YY....',
    '..fYYf..',
    '.ffYYf..',
    '.fYYYYf.',
    'ofYY6Yfo',
    'ofY66Yfo',
    '.ofYYfo.',
    '..offo..',
  ]];
  R.logs = [[
    '....33......33....',
    '..34..NmmmmmN.43..',
    '.3...NmMNNNMmN..3.',
    '..43..NNNNNNN..34.',
    '....33......33....',
  ]];
  R.merchant = [[
    '.......vvv......',
    '......vvvvv.....',
    '.....vvVVvvv....',
    '.....vv000vv....',
    '.....vvY0Yvv....',
    '......vvvvv.....',
    '...NN.vVVVv.....',
    '..NmmNvvvvvvM...',
    '..NmmNvVvvvvM...',
    '..NmmNvvvvvvY...',
    '..NNNNvvvvvvy...',
    '......vvvvvv....',
    '......vvvvvv....',
    '.......n..n.....',
  ]];
  R.statue = [[
    '.....444......',
    '....45554.....',
    '....4V5V4.....',
    '....45554.....',
    '.....444......',
    '....34443.....',
    '...344444344..',
    '...3444443.45.',
    '...3444443....',
    '....34443.....',
    '....34443.....',
    '...3444443....',
    '..322222223...',
    '..344444443...',
    '..322222223...',
  ]];
  R.sign = [[
    '.NNNNNNNNNNNNNNNN.',
    '.NmmmmmmmmmmmmmmN.',
    '.NmMMMMMMMMMMMMmN.',
    '.NmmmmmmmmmmmmmmN.',
    '.NNNNNNNNNNNNNNNN.',
    '........NN........',
    '........NN........',
    '.......nNNn.......',
  ]];
  R.sconce = [['.3N3.', '..N..', '.333.', '..3..']];
  R.banner = [[
    'NNNNNNNNNN',
    '.CCCCCCCC.',
    '.CHCCCCCC.',
    '.CCCYYCCC.',
    '.CCYCCYCC.',
    '.CCCYYCCC.',
    '.CCCCCCCC.',
    '.DCCCCCCD.',
    '.DC.DD.CD.',
    '.D......D.',
  ]];
  R.skull = [['.sss.', 'sssss', 's0s0s', '.sss.', '.s.s.']];
  R.bones = [['s.....s', '.sssss.', 's.....s']];
  R.barrel = [[
    '..NNNNNN..',
    '.NmmmmmmN.',
    'N33333333N',
    'NmMmmmmmmN',
    'NmMmmmmmmN',
    'N33333333N',
    'NmMmmmmmmN',
    'NmMmmmmmmN',
    'N33333333N',
    '.NmmmmmmN.',
    '..NNNNNN..',
  ]];
  R.crate = [[
    'NNNNNNNNNNNN',
    'NMMMMMMMMMMN',
    'NMmNNNNNNmMN',
    'NMNmMMMMmNMN',
    'NMNMmMMmMNMN',
    'NMNMMmmMMNMN',
    'NMNMmMMmMNMN',
    'NMNmMMMMmNMN',
    'NMmNNNNNNmMN',
    'NMMMMMMMMMMN',
    'NNNNNNNNNNNN',
  ]];
  R.pot = [[
    '..NNNN..',
    '..mMMm..',
    '.NmmmmN.',
    'NmMmmmmN',
    'NmMmmmmN',
    'NmmmmmmN',
    '.NmmmmN.',
    '..NNNN..',
  ]];
  R.candle = [['.Y.', '.f.', 'sss', 'sMs', 'sMs', 'sss']];
  R.coin = [[
    '.yyyy.',
    'yYYYYy',
    'yYyy6y',
    'yYyyYy',
    'yYYYYy',
    '.yyyy.',
  ], [
    '..yy..',
    '.yYYy.',
    '.yYy6.',
    '.yYyy.',
    '.yYYy.',
    '..yy..',
  ], [
    '..yy..',
    '..Yy..',
    '..Y6..',
    '..Yy..',
    '..Yy..',
    '..yy..',
  ]];
  R.potion = [[
    '..NNN..',
    '..s5s..',
    '...5...',
    '..5R5..',
    '.5RRR5.',
    '5RRw6R5',
    '5RRRRR5',
    '5rRRRr5',
    '.5rrr5.',
  ]];

  // ---------- Item-Symbole (16x16) ----------
  const I = {};
  I.schwert = [
    '..............55',
    '.............565',
    '............565.',
    '...........565..',
    '..........565...',
    '.........565....',
    '........565.....',
    '.......565......',
    '..yy..565.......',
    '..yyy565........',
    '...yy65.........',
    '...yNyy.........',
    '..NNy.yy........',
    '.NN.............',
    'NN..............',
  ];
  I.axt = [
    '.........555....',
    '........55665...',
    '.......5544665..',
    '.......54NN465..',
    '........4NNN45..',
    '.........NN444..',
    '........NN.44...',
    '.......NN.......',
    '......NN........',
    '.....NN.........',
    '....NN..........',
    '...NN...........',
    '..mN............',
    '.mm.............',
  ];
  I.dolch = [
    '................',
    '..........55....',
    '.........565....',
    '........565.....',
    '.......565......',
    '......565.......',
    '...y.565........',
    '...yy65.........',
    '....yyy.........',
    '....Nyy.........',
    '...NN..y........',
    '..NN............',
    '..y.............',
  ];
  I.bogen = [
    '.......NNN......',
    '.....NNmM.5.....',
    '....Nm....5.....',
    '...Nm.....5.....',
    '...N......5.....',
    '..Nm......5.....',
    '..mm......5.....',
    '..Nm......5.....',
    '...N......5.....',
    '...Nm.....5.....',
    '....Nm....5.....',
    '.....NNmM.5.....',
    '.......NNN......',
  ];
  I.armbrust = [
    '................',
    '....4.......4...',
    '...4.4.....4.4..',
    '...4..55555..4..',
    '....NNNNNNNNN...',
    '.......NmN......',
    '.......NmN......',
    '.......NmN......',
    '......NmmmN.....',
    '......NmMmN.....',
    '.......NmN......',
    '.......NNN......',
  ];
  I.stab = [
    '...........cc...',
    '..........cBBc..',
    '..........cB6c..',
    '...........cc...',
    '..........N.....',
    '.........Nm.....',
    '........Nm......',
    '.......Nm.......',
    '......Nm........',
    '.....Nm.........',
    '....Nm..........',
    '...Nm...........',
    '..Nm............',
    '.Nm.............',
  ];
  I.zepter = [
    '..........Y.....',
    '.........yRy....',
    '........yR6Ry...',
    '.........yRy....',
    '........y.y.....',
    '.......yy.......',
    '......yy........',
    '.....yy.........',
    '....yy..........',
    '...yy...........',
    '..yy............',
    '.YY.............',
  ];
  I.loeffel = [
    '..........444...',
    '.........45554..',
    '........4556554.',
    '........4555554.',
    '.........45554..',
    '.........444....',
    '........44......',
    '.......44.......',
    '......44........',
    '.....44.........',
    '....44..........',
    '...44...........',
    '..44............',
    '.33.............',
  ];
  I.leder = [
    '...NN....NN.....',
    '..NmmN..NmmN....',
    '.NmmmmNNmmmmN...',
    '.NmmMmmmmMmmN...',
    '.NmMmmmmmmMmN...',
    '..NmmmmmmmmN....',
    '..NmmmyymmmN....',
    '..NmmmmmmmmN....',
    '..NNNNNNNNNN....',
    '..NmmmmmmmmN....',
    '...NNNNNNNN.....',
  ];
  I.kette = [
    '...33....33.....',
    '..3443..3443....',
    '.344443344443...',
    '.345454545443...',
    '.343434343443...',
    '..3454545443....',
    '..3434343443....',
    '..3454545443....',
    '..3333333333....',
    '..3434343433....',
    '...33333333.....',
  ];
  I.robe = [
    '....bb..bb......',
    '...bBBbbBBb.....',
    '..bBBBBBBBBb....',
    '..bBBByyBBBb....',
    '...bBBBBBBb.....',
    '...bBBBBBBb.....',
    '...bBByBBBb.....',
    '..bBBBBBBBBb....',
    '..bBBBBBBBBb....',
    '.bBBBBBBBBBBb...',
    '.bbbbbbbbbbbb...',
  ];
  I.platte = [
    '..444....444....',
    '.45554..45554...',
    '.4555544555554..',
    '.4556555555554..',
    '..45655555554...',
    '..4565555y554...',
    '..45555555554...',
    '..43333333334...',
    '..45555555554...',
    '...444444444....',
  ];
  I.kappe = [
    '................',
    '.....NNNN.......',
    '....NmmmmN......',
    '...NmMmmmmN.....',
    '...NmmmmmmmN....',
    '...NNNNNNNNNNN..',
    '...NmmmmmmmN....',
  ];
  I.topfhelm = [
    '....444444......',
    '...45555554.....',
    '...45555554.....',
    '...40000004.....',
    '...45555554.....',
    '...45545554.....',
    '...45545554.....',
    '...44444444.....',
  ];
  I.teekessel = [
    '......NN........',
    '.....N..N.......',
    '....444444......',
    '...45555554.....',
    '..4556555554.44.',
    '..45655555544.4.',
    '..4555555554....',
    '..4455555544....',
    '...44444444.....',
  ];
  I.stiefel = [
    '....NNNN........',
    '....NmmN........',
    '....NmmN........',
    '....NmmN........',
    '....NmmN........',
    '....NmMNNNN.....',
    '....NmmmmmmN....',
    '....NNNNNNNN....',
  ];
  I.sandalen = [
    '................',
    '....N...........',
    '....NN..........',
    '....N.N.........',
    '....NNNN........',
    '....N..NN.......',
    '...MMMMMMMM.....',
    '...NNNNNNNN.....',
  ];
  I.stahlstiefel = [
    '....4444........',
    '....4554........',
    '....4554........',
    '....4334........',
    '....4554........',
    '....45544444....',
    '....455555554...',
    '....444444444...',
  ];
  I.ring = [
    '......cc........',
    '.....cBBc.......',
    '.....c6Bc.......',
    '....yyccyy......',
    '...yY....yy.....',
    '...y......y.....',
    '...y......y.....',
    '...yy....yy.....',
    '....yyyyyy......',
  ];
  I.amulett = [
    '..y.......y.....',
    '..y.......y.....',
    '...y.....y......',
    '....y...y.......',
    '.....yYy........',
    '....yRRRy.......',
    '....RR6RR.......',
    '....yRRRy.......',
    '.....yyy........',
  ];
  I.socke = [
    '....RRRR........',
    '....6666........',
    '....RRRR........',
    '....6666........',
    '....RRRR........',
    '....66666.......',
    '....RRRRRRR.....',
    '....6666666.....',
    '.....RRRRR......',
  ];
  I.zahn = [
    '...ssssss.......',
    '..s666666s......',
    '..s66ssss6s.....',
    '..s6sssssss.....',
    '..ssssssss......',
    '...ssEsss.......',
    '...ss..ss.......',
    '...ss..ss.......',
    '...s....s.......',
  ];
  for (const k of Object.keys(I)) R['i_' + k] = [I[k]];

  // ---------- Oberflächen-Symbole ----------
  R.u_heart = [[
    '.RR..RR.',
    'RwRRRRRR',
    'RwRRRRRR',
    'RRRRRRRr',
    '.RRRRRr.',
    '..RRRr..',
    '...Rr...',
  ]];
  R.u_star = [[
    '....Y....',
    '...YY....',
    '..YYYy...',
    'YYYYYYYYy',
    '.yYYYYyy.',
    '..yYYyy..',
    '..yy.yy..',
    '.yy...yy.',
  ]];
  R.u_skull = [[
    '..ssss..',
    '.ssssss.',
    'ssssssss',
    's00ss00s',
    's00ss00s',
    'sssEEsss',
    '.ssssss.',
    '.s0s0s0.',
  ]];
  R.u_spark = [[
    '....V....',
    '....V....',
    '...VwV...',
    'VVVw6wVVV',
    '...VwV...',
    '....V....',
    '....V....',
  ]];
  R.u_scroll = [[
    '.MMMMMMM.',
    'NsssssssN',
    '.s0000ss.',
    '.ssssss..',
    '.s000ss..',
    '.sssssss.',
    'NsssssssN',
    '.MMMMMMM.',
  ]];
  R.u_tent = [[
    '.....N......',
    '....NmN.....',
    '...NmMmN....',
    '..NmM0mmN...',
    '.NmM000mmN..',
    'NmM00000mmN.',
    'NNNNNNNNNNN.',
  ]];
  R.u_down = [[
    '..yyyy..',
    '..yYYy..',
    '..yYYy..',
    'yyyYYyyy',
    '.yYYYYy.',
    '..yYYy..',
    '...yy...',
  ]];
  R.u_bag = [[
    '...NNN...',
    '....N....',
    '..NmmmN..',
    '.NmMmmmN.',
    '.NmmyymN.',
    '.NmmmmmN.',
    '..NNNNN..',
  ]];
  R.u_hand = [[
    '...s.s...',
    '..ss.ss.s',
    '..ss.ssss',
    '.sssssss.',
    'ssssssss.',
    '.ssssss..',
    '..ssss...',
  ]];
  R.u_alert = [['y', 'Y', 'Y', '.', 'Y']];
  R.u_arrowdown = [['.yyy.', '.yYy.', 'yyYyy', '.yYy.', '..y..']];
  R.rope = [['.N.', '.m.', '.N.', '.m.', '.N.', '.m.', '.N.', '.m.', '.N.', '.m.', '.N.', '.m.', '.N.', '.m.', 'NmN', '.N.']];
  R.mushglow = [['.cc.', 'cBBc', '.ss.', '.ss.'], ['.cc..', 'cBBc.', '.s..c', '.s.cB', '...s.']];
  R.brazier = [['N.....N', 'NyyyyyN', '.NyyyN.', '..N3N..', '..333..', '.33333.']];
  R.u_quest = [[
    '..yyy..',
    '.y...y.',
    '.....y.',
    '....y..',
    '...y...',
    '.......',
    '...y...',
  ]];
  R.u_sound = [[
    '...4...4.',
    '..44..4..',
    '4444...4.',
    '4444.4..4',
    '4444...4.',
    '..44..4..',
    '...4...4.',
  ]];
  R.u_mute = [[
    '...4.....',
    '..44.R..R',
    '4444..RR.',
    '4444..RR.',
    '4444.R..R',
    '..44.....',
    '...4.....',
  ]];
  // Fähigkeiten
  R.s_strike = [[
    '.........66',
    '........6Y6',
    '.......6Y6.',
    '..f...6Y6..',
    '.fYf.6Y6...',
    '..f.6Y6....',
    '...yY6.....',
    '..yyy......',
    '.NNyy......',
    'NN.........',
  ]];
  R.s_whirl = [[
    '...6666....',
    '..6....6...',
    '.6..44..6..',
    '6..4..4..6.',
    '6..4.5...6.',
    '6...44...6.',
    '.6......6..',
    '..6....6...',
    '...6666....',
  ]];
  R.s_shield = [[
    '.444444444.',
    '4BBBBYBBBB4',
    '4BBBBYBBBB4',
    '4BBYYYYYBB4',
    '4BBBBYBBBB4',
    '.4BBBYBBB4.',
    '..4BBBBB4..',
    '...4BBB4...',
    '....444....',
  ]];
  R.s_buff = [[
    '....R....',
    '...RRR...',
    '..RRwRR..',
    '.RRRwRRR.',
    '...RRR...',
    '...RRR...',
    '...RRR...',
    '...rrr...',
  ]];
  R.s_heal = [[
    '...lll...',
    '...l6l...',
    '...lll...',
    'lllllllll',
    'l6666666l',
    'lllllllll',
    '...lll...',
    '...l6l...',
    '...lll...',
  ]];
  R.s_bolt = [[
    '......cc.',
    '.....cB..',
    '....cB...',
    '...cBBBB.',
    '.....Bc..',
    '....Bc...',
    '...Bc....',
    '..Bc.....',
    '.c.......',
  ]];
  R.s_nova = [[
    '....f....',
    '.f..Y..f.',
    '..fYYYf..',
    '..YY6YY..',
    'fYY666YYf',
    '..YY6YY..',
    '..fYYYf..',
    '.f..Y..f.',
    '....f....',
  ]];
  R.s_arrow = [[
    '........55',
    '.......565',
    '......5N5.',
    '.....N5...',
    '....N.....',
    '...N......',
    '..N.......',
    '.yy.......',
    'yy........',
  ]];
  R.s_poison = [[
    '...ll....',
    '..lGGl...',
    '.lG6GGl..',
    '.lGGGGl..',
    '..lGGl...',
    '...ll..l.',
    '......lGl',
    '.......l.',
  ]];
  R.s_bind = [[
    'c.......c',
    '.c.....c.',
    '..ccccc..',
    '..c6B6c..',
    '..cBBBc..',
    '..ccccc..',
    '.c.....c.',
    'c.......c',
  ]];

  // ---------- Paletten je Figur ----------
  const RACE_SKIN = { mensch: ['#e8b796', '#c28569'], fels: ['#5a6988', '#3a4466'], schatten: ['#b55088', '#68386c'], pilz: ['#63c74d', '#3e8948'], kobold: ['#feae34', '#be4a2f'] };
  const CLASS_CLOTH = { klinge: ['#a22633', '#e43b44', '#f6757a'], schuetze: ['#265c42', '#3e8948', '#63c74d'], weber: ['#124e89', '#0099db', '#2ce8f5'], rufer: ['#68386c', '#b55088', '#f6757a'], brau: ['#be4a2f', '#d77643', '#feae34'] };
  const MON = {
    schleimer: { spr: 'slime', C: '#63c74d', D: '#3e8948', H: '#c8f5a0' },
    schleimkoenig: { spr: 'slime', C: '#3e8948', D: '#265c42', H: '#63c74d' },
    ratte: { spr: 'rat' }, fledermaus: { spr: 'bat', C: '#68386c', D: '#3e2731' },
    pilzkrieger: { spr: 'mushroom', C: '#b55088', D: '#68386c' },
    knochen: { spr: 'skeleton' }, glutmotte: { spr: 'moth' }, spinne: { spr: 'spider' },
    rostgolem: { spr: 'golem' }, rostkoenig: { spr: 'golem', o: '#a22633', O: '#e43b44', N: '#3e2731' },
    schattenfaenger: { spr: 'ghost', C: '#68386c', D: '#262b44', H: '#b55088', '0': '#fee761' },
    spiegelgeist: { spr: 'ghost', C: '#c0cbdc', D: '#8b9bb4', H: '#ffffff', '0': '#0099db' },
    tunnelwurm: { spr: 'worm' }, kobolddieb: { spr: 'kobold' },
  };

  // ---------- Zwischenspeicher ----------
  const cache = {};
  function sprite(name, frame, pal, key) {
    const k = name + '|' + (frame | 0) + '|' + (key || '');
    if (cache[k]) return cache[k];
    const frames = R[name]; if (!frames) return null;
    const n = frames.length, fi = (((frame | 0) % n) + n) % n;
    const cv = build(frames[fi], pal);
    const s = { img: cv, w: cv.width, h: cv.height, flip: null, white: null };
    cache[k] = s; return s;
  }
  function framesOf(name) { return R[name] ? R[name].length : 0; }
  function flipped(s) { if (!s.flip) s.flip = flipX(s.img); return s.flip; }
  function white(s, flip) { const k = flip ? 'whiteF' : 'white'; if (!s[k]) s[k] = silhouette(flip ? flipped(s) : s.img, '#ffffff'); return s[k]; }
  function heroPal(race, cls) {
    const sk = RACE_SKIN[race] || RACE_SKIN.mensch, cl = CLASS_CLOTH[cls] || CLASS_CLOTH.klinge;
    return { S: sk[0], T: sk[1], D: cl[0], C: cl[1], H: cl[2] };
  }
  function heroSprite(race, cls, frame) {
    const look = cls === 'schuetze' ? 'hero_schuetze' : (cls === 'weber' || cls === 'rufer') ? 'hero_weber' : 'hero_klinge';
    return sprite(look, frame, heroPal(race, cls), race + cls);
  }
  function monSprite(id, frame) {
    const m = MON[id] || MON.schleimer;
    return sprite(m.spr, frame, m, id);
  }
  function monFrames(id) { const m = MON[id] || MON.schleimer; return framesOf(m.spr); }

  // Symbole als Bild-Adresse (für die Menüs)
  const urlCache = {};
  function url(name, pal, key) {
    const k = name + '|' + (key || '');
    if (urlCache[k]) return urlCache[k];
    const s = sprite(name, 0, pal, key); if (!s) return '';
    return (urlCache[k] = s.img.toDataURL());
  }
  // <img>-Schnipsel in Pixel-Optik; size = Zielhöhe in CSS-Pixeln
  // size = gewünschte Grösse (längere Seite) in CSS-Pixeln; es wird auf ganze Vielfache gerundet, damit die Pixel scharf bleiben
  function img(name, size, pal, key, cls) {
    const s = sprite(name, 0, pal, key); if (!s) return '';
    const k = Math.max(1, Math.round((size || 16) / Math.max(s.w, s.h)));
    return `<img class="px ${cls || ''}" src="${url(name, pal, key)}" width="${s.w * k}" height="${s.h * k}" alt="">`;
  }
  const ICON_ALIAS = { kessel: 'teekessel' };
  function itemIcon(base) { let b = String(base || '').replace(/^u_/, ''); b = ICON_ALIAS[b] || b; return 'i_' + (R['i_' + b] ? b : 'schwert'); }
  function heroUrl(race, cls, scale) {
    const s = heroSprite(race, cls, 0); const k = 'hero|' + race + cls + '|' + (scale || 1);
    if (!urlCache[k]) urlCache[k] = (scale ? scaled(s.img, scale) : s.img).toDataURL();
    return urlCache[k];
  }

  // Brustbild des Helden (obere Hälfte) für die Anzeige oben links
  function heroPortrait(race, cls) {
    const k = 'portrait|' + race + cls; if (urlCache[k]) return urlCache[k];
    const s = heroSprite(race, cls, 0); const c = mk(s.w, 13), x = c.getContext('2d'); x.drawImage(s.img, 0, 0);
    return (urlCache[k] = c.toDataURL());
  }

  return { heroPortrait, PAL, OUTLINE, build, silhouette, flipX, scaled, mk, sprite, framesOf, flipped, white, heroSprite, heroPal, monSprite, monFrames, url, img, itemIcon, heroUrl, R, MON, RACE_SKIN, CLASS_CLOTH };
})();
