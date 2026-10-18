// Der Abstieg – Oberfläche: Bildschirme, Knöpfe, Kampf-Abspielen
'use strict';
window.A = window.A || {};

(function () {
  const G = A.Game, t = A.t, U = A.UI;
  const $ = (s) => document.querySelector(s);
  const screen = $('#screen'), hud = $('#hud'), overlay = $('#overlay'), combatEl = $('#combat');
  const arena = new A.Arena($('#arena'));
  let speed = 1;
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
  function show(html) { screen.innerHTML = html; screen.scrollTop = 0; hudUpdate(); }
  function ov(html) { overlay.innerHTML = `<div class="ovbox">${html}</div>`; overlay.classList.add('on'); }
  function ovClose() { overlay.classList.remove('on'); overlay.innerHTML = ''; }
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
      <div style="margin-top:18px" class="mini">${A.LANG === 'de' ? 'Durchläufe' : 'Runs'}: ${m.runs} · ${A.LANG === 'de' ? 'Tiefste Ebene' : 'Deepest floor'}: ${m.best}</div>
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
    $('#bStart').onclick = () => { sfx.buy(); G.newRun(selRace, selCls); Portal.gameplayStart(); map(); };
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
    if (r.current && r.current.type && r.enemies && r.pendingFight) prep(); else map();
  }

  // ---------- Karte / Wegwahl ----------
  function map() {
    const r = G.run;
    if (r.over) { runOver(); return; }
    const q = r.quest;
    const choices = r.choices.map((c, i) => `<div class="choice" data-i="${i}"><div class="ico">${ICONS[c.type]}</div><div class="lbl">${t(U.node[c.type])}</div><div class="txt">${t(DESC[c.type])}</div></div>`).join('');
    show(`<h2>${t(U.floor)} ${r.floor} · ${A.LANG === 'de' ? 'Raum' : 'Room'} ${r.step + 1}/5</h2>
      ${q ? `<div class="q ${r.questDone ? 'done' : ''}">📜 ${t(U.quest)}: ${t(q.text)} (${Math.min(r.questProg, q.n)}/${q.n})${r.questDone ? ' ✓' : ''}</div>` : ''}
      <div class="sub">${t(U.chooseRoom)}</div><div class="grid2">${choices}</div>
      ${r.points > 0 || r.pendingSkillPick > 0 ? `<button class="btn primary" id="bSheet">⬆ ${t(U.levelUp)} · ${r.points} ${t(U.points)}</button>` : ''}`);
    screen.querySelectorAll('.choice').forEach(el => el.onclick = () => { sfx.click(); enterRoom(r.choices[+el.dataset.i]); });
    const bs = $('#bSheet'); if (bs) bs.onclick = () => showSheet();
  }
  function enterRoom(choice) {
    G.choose(choice);
    const r = G.run;
    if (['fight', 'elite', 'boss'].includes(choice.type)) { r.pendingFight = true; G.save(); prep(); }
    else if (choice.type === 'rest') rest();
    else if (choice.type === 'event') eventScreen();
    else if (choice.type === 'shop') shop();
    else if (choice.type === 'treasure') treasure();
  }
  function leaveRoom() {
    const res = G.afterRoom();
    if (res === 'won') { runOver(); return; }
    if (res === 'descend') { ov(`<div class="center"><div style="font-size:50px">⬇️</div><h2>${t(U.floor)} ${G.run.floor}</h2><div class="sub">${A.LANG === 'de' ? 'Neue Schicht, neue Gegner, neue Aufgabe.' : 'New layer, new enemies, new quest.'}</div><button class="btn primary" id="bOk">${t(U.descend)}</button></div>`); $('#bOk').onclick = () => { ovClose(); Portal.showAd(() => map()); }; return; }
    map();
  }

  // ---------- Heldenblatt ----------
  function showSheet(tab) {
    const r = G.run, d = G.derived();
    tab = tab || 'stats';
    const statsHtml = ['str', 'tou', 'dex', 'mind', 'luck'].map(k => `<div class="stat"><span>${t(U.stat[k])}</span><span><b>${r.stats[k]}</b>${r.points > 0 ? `<button data-sp="${k}">+</button>` : ''}</span></div>`).join('');
    const kv = `<div class="kv" style="margin-top:10px"><span>${t(U.hp)} <b>${d.maxHp}</b></span><span>${t(U.derived.atk)} <b>${d.atk}</b></span><span>${t(U.derived.mag)} <b>${d.mag}</b></span><span>${t(U.derived.def)} <b>${d.def}</b></span><span>${t(U.derived.spd)} <b>${d.spd}</b></span><span>${t(U.derived.crit)} <b>${d.crit} %</b></span><span>${t(U.derived.dodge)} <b>${d.dodge} %</b></span><span>${t(U.xp)} <b>${r.xp}/${G.xpNeed(r.level)}</b></span></div>`;
    const gear = A.SLOTS.map(s => { const it = r.gear[s]; return it ? itemHtml(it) : `<div class="item" style="opacity:0.5"><div><div class="slotlbl">${t(U.slot[s === 'trinket2' ? 'trinket' : s])}</div><div class="nm">–</div></div></div>`; }).join('');
    const bag = r.bag.length ? r.bag.map(it => itemHtml(it, `<button class="primary" data-eq="${it.uid}">${t(U.equip)}</button><button data-sell="${it.uid}">${t(U.sell)} ${G.sellValue(it)}🪙</button>`, slotCurrent(it))).join('') : `<div class="mini">${A.LANG === 'de' ? 'Leer.' : 'Empty.'}</div>`;
    const skills = r.known.map(id => { const sk = A.SKILLS[id]; const on = r.active.includes(id); return `<div class="skill ${on ? 'on' : ''}" data-sk="${id}"><div><div class="nm">${on ? '●' : '○'} ${t(sk.name)}</div><div class="ds">${t(sk.desc)}</div></div><div class="cd">${sk.cd} ${t(U.rounds)}</div></div>`; }).join('');
    const content = tab === 'stats' ? `${r.points > 0 ? `<div class="q">⬆ ${r.points} ${t(U.points)}</div>` : ''}${statsHtml}${kv}` :
      tab === 'gear' ? `${gear}<h2 style="margin-top:12px">${t(U.bag)} (${r.bag.length}/8)</h2>${bag}${r.potions > 0 ? `<button class="btn" id="bPot">🧪 ${t(U.usePotion)}</button>` : ''}` :
      `<div class="mini" style="margin-bottom:8px">${A.LANG === 'de' ? `Bis zu ${d.skillSlots} aktiv. Reihenfolge = Vorrang im Kampf.` : `Up to ${d.skillSlots} active. Order = priority in battle.`}</div>${skills}
       <div class="toggle" style="margin-top:10px"><button data-row="front" class="${r.row === 'front' ? 'on' : ''}">${t(U.front)}</button><button data-row="back" class="${r.row === 'back' ? 'on' : ''}">${t(U.backRow)}</button></div><div class="mini">${A.LANG === 'de' ? 'Vorne: trifft im Nahkampf voll, wird zuerst angegriffen. Hinten: Nahkämpfer erreichen dich erst, wenn vorne niemand steht; Nahkampf-Waffen machen hinten 30 % weniger.' : 'Front: full melee hits, attacked first. Back: melee enemies reach you only when the front is empty; melee weapons do 30% less from the back.'}</div>`;
    ov(`<div class="tabs"><button data-tab="stats" class="${tab === 'stats' ? 'on' : ''}">${t(U.stats)}</button><button data-tab="gear" class="${tab === 'gear' ? 'on' : ''}">${t(U.items)}</button><button data-tab="skills" class="${tab === 'skills' ? 'on' : ''}">${t(U.skills)}</button></div>${content}<button class="btn" id="bClose">${t(U.back)}</button>`);
    overlay.querySelectorAll('[data-tab]').forEach(b => b.onclick = () => showSheet(b.dataset.tab));
    overlay.querySelectorAll('[data-sp]').forEach(b => b.onclick = () => { G.spend(b.dataset.sp); sfx.click(); showSheet('stats'); });
    overlay.querySelectorAll('[data-eq]').forEach(b => b.onclick = () => { G.equip(r.bag.find(x => x.uid === b.dataset.eq)); sfx.buy(); showSheet('gear'); });
    overlay.querySelectorAll('[data-sell]').forEach(b => b.onclick = () => { G.sell(r.bag.find(x => x.uid === b.dataset.sell)); sfx.buy(); showSheet('gear'); });
    overlay.querySelectorAll('[data-sk]').forEach(el => el.onclick = () => { const id = el.dataset.sk; let a = r.active.slice(); if (a.includes(id)) a = a.filter(x => x !== id); else if (a.length < d.skillSlots) a.push(id); else return; G.setActive(a); sfx.click(); showSheet('skills'); });
    overlay.querySelectorAll('[data-row]').forEach(b => b.onclick = () => { r.row = b.dataset.row; G.save(); sfx.click(); showSheet('skills'); });
    const bp = $('#bPot'); if (bp) bp.onclick = () => { G.usePotion(); sfx.buy(); showSheet('gear'); };
    $('#bClose').onclick = () => { ovClose(); hudUpdate(); if (r.pendingSkillPick > 0) skillPick(); };
  }
  function skillPick() {
    const r = G.run; const offer = G.skillOffer();
    if (!offer.length) { r.pendingSkillPick = 0; G.save(); return; }
    ov(`<h2>${t(U.newSkill)}</h2>${offer.map(id => { const sk = A.SKILLS[id]; return `<div class="skill" data-pick="${id}"><div><div class="nm">${t(sk.name)}</div><div class="ds">${t(sk.desc)}</div></div><div class="cd">${sk.cd} ${t(U.rounds)}</div></div>`; }).join('')}`);
    overlay.querySelectorAll('[data-pick]').forEach(el => el.onclick = () => { G.learnSkill(el.dataset.pick); sfx.buy(); ovClose(); hudUpdate(); if (r.pendingSkillPick > 0) skillPick(); });
  }

  // ---------- Aufstellung ----------
  function prep() {
    const r = G.run, d = G.derived();
    const enemies = r.enemies.map(e => `<div class="enemy"><b>${e.boss ? '👑 ' : ''}${esc(e.name)}</b>❤ ${e.maxHp} · ⚔ ${e.atk} · ${t(e.row === 'front' ? U.front : U.backRow)}${e.eliteKind ? ' · ' + ({ giftig: '☠', gepanzert: '🛡', schnell: '💨' })[e.eliteKind] : ''}</div>`).join('');
    const boss = r.current.type === 'boss' ? `<div class="q">👑 ${t(A.BOSSES[r.floor].trick)}</div>` : '';
    const skills = r.active.map(id => `<span class="enemy">✦ ${t(A.SKILLS[id].name)}</span>`).join('') || `<span class="mini">–</span>`;
    show(`<h2>${t(U.prep)}</h2>${boss}<div class="card"><div class="slotlbl">${A.LANG === 'de' ? 'Gegner' : 'Enemies'}</div><div style="margin-top:6px">${enemies}</div></div>
      <div class="card"><div class="slotlbl">${A.LANG === 'de' ? 'Du' : 'You'}</div><div class="kv" style="margin-top:6px"><span>${t(U.hp)} <b>${r.hp}/${d.maxHp}</b></span><span>${t(U.derived.atk)} <b>${d.atk}</b></span><span>${t(U.derived.mag)} <b>${d.mag}</b></span><span>${t(U.derived.def)} <b>${d.def}</b></span></div><div style="margin-top:8px">${skills}</div></div>
      <div class="toggle"><button data-row="front" class="${r.row === 'front' ? 'on' : ''}">${t(U.front)}</button><button data-row="back" class="${r.row === 'back' ? 'on' : ''}">${t(U.backRow)}</button></div>
      <div class="row"><button class="btn" id="bSheet">🎒 ${t(U.items)} / ${t(U.skills)}</button>${r.potions > 0 && r.hp < d.maxHp ? `<button class="btn" id="bPot">🧪 +40 %</button>` : ''}</div>
      <button class="btn primary" id="bFight">⚔️ ${t(U.fightBtn)}</button>`);
    screen.querySelectorAll('[data-row]').forEach(b => b.onclick = () => { r.row = b.dataset.row; G.save(); sfx.click(); prep(); });
    $('#bSheet').onclick = () => { showSheet('gear'); $('#bClose').onclick = () => { ovClose(); prep(); }; };
    const bp = $('#bPot'); if (bp) bp.onclick = () => { G.usePotion(); sfx.buy(); prep(); };
    $('#bFight').onclick = () => { sfx.click(); fight(); };
  }

  // ---------- Kampf ----------
  function fight() {
    const r = G.run;
    const hero = G.heroEntity();
    if (hero.row === 'back' && hero.melee === false && A.CLASSES.find(c => c.id === r.cls).row === 'front') hero.atk = Math.round(hero.atk * 0.7);
    const result = A.Combat.simulate(hero, r.enemies, r.floor, r.rng.int(1, 2e9));
    combatEl.classList.add('on');
    arena.speed = speed;
    arena.setup(result.events[0].ents, r.floor);
    $('#clog').textContent = '';
    arena.play(result.events, () => finishFight(result));
  }
  document.querySelectorAll('#cbar .sp').forEach(b => b.onclick = () => { speed = +b.dataset.sp; arena.speed = speed; document.querySelectorAll('#cbar .sp').forEach(x => x.classList.toggle('on', x === b)); });
  function finishFight(result) {
    const r = G.run;
    r.pendingFight = false;
    const out = G.resolveFight(result);
    combatEl.classList.remove('on');
    hudUpdate();
    if (out.dead) { sfx.lose(); runOver(); return; }
    if (out.fled) { ov(`<div class="center"><h2>…</h2><div class="sub">${A.LANG === 'de' ? 'Der Kampf zieht sich. Ihr geht euch aus dem Weg.' : 'The fight drags on. You avoid each other.'}</div><button class="btn primary" id="bOk">${t(U.leave)}</button></div>`); $('#bOk').onclick = () => { ovClose(); leaveRoom(); }; return; }
    sfx.win(); if (out.boss) Portal.happytime();
    reward(out);
  }
  function reward(out) {
    const r = G.run;
    const items = out.rewards.map((it, i) => itemHtml(it, `<button class="primary" data-take="${i}">${t(U.take)}</button>`, slotCurrent(it))).join('');
    ov(`<div class="center"><h2>${t(U.victory)}</h2><div><span class="goldc">+${out.gold} 🪙</span> · +${out.xp} ${t(U.xp)}${out.levels ? ` · <b style="color:var(--hp)">${t(U.levelUp)}</b>` : ''}</div>${out.questReward ? `<div class="q done">📜 ${t(U.questDone)}</div>` : ''}</div>
      <h2 style="margin-top:10px">${t(U.pickReward)}</h2>${items}<button class="btn" id="bSkip">${t(U.skip)}</button>`);
    overlay.querySelectorAll('[data-take]').forEach(b => b.onclick = () => { const it = out.rewards[+b.dataset.take]; G.addToBag(it); sfx.buy(); afterReward(it); });
    $('#bSkip').onclick = () => { sfx.click(); afterReward(null); };
  }
  function afterReward(it) {
    const r = G.run;
    ovClose();
    const next = () => { if (r.pendingSkillPick > 0) { skillPick(); const wait = setInterval(() => { if (!overlay.classList.contains('on')) { clearInterval(wait); leaveRoom(); } }, 150); } else leaveRoom(); };
    if (it) {
      const cur = slotCurrent(it);
      ov(`${itemHtml(it)}<button class="btn primary" id="bEq">${t(U.equip)}${cur ? ` (${A.LANG === 'de' ? 'ersetzt' : 'replaces'} ${esc(G.itemName(cur))})` : ''}</button><button class="btn" id="bBag">${t(U.bag)}</button>`);
      $('#bEq').onclick = () => { G.equip(it); sfx.buy(); ovClose(); hudUpdate(); next(); };
      $('#bBag').onclick = () => { ovClose(); next(); };
    } else next();
  }

  // ---------- Räume ----------
  function rest() {
    show(`<h2>🔥 ${t(U.node.rest)}</h2><div class="sub">${A.LANG === 'de' ? 'Ein Feuer. Endlich. Niemand will dich fressen. Vorerst.' : 'A fire. Finally. Nothing wants to eat you. For now.'}</div>
      <button class="btn primary" id="bHeal">${t(U.heal)}</button><button class="btn" id="bTrain">${t(U.train)}</button>`);
    $('#bHeal').onclick = () => { G.doRest('heal'); sfx.buy(); leaveRoom(); };
    $('#bTrain').onclick = () => { G.doRest('train'); sfx.buy(); leaveRoom(); };
  }
  function eventScreen() {
    const r = G.run, ev = r.currentEvent;
    show(`<h2>❓ ${t(ev.title)}</h2><div class="msg">${t(ev.text)}</div>${ev.choices.map((c, i) => `<button class="btn ${i === 0 ? 'primary' : ''}" data-c="${i}" ${c.needItem && !r.bag.length ? 'disabled' : ''}>${t(c.text)}</button>`).join('')}`);
    screen.querySelectorAll('[data-c]').forEach(b => b.onclick = () => { const res = G.doEvent(+b.dataset.c); sfx.click(); hudUpdate();
      show(`<h2>❓ ${t(ev.title)}</h2><div class="msg">${esc(res.msg)}</div>${res.items.map(it => itemHtml(it)).join('')}<button class="btn primary" id="bOk">${t(U.leave)}</button>`);
      $('#bOk').onclick = () => leaveRoom(); });
  }
  function shop() {
    const r = G.run;
    const items = r.shopItems.map((s, i) => s ? itemHtml(s.it, `<button class="${r.gold >= s.price ? 'primary' : ''}" data-buy="${i}" ${r.gold >= s.price ? '' : 'disabled'}>${t(U.buy)} ${s.price}🪙</button>`, slotCurrent(s.it)) : '').join('');
    const bag = r.bag.map(it => itemHtml(it, `<button data-sell="${it.uid}">${t(U.sell)} ${G.sellValue(it)}🪙</button>`)).join('');
    show(`<h2>🛒 ${t(U.node.shop)}</h2><div class="sub">${A.LANG === 'de' ? '«Alles frisch. Fast alles. Keine Rückgabe.»' : '"All fresh. Mostly. No returns."'}</div>${items}
      <div class="item"><div style="flex:1"><div class="nm">🧪 ${t(U.potion)}</div><div class="ln">+40 % ${t(U.hp)}</div></div><div class="act"><button class="${r.gold >= G.potionPrice() ? 'primary' : ''}" id="bPot" ${r.gold >= G.potionPrice() ? '' : 'disabled'}>${t(U.buy)} ${G.potionPrice()}🪙</button></div></div>
      ${bag ? `<h2 style="margin-top:12px">${t(U.bag)}</h2>${bag}` : ''}<button class="btn primary" id="bLeave">${t(U.leave)}</button>`);
    screen.querySelectorAll('[data-buy]').forEach(b => b.onclick = () => { if (G.buy(+b.dataset.buy)) { sfx.buy(); shop(); } });
    screen.querySelectorAll('[data-sell]').forEach(b => b.onclick = () => { G.sell(r.bag.find(x => x.uid === b.dataset.sell)); sfx.buy(); shop(); });
    $('#bPot').onclick = () => { if (G.buyPotion()) { sfx.buy(); shop(); } };
    $('#bLeave').onclick = () => { sfx.click(); leaveRoom(); };
  }
  function treasure() {
    const res = G.treasure();
    for (const it of res.items) G.addToBag(it);
    show(`<h2>💰 ${t(U.node.treasure)}</h2><div class="msg">${A.LANG === 'de' ? `Eine Truhe. Unverschlossen. Verdächtig. <b class="goldc">+${res.gold} 🪙</b>` : `A chest. Unlocked. Suspicious. <b class="goldc">+${res.gold} 🪙</b>`}</div>${res.items.map(it => itemHtml(it)).join('')}<div class="mini">${A.LANG === 'de' ? 'Liegt im Beutel. Anlegen über den Helden-Knopf oben.' : 'Now in your bag. Equip via the hero button above.'}</div><button class="btn primary" id="bOk">${t(U.leave)}</button>`);
    $('#bOk').onclick = () => { sfx.click(); leaveRoom(); };
  }

  // ---------- Ende ----------
  function runOver() {
    const r = G.run;
    if (!r.over) { r.over = true; G.finishRun(); }
    Portal.gameplayStop();
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
  window.__abstieg = { G, arena, title, map, get overlay() { return overlay; }, setSpeed: (s) => { speed = s; arena.speed = s; } };
  title();
})();
