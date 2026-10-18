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

  // Farbwelten je Tiefe
  const THEMES = {
    stone: { floor: ['#4d5878', '#48536f', '#525e80', '#45506c'], mortar: '#2a2f48', brick: ['#5e6a92', '#57638a', '#64719a'], brickHi: '#7d8ab0', brickLo: '#2a2f4c', cap: '#1d1c2e', capHi: '#41445f', ambient: '#4b4870', banner: ['#a22633', '#e43b44', '#f6757a'], moss: ['#3e8948', '#265c42'], name: { de: 'Graue Gewölbe', en: 'Grey Vaults' } },
    grotto: { floor: ['#2f4d4b', '#2b4744', '#345451', '#29423f'], mortar: '#162a2b', brick: ['#365c56', '#31544f', '#3c645d'], brickHi: '#527f74', brickLo: '#14262a', cap: '#0f1b1d', capHi: '#2a4644', ambient: '#324c4e', banner: ['#265c42', '#3e8948', '#63c74d'], moss: ['#3e8948', '#63c74d', '#265c42'], name: { de: 'Schleimgrotte', en: 'Slime Grotto' } },
    rust: { floor: ['#5b3d3d', '#543737', '#624343', '#4f3333'], mortar: '#2b1a20', brick: ['#7b4b41', '#71453b', '#84534a'], brickHi: '#a3685b', brickLo: '#2e1a1e', cap: '#1f1216', capHi: '#4a2b2c', ambient: '#4e3838', banner: ['#be4a2f', '#f77622', '#feae34'], moss: ['#733e39', '#3e2731'], name: { de: 'Rostschmiede', en: 'Rust Forge' } },
    throne: { floor: ['#4c2d3c', '#3c2331'], mortar: '#25141e', brick: ['#5b3149', '#532b42', '#643751'], brickHi: '#804b68', brickLo: '#2b1421', cap: '#1b0f17', capHi: '#432536', ambient: '#47334a', banner: ['#a22633', '#e43b44', '#feae34'], moss: ['#3e2731'], name: { de: 'Thronsaal', en: 'Throne Hall' } },
  };
  const themeOf = (f) => f >= 6 ? 'throne' : f >= 4 ? 'rust' : f === 3 ? 'grotto' : 'stone';
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
      const th = THEMES[themeOf(W.floor)]; this.theme = th; this.themeKey = themeOf(W.floor);
      const cv = A.Art.mk(MW * T, MH * T), c = cv.getContext('2d');
      const img = c.createImageData(cv.width, cv.height), D = img.data, IW = cv.width;
      const seed = (W.seed >>> 0) % 100000;
      const tile = (x, y) => (x < 0 || y < 0 || x >= MW || y >= MH) ? 0 : W.tiles[y][x];
      const isF = (x, y) => tile(x, y) !== 0;
      const put = (x, y, col, d) => { const i = (y * IW + x) * 4; D[i] = clamp(col[0] + d, 0, 255); D[i + 1] = clamp(col[1] + d, 0, 255); D[i + 2] = clamp(col[2] + d, 0, 255); D[i + 3] = 255; };
      const dark = (x, y, f) => { const i = (y * IW + x) * 4; D[i] *= f; D[i + 1] *= f; D[i + 2] *= f; };
      const FL = th.floor.map(rgb), MO = rgb(th.mortar), BR = th.brick.map(rgb), BH = rgb(th.brickHi), BL = rgb(th.brickLo), CP = rgb(th.cap), CH = rgb(th.capHi);
      for (let ty = 0; ty < MH; ty++) for (let tx = 0; tx < MW; tx++) {
        const px = tx * T, py = ty * T;
        if (isF(tx, ty)) {
          if (this.themeKey === 'throne') {
            const base = FL[(tx + ty) & 1];
            for (let y = 0; y < T; y++) for (let x = 0; x < T; x++) { const edge = x === T - 1 || y === T - 1; put(px + x, py + y, edge ? MO : base, edge ? 0 : (x === 0 || y === 0 ? 8 : 0) + Math.round((hash(px + x, py + y, seed) - 0.5) * 6)); }
            continue;
          }
          const v = hash(tx, ty, seed + 1);
          const rects = v < 0.3 ? [[0, 0, 16, 16]] : v < 0.55 ? [[0, 0, 8, 16], [8, 0, 8, 16]] : v < 0.8 ? [[0, 0, 16, 8], [0, 8, 16, 8]] : [[0, 0, 8, 8], [8, 0, 8, 8], [0, 8, 8, 8], [8, 8, 8, 8]];
          rects.forEach(([rx, ry, rw, rh], i) => {
            const base = FL[Math.floor(hash(tx * 4 + i, ty, seed + 7) * FL.length)]; const sh = Math.round((hash(tx, ty * 4 + i, seed + 9) - 0.5) * 10);
            for (let y = ry; y < ry + rh; y++) for (let x = rx; x < rx + rw; x++) {
              if (x === rx + rw - 1 || y === ry + rh - 1) { put(px + x, py + y, MO, 0); continue; }
              let d = sh + Math.round((hash(px + x, py + y, seed) - 0.5) * 7);
              if (x === rx || y === ry) d += 9; else if (x === rx + rw - 2 || y === ry + rh - 2) d -= 7;
              put(px + x, py + y, base, d);
            }
          });
          // Risse
          if (hash(tx, ty, seed + 3) < 0.13) { let x = 2 + Math.floor(hash(tx, ty, 4) * 10), y = 2 + Math.floor(hash(tx, ty, 5) * 10); for (let k = 0; k < 7; k++) { put(px + clamp(x, 0, 15), py + clamp(y, 0, 15), MO, 4); x += hash(tx + k, ty, 6) < 0.5 ? 1 : 0; y += hash(tx, ty + k, 7) < 0.6 ? 1 : -1; } }
          // Steinchen
          if (hash(tx, ty, seed + 11) < 0.4) { const x = Math.floor(hash(tx, ty, 12) * 14) + 1, y = Math.floor(hash(tx, ty, 13) * 14) + 1; put(px + x, py + y, MO, 10); put(px + x + 1, py + y, FL[0], 18); }
        } else if (isF(tx, ty + 1)) {
          // Wand-Vorderseite (Ziegel)
          for (let y = 0; y < T; y++) for (let x = 0; x < T; x++) {
            const gx = px + x; let col, d = 0;
            const tall = !isF(tx, ty - 1);
            if (!tall && y === 0) { col = CH; d = 6; }
            else if (!tall && y === 1) { col = BH; d = -4; }
            else if (y === T - 1) { col = BL; }
            else {
              const yy = y - 2, course = Math.floor(yy / 4), off = (course & 1) * 4, cy = ty * 4 + course;
              if (yy % 4 === 3 || (gx + off) % 8 === 7) { col = BL; d = 6; }
              else { const bi = Math.floor((gx + off) / 8); col = BR[Math.floor(hash(bi, cy, seed + 21) * BR.length)]; d = Math.round((hash(gx, py + y, seed + 22) - 0.5) * 8) + (yy % 4 === 0 ? 10 : 0) - (y > 11 ? 8 : 0); if (hash(bi, cy, seed + 23) < 0.06) d -= 22; }
            }
            put(gx, py + y, col, d);
          }
          // Moos an der Wand
          if (hash(tx, ty, seed + 31) < (this.themeKey === 'grotto' ? 0.5 : 0.12)) { const mc = th.moss.map(rgb); for (let k = 0; k < 9; k++) { const x = Math.floor(hash(tx, k, 32) * 16), y = 10 + Math.floor(hash(k, ty, 33) * 5); put(px + x, py + y, mc[k % mc.length], 0); if (hash(x, y, 34) < 0.4 && y > 1) put(px + x, py + y - 1, mc[0], -10); } }
        } else if (isF(tx, ty + 2) && !isF(tx, ty + 1)) {
          // Oberes Wandstück: die Wand ist zwei Kacheln hoch, oben der Deckel-Rand, darunter dunklere Ziegel
          for (let y = 0; y < T; y++) for (let x = 0; x < T; x++) {
            const gx = px + x; let col, d = 0;
            if (y === 0) { col = CH; d = 6; }
            else if (y === 1) { col = BH; d = -4; }
            else {
              const yy = y - 2, course = Math.floor(yy / 4), off = (course & 1) * 4, cy = ty * 4 + course;
              if (yy % 4 === 3 || (gx + off) % 8 === 7) { col = BL; d = 2; }
              else { const bi = Math.floor((gx + off) / 8); col = BR[Math.floor(hash(bi, cy, seed + 21) * BR.length)]; d = Math.round((hash(gx, py + y, seed + 22) - 0.5) * 8) + (yy % 4 === 0 ? 6 : 0) - 6; if (hash(bi, cy, seed + 23) < 0.06) d -= 22; }
            }
            put(gx, py + y, col, d);
          }
        } else {
          // Wand oben (Deckel)
          // Fels: grobe Flecken und feines Rauschen, damit die Fläche zwischen den Räumen nicht leer wirkt
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
      this.lights = []; this.torches = []; this.deco = []; this.glows = [];
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
        for (let i = 0; i < (this.themeKey === 'grotto' ? 6 : 2); i++) { const x = rx + rng.next() * rw, y = rng.chance(0.5) ? ry + 2 + rng.next() * 6 : ry + rh - 4 - rng.next() * 6; for (let k = 0; k < 14; k++) { c.fillStyle = mc[k % mc.length]; c.globalAlpha = 0.7; c.fillRect(Math.round(x + (rng.next() - 0.5) * 12), Math.round(y + (rng.next() - 0.5) * 6), 1, 1); } c.globalAlpha = 1; }
        // Pfützen
        if (rng.chance(this.themeKey === 'grotto' ? 0.8 : 0.35)) {
          const x = rx + 24 + rng.next() * (rw - 48), y = ry + 24 + rng.next() * (rh - 48), w = 8 + rng.next() * 10, h = 3 + rng.next() * 3;
          const slime = this.themeKey === 'grotto', lava = this.themeKey === 'rust';
          c.fillStyle = slime ? 'rgba(99,199,77,0.45)' : lava ? 'rgba(247,118,34,0.55)' : 'rgba(40,60,110,0.55)';
          c.beginPath(); c.ellipse(Math.round(x), Math.round(y), w, h, 0, 0, TAU); c.fill();
          c.fillStyle = slime ? 'rgba(200,245,160,0.5)' : lava ? 'rgba(254,231,97,0.7)' : 'rgba(160,190,230,0.45)'; c.fillRect(Math.round(x - w / 3), Math.round(y - h / 3), 3, 1);
          if (slime || lava) this.lights.push({ x: x * PX, y: y * PX, r: 30, color: slime ? '#63c74d' : '#f77622', a: 0.5, fl: lava ? 2 : 0.6 });
        }
        // Leuchtpilze (Grotte) und Glutrisse (Rost)
        if (this.themeKey === 'grotto') for (let i = 0; i < rng.int(1, 3); i++) { const x = rx + 8 + rng.next() * (rw - 16), y = ry + (rng.chance(0.5) ? 10 : rh - 4); blit(S('mushglow', i % 2), x, y); this.lights.push({ x: x * PX, y: (y - 3) * PX, r: 34, color: '#2ce8f5', a: 0.75, fl: 0.4 }); }
        if (this.themeKey === 'rust') for (let i = 0; i < rng.int(1, 2); i++) { let x = rx + 10 + rng.next() * (rw - 20), y = ry + 10 + rng.next() * (rh - 20); c.fillStyle = '#f77622'; for (let k = 0; k < 14; k++) { c.fillRect(Math.round(x), Math.round(y), 1, 1); if (k % 3 === 0) { c.fillStyle = '#feae34'; c.fillRect(Math.round(x), Math.round(y), 1, 1); c.fillStyle = '#f77622'; } x += rng.chance(0.5) ? 1 : -1; y += rng.chance(0.7) ? 1 : 0; } this.lights.push({ x: x * PX, y: y * PX, r: 26, color: '#f77622', a: 0.55, fl: 2 }); }
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
        for (let i = 0; i < n; i++) this.motes.push({ room: r.i, x: (r.x + ar.next() * r.w) * T, y: (r.y + ar.next() * r.h) * T, h: r.h * T, y0: r.y * T, ph: ar.next() * 100, s: ar.next() });
        if (tk === 'grotto' || tk === 'stone') for (let i = 0; i < (tk === 'grotto' ? 3 : 1); i++) {
          const tx = r.x + 1 + Math.floor(ar.next() * (r.w - 2)); if (isF(tx, r.y - 1)) continue;
          this.drips.push({ room: r.i, x: tx * T + 4 + Math.floor(ar.next() * 8), y0: r.y * T - 3, y1: (r.y + 1 + ar.next() * (r.h - 2)) * T, per: 2.4 + ar.next() * 2.6, ph: ar.next() * 5, sp: -1 });
        }
        if (!isF(r.x + 2, r.y - 1) && ar.next() < 0.7) for (let i = 0; i < (ar.next() < 0.4 ? 2 : 1); i++) this.shafts.push({ room: r.i, x: (r.x + 1 + ar.next() * (r.w - 4)) * T, y: r.y * T - 6, w: 8 + Math.floor(ar.next() * 10), len: (3.5 + ar.next() * 3) * T, ph: ar.next() * 6 });
        const m = tk === 'grotto' ? 4 : tk === 'rust' ? 3 : 0;
        for (let i = 0; i < m; i++) {
          const tx = r.x + 1 + Math.floor(ar.next() * (r.w - 2)), ty = r.y + 1 + Math.floor(ar.next() * (r.h - 2)); if (!isF(tx, ty)) continue;
          const px = tx * T + 3 + Math.floor(ar.next() * 8), py = ty * T + 5 + Math.floor(ar.next() * 8);
          if (tk === 'grotto') { // drei kleine leuchtende Pilze
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
    // Stimmung zeichnen (auf dem Leucht-Bild): Staub/Sporen/Glut/Asche, Tropfen mit Spritzer, Glutrisse
    drawAmbience(cx, cy) {
      const g = this.g, t = this.t, tk = this.themeKey, bw = this.bw, bh = this.bh;
      const col = { stone: '#c0cbdc', grotto: '#63c74d', rust: '#feae34', throne: '#f6757a' }[tk] || '#c0cbdc';
      const rise = tk === 'grotto' || tk === 'rust' ? 1 : -1, sp = tk === 'rust' ? 10 : 4;
      // Lichtstrahlen von oben: schräge, weiche Bahnen, die langsam atmen
      const sc = { stone: [200, 210, 255], grotto: [120, 255, 230], rust: [255, 170, 90], throne: [255, 140, 200] }[tk] || [255, 255, 255];
      for (const s of this.shafts || []) {
        if (this.litAt[s.room] == null) continue;
        const x = s.x - cx, y = s.y - cy, sl = s.len * 0.45; if (x + sl + s.w < 0 || x > bw || y > bh || y + s.len < 0) continue;
        const a = 0.24 + 0.07 * Math.sin(t * 0.7 + s.ph), gr = g.createLinearGradient(0, y, 0, y + s.len);
        gr.addColorStop(0, `rgba(${sc},${a})`); gr.addColorStop(1, `rgba(${sc},0)`);
        g.globalAlpha = 1; g.fillStyle = gr; g.beginPath(); g.moveTo(x, y); g.lineTo(x + s.w, y); g.lineTo(x + s.w + sl, y + s.len); g.lineTo(x + sl, y + s.len); g.closePath(); g.fill();
      }
      for (const m of this.motes || []) {
        if (this.litAt[m.room] == null) continue;
        const yy = m.y0 + ((((m.y - m.y0) - rise * t * sp * (0.6 + m.s)) % m.h) + m.h) % m.h;
        const x = Math.round(m.x + Math.sin(t * 0.5 + m.ph) * 6 - cx), y = Math.round(yy - cy);
        if (x < 0 || y < 0 || x >= bw || y >= bh) continue;
        g.globalAlpha = (tk === 'rust' ? 0.45 : 0.22) + 0.3 * (0.5 + 0.5 * Math.sin(t * 2 + m.ph)); g.fillStyle = col; g.fillRect(x, y, 1, 1);
      }
      for (const d of this.drips || []) {
        if (this.litAt[d.room] == null) continue;
        const x = d.x - cx; if (x < -4 || x > bw + 4) continue;
        const k = (t + d.ph) % d.per, cyc = Math.floor((t + d.ph) / d.per), tf = Math.sqrt(2 * (d.y1 - d.y0) / 320), wc = tk === 'grotto' ? '#7fd8ff' : '#c0cbdc';
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
      const list = [];
      for (const r of W.rooms) for (const p of r.props) if (!p.hidden) list.push({ y: p.y / PX + (p.kind === 'stairs' ? -20 : 4), f: () => this.drawProp(p, W, cx, cy) });
      for (const d of this.deco) list.push({ y: d.flat ? -1e9 : d.y, f: () => { b.drawImage(d.s.img, Math.round(d.x - d.s.w / 2 - cx), Math.round(d.y - d.s.h - cy)); } });
      for (const p of W.picks) list.push({ y: p.y / PX, f: () => this.drawPick(p, cx, cy) });
      for (const m of W.mons) list.push({ y: m.y / PX + 6, f: () => this.drawMon(m, W, cx, cy) });
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
          for (let i = 0; i < n; i++) { const o = (i - (n - 1) / 2) * 4; g.globalAlpha = (1 - p) * 0.95; g.strokeStyle = i % 2 ? '#ffffff' : '#ff0044'; g.lineWidth = 2; g.beginPath(); g.moveTo(o - len / 2, -len / 2 + o * 0.3); g.lineTo(o + len / 2, len / 2 + o * 0.3); g.stroke(); }
          g.restore();
        } else if (f.kind === 'ring') { g.globalAlpha = clamp(f.life / 0.4, 0, 1); g.strokeStyle = f.color; g.lineWidth = 2; g.beginPath(); g.arc(x, y, f.r * (1.2 - f.life) / PX, 0, TAU); g.stroke(); }
      }
      g.globalAlpha = 1;
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
      const cls = run.cls, melee = cls !== 'schuetze' && cls !== 'weber' && cls !== 'rufer';
      // Ausfallschritt und Stauchen beim Schlag, Zusammenzucken beim Treffer
      let sx = 1, sy = 1;
      if (h.swing > 0 && melee) { const p = 1 - h.swing / 0.2; const lunge = Math.sin(Math.min(1, p * 1.6) * Math.PI) * 3; x += h.fx * lunge; y += h.fy * lunge * 0.5; sx = 1 + 0.12 * Math.sin(p * Math.PI); sy = 1 - 0.1 * Math.sin(p * Math.PI); }
      if (h.flash > 0) { sx *= 1.15; sy *= 0.85; }
      this.tip = null;
      const drawWeapon = (ghost) => {
        const wpn = A.Art.sprite(cls === 'schuetze' ? 'w_bow' : (cls === 'weber' || cls === 'rufer') ? 'w_staff' : 'w_sword');
        const hx = x + (flip ? -4 : 4), hy = y - 7 + bob;
        b.save(); b.translate(Math.round(hx), Math.round(hy));
        if (cls === 'schuetze') { // Bogen: beim Schuss kurzer Rückstoss
          const rec = h.swing > 0 ? Math.sin(h.swing / 0.2 * Math.PI) * 2.5 : 0;
          b.rotate(aim); b.drawImage(wpn.img, -2 - Math.round(rec), -Math.round(wpn.h / 2));
        }
        else if (cls === 'weber' || cls === 'rufer') { // Stab: beim Zaubern nach vorn stossen, Spitze glüht
          const cast = h.swing > 0 ? Math.sin(Math.min(1, h.swing / 0.2) * Math.PI) : 0;
          const rot = (flip ? -1 : 1) * (0.15 + cast * 0.55) + Math.sin(this.t * 2.5) * 0.03;
          b.rotate(rot); b.drawImage(wpn.img, -Math.round(wpn.w / 2), -wpn.h + 4);
          const L = wpn.h - 5, tx = hx + Math.sin(rot) * L, ty = hy - Math.cos(rot) * L, gl = this.g, col = '#7fd8ff';
          const pulse = 0.5 + Math.sin(this.t * 5) * 0.2 + cast * 0.5, rr = 1.5 + cast * 2.5;
          gl.globalAlpha = Math.min(1, pulse); gl.fillStyle = col; gl.beginPath(); gl.arc(Math.round(tx), Math.round(ty), rr + 1, 0, TAU); gl.fill();
          gl.fillStyle = '#ffffff'; gl.fillRect(Math.round(tx) - 1, Math.round(ty) - 1, 2, 2); gl.globalAlpha = 1;
          this.tip = { x: (tx + cx) * PX, y: (ty + cy) * PX, a: 0.35 + cast * 0.6 };
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
      const behind = cls !== 'schuetze' && h.swing <= 0 && h.fy < -0.3;
      if (behind) drawWeapon();
      if (blink) this.blit(spr, x, y + bob, flip, { alpha: 0.45, sx, sy });
      else this.blit(spr, x, y + bob, flip, { white: h.flash > 0, sx, sy });
      if (!behind) drawWeapon();
      // Schild-Blase
      if (h.shield > 0) { b.globalAlpha = 0.35 + Math.sin(this.t * 6) * 0.1; b.strokeStyle = '#2ce8f5'; b.lineWidth = 1; b.beginPath(); b.ellipse(Math.round(x), Math.round(y - 9), 11, 12, 0, 0, TAU); b.stroke(); b.globalAlpha = 1; }
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
      const nf = A.Art.monFrames(m.mid), fly = ['fledermaus', 'glutmotte'].includes(m.mid), ghost = m.shape === 'ghost';
      const moving = m.state !== 'windup' && !(m.spawn > 0);
      const frame = nf > 1 ? Math.floor(this.t * (fly ? 10 : 6) + (m.x % 7)) % nf : 0;
      const spr = A.Art.monSprite(m.mid, moving ? frame : 0); const flip = m.fx < 0;
      let sx = sc, sy = sc, alpha = 1, lift = 0;
      if (m.shape === 'blob') { const q = Math.sin(this.t * 7 + m.x * 0.1); sx = sc * (1 + q * 0.07); sy = sc * (1 - q * 0.09); }
      if (fly) lift = 7 + Math.sin(this.t * 5 + m.x) * 2;
      if (ghost) { lift = 3 + Math.sin(this.t * 3 + m.x) * 2; alpha = 0.85; }
      if (m.spawn > 0) { const p = clamp(1 - m.spawn / 0.5, 0, 1); alpha = p; lift -= (1 - p) * 6; }
      let ox = 0, oy = 0;
      if (m.state === 'windup') { ox = Math.sin(this.t * 60) * 1 - m.fx * 2; oy = -m.fy * 2; }
      if (m.swing > 0 && m.kind === 'melee') { const l = Math.sin((1 - m.swing / 0.2) * Math.PI) * 5; ox += m.fx * l; oy += m.fy * l * 0.5; }
      if (m.flash > 0) { sx *= 1.15; sy *= 0.85; }
      this.shadow(x, y, (m.boss ? 13 : m.elite ? 8 : 6) * (fly ? 0.7 : 1));
      const dx = Math.round(x + ox), dy = Math.round(y - lift + oy);
      if (m.elite && !(m.spawn > 0)) this.outlineGlow(spr, dx, dy, flip, ELITE_COL[m.eliteKind] || '#fee761', sc);
      if (m.boss) this.outlineGlow(spr, dx, dy, flip, Math.sin(this.t * 4) > 0 ? '#e43b44' : '#a22633', sc);
      this.blit(spr, dx, dy, flip, { sx, sy, alpha, white: m.flash > 0 });
      if (m.state === 'windup' && Math.floor(this.t * 16) % 2 === 0) this.blit(spr, dx, dy, flip, { sx, sy, alpha: 0.45, white: true });
      // Fernkämpfer laden sichtbar auf: Kugel wächst vor dem Körper, Funken werden angesaugt
      if (m.kind !== 'melee' && m.cd < 0.45 && !(m.stun > 0) && !(m.spawn > 0)) {
        const p = clamp(1 - m.cd / 0.45, 0, 1), col = m.kind === 'magic' ? '#c77dff' : '#ffb08a', g = this.g;
        const ox2 = Math.round(dx + m.fx * 7), oy2 = Math.round(dy - spr.h * sy * 0.5 + m.fy * 4);
        g.globalAlpha = 0.5 + p * 0.5; g.fillStyle = col; g.beginPath(); g.arc(ox2, oy2, 1 + p * 3, 0, TAU); g.fill();
        g.fillStyle = '#ffffff'; g.fillRect(ox2, oy2, 1, 1);
        for (let i = 0; i < 4; i++) { const a = this.t * 7 + i * 1.57, rr = (1 - ((this.t * 3 + i * 0.25) % 1)) * 9; g.fillStyle = col; g.fillRect(Math.round(ox2 + Math.cos(a) * rr), Math.round(oy2 + Math.sin(a) * rr), 1, 1); }
        g.globalAlpha = 1;
      }
      if (m.boss && A.FX && Math.random() < (this.dt || 0.016) * (m.hp < m.maxHp * 0.5 ? 1.6 : 0.7)) { const W2 = A.World.W, h2 = W2 && W2.hero; if (h2) A.FX.rocks(h2.x + (Math.random() - 0.5) * 260, h2.y + (Math.random() - 0.5) * 160, 1 + Math.floor(Math.random() * 2), 12); }
      if (m.boss) { const cr = A.Art.sprite('crown'); b.drawImage(cr.img, Math.round(dx - cr.w / 2 + (flip ? -2 : 2)), Math.round(dy - spr.h * sy - cr.h + 5)); }
      const top = dy - spr.h * sy - 2;
      if (m.state === 'windup') { const al = A.Art.sprite('u_alert'); b.drawImage(al.img, Math.round(dx - al.w / 2), Math.round(top - al.h - 2 + Math.sin(this.t * 20))); }
      if (m.stun > 0) this.stars(dx, top);
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
      if (near && !p.used || (near && p.kind === 'merchant') || (near && p.kind === 'stairs')) { const a = S('u_arrowdown'); b.drawImage(a.img, Math.round(x - a.w / 2), Math.round(top - a.h - 3 + Math.sin(t * 6) * 1.5)); }
    }

    drawShot(s, cx, cy) {
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

    drawLights(W, cx, cy) {
      const l = this.l, bw = this.bw, bh = this.bh, t = this.t;
      l.globalCompositeOperation = 'source-over'; l.globalAlpha = 1; l.fillStyle = this.theme.ambient; l.fillRect(0, 0, bw, bh);
      l.globalCompositeOperation = 'lighter';
      const L = (wx, wy, r, color, a) => { const x = wx / PX - cx, y = wy / PX - cy; if (x + r < 0 || y + r < 0 || x - r > bw || y - r > bh) return; l.globalAlpha = clamp(a, 0, 1); l.drawImage(this.lightImg(color), x - r, y - r, r * 2, r * 2); };
      const fl = (ph, k) => 0.86 + Math.sin(t * 9 * (k || 1) + ph) * 0.07 + Math.sin(t * 23 + ph * 2) * 0.05;
      const h = W.hero;
      L(h.x, h.y - 8, 82, '#ffcf94', 0.8); L(h.x, h.y - 8, 30, '#ffffff', 0.28);
      if (this.tip) L(this.tip.x, this.tip.y, 24 + this.tip.a * 40, '#7fd8ff', this.tip.a);
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
        else if (p.kind === 'chest' && !p.used) L(p.x, p.y, 22, '#feae34', 0.4);
      }
      for (const p of W.picks) if (p.kind === 'item') L(p.x, p.y - 6, 28, A.RARITY[p.it.rarity].color, 0.7);
      for (const s of W.shots) L(s.x, s.y - 10, s.side === 'hero' ? 26 : 22, s.side === 'hero' ? (s.opts.kind === 'magic' ? s.color : '#ffe2b8') : (s.opts.kind === 'magic' ? '#b55088' : '#e43b44'), s.side === 'hero' && s.opts.kind !== 'magic' ? 0.25 : 0.8);
      for (const m of W.mons) {
        if (!m.alive) continue;
        if (m.mid === 'glutmotte') L(m.x, m.y - 16, 36, '#ff8a30', fl(m.x, 2) * 0.7);
        else if (m.mid === 'spiegelgeist') L(m.x, m.y - 10, 30, '#9fd8ff', 0.45);
        else if (m.boss) L(m.x, m.y - 20, 50, '#e43b44', 0.35);
        if (m.state === 'windup') L(m.x, m.y - 10, 20, '#e43b44', 0.6);
      }
      const run = A.Game.run;
      if (run && (run.cls === 'weber' || run.cls === 'rufer') && h.alive) L(h.x + (h.fx < 0 ? -8 : 8), h.y - 34, 22, '#2ce8f5', 0.7 + (h.swing > 0 ? 0.3 : 0));
      if (A.FX) for (const f of A.FX.flashes) L(f.x, f.y, f.r / PX * 1.2, f.color, f.life / f.max);
      l.globalAlpha = 1; l.globalCompositeOperation = 'source-over';
    }

    // ---------- Oberfläche über dem Bild (volle Auflösung) ----------
    font(px, w) { return `${w || 700} ${Math.round(px)}px "Pixelify Sans", system-ui, sans-serif`; }
    overlay(W, cx, cy) { const s = this.s; this.overlayCore(W, (wx, wy, up) => [(wx / PX - cx) * s, ((wy - (up || 0)) / PX - cy) * s]); }
    // toS(wx, wy, up): Weltpunkt (und Höhe darüber) -> Bildschirmpunkt; die 3D-Darstellung liefert ihre eigene Umrechnung
    overlayCore(W, toS) {
      const c = this.ctx, dw = this.dw, dh = this.dh, d = this.dpr, t = this.t;
      // Vignette
      if (!this.vig || this.vigKey !== this.themeKey) { // Rand-Abdunklung mit einem Hauch der Farbwelt
        const tint = { stone: [20, 18, 44], grotto: [6, 30, 32], rust: [40, 12, 8], throne: [36, 8, 32] }[this.themeKey] || [8, 6, 14];
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
        const trick = A.t(A.BOSSES[W.floor] && A.BOSSES[W.floor].trick);
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
      const m = this.m, c = this.ctx, U = 9, V = 7, G = 3;
      const w = 3 * U + 2 * G + 6, hh = 3 * V + 2 * G + 6;
      if (this.mm.width !== w) { this.mm.width = w; this.mm.height = hh; }
      m.clearRect(0, 0, w, hh);
      m.fillStyle = 'rgba(24,20,37,0.78)'; m.fillRect(0, 0, w, hh); m.fillStyle = '#5a6988'; m.fillRect(0, 0, w, 1); m.fillRect(0, hh - 1, w, 1); m.fillRect(0, 0, 1, hh); m.fillRect(w - 1, 0, 1, hh);
      const COL = { start: '#63c74d', fight: '#8b9bb4', elite: '#f77622', boss: '#e43b44', treasure: '#feae34', shop: '#0099db', rest: '#f77622', event: '#b55088', stairs: '#ead4aa' };
      const pos = (r) => [3 + r.cx * (U + G), 3 + r.cy * (V + G)];
      m.fillStyle = '#3a4466';
      for (const [p, q] of W.edges) { const a = W.rooms.find(r => r.cx === p.x && r.cy === p.y), b = W.rooms.find(r => r.cx === q.x && r.cy === q.y); if (!a || !b || (!a.visited && !b.visited)) continue; const [ax, ay] = pos(a), [bx, by] = pos(b); if (ay === by) m.fillRect(Math.min(ax, bx) + U, ay + 3, G, 1); else m.fillRect(ax + 4, Math.min(ay, by) + V, 1, G); }
      for (const r of W.rooms) {
        const [x, y] = pos(r); const known = r.visited || W.edges.some(([p, q]) => { const o = (p.x === r.cx && p.y === r.cy) ? q : (q.x === r.cx && q.y === r.cy) ? p : null; return o && W.rooms.some(z => z.cx === o.x && z.cy === o.y && z.visited); });
        if (!known) continue;
        m.fillStyle = r.visited ? '#262b44' : '#1a1a2a'; m.fillRect(x, y, U, V);
        m.fillStyle = r.visited ? COL[r.type] : '#3a4466'; m.globalAlpha = r.visited && (r.cleared || r.used) && r.type !== 'stairs' && r.type !== 'shop' ? 0.45 : 1; m.fillRect(x + 1, y + 1, U - 2, V - 2); m.globalAlpha = 1;
        if (r.visited && r.type !== 'fight' && r.type !== 'start') { m.fillStyle = '#ffffff'; m.fillRect(x + 4, y + 3, 1, 1); }
        if (r === W.room && Math.floor(this.t * 3) % 2 === 0) { m.fillStyle = '#ffffff'; m.fillRect(x, y, U, 1); m.fillRect(x, y + V - 1, U, 1); m.fillRect(x, y, 1, V); m.fillRect(x + U - 1, y, 1, V); }
      }
      const sc = Math.max(2, this.s - 1), d = this.dpr;
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
