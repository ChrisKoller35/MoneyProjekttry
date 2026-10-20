// Der Abstieg – 3D-Darstellung: dieselbe Spielwelt als Klötzchen-Welt mit echtem Licht und Schatten (three.js).
// Das ist die Quelle für js/draw3.js (wird mit `node build3d.js` gebündelt und verkleinert).
// Schnittstelle wie A.Draw: new A.Draw3(canvas3d, draw2d), draw(W, dt), topPad, botPad, quality.
// Die 2D-Zeichnung (draw2d) bleibt für die Oberfläche zuständig: Zahlen, Einblendungen, Minikarte, Joystick.
import {
  WebGLRenderer, Scene, PerspectiveCamera, Color, FogExp2, HemisphereLight, DirectionalLight, PointLight, Group, Mesh, InstancedMesh,
  BoxGeometry, PlaneGeometry, CylinderGeometry, SphereGeometry, ConeGeometry, RingGeometry, TorusGeometry, CircleGeometry,
  MeshLambertMaterial, MeshBasicMaterial, SpriteMaterial, Sprite, CanvasTexture, SRGBColorSpace, NearestFilter, RepeatWrapping,
  Object3D, Vector3, BufferGeometry, BufferAttribute, Points, ShaderMaterial, AdditiveBlending, DoubleSide, PCFSoftShadowMap,
  ACESFilmicToneMapping, DynamicDrawUsage,
} from 'three';

