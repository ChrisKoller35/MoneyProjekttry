// Der Abstieg – Eingabe: Tasten am PC, Joystick und Knöpfe am Handy
'use strict';
window.A = window.A || {};

A.Input = (function () {
  const keys = {};
  const state = { mx: 0, my: 0, attack: false };
  const joy = { on: false, id: null, x0: 0, y0: 0, x: 0, y: 0 };
  let atkHeld = false, atkTouch = false, handlers = {};

  window.addEventListener('keydown', (e) => {
    if (e.repeat) return; keys[e.code] = true;
    if (handlers.key) handlers.key(e.code, e);
  });
  window.addEventListener('keyup', (e) => { keys[e.code] = false; });
  window.addEventListener('blur', () => { for (const k of Object.keys(keys)) keys[k] = false; atkHeld = false; });

  function bindCanvas(el) {
    el.style.touchAction = 'none';
    el.addEventListener('pointerdown', (e) => {
      const r = el.getBoundingClientRect(); const x = e.clientX - r.left, y = e.clientY - r.top;
      if (e.pointerType === 'mouse' || x > r.width / 2) { atkTouch = true; return; }
      if (joy.on) return;
      joy.on = true; joy.id = e.pointerId; joy.x0 = x; joy.y0 = y; joy.x = x; joy.y = y;
      el.setPointerCapture(e.pointerId);
    });
    el.addEventListener('pointermove', (e) => { if (!joy.on || e.pointerId !== joy.id) return; const r = el.getBoundingClientRect(); joy.x = e.clientX - r.left; joy.y = e.clientY - r.top; });
    const end = (e) => { if (joy.on && e.pointerId === joy.id) { joy.on = false; } else atkTouch = false; };
    el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end);
  }
  function bindHold(btn, on, off) { const d = (e) => { e.preventDefault(); on(); }; const u = (e) => { e.preventDefault(); off(); }; btn.addEventListener('pointerdown', d); btn.addEventListener('pointerup', u); btn.addEventListener('pointercancel', u); btn.addEventListener('pointerleave', u); }
  function bindAttack(btn) { bindHold(btn, () => { atkHeld = true; }, () => { atkHeld = false; }); }

  function read() {
    let mx = 0, my = 0;
    if (keys.KeyA || keys.ArrowLeft) mx -= 1; if (keys.KeyD || keys.ArrowRight) mx += 1;
    if (keys.KeyW || keys.ArrowUp) my -= 1; if (keys.KeyS || keys.ArrowDown) my += 1;
    if (joy.on) { const dx = joy.x - joy.x0, dy = joy.y - joy.y0; const d = Math.hypot(dx, dy); const R = 48; if (d > 6) { const k = Math.min(1, d / R); mx = dx / d * k; my = dy / d * k; } }
    state.mx = mx; state.my = my;
    state.attack = atkHeld || atkTouch || !!(keys.Space || keys.KeyJ || keys.KeyK);
    return state;
  }
  return { read, bindCanvas, bindAttack, bindHold, joy, set onKey(f) { handlers.key = f; }, keys };
})();
