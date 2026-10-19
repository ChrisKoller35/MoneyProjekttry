// Der Abstieg – Ebenen-Bau: Räume in verschiedenen Formen (Rechteck, Achteck, Rund, Kreuz, L, Ring, Säulenhalle,
// Zwillingskammern, Insel, Becken, Stege ...), verbunden über Gänge, dazu Hindernisse und Gefahren je Welt.
// Kacheln: 0 Wand, 1 Boden, 2 verschlossene Tür, 3 Hindernis, 4 Grube (Wasser, Lava, Abgrund: nicht begehbar, Geschosse fliegen drüber),
//          5 Gefahr-Boden (Treibsand, Schlamm, seichtes Wasser, Glut: begehbar, bremst oder brennt)
'use strict';
window.A = window.A || {};

A.Levels = (function () {
  const GX = 4, GY = 4, CW = 17, CH = 13;   // Raster aus Zellen, je Zelle ein Raum
  const DX = 8, DY = 6;                      // Lage der Türen in der Zelle (zwei Kacheln breit: DX/DX+1 bzw. DY/DY+1)
  const MW = GX * CW, MH = GY * CH;
  const walk = (v) => v === 1 || v === 5;

  // ---------- Raumformen ----------
  // Liefert ein Raster (Zeilen) mit 0 Wand, 1 Boden, 3 Hindernis, 4 Grube, 5 Gefahr
  function shapeMask(kind, w, h, rng, wd) {
    const m = []; for (let y = 0; y < h; y++) m.push(new Array(w).fill(1));
    const cx = (w - 1) / 2, cy = (h - 1) / 2;
    const pit = wd.pit ? 4 : 0;
    switch (kind) {
      case 'octagon': {
        const c = Math.min(3, Math.floor(Math.min(w, h) / 3));
        for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (x + y < c || (w - 1 - x) + y < c || x + (h - 1 - y) < c || (w - 1 - x) + (h - 1 - y) < c) m[y][x] = 0;
        break;
      }
      case 'circle': {
        const rx = w / 2, ry = h / 2;
        for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const dx = (x - cx) / rx, dy = (y - cy) / ry; if (dx * dx + dy * dy > 1.08) m[y][x] = 0; }
        break;
      }
      case 'cross': {
        const ax = Math.max(2, Math.floor(w / 5)), ay = Math.max(2, Math.floor(h / 5));
        for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (Math.abs(x - cx) > ax + 0.5 && Math.abs(y - cy) > ay + 0.5) m[y][x] = 0;
        break;
      }
      case 'L': {
        const qw = Math.floor(w * 0.45), qh = Math.floor(h * 0.45), left = rng.chance(0.5), top = rng.chance(0.5);
        for (let y = 0; y < qh; y++) for (let x = 0; x < qw; x++) m[top ? y : h - 1 - y][left ? x : w - 1 - x] = 0;
        break;
      }
      case 'ring': {
        // Mitte versperrt: Mauerblock, in Welten mit Gruben ein Teich, Kanal oder Abgrund
        const fill = pit && rng.chance(0.7) ? 4 : 0;
        for (let y = 3; y < h - 3; y++) for (let x = 3; x < w - 3; x++) m[y][x] = fill;
        break;
      }
      case 'pillars': {
        for (let y = 2; y < h - 2; y += 3) for (let x = 2; x < w - 2; x += 3) m[y][x] = 3;
        break;
      }
      case 'twin': {
        // zwei Kammern, getrennt durch eine Mauer mit Durchgang
        if (w >= h) { const wx = Math.floor(w / 2), gy = rng.int(1, h - 3); for (let y = 0; y < h; y++) if (y !== gy && y !== gy + 1) m[y][wx] = 0; }
        else { const wy = Math.floor(h / 2), gx = rng.int(1, w - 3); for (let x = 0; x < w; x++) if (x !== gx && x !== gx + 1) m[wy][x] = 0; }
        break;
      }
      case 'island': {
        // Graben rund um eine Insel, Brücken in der Mitte jeder Seite
        for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
          const d = Math.min(x, y, w - 1 - x, h - 1 - y);
          if ((d === 2 || d === 3) && Math.abs(x - cx) > 1 && Math.abs(y - cy) > 1) m[y][x] = pit || 3;
        }
        break;
      }
      case 'pool': {
        // Becken mit Gefahr-Boden in der Mitte (Treibsand, Schlamm, Glut, seichtes Wasser)
        const rx = Math.max(2, w / 3), ry = Math.max(1.6, h / 3);
        for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const dx = (x - cx) / rx, dy = (y - cy) / ry; const d = dx * dx + dy * dy; if (d < 1) m[y][x] = 5; }
        if (pit) for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const dx = (x - cx) / (rx * 0.45), dy = (y - cy) / (ry * 0.45); if (dx * dx + dy * dy < 1) m[y][x] = 4; }
        break;
      }
      case 'stripes': {
        // Gräben quer durch den Raum, je mit einem Steg
        const vert = w >= h;
        if (vert) for (let x = 3; x < w - 3; x += 4) { const g = rng.int(1, h - 3); for (let y = 0; y < h; y++) if (y !== g && y !== g + 1) m[y][x] = pit || 3; }
        else for (let y = 3; y < h - 3; y += 4) { const g = rng.int(1, w - 3); for (let x = 0; x < w; x++) if (x !== g && x !== g + 1) m[y][x] = pit || 3; }
        break;
      }
      case 'garden': {
        // verstreute Hindernisse (Bäume, Kakteen, Korallen ...) und kleine Gefahrenflecken
        for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) if (rng.chance(0.09)) m[y][x] = 3;
        if (wd.hazard) for (let i = 0; i < 3; i++) { const px = rng.int(2, w - 3), py = rng.int(2, h - 3); for (let y = py - 1; y <= py + 1; y++) for (let x = px - 2; x <= px + 2; x++) if (m[y] && m[y][x] === 1 && rng.chance(0.75)) m[y][x] = 5; }
        break;
      }
      case 'hall': {
        // grosse Halle: Achteck mit Säulenpaaren
        const c = 2;
        for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (x + y < c || (w - 1 - x) + y < c || x + (h - 1 - y) < c || (w - 1 - x) + (h - 1 - y) < c) m[y][x] = 0;
        for (const [px, py] of [[3, 3], [w - 4, 3], [3, h - 4], [w - 4, h - 4]]) m[py][px] = 3;
        break;
      }
    }
    // Ränder des Rechtecks immer Wand, damit Wände sauber gezeichnet werden (nur Formen ohne eigenen Rand)
    return m;
  }

  const SMALL = ['rect', 'octagon', 'circle', 'rect'];
  const FIGHT = ['rect', 'octagon', 'circle', 'cross', 'L', 'ring', 'pillars', 'twin', 'island', 'pool', 'stripes', 'garden'];

  function pickShape(type, wd, rng) {
    if (type === 'boss') return { kind: rng.pick(['hall', 'octagon', 'circle']), w: 15, h: 11 };
    if (type === 'start') return { kind: rng.pick(['rect', 'octagon']), w: rng.int(9, 11), h: rng.int(7, 9) };
    if (type !== 'fight' && type !== 'elite') return { kind: rng.pick(SMALL), w: rng.int(9, 12), h: rng.int(7, 9) };
    // Kampfräume: Formen nach Welt gewichtet; Insel/Becken/Stege nur, wo die Welt Gruben oder Gefahr-Boden hat
    let list = FIGHT.filter(k => (k !== 'island' && k !== 'stripes') || wd.pit).filter(k => k !== 'pool' || wd.hazard);
    if (wd.favor) list = list.concat(wd.favor, wd.favor);
    const kind = rng.pick(list);
    const big = ['island', 'ring', 'pool', 'stripes', 'pillars', 'twin', 'cross'].includes(kind);
    return { kind, w: big ? rng.int(12, 15) : rng.int(9, 15), h: big ? rng.int(9, 11) : rng.int(7, 11) };
  }

  // ---------- Ganze Ebene ----------
  function gen(floor, seed, wd) {
    const rng = new A.RNG(seed);
    const n = Math.max(7, Math.min(12, 7 + Math.floor((floor - 1) / 3)));
    const key = (c) => c.x + ',' + c.y;
    const start = { x: rng.int(0, GX - 1), y: rng.int(0, GY - 1) };
    const cells = [start], edges = [];
    let guard = 0;
    while (cells.length < n && guard++ < 2000) {
      const from = rng.pick(cells);
      for (const [dx, dy] of rng.shuffle([[1, 0], [-1, 0], [0, 1], [0, -1]])) {
        const c = { x: from.x + dx, y: from.y + dy };
        if (c.x < 0 || c.y < 0 || c.x >= GX || c.y >= GY || cells.some(p => key(p) === key(c))) continue;
        cells.push(c); edges.push([from, c]); break;
      }
    }
    // ein paar Extra-Verbindungen für Rundwege
    for (let i = 0; i < cells.length; i++) for (let j = i + 1; j < cells.length; j++) {
      const a = cells[i], b = cells[j];
      if (Math.abs(a.x - b.x) + Math.abs(a.y - b.y) !== 1) continue;
      if (edges.some(([p, q]) => (key(p) === key(a) && key(q) === key(b)) || (key(p) === key(b) && key(q) === key(a)))) continue;
      if (rng.chance(0.25)) edges.push([a, b]);
    }
    // Entfernung vom Start: der fernste Raum wird Treppe oder Boss
    const distMap = { [key(start)]: 0 }; const queue = [start];
    while (queue.length) { const c = queue.shift(); for (const [p, q] of edges) { const o = key(p) === key(c) ? q : key(q) === key(c) ? p : null; if (o && distMap[key(o)] == null) { distMap[key(o)] = distMap[key(c)] + 1; queue.push(o); } } }
    const far = cells.slice().sort((a, b) => distMap[key(b)] - distMap[key(a)])[0];
    const types = {}; types[key(start)] = 'start'; types[key(far)] = A.isBossFloor(floor) ? 'boss' : 'stairs';
    const rest = cells.filter(c => !types[key(c)]);
    const pool = ['shrine', 'fight', 'fight'];
    if (floor >= 2) pool.push('elite');
    const extra = rng.shuffle(['shop', 'treasure', 'rest', 'event', 'fight', floor >= 6 ? 'elite' : 'fight', 'fight', 'treasure', 'fight', 'event', 'fight']);
    while (pool.length < rest.length) pool.push(extra.shift() || 'fight');
    rng.shuffle(rest).forEach((c, i) => types[key(c)] = pool[i]);

    // Kacheln
    const tiles = []; for (let y = 0; y < MH; y++) tiles.push(new Array(MW).fill(0));
    const rooms = cells.map((c, i) => {
      const type = types[key(c)];
      const sh = pickShape(type, wd, rng);
      const w = sh.w, h = sh.h;
      // Lage in der Zelle: die Türlinien (DX, DY) müssen im Raum liegen
      const ox = rng.int(Math.max(1, DX + 2 - w), Math.min(CW - 1 - w, DX)), oy = rng.int(Math.max(1, DY + 2 - h), Math.min(CH - 1 - h, DY));
      const r = { i, cx: c.x, cy: c.y, type, shape: sh.kind, x: c.x * CW + ox, y: c.y * CH + oy, w, h, doors: [], cleared: false, used: false, visited: false, props: [] };
      stamp(r, shapeMask(sh.kind, w, h, rng, wd));
      return r;
    });
    function stamp(r, mask) { for (let y = 0; y < r.h; y++) for (let x = 0; x < r.w; x++) tiles[r.y + y][r.x + x] = mask[y][x]; }
    const roomAt = (c) => rooms.find(r => r.cx === c.x && r.cy === c.y);
    // Gänge: von der Zellgrenze nach innen, bis begehbarer Boden erreicht ist
    function carve(r) {
      for (const [p, q] of edges) {
        const a = roomAt(p), b = roomAt(q); if (a !== r && b !== r) continue;
        const o = a === r ? b : a;
        if (o.cy === r.cy) {
          const yy = r.cy * CH + DY, dir = o.cx > r.cx ? 1 : -1;
          let x = dir > 0 ? r.cx * CW + CW - 1 : r.cx * CW;
          for (let k = 0; k < CW; k++, x -= dir) { if (walk(tiles[yy][x]) && walk(tiles[yy + 1][x]) && k > 0) break; tiles[yy][x] = 1; tiles[yy + 1][x] = 1; }
        } else {
          const xx = r.cx * CW + DX, dir = o.cy > r.cy ? 1 : -1;
          let y = dir > 0 ? r.cy * CH + CH - 1 : r.cy * CH;
          for (let k = 0; k < CH; k++, y -= dir) { if (walk(tiles[y][xx]) && walk(tiles[y][xx + 1]) && k > 0) break; tiles[y][xx] = 1; tiles[y][xx + 1] = 1; }
        }
      }
    }
    rooms.forEach(carve);
    for (const [p, q] of edges) {
      const a = roomAt(p), b = roomAt(q); const door = [];
      if (p.y === q.y) { const l = Math.min(p.x, q.x); const x0 = l * CW + CW - 1, yy = p.y * CH + DY; door.push([x0, yy], [x0 + 1, yy], [x0, yy + 1], [x0 + 1, yy + 1]); }
      else { const t = Math.min(p.y, q.y); const y0 = t * CH + CH - 1, xx = p.x * CW + DX; door.push([xx, y0], [xx, y0 + 1], [xx + 1, y0], [xx + 1, y0 + 1]); }
      a.doors.push(...door); b.doors.push(...door);
    }
    // Erreichbarkeit prüfen: Räume, deren Mitte oder Türen nicht erreichbar sind, werden zu einfachen Rechtecken
    const sr = rooms.find(r => r.type === 'start');
    let reach = null;
    for (let pass = 0; pass < 4; pass++) {
      reach = flood(tiles, sr.x + Math.floor(sr.w / 2), sr.y + Math.floor(sr.h / 2));
      let bad = false;
      for (const r of rooms) {
        const ok = r.doors.every(([x, y]) => reach[y * MW + x]) && countReach(reach, r) >= r.w * r.h * 0.35;
        if (!ok) { bad = true; r.shape = 'rect'; const m = shapeMask('rect', r.w, r.h, rng, wd); stamp(r, m); carve(r); }
      }
      if (!bad) break;
    }
    // Hindernisse in Ecken (Fässer, Kisten, Töpfe ... je Welt) und aus den Formen
    const rngF = new A.RNG((seed ^ 0x7f4a7c15) >>> 0 || 3);
    for (const r of rooms) {
      r.furn = [];
      for (let y = r.y; y < r.y + r.h; y++) for (let x = r.x; x < r.x + r.w; x++) if (tiles[y][x] === 3) r.furn.push({ tx: x, ty: y, kind: rngF.pick(wd.obst) });
      if (r.type === 'boss' || r.type === 'start') continue;
      for (const [tx, ty] of [[r.x, r.y], [r.x + r.w - 1, r.y], [r.x, r.y + r.h - 1], [r.x + r.w - 1, r.y + r.h - 1]]) {
        if (!rngF.chance(0.4) || tiles[ty][tx] !== 1) continue;
        // nicht neben einen Gang stellen
        if ([[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => r.doors.some(([x, y]) => Math.abs(x - tx - dx) + Math.abs(y - ty - dy) === 0))) continue;
        tiles[ty][tx] = 3; r.furn.push({ tx, ty, kind: rngF.pick(wd.corner || ['barrel', 'crate', 'pot', 'barrel']) });
      }
    }
    reach = flood(tiles, sr.x + Math.floor(sr.w / 2), sr.y + Math.floor(sr.h / 2));
    // Ankerpunkt je Raum: erreichbarer Boden nahe der Mitte mit Platz rundherum (für Truhe, Feuer, Treppe, Held)
    for (const r of rooms) r.anchor = anchorOf(tiles, reach, r);
    return { rooms, tiles, edges, start: sr, reach };
  }
  function countReach(reach, r) { let n = 0; for (let y = r.y; y < r.y + r.h; y++) for (let x = r.x; x < r.x + r.w; x++) if (reach[y * MW + x]) n++; return n; }
  function flood(tiles, sx, sy) {
    const reach = new Uint8Array(MW * MH); const q = [];
    // Startpunkt: nächster begehbarer Punkt
    if (!walk(tiles[sy][sx])) { outer: for (let d = 1; d < 8; d++) for (let y = sy - d; y <= sy + d; y++) for (let x = sx - d; x <= sx + d; x++) if (tiles[y] && walk(tiles[y][x])) { sx = x; sy = y; break outer; } }
    reach[sy * MW + sx] = 1; q.push(sx, sy);
    while (q.length) {
      const y = q.pop(), x = q.pop();
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= MW || ny >= MH) continue;
        const k = ny * MW + nx; if (reach[k]) continue; const v = tiles[ny][nx];
        if (walk(v) || v === 2) { reach[k] = 1; q.push(nx, ny); }
      }
    }
    return reach;
  }
  function anchorOf(tiles, reach, r) {
    const cx = r.x + Math.floor(r.w / 2), cy = r.y + Math.floor(r.h / 2);
    const free = (x, y) => { for (let yy = y - 1; yy <= y + 1; yy++) for (let xx = x - 1; xx <= x + 1; xx++) if (!tiles[yy] || tiles[yy][xx] !== 1 || !reach[yy * MW + xx]) return false; return true; };
    for (let d = 0; d < 8; d++) for (let y = cy - d; y <= cy + d; y++) for (let x = cx - d; x <= cx + d; x++) {
      if (Math.max(Math.abs(x - cx), Math.abs(y - cy)) !== d) continue;
      if (x > r.x && y > r.y && x < r.x + r.w - 1 && y < r.y + r.h - 1 && free(x, y)) return { tx: x, ty: y };
    }
    return { tx: cx, ty: cy };
  }

  return { GX, GY, CW, CH, DX, DY, MW, MH, gen, flood, shapeMask, walk };
})();
