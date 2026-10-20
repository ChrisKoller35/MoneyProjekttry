// Der Abstieg – Zeichnen: Die Welt wird in kleiner Auflösung als Pixel-Grafik gemalt und dann gross skaliert.
// Dazu Licht (Fackeln, Feuer, Held), Schatten, Flecken am Boden, Effekte, Minikarte, Zahlen und Einblendungen.
'use strict';
window.A = window.A || {};

(function () {
  const T = 16, PX = 2;             // Kachel = 16 Bildpunkte; 1 Bildpunkt = 2 Weltpunkte
  const TAU = Math.PI * 2;
  const rgb = (h) => { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
  const hash = (x, y, k) => { let h = Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(k | 0, 1442695041) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  // Welten: Farben, Boden- und Wandart, Gruben und Gefahr-Boden (Welt-Daten in data.js, A.WORLDS)
  const THEMES = {
    stone: { floor: ['#4d5878', '#48536f', '#525e80', '#45506c'], mortar: '#2a2f48', brick: ['#5e6a92', '#57638a', '#64719a'], brickHi: '#7d8ab0', brickLo: '#2a2f4c', cap: '#1d1c2e', capHi: '#41445f', ambient: '#4b4870', banner: ['#a22633', '#e43b44', '#f6757a'], moss: ['#3e8948', '#265c42'],
      floorStyle: 'slabs', wallStyle: 'brick', mote: '#c0cbdc', rise: -1, shaft: [200, 210, 255], tint: [20, 18, 44], puddle: 'water' },
    jungle: { floor: ['#3e5a3a', '#38533a', '#44613f', '#334d35'], mortar: '#1e2e22', brick: ['#55684f', '#4f624a', '#5c7155'], brickHi: '#7a9070', brickLo: '#1f2c22', cap: '#121c15', capHi: '#2c4030', ambient: '#4a6a52', banner: ['#265c42', '#3e8948', '#63c74d'], moss: ['#3e8948', '#63c74d', '#265c42'],
      floorStyle: 'grass', wallStyle: 'vines', mote: '#a2e05a', rise: -1, shaft: [190, 255, 160], tint: [8, 30, 14], puddle: 'water', pit: { base: '#124e89', mid: '#1a5f8f', hi: '#7fd8ff', rim: '#2b4a30' }, haz: { base: '#4a3a24', mid: '#3a2c1a', hi: '#6a5434' } },
    desert: { floor: ['#c9a26b', '#c19a63', '#d1ab74', '#b8915c'], mortar: '#8a6440', brick: ['#c8945a', '#bd8a52', '#d39e63'], brickHi: '#ead4aa', brickLo: '#6e4a2a', cap: '#3e2a1c', capHi: '#8a6440', ambient: '#86705c', banner: ['#be4a2f', '#feae34', '#fee761'], moss: ['#b86f50', '#e4a672'],
      floorStyle: 'sand', wallStyle: 'sandstone', mote: '#ead4aa', rise: 0, shaft: [255, 230, 170], tint: [44, 26, 8], puddle: null, haz: { base: '#a87a46', mid: '#8a6036', hi: '#d8b080' } },
    water: { floor: ['#2f5a6e', '#2b5366', '#346377', '#284d5f'], mortar: '#15303d', brick: ['#3a6680', '#355e77', '#40708a'], brickHi: '#5f93ad', brickLo: '#132a38', cap: '#0d1d27', capHi: '#24485c', ambient: '#3c5e78', banner: ['#124e89', '#0099db', '#2ce8f5'], moss: ['#3e8948', '#265c42', '#2ce8f5'],
      floorStyle: 'slabs', wallStyle: 'algae', mote: '#7fd8ff', rise: 1, shaft: [140, 220, 255], tint: [4, 22, 40], puddle: 'water', pit: { base: '#0b2e5a', mid: '#124e89', hi: '#7fd8ff', rim: '#1f4a5e' }, haz: { base: '#2c6a8a', mid: '#25607f', hi: '#9fd8ff', shallow: true } },
    volcano: { floor: ['#3a2a2e', '#352629', '#413034', '#30222a'], mortar: '#170d10', brick: ['#4a2a28', '#432624', '#542f2c'], brickHi: '#7a3e34', brickLo: '#1a0c0c', cap: '#120808', capHi: '#3a1814', ambient: '#5e3c36', banner: ['#be4a2f', '#f77622', '#feae34'], moss: ['#733e39', '#3e2731'],
      floorStyle: 'basalt', wallStyle: 'rock', mote: '#feae34', rise: 1, shaft: [255, 150, 80], tint: [44, 10, 6], puddle: 'lava', pit: { base: '#be4a2f', mid: '#f77622', hi: '#fee761', rim: '#2a1418', lava: true }, haz: { base: '#2a1418', mid: '#3a1c1c', hi: '#f77622', embers: true } },
    abyss: { floor: ['#3a2a4c', '#2e2140'], mortar: '#170f22', brick: ['#4a3366', '#432e5c', '#523a70'], brickHi: '#7a5aa0', brickLo: '#1c1230', cap: '#0e0818', capHi: '#35244c', ambient: '#43355e', banner: ['#68386c', '#b55088', '#f6757a'], moss: ['#68386c'],
      floorStyle: 'checker', wallStyle: 'brick', mote: '#f6757a', rise: 1, shaft: [255, 140, 220], tint: [36, 8, 40], puddle: null, pit: { base: '#08060e', mid: '#120c1c', hi: '#b55088', rim: '#2a1c3c', void: true }, haz: { base: '#24183a', mid: '#1c1230', hi: '#b55088' } },
  };
  for (const w of A.WORLDS) if (THEMES[w.id]) THEMES[w.id].name = w.name;
  const themeOf = (f) => A.worldOf(f).id;
  const RAR_COL = () => A.RARITY;
  const ELITE_COL = { giftig: '#63c74d', gepanzert: '#8b9bb4', schnell: '#fee761' };

  A.Draw = class {
    constructor(canvas) {
      this.cv = canvas; this.ctx = canvas.getContext('2d');
      this.t = 0; this.cam = null; this.levelW = null; this.topPad = 60; this.botPad = 0; this.quality = 'hi';
      this.buf = A.Art.mk(2, 2); this.b = this.buf.getContext('2d');
      this.lt = A.Art.mk(2, 2); this.l = this.lt.getContext('2d');
      this.gl = A.Art.mk(2, 2); this.g = this.gl.getContext('2d');
      this.mm = A.Art.mk(2, 2); this.m = this.mm.getContext('2d');
      this.lightCache = {}; this.frameTimes = []; this.litAt = {};
      this.resize(); new ResizeObserver(() => this.resize()).observe(canvas);
    }
    resize() {
      const r = this.cv.getBoundingClientRect(); const dpr = Math.min(3, window.devicePixelRatio || 1);
      this.dpr = dpr; this.W = r.width; this.H = r.height;
      const dw = Math.max(2, Math.round(r.width * dpr)), dh = Math.max(2, Math.round(r.height * dpr));
      this.cv.width = dw; this.cv.height = dh; this.dw = dw; this.dh = dh;
      this.s = Math.max(2, Math.round(Math.min(dw / 200, dh / 235)));
      this.bw = Math.ceil(dw / this.s); this.bh = Math.ceil(dh / this.s);
      for (const c of [this.buf, this.lt, this.gl]) { c.width = this.bw; c.height = this.bh; }
      for (const x of [this.b, this.l, this.g]) x.imageSmoothingEnabled = false;
      this.vig = null;
    }

    // ---------- Licht-Bilder ----------
    lightImg(color) {
      if (this.lightCache[color]) return this.lightCache[color];
      const c = A.Art.mk(64, 64), x = c.getContext('2d'); const [r, g, b] = rgb(color);
      const gr = x.createRadialGradient(32, 32, 0, 32, 32, 32);
      gr.addColorStop(0, `rgba(${r},${g},${b},1)`); gr.addColorStop(0.35, `rgba(${r},${g},${b},0.6)`); gr.addColorStop(0.7, `rgba(${r},${g},${b},0.2)`); gr.addColorStop(1, `rgba(${r},${g},${b},0)`);
      x.fillStyle = gr; x.fillRect(0, 0, 64, 64);
      return (this.lightCache[color] = c);
    }

    // ---------- Ebene vorab malen (Boden, Wände, Deko) ----------
    buildLevel(W) {
      const MW = A.World.MW, MH = A.World.MH;
      const th = THEMES[themeOf(W.floor)] || THEMES.stone; this.theme = th; this.themeKey = themeOf(W.floor);
      const cv = A.Art.mk(MW * T, MH * T), c = cv.getContext('2d');
      const img = c.createImageData(cv.width, cv.height), D = img.data, IW = cv.width;
      const seed = (W.seed >>> 0) % 100000;
      const tile = (x, y) => (x < 0 || y < 0 || x >= MW || y >= MH) ? 0 : W.tiles[y][x];
      const isF = (x, y) => tile(x, y) !== 0;
      const put = (x, y, col, d) => { const i = (y * IW + x) * 4; D[i] = clamp(col[0] + d, 0, 255); D[i + 1] = clamp(col[1] + d, 0, 255); D[i + 2] = clamp(col[2] + d, 0, 255); D[i + 3] = 255; };
      const dark = (x, y, f) => { const i = (y * IW + x) * 4; D[i] *= f; D[i + 1] *= f; D[i + 2] *= f; };
      const tintPx = (x, y, col, k) => { const i = (y * IW + x) * 4; D[i] += (col[0] - D[i]) * k; D[i + 1] += (col[1] - D[i + 1]) * k; D[i + 2] += (col[2] - D[i + 2]) * k; };
      const FL = th.floor.map(rgb), MO = rgb(th.mortar), BR = th.brick.map(rgb), BH = rgb(th.brickHi), BL = rgb(th.brickLo), CP = rgb(th.cap), CH = rgb(th.capHi);
      const style = th.floorStyle, wst = th.wallStyle;
      // Platten (Grundmuster für Stein, Wasser, Basalt und Gras-Pflaster)
      const slabs = (tx, ty, px, py, pal, sd) => {
        const v = hash(tx, ty, seed + 1);
        const rects = v < 0.3 ? [[0, 0, 16, 16]] : v < 0.55 ? [[0, 0, 8, 16], [8, 0, 8, 16]] : v < 0.8 ? [[0, 0, 16, 8], [0, 8, 16, 8]] : [[0, 0, 8, 8], [8, 0, 8, 8], [0, 8, 8, 8], [8, 8, 8, 8]];
        rects.forEach(([rx, ry, rw, rh], i) => {
          const base = pal[Math.floor(hash(tx * 4 + i, ty, seed + 7) * pal.length)]; const sh = Math.round((hash(tx, ty * 4 + i, seed + 9) - 0.5) * 10);
          for (let y = ry; y < ry + rh; y++) for (let x = rx; x < rx + rw; x++) {
            if (x === rx + rw - 1 || y === ry + rh - 1) { put(px + x, py + y, MO, 0); continue; }
            let d = sh + Math.round((hash(px + x, py + y, seed) - 0.5) * 7);
            if (x === rx || y === ry) d += 9; else if (x === rx + rw - 2 || y === ry + rh - 2) d -= 7;
            put(px + x, py + y, base, d + (sd || 0));
          }
        });
      };
      this.pits = []; this.hazTiles = []; this.lights = [];
      for (let ty = 0; ty < MH; ty++) for (let tx = 0; tx < MW; tx++) {
        const px = tx * T, py = ty * T, tv = tile(tx, ty);
        if (isF(tx, ty)) {
          if (style === 'checker') {
            const base = FL[(tx + ty) & 1];
            for (let y = 0; y < T; y++) for (let x = 0; x < T; x++) { const edge = x === T - 1 || y === T - 1; put(px + x, py + y, edge ? MO : base, edge ? 0 : (x === 0 || y === 0 ? 8 : 0) + Math.round((hash(px + x, py + y, seed) - 0.5) * 6)); }
            if (hash(tx, ty, seed + 51) < 0.06) { const gc = rgb('#b55088'); for (let k = 0; k < 5; k++) put(px + 5 + k, py + 8 + (k % 2), gc, -40); }   // Runen
          } else if (style === 'grass') {
            // Gras mit alten Platten dazwischen, Halme und kleine Blüten
            if (hash(tx >> 1, ty >> 1, seed + 61) < 0.32) slabs(tx, ty, px, py, [rgb('#5a6a58'), rgb('#55654f'), rgb('#606f5c')], -6);
            else for (let y = 0; y < T; y++) for (let x = 0; x < T; x++) { const gx = px + x, gy = py + y; const n = hash(gx >> 1, gy >> 1, seed + 62); put(gx, gy, FL[Math.floor(n * FL.length)], Math.round((hash(gx, gy, seed + 63) - 0.5) * 14) + (n > 0.85 ? 10 : 0)); }
            for (let k = 0; k < 5; k++) { const x = px + Math.floor(hash(tx, ty * 7 + k, seed + 64) * 15), y = py + 2 + Math.floor(hash(tx * 7 + k, ty, seed + 65) * 13); put(x, y, rgb('#63c74d'), 0); put(x, y - 1, rgb('#3e8948'), 0); }
            if (hash(tx, ty, seed + 66) < 0.12) { const x = px + 3 + Math.floor(hash(tx, ty, 67) * 10), y = py + 3 + Math.floor(hash(tx, ty, 68) * 10); const fc = rgb(hash(tx, ty, 69) < 0.5 ? '#fee761' : '#f6757a'); put(x, y, fc, 0); put(x + 1, y, fc, -30); put(x, y + 1, fc, -30); }
          } else if (style === 'sand') {
            // Sand mit Wellen, ab und zu eine Sandsteinplatte
            if (hash(tx >> 1, ty, seed + 71) < 0.22) slabs(tx, ty, px, py, [rgb('#b8865a'), rgb('#c08e60'), rgb('#ad7e52')], 0);
            else for (let y = 0; y < T; y++) for (let x = 0; x < T; x++) { const gx = px + x, gy = py + y; const w = (gx * 0.35 + gy * 1.1 + Math.sin(gx * 0.12 + seed) * 3) % 7; put(gx, gy, FL[Math.floor(hash(gx >> 2, gy >> 2, seed + 72) * FL.length)], (w < 1 ? -14 : w < 2 ? 8 : 0) + Math.round((hash(gx, gy, seed + 73) - 0.5) * 8)); }
          } else if (style === 'basalt') {
            slabs(tx, ty, px, py, FL, 0);
            if (hash(tx, ty, seed + 81) < 0.18) { let x = 2 + Math.floor(hash(tx, ty, 82) * 10), y = 2 + Math.floor(hash(tx, ty, 83) * 10); const gc = rgb('#f77622'), gy2 = rgb('#feae34'); for (let k = 0; k < 8; k++) { put(px + clamp(x, 0, 15), py + clamp(y, 0, 15), k % 3 ? gc : gy2, -20); x += hash(tx + k, ty, 84) < 0.5 ? 1 : 0; y += hash(tx, ty + k, 85) < 0.6 ? 1 : -1; } }
          } else {
            slabs(tx, ty, px, py, FL, 0);
            // Risse und Steinchen
            if (hash(tx, ty, seed + 3) < 0.13) { let x = 2 + Math.floor(hash(tx, ty, 4) * 10), y = 2 + Math.floor(hash(tx, ty, 5) * 10); for (let k = 0; k < 7; k++) { put(px + clamp(x, 0, 15), py + clamp(y, 0, 15), MO, 4); x += hash(tx + k, ty, 6) < 0.5 ? 1 : 0; y += hash(tx, ty + k, 7) < 0.6 ? 1 : -1; } }
            if (hash(tx, ty, seed + 11) < 0.4) { const x = Math.floor(hash(tx, ty, 12) * 14) + 1, y = Math.floor(hash(tx, ty, 13) * 14) + 1; put(px + x, py + y, MO, 10); put(px + x + 1, py + y, FL[0], 18); }
          }
          if (tv === 4) this.paintPit(tx, ty, px, py, th, put, tile, seed);
          else if (tv === 5) this.paintHaz(tx, ty, px, py, th, put, tintPx, tile, seed);
        } else if (isF(tx, ty + 1)) {
          // Wand-Vorderseite
          for (let y = 0; y < T; y++) for (let x = 0; x < T; x++) {
            const gx = px + x; let col, d = 0;
            const tall = !isF(tx, ty - 1);
            if (!tall && y === 0) { col = CH; d = 6; }
            else if (!tall && y === 1) { col = BH; d = -4; }
            else if (y === T - 1) { col = BL; }
            else [col, d] = this.wallPix(gx, py + y, y, ty, false, BR, BL, seed, wst);
            put(gx, py + y, col, d);
          }
          this.wallDeco(tx, ty, px, py, th, put, seed, true);
        } else if (isF(tx, ty + 2) && !isF(tx, ty + 1)) {
          // Oberes Wandstück: die Wand ist zwei Kacheln hoch, oben der Deckel-Rand, darunter dunklere Steine
          for (let y = 0; y < T; y++) for (let x = 0; x < T; x++) {
            const gx = px + x; let col, d = 0;
            if (y === 0) { col = CH; d = 6; }
            else if (y === 1) { col = BH; d = -4; }
            else [col, d] = this.wallPix(gx, py + y, y, ty, true, BR, BL, seed, wst);
            put(gx, py + y, col, d);
          }
          this.wallDeco(tx, ty, px, py, th, put, seed, false);
        } else {
          // Wand oben (Deckel): grobe Flecken und feines Rauschen
          for (let y = 0; y < T; y++) for (let x = 0; x < T; x++) { const gx = px + x, gy = py + y; put(gx, gy, CP, Math.round((hash(gx >> 2, gy >> 2, seed + 43) - 0.5) * 9 + (hash(gx >> 3, (gy + 4) >> 3, seed + 44) - 0.5) * 7 + (hash(gx, gy, seed + 41) - 0.5) * 5)); }
          const rim = (x, y) => put(px + x, py + y, CH, 0);
          if (isF(tx, ty - 1)) for (let x = 0; x < T; x++) { rim(x, 0); put(px + x, py + 1, CH, -14); }
          if (isF(tx - 1, ty)) for (let y = 0; y < T; y++) rim(0, y);
          if (isF(tx + 1, ty)) for (let y = 0; y < T; y++) rim(T - 1, y);
        }
      }
      // Schatten auf dem Boden (unter Wänden, an Seitenwänden)
      for (let ty = 0; ty < MH; ty++) for (let tx = 0; tx < MW; tx++) {
        if (!isF(tx, ty)) continue; const px = tx * T, py = ty * T;
        if (!isF(tx, ty - 1)) { const f = [0.42, 0.52, 0.63, 0.74, 0.84, 0.92, 0.97]; for (let y = 0; y < f.length; y++) for (let x = 0; x < T; x++) dark(px + x, py + y, f[y]); }
        if (!isF(tx - 1, ty)) { const f = [0.62, 0.8, 0.92]; for (let x = 0; x < f.length; x++) for (let y = 0; y < T; y++) dark(px + x, py + y, f[x]); }
        if (!isF(tx + 1, ty)) { const f = [0.72, 0.88]; for (let x = 0; x < f.length; x++) for (let y = 0; y < T; y++) dark(px + T - 1 - x, py + y, f[x]); }
        if (!isF(tx, ty + 1)) for (let x = 0; x < T; x++) dark(px + x, py + T - 1, 0.85);
      }
      c.putImageData(img, 0, 0);
      // Deko und Lichter
      this.torches = []; this.deco = []; this.glows = [];
      const rng = new A.RNG((W.seed ^ 0x5bd1e995) >>> 0 || 7);
      const S = (n, f, pal, key) => A.Art.sprite(n, f || 0, pal, key);
      const blit = (s, x, y) => { if (s) c.drawImage(s.img, Math.round(x - s.w / 2), Math.round(y - s.h)); };
      const banPal = { D: th.banner[0], C: th.banner[1], H: th.banner[2] };
      for (const r of W.rooms) {
        const rx = r.x * T, ry = r.y * T, rw = r.w * T, rh = r.h * T, wallY = (r.y - 1) * T;
        const hasFront = !isF(r.x + 2, r.y - 1) && isF(r.x + 2, r.y);
        // Fackeln an der oberen Wand
        for (const col of [2, r.w - 3]) {
          const x = (r.x + col) * T + 8, y = wallY + 7;
          if (!hasFront) continue;
          blit(S('sconce'), x, y + 4);
          this.torches.push({ x: x * PX, y: (y - 6) * PX, room: r.i, ph: rng.next() * 10 });
        }
        // Banner
        if (rng.chance(r.type === 'boss' ? 1 : 0.55) && hasFront) for (const col of [4, r.w - 5]) blit(S('banner', 0, banPal, this.themeKey), (r.x + col) * T + 8, wallY + 11);
        // Spinnweben in den oberen Ecken
        for (const [cx, dir] of [[rx, 1], [rx + rw - 1, -1]]) if (rng.chance(0.5)) { c.fillStyle = 'rgba(192,203,220,0.35)'; for (let i = 0; i < 7; i++) { c.fillRect(cx + dir * i, ry + 6 - i * 0.8 | 0, 1, 1); c.fillRect(cx + dir * Math.round(i * 0.6), ry + i, 1, 1); } for (let k = 2; k < 7; k += 2) for (let i = 0; i <= k; i++) c.fillRect(cx + dir * (k - i), ry + i, 1, 1); }
        // Knochen, Schädel, Moos
        const nb = r.type === 'start' ? 0 : rng.int(1, 4);
        for (let i = 0; i < nb; i++) { const s = S(rng.chance(0.4) ? 'skull' : 'bones'); const x = rx + 12 + rng.next() * (rw - 24), y = ry + 14 + rng.next() * (rh - 24); c.globalAlpha = 0.85; blit(s, x, y); c.globalAlpha = 1; }
        const mc = th.moss;
        for (let i = 0; i < (this.themeKey === 'jungle' ? 6 : 2); i++) { const x = rx + rng.next() * rw, y = rng.chance(0.5) ? ry + 2 + rng.next() * 6 : ry + rh - 4 - rng.next() * 6; for (let k = 0; k < 14; k++) { c.fillStyle = mc[k % mc.length]; c.globalAlpha = 0.7; c.fillRect(Math.round(x + (rng.next() - 0.5) * 12), Math.round(y + (rng.next() - 0.5) * 6), 1, 1); } c.globalAlpha = 1; }
        // Pfützen
        if (th.puddle && rng.chance(th.puddle === 'water' && this.themeKey !== 'stone' ? 0.6 : 0.35)) {
          const x = rx + 24 + rng.next() * (rw - 48), y = ry + 24 + rng.next() * (rh - 48), w = 8 + rng.next() * 10, h = 3 + rng.next() * 3;
          const slime = false, lava = th.puddle === 'lava';
          c.fillStyle = slime ? 'rgba(99,199,77,0.45)' : lava ? 'rgba(247,118,34,0.55)' : 'rgba(40,60,110,0.55)';
          c.beginPath(); c.ellipse(Math.round(x), Math.round(y), w, h, 0, 0, TAU); c.fill();
          c.fillStyle = slime ? 'rgba(200,245,160,0.5)' : lava ? 'rgba(254,231,97,0.7)' : 'rgba(160,190,230,0.45)'; c.fillRect(Math.round(x - w / 3), Math.round(y - h / 3), 3, 1);
          if (slime || lava) this.lights.push({ x: x * PX, y: y * PX, r: 30, color: slime ? '#63c74d' : '#f77622', a: 0.5, fl: lava ? 2 : 0.6 });
        }
        // Leuchtpilze (Grotte) und Glutrisse (Rost)
        if (this.themeKey === 'jungle') for (let i = 0; i < rng.int(1, 3); i++) { const x = rx + 8 + rng.next() * (rw - 16), y = ry + (rng.chance(0.5) ? 10 : rh - 4); blit(S('mushglow', i % 2), x, y); this.lights.push({ x: x * PX, y: (y - 3) * PX, r: 34, color: '#2ce8f5', a: 0.75, fl: 0.4 }); }
        if (this.themeKey === 'volcano') for (let i = 0; i < rng.int(1, 2); i++) { let x = rx + 10 + rng.next() * (rw - 20), y = ry + 10 + rng.next() * (rh - 20); c.fillStyle = '#f77622'; for (let k = 0; k < 14; k++) { c.fillRect(Math.round(x), Math.round(y), 1, 1); if (k % 3 === 0) { c.fillStyle = '#feae34'; c.fillRect(Math.round(x), Math.round(y), 1, 1); c.fillStyle = '#f77622'; } x += rng.chance(0.5) ? 1 : -1; y += rng.chance(0.7) ? 1 : 0; } this.lights.push({ x: x * PX, y: y * PX, r: 26, color: '#f77622', a: 0.55, fl: 2 }); }
        // Räume mit Sonderausstattung
        const cx = rx + rw / 2, cy = ry + rh / 2;
        if (r.type === 'boss' || r.type === 'event') {
          const col = r.type === 'boss' ? 'rgba(162,38,51,0.55)' : 'rgba(104,56,108,0.6)';
          c.strokeStyle = col; c.lineWidth = 1; c.beginPath(); c.arc(cx, cy, r.type === 'boss' ? 34 : 22, 0, TAU); c.stroke(); c.beginPath(); c.arc(cx, cy, r.type === 'boss' ? 30 : 19, 0, TAU); c.stroke();
          c.fillStyle = col; for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; c.fillRect(Math.round(cx + Math.cos(a) * (r.type === 'boss' ? 32 : 20.5)) - 1, Math.round(cy + Math.sin(a) * (r.type === 'boss' ? 32 : 20.5)) - 1, 2, 2); }
          if (r.type === 'event') for (let i = 0; i < 4; i++) { const a = i / 4 * TAU + 0.78; const x = cx + Math.cos(a) * 26, y = cy + Math.sin(a) * 18 + 4; blit(S('candle'), x, y); this.lights.push({ x: x * PX, y: (y - 6) * PX, r: 22, color: '#feae34', a: 0.8, fl: 1.5, room: r.i }); }
          if (r.type === 'boss') for (const [x, y] of [[rx + 18, ry + 22], [rx + rw - 18, ry + 22], [rx + 18, ry + rh - 12], [rx + rw - 18, ry + rh - 12]]) { blit(S('brazier'), x, y); this.torches.push({ x: x * PX, y: (y - 9) * PX, room: r.i, ph: rng.next() * 10, big: true }); }
        }
        if (r.type === 'shop' || r.type === 'rest') {
          const w = 44, h = 26, x0 = Math.round(cx - w / 2), y0 = Math.round(cy - h / 2 + (r.type === 'shop' ? -4 : 2));
          c.fillStyle = r.type === 'shop' ? '#68386c' : '#733e39'; c.fillRect(x0, y0, w, h);
          c.fillStyle = r.type === 'shop' ? '#b55088' : '#b86f50'; c.fillRect(x0 + 2, y0 + 2, w - 4, 1); c.fillRect(x0 + 2, y0 + h - 3, w - 4, 1); c.fillRect(x0 + 2, y0 + 2, 1, h - 4); c.fillRect(x0 + w - 3, y0 + 2, 1, h - 4);
          c.fillStyle = r.type === 'shop' ? '#feae34' : '#e4a672'; for (let i = 0; i < 5; i++) c.fillRect(x0 + 6 + i * 8, y0 + Math.floor(h / 2), 3, 1);
          if (r.type === 'shop') { this.deco.push({ s: S('crate'), x: cx - 26, y: cy - 6 }, { s: S('barrel'), x: cx + 26, y: cy - 8 }, { s: S('pot'), x: cx + 20, y: cy + 6 }); }
        }
        if (r.type === 'start') {
          this.lights.push({ x: (cx) * PX, y: (cy - 6) * PX, r: 64, color: '#a8c8ff', a: 0.55, fl: 0.2, beam: true });
          this.deco.push({ s: S('rope'), x: cx + 14, y: cy - 2, flat: true });
        }
        // Möbel in Ecken (vom Spiel als Hindernis markiert)
        if (r.furn) for (const f of r.furn) this.deco.push({ s: S(f.kind), x: f.tx * T + 8, y: f.ty * T + 14 });
      }
      // Türrahmen (Säulen) an Vorderseiten neben Durchgängen
      for (let ty = 0; ty < MH; ty++) for (let tx = 0; tx < MW; tx++) {
        if (isF(tx, ty) || !isF(tx, ty + 1)) continue;
        const px = tx * T, py = ty * T;
        const col = (x) => { c.fillStyle = th.brickHi; c.fillRect(x, py, 3, T); c.fillStyle = th.brickLo; c.fillRect(x + 3, py, 1, T); c.fillStyle = th.capHi; c.fillRect(x, py, 4, 2); };
        if (isF(tx + 1, ty)) col(px + T - 4);
        if (isF(tx - 1, ty)) { c.fillStyle = th.brickLo; c.fillRect(px, py, 1, T); c.fillStyle = th.brickHi; c.fillRect(px + 1, py, 3, T); c.fillStyle = th.capHi; c.fillRect(px, py, 4, 2); }
      }
      // Stimmung je Farbwelt: schwebende Teilchen, Tropfstellen, leuchtende Pilze, Glutrisse (eigener Zufall, ändert die Räume nicht)
      const ar = new A.RNG((W.seed ^ 0x2c1b3c6d) >>> 0 || 11), tk = this.themeKey;
      this.motes = []; this.drips = []; this.cracks = []; this.shafts = [];
      for (const r of W.rooms) {
        const n = Math.round(r.w * r.h / 8);
        for (let i = 0; i < n; i++) this.motes.push({ room: r.i, x: (r.x + ar.next() * r.w) * T, y: (r.y + ar.next() * r.h) * T, h: r.h * T, y0: r.y * T, w: r.w * T, x0: r.x * T, ph: ar.next() * 100, s: ar.next() });
        if (tk === 'jungle' || tk === 'stone' || tk === 'water') for (let i = 0; i < (tk === 'water' ? 3 : tk === 'jungle' ? 2 : 1); i++) {
          const tx = r.x + 1 + Math.floor(ar.next() * (r.w - 2)); if (isF(tx, r.y - 1)) continue;
          this.drips.push({ room: r.i, x: tx * T + 4 + Math.floor(ar.next() * 8), y0: r.y * T - 3, y1: (r.y + 1 + ar.next() * (r.h - 2)) * T, per: 2.4 + ar.next() * 2.6, ph: ar.next() * 5, sp: -1 });
        }
        if (!isF(r.x + 2, r.y - 1) && ar.next() < 0.7) for (let i = 0; i < (ar.next() < 0.4 ? 2 : 1); i++) this.shafts.push({ room: r.i, x: (r.x + 1 + ar.next() * (r.w - 4)) * T, y: r.y * T - 6, w: 8 + Math.floor(ar.next() * 10), len: (3.5 + ar.next() * 3) * T, ph: ar.next() * 6 });
        const m = tk === 'jungle' ? 3 : tk === 'volcano' ? 3 : 0;
        for (let i = 0; i < m; i++) {
          const tx = r.x + 1 + Math.floor(ar.next() * (r.w - 2)), ty = r.y + 1 + Math.floor(ar.next() * (r.h - 2)); if (!isF(tx, ty)) continue;
          const px = tx * T + 3 + Math.floor(ar.next() * 8), py = ty * T + 5 + Math.floor(ar.next() * 8);
          if (tk === 'jungle') { // drei kleine leuchtende Pilze
            for (let j = 0; j < 3; j++) { const ox = px + j * 3, oy = py + (j === 1 ? -1 : 0); c.fillStyle = '#ead4aa'; c.fillRect(ox, oy, 1, 2); c.fillStyle = j === 1 ? '#2ce8f5' : '#0099db'; c.fillRect(ox - 1, oy - 1, 3, 1); c.fillStyle = '#c0f8ff'; c.fillRect(ox, oy - 1, 1, 1); }
            this.lights.push({ x: (px + 3) * PX, y: py * PX, r: 24, color: '#2ce8f5', a: 0.6, fl: 0.6, room: r.i });
          } else { // Glutriss im Boden
            const pts = []; let x = px, y = py; for (let j = 0; j < 7; j++) { pts.push([x, y]); x += 1; if (ar.next() < 0.4) y += ar.next() < 0.5 ? 1 : -1; }
            c.fillStyle = '#1f1216'; for (const [qx, qy] of pts) c.fillRect(qx, qy - 1, 1, 3);
            this.cracks.push({ pts, ph: ar.next() * 6, room: r.i }); this.lights.push({ x: (px + 3) * PX, y: py * PX, r: 22, color: '#f77622', a: 0.5, fl: 0.5, room: r.i });
          }
        }
      }
      this.level = cv; this.lc = c; this.levelW = W; this.litAt = {}; this.cam = null; this.levelAge = 0; this.opening = null; this._act = null;
    }
    // Wandstein je Welt: Ziegel, Sandstein (grosse Blöcke mit Zeichen), Fels (ohne Fugen), Ranken und Algen kommen in wallDeco dazu
    wallPix(gx, gy, y, ty, upper, BR, BL, seed, wst) {
      const yy = y - 2;
      if (wst === 'rock') {
        const n = hash(gx >> 2, gy >> 2, seed + 91), n2 = hash(gx >> 1, gy >> 1, seed + 92);
        let d = Math.round((n - 0.5) * 18 + (n2 - 0.5) * 8) - (upper ? 8 : 0) - (y > 11 ? 8 : 0);
        if (hash(gx >> 3, gy >> 2, seed + 93) < 0.12 && n2 < 0.3) return [BL, 4];
        return [BR[Math.floor(n * BR.length)], d];
      }
      const bw = wst === 'sandstone' ? 12 : 8, ch = wst === 'sandstone' ? 5 : 4;
      const course = Math.floor(yy / ch), off = (course & 1) * (bw / 2), cy = ty * 4 + course;
      if (yy % ch === ch - 1 || (gx + off) % bw === bw - 1) return [BL, upper ? 2 : 6];
      const bi = Math.floor((gx + off) / bw); const col = BR[Math.floor(hash(bi, cy, seed + 21) * BR.length)];
      let d = Math.round((hash(gx, gy, seed + 22) - 0.5) * 8) + (yy % ch === 0 ? (upper ? 6 : 10) : 0) - (upper ? 6 : y > 11 ? 8 : 0);
      if (hash(bi, cy, seed + 23) < 0.06) d -= 22;
      // Zeichen im Sandstein
      if (wst === 'sandstone' && hash(bi, cy, seed + 24) < 0.18) { const lx = (gx + off) % bw, ly = yy % ch; if ((lx === 4 || lx === 7) && ly > 0 && ly < 4 || (ly === 2 && lx > 3 && lx < 8 && hash(bi, cy, 25) < 0.5)) return [BL, 12]; }
      return [col, d];
    }
    wallDeco(tx, ty, px, py, th, put, seed, front) {
      const wst = th.wallStyle;
      // Moos (Grundausstattung), Ranken im Dschungel, Algen und nasser Glanz unter Wasser, Glutadern im Vulkan
      if (front && hash(tx, ty, seed + 31) < (wst === 'vines' ? 0.45 : wst === 'algae' ? 0.4 : 0.12)) { const mc = th.moss.map(rgb); for (let k = 0; k < 9; k++) { const x = Math.floor(hash(tx, k, 32) * 16), y = 10 + Math.floor(hash(k, ty, 33) * 5); put(px + x, py + y, mc[k % mc.length], 0); if (hash(x, y, 34) < 0.4 && y > 1) put(px + x, py + y - 1, mc[0], -10); } }
      if (wst === 'vines' && hash(tx, ty, seed + 35) < 0.55) {
        const vx = 2 + Math.floor(hash(tx, ty, 36) * 12), len = front ? 6 + Math.floor(hash(tx, ty, 37) * 10) : 16, g1 = rgb('#3e8948'), g2 = rgb('#63c74d'), g0 = rgb('#265c42');
        let x = vx; for (let y = front ? 0 : 0; y < len; y++) { put(px + x, py + y, y % 3 ? g1 : g0, 0); if (y % 4 === 2) { put(px + x + 1, py + y, g2, 0); put(px + x + 2, py + y - 1, g2, -10); } if (y % 4 === 0 && x > 1) put(px + x - 1, py + y, g2, -20); if (hash(tx, y, 38) < 0.25) x = clamp(x + (hash(y, ty, 39) < 0.5 ? 1 : -1), 1, 14); }
      }
      if (wst === 'algae' && front) { const a1 = rgb('#2ce8f5'), a2 = rgb('#3e8948'); for (let x = 0; x < T; x++) { const h = Math.floor(hash(px + x, ty, seed + 41) * 4); for (let y = T - 2 - h; y < T - 1; y++) put(px + x, py + y, hash(x, y, 42) < 0.3 ? a1 : a2, -40); } }
      if (wst === 'rock' && hash(tx, ty, seed + 45) < 0.25) { let x = 3 + Math.floor(hash(tx, ty, 46) * 10), y = front ? 3 : 1; const o1 = rgb('#f77622'), o2 = rgb('#feae34'); for (let k = 0; k < 10 && y < 15; k++) { put(px + x, py + y, k % 3 ? o1 : o2, -10); y++; if (hash(tx + k, ty, 47) < 0.4) x = clamp(x + (hash(k, tx, 48) < 0.5 ? 1 : -1), 0, 15); } this.lights.push({ x: (px + x) * PX, y: (py + y) * PX, r: 22, color: '#f77622', a: 0.35, fl: 1 }); }
    }
    // Grube: Wasser (mit Schaumkante), Lava (mit Kruste), Abgrund (mit Sternen)
    paintPit(tx, ty, px, py, th, put, tile, seed) {
      const P = th.pit || { base: '#0d0b14', mid: '#120f1a', hi: '#3a4466', rim: '#181425', void: true };
      const B = rgb(P.base), M = rgb(P.mid), H = rgb(P.hi), R = rgb(P.rim);
      const up = tile(tx, ty - 1) !== 4, lf = tile(tx - 1, ty) !== 4, rt = tile(tx + 1, ty) !== 4, dn = tile(tx, ty + 1) !== 4;
      for (let y = 0; y < T; y++) for (let x = 0; x < T; x++) {
        const gx = px + x, gy = py + y;
        let col = hash(gx >> 2, gy >> 1, seed + 101) < 0.5 ? B : M, d = Math.round((hash(gx, gy, seed + 102) - 0.5) * 8);
        if (P.lava) { const w = Math.sin(gx * 0.35 + Math.sin(gy * 0.3) * 2 + seed) + Math.sin(gy * 0.5 - gx * 0.1); col = w > 1.2 ? H : w > 0.2 ? M : B; d = 0; if (hash(gx >> 2, gy >> 2, seed + 103) < 0.12) { col = R; d = 10; } }
        else if (P.void) { col = y < 3 && up ? M : B; d = 0; if (hash(gx, gy, seed + 104) < 0.012) { col = H; d = 0; } else if (hash(gx, gy, seed + 105) < 0.006) { col = [255, 255, 255]; } }
        else { const w = (gx + Math.round(Math.sin(gy * 0.6) * 2)) % 9; if (w === 0 && hash(gx >> 3, gy, seed + 106) < 0.5) { col = H; d = -60; } }
        // Kante: oben eine dunkle Lippe (Höhe), seitlich ein heller Saum (Schaum, Glut, Leuchten)
        if (up && y < 3) { col = y === 0 ? R : y === 1 ? (P.void ? R : M) : col; d = y === 0 ? 10 : d - 20; }
        else if ((lf && x === 0) || (rt && x === T - 1) || (dn && y === T - 1)) { col = P.void ? M : H; d = P.lava ? 0 : P.void ? 10 : -30; }
        put(gx, gy, col, d);
      }
      this.pits.push({ tx, ty, lava: !!P.lava, void: !!P.void });
      if (P.lava && hash(tx, ty, seed + 107) < 0.4) this.lights.push({ x: (px + 8) * PX, y: (py + 8) * PX, r: 34, color: '#f77622', a: 0.55, fl: 0.8 });
      if (P.void && hash(tx, ty, seed + 108) < 0.15) this.lights.push({ x: (px + 8) * PX, y: (py + 8) * PX, r: 20, color: '#68386c', a: 0.4, fl: 0.4 });
    }
    // Gefahr-Boden: Schlamm (Blasen), Treibsand (Wirbel), seichtes Wasser (über dem Boden), Glut (glühende Risse), Schatten (violett)
    paintHaz(tx, ty, px, py, th, put, tintPx, tile, seed) {
      const Z = th.haz || { base: '#3a3020', mid: '#2a2418', hi: '#5a4a30' }; const B = rgb(Z.base), M = rgb(Z.mid), H = rgb(Z.hi);
      const edge = (x, y) => (x === 0 && tile(tx - 1, ty) !== 5) || (x === T - 1 && tile(tx + 1, ty) !== 5) || (y === 0 && tile(tx, ty - 1) !== 5) || (y === T - 1 && tile(tx, ty + 1) !== 5);
      for (let y = 0; y < T; y++) for (let x = 0; x < T; x++) {
        const gx = px + x, gy = py + y;
        if (Z.shallow) { tintPx(gx, gy, B, edge(x, y) ? 0.35 : 0.55); if ((gx + gy * 3 + Math.floor(hash(gx >> 3, gy >> 2, seed) * 5)) % 11 === 0) tintPx(gx, gy, H, 0.5); continue; }
        let col = hash(gx >> 1, gy >> 1, seed + 111) < 0.55 ? B : M, d = Math.round((hash(gx, gy, seed + 112) - 0.5) * 8);
        if (Z.embers) { if (hash(gx >> 1, gy >> 1, seed + 113) < 0.16) { col = H; d = hash(gx, gy, 114) < 0.4 ? 40 : 0; } }
        else if (this.themeKey === 'desert') { const cx = (gx % 16) - 8, cy = (gy % 16) - 8, r = Math.hypot(cx, cy * 1.4); if (Math.round(r + Math.atan2(cy, cx) * 1.3) % 4 === 0) { col = M; d = -10; } }
        else if (hash(gx, gy, seed + 115) < 0.03) { col = H; d = 0; }
        if (edge(x, y)) d -= 18;
        put(gx, gy, col, d);
      }
      this.hazTiles.push({ tx, ty });
      if (Z.embers && hash(tx, ty, seed + 116) < 0.35) this.lights.push({ x: (px + 8) * PX, y: (py + 8) * PX, r: 26, color: '#f77622', a: 0.4, fl: 1.4 });
    }
    // Stimmung zeichnen (auf dem Leucht-Bild): Staub/Sporen/Glut/Asche, Tropfen mit Spritzer, Glutrisse
    drawAmbience(cx, cy) {
      const g = this.g, t = this.t, tk = this.themeKey, bw = this.bw, bh = this.bh;
      const th = this.theme, col = th.mote || '#c0cbdc';
      const rise = th.rise != null ? th.rise : -1, sp = tk === 'volcano' ? 10 : tk === 'desert' ? 14 : 4;
      // Lichtstrahlen von oben: schräge, weiche Bahnen, die langsam atmen
      const sc = th.shaft || [255, 255, 255];
      for (const s of this.shafts || []) {
        if (this.litAt[s.room] == null) continue;
        const x = s.x - cx, y = s.y - cy, sl = s.len * 0.45; if (x + sl + s.w < 0 || x > bw || y > bh || y + s.len < 0) continue;
        const a = 0.24 + 0.07 * Math.sin(t * 0.7 + s.ph), gr = g.createLinearGradient(0, y, 0, y + s.len);
        gr.addColorStop(0, `rgba(${sc},${a})`); gr.addColorStop(1, `rgba(${sc},0)`);
        g.globalAlpha = 1; g.fillStyle = gr; g.beginPath(); g.moveTo(x, y); g.lineTo(x + s.w, y); g.lineTo(x + s.w + sl, y + s.len); g.lineTo(x + sl, y + s.len); g.closePath(); g.fill();
      }
      // Gruben leben: Wasser glitzert, Lava blubbert und glüht, im Abgrund funkeln Sterne
      for (const p of this.pits || []) {
        const x = p.tx * T - cx, y = p.ty * T - cy; if (x < -T || y < -T || x > bw || y > bh) continue;
        const ph = hash(p.tx, p.ty, 7) * 10;
        if (p.lava) {
          g.globalAlpha = 0.14 + 0.1 * Math.sin(t * 1.7 + ph); g.fillStyle = '#f77622'; g.fillRect(x, y, T, T);
          const k = (t * 0.6 + ph) % 3; if (k < 0.7) { const q = k / 0.7, bx = x + 3 + Math.floor(hash(p.tx, p.ty, 8) * 9), by = y + 5 + Math.floor(hash(p.tx, p.ty, 9) * 7); g.globalAlpha = 0.9 * (1 - q); g.fillStyle = '#fee761'; g.fillRect(bx, by - Math.round(q * 2), q > 0.6 ? 3 : 2, q > 0.6 ? 1 : 2); }
        } else if (p.void) {
          for (let i = 0; i < 2; i++) { const sx = x + Math.floor(hash(p.tx, p.ty, 10 + i) * 15), sy = y + 3 + Math.floor(hash(p.tx, p.ty, 12 + i) * 12); g.globalAlpha = Math.max(0, Math.sin(t * (1.5 + i) + ph * 3)) * 0.8; g.fillStyle = i ? '#ffffff' : '#b55088'; g.fillRect(sx, sy, 1, 1); }
        } else {
          const o = Math.floor((t * 5 + ph * 3) % (T + 6)) - 3; g.globalAlpha = 0.28; g.fillStyle = '#c0f8ff'; g.fillRect(x + o, y + 5 + ((p.tx + p.ty) % 3) * 3, 3, 1);
          if (Math.sin(t * 2.3 + ph * 5) > 0.97) { g.globalAlpha = 0.8; g.fillStyle = '#ffffff'; g.fillRect(x + 8, y + 8, 1, 1); }
        }
      }
      g.globalAlpha = 1;
      for (const m of this.motes || []) {
        if (this.litAt[m.room] == null) continue;
        const yy = m.y0 + ((((m.y - m.y0) - rise * t * sp * (0.6 + m.s)) % m.h) + m.h) % m.h;
        // Wüste: Sand weht seitlich durch den Raum
        const xx = rise === 0 ? m.x0 + ((((m.x - m.x0) + t * sp * (0.6 + m.s)) % m.w) + m.w) % m.w : m.x;
        const x = Math.round(xx + Math.sin(t * 0.5 + m.ph) * 6 - cx), y = Math.round((rise === 0 ? m.y + Math.sin(t * 1.3 + m.ph) * 3 : yy) - cy);
        if (x < 0 || y < 0 || x >= bw || y >= bh) continue;
        g.globalAlpha = (tk === 'volcano' ? 0.45 : 0.22) + 0.3 * (0.5 + 0.5 * Math.sin(t * 2 + m.ph)); g.fillStyle = col; g.fillRect(x, y, 1, 1);
      }
      for (const d of this.drips || []) {
        if (this.litAt[d.room] == null) continue;
        const x = d.x - cx; if (x < -4 || x > bw + 4) continue;
        const k = (t + d.ph) % d.per, cyc = Math.floor((t + d.ph) / d.per), tf = Math.sqrt(2 * (d.y1 - d.y0) / 320), wc = tk === 'stone' ? '#c0cbdc' : '#7fd8ff';
        g.fillStyle = wc;
        if (k < 1) { g.globalAlpha = 0.3 + k * 0.6; g.fillRect(Math.round(x), Math.round(d.y0 - cy), 1, k > 0.6 ? 2 : 1); }
        else if (k < 1 + tf) { const q = k - 1; g.globalAlpha = 0.9; g.fillRect(Math.round(x), Math.round(d.y0 + 160 * q * q - cy), 1, 2); }
        else if (k < 1 + tf + 0.35) {
          const q = (k - 1 - tf) / 0.35, yy = d.y1 - cy; g.globalAlpha = 0.8 * (1 - q); g.strokeStyle = wc; g.lineWidth = 1;
          g.beginPath(); g.ellipse(Math.round(x) + 0.5, Math.round(yy) + 0.5, 1 + q * 5, 0.5 + q * 2, 0, 0, TAU); g.stroke();
          g.fillRect(Math.round(x - 1 - q * 3), Math.round(yy - 2 - Math.sin(q * Math.PI) * 4), 1, 1); g.fillRect(Math.round(x + 1 + q * 3), Math.round(yy - 2 - Math.sin(q * Math.PI) * 3), 1, 1);
          if (d.sp !== cyc) { d.sp = cyc; const y = d.y1 - cy; if (y > 0 && y < bh && A.Sound && A.Sound.drip) A.Sound.drip(); }
        }
      }
      for (const k of this.cracks || []) {
        if (this.litAt[k.room] == null) continue;
        const pu = 0.5 + 0.5 * Math.sin(t * 1.6 + k.ph);
        k.pts.forEach(([px, py], i) => { g.globalAlpha = 0.45 + 0.5 * pu * Math.sin((i + 1) / (k.pts.length + 1) * Math.PI); g.fillStyle = i % 3 === 1 ? '#fee761' : '#f77622'; g.fillRect(px - cx, py - cy, 1, 1); });
        if (Math.random() < 0.01 && A.FX) { const [px, py] = k.pts[3]; A.FX.part({ kind: 'px', add: true, x: px * PX, y: py * PX, vx: (Math.random() - 0.5) * 10, vy: -20, life: 0.8, color: '#feae34', drag: 0.5 }); }
      }
      g.globalAlpha = 1;
    }
    applyDecals() {
      if (!A.FX) return; const list = A.FX.takeDecals(); if (!list.length || !this.lc) return;
      const c = this.lc;
      for (const d of list) {
        const x = Math.round(d.x / PX), y = Math.round(d.y / PX);
        if (d.kind === 'drop') { c.globalAlpha = 0.8; c.fillStyle = d.color; c.fillRect(x, y, d.r > 1 ? 2 : 1, 1); }
        else if (d.kind === 'splat') { c.globalAlpha = 0.7; c.fillStyle = d.color; for (let i = 0; i < d.r * 6; i++) { const a = Math.random() * TAU, rr = Math.random() * d.r; c.fillRect(Math.round(x + Math.cos(a) * rr * 1.4), Math.round(y + Math.sin(a) * rr * 0.7), 1, 1); } }
        else if (d.kind === 'bones') { c.globalAlpha = 0.9; const s = A.Art.sprite('bones'); c.drawImage(s.img, x - 4, y - 2); const k = A.Art.sprite('skull'); c.drawImage(k.img, x + 1, y - 5); }
      }
      c.globalAlpha = 1;
    }

    // ---------- Ein Bild malen ----------
    draw(W, dt) {
      this.t += dt; this.dt = Math.min(0.05, dt || 0.016);
      if (!W) return;
      if (this.levelW !== W) this.buildLevel(W);
      this.applyDecals();
      const b = this.b, l = this.l, g = this.g, bw = this.bw, bh = this.bh, h = W.hero, t = this.t;
      const MW = A.World.MW * T, MH = A.World.MH * T;
      // Kamera (weich folgen, etwas in Laufrichtung vorausschauen)
      const tx = h.x / PX + (h.moving ? h.fx * 12 : 0), ty = h.y / PX + (h.moving ? h.fy * 8 : 0);
      if (!this.cam) this.cam = { x: tx, y: ty };
      const k = 1 - Math.exp(-dt * 7); this.cam.x += (tx - this.cam.x) * k; this.cam.y += (ty - this.cam.y) * k;
      // Held in die Mitte der freien Fläche zwischen Anzeige oben und Knöpfen unten (Handy hochkant)
      const kp = this.dpr / this.s, tp = this.topPad * kp, bp = (this.botPad || 0) * kp;
      let cx = this.cam.x - bw / 2, cy = this.cam.y - bh / 2 - (tp - bp) / 2;
      cx = MW > bw ? clamp(cx, 0, MW - bw) : (MW - bw) / 2; cy = MH > bh - tp - bp ? clamp(cy, -tp, MH - bh + bp) : (MH - bh) / 2 - (tp - bp) / 2;
      const tr = A.FX ? A.FX.trauma : 0; const sh = tr * tr * 7;
      cx += sh * (Math.sin(t * 61) + Math.sin(t * 37)) * 0.5; cy += sh * (Math.sin(t * 53 + 1) + Math.sin(t * 29)) * 0.5;
      cx = Math.round(cx); cy = Math.round(cy); this.cx = cx; this.cy = cy;
      // Grund
      b.globalCompositeOperation = 'source-over'; b.globalAlpha = 1;
      b.fillStyle = '#0d0b14'; b.fillRect(0, 0, bw, bh);
      const sx = Math.max(0, cx), sy = Math.max(0, cy), sw = Math.min(MW, cx + bw) - sx, shh = Math.min(MH, cy + bh) - sy;
      if (sw > 0 && shh > 0) b.drawImage(this.level, sx, sy, sw, shh, sx - cx, sy - cy, sw, shh);
      g.globalCompositeOperation = 'source-over'; g.clearRect(0, 0, bw, bh); g.globalCompositeOperation = 'lighter';
      // Fackeln anzünden, wenn der Raum betreten wurde
      this.levelAge += dt;
      for (const r of W.rooms) if (r.visited && this.litAt[r.i] == null) { this.litAt[r.i] = this.levelAge > 0.5 ? t : t - 5; if (this.levelAge > 0.5 && A.FX) A.FX.ev('ignite'); }
      // Verschlossene Türen (Gitter)
      this.drawDoors(W, cx, cy);
      // Rauch (unter den Figuren)
      if (A.FX) for (const p of A.FX.P) if (p.kind === 'smoke') { b.globalAlpha = clamp(p.life / p.max, 0, 1) * 0.45; b.fillStyle = p.color; b.beginPath(); b.arc(Math.round(p.x / PX - cx), Math.round((p.y - p.z) / PX - cy), p.size, 0, TAU); b.fill(); }
      b.globalAlpha = 1;
      // Alles nach Tiefe sortiert
      for (const m of W.mons) this.drawWarn(m, cx, cy);
      this.drawBoonsGround(W, cx, cy);
      A.Bosses.drawGround(this, W, cx, cy);
      const list = [];
      for (const r of W.rooms) for (const p of r.props) if (!p.hidden) list.push({ y: p.y / PX + (p.kind === 'stairs' ? -20 : 4), f: () => this.drawProp(p, W, cx, cy) });
      for (const d of this.deco) list.push({ y: d.flat ? -1e9 : d.y, f: () => { b.drawImage(d.s.img, Math.round(d.x - d.s.w / 2 - cx), Math.round(d.y - d.s.h - cy)); } });
      for (const p of W.picks) list.push({ y: p.y / PX, f: () => this.drawPick(p, cx, cy) });
      for (const m of W.mons) list.push({ y: m.y / PX + 6, f: () => this.drawMon(m, W, cx, cy) });
      for (const a of W.allies || []) list.push({ y: a.y / PX + 6, f: () => this.drawAlly(a, cx, cy) });
      for (const k of W.marks || []) if (k.kind === 'barrel') list.push({ y: k.y / PX + 4, f: () => this.drawBarrel(k, W, cx, cy) });
      list.push({ y: h.y / PX + 7, f: () => this.drawHero(h, W, cx, cy) });
      list.sort((a, b2) => a.y - b2.y);
      for (const it of list) it.f();
      // Teilchen (normal)
      if (A.FX) for (const p of A.FX.P) {
        if (p.kind !== 'px' || p.add) continue; const a = clamp(p.life / p.max * 1.5, 0, 1);
        if (p.rock) { // Stein mit dunklem Rand, Staubfahne beim Fallen, Schatten am Boden
          const X = Math.round(p.x / PX - cx), Y = Math.round((p.y - p.z) / PX - cy), sz = p.size;
          if (p.z > 2) { b.globalAlpha = 0.45 * a; b.fillStyle = '#08060e'; b.fillRect(X - 1, Math.round(p.y / PX - cy) + 1, sz + 2, 1); b.globalAlpha = 0.25 * a; b.fillStyle = '#c0cbdc'; b.fillRect(X + 1, Y - 6, 1, 6); }
          b.globalAlpha = a; b.fillStyle = '#181425'; b.fillRect(X - 1, Y - 1, sz + 2, sz + 2); b.fillStyle = p.color; b.fillRect(X, Y, sz, sz); b.fillStyle = '#ffffff'; b.globalAlpha = 0.5 * a; b.fillRect(X, Y, 1, 1);
          continue;
        }
        b.globalAlpha = a; b.fillStyle = p.color; b.fillRect(Math.round(p.x / PX - cx), Math.round((p.y - p.z) / PX - cy), p.size, p.size);
      }
      b.globalAlpha = 1;
      // Geschosse
      for (const s of W.shots) this.drawShot(s, cx, cy);
      // Effekte (Hiebe, Ringe)
      for (const f of W.fx) {
        const x = f.x / PX - cx, y = f.y / PX - cy;
        if (f.kind === 'slash') {
          const a = Math.atan2(f.fy, f.fx), p = 1 - f.life / 0.18, R = (f.r - 6) / PX;
          const a0 = a - 1.3, sweep = 2.6 * Math.min(1, p * 2.2);
          g.globalAlpha = 1 - p * 0.8; g.strokeStyle = f.color === '#fff' ? '#ffffff' : f.color; g.lineWidth = 3; g.beginPath(); g.arc(x, y - 4, R, a0, a0 + sweep); g.stroke();
          g.globalAlpha = (1 - p) * 0.6; g.strokeStyle = f.color === '#fff' ? '#fee761' : '#2ce8f5'; g.lineWidth = 1; g.beginPath(); g.arc(x, y - 4, R - 3, a0 + sweep * 0.3, a0 + sweep); g.stroke();
        } else if (f.kind === 'claw') { // Krallen-Hieb: drei rote Striche quer zur Angriffsrichtung
          const a = Math.atan2(f.fy, f.fx), p = 1 - f.life / 0.22, R = f.r / PX * 0.75, n = f.big ? 4 : 3;
          g.save(); g.translate(x + Math.cos(a) * R, y - 6 + Math.sin(a) * R * 0.6); g.rotate(a + Math.PI / 2);
          const len = (f.big ? 16 : 10) * Math.min(1, p * 3);
          for (let i = 0; i < n; i++) { const o = (i - (n - 1) / 2) * 4; g.globalAlpha = (1 - p) * 0.95; g.strokeStyle = i % 2 ? '#ffffff' : f.ally ? (f.col || '#2ce8f5') : '#ff0044'; g.lineWidth = 2; g.beginPath(); g.moveTo(o - len / 2, -len / 2 + o * 0.3); g.lineTo(o + len / 2, len / 2 + o * 0.3); g.stroke(); }
          g.restore();
        } else if (f.kind === 'ring') { g.globalAlpha = clamp(f.life / 0.4, 0, 1); g.strokeStyle = f.color; g.lineWidth = 2; g.beginPath(); g.arc(x, y, f.r * (1.2 - f.life) / PX, 0, TAU); g.stroke(); }
      }
      g.globalAlpha = 1;
      this.drawBoonsTop(W, cx, cy);
      A.Bosses.drawTop(this, W, cx, cy);
      // Leuchtende Teilchen
      if (A.FX) for (const p of A.FX.P) {
        if (p.kind === 'smoke' || (p.kind === 'px' && !p.add)) continue;
        const a = clamp(p.life / p.max * 1.4, 0, 1), x = p.x / PX - cx, y = (p.y - p.z) / PX - cy;
        g.globalAlpha = a; g.fillStyle = p.color; g.strokeStyle = p.color;
        if (p.kind === 'spark') { g.lineWidth = 1; g.beginPath(); g.moveTo(Math.round(x) + 0.5, Math.round(y) + 0.5); g.lineTo(Math.round(x - p.vx * 0.025) + 0.5, Math.round(y - p.vy * 0.025) + 0.5); g.stroke(); }
        else if (p.kind === 'ring') { const q = 1 - p.life / p.max; g.lineWidth = 2; g.beginPath(); g.arc(x, y, p.size / PX * (0.2 + q), 0, TAU); g.stroke(); }
        else if (p.kind === 'rune') { const q = 1 - p.life / p.max, R = p.size * (0.6 + q * 0.4); g.lineWidth = 1; g.beginPath(); g.ellipse(x, y, R, R * 0.5, 0, 0, TAU); g.stroke(); for (let i = 0; i < 6; i++) { const ang = i / 6 * TAU + t * 3; g.fillRect(Math.round(x + Math.cos(ang) * R) - 1, Math.round(y + Math.sin(ang) * R * 0.5) - 1, 2, 2); } }
        else if (p.kind === 'plus') { const X = Math.round(x), Y = Math.round(y); g.fillRect(X - 1, Y, 3, 1); g.fillRect(X, Y - 1, 1, 3); }
        else g.fillRect(Math.round(x), Math.round(y), p.size, p.size);
      }
      g.globalAlpha = 1;
      this.drawAmbience(cx, cy);
      // ---------- Licht ----------
      this.drawLights(W, cx, cy);
      // ---------- Zusammensetzen ----------
      const c = this.ctx, dw = this.dw, dh = this.dh, s = this.s;
      c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1;
      if (this.quality === 'hi') {
        c.imageSmoothingEnabled = false; c.drawImage(this.buf, 0, 0, bw * s, bh * s);
        c.globalCompositeOperation = 'multiply'; c.imageSmoothingEnabled = true; c.drawImage(this.lt, 0, 0, bw * s, bh * s);
        c.globalCompositeOperation = 'lighter'; c.imageSmoothingEnabled = false; c.drawImage(this.gl, 0, 0, bw * s, bh * s);
      } else {
        b.globalCompositeOperation = 'multiply'; b.drawImage(this.lt, 0, 0); b.globalCompositeOperation = 'lighter'; b.drawImage(this.gl, 0, 0); b.globalCompositeOperation = 'source-over';
        c.imageSmoothingEnabled = false; c.drawImage(this.buf, 0, 0, bw * s, bh * s);
      }
      c.globalCompositeOperation = 'source-over';
      this.overlay(W, cx, cy);
    }

    drawDoors(W, cx, cy) {
      const b = this.b, MW = A.World.MW, MH = A.World.MH;
      const x0 = Math.max(0, Math.floor(cx / T)), y0 = Math.max(0, Math.floor(cy / T)), x1 = Math.min(MW - 1, Math.ceil((cx + this.bw) / T)), y1 = Math.min(MH - 1, Math.ceil((cy + this.bh) / T));
      if (W.active && W.active.lockT == null) W.active.lockT = this.t;
      const p = W.active ? clamp((this.t - W.active.lockT) / 0.18, 0, 1) : 1;
      // Gitter schlagen auf: Staub an jeder Tür
      if (W.active && p >= 1 && !W.active._dust) { W.active._dust = 1; if (A.FX) for (const [dx2, dy2] of W.active.doors) A.FX.smoke((dx2 + 0.5) * T * PX, (dy2 + 1) * T * PX - 6, 3, '#8b9bb4', 3); }
      // Raum gesäubert: Gitter fahren nach oben weg
      if (this._act && !W.active && this._act.cleared) this.opening = { doors: this._act.doors.slice(), t0: this.t };
      this._act = W.active;
      if (this.opening) {
        const q = (this.t - this.opening.t0) / 0.45;
        if (q >= 1) this.opening = null;
        else for (const [ox, oy] of this.opening.doors) {
          const px = ox * T - cx, top = oy * T - cy, up = Math.round(q * q * T), hh = T - up; if (hh <= 0) continue;
          b.save(); b.beginPath(); b.rect(px, top, T, T); b.clip();
          for (let i = 0; i < 4; i++) { b.fillStyle = '#262b44'; b.fillRect(px + 1 + i * 4, top - up, 3, T); b.fillStyle = '#8b9bb4'; b.fillRect(px + 2 + i * 4, top - up, 1, T); b.fillStyle = '#5a6988'; b.fillRect(px + 3 + i * 4, top - up, 1, T); }
          b.fillStyle = '#262b44'; b.fillRect(px, top - up + 5, T, 3); b.fillStyle = '#8b9bb4'; b.fillRect(px, top - up + 5, T, 1);
          b.restore();
          if (Math.random() < 0.3 && A.FX) A.FX.part({ kind: 'px', x: (ox * T + Math.random() * T) * PX, y: (oy + 1) * T * PX, vx: 0, vy: -10, life: 0.5, color: '#8b9bb4' });
        }
      }
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
        if (W.tiles[y][x] !== 2) continue;
        const px = x * T - cx, py = y * T - cy - Math.round((1 - p) * 12);
        b.fillStyle = 'rgba(10,8,16,0.55)'; b.fillRect(px, y * T - cy, T, T);
        for (let i = 0; i < 4; i++) { b.fillStyle = '#262b44'; b.fillRect(px + 1 + i * 4, py, 3, T); b.fillStyle = '#8b9bb4'; b.fillRect(px + 2 + i * 4, py, 1, T); b.fillStyle = '#5a6988'; b.fillRect(px + 3 + i * 4, py, 1, T); }
        b.fillStyle = '#262b44'; b.fillRect(px, py + 5, T, 3); b.fillStyle = '#8b9bb4'; b.fillRect(px, py + 5, T, 1);
        b.fillStyle = '#c0cbdc'; for (let i = 0; i < 4; i++) b.fillRect(px + 2 + i * 4, py + T - 2, 1, 2);
      }
    }

    shadow(x, y, w) { const b = this.b; b.fillStyle = 'rgba(8,6,14,0.45)'; b.beginPath(); b.ellipse(Math.round(x), Math.round(y), w, Math.max(1.5, w * 0.38), 0, 0, TAU); b.fill(); }
    blit(spr, x, y, flip, opts) {
      // x = Mitte, y = Fussboden; opts: sx/sy Skalierung, alpha, white
      const b = this.b; const img = opts && opts.white ? A.Art.white(spr, flip) : flip ? A.Art.flipped(spr) : spr.img;
      const sx = (opts && opts.sx) || 1, sy = (opts && opts.sy) || 1;
      const w = Math.round(spr.w * sx), hh = Math.round(spr.h * sy);
      if (opts && opts.alpha != null) b.globalAlpha = opts.alpha;
      b.drawImage(img, Math.round(x - w / 2), Math.round(y - hh), w, hh);
      b.globalAlpha = 1;
    }
    outlineGlow(spr, x, y, flip, color, sxy) {
      const b = this.b, key = 'ol' + color + (flip ? 'f' : '');
      if (!spr[key]) spr[key] = A.Art.silhouette(flip ? A.Art.flipped(spr) : spr.img, color);
      const s = sxy || 1, w = Math.round(spr.w * s), hh = Math.round(spr.h * s);
      for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) b.drawImage(spr[key], Math.round(x - w / 2) + dx, Math.round(y - hh) + dy, w, hh);
    }

    drawHero(h, W, cx, cy) {
      const b = this.b, run = A.Game.run; if (!run) return;
      let x = h.x / PX - cx, y = h.y / PX - cy + 7;
      const walk = h.moving ? Math.floor(this.t * 10) % 4 : -1;
      const frame = walk < 0 ? 0 : [1, 2, 3, 2][walk];
      const bob = walk < 0 ? (Math.sin(this.t * 2.5) > 0.7 ? -1 : 0) : (walk % 2 === 1 ? -1 : 0);
      const spr = A.Art.heroSprite(run.race, run.cls, frame); const flip = h.fx < 0;
      const blink = h.inv > 0 && Math.floor(this.t * 20) % 2;
      if (W.sinkT == null) this.shadow(x, y, 6);
      if (!h.alive) { this.drawFallen(spr, x, y, flip, h); return; }
      if (W.sinkT != null) { // Abstieg: Held dreht sich und versinkt in der Treppe
        const q = clamp((this.t - W.sinkT) / 0.32, 0, 1), st = W.near && W.near.kind === 'stairs' ? W.near : null;
        if (st) { x += (st.x / PX - cx - x) * q; y += (st.y / PX - cy + 6 - y) * q; }
        const fl2 = Math.floor(this.t * 14) % 2 === 1;
        this.blit(spr, x, y, fl2 ? !flip : flip, { sx: 1 - q * 0.6, sy: 1 - q, alpha: 1 - q * 0.8 });
        if (A.FX && Math.random() < 0.8) A.FX.part({ kind: 'spark', add: true, x: (x + cx) * PX + (Math.random() - 0.5) * 20, y: (y + cy) * PX - Math.random() * 20, vx: 0, vy: -60, life: 0.3, color: Math.random() < 0.5 ? '#b55088' : '#f6757a', drag: 1 });
        return;
      }
      const aim = Math.atan2(h.fy, h.fx);
      const cls = run.cls, melee = h.melee, staff = cls === 'weber' || cls === 'rufer';
      // Ausfallschritt und Stauchen beim Schlag, Zusammenzucken beim Treffer; Riesenwuchs (Wundertrank) macht gross
      let sx = 1, sy = 1;
      const gT = h.giantUntil - W.t; let gk = gT > 0 ? 1 + 0.35 * clamp(Math.min(8 - gT, gT) / 0.3, 0, 1) : 1;
      if (gk > 1 && gT < 1.5 && Math.floor(this.t * 12) % 2) gk = 1 + (gk - 1) * 0.5;   // läuft ab: flackert
      sx = sy = gk;
      if (h.swing > 0 && melee) { const p = 1 - h.swing / 0.2; const lunge = Math.sin(Math.min(1, p * 1.6) * Math.PI) * 3; x += h.fx * lunge; y += h.fy * lunge * 0.5; sx = 1 + 0.12 * Math.sin(p * Math.PI); sy = 1 - 0.1 * Math.sin(p * Math.PI); }
      if (h.flash > 0) { sx *= 1.15; sy *= 0.85; }
      this.tip = null;
      const drawWeapon = (ghost) => {
        const wpn = A.Art.sprite(cls === 'schuetze' ? 'w_bow' : cls === 'weber' ? 'w_staff' : cls === 'rufer' ? 'w_skullstaff' : cls === 'brau' ? 'flask' : 'w_sword', 0, cls === 'brau' ? { C: '#feae34', H: '#fee761' } : null, cls === 'brau' ? 'held' : '');
        const hx = x + (flip ? -4 : 4) * gk, hy = y - 7 * gk + bob;
        b.save(); b.translate(Math.round(hx), Math.round(hy)); if (gk > 1) b.scale(gk, gk);
        if (cls === 'schuetze') { // Bogen: beim Schuss kurzer Rückstoss
          const rec = h.swing > 0 ? Math.sin(h.swing / 0.2 * Math.PI) * 2.5 : 0;
          b.rotate(aim); b.drawImage(wpn.img, -2 - Math.round(rec), -Math.round(wpn.h / 2));
        }
        else if (cls === 'brau') { // Flasche in der Hand; nach dem Wurf kurz leer, dann holt er die nächste heraus
          const since = W.t - (h.thrownT == null ? -9 : h.thrownT);
          if (since > 0.22) { const k = clamp((since - 0.22) / 0.12, 0, 1); b.rotate((flip ? -1 : 1) * (0.3 + Math.sin(this.t * 3) * 0.08)); b.globalAlpha = k; b.drawImage(wpn.img, -Math.round(wpn.w / 2), -wpn.h + 2 + Math.round((1 - k) * 3)); b.globalAlpha = 1; }
        }
        else if (staff) { // Stab: beim Zaubern nach vorn stossen, Spitze glüht (Rufer: Schädel mit lila Augen)
          const cast = h.swing > 0 ? Math.sin(Math.min(1, h.swing / 0.2) * Math.PI) : 0;
          const rot = (flip ? -1 : 1) * (0.15 + cast * 0.55) + Math.sin(this.t * 2.5) * 0.03;
          b.rotate(rot); b.drawImage(wpn.img, -Math.round(wpn.w / 2), -wpn.h + 4);
          const L = (wpn.h - 5) * gk, tx = hx + Math.sin(rot) * L, ty = hy - Math.cos(rot) * L, gl = this.g, col = cls === 'rufer' ? '#e0a4ff' : '#7fd8ff';
          const pulse = 0.5 + Math.sin(this.t * 5) * 0.2 + cast * 0.5, rr = 1.5 + cast * 2.5;
          gl.globalAlpha = Math.min(1, pulse); gl.fillStyle = col; gl.beginPath(); gl.arc(Math.round(tx), Math.round(ty), rr + 1, 0, TAU); gl.fill();
          gl.fillStyle = '#ffffff'; gl.fillRect(Math.round(tx) - 1, Math.round(ty) - 1, 2, 2); gl.globalAlpha = 1;
          this.tip = { x: (tx + cx) * PX, y: (ty + cy) * PX, a: 0.35 + cast * 0.6, col };
          if (A.FX && Math.random() < 0.15 + cast) A.FX.part({ kind: 'px', add: true, x: (tx + cx) * PX + (Math.random() - 0.5) * 6, y: (ty + cy) * PX + 6, vx: (Math.random() - 0.5) * 20, vy: -20 - Math.random() * 30, life: 0.4, color: Math.random() < 0.5 ? col : '#ffffff' });
        }
        else {
          // Schwert mit Gewicht: holt aus, schlägt durch, schwingt nach und pendelt beim Laufen hinterher
          const dt = this.dt || 0.016;
          const wrap = (a, ref) => a + Math.round((ref - a) / TAU) * TAU;
          if (h._wa == null) { h._wa = flip ? Math.PI - 0.9 : 0.9; h._wv = 0; h._wh = []; }
          const spinP = h.spinT != null ? (W.t - h.spinT) / 0.4 : 2;
          let ang, smear = null;
          if (spinP >= 0 && spinP < 1) { // Wirbelsturm: Klinge einmal ganz herum
            if (!h._sp) { h._sp = true; h._s0 = h._wa; }
            const e = 1 - Math.pow(1 - spinP, 2); ang = h._s0 + e * TAU * 1.2 * (flip ? -1 : 1); h._wv = (flip ? -1 : 1) * 20; smear = [ang - (flip ? -1 : 1) * 2.4, ang];
          } else if (h.swing > 0) {
            h._sp = false;
            if (!h._sw) { h._sw = true; h._ws = h._wa; h._a0 = wrap(aim - 2.3, h._wa); }
            const p = Math.max(0, 1 - h.swing / 0.2);
            if (p < 0.2) { const q = p / 0.2; ang = h._ws + (h._a0 - h._ws) * (1 - (1 - q) * (1 - q)); }
            else { const q = (p - 0.2) / 0.8; ang = h._a0 + (1 - Math.pow(1 - q, 3)) * 3.9; if (q < 0.95) smear = [Math.max(h._a0, ang - 2.4), ang, 1 - q]; }
            h._wv = 22;
          } else {
            h._sw = false; h._sp = false;
            const sway = h.moving ? Math.sin(this.t * 15.7) * 0.14 : Math.sin(this.t * 2.5) * 0.04;
            const rest = wrap((flip ? Math.PI - 0.9 : 0.9) + sway, h._wa);
            h._wv += ((rest - h._wa) * 130 - h._wv * 12) * dt; ang = h._wa + h._wv * dt;
          }
          h._wa = ang;
          // Schwung-Fläche: heller Halbmond zwischen Ausholen und Klinge
          if (smear) {
            const [a0, a1] = smear[0] < smear[1] ? smear : [smear[1], smear[0]], k = smear[2] != null ? smear[2] : 0.8;
            b.globalAlpha = 0.55 * k; b.fillStyle = '#ffffff'; b.beginPath(); b.arc(0, 0, wpn.w + 1, a0, a1); b.arc(0, 0, Math.max(3, wpn.w - 5), a1, a0, true); b.closePath(); b.fill();
            b.globalAlpha = 0.9 * k; b.strokeStyle = '#fee761'; b.lineWidth = 1; b.beginPath(); b.arc(0, 0, wpn.w + 1, a0 + (a1 - a0) * 0.4, a1); b.stroke();
          }
          // Nachbilder der Klinge bei schneller Bewegung
          const hist = h._wh;
          for (let i = hist.length - 1, n = 0; i >= 0 && n < 3; i--, n++) {
            if (Math.abs(hist[i] - ang) < 0.18) continue;
            b.save(); b.globalAlpha = 0.4 / (n + 1); b.rotate(hist[i]); b.drawImage(A.Art.white(wpn, false), -2, -Math.round(wpn.h / 2)); b.restore();
          }
          hist.push(ang); if (hist.length > 3) hist.shift();
          b.globalAlpha = 1; b.rotate(ang); b.drawImage(wpn.img, -2, -Math.round(wpn.h / 2));
        }
        b.restore();
      };
      const behind = cls !== 'schuetze' && cls !== 'brau' && h.swing <= 0 && h.fy < -0.3;
      if (behind) drawWeapon();
      if (blink) this.blit(spr, x, y + bob, flip, { alpha: 0.45, sx, sy });
      else this.blit(spr, x, y + bob, flip, { white: h.flash > 0, sx, sy });
      if (!behind) drawWeapon();
      // Schild-Blase
      if (h.shield > 0) { b.globalAlpha = 0.35 + Math.sin(this.t * 6) * 0.1; b.strokeStyle = '#2ce8f5'; b.lineWidth = 1; b.beginPath(); b.ellipse(Math.round(x), Math.round(y - 9 * gk), 11 * gk, 12 * gk, 0, 0, TAU); b.stroke(); b.globalAlpha = 1; }
      // Rausch (Braumeister): Dampf und Funken an den Füssen; Glückssträhne: Kleeblatt-Funkeln über dem Kopf
      if (A.FX && !A.FX.low && h.brewUntil > W.t && Math.random() < 0.35) A.FX.part({ kind: 'px', add: true, x: h.x + (Math.random() - 0.5) * 18, y: h.y + 10, vx: -h.fx * 30, vy: -10, vz: 20, life: 0.35, color: Math.random() < 0.5 ? '#feae34' : '#fee761', drag: 3 });
      if (h.luckyN > 0) { const g = this.g; for (let i = 0; i < Math.min(5, h.luckyN); i++) { const a = this.t * 3 + i / 5 * TAU; g.globalAlpha = 0.8; g.fillStyle = i % 2 ? '#63c74d' : '#fee761'; g.fillRect(Math.round(x + Math.cos(a) * 8), Math.round(y - 24 * gk + Math.sin(a) * 2), 1, 1); } g.globalAlpha = 1; }
      if (h.stun > 0) this.stars(x, y - 20);
    }
    // Umkippen beim Sterben: Figur dreht sich um die Füsse und liegt dann am Boden
    drawFallen(spr, x, y, flip, e, sc) {
      const b = this.b; if (e.deathT == null) e.deathT = this.t;
      const p = clamp((this.t - e.deathT) / 0.35, 0, 1), ang = (1 - Math.pow(1 - p, 2)) * Math.PI / 2 * (flip ? 1 : -1);
      const s = sc || 1, w = Math.round(spr.w * s), hh = Math.round(spr.h * s);
      const img = p < 0.25 && e.side !== 'hero' ? A.Art.white(spr, flip) : flip ? A.Art.flipped(spr) : spr.img;
      b.save(); b.globalAlpha = e.alpha != null ? Math.max(0, Math.min(1, e.alpha)) : 0.6;
      if (spr.w > spr.h * 1.2) { b.translate(Math.round(x), Math.round(y - hh / 2)); b.scale(1, Math.cos(p * Math.PI) || 0.01); b.drawImage(img, -Math.round(w / 2), -Math.round(hh / 2), w, hh); }
      else { b.translate(Math.round(x), Math.round(y)); b.rotate(ang); b.drawImage(img, -Math.round(w / 2), -hh, w, hh); }
      b.restore(); b.globalAlpha = 1;
    }
    stars(x, y) { const b = this.b; b.fillStyle = '#fee761'; for (let i = 0; i < 3; i++) { const a = this.t * 6 + i * 2.1; b.fillRect(Math.round(x + Math.cos(a) * 6), Math.round(y + Math.sin(a) * 2), 1, 1); } }

    // Warnzone unter allen Figuren (Boden-Ebene)
    drawWarn(m, cx, cy) {
      const b = this.b, x = m.x / PX - cx, y = m.y / PX - cy + (m.boss ? 12 : m.elite ? 8 : 7);
      // Warnzone: roter Fächer am Boden, der sich während des Ausholens füllt
      if (m.alive && m.state === 'windup' && m.kind === 'melee') {
        const p = clamp(1 - m.st / (m.stMax || 0.42), 0, 1), R = (m.r + 12 + 22) / PX * 1.05, a = Math.atan2(m.fy, m.fx);
        b.save(); b.translate(Math.round(x), Math.round(y - 2)); b.scale(1, 0.6);
        b.globalAlpha = 0.22; b.fillStyle = '#e43b44'; b.beginPath(); b.moveTo(0, 0); b.arc(0, 0, R, a - 0.75, a + 0.75); b.closePath(); b.fill();
        b.globalAlpha = 0.45; b.beginPath(); b.moveTo(0, 0); b.arc(0, 0, R * p, a - 0.75, a + 0.75); b.closePath(); b.fill();
        b.globalAlpha = 0.8; b.strokeStyle = '#ff0044'; b.lineWidth = 1; b.beginPath(); b.arc(0, 0, R, a - 0.75, a + 0.75); b.stroke();
        b.restore(); b.globalAlpha = 1;
      }
    }
    drawMon(m, W, cx, cy) {
      const b = this.b, x = m.x / PX - cx; let y = m.y / PX - cy + (m.boss ? 12 : m.elite ? 8 : 7);
      const sc = m.boss ? 2 : 1;
      if (!m.alive) {
        const spr = A.Art.monSprite(m.mid, 0);
        if (m.shape === 'blob') { const q = clamp(m.alpha, 0, 1); this.blit(spr, x, y, m.fx < 0, { alpha: q, sx: sc * (1 + (1 - q) * 0.9), sy: sc * Math.max(0.15, q), white: q > 0.85 }); }
        else this.drawFallen(spr, x, y, m.fx < 0, m, sc);
        return;
      }
      const nf = A.Art.monFrames(m.mid), fly = m.fly && m.shape !== 'ghost', ghost = m.shape === 'ghost';
      const moving = m.state !== 'windup' && !(m.spawn > 0);
      const frame = nf > 1 ? Math.floor(this.t * (fly ? 10 : 6) + (m.x % 7)) % nf : 0;
      const spr = A.Art.monSprite(m.mid, moving ? frame : 0); const flip = m.fx < 0;
      let sx = sc, sy = sc, alpha = 1, lift = 0;
      if (m.shape === 'blob') { const q = Math.sin(this.t * 7 + m.x * 0.1); sx = sc * (1 + q * 0.07); sy = sc * (1 - q * 0.09); }
      if (fly) lift = 7 + Math.sin(this.t * 5 + m.x) * 2;
      if (m.hop) lift += m.hop / PX;   // Schleimkönig im Sprung
      if (ghost) { lift = 3 + Math.sin(this.t * 3 + m.x) * 2; alpha = 0.85; }
      if (m.spawn > 0) { const p = clamp(1 - m.spawn / 0.5, 0, 1); alpha = p; lift -= (1 - p) * 6; }
      let ox = 0, oy = 0;
      if (m.state === 'windup') { ox = Math.sin(this.t * 60) * 1 - m.fx * 2; oy = -m.fy * 2; }
      if (m.swing > 0 && m.kind === 'melee') { const l = Math.sin((1 - m.swing / 0.2) * Math.PI) * 5; ox += m.fx * l; oy += m.fy * l * 0.5; }
      if (m.flash > 0) { sx *= 1.15; sy *= 0.85; }
      this.shadow(x, y, (m.boss ? 13 : m.elite ? 8 : 6) * (fly ? 0.7 : 1));
      // Aura am Boden für Elite-Gegner und Boss: drehender Runenkreis, aufsteigende Funken
      if ((m.elite || m.boss) && !(m.spawn > 0)) {
        const g = this.g, ac = m.boss ? '#e43b44' : (ELITE_COL[m.eliteKind] || '#fee761'), R = m.boss ? 20 : 12, rot = this.t * (m.boss ? 0.9 : 1.6), pu = 0.55 + Math.sin(this.t * 3) * 0.15;
        g.globalAlpha = pu * 0.6; g.strokeStyle = ac; g.lineWidth = 1; g.beginPath(); g.ellipse(Math.round(x), Math.round(y), R, R * 0.42, 0, 0, TAU); g.stroke();
        g.globalAlpha = pu; g.fillStyle = ac;
        const n = m.boss ? 10 : 6; for (let i = 0; i < n; i++) { const a = rot + i / n * TAU; g.fillRect(Math.round(x + Math.cos(a) * R) - 1, Math.round(y + Math.sin(a) * R * 0.42), 2, 1); }
        g.globalAlpha = 1;
        if (A.FX && !A.FX.low && Math.random() < (this.dt || 0.016) * (m.boss ? 10 : 5)) { const a = Math.random() * TAU; A.FX.part({ add: true, x: m.x + Math.cos(a) * R * PX * 0.9, y: m.y + 14 + Math.sin(a) * R * PX * 0.38, vx: 0, vy: -18 - Math.random() * 12, life: 0.8, color: Math.random() < 0.3 ? '#ffffff' : ac, drag: 0.5, size: Math.random() < 0.4 ? 2 : 1 }); }
      }
      const dx = Math.round(x + ox), dy = Math.round(y - lift + oy);
      if (m.elite && !(m.spawn > 0)) this.outlineGlow(spr, dx, dy, flip, ELITE_COL[m.eliteKind] || '#fee761', sc);
      if (m.boss) this.outlineGlow(spr, dx, dy, flip, Math.sin(this.t * 4) > 0 ? '#e43b44' : '#a22633', sc);
      const frozen = m.frozenUntil > W.t;
      if (frozen) this.outlineGlow(spr, dx, dy, flip, '#9be8ff', sc);
      this.blit(spr, dx, dy, flip, { sx, sy, alpha, white: m.flash > 0 });
      if (m.state === 'windup' && Math.floor(this.t * 16) % 2 === 0) this.blit(spr, dx, dy, flip, { sx, sy, alpha: 0.45, white: true });
      if (frozen) {   // eingefroren (Eis-Ausrüstung): blaues Eis über der Figur, ein paar helle Punkte
        const k = flip ? 'iceF' : 'ice'; if (!spr[k]) spr[k] = A.Art.silhouette(flip ? A.Art.flipped(spr) : spr.img, '#9be8ff');
        const w2 = Math.round(spr.w * sx), h2 = Math.round(spr.h * sy), x2 = Math.round(dx - w2 / 2), y2 = Math.round(dy - h2);
        b.globalAlpha = 0.6; b.drawImage(spr[k], x2, y2, w2, h2); b.globalAlpha = 1;
        this.g.fillStyle = '#ffffff'; for (let i = 0; i < 4; i++) if ((Math.floor(this.t * 5) + i) % 2) this.g.fillRect(x2 + Math.floor((i * 37 + Math.abs(m.x)) % w2), y2 + Math.floor((i * 23 + 3) % h2), 1, 1);
      } else if (m.slowUntil > W.t && A.FX && !A.FX.low && Math.random() < (this.dt || 0.016) * 5) A.FX.part({ add: true, x: m.x + (Math.random() - 0.5) * m.r * 2, y: m.y - 20 - Math.random() * 14, vx: 0, vy: 0, z: 18, vz: -6, g: 0, life: 0.8, color: Math.random() < 0.5 ? '#9be8ff' : '#ffffff', drag: 0.5 });
      // Fernkämpfer laden sichtbar auf: Kugel wächst vor dem Körper, Funken werden angesaugt
      if (m.kind !== 'melee' && m.cd < 0.45 && !(m.stun > 0) && !(m.spawn > 0)) {
        const p = clamp(1 - m.cd / 0.45, 0, 1), col = m.kind === 'magic' ? '#c77dff' : '#ffb08a', g = this.g;
        const ox2 = Math.round(dx + m.fx * 7), oy2 = Math.round(dy - spr.h * sy * 0.5 + m.fy * 4);
        g.globalAlpha = 0.5 + p * 0.5; g.fillStyle = col; g.beginPath(); g.arc(ox2, oy2, 1 + p * 3, 0, TAU); g.fill();
        g.fillStyle = '#ffffff'; g.fillRect(ox2, oy2, 1, 1);
        for (let i = 0; i < 4; i++) { const a = this.t * 7 + i * 1.57, rr = (1 - ((this.t * 3 + i * 0.25) % 1)) * 9; g.fillStyle = col; g.fillRect(Math.round(ox2 + Math.cos(a) * rr), Math.round(oy2 + Math.sin(a) * rr), 1, 1); }
        g.globalAlpha = 1;
      }
      // eigene kleine Effekte je Gegnerart (Schleimtropfen, Sporen, Glut, Dampf, Schatten-Fetzen, Funkeln ...)
      if (A.FX && !(m.spawn > 0) && !A.FX.low) {
        const F = A.FX, dtt = this.dt || 0.016, R = (n) => Math.random() < n * dtt, mv = m.state !== 'windup';
        const wx = m.x + (Math.random() - 0.5) * m.r, top = m.y - spr.h * sy * PX * 0.6 - lift * PX, mid = m.y - spr.h * sy * PX * 0.3 - lift * PX;
        switch (m.mid) {
          case 'schleimer': case 'schleimkoenig':
            if (R(m.boss ? 10 : 4)) F.part({ add: true, x: wx, y: mid, vx: 0, vy: -12, life: 0.7, color: '#c8f5a0', drag: 1, size: 2 });
            if (mv && R(m.boss ? 8 : 3)) F.decal(m.x + (Math.random() - 0.5) * m.r, m.y + 10, 'drop', '#3e8948', 2); break;
          case 'ratte': case 'tunnelwurm':
            if (mv && R(m.mid === 'ratte' ? 6 : 10)) F.part({ x: m.x - m.fx * 10, y: m.y + 8, vx: -m.fx * 30 + (Math.random() - 0.5) * 20, vy: 0, z: 2, vz: 50, g: 300, life: 0.6, color: m.mid === 'ratte' ? '#8b9bb4' : '#733e39', size: 2 }); break;
          case 'pilzkrieger':
            if (R(6)) F.part({ add: true, x: wx, y: top, vx: (Math.random() - 0.5) * 12, vy: -8, life: 1.2, color: Math.random() < 0.5 ? '#b55088' : '#ead4aa', drag: 0.5, size: 2 }); break;
          case 'knochen':
            if (R(1.6)) F.part({ x: wx, y: mid, vx: 0, vy: 0, z: 6, vz: 0, g: 200, life: 0.6, color: '#ead4aa', size: 2 }); break;
          case 'glutmotte':
            if (R(18)) F.part({ add: true, x: wx, y: mid, vx: (Math.random() - 0.5) * 16, vy: -14 - Math.random() * 14, life: 0.6, color: Math.random() < 0.5 ? '#feae34' : '#f77622', drag: 0.8, size: 2 }); break;
          case 'spinne':
            if (R(2)) F.part({ x: wx, y: mid, vx: 0, vy: 0, z: 4, vz: 0, g: 120, life: 0.7, color: '#63c74d', size: 2 }); break;
          case 'rostgolem': case 'rostkoenig':
            if (R(m.boss ? 6 : 3)) F.part({ kind: 'smoke', x: wx, y: top, vx: (Math.random() - 0.5) * 8, vy: -22, life: 0.8, size: 3, grow: 7, color: '#c0cbdc', drag: 1 });
            if (R(m.boss ? 4 : 1.6)) F.burst(wx, mid, 2, { color: ['#feae34', '#ffffff'], smin: 30, smax: 80, life: 0.2, add: true, kind: 'spark', drag: 5 }); break;
          case 'schattenfaenger':
            if (R(16)) F.part({ kind: 'smoke', x: wx - m.fx * 6, y: mid, vx: -m.fx * 14, vy: -6, life: 0.6, size: 3, grow: 5, color: Math.random() < 0.5 ? '#262b44' : '#68386c', drag: 1.5 }); break;
          case 'spiegelgeist':
            if (R(10)) F.part({ add: true, x: wx + (Math.random() - 0.5) * 10, y: mid + (Math.random() - 0.5) * 16, vx: 0, vy: -4, life: 0.35, color: Math.random() < 0.5 ? '#ffffff' : '#2ce8f5' }); break;
          case 'kobolddieb':
            if (R(2.4)) F.part({ add: true, x: wx, y: mid, vx: 0, vy: -10, life: 0.4, color: '#fee761', size: 2 }); break;
          case 'fledermaus':
            if (R(3)) F.part({ x: wx, y: mid, vx: 0, vy: 0, z: 8, vz: 0, g: 80, life: 0.8, color: '#68386c', size: 2 }); break;
          case 'qualle':
            if (R(8)) F.part({ add: true, kind: 'spark', x: wx, y: mid, vx: (Math.random() - 0.5) * 60, vy: (Math.random() - 0.5) * 60, life: 0.15, color: Math.random() < 0.5 ? '#ffffff' : '#2ce8f5', drag: 4 }); break;
          case 'glutwicht':
            if (R(12)) F.part({ add: true, x: wx, y: top, vx: (Math.random() - 0.5) * 14, vy: -20 - Math.random() * 14, life: 0.5, color: Math.random() < 0.5 ? '#feae34' : '#f77622', drag: 0.8 }); break;
          case 'leerenauge': case 'waechter':
            if (R(m.boss ? 14 : 6)) F.part({ kind: 'smoke', x: wx, y: mid + 10, vx: 0, vy: -8, life: 0.7, size: 2, grow: 5, color: Math.random() < 0.5 ? '#262b44' : '#68386c', drag: 1 }); break;
          case 'mumie': case 'sandpharao':
            if (mv && R(m.boss ? 6 : 2)) F.part({ x: wx, y: m.y + 6, vx: (Math.random() - 0.5) * 20, vy: 0, z: 4, vz: 30, g: 200, life: 0.6, color: '#ead4aa', size: 1 }); break;
          case 'ranke': case 'dornenmutter':
            if (R(m.boss ? 5 : 1.5)) F.part({ x: wx, y: top, vx: (Math.random() - 0.5) * 10, vy: 0, z: 10, vz: 0, g: 60, life: 1.2, color: Math.random() < 0.5 ? '#63c74d' : '#3e8948', size: 2 }); break;
          case 'kraken':
            if (R(6)) F.part({ add: true, x: wx + (Math.random() - 0.5) * 30, y: m.y + 10, vx: 0, vy: -25, life: 0.9, color: '#7fd8ff', drag: 0.3, size: 2 }); break;
        }
      }
      if (m.boss && A.FX && Math.random() < (this.dt || 0.016) * (m.hp < m.maxHp * 0.5 ? 1.6 : 0.7)) { const W2 = A.World.W, h2 = W2 && W2.hero; if (h2) A.FX.rocks(h2.x + (Math.random() - 0.5) * 260, h2.y + (Math.random() - 0.5) * 160, 1 + Math.floor(Math.random() * 2), 12); }
      if (m.boss) { const cr = A.Art.sprite('crown'); b.drawImage(cr.img, Math.round(dx - cr.w / 2 + (flip ? -2 : 2)), Math.round(dy - spr.h * sy - cr.h + 5)); }
      const top = dy - spr.h * sy - 2;
      if (m.state === 'windup') { const al = A.Art.sprite('u_alert'); b.drawImage(al.img, Math.round(dx - al.w / 2), Math.round(top - al.h - 2 + Math.sin(this.t * 20))); }
      if (m.stun > 0 && !frozen) this.stars(dx, top);
      // Lebensbalken
      if (!m.boss && (m.hp < m.maxHp || m.elite) && !(m.spawn > 0)) {
        const w = m.elite ? 18 : 14, bx = Math.round(dx - w / 2), by = Math.round(top - 3);
        b.fillStyle = '#181425'; b.fillRect(bx - 1, by - 1, w + 2, 4);
        b.fillStyle = '#3e2731'; b.fillRect(bx, by, w, 2);
        // heller Rest, der langsam nachläuft, zeigt den gerade verlorenen Teil
        const fr = m.hp / m.maxHp; if (m._hpT == null || m._hpT < fr) m._hpT = fr; else m._hpT = Math.max(fr, m._hpT - (this.dt || 0.016) * 0.8);
        b.fillStyle = '#ffffff'; b.fillRect(bx, by, Math.round(w * m._hpT), 2);
        b.fillStyle = m.elite ? '#feae34' : '#e43b44'; b.fillRect(bx, by, Math.max(1, Math.round(w * fr)), 2);
        if (m.shield > 0) { b.fillStyle = '#2ce8f5'; b.fillRect(bx, by + 2, Math.round(w * Math.min(1, m.shield / m.maxHp)), 1); }
      }
      if (m.effects && m.effects.length && Math.floor(this.t * 4) % 2) { b.fillStyle = m.effects[0].kind === 'poison' ? '#63c74d' : '#f77622'; b.fillRect(Math.round(dx - 1), Math.round(top - 8), 2, 2); }
    }

    drawPick(p, cx, cy) {
      const b = this.b, x = p.x / PX - cx, z = (p.z || 0) / PX, y = p.y / PX - cy;
      if (p.kind === 'gold') {
        const f = [0, 1, 2, 1][Math.floor(this.t * 10 + p.x) % 4]; const s = A.Art.sprite('coin', f);
        this.shadow(x, y + 2, 2.5); b.drawImage(s.img, Math.round(x - s.w / 2), Math.round(y - s.h + 2 - z));
      } else if (p.kind === 'potion') {
        const s = A.Art.sprite('potion'); const bob = Math.round(Math.sin(this.t * 4 + p.x) * 1.5);
        this.shadow(x, y + 2, 3); b.drawImage(s.img, Math.round(x - s.w / 2), Math.round(y - s.h - 2 + bob - z));
      } else {
        const it = p.it, col = A.RARITY[it.rarity].color, s = A.Art.sprite(A.Art.itemIcon(it.base));
        const bob = Math.round(Math.sin(this.t * 3 + p.x) * 2);
        const big = it.rarity !== 'common' && it.rarity !== 'good';
        // Lichtsäule
        if (big) { const g = this.g; const gr = g.createLinearGradient(0, y - 48, 0, y); const [r, gg, bb] = rgb(col); gr.addColorStop(0, `rgba(${r},${gg},${bb},0)`); gr.addColorStop(1, `rgba(${r},${gg},${bb},${0.35 + Math.sin(this.t * 5) * 0.1})`); g.fillStyle = gr; g.fillRect(Math.round(x - 3), Math.round(y - 48), 6, 48); g.fillRect(Math.round(x - 1), Math.round(y - 60), 2, 60); }
        b.fillStyle = col; b.globalAlpha = 0.5; b.beginPath(); b.ellipse(Math.round(x), Math.round(y + 1), 7, 2.5, 0, 0, TAU); b.fill(); b.globalAlpha = 1;
        this.outlineGlow(s, x, y - 3 + bob - z, false, col);
        b.drawImage(s.img, Math.round(x - s.w / 2), Math.round(y - s.h - 3 + bob - z));
        if (Math.floor(this.t * 3 + p.x) % 5 === 0) { this.g.fillStyle = '#ffffff'; const k = Math.floor(this.t * 12) % 3; this.g.fillRect(Math.round(x - 4 + k * 3), Math.round(y - s.h + bob - z + k * 2), 1, 1); }
      }
    }

    drawProp(p, W, cx, cy) {
      const b = this.b, x = p.x / PX - cx, y = p.y / PX - cy, near = W.near === p, t = this.t;
      const S = (n, f) => A.Art.sprite(n, f || 0);
      let spr = null, top = y - 16;
      switch (p.kind) {
        case 'chest': {
          // Truhe: wackelt ab und zu, springt beim Öffnen auf und sprüht Gold und Licht
          if (p._seen == null) { p._seen = 1; p._openT = p.used ? -99 : null; }
          if (p.used && p._openT == null) { p._openT = t; if (A.FX) { A.FX.flash(p.x, p.y - 10, 110, '#feae34', 0.5); A.FX.burst(p.x, p.y - 12, 26, { color: ['#fee761', '#feae34', '#ffffff'], smin: 40, smax: 170, life: 0.7, add: true, kind: 'spark', drag: 3 }); A.FX.burst(p.x, p.y - 10, 10, { color: ['#fee761', '#feae34'], smin: 30, smax: 90, z: 10, vz: 220, g: 520, life: 1.1, size: 2 }); A.FX.part({ kind: 'ring', x: p.x, y: p.y - 6, life: 0.4, size: 50, color: '#fee761', add: true }); A.FX.shake(0.15); } }
          spr = S('chest', p.used ? 1 : 0); let sx = 1, sy = 1, wob = 0;
          const oa = p._openT != null ? t - p._openT : 9;
          if (oa < 0.5) { const q = oa / 0.5; sx = 1 + Math.sin(q * Math.PI * 2) * 0.22 * (1 - q); sy = 1 - Math.sin(q * Math.PI * 2) * 0.18 * (1 - q); }
          else if (!p.used) { const c = (t + p.x * 0.01) % 3.2; if (c < 0.4) wob = Math.round(Math.sin(c * 40) * (1 - c / 0.4)); if (near) wob = Math.round(Math.sin(t * 18)); }
          this.shadow(x, y + 4, 8); if (near && !p.used) this.outlineGlow(spr, x + wob, y + 5, false, '#fee761');
          const w = Math.round(spr.w * sx), hh = Math.round(spr.h * sy);
          b.drawImage(spr.img, Math.round(x + wob - w / 2), Math.round(y + 5 - hh), w, hh); top = y + 5 - hh;
          if (p.used && oa < 2.5) { const gl = this.g; gl.globalAlpha = Math.max(0, 0.6 * (1 - oa / 2.5)); gl.fillStyle = '#fee761'; gl.fillRect(Math.round(x - 5), Math.round(y - 30 + oa * 4), 10, Math.round(26 - oa * 4)); gl.globalAlpha = 1; } if (!p.used && Math.floor(t * 2 + p.x) % 4 === 0) { this.g.fillStyle = '#fff'; this.g.fillRect(Math.round(x + 3), Math.round(y - 5), 1, 1); } break; }
        case 'fire': {
          const lg = S('logs'); b.drawImage(lg.img, Math.round(x - lg.w / 2), Math.round(y + 4 - lg.h));
          const f = S('flame', Math.floor(t * 10) % 3), sc = p.used ? 1 : 2; b.drawImage(f.img, Math.round(x - f.w * sc / 2), Math.round(y + 1 - f.h * sc), f.w * sc, f.h * sc);
          if (Math.random() < 0.25 && A.FX) A.FX.part({ kind: 'px', add: true, x: p.x + (Math.random() - 0.5) * 16, y: p.y - 8, vx: (Math.random() - 0.5) * 20, vy: -40 - Math.random() * 40, life: 0.8, color: Math.random() < 0.5 ? '#feae34' : '#f77622', drag: 0.5 });
          top = y - 22; break;
        }
        case 'merchant': spr = S('merchant'); this.shadow(x, y + 4, 7); if (near) this.outlineGlow(spr, x, y + 4, false, '#fee761'); b.drawImage(spr.img, Math.round(x - spr.w / 2), Math.round(y + 4 - spr.h)); top = y + 4 - spr.h; break;
        case 'shrine': {
          // Schrein der Wahl: Kugel schwebt und leuchtet, bis sie benutzt ist
          spr = S('shrine', p.used ? 0 : Math.floor(t * 2) % 2); this.shadow(x, y + 4, 8);
          if (near && !p.used) this.outlineGlow(spr, x, y + 4, false, '#2ce8f5');
          b.globalAlpha = p.used ? 0.55 : 1; b.drawImage(spr.img, Math.round(x - spr.w / 2), Math.round(y + 4 - spr.h)); b.globalAlpha = 1; top = y + 4 - spr.h;
          if (!p.used && A.FX && Math.random() < 0.25) A.FX.part({ kind: 'px', add: true, x: p.x + (Math.random() - 0.5) * 24, y: p.y - 20, vx: 0, vy: -24 - Math.random() * 20, life: 0.9, color: Math.random() < 0.5 ? '#2ce8f5' : '#ffffff', drag: 0.3 });
          break;
        }
        case 'forge': {
          // Schmiede: Esse mit Glut, Schmied hebt den Hammer und schlägt auf den Amboss, dabei fliegen Funken
          const es = S('esse', Math.floor(t * 8) % 2), ex = x - 17, ey = y + 4;
          this.shadow(ex, ey, 8); b.drawImage(es.img, Math.round(ex - es.w / 2), Math.round(ey - es.h));
          const fl = S('flame', Math.floor(t * 10) % 3); b.drawImage(fl.img, Math.round(ex - fl.w / 2), Math.round(ey - es.h + 1 - fl.h));
          const cyc = (t * 0.85 + p.x * 0.001) % 1, down = cyc > 0.72 && cyc < 0.9, beat = Math.floor(t * 0.85 + p.x * 0.001 + 0.28);
          if (p._beat !== beat) { p._beat = beat; if (A.FX) { A.FX.burst(p.x + 18, p.y - 6, 7, { color: ['#fee761', '#feae34', '#ffffff'], smin: 40, smax: 130, life: 0.35, add: true, kind: 'spark', drag: 3, z: 6, vz: 90, g: 300 }); A.FX.flash(p.x + 18, p.y - 6, 40, '#feae34', 0.15); } const hh = W.hero; if (hh && Math.hypot(hh.x - p.x, hh.y - p.y) < 260 && A.Sound.clink) A.Sound.clink(); }
          const sm = S('smith', down ? 1 : 0); this.shadow(x - 2, y + 5, 7);
          if (near) this.outlineGlow(sm, x - 2, y + 5, false, '#fee761');
          b.drawImage(sm.img, Math.round(x - 2 - sm.w / 2), Math.round(y + 5 - sm.h));
          const an = S('anvil'); this.shadow(x + 11, y + 6, 6); b.drawImage(an.img, Math.round(x + 11 - an.w / 2), Math.round(y + 6 - an.h));
          if (A.FX && Math.random() < 0.2) A.FX.part({ kind: 'px', add: true, x: p.x - 34 + (Math.random() - 0.5) * 14, y: p.y - 20, vx: (Math.random() - 0.5) * 14, vy: -30 - Math.random() * 30, life: 0.8, color: Math.random() < 0.5 ? '#feae34' : '#f77622', drag: 0.5 });
          top = y + 5 - sm.h; break;
        }
        case 'statue': spr = S('statue'); this.shadow(x, y + 4, 8); if (near && !p.used) this.outlineGlow(spr, x, y + 4, false, '#fee761'); b.drawImage(spr.img, Math.round(x - spr.w / 2), Math.round(y + 4 - spr.h)); top = y + 4 - spr.h; break;
        case 'stairs': {
          const w = 30, hh = 22, x0 = Math.round(x - w / 2), y0 = Math.round(y - hh / 2);
          b.fillStyle = this.theme.capHi; b.fillRect(x0 - 2, y0 - 2, w + 4, hh + 4);
          b.fillStyle = '#0d0b14'; b.fillRect(x0, y0, w, hh);
          for (let i = 0; i < 5; i++) { const c = [this.theme.brickHi, this.theme.brick[0], this.theme.brickLo, '#1a1626', '#120f1a'][i]; b.fillStyle = c; b.fillRect(x0 + 2 + i * 2, y0 + 2 + i * 4, w - 4 - i * 4, 3); }
          b.fillStyle = '#181425'; b.fillRect(x0 - 2, y0 - 2, w + 4, 1); b.fillRect(x0 - 2, y0 + hh + 1, w + 4, 1);
          // Sog in der Tiefe: drehende Ringe und eine Rune um die Treppe
          { const gl = this.g, vx = Math.round(x), vy = y0 + hh - 5;
            for (let i = 0; i < 3; i++) { const k = ((t * 0.6 + i / 3) % 1); gl.globalAlpha = 0.55 * (1 - k); gl.strokeStyle = i % 2 ? '#f6757a' : '#b55088'; gl.lineWidth = 1; gl.beginPath(); gl.ellipse(vx + 0.5, vy + 0.5, 3 + k * 11, 1 + k * 4, 0, 0, TAU); gl.stroke(); }
            gl.globalAlpha = 0.35 + Math.sin(t * 2) * 0.1; gl.strokeStyle = '#b55088'; gl.beginPath(); gl.ellipse(Math.round(x) + 0.5, Math.round(y) + 0.5, w * 0.75, hh * 0.75, 0, 0, TAU); gl.stroke();
            gl.fillStyle = '#f6757a'; for (let i = 0; i < 8; i++) { const a = i / 8 * TAU + t * 0.8; gl.fillRect(Math.round(x + Math.cos(a) * w * 0.75), Math.round(y + Math.sin(a) * hh * 0.75), 1, 1); }
            gl.globalAlpha = 1; }
          if (near) { b.strokeStyle = '#fee761'; b.lineWidth = 1; b.strokeRect(x0 - 3.5, y0 - 3.5, w + 7, hh + 7); }
          if (Math.random() < 0.2 && A.FX) A.FX.part({ kind: 'px', add: true, x: p.x + (Math.random() - 0.5) * 40, y: p.y + 10, vx: 0, vy: -30 - Math.random() * 30, life: 1, color: '#b55088', drag: 0.3 });
          top = y0 - 4; break;
        }
        case 'sign': spr = S('sign'); this.shadow(x, y + 4, 6); b.drawImage(spr.img, Math.round(x - spr.w / 2), Math.round(y + 4 - spr.h)); this.signAt = { sx: x * this.s, sy: (y + 4 - spr.h + 4) * this.s, text: p.text }; break;
      }
      if (near && !p.used || (near && (p.kind === 'merchant' || p.kind === 'forge' || p.kind === 'stairs'))) { const a = S('u_arrowdown'); b.drawImage(a.img, Math.round(x - a.w / 2), Math.round(top - a.h - 3 + Math.sin(t * 6) * 1.5)); }
    }

    drawShot(s, cx, cy) {
      if (s.opts.lob) { this.drawFlask(s, cx, cy); return; }
      const b = this.b, g = this.g, x = s.x / PX - cx, y = s.y / PX - cy - 5;
      if (s.side === 'hero' && s.opts.kind !== 'magic') {
        const a = A.Art.sprite('arrow'); b.save(); b.translate(Math.round(x), Math.round(y)); b.rotate(Math.atan2(s.vy, s.vx)); b.drawImage(a.img, -a.w + 2, -Math.round(a.h / 2)); b.restore();
        return;
      }
      const hero = s.side === 'hero';
      const core = hero ? (s.color === '#c77dff' ? '#f6757a' : '#ffffff') : '#fee761';
      const ring = hero ? s.color : (s.opts.kind === 'magic' ? '#b55088' : '#e43b44');
      const r = Math.max(2, Math.round(s.r / PX)) + (Math.sin(this.t * 30) > 0 ? 1 : 0);
      // Schweif: die letzten Positionen als dünner werdende Leuchtspur
      const tr = s.trail || (s.trail = []); tr.push([x + cx, y + cy]); if (tr.length > 8) tr.shift();
      for (let i = 1; i < tr.length; i++) {
        const k = i / tr.length; g.globalAlpha = 0.85 * k; g.strokeStyle = i > tr.length - 3 ? '#ffffff' : ring; g.lineWidth = Math.max(1, Math.round((r + 1) * 2 * k)); g.lineCap = 'round';
        g.beginPath(); g.moveTo(Math.round(tr[i - 1][0] - cx), Math.round(tr[i - 1][1] - cy)); g.lineTo(Math.round(tr[i][0] - cx), Math.round(tr[i][1] - cy)); g.stroke();
      }
      g.lineCap = 'butt'; g.globalAlpha = 1;
      // zwei kleine Funken kreisen um den Kern
      for (let i = 0; i < 2; i++) { const a = this.t * 16 + i * Math.PI + s.x * 0.01; g.fillStyle = i ? '#ffffff' : ring; g.fillRect(Math.round(x + Math.cos(a) * (r + 3)), Math.round(y + Math.sin(a) * (r + 2)), 1, 1); }
      b.fillStyle = '#181425'; b.beginPath(); b.arc(Math.round(x), Math.round(y), r + 1, 0, TAU); b.fill();
      b.fillStyle = ring; b.beginPath(); b.arc(Math.round(x), Math.round(y), r, 0, TAU); b.fill();
      b.fillStyle = core; b.fillRect(Math.round(x) - 1, Math.round(y) - 1, 2, 2);
      g.globalAlpha = 0.5; g.fillStyle = ring; g.beginPath(); g.arc(Math.round(x), Math.round(y), r + 2, 0, TAU); g.fill(); g.globalAlpha = 1;
      if (A.FX && Math.random() < 0.5) A.FX.part({ kind: 'px', add: true, x: s.x, y: s.y - 10, vx: -s.vx * 0.1, vy: -s.vy * 0.1, life: 0.25, color: ring });
    }

    // Flasche des Braumeisters: fliegt im Bogen (Höhe aus der Restzeit), dreht sich, Schatten am Boden
    drawFlask(s, cx, cy) {
      const b = this.b, g = this.g, p = clamp(1 - s.life / s.life0, 0, 1), up = 4 * s.peak * p * (1 - p) / PX;
      const x = s.x / PX - cx, y = s.y / PX - cy, col = s.color || '#feae34';
      b.globalAlpha = 0.35; b.fillStyle = '#08060e'; b.beginPath(); b.ellipse(Math.round(x), Math.round(y + 2), 3, 1.5, 0, 0, TAU); b.fill(); b.globalAlpha = 1;
      const spr = A.Art.sprite('flask', 0, { C: col, H: '#ffffff' }, 'fl' + col);
      b.save(); b.translate(Math.round(x), Math.round(y - 4 - up)); b.rotate(s.spin * (s.life0 - s.life)); b.drawImage(spr.img, -Math.round(spr.w / 2), -Math.round(spr.h / 2)); b.restore();
      g.globalAlpha = 0.45; g.fillStyle = col; g.beginPath(); g.arc(Math.round(x), Math.round(y - 4 - up), 3, 0, TAU); g.fill(); g.globalAlpha = 1;
      if (A.FX && !A.FX.low && Math.random() < 0.35) A.FX.part({ kind: 'px', add: true, x: s.x, y: s.y, z: 8 + up * PX, vx: -s.vx * 0.05, vy: -s.vy * 0.05, life: 0.3, color: col, drag: 2 });
    }

    drawLights(W, cx, cy) {
      const l = this.l, bw = this.bw, bh = this.bh, t = this.t;
      l.globalCompositeOperation = 'source-over'; l.globalAlpha = 1; l.fillStyle = this.theme.ambient; l.fillRect(0, 0, bw, bh);
      l.globalCompositeOperation = 'lighter';
      const L = (wx, wy, r, color, a) => { const x = wx / PX - cx, y = wy / PX - cy; if (x + r < 0 || y + r < 0 || x - r > bw || y - r > bh) return; l.globalAlpha = clamp(a, 0, 1); l.drawImage(this.lightImg(color), x - r, y - r, r * 2, r * 2); };
      const fl = (ph, k) => 0.86 + Math.sin(t * 9 * (k || 1) + ph) * 0.07 + Math.sin(t * 23 + ph * 2) * 0.05;
      const h = W.hero;
      L(h.x, h.y - 8, 82, '#ffcf94', 0.8); L(h.x, h.y - 8, 30, '#ffffff', 0.28);
      if (this.tip) L(this.tip.x, this.tip.y, 24 + this.tip.a * 40, this.tip.col || '#7fd8ff', this.tip.a);
      for (const tc of this.torches) {
        const lit = this.litAt[tc.room]; if (lit == null) continue;
        const age = t - lit, grow = clamp(age / 0.6, 0, 1);
        L(tc.x, tc.y + 10, (tc.big ? 84 : 80) * grow, '#ff8a3a', fl(tc.ph) * grow); L(tc.x, tc.y, 18 * grow, '#fee761', 0.5 * grow);
        // Flamme (leuchtend, auf dem Zusatz-Bild)
        const f = A.Art.sprite('flame', Math.floor(t * 10 + tc.ph) % 3);
        const x = tc.x / PX - cx, y = tc.y / PX - cy;
        if (x > -20 && y > -20 && x < bw + 20 && y < bh + 20) {
          const sc = grow < 1 ? grow : 1;
          this.g.globalAlpha = 1; this.g.drawImage(f.img, Math.round(x - f.w * sc / 2), Math.round(y + 4 - f.h * sc), Math.round(f.w * sc), Math.round(f.h * sc));
          if (Math.random() < 0.06) A.FX.part({ kind: 'px', add: true, x: tc.x + (Math.random() - 0.5) * 6, y: tc.y - 6, vx: (Math.random() - 0.5) * 12, vy: -25 - Math.random() * 25, life: 0.7, color: '#feae34', drag: 0.4 });
          if (age < 0.4) { this.g.globalAlpha = 1 - age / 0.4; this.g.drawImage(this.lightImg('#feae34'), x - 14, y - 14, 28, 28); this.g.globalAlpha = 1; }
        }
      }
      for (const lt of this.lights) { if (lt.room != null && this.litAt[lt.room] == null) continue; L(lt.x, lt.y, lt.r, lt.color, lt.a * (lt.fl ? 0.85 + Math.sin(t * 3 * lt.fl + lt.x) * 0.15 : 1)); }
      for (const r of W.rooms) for (const p of r.props) {
        if (p.hidden) continue;
        if (p.kind === 'fire') L(p.x, p.y - 10, p.used ? 60 : 100, '#ff8a30', fl(p.x, 1.2));
        else if (p.kind === 'stairs') L(p.x, p.y, 62, '#b55088', 0.8 + Math.sin(t * 2) * 0.1);
        else if (p.kind === 'merchant') L(p.x + 14, p.y - 6, 40, '#feae34', 0.75);
        else if (p.kind === 'statue') { L(p.x, p.y - 50, 26, '#b55088', 0.7); }
        else if (p.kind === 'shrine') { L(p.x, p.y - 26, p.used ? 30 : 64, '#2ce8f5', p.used ? 0.3 : 0.8 + Math.sin(t * 3) * 0.1); }
        else if (p.kind === 'forge') { L(p.x - 34, p.y - 8, 90, '#ff8a30', fl(p.x, 1.3)); L(p.x - 34, p.y - 2, 26, '#fee761', 0.55); const k = (t * 0.85 + p.x * 0.001) % 1; if (k > 0.72 && k < 0.9) L(p.x + 18, p.y - 6, 34, '#feae34', 0.7); }
        else if (p.kind === 'chest' && !p.used) L(p.x, p.y, 22, '#feae34', 0.4);
      }
      for (const p of W.picks) if (p.kind === 'item') L(p.x, p.y - 6, 28, A.RARITY[p.it.rarity].color, 0.7);
      for (const s of W.shots) L(s.x, s.y - 10, s.side === 'hero' ? 26 : 22, s.side === 'hero' ? (s.opts.kind === 'magic' ? s.color : '#ffe2b8') : (s.opts.kind === 'magic' ? '#b55088' : '#e43b44'), s.side === 'hero' && s.opts.kind !== 'magic' ? 0.25 : 0.8);
      for (const z of W.zones || []) if (!z.trail) L(z.x, z.y, z.r / PX * 1.3, z.col, 0.35);
      for (const o of W.orbs || []) if (o.x != null) L(o.x, o.y - 14, 22, o.col, 0.6);
      for (const a of W.allies || []) L(a.x, a.y - 10, a.minion ? 26 : 34, a.col || (a.shadow ? '#b55088' : '#2ce8f5'), a.minion ? 0.4 : 0.55);
      for (const k of W.marks || []) if (k.kind === 'meteor') L(k.x, k.y, k.r / PX * 1.2, '#e43b44', 0.3 + 0.3 * Math.sin(t * 20));
      else if (k.kind === 'barrel') { L(k.x, k.y - 22, 22, '#feae34', 0.6 + 0.4 * Math.sin(t * 30)); L(k.x, k.y, k.r / PX * 1.1, '#f77622', 0.15 + 0.2 * clamp((W.t - k.t0) / (k.at - k.t0), 0, 1)); }
      for (const bo of W.bolts || []) { L(bo.x1, bo.y1, 40, bo.col, bo.life / bo.max); L((bo.x0 + bo.x1) / 2, (bo.y0 + bo.y1) / 2, 40, bo.col, bo.life / bo.max * 0.6); }
      if (h.tal && h.tal.frost && h.alive) L(h.x, h.y, 60, '#9be8ff', 0.18);
      A.Bosses.lights(W, L);
      for (const m of W.mons) {
        if (!m.alive) continue;
        if (m.mid === 'glutmotte') L(m.x, m.y - 16, 36, '#ff8a30', fl(m.x, 2) * 0.7);
        else if (m.mid === 'spiegelgeist') L(m.x, m.y - 10, 30, '#9fd8ff', 0.45);
        else if (m.mid === 'glutwicht') L(m.x, m.y - 14, 34, '#f77622', fl(m.x, 2) * 0.7);
        else if (m.mid === 'qualle') L(m.x, m.y - 16, 30, '#2ce8f5', 0.55);
        else if (m.mid === 'leerenauge') L(m.x, m.y - 16, 30, '#b55088', 0.5);
        else if (m.boss) L(m.x, m.y - 20, 50, '#e43b44', 0.35);
        if (m.state === 'windup') L(m.x, m.y - 10, 20, '#e43b44', 0.6);
      }
      const run = A.Game.run;
      if (run && (run.cls === 'weber' || run.cls === 'rufer') && h.alive) L(h.x + (h.fx < 0 ? -8 : 8), h.y - 34, 22, run.cls === 'rufer' ? '#e0a4ff' : '#2ce8f5', 0.7 + (h.swing > 0 ? 0.3 : 0));
      if (h.brewUntil > W.t && h.alive) L(h.x, h.y - 6, 40, '#feae34', 0.35);
      if (A.FX) for (const f of A.FX.flashes) L(f.x, f.y, f.r / PX * 1.2, f.color, f.life / f.max);
      l.globalAlpha = 1; l.globalCompositeOperation = 'source-over';
    }


    // ---------- Schrein-Zauber und Talente ----------
    // am Boden: Giftwolken, Heilquellen, Giftspur, Meteor-Markierung, Frostaura
    drawBoonsGround(W, cx, cy) {
      const b = this.b, g = this.g, t = this.t, h = W.hero;
      for (const z of W.zones || []) {
        const x = z.x / PX - cx, y = z.y / PX - cy, R = z.r / PX, life = clamp((z.until - W.t) / 0.5, 0, 1) * clamp((W.t - z.t0) / 0.25, 0, 1);
        if (z.trail) { b.globalAlpha = 0.35 * life; b.fillStyle = z.ember ? '#f77622' : '#3e8948'; b.beginPath(); b.ellipse(Math.round(x), Math.round(y), R, R * 0.5, 0, 0, TAU); b.fill(); continue; }
        const heal = z.kind === 'heal', fire = z.kind === 'fire';
        if (z.kind === 'grab') { this.drawGrab(z, x, y, R, life); continue; }
        b.globalAlpha = (fire ? 0.3 : 0.22) * life; b.fillStyle = heal ? '#63c74d' : fire ? '#be4a2f' : '#265c42'; b.beginPath(); b.ellipse(Math.round(x), Math.round(y), R, R * 0.55, 0, 0, TAU); b.fill();
        g.globalAlpha = 0.5 * life; g.strokeStyle = z.col; g.lineWidth = 1; g.beginPath(); g.ellipse(Math.round(x), Math.round(y), R, R * 0.55, 0, 0, TAU); g.stroke();
        // Blasen (Gift), aufsteigende Pluszeichen (Quelle) oder Flämmchen (Feuerlache)
        g.fillStyle = heal ? '#c8f5a0' : fire ? '#feae34' : '#63c74d';
        for (let i = 0; i < (fire ? 12 : 9); i++) {
          const a = i * 2.39 + z.x, rr = R * (0.2 + (i * 0.37 % 0.8)), q = (t * (heal ? 0.7 : fire ? 1.4 : 0.5) + i * 0.13) % 1;
          const px = Math.round(x + Math.cos(a) * rr), py = Math.round(y + Math.sin(a) * rr * 0.55 - q * (heal ? 14 : fire ? 10 : 8));
          g.globalAlpha = (1 - q) * 0.8 * life;
          if (heal) { g.fillRect(px - 1, py, 3, 1); g.fillRect(px, py - 1, 1, 3); }
          else if (fire) { g.fillStyle = q < 0.4 ? '#fee761' : '#f77622'; g.fillRect(px, py, 1, q < 0.3 ? 3 : 2); }
          else g.fillRect(px, py, q > 0.6 ? 2 : 1, q > 0.6 ? 2 : 1);
        }
      }
      for (const k of W.marks || []) {
        if (k.kind === 'barrel') { // Warnkreis des Sprengfasses füllt sich, bis es knallt
          const x = k.x / PX - cx, y = k.y / PX - cy, R = k.r / PX, p = clamp((W.t - k.t0) / (k.at - k.t0), 0, 1);
          b.globalAlpha = 0.14; b.fillStyle = '#f77622'; b.beginPath(); b.ellipse(Math.round(x), Math.round(y), R, R * 0.55, 0, 0, TAU); b.fill();
          b.globalAlpha = 0.28; b.beginPath(); b.ellipse(Math.round(x), Math.round(y), R * p, R * 0.55 * p, 0, 0, TAU); b.fill();
          g.globalAlpha = 0.6 + 0.3 * Math.sin(t * 20); g.strokeStyle = '#feae34'; g.lineWidth = 1; g.beginPath(); g.ellipse(Math.round(x), Math.round(y), R, R * 0.55, 0, 0, TAU); g.stroke();
          continue;
        }
        if (k.kind !== 'meteor') continue;
        const x = k.x / PX - cx, y = k.y / PX - cy, R = k.r / PX, p = clamp((W.t - k.t0) / (k.at - k.t0), 0, 1);
        b.globalAlpha = 0.18; b.fillStyle = '#e43b44'; b.beginPath(); b.ellipse(Math.round(x), Math.round(y), R, R * 0.55, 0, 0, TAU); b.fill();
        b.globalAlpha = 0.35; b.beginPath(); b.ellipse(Math.round(x), Math.round(y), R * p, R * 0.55 * p, 0, 0, TAU); b.fill();
        g.globalAlpha = 0.9; g.strokeStyle = '#ff0044'; g.lineWidth = 1; g.beginPath(); g.ellipse(Math.round(x), Math.round(y), R, R * 0.55, 0, 0, TAU); g.stroke();
      }
      if (h.tal && h.tal.frost && h.alive) {
        const x = h.x / PX - cx, y = h.y / PX - cy + 7, R = 110 / PX;
        g.globalAlpha = 0.25 + Math.sin(t * 2) * 0.08; g.strokeStyle = '#9be8ff'; g.lineWidth = 1; g.beginPath(); g.ellipse(Math.round(x), Math.round(y), R, R * 0.5, 0, 0, TAU); g.stroke();
        g.fillStyle = '#ffffff'; for (let i = 0; i < 6; i++) { const a = t * 0.8 + i / 6 * TAU; g.globalAlpha = 0.5; g.fillRect(Math.round(x + Math.cos(a) * R), Math.round(y + Math.sin(a) * R * 0.5), 1, 1); }
      }
      b.globalAlpha = 1; g.globalAlpha = 1;
    }
    // Geisterwolf: halb durchsichtig, leuchtender Umriss, kleine Funken
    drawAlly(a, cx, cy) {
      if (a.minion) { this.drawMinion(a, cx, cy); return; }
      const x = a.x / PX - cx, y = a.y / PX - cy + 7;
      const nf = A.Art.monFrames('geisterwolf'), frame = a.moving ? Math.floor(this.t * 10) % nf : 0;
      const spr = A.Art.monSprite('geisterwolf', frame), flip = a.fx < 0;
      let alpha = 0.85; if (a.spawn > 0) alpha *= clamp(1 - a.spawn / 0.35, 0, 1); if (a.until && a.until - (A.World.W ? A.World.W.t : 0) < 1.5) alpha *= 0.5 + Math.sin(this.t * 20) * 0.3;
      let ox = 0; if (a.swing > 0) ox = a.fx * Math.sin((1 - a.swing / 0.2) * Math.PI) * 4;
      const glow = a.shadow ? '#b55088' : '#2ce8f5';
      this.shadow(x, y, 6);
      this.outlineGlow(spr, x + ox, y, flip, glow);
      this.blit(spr, x + ox, y, flip, { alpha: a.shadow ? alpha * 0.8 : alpha });
      if (a.shadow) { const k = flip ? 'shadeF' : 'shade'; if (!spr[k]) spr[k] = A.Art.silhouette(flip ? A.Art.flipped(spr) : spr.img, '#68386c'); this.b.globalAlpha = 0.55 * alpha; this.b.drawImage(spr[k], Math.round(x + ox - spr.w / 2), Math.round(y - spr.h)); this.b.globalAlpha = 1; }
      if (A.FX && !A.FX.low && Math.random() < 0.15) A.FX.part({ add: true, x: a.x + (Math.random() - 0.5) * 20, y: a.y, vx: 0, vy: -20, life: 0.5, color: a.shadow ? '#e0a4ff' : '#7fe8ff', drag: 1 });
    }
    // Grabeshände: lila Kreis, Knochenhände wachsen aus dem Boden, greifen zu und versinken wieder
    drawGrab(z, x, y, R, life) {
      const b = this.b, g = this.g, W = A.World.W, age = W.t - z.t0, out = clamp(Math.min(age / 0.25, (z.until - W.t) / 0.4), 0, 1);
      b.globalAlpha = 0.3 * life; b.fillStyle = '#3e2731'; b.beginPath(); b.ellipse(Math.round(x), Math.round(y), R, R * 0.55, 0, 0, TAU); b.fill();
      g.globalAlpha = 0.55 * life; g.strokeStyle = z.col; g.lineWidth = 1; g.beginPath(); g.ellipse(Math.round(x), Math.round(y), R, R * 0.55, 0, 0, TAU); g.stroke();
      const hand = A.Art.sprite('grabhand', 0, { '5': '#cdbfe0', '4': '#7d6a96' }, 'grab');
      for (let i = 0; i < 9; i++) {
        const a = i * 2.39 + z.x * 0.01, rr = R * (0.15 + (i * 0.41 % 0.8)), px = Math.round(x + Math.cos(a) * rr), py = Math.round(y + Math.sin(a) * rr * 0.55);
        const hh = Math.round(hand.h * out * (0.8 + 0.2 * Math.sin(this.t * 9 + i))); if (hh < 1) continue;
        b.globalAlpha = 1; b.drawImage(hand.img, 0, 0, hand.w, hh, px - Math.floor(hand.w / 2), py - hh, hand.w, hh);
        b.fillStyle = '#181425'; b.fillRect(px - 3, py, 6, 1);
      }
      b.globalAlpha = 1; g.globalAlpha = 1;
    }
    // Sprengfass: fliegt im Bogen hin, dann brennt die Lunte (Funken), es wackelt immer schneller
    drawBarrel(k, W, cx, cy) {
      const b = this.b, fly = clamp((W.t - k.t0) / 0.3, 0, 1), wx = k.sx + (k.x - k.sx) * fly, wy = k.sy + (k.y - k.sy) * fly;
      const x = wx / PX - cx, y = wy / PX - cy + 4, up = Math.sin(fly * Math.PI) * 14, p = clamp((W.t - k.t0) / (k.at - k.t0), 0, 1);
      const spr = A.Art.sprite('fass', Math.floor(this.t * 14) % 2);
      if (fly >= 1) this.shadow(x, y, 6);
      const shake = fly >= 1 ? Math.round(Math.sin(this.t * (20 + p * 40)) * p * 1.5) : 0;
      this.blit(spr, x + shake, y - up, false, { white: p > 0.85 && Math.floor(this.t * 20) % 2 });
      if (A.FX && fly >= 1 && Math.random() < 0.6) A.FX.part({ kind: 'spark', add: true, x: (x + cx) * PX + 2, y: (y + cy) * PX - spr.h * PX + 4, vx: (Math.random() - 0.5) * 60, vy: -40 - Math.random() * 50, life: 0.25, color: Math.random() < 0.5 ? '#fee761' : '#feae34', drag: 2 });
    }
    // Diener des Rufers: Skelett steigt aus dem Boden, Geist schwebt halb durchsichtig; lila Umriss, rosa bei Seelenband; zerfällt am Ende
    drawMinion(a, cx, cy) {
      const b = this.b, W = A.World.W, ghost = a.look === 'geist', x = a.x / PX - cx, y0 = a.y / PX - cy + 7;
      const spr = A.Art.monSprite(ghost ? 'diener_geist' : 'diener_skel', 0), flip = a.fx < 0, sc = 1;
      const left = a.until - (W ? W.t : 0), rally = W && a.rallyUntil > W.t;
      let alpha = ghost ? 0.72 : 1, rise = 1;
      if (a.spawn > 0) { const q = clamp(1 - a.spawn / 0.4, 0, 1); if (ghost) alpha *= q; else rise = q; }
      if (left < 1.5) alpha *= 0.55 + Math.sin(this.t * 20) * 0.3;
      const bob = ghost ? Math.round(Math.sin(this.t * 4 + a.x * 0.1) * 1.5) - 3 : (a.moving && Math.floor(this.t * 10) % 2 ? -1 : 0);
      let ox = 0; if (a.swing > 0) ox = a.fx * Math.sin((1 - a.swing / 0.2) * Math.PI) * 3;
      this.shadow(x, y0, ghost ? 4 : 5);
      const glow = rally ? '#f6757a' : '#b55088', y = y0 + bob;
      if (rise < 1) { // aus dem Boden: nur der obere Teil ist schon zu sehen
        const hh = Math.max(1, Math.round(spr.h * sc * rise)), w = Math.round(spr.w * sc), img = flip ? A.Art.flipped(spr) : spr.img;
        b.drawImage(img, 0, 0, spr.w, Math.max(1, Math.round(spr.h * rise)), Math.round(x - w / 2), Math.round(y0 - hh), w, hh);
        b.fillStyle = '#3e2731'; b.fillRect(Math.round(x - 5), Math.round(y0 - 1), 10, 2);
        return;
      }
      this.outlineGlow(spr, x + ox, y, flip, glow, sc);
      this.blit(spr, x + ox, y, flip, { alpha, sx: sc, sy: sc });
      if (A.FX && !A.FX.low && Math.random() < (ghost ? 0.2 : 0.06)) A.FX.part({ add: true, x: a.x + (Math.random() - 0.5) * 16, y: a.y, vx: 0, vy: -20, life: 0.5, color: rally ? '#f6757a' : '#e0a4ff', drag: 1 });
    }
    // über den Figuren: kreisende Geister/Klingen, Blitze, Blitzschritt-Spur
    drawBoonsTop(W, cx, cy) {
      const b = this.b, g = this.g, t = this.t;
      for (const o of W.orbs || []) {
        if (o.x == null) continue;
        const x = Math.round(o.x / PX - cx), y = Math.round(o.y / PX - cy) - 7;
        if (o.kind === 'blade') { // Klinge dreht sich
          const a = t * 14 + o.a, dx = Math.round(Math.cos(a) * 4), dy = Math.round(Math.sin(a) * 2);
          g.globalAlpha = 0.9; g.strokeStyle = '#ffffff'; g.lineWidth = 1; g.beginPath(); g.moveTo(x - dx + 0.5, y - dy + 0.5); g.lineTo(x + dx + 0.5, y + dy + 0.5); g.stroke();
          b.fillStyle = '#c0cbdc'; b.fillRect(x - 1, y - 1, 2, 2);
        } else { // Geist mit Schweif
          const fade = clamp((o.until - W.t) / 0.6, 0, 1);
          for (let i = 3; i >= 0; i--) { const a = o.a - i * 0.18, px = Math.round((W.hero.x + Math.cos(a) * o.R) / PX - cx), py = Math.round((W.hero.y + Math.sin(a) * o.R * 0.7) / PX - cy) - 7; g.globalAlpha = (1 - i / 4) * 0.7 * fade; g.fillStyle = i ? '#8b9bb4' : '#ffffff'; g.fillRect(px - 1, py - 1, i ? 2 : 3, i ? 2 : 3); }
          b.globalAlpha = fade; b.fillStyle = '#181425'; b.fillRect(x, y, 1, 1); b.globalAlpha = 1;
        }
      }
      for (const bo of W.bolts || []) { // gezackter Blitz
        const x0 = bo.x0 / PX - cx, y0 = bo.y0 / PX - cy, x1 = bo.x1 / PX - cx, y1 = bo.y1 / PX - cy, n = 6, a = bo.life / bo.max;
        for (const [w, col] of [[3, bo.col], [1, '#ffffff']]) {
          g.globalAlpha = a; g.strokeStyle = col; g.lineWidth = w; g.beginPath(); g.moveTo(x0, y0);
          for (let i = 1; i < n; i++) { const k = i / n, j = Math.sin(bo.seed + i * 7.3 + t * 40) * 4; g.lineTo(x0 + (x1 - x0) * k + j, y0 + (y1 - y0) * k - j * 0.6); }
          g.lineTo(x1, y1); g.stroke();
        }
      }
      for (const f of W.fx) if (f.kind === 'dash') { // Nachbild des Blitzschritts
        const a = f.life / 0.32, x0 = f.x / PX - cx, y0 = f.y / PX - cy - 8, x1 = f.x1 / PX - cx, y1 = f.y1 / PX - cy - 8;
        g.globalAlpha = a * 0.8; g.strokeStyle = f.color; g.lineWidth = 6 * a; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke();
        g.globalAlpha = a; g.strokeStyle = '#ffffff'; g.lineWidth = 1; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke();
      }
      // Meteor im Anflug
      for (const k of W.marks || []) {
        if (k.kind !== 'meteor') continue; const left = k.at - W.t; if (left > 0.45) continue;
        const q = 1 - left / 0.45, x = k.x / PX - cx + (1 - q) * 40, y = k.y / PX - cy - (1 - q) * 110;
        g.globalAlpha = 1; g.fillStyle = '#fee761'; g.beginPath(); g.arc(x, y, 5, 0, TAU); g.fill();
        g.fillStyle = '#f77622'; for (let i = 1; i < 6; i++) { g.globalAlpha = 1 - i / 6; g.beginPath(); g.arc(x + i * 5, y - i * 13, 5 - i * 0.7, 0, TAU); g.fill(); }
        b.fillStyle = '#5d275d'; b.fillRect(Math.round(x) - 3, Math.round(y) - 3, 6, 6); b.fillStyle = '#b13e53'; b.fillRect(Math.round(x) - 2, Math.round(y) - 2, 3, 3);
      }
      g.globalAlpha = 1; b.globalAlpha = 1;
    }

    // ---------- Oberfläche über dem Bild (volle Auflösung) ----------
    font(px, w) { return `${w || 700} ${Math.round(px)}px "Pixelify Sans", system-ui, sans-serif`; }
    overlay(W, cx, cy) { const s = this.s; this.overlayCore(W, (wx, wy, up) => [(wx / PX - cx) * s, ((wy - (up || 0)) / PX - cy) * s]); }
    // toS(wx, wy, up): Weltpunkt (und Höhe darüber) -> Bildschirmpunkt; die 3D-Darstellung liefert ihre eigene Umrechnung
    overlayCore(W, toS) {
      const c = this.ctx, dw = this.dw, dh = this.dh, d = this.dpr, t = this.t;
      // Vignette
      if (!this.vig || this.vigKey !== this.themeKey) { // Rand-Abdunklung mit einem Hauch der Farbwelt
        const tint = (this.theme && this.theme.tint) || [8, 6, 14];
        const v = A.Art.mk(dw, dh), x = v.getContext('2d'); const gr = x.createRadialGradient(dw / 2, dh / 2, Math.min(dw, dh) * 0.3, dw / 2, dh / 2, Math.max(dw, dh) * 0.75);
        gr.addColorStop(0, `rgba(${tint},0)`); gr.addColorStop(0.6, `rgba(${tint},0.28)`); gr.addColorStop(1, 'rgba(8,6,14,0.78)'); x.fillStyle = gr; x.fillRect(0, 0, dw, dh); this.vig = v; this.vigKey = this.themeKey; }
      c.drawImage(this.vig, 0, 0);
      // Treffer und wenig Leben: roter Rand
      const h = W.hero, low = h.alive && h.hp / h.maxHp < 0.3;
      const hurt = (A.FX ? A.FX.hurt : 0) * 1.6 + (low ? 0.25 + Math.sin(t * 6) * 0.12 : 0);
      if (hurt > 0.01) { const gr = c.createRadialGradient(dw / 2, dh / 2, Math.min(dw, dh) * 0.25, dw / 2, dh / 2, Math.max(dw, dh) * 0.7); gr.addColorStop(0, 'rgba(228,59,68,0)'); gr.addColorStop(1, `rgba(228,59,68,${clamp(hurt, 0, 0.75)})`); c.fillStyle = gr; c.fillRect(0, 0, dw, dh); }
      c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
      // Schild am Start
      if (this.signAt && W.room && W.room.type === 'start') { c.font = this.font(this.signAt.px || 6.5 * this.s); c.fillStyle = this.signAt.color || '#3e2731'; c.fillText(this.signAt.text, this.signAt.sx, this.signAt.sy); this.signAt = null; }
      // Namen von Elite-Gegnern
      for (const m of W.mons) if (m.alive && m.elite && !(m.spawn > 0)) { const [x, y] = toS(m.x, m.y, 46); c.font = this.font(11 * d); c.lineWidth = 3 * d; c.strokeStyle = '#181425'; c.strokeText(m.name, x, y); c.fillStyle = ELITE_COL[m.eliteKind] || '#fee761'; c.fillText(m.name, x, y); }
      // Aufgesammeltes fliegt im Bogen zur Anzeige oben
      if (A.FX && A.FX.flyers.length) {
        const rc = this.cv.getBoundingClientRect(), k = this.dw / (rc.width || 1);
        for (const f of A.FX.flyers) {
          const el = document.getElementById(f.kind === 'coin' ? 'hudGold' : 'hudPot'); if (!el) continue;
          const er = el.getBoundingClientRect(), tx = (er.left + 16 - rc.left) * k, ty = (er.top + er.height / 2 - rc.top) * k;
          const [sx0, sy0] = toS(f.x, f.y), q = Math.min(1, f.t / 0.55), e = q * q * (3 - 2 * q);
          const mx = (sx0 + tx) / 2 + (sx0 < tx ? -60 : 60) * d, my = Math.min(sy0, ty) - 40 * d;
          const x = (1 - e) * (1 - e) * sx0 + 2 * (1 - e) * e * mx + e * e * tx, y = (1 - e) * (1 - e) * sy0 + 2 * (1 - e) * e * my + e * e * ty;
          const ic = A.Art.sprite(f.kind === 'coin' ? 'coin' : 'potion', 0), sz = (f.kind === 'coin' ? 9 : 11) * d * (1.2 - q * 0.3);
          c.imageSmoothingEnabled = false; c.globalAlpha = 1; c.drawImage(ic.img, Math.round(x - sz / 2), Math.round(y - sz / 2), Math.round(sz * ic.w / ic.h), Math.round(sz));
        }
      }
      // Schwebende Zahlen
      for (const f of W.floats) {
        const age = (f.max || 1) - f.life, pop = age < 0.12 ? 1 + (1 - age / 0.12) * 0.7 : 1;
        let [x, y] = toS(f.x, f.y);
        // Schadenszahlen springen seitlich weg und fallen leicht zurück; Volltreffer zittern
        if (!f.icon && /^-?\d+!?$/.test(f.text)) { if (f.dx == null) f.dx = (Math.random() < 0.5 ? -1 : 1) * (0.6 + Math.random() * 0.6); x += f.dx * age * 55 * d; y += (age * age * 90 - age * 20) * d; }
        const crit = f.text.endsWith('!'); if (crit && age < 0.35) { x += (Math.random() - 0.5) * 3 * d; y += (Math.random() - 0.5) * 3 * d; }
        c.globalAlpha = clamp(f.life * 2, 0, 1);
        const size = f.size * d * 1.15 * pop * (crit ? 1.15 : 1);
        c.font = this.font(size); c.lineWidth = Math.max(3, size * 0.22); c.strokeStyle = '#181425';
        let tx = x;
        if (f.icon) { const ic = A.Art.sprite(f.icon); const ih = size * 0.85, iw = ic.w * ih / ic.h; const tw = c.measureText(f.text).width; tx = x - iw / 2 - 2; c.imageSmoothingEnabled = false; c.drawImage(ic.img, Math.round(tx + tw / 2 + 2), Math.round(y - ih / 2), Math.round(iw), Math.round(ih)); }
        c.strokeText(f.text, tx, y); c.fillStyle = f.color; c.fillText(f.text, tx, y);
      }
      c.globalAlpha = 1;
      // Boss-Balken
      const boss = W.mons.find(m => m.boss && m.alive);
      if (boss && !(boss.spawn > 0)) {
        const bwid = Math.min(dw * 0.8, 440 * d), x0 = (dw - bwid) / 2, y0 = (this.topPad + 34) * d, hh = 10 * d;
        c.font = `${Math.round(26 * d)}px "Jacquard 24", serif`; c.lineWidth = 4 * d; c.strokeStyle = '#181425'; c.strokeText(boss.name, dw / 2, y0 - 16 * d); c.fillStyle = '#feae34'; c.fillText(boss.name, dw / 2, y0 - 16 * d);
        c.fillStyle = '#181425'; c.fillRect(x0 - 3 * d, y0 - 3 * d, bwid + 6 * d, hh + 6 * d);
        c.fillStyle = '#3e2731'; c.fillRect(x0, y0, bwid, hh);
        const bfr = boss.hp / boss.maxHp; if (boss._hpT == null || boss._hpT < bfr) boss._hpT = bfr; else boss._hpT = Math.max(bfr, boss._hpT - (this.dt || 0.016) * 0.35);
        c.fillStyle = '#f6757a'; c.fillRect(x0, y0, bwid * boss._hpT, hh);
        c.fillStyle = '#a22633'; c.fillRect(x0, y0, bwid * boss.hp / boss.maxHp, hh);
        c.fillStyle = '#e43b44'; c.fillRect(x0, y0, bwid * boss.hp / boss.maxHp, hh * 0.5);
        c.fillStyle = 'rgba(255,255,255,0.25)'; c.fillRect(x0, y0, bwid * boss.hp / boss.maxHp, d);
        const bb = A.bossOf(W.floor), trick = A.t(bb && bb.trick);
        if (trick) { c.font = this.font(11 * d, 500); c.lineWidth = 3 * d; c.strokeText(trick, dw / 2, y0 + hh + 14 * d); c.fillStyle = '#ead4aa'; c.fillText(trick, dw / 2, y0 + hh + 14 * d); }
      }
      // Hinweis
      if (W.hint && !boss) {
        c.font = this.font(13 * d, 600); const tw = c.measureText(W.hint).width; const y = (this.topPad + 22) * d;
        c.fillStyle = 'rgba(24,20,37,0.82)'; c.fillRect(dw / 2 - tw / 2 - 12 * d, y - 13 * d, tw + 24 * d, 26 * d);
        c.fillStyle = '#feae34'; c.fillRect(dw / 2 - tw / 2 - 12 * d, y + 12 * d, tw + 24 * d, 1 * d);
        c.fillStyle = '#fee761'; c.fillText(W.hint, dw / 2, y + d);
      }
      // Einblendungen
      if (A.FX) for (const bn of A.FX.banners) {
        const age = bn.max - bn.life, inT = clamp(age / 0.2, 0, 1), out = clamp(bn.life / 0.35, 0, 1), a = Math.min(inT, out);
        const y = dh * 0.36, sc = 0.7 + 0.3 * (1 - Math.pow(1 - inT, 3));
        c.globalAlpha = a;
        const size = Math.min(54 * d, dw / 9) * sc;
        c.font = `${Math.round(size)}px "Jacquard 24", serif`; c.lineWidth = size * 0.16; c.strokeStyle = '#181425'; c.strokeText(bn.text, dw / 2, y); c.fillStyle = bn.color; c.fillText(bn.text, dw / 2, y);
        if (bn.sub) { c.font = this.font(13 * d, 600); c.lineWidth = 3 * d; c.strokeText(bn.sub, dw / 2, y + size * 0.7); c.fillStyle = '#ead4aa'; c.fillText(bn.sub, dw / 2, y + size * 0.7); }
        c.globalAlpha = 1;
      }
      this.minimap(W);
      this.joystick();
      if (this.levelAge < 0.7) { c.fillStyle = `rgba(13,11,20,${1 - this.levelAge / 0.7})`; c.fillRect(0, 0, dw, dh); }
    }
    minimap(W) {
      const m = this.m, c = this.ctx, U = 9, V = 7, G = 3, NX = A.Levels.GX, NY = A.Levels.GY;
      const w = NX * U + (NX - 1) * G + 6, hh = NY * V + (NY - 1) * G + 6;
      if (this.mm.width !== w) { this.mm.width = w; this.mm.height = hh; }
      m.clearRect(0, 0, w, hh);
      m.fillStyle = 'rgba(24,20,37,0.78)'; m.fillRect(0, 0, w, hh); m.fillStyle = '#5a6988'; m.fillRect(0, 0, w, 1); m.fillRect(0, hh - 1, w, 1); m.fillRect(0, 0, 1, hh); m.fillRect(w - 1, 0, 1, hh);
      const COL = { start: '#63c74d', fight: '#8b9bb4', elite: '#f77622', boss: '#e43b44', treasure: '#feae34', shop: '#0099db', rest: '#f77622', event: '#b55088', stairs: '#ead4aa', shrine: '#2ce8f5', forge: '#c0cbdc' };
      const pos = (r) => [3 + r.cx * (U + G), 3 + r.cy * (V + G)];
      m.fillStyle = '#3a4466';
      for (const [p, q] of W.edges) { const a = W.rooms.find(r => r.cx === p.x && r.cy === p.y), b = W.rooms.find(r => r.cx === q.x && r.cy === q.y); if (!a || !b || (!a.visited && !b.visited)) continue; const [ax, ay] = pos(a), [bx, by] = pos(b); if (ay === by) m.fillRect(Math.min(ax, bx) + U, ay + 3, G, 1); else m.fillRect(ax + 4, Math.min(ay, by) + V, 1, G); }
      for (const r of W.rooms) {
        const [x, y] = pos(r); const known = r.visited || W.edges.some(([p, q]) => { const o = (p.x === r.cx && p.y === r.cy) ? q : (q.x === r.cx && q.y === r.cy) ? p : null; return o && W.rooms.some(z => z.cx === o.x && z.cy === o.y && z.visited); });
        if (!known) continue;
        m.fillStyle = r.visited ? '#262b44' : '#1a1a2a'; m.fillRect(x, y, U, V);
        m.fillStyle = r.visited ? COL[r.type] : '#3a4466'; m.globalAlpha = r.visited && (r.cleared || r.used) && r.type !== 'stairs' && r.type !== 'shop' && r.type !== 'forge' ? 0.45 : 1; m.fillRect(x + 1, y + 1, U - 2, V - 2); m.globalAlpha = 1;
        if (r.visited && r.type !== 'fight' && r.type !== 'start') { m.fillStyle = '#ffffff'; m.fillRect(x + 4, y + 3, 1, 1); }
        if (r === W.room && Math.floor(this.t * 3) % 2 === 0) { m.fillStyle = '#ffffff'; m.fillRect(x, y, U, 1); m.fillRect(x, y + V - 1, U, 1); m.fillRect(x, y, 1, V); m.fillRect(x + U - 1, y, 1, V); }
      }
      const sc = Math.max(2, this.s - 2), d = this.dpr;
      c.imageSmoothingEnabled = false; c.drawImage(this.mm, this.dw - w * sc - 8 * d, (this.topPad + 6) * d, w * sc, hh * sc);
    }
    joystick() {
      const j = A.Input && A.Input.joy; if (!j || !j.on) return;
      const c = this.ctx, d = this.dpr, R = 48 * d;
      const x0 = j.x0 * d, y0 = j.y0 * d; let dx = (j.x - j.x0) * d, dy = (j.y - j.y0) * d; const len = Math.hypot(dx, dy); if (len > R) { dx *= R / len; dy *= R / len; }
      c.globalAlpha = 0.5; c.fillStyle = '#181425'; c.beginPath(); c.arc(x0, y0, R + 6 * d, 0, TAU); c.fill();
      c.globalAlpha = 0.8; c.strokeStyle = '#8b9bb4'; c.lineWidth = 3 * d; c.beginPath(); c.arc(x0, y0, R, 0, TAU); c.stroke();
      c.globalAlpha = 0.95; c.fillStyle = '#c0cbdc'; c.beginPath(); c.arc(x0 + dx, y0 + dy, 22 * d, 0, TAU); c.fill(); c.fillStyle = '#ffffff'; c.beginPath(); c.arc(x0 + dx - 5 * d, y0 + dy - 6 * d, 7 * d, 0, TAU); c.fill();
      c.globalAlpha = 1;
    }
  };
  A.Draw.THEMES = THEMES; A.Draw.themeOf = themeOf;
})();
