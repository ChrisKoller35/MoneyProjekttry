// Der Abstieg – Bühnenbilder der Menüs, als Pixel-Grafik aus Code:
// Titelbild: Mauer mit Tor in die Tiefe, Fackeln, aufsteigende Glut, Fledermäuse, der Held davor.
// Heldenwahl: kleine Bühne mit Lichtkegel, Sockel, Feuerschalen und dem gewählten Helden.
'use strict';
window.A = window.A || {};

A.Scenes = (function () {
  const TAU = Math.PI * 2;
  const hash = (x, y, k) => { let h = Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(k | 0, 1442695041) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
  const rgb = (h) => { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const rnd = (a, b) => a + Math.random() * (b - a);
  const mix = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
  const mk = (w, h) => A.Art.mk(w, h);
  const CLASS_GLOW = { klinge: '#e43b44', schuetze: '#63c74d', weber: '#2ce8f5', rufer: '#b55088', brau: '#feae34' };

  // Weiches Licht (Kreis mit Verlauf), einmal erzeugt und dann nur noch kopiert
  const lightCache = {};
  function lightImg(color) {
    if (lightCache[color]) return lightCache[color];
    const c = mk(64, 64), x = c.getContext('2d'); const [r, g, b] = rgb(color);
    const gr = x.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, `rgba(${r},${g},${b},1)`); gr.addColorStop(0.35, `rgba(${r},${g},${b},0.6)`); gr.addColorStop(0.7, `rgba(${r},${g},${b},0.2)`); gr.addColorStop(1, `rgba(${r},${g},${b},0)`);
    x.fillStyle = gr; x.fillRect(0, 0, 64, 64);
    return (lightCache[color] = c);
  }
  function light(ctx, x, y, r, color, a) { ctx.globalAlpha = a == null ? 1 : clamp(a, 0, 1); ctx.drawImage(lightImg(color), x - r, y - r, r * 2, r * 2); ctx.globalAlpha = 1; }
  function layer(o, key) { o[key] = mk(2, 2); o[key + 'x'] = o[key].getContext('2d'); }
  function fitLayers(o, w, h) { for (const k of ['buf', 'lt', 'gl']) { o[k].width = w; o[k].height = h; o[k + 'x'].imageSmoothingEnabled = false; } }
  function fitCanvas(o) {
    const r = o.cv.getBoundingClientRect(); const dpr = Math.min(3, window.devicePixelRatio || 1);
    const dw = Math.max(2, Math.round(r.width * dpr)), dh = Math.max(2, Math.round(r.height * dpr));
    if (o.cv.width !== dw) o.cv.width = dw; if (o.cv.height !== dh) o.cv.height = dh;
    o.dw = dw; o.dh = dh; o.dpr = dpr; o.cssW = r.width; o.cssH = r.height;
  }
  // Licht über das Bild legen, dann Leuchtendes dazu, dann gross auf die Leinwand
  function begin(o, ambient) {
    const l = o.ltx, g = o.glx;
    l.globalCompositeOperation = 'source-over'; l.globalAlpha = 1; l.fillStyle = ambient; l.fillRect(0, 0, o.bw, o.bh); l.globalCompositeOperation = 'lighter';
    g.globalCompositeOperation = 'source-over'; g.clearRect(0, 0, o.bw, o.bh); g.globalCompositeOperation = 'lighter';
    o.bufx.globalCompositeOperation = 'source-over';
  }
  function compose(o) {
    const b = o.bufx;
    b.globalCompositeOperation = 'multiply'; b.drawImage(o.lt, 0, 0); b.globalCompositeOperation = 'lighter'; b.drawImage(o.gl, 0, 0); b.globalCompositeOperation = 'source-over';
    const c = o.cv.getContext('2d'); c.imageSmoothingEnabled = false;
    c.drawImage(o.buf, 0, 0, o.bw, o.bh, 0, 0, o.bw * o.s, o.bh * o.s);
  }
  function vignette(o, strength) {
    if (!o.vig || o.vig.width !== o.dw || o.vig.height !== o.dh) {
      o.vig = mk(o.dw, o.dh); const x = o.vig.getContext('2d');
      const r = Math.hypot(o.dw, o.dh) / 2; const gr = x.createRadialGradient(o.dw / 2, o.dh * 0.45, r * 0.3, o.dw / 2, o.dh * 0.45, r);
      gr.addColorStop(0, 'rgba(14,12,22,0)'); gr.addColorStop(1, `rgba(14,12,22,${strength})`); x.fillStyle = gr; x.fillRect(0, 0, o.dw, o.dh);
    }
    o.cv.getContext('2d').drawImage(o.vig, 0, 0);
  }
  // Held mit Waffe in ein kleines Bild malen (Füsse unten Mitte bei x=20, y=34)
  function heroImage(race, cls, frame, bob) {
    const c = mk(40, 40), x = c.getContext('2d'); x.imageSmoothingEnabled = false;
    const spr = A.Art.heroSprite(race, cls, frame || 0); const hx = 20, hy = 34 + (bob || 0);
    const wpn = cls === 'brau' ? A.Art.sprite('flask', 0, { C: '#feae34', H: '#fee761' }, 'held') : A.Art.sprite(cls === 'schuetze' ? 'w_bow' : cls === 'weber' ? 'w_staff' : cls === 'rufer' ? 'w_skullstaff' : 'w_sword');
    const drawW = () => {
      x.save(); x.translate(hx + 4, hy - 7);
      if (cls === 'schuetze') x.drawImage(wpn.img, -2, -Math.round(wpn.h / 2));
      else if (cls === 'weber' || cls === 'rufer') { x.rotate(0.15); x.drawImage(wpn.img, -Math.round(wpn.w / 2), -wpn.h + 4); }
      else if (cls === 'brau') { x.rotate(0.3); x.drawImage(wpn.img, -Math.round(wpn.w / 2), -wpn.h + 2); }
      else { x.rotate(0.9); x.drawImage(wpn.img, -2, -Math.round(wpn.h / 2)); }
      x.restore();
    };
    x.drawImage(spr.img, Math.round(hx - spr.w / 2), Math.round(hy - spr.h));
    drawW();
    return c;
  }
  // Leuchtender Rand um eine Figur (Gegenlicht)
  function rimOf(img, color) {
    const sil = A.Art.silhouette(img, color), c = mk(img.width, img.height), x = c.getContext('2d');
    x.drawImage(sil, -1, 0); x.drawImage(sil, 1, 0); x.drawImage(sil, 0, -1);
    x.globalCompositeOperation = 'destination-out'; x.drawImage(img, 0, 0); x.globalCompositeOperation = 'source-over';
    return c;
  }

  // ======================= Titelbild =======================
  const T = { cv: null, on: false, s: 3, bw: 0, bh: 0, t: 0, anchor: null, dim: 0, race: 'mensch', cls: 'klinge', embers: [], bats: [], dust: [], nextBat: 2, eyes: [], nextEye: 2.5, fog: [], peb: [], nextRumble: 6, shk: 0, stat: null, geo: null, heroC: {} };
  layer(T, 'buf'); layer(T, 'lt'); layer(T, 'gl');

  function titleResize() {
    fitCanvas(T);
    T.s = Math.max(2, Math.round(Math.min(T.dw / 100, T.dh / 210)));
    T.bw = Math.ceil(T.dw / T.s); T.bh = Math.ceil(T.dh / T.s);
    fitLayers(T, T.bw, T.bh); T.vig = null;
    // Lage des Tors: zwischen Untertitel und Menü, falls angegeben; der Held steht knapp über dem ersten Knopf
    const k = T.dpr / T.s; const a = T.anchor;
    let floorY = a ? Math.floor(a.bottom * k) - 8 : Math.round(T.bh * 0.7);
    const topY = a ? Math.ceil(a.top * k) + 4 : Math.round(T.bh * 0.3);
    floorY = clamp(floorY, 60, T.bh - 10);
    const avail = Math.max(30, floorY - topY);
    // Torbreite: so gross, wie es die Höhe (Bogen und Rahmen) und die Breite (Fackeln daneben) erlauben
    const ow = clamp(Math.floor(Math.min((avail - 8) / 1.25, T.bw - 48) / 2) * 2, 22, 64);
    const oh = Math.round(ow * 0.72), fw = 5;
    T.geo = { gx: Math.round(T.bw / 2), floorY, ow, oh, fw };
    T.stat = buildTitle();
    T.embers.length = 0; T.peb.length = 0; T.eyes.length = 0;
    T.fog = []; for (let i = 0; i < 7; i++) T.fog.push({ x: rnd(-20, T.bw + 20), y: G2fy() + rnd(-2, 14), r: rnd(14, 26), v: rnd(2, 5) * (Math.random() < 0.5 ? -1 : 1), ph: rnd(0, TAU) });
  }
  function G2fy() { return T.geo ? T.geo.floorY : T.bh * 0.7; }

  function buildTitle() {
    const bw = T.bw, bh = T.bh, G = T.geo, gx = G.gx, fy = G.floorY, ow = G.ow, oh = G.oh, fw = G.fw;
    const cv = mk(bw, bh), c = cv.getContext('2d');
    const img = c.createImageData(bw, bh), D = img.data;
    const put = (x, y, col, d) => { const i = (y * bw + x) * 4; D[i] = clamp(col[0] + d, 0, 255); D[i + 1] = clamp(col[1] + d, 0, 255); D[i + 2] = clamp(col[2] + d, 0, 255); D[i + 3] = 255; };
    const BR = ['#5e6a92', '#57638a', '#64719a', '#525d84'].map(rgb), MO = rgb('#262b44'), HI = rgb('#8b9bb4');
    const FL = ['#4d5878', '#48536f', '#525e80', '#45506c'].map(rgb), FMO = rgb('#232842');
    const ST = ['#8b9bb4', '#7d8ab0', '#8f9fc0'].map(rgb), STD = rgb('#3a4466'), DARK = rgb('#0d0a12');
    const MOSS = [rgb('#3e8948'), rgb('#265c42')];
    const ar = ow / 2, acy = fy - oh;                  // Bogen: Mittelpunkt und Radius
    const inOpen = (x, y) => { const dx = x + 0.5 - gx; if (y >= acy) return y < fy && Math.abs(dx) < ar; const dy = y + 0.5 - acy; return dx * dx + dy * dy < ar * ar; };
    const steps = [4, 3, 3, 2, 2, 2, 2, 1, 1, 1];
    for (let y = 0; y < bh; y++) for (let x = 0; x < bw; x++) {
      if (y < fy) {
        // Tor-Öffnung mit Treppe in die Tiefe
        if (inOpen(x, y)) {
          let yy = fy - 1, k = 0, hit = -1, top = false;
          for (; k < steps.length; k++) { const h = steps[k]; if (y > yy - h) { hit = k; top = y === yy - h + 1; break; } yy -= h; }
          const inset = hit >= 0 ? hit : 99; const dx = Math.abs(x + 0.5 - gx);
          if (hit >= 0 && dx < ar - inset * 0.9) {
            const deep = hit / steps.length; const base = mix(rgb('#5a6988'), rgb('#7a3a32'), deep);
            put(x, y, top ? mix(base, rgb('#fee761'), 0.15 + deep * 0.35) : mix(base, DARK, 0.55), 0);
          } else put(x, y, DARK, Math.round((1 - (fy - y) / (oh + ar)) * 6));
          continue;
        }
        // Rahmen aus grossen Steinen
        const dx = x + 0.5 - gx;
        if (y < acy) {
          const dy = y + 0.5 - acy, d = Math.hypot(dx, dy);
          if (d < ar + fw) {
            const ang = Math.atan2(dy, dx) + Math.PI; const segs = 9; const f = ang / Math.PI * segs; const seg = Math.floor(f); const fr = f - seg;
            const edge = d > ar + fw - 1 || fr < 0.09 || d < ar + 0.8;
            const col = ST[seg % ST.length]; const key = seg === Math.floor(segs * 1.5) || seg === Math.floor(segs / 2) ? 10 : 0;
            put(x, y, edge ? STD : col, (d > ar + fw - 2 ? 8 : 0) + key + Math.round((hash(x, y, 5) - 0.5) * 8));
            continue;
          }
        } else if (Math.abs(dx) < ar + fw + (Math.floor((fy - y) / 6) % 2 ? 2 : 0)) {
          const blk = Math.floor((fy - 1 - y) / 6), ry = (fy - 1 - y) % 6; const w = fw + (blk % 2 ? 2 : 0);
          const edge = ry === 5 || Math.abs(dx) > ar + w - 1;
          put(x, y, edge ? STD : ST[blk % ST.length], (ry === 4 ? 9 : 0) + (Math.abs(dx) < ar + 1 ? -14 : 0) + Math.round((hash(x, y, 6) - 0.5) * 8));
          continue;
        }
        // Mauer: Ziegel, oben dunkler
        const rr = fy - 1 - y, row = Math.floor(rr / 5), ry = rr % 5, off = row % 2 ? 5 : 0;
        const cx = (x + off) % 10, ci = Math.floor((x + off) / 10);
        const fade = 0.45 + 0.55 * Math.pow(y / fy, 0.8);
        let col, d = 0;
        if (ry === 4 || cx === 0) col = MO;
        else {
          col = BR[Math.floor(hash(ci, row, 3) * BR.length)];
          d = (ry === 3 ? 10 : ry === 0 ? -10 : 0) + (cx === 1 ? 5 : 0) + Math.round((hash(x, y, 4) - 0.5) * 7);
          if (hash(ci, row, 8) < 0.12 && cx === 3 + Math.floor(hash(ci, row, 9) * 5) && ry > 0) col = MO;
          if (row <= 1 && ry === 3 && hash(x, row, 11) < 0.35) col = MOSS[Math.floor(hash(x, y, 12) * 2)];
        }
        col = [col[0] * fade, col[1] * fade, col[2] * fade];
        put(x, y, col, row === 0 ? d - 12 : d);
      } else {
        // Boden: Platten, nach vorne grösser
        let yy = fy, k = 0, h = 4; while (y >= yy + h) { yy += h; k++; h = 4 + k * 2; }
        const ry = y - yy, sw = 10 + k * 5, off = (k % 2) * Math.round(sw / 2);
        const cx = ((x - gx + off) % sw + sw) % sw, ci = Math.floor((x - gx + off) / sw);
        let col = FL[Math.floor(hash(ci, k, 21) * FL.length)], d = Math.round((hash(x, y, 22) - 0.5) * 7);
        if (ry === 0 || cx === 0) col = FMO; else if (ry === 1) d += 8; else if (cx === 1) d += 4;
        const fade = 0.85; col = [col[0] * fade, col[1] * fade, col[2] * fade];
        put(x, y, col, d - (y - fy < 2 ? 22 : 0));
      }
    }
    c.putImageData(img, 0, 0);
    // Schlussstein mit Schädel, Fahnen, Halter für Fackeln, Knochen am Boden, Spinnweben
    const sk = A.Art.sprite('skull'); c.drawImage(sk.img, gx - Math.floor(sk.w / 2), acy - ar - fw - 1);
    // Neben dem Tor Fackeln, weiter aussen abwechselnd Fahnen und Fackeln (auf breiten Bildschirmen)
    const sideX = ar + fw + 10, ty = Math.round(fy - oh * 0.85), sc = A.Art.sprite('sconce');
    T.torches = [];
    const torch = (x) => { T.torches.push({ x, y: ty }); c.drawImage(sc.img, x - Math.floor(sc.w / 2), ty); };
    for (let i = 0, off = sideX; gx - off > 5; i++, off += 34) {
      for (const sx of [-1, 1]) { if (i % 2 === 0) torch(gx + sx * off); else banner(c, gx + sx * off, Math.round(acy - ar * 0.6)); }
    }
    const bones = A.Art.sprite('bones'), skull = A.Art.sprite('skull'), pot = A.Art.sprite('pot'), barrel = A.Art.sprite('barrel');
    c.drawImage(bones.img, gx - ar - 16, fy + 7); c.drawImage(skull.img, gx - ar - 9, fy + 3);
    c.drawImage(barrel.img, gx + ar + 14, fy - barrel.h + 6); c.drawImage(pot.img, gx + ar + 4, fy - pot.h + 9);
    web(c, gx - ar - fw - 1, acy - ar - fw + 6, 1); web(c, gx + ar + fw + 1, acy - ar - fw + 6, -1);
    return cv;
  }
  // Fahne an der Wand: dunkelrot, Goldrand, Krone in der Mitte, unten eingeschnitten
  function banner(c, x, y) {
    const w = 11, h = 22, x0 = x - 5;
    c.fillStyle = '#3e2731'; c.fillRect(x0 - 2, y - 1, w + 4, 2);
    c.fillStyle = '#feae34'; c.fillRect(x0 - 2, y - 1, 1, 1); c.fillRect(x0 + w + 1, y - 1, 1, 1);
    for (let yy = 0; yy < h; yy++) for (let xx = 0; xx < w; xx++) {
      const cut = yy >= h - 4 && Math.abs(xx - 5) < (yy - (h - 4)) + 1; if (cut) continue;
      const edge = xx === 0 || xx === w - 1; const trim = xx === 1 || xx === w - 2;
      c.fillStyle = edge ? '#181425' : trim ? '#feae34' : (yy < 2 ? '#e43b44' : (xx < 4 ? '#a22633' : '#8f1f2c'));
      c.fillRect(x0 + xx, y + 1 + yy, 1, 1);
    }
    const cr = A.Art.sprite('crown'); c.drawImage(cr.img, x - Math.floor(cr.w / 2), y + 7);
  }
  function web(c, x, y, dir) {
    c.fillStyle = 'rgba(192,203,220,0.35)';
    for (let i = 0; i < 7; i++) { c.fillRect(x + dir * i, y - i, 1, 1); c.fillRect(x + dir * i, y - 6, 1, 1); c.fillRect(x, y - i, 1, 1); }
    c.fillStyle = 'rgba(192,203,220,0.2)'; for (let i = 0; i < 4; i++) { c.fillRect(x + dir * (i + 2), y - 2 - i, 1, 1); c.fillRect(x + dir * 3, y - 1 - i, 1, 1); }
  }

  function titleFrame(dt) {
    const b = T.bufx, l = T.ltx, g = T.glx, G = T.geo; if (!G) return;
    T.t += dt; const t = T.t;
    begin(T, '#2b2742');
    // ab und zu grollt es in der Tiefe: Bild ruckelt, Steinchen rieseln vom Bogen
    T.nextRumble -= dt; if (T.shk > 0) T.shk -= dt;
    if (T.nextRumble <= 0) {
      T.nextRumble = rnd(9, 15); T.shk = 0.45;
      for (let i = 0; i < 7; i++) T.peb.push({ x: G.gx + rnd(-G.ow / 2 - 6, G.ow / 2 + 6), y: G.floorY - G.oh - G.ow / 2 - rnd(0, 4), vy: rnd(0, 20), vx: rnd(-6, 6), land: G.floorY + rnd(1, 9), s: Math.random() < 0.4 ? 2 : 1, dl: rnd(0, 0.35), t: 0 });
      if (A.Sound && A.Sound.drip) A.Sound.drip();
    }
    const sh = T.shk > 0 ? Math.round(Math.sin(t * 70) * Math.min(1, T.shk * 3)) : 0;
    b.drawImage(T.stat, sh, 0);
    const ar = G.ow / 2, acy = G.floorY - G.oh, deepY = G.floorY - G.oh * 0.62;
    // Fackeln
    for (const [i, tc] of T.torches.entries()) {
      const fr = Math.floor(t * 10 + i * 1.7) % 3; const f = A.Art.sprite('flame', fr);
      b.drawImage(f.img, tc.x - Math.floor(f.w / 2), tc.y - f.h + 2);
      const fl = 0.85 + Math.sin(t * 13 + i * 2) * 0.06 + Math.sin(t * 7.3 + i) * 0.05;
      light(l, tc.x, tc.y - 4, 52 * fl, '#ff9a3c', 0.95); light(l, tc.x, tc.y - 4, 16, '#fee761', 0.6);
      light(g, tc.x, tc.y - 5, 5, '#fee761', 0.45);
      if (Math.random() < dt * 3) T.embers.push({ x: tc.x + rnd(-1, 1), y: tc.y - 8, vx: rnd(-3, 3), vy: rnd(-12, -20), life: rnd(0.6, 1.2), max: 1.2, ph: rnd(0, TAU) });
    }
    // Glut aus der Tiefe
    const pulse = 0.85 + Math.sin(t * 1.7) * 0.1 + Math.sin(t * 4.1) * 0.04;
    light(g, G.gx, deepY, ar * 1.25 * pulse, '#f77622', 0.75); light(g, G.gx, deepY + 2, ar * 0.6, '#fee761', 0.35 * pulse);
    light(l, G.gx, G.floorY - 4, ar * 2.6, '#d4602a', 0.9 * pulse);
    light(l, G.gx, G.floorY + 10, ar * 1.8, '#f77622', 0.5);
    if (Math.random() < dt * 14) T.embers.push({ x: G.gx + rnd(-ar * 0.6, ar * 0.6), y: deepY + rnd(-3, 8), vx: rnd(-4, 4), vy: rnd(-12, -28), life: rnd(2.2, 4.5), max: 4.5, ph: rnd(0, TAU) });
    // Augen in der Dunkelheit des Tors: tauchen auf, blinzeln, verschwinden
    T.nextEye -= dt;
    if (T.nextEye <= 0) { T.nextEye = rnd(2.5, 6); T.eyes.push({ x: Math.round(G.gx + rnd(-ar * 0.55, ar * 0.55)), y: Math.round(acy + rnd(-ar * 0.55, ar * 0.1)), life: rnd(2.2, 3.4), max: 3.4, gap: Math.random() < 0.3 ? 4 : 3, col: Math.random() < 0.25 ? '#fee761' : '#e43b44', bl: rnd(0.8, 1.6) }); }
    for (const e of T.eyes) {
      e.life -= dt; const a = clamp(Math.min(e.life, (e.max - e.life) * 2), 0, 1);
      if (Math.abs(e.life - e.bl) < 0.09) continue;
      g.globalAlpha = a; g.fillStyle = e.col; g.fillRect(e.x - e.gap, e.y, 2, 1); g.fillRect(e.x + e.gap - 1, e.y, 2, 1);
      light(g, e.x, e.y, 5, e.col, 0.25 * a); g.globalAlpha = 1;
    }
    for (let i = T.eyes.length - 1; i >= 0; i--) if (T.eyes[i].life <= 0) T.eyes.splice(i, 1);
    // Steinchen vom Bogen mit Staubwölkchen beim Aufprall
    for (const p of T.peb) {
      if (p.dl > 0) { p.dl -= dt; continue; }
      if (p.y < p.land) { p.vy += 260 * dt; p.x += p.vx * dt; p.y = Math.min(p.land, p.y + p.vy * dt); if (p.y >= p.land) for (let k = 0; k < 3; k++) T.dust.push({ x: p.x + rnd(-2, 2), y: p.y - rnd(0, 2), vx: rnd(-6, 6), vy: rnd(-5, -1), life: rnd(0.5, 0.9), max: 0.9, big: 1 }); }
      else p.t += dt;
      b.globalAlpha = clamp(1 - p.t / 1.5, 0, 1); b.fillStyle = '#181425'; b.fillRect(Math.round(p.x) - 1, Math.round(p.y) - 1, p.s + 2, p.s + 2); b.fillStyle = '#8b9bb4'; b.fillRect(Math.round(p.x), Math.round(p.y), p.s, p.s);
    }
    b.globalAlpha = 1;
    for (let i = T.peb.length - 1; i >= 0; i--) if (T.peb[i].t > 1.5) T.peb.splice(i, 1);
    // Nebel kriecht über den Boden
    for (const f of T.fog) {
      f.x += f.v * dt; if (f.x < -40) f.x = T.bw + 40; if (f.x > T.bw + 40) f.x = -40;
      b.globalAlpha = 0.07 + Math.sin(t * 0.6 + f.ph) * 0.025; b.fillStyle = '#8b9bb4'; b.beginPath(); b.ellipse(Math.round(f.x), Math.round(f.y), f.r, f.r * 0.32, 0, 0, TAU); b.fill();
    }
    b.globalAlpha = 1;
    // Held vor dem Tor (atmet leicht), Gegenlicht als heller Rand
    const bob = Math.sin(t * 2.5) > 0.6 ? -1 : 0; const key = T.race + T.cls + bob;
    if (!T.heroC[key]) { const im = heroImage(T.race, T.cls, 0, bob); T.heroC[key] = { im, rim: rimOf(im, '#f77622') }; }
    const H = T.heroC[key]; const hx = G.gx - 20, hy = G.floorY + 6 - 34;
    b.drawImage(H.im, hx, hy); g.globalAlpha = 0.75 + Math.sin(t * 1.7) * 0.15; g.drawImage(H.rim, hx, hy); g.globalAlpha = 1;
    light(l, G.gx, G.floorY - 8, 22, '#c0cbdc', 0.25);
    // Waffe blitzt kurz auf
    const gp = (t % 4.2) / 4.2; if (gp > 0.9) { const q = (gp - 0.9) / 0.1, gs = Math.round(Math.sin(q * Math.PI) * 3), gxx = hx + 28, gyy = hy + 31;
      g.fillStyle = '#ffffff'; g.fillRect(gxx - gs, gyy, gs * 2 + 1, 1); g.fillRect(gxx, gyy - gs, 1, gs * 2 + 1); light(g, gxx, gyy, 4 + gs, '#ffffff', 0.4); }
    // Fledermäuse
    T.nextBat -= dt;
    if (T.nextBat <= 0) { T.nextBat = rnd(4, 9); const left = Math.random() < 0.5; T.bats.push({ x: left ? -12 : T.bw + 12, y: rnd(12, Math.max(14, acy - ar - 14)), vx: (left ? 1 : -1) * rnd(24, 38), ph: rnd(0, TAU) }); }
    for (const bt of T.bats) {
      bt.x += bt.vx * dt; bt.y += Math.sin(t * 4 + bt.ph) * 12 * dt;
      const s = A.Art.monSprite('fledermaus', Math.floor(t * 9 + bt.ph) % 2); const im = bt.vx < 0 ? A.Art.flipped(s) : s.img;
      b.drawImage(im, Math.round(bt.x - s.w / 2), Math.round(bt.y - s.h / 2));
    }
    for (let i = T.bats.length - 1; i >= 0; i--) if (T.bats[i].x < -30 || T.bats[i].x > T.bw + 30) T.bats.splice(i, 1);
    // Staub im Licht
    if (T.dust.length < 26 && Math.random() < dt * 6) T.dust.push({ x: rnd(0, T.bw), y: rnd(acy - ar - 30, G.floorY), vx: rnd(-1.5, 1.5), vy: rnd(-2, 1), life: rnd(4, 8), max: 8 });
    for (const d of T.dust) { d.life -= dt; d.x += d.vx * dt; d.y += d.vy * dt; const a = d.big ? clamp(d.life / d.max, 0, 1) * 0.5 : Math.min(1, d.life, (d.max - d.life)) * 0.18; g.globalAlpha = a; g.fillStyle = '#c0cbdc'; g.fillRect(Math.round(d.x), Math.round(d.y), d.big ? 2 : 1, d.big ? 2 : 1); }
    for (let i = T.dust.length - 1; i >= 0; i--) if (T.dust[i].life <= 0) T.dust.splice(i, 1);
    // Glut-Funken
    for (const e of T.embers) {
      e.life -= dt; e.x += (e.vx + Math.sin(t * 2.2 + e.ph) * 5) * dt; e.y += e.vy * dt; e.vy *= 1 - dt * 0.15;
      const age = 1 - e.life / e.max; const col = age < 0.3 ? '#fee761' : age < 0.65 ? '#feae34' : '#f77622';
      g.globalAlpha = clamp(e.life / 0.8, 0, 1); g.fillStyle = col; g.fillRect(Math.round(e.x), Math.round(e.y), 1, 1);
      if (age < 0.2) { g.globalAlpha *= 0.35; g.fillRect(Math.round(e.x), Math.round(e.y) + 1, 1, 1); }
    }
    g.globalAlpha = 1;
    for (let i = T.embers.length - 1; i >= 0; i--) if (T.embers[i].life <= 0 || T.embers[i].y < -4) T.embers.splice(i, 1);
    if (T.embers.length > 140) T.embers.splice(0, T.embers.length - 140);
    compose(T);
    vignette(T, 0.8);
    if (T.dim > 0) { const c = T.cv.getContext('2d'); c.fillStyle = `rgba(14,12,22,${T.dim})`; c.fillRect(0, 0, T.dw, T.dh); }
  }

  // ======================= Bühne bei der Heldenwahl =======================
  const St = { cv: null, on: false, s: 6, bw: 0, bh: 0, t: 0, race: 'mensch', cls: 'klinge', poof: 0, motes: [], parts: [], stat: null, heroC: {} };
  layer(St, 'buf'); layer(St, 'lt'); layer(St, 'gl');
  function stageResize() {
    fitCanvas(St);
    St.s = Math.max(2, Math.round(St.dh / 42)); St.bw = Math.ceil(St.dw / St.s); St.bh = Math.ceil(St.dh / St.s);
    fitLayers(St, St.bw, St.bh); St.vig = null;
    St.cx = Math.round(St.bw / 2); St.fy = Math.round(St.bh * 0.6);
    St.stat = buildStage();
  }
  function buildStage() {
    const bw = St.bw, bh = St.bh, fy = St.fy, cx = St.cx;
    const cv = mk(bw, bh), c = cv.getContext('2d'); const img = c.createImageData(bw, bh), D = img.data;
    const put = (x, y, col, d) => { const i = (y * bw + x) * 4; D[i] = clamp(col[0] + d, 0, 255); D[i + 1] = clamp(col[1] + d, 0, 255); D[i + 2] = clamp(col[2] + d, 0, 255); D[i + 3] = 255; };
    const BR = ['#4a5478', '#454f70', '#505b80'].map(rgb), MO = rgb('#1f2338'), FL = ['#3d4663', '#394160', '#424b6a'].map(rgb), FMO = rgb('#1c2036');
    const ST = rgb('#8b9bb4'), STS = rgb('#5a6988'), STD = rgb('#262b44');
    for (let y = 0; y < bh; y++) for (let x = 0; x < bw; x++) {
      // Sockel (runde Steinplatte)
      const ex = (x + 0.5 - cx) / 15, eyT = (y + 0.5 - (fy + 1)) / 4, eyS = (y + 0.5 - (fy + 4)) / 4;
      if (ex * ex + eyT * eyT < 1) { const rim = ex * ex + eyT * eyT > 0.72; put(x, y, rim ? rgb('#c0cbdc') : ST, rim ? -10 : Math.round((hash(x, y, 31) - 0.5) * 10) - (eyT > 0 ? 10 : 0)); continue; }
      if (ex * ex + eyS * eyS < 1 && y > fy + 1) { put(x, y, y > fy + 6 || Math.abs(ex) > 0.93 ? STD : STS, Math.round((hash(x, y, 32) - 0.5) * 8)); continue; }
      if (y < fy) {
        const rr = fy - 1 - y, row = Math.floor(rr / 5), ry = rr % 5, off = row % 2 ? 5 : 0, xx = (x + off) % 10, ci = Math.floor((x + off) / 10);
        const fade = 0.4 + 0.6 * (y / fy);
        let col = (ry === 4 || xx === 0) ? MO : BR[Math.floor(hash(ci, row, 33) * BR.length)];
        col = [col[0] * fade, col[1] * fade, col[2] * fade];
        put(x, y, col, ry === 3 && xx !== 0 ? 8 : 0);
      } else {
        const k = Math.floor((y - fy) / 5), ry = (y - fy) % 5, sw = 12, off = (k % 2) * 6, xx = ((x - cx + off) % sw + sw) % sw, ci = Math.floor((x - cx + off) / sw);
        let col = (ry === 0 || xx === 0) ? FMO : FL[Math.floor(hash(ci, k, 34) * FL.length)];
        put(x, y, col, ry === 1 && xx !== 0 ? 6 : (y - fy < 1 ? -14 : 0));
      }
    }
    c.putImageData(img, 0, 0);
    St.braziers = [];
    const br = A.Art.sprite('brazier');
    for (const sx of [-1, 1]) { const bx = cx + sx * Math.min(Math.round(bw * 0.36), 38); if (bx - 6 < 0 || bx + 6 > bw) continue; c.drawImage(br.img, bx - Math.floor(br.w / 2), fy - br.h + 3); St.braziers.push({ x: bx, y: fy - br.h + 3 }); }
    return cv;
  }
  function stageFrame(dt) {
    const b = St.bufx, l = St.ltx, g = St.glx; St.t += dt; const t = St.t, cx = St.cx, fy = St.fy;
    begin(St, '#24203a'); b.drawImage(St.stat, 0, 0);
    for (const [i, br] of St.braziers.entries()) {
      const f = A.Art.sprite('flame', Math.floor(t * 10 + i * 1.3) % 3); b.drawImage(f.img, br.x - Math.floor(f.w / 2), br.y - f.h + 3);
      const fl = 0.85 + Math.sin(t * 12 + i * 2) * 0.08;
      light(l, br.x, br.y - 3, 30 * fl, '#ff9a3c', 0.9); light(g, br.x, br.y - 4, 4, '#fee761', 0.5);
    }
    // Lichtkegel von oben
    const glowCol = CLASS_GLOW[St.cls] || '#feae34';
    l.globalAlpha = 0.55; l.fillStyle = '#9a94c0'; l.beginPath(); l.moveTo(cx - 7, 0); l.lineTo(cx + 7, 0); l.lineTo(cx + 17, fy + 4); l.lineTo(cx - 17, fy + 4); l.closePath(); l.fill(); l.globalAlpha = 1;
    light(l, cx, fy - 8, 26, '#d8d0f0', 0.8); light(l, cx, fy + 2, 18, glowCol, 0.55);
    g.globalAlpha = 0.07; g.fillStyle = '#fff6c8'; g.beginPath(); g.moveTo(cx - 6, 0); g.lineTo(cx + 6, 0); g.lineTo(cx + 15, fy + 2); g.lineTo(cx - 15, fy + 2); g.closePath(); g.fill(); g.globalAlpha = 1;
    // Held auf dem Sockel
    const bob = Math.sin(t * 2.5) > 0.6 ? -1 : 0; const key = St.race + St.cls + bob;
    if (!St.heroC[key]) St.heroC[key] = heroImage(St.race, St.cls, 0, bob);
    const hx = cx - 20, hy = fy + 2 - 34; b.drawImage(St.heroC[key], hx, hy);
    if (St.poof > 0) { St.poof -= dt; if (St.whiteKey !== key) { St.whiteKey = key; St.white = A.Art.silhouette(St.heroC[key], '#ffffff'); } b.globalAlpha = clamp(St.poof / 0.2, 0, 1); b.drawImage(St.white, hx, hy); b.globalAlpha = 1; }
    // Staub im Lichtkegel
    if (St.motes.length < 14 && Math.random() < dt * 5) St.motes.push({ x: cx + rnd(-12, 12), y: rnd(2, fy), vy: rnd(-2, 2), vx: rnd(-1, 1), life: rnd(2, 5), max: 5 });
    for (const m of St.motes) { m.life -= dt; m.x += m.vx * dt; m.y += m.vy * dt; g.globalAlpha = Math.min(1, m.life, m.max - m.life) * 0.35; g.fillStyle = '#fff6c8'; g.fillRect(Math.round(m.x), Math.round(m.y), 1, 1); }
    for (let i = St.motes.length - 1; i >= 0; i--) if (St.motes[i].life <= 0) St.motes.splice(i, 1);
    for (const p of St.parts) { p.life -= dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 30 * dt; g.globalAlpha = clamp(p.life / 0.4, 0, 1); g.fillStyle = p.col; g.fillRect(Math.round(p.x), Math.round(p.y), 1, 1); }
    for (let i = St.parts.length - 1; i >= 0; i--) if (St.parts[i].life <= 0) St.parts.splice(i, 1);
    g.globalAlpha = 1;
    compose(St);
    vignette(St, 0.7);
  }

  // ======================= Ablauf =======================
  let last = 0, running = false;
  function loop(now) {
    if (!T.on && !St.on) { running = false; return; }
    requestAnimationFrame(loop);
    const dt = clamp((now - last) / 1000 || 0, 0, 0.05); last = now;
    if (T.on && T.cv && T.cv.isConnected !== false) titleFrame(dt);
    if (St.on && St.cv && St.cv.isConnected) stageFrame(dt);
  }
  function kick() { if (!running) { running = true; last = performance.now(); requestAnimationFrame(loop); } }
  const ro = new ResizeObserver((ents) => { for (const e of ents) { if (e.target === T.cv) titleResize(); else if (e.target === St.cv) stageResize(); } });

  return {
    // Titelbild zeigen; anchor = { top, bottom } in CSS-Pixeln: dazwischen steht das Tor
    title(canvas, opts) {
      opts = opts || {};
      if (T.cv !== canvas) { if (T.cv) ro.unobserve(T.cv); T.cv = canvas; ro.observe(canvas); }
      T.anchor = opts.anchor || null; T.dim = opts.dim || 0; if (opts.race) T.race = opts.race; if (opts.cls) T.cls = opts.cls;
      T.on = true; titleResize(); kick();
    },
    hideTitle() { T.on = false; },
    stage(canvas, race, cls) {
      if (!canvas) { if (St.cv) ro.unobserve(St.cv); St.on = false; St.cv = null; return; }
      const changed = St.on && (St.race !== race || St.cls !== cls);
      if (St.cv !== canvas) { if (St.cv) ro.unobserve(St.cv); St.cv = canvas; ro.observe(canvas); stageResize(); }
      St.race = race; St.cls = cls; St.on = true;
      if (changed) { St.poof = 0.2; for (let i = 0; i < 22; i++) { const a = rnd(0, TAU), sp = rnd(10, 34); St.parts.push({ x: St.cx + Math.cos(a) * 4, y: St.fy - 9 + Math.sin(a) * 6, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 12, life: rnd(0.3, 0.7), col: ['#fee761', '#ffffff', CLASS_GLOW[cls] || '#feae34'][i % 3] }); } }
      kick();
    },
  };
})();
