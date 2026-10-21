// Der Abstieg – Bühnenbilder der Menüs, als Pixel-Grafik aus Code:
// Titelbild: Mauer mit Tor in die Tiefe, Fackeln, aufsteigende Glut, Fledermäuse, der Held davor.
// Heldenwahl: kleine Bühne mit Lichtkegel, Sockel, Feuerschalen und dem gewählten Helden.
// Lager: Nacht vor dem Eingang in die Tiefe, die Gebäude wachsen mit ihren Stufen.
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

  // ======================= Lager =======================
  // Nacht über dem Lager: hinten der Eingang in die Tiefe mit den Wimpeln der besiegten Weltenbosse, davor die Gebäude,
  // in der Mitte das Feuer mit den Völkern. Jedes Gebäude wächst sichtbar mit seiner Stufe; offene Bauplätze zeigen Pfähle.
  const C = { cv: null, on: false, s: 4, bw: 0, bh: 0, t: 0, st: null, stat: null, parts: [], smoke: [], embers: [], flies: [], twinkle: [], shoot: null, nextShoot: 5, beat: -1, wob: {}, coin: null, fire: [] };
  layer(C, 'buf'); layer(C, 'lt'); layer(C, 'gl');
  // Platz je Gebäude: Abstand zur Mitte, Reihe (b = hinten beim Eingang, f = vorne beim Feuer)
  // b: hintere Reihe (beim Eingang), f: vordere Reihe (beim Feuer), m: dazwischen am Rand
  const CAMP_POS = { schreib: [-62, 'b'], platz: [-37, 'b'], schmiede: [41, 'b'], zelt: [67, 'b'], brunnen: [-60, 'f'], kiste: [-37, 'f'], feuer: [0, 'f'], kessel: [37, 'f'], segen: [60, 'f'], tier: [-82, 'm'] };
  // Völker am Feuer: Rasse, Kleidung, Abstand zum Feuer
  const CAMP_NPC = [['mensch', 'klinge', -13, 1], ['fels', 'brau', 13, 1], ['schatten', 'weber', -22, -4], ['pilz', 'rufer', 22, -4], ['kobold', 'schuetze', 5, -9]];
  const CAMP_FLAGS = ['schleimkoenig', 'dornenmutter', 'sandpharao', 'kraken', 'rostkoenig', 'waechter'];
  const spr = (n, f, pal, key) => A.Art.sprite(n, f, pal, key);
  function blit(b, s, x, y, flip) { if (s) b.drawImage(flip ? A.Art.flipped(s) : s.img, Math.round(x - s.w / 2), Math.round(y - s.h)); }
  function shade(b, x, y, rx) { b.globalAlpha = 0.4; b.fillStyle = '#0d0a12'; b.fillRect(Math.round(x - rx), Math.round(y) - 1, Math.round(rx * 2), 2); b.fillRect(Math.round(x - rx + 2), Math.round(y) + 1, Math.round(rx * 2 - 4), 1); b.globalAlpha = 1; }
  const campLv = (id) => (C.st && C.st.lv[id]) || 0;
  function campXY(id) {
    const p = CAMP_POS[id];
    if (p) { let x = C.cx + p[0]; if (id === 'tier' && x < 18) x = C.cx - 48;   // schmal (Handy): die Tierhütte rückt zwischen die Gebäude
      return { x: Math.max(12, x), y: p[1] === 'b' ? C.yb : p[1] === 'm' ? C.gy + 34 : C.yf }; }
    const n = CAMP_NPC.find(q => 'race_' + q[0] === id); if (n) return { x: C.cx + n[2], y: C.yf + n[3] - 8 };
    return { x: C.cx, y: C.yf };
  }

  function campResize() {
    fitCanvas(C);
    C.s = Math.max(2, Math.min(Math.round(C.dh / 92), Math.floor(C.dw / 160)));
    C.bw = Math.ceil(C.dw / C.s); C.bh = Math.ceil(C.dh / C.s);
    fitLayers(C, C.bw, C.bh); C.vig = null;
    C.cx = Math.round(C.bw / 2); C.gy = Math.max(18, C.bh - 60); C.yb = C.gy + 19; C.yf = C.gy + 49;
    C.flies = []; for (let i = 0; i < 8; i++) C.flies.push({ x: rnd(0, C.bw), y: rnd(C.gy + 6, C.bh - 3), ph: rnd(0, TAU), sp: rnd(0.25, 0.7), r: rnd(6, 16) });
    C.stat = buildCamp();
  }

  function buildCamp() {
    const bw = C.bw, bh = C.bh, gy = C.gy, cx = C.cx, yb = C.yb, yf = C.yf, st = C.st || { rank: 0, troph: {} };
    const cv = mk(bw, bh), c = cv.getContext('2d'); const img = c.createImageData(bw, bh), D = img.data;
    const put = (x, y, col, d) => { if (x < 0 || y < 0 || x >= bw || y >= bh) return; const i = (y * bw + x) * 4; D[i] = clamp(col[0] + (d || 0), 0, 255); D[i + 1] = clamp(col[1] + (d || 0), 0, 255); D[i + 2] = clamp(col[2] + (d || 0), 0, 255); D[i + 3] = 255; };
    const SKY = ['#0f0c1c', '#151330', '#1c1b3e', '#24254c', '#2d305a', '#373b66'].map(rgb);
    const FAR = rgb('#1c1d38'), FAR2 = rgb('#56609a'), NEAR = rgb('#151b2c'), PINE = rgb('#11201c');
    const GR = ['#1f3b2d', '#22422f', '#1c3529', '#264833'].map(rgb), PATH = ['#3b2d2b', '#413130', '#362927'].map(rgb);
    const ROCK = ['#2e2b42', '#34304a', '#29263b'].map(rgb), ST = ['#5a6988', '#66759a', '#4f5c7e'].map(rgb), STD = rgb('#262b44'), DARK = rgb('#0b0910');
    // Himmel in Stufen mit Schachbrett-Übergang
    for (let y = 0; y < gy; y++) for (let x = 0; x < bw; x++) {
      const k = clamp(y / gy * (SKY.length - 1) + (((x + y) & 1) ? 0.25 : -0.25), 0, SKY.length - 1);
      put(x, y, SKY[Math.round(k)], 0);
    }
    // Sterne (einige funkeln später)
    C.twinkle = [];
    const nStar = Math.round(bw * gy / 45);
    for (let i = 0; i < nStar; i++) {
      const x = Math.floor(hash(i, 1, 71) * bw), y = Math.floor(hash(i, 2, 71) * (gy - 8)), v = hash(i, 3, 71);
      put(x, y, rgb(v > 0.85 ? '#fff6c8' : v > 0.5 ? '#c0cbdc' : '#6d7aa0'), 0);
      if (v > 0.9) C.twinkle.push({ x, y, ph: hash(i, 4, 71) * TAU });
    }
    // Mond (Sichel) oben rechts
    const mx = bw - Math.max(16, Math.round(bw * 0.14)), my = Math.max(7, Math.round(gy * 0.3)), mr = 6;
    for (let y = -mr; y <= mr; y++) for (let x = -mr; x <= mr; x++) {
      const inA = x * x + y * y <= mr * mr, inB = (x + 3) * (x + 3) + (y - 1) * (y - 1) <= (mr - 0.5) * (mr - 0.5);
      if (inA && !inB) put(mx + x, my + y, rgb(x > 3 ? '#fff6c8' : '#e4d9b8'), (hash(x, y, 77) < 0.15) ? -22 : 0);
    }
    C.moon = { x: mx, y: my };
    // Berge weit hinten, davor Hügel mit Tannen
    for (let x = 0; x < bw; x++) {
      const h1 = Math.round(10 + 5 * Math.sin(x * 0.06 + 1.3) + 3 * Math.sin(x * 0.17 + 0.4) + 2 * Math.sin(x * 0.41));
      const hp = Math.round(10 + 5 * Math.sin((x - 1) * 0.06 + 1.3) + 3 * Math.sin((x - 1) * 0.17 + 0.4) + 2 * Math.sin((x - 1) * 0.41));
      for (let y = gy - h1; y < gy; y++) put(x, y, y === gy - h1 || (y < gy - hp && x > 0) ? FAR2 : FAR, (y - (gy - h1)) * -1);
      // Schnee auf den Gipfeln
      if (h1 >= 15) { put(x, gy - h1, rgb('#c0cbdc'), 0); put(x, gy - h1 + 1, rgb('#8b9bb4'), 0); }
      const h2 = Math.round(4 + 2 * Math.sin(x * 0.09 + 2.2) + 1.5 * Math.sin(x * 0.23 + 1));
      for (let y = gy - h2; y < gy; y++) put(x, y, NEAR, 0);
    }
    for (let i = 0, x = -2; x < bw + 4; i++) {
      const h = 4 + Math.floor(hash(i, 7, 72) * 6), w = Math.ceil(h / 2);
      for (let yy = 0; yy < h; yy++) { const ww = Math.floor((yy + 1) / h * w); for (let xx = -ww; xx <= ww; xx++) put(x + xx, gy - 2 - h + yy + 1, PINE, 0); }
      for (let yy = 0; yy < 2; yy++) put(x, gy - 1 + yy, PINE, 0);
      x += 3 + Math.floor(hash(i, 8, 72) * 6);
    }
    // Boden: Gras, Weg vom Eingang zum Feuer und weiter nach vorn, festgetretener Kreis ums Feuer
    for (let y = gy; y < bh; y++) for (let x = 0; x < bw; x++) {
      const near = (y - gy) / (bh - gy);
      const pw = y < yb ? 0 : y < yf ? 3 + (y - yb) / (yf - yb) * 3 : 6 + (y - yf) * 0.8;
      const ex = (x + 0.5 - cx) / 30, ey = (y + 0.5 - (yf - 2)) / 8;
      const onPath = pw > 0 && Math.abs(x + 0.5 - cx) < pw + (hash(x, y, 73) < 0.3 ? 1 : 0);
      if (onPath || ex * ex + ey * ey < 1 - hash(x, y, 74) * 0.12) { put(x, y, PATH[Math.floor(hash(x, y, 75) * 3)], Math.round(near * 6)); continue; }
      let col = GR[Math.floor(hash(x >> 1, y, 76) * 4)];
      put(x, y, col, Math.round(near * 8 + (hash(x, y, 78) - 0.5) * 6));
    }
    // Grasbüschel
    for (let i = 0; i < bw * 0.6; i++) {
      const x = Math.floor(hash(i, 9, 79) * bw), y = gy + 3 + Math.floor(hash(i, 10, 79) * (bh - gy - 3));
      if (Math.abs(x - cx) < 9 && y > yb) continue;
      put(x, y, rgb('#3e8948'), -20); put(x, y - 1, rgb('#3e8948'), -10); if (hash(i, 11, 79) < 0.5) put(x + 1, y, rgb('#3e8948'), -25);
    }
    // Hügel mit dem Eingang in die Tiefe
    const rx = 24, ry = 27, ar = 6, top = yb - 12;
    for (let y = yb - ry; y < yb + 1; y++) for (let x = cx - rx - 1; x <= cx + rx + 1; x++) {
      const dx = (x + 0.5 - cx) / rx, dy = (y + 0.5 - yb) / ry; const d = dx * dx + dy * dy; if (d > 1) continue;
      const ox = x + 0.5 - cx, inOpen = (y >= top && y < yb && Math.abs(ox) < ar) || (y < top && ox * ox + (y + 0.5 - top) * (y + 0.5 - top) < ar * ar);
      const inFrame = !inOpen && ((y >= top && y < yb && Math.abs(ox) < ar + 2) || (y < top && ox * ox + (y + 0.5 - top) * (y + 0.5 - top) < (ar + 2) * (ar + 2)));
      if (inOpen) {
        // Stufen nach unten, tiefer wird es rot
        const deep = clamp((y - top + ar) / (yb - top + ar), 0, 1), step = (yb - 1 - y) % 3 === 0 && y > top + 1;
        put(x, y, step ? mix(rgb('#3a3346'), rgb('#7a3a32'), 1 - deep) : mix(DARK, rgb('#2a0f12'), 1 - deep), 0); continue;
      }
      if (inFrame) { const blk = Math.floor(Math.atan2(y + 0.5 - top, ox) * 3 + 10) + (y >= top ? Math.floor((yb - y) / 3) : 0); put(x, y, ((x + y) % 7 === 0) ? STD : ST[blk % 3], (hash(x, y, 80) - 0.5) * 8); continue; }
      if (d > 0.86 && y < yb - 2 && dy < -0.25) { put(x, y, rgb(hash(x, y, 81) < 0.5 ? '#2a5a3a' : '#22462f'), 0); continue; }   // Gras oben auf dem Hügel
      put(x, y, ROCK[Math.floor(hash(x >> 1, y >> 1, 82) * 3)], Math.round((hash(x, y, 83) - 0.5) * 8 - dy * 6));
    }
    c.putImageData(img, 0, 0);
    // Wimpelkette über dem Eingang: links und rechts je drei Weltenbosse, golden bei zwei Sternen
    const ly = yb - 22, sagAt = (x) => Math.round(3 * Math.cos((x - cx) / 22 * Math.PI / 2));
    for (const sx of [-1, 1]) { const px = cx + sx * 22; c.fillStyle = '#181425'; c.fillRect(px - 1, ly - 2, 3, yb - ly - 3); c.fillStyle = '#733e39'; c.fillRect(px, ly - 1, 1, yb - ly - 5); }
    c.fillStyle = '#8f6a4a';
    for (let x = cx - 21; x <= cx + 21; x++) c.fillRect(x, ly + sagAt(x), 1, 1);
    CAMP_FLAGS.forEach((id, i) => {
      const n = st.troph[id] || 0; if (!n) return;
      const side = i < 3 ? -1 : 1, k = side < 0 ? 2 - i % 3 : i % 3, x = cx + side * (6 + k * 6);
      const bc = (A.BOSSES[id] && A.BOSSES[id].color) || '#e43b44';
      const pal = n >= 2 ? { C: '#feae34', H: '#fee761', Y: bc } : { C: bc, H: '#ffffff', Y: '#fee761' };
      const s = spr('c_pennant', 0, pal, id + n); c.drawImage(s.img, x - Math.floor(s.w / 2), ly + sagAt(x));
    });
    // Palisade ab Lager-Stufe 15
    if (st.rank >= 15) {
      const sk = spr('c_stake');
      for (let x = 3; x < bw; x += 4) { if (Math.abs(x - cx) < rx + 4) continue; c.drawImage(sk.img, x - 2, gy + 8 - sk.h + (hash(x, 1, 84) < 0.4 ? 1 : 0)); }
    }
    return cv;
  }

  // ---------- Gebäude, je nach Stufe ----------
  const lamp = (L, x, y, r, col, a) => L.push([x, y, r, col, a]);
  function plot(D, L, x, y, can, t) {
    D.push({ y, f: (b, g) => { const s = spr('c_plot'); shade(b, x, y, 6); blit(b, s, x, y + 1); if (can) { const sp = spr('u_spark'); g.globalAlpha = 0.75 + Math.sin(t * 4) * 0.25; blit(g, sp, x, y - 9 + Math.round(Math.sin(t * 3) * 1.5)); g.globalAlpha = 1; } } });
    if (can) L.push([x, y - 9, 14 + Math.sin(t * 4) * 2, '#c77dff', 0.7]);
  }
  function campDraw(D, L, t) {
    const st = C.st, cx = C.cx, yb = C.yb, yf = C.yf;
    const open = (id) => st.open[id];
    const each = (id, fn) => { const lv = campLv(id), p = campXY(id); if (lv > 0) fn(p.x, p.y, lv); else if (open(id)) plot(D, L, p.x, p.y, st.can && st.can[id], t); };
    // Lagerfeuer: ohne Stufe nur Glut, dann ein bis drei Flammen, ab 4 ein Steinkreis, ab 7 ein Spiess mit Wurst
    { const lv = campLv('feuer'), x = cx, y = yf, n = lv >= 8 ? 3 : lv >= 4 ? 2 : lv >= 1 ? 1 : 0; C.fire = { x, y, n, lv };
      D.push({ y, f: (b, g) => {
        if (lv >= 4) for (let i = 0; i < 9; i++) { const a = Math.PI + i / 8 * Math.PI, sx = Math.round(x + Math.cos(a) * 10), sy = Math.round(y - 1 + Math.sin(a) * 3); b.fillStyle = '#181425'; b.fillRect(sx - 1, sy - 1, 4, 3); b.fillStyle = i % 2 ? '#5a6988' : '#8b9bb4'; b.fillRect(sx, sy, 2, 1); }
        if (lv >= 7) { b.fillStyle = '#181425'; b.fillRect(x - 9, y - 12, 3, 12); b.fillRect(x + 7, y - 12, 3, 12); b.fillStyle = '#733e39'; b.fillRect(x - 8, y - 11, 1, 11); b.fillRect(x + 8, y - 11, 1, 11); b.fillStyle = '#8b9bb4'; b.fillRect(x - 8, y - 12, 17, 1); }
        blit(b, spr('logs'), x, y + 1);
        const off = n === 3 ? [-5, 0, 5] : n === 2 ? [-3, 3] : n === 1 ? [0] : [];
        off.forEach((dx, i) => blit(b, spr('flame', Math.floor(t * 10 + i * 1.3) % 3), x + dx, y - 1 - (n === 3 && dx === 0 ? 2 : 0)));
        if (!n) { g.fillStyle = '#e43b44'; for (let i = 0; i < 4; i++) if (Math.sin(t * 3 + i * 1.9) > 0.2) g.fillRect(x - 4 + i * 3, y - 2, 1, 1); }
        if (lv >= 7) { b.fillStyle = '#181425'; b.fillRect(x - 3, y - 14, 7, 4); b.fillStyle = '#b86f50'; b.fillRect(x - 2, y - 13, 5, 2); b.fillStyle = '#e4a672'; b.fillRect(x - 1, y - 13, 2, 1); }
        if (lv >= 4) for (let i = 0; i < 7; i++) { const a = i / 6 * Math.PI, sx = Math.round(x + Math.cos(a) * 10), sy = Math.round(y - 1 + Math.sin(a) * 3); b.fillStyle = '#181425'; b.fillRect(sx - 1, sy - 1, 4, 3); b.fillStyle = i % 2 ? '#8b9bb4' : '#5a6988'; b.fillRect(sx, sy, 2, 1); }
      } });
      const fl = 0.86 + Math.sin(t * 13) * 0.06 + Math.sin(t * 7.3) * 0.05;
      if (n) { lamp(L, x, y - 6, (30 + lv * 2.5) * fl, '#ff9a3c', 0.95); lamp(L, x, y - 6, 12 + lv, '#fee761', 0.55); }
      else lamp(L, x, y - 2, 12, '#be4a2f', 0.6);
    }
    // Übungsplatz: eine, dann zwei Strohpuppen, ab Stufe 7 eine Zielscheibe, ganz ausgebaut trägt eine Puppe eine Krone; ab und zu wackelt eine
    each('platz', (x, y, lv) => {
      const xs = lv >= 4 ? [-6, 5] : [0];
      if (lv >= 7) D.push({ y: y + 2, f: (b) => { shade(b, x + 18, y + 2, 4); blit(b, spr('c_target'), x + 18, y + 3); } });
      xs.forEach((dx, i) => { const w = C.wob['p' + i] || 0, wx = w > 0 ? Math.round(Math.sin(w * 40) * Math.min(1, w * 3)) : 0;
        D.push({ y: y + i, f: (b) => { shade(b, x + dx, y + i, 4); blit(b, spr('c_dummy'), x + dx + wx, y + 1 + i); if (lv >= 10 && i === 1) blit(b, spr('crown'), x + dx + wx, y + i - 14); } }); });
    });
    // Schatzkiste: zu, dann offen mit Glanz, dann mit Goldhaufen
    each('kiste', (x, y, lv) => {
      D.push({ y, f: (b, g) => {
        shade(b, x, y, 8);
        if (lv >= 5) { const pile = [[-13, 0, 6], [-12, -1, 4], [-11, -2, 2], [10, 0, 5], [10, -1, 3]]; for (const [dx, dy, w] of pile) { b.fillStyle = '#be4a2f'; b.fillRect(x + dx - 1, y + dy - 1, w + 2, 2); b.fillStyle = '#feae34'; b.fillRect(x + dx, y + dy - 1, w, 1); b.fillStyle = '#fee761'; b.fillRect(x + dx + (w >> 1), y + dy - 1, 1, 1); } }
        blit(b, spr('chest', lv >= 3 ? 1 : 0), x, y + 1);
        if (lv >= 3) { const gp = (t * 0.45 + 0.3) % 1; if (gp > 0.9) { const q = Math.round(Math.sin((gp - 0.9) / 0.1 * Math.PI) * 2), gx = x - 3 + Math.round(hash(Math.floor(t * 0.45), 1, 85) * 6), gy2 = y - 8; g.fillStyle = '#ffffff'; g.fillRect(gx - q, gy2, q * 2 + 1, 1); g.fillRect(gx, gy2 - q, 1, q * 2 + 1); } }
      } });
      if (lv >= 3) lamp(L, x, y - 7, 10 + lv, '#feae34', 0.45);
    });
    // Kräuterkessel: blubbert über kleinem Feuer, daneben Tränke
    each('kessel', (x, y, lv) => {
      D.push({ y, f: (b, g) => {
        shade(b, x, y, 7);
        const pots = [[10, '#e43b44', '#a22633', '#f6757a'], [-10, '#63c74d', '#3e8948', '#c8f5a0'], [14, '#0099db', '#124e89', '#7fd8ff']].slice(0, Math.floor(lv / 2));
        pots.forEach(([dx, R1, r1, w1], i) => blit(b, spr('potion', 0, { R: R1, r: r1, w: w1 }, 'pot' + i), x + dx, y + 1));
        g.fillStyle = '#f77622'; for (let i = 0; i < 3; i++) if (Math.sin(t * 17 + i * 2.1) > -0.3) g.fillRect(x - 3 + i * 3, y - 1, 1, 1);
        g.fillStyle = '#fee761'; if (Math.sin(t * 11) > 0) g.fillRect(x, y - 1, 1, 1);
        blit(b, spr('c_cauldron'), x, y - 1);
      } });
      if (Math.random() < 0.016 * (2 + lv) * 60 * C.dt) C.parts.push({ x: x + rnd(-4, 4), y: y - 10, vx: rnd(-1, 1), vy: rnd(-5, -9), life: rnd(0.4, 0.9), col: Math.random() < 0.6 ? '#63c74d' : '#c8f5a0', sz: Math.random() < 0.3 ? 2 : 1 });
      lamp(L, x, y - 2, 13, '#f77622', 0.55); lamp(L, x, y - 9, 6 + lv, '#63c74d', 0.3);
    });
    // Schreibstube: Pult mit Buch, Kerze, Bücherregal, schwebende Zauberfunken
    each('schreib', (x, y, lv) => {
      if (lv >= 3) D.push({ y: y - 2, f: (b) => { shade(b, x - 9, y - 2, 7); blit(b, spr('c_shelf'), x - 9, y - 1); } });
      D.push({ y, f: (b, g) => {
        shade(b, x + 5, y, 5); blit(b, spr('c_lectern'), x + 5, y + 1);
        if (lv >= 2) { blit(b, spr('candle'), x + 13, y + 1); if (Math.sin(t * 14) > -0.5) { g.fillStyle = '#fee761'; g.fillRect(x + 13, y - 8, 1, 1); } }
        if (lv >= 4) for (let i = 0; i < 4; i++) { const a = t * 1.6 + i * TAU / 4; g.globalAlpha = 0.6 + Math.sin(t * 5 + i) * 0.3; g.fillStyle = i % 2 ? '#2ce8f5' : '#ffffff'; g.fillRect(Math.round(x + 5 + Math.cos(a) * 7), Math.round(y - 17 + Math.sin(a) * 2.5), 1, 1); g.globalAlpha = 1; }
      } });
      if (lv >= 2) lamp(L, x + 13, y - 8, 12, '#feae34', 0.6);
      if (lv >= 4) lamp(L, x + 5, y - 15, 12, '#2ce8f5', 0.45);
    });
    // Lagerschmiede: Amboss, Esse, Schmied, glühende Klinge
    each('schmiede', (x, y, lv) => {
      if (lv >= 2) D.push({ y: y - 1, f: (b) => { const es = spr('esse', Math.floor(t * 8) % 2); shade(b, x - 15, y - 1, 7); blit(b, es, x - 15, y); blit(b, spr('flame', Math.floor(t * 10) % 3), x - 15, y - es.h + 2); } });
      D.push({ y: y + 1, f: (b, g) => {
        shade(b, x + 11, y + 1, 5); blit(b, spr('anvil'), x + 11, y + 2);
        if (lv >= 4) { g.fillStyle = '#f77622'; g.fillRect(x + 8, y - 5, 6, 1); g.fillStyle = '#fee761'; g.fillRect(x + 9, y - 5, 3, 1); }
      } });
      if (lv >= 3) {
        const cyc = (t * 0.85) % 1, down = cyc > 0.72 && cyc < 0.9, beat = Math.floor(t * 0.85 + 0.28);
        if (beat !== C.beat && C.beat >= 0) { for (let i = 0; i < 7; i++) C.parts.push({ x: x + 6, y: y - 5, vx: rnd(-22, 22), vy: rnd(-30, -10), g: 70, life: rnd(0.25, 0.5), col: ['#fee761', '#feae34', '#ffffff'][i % 3], sz: 1, add: true }); C.flash = { x: x + 6, y: y - 5, life: 0.15 }; }
        C.beat = beat;
        D.push({ y, f: (b) => { shade(b, x - 2, y, 5); blit(b, spr('smith', down ? 1 : 0), x - 2, y + 1); } });
      }
      if (lv >= 2) lamp(L, x - 15, y - 7, 26 + Math.sin(t * 9) * 2, '#ff7a2c', 0.85);
      if (lv >= 4) lamp(L, x + 11, y - 5, 9, '#f77622', 0.6);
      if (C.flash && C.flash.life > 0) lamp(L, C.flash.x, C.flash.y, 20, '#feae34', C.flash.life * 4);
    });
    // Händlerzelt: Stand, dann Händler, Laterne, Waren
    each('zelt', (x, y, lv) => {
      if (lv >= 2) D.push({ y: y - 1, f: (b) => { const bob = Math.sin(t * 1.8) > 0.6 ? -1 : 0; b.save(); b.beginPath(); b.rect(x - 12, 0, 24, y - 3); b.clip(); blit(b, spr('merchant'), x + 1, y + 4 + bob); b.restore(); } });
      D.push({ y, f: (b, g) => {
        shade(b, x, y, 10); blit(b, spr('c_stall'), x, y + 1);
        if (lv >= 4) { b.fillStyle = '#68386c'; b.fillRect(x - 6, y - 5, 12, 4); b.fillStyle = '#b55088'; b.fillRect(x - 6, y - 5, 12, 1); b.fillStyle = '#feae34'; for (let i = 0; i < 6; i++) b.fillRect(x - 6 + i * 2, y - 2, 1, 1); blit(b, spr('barrel'), x + 15, y + 1); }
        if (lv >= 3) { b.fillStyle = '#181425'; b.fillRect(x + 7, y - 14, 3, 4); g.fillStyle = Math.sin(t * 9) > -0.6 ? '#fee761' : '#feae34'; g.fillRect(x + 8, y - 13, 1, 2); }
      } });
      if (lv >= 3) lamp(L, x + 8, y - 12, 18, '#feae34', 0.75);
    });
    // Glücksbrunnen: Funkeln steigt auf, ab Stufe 3 fliegt ab und zu eine Münze hinein
    each('brunnen', (x, y, lv) => {
      D.push({ y, f: (b) => { shade(b, x, y, 8); blit(b, spr('c_well'), x, y + 1); } });
      if (Math.random() < 0.02 * lv * 60 * C.dt) C.parts.push({ x: x + rnd(-5, 5), y: y - 6, vx: rnd(-2, 2), vy: rnd(-8, -16), life: rnd(0.8, 1.5), col: ['#c77dff', '#2ce8f5', '#ffffff'][Math.floor(Math.random() * 3)], sz: 1, add: true });
      if (lv >= 3 && !C.coin && Math.random() < 0.25 * C.dt) C.coin = { x: x - 14, y: y - 4, vx: 14, vy: -30, life: 1.6 };
      lamp(L, x, y - 8, 8 + lv * 3, '#c77dff', 0.3 + lv * 0.1);
    });
    // Segensstein: Kugel schwebt, ab Stufe 2 mit Lichtsäule
    each('segen', (x, y, lv) => {
      D.push({ y, f: (b, g) => {
        shade(b, x, y, 6); blit(b, spr('shrine', Math.floor(t * 2) % 2), x, y + 1);
        if (lv >= 2) { g.globalAlpha = 0.1 + Math.sin(t * 2.4) * 0.04; g.fillStyle = '#2ce8f5'; g.fillRect(x - 2, 0, 5, y - 12); g.globalAlpha = 0.18; g.fillRect(x - 1, 0, 3, y - 12); g.globalAlpha = 1; }
      } });
      lamp(L, x, y - 11, 16 + lv * 4, '#2ce8f5', 0.65);
      if (Math.random() < 0.05 * lv * 60 * C.dt) C.parts.push({ x: x + rnd(-6, 6), y: y - 10, vx: 0, vy: rnd(-10, -20), life: rnd(0.6, 1), col: Math.random() < 0.5 ? '#2ce8f5' : '#ffffff', sz: 1, add: true });
    });
    // Tierhütte: Hütte mit Strohdach, ab Stufe 2 ein Futternapf, ab 4 ein Strohballen, ganz ausgebaut ein goldenes Pfotenschild
    each('tier', (x, y, lv) => {
      D.push({ y, f: (b, g) => {
        shade(b, x, y, 8);
        if (lv >= 4) { b.fillStyle = '#181425'; b.fillRect(x - 15, y - 5, 8, 6); b.fillStyle = '#feae34'; b.fillRect(x - 14, y - 4, 6, 4); b.fillStyle = '#fee761'; b.fillRect(x - 14, y - 4, 6, 1); b.fillStyle = '#be4a2f'; b.fillRect(x - 12, y - 4, 1, 4); }
        blit(b, spr('c_hut'), x, y + 1);
        if (lv >= 2) { b.fillStyle = '#181425'; b.fillRect(x + 8, y - 3, 7, 4); b.fillStyle = '#8b9bb4'; b.fillRect(x + 9, y - 2, 5, 2); b.fillStyle = '#b86f50'; b.fillRect(x + 10, y - 3, 3, 1); }
        if (lv >= 5) { const sg = spr('u_paw', 0, { m: '#feae34' }, 'gold'); blit(b, sg, x, y - 15); if (Math.sin(t * 2.2) > 0.6) { g.fillStyle = '#ffffff'; g.fillRect(x + 2, y - 21, 1, 1); } }
      } });
      if (lv >= 5) lamp(L, x, y - 18, 10, '#feae34', 0.4);
    });
    // Gefundene Begleiter dösen bei der Hütte: die Eule auf dem Dach, die anderen davor; ab und zu hüpft eins
    if (st.pets && st.pets.length) {
      const h = campXY('tier'), spots = [[-10, 5], [11, 6], [-1, 9], [20, 3], [-18, 9]];
      let k = 0;
      st.pets.forEach((id, i) => {
        const P = A.PETS[id]; if (!P) return;
        const owl = id === 'huhu', [dx, dy] = owl ? [1, -12] : spots[k++ % spots.length], x = Math.max(5, Math.min(C.bw - 5, h.x + dx)), y = h.y + dy, ph = i * 1.7;
        const hop = !owl && Math.sin(t * 1.3 + ph) > 0.93 ? -2 : 0, fr = owl ? (Math.sin(t * 0.8 + ph) > 0.85 ? 1 : 0) : (hop ? 1 : 0);
        D.push({ y: owl ? h.y + 1 : y, f: (b) => { if (!owl) shade(b, x, y, 4); blit(b, spr(P.spr, fr), x, y + 1 + hop, (i + Math.floor(t * 0.2 + ph)) % 2 === 1); } });
      });
    }
    // Laternen am Weg (ab Lager-Stufe 5), Wachturm (ab 30), Krone über dem Eingang (alles ausgebaut)
    if (st.rank >= 5) for (const sx of [-1, 1]) { const x = cx + sx * 12, y = yb + 9; D.push({ y, f: (b, g) => { blit(b, spr('c_lantern'), x, y + 1); g.fillStyle = '#fee761'; if (Math.sin(t * 8 + sx) > -0.7) g.fillRect(x, y - 10, 1, 1); } }); lamp(L, x, y - 10, 16, '#feae34', 0.7); }
    if (st.rank >= 30) { const x = cx - 30, y = C.gy + 9; D.push({ y, f: (b, g) => { blit(b, spr('c_tower'), x, y + 1); b.fillStyle = '#181425'; b.fillRect(x + 4, y - 20, 3, 4); b.fillStyle = '#733e39'; b.fillRect(x + 5, y - 19, 1, 3); g.fillStyle = Math.sin(t * 11) > -0.4 ? '#fee761' : '#f77622'; g.fillRect(x + 5, y - 21, 1, 2); } }); lamp(L, x + 5, y - 21, 20, '#ff9a3c', 0.8); }
    if (st.max) { const x = cx, y = yb - 27; D.push({ y: y - 50, f: (b) => blit(b, spr('crown'), x, y + Math.round(Math.sin(t * 2) * 0.6)) }); lamp(L, x, y - 3, 14, '#fee761', 0.6); }
    // Völker am Feuer (schauen zum Feuer)
    for (const [race, cls, dx, dy] of CAMP_NPC) {
      if (!st.races.includes(race)) continue;
      const x = cx + dx, y = yf + dy, ph = dx * 0.37, bob = Math.sin(t * 2 + ph) > 0.75 ? -1 : 0;
      D.push({ y, f: (b) => { shade(b, x, y, 5); blit(b, A.Art.heroSprite(race, cls, 0), x, y + 1 + bob, dx > 0); } });
    }
  }

  function campFrame(dt) {
    const b = C.bufx, l = C.ltx, g = C.glx; C.t += dt; C.dt = dt; const t = C.t;
    begin(C, '#50507e');
    b.drawImage(C.stat, 0, 0);
    // Mondlicht über dem Himmel, rote Glut aus dem Eingang
    light(l, C.moon.x, C.moon.y, C.bw * 0.9, '#9a96d0', 0.75); light(l, C.moon.x, C.moon.y, 12, '#fff6c8', 0.5); light(g, C.moon.x, C.moon.y, 9, '#fff6c8', 0.18);
    light(l, C.cx, C.gy - 4, C.bw * 0.7, '#7c78b8', 0.45);   // heller Streifen am Horizont
    const pulse = 0.85 + Math.sin(t * 1.7) * 0.1;
    light(l, C.cx, C.yb - 6, 22 * pulse, '#d4402a', 0.8); light(g, C.cx, C.yb - 4, 6 * pulse, '#f77622', 0.35);
    if (Math.random() < dt * 3) C.embers.push({ x: C.cx + rnd(-4, 4), y: C.yb - 4, vx: rnd(-3, 3), vy: rnd(-8, -14), life: rnd(1.2, 2.4), max: 2.4 });
    // Sterne funkeln, ab und zu eine Sternschnuppe
    for (const s of C.twinkle) { const a = 0.5 + Math.sin(t * 2.3 + s.ph) * 0.5; if (a > 0.6) { g.globalAlpha = a * 0.8; g.fillStyle = '#fff6c8'; g.fillRect(s.x - 1, s.y, 3, 1); g.fillRect(s.x, s.y - 1, 1, 3); g.globalAlpha = 1; } }
    C.nextShoot -= dt;
    if (C.nextShoot <= 0 && !C.shoot) { C.nextShoot = rnd(7, 14); C.shoot = { x: rnd(C.bw * 0.2, C.bw * 0.9), y: rnd(2, C.gy * 0.4), life: 0.7 }; }
    if (C.shoot) { const s = C.shoot; s.life -= dt; s.x -= 70 * dt; s.y += 26 * dt; for (let i = 0; i < 6; i++) { g.globalAlpha = clamp(s.life, 0, 1) * (1 - i / 6); g.fillStyle = '#ffffff'; g.fillRect(Math.round(s.x + i * 2.7), Math.round(s.y - i), 1, 1); } g.globalAlpha = 1; if (s.life <= 0) C.shoot = null; }
    // Gebäude und Figuren von hinten nach vorn
    const D = [], L = [];
    if (C.st) campDraw(D, L, t);
    D.sort((p, q) => p.y - q.y);
    for (const d of D) d.f(b, g);
    for (const [x, y, r, col, a] of L) light(l, x, y, r, col, a);
    // Feuer: Glut und Rauch
    const F = C.fire;
    if (F && F.n) { if (Math.random() < dt * (5 + F.n * 4)) C.embers.push({ x: F.x + rnd(-3, 3), y: F.y - 9, vx: rnd(-4, 4), vy: rnd(-14, -26), life: rnd(0.8, 1.8), max: 1.8 }); }
    if (F && Math.random() < dt * (F.n ? 1.6 : 0.8)) C.smoke.push({ x: F.x + rnd(-2, 2), y: F.y - (F.n ? 14 : 4), vx: rnd(2, 6), vy: rnd(-5, -8), life: rnd(2.5, 4), max: 4, r: rnd(1, 2) });
    for (const s of C.smoke) { s.life -= dt; s.x += s.vx * dt; s.y += s.vy * dt; s.r += dt * 0.8; b.globalAlpha = clamp(s.life / s.max, 0, 1) * 0.16; b.fillStyle = '#8b9bb4'; b.beginPath(); b.arc(Math.round(s.x), Math.round(s.y), s.r, 0, TAU); b.fill(); }
    b.globalAlpha = 1;
    for (let i = C.smoke.length - 1; i >= 0; i--) if (C.smoke[i].life <= 0) C.smoke.splice(i, 1);
    for (const e of C.embers) { e.life -= dt; e.x += (e.vx + Math.sin(t * 2 + e.y) * 3) * dt; e.y += e.vy * dt; const age = 1 - e.life / e.max; g.globalAlpha = clamp(e.life / 0.6, 0, 1); g.fillStyle = age < 0.35 ? '#fee761' : age < 0.7 ? '#feae34' : '#f77622'; g.fillRect(Math.round(e.x), Math.round(e.y), 1, 1); }
    g.globalAlpha = 1;
    for (let i = C.embers.length - 1; i >= 0; i--) if (C.embers[i].life <= 0) C.embers.splice(i, 1);
    if (C.embers.length > 90) C.embers.splice(0, C.embers.length - 90);
    // Münze für den Brunnen
    if (C.coin) { const k = C.coin; k.life -= dt; k.vy += 60 * dt; k.x += k.vx * dt; k.y += k.vy * dt; g.fillStyle = Math.floor(t * 12) % 2 ? '#fee761' : '#feae34'; g.fillRect(Math.round(k.x), Math.round(k.y), 1, 1); if (k.y > C.yf - 6 && k.vy > 0) { for (let i = 0; i < 5; i++) C.parts.push({ x: k.x, y: C.yf - 7, vx: rnd(-8, 8), vy: rnd(-14, -4), g: 40, life: 0.4, col: '#2ce8f5', sz: 1, add: true }); C.coin = null; } else if (k.life <= 0) C.coin = null; }
    // Glühwürmchen über dem Gras
    for (const f of C.flies) {
      f.ph += dt * f.sp; const x = f.x + Math.sin(f.ph * 1.3) * f.r, y = f.y + Math.sin(f.ph * 2.1) * 3, a = 0.5 + Math.sin(f.ph * 5) * 0.5;
      if (a > 0.3) { g.globalAlpha = a; g.fillStyle = '#c8f5a0'; g.fillRect(Math.round(x), Math.round(y), 1, 1); g.globalAlpha = 1; light(l, x, y, 5, '#9be37a', a * 0.4); }
    }
    // Funken und Teilchen (Blubbern, Glitzern, Ausbau-Wolke)
    for (const p of C.parts) {
      p.life -= dt; if (p.g) p.vy += p.g * dt; p.x += p.vx * dt; p.y += p.vy * dt;
      const L2 = p.add ? g : b; L2.globalAlpha = clamp(p.life / 0.3, 0, 1); L2.fillStyle = p.col; L2.fillRect(Math.round(p.x), Math.round(p.y), p.sz || 1, p.sz || 1);
    }
    b.globalAlpha = 1; g.globalAlpha = 1;
    for (let i = C.parts.length - 1; i >= 0; i--) if (C.parts[i].life <= 0) C.parts.splice(i, 1);
    if (C.flash) { C.flash.life -= dt; if (C.flash.life <= 0) C.flash = null; }
    for (const k in C.wob) { C.wob[k] -= dt; if (C.wob[k] <= 0) delete C.wob[k]; }
    if (Math.random() < dt * 0.3) C.wob['p' + Math.floor(Math.random() * 2)] = 0.5;
    if (C.glow) { C.glow.life -= dt; light(l, C.glow.x, C.glow.y, 30, '#fff6c8', clamp(C.glow.life * 2, 0, 1)); if (C.glow.life <= 0) C.glow = null; }
    compose(C);
    vignette(C, 0.55);
  }
  // Ausbau-Wolke: Funken in Gold, Weiss und Violett an der Stelle, die gerade gewachsen ist
  function campPoof(id) {
    const p = campXY(id), y = p.y - 8;
    for (let i = 0; i < 30; i++) { const a = rnd(0, TAU), sp = rnd(10, 40); C.parts.push({ x: p.x + Math.cos(a) * 3, y: y + Math.sin(a) * 3, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 14, g: 30, life: rnd(0.4, 0.9), col: ['#fee761', '#ffffff', '#c77dff'][i % 3], sz: i % 4 ? 1 : 2, add: true }); }
    C.glow = { x: p.x, y, life: 0.6 };
  }

  // ======================= Ablauf =======================
  let last = 0, running = false;
  function loop(now) {
    if (!T.on && !St.on && !C.on) { running = false; return; }
    requestAnimationFrame(loop);
    const dt = clamp((now - last) / 1000 || 0, 0, 0.05); last = now;
    if (T.on && T.cv && T.cv.isConnected !== false) titleFrame(dt);
    if (St.on && St.cv && St.cv.isConnected) stageFrame(dt);
    if (C.on && C.cv && C.cv.isConnected) campFrame(dt);
  }
  function kick() { if (!running) { running = true; last = performance.now(); requestAnimationFrame(loop); } }
  const ro = new ResizeObserver((ents) => { for (const e of ents) { if (e.target === T.cv) titleResize(); else if (e.target === St.cv) stageResize(); else if (e.target === C.cv) campResize(); } });

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
    // Lager zeigen; state = { lv, open, can, races, troph, rank, max }; opts.poof = Gebäude (oder race_…), das gerade gewachsen ist
    camp(canvas, state, opts) {
      if (!canvas) { if (C.cv) ro.unobserve(C.cv); C.on = false; C.cv = null; return; }
      const changed = JSON.stringify(state) !== JSON.stringify(C.st);
      C.st = state;
      if (C.cv !== canvas) { if (C.cv) ro.unobserve(C.cv); C.cv = canvas; ro.observe(canvas); campResize(); }
      else if (changed) C.stat = buildCamp();
      C.on = true;
      if (opts && opts.poof) campPoof(opts.poof);
      kick();
    },
  };
})();
