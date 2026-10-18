// Der Abstieg – Oberfläche: Bildschirme, Knöpfe, Ebene in Echtzeit
'use strict';
window.A = window.A || {};

(function () {
  const G = A.Game, t = A.t, U = A.UI;
  const $ = (s) => document.querySelector(s);
  const screen = $('#screen'), hud = $('#hud'), overlay = $('#overlay'), dungeonEl = $('#dungeon');
  const draw = new A.Draw($('#arena'));
  const Wd = A.World;
  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // Portal-Anbindung (Platzhalter; wird beim Einreichen ersetzt)
  const Portal = window.AbstiegPortal || { gameplayStart() {}, gameplayStop() {}, happytime() {}, showAd(cb) { cb(); }, showRewardedAd(cb) { cb(); } };

  // ---------- Ton ----------
  let actx = null;
  function beep(f, d, type, v) {
    if (!G.meta.sound) return;
    try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); if (actx.state === 'suspended') actx.resume();
      const o = actx.createOscillator(), g = actx.createGain(); o.type = type || 'square'; o.frequency.value = f;
      g.gain.setValueAtTime(v || 0.04, actx.currentTime); g.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + d);
      o.connect(g); g.connect(actx.destination); o.start(); o.stop(actx.currentTime + d); } catch (e) {}
  }
  const sfx = { click: () => beep(520, 0.05, 'triangle', 0.04), buy: () => { beep(660, 0.06, 'triangle', 0.05); setTimeout(() => beep(990, 0.08, 'triangle', 0.05), 50); }, win: () => [440, 550, 660, 880].forEach((f, i) => setTimeout(() => beep(f, 0.12, 'triangle', 0.05), i * 80)), lose: () => beep(110, 0.5, 'sawtooth', 0.06), hit: () => beep(150 + Math.random() * 60, 0.05, 'square', 0.03) };

  // ---------- HUD ----------
  function hudUpdate() {
    const r = G.run;
    if (!r || r.over) { hud.classList.remove('on'); return; }
    hud.classList.add('on');
    const d = G.derived();
    $('#hudFloor').textContent = '⬇ ' + r.floor;
    $('#hpbar i').style.width = Math.max(0, Math.min(100, r.hp / d.maxHp * 100)) + '%';
    $('#hptext').textContent = r.hp + ' / ' + d.maxHp;
    $('#hudGold').textContent = '🪙 ' + r.gold;
    $('#hudPot').textContent = '🧪 ' + r.potions;
    const hb = $('#heroBtn'); hb.textContent = 'Lv ' + r.level + (r.points > 0 ? ' +' + r.points : ''); hb.classList.toggle('pts', r.points > 0 || r.pendingSkillPick > 0);
  }
  $('#heroBtn').addEventListener('click', () => { sfx.click(); showSheet(); });

  // ---------- Hilfen ----------
  function itemHtml(it, actions, cmpWith) {
    const lines = G.itemLines(it);
    const base = A.BASES.find(b => b.id === it.base);
    let cmp = '';
    if (cmpWith) {
      const diff = scoreItem(it) - scoreItem(cmpWith);
      cmp = `<span class="mini" style="color:${diff >= 0 ? 'var(--hp)' : 'var(--bad)'}">${diff >= 0 ? '▲' : '▼'} ${Math.abs(Math.round(diff))}</span>`;
    } else if (cmpWith === null) cmp = `<span class="mini" style="color:var(--hp)">▲ neu</span>`;
    return `<div class="item rar-${it.rarity}">
      <div style="flex:1;min-width:0">
        <div class="slotlbl">${t(U.slot[it.slot === 'trinket2' ? 'trinket' : it.slot])} · <span class="rc-${it.rarity}">${t(U.rarity[it.rarity])}</span> ${cmp}</div>
        <div class="nm">${esc(G.itemName(it))}</div>
        <div class="ln">${lines.map(esc).join(' · ')}</div>
        ${it.flavor ? `<div class="fl">${esc(t(it.flavor))}</div>` : ''}
      </div>
      ${actions ? `<div class="act">${actions}</div>` : ''}
    </div>`;
  }
  function scoreItem(it) { const s = it.stats; return (s.atk || 0) * 2 + (s.mag || 0) * 2 + (s.def || 0) * 2 + (s.hp || 0) * 0.3 + (s.spd || 0) * 3 + (s.crit || 0) * 0.8 + (s.dodge || 0) * 0.8 + (s.atkPct || 0) * 0.6 + (s.magPct || 0) * 0.6 + (s.lifesteal || 0) + (s.thorns || 0) * 0.3 + (s.regen || 0) * 3 + (s.startShield || 0) * 0.5 + (s.poisonOnHit || 0) * 2 + (s.goldPct || 0) * 0.1 + (s.xpPct || 0) * 0.2 + (s.revive || 0) * 30; }
  function slotCurrent(it) { const r = G.run; if (it.slot === 'trinket') { if (!r.gear.trinket) return null; if (!r.gear.trinket2) return null; return scoreItem(r.gear.trinket) < scoreItem(r.gear.trinket2) ? r.gear.trinket : r.gear.trinket2; } return r.gear[it.slot] || null; }
  function show(html) { dungeonEl.classList.remove('on'); document.body.classList.remove('play'); screen.style.display = ''; screen.innerHTML = html; screen.scrollTop = 0; hudUpdate(); }
  function ov(html) { overlay.innerHTML = `<div class="ovbox">${html}</div>`; overlay.classList.add('on'); Wd.pause(true); }
  function ovClose() { overlay.classList.remove('on'); overlay.innerHTML = ''; if (dungeonEl.classList.contains('on')) { Wd.pause(false); Wd.refreshHero(); } hudUpdate(); }
  const ICONS = { fight: '⚔️', elite: '💀', treasure: '💰', shop: '🛒', event: '❓', rest: '🔥', boss: '👑' };
  const DESC = { fight: { de: 'Gegner, Beute, Erfahrung', en: 'Enemies, loot, experience' }, elite: { de: 'Schwer, aber besseres Item', en: 'Hard, but better item' }, treasure: { de: 'Items und Gold', en: 'Items and gold' }, shop: { de: 'Kaufen und verkaufen', en: 'Buy and sell' }, event: { de: 'Eine Entscheidung', en: 'A decision' }, rest: { de: 'Heilen oder trainieren', en: 'Heal or train' }, boss: { de: 'Der Wächter der Ebene', en: 'The floor\'s guardian' } };

  // ---------- Titel ----------
  function title() {
    const m = G.meta, r = G.load();
    show(`<div style="padding-top:12vh" class="center">
      <div style="font-size:64px">🕳️</div>
      <h1>${t(U.title)}</h1>
      <div class="sub">${t(U.tagline)}</div>
      ${r ? `<button class="btn primary" id="bCont">${t(U.continueRun)} (${t(U.floor)} ${r.floor})</button>` : ''}
      <button class="btn ${r ? '' : 'primary'}" id="bNew">${t(U.play)}</button>
      <button class="btn" id="bCamp">🏕️ ${t(U.camp)} · <span class="spark">✦ ${m.sparks}</span></button>
      <div style="margin-top:14px" class="mini">${t(U.howto)}</div>
      <div style="margin-top:10px" class="mini">${A.LANG === 'de' ? 'Durchläufe' : 'Runs'}: ${m.runs} · ${A.LANG === 'de' ? 'Tiefste Ebene' : 'Deepest floor'}: ${m.best}</div>
      <div style="margin-top:12px"><button class="btn small" id="bSound">${m.sound ? '🔊' : '🔇'} ${t(U.sound)}</button><button class="btn small" id="bReset">${t(U.reset)}</button></div>
    </div>`);
    if (r) $('#bCont').onclick = () => { sfx.click(); resume(); };
    $('#bNew').onclick = () => { sfx.click(); if (r) { if (!confirm(A.LANG === 'de' ? 'Laufenden Durchlauf aufgeben?' : 'Abandon the current run?')) return; G.clearRun(); } heroSelect(); };
    $('#bCamp').onclick = () => { sfx.click(); camp(); };
    $('#bSound').onclick = () => { G.meta.sound = !G.meta.sound; G.saveMeta(); title(); };
    $('#bReset').onclick = () => { if (confirm(A.LANG === 'de' ? 'Wirklich alles löschen? Auch die Seelenfunken.' : 'Really delete everything? Including soul sparks.')) { G.resetAll(); title(); } };
  }

  // ---------- Held wählen ----------
  let selRace = 'mensch', selCls = 'klinge';
  function heroSelect() {
    const races = A.RACES.map(r => { const ok = G.raceUnlocked(r); return `<div class="card click ${selRace === r.id ? 'sel' : ''} ${ok ? '' : 'locked'}" data-race="${r.id}"><div class="ttl"><span><span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:${r.color};margin-right:6px"></span>${t(r.name)}</span>${ok ? '' : `<span class="spark">✦ ${r.unlock}</span>`}</div><div class="txt">${t(r.perk)}</div></div>`; }).join('');
    const classes = A.CLASSES.map(c => { const ok = G.classUnlocked(c); return `<div class="card click ${selCls === c.id ? 'sel' : ''} ${ok ? '' : 'locked'}" data-cls="${c.id}"><div class="ttl"><span><span style="display:inline-block;width:12px;height:12px;border-radius:3px;background:${c.color};margin-right:6px"></span>${t(c.name)}</span>${ok ? `<span class="mini">${t(c.row === 'front' ? U.front : U.backRow)}</span>` : `<span class="mini">${t(U.locked)}</span>`}</div><div class="txt">${t(c.perk)}</div></div>`; }).join('');
    show(`<h2>${t(U.race)}</h2>${races}<h2 style="margin-top:14px">${t(U.cls)}</h2>${classes}
      <button class="btn primary" id="bStart">${t(U.start)}</button><button class="btn" id="bBack">${t(U.back)}</button>`);
    screen.querySelectorAll('[data-race]').forEach(el => el.onclick = () => { const r = A.RACES.find(x => x.id === el.dataset.race); if (!G.raceUnlocked(r)) { camp(); return; } selRace = r.id; sfx.click(); heroSelect(); });
    screen.querySelectorAll('[data-cls]').forEach(el => el.onclick = () => { const c = A.CLASSES.find(x => x.id === el.dataset.cls); if (!G.classUnlocked(c)) return; selCls = c.id; sfx.click(); heroSelect(); });
    $('#bStart').onclick = () => { sfx.buy(); G.newRun(selRace, selCls); Portal.gameplayStart(); dungeon(true); };
    $('#bBack').onclick = () => { sfx.click(); title(); };
  }

  // ---------- Lager ----------
  function camp() {
    const m = G.meta, me = G.metaEffects();
    const list = A.META_SHOP.map(u => { const have = m.unlocked.includes(u.id); const can = !have && m.sparks >= u.cost && (!u.needs || m.unlocked.includes(u.needs)); return `<div class="card ${have ? '' : (can ? '' : 'locked')}"><div class="ttl"><span>${t(u.name)}</span>${have ? `<span class="mini" style="color:var(--hp)">✓ ${t(U.bought)}</span>` : `<button class="btn small ${can ? 'primary' : ''}" data-buy="${u.id}" ${can ? '' : 'disabled'}>✦ ${u.cost}</button>`}</div><div class="txt">${t(u.desc)}</div></div>`; }).join('');
    show(`<h2>🏕️ ${t(U.camp)}</h2><div class="sub">${t(U.campInfo)}</div><div class="card"><div class="ttl"><span>${t(U.meta)}</span><span class="spark">✦ ${m.sparks}</span></div></div>${list}<button class="btn" id="bBack">${t(U.back)}</button>`);
    screen.querySelectorAll('[data-buy]').forEach(b => b.onclick = () => { if (G.metaBuy(b.dataset.buy)) { sfx.buy(); camp(); } });
    $('#bBack').onclick = () => { sfx.click(); title(); };
  }

  // ---------- Fortsetzen ----------
  function resume() {
    const r = G.run;
    Portal.gameplayStart();
    dungeon(false);
  }

  // ---------- Die Ebene (Echtzeit) ----------
  const input = A.Input;
  input.bindCanvas($('#arena'));
  let last = 0, hudT = 0;
  function dungeon(fresh) {
    const r = G.run;
    if (r.over) { runOver(); return; }
    screen.style.display = 'none'; dungeonEl.classList.add('on'); document.body.classList.add('play'); hudUpdate();
    const hooks = {
      onItem: (it) => foundItem(it),
      onProp: (p) => useProp(p),
      onCleared: (room) => { sfx.win(); if (room.type === 'boss') Portal.happytime(); if (r.questJustDone) { r.questJustDone = false; Wd.float(Wd.W.hero.x, Wd.W.hero.y - 60, '📜 ' + t(U.questDone), '#6fdc7a', 15); } G.save(); setTimeout(() => { if (r.pendingSkillPick > 0) skillPick(); }, 400); },
      onDeath: () => { sfx.lose(); setTimeout(() => runOver(), 600); },
      onLevel: () => { sfx.buy(); Wd.float(Wd.W.hero.x, Wd.W.hero.y - 56, '⬆ ' + t(U.levelUp), '#f5c542', 18); hudUpdate(); },
    };
    Wd.enter(r.floor, r.floorSeed, fresh ? null : r.rooms, hooks);
    r.rooms = Wd.saveRooms();
    buildControls();
    if (fresh && r.floor === 1) { const coarse = matchMedia('(pointer: coarse)').matches; Wd.W.hint = A.LANG === 'de' ? (coarse ? 'Links laufen, rechts schlagen' : 'WASD laufen · Leertaste schlagen · 1-3 Fähigkeiten') : (coarse ? 'Left: move, right: attack' : 'WASD move · Space attack · 1-3 skills'); setTimeout(() => { if (Wd.W && !Wd.W.active) Wd.W.hint = ''; }, 7000); }
    if (!last) { last = performance.now(); requestAnimationFrame(loop); }
  }
  function loop(now) {
    requestAnimationFrame(loop);
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (!dungeonEl.classList.contains('on') || !Wd.W) return;
    const inp = input.read();
    Wd.step(dt, inp);
    if (G.run) G.run.rooms = Wd.saveRooms();
    draw.draw(Wd.W, dt);
    hudT += dt; if (hudT > 0.15) { hudT = 0; hudUpdate(); controlsTick(); }
  }
  // Knöpfe am Rand
  let ctl = null;
  function buildControls() {
    const r = G.run;
    const sk = r.active.filter(Boolean);
    $('#controls').innerHTML = `<div id="btnGrid">
      ${sk.map((id, i) => `<button class="cbtn sk" data-sk="${i}"><span class="ring"></span><span class="lbl">${esc(t(A.SKILLS[id].name))}</span><span class="key">${i + 1}</span></button>`).join('')}
      <button class="cbtn pot" id="bPotion">🧪<span class="n"></span><span class="key">Q</span></button>
      <button class="cbtn atk" id="bAtk">⚔️<span class="key">␣</span></button>
      <button class="cbtn use" id="bUse" style="display:none">✋<span class="key">E</span></button>
    </div>`;
    ctl = { atk: $('#bAtk'), use: $('#bUse'), pot: $('#bPotion'), sk: Array.from(document.querySelectorAll('#controls .sk')) };
    input.bindAttack(ctl.atk);
    ctl.sk.forEach(b => b.addEventListener('pointerdown', (e) => { e.preventDefault(); if (Wd.useSkill(+b.dataset.sk)) sfx.click(); }));
    ctl.pot.addEventListener('pointerdown', (e) => { e.preventDefault(); if (Wd.usePotion()) { sfx.buy(); hudUpdate(); } });
    ctl.use.addEventListener('pointerdown', (e) => { e.preventDefault(); Wd.interact(); });
  }
  function controlsTick() {
    if (!ctl || !Wd.W) return;
    const h = Wd.W.hero, r = G.run;
    ctl.sk.forEach((b, i) => { const id = h.skills[i]; if (!id) return; const cd = Math.max(0, (h.cds[id] || 0) - Wd.W.t); const tot = A.SKILLS[id].cd * 2; b.classList.toggle('cold', cd > 0); b.querySelector('.ring').style.setProperty('--p', (cd / tot * 100) + '%'); });
    ctl.pot.querySelector('.n').textContent = r.potions; ctl.pot.classList.toggle('cold', r.potions <= 0);
    ctl.use.style.display = Wd.W.near ? '' : 'none';
    if (Wd.W.near) ctl.use.innerHTML = ({ chest: '💰', fire: '🔥', merchant: '🛒', statue: '❓', stairs: '⬇️' })[Wd.W.near.kind] + '<span class="key">E</span>';
  }
  input.onKey = (code, e) => {
    if (!dungeonEl.classList.contains('on')) return;
    if (overlay.classList.contains('on')) { if (code === 'Escape' || code === 'KeyI' || code === 'Tab') { const b = $('#bClose'); if (b) b.click(); e.preventDefault(); } return; }
    if (code === 'Digit1' || code === 'Digit2' || code === 'Digit3') { if (Wd.useSkill(+code.slice(-1) - 1)) sfx.click(); }
    if (code === 'KeyQ') { if (Wd.usePotion()) { sfx.buy(); hudUpdate(); } }
    if (code === 'KeyE' || code === 'Enter') Wd.interact();
    if (code === 'KeyI' || code === 'Tab' || code === 'Escape') { e.preventDefault(); showSheet(); }
    if (code === 'Space') e.preventDefault();
  };
  // Gefundenes Item
  function foundItem(it) {
    const cur = slotCurrent(it);
    ov(`<h2>${A.LANG === 'de' ? 'Gefunden' : 'Found'}</h2>${itemHtml(it, null, cur)}<button class="btn primary" id="bEq">${t(U.equip)}${cur ? ` (${A.LANG === 'de' ? 'ersetzt' : 'replaces'} ${esc(G.itemName(cur))})` : ''}</button><button class="btn" id="bBag">${t(U.bag)}</button><button class="btn" id="bClose">${t(U.sell)} ${G.sellValue(it)}🪙</button>`);
    $('#bEq').onclick = () => { G.addToBag(it); G.equip(it); sfx.buy(); ovClose(); };
    $('#bBag').onclick = () => { G.addToBag(it); sfx.click(); ovClose(); };
    $('#bClose').onclick = () => { G.run.gold += G.sellValue(it); G.save(); sfx.buy(); ovClose(); };
  }
  // Dinge im Raum
  function useProp(p) {
    const r = G.run;
    if (p.kind === 'stairs') {
      ov(`<div class="center"><div style="font-size:50px">⬇️</div><h2>${t(U.floor)} ${r.floor + 1}</h2><div class="sub">${A.LANG === 'de' ? 'Neue Schicht, neue Gegner, neue Aufgabe.' : 'New layer, new enemies, new quest.'}</div><button class="btn primary" id="bOk">${t(U.descend)}</button><button class="btn" id="bClose">${t(U.back)}</button></div>`);
      $('#bOk').onclick = () => { sfx.click(); overlay.classList.remove('on'); overlay.innerHTML = ''; const res = G.descend(); if (res === 'won') { runOver(); return; } Portal.showAd(() => dungeon(true)); };
      $('#bClose').onclick = () => ovClose();
    }
    else if (p.kind === 'chest') { Wd.markUsed(p); treasure(); }
    else if (p.kind === 'fire') { Wd.markUsed(p); rest(); }
    else if (p.kind === 'merchant') { G.roomContent('merchant'); shop(); }
    else if (p.kind === 'statue') { Wd.markUsed(p); G.roomContent('statue'); eventScreen(); }
  }
  // ---------- Heldenblatt ----------
  function showSheet(tab) {
    const r = G.run, d = G.derived();
    tab = tab || 'stats';
    const statsHtml = ['str', 'tou', 'dex', 'mind', 'luck'].map(k => `<div class="stat"><span>${t(U.stat[k])}</span><span><b>${r.stats[k]}</b>${r.points > 0 ? `<button data-sp="${k}">+</button>` : ''}</span></div>`).join('');
    const kv = `<div class="kv" style="margin-top:10px"><span>${t(U.hp)} <b>${d.maxHp}</b></span><span>${t(U.derived.atk)} <b>${d.atk}</b></span><span>${t(U.derived.mag)} <b>${d.mag}</b></span><span>${t(U.derived.def)} <b>${d.def}</b></span><span>${t(U.derived.spd)} <b>${d.spd}</b></span><span>${t(U.derived.crit)} <b>${d.crit} %</b></span><span>${t(U.derived.dodge)} <b>${d.dodge} %</b></span><span>${t(U.xp)} <b>${r.xp}/${G.xpNeed(r.level)}</b></span></div>`;
    const gear = A.SLOTS.map(s => { const it = r.gear[s]; return it ? itemHtml(it) : `<div class="item" style="opacity:0.5"><div><div class="slotlbl">${t(U.slot[s === 'trinket2' ? 'trinket' : s])}</div><div class="nm">–</div></div></div>`; }).join('');
    const bag = r.bag.length ? r.bag.map(it => itemHtml(it, `<button class="primary" data-eq="${it.uid}">${t(U.equip)}</button><button data-sell="${it.uid}">${t(U.sell)} ${G.sellValue(it)}🪙</button>`, slotCurrent(it))).join('') : `<div class="mini">${A.LANG === 'de' ? 'Leer.' : 'Empty.'}</div>`;
    const skills = r.known.map(id => { const sk = A.SKILLS[id]; const on = r.active.includes(id); return `<div class="skill ${on ? 'on' : ''}" data-sk="${id}"><div><div class="nm">${on ? '●' : '○'} ${t(sk.name)}</div><div class="ds">${t(sk.desc)}</div></div><div class="cd">${sk.cd * 2} s</div></div>`; }).join('');
    const content = tab === 'stats' ? `${r.points > 0 ? `<div class="q">⬆ ${r.points} ${t(U.points)}</div>` : ''}${statsHtml}${kv}` :
      tab === 'gear' ? `${gear}<h2 style="margin-top:12px">${t(U.bag)} (${r.bag.length}/8)</h2>${bag}${r.potions > 0 ? `<button class="btn" id="bPot">🧪 ${t(U.usePotion)}</button>` : ''}` :
      `<div class="mini" style="margin-bottom:8px">${A.LANG === 'de' ? `Bis zu ${d.skillSlots} aktiv, auf den Knöpfen 1 bis ${d.skillSlots}.` : `Up to ${d.skillSlots} active, on buttons 1 to ${d.skillSlots}.`}</div>${skills}`;
    ov(`<div class="tabs"><button data-tab="stats" class="${tab === 'stats' ? 'on' : ''}">${t(U.stats)}</button><button data-tab="gear" class="${tab === 'gear' ? 'on' : ''}">${t(U.items)}</button><button data-tab="skills" class="${tab === 'skills' ? 'on' : ''}">${t(U.skills)}</button></div>${content}<button class="btn" id="bClose">${t(U.back)}</button>`);
    overlay.querySelectorAll('[data-tab]').forEach(b => b.onclick = () => showSheet(b.dataset.tab));
    overlay.querySelectorAll('[data-sp]').forEach(b => b.onclick = () => { G.spend(b.dataset.sp); sfx.click(); showSheet('stats'); });
    overlay.querySelectorAll('[data-eq]').forEach(b => b.onclick = () => { G.equip(r.bag.find(x => x.uid === b.dataset.eq)); sfx.buy(); showSheet('gear'); });
    overlay.querySelectorAll('[data-sell]').forEach(b => b.onclick = () => { G.sell(r.bag.find(x => x.uid === b.dataset.sell)); sfx.buy(); showSheet('gear'); });
    overlay.querySelectorAll('[data-sk]').forEach(el => el.onclick = () => { const id = el.dataset.sk; let a = r.active.slice(); if (a.includes(id)) a = a.filter(x => x !== id); else if (a.length < d.skillSlots) a.push(id); else return; G.setActive(a); sfx.click(); showSheet('skills'); });
    const bp = $('#bPot'); if (bp) bp.onclick = () => { G.usePotion(); if (Wd.W) Wd.W.hero.hp = r.hp; sfx.buy(); showSheet('gear'); };
    $('#bClose').onclick = () => { ovClose(); if (r.pendingSkillPick > 0) skillPick(); };
  }
  function skillPick() {
    const r = G.run; const offer = G.skillOffer();
    if (!offer.length) { r.pendingSkillPick = 0; G.save(); return; }
    ov(`<h2>${t(U.newSkill)}</h2>${offer.map(id => { const sk = A.SKILLS[id]; return `<div class="skill" data-pick="${id}"><div><div class="nm">${t(sk.name)}</div><div class="ds">${t(sk.desc)}</div></div><div class="cd">${sk.cd * 2} s</div></div>`; }).join('')}`);
    overlay.querySelectorAll('[data-pick]').forEach(el => el.onclick = () => { G.learnSkill(el.dataset.pick); sfx.buy(); if (r.pendingSkillPick > 0) skillPick(); else { ovClose(); buildControls(); } });
  }

  // ---------- Räume ----------
  function rest() {
    ov(`<h2>🔥 ${t(U.node.rest)}</h2><div class="sub">${A.LANG === 'de' ? 'Ein Feuer. Endlich. Niemand will dich fressen. Vorerst.' : 'A fire. Finally. Nothing wants to eat you. For now.'}</div>
      <button class="btn primary" id="bHeal">${t(U.heal)}</button><button class="btn" id="bTrain">${t(U.train)}</button>`);
    $('#bHeal').onclick = () => { G.doRest('heal'); Wd.W.hero.hp = G.run.hp; sfx.buy(); ovClose(); };
    $('#bTrain').onclick = () => { G.doRest('train'); sfx.buy(); ovClose(); };
  }
  function eventScreen() {
    const r = G.run, ev = r.currentEvent;
    ov(`<h2>❓ ${t(ev.title)}</h2><div class="msg">${t(ev.text)}</div>${ev.choices.map((c, i) => `<button class="btn ${i === 0 ? 'primary' : ''}" data-c="${i}" ${c.needItem && !r.bag.length ? 'disabled' : ''}>${t(c.text)}</button>`).join('')}`);
    overlay.querySelectorAll('[data-c]').forEach(b => b.onclick = () => { const res = G.doEvent(+b.dataset.c); sfx.click(); r.currentEvent = null; Wd.W.hero.hp = r.hp; hudUpdate();
      ov(`<h2>❓ ${t(ev.title)}</h2><div class="msg">${esc(res.msg)}</div>${res.items.map(it => itemHtml(it)).join('')}<button class="btn primary" id="bClose">${t(U.leave)}</button>`);
      $('#bClose').onclick = () => ovClose(); });
  }
  function shop() {
    const r = G.run;
    const items = r.shopItems.map((s, i) => s ? itemHtml(s.it, `<button class="${r.gold >= s.price ? 'primary' : ''}" data-buy="${i}" ${r.gold >= s.price ? '' : 'disabled'}>${t(U.buy)} ${s.price}🪙</button>`, slotCurrent(s.it)) : '').join('');
    const bag = r.bag.map(it => itemHtml(it, `<button data-sell="${it.uid}">${t(U.sell)} ${G.sellValue(it)}🪙</button>`)).join('');
    ov(`<h2>🛒 ${t(U.node.shop)}</h2><div class="sub">${A.LANG === 'de' ? '«Alles frisch. Fast alles. Keine Rückgabe.»' : '"All fresh. Mostly. No returns."'}</div>${items}
      <div class="item"><div style="flex:1"><div class="nm">🧪 ${t(U.potion)}</div><div class="ln">+40 % ${t(U.hp)}</div></div><div class="act"><button class="${r.gold >= G.potionPrice() ? 'primary' : ''}" id="bPot" ${r.gold >= G.potionPrice() ? '' : 'disabled'}>${t(U.buy)} ${G.potionPrice()}🪙</button></div></div>
      ${bag ? `<h2 style="margin-top:12px">${t(U.bag)}</h2>${bag}` : ''}<button class="btn primary" id="bClose">${t(U.leave)}</button>`);
    overlay.querySelectorAll('[data-buy]').forEach(b => b.onclick = () => { if (G.buy(+b.dataset.buy)) { sfx.buy(); shop(); } });
    overlay.querySelectorAll('[data-sell]').forEach(b => b.onclick = () => { G.sell(r.bag.find(x => x.uid === b.dataset.sell)); sfx.buy(); shop(); });
    $('#bPot').onclick = () => { if (G.buyPotion()) { sfx.buy(); shop(); } };
    $('#bClose').onclick = () => { sfx.click(); ovClose(); };
  }
  function treasure() {
    const res = G.treasure();
    for (const it of res.items) G.addToBag(it);
    ov(`<h2>💰 ${t(U.node.treasure)}</h2><div class="msg">${A.LANG === 'de' ? `Eine Truhe. Unverschlossen. Verdächtig. <b class="goldc">+${res.gold} 🪙</b>` : `A chest. Unlocked. Suspicious. <b class="goldc">+${res.gold} 🪙</b>`}</div>${res.items.map(it => itemHtml(it)).join('')}<div class="mini">${A.LANG === 'de' ? 'Liegt im Beutel. Anlegen über den Helden-Knopf oben.' : 'Now in your bag. Equip via the hero button above.'}</div><button class="btn primary" id="bClose">${t(U.leave)}</button>`);
    $('#bClose').onclick = () => { sfx.click(); ovClose(); };
  }

  // ---------- Ende ----------
  function runOver() {
    const r = G.run;
    if (!r.over) { r.over = true; G.finishRun(); }
    Portal.gameplayStop();
    overlay.classList.remove('on'); overlay.innerHTML = '';
    hud.classList.remove('on');
    const won = r.won;
    show(`<div class="center" style="padding-top:6vh"><div style="font-size:56px">${won ? '🏆' : '💀'}</div><h2>${won ? t(U.win) : t(U.runOver)}</h2>
      ${won ? `<div class="msg">${t(U.blocked)}</div>` : `<div class="sub">${t(U.dead)} ${r.floor}.</div>`}
      <div class="card" style="text-align:left"><div class="kv"><span>${t(U.reached)} <b>${r.floor}</b></span><span>${t(U.level)} <b>${r.level}</b></span><span>${t(U.kills)} <b>${r.kills}</b></span><span>🪙 <b>${r.gold}</b></span></div></div>
      <div class="big spark">✦ +${r.sparksEarned}</div><div class="mini">${t(U.sparksEarned)}</div>
      <button class="btn primary" id="bCamp" style="margin-top:16px">${t(U.toCamp)}</button></div>`);
    $('#bCamp').onclick = () => { sfx.click(); G.clearRun(); Portal.showAd(() => camp()); };
  }

  // ---------- Start ----------
  document.addEventListener('visibilitychange', () => { if (document.hidden) G.save(); });
  window.__abstieg = { G, Wd, title, dungeon, get overlay() { return overlay; } };
  title();
})();