(function () {
  const A = window.A = window.A || {};
  const TS = 32;                     // Weltpunkte je Kachel (wie in world.js)
  const U = 1 / TS;                  // Weltpunkt -> 3D-Einheit (eine Kachel = 1)
  const TAU = Math.PI * 2;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const hash = (x, y, k) => { let h = Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(k | 0, 1442695041) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
  const _o = new Object3D(), _v = new Vector3();
  const colCache = {};
  const col = (h) => colCache[h] || (colCache[h] = new Color(h));
  // Farbe heller/dunkler (f > 1 heller)
  const shadeCache = {};
  function shade(h, f) { const k = h + '|' + f; if (shadeCache[k]) return shadeCache[k]; const c = new Color(h); c.r = clamp(c.r * f, 0, 1); c.g = clamp(c.g * f, 0, 1); c.b = clamp(c.b * f, 0, 1); return (shadeCache[k] = c); }

  // ---------- Grundformen (werden über scale auf Grösse gebracht) ----------
  const GEO = {
    box: new BoxGeometry(1, 1, 1), sph: new SphereGeometry(0.5, 12, 10), cyl: new CylinderGeometry(0.5, 0.5, 1, 12),
    cone: new ConeGeometry(0.5, 1, 10), plane: new PlaneGeometry(1, 1), circ: new CircleGeometry(0.5, 20),
    ring: new RingGeometry(0.84, 1, 32), arc: new RingGeometry(0.8, 1, 24, 1, 0, 2.6), tor: new TorusGeometry(0.5, 0.045, 6, 16, Math.PI),
  };

  // ---------- Texturen aus Code ----------
  function canvasTex(size, paint, nearest) {
    const c = document.createElement('canvas'); c.width = c.height = size; const x = c.getContext('2d'); paint(x, size);
    const t = new CanvasTexture(c); t.colorSpace = SRGBColorSpace; t.wrapS = t.wrapT = RepeatWrapping; if (nearest) { t.magFilter = NearestFilter; t.minFilter = NearestFilter; } return t;
  }
  const TEX = {};
  function tex(name) {
    if (TEX[name]) return TEX[name];
    let t;
    if (name === 'stone') t = canvasTex(64, (x, s) => {
      x.fillStyle = '#9aa0b8'; x.fillRect(0, 0, s, s);
      for (let i = 0; i < 900; i++) { const v = 150 + Math.floor(hash(i, 3, 1) * 60); x.fillStyle = `rgb(${v},${v + 4},${v + 14})`; x.fillRect(Math.floor(hash(i, 1, 2) * s), Math.floor(hash(i, 2, 3) * s), 2, 2); }
      x.strokeStyle = 'rgba(40,40,60,0.35)'; x.lineWidth = 1.5;
      for (let i = 0; i < 4; i++) { x.beginPath(); let px = hash(i, 5, 7) * s, py = hash(i, 6, 8) * s; x.moveTo(px, py); for (let k = 0; k < 5; k++) { px += (hash(i, k, 9) - 0.5) * 18; py += (hash(i, k, 10) - 0.5) * 18; x.lineTo(px, py); } x.stroke(); }
      x.fillStyle = 'rgba(255,255,255,0.08)'; x.fillRect(0, 0, s, 2); x.fillRect(0, 0, 2, s); x.fillStyle = 'rgba(0,0,0,0.18)'; x.fillRect(0, s - 2, s, 2); x.fillRect(s - 2, 0, 2, s);
    });
    else if (name === 'brick') t = canvasTex(64, (x, s) => {
      x.fillStyle = '#4e5878'; x.fillRect(0, 0, s, s);
      const rows = 4, bh = s / rows;
      for (let r = 0; r < rows; r++) { const off = (r & 1) ? s / 4 : 0; for (let b = -1; b < 3; b++) { const bx = b * (s / 2) + off, v = 150 + Math.floor(hash(r, b, 4) * 50); x.fillStyle = `rgb(${v - 20},${v - 10},${v + 20})`; x.fillRect(bx + 2, r * bh + 2, s / 2 - 4, bh - 4); x.fillStyle = 'rgba(255,255,255,0.12)'; x.fillRect(bx + 2, r * bh + 2, s / 2 - 4, 2); x.fillStyle = 'rgba(0,0,0,0.2)'; x.fillRect(bx + 2, r * bh + bh - 4, s / 2 - 4, 2); } }
      for (let i = 0; i < 300; i++) { x.fillStyle = `rgba(0,0,0,${hash(i, 7, 5) * 0.25})`; x.fillRect(Math.floor(hash(i, 8, 6) * s), Math.floor(hash(i, 9, 7) * s), 2, 1); }
    });
    else if (name === 'cap') t = canvasTex(32, (x, s) => { x.fillStyle = '#6a7290'; x.fillRect(0, 0, s, s); for (let i = 0; i < 300; i++) { const v = 90 + Math.floor(hash(i, 11, 1) * 60); x.fillStyle = `rgb(${v},${v},${v + 12})`; x.fillRect(Math.floor(hash(i, 12, 2) * s), Math.floor(hash(i, 13, 3) * s), 2, 2); } });
    else if (name === 'flame') t = canvasTex(64, (x, s) => { const g = x.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2); g.addColorStop(0, 'rgba(255,255,230,1)'); g.addColorStop(0.25, 'rgba(255,200,80,0.95)'); g.addColorStop(0.6, 'rgba(255,110,30,0.45)'); g.addColorStop(1, 'rgba(255,60,0,0)'); x.fillStyle = g; x.fillRect(0, 0, s, s); });
    else if (name === 'glow') t = canvasTex(64, (x, s) => { const g = x.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.4, 'rgba(255,255,255,0.35)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, s, s); });
    else if (name === 'wood') t = canvasTex(32, (x, s) => { x.fillStyle = '#8a5a3a'; x.fillRect(0, 0, s, s); for (let i = 0; i < 12; i++) { x.fillStyle = `rgba(60,30,15,${0.2 + hash(i, 1, 9) * 0.3})`; x.fillRect(0, Math.floor(hash(i, 2, 9) * s), s, 1 + Math.floor(hash(i, 3, 9) * 2)); } });
    return (TEX[name] = t);
  }
  // Bildchen aus der Pixel-Grafik (Gegenstände) als Textur
  const iconTex = {};
  function iconTexture(name) {
    if (iconTex[name]) return iconTex[name];
    const s = A.Art.sprite(name); if (!s) return null;
    const t = new CanvasTexture(s.img); t.colorSpace = SRGBColorSpace; t.magFilter = NearestFilter; t.minFilter = NearestFilter;
    return (iconTex[name] = t);
  }

  // ---------- Material-Hilfen ----------
  function lam(color, o) {
    const m = new MeshLambertMaterial(Object.assign({ color: col(color) }, o || {}));
    m.userData.e = m.emissive.clone(); m.userData.ei = m.emissiveIntensity; m.userData.a = m.opacity;
    return m;
  }
  // Teil an eine Gruppe hängen. geo: Formname; size: [sx, sy, sz]; pos: [x, y, z]; opts.pivot: 'top' -> Drehpunkt oben (Beine, Arme)
  function part(parent, geo, color, size, pos, opts) {
    opts = opts || {};
    const mat = opts.mat || lam(color, opts.m);
    const m = new Mesh(GEO[geo] || GEO.box, mat); m.scale.set(size[0], size[1], size[2]);
    m.castShadow = opts.shadow !== false; m.receiveShadow = false;
    if (opts.rot) m.rotation.set(opts.rot[0], opts.rot[1], opts.rot[2]);
    if (opts.pivot) {
      const g = new Group(); g.position.set(pos[0], pos[1], pos[2]);
      m.position.set(0, opts.pivot === 'top' ? -size[1] / 2 : size[1] / 2, 0); g.add(m); parent.add(g);
      register(parent, mat); g.userData.mesh = m; return g;
    }
    m.position.set(pos[0], pos[1], pos[2]); parent.add(m);
    register(parent, mat);
    return m;
  }
  // Material bei der nächsten Figuren-Gruppe anmelden (für Aufblitzen und Durchsichtigkeit)
  function register(o, mat) { let p = o; while (p && !(p.userData && p.userData.mats)) p = p.parent; if (p) p.userData.mats.push(mat); }
  function figGroup() { const g = new Group(); g.userData.mats = []; g.userData.parts = {}; return g; }
  function eyes(g, color, x, y, z, s, glow) { const o = glow ? { m: { emissive: col(color), emissiveIntensity: 1.2 } } : null; for (const sx of [-1, 1]) part(g, 'box', color, [s, s, s * 0.6], [sx * x, y, z], Object.assign({ shadow: false }, o || {})); }
  function limb(g, color, size, pos, key) { const l = part(g, 'box', color, size, pos, { pivot: 'top' }); if (key) g.userData.parts[key] = l; return l; }
  // Leichtes Eigenleuchten in der Grundfarbe (nur Teile ohne eigenes Leuchten)
  function selfLight(g, k) { for (const m of g.userData.mats) { const e = m.userData.e; if (e.r + e.g + e.b > 0) continue; m.emissive.copy(m.color).multiplyScalar(k); m.userData.e.copy(m.emissive); m.emissiveIntensity = m.userData.ei = 1; } }
  function setFlash(g, on, color) { for (const m of g.userData.mats) { if (on) { m.emissive.set(color || '#ffffff'); m.emissiveIntensity = 1; } else { m.emissive.copy(m.userData.e); m.emissiveIntensity = m.userData.ei; } } }
  function setTint(g, color, k) { for (const m of g.userData.mats) { m.emissive.copy(m.userData.e).lerp(col(color), k); m.emissiveIntensity = Math.max(m.userData.ei, k); } }
  function setOpacity(g, a) { for (const m of g.userData.mats) { const want = a * m.userData.a; if (m.opacity !== want) { m.opacity = want; m.transparent = want < 1; m.needsUpdate = false; } } }
  function flame(parent, size, pos, color) {
    const s = new Sprite(new SpriteMaterial({ map: tex('flame'), color: col(color || '#ffffff'), blending: AdditiveBlending, depthWrite: false, transparent: true }));
    s.scale.set(size, size * 1.35, 1); s.position.set(pos[0], pos[1], pos[2]); parent.add(s); return s;
  }

  // ---------- Held ----------
  function buildHero(race, cls) {
    const skin = (A.Art.RACE_SKIN[race] || A.Art.RACE_SKIN.mensch), cloth = (A.Art.CLASS_CLOTH[cls] || A.Art.CLASS_CLOTH.klinge);
    const g = figGroup(), P = g.userData.parts;
    const hair = { mensch: '#3e2731', fels: '#3a4466', schatten: '#262b44', pilz: '#3e8948', kobold: '#8b9bb4' }[race] || '#3e2731';
    limb(g, '#3e2731', [0.16, 0.3, 0.18], [-0.1, 0.3, 0], 'legL'); limb(g, '#3e2731', [0.16, 0.3, 0.18], [0.1, 0.3, 0], 'legR');
    part(g, 'box', '#733e39', [0.17, 0.08, 0.2], [-0.1, 0.05, 0.02]); part(g, 'box', '#733e39', [0.17, 0.08, 0.2], [0.1, 0.05, 0.02]);   // Stiefel
    P.body = part(g, 'box', cloth[1], [0.42, 0.38, 0.26], [0, 0.5, 0]);
    part(g, 'box', cloth[0], [0.44, 0.07, 0.28], [0, 0.34, 0]);                                   // Gürtel
    part(g, 'box', cloth[2], [0.12, 0.3, 0.02], [0, 0.52, 0.135], { shadow: false });            // Stoffstreifen vorn
    P.head = part(g, 'box', skin[0], [0.34, 0.3, 0.3], [0, 0.86, 0]);
    eyes(g, '#181425', 0.07, 0.87, 0.155, 0.05);
    if (cls === 'rufer') { // Kapuze mit Zipfel, Schädel-Anhänger
      part(g, 'box', cloth[1], [0.42, 0.38, 0.3], [0, 0.9, -0.06]); part(g, 'cone', cloth[1], [0.3, 0.32, 0.3], [0, 1.22, -0.08]);
      part(g, 'box', '#c0cbdc', [0.09, 0.09, 0.03], [0, 0.6, 0.14], { shadow: false });
    } else if (cls === 'brau') { // Hut mit breiter Krempe, Bart, Schürze
      part(g, 'cyl', cloth[0], [0.62, 0.04, 0.62], [0, 1.03, 0]); part(g, 'cyl', cloth[1], [0.34, 0.2, 0.34], [0, 1.14, 0]); part(g, 'cyl', cloth[2], [0.35, 0.04, 0.35], [0, 1.07, 0]);
      part(g, 'box', '#733e39', [0.3, 0.12, 0.06], [0, 0.74, 0.15]); part(g, 'box', '#ead4aa', [0.3, 0.3, 0.03], [0, 0.46, 0.145]);
    }
    else if (race === 'pilz') part(g, 'sph', '#e43b44', [0.5, 0.2, 0.5], [0, 1.02, 0]);
    else if (race === 'kobold') part(g, 'cyl', '#8b9bb4', [0.36, 0.14, 0.36], [0, 1.05, 0]);
    else part(g, 'box', hair, [0.37, 0.1, 0.33], [0, 1.04, -0.01]);
    if (race === 'fels') { part(g, 'box', skin[1], [0.1, 0.1, 0.1], [-0.15, 0.95, 0.12]); }     // Fels: kantige Stirn
    P.armL = limb(g, cloth[0], [0.13, 0.32, 0.13], [-0.28, 0.68, 0], 'armL'); P.armR = limb(g, cloth[0], [0.13, 0.32, 0.13], [0.28, 0.68, 0], 'armR');
    part(P.armL, 'box', skin[0], [0.12, 0.1, 0.12], [0, -0.33, 0]); part(P.armR, 'box', skin[0], [0.12, 0.1, 0.12], [0, -0.33, 0]);
    // Waffe und Schild
    const w = cls === 'schuetze' ? 'bow' : cls === 'brau' ? 'flask' : (cls === 'weber' || cls === 'rufer') ? 'staff' : 'sword';
    if (w === 'sword') {
      part(P.armR, 'box', '#c0cbdc', [0.05, 0.03, 0.55], [0, -0.34, 0.32]); part(P.armR, 'box', '#8b9bb4', [0.16, 0.035, 0.04], [0, -0.34, 0.07]); part(P.armR, 'box', '#733e39', [0.04, 0.045, 0.12], [0, -0.34, -0.03]);
      const sh = part(P.armL, 'cyl', '#733e39', [0.42, 0.05, 0.42], [-0.07, -0.2, 0.12], { rot: [Math.PI / 2, 0, 0] }); part(sh, 'cyl', '#8b9bb4', [1.04, 0.3, 1.04], [0, 0, 0]);
      part(P.armL, 'sph', '#c0cbdc', [0.1, 0.1, 0.1], [-0.07, -0.2, 0.16]);
    } else if (w === 'bow') {
      P.bow = part(P.armL, 'tor', '#733e39', [0.7, 0.7, 0.7], [0, -0.34, 0.15], { rot: [0, Math.PI / 2, 0] });
      part(P.armL, 'box', '#ead4aa', [0.012, 0.68, 0.012], [0, -0.34, 0.15]);
      part(P.armR, 'box', '#ead4aa', [0.02, 0.02, 0.4], [0, -0.34, 0.15]); part(P.armR, 'box', '#e43b44', [0.05, 0.05, 0.08], [0, -0.34, -0.03]);
    } else if (w === 'flask') { // Flasche in der Hand (verschwindet kurz nach dem Wurf)
      P.flask = part(P.armR, 'sph', '#feae34', [0.17, 0.2, 0.17], [0, -0.42, 0.06], { m: { emissive: col('#feae34'), emissiveIntensity: 0.6 } });
      part(P.flask, 'cyl', '#c0cbdc', [0.35, 0.5, 0.35], [0, 0.65, 0], { shadow: false });
    } else {
      part(P.armR, 'cyl', '#733e39', [0.06, 1.05, 0.06], [0.02, -0.1, 0.06]);
      if (cls === 'rufer') { // Schädel mit lila leuchtenden Augen
        P.orb = part(P.armR, 'box', '#c0cbdc', [0.17, 0.16, 0.16], [0.02, 0.48, 0.06], { m: { emissive: col('#b55088'), emissiveIntensity: 0.5 } });
        for (const sx of [-1, 1]) part(P.orb, 'box', '#e0a4ff', [0.25, 0.25, 0.1], [sx * 0.22, 0.05, 0.5], { shadow: false, m: { emissive: col('#e0a4ff'), emissiveIntensity: 1.3 } });
      } else P.orb = part(P.armR, 'sph', cloth[2], [0.17, 0.17, 0.17], [0.02, 0.46, 0.06], { m: { emissive: col(cloth[2]), emissiveIntensity: 0.9 } });
    }
    P.shield = part(g, 'sph', '#2ce8f5', [1.25, 1.35, 1.25], [0, 0.6, 0], { shadow: false, m: { transparent: true, opacity: 0.18, emissive: col('#2ce8f5'), emissiveIntensity: 0.6, depthWrite: false } });
    P.shield.visible = false;
    g.userData.h = 1.15; g.userData.w = w; g.scale.setScalar(1.15); selfLight(g, 0.2);
    return g;
  }
  function animHero(g, h, t, run) {
    const P = g.userData.parts, moving = h.moving, w = g.userData.w, wt = A.World.W ? A.World.W.t : 0;
    const sw = Math.sin(t * 11), swing = h.swing > 0 ? 1 - h.swing / 0.2 : 0, e = 1 - Math.pow(1 - swing, 3);
    const gT = h.giantUntil - wt; g.scale.setScalar(1.15 * (gT > 0 ? 1 + 0.35 * clamp(Math.min(8 - gT, gT) / 0.3, 0, 1) : 1));   // Riesenwuchs
    g.rotation.y = Math.atan2(h.fx, h.fy);
    P.legL.rotation.x = moving ? sw * 0.75 : 0; P.legR.rotation.x = moving ? -sw * 0.75 : 0;
    g.position.y = moving ? Math.abs(sw) * 0.04 : 0;
    P.body.scale.y = 0.38 * (1 + Math.sin(t * 2.5) * 0.02);
    if (w === 'sword') { P.armL.rotation.x = moving ? sw * 0.4 : -0.2; P.armR.rotation.x = h.swing > 0 ? -2.3 + e * 3.4 : (moving ? -sw * 0.4 : 0.15); P.armR.rotation.z = h.swing > 0 ? -0.3 : 0; }
    else if (w === 'flask') { P.flask.visible = wt - (h.thrownT == null ? -9 : h.thrownT) > 0.22; P.armR.rotation.x = h.swing > 0 ? -2.4 + e * 2.9 : (moving ? -sw * 0.4 : -0.35); P.armL.rotation.x = moving ? sw * 0.4 : -0.1; }
    else if (w === 'bow') { P.armL.rotation.x = -1.35; P.armR.rotation.x = h.swing > 0 ? -1.2 + e * 0.5 : -1.1; P.armR.position.z = h.swing > 0 ? -0.08 : 0; }
    else { P.armR.rotation.x = h.swing > 0 ? -1.9 + e * 1.2 : -0.1; P.armL.rotation.x = moving ? sw * 0.4 : -0.1; P.orb.material.emissiveIntensity = 0.7 + (h.swing > 0 ? 1.2 * (1 - e) : 0) + Math.sin(t * 5) * 0.15; }
    if (!h.alive) { g.rotation.x = -1.45; g.position.y = 0.12; }
    else g.rotation.x = 0;
    P.shield.visible = h.shield > 0; if (h.shield > 0) { const k = 1 + Math.sin(t * 6) * 0.03; P.shield.scale.set(1.25 * k, 1.35 * k, 1.25 * k); }
  }

  // ---------- Gegner ----------
  const BUILD = {
    blob(g, c) { const P = g.userData.parts; P.body = part(g, 'sph', c, [0.8, 0.6, 0.8], [0, 0.3, 0], { m: { emissive: shade(c, 0.25), emissiveIntensity: 0.6 } }); part(g, 'sph', shade(c, 1.5).getStyle(), [0.2, 0.14, 0.16], [-0.18, 0.48, 0.2], { shadow: false }); eyes(g, '#181425', 0.12, 0.34, 0.33, 0.06); part(g, 'box', '#181425', [0.18, 0.03, 0.03], [0, 0.24, 0.37], { shadow: false }); g.userData.h = 0.62; },
    rat(g, c) { const P = g.userData.parts; part(g, 'box', c, [0.46, 0.24, 0.26], [0, 0.2, -0.06]); part(g, 'box', shade(c, 1.2).getStyle(), [0.26, 0.2, 0.24], [0, 0.26, 0.26]); for (const s of [-1, 1]) part(g, 'box', '#f6757a', [0.1, 0.1, 0.03], [s * 0.1, 0.42, 0.22], { shadow: false }); part(g, 'box', '#181425', [0.06, 0.05, 0.05], [0, 0.24, 0.4], { shadow: false }); eyes(g, '#e43b44', 0.08, 0.31, 0.37, 0.045, true); P.tail = part(g, 'box', shade(c, 0.9).getStyle(), [0.04, 0.03, 0.4], [0, 0.14, -0.3], { pivot: 'top' }); P.tail.rotation.x = Math.PI / 2; for (const [x, z] of [[-0.15, 0.1], [0.15, 0.1], [-0.15, -0.2], [0.15, -0.2]]) limb(g, shade(c, 0.8).getStyle(), [0.08, 0.12, 0.08], [x, 0.12, z], 'l' + x + z); g.userData.h = 0.5; },
    bat(g, c) { const P = g.userData.parts; part(g, 'box', c, [0.26, 0.24, 0.22], [0, 0.6, 0]); for (const s of [-1, 1]) part(g, 'cone', c, [0.1, 0.16, 0.08], [s * 0.08, 0.78, 0]); eyes(g, '#fee761', 0.06, 0.63, 0.12, 0.05, true); for (const s of [-1, 1]) part(g, 'box', '#ffffff', [0.03, 0.05, 0.02], [s * 0.04, 0.52, 0.11], { shadow: false }); P.wingL = part(g, 'box', shade(c, 0.85).getStyle(), [0.46, 0.03, 0.26], [-0.13, 0.64, 0], { pivot: 'side' }); P.wingL.userData.mesh.position.set(-0.23, 0, 0); P.wingR = part(g, 'box', shade(c, 0.85).getStyle(), [0.46, 0.03, 0.26], [0.13, 0.64, 0], { pivot: 'side' }); P.wingR.userData.mesh.position.set(0.23, 0, 0); g.userData.h = 0.85; g.userData.fly = true; },
    mushroom(g, c) { const P = g.userData.parts; part(g, 'cyl', '#ead4aa', [0.3, 0.5, 0.3], [0, 0.25, 0]); P.cap = part(g, 'sph', c, [0.82, 0.42, 0.82], [0, 0.56, 0]); for (const [x, z] of [[-0.2, 0.1], [0.15, -0.15], [0.05, 0.25]]) part(g, 'sph', '#ead4aa', [0.12, 0.08, 0.12], [x, 0.7, z], { shadow: false }); eyes(g, '#181425', 0.07, 0.32, 0.16, 0.05); limb(g, '#ead4aa', [0.09, 0.26, 0.09], [-0.2, 0.42, 0], 'armL'); limb(g, '#ead4aa', [0.09, 0.26, 0.09], [0.2, 0.42, 0], 'armR'); limb(g, '#c28569', [0.1, 0.14, 0.1], [-0.08, 0.14, 0], 'legL'); limb(g, '#c28569', [0.1, 0.14, 0.1], [0.08, 0.14, 0], 'legR'); g.userData.h = 0.8; },
    skeleton(g, c) { const b = '#ead4aa'; limb(g, b, [0.1, 0.3, 0.1], [-0.09, 0.3, 0], 'legL'); limb(g, b, [0.1, 0.3, 0.1], [0.09, 0.3, 0], 'legR'); part(g, 'box', b, [0.3, 0.08, 0.14], [0, 0.33, 0]); part(g, 'box', b, [0.08, 0.3, 0.08], [0, 0.5, 0]); for (const y of [0.42, 0.5, 0.58]) part(g, 'box', b, [0.34, 0.04, 0.18], [0, y, 0]); limb(g, b, [0.09, 0.34, 0.09], [-0.22, 0.68, 0], 'armL'); limb(g, b, [0.09, 0.34, 0.09], [0.22, 0.68, 0], 'armR'); part(g, 'box', b, [0.26, 0.26, 0.24], [0, 0.82, 0]); eyes(g, '#181425', 0.06, 0.85, 0.125, 0.07); part(g, 'box', '#181425', [0.14, 0.03, 0.03], [0, 0.73, 0.125], { shadow: false }); g.userData.h = 0.98; },
    moth(g, c) { const P = g.userData.parts; part(g, 'box', c, [0.22, 0.22, 0.3], [0, 0.6, 0], { m: { emissive: col(c), emissiveIntensity: 0.5 } }); for (const s of [-1, 1]) part(g, 'box', '#3e2731', [0.02, 0.14, 0.02], [s * 0.06, 0.78, 0.1], { rot: [0.5, 0, s * 0.4], shadow: false }); eyes(g, '#fee761', 0.06, 0.64, 0.15, 0.05, true); P.wingL = part(g, 'box', shade(c, 1.2).getStyle(), [0.5, 0.02, 0.36], [-0.11, 0.64, 0], { pivot: 'side', m: { emissive: col(c), emissiveIntensity: 0.6 } }); P.wingL.userData.mesh.position.set(-0.25, 0, 0); P.wingR = part(g, 'box', shade(c, 1.2).getStyle(), [0.5, 0.02, 0.36], [0.11, 0.64, 0], { pivot: 'side', m: { emissive: col(c), emissiveIntensity: 0.6 } }); P.wingR.userData.mesh.position.set(0.25, 0, 0); g.userData.h = 0.85; g.userData.fly = true; },
    spider(g, c) { const P = g.userData.parts; part(g, 'sph', c, [0.5, 0.36, 0.5], [0, 0.28, 0.05]); part(g, 'sph', shade(c, 0.8).getStyle(), [0.6, 0.46, 0.6], [0, 0.32, -0.42]); eyes(g, '#e43b44', 0.08, 0.34, 0.27, 0.05, true); eyes(g, '#e43b44', 0.16, 0.3, 0.24, 0.04, true); P.legs = []; for (let i = 0; i < 4; i++) for (const s of [-1, 1]) { const l = part(g, 'box', shade(c, 0.7).getStyle(), [0.5, 0.04, 0.05], [s * 0.2, 0.3, 0.18 - i * 0.12], { pivot: 'side' }); l.userData.mesh.position.set(s * 0.25, 0, 0); l.rotation.y = s * (0.6 - i * 0.4); l.rotation.z = -s * 0.55; l.userData.s = s; l.userData.i = i; P.legs.push(l); } g.userData.h = 0.6; },
    golem(g, c) { limb(g, shade(c, 0.8).getStyle(), [0.3, 0.34, 0.32], [-0.22, 0.34, 0], 'legL'); limb(g, shade(c, 0.8).getStyle(), [0.3, 0.34, 0.32], [0.22, 0.34, 0], 'legR'); part(g, 'box', c, [0.8, 0.72, 0.52], [0, 0.72, 0]); part(g, 'box', shade(c, 1.15).getStyle(), [0.94, 0.2, 0.56], [0, 1.08, 0]); part(g, 'box', shade(c, 0.9).getStyle(), [0.32, 0.28, 0.32], [0, 1.26, 0.1]); eyes(g, '#f77622', 0.07, 1.28, 0.27, 0.06, true); limb(g, shade(c, 0.85).getStyle(), [0.28, 0.66, 0.28], [-0.6, 1.08, 0], 'armL'); limb(g, shade(c, 0.85).getStyle(), [0.28, 0.66, 0.28], [0.6, 1.08, 0], 'armR'); part(g, 'box', '#fee761', [0.2, 0.05, 0.05], [0.1, 0.8, 0.27], { rot: [0, 0, 0.5], shadow: false, m: { emissive: col('#f77622'), emissiveIntensity: 0.8 } }); g.userData.h = 1.45; g.userData.slow = true; },
    ghost(g, c) { const m = { transparent: true, opacity: 0.72, emissive: shade(c, 0.35), emissiveIntensity: 0.8, depthWrite: false }; part(g, 'cone', c, [0.6, -0.7, 0.6], [0, 0.55, 0], { m }); part(g, 'sph', c, [0.42, 0.42, 0.42], [0, 0.95, 0], { m }); eyes(g, '#fee761', 0.08, 0.97, 0.19, 0.06, true); const aL = limb(g, c, [0.1, 0.3, 0.1], [-0.3, 0.82, 0.05], 'armL'), aR = limb(g, c, [0.1, 0.3, 0.1], [0.3, 0.82, 0.05], 'armR'); aL.userData.mesh.material = aR.userData.mesh.material = g.userData.mats[0]; aL.rotation.x = aR.rotation.x = -1.0; g.userData.h = 1.15; g.userData.hover = true; for (const mm of g.userData.mats) { mm.userData.a = mm.opacity; } },
    worm(g, c) { const P = g.userData.parts; P.segs = []; const R = [0.3, 0.28, 0.25, 0.22, 0.18]; let z = 0; for (let i = 0; i < 5; i++) { const s = part(g, 'sph', i ? shade(c, 1 - i * 0.07).getStyle() : c, [R[i] * 2, R[i] * 1.8, R[i] * 2], [0, R[i] * 0.9 + 0.02, z]); P.segs.push(s); z -= R[i] + (R[i + 1] || 0) - 0.05; } part(g, 'box', '#3e2731', [0.3, 0.14, 0.12], [0, 0.22, 0.26], { shadow: false }); for (const s of [-1, 1]) part(g, 'cone', '#ffffff', [0.05, 0.08, 0.05], [s * 0.09, 0.3, 0.3], { rot: [Math.PI, 0, 0], shadow: false }); eyes(g, '#fee761', 0.12, 0.42, 0.22, 0.05, true); g.userData.h = 0.62; g.userData.slow = true; },
    kobold(g, c) { const P = g.userData.parts; limb(g, '#3e2731', [0.12, 0.22, 0.12], [-0.08, 0.22, 0], 'legL'); limb(g, '#3e2731', [0.12, 0.22, 0.12], [0.08, 0.22, 0], 'legR'); part(g, 'box', '#733e39', [0.32, 0.3, 0.2], [0, 0.37, 0]); part(g, 'box', c, [0.28, 0.24, 0.26], [0, 0.66, 0]); part(g, 'cone', '#3e2731', [0.34, 0.26, 0.34], [0, 0.88, -0.02]); eyes(g, '#fee761', 0.06, 0.67, 0.135, 0.045, true); for (const s of [-1, 1]) part(g, 'cone', c, [0.08, 0.14, 0.06], [s * 0.17, 0.72, 0], { rot: [0, 0, s * -1.2] }); P.armL = limb(g, c, [0.1, 0.26, 0.1], [-0.2, 0.52, 0], 'armL'); P.armR = limb(g, c, [0.1, 0.26, 0.1], [0.2, 0.52, 0], 'armR'); part(P.armR, 'box', '#c0cbdc', [0.03, 0.02, 0.26], [0, -0.26, 0.14]); part(g, 'sph', '#b86f50', [0.26, 0.26, 0.2], [0, 0.5, -0.17]); g.userData.h = 1.0; },
  };
  function buildMon(m) {
    const g = figGroup(), shape = BUILD[m.shape] ? m.shape : 'blob';
    BUILD[shape](g, m.color || '#8b9bb4');
    const sc = (m.boss ? 2 : m.elite ? 1.25 : 1) * 1.15; g.scale.setScalar(sc); g.userData.sc = sc; g.userData.shape = shape;
    selfLight(g, 0.16);
    if (m.boss) { const hh = g.userData.h; for (let i = 0; i < 4; i++) part(g, 'box', '#feae34', [0.07, 0.14, 0.07], [Math.cos(i / 4 * TAU) * 0.14, hh + 0.08, Math.sin(i / 4 * TAU) * 0.14], { shadow: false, m: { emissive: col('#feae34'), emissiveIntensity: 0.5 } }); }
    return g;
  }
  function animMon(g, m, t) {
    const P = g.userData.parts, sh = g.userData.shape, moving = m.state !== 'windup' && !(m.spawn > 0) && m.alive;
    const ph = m.x * 0.1, sw = Math.sin(t * (g.userData.slow ? 6 : 10) + ph);
    g.rotation.y = Math.atan2(m.fx, m.fy);
    let lift = 0;
    if (sh === 'blob') { const q = Math.sin(t * 7 + ph); g.scale.set(g.userData.sc * (1 + q * 0.08), g.userData.sc * (1 - q * 0.1), g.userData.sc * (1 + q * 0.08)); }
    if (g.userData.fly) { lift = 0.05 + Math.sin(t * 5 + ph) * 0.08; const f = Math.sin(t * 15 + ph) * 0.75; P.wingL.rotation.z = f; P.wingR.rotation.z = -f; }
    if (g.userData.hover) lift = 0.15 + Math.sin(t * 3 + ph) * 0.1;
    if (P.legL) { P.legL.rotation.x = moving ? sw * 0.7 : 0; P.legR.rotation.x = moving ? -sw * 0.7 : 0; }
    if (P.armL && sh !== 'ghost') { P.armL.rotation.x = moving ? -sw * 0.5 : 0; P.armR.rotation.x = moving ? sw * 0.5 : 0; }
    if (sh === 'rat') { P.tail.rotation.y = Math.sin(t * 8 + ph) * 0.5; for (const k of Object.keys(P)) if (k[0] === 'l') P[k].rotation.x = moving ? Math.sin(t * 14 + ph + (k.length % 3)) * 0.6 : 0; }
    if (sh === 'spider') for (const l of P.legs) l.rotation.z = -l.userData.s * 0.55 + (moving ? Math.sin(t * 16 + l.userData.i * 1.3 + (l.userData.s > 0 ? Math.PI : 0)) * 0.25 : 0);
    if (sh === 'mushroom') P.cap.rotation.z = Math.sin(t * 4 + ph) * 0.08;
    if (sh === 'worm') P.segs.forEach((s, i) => { s.position.y = s.userData.y0 == null ? (s.userData.y0 = s.position.y) : s.userData.y0 + Math.sin(t * 6 - i * 0.9 + ph) * 0.05 * (moving ? 1 : 0.3); s.position.x = Math.sin(t * 6 - i * 0.9 + ph) * 0.06 * i; });
    if (m.state === 'windup') { lift += Math.sin(t * 60) * 0.015; g.rotation.x = -0.12; } else g.rotation.x = 0;
    if (m.spawn > 0) lift -= (1 - clamp(1 - m.spawn / 0.5, 0, 1)) * 0.5;
    g.position.y = lift;
  }

  // ---------- Begleiter: Geisterwolf (als kleines Tier), Diener des Rufers (Skelett, Geist) ----------
  function buildAlly(a) {
    const shape = a.look === 'geist' ? 'ghost' : a.look === 'skel' ? 'skeleton' : 'rat';
    const g = figGroup(); BUILD[shape](g, a.look === 'geist' ? '#e0a4ff' : a.look === 'skel' ? '#d9c8f0' : a.shadow ? '#b55088' : '#7fe8ff');
    const sc = a.minion ? 0.95 : 1.1; g.scale.setScalar(sc); g.userData.sc = sc; g.userData.shape = shape;
    selfLight(g, 0.3);
    return g;
  }
  function animAlly(g, a, t, W) {
    animMon(g, { x: a.x, fx: a.fx, fy: a.fy, alive: true, spawn: a.spawn > 0 ? a.spawn * 1.25 : 0, state: 'chase' }, t);
    const left = a.until ? a.until - W.t : 9;
    setOpacity(g, a.spawn > 0 ? clamp(1 - a.spawn / 0.4, 0, 1) : left < 1.5 ? 0.5 + Math.sin(t * 20) * 0.3 : 1);
    setTint(g, a.rallyUntil > W.t ? '#f6757a' : a.minion ? '#b55088' : a.shadow ? '#b55088' : '#2ce8f5', 0.35);
  }
  // Sprengfass des Braumeisters
  function buildKeg() {
    const g = figGroup(), P = g.userData.parts;
    part(g, 'cyl', '#b86f50', [0.36, 0.44, 0.36], [0, 0.22, 0]);
    for (const y of [0.1, 0.34]) part(g, 'cyl', '#3a4466', [0.38, 0.04, 0.38], [0, y, 0]);
    part(g, 'box', '#3e2731', [0.03, 0.12, 0.03], [0.05, 0.5, 0], { rot: [0, 0, -0.4] });
    P.spark = part(g, 'sph', '#fee761', [0.08, 0.08, 0.08], [0.09, 0.57, 0], { shadow: false, m: { emissive: col('#feae34'), emissiveIntensity: 1.5 } });
    selfLight(g, 0.15);
    return g;
  }

  // ---------- Gegenstände im Raum (Truhe, Feuer, Händler, Statue, Treppe, Schild) ----------
  function buildProp(p) {
    const g = figGroup(), P = g.userData.parts;
    switch (p.kind) {
      case 'chest': {
        part(g, 'box', '#8a5a3a', [0.9, 0.46, 0.6], [0, 0.23, 0], { m: { map: tex('wood') } });
        for (const x of [-0.3, 0.3]) part(g, 'box', '#3a4466', [0.08, 0.5, 0.64], [x, 0.25, 0]);
        P.lid = new Group(); P.lid.position.set(0, 0.46, -0.3); g.add(P.lid);
        part(P.lid, 'box', '#a0683f', [0.9, 0.26, 0.6], [0, 0.13, 0.3], { m: { map: tex('wood') } }); for (const x of [-0.3, 0.3]) part(P.lid, 'box', '#3a4466', [0.08, 0.3, 0.64], [x, 0.14, 0.3]);
        part(g, 'box', '#feae34', [0.14, 0.16, 0.06], [0, 0.42, 0.32], { shadow: false });
        P.glow = part(g, 'box', '#fee761', [0.8, 0.03, 0.04], [0, 0.46, 0.31], { shadow: false, m: { emissive: col('#fee761'), emissiveIntensity: 1.5 } });
        part(g, 'cyl', '#fee761', [0.3, 0.06, 0.3], [0.1, 0.5, 0.05], { shadow: false, m: { emissive: col('#feae34'), emissiveIntensity: 0.4 } });
        g.userData.h = 0.8; break;
      }
      case 'fire': {
        for (const a of [0.3, 1.4, 2.5]) part(g, 'cyl', '#733e39', [0.12, 0.7, 0.12], [0, 0.07, 0], { rot: [0, a, Math.PI / 2] });
        for (let i = 0; i < 6; i++) part(g, 'box', '#3a4466', [0.14, 0.1, 0.14], [Math.cos(i / 6 * TAU) * 0.45, 0.05, Math.sin(i / 6 * TAU) * 0.45]);
        P.flame = flame(g, 1.0, [0, 0.45, 0]); P.flame2 = flame(g, 0.5, [0, 0.3, 0], '#fff2b0');
        g.userData.h = 0.9; break;
      }
      case 'merchant': {
        part(g, 'box', '#3e2731', [1.6, 0.12, 0.6], [0, 0.56, 0.45]); for (const x of [-0.7, 0.7]) part(g, 'box', '#3e2731', [0.1, 0.56, 0.5], [x, 0.28, 0.45]);
        part(g, 'box', '#68386c', [0.5, 0.6, 0.36], [0, 0.4, 0]); part(g, 'sph', '#e8b796', [0.34, 0.34, 0.34], [0, 0.82, 0]); part(g, 'cone', '#68386c', [0.5, 0.5, 0.5], [0, 1.1, -0.02]); part(g, 'box', '#68386c', [0.56, 0.2, 0.4], [0, 0.9, -0.05]);
        eyes(g, '#fee761', 0.07, 0.84, 0.16, 0.05, true);
        part(g, 'box', '#8a5a3a', [0.2, 0.3, 0.2], [-0.5, 0.77, 0.45], { m: { map: tex('wood') } }); part(g, 'cyl', '#e43b44', [0.14, 0.2, 0.14], [0.4, 0.72, 0.4]); part(g, 'cyl', '#feae34', [0.22, 0.05, 0.22], [0.05, 0.65, 0.5], { m: { emissive: col('#feae34'), emissiveIntensity: 0.5 } });
        P.lamp = flame(g, 0.45, [0.7, 1.0, 0.45], '#ffd080');
        g.userData.h = 1.3; break;
      }
      case 'statue': {
        part(g, 'box', '#3a4466', [1.0, 0.3, 1.0], [0, 0.15, 0]); part(g, 'box', '#5a6988', [0.8, 0.12, 0.8], [0, 0.36, 0]);
        part(g, 'box', '#8b9bb4', [0.44, 0.7, 0.3], [0, 0.77, 0]); part(g, 'box', '#8b9bb4', [0.3, 0.3, 0.28], [0, 1.27, 0]); part(g, 'cone', '#8b9bb4', [0.4, 0.3, 0.4], [0, 1.52, 0]);
        const arm = limb(g, '#8b9bb4', [0.14, 0.5, 0.14], [0.3, 1.05, 0], 'arm'); arm.rotation.x = -1.5; part(arm, 'box', '#8b9bb4', [0.2, 0.06, 0.2], [0, -0.5, 0]);
        part(g, 'box', '#b55088', [0.1, 0.1, 0.1], [0.3, 1.0, 0.56], { shadow: false, m: { emissive: col('#b55088'), emissiveIntensity: 1 } });
        g.userData.h = 1.7; break;
      }
      case 'stairs': {
        part(g, 'box', '#0d0b14', [2.0, 0.08, 1.5], [0, 0.0, 0], { shadow: false, m: { emissive: col('#0d0b14'), emissiveIntensity: 0 } });
        part(g, 'box', '#3a4466', [2.2, 0.1, 0.12], [0, 0.03, -0.8]); part(g, 'box', '#3a4466', [2.2, 0.1, 0.12], [0, 0.03, 0.8]); part(g, 'box', '#3a4466', [0.12, 0.1, 1.6], [-1.1, 0.03, 0]); part(g, 'box', '#3a4466', [0.12, 0.1, 1.6], [1.1, 0.03, 0]);
        for (let i = 0; i < 5; i++) part(g, 'box', ['#5a6988', '#4a5578', '#3a4466', '#262b44', '#181425'][i], [1.8 - i * 0.1, 0.1, 0.26], [0, -0.05 - i * 0.14, -0.6 + i * 0.3], { shadow: false });
        g.userData.h = 0.1; break;
      }
      case 'shrine': {
        part(g, 'box', '#3a4466', [0.8, 0.16, 0.8], [0, 0.08, 0]); part(g, 'box', '#5a6988', [0.36, 0.7, 0.36], [0, 0.5, 0]); part(g, 'box', '#8b9bb4', [0.6, 0.12, 0.6], [0, 0.9, 0]);
        P.orb = part(g, 'sph', '#2ce8f5', [0.34, 0.34, 0.34], [0, 1.25, 0], { shadow: false, m: { emissive: col('#2ce8f5'), emissiveIntensity: 1.4 } });
        g.userData.h = 1.45; break;
      }
      case 'forge': {
        // Schmiede: Esse mit Glut und Feuer, Amboss, Schmied mit rotem Bart und Hammer
        part(g, 'box', '#3a4466', [0.8, 0.62, 0.7], [-1.05, 0.31, 0]); part(g, 'box', '#5a6988', [0.86, 0.08, 0.76], [-1.05, 0.64, 0]);
        P.coal = part(g, 'box', '#f77622', [0.6, 0.05, 0.5], [-1.05, 0.69, 0], { shadow: false, m: { emissive: col('#f77622'), emissiveIntensity: 1.3 } });
        part(g, 'box', '#fee761', [0.36, 0.2, 0.04], [-1.05, 0.3, 0.36], { shadow: false, m: { emissive: col('#feae34'), emissiveIntensity: 1.5 } });
        P.fl = flame(g, 0.55, [-1.05, 0.95, 0]);
        part(g, 'box', '#3a4466', [0.2, 0.32, 0.2], [0.75, 0.16, 0.1]); part(g, 'box', '#5a6988', [0.56, 0.14, 0.26], [0.75, 0.38, 0.1]); part(g, 'cone', '#5a6988', [0.12, 0.2, 0.12], [1.1, 0.38, 0.1], { rot: [0, 0, -Math.PI / 2] });
        limb(g, '#262b44', [0.14, 0.3, 0.16], [-0.12, 0.3, 0], 'legL'); limb(g, '#262b44', [0.14, 0.3, 0.16], [0.08, 0.3, 0], 'legR');
        part(g, 'box', '#3a4466', [0.42, 0.38, 0.28], [-0.02, 0.52, 0]); part(g, 'box', '#733e39', [0.36, 0.42, 0.04], [0.0, 0.48, 0.15]);
        part(g, 'box', '#e8b796', [0.3, 0.28, 0.28], [-0.02, 0.86, 0]); part(g, 'box', '#be4a2f', [0.3, 0.2, 0.08], [-0.02, 0.72, 0.15]); eyes(g, '#181425', 0.07, 0.9, 0.145, 0.04);
        P.arm = limb(g, '#e8b796', [0.11, 0.34, 0.11], [0.24, 0.66, 0.02], 'arm');
        part(P.arm, 'box', '#733e39', [0.05, 0.36, 0.05], [0, -0.36, 0.12], { rot: [Math.PI / 2, 0, 0] }); part(P.arm, 'box', '#8b9bb4', [0.2, 0.14, 0.14], [0, -0.36, 0.3]);
        g.userData.h = 1.1; break;
      }
      case 'sign': {
        part(g, 'box', '#733e39', [0.08, 0.9, 0.08], [0, 0.45, 0]); part(g, 'box', '#b86f50', [0.9, 0.42, 0.08], [0, 0.95, 0.02], { m: { map: tex('wood') } });
        g.userData.h = 1.25; break;
      }
    }
    P.arrow = part(g, 'cone', '#fee761', [0.25, 0.32, 0.25], [0, g.userData.h + 0.35, 0], { rot: [Math.PI, 0, 0], shadow: false, m: { emissive: col('#feae34'), emissiveIntensity: 0.9 } });
    P.arrow.visible = false;
    return g;
  }
  function buildFurn(kind) {
    const g = figGroup();
    if (kind === 'barrel') { part(g, 'cyl', '#8a5a3a', [0.62, 0.72, 0.62], [0, 0.36, 0], { m: { map: tex('wood') } }); for (const y of [0.16, 0.56]) part(g, 'cyl', '#3a4466', [0.66, 0.06, 0.66], [0, y, 0]); }
    else if (kind === 'crate') { part(g, 'box', '#8a5a3a', [0.72, 0.62, 0.72], [0, 0.31, 0], { m: { map: tex('wood') } }); part(g, 'box', '#5a3a22', [0.76, 0.08, 0.76], [0, 0.31, 0]); part(g, 'box', '#5a3a22', [0.08, 0.66, 0.76], [0, 0.31, 0]); }
    else { part(g, 'cyl', '#b86f50', [0.46, 0.5, 0.46], [0, 0.25, 0]); part(g, 'cyl', '#733e39', [0.54, 0.08, 0.54], [0, 0.5, 0]); part(g, 'cyl', '#3e2731', [0.36, 0.04, 0.36], [0, 0.55, 0], { shadow: false }); }
    return g;
  }

  // ---------- Teilchen als Punkte (eigener kleiner Shader: Grösse und Farbe je Punkt) ----------
  const PMAX = 520;
  function makePoints(additive) {
    const geo = new BufferGeometry();
    const pos = new Float32Array(PMAX * 3), colr = new Float32Array(PMAX * 3), siz = new Float32Array(PMAX), alp = new Float32Array(PMAX);
    geo.setAttribute('position', new BufferAttribute(pos, 3).setUsage(DynamicDrawUsage));
    geo.setAttribute('aColor', new BufferAttribute(colr, 3).setUsage(DynamicDrawUsage));
    geo.setAttribute('aSize', new BufferAttribute(siz, 1).setUsage(DynamicDrawUsage));
    geo.setAttribute('aAlpha', new BufferAttribute(alp, 1).setUsage(DynamicDrawUsage));
    geo.setDrawRange(0, 0);
    const mat = new ShaderMaterial({
      uniforms: { uScale: { value: 300 } },
      vertexShader: 'attribute vec3 aColor; attribute float aSize; attribute float aAlpha; varying vec3 vC; varying float vA; uniform float uScale;\nvoid main(){ vC = aColor; vA = aAlpha; vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_PointSize = aSize * uScale / -mv.z; gl_Position = projectionMatrix * mv; }',
      fragmentShader: 'varying vec3 vC; varying float vA;\nvoid main(){ vec2 d = gl_PointCoord - 0.5; float r = length(d) * 2.0; if (r > 1.0) discard; float a = (1.0 - smoothstep(0.45, 1.0, r)) * vA; gl_FragColor = vec4(vC, a);\n#include <tonemapping_fragment>\n#include <colorspace_fragment>\n}',
      transparent: true, depthWrite: false, blending: additive ? AdditiveBlending : undefined,
    });
    const pts = new Points(geo, mat); pts.frustumCulled = false;
    return pts;
  }

  // ---------- Die Darstellung ----------
  A.Draw3 = class {
    constructor(canvas, flat) {
      this.cv = canvas; this.flat = flat;
      this.t = 0; this.cam = null; this.levelW = null; this.topPad = 60; this.botPad = 0; this._quality = 'hi';
      this.r = new WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
      this.r.shadowMap.enabled = true; this.r.shadowMap.type = PCFSoftShadowMap;
      this.r.toneMapping = ACESFilmicToneMapping; this.r.toneMappingExposure = 1.25;
      this.scene = new Scene(); this.scene.background = new Color('#0d0b14'); this.scene.fog = new FogExp2(new Color('#0d0b14'), 0.012);
      this.camera = new PerspectiveCamera(38, 1, 0.5, 120); this.pitch = 0.9;   // Blickwinkel von oben (rad)
      this.hemi = new HemisphereLight(new Color('#55608f'), new Color('#1a1424'), 3.2); this.scene.add(this.hemi);
      this.sun = new DirectionalLight(new Color('#8fa3d8'), 2.6); this.sun.castShadow = true; this.sun.shadow.bias = -0.0015; this.sun.shadow.normalBias = 0.03;
      this.sun.shadow.camera.near = 1; this.sun.shadow.camera.far = 60; this.scene.add(this.sun); this.scene.add(this.sun.target);
      this.pl = []; for (let i = 0; i < 8; i++) { const l = new PointLight(0xffffff, 0, 9, 2); l.visible = false; this.scene.add(l); this.pl.push(l); }
      this.lvl = null; this.dyn = new Group(); this.scene.add(this.dyn);
      this.figs = new Map();   // Spielobjekt -> Gruppe
      this.ptsN = makePoints(false); this.ptsA = makePoints(true); this.scene.add(this.ptsN); this.scene.add(this.ptsA);
      this.rings = []; for (let i = 0; i < 24; i++) { const m = new Mesh(GEO.ring, new MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false, side: DoubleSide })); m.rotation.x = -Math.PI / 2; m.visible = false; this.scene.add(m); this.rings.push(m); }
      this.arcs = []; for (let i = 0; i < 4; i++) { const m = new Mesh(GEO.arc, new MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false, side: DoubleSide })); m.rotation.x = -Math.PI / 2; m.visible = false; this.scene.add(m); this.arcs.push(m); }
      this.decMax = 400; this.decN = 0;
      this.dec = new InstancedMesh(GEO.plane, new MeshLambertMaterial({ color: 0xffffff, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }), this.decMax);
      this.dec.instanceMatrix.setUsage(DynamicDrawUsage); this.dec.frustumCulled = false; this.dec.receiveShadow = true;
      _o.scale.setScalar(0); _o.position.set(0, -5, 0); _o.updateMatrix(); for (let i = 0; i < this.decMax; i++) { this.dec.setMatrixAt(i, _o.matrix); this.dec.setColorAt(i, col('#000000')); }
      this.scene.add(this.dec);
      this.shotPool = new Map(); this.pickPool = new Map(); this.nLights = 8; this.frameTimes = []; this.litAt = {}; this.levelAge = 0;
      this.resize(); new ResizeObserver(() => this.resize()).observe(canvas);
    }
    get quality() { return this._quality; }
    set quality(v) {
      this._quality = v; const hi = v === 'hi';
      this.r.shadowMap.enabled = hi; this.scene.traverse(o => { if (o.material) o.material.needsUpdate = true; });
      this.nLights = hi ? 8 : 4; this.resize();
    }
    resize() {
      const rect = this.cv.getBoundingClientRect(); const dpr = Math.min(this._quality === 'hi' ? 2 : 1, window.devicePixelRatio || 1);
      this.W = Math.max(2, rect.width); this.H = Math.max(2, rect.height); this.dpr = dpr;
      this.r.setPixelRatio(dpr); this.r.setSize(this.W, this.H, false);
      this.camera.aspect = this.W / this.H;
      const big = Math.max(this.W, this.H) * dpr > 1500; this.sun.shadow.mapSize.set(big ? 2048 : 1024, big ? 2048 : 1024); if (this.sun.shadow.map) { this.sun.shadow.map.dispose(); this.sun.shadow.map = null; }
      this.ptsN.material.uniforms.uScale.value = this.ptsA.material.uniforms.uScale.value = (this.H * dpr / 2) / Math.tan(this.camera.fov / 2 * Math.PI / 180);
    }

    // ---------- Ebene bauen ----------
    buildLevel(W) {
      if (this.lvl) { const shared = Object.values(GEO); this.scene.remove(this.lvl); this.lvl.traverse(o => { if (o.geometry && !shared.includes(o.geometry)) o.geometry.dispose(); if (o.material && !o.isSprite) (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => m.dispose()); }); }
      for (const g of this.figs.values()) this.dyn.remove(g); this.figs.clear();
      this.decN = 0; _o.scale.setScalar(0); _o.position.set(0, -5, 0); _o.updateMatrix(); for (let i = 0; i < this.decMax; i++) this.dec.setMatrixAt(i, _o.matrix); this.dec.instanceMatrix.needsUpdate = true;
      const MW = A.World.MW, MH = A.World.MH, th = A.Draw.THEMES[A.Draw.themeOf(W.floor)]; this.theme = th; this.themeKey = A.Draw.themeOf(W.floor);
      const lvl = new Group(); this.lvl = lvl; this.scene.add(lvl);
      const seed = (W.seed >>> 0) % 100000;
      const tile = (x, y) => (x < 0 || y < 0 || x >= MW || y >= MH) ? 0 : W.tiles[y][x];
      const isF = (x, y) => tile(x, y) !== 0;
      const nearFloor = (x, y, d) => { for (let dy = -d; dy <= d; dy++) for (let dx = -d; dx <= d; dx++) if (isF(x + dx, y + dy)) return true; return false; };
      // Boden: je Kachel ein flacher Klotz (kleine Fugen dazwischen), Wände: hohe Klötze
      const floors = [], walls = [], walls2 = [], M = 7;   // M: Rand aus Fels um die Karte
      for (let y = -M; y < MH + M; y++) for (let x = -M; x < MW + M; x++) { if (isF(x, y)) floors.push([x, y]); else if (nearFloor(x, y, 1)) walls.push([x, y]); else walls2.push([x, y]); }
      const FL = th.floor, stone = tex('stone');
      const fm = new InstancedMesh(new BoxGeometry(0.96, 0.16, 0.96), new MeshLambertMaterial({ color: 0xffffff, map: stone }), floors.length);
      fm.receiveShadow = true; fm.frustumCulled = false;
      floors.forEach(([x, y], i) => {
        _o.position.set(x + 0.5, -0.08 + (hash(x, y, seed + 5) - 0.5) * 0.02, y + 0.5); _o.rotation.set(0, Math.floor(hash(x, y, seed + 6) * 4) * Math.PI / 2, 0); _o.scale.setScalar(1); _o.updateMatrix(); fm.setMatrixAt(i, _o.matrix);
        // Grube (Wasser, Lava, Abgrund) tiefer und in ihrer Farbe, Gefahr-Boden (Schlamm, Treibsand, Glut) eingefärbt
        const tv = tile(x, y), pit = tv === 4 && th.pit, hz = tv === 5 && th.haz;
        if (pit) { _o.position.y = -0.3; _o.updateMatrix(); fm.setMatrixAt(i, _o.matrix); }
        const base = pit ? (hash(x, y, seed + 9) < 0.2 ? th.pit.mid : th.pit.base) : hz ? (hash(x, y, seed + 9) < 0.3 ? th.haz.mid : th.haz.base) : FL[Math.floor(hash(x, y, seed + 7) * FL.length)];
        const c = shade(base, (pit && (th.pit.lava || th.pit.void) ? 1.6 : 1.25) + (hash(x, y, seed + 8) - 0.5) * 0.3); fm.setColorAt(i, c);
      });
      fm.instanceColor.needsUpdate = true; lvl.add(fm);
      // Fugenplatte unter allem
      const base = new Mesh(new PlaneGeometry(MW + 6, MH + 6), lam(th.mortar)); base.rotation.x = -Math.PI / 2; base.position.set(MW / 2, -0.18, MH / 2); base.receiveShadow = true; lvl.add(base);
      const brick = tex('brick'), cap = tex('cap');
      const wallMats = [new MeshLambertMaterial({ color: 0xffffff, map: brick }), new MeshLambertMaterial({ color: 0xffffff, map: brick }), new MeshLambertMaterial({ color: 0xffffff, map: cap }), new MeshLambertMaterial({ color: 0x000000 }), new MeshLambertMaterial({ color: 0xffffff, map: brick }), new MeshLambertMaterial({ color: 0xffffff, map: brick })];
      const wm = new InstancedMesh(new BoxGeometry(1, 1.3, 1), wallMats, walls.length); wm.castShadow = true; wm.receiveShadow = true; wm.frustumCulled = false;
      walls.forEach(([x, y], i) => { _o.position.set(x + 0.5, 0.65, y + 0.5); _o.rotation.set(0, 0, 0); _o.scale.setScalar(1); _o.updateMatrix(); wm.setMatrixAt(i, _o.matrix); wm.setColorAt(i, shade(th.brick[Math.floor(hash(x, y, seed + 21) * th.brick.length)], 1.2 + (hash(x, y, seed + 22) - 0.5) * 0.25)); });
      wm.instanceColor.needsUpdate = true; lvl.add(wm);
      if (walls2.length) {
        const w2 = new InstancedMesh(new BoxGeometry(1, 1.4, 1), new MeshLambertMaterial({ color: 0xffffff, map: cap }), walls2.length); w2.frustumCulled = false; w2.receiveShadow = true;
        walls2.forEach(([x, y], i) => { _o.position.set(x + 0.5, 0.7, y + 0.5); _o.rotation.set(0, 0, 0); _o.scale.setScalar(1); _o.updateMatrix(); w2.setMatrixAt(i, _o.matrix); w2.setColorAt(i, shade(th.cap, 1.1 + (hash(x, y, seed + 23) - 0.5) * 0.3)); });
        w2.instanceColor.needsUpdate = true; lvl.add(w2);
      }
      // Gitter an Türen (werden bei Kampf heruntergelassen)
      this.gates = [];
      for (const r of W.rooms) for (const [x, y] of r.doors) {
        if (this.gates.some(g => g.x === x && g.y === y)) continue;
        const g = new Group(); g.position.set(x + 0.5, 0, y + 0.5); g.userData.mats = [];
        for (let i = 0; i < 3; i++) part(g, 'box', '#8b9bb4', [0.07, 1.25, 0.07], [-0.3 + i * 0.3, 0.62, 0]); part(g, 'box', '#5a6988', [0.96, 0.08, 0.1], [0, 0.4, 0]); part(g, 'box', '#5a6988', [0.96, 0.08, 0.1], [0, 1.1, 0]);
        lvl.add(g); this.gates.push({ x, y, g });
      }
      // Möbel, Deko, Lichter und Gegenstände je Raum (gleiche Zufallsfolge wie die 2D-Zeichnung)
      this.lights = []; this.torches = []; this.flames = []; this.propG = new Map();
      const rng = new A.RNG((W.seed ^ 0x5bd1e995) >>> 0 || 7);
      const addFlame = (x, y, z, size, color) => { const f = flame(lvl, size, [x, y, z], color); f.userData.ph = rng.next() * 10; f.userData.s0 = size; this.flames.push(f); return f; };
      for (const r of W.rooms) {
        const rx = r.x, ry = r.y, rw = r.w, rh = r.h, wallZ = r.y;   // Vorderkante der oberen Wand
        const hasFront = !isF(r.x + 2, r.y - 1) && isF(r.x + 2, r.y);
        for (const cc of [2, r.w - 3]) {
          if (!hasFront) continue; const x = r.x + cc + 0.5;
          part(lvl, 'box', '#262b44', [0.14, 0.26, 0.12], [x, 0.78, wallZ + 0.06]); part(lvl, 'cyl', '#3a4466', [0.16, 0.12, 0.16], [x, 0.93, wallZ + 0.1]);
          addFlame(x, 1.1, wallZ + 0.16, 0.62).userData.room = r.i; this.torches.push({ x, y: 1.05, z: wallZ + 0.4, room: r.i, ph: rng.next() * 10 });
        }
        if (rng.chance(r.type === 'boss' ? 1 : 0.55) && hasFront) for (const cc of [4, r.w - 5]) { const x = r.x + cc + 0.5; part(lvl, 'box', th.banner[1], [0.5, 0.8, 0.03], [x, 0.72, wallZ + 0.02]); part(lvl, 'box', th.banner[0], [0.5, 0.2, 0.035], [x, 0.38, wallZ + 0.02]); part(lvl, 'box', th.banner[2], [0.14, 0.14, 0.04], [x, 0.8, wallZ + 0.03], { shadow: false }); part(lvl, 'box', '#3a4466', [0.6, 0.04, 0.06], [x, 1.13, wallZ + 0.03]); }
        for (const [cx, dir] of [[rx, 1], [rx + rw, -1]]) if (rng.chance(0.5)) { /* Spinnweben: im 3D-Look weggelassen */ }
        const nb = r.type === 'start' ? 0 : rng.int(1, 4);
        for (let i = 0; i < nb; i++) { const skull = rng.chance(0.4); const x = rx + 0.75 + rng.next() * (rw - 1.5), z = ry + 0.9 + rng.next() * (rh - 1.5); if (skull) { part(lvl, 'box', '#ead4aa', [0.2, 0.17, 0.2], [x, 0.085, z]); part(lvl, 'box', '#181425', [0.05, 0.05, 0.03], [x - 0.05, 0.1, z + 0.1], { shadow: false }); part(lvl, 'box', '#181425', [0.05, 0.05, 0.03], [x + 0.05, 0.1, z + 0.1], { shadow: false }); } else { part(lvl, 'box', '#ead4aa', [0.34, 0.05, 0.05], [x, 0.03, z], { rot: [0, 0.5, 0] }); part(lvl, 'box', '#ead4aa', [0.3, 0.05, 0.05], [x + 0.1, 0.03, z + 0.1], { rot: [0, -0.9, 0] }); } }
        const mc = th.moss;
        for (let i = 0; i < (this.themeKey === 'grotto' ? 6 : 2); i++) { const x = rx + rng.next() * rw, z = rng.chance(0.5) ? ry + 0.15 + rng.next() * 0.4 : ry + rh - 0.3 - rng.next() * 0.4; for (let k = 0; k < 3; k++) part(lvl, 'box', mc[k % mc.length], [0.3 + rng.next() * 0.3, 0.02, 0.2 + rng.next() * 0.2], [x + (rng.next() - 0.5) * 0.8, 0.005, z + (rng.next() - 0.5) * 0.4], { shadow: false }); }
        if (rng.chance(this.themeKey === 'grotto' ? 0.8 : 0.35)) {
          const x = rx + 1.5 + rng.next() * (rw - 3), z = ry + 1.5 + rng.next() * (rh - 3), w = 0.5 + rng.next() * 0.6, h = 0.2 + rng.next() * 0.2;
          const slime = this.themeKey === 'grotto', lava = this.themeKey === 'rust';
          const c = slime ? '#4fa84d' : lava ? '#f77622' : '#2a3d70';
          part(lvl, 'circ', c, [w * 2, h * 2, 1], [x, 0.012, z], { rot: [-Math.PI / 2, 0, 0], shadow: false, m: { transparent: true, opacity: slime || lava ? 0.85 : 0.6, emissive: col(c), emissiveIntensity: slime || lava ? 0.9 : 0.25 } });
          if (slime || lava) this.lights.push({ x, y: 0.3, z, color: slime ? '#63c74d' : '#f77622', i: 2.5, d: 4, fl: lava ? 2 : 0.6 });
        }
        if (this.themeKey === 'grotto') for (let i = 0; i < rng.int(1, 3); i++) { const x = rx + 0.5 + rng.next() * (rw - 1), z = ry + (rng.chance(0.5) ? 0.6 : rh - 0.3); part(lvl, 'cone', '#2ce8f5', [0.22, 0.3, 0.22], [x, 0.15, z], { m: { emissive: col('#2ce8f5'), emissiveIntensity: 1.2 } }); part(lvl, 'cone', '#2ce8f5', [0.14, 0.2, 0.14], [x + 0.18, 0.1, z + 0.1], { m: { emissive: col('#2ce8f5'), emissiveIntensity: 1.2 } }); this.lights.push({ x, y: 0.4, z, color: '#2ce8f5', i: 3, d: 4.5, fl: 0.4 }); }
        if (this.themeKey === 'rust') for (let i = 0; i < rng.int(1, 2); i++) { const x = rx + 0.6 + rng.next() * (rw - 1.2), z = ry + 0.6 + rng.next() * (rh - 1.2); part(lvl, 'box', '#f77622', [0.9, 0.02, 0.12], [x, 0.01, z], { rot: [0, rng.next() * 3, 0], shadow: false, m: { emissive: col('#f77622'), emissiveIntensity: 1.5 } }); this.lights.push({ x, y: 0.3, z, color: '#f77622', i: 3, d: 4, fl: 2 }); }
        const cx = rx + rw / 2, cz = ry + rh / 2;
        if (r.type === 'boss' || r.type === 'event') {
          const c = r.type === 'boss' ? '#a22633' : '#68386c', R = r.type === 'boss' ? 2.1 : 1.4;
          part(lvl, 'ring', c, [R * 2, R * 2, 1], [cx, 0.01, cz], { rot: [-Math.PI / 2, 0, 0], shadow: false, m: { emissive: col(c), emissiveIntensity: 0.6, side: DoubleSide } });
          for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; part(lvl, 'box', c, [0.14, 0.03, 0.14], [cx + Math.cos(a) * R * 0.92, 0.015, cz + Math.sin(a) * R * 0.92], { shadow: false, m: { emissive: col(c), emissiveIntensity: 0.6 } }); }
          if (r.type === 'event') for (let i = 0; i < 4; i++) { const a = i / 4 * TAU + 0.78; const x = cx + Math.cos(a) * 1.6, z = cz + Math.sin(a) * 1.1 + 0.25; part(lvl, 'cyl', '#ead4aa', [0.1, 0.22, 0.1], [x, 0.11, z]); addFlame(x, 0.3, z, 0.2, '#ffe0a0'); this.lights.push({ x, y: 0.4, z, color: '#feae34', i: 2.2, d: 3, fl: 1.5, room: r.i }); }
          if (r.type === 'boss') for (const [x, z] of [[rx + 1.1, ry + 1.4], [rx + rw - 1.1, ry + 1.4], [rx + 1.1, ry + rh - 0.8], [rx + rw - 1.1, ry + rh - 0.8]]) { part(lvl, 'cyl', '#262b44', [0.7, 0.5, 0.7], [x, 0.25, z]); part(lvl, 'cyl', '#3a4466', [0.8, 0.1, 0.8], [x, 0.5, z]); addFlame(x, 0.78, z, 0.75).userData.room = r.i; this.torches.push({ x, y: 0.9, z, room: r.i, ph: rng.next() * 10, big: true }); }
        }
        if (r.type === 'shop' || r.type === 'rest') {
          const w = 2.75, h = 1.6, z0 = cz + (r.type === 'shop' ? -0.25 : 0.12);
          part(lvl, 'box', r.type === 'shop' ? '#68386c' : '#733e39', [w, 0.03, h], [cx, 0.012, z0], { shadow: false }); part(lvl, 'box', r.type === 'shop' ? '#b55088' : '#b86f50', [w - 0.3, 0.035, h - 0.3], [cx, 0.013, z0], { shadow: false }); part(lvl, 'box', r.type === 'shop' ? '#68386c' : '#733e39', [w - 0.6, 0.04, h - 0.6], [cx, 0.014, z0], { shadow: false });
          if (r.type === 'shop') { for (const [k, dx, dz] of [['crate', -1.6, -0.4], ['barrel', 1.6, -0.5], ['pot', 1.25, 0.4]]) { const f = buildFurn(k); f.position.set(cx + dx, 0, cz + dz); lvl.add(f); } }
        }
        if (r.type === 'start') {
          const beam = new Mesh(new CylinderGeometry(0.3, 0.7, 5, 16, 1, true), new MeshBasicMaterial({ color: col('#a8c8ff'), transparent: true, opacity: 0.045, blending: AdditiveBlending, depthWrite: false, side: DoubleSide })); beam.position.set(cx, 2.5, cz - 0.4); lvl.add(beam);
          this.lights.push({ x: cx, y: 1.2, z: cz - 0.4, color: '#a8c8ff', i: 2.5, d: 5, fl: 0.2 });
          part(lvl, 'cyl', '#b86f50', [0.045, 5.5, 0.045], [cx + 0.9, 2.75, cz - 0.1]);
        }
        if (r.furn) for (const f of r.furn) { const g = buildFurn(f.kind); g.position.set(f.tx + 0.5, 0, f.ty + 0.5); g.rotation.y = rng.next() * 0.6 - 0.3; lvl.add(g); }
        for (const p of r.props) { const g = buildProp(p); g.position.set(p.x * U, 0, p.y * U); lvl.add(g); this.propG.set(p, g); }
      }
      this.levelW = W; this.litAt = {}; this.cam = null; this.levelAge = 0;
    }

    // ---------- Beute und Geschosse ----------
    buildPick(p) {
      const g = figGroup();
      if (p.kind === 'gold') { part(g, 'cyl', '#feae34', [0.3, 0.06, 0.3], [0, 0.16, 0], { rot: [Math.PI / 2, 0, 0], m: { emissive: col('#feae34'), emissiveIntensity: 0.35 } }); part(g, 'cyl', '#fee761', [0.18, 0.07, 0.18], [0, 0.16, 0], { rot: [Math.PI / 2, 0, 0], shadow: false }); }
      else if (p.kind === 'potion') { part(g, 'sph', '#e43b44', [0.28, 0.3, 0.28], [0, 0.16, 0], { m: { emissive: col('#a22633'), emissiveIntensity: 0.5 } }); part(g, 'cyl', '#c0cbdc', [0.1, 0.12, 0.1], [0, 0.34, 0]); part(g, 'cyl', '#b86f50', [0.12, 0.06, 0.12], [0, 0.42, 0]); }
      else {
        const it = p.it, c = A.RARITY[it.rarity].color, s = A.Art.sprite(A.Art.itemIcon(it.base)), big = it.rarity !== 'common' && it.rarity !== 'good';
        const tx = iconTexture(A.Art.itemIcon(it.base));
        const sp = new Sprite(new SpriteMaterial({ map: tx, transparent: true, alphaTest: 0.2 })); const k = 0.8 / Math.max(s.w, s.h); sp.scale.set(s.w * k, s.h * k, 1); sp.position.set(0, 0.42, 0); g.add(sp); g.userData.parts.icon = sp;
        part(g, 'circ', c, [0.9, 0.5, 1], [0, 0.006, 0], { rot: [-Math.PI / 2, 0, 0], shadow: false, m: { transparent: true, opacity: 0.55, emissive: col(c), emissiveIntensity: 0.9 } });
        if (big) { const beam = new Mesh(new CylinderGeometry(0.16, 0.26, 3.2, 10, 1, true), new MeshBasicMaterial({ color: col(c), transparent: true, opacity: 0.16, blending: AdditiveBlending, depthWrite: false, side: DoubleSide })); beam.position.y = 1.6; g.add(beam); g.userData.parts.beam = beam; }
      }
      return g;
    }
    buildShot(s) {
      const g = figGroup();
      if (s.opts.lob) { // Flasche: bunter Bauch, heller Hals, Leuchten in der Farbe der Füllung
        const fl = part(g, 'sph', s.color, [0.2, 0.24, 0.2], [0, 0, 0], { shadow: false, m: { emissive: col(s.color), emissiveIntensity: 0.9 } });
        part(fl, 'cyl', '#c0cbdc', [0.35, 0.5, 0.35], [0, 0.65, 0], { shadow: false });
        const gl = new Sprite(new SpriteMaterial({ map: tex('glow'), color: col(s.color), blending: AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.6 })); gl.scale.set(0.55, 0.55, 1); g.add(gl);
      }
      else if (s.side === 'hero' && s.opts.kind !== 'magic') { part(g, 'box', '#8b7355', [0.03, 0.03, 0.55], [0, 0, 0], { shadow: false }); part(g, 'cone', '#c0cbdc', [0.07, 0.12, 0.07], [0, 0, 0.3], { rot: [Math.PI / 2, 0, 0], shadow: false }); part(g, 'box', '#e43b44', [0.08, 0.02, 0.1], [0, 0, -0.24], { shadow: false }); }
      else {
        const hero = s.side === 'hero', ring = hero ? s.color : (s.opts.kind === 'magic' ? '#b55088' : '#e43b44');
        part(g, 'sph', ring, [0.24, 0.24, 0.24], [0, 0, 0], { shadow: false, m: { emissive: col(ring), emissiveIntensity: 1.3 } });
        const gl = new Sprite(new SpriteMaterial({ map: tex('glow'), color: col(ring), blending: AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.8 })); gl.scale.set(0.7, 0.7, 1); g.add(gl);
      }
      return g;
    }

    // ---------- Punkt auf dem Bildschirm (für Zahlen und Balken in der 2D-Ebene) ----------
    project(x, y, z) { _v.set(x, y, z).project(this.camera); const fl = this.flat; return [(_v.x + 1) / 2 * fl.dw, (1 - _v.y) / 2 * fl.dh]; }

    // ---------- Ein Bild ----------
    draw(W, dt) {
      this.t += dt; if (!W) return;
      if (this.levelW !== W) this.buildLevel(W);
      const h = W.hero, t = this.t, MW = A.World.MW, MH = A.World.MH, run = A.Game.run;
      this.levelAge += dt;
      for (const r of W.rooms) if (r.visited && this.litAt[r.i] == null) { this.litAt[r.i] = this.levelAge > 0.5 ? t : t - 5; if (this.levelAge > 0.5 && A.FX) A.FX.ev('ignite'); }
      // Kamera: folgt weich, schaut etwas voraus, bleibt innerhalb der Karte
      const tx = h.x * U + (h.moving ? h.fx * 0.75 : 0), tz = h.y * U + (h.moving ? h.fy * 0.5 : 0);
      if (!this.cam) this.cam = { x: tx, z: tz };
      const k = 1 - Math.exp(-dt * 7); this.cam.x += (tx - this.cam.x) * k; this.cam.z += (tz - this.cam.z) * k;
      const asp = this.camera.aspect, tanH = Math.tan(this.camera.fov / 2 * Math.PI / 180), sp = Math.sin(this.pitch), cp = Math.cos(this.pitch);
      const D = Math.max(10 * sp / (2 * tanH), 7.5 / (2 * tanH * asp));
      const hw = D * tanH * asp, hd = D * tanH / sp;
      let cx = MW > 2 * hw ? clamp(this.cam.x, hw, MW - hw) : MW / 2, cz = MH > 2 * hd ? clamp(this.cam.z, hd, MH - hd) : MH / 2;
      const tr = A.FX ? A.FX.trauma : 0, shk = tr * tr * 0.45;
      cx += shk * (Math.sin(t * 61) + Math.sin(t * 37)) * 0.5; cz += shk * (Math.sin(t * 53 + 1) + Math.sin(t * 29)) * 0.5;
      this.camera.position.set(cx, D * sp, cz + D * cp); this.camera.lookAt(cx, 0.3, cz);
      const fw = Math.round(this.W * this.dpr), fh = Math.round(this.H * this.dpr), dy = Math.round((this.topPad - (this.botPad || 0)) / 2 * this.dpr);
      this.camera.setViewOffset(fw, fh, 0, -dy, fw, fh); this.camera.updateProjectionMatrix();
      this.sun.position.set(cx - 5, 12, cz + 3); this.sun.target.position.set(cx, 0, cz);
      const sc = this.sun.shadow.camera; sc.left = -hw - 2; sc.right = hw + 2; sc.top = hd + 3; sc.bottom = -hd - 3; sc.updateProjectionMatrix();
      // Lichter: die wichtigsten in der Nähe bekommen eine der echten Lichtquellen
      const L = []; const hx = h.x * U, hz = h.y * U;
      const push = (x, y, z, color, i, d, prio) => { if (i <= 0.01) return; L.push({ x, y, z, color, i, d, s: (prio || 0) - Math.hypot(x - hx, z - hz) }); };
      const fl = (ph, kk) => 0.86 + Math.sin(t * 9 * (kk || 1) + ph) * 0.07 + Math.sin(t * 23 + ph * 2) * 0.05;
      push(hx, 1.2, hz + 0.3, '#ffcf94', 14, 9, 100);
      for (const tc of this.torches) { const lit = this.litAt[tc.room]; if (lit == null) continue; const grow = clamp((t - lit) / 0.6, 0, 1); push(tc.x, tc.y, tc.z, '#ff9a3a', (tc.big ? 20 : 15) * fl(tc.ph) * grow, tc.big ? 9 : 8, 10); }
      for (const lt of this.lights) { if (lt.room != null && this.litAt[lt.room] == null) continue; push(lt.x, lt.y, lt.z, lt.color, lt.i * 1.6 * (lt.fl ? 0.85 + Math.sin(t * 3 * lt.fl + lt.x) * 0.15 : 1), lt.d, 0); }
      for (const r of W.rooms) for (const p of r.props) {
        if (p.hidden) continue; const x = p.x * U, z = p.y * U;
        if (p.kind === 'fire') push(x, 0.7, z, '#ff8a30', (p.used ? 7 : 16) * fl(p.x, 1.2), 8, 20);
        else if (p.kind === 'stairs') push(x, 0.5, z, '#b55088', 7 + Math.sin(t * 2) * 1, 5, 5);
        else if (p.kind === 'merchant') push(x + 0.7, 1.1, z + 0.45, '#feae34', 7, 5, 5);
        else if (p.kind === 'statue') push(x + 0.3, 1.2, z + 0.6, '#b55088', 2.5, 3.5, 2);
        else if (p.kind === 'chest' && !p.used) push(x, 0.6, z + 0.3, '#feae34', 1.5, 3, 2);
        else if (p.kind === 'shrine') push(x, 1.3, z, '#2ce8f5', p.used ? 1.5 : 5, 4, 4);
        else if (p.kind === 'forge') push(x - 1.05, 0.9, z + 0.2, '#ff8a30', 9 * fl(p.x, 1.3), 6, 12);
      }
      for (const p of W.picks) if (p.kind === 'item') push(p.x * U, 0.5, p.y * U, A.RARITY[p.it.rarity].color, 2.5, 3, 3);
      for (const s of W.shots) if (s.opts.kind === 'magic' || s.side !== 'hero') push(s.x * U, 0.4, s.y * U, s.side === 'hero' ? s.color : (s.opts.kind === 'magic' ? '#b55088' : '#e43b44'), 2.5, 3, 4);
      for (const m of W.mons) {
        if (!m.alive) continue; const x = m.x * U, z = m.y * U;
        if (m.mid === 'glutmotte') push(x, 0.8, z, '#ff8a30', 3 * fl(m.x, 2), 4, 3); else if (m.mid === 'spiegelgeist') push(x, 0.8, z, '#9fd8ff', 2, 4, 3); else if (m.boss) push(x, 1.5, z, '#e43b44', 3, 6, 6);
        if (m.state === 'windup') push(x, 0.6, z, '#e43b44', 3, 3, 8);
      }
      if (run && (run.cls === 'weber' || run.cls === 'rufer') && h.alive) push(hx + h.fx * 0.3, 1.3, hz + h.fy * 0.3, run.cls === 'rufer' ? '#e0a4ff' : '#2ce8f5', 2.5 + (h.swing > 0 ? 2 : 0), 3.5, 9);
      if (A.FX) for (const f of A.FX.flashes) push(f.x * U, 0.6, f.y * U, f.color, f.r * U * 2.2 * (f.life / f.max), f.r * U * 2 + 2, 50);
      L.sort((a, b) => b.s - a.s);
      for (let i = 0; i < this.pl.length; i++) { const l = this.pl[i], src = i < this.nLights ? L[i] : null; l.visible = true; if (!src) { l.intensity = 0; continue; } l.position.set(src.x, src.y, src.z); l.color.set(src.color); l.intensity = src.i; l.distance = src.d; }
      // Flammen flackern; Fackeln erst, wenn der Raum betreten wurde
      for (const f of this.flames) { const grow = f.userData.room != null ? (this.litAt[f.userData.room] == null ? 0 : clamp((t - this.litAt[f.userData.room]) / 0.6, 0, 1)) : 1; f.visible = grow > 0; const s = f.userData.s0 * grow * (0.9 + Math.sin(t * 12 + f.userData.ph) * 0.1 + Math.sin(t * 31 + f.userData.ph) * 0.05); f.scale.set(s, s * 1.35, 1); if (f.userData.room != null && grow > 0 && Math.random() < 0.05 && A.FX) A.FX.part({ kind: 'px', add: true, x: f.position.x * TS + (Math.random() - 0.5) * 6, y: f.position.z * TS, z: f.position.y * TS, vx: (Math.random() - 0.5) * 12, vy: 0, vz: 30 + Math.random() * 30, life: 0.7, color: '#feae34', drag: 0.4 }); }
      // Gitter
      if (W.active && (W.active.lockT == null || W.active.lockT > t)) W.active.lockT = t;
      const gp = W.active ? clamp((t - W.active.lockT) / 0.18, 0, 1) : 1;
      for (const g of this.gates) { const locked = W.tiles[g.y][g.x] === 2; g.g.visible = locked; if (locked) g.g.position.y = (1 - gp) * 1.4; }
      // Gegenstände im Raum
      this.flat.signAt = null;
      for (const [p, g] of this.propG) {
        g.visible = !p.hidden; if (p.hidden) continue; const near = W.near === p, P = g.userData.parts;
        if (p.kind === 'chest') { P.lid.rotation.x = p.used ? -1.7 : 0; P.glow.visible = !p.used; }
        else if (p.kind === 'fire') { const s = p.used ? 0.5 : 1; P.flame.scale.set(s * (0.95 + Math.sin(t * 13) * 0.08), s * 1.35 * (0.95 + Math.sin(t * 9) * 0.1), 1); P.flame2.scale.set(s * 0.5, s * 0.7, 1); if (Math.random() < 0.25 && A.FX) A.FX.part({ kind: 'px', add: true, x: p.x + (Math.random() - 0.5) * 16, y: p.y, z: 12, vx: (Math.random() - 0.5) * 20, vy: 0, vz: 40 + Math.random() * 40, life: 0.8, color: Math.random() < 0.5 ? '#feae34' : '#f77622', drag: 0.5 }); }
        else if (p.kind === 'stairs') { if (Math.random() < 0.2 && A.FX) A.FX.part({ kind: 'px', add: true, x: p.x + (Math.random() - 0.5) * 40, y: p.y + (Math.random() - 0.5) * 30, z: 0, vz: 25 + Math.random() * 25, life: 1, color: '#b55088', drag: 0.3 }); }
        else if (p.kind === 'merchant') { P.lamp.scale.set(0.45 * (0.95 + Math.sin(t * 11) * 0.07), 0.6, 1); }
        else if (p.kind === 'shrine') { P.orb.position.y = 1.25 + Math.sin(t * 2) * 0.06; P.orb.visible = !p.used; }
        else if (p.kind === 'forge') {
          const cyc = (t * 0.85 + p.x * 0.001) % 1, down = cyc > 0.72 && cyc < 0.9; P.arm.rotation.x = down ? 0.5 : -2.4 + cyc * 0.4;
          P.fl.scale.set(0.55 * (0.95 + Math.sin(t * 13) * 0.08), 0.75 * (0.95 + Math.sin(t * 9) * 0.1), 1);
          const beat = Math.floor(t * 0.85 + p.x * 0.001 + 0.28); if (P.beat !== beat) { P.beat = beat; if (A.FX) A.FX.burst(p.x + 26, p.y + 4, 6, { color: ['#fee761', '#feae34', '#ffffff'], smin: 40, smax: 120, life: 0.35, add: true, kind: 'spark', drag: 3, z: 14, vz: 90, g: 300 }); }
        }
        else if (p.kind === 'sign' && W.room && W.room.type === 'start') { const s = this.project(p.x * U, 1.05, p.y * U); this.flat.signAt = { sx: s[0], sy: s[1], text: p.text }; }
        const hl = near && (!p.used || p.kind === 'merchant' || p.kind === 'forge' || p.kind === 'stairs');
        P.arrow.visible = hl; if (hl) P.arrow.position.y = g.userData.h + 0.4 + Math.sin(t * 6) * 0.08;
        if (p.kind !== 'stairs' && p.kind !== 'fire' && p.kind !== 'forge') setTint(g, '#fee761', hl ? 0.3 + Math.sin(t * 6) * 0.1 : 0);
      }
      // Held
      const key = run ? run.race + run.cls : '';
      let hg = this.figs.get(h);
      if (!hg || hg.userData.key !== key) { if (hg) this.dyn.remove(hg); hg = buildHero(run ? run.race : 'mensch', run ? run.cls : 'klinge'); hg.userData.key = key; this.dyn.add(hg); this.figs.set(h, hg); }
      hg.position.set(hx, 0, hz); animHero(hg, h, t, run);
      const blink = h.inv > 0 && Math.floor(t * 20) % 2; setOpacity(hg, blink ? 0.45 : (h.alive ? 1 : 0.5)); setFlash(hg, h.flash > 0);
      // Gegner
      const seen = new Set([h]);
      for (const m of W.mons) {
        seen.add(m); let g = this.figs.get(m); if (!g) { g = buildMon(m); this.dyn.add(g); this.figs.set(m, g); }
        g.position.set(m.x * U, 0, m.y * U);
        if (!m.alive) { g.visible = m.alpha > 0.82; if (g.visible) setFlash(g, true); continue; }
        g.visible = true; animMon(g, m, t);
        setOpacity(g, m.spawn > 0 ? clamp(1 - m.spawn / 0.5, 0, 1) : 1);
        if (m.flash > 0) setFlash(g, true);
        else if (m.state === 'windup' && Math.floor(t * 16) % 2 === 0) setFlash(g, true, '#ff9090');
        else if (m.frozenUntil > W.t) setTint(g, '#9be8ff', 0.65);
        else if (m.boss) setTint(g, Math.sin(t * 4) > 0 ? '#e43b44' : '#a22633', 0.35);
        else if (m.elite && !(m.spawn > 0)) setTint(g, ELITE_COL[m.eliteKind] || '#fee761', 0.3);
        else setFlash(g, false);
      }
      for (const a of W.allies || []) {
        seen.add(a); let g = this.figs.get(a); if (!g) { g = buildAlly(a); this.dyn.add(g); this.figs.set(a, g); }
        g.position.set(a.x * U, 0, a.y * U); animAlly(g, a, t, W);
      }
      for (const k of W.marks || []) {
        if (k.kind !== 'barrel') continue;
        seen.add(k); let g = this.figs.get(k); if (!g) { g = buildKeg(); this.dyn.add(g); this.figs.set(k, g); }
        const fly = clamp((W.t - k.t0) / 0.3, 0, 1), p = clamp((W.t - k.t0) / (k.at - k.t0), 0, 1);
        g.position.set((k.sx + (k.x - k.sx) * fly) * U, Math.sin(fly * Math.PI) * 0.5, (k.sy + (k.y - k.sy) * fly) * U);
        g.rotation.z = fly < 1 ? fly * 6 : Math.sin(t * (20 + p * 40)) * p * 0.12;
        g.userData.parts.spark.scale.setScalar(0.06 + Math.random() * 0.05);
        setFlash(g, p > 0.85 && Math.floor(t * 20) % 2 === 0);
      }
      for (const [kk, g] of this.figs) if (!seen.has(kk)) { this.dyn.remove(g); this.figs.delete(kk); }
      // Beute
      const seenP = new Set();
      for (const p of W.picks) {
        seenP.add(p); let g = this.pickPool.get(p); if (!g) { g = this.buildPick(p); this.dyn.add(g); this.pickPool.set(p, g); }
        const z = (p.z || 0) * U; g.position.set(p.x * U, z, p.y * U);
        if (p.kind === 'gold') g.rotation.y = t * 4 + p.x; else if (p.kind === 'potion') g.position.y += 0.08 + Math.sin(t * 4 + p.x) * 0.05; else { g.position.y += 0.08 + Math.sin(t * 3 + p.x) * 0.06; if (g.userData.parts.beam) g.userData.parts.beam.material.opacity = 0.12 + Math.sin(t * 5) * 0.05; }
      }
      for (const [kk, g] of this.pickPool) if (!seenP.has(kk)) { this.dyn.remove(g); this.pickPool.delete(kk); }
      // Geschosse
      const seenS = new Set();
      for (const s of W.shots) {
        seenS.add(s); let g = this.shotPool.get(s); if (!g) { g = this.buildShot(s); this.dyn.add(g); this.shotPool.set(s, g); }
        if (s.opts.lob) { const q = clamp(1 - s.life / s.life0, 0, 1); g.position.set(s.x * U, 0.3 + 4 * s.peak * q * (1 - q) * U, s.y * U); g.rotation.x = s.spin * (s.life0 - s.life); }
        else { g.position.set(s.x * U, 0.45, s.y * U); g.rotation.y = Math.atan2(s.vx, s.vy); }
        if (!(s.side === 'hero' && s.opts.kind !== 'magic') && A.FX && Math.random() < 0.5) A.FX.part({ kind: 'px', add: true, x: s.x, y: s.y, z: 12, vx: -s.vx * 0.1, vy: -s.vy * 0.1, life: 0.25, color: s.side === 'hero' ? s.color : (s.opts.kind === 'magic' ? '#b55088' : '#e43b44') });
      }
      for (const [kk, g] of this.shotPool) if (!seenS.has(kk)) { this.dyn.remove(g); this.shotPool.delete(kk); }
      // Teilchen, Ringe, Hiebe, Flecken
      this.particles(W); this.decals();
      // Zeichnen
      this.r.render(this.scene, this.camera);
      // Oberfläche (Zahlen, Balken, Einblendungen, Minikarte) über die 2D-Ebene
      const fl2 = this.flat; fl2.t = this.t; fl2.levelAge = this.levelAge;
      const c = fl2.ctx; c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1; c.clearRect(0, 0, fl2.dw, fl2.dh);
      const toS = (wx, wy, up) => this.project(wx * U, (up || 0) * U, wy * U);
      this.overlay3(W, toS);
      fl2.overlayCore(W, toS);
    }
    particles(W) {
      const t = this.t;
      if (A.FX) {
        let n = 0, na = 0; const PN = this.ptsN.geometry, PA = this.ptsA.geometry;
        const fill = (G, i, p, size, a) => { const pos = G.attributes.position.array, cl = G.attributes.aColor.array; pos[i * 3] = p.x * U; pos[i * 3 + 1] = (p.z || 0) * U + 0.06; pos[i * 3 + 2] = p.y * U; const c = col(p.color); cl[i * 3] = c.r; cl[i * 3 + 1] = c.g; cl[i * 3 + 2] = c.b; G.attributes.aSize.array[i] = size; G.attributes.aAlpha.array[i] = a; };
        for (const p of A.FX.P) {
          if (p.kind === 'ring' || p.kind === 'rune') continue; const lf = clamp(p.life / p.max, 0, 1);
          if (p.kind === 'smoke') { if (n < PMAX) fill(PN, n++, p, p.size * 0.1, lf * 0.4); }
          else if (p.kind === 'px' && !p.add) { if (n < PMAX) fill(PN, n++, p, p.size * 0.11, clamp(lf * 1.5, 0, 1)); }
          else if (na < PMAX) fill(PA, na++, p, p.kind === 'spark' ? 0.1 : p.kind === 'plus' ? 0.13 : p.size * 0.11, clamp(lf * 1.4, 0, 1));
        }
        PN.setDrawRange(0, n); PA.setDrawRange(0, na);
        for (const G of [PN, PA]) for (const kk of ['position', 'aColor', 'aSize', 'aAlpha']) G.attributes[kk].needsUpdate = true;
      }
      let ri = 0;
      const ring = (x, z, R, color, a, y) => { if (ri >= this.rings.length || R <= 0) return; const m = this.rings[ri++]; m.visible = true; m.position.set(x, y || 0.05, z); m.scale.set(R, R, 1); m.material.color.set(color); m.material.opacity = clamp(a, 0, 1); };
      if (A.FX) for (const p of A.FX.P) { const q = 1 - p.life / p.max; if (p.kind === 'ring') ring(p.x * U, p.y * U, p.size * U * (0.2 + q), p.color, p.life / p.max); else if (p.kind === 'rune') ring(p.x * U, p.y * U, p.size * U * (0.6 + q * 0.4) * 0.6, p.color, p.life / p.max); }
      for (const f of W.fx) if (f.kind === 'ring') ring(f.x * U, f.y * U, f.r * (1.2 - f.life) * U, f.color, clamp(f.life / 0.4, 0, 1));
      for (const z of W.zones || []) if (!z.trail) ring(z.x * U, z.y * U, z.r * U, z.col, 0.55 * clamp((z.until - W.t) / 0.5, 0, 1) * clamp((W.t - z.t0) / 0.25, 0, 1));   // Wolken, Lachen, Grabeshände
      for (const k of W.marks || []) if (k.kind === 'meteor' || k.kind === 'barrel') { const p = clamp((W.t - k.t0) / (k.at - k.t0), 0, 1), c = k.kind === 'barrel' ? '#feae34' : '#ff0044'; ring(k.x * U, k.y * U, k.r * U, c, 0.7); ring(k.x * U, k.y * U, k.r * U * p, c, 0.35); }
      for (let i = ri; i < this.rings.length; i++) this.rings[i].visible = false;
      let ai = 0;
      for (const f of W.fx) {
        if (f.kind !== 'slash' || ai >= this.arcs.length) continue; const m = this.arcs[ai++];
        const a = Math.atan2(f.fy, f.fx), p = 1 - f.life / 0.18, R = (f.r - 6) * U * (0.7 + 0.3 * Math.min(1, p * 2.2));
        m.visible = true; m.position.set(f.x * U, 0.45, f.y * U); m.scale.set(R, R, 1); m.rotation.z = -a - 1.3; m.material.color.set(f.color === '#fff' ? '#ffffff' : f.color); m.material.opacity = 0.7 - p * 0.6;
      }
      for (let i = ai; i < this.arcs.length; i++) this.arcs[i].visible = false;
    }
    decals() {
      if (!A.FX) return; const list = A.FX.takeDecals(); if (!list.length) return;
      for (const d of list) {
        const i = this.decN++ % this.decMax; let sx, sz, c = d.color;
        if (d.kind === 'drop') { sx = sz = 0.08 * (d.r > 1 ? 1.6 : 1); } else if (d.kind === 'splat') { sx = d.r * 0.14; sz = d.r * 0.08; } else { sx = 0.5; sz = 0.3; c = '#ead4aa'; }
        _o.position.set(d.x * U, 0.004 + (i % 40) * 0.0004, d.y * U); _o.rotation.set(-Math.PI / 2, 0, hash(i, 1, 2) * TAU); _o.scale.set(sx, sz, 1); _o.updateMatrix();
        this.dec.setMatrixAt(i, _o.matrix); this.dec.setColorAt(i, shade(c, 0.75));
      }
      this.dec.instanceMatrix.needsUpdate = true; this.dec.instanceColor.needsUpdate = true;
    }
    // Balken, Warnzeichen und Sterne über den Gegnern (auf der 2D-Ebene, damit sie scharf bleiben)
    overlay3(W, toS) {
      const fl = this.flat, c = fl.ctx, d = fl.dpr, t = this.t;
      for (const m of W.mons) {
        if (!m.alive || m.spawn > 0) continue; const g = this.figs.get(m); const hh = g ? g.userData.h * g.userData.sc : 1;
        const [x, y] = toS(m.x, m.y, hh * TS + 6);
        if (m.state === 'windup') { const al = A.Art.sprite('u_alert'); const s = 2.2 * d; c.imageSmoothingEnabled = false; c.drawImage(al.img, Math.round(x - al.w * s / 2), Math.round(y - al.h * s - 10 * d + Math.sin(t * 20) * 2 * d), al.w * s, al.h * s); }
        if (m.stun > 0) { c.fillStyle = '#fee761'; for (let i = 0; i < 3; i++) { const a = t * 6 + i * 2.1; c.fillRect(Math.round(x + Math.cos(a) * 12 * d), Math.round(y - 6 * d + Math.sin(a) * 4 * d), 3 * d, 3 * d); } }
        if (!m.boss && (m.hp < m.maxHp || m.elite)) {
          const w = (m.elite ? 40 : 32) * d, bx = Math.round(x - w / 2), by = Math.round(y - 2 * d), hg = 5 * d;
          c.fillStyle = '#181425'; c.fillRect(bx - 2 * d, by - 2 * d, w + 4 * d, hg + 4 * d); c.fillStyle = '#3e2731'; c.fillRect(bx, by, w, hg);
          c.fillStyle = m.elite ? '#feae34' : '#e43b44'; c.fillRect(bx, by, Math.max(1, Math.round(w * m.hp / m.maxHp)), hg);
          if (m.shield > 0) { c.fillStyle = '#2ce8f5'; c.fillRect(bx, by + hg, Math.round(w * Math.min(1, m.shield / m.maxHp)), 2 * d); }
        }
        if (m.effects && m.effects.length && Math.floor(t * 4) % 2) { c.fillStyle = m.effects[0].kind === 'poison' ? '#63c74d' : '#f77622'; c.fillRect(Math.round(x - 2 * d), Math.round(y - 12 * d), 4 * d, 4 * d); }
      }
      const h = W.hero;
      if (h.stun > 0) { const [x, y] = toS(h.x, h.y, 1.35 * TS); c.fillStyle = '#fee761'; for (let i = 0; i < 3; i++) { const a = t * 6 + i * 2.1; c.fillRect(Math.round(x + Math.cos(a) * 12 * d), Math.round(y + Math.sin(a) * 4 * d), 3 * d, 3 * d); } }
    }
  };
  const ELITE_COL = { giftig: '#63c74d', gepanzert: '#8b9bb4', schnell: '#fee761' };
})();
