// Der Abstieg – Oberfläche: Titelbild, Heldenwahl, Lager, Anzeige oben, Knöpfe, Fenster und die Ebene in Echtzeit
'use strict';
window.A = window.A || {};

(function () {
  const G = A.Game, t = A.t, U = A.UI, Art = A.Art, S = A.Sound;
  const $ = (s) => document.querySelector(s);
  const screen = $('#screen'), hud = $('#hud'), overlay = $('#overlay'), dungeonEl = $('#dungeon'), bgCv = $('#bg'), joyHint = $('#joyHint');
  const draw = new A.Draw($('#arena'));
  // Darstellung: 'retro' (Pixel-Grafik) oder '3d' (Klötzchen-Welt mit Licht und Schatten); ?look=3d bzw. ?look=retro zum Ausprobieren
  let draw3 = null, look3dBroken = false;
  try { const q = new URLSearchParams(location.search).get('look'); if (q === '3d' || q === 'retro') G.meta.look = q; } catch (e) {}
  function lookIs3d() { return G.meta.look === '3d' && !!A.Draw3 && !look3dBroken; }
  function activeDraw() {
    if (!lookIs3d()) return draw;
    if (!draw3) { try { draw3 = new A.Draw3($('#arena3d'), draw); } catch (e) { console.warn('3D nicht möglich:', e); look3dBroken = true; return draw; } }
    return draw3;
  }
  function applyLook() { const on = lookIs3d(); dungeonEl.classList.toggle('d3', on); if (on) activeDraw(); if (draw3) { draw3.topPad = draw.topPad; draw3.botPad = draw.botPad; } }
  function toggleLook() { G.meta.look = G.meta.look === '3d' ? 'retro' : '3d'; G.saveMeta(); applyLook(); }
  const Wd = A.World;
  const de = A.LANG === 'de', L = (d, e) => de ? d : e;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const ic = (name, size, cls) => Art.img(name, size || 16, null, null, cls);
  const coin = (n) => `${ic('coin', 16, 'coin')}<span>${n}</span>`;
  const spark = (n, size) => `<span class="sp">${ic('u_spark', size || 18)}<span>${n}</span></span>`;

  // Portal-Anbindung (Platzhalter; wird beim Einreichen ersetzt)
  const Portal = window.AbstiegPortal || { gameplayStart() {}, gameplayStop() {}, happytime() {}, showAd(cb) { cb(); }, showRewardedAd(cb) { cb(); } };

  // ---------- Symbole ----------
  const WEAPON_ICON = { klinge: 'i_schwert', schuetze: 'i_bogen', weber: 'i_stab', rufer: 'i_zepter', brau: 'potion' };
  const SKILL_ICON = { hieb: 's_strike', rache: 's_strike', wirbel: 's_whirl', schild: 's_shield', gewebe: 's_shield', kampfschrei: 's_buff', rueckzug: 's_buff', hinrichtung: 'u_skull', zielschuss: 's_arrow', pfeilregen: 's_arrow', doppelschuss: 's_arrow', kopfschuss: 's_arrow', giftpfeil: 's_poison', funke: 's_bolt', flaeche: 's_nova', entladung: 's_nova', flicken: 's_heal', fesseln: 's_bind' };
  const PROP_ICON = { chest: 'chest', fire: 'flame', merchant: 'u_bag', statue: 'u_quest', stairs: 'u_down' };
  const STAT_ICON = { str: 'i_axt', tou: 'u_heart', dex: 's_arrow', mind: 's_bolt', luck: 'u_star' };
  const SLOT_ICON = { weapon: 'i_schwert', armor: 'i_leder', helm: 'i_kappe', boots: 'i_stiefel', trinket: 'i_ring', trinket2: 'i_amulett' };
  const UPG_ICON = { hp1: 'u_heart', hp2: 'u_heart', gold1: 'coin', atk1: 'i_schwert', potion1: 'potion', skill1: 'u_scroll', luck1: 'u_star' };
  const skIcon = (id, size) => ic(SKILL_ICON[id] || 's_strike', size || 26);
  const itIcon = (it, size) => ic(Art.itemIcon(it.base), size || 36);
  const rarCol = (r) => (A.RARITY[r] || A.RARITY.common).color;
  const portrait = (race, cls) => `<img class="px" src="${Art.heroPortrait(race, cls)}" width="36" height="26" alt="">`;

  let selRace = 'mensch', selCls = 'klinge';

  // ---------- Anzeige oben ----------
  const H = { btn: $('#heroBtn'), img: $('#heroBtn img'), lv: $('#heroBtn .lv'), hp: $('#hpbar i'), trail: $('#hpbar b'), bar: $('#hpbar'), hpt: $('#hptext'), xp: $('#xpbar i'), gold: $('#hudGold'), pot: $('#hudPot'), floor: $('#hudFloor') };
  const hudLast = {};
  function setH(key, el, html, bump) {
    if (hudLast[key] === html) return;
    const had = key in hudLast; hudLast[key] = html; el.innerHTML = html;
    if (bump && had) { el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); }
  }
  function hudUpdate() {
    const r = G.run;
    if (!r || r.over || !document.body.classList.contains('play')) { hud.classList.remove('on'); return; }
    hud.classList.add('on');
    const d = G.derived();
    const pct = clamp(r.hp / d.maxHp * 100, 0, 100) + '%';
    if (hudLast.hp !== pct) { hudLast.hp = pct; H.hp.style.width = pct; H.trail.style.width = pct; }
    H.bar.classList.toggle('low', r.hp / d.maxHp < 0.3);
    setH('hpt', H.hpt, r.hp + ' / ' + d.maxHp);
    const xp = clamp(r.xp / G.xpNeed(r.level) * 100, 0, 100) + '%';
    if (hudLast.xp !== xp) { hudLast.xp = xp; H.xp.style.width = xp; }
    setH('gold', H.gold, coin(r.gold), true);
    setH('pot', H.pot, ic('potion', 22) + `<span>${r.potions}</span>`, true);
    setH('floor', H.floor, ic('u_down', 20) + `<span>${r.floor}</span>`);
    const src = Art.heroPortrait(r.race, r.cls); if (hudLast.src !== src) { hudLast.src = src; H.img.src = src; }
    setH('lv', H.lv, String(r.level));
    H.btn.classList.toggle('pts', r.points > 0 || r.pendingSkillPick > 0);
  }
  H.btn.addEventListener('click', () => { S.click(); showSheet(); });

  // ---------- Hilfen ----------
  function scoreItem(it) { const s = it.stats; return (s.atk || 0) * 2 + (s.mag || 0) * 2 + (s.def || 0) * 2 + (s.hp || 0) * 0.3 + (s.spd || 0) * 3 + (s.crit || 0) * 0.8 + (s.dodge || 0) * 0.8 + (s.atkPct || 0) * 0.6 + (s.magPct || 0) * 0.6 + (s.lifesteal || 0) + (s.thorns || 0) * 0.3 + (s.regen || 0) * 3 + (s.startShield || 0) * 0.5 + (s.poisonOnHit || 0) * 2 + (s.goldPct || 0) * 0.1 + (s.xpPct || 0) * 0.2 + (s.revive || 0) * 30; }
  function slotCurrent(it) { const r = G.run; if (it.slot === 'trinket') { if (!r.gear.trinket) return null; if (!r.gear.trinket2) return null; return scoreItem(r.gear.trinket) < scoreItem(r.gear.trinket2) ? r.gear.trinket : r.gear.trinket2; } return r.gear[it.slot] || null; }
  function cmpHtml(it, cmpWith) {
    if (cmpWith === undefined) return '';
    if (cmpWith === null) return `<span class="up">${L('neu', 'new')}</span>`;
    const diff = Math.round(scoreItem(it) - scoreItem(cmpWith));
    return diff >= 0 ? `<span class="up">${diff}</span>` : `<span class="down">${-diff}</span>`;
  }
  function itemHtml(it, actions, cmpWith) {
    const lines = G.itemLines(it);
    return `<div class="item" style="--rc:${rarCol(it.rarity)}">
      <div class="ic">${itIcon(it, 36)}</div>
      <div class="bd">
        <div class="slotlbl">${t(U.slot[it.slot === 'trinket2' ? 'trinket' : it.slot])} · ${t(U.rarity[it.rarity])} ${cmpHtml(it, cmpWith)}</div>
        <div class="nm">${esc(G.itemName(it))}</div>
        <div class="ln">${lines.map(esc).join(' · ')}</div>
        ${it.flavor ? `<div class="fl">${esc(t(it.flavor))}</div>` : ''}
      </div>
      ${actions ? `<div class="act">${actions}</div>` : ''}
    </div>`;
  }
  function emptySlot(s) { return `<div class="item" style="--rc:#5a6988"><div class="ic">${ic(SLOT_ICON[s], 36, 'empty')}</div><div class="bd"><div class="slotlbl">${t(U.slot[s === 'trinket2' ? 'trinket' : s])}</div><div class="nm" style="color:var(--steel)">${L('leer', 'empty')}</div></div></div>`; }
  function show(html, opts) {
    dungeonEl.classList.remove('on'); document.body.classList.remove('play');
    screen.style.display = ''; screen.innerHTML = html; screen.scrollTop = 0;
    hudUpdate();
    if (!(opts && opts.stage)) A.Scenes.stage(null);
    sceneBg(opts && opts.title);
  }
  // Hintergrundbild der Menüs: beim Titel steht das Tor zwischen Untertitel und Menü
  function sceneBg(isTitle) {
    const r = G.run; const race = r ? r.race : selRace, cls = r ? r.cls : selCls;
    if (!isTitle) { A.Scenes.title(bgCv, { dim: 0.72, race, cls }); return; }
    const place = () => {
      const tag = screen.querySelector('.tag'), logo = screen.querySelector('.logo h1'), first = screen.querySelector('.menu .btn'); if (!tag || !first) return;
      const wide = innerWidth > innerHeight * 1.2, lr = logo.getBoundingClientRect();
      A.Scenes.title(bgCv, { anchor: { top: wide ? lr.top + lr.height * 0.75 : tag.getBoundingClientRect().bottom, bottom: first.getBoundingClientRect().top }, race, cls });
    };
    place(); requestAnimationFrame(place);
  }
  window.addEventListener('resize', () => { if (screen.querySelector('.title-wrap')) sceneBg(true); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (screen.querySelector('.title-wrap')) sceneBg(true); });
  function ov(html, cls) { overlay.innerHTML = `<div class="ovbox ${cls || ''}">${html}</div>`; overlay.classList.add('on'); overlay.scrollTop = 0; Wd.pause(true); }
  function ovClose() { overlay.classList.remove('on'); overlay.innerHTML = ''; if (dungeonEl.classList.contains('on')) { Wd.pause(false); Wd.refreshHero(); } hudUpdate(); }

  // ---------- Titel ----------
  // Überblenden: schwarz werden (fadeOut) und wieder aufhellen (fadeIn), für Ebenen-Wechsel
  const fadeEl = $('#fade');
  function fadeIn() { if (!fadeEl) return; fadeEl.style.transition = 'none'; fadeEl.style.opacity = '1'; requestAnimationFrame(() => requestAnimationFrame(() => { fadeEl.style.transition = 'opacity .7s'; fadeEl.style.opacity = '0'; })); }
  function fadeOut(cb, delay) { const dl = delay || 0; if (!fadeEl) { setTimeout(cb, dl); return; } fadeEl.style.transition = `opacity .3s ${dl / 1000}s`; fadeEl.style.opacity = '1'; setTimeout(cb, 330 + dl); }
  function title() {
    S.music(null);
    const m = G.meta, r = G.load();
    const words = t(U.title).split(' ');
    show(`<div class="title-wrap fade-in">
      <div class="topbar">${A.Draw3 ? `<button class="iconbtn look" id="bLook" aria-label="${L('Darstellung wechseln', 'Switch look')}">${L('Look', 'Look')}<b>${m.look === '3d' ? '3D' : 'Retro'}</b></button>` : ''}<button class="iconbtn" id="bSound" aria-label="${esc(t(U.sound))}">${ic(m.sound ? 'u_sound' : 'u_mute', 22)}</button></div>
      <div class="logo">${words.length > 1 ? `<div class="pre">${esc(words[0])}</div>` : ''}<h1>${esc(words.slice(words.length > 1 ? 1 : 0).join(' '))}</h1></div>
      <div class="tag">${esc(t(U.tagline))}</div>
      <div class="menu">
        ${r ? `<button class="btn primary" id="bCont">${t(U.continueRun)} · ${t(U.floor)} ${r.floor}</button>` : ''}
        <button class="btn ${r ? '' : 'primary'}" id="bNew">${t(U.play)}</button>
        <button class="btn" id="bCamp">${ic('u_tent', 28)}<span>${t(U.camp)}</span>${spark(m.sparks)}</button>
        <div class="stats">${L('Durchläufe', 'Runs')} <b>${m.runs}</b> · ${L('Tiefste Ebene', 'Deepest floor')} <b>${m.best}</b></div>
        <div class="howto pc">${t(U.howto)}</div>
        <button class="link" id="bReset">${t(U.reset)}</button>
      </div>
    </div>`, { title: true });
    if (r) $('#bCont').onclick = () => { S.click(); resume(); };
    $('#bNew').onclick = () => { S.click(); if (r) { if (!confirm(L('Laufenden Durchlauf aufgeben?', 'Abandon the current run?'))) return; G.clearRun(); } heroSelect(); };
    $('#bCamp').onclick = () => { S.click(); camp(); };
    $('#bSound').onclick = () => { G.meta.sound = !G.meta.sound; G.saveMeta(); S.click(); if (!G.meta.sound) S.music(null); title(); };
    if ($('#bLook')) $('#bLook').onclick = () => { S.click(); toggleLook(); title(); };
    $('#bReset').onclick = () => { if (confirm(L('Wirklich alles löschen? Auch die Seelenfunken.', 'Really delete everything? Including soul sparks.'))) { G.resetAll(); title(); } };
  }

  // ---------- Held wählen ----------
  function heroSelect() {
    const races = A.RACES.map(r => { const ok = G.raceUnlocked(r); return `<button class="chip" data-race="${r.id}" aria-label="${esc(t(r.name))}">${ok ? '' : `<span class="cost">${spark(r.unlock, 11)}</span>`}<img class="px hero" src="${Art.heroUrl(r.id, selCls, 2)}" width="36" height="36" alt=""></button>`; }).join('');
    const classes = A.CLASSES.map(c => { const ok = G.classUnlocked(c); return `<button class="chip" data-cls="${c.id}" aria-label="${esc(t(c.name))}">${ok ? '' : `<span class="lock">${L('bald', 'soon')}</span>`}${ic(WEAPON_ICON[c.id] || 'i_schwert', 36)}</button>`; }).join('');
    show(`<div class="fade-in">
      <h2>${L('Wähle deinen Helden', 'Choose your hero')}</h2>
      <div class="stage"><canvas id="stage"></canvas><div class="who"><b id="whoName"></b><span id="whoSub"></span></div></div>
      <h3>${t(U.race)}</h3><div class="chips">${races}</div><div class="perk" id="racePerk"></div>
      <h3>${t(U.cls)}</h3><div class="chips">${classes}</div><div class="perk" id="clsPerk"></div>
      <button class="btn primary" id="bStart">${t(U.start)}</button><button class="btn" id="bBack">${t(U.back)}</button>
    </div>`, { stage: true });
    const upd = (peekCls) => {
      const race = A.RACES.find(x => x.id === selRace), cls = A.CLASSES.find(x => x.id === selCls);
      screen.querySelectorAll('[data-race]').forEach(el => { el.classList.toggle('sel', el.dataset.race === selRace); el.classList.toggle('locked', !G.raceUnlocked(A.RACES.find(x => x.id === el.dataset.race))); el.querySelector('img.hero').src = Art.heroUrl(el.dataset.race, selCls, 2); });
      screen.querySelectorAll('[data-cls]').forEach(el => { el.classList.toggle('sel', el.dataset.cls === selCls); el.classList.toggle('locked', !G.classUnlocked(A.CLASSES.find(x => x.id === el.dataset.cls))); });
      $('#whoName').textContent = t(cls.name);
      $('#whoSub').textContent = t(race.name) + ' · ' + t(cls.row === 'front' ? U.front : U.backRow);
      $('#racePerk').innerHTML = `<b>${esc(t(race.name))}:</b> ${esc(t(race.perk))}`;
      const pc = peekCls || cls;
      $('#clsPerk').innerHTML = `<b>${esc(t(pc.name))}:</b> ${esc(t(pc.perk))}`;
      A.Scenes.stage($('#stage'), selRace, selCls);
    };
    screen.querySelectorAll('[data-race]').forEach(el => el.onclick = () => { const r = A.RACES.find(x => x.id === el.dataset.race); if (!G.raceUnlocked(r)) { S.click(); camp(); return; } if (selRace === r.id) return; selRace = r.id; S.click(); upd(); });
    screen.querySelectorAll('[data-cls]').forEach(el => el.onclick = () => { const c = A.CLASSES.find(x => x.id === el.dataset.cls); if (!G.classUnlocked(c)) { upd(c); return; } if (selCls === c.id) return; selCls = c.id; S.click(); upd(); });
    $('#bStart').onclick = () => { S.buy(); A.Scenes.stage(null); G.newRun(selRace, selCls); Portal.gameplayStart(); dungeon(true); };
    $('#bBack').onclick = () => { S.click(); title(); };
    upd();
  }

  // ---------- Lager ----------
  function camp() {
    const m = G.meta;
    const list = A.META_SHOP.map(u => {
      const have = m.unlocked.includes(u.id); const can = !have && m.sparks >= u.cost && (!u.needs || m.unlocked.includes(u.needs));
      const icon = u.effect.race ? portrait(u.effect.race, 'weber') : ic(UPG_ICON[u.id] || 'u_star', 30);
      return `<div class="card upg ${have ? 'have' : (can ? '' : 'locked')}"><div class="ic">${icon}</div><div style="flex:1;min-width:0"><div class="ttl">${esc(t(u.name))}</div><div class="txt">${esc(t(u.desc))}</div></div>${have ? `<span class="mini" style="color:var(--green)">${t(U.bought)}</span>` : `<button class="btn small ${can ? 'primary' : ''}" data-buy="${u.id}" ${can ? '' : 'disabled'}>${spark(u.cost)}</button>`}</div>`;
    }).join('');
    show(`<div class="fade-in"><h2>${ic('u_tent', 42)}${t(U.camp)}</h2><div class="sub">${t(U.campInfo)}</div>
      <div class="card sparkbar"><span>${t(U.meta)}</span><b>${spark(m.sparks, 22)}</b></div>${list}<button class="btn" id="bBack">${t(U.back)}</button></div>`);
    screen.querySelectorAll('[data-buy]').forEach(b => b.onclick = () => { if (G.metaBuy(b.dataset.buy)) { S.buy(); camp(); } });
    $('#bBack').onclick = () => { S.click(); title(); };
  }

  // ---------- Fortsetzen ----------
  function resume() { Portal.gameplayStart(); dungeon(false); }

  // ---------- Die Ebene (Echtzeit) ----------
  const input = A.Input;
  input.bindCanvas($('#arena'));
  let last = 0, hudT = 0;
  const perf = { n: 0, sum: 0 };
  function dungeon(fresh) {
    const r = G.run;
    if (r.over) { runOver(); return; }
    A.Scenes.hideTitle(); A.Scenes.stage(null);
    screen.style.display = 'none'; dungeonEl.classList.add('on'); document.body.classList.add('play'); hudUpdate();
    const hooks = {
      onItem: (it) => foundItem(it),
      onProp: (p) => useProp(p),
      onCleared: (room) => { if (room.type === 'boss') Portal.happytime(); if (r.questJustDone) { r.questJustDone = false; setTimeout(() => A.FX.banner(t(U.questDone), r.quest ? t(r.quest.text) : '', '#63c74d', 2.4), 1300); } G.save(); setTimeout(() => { if (r.pendingSkillPick > 0) skillPick(); }, 400); },
      onDeath: () => { S.lose(); setTimeout(() => runOver(), 1100); },
      onLevel: () => { if (Wd.W) A.FX.ev('level', { h: Wd.W.hero, level: G.run.level }); hudUpdate(); },
    };
    Wd.enter(r.floor, r.floorSeed, fresh ? null : r.rooms, hooks);
    r.rooms = Wd.saveRooms();
    buildControls(); pads(); applyLook(); fadeIn();
    S.music(A.Draw.themeOf(r.floor));
    const th = A.Draw.THEMES[A.Draw.themeOf(r.floor)];
    A.FX.banner(t(U.floor) + ' ' + r.floor, th ? t(th.name) : '', '#fee761', 2.6);
    if (fresh && r.floor === 1) { const coarse = matchMedia('(pointer: coarse)').matches; Wd.W.hint = coarse ? L('Links laufen, rechts schlagen', 'Left: move, right: attack') : L('WASD laufen · Leertaste schlagen · 1-3 Fähigkeiten', 'WASD move · Space attack · 1-3 skills'); setTimeout(() => { if (Wd.W && !Wd.W.active) Wd.W.hint = ''; }, 7000); }
    if (!last) { last = performance.now(); requestAnimationFrame(loop); }
  }
  function loop(now) {
    requestAnimationFrame(loop);
    const raw = Math.max(0, (now - last) / 1000); const dt = Math.min(0.05, raw); last = now;
    if (!dungeonEl.classList.contains('on') || !Wd.W) return;
    const inp = input.read();
    const sdt = A.FX.simDt(dt);
    if (sdt > 0) Wd.step(sdt, inp);
    A.FX.update(sdt);
    if (G.run) G.run.rooms = Wd.saveRooms();
    const dr = activeDraw(); if (dr !== draw) { dr.topPad = draw.topPad; dr.botPad = draw.botPad; }
    dr.draw(Wd.W, dt);
    controlsTick();
    hudT += dt; if (hudT > 0.1) { hudT = 0; hudUpdate(); }
    joyHint.classList.toggle('hide', !!input.joy.on);
    // Bildrate beobachten: kommt das Gerät nicht mit, wird die Darstellung einfacher (weniger Licht-Feinheiten, weniger Teilchen)
    if (dr.quality === 'hi' && !Wd.W.paused && raw < 0.25) {
      perf.n++; perf.sum += raw;
      if (perf.n >= 120) { if (perf.sum / perf.n > 0.026) { dr.quality = 'lo'; A.FX.low = true; } perf.n = 0; perf.sum = 0; }
    }
  }
  // Freie Fläche fürs Bild: oben die Anzeige, unten die Knöpfe, wenn sie die Bildmitte verdecken (Handy hochkant)
  function pads() {
    draw.topPad = hud.offsetHeight || 60;
    const c = $('#controls').getBoundingClientRect();
    draw.botPad = c.height && c.left < innerWidth * 0.62 ? Math.max(0, innerHeight - c.top) : 0;
  }
  window.addEventListener('resize', () => { if (document.body.classList.contains('play')) pads(); });
  // Knöpfe am Rand
  let ctl = null;
  function buildControls() {
    const r = G.run;
    const sk = r.active.filter(Boolean);
    $('#controls').innerHTML = `<div id="btnGrid">
      ${sk.map((id, i) => `<button class="cbtn sk" data-sk="${i}" style="grid-column:${4 - sk.length + i + 1 > 4 ? 4 : 4 - sk.length + i + 1}" aria-label="${esc(t(A.SKILLS[id].name))}"><span class="ring"></span>${skIcon(id, 36)}<span class="key">${i + 1}</span></button>`).join('')}
      <button class="cbtn use" id="bUse" style="display:none"></button>
      <button class="cbtn pot" id="bPotion" aria-label="${esc(t(U.potion))}">${ic('potion', 33)}<span class="n"></span><span class="key">Q</span></button>
      <button class="cbtn atk" id="bAtk" aria-label="${L('Schlagen', 'Attack')}">${ic(WEAPON_ICON[r.cls] || 'i_schwert', 54)}<span class="key">${L('Leertaste', 'Space')}</span></button>
    </div>`;
    ctl = { atk: $('#bAtk'), use: $('#bUse'), pot: $('#bPotion'), sk: Array.from(document.querySelectorAll('#controls .sk')), useKind: null, cd: [] };
    input.bindAttack(ctl.atk);
    ctl.sk.forEach(b => b.addEventListener('pointerdown', (e) => { e.preventDefault(); if (Wd.useSkill(+b.dataset.sk)) S.click(); }));
    ctl.pot.addEventListener('pointerdown', (e) => { e.preventDefault(); if (Wd.usePotion()) hudUpdate(); });
    ctl.use.addEventListener('pointerdown', (e) => { e.preventDefault(); Wd.interact(); });
  }
  function controlsTick() {
    if (!ctl || !Wd.W) return;
    const h = Wd.W.hero, r = G.run;
    ctl.sk.forEach((b, i) => {
      const id = h.skills[i]; if (!id) return;
      const cd = Math.max(0, (h.cds[id] || 0) - Wd.W.t); const tot = A.SKILLS[id].cd * 2; const cold = cd > 0;
      if (ctl.cd[i] && !cold) { b.classList.remove('ready'); void b.offsetWidth; b.classList.add('ready'); }
      if (ctl.cd[i] !== cold) { ctl.cd[i] = cold; b.classList.toggle('cold', cold); }
      const p = (cd / tot * 100).toFixed(1) + '%'; if (b._p !== p) { b._p = p; b.firstChild.style.setProperty('--p', p); }
    });
    const n = String(r.potions); const nEl = ctl.pot.querySelector('.n'); if (nEl.textContent !== n) { nEl.textContent = n; ctl.pot.classList.toggle('cold', r.potions <= 0); }
    const k = Wd.W.near ? Wd.W.near.kind : '';
    if (ctl.useKind !== k) { ctl.useKind = k; ctl.use.style.display = k ? '' : 'none'; if (k) ctl.use.innerHTML = ic(PROP_ICON[k] || 'u_hand', 33) + '<span class="key">E</span>'; }
  }
  input.onKey = (code, e) => {
    if (!dungeonEl.classList.contains('on')) return;
    if (overlay.classList.contains('on')) { if (code === 'Escape' || code === 'KeyI' || code === 'Tab') { const b = $('#bClose'); if (b) b.click(); e.preventDefault(); } return; }
    if (code === 'Digit1' || code === 'Digit2' || code === 'Digit3') { if (Wd.useSkill(+code.slice(-1) - 1)) S.click(); }
    if (code === 'KeyQ') { if (Wd.usePotion()) hudUpdate(); }
    if (code === 'KeyE' || code === 'Enter') Wd.interact();
    if (code === 'KeyL') { toggleLook(); A.FX.banner(L('Look', 'Look') + ': ' + (G.meta.look === '3d' ? '3D' : 'Retro'), null, '#fee761', 1.2); }
    if (code === 'KeyI' || code === 'Tab' || code === 'Escape') { e.preventDefault(); S.click(); showSheet(); }
    if (code === 'Space') e.preventDefault();
  };
  // Gefundenes Item
  function foundItem(it) {
    const cur = slotCurrent(it);
    ov(`<div class="bigicon" style="filter:drop-shadow(0 0 16px ${rarCol(it.rarity)})">${itIcon(it, 72)}</div>
      <h2 class="mid">${L('Gefunden', 'Found')}</h2>${itemHtml(it, null, cur)}
      <button class="btn primary" id="bEq">${t(U.equip)}${cur ? `<span class="mini" style="color:inherit;opacity:0.8">(${L('ersetzt', 'replaces')} ${esc(G.itemName(cur))})</span>` : ''}</button>
      <button class="btn" id="bBag">${ic('u_bag', 22)}${t(U.bag)}</button>
      <button class="btn" id="bClose">${t(U.sell)} ${coin(G.sellValue(it))}</button>`);
    $('#bEq').onclick = () => { G.addToBag(it); G.equip(it); S.buy(); ovClose(); };
    $('#bBag').onclick = () => { G.addToBag(it); S.click(); ovClose(); };
    $('#bClose').onclick = () => { G.run.gold += G.sellValue(it); G.save(); S.buy(); ovClose(); };
  }
  // Dinge im Raum
  function useProp(p) {
    const r = G.run;
    if (p.kind === 'stairs') {
      const nt = A.Draw.THEMES[A.Draw.themeOf(r.floor + 1)];
      ov(`<div class="center"><div class="bigicon">${ic('u_down', 60)}</div><h2 class="mid">${t(U.floor)} ${r.floor + 1}</h2><div class="sub">${nt ? `<b class="goldc">${esc(t(nt.name))}</b><br>` : ''}${L('Neue Schicht, neue Gegner, neue Aufgabe.', 'New layer, new enemies, new quest.')}</div><button class="btn primary" id="bOk">${t(U.descend)}</button><button class="btn" id="bClose">${t(U.back)}</button></div>`);
      $('#bOk').onclick = () => { S.descend(); overlay.classList.remove('on'); overlay.innerHTML = ''; if (Wd.W) Wd.W.sinkT = draw.t; fadeOut(() => { const res = G.descend(); if (res === 'won') { runOver(); return; } Portal.showAd(() => dungeon(true)); }, 220); };
      $('#bClose').onclick = () => { S.click(); ovClose(); };
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
    const race = A.RACES.find(x => x.id === r.race), cls = A.CLASSES.find(x => x.id === r.cls);
    const head = `<div class="sheethead"><img class="px" src="${Art.heroUrl(r.race, r.cls, 3)}" width="54" height="54" alt=""><div><div class="nm">${esc(t(cls.name))}</div><div class="mini">${esc(t(race.name))} · ${t(U.level)} ${r.level} · ${t(U.floor)} ${r.floor}</div></div></div>`;
    const statsHtml = ['str', 'tou', 'dex', 'mind', 'luck'].map(k => `<div class="stat"><span>${ic(STAT_ICON[k], 22)}${t(U.stat[k])}</span><span><b>${r.stats[k]}</b>${r.points > 0 ? `<button data-sp="${k}" aria-label="+">+</button>` : ''}</span></div>`).join('');
    const kv = `<div class="kv" style="margin-top:12px"><span>${t(U.hp)} <b>${d.maxHp}</b></span><span>${t(U.derived.atk)} <b>${d.atk}</b></span><span>${t(U.derived.mag)} <b>${d.mag}</b></span><span>${t(U.derived.def)} <b>${d.def}</b></span><span>${t(U.derived.spd)} <b>${d.spd}</b></span><span>${t(U.derived.crit)} <b>${d.crit} %</b></span><span>${t(U.derived.dodge)} <b>${d.dodge} %</b></span><span>${t(U.xp)} <b>${r.xp}/${G.xpNeed(r.level)}</b></span></div>`;
    const quest = r.quest ? `<div class="q">${ic('u_scroll', 22)}<span><b>${t(U.quest)}:</b> ${esc(t(r.quest.text))} <b class="${r.questDone ? 'up' : 'goldc'}">${r.questDone ? L('erfüllt', 'done') : Math.min(r.questProg || 0, r.quest.n) + '/' + r.quest.n}</b></span></div>` : '';
    const gear = A.SLOTS.map(s => { const it = r.gear[s]; return it ? itemHtml(it) : emptySlot(s); }).join('');
    const bag = r.bag.length ? r.bag.map(it => itemHtml(it, `<button class="primary" data-eq="${it.uid}">${t(U.equip)}</button><button data-sell="${it.uid}">${coin(G.sellValue(it))}</button>`, slotCurrent(it))).join('') : `<div class="mini">${L('Leer.', 'Empty.')}</div>`;
    const skills = r.known.map(id => { const sk = A.SKILLS[id]; const on = r.active.includes(id); return `<div class="skill ${on ? 'on' : ''}" data-sk="${id}"><div class="si">${skIcon(id, 36)}</div><div><div class="nm">${t(sk.name)}</div><div class="ds">${t(sk.desc)}</div></div><div class="cd">${on ? `<b class="goldc">${L('aktiv', 'active')}</b><br>` : ''}${sk.cd * 2} s</div></div>`; }).join('');
    const content = tab === 'stats' ? `${quest}${r.points > 0 ? `<div class="q">${ic('u_star', 22)}<span><b class="goldc">${r.points}</b> ${t(U.points)}</span></div>` : ''}${statsHtml}${kv}` :
      tab === 'gear' ? `${gear}<h3>${t(U.bag)} (${r.bag.length}/8)</h3>${bag}${r.potions > 0 ? `<button class="btn" id="bPot">${ic('potion', 22)}${t(U.usePotion)}</button>` : ''}` :
      `<div class="mini" style="margin-bottom:8px">${L(`Bis zu ${d.skillSlots} aktiv, auf den Knöpfen 1 bis ${d.skillSlots}. Antippen zum Wechseln.`, `Up to ${d.skillSlots} active, on buttons 1 to ${d.skillSlots}. Tap to switch.`)}</div>${skills}`;
    ov(`${head}<div class="tabs"><button data-tab="stats" class="${tab === 'stats' ? 'on' : ''}">${t(U.stats)}</button><button data-tab="gear" class="${tab === 'gear' ? 'on' : ''}">${t(U.items)}</button><button data-tab="skills" class="${tab === 'skills' ? 'on' : ''}">${t(U.skills)}</button></div>${content}<button class="btn" id="bClose">${t(U.back)}</button>`);
    overlay.querySelectorAll('[data-tab]').forEach(b => b.onclick = () => { S.click(); showSheet(b.dataset.tab); });
    overlay.querySelectorAll('[data-sp]').forEach(b => b.onclick = () => { G.spend(b.dataset.sp); S.click(); showSheet('stats'); });
    overlay.querySelectorAll('[data-eq]').forEach(b => b.onclick = () => { G.equip(r.bag.find(x => x.uid === b.dataset.eq)); S.buy(); showSheet('gear'); });
    overlay.querySelectorAll('[data-sell]').forEach(b => b.onclick = () => { G.sell(r.bag.find(x => x.uid === b.dataset.sell)); S.buy(); showSheet('gear'); });
    overlay.querySelectorAll('[data-sk]').forEach(el => el.onclick = () => { const id = el.dataset.sk; let a = r.active.slice(); if (a.includes(id)) a = a.filter(x => x !== id); else if (a.length < d.skillSlots) a.push(id); else return; G.setActive(a); S.click(); showSheet('skills'); });
    const bp = $('#bPot'); if (bp) bp.onclick = () => { G.usePotion(); if (Wd.W) Wd.W.hero.hp = r.hp; S.potion(); showSheet('gear'); };
    $('#bClose').onclick = () => { S.click(); ovClose(); buildControls(); if (r.pendingSkillPick > 0) skillPick(); };
  }
  function skillPick() {
    const r = G.run; const offer = G.skillOffer();
    if (!offer.length) { r.pendingSkillPick = 0; G.save(); return; }
    S.level();
    ov(`<h2>${ic('u_scroll', 30)}${t(U.newSkill)}</h2>${offer.map(id => { const sk = A.SKILLS[id]; return `<div class="skill" data-pick="${id}"><div class="si">${skIcon(id, 36)}</div><div><div class="nm">${t(sk.name)}</div><div class="ds">${t(sk.desc)}</div></div><div class="cd">${sk.cd * 2} s</div></div>`; }).join('')}`);
    overlay.querySelectorAll('[data-pick]').forEach(el => el.onclick = () => { G.learnSkill(el.dataset.pick); S.buy(); if (r.pendingSkillPick > 0) skillPick(); else { ovClose(); buildControls(); } });
  }

  // ---------- Räume ----------
  function rest() {
    ov(`<div class="bigicon">${ic('flame', 60)}</div><h2 class="mid">${t(U.node.rest)}</h2><div class="sub center">${L('Ein Feuer. Endlich. Niemand will dich fressen. Vorerst.', 'A fire. Finally. Nothing wants to eat you. For now.')}</div>
      <button class="btn primary" id="bHeal">${ic('u_heart', 22)}${t(U.heal)}</button><button class="btn" id="bTrain">${ic('u_star', 22)}${t(U.train)}</button>`);
    $('#bHeal').onclick = () => { G.doRest('heal'); Wd.W.hero.hp = G.run.hp; S.heal(); ovClose(); };
    $('#bTrain').onclick = () => { G.doRest('train'); S.buy(); ovClose(); };
  }
  function eventScreen() {
    const r = G.run, ev = r.currentEvent;
    ov(`<div class="bigicon">${ic('statue', 51)}</div><h2 class="mid">${t(ev.title)}</h2><div class="msg">${t(ev.text)}</div>${ev.choices.map((c, i) => `<button class="btn ${i === 0 ? 'primary' : ''}" data-c="${i}" ${c.needItem && !r.bag.length ? 'disabled' : ''}>${t(c.text)}</button>`).join('')}`);
    overlay.querySelectorAll('[data-c]').forEach(b => b.onclick = () => { const res = G.doEvent(+b.dataset.c); S.click(); r.currentEvent = null; Wd.W.hero.hp = r.hp; hudUpdate();
      ov(`<h2 class="mid">${t(ev.title)}</h2><div class="msg">${esc(res.msg)}</div>${res.items.map(it => itemHtml(it)).join('')}<button class="btn primary" id="bClose">${t(U.leave)}</button>`);
      $('#bClose').onclick = () => { S.click(); ovClose(); }; });
  }
  function shop() {
    const r = G.run;
    const items = r.shopItems.map((s, i) => s ? itemHtml(s.it, `<button class="${r.gold >= s.price ? 'primary' : ''}" data-buy="${i}" ${r.gold >= s.price ? '' : 'disabled'}>${t(U.buy)} ${coin(s.price)}</button>`, slotCurrent(s.it)) : '').join('');
    const bag = r.bag.map(it => itemHtml(it, `<button data-sell="${it.uid}">${t(U.sell)} ${coin(G.sellValue(it))}</button>`)).join('');
    const pp = G.potionPrice(), canPot = r.gold >= pp;
    ov(`<div class="bigicon">${A.Art.img('merchant', 64)}</div><h2 class="mid">${t(U.node.shop)}</h2><div class="sub center">${L('«Alles frisch. Fast alles. Keine Rückgabe.»', '"All fresh. Mostly. No returns."')}<br>${L('Dein Gold', 'Your gold')}: <b class="goldc">${coin(r.gold)}</b></div>${items}
      <div class="item" style="--rc:#e43b44"><div class="ic">${ic('potion', 36)}</div><div class="bd"><div class="nm">${t(U.potion)}</div><div class="ln">+40 % ${t(U.hp)}</div></div><div class="act"><button class="${canPot ? 'primary' : ''}" id="bPot" ${canPot ? '' : 'disabled'}>${t(U.buy)} ${coin(pp)}</button></div></div>
      ${bag ? `<h3>${t(U.bag)}</h3>${bag}` : ''}<button class="btn primary" id="bClose">${t(U.leave)}</button>`);
    overlay.querySelectorAll('[data-buy]').forEach(b => b.onclick = () => { if (G.buy(+b.dataset.buy)) { S.buy(); shop(); } });
    overlay.querySelectorAll('[data-sell]').forEach(b => b.onclick = () => { G.sell(r.bag.find(x => x.uid === b.dataset.sell)); S.buy(); shop(); });
    $('#bPot').onclick = () => { if (G.buyPotion()) { S.buy(); shop(); } };
    $('#bClose').onclick = () => { S.click(); ovClose(); };
  }
  function treasure() {
    const res = G.treasure();
    for (const it of res.items) G.addToBag(it);
    S.loot(res.items.some(it => it.rarity === 'legendary' || it.rarity === 'epic') ? 'epic' : 'rare');
    ov(`<div class="bigicon">${ic('chest', 72)}</div><h2 class="mid">${t(U.node.treasure)}</h2><div class="msg">${L('Eine Truhe. Unverschlossen. Verdächtig.', 'A chest. Unlocked. Suspicious.')} <b class="goldc">+${coin(res.gold)}</b></div>${res.items.map(it => itemHtml(it)).join('')}<div class="mini">${L('Liegt im Beutel. Anlegen über das Heldenbild oben links.', 'Now in your bag. Equip via the hero picture top left.')}</div><button class="btn primary" id="bClose">${t(U.leave)}</button>`);
    $('#bClose').onclick = () => { S.click(); ovClose(); };
  }

  // ---------- Ende ----------
  function runOver() {
    const r = G.run;
    if (!r.over) { r.over = true; G.finishRun(); }
    Portal.gameplayStop();
    overlay.classList.remove('on'); overlay.innerHTML = '';
    const won = r.won;
    show(`<div class="center fade-in" style="padding-top:5vh">
      <div class="bigicon">${won ? ic('crown', 63) : ic('u_skull', 60)}</div>
      <h2 class="mid">${won ? t(U.victory) : t(U.runOver)}</h2>
      ${won ? `<div class="msg">${t(U.win)} ${t(U.blocked)}</div>` : `<div class="sub">${t(U.dead)} ${r.floor}.</div>`}
      <div class="result"><div>${t(U.reached)}<b>${r.floor}</b></div><div>${t(U.level)}<b>${r.level}</b></div><div>${t(U.kills)}<b>${r.kills}</b></div><div>${t(U.gold)}<b>${r.gold}</b></div></div>
      <div class="big">${spark('+' + r.sparksEarned, 40)}</div><div class="mini">${t(U.sparksEarned)}</div>
      <button class="btn primary" id="bCamp" style="margin-top:16px">${ic('u_tent', 28)}${t(U.toCamp)}</button></div>`);
    $('#bCamp').onclick = () => { S.click(); G.clearRun(); Portal.showAd(() => camp()); };
  }

  // ---------- Start ----------
  document.addEventListener('visibilitychange', () => { if (document.hidden && G.run) G.save(); });
  window.__abstieg = { G, Wd, title, dungeon, draw, get draw3() { return draw3; }, toggleLook, get overlay() { return overlay; }, screens: { heroSelect, camp, showSheet, skillPick, shop, rest, eventScreen, treasure, runOver, useProp } };
  title();
})();
