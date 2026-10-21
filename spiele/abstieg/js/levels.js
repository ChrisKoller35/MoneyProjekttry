// Der Abstieg – Ebenen-Bau: Räume in verschiedenen Formen (Rechteck, Achteck, Rund, Kreuz, L, Ring, Säulenhalle,
// Zwillingskammern, Insel, Becken, Stege ...), verbunden über Gänge, dazu Hindernisse und Gefahren je Welt.
// Kacheln: 0 Wand, 1 Boden, 2 verschlossene Tür, 3 Hindernis, 4 Grube (Wasser, Lava, Abgrund: nicht begehbar, Geschosse fliegen drüber),
//          5 Gefahr-Boden (Treibsand, Schlamm, seichtes Wasser, Glut: begehbar, bremst oder brennt)
'use strict';
window.A = window.A || {};

A.Levels = (function () {
  // Raster aus Zellen, je Zelle ein Raum; DX/DY: Lage der Türen in der Zelle (zwei Kacheln breit: DX/DX+1 bzw. DY/DY+1).
  // Grosse Räume (Ebenen-Bau 4): Zellen und Räume rund 1.4-mal so breit und hoch, also etwa doppelt so viel Platz
  const SMALL = { GX: 4, GY: 4, CW: 17, CH: 13, DX: 8, DY: 6 }, BIG = { GX: 4, GY: 4, CW: 24, CH: 18, DX: 11, DY: 8, big: true };
  for (const d of [SMALL, BIG]) { d.MW = d.GX * d.CW; d.MH = d.GY * d.CH; }
  const { GX, GY, CW, CH, DX, DY, MW, MH } = SMALL;
  const walk = (v) => v === 1 || v === 5;

  // ---------- Raumformen ----------
  // Liefert ein Raster (Zeilen) mit 0 Wand, 1 Boden, 3 Hindernis, 4 Grube, 5 Gefahr
  function shapeMask(kind, w, h, rng, wd, big) {
    const m = []; for (let y = 0; y < h; y++) m.push(new Array(w).fill(1));
    const cx = (w - 1) / 2, cy = (h - 1) / 2;
    const pit = wd.pit ? 4 : 0;
    switch (kind) {
      case 'octagon': {
        const c = Math.min(big ? 4 : 3, Math.floor(Math.min(w, h) / 3));
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
        const fill = pit && rng.chance(0.7) ? 4 : 0, g = big ? 4 : 3;   // Gang rundherum: 3 Kacheln, in grossen Räumen 4
        for (let y = g; y < h - g; y++) for (let x = g; x < w - g; x++) m[y][x] = fill;
        break;
      }
      case 'pillars': {
        const st = big ? 4 : 3;
        for (let y = 2; y < h - 2; y += st) for (let x = 2; x < w - 2; x += st) m[y][x] = 3;
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
          const d = Math.min(x, y, w - 1 - x, h - 1 - y), d0 = big ? 3 : 2;
          if ((d === d0 || d === d0 + 1) && Math.abs(x - cx) > 1 && Math.abs(y - cy) > 1) m[y][x] = pit || 3;
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
        const vert = w >= h, st = big ? 5 : 4;
        if (vert) for (let x = 3; x < w - 3; x += st) { const g = rng.int(1, h - 3); for (let y = 0; y < h; y++) if (y !== g && y !== g + 1) m[y][x] = pit || 3; }
        else for (let y = 3; y < h - 3; y += st) { const g = rng.int(1, w - 3); for (let x = 0; x < w; x++) if (x !== g && x !== g + 1) m[y][x] = pit || 3; }
        break;
      }
      case 'garden': {
        // verstreute Hindernisse (Bäume, Kakteen, Korallen ...) und kleine Gefahrenflecken
        for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) if (rng.chance(0.09)) m[y][x] = 3;
        if (wd.hazard) for (let i = 0; i < (big ? 5 : 3); i++) { const px = rng.int(2, w - 3), py = rng.int(2, h - 3); for (let y = py - 1; y <= py + 1; y++) for (let x = px - 2; x <= px + 2; x++) if (m[y] && m[y][x] === 1 && rng.chance(0.75)) m[y][x] = 5; }
        break;
      }
      case 'hall': {
        // grosse Halle: Achteck mit Säulenpaaren
        const c = 2;
        for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (x + y < c || (w - 1 - x) + y < c || x + (h - 1 - y) < c || (w - 1 - x) + (h - 1 - y) < c) m[y][x] = 0;
        const q = big ? 4 : 3;
        for (const [px, py] of [[q, q], [w - 1 - q, q], [q, h - 1 - q], [w - 1 - q, h - 1 - q]]) m[py][px] = 3;
        break;
      }
    }
    // Ränder des Rechtecks immer Wand, damit Wände sauber gezeichnet werden (nur Formen ohne eigenen Rand)
    return m;
  }

  const PLAIN = ['rect', 'octagon', 'circle', 'rect'];
  const FIGHT = ['rect', 'octagon', 'circle', 'cross', 'L', 'ring', 'pillars', 'twin', 'island', 'pool', 'stripes', 'garden'];

  // big: grosse Räume (Kampfräume etwa doppelte Fläche, die anderen etwas grösser)
  function pickShape(type, wd, rng, big) {
    const B = big ? 1 : 0;
    if (type === 'boss') return { kind: rng.pick(['hall', 'octagon', 'circle']), w: 15 + 6 * B, h: 11 + 4 * B };
    if (type === 'start') return { kind: rng.pick(['rect', 'octagon']), w: rng.int(9, 11) + 3 * B, h: rng.int(7, 9) + 2 * B };
    if (type !== 'fight' && type !== 'elite') return { kind: rng.pick(PLAIN), w: rng.int(9, 12) + 3 * B, h: rng.int(7, 9) + 2 * B };
    // Kampfräume: Formen nach Welt gewichtet; Insel/Becken/Stege nur, wo die Welt Gruben oder Gefahr-Boden hat
    let list = FIGHT.filter(k => (k !== 'island' && k !== 'stripes') || wd.pit).filter(k => k !== 'pool' || wd.hazard);
    if (wd.favor) list = list.concat(wd.favor, wd.favor);
    const kind = rng.pick(list);
    const wide = ['island', 'ring', 'pool', 'stripes', 'pillars', 'twin', 'cross'].includes(kind);
    if (big) return { kind, w: wide ? rng.int(17, 21) : rng.int(13, 21), h: wide ? rng.int(13, 15) : rng.int(10, 15) };
    return { kind, w: wide ? rng.int(12, 15) : rng.int(9, 15), h: wide ? rng.int(9, 11) : rng.int(7, 11) };
  }

  // ---------- Ganze Ebene ----------
  // opts.forge: auf geraden Ebenen ab 2 gibt es eine Schmiede; opts.secret: manchmal ein geheimer Raum; opts.big: grosse Räume
  // (ältere Spielstände bauen ihre laufende Ebene ohne, genau wie vorher)
  function gen(floor, seed, wd, opts) {
    const D = opts && opts.big ? BIG : SMALL, big = !!D.big;
    const { GX, GY, CW, CH, DX, DY, MW, MH } = D;
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
    if (opts && opts.forge && floor >= 2 && floor % 2 === 0) pool.push('forge');
    const extra = rng.shuffle(['shop', 'treasure', 'rest', 'event', 'fight', floor >= 6 ? 'elite' : 'fight', 'fight', 'treasure', 'fight', 'event', 'fight']);
    while (pool.length < rest.length) pool.push(extra.shift() || 'fight');
    rng.shuffle(rest).forEach((c, i) => types[key(c)] = pool[i]);

    // Kacheln
    const tiles = []; for (let y = 0; y < MH; y++) tiles.push(new Array(MW).fill(0));
    const rooms = cells.map((c, i) => {
      const type = types[key(c)];
      const sh = pickShape(type, wd, rng, big);
      const w = sh.w, h = sh.h;
      // Lage in der Zelle: die Türlinien (DX, DY) müssen im Raum liegen
      const ox = rng.int(Math.max(1, DX + 2 - w), Math.min(CW - 1 - w, DX)), oy = rng.int(Math.max(1, DY + 2 - h), Math.min(CH - 1 - h, DY));
      const r = { i, cx: c.x, cy: c.y, type, shape: sh.kind, x: c.x * CW + ox, y: c.y * CH + oy, w, h, doors: [], cleared: false, used: false, visited: false, props: [] };
      stamp(r, shapeMask(sh.kind, w, h, rng, wd, big));
      return r;
    });
    function stamp(r, mask) { for (let y = 0; y < r.h; y++) for (let x = 0; x < r.w; x++) tiles[r.y + y][r.x + x] = mask[y][x]; }
    const roomAt = (c) => rooms.find(r => r.cx === c.x && r.cy === c.y);
    // Gänge: von der Zellgrenze nach innen, bis begehbarer Boden erreicht ist
    function carve(r) {
      for (const [p, q] of edges) {
        const a = roomAt(p), b = roomAt(q); if (a !== r && b !== r) continue;
        dig(r, a === r ? b : a);
      }
    }
    // ein Gang in der Zelle von r, in Richtung des Nachbarn o (gibt die gegrabenen Kacheln zurück)
    function dig(r, o) {
      const out = [];
      if (o.cy === r.cy) {
        const yy = r.cy * CH + DY, dir = o.cx > r.cx ? 1 : -1;
        let x = dir > 0 ? r.cx * CW + CW - 1 : r.cx * CW;
        for (let k = 0; k < CW; k++, x -= dir) { if (walk(tiles[yy][x]) && walk(tiles[yy + 1][x]) && k > 0) break; tiles[yy][x] = 1; tiles[yy + 1][x] = 1; out.push([x, yy], [x, yy + 1]); }
      } else {
        const xx = r.cx * CW + DX, dir = o.cy > r.cy ? 1 : -1;
        let y = dir > 0 ? r.cy * CH + CH - 1 : r.cy * CH;
        for (let k = 0; k < CH; k++, y -= dir) { if (walk(tiles[y][xx]) && walk(tiles[y][xx + 1]) && k > 0) break; tiles[y][xx] = 1; tiles[y][xx + 1] = 1; out.push([xx, y], [xx + 1, y]); }
      }
      return out;
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
        const ok = r.doors.every(([x, y]) => reach[y * MW + x]) && countReach(reach, r, MW) >= r.w * r.h * 0.35;
        if (!ok) { bad = true; r.shape = 'rect'; const m = shapeMask('rect', r.w, r.h, rng, wd, big); stamp(r, m); carve(r); }
      }
      if (!bad) break;
    }
    // Hindernisse in Ecken (Fässer, Kisten, Töpfe ... je Welt) und aus den Formen
    const rngF = new A.RNG((seed ^ 0x7f4a7c15) >>> 0 || 3);
    // Ausstattung je Welt: verstreute Hindernisse (Bäume, Kakteen, Korallen ...) und Flecken Gefahr-Boden, nie vor Türen und nie so, dass etwas abgeschnitten wird
    for (const r of rooms) {
      if (r.type === 'boss' || r.type === 'start' || r.type === 'stairs') continue;
      const fight = r.type === 'fight' || r.type === 'elite';
      const changed = [];
      const nearDoor = (x, y) => r.doors.some(([dx, dy]) => Math.abs(dx - x) + Math.abs(dy - y) <= 3);
      const allFloor = (x, y) => { for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if (tiles[y + dy][x + dx] !== 1) return false; return true; };
      const nObst = big ? (fight ? rngF.int(4, 7) + 2 * (wd.dense || 0) : rngF.int(1, 3)) : fight ? rngF.int(2, 4) + (wd.dense || 0) : rngF.int(0, 2);
      for (let k = 0, tries = 0; k < nObst && tries < (big ? 70 : 40); tries++) {
        const x = r.x + 2 + rngF.int(0, r.w - 5), y = r.y + 2 + rngF.int(0, r.h - 5);
        if (!allFloor(x, y) || nearDoor(x, y) || Math.abs(x - (r.x + r.w / 2)) + Math.abs(y - (r.y + r.h / 2)) < 2) continue;
        tiles[y][x] = 3; changed.push([x, y, 1]); k++;
      }
      if (wd.hazard && fight && rngF.chance(0.75)) {
        const n = big ? rngF.int(2, 3) : rngF.int(1, 2);
        for (let k = 0; k < n; k++) {
          const cx = r.x + 2 + rngF.int(0, r.w - 5), cy = r.y + 2 + rngF.int(0, r.h - 5), rr = rngF.int(1, 2);
          for (let y = cy - rr; y <= cy + rr; y++) for (let x = cx - rr - 1; x <= cx + rr + 1; x++) {
            if (y <= r.y || x <= r.x || y >= r.y + r.h - 1 || x >= r.x + r.w - 1 || tiles[y][x] !== 1) continue;
            if (((x - cx) / (rr + 1.2)) ** 2 + ((y - cy) / (rr + 0.4)) ** 2 > 1) continue;
            tiles[y][x] = 5; changed.push([x, y, 1]);
          }
        }
      }
      // alles noch erreichbar? Sonst diesen Raum zurücksetzen
      const re = flood(tiles, sr.x + Math.floor(sr.w / 2), sr.y + Math.floor(sr.h / 2));
      const ok = rooms.every(q => q.doors.every(([x, y]) => re[y * MW + x])) && countReach(re, r, MW) >= countReach(reach, r, MW) - changed.length;
      if (!ok) for (const [x, y, v] of changed) tiles[y][x] = v;
    }
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
    if (opts && opts.secret && floor >= 2) secretRoom();
    return { rooms, tiles, edges, start: sr, reach, dims: D, big };

    // Geheimer Raum (ältere Spielstände bauen ihre laufende Ebene ohne): in einer freien Zelle neben einem Raum, der Durchgang ist mit Geröll
    // zugeschüttet (Kachel 3, world.js räumt es weg). Eigener Zufall, damit der Rest der Ebene genau gleich bleibt; der Raum gehört nicht ins
    // Wegenetz (edges) und ist in reach nicht erreichbar, solange das Geröll liegt
    function secretRoom() {
      const rs = new A.RNG((seed ^ 0x1f3d5b79) >>> 0 || 13);
      if (!rs.chance(0.4)) return;
      const spots = [];
      for (const r of rooms) {
        if (r.type === 'boss' || r.type === 'start') continue;
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const c = { x: r.cx + dx, y: r.cy + dy };
          if (c.x < 0 || c.y < 0 || c.x >= GX || c.y >= GY || rooms.some(q => q.cx === c.x && q.cy === c.y)) continue;
          spots.push({ c, nb: r });
        }
      }
      if (!spots.length) return;
      const { c, nb } = rs.pick(spots);
      const kind = rs.pick(['rect', 'octagon', 'circle']), w = rs.int(7, 9) + (big ? 3 : 0), h = rs.int(6, 7) + (big ? 2 : 0);
      const ox = rs.int(Math.max(1, DX + 2 - w), Math.min(CW - 1 - w, DX)), oy = rs.int(Math.max(1, DY + 2 - h), Math.min(CH - 1 - h, DY));
      const r = { i: rooms.length, cx: c.x, cy: c.y, type: 'secret', shape: kind, x: c.x * CW + ox, y: c.y * CH + oy, w, h, doors: [], cleared: false, used: false, visited: false, props: [], furn: [] };
      const back = tiles.map(row => row.slice());
      stamp(r, shapeMask(kind, w, h, rs, wd, big));
      const dug = dig(r, nb).concat(dig(nb, r));
      const open = flood(tiles, sr.x + Math.floor(sr.w / 2), sr.y + Math.floor(sr.h / 2));
      if (countReach(open, r, MW) < w * h * 0.35 || !rooms.every(q => q.doors.every(([x, y]) => open[y * MW + x]))) { for (let y = 0; y < MH; y++) tiles[y] = back[y]; return; }
      nb.furn = nb.furn.filter(f => tiles[f.ty][f.tx] === 3);   // der Gang hat ein Hindernis im Nachbarraum weggeräumt
      // ein, zwei Fässer oder Kisten in die Ecken, nie neben den Gang
      for (const [tx, ty] of rs.shuffle([[r.x, r.y], [r.x + w - 1, r.y], [r.x, r.y + h - 1], [r.x + w - 1, r.y + h - 1]]).slice(0, 2)) {
        if (tiles[ty][tx] !== 1 || dug.some(([x, y]) => Math.abs(x - tx) + Math.abs(y - ty) <= 2)) continue;
        tiles[ty][tx] = 3; r.furn.push({ tx, ty, kind: rs.pick(wd.corner || ['barrel', 'crate', 'pot', 'barrel']) });
      }
      r.anchor = anchorOf(tiles, flood(tiles, sr.x + Math.floor(sr.w / 2), sr.y + Math.floor(sr.h / 2)), r);
      // Durchgang an der Zellgrenze (2 x 2 Kacheln) zuschütten
      const door = [];
      if (c.y === nb.cy) { const x0 = Math.min(c.x, nb.cx) * CW + CW - 1, yy = c.y * CH + DY; door.push([x0, yy], [x0 + 1, yy], [x0, yy + 1], [x0 + 1, yy + 1]); }
      else { const y0 = Math.min(c.y, nb.cy) * CH + CH - 1, xx = c.x * CW + DX; door.push([xx, y0], [xx, y0 + 1], [xx + 1, y0], [xx + 1, y0 + 1]); }
      for (const [x, y] of door) tiles[y][x] = 3;
      r.secret = { door, nb: nb.i };
      rooms.push(r);
    }
  }
  function countReach(reach, r, MW) { let n = 0; for (let y = r.y; y < r.y + r.h; y++) for (let x = r.x; x < r.x + r.w; x++) if (reach[y * MW + x]) n++; return n; }
  // Erreichbarkeit (Grösse der Karte aus den Kacheln: kleine und grosse Ebenen)
  function flood(tiles, sx, sy) {
    const MW = tiles[0].length, MH = tiles.length;
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
    const MW = tiles[0].length, cx = r.x + Math.floor(r.w / 2), cy = r.y + Math.floor(r.h / 2);
    const free = (x, y) => { for (let yy = y - 1; yy <= y + 1; yy++) for (let xx = x - 1; xx <= x + 1; xx++) if (!tiles[yy] || tiles[yy][xx] !== 1 || !reach[yy * MW + xx]) return false; return true; };
    for (let d = 0; d < 8; d++) for (let y = cy - d; y <= cy + d; y++) for (let x = cx - d; x <= cx + d; x++) {
      if (Math.max(Math.abs(x - cx), Math.abs(y - cy)) !== d) continue;
      if (x > r.x && y > r.y && x < r.x + r.w - 1 && y < r.y + r.h - 1 && free(x, y)) return { tx: x, ty: y };
    }
    return { tx: cx, ty: cy };
  }

  return { GX, GY, CW, CH, DX, DY, MW, MH, SMALL, BIG, gen, flood, shapeMask, walk };
})();
