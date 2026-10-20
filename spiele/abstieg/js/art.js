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
  // Rufer: Kapuzenrobe mit Schädel-Anhänger; Braumeister: Hut mit breiter Krempe, Bart, Schürze, Gürtel mit Fläschchen
  const callerTop = [
    '.......D........',
    '......DCD.......',
    '.....DCCCD......',
    '....DCCCCCD.....',
    '...DCCCCHCCD....',
    '...DCC1SSSSD....',
    '...DC11SS0SD....',
    '...DCC1SSSTD....',
    '...DCCC1TTD.....',
    '..SDCCC5CCCDS...',
    '..DDCCCHCCCDD...',
    '...DCnnnnnCD....',
    '...DCCCCCCCD....',
  ];
  const brewerTop = [
    '................',
    '.....DDDDD......',
    '....DCCHCCD.....',
    '..DDDDDDDDDDD...',
    '....SSSSSSS.....',
    '....SSSSS0S.....',
    '....SSSSSST.....',
    '....NNNNNNN.....',
    '...DCNNNNNCD....',
    '..SDCsssssCDS...',
    '..SDCsssssCDS...',
    '...DnlnBnynD....',
    '....DsssssD.....',
  ];
  R.hero_rufer = ['idle', 'a', 'p', 'b'].map(k => callerTop.concat(weaverLegs[k]));
  R.hero_brau = ['idle', 'a', 'p', 'b'].map(k => brewerTop.concat(LEG[k]));

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
  // Schädelstab des Rufers, Flasche des Braumeisters (C/H = Farbe der Füllung), Sprengfass mit Lunte (2 Bilder), Knochenhand der Grabeshände
  R.w_skullstaff = [[
    '.555..',
    '55555.',
    '5V5V5.',
    '55555.',
    '.5.5..',
    '..N...',
    '..m...',
    '..N...',
    '..m...',
    '..N...',
    '..m...',
    '..N...',
    '..m...',
  ]];
  R.flask = [[
    '.N..',
    '.5..',
    '5CC5',
    '5CH5',
    '5CC5',
    '.55.',
  ]];
  R.fass = [[
    '.....Y....',
    '....n.....',
    '..NNNNNN..',
    '.NmMmmMmN.',
    '.22222222.',
    '.NmMRRMmN.',
    '.NmRMMRmN.',
    '.22222222.',
    '.NmMmmMmN.',
    '..NNNNNN..',
  ], [
    '....6.Y...',
    '....n.....',
    '..NNNNNN..',
    '.NmMmmMmN.',
    '.22222222.',
    '.NmMRRMmN.',
    '.NmRMMRmN.',
    '.22222222.',
    '.NmMmmMmN.',
    '..NNNNNN..',
  ]];
  R.grabhand = [[
    '.5.5.5..',
    '.5.5.5.5',
    '.5.5.5.5',
    '55555555',
    '.555555.',
    '..4554..',
    '..4444..',
    '..4444..',
  ]];

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
  I.kelle = [
    '..............N.',
    '.............Nm.',
    '............Nm..',
    '...........Nm...',
    '..........Nm....',
    '.........Nm.....',
    '........Nm......',
    '.......Nm.......',
    '..5555Nm........',
    '.544445.........',
    '54llll45........',
    '54lllY45........',
    '.544445.........',
    '..5555..........',
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


  // ---------- Symbole für Schrein-Zauber und Talente ----------
  R.s_fire = [[
    '....y....',
    '...yf....',
    '...fYf...',
    '..fYYf.f.',
    '.fYY6Yff.',
    '.fY666Yf.',
    '.fY666Yf.',
    '..fYYYf..',
    '...fff...',
  ]];
  R.s_ice = [[
    '....6....',
    '.c..c..c.',
    '..c.c.c..',
    '...ccc...',
    '6ccc6ccc6',
    '...ccc...',
    '..c.c.c..',
    '.c..c..c.',
    '....6....',
  ]];
  R.s_dash = [[
    '.........',
    '.....cc..',
    'c...cBBc.',
    '.c.cB66Bc',
    'cccB6666B',
    '.c.cB66Bc',
    'c...cBBc.',
    '.....cc..',
    '.........',
  ]];
  R.s_cloud = [[
    '.........',
    '...lll...',
    '..lGGGl..',
    '.lGGlGGll',
    'lGGGGGGGl',
    'lGlGGGlGl',
    '.lllllll.',
    '..l..l...',
    '.l..l..l.',
  ]];
  R.s_meteor = [[
    'Y........',
    '.f.......',
    '..f......',
    '...fyy...',
    '...yRRo..',
    '...yRoro.',
    '....oroo.',
    '.....oo..',
    '.........',
  ]];
  R.s_spring = [[
    '....l....',
    '...lGl...',
    '..l.G.l..',
    '....G....',
    '..BBBBB..',
    '.BcccccB.',
    'BccBBBccB',
    '.BBBBBBB.',
    '.........',
  ]];
  R.s_ghost = [[
    '...666...',
    '..66666..',
    '.6606066.',
    '.6606066.',
    '.6666666.',
    '.6655566.',
    '.6666666.',
    '.66.6.66.',
    '.6...6.6.',
  ]];
  R.s_wolf = [[
    '.c.......',
    '.cc......',
    'cc6c.....',
    'c0cccccc.',
    'cccccccBc',
    '..cccccB.',
    '..cB.cB..',
    '..c..c...',
    '.........',
  ]];
  R.s_quake = [[
    '.........',
    '....O....',
    '...OMO...',
    '.O.OMO.O.',
    'OMO...OMO',
    '.........',
    'NNN0NNNNN',
    'N0NN0N0NN',
    'NNNNNNNNN',
  ]];
  R.s_fan = [[
    '5...5...5',
    '.5..5..5.',
    '..5.5.5..',
    '...565...',
    '....6....',
    '....4....',
    '...343...',
    '....3....',
    '....3....',
  ]];
  // ---------- Symbole für Rufer und Braumeister ----------
  R.s_skel = [[
    '..55555..',
    '.5555555.',
    '.5005005.',
    '.5005005.',
    '.5555555.',
    '..55055..',
    '..5.5.5..',
    '..55555..',
    '.........',
  ]];
  R.s_army = [[
    '.55...55.',
    '5005.5005',
    '5555.5555',
    '.5.5.5.5.',
    '..55555..',
    '.5555555.',
    '.5005005.',
    '.5555555.',
    '..5.5.5..',
  ]];
  R.s_soul = [[
    '.....VVV.',
    '......wV.',
    '.....w.V.',
    '....w....',
    '...w.....',
    '.6w......',
    '.66......',
    '6.6......',
    '.........',
  ]];
  R.s_hand = [[
    '.5.5.5...',
    '.5.5.5.5.',
    '.5555555.',
    '.555555..',
    '..5555...',
    '...55....',
    '...55....',
    'NNNNNNNNN',
    'nNnNnNnNn',
  ]];
  R.s_offer = [[
    'V...w...V',
    '.V..w..V.',
    '...555...',
    'ww50505ww',
    '...555...',
    '...5.5...',
    '.V..w..V.',
    'V...w...V',
    '.........',
  ]];
  R.s_band = [[
    '.VV...VV.',
    'VwwV.VwwV',
    'VwwwVwwwV',
    'VwwwwwwwV',
    '.VwwwwwV.',
    '..VwwwV..',
    '...VwV...',
    '....V....',
    '.........',
  ]];
  const flaskIcon = [
    '...NN....',
    '...55....',
    '..5CC5...',
    '.5CCCC5..',
    '5CCHCCC5.',
    '5CCCCCC5.',
    '5CCCCCC5.',
    '.5CCCC5..',
    '..5555...',
  ];
  const tint = (rows, c, h) => rows.map(r => r.replace(/C/g, c).replace(/H/g, h));
  R.s_fflask = [tint(flaskIcon, 'f', 'Y')];
  R.s_pflask = [tint(flaskIcon, 'l', 'Y')];
  R.s_iflask = [tint(flaskIcon, 'c', '6')];
  R.s_brew = [tint(flaskIcon, 'R', 'w')];
  R.s_wonder = [[
    '...NN....',
    '...55....',
    '..5VV5...',
    '.5BBBB5..',
    '5lllll65.',
    '5yyyyyy5.',
    '5ffffff5.',
    '.5RRRR5..',
    '..5555...',
  ]];
  R.s_barrel = [[
    '....Y....',
    '...n.....',
    '.NNNNNN..',
    'NmMmmMmN.',
    '22222222.',
    'NmMRRMmN.',
    '22222222.',
    'NmMmmMmN.',
    '.NNNNNN..',
  ]];
  R.t_fang = [[
    '.........',
    'rRRRRRRRr',
    'RR6RRR6RR',
    '.R66R66R.',
    '..6..6...',
    '..6..6...',
    '..R..R...',
    '.........',
    '.........',
  ]];
  R.t_thorn = [[
    '....4....',
    '.4.454.4.',
    '..45554..',
    '445565544',
    '..45554..',
    '.4.454.4.',
    '....4....',
    '.........',
    '.........',
  ]];
  R.t_glass = [[
    '..55555..',
    '..5ccc5..',
    '...5c5...',
    '....5....',
    '...5c5...',
    '..5cRc5..',
    '..5RRR5..',
    '..55555..',
    '.........',
  ]];
  R.t_rage = [[
    'R.......R',
    '.R.....R.',
    '..xx.xx..',
    '.xRRxRRx.',
    '.xRRRRRx.',
    '..xRRRx..',
    '...xRx...',
    '....x....',
    '.........',
  ]];
  R.t_boom = [[
    'y...Y...y',
    '.y.YfY.y.',
    '..YfffY..',
    '.Yff6ffY.',
    'Yff666ffY',
    '.Yff6ffY.',
    '..YfffY..',
    '.y.YfY.y.',
    'y...Y...y',
  ]];
  R.t_double = [[
    '.5....5..',
    '.55...55.',
    '.565..565',
    '..565..56',
    '...565..5',
    '...N5N...',
    '..N..N...',
    '.N..N....',
    'N..N.....',
  ]];
  R.t_blood = [[
    '....R....',
    '...RR....',
    '..RRwR...',
    '.RRRRwR..',
    '.RRRRRR..',
    '.rRRRRr..',
    '..rrrr...',
    '......R..',
    '.....RRR.',
  ]];
  R.t_boots = [[
    '...NN....',
    '...Nm.c..',
    '...Nm..c.',
    '...Nm.c..',
    '...NmN...',
    '..NmmmN.c',
    '.NmmmmmN.',
    '.0000000.',
    '.........',
  ]];
  R.t_angel = [[
    '...YYY...',
    '.........',
    '66.666.66',
    '6665e5666',
    '.665e566.',
    '..65e56..',
    '...555...',
    '...5.5...',
    '.........',
  ]];
  R.t_mind = [[
    '..VVVVV..',
    '.VcVVVcV.',
    'VVVcVcVVV',
    'VcVVcVVcV',
    'VVcV6VcVV',
    '.VVcVcVV.',
    '..VVVVV..',
    '...V.V...',
    '.........',
  ]];
  R.t_echo = [[
    '.........',
    '..c...c..',
    '.c.c.c.c.',
    'c.cB6Bc.c',
    'c.cB6Bc.c',
    '.c.c.c.c.',
    '..c...c..',
    '.........',
    '.........',
  ]];
  R.t_powder = [[
    '......Y..',
    '.....f.f.',
    '....N....',
    '..0000...',
    '.012200..',
    '.022200..',
    '.000000..',
    '..0000...',
    '.........',
  ]];
  // Geisterwolf (Begleiter des Helden)
  R.wolf = [[
    '..........C.C.',
    '.........CCCC.',
    '.........C0CHH',
    'CC.CCCCCCCCCCD',
    '.CCCCCCCCCCCC.',
    '..CCCCCCCCC...',
    '..CD.CD.CD.CD.',
    '..C..C..C..C..',
  ], [
    '..........C.C.',
    '.........CCCC.',
    '.........C0CHH',
    '.CCCCCCCCCCCCD',
    'C.CCCCCCCCCCC.',
    '..CCCCCCCCC...',
    '...CDCD..CDCD.',
    '...C.C....C.C.',
  ]];

  // ---------- Neue Gegner der Welten ----------
  R.frog = [[
    '...66....66...',
    '..6006..6006..',
    '..CCCCCCCCCC..',
    '.CCHHCCCCCCCC.',
    'CCCHCCCCCCCCCC',
    'CCCCCC0000CCCC',
    '.DCCCCCCCCCCD.',
    'DDD.DDCCDD.DDD',
    'D.D........D.D',
  ], [
    '...66....66...',
    '..6006..6006..',
    '..CCCCCCCCCC..',
    '.CCHHCCCCCCCC.',
    'CCCHCCCCCCCCCC',
    'CCCCCCCCCCCCCC',
    '.DCCCCCCCCCCD.',
    '..DDDCCCCDDD..',
    '.DD........DD.',
  ]];
  R.vine = [[
    '...C...CC.....',
    '..CHC.CHHC....',
    '..CRRRRRRRC...',
    '.CRR6R6R6RRC..',
    '.CR0000000RC..',
    '.CRR6R6R6RRC..',
    '..CRRRRRRRC...',
    '...CCCCCCC....',
    '.....DD..D....',
    '.D...DD.D.....',
    '..D..DDD......',
    '...DDDD.......',
    '.....DD.......',
    '...gDDDDg.....',
    '..gggggggg....',
  ], [
    '..C....CC.....',
    '.CHC..CHHC....',
    '..CRRRRRRRC...',
    '.CRR6R6R6RRC..',
    '.CRRRRRRRRRC..',
    '.CRR6R6R6RRC..',
    '..CRRRRRRRC...',
    '...CCCCCCC....',
    '....DD...D....',
    '..D.DD..D.....',
    '...DDDD.......',
    '....DDD.......',
    '.....DD.......',
    '...gDDDDg.....',
    '..gggggggg....',
  ]];
  R.scorpion = [[
    '.........yYy....',
    '........y...C...',
    '............C...',
    '...........CC...',
    '.CC.......CC....',
    'C..C.CCCCCCC....',
    'CC..CCHHCCCC....',
    '...CC0CC0CCC....',
    '....CCCCCCC.....',
    '...D.D.D.D.D....',
    '..D.D.D.D.D.....',
  ], [
    '..........yYy...',
    '.........y..C...',
    '............C...',
    '...........CC...',
    '.CC.......CC....',
    'C..C.CCCCCCC....',
    'CC..CCHHCCCC....',
    '...CC0CC0CCC....',
    '....CCCCCCC.....',
    '....D.D.D.D.D...',
    '...D.D.D.D.D....',
  ]];
  R.mummy = [[
    '...ssss.....',
    '..sMsssM....',
    '..sYsYss....',
    '..ssMsss....',
    '...sss......',
    '.MsssMssss..',
    'sMssMssMsss.',
    's.ssMsss..s.',
    's.sMssss..M.',
    '..ssssMs....',
    '..sMssss....',
    '..ss..ss....',
    '..sM..Ms....',
    '..ss..ss....',
  ], [
    '...ssss.....',
    '..sMsssM....',
    '..sYsYss....',
    '..ssMsss....',
    '...sss......',
    '.MsssMssss..',
    'sMssMssMsss.',
    's.ssMsss..s.',
    'M.sMssss..s.',
    '..ssssMs....',
    '..sMssss....',
    '..ss..ss....',
    '.sM....Ms...',
    '.ss....ss...',
  ]];
  R.crab = [[
    '.CC..........CC.',
    'CHHC........CHHC',
    '.CC..6....6..CC.',
    '..C..0....0..C..',
    '..CCCCCCCCCCCC..',
    '.CCHHCCCCCCCCCC.',
    '.DCCCCCCCCCCCCD.',
    '..DDDDDDDDDDDD..',
    '.D.D.D....D.D.D.',
  ], [
    'CC............CC',
    'CHHC........CHHC',
    '.CC..6....6..CC.',
    '..C..0....0..C..',
    '..CCCCCCCCCCCC..',
    '.CCHHCCCCCCCCCC.',
    '.DCCCCCCCCCCCCD.',
    '..DDDDDDDDDDDD..',
    'D.D.D......D.D.D',
  ]];
  R.jelly = [[
    '...CCCCCC...',
    '..CHHCCCCC..',
    '.CH6CCCCCCC.',
    '.CCCCCCCCCC.',
    '.CC0CCCC0CC.',
    '.CCCCCCCCCC.',
    '.DCDCDCDCDC.',
    '..C.D.C.D...',
    '..D.C.D.C...',
    '.C..D.C..D..',
    '..C..C.D....',
  ], [
    '...CCCCCC...',
    '..CHHCCCCC..',
    '.CH6CCCCCCC.',
    '.CCCCCCCCCC.',
    '.CC0CCCC0CC.',
    '.CCCCCCCCCC.',
    '.DCDCDCDCDC.',
    '...C.D.C.D..',
    '...D.C.D.C..',
    '..D.C..D.C..',
    '...D.C..C...',
  ]];
  R.imp = [[
    '.f........f.',
    '.ff......ff.',
    '..fCCCCCCf..',
    '..CCYCCYCC..',
    '..CCCCCCCC..',
    '...CC00CC...',
    '....CCCC....',
    '..CCCCCCCC..',
    '.CC.CCCC.CC.',
    '.Y..CCCC..Y.',
    '....C..C....',
    '...DD..DD...',
  ], [
    '.f........f.',
    '.ff......ff.',
    '..fCCCCCCf..',
    '..CCYCCYCC..',
    '..CCCCCCCC..',
    '...CC00CC...',
    '....CCCC....',
    '.CCCCCCCCCC.',
    'Y...CCCC...Y',
    '....CCCC....',
    '...C....C...',
    '..DD....DD..',
  ]];
  R.eye = [[
    '....DDDDDD....',
    '..DDCCCCCCDD..',
    '.DCC666666CCD.',
    'DC6666RR6666CD',
    'DC666R00R666CD',
    'DC666R00R666CD',
    'DC6666RR6666CD',
    '.DCC666666CCD.',
    '..DDCCCCCCDD..',
    '....DDDDDD....',
    '...D..D..D....',
    '..D...D...D...',
  ], [
    '....DDDDDD....',
    '..DDCCCCCCDD..',
    '.DCC666666CCD.',
    'DC666RR66666CD',
    'DC66R00R6666CD',
    'DC66R00R6666CD',
    'DC666RR66666CD',
    '.DCC666666CCD.',
    '..DDCCCCCCDD..',
    '....DDDDDD....',
    '....D..D..D...',
    '...D...D...D..',
  ]];
  R.octopus = [[
    '.....CCCCCC.....',
    '...CCHHCCCCCC...',
    '..CCHCCCCCCCCC..',
    '..CCCCCCCCCCCC..',
    '..CC66CCCC66CC..',
    '..CC60CCCC60CC..',
    '..CCCCCCCCCCCC..',
    '...CCCC00CCCC...',
    '..CCDCCCCCCDCC..',
    '.CC.DC.CC.CD.CC.',
    '.C..D..CC..D..C.',
    'C...DC.DD.CD...C',
    'C....C.D..C....C',
    '.....C....C.....',
  ], [
    '.....CCCCCC.....',
    '...CCHHCCCCCC...',
    '..CCHCCCCCCCCC..',
    '..CCCCCCCCCCCC..',
    '..CC66CCCC66CC..',
    '..CC60CCCC60CC..',
    '..CCCCCCCCCCCC..',
    '...CCCC00CCCC...',
    '..CCDCCCCCCDCC..',
    '.CC.DC.CC.CD.CC.',
    'C...D..CC..D...C',
    'C..DC..DD..CD..C',
    '.C.C...D....C.C.',
    '..C.........C...',
  ]];

  // ---------- Hindernisse der Welten ----------
  R.pillar = [[
    '344444443',
    '455555554',
    '.3444443.',
    '.3454543.',
    '.3454543.',
    '.3454543.',
    '.3454543.',
    '.3454543.',
    '.3454543.',
    '.3454543.',
    '.3454543.',
    '.2343432.',
    '344444443',
    '233333332',
  ]];
  R.tree = [[
    '......GGlG......',
    '....GGlllGGG....',
    '...GllGGGllGG...',
    '..GGlGGgGGGlGG..',
    '.GGGGgGGGGgGGGG.',
    '.GlGGGGlGGGGGlG.',
    '.GGgGGGGGgGGGGG.',
    '..GGGgGGGGGGgG..',
    '...ggGGgGGgGg...',
    '.....ggNNgg.....',
    '.......NN.......',
    '.......mN.......',
    '.......NN.......',
    '......NmNN......',
    '.....NN..NN.....',
  ]];
  R.bush = [[
    '...GlG.G....',
    '.GGlGGGlGG..',
    'GGlGGgGRGGG.',
    'GGGgGGGlGgG.',
    '.gGRgGGGGg..',
    '..gg.gg.g...',
  ]];
  R.cactus = [[
    '....Gl....',
    '...GlGG...',
    '...GlGG.G.',
    '.G.GlGG.GG',
    '.GGGlGGGGG',
    '..GGlGG...',
    '...GlGG...',
    '...GlGG...',
    '...GlGG...',
    '..mMMMMm..',
  ]];
  R.obelisk = [[
    '...y...',
    '..yYy..',
    '..mMM..',
    '..mM0..',
    '..mMM..',
    '..m0M..',
    '..mMM..',
    '.mmMMM.',
    '.mm0MM.',
    '.mmMMM.',
    '.m0MMM.',
    '.mmMMM.',
    'NNNNNNN',
    'NmmmmmN',
  ]];
  R.urn = [[
    '..NNNN..',
    '...mm...',
    '..mMMm..',
    '.mMyyMm.',
    '.mMMMMm.',
    '.mMyyMm.',
    '..mMMm..',
    '...NN...',
  ]];
  R.coral = [[
    '.R....R...',
    '.RR..Rw.R.',
    '..R.RR..R.',
    '..RRR..RR.',
    '...RR.RR..',
    '...RRRR...',
    '....RR....',
    '...rrrr...',
  ]];
  R.column = [[
    '..34.43..',
    '.3454543.',
    '.3454543.',
    '.3454543.',
    '.3454543.',
    '.3454543.',
    '.3G545G3.',
    '.2GG3GG2.',
    '344444443',
    '233333332',
  ]];
  R.obsidian = [[
    '...v......',
    '...1v...1.',
    '..11v..1v.',
    '..112v.12.',
    '.1112v112v',
    '.11122112v',
    '1111221122',
    '0111111110',
  ]];
  R.anvil = [[
    '2222222222',
    '.34444443.',
    '....33....',
    '...3443...',
    '..233332..',
  ]];
  // Schmied an der Schmiede (Hammer oben / Hammer schlägt auf den Amboss)
  R.smith = [[
    '..........33....',
    '.........3443...',
    '.........3443...',
    '..........NN....',
    '....sse...Ne....',
    '...seeee..ee....',
    '...eeee0e.e.....',
    '...eeeeeEee.....',
    '...OeOOOOe......',
    '...oOOOOO2......',
    '..2oOOOOo2......',
    '.e22oOOo22......',
    '.ee2NNoNN2......',
    '.ee.NmNNN.......',
    '....NNNNN.......',
    '....11.11.......',
    '....11.11.......',
    '...nnn.nnn......',
  ], [
    '................',
    '................',
    '................',
    '................',
    '....sse.........',
    '...seeee........',
    '...eeee0e.......',
    '...eeeeeEe......',
    '...OeOOOOe......',
    '...oOOOOO2......',
    '..2oOOOOo2ee....',
    '.e22oOOo22eeeN..',
    '.ee2NNoNN2...N..',
    '.ee.NmNNN...3443',
    '....NNNNN...3443',
    '....11.11....33.',
    '....11.11.......',
    '...nnn.nnn......',
  ]];
  // Esse der Schmiede: Glut oben, Feuer in der Öffnung (flackert)
  R.esse = [[
    '.44444444444.',
    '4555555555554',
    '3yfYyfYyfYyf3',
    '3333333333333',
    '3223223223223',
    '322.......223',
    '32.fyyyyyf.23',
    '32.yYY6YYy.23',
    '322fyYYYyf223',
    '3223223223223',
    '2222222222222',
  ], [
    '.44444444444.',
    '4555555555554',
    '3fYyfYyfYyfY3',
    '3333333333333',
    '3223223223223',
    '322.......223',
    '32.yfyyyfy.23',
    '32.fYYYY6f.23',
    '322yfYYYfy223',
    '3223223223223',
    '2222222222222',
  ]];
  // Elemente auf Ausrüstung (gear.js)
  R.el_feuer = [['...Y...', '..fY...', '..fYf.f', '.fYYYff', '.fY6Yf.', '.fYYYf.', '..fff..']];
  R.el_eis = [['...6...', '.c.c.c.', '..ccc..', '6cc6cc6', '..ccc..', '.c.c.c.', '...6...']];
  R.el_blitz = [['....YY.', '...YY..', '..YY...', '.YYYYY.', '...YY..', '..YY...', '.YY....']];
  R.el_gift = [['...l...', '...l...', '..lGl..', '.lGGGl.', '.lG6Gl.', '.lGGGl.', '..lll..']];
  R.el_schatten = [['..VVV..', '.VVv...', 'VVv....', 'VVv....', 'VVv..w.', '.VVv...', '..VVV..']];
  R.el_stein = [['..444..', '.45554.', '4556544', '4555443', '4544433', '.43333.', '..333..']];
  // Eigenschaften der Elite-Gegner (elites.js); Gift, Feuer, Frost und Gewitter nehmen die Element-Bilder oben
  R.ef_flink = [['y..Y...', '.y..Y..', '..y..Y.', '...y..Y', '..y..Y.', '.y..Y..', 'y..Y...']];
  R.ef_panzer = [['5555555', '5444445', '5446445', '5466645', '.54645.', '..545..', '...5...']];
  R.ef_bombe = [['.....Y.', '....Ny.', '..333..', '.35333.', '.33333.', '.33332.', '..322..']];
  R.ef_ruf = [['.sssss.', 'sssssss', 'sVVsVVs', 'sss0sss', '.sssss.', '.s.s.s.']];
  R.ef_blink = [['..vvv..', '.v666v.', 'v6V0V6v', '.v666v.', '..vvv..']];
  R.ef_schild = [['..ccc..', '.c...c.', 'c.6...c', 'c.....c', 'c.....c', '.c...c.', '..ccc..']];
  R.ef_vampir = [['...R...', '...R...', '..RRR..', '.RRwRR.', '.RRRRR.', '.rRRRr.', '..rrr..']];
  R.ef_riese = [['...M...', '..MMM..', '.MMMMM.', 'MMMMMMM', '..mMm..', '..mMm..', '..mMm..']];
  R.ef_wut = [['.RRRRR.', 'R0RRR0R', 'RR0R0RR', 'RRRRRRR', 'RR000RR', 'R0RRR0R', '.RRRRR.']];
  R.ef_spiegel = [['..555..', '.56645.', '.56545.', '.54445.', '..555..', '...N...', '...N...']];
  R.ef_klingen = [['...5...', '...5...', '..545..', '5554555', '..545..', '...5...', '...5...']];
  R.ef_heil = [['..lll..', '..l6l..', 'lll6lll', 'l66666l', 'lll6lll', '..l6l..', '..lll..']];
  // kreisende Klinge (Klingenwirbel), zwei Bilder: dreht sich
  R.ef_blade = [['..5..', '..5..', '55655', '..5..', '..5..'], ['5...5', '.5.5.', '..6..', '.5.5.', '5...5']];
  R.crystal = [[
    '...w....',
    '..wVw...',
    '..wVw.w.',
    '.wVVwVw.',
    '.wVVwVVw',
    '.vVVwVVv',
    '..vVvVv.',
    '..vvvvv.',
  ]];
  R.shrine = [[
    '....cBc....',
    '...cB6Bc...',
    '...cBBBc...',
    '....cBc....',
    '...........',
    '..4555554..',
    '.345555543.',
    '..3444443..',
    '...34543...',
    '...34543...',
    '...34543...',
    '..3444443..',
    '.233333332.',
  ], [
    '...........',
    '....cBc....',
    '...cB6Bc...',
    '...cBBBc...',
    '....cBc....',
    '..4555554..',
    '.345555543.',
    '..3444443..',
    '...34543...',
    '...34543...',
    '...34543...',
    '..3444443..',
    '.233333332.',
  ]];

  // ---------- Lager (Bühnenbild im Lager, scenes.js) ----------
  // Lagerfeuer (Symbol)
  R.c_fire = [[
    '.....Y.....',
    '.....YY....',
    '....fYY....',
    '....fYYf...',
    '...ffYYff..',
    '...fYYYYf..',
    '..ofYY6Yfo.',
    '..ofY66Yfo.',
    '.N.ofYYfo.N',
    '.mN.offo.Nm',
    '..mNNnnNNm.',
    '.NmmNNNNmmN',
  ]];
  // Strohpuppe auf dem Übungsplatz
  R.c_dummy = [[
    '...MMM...',
    '..MsMMm..',
    '..M0M0m..',
    '..MMMMm..',
    'Y..mmm..Y',
    'YmNNNNNmY',
    '..mRRRm..',
    '..mR6Rm..',
    '..mRRRm..',
    '...mmm...',
    '....N....',
    '....N....',
    '...nNn...',
    '..nnnnn..',
  ]];
  // Zielscheibe
  R.c_target = [[
    '...RRRR...',
    '..R6666R..',
    '.R6RRRR6R.',
    '.R6R66R6R.',
    '.R6R66R6R.',
    '.R6RRRR6R.',
    '..R6666R..',
    '...RRRR...',
    '..N....N..',
    '.N......N.',
    'N........N',
  ]];
  // Kräuterkessel
  R.c_cauldron = [[
    '.3444444443.',
    '32lGlYlGll23',
    '.2222222222.',
    '.2322222221.',
    '232222222221',
    '232222222221',
    '.2322222221.',
    '..22222221..',
    '..1......1..',
  ]];
  // Pult mit offenem Buch
  R.c_lectern = [[
    '.sss...sss.',
    'sssssNsssss',
    's333sNs333s',
    'sssssNsssss',
    's33ssNs333s',
    '.ssssNssss.',
    '..NNNNNNN..',
    '.....N.....',
    '....NmN....',
    '....NmN....',
    '....NmN....',
    '...NNmNN...',
    '..NNNNNNN..',
  ]];
  // Bücherregal
  R.c_shelf = [[
    'NNNNNNNNNNNN',
    'NRrBbYGl5VvN',
    'NRrBbYGl5VvN',
    'NRrBbyGl4VvN',
    'NmmmmmmmmmmN',
    'N.lGVv4RrbBN',
    'NylGVv4RrbBN',
    'NylGVv4RrbBN',
    'NmmmmmmmmmmN',
    'NN........NN',
  ]];
  // Händlerzelt mit Streifendach
  R.c_stall = [[
    '..................',
    '.R6R6R6R6R6R6R6R6.',
    'R6R6R6R6R6R6R6R6R6',
    'r6r6r6r6r6r6r6r6r6',
    '.w.w.w.w.w.w.w.w..',
    '.N..............N.',
    '.N..............N.',
    '.N..............N.',
    '.N..............N.',
    'NmmmmmmmmmmmmmmmmN',
    'NMMMMMMMMMMMMMMMMN',
    'NmmmmmmmmmmmmmmmmN',
    'NmNNNNNNNNNNNNNNmN',
    'Nm..............mN',
  ]];
  // Glücksbrunnen
  R.c_well = [[
    '.......NN.......',
    '.....NNmmNN.....',
    '...NNmmMMmmNN...',
    '.NNmmMMMMMMmmNN.',
    'NNNNNNNNNNNNNNNN',
    '..N....N.....N..',
    '..N....N.....N..',
    '..N...nmn....N..',
    '..N...mMm....N..',
    '.44444444444444.',
    '4555455545554554',
    '3443344433443343',
    '2332233322332232',
    '3443344433443343',
    '.22222222222222.',
  ]];
  // Laterne am Pfahl
  R.c_lantern = [[
    '.N.',
    'NyN',
    'YYY',
    'NyN',
    '.N.',
    '.N.',
    '.N.',
    '.N.',
    '.N.',
    '.N.',
    '.N.',
    'NNN',
  ]];
  // Pfahl der Palisade
  R.c_stake = [[
    '.m.',
    'mMN',
    'mMN',
    'mMN',
    'mMN',
    'mMN',
    'NNN',
    'mMN',
    'mMN',
    'mMN',
  ]];
  // Wachturm
  R.c_tower = [[
    '.....NN.....',
    '...NNmmNN...',
    '.NNmmMMmmNN.',
    'NNNNNNNNNNNN',
    '.N..N..N..N.',
    '.N........N.',
    'NNNNNNNNNNNN',
    'mMmMmMmMmMmN',
    '.N.N....N.N.',
    '.NN......NN.',
    '.N.N....N.N.',
    '.N..N..N..N.',
    '.N...NN...N.',
    '.N..N..N..N.',
    '.N.N....N.N.',
    '.NN......NN.',
    '.N.N....N.N.',
    '.N..N..N..N.',
    '.N...NN...N.',
    '.N..N..N..N.',
    '.N.N....N.N.',
    '.NN......NN.',
    'nnn......nnn',
  ]];
  // Bauplatz (Pfähle und Bretter)
  R.c_plot = [[
    'N.......N',
    'NMMMMMMMN',
    'N.......N',
    'N.......N',
    'N.......N',
    'N..mmm..N',
    'N.mMMMm.N',
  ]];
  // Wimpel eines Weltenbosses (C/H: Farbe, Y: Zeichen)
  R.c_pennant = [[
    'NNNNNNN',
    '.CCCCC.',
    '.CHCCC.',
    '.CCYCC.',
    '.CCCCC.',
    '.CC.CC.',
    '.C...C.',
  ]];

  // ---------- Paletten je Figur ----------
  const RACE_SKIN = { mensch: ['#e8b796', '#c28569'], fels: ['#5a6988', '#3a4466'], schatten: ['#b55088', '#68386c'], pilz: ['#63c74d', '#3e8948'], kobold: ['#feae34', '#be4a2f'] };
  const CLASS_CLOTH = { klinge: ['#a22633', '#e43b44', '#f6757a'], schuetze: ['#265c42', '#3e8948', '#63c74d'], weber: ['#124e89', '#0099db', '#2ce8f5'], rufer: ['#262b44', '#68386c', '#b55088'], brau: ['#be4a2f', '#d77643', '#feae34'] };
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
    geisterwolf: { spr: 'wolf', C: '#7fe8ff', D: '#124e89', H: '#ffffff' },
    frosch: { spr: 'frog', C: '#63c74d', D: '#265c42', H: '#c8f5a0' },
    ranke: { spr: 'vine', C: '#3e8948', D: '#265c42', H: '#63c74d' },
    dornenmutter: { spr: 'vine', C: '#265c42', D: '#193c3e', H: '#3e8948', R: '#b55088' },
    skorpion: { spr: 'scorpion', C: '#d77643', D: '#733e39', H: '#e4a672' },
    mumie: { spr: 'mummy' },
    sandpharao: { spr: 'mummy', s: '#feae34', M: '#be4a2f', Y: '#2ce8f5' },
    krabbe: { spr: 'crab', C: '#e43b44', D: '#a22633', H: '#f6757a' },
    qualle: { spr: 'jelly', C: '#2ce8f5', D: '#0099db', H: '#c0f8ff' },
    glutwicht: { spr: 'imp', C: '#f77622', D: '#be4a2f' },
    leerenauge: { spr: 'eye', C: '#b55088', D: '#68386c' },
    waechter: { spr: 'eye', C: '#e43b44', D: '#a22633', R: '#feae34' },
    kraken: { spr: 'octopus', C: '#b55088', D: '#68386c', H: '#f6757a' },
    diener_skel: { spr: 'skeleton', s: '#e6dcf2', '0': '#2a1836', '5': '#c0cbdc' },
    diener_geist: { spr: 'ghost', C: '#e0a4ff', D: '#b55088', H: '#ffffff', '0': '#68386c' },
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
    const look = { schuetze: 'hero_schuetze', weber: 'hero_weber', rufer: 'hero_rufer', brau: 'hero_brau' }[cls] || 'hero_klinge';
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
