// Der Abstieg – Oberfläche: Titelbild, Heldenwahl, Lager, Anzeige oben, Knöpfe, Fenster und die Ebene in Echtzeit
'use strict';
window.A = window.A || {};

(function () {
  const G = A.Game, t = A.t, U = A.UI, Art = A.Art, S = A.Sound;
  const $ = (s) => document.querySelector(s);
  const screen = $('#screen'), hud = $('#hud'), overlay = $('#overlay'), dungeonEl = $('#dungeon'), bgCv = $('#bg'), joyHint = $('#joyHint');
  const draw = new A.Draw($('#arena'));
  const Wd = A.World;
  A.Achieve.bind({ overlayOpen: () => overlay.classList.contains('on') });   // Erfolge erst einblenden, wenn kein Fenster offen ist
  const de = A.LANG === 'de', L = (d, e) => de ? d : e;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const ic = (name, size, cls) => Art.img(name, size || 16, null, null, cls);
  const coin = (n) => `${ic('coin', 16, 'coin')}<span>${n}</span>`;
  const spark = (n, size) => `<span class="sp">${ic('u_spark', size || 18)}<span>${n}</span></span>`;

  // Portal-Anbindung (Platzhalter; wird beim Einreichen ersetzt)
  const Portal = window.AbstiegPortal || { gameplayStart() {}, gameplayStop() {}, happytime() {}, showAd(cb) { cb(); }, showRewardedAd(cb) { cb(); } };

  // ---------- Symbole ----------
  const WEAPON_ICON = { klinge: 'i_schwert', schuetze: 'i_bogen', weber: 'i_stab', rufer: 's_skel', brau: 's_wonder' };
  const SKILL_ICON = { hieb: 's_strike', rache: 's_strike', wirbel: 's_whirl', schild: 's_shield', gewebe: 's_shield', kampfschrei: 's_buff', rueckzug: 's_buff', hinrichtung: 'u_skull', zielschuss: 's_arrow', pfeilregen: 's_arrow', doppelschuss: 's_arrow', kopfschuss: 's_arrow', giftpfeil: 's_poison', funke: 's_bolt', flaeche: 's_nova', entladung: 's_nova', flicken: 's_heal', fesseln: 's_bind' };
  const PROP_ICON = { chest: 'chest', fire: 'flame', merchant: 'u_bag', statue: 'u_quest', stairs: 'u_down', shrine: 'u_star', forge: 'anvil', rubble: 'u_hand', cage: 'u_paw' };
  const STAT_ICON = { str: 'i_axt', tou: 'u_heart', dex: 's_arrow', mind: 's_bolt', luck: 'u_star' };
  const SLOT_ICON = { weapon: 'i_schwert', armor: 'i_leder', helm: 'i_kappe', boots: 'i_stiefel', trinket: 'i_ring', trinket2: 'i_amulett' };
  const skIcon = (id, size) => ic(SKILL_ICON[id] || A.Boons.icon(id) || 's_strike', size || 26);
  const cdTxt = (id) => (Math.round(A.Boons.cd(id) * 10) / 10) + ' s';
  const talIcon = (id, size) => ic(A.TALENTS[id].icon || 'u_star', size || 26);
  const itIcon = (it, size) => ic(Art.itemIcon(it), size || 36);   // Legenden haben ein eigenes Bild
  const petImg = (id, size) => ic(A.PETS[id].spr, size || 36);
  const petStars = (lv) => `<span class="stars">${'★'.repeat(lv)}${'☆'.repeat(5 - lv)}</span>`;
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
  // Urteil aus dem Vergleich (compare.js): Abzeichen an Stücken im Beutel, beim Händler und in Truhen (bei zwei Schmuck-Plätzen zählt der bessere Tausch)
  const VERD = { better: { de: 'Besser', en: 'Better' }, worse: { de: 'Schlechter', en: 'Worse' }, mixed: { de: 'Anders', en: 'Different' }, same: { de: 'Gleich', en: 'Same' } };
  function vChip(it) {
    if (A.SLOTS.some(s => G.run.gear[s] === it)) return `<span class="vchip worn">${L('Angelegt', 'Equipped')}</span>`;
    const c = A.Compare.all(it)[0];
    return `<span class="vchip ${c.verdict}">${t(VERD[c.verdict])}</span>`;
  }
  // Element-Abzeichen und besondere Kraft (gear.js)
  // Dein Build: kleines Zeichen an Stücken, die passen oder einer Kombo das letzte Element bringen (nicht an angelegten)
  function fitChip(it) { const r = G.run; if (!r || A.SLOTS.some(s => r.gear[s] === it)) return ''; const f = A.Build.fits(it, r); return f ? `<span class="vchip ${f.kind === 'combo' ? 'combo' : 'fit'}">${f.kind === 'combo' ? L('Kombo-Teil', 'Combo part') : L('Passt', 'Fits')}</span> ` : ''; }
  function elBadge(el) { const E = A.ELEMENTS[el]; return E ? `<span class="elb" style="--ec:${E.col}">${ic(E.icon, 14)}${esc(t(E.name))}</span>` : ''; }
  function powerHtml(p, n) { const P = p && A.POWERS[p.id]; return P ? `<div class="pw">${ic('u_spark', 14)}<span><b>${esc(t(P.name))}${n > 1 ? ` ×${n}` : ''}:</b> ${esc(A.Gear.powerText(p))}</span></div>` : ''; }   // n: auf so vielen Stücken (sie stapeln)
  // Legende (legends.js): ihr Effekt steht gross und golden unter den Werten
  function legHtml(it) { const Lg = it.legend && A.LEGENDS[it.legend]; return Lg ? `<div class="lg">${ic('u_star', 14)}<span><b>${L('Legende', 'Legend')}:</b> ${esc(t(Lg.text))}</span></div>` : ''; }
  // erste Legende ihrer Art: kommt in die Sammlung im Lager
  function legNewHtml(lg) { return lg && lg.first ? `<div class="msg legnew">${ic('u_star', 18)}<span>${L(`<b>Neu in der Legenden-Sammlung</b> (${lg.n}/${Object.keys(A.LEGENDS).length}): +${lg.sparks} Seelenfunken und für immer +${Math.round(A.LEGEND_DMG * 100)} % Schaden.`, `<b>New in the legend collection</b> (${lg.n}/${Object.keys(A.LEGENDS).length}): +${lg.sparks} soul sparks and +${Math.round(A.LEGEND_DMG * 100)}% damage, forever.`)}</span></div>` : ''; }
  // Kombos (combos.js): zwei Teile als Symbol; Karte mit Zustand, Name, Wirkung (extra: Spruch, Rezept, was fehlt)
  function cbIcon(id, size) { const n = A.COMBOS[id].need; return `<span class="cbi">${ic(A.Combos.partIcon(n[0]), size)}<i>+</i>${ic(A.Combos.partIcon(n[1]), size)}</span>`; }
  function comboCard(id, tag, cls, size, extra) {
    const Cb = A.COMBOS[id];
    return `<div class="skill combo ${cls || ''}" style="--cc:${Cb.col}"><div class="si">${cbIcon(id, size || 26)}</div><div><div class="tg combo">${tag}</div><div class="nm">${esc(t(Cb.name))}</div><div class="ds">${esc(t(Cb.text))}</div>${extra || ''}</div></div>`;
  }
  // Was ändert sich an den Element-Boni, wenn it angelegt wird und old wegfällt?
  function elDelta(it, old) {
    const c = A.Gear.counts(G.run), n = Object.assign({}, c), out = [];
    if (old && old.el) n[old.el] = (n[old.el] || 0) - 1;
    if (it.el) n[it.el] = (n[it.el] || 0) + 1;
    for (const el of Object.keys(A.ELEMENTS)) {
      const E = A.ELEMENTS[el], a = A.Gear.tierOf(c[el] || 0), b = A.Gear.tierOf(n[el] || 0);
      const nm = `${ic(E.icon, 14)}<span><b style="color:${E.col}">${esc(t(E.name))} ${n[el] || 0}/6</b> `;
      if (b > a) out.push(`<div class="eld up">${nm}${L('Neuer Bonus', 'New bonus')}: ${esc(t(E.tiers[b - 1]))}</span></div>`);
      else if (b < a) out.push(`<div class="eld down">${nm}${L('Bonus weg', 'Bonus lost')}: ${esc(t(E.tiers[a - 1]))}</span></div>`);
      else if (el === it.el && b < 3) out.push(`<div class="eld">${nm}${L(`Bei ${A.EL_TIERS[b]} Teilen`, `At ${A.EL_TIERS[b]} pieces`)}: ${esc(t(E.tiers[b]))}</span></div>`);
    }
    return out.join('');
  }
  // badge: Urteil-Abzeichen (vChip); attrs: z. B. data-cmp, damit Antippen den Vergleich öffnet
  function itemHtml(it, actions, badge, cls, attrs, noFit) {
    const lines = G.itemLines(it);
    return `<div class="item ${it.legend ? 'leg' : ''} ${cls || ''}" style="--rc:${rarCol(it.rarity)}" ${attrs || ''}>
      <div class="ic">${itIcon(it, 36)}</div>
      <div class="bd">
        <div class="slotlbl">${t(U.slot[it.slot === 'trinket2' ? 'trinket' : it.slot])} · ${t(U.rarity[it.rarity])} ${elBadge(it.el)} ${noFit ? '' : fitChip(it)}${badge || ''}</div>
        <div class="nm">${esc(G.itemName(it))}</div>
        <div class="ln">${lines.map(esc).join(' · ')}</div>
        ${powerHtml(it.power)}${legHtml(it)}
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
    if (!(opts && opts.camp)) A.Scenes.camp(null);
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
  // eigene Sicherheitsfrage im Spiel (confirm() ist in eingebetteten Seiten oft gesperrt)
  function ask(text, yes, onYes) {
    ov(`<div class="center"><h2 class="mid">${esc(text)}</h2><button class="btn primary" id="bYes">${esc(yes)}</button><button class="btn" id="bClose">${t(U.back)}</button></div>`);
    $('#bYes').onclick = () => { S.click(); ovClose(); onYes(); };
    $('#bClose').onclick = () => { S.click(); ovClose(); };
  }
  function ovClose() { overlay.classList.remove('on'); overlay.innerHTML = ''; if (dungeonEl.classList.contains('on')) { Wd.pause(false); Wd.refreshHero(); comboNews(); } hudUpdate(); }

  // ---------- Titel ----------
  // Überblenden: schwarz werden (fadeOut) und wieder aufhellen (fadeIn), für Ebenen-Wechsel
  const fadeEl = $('#fade');
  function fadeIn() { if (!fadeEl) return; fadeEl.style.transition = 'none'; fadeEl.style.opacity = '1'; requestAnimationFrame(() => requestAnimationFrame(() => { fadeEl.style.transition = 'opacity .7s'; fadeEl.style.opacity = '0'; })); }
  function fadeOut(cb, delay) { const dl = delay || 0; if (!fadeEl) { setTimeout(cb, dl); return; } fadeEl.style.transition = `opacity .3s ${dl / 1000}s`; fadeEl.style.opacity = '1'; setTimeout(cb, 330 + dl); }
  function title() {
    S.music(null);
    const m = G.meta, r = G.load();
    A.Achieve.check(true);   // Erfolge, die schon erreicht sind (nach dem Update: alte Zähler zählen gleich); still, ohne Einblendung
    const words = t(U.title).split(' ');
    show(`<div class="title-wrap fade-in">
      <div class="topbar"><button class="iconbtn" id="bSound" aria-label="${esc(t(U.sound))}">${ic(m.sound ? 'u_sound' : 'u_mute', 22)}</button></div>
      <div class="logo">${words.length > 1 ? `<div class="pre">${esc(words[0])}</div>` : ''}<h1>${esc(words.slice(words.length > 1 ? 1 : 0).join(' '))}</h1></div>
      <div class="tag">${esc(t(U.tagline))}</div>
      <div class="menu">
        ${r ? `<button class="btn primary" id="bCont">${t(U.continueRun)} · ${t(U.floor)} ${r.floor}</button>` : ''}
        <button class="btn ${r ? '' : 'primary'}" id="bNew">${t(U.play)}</button>
        <button class="btn" id="bCamp">${ic('u_tent', 28)}<span>${t(U.camp)}</span>${spark(m.sparks)}${G.campAffordable() || A.Pets.tripsBack() ? `<i class="dot" title="${L('Im Lager wartet etwas', 'Something waits in the camp')}"></i>` : ''}</button>
        <div class="stats">${L('Durchläufe', 'Runs')} <b>${m.runs}</b> · ${L('Tiefste Ebene', 'Deepest floor')} <b>${m.best}</b> · ${L('Erfolge', 'Achievements')} <b>${A.Achieve.count()}/${A.ACHIEVEMENTS.length}</b>${m.achNew && m.achNew.length ? ` <b class="goldc">${L('Neu!', 'New!')}</b>` : ''}</div>
        <div class="howto pc">${t(U.howto)}</div>
        <button class="link" id="bReset">${t(U.reset)}</button>
      </div>
    </div>`, { title: true });
    if (r) $('#bCont').onclick = () => { S.click(); resume(); };
    $('#bNew').onclick = () => { S.click(); if (r) ask(L('Laufenden Durchlauf aufgeben?', 'Abandon the current run?'), L('Aufgeben', 'Abandon'), () => { G.abandonRun(); heroSelect(); }); else heroSelect(); };
    $('#bCamp').onclick = () => { S.click(); camp(); };
    $('#bSound').onclick = () => { G.meta.sound = !G.meta.sound; G.saveMeta(); S.click(); if (!G.meta.sound) S.music(null); title(); };
    $('#bReset').onclick = () => { S.click(); ask(L('Wirklich alles löschen? Auch die Seelenfunken.', 'Really delete everything? Including soul sparks.'), L('Alles löschen', 'Delete everything'), () => { G.resetAll(); title(); }); };
  }

  // ---------- Grad: was gilt (Regel des Grads, die Namen der Regeln davor, mehr Leben und Schaden, mehr Funken) ----------
  let selGrade = null;
  function gradeText(g) {
    if (!g) return `<b>${L('Normal', 'Normal')}:</b> ${L('Ohne Grad. So wie immer.', 'No grade. Business as usual.')}`;
    const R = A.GRADES[g - 1], before = A.GRADES.slice(0, g - 1).map(x => t(x.name)), pc = (v) => Math.round(v * 100);
    return `<b>${L('Grad', 'Grade')} ${g}: ${esc(t(R.name))}.</b> ${esc(t(R.text))}`
      + (before.length ? ` <span class="mini">${L('Dazu gilt weiter', 'Still in force')}: ${esc(before.join(' · '))}.</span>` : '')
      + `<br><span class="mini">${L(`Alle Gegner +${pc(A.GRADE_HP * g)} % Leben und +${pc(A.GRADE_ATK * g)} % Schaden.`, `All enemies +${pc(A.GRADE_HP * g)}% health and +${pc(A.GRADE_ATK * g)}% damage.`)}</span> ${spark('+' + pc(A.GRADE_SPARKS * g) + ' %', 12)}`;
  }

  // ---------- Held wählen ----------
  function heroSelect() {
    const races = A.RACES.map(r => { const ok = G.raceUnlocked(r); return `<button class="chip" data-race="${r.id}" aria-label="${esc(t(r.name))}">${ok ? '' : `<span class="cost">${spark(r.unlock, 11)}</span>`}<img class="px hero" src="${Art.heroUrl(r.id, selCls, 2)}" width="36" height="36" alt=""></button>`; }).join('');
    const classes = A.CLASSES.map(c => { const ok = G.classUnlocked(c), gw = G.gradeWon(c.id); return `<button class="chip" data-cls="${c.id}" aria-label="${esc(t(c.name))}">${ok ? '' : `<span class="lock">${L('bald', 'soon')}</span>`}${gw != null ? `<span class="crown" title="${esc(gw ? L('Grad ' + gw + ' geschafft', 'Grade ' + gw + ' done') : L('Ausgang geschafft', 'Exit reached'))}">${ic('crown', 12)}${gw || ''}</span>` : ''}${ic(WEAPON_ICON[c.id] || 'i_schwert', 36)}</button>`; }).join('');   // Krone: Ausgang geschafft, Zahl = höchster geschaffter Grad
    show(`<div class="fade-in">
      <h2>${L('Wähle deinen Helden', 'Choose your hero')}</h2>
      <div class="stage"><canvas id="stage"></canvas><div class="who"><b id="whoName"></b><span id="whoSub"></span></div></div>
      <h3>${t(U.race)}</h3><div class="chips">${races}</div><div class="perk" id="racePerk"></div>
      <h3>${t(U.cls)}</h3><div class="chips">${classes}</div><div class="perk" id="clsPerk"></div>
      <div id="gradeBox"></div>
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
      gradeRow();
      A.Scenes.stage($('#stage'), selRace, selCls);
    };
    // Grade (v39): erst nach dem ersten Sieg mit dieser Klasse; jeder Grad bringt eine Regel dazu, die von davor gelten weiter
    const gradeRow = () => {
      const gm = G.gradeMax(selCls), box = $('#gradeBox'); if (!box) return;
      if (!gm) { box.innerHTML = ''; selGrade = 0; return; }
      if (selGrade == null || selGrade > gm) selGrade = G.gradePick(selCls);
      const chips = Array.from({ length: gm + 1 }, (_, g) => `<button class="chip gchip ${g === selGrade ? 'sel' : ''}" data-grade="${g}" aria-label="${esc(g ? L('Grad ' + g, 'Grade ' + g) : L('Normal', 'Normal'))}">${g ? ic('crown', 12) + g : L('Normal', 'Normal')}</button>`).join('');
      box.innerHTML = `<h3>${L('Grad', 'Grade')}</h3><div class="chips grades">${chips}</div><div class="perk" id="gradePerk">${gradeText(selGrade)}</div>`;
      box.querySelectorAll('[data-grade]').forEach(el => el.onclick = () => { const g = +el.dataset.grade; if (g === selGrade) return; selGrade = g; S.click(); gradeRow(); });
    };
    selGrade = null;
    screen.querySelectorAll('[data-race]').forEach(el => el.onclick = () => { const r = A.RACES.find(x => x.id === el.dataset.race); if (!G.raceUnlocked(r)) { S.click(); camp(); return; } if (selRace === r.id) return; selRace = r.id; S.click(); upd(); });
    screen.querySelectorAll('[data-cls]').forEach(el => el.onclick = () => { const c = A.CLASSES.find(x => x.id === el.dataset.cls); if (!G.classUnlocked(c)) { upd(c); return; } if (selCls === c.id) return; selCls = c.id; selGrade = null; S.click(); upd(); });
    $('#bStart').onclick = () => { S.buy(); A.Scenes.stage(null); G.newRun(selRace, selCls, G.gradeMax(selCls) ? selGrade : undefined); Portal.gameplayStart(); dungeon(true); };
    $('#bBack').onclick = () => { S.click(); title(); };
    upd();
  }

  // ---------- Lager ----------
  // Wirkung als kurzer Text, z. B. «+20 % Leben · +50 Gold zum Start»
  function fxText(e) {
    const out = [], p = (v) => Math.round(v * 100);
    if (e.hpMul) out.push(L(`+${p(e.hpMul)} % Leben`, `+${p(e.hpMul)}% health`));
    if (e.dmgMul) out.push(L(`+${p(e.dmgMul)} % Angriff und Zauberkraft`, `+${p(e.dmgMul)}% attack and magic`));
    if (e.startGold) out.push(L(`+${e.startGold} Gold zum Start`, `+${e.startGold} starting gold`));
    if (e.startPotion) out.push(L(`+${e.startPotion} ${e.startPotion > 1 ? 'Tränke' : 'Trank'} zum Start`, `+${e.startPotion} starting potion${e.startPotion > 1 ? 's' : ''}`));
    if (e.potionHeal) out.push(L(`Tränke heilen ${p(e.potionHeal)} % mehr`, `Potions heal ${p(e.potionHeal)}% more`));
    if (e.extraStartSkill) out.push(L('Start mit einem Zauber mehr', 'Start with one more spell'));
    if (e.cdr) out.push(L(`Zauber laden ${p(e.cdr)} % schneller`, `Spells recharge ${p(e.cdr)}% faster`));
    if (e.talentSlots) out.push(L('Ein Platz mehr für passive Segen', 'One more slot for passive blessings'));
    if (e.gearW) out.push(e.gearW >= 2 ? L('Startwaffe selten (blau)', 'Rare starting weapon (blue)') : L('Startwaffe gut (grün)', 'Good starting weapon (green)'));
    if (e.gearA) out.push(L('Startrüstung gut (grün)', 'Good starting armor (green)'));
    if (e.gearHB) out.push(L('Guter Helm und gute Stiefel zum Start', 'Good helm and boots at the start'));
    if (e.shopOff) out.push(L(`Händler ${p(e.shopOff)} % billiger`, `Merchants ${p(e.shopOff)}% cheaper`));
    if (e.itemLuck) out.push(L(`Bessere Beute (+${e.itemLuck} Glück)`, `Better loot (+${e.itemLuck} luck)`));
    if (e.startBoon) out.push(e.startBoon > 1 ? L(`Start mit ${e.startBoon} Segen vom Schrein`, `Start with ${e.startBoon} shrine blessings`) : L('Start mit einem Segen vom Schrein', 'Start with a shrine blessing'));
    if (e.def) out.push(L(`+${e.def} Rüstung`, `+${e.def} armor`));
    if (e.crit) out.push(L(`+${e.crit} % Volltreffer`, `+${e.crit}% crit`));
    if (e.thorns) out.push(L(`Angreifer erleiden ${e.thorns} % zurück`, `Attackers take ${e.thorns}% back`));
    if (e.petStart) out.push(e.petStart > 1 ? L(`${e.petStart} Begleiter kommen von Anfang an mit`, `${e.petStart} pets join from the start`) : L('Ein Begleiter kommt von Anfang an mit', 'One pet joins from the start'));
    if (e.petDmg) out.push(L(`Begleiter +${p(e.petDmg)} % Schaden`, `Pets +${p(e.petDmg)}% damage`));
    if (e.petXp) out.push(L(`Begleiter gewinnen ${p(e.petXp)} % schneller Treue`, `Pets gain loyalty ${p(e.petXp)}% faster`));
    if (e.petSlots) out.push(L(`${1 + e.petSlots} Begleiter gleichzeitig`, `${1 + e.petSlots} pets at once`));
    return out.join(' · ');
  }
  const sumFx = (list, n, mul) => { const o = {}; for (let i = 0; i < n; i++) for (const k in list[i]) o[k] = (o[k] || 0) + list[i][k] * (mul || 1); return o; };
  // Was die nächste Stufe bringt, als neuer Gesamtwert (z. B. «+25 % Leben» statt «+5 %»)
  const nextFx = (b, lv) => { const all = sumFx(b.lv, lv + 1), o = {}; for (const k in b.lv[lv]) o[k] = all[k]; return o; };
  const FOLK_CLS = { mensch: 'klinge', fels: 'brau', schatten: 'weber', pilz: 'rufer', kobold: 'schuetze' };   // so stehen die Völker im Lager am Feuer
  const monImg = (id, box) => { const s = A.Art.monSprite(id, 0), k = Math.max(1, Math.floor(box / Math.max(s.w, s.h))); return `<img class="px" src="${s.url || (s.url = s.img.toDataURL())}" width="${s.w * k}" height="${s.h * k}" alt="">`; };
  function campState() {
    const lv = {}, open = {}, can = {}, rank = G.campRank();
    for (const b of A.CAMP) { lv[b.id] = G.campLevel(b.id); open[b.id] = G.campOpen(b.id); const c = G.campCost(b.id); can[b.id] = open[b.id] && c != null && c <= G.meta.sparks; }
    return { lv, open, can, races: A.RACES.filter(r => G.raceUnlocked(r)).map(r => r.id), troph: Object.assign({}, G.meta.troph), rank, max: rank >= A.CAMP_MAX, pets: Object.keys(A.PETS).filter(id => A.Pets.found(id) && !(A.Pets.away(id) && !A.Pets.tripOf(id).done)),   /* wer noch auf Reise ist (v41), fehlt im Bild */ ach: A.Achieve.count(), achNew: !!(G.meta.achNew && G.meta.achNew.length) };
  }
  // poof: was gerade gebaut wurde (Funken im Bild); die Liste bleibt dabei an ihrer Stelle
  function camp(poof) {
    A.Achieve.check(true);   // z. B. Lager-Stufe 30 oder alte Zähler nach dem Update; still, ohne Einblendung
    const m = G.meta, rank = G.campRank(), keep = poof ? screen.scrollTop : 0;
    const next = A.CAMP.filter(b => !G.campOpen(b.id)).sort((a, b) => a.rank - b.rank)[0];
    const bld = A.CAMP.map(b => {
      const lv = G.campLevel(b.id), max = b.lv.length, open = G.campOpen(b.id), cost = G.campCost(b.id), can = open && cost != null && m.sparks >= cost;
      const right = !open ? `<span class="need">${L('ab Lager-Stufe', 'from camp level')} <b>${b.rank}</b></span>`
        : cost == null ? `<span class="need done">${L('Voll ausgebaut', 'Fully built')}</span>`
        : `<button class="btn small ${can ? 'primary' : ''}" data-up="${b.id}" ${can ? '' : 'disabled'}>${spark(cost)}</button>`;
      return `<div class="card upg bld ${!open ? 'locked' : cost == null ? 'have' : ''} ${poof === b.id ? 'just' : ''}">
        <div class="ic">${ic(b.icon, 30)}</div>
        <div class="bd"><div class="ttl"><span>${esc(t(b.name))}</span><span class="lvl">${L('Stufe', 'Level')} ${lv}/${max}</span></div>
          <div class="pips">${b.lv.map((_, i) => `<i class="${i < lv ? 'on' : ''}"></i>`).join('')}</div>
          <div class="txt">${lv ? `<b>${L('Jetzt', 'Now')}:</b> ${esc(fxText(sumFx(b.lv, lv)))}` : esc(t(b.info))}</div>
          ${lv < max ? `<div class="nx">${lv ? L('Nächste Stufe', 'Next level') : L('Bringt', 'Gives')}: ${esc(fxText(nextFx(b, lv)))}</div>` : ''}</div>
        ${right}</div>`;
    }).join('');
    const folks = A.META_SHOP.filter(u => u.effect.race).map(u => {
      const r = A.RACES.find(x => x.id === u.effect.race), have = m.unlocked.includes(u.id), can = !have && m.sparks >= u.cost;
      return `<div class="folk ${have ? 'have' : ''}"><img class="px" src="${Art.heroUrl(r.id, FOLK_CLS[r.id], 2)}" width="36" height="36" alt=""><b>${esc(t(r.name))}</b>
        ${have ? `<span class="need done">${L('Im Lager', 'In camp')}</span>` : `<button class="btn small ${can ? 'primary' : ''}" data-race="${u.id}" ${can ? '' : 'disabled'}>${spark(u.cost)}</button>`}</div>`;
    }).join('');
    const flags = Object.keys(A.BANNERS).map(id => {
      const n = Math.min(2, m.troph[id] || 0);
      return `<div class="flag ${n ? 'have' : ''} ${n >= 2 ? 'gold' : ''}"><div class="fi">${monImg(id, 34)}</div><div><b>${esc(t(A.BOSSES[id].name))}</b> <span class="stars">${'★'.repeat(n)}${'☆'.repeat(2 - n)}</span>
        <div class="mini">${esc(fxText(sumFx([A.BANNERS[id]], 1, Math.max(1, n))))}</div></div></div>`;
    }).join('');
    const pages = G.bookPages(), NT = Object.keys(A.ELITE_TRAITS).length;
    // Hauptleute (foes.js): je Welt einer; besiegte mit Masche und Zähler
    const capN = A.Foes.count(), capts = A.CAPTAINS.map(c => {
      const n = (m.capt || {})[c.id] || 0, wd = A.WORLDS.find(w => w.id === c.world);
      return `<div class="flag ${n ? 'have' : ''}"><div class="fi">${monImg(c.base, 34)}</div><div><b ${n ? `style="color:${c.col}"` : ''}>${esc(t(c.name))}</b>${n ? `<span class="cnt">${n}×</span>` : ''}
        <div class="mini">${esc(wd ? t(wd.name) : '')}${n ? ' · ' + esc(t(c.trick)) : ''}</div></div></div>`;
    }).join('');
    const book = Object.keys(A.ELITE_TRAITS).map(id => {
      const T = A.ELITE_TRAITS[id], n = m.efBook[id] || 0;
      return `<div class="page ${n ? 'have' : ''}"><div class="pi">${ic(T.icon, 27)}</div><div><b ${n ? `style="color:${T.col}"` : ''}>${esc(t(T.name))}</b>${n ? `<span class="cnt">${n}×</span>` : ''}
        <div class="mini">${n ? esc(t(T.text)) : L('Noch nie besiegt', 'Never defeated yet')}</div></div></div>`;
    }).join('');
    // Legenden-Sammlung: gefundene mit Bild, Name und Wirkung; unbekannte als Schatten mit Fundort
    const NL = Object.keys(A.LEGENDS).length, legs = G.legCount();
    const coll = Object.keys(A.LEGENDS).map(id => {
      const Lg = A.LEGENDS[id], n = m.legFound[id] || 0;
      return `<div class="page ${n ? 'have' : ''}"><div class="pi">${ic('i_' + Lg.ico, 27)}</div><div><b ${n ? 'class="goldc"' : ''}>${n ? esc(t(Lg.name)) : '???'}</b>${n ? `<span class="cnt">${n}×</span>` : ''}
        <div class="mini">${n ? esc(t(Lg.text)) : esc(A.Legends.hint(id))}</div></div></div>`;
    }).join('');
    // Begleiter: gefundene Tiere mit Treue, Fortschritt und Tricks; mit der Tierhütte kommen sie von Anfang an mit (antippen zum Wählen)
    const PN = Object.keys(A.PETS).length, pn = A.Pets.count(), sn = A.Pets.startN(), psel = A.Pets.sel();
    const petCards = Object.keys(A.PETS).map(id => {
      const P = A.PETS[id];
      if (!A.Pets.found(id)) return `<div class="petc"><div class="pp">${petImg(id, 40)}</div><div class="pb"><b>???</b><div class="mini">${L('Sitzt irgendwo in einem Käfig (ab Ebene 2).', 'Sits in a cage somewhere (from floor 2).')}</div></div></div>`;
      const lv = A.Pets.treue(id), pr = A.Pets.progress(id), on = psel.includes(id), aw = A.Pets.away(id);
      const tricks = A.Pets.tricks(id).map(x => `<div class="trick ${lv >= x.lv ? 'on' : ''}"><span>${'★'.repeat(x.lv)}</span> ${esc(x.text)}</div>`).join('');
      return `<div class="petc have ${on ? 'sel' : ''} ${aw ? 'away' : ''}" ${sn ? `data-pet="${id}"` : ''}><div class="pp">${petImg(id, 40)}</div><div class="pb"><div class="ttl"><b style="color:${P.col}">${esc(t(P.name))}</b>${petStars(lv)}</div>
        <div class="mini">${esc(t(P.kind))} · ${pr ? L(`Treue ${lv}: noch ${pr[1] - pr[0]} bis Treue ${lv + 1}`, `Loyalty ${lv}: ${pr[1] - pr[0]} more to loyalty ${lv + 1}`) : L('Treue 5: treuer geht nicht', 'Loyalty 5: as loyal as it gets')}</div>
        <div class="bar"><i style="width:${pr ? Math.round(pr[0] / pr[1] * 100) : 100}%"></i></div>${tricks}
        ${sn ? `<div class="mini pick">${aw ? L('Gerade auf Reise (oben bei den Expeditionen).', 'Away on a trip (see expeditions above).') : on ? `<b class="goldc">${L('Kommt mit in die Tiefe', 'Joins the descent')}</b>` : L('Antippen: kommt mit in die Tiefe', 'Tap: joins the descent')}</div>` : ''}</div></div>`;
    }).join('');
    const petInfo = sn ? L(`Die Tierhütte schickt ${sn > 1 ? sn + ' Tiere' : 'ein Tier'} von Anfang an mit.`, `The pet hut sends ${sn > 1 ? sn + ' pets' : 'one pet'} along from the start.`)
      : pn ? L('Baue die Tierhütte, dann kommen deine Tiere von Anfang an mit.', 'Build the pet hut and your pets join you from the start.')
      : L('Ab Ebene 2 steht manchmal ein Käfig in einem Kampfraum. Er taucht auf, wenn der Raum gesäubert ist.', 'From floor 2 there is sometimes a cage in a battle room. It appears once the room is cleared.');
    // Kombo-Buch: gefundene mit Name und Wirkung, unbekannte als «???» mit Rezept (ein Ziel für den nächsten Durchlauf)
    const NCB = Object.keys(A.COMBOS).length, cbn = G.comboCount();
    const cbook = Object.keys(A.COMBOS).map(id => {
      const Cb = A.COMBOS[id], n = m.comboFound[id] || 0;
      return `<div class="page cb ${n ? 'have' : ''}"><div class="pi cbp">${cbIcon(id, 20)}</div><div><b ${n ? `style="color:${Cb.col}"` : ''}>${n ? esc(t(Cb.name)) : '???'}</b>${n ? `<span class="cnt">${n}×</span>` : ''}
        <div class="rc">${esc(A.Combos.recipe(id))}</div>${n ? `<div class="mini">${esc(t(Cb.text))}</div>` : ''}</div></div>`;
    }).join('');
    // Auftragsbrett: alle Erfolge mit Fortschritt, erreichte golden mit Haken, neue mit «Neu!»
    const v = A.Achieve.values(), achNew = m.achNew || [], achN = A.Achieve.count(), achMax = A.ACHIEVEMENTS.length;
    const jobIcon = (a) => a.mon ? monImg(a.mon, 30) : a.hero ? portrait(a.hero[0], a.hero[1]) : ic(a.icon, 28);
    // nach Gruppe sortiert (Reihenfolge von A.ACH_CATS), damit angehängte Erfolge bei ihrer Gruppe landen
    const catOrder = Object.keys(A.ACH_CATS), sorted = A.ACHIEVEMENTS.map((a, i) => [a, i]).sort((x, y) => (catOrder.indexOf(x[0].cat) - catOrder.indexOf(y[0].cat)) || (x[1] - y[1])).map(x => x[0]);
    let lastCat = null;
    const jobs = sorted.map(a => {
      const dn = A.Achieve.done(a.id), [p, n] = A.Achieve.progress(a, v), isNew = achNew.includes(a.id);
      const cat = a.cat !== lastCat ? `<div class="jcat">${esc(t(A.ACH_CATS[a.cat]))}</div>` : ''; lastCat = a.cat;
      return `${cat}<div class="job ${dn ? 'done' : ''} ${isNew ? 'new' : ''}"><div class="ji">${jobIcon(a)}</div><div class="jb"><div class="jt"><b>${esc(t(a.name))}</b>${dn ? '<span class="stamp">✓</span>' : ''}${isNew ? `<span class="newb">${L('Neu!', 'New!')}</span>` : ''}</div>
        <div class="mini">${esc(t(a.text))}</div>
        <div class="bar"><i style="width:${Math.round(p / n * 100)}%"></i></div><div class="jr"><span>${dn ? L('Erreicht', 'Done') : `${p} / ${n}`}</span>${spark((dn ? '' : '+') + a.sparks, 13)}</div></div></div>`;
    }).join('');
    // Chronik: Zahlen fürs ganze Spielerleben und die letzten Durchläufe
    const AC = A.Achieve, lf = AC.life();
    const lifeHtml = [[L('Durchläufe', 'Runs'), lf.runs], [L('Siege', 'Victories'), lf.won], [L('Tiefste Ebene', 'Deepest floor'), lf.best], [L('Gegner', 'Enemies'), lf.kills], [L('Weltenbosse', 'World bosses'), lf.bosses], [L('Elite-Gegner', 'Elites'), lf.elites],
      [L('Gold verdient', 'Gold earned'), lf.gold], [L('Geheime Räume', 'Secret rooms'), lf.secrets], [L('Spielzeit', 'Play time'), AC.timeText(lf.time)], [L('Lieblingsklasse', 'Favourite class'), lf.fav ? t(lf.fav.name) : '–']].map(([k, x]) => `<div>${esc(k)}<b>${esc(String(x))}</b></div>`).join('');
    const rows = AC.chron().map(e => {
      const R = A.RACES.find(x => x.id === e.race), Cl = A.CLASSES.find(x => x.id === e.cls);
      const achs = (e.ach || []).map(id => A.ACHIEVEMENTS.find(a => a.id === id)).filter(Boolean).map(a => t(a.name));
      return `<div class="runrow ${e.won ? 'won' : ''} ${e.quit ? 'quit' : ''}">${R && Cl ? portrait(e.race, e.cls) : ''}<div class="rb"><div><b>${t(U.floor)} ${e.floor}</b> · ${t(U.level)} ${e.level} · ${esc(Cl ? t(Cl.name) : e.cls)}${R ? ` (${esc(t(R.name))})` : ''}${e.grade ? ` · ${L('Grad', 'Grade')} ${e.grade}` : ''}${e.won ? ` <span class="goldc">${t(U.victory)}</span>` : ''}${e.bd && e.bd.length && A.BUILD_DIRS[e.bd[0]] ? ` · <span class="bdn">${esc(A.Build.nameOf(e.bd))}</span>` : ''}</div>
        <div class="mini">${esc(AC.causeText(e))} · ${e.kills} ${L('Gegner', 'enemies')} · ${e.gold} ${t(U.gold)} · ${esc(AC.timeText(e.dur))}${achs.length ? ` · ${L('Erfolg', 'Achievement')}: ${esc(achs.join(', '))}` : ''}</div></div>
        <div class="rs">${e.quit ? '' : spark('+' + e.sparks, 14)}<div class="mini">${esc(AC.whenText(e.t))}</div></div></div>`;
    }).join('');
    const note = m.campNote;
    show(`<div class="fade-in"><h2>${ic('u_tent', 42)}${t(U.camp)}</h2><div class="sub">${t(U.campInfo)}</div>
      ${note ? `<div class="msg">${L('Das Lager ist gewachsen!', 'The camp has grown!')}${note.old ? ' ' + L('Was du früher gekauft hast, steckt jetzt in den Gebäuden, mit mindestens gleicher Wirkung.', 'What you bought before now lives in the buildings, at least as strong as before.') : ''}${note.bonus ? ' ' + L(`Für die Weltenbosse, die du schon besiegt hast, hängen Wimpel am Eingang: ${note.bonus} Seelenfunken obendrauf.`, `Pennants for the world bosses you already beat hang at the entrance: ${note.bonus} soul sparks on top.`) : ''}</div>` : ''}
      <div class="stage campst"><canvas id="campCv"></canvas></div>
      <div class="rankbar"><div><b>${L('Lager-Stufe', 'Camp level')} ${rank}</b><span>/ ${A.CAMP_MAX}</span></div><div class="bar"><i style="width:${Math.round(rank / A.CAMP_MAX * 100)}%"></i></div>
        <div class="mini">${next ? L(`Ab Lager-Stufe ${next.rank}: ${t(next.name)}`, `From camp level ${next.rank}: ${t(next.name)}`) : (rank >= A.CAMP_MAX ? L('Alles ausgebaut. Das Lager ist eine Legende.', 'Everything built. The camp is a legend.') : L('Alle Gebäude stehen. Jetzt nur noch höher bauen.', 'All buildings stand. Now build them higher.'))}</div></div>
      <div class="card sparkbar"><span>${t(U.meta)}</span><b>${spark(m.sparks, 22)}</b></div>
      ${candleHtml()}${expHtml()}
      <h3>${L('Gebäude', 'Buildings')}</h3>${bld}
      <h3>${L('Auftragsbrett', 'Quest board')} ${achN}/${achMax}</h3><div class="card flags"><div class="mini">${L('Erfolge über alle Durchläufe hinweg. Jeder bringt Seelenfunken, sobald er erreicht ist, und ein Zettel mehr hängt am Brett.', 'Achievements across all runs. Each one gives soul sparks as soon as it is reached, and one more note hangs on the board.')}</div><div class="jobs">${jobs}</div></div>
      <h3>${L('Chronik', 'Chronicle')}</h3><div class="card flags"><div class="life">${lifeHtml}</div>${rows ? `<div class="runs">${rows}</div>` : `<div class="mini" style="margin-top:8px">${L('Noch kein Durchlauf. Die Chronik füllt sich mit jedem Abstieg.', 'No run yet. The chronicle fills up with every descent.')}</div>`}</div>
      <h3>${L('Neue Völker', 'New peoples')}</h3><div class="card folks"><div class="mini">${L('Jedes Volk zieht ins Lager und kann danach mit in die Tiefe.', 'Each people moves into the camp and can then join the descent.')}</div><div class="frow">${folks}</div></div>
      <h3>${L('Begleiter', 'Pets')} ${pn}/${PN}</h3><div class="card flags"><div class="mini">${petInfo} ${L(`Treue wächst mit jedem Sieg, den ein Tier miterlebt, und bleibt für immer. Treue 3 und 5 bringen neue Tricks. Jedes neue Tier bringt ${A.PET_SPARKS} Seelenfunken.`, `Loyalty grows with every win a pet sees and stays forever. Loyalty 3 and 5 bring new tricks. Every new pet gives ${A.PET_SPARKS} soul sparks.`)}</div><div class="fgrid one">${petCards}</div></div>
      <h3>${L('Wimpel der Weltenbosse', 'World boss pennants')}</h3><div class="card flags"><div class="mini">${L('Den ersten Sieg über einen Weltenboss feiert das Lager mit seinem Wimpel: Bonus für immer und 50 Seelenfunken. Der erste Sieg in den Welten II bringt den goldenen Wimpel: doppelter Bonus und 100 Funken.', 'The camp celebrates your first win over a world boss with its pennant: a bonus forever and 50 soul sparks. Your first win in the worlds II brings the golden pennant: double bonus and 100 sparks.')}</div><div class="fgrid">${flags}</div></div>
      <h3>${L('Elite-Buch', 'Elite book')} ${pages}/${NT}</h3><div class="card flags"><div class="mini">${L(`Besiegst du einen Elite-Gegner mit einer neuen Eigenschaft, kommt sie ins Buch: ${A.ELITE_BOOK_SPARKS} Seelenfunken und für immer +${Math.round(A.ELITE_BOOK_DMG * 100)} % Schaden gegen Elite-Gegner.`, `Defeat an elite with a new trait and it goes into the book: ${A.ELITE_BOOK_SPARKS} soul sparks and +${Math.round(A.ELITE_BOOK_DMG * 100)}% damage against elites, forever.`)} <b class="goldc">${L('Jetzt', 'Now')}: +${Math.round(pages * A.ELITE_BOOK_DMG * 100)} %</b></div><div class="fgrid">${book}</div></div>
      <h3>${L('Hauptleute', 'Captains')} ${capN}/${A.CAPTAINS.length}</h3><div class="card flags"><div class="mini">${L(`Auf der dritten Ebene jeder Welt wartet ihr Offizier im Elite-Raum: eigene Masche, grosse Klappe, ${A.CAPTAIN_SPARKS} Seelenfunken und ein Stück extra.`, `On the third floor of every world its officer waits in the elite room: own trick, big mouth, ${A.CAPTAIN_SPARKS} soul sparks and an extra item.`)}</div><div class="caplist">${capts}</div></div>
      <h3>${L('Legenden-Sammlung', 'Legend collection')} ${legs}/${NL}</h3><div class="card flags"><div class="mini">${L(`Legenden fallen bei Weltenbossen, bei Elite-Gegnern mit der passenden Eigenschaft und in geheimen Räumen (Geröll am Ende eines Gangs wegräumen). Die zehn verrückten Stücke können überall auftauchen, ab Welt 2 viel öfter. Jede neue bringt ${A.LEGEND_SPARKS} Seelenfunken und für immer +${Math.round(A.LEGEND_DMG * 100)} % Schaden.`, `Legends drop from world bosses, from elites with the matching trait and in secret rooms (clear the rubble at the end of a corridor). The ten crazy pieces can turn up anywhere, much more often from world 2. Each new one gives ${A.LEGEND_SPARKS} soul sparks and +${Math.round(A.LEGEND_DMG * 100)}% damage, forever.`)} <b class="goldc">${L('Jetzt', 'Now')}: +${Math.round(legs * A.LEGEND_DMG * 100)} %</b></div><div class="fgrid one">${coll}</div></div>
      <h3>${L('Kombo-Buch', 'Combo book')} ${cbn}/${NCB}</h3><div class="card flags"><div class="mini">${L(`Zwei passende Teile wecken am Schrein eine Kombo: eine neue Kraft, die es nur zusammen gibt. Jede neue bringt ${A.COMBO_SPARKS} Seelenfunken. Manche gibt es nur mit einer bestimmten Klasse.`, `Two matching pieces awaken a combo at the shrine: a new power that only exists together. Each new one gives ${A.COMBO_SPARKS} soul sparks. Some only exist for a certain class.`)}</div><div class="fgrid one">${cbook}</div></div>
      <button class="btn" id="bBack">${t(U.back)}</button></div>`, { camp: true });
    if (note) { delete m.campNote; G.saveMeta(); }
    if (keep) screen.scrollTop = keep;
    A.Scenes.camp($('#campCv'), campState(), { poof });   // das Bild zeigt noch, was neu ist (Brett leuchtet)
    A.Achieve.clearNew();   // die neuen Erfolge sind jetzt angeschaut
    screen.querySelectorAll('[data-up]').forEach(b => b.onclick = () => { const id = b.dataset.up; if (G.campBuy(id)) { S.build(); camp(id); } });
    screen.querySelectorAll('[data-race]').forEach(b => b.onclick = () => { const id = b.dataset.race; if (G.metaBuy(id)) { S.build(); camp(id); } });
    screen.querySelectorAll('[data-pet]').forEach(b => b.onclick = () => { const id = b.dataset.pet; S.click(); if (A.Pets.sel().includes(id) || A.Pets.away(id)) return; A.Pets.choose(id); camp('tier'); });
    // Expeditionen (v41): losschicken und abholen; die Restzeit läuft sichtbar mit
    screen.querySelectorAll('[data-trip]').forEach(b => b.onclick = () => { if (A.Pets.send(b.dataset.trip, b.dataset.k)) { S.click(); camp('exp'); } });
    screen.querySelectorAll('[data-claim]').forEach(b => b.onclick = () => { const id = b.dataset.claim, res = A.Pets.claim(id); if (res) { expNews = { id, res }; S.level(); camp('exp'); } });
    expNews = null;
    clearInterval(expTimer);
    if (screen.querySelector('[data-left]')) expTimer = setInterval(() => {
      const els = screen.querySelectorAll('[data-left]'); if (!els.length) { clearInterval(expTimer); return; }
      let back = false;
      els.forEach(el => { const tr = A.Pets.tripOf(el.dataset.left); if (!tr || tr.done) { back = true; return; } el.querySelector('.tl').textContent = tripLeft(tr.left); el.querySelector('i').style.width = Math.round(tr.pct * 100) + '%'; });
      if (back) { clearInterval(expTimer); camp('exp'); }
    }, 15000);
    $('#bBack').onclick = () => { S.click(); clearInterval(expTimer); title(); };
  }
  // ---------- Expeditionen und Kerzen (v41) ----------
  let expNews = null, expTimer = null;
  const tripLeft = (ms) => { const mn = Math.max(1, Math.ceil(ms / 60000)), h = Math.floor(mn / 60), r = mn % 60; return h ? L(`noch ${h} Std ${r} Min`, `${h} h ${r} min left`) : L(`noch ${r} Min`, `${r} min left`); };
  function candleHtml() {
    const c = G.candles(false), n = c.n, fl = Array.from({ length: A.CANDLE_MAX }, (_, i) => `<span class="cdl ${i < n ? 'on' : ''}">${ic('candle', 20)}</span>`).join('');
    const txt = n ? L(`${n} ${n === 1 ? 'Kerze brennt' : 'Kerzen brennen'}: +${Math.round(n * A.CANDLE_SPARKS * 100)} % Seelenfunken auf jeden Lauf.`, `${n} candle${n === 1 ? '' : 's'} burning: +${Math.round(n * A.CANDLE_SPARKS * 100)}% soul sparks on every run.`) + ' ' + (c.today ? L('Heute schon angezündet. Bring morgen wieder einen Lauf zu Ende, dann brennt eine mehr.', 'Already lit today. Finish a run again tomorrow and one more will burn.') : L('Bring heute einen Lauf zu Ende, sonst gehen sie aus.', 'Finish a run today or they go out.'))
      : L('Noch keine Kerze. Bring heute einen Lauf zu Ende, dann brennt die erste (+5 % Seelenfunken). Jeden Tag in Folge eine mehr.', 'No candle yet. Finish a run today and the first one burns (+5% soul sparks). One more for every day in a row.');
    return `<div class="card candles"><div class="cdls">${fl}</div><div class="mini">${txt}</div></div>`;
  }
  function expHtml() {
    const ids = Object.keys(A.PETS).filter(id => A.Pets.found(id)); if (!ids.length) return '';
    const busy = A.Pets.busy(), team = A.Pets.sel();
    const news = expNews ? (() => { const { id, res } = expNews, P = A.PETS[id];
      return `<div class="msg expnews">${petImg(id, 30)}<span><b style="color:${P.col}">${esc(res.line)}</b> ${L(`Mitgebracht: +${res.sparks} Seelenfunken, +${res.treue} Treue`, `Brought back: +${res.sparks} soul sparks, +${res.treue} loyalty`)}${res.up ? L(` (jetzt Treue ${res.lv}!)`, ` (now loyalty ${res.lv}!)`) : ''}${res.gift ? L(`, dazu ${esc(t(res.gift.text))} für den nächsten Lauf`, `, plus ${esc(t(res.gift.text))} for the next run`) : ''}.</span></div>`; })() : '';
    const cards = ids.map(id => {
      const P = A.PETS[id], tr = A.Pets.tripOf(id);
      let right;
      if (tr && tr.done) right = `<div class="mini goldc">${L('Zurück!', 'Back!')} (${esc(t(tr.X.name))})</div><button class="btn primary small" data-claim="${id}">${L('Abholen', 'Collect')}</button>`;
      else if (tr) right = `<div class="mini" data-left="${id}">${esc(t(tr.X.name))}: <span class="tl">${tripLeft(tr.left)}</span><div class="bar"><i style="width:${Math.round(tr.pct * 100)}%"></i></div></div>`;
      else if (A.Pets.inRun(id)) right = `<div class="mini">${L('Ist gerade mit dir in der Tiefe.', 'Is down in the depths with you right now.')}</div>`;
      else if (team.includes(id)) right = `<div class="mini">${L('Kommt mit in die Tiefe (Tierhütte).', 'Joins the descent (pet hut).')}</div>`;
      else if (busy >= A.EXP_MAX) right = `<div class="mini">${L(`Schon ${A.EXP_MAX} Tiere unterwegs.`, `${A.EXP_MAX} pets are already away.`)}</div>`;
      else right = `<div class="expbtns">${A.EXPEDITIONS.map(X => `<button data-trip="${id}" data-k="${X.id}"><b>${X.h} ${L('Std', 'h')}</b><span>${esc(t(X.name))}</span></button>`).join('')}</div>`;
      return `<div class="expc ${tr ? (tr.done ? 'back' : 'away') : ''}"><div class="pp">${petImg(id, 34)}</div><div class="pb"><b style="color:${P.col}">${esc(t(P.name))}</b>${right}</div></div>`;
    }).join('');
    const info = L(`Tiere, die gerade nicht mitkommen, gehen auf Reise und bringen Seelenfunken und Treue mit, auf langen Reisen oft ein Mitbringsel für den nächsten Lauf. Die Zeit läuft auch, wenn das Spiel zu ist.`, `Pets that are not joining you go travelling and bring back soul sparks and loyalty, on long trips often a gift for the next run. Time keeps running while the game is closed.`)
      + ' ' + A.EXPEDITIONS.map(X => `${X.h} ${L('Std', 'h')}: ${X.sparks[0]}-${X.sparks[1]}`).join(' · ') + ' ' + t(U.meta) + '.';
    return `<h3>${L('Expeditionen', 'Expeditions')} ${busy}/${A.EXP_MAX}</h3><div class="card flags"><div class="mini">${info}</div>${news}<div class="exps">${cards}</div></div>`;
  }

  // Erster Sieg über einen Weltenboss: der Wimpel kommt ins Lager
  function campNews() {
    const r = G.run, n = r && r.campNews; if (!n) return; r.campNews = null; G.save();
    const name = t(A.BOSSES[n.id].name), gold = n.st >= 2;
    // erst zeigen, wenn kein Fenster offen ist (nach dem Bosskampf kommt oft die Segen-Wahl)
    const say = () => { if (!dungeonEl.classList.contains('on')) return; if (overlay.classList.contains('on')) { setTimeout(say, 700); return; }
      A.FX.banner(gold ? L('Goldener Wimpel fürs Lager!', 'Golden pennant for the camp!') : L('Neuer Wimpel fürs Lager!', 'New pennant for the camp!'), `${name}: ${fxText(sumFx([A.BANNERS[n.id]], 1, n.st))} · +${n.sparks} ${t(U.meta)}`, '#c77dff', 3.4); S.level(); };
    setTimeout(say, 2600);
  }

  // Elite-Gegner mit Eigenschaften, die man noch nie gesehen hat: kurz vorstellen
  function eliteNews(list) {
    const ids = G.eliteSeen(list); if (!ids.length) return;
    const T = (id) => A.ELITE_TRAITS[id];
    setTimeout(() => {
      if (!dungeonEl.classList.contains('on') || overlay.classList.contains('on')) return;
      const sub = ids.length === 1 ? `${t(T(ids[0]).name)}: ${t(T(ids[0]).tip)}` : ids.map(id => t(T(id).name)).join(' · ');
      A.FX.banner(ids.length > 1 ? L('Neue Elite-Eigenschaften!', 'New elite traits!') : L('Neue Elite-Eigenschaft!', 'New elite trait!'), sub, T(ids[0]).col, 3);
    }, 650);
  }
  // Neue Seite im Elite-Buch (erst zeigen, wenn kein Fenster offen ist und «Raum gesäubert» vorbei ist)
  function bookNews(ids) {
    const say = () => { if (!dungeonEl.classList.contains('on')) return; if (overlay.classList.contains('on')) { setTimeout(say, 700); return; }
      A.FX.banner(L('Neu im Elite-Buch!', 'New in the elite book!'), `${ids.map(id => t(A.ELITE_TRAITS[id].name)).join(' · ')} · +${ids.length * A.ELITE_BOOK_SPARKS} ${t(U.meta)}`, '#c77dff', 3); S.drop('epic'); };
    setTimeout(say, 1700);
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
      onItem: (it) => { if (!calmLoot(it)) foundItem(it); },   // Ruhige Beute (v40): schwächere Funde ohne Fenster
      onProp: (p) => useProp(p),
      onCleared: (room) => { if (room.type === 'boss') { Portal.happytime(); campNews(); } if (r.questJustDone) { r.questJustDone = false; setTimeout(() => A.FX.banner(t(U.questDone), r.quest ? t(r.quest.text) : '', '#63c74d', 2.4), 1300); } G.save(); setTimeout(pendingPicks, 400); },
      onDeath: () => { S.lose(); const run0 = G.run; if (!run0.over) { run0.over = true; G.finishRun(); } setTimeout(() => { if (G.run === run0) runOver(); }, 1100); },   // gleich als vorbei speichern: wer die Seite in der Sekunde danach schliesst, steht sonst mit 0 Leben wieder auf
      onLevel: () => { if (Wd.W) { A.FX.ev('level', { h: Wd.W.hero, level: G.run.level, sub: G.meta.autoPts ? L('Punkte automatisch verteilt', 'Points spent automatically') : null }); if (G.meta.autoPts) { Wd.refreshHero(); Wd.float(Wd.W.hero.x, Wd.W.hero.y - 74, L('Punkte verteilt', 'Points spent'), '#fee761', 12, 'u_star'); } } hudUpdate(); },
      onElite: (list) => eliteNews(list),
      onBook: (ids) => bookNews(ids),
    };
    Wd.enter(r.floor, r.floorSeed, fresh ? null : r.rooms, hooks);
    r.rooms = Wd.saveRooms();
    buildControls(); pads(); fadeIn();
    S.music(A.Draw.themeOf(r.floor));
    const wfx = A.Weather.nameOf(Wd.W);
    A.FX.banner(t(U.floor) + ' ' + r.floor, A.worldName(r.floor) + (wfx ? ' · ' + wfx : '') + (A.gradeOf(r) ? ' · ' + L('Grad', 'Grade') + ' ' + A.gradeOf(r) : ''), '#fee761', 2.6);
    // Mitbringsel von der Expedition (v41): einmal nach dem Ebenen-Schild zeigen, dann vergessen
    if (r.giftNews) { const gn = r.giftNews, w2 = Wd.W; delete r.giftNews; G.save(); setTimeout(() => { if (Wd.W === w2 && dungeonEl.classList.contains('on')) A.FX.banner(L('Mitbringsel von der Reise', 'A gift from the trip'), [gn.pot ? L(`+${gn.pot} ${gn.pot === 1 ? 'Trank' : 'Tränke'}`, `+${gn.pot} potion${gn.pot === 1 ? '' : 's'}`) : '', gn.gold ? L(`+${gn.gold} Gold`, `+${gn.gold} gold`) : ''].filter(Boolean).join(' · '), '#e4a672', 2.6); }, 2800); }
    // neue Welt (oder Steinschlag zum ersten Mal): kurz sagen, was hier anders ist (weather.js)
    if (fresh && r.floor > 1 && ((r.floor - 1) % A.FLOORS_PER_WORLD === 0 || r.floor === 2) && wfx) { const w0 = Wd.W; w0.hint = A.Weather.tip(w0); setTimeout(() => { if (Wd.W === w0 && !w0.active) w0.hint = ''; }, 9000); }
    if (fresh && r.floor === 1) { const coarse = matchMedia('(pointer: coarse)').matches; Wd.W.hint = coarse ? L('Links laufen, rechts schlagen', 'Left: move, right: attack') : L('WASD laufen · Leertaste schlagen · 1-4 Zauber', 'WASD move · Space attack · 1-4 spells'); const w1 = Wd.W; setTimeout(() => { if (Wd.W === w1 && !w1.active) w1.hint = ''; }, 7000); }
    if (!last) { last = performance.now(); requestAnimationFrame(loop); }
    setTimeout(pendingPicks, 900);
  }
  function loop(now) {
    requestAnimationFrame(loop);
    const raw = Math.max(0, (now - last) / 1000); const dt = Math.min(0.05, raw); last = now;
    if (!dungeonEl.classList.contains('on') || !Wd.W) return;
    const inp = input.read();
    const sdt = A.FX.simDt(dt);
    if (sdt > 0) Wd.step(sdt, inp);
    A.Achieve.tick(dt, Wd.W.paused);   // Spielzeit, Gold, Erfolge prüfen und einblenden
    A.FX.update(sdt);
    if (G.run && Wd.W.seed === G.run.floorSeed && Wd.W.floor === G.run.floor) G.run.rooms = Wd.saveRooms();   // nur die Welt dieses Laufs (nicht die alte Ebene während der Werbung)
    draw.draw(Wd.W, dt);
    controlsTick();
    hudT += dt; if (hudT > 0.1) { hudT = 0; hudUpdate(); }
    joyHint.classList.toggle('hide', !!input.joy.on);
    // Bildrate beobachten: kommt das Gerät nicht mit, wird die Darstellung einfacher (weniger Licht-Feinheiten, weniger Teilchen)
    if (draw.quality === 'hi' && !Wd.W.paused && raw < 0.25) {
      perf.n++; perf.sum += raw;
      if (perf.n >= 120) { if (perf.sum / perf.n > 0.026) { draw.quality = 'lo'; A.FX.low = true; } perf.n = 0; perf.sum = 0; }
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
      ${sk.map((id, i) => `<button class="cbtn sk" data-sk="${i}" style="grid-column:${4 - sk.length + i + 1 > 4 ? 4 : 4 - sk.length + i + 1}" aria-label="${esc(A.Boons.skName(id))}"><span class="ring"></span>${skIcon(id, 36)}<span class="key">${i + 1}</span></button>`).join('')}
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
      const cd = Math.max(0, (h.cds[id] || 0) - Wd.W.t); const tot = A.Boons.cd(id); const cold = cd > 0;
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
    if (overlay.classList.contains('on')) { if (code === 'Escape' || code === 'KeyI' || code === 'Tab') { const b = overlay.querySelector('[data-esc]') || $('#bClose'); if (b) b.click(); e.preventDefault(); } return; }
    if (code === 'Digit1' || code === 'Digit2' || code === 'Digit3' || code === 'Digit4') { if (Wd.useSkill(+code.slice(-1) - 1)) S.click(); }
    if (code === 'KeyQ') { if (Wd.usePotion()) hudUpdate(); }
    if (code === 'KeyE' || code === 'Enter') Wd.interact();
    if (code === 'KeyI' || code === 'Tab' || code === 'Escape') { e.preventDefault(); S.click(); showSheet(); }
    if (code === 'Space') e.preventDefault();
  };
  // ---------- Vergleich: ein Stück gegen das angelegte (Rechnung in compare.js) ----------
  // Karte für die Gegenüberstellung: schmal, damit zwei nebeneinander aufs Handy passen
  function cmpCard(it, tag, isNew) {
    const P = it.power && A.POWERS[it.power.id];
    const lines = G.itemLines(it).map(l => l.charAt(0) === '★' ? '★ ' + L('Trophäen-Kraft', 'Trophy power') : l);
    return `<div class="ccard ${isNew ? 'new' : ''} ${it.legend ? 'leg' : ''}" style="--rc:${rarCol(it.rarity)}"><div class="ctag">${tag}</div>
      <div class="chead">${itIcon(it, 36)}<div class="cmeta">${t(U.slot[it.slot === 'trinket2' ? 'trinket' : it.slot])}<br>${t(U.rarity[it.rarity])}</div></div>
      <div class="cname">${esc(G.itemName(it))}</div>${it.el ? `<div class="cel">${elBadge(it.el)}</div>` : ''}
      <div class="clines">${lines.map(l => `<div>${esc(l)}</div>`).join('') || `<div>${L('keine Werte', 'no stats')}</div>`}</div>
      ${P ? `<div class="cpw">${ic('u_spark', 12)}<span>${esc(t(P.name))}</span></div>` : ''}${it.legend ? `<div class="clg">${ic('u_star', 12)}<span>${L('Legende', 'Legend')}</span></div>` : ''}
    </div>`;
  }
  function cmpEmpty(slot) {
    return `<div class="ccard empty"><div class="ctag">${L('Angelegt', 'Equipped')}</div><div class="chead">${ic(SLOT_ICON[slot], 36, 'empty')}<div class="cmeta">${t(U.slot[slot === 'trinket2' ? 'trinket' : slot])}<br>${L('frei', 'free')}</div></div>
      <div class="cname">${L('Nichts', 'Nothing')}</div><div class="clines">${L('Der Platz ist frei.', 'The slot is free.')}</div></div>`;
  }
  // Zeile «Angriff 34 ▸ 41 +7»: grün mehr, rot weniger, grau, wenn der Wert für die Klasse kaum zählt
  function cmpRow(x) {
    const f = (v) => v + (x.pct ? ' %' : '');
    return `<div class="dr ${x.muted ? 'mute' : x.diff > 0 ? 'pos' : 'neg'}"><span class="dn">${esc(x.name)}${x.muted ? `<i>${L('nützt dir kaum', 'barely helps you')}</i>` : ''}</span><span class="dv">${f(x.a)}<i class="ar"></i><b>${f(x.b)}</b></span><span class="dd">${x.diff > 0 ? '+' : '−'}${f(Math.abs(x.diff))}</span></div>`;
  }
  // Was kommt dazu (grün), was fällt weg (rot): Element-Bonus, Kraft, Legende, Trophäe, zweite Chance; grau: ein Teil näher am nächsten Element-Bonus
  function cmpFx(x) {
    let icon = 'u_spark', html = '';
    if (x.kind === 'el' || x.kind === 'elnext') {
      const E = A.ELEMENTS[x.el], head = `<b style="color:${E.col}">${esc(t(E.name))} ${x.n}/6:</b> `; icon = E.icon;
      html = head + (x.kind === 'elnext' ? L(`Bei ${A.EL_TIERS[x.tier - 1]} Teilen`, `At ${A.EL_TIERS[x.tier - 1]} pieces`) : x.up ? L('Neuer Bonus', 'New bonus') : L('Bonus weg', 'Bonus lost')) + ': ' + esc(t(E.tiers[x.tier - 1]));
    } else if (x.kind === 'pw') {
      const nm = esc(t(A.POWERS[x.id].name)), txt = esc(A.Gear.powerText({ id: x.id, v: x.v }));
      html = x.from != null ? `<b>${nm} ${x.up ? L('stärker', 'stronger') : L('schwächer', 'weaker')}:</b> ${txt} (${L('bisher', 'before')} ${x.from})` : `<b>${x.up ? L('Neue Kraft', 'New power') : L('Kraft weg', 'Power lost')}: ${nm}.</b> ${txt}`;
    } else if (x.kind === 'leg') {
      const Lg = A.LEGENDS[x.id]; icon = 'u_star';
      html = `<b>${x.up ? L('Legende', 'Legend') : L('Legende weg', 'Legend lost')}: ${esc(t(Lg.name))}.</b> ${esc(t(Lg.text))}`;
    } else if (x.kind === 'tro') {
      const T = Object.values(A.TROPHIES).find(q => q.power === x.key); icon = 'u_star';
      html = `<b>${x.up ? L('Trophäen-Kraft', 'Trophy power') : L('Trophäen-Kraft weg', 'Trophy power lost')}:</b> ${esc(t(T.text))}`;
    } else if (x.kind === 'revive') {
      icon = 'u_heart';
      html = `<b>${x.up ? L('Zweite Chance', 'Second chance') : L('Zweite Chance weg', 'Second chance lost')}:</b> ${L('Einmal pro Durchlauf überleben', 'Survive once per run')}${x.used ? L(' (schon verbraucht)', ' (already used)') : ''}`;
    } else if (x.kind === 'combo' || x.kind === 'comboready') {   // Kombo (combos.js): erwachte wirkt wieder oder ruht, sonst bereit bis zum nächsten Schrein
      const Cb = A.COMBOS[x.id], head = x.kind === 'combo' ? (x.up ? L('Kombo wirkt wieder', 'Combo works again') : L('Kombo ruht', 'Combo rests')) : x.up ? L('Kombo bereit', 'Combo ready') : L('Kombo-Teil weg', 'Combo piece lost');
      html = `<b>${head}: ${esc(t(Cb.name))}.</b> ${x.kind === 'comboready' && x.up ? L('Erwacht am nächsten Schrein. ', 'Awakens at the next shrine. ') : ''}${esc(t(Cb.text))}`;
      return `<div class="eld cb ${x.up ? 'up' : 'down'}">${cbIcon(x.id, 12)}<span>${html}</span></div>`;
    }
    return `<div class="eld ${x.kind === 'elnext' ? 'next' : x.up ? 'up' : 'down'} ${x.kind === 'leg' ? 'leg' : ''}">${ic(icon, 14)}<span>${html}</span></div>`;
  }
  // Tipp: besser oder unterm Strich eher stärker: anlegen (eine Legende auch bei Geschmackssache: ausprobieren lohnt sich, das alte Stück bleibt im Beutel);
  // sonst anders: behalten; schlechter oder gleich: verkaufen (Legenden behalten)
  function cmpTip(c) {
    if (c.verdict === 'better' || (c.verdict === 'mixed' && (c.lean === 'up' || (c.lean === 'even' && c.it.legend)))) return 'equip';
    return c.verdict === 'mixed' || c.it.legend ? 'keep' : 'sell';
  }
  // Vergleichsfenster. o.ctx: 'found' (gerade aufgehoben), 'bag' (liegt im Beutel) oder 'shop' (beim Händler, o.idx und o.price);
  // o.back: zurück zum Fenster davor; o.slot: welcher Schmuck weichen soll; o.lg: Eintrag in der Legenden-Sammlung (beim Fund)
  function compareView(it, o) {
    const r = G.run, list = A.Compare.all(it), c = list.find(x => x.slot === o.slot) || list[0], tip = cmpTip(c);
    const found = o.ctx === 'found', inShop = o.ctx === 'shop';
    const head = found ? `<div class="foundhead"><div class="bigicon ${it.legend ? 'legicon' : ''}" style="filter:drop-shadow(0 0 14px ${rarCol(it.rarity)})">${itIcon(it, 54)}</div><h2 class="${it.legend ? 'goldc' : ''}">${it.legend ? L('Eine Legende!', 'A legend!') : L('Gefunden', 'Found')}</h2></div>${legNewHtml(o.lg)}`
      : `<h2 class="mid">${L('Vergleich', 'Comparison')}</h2>`;
    const fit = A.Build.fits(it, r), fitHtml = fit ? `<div class="fitline ${fit.kind}">${ic(fit.kind === 'combo' ? 'u_spark' : A.BUILD_DIRS[fit.dir].icon, 18)}<span>${esc(A.Build.fitText(fit))}</span></div>` : '';
    const pick = list.length > 1 ? `<div class="cmppick"><div class="mini">${L('Beide Schmuck-Plätze sind belegt. Welcher Schmuck soll weichen?', 'Both trinket slots are taken. Which trinket should go?')}</div>${list.map(x => `<button data-slot="${x.slot}" class="${x === c ? 'on' : ''}">${itIcon(x.old, 22)}<span>${esc(G.itemName(x.old))}</span><span class="vchip ${x.verdict}">${t(VERD[x.verdict])}</span></button>`).join('')}</div>` : '';
    const tag = inShop ? L('Zu kaufen', 'For sale') : o.ctx === 'bag' ? L('Im Beutel', 'In your bag') : L('Neu', 'New');
    const cards = `${fitHtml}<div class="cmpcards">${cmpCard(it, tag, true)}${c.old ? cmpCard(c.old, L('Angelegt', 'Equipped')) : cmpEmpty(c.slot)}</div>`;
    const lean = c.lean === 'up' ? L(' Unterm Strich eher stärker.', ' Overall rather stronger.') : c.lean === 'down' ? L(' Unterm Strich eher schwächer.', ' Overall rather weaker.') : c.lean === 'even' ? L(' Geschmackssache.', ' A matter of taste.') : '';
    const verdict = `<div class="verdict ${c.verdict}"><b>${t(VERD[c.verdict])}</b><span>${esc(c.why + lean)}</span></div>`;
    const changes = `<div class="drows">${c.rows.map(cmpRow).join('')}</div>${c.fx.map(cmpFx).join('')}`;
    // Knöpfe: immer in derselben Reihenfolge, der Tipp leuchtet golden
    const sub = (h) => `<span class="bs">${h}</span>`;
    const sold = (x) => { const w = G.wouldSell(x); return w ? ' ' + L(`Beutel voll: ${esc(G.itemName(w))} wird verkauft.`, `Bag full: ${esc(G.itemName(w))} gets sold.`) : ''; };
    const eqSub = c.old ? L(`${esc(G.itemName(c.old))} kommt in den Beutel.`, `${esc(G.itemName(c.old))} goes to your bag.`) + (o.ctx === 'bag' ? '' : sold(c.old)) : L('Der Platz ist frei.', 'The slot is free.');
    const bagSub = L(`Kommt in den Beutel (${Math.min(r.bag.length + 1, G.BAG_MAX)}/${G.BAG_MAX}).`, `Goes to your bag (${Math.min(r.bag.length + 1, G.BAG_MAX)}/${G.BAG_MAX}).`) + sold(it);
    const gold = `${ic('coin', 16, 'coin')}<span>+${G.sellValue(it)}</span>`;
    const can = !inShop || r.gold >= o.price, miss = inShop && !can ? ' ' + L(`Dir fehlen ${o.price - r.gold} Gold.`, `You are ${o.price - r.gold} gold short.`) : '';
    const btns = found ? `<button class="btn two ${tip === 'equip' ? 'primary' : ''}" id="bEq"><span class="bl">${t(U.equip)}</span>${sub(eqSub)}</button>
        <button class="btn two ${tip === 'keep' ? 'primary' : ''}" id="bBag" data-esc><span class="bl">${ic('u_bag', 20)}${L('Behalten', 'Keep')}</span>${sub(bagSub)}</button>
        <button class="btn two ${tip === 'sell' ? 'primary' : ''}" id="bSell"><span class="bl">${t(U.sell)}</span>${sub(gold)}</button>`
      : inShop ? `<button class="btn two ${tip === 'equip' && can ? 'primary' : ''}" id="bBuyEq" ${can ? '' : 'disabled'}><span class="bl">${L('Kaufen und anlegen', 'Buy and equip')} ${coin(o.price)}</span>${sub(eqSub + miss)}</button>
        <button class="btn two" id="bBuy" ${can ? '' : 'disabled'}><span class="bl">${L('Nur kaufen', 'Just buy')} ${coin(o.price)}</span>${sub(bagSub)}</button>
        <button class="btn" id="bClose" data-esc>${t(U.back)}</button>`
      : `<button class="btn two ${tip === 'equip' ? 'primary' : ''}" id="bEq"><span class="bl">${t(U.equip)}</span>${sub(eqSub)}</button>
        <button class="btn two ${tip === 'sell' ? 'primary' : ''}" id="bSell"><span class="bl">${t(U.sell)}</span>${sub(gold)}</button>
        <button class="btn two ${tip === 'keep' ? 'primary' : ''}" id="bClose" data-esc><span class="bl">${t(U.back)}</span>${sub(L('Bleibt im Beutel.', 'Stays in your bag.'))}</button>`;
    ov(`${head}${pick}${cards}${verdict}${changes}${btns}`, o.again ? 'nopop' : '');
    overlay.querySelectorAll('[data-slot]').forEach(b => b.onclick = () => { S.click(); compareView(it, Object.assign({}, o, { slot: b.dataset.slot, again: true })); });
    const done = () => { if (o.back) o.back(); else ovClose(); };
    if (found) {
      const letGo = () => { if (Wd.W) Wd.W.held = null; };   // Beute am Boden (v40): das Stück ist nicht mehr in der Hand
      $('#bEq').onclick = () => { letGo(); G.equip(it, c.slot); S.buy(); ovClose(); };
      $('#bBag').onclick = () => { letGo(); G.addToBag(it); S.click(); ovClose(); };
      $('#bSell').onclick = () => { letGo(); r.gold += G.sellValue(it); G.save(); S.buy(); ovClose(); };
      return;
    }
    if (inShop) {
      $('#bBuyEq').onclick = () => { if (G.buy(o.idx, c.slot)) { S.buy(); done(); } };
      $('#bBuy').onclick = () => { if (G.buy(o.idx)) { S.buy(); done(); } };
    } else {
      $('#bEq').onclick = () => { G.equip(it, c.slot); S.buy(); done(); };
      $('#bSell').onclick = () => { G.sell(it); S.buy(); done(); };
    }
    $('#bClose').onclick = () => { S.click(); done(); };
  }
  // Ruhige Beute (v40, Schalter im Heldenblatt unter «Ausrüstung», meta.calm === false = aus): Schwächere oder gleiche Funde gehen ohne Fenster gleich in Gold.
  // Was zur Build-Richtung passt oder «anders, eher schwächer» ist, kommt still in den Beutel (ist er voll: Gold). Besseres, «anders» mit Tendenz nach oben,
  // Kombo-Teile, Legenden und Trophäen zeigen die Karte wie bisher. Gibt true zurück, wenn kein Fenster nötig ist
  const calmOn = () => G.meta.calm !== false;
  function calmLoot(it) {
    const r = G.run; if (!calmOn() || !r || !it || it.legend || it.trophy) return false;
    const c = A.Compare.all(it)[0], fit = A.Build.fits(it, r);
    if (!c || cmpTip(c) === 'equip' || (c.verdict === 'mixed' && c.lean !== 'down') || (fit && fit.kind === 'combo')) return false;
    const h = Wd.W && Wd.W.hero, keep = (fit || c.verdict === 'mixed') && r.bag.length < G.BAG_MAX, q = r.quiet || (r.quiet = { n: 0, g: 0, b: 0 });
    if (Wd.W) Wd.W.held = null;   // vor dem Speichern: nicht mehr in der Hand (sonst läge es nach dem Neuladen doppelt da)
    q.n++;
    if (keep) { q.b++; G.addToBag(it); if (h) Wd.float(h.x, h.y - 44, L('In den Beutel', 'Into the bag'), '#ead4aa', 12, 'u_bag'); }
    else { const g = G.sellValue(it); q.g += g; r.gold += g; G.save(); if (h) Wd.float(h.x, h.y - 44, '+' + g, '#feae34', 13, 'coin'); }
    if (Wd.W) Wd.pause(false);
    // Der Hinweis einmal, aber nur ausserhalb eines Kampfs (sonst verdeckt er den Elite-Balken oder kommt im Boss-Raum gar nicht)
    if (!G.meta.calmHint && Wd.W && !Wd.W.active) { G.meta.calmHint = 1; G.saveMeta(); const w = Wd.W, tx = L(`Ruhige Beute: Schwächere Funde gehen gleich in Gold. Ausschalten im Heldenblatt unter «${t(U.items)}».`, `Quiet loot: weaker finds turn straight into gold. Switch it off in the hero sheet under «${t(U.items)}».`); w.hint = tx; setTimeout(() => { if (Wd.W === w && w.hint === tx) w.hint = ''; }, 9000); }
    hudUpdate(); return true;
  }
  function calmRow(r) {
    const on = calmOn(), q = r.quiet;
    const txt = on ? L('Schwächere Funde gehen gleich in Gold, nur Besseres zeigt eine Karte.', 'Weaker finds turn straight into gold, only better ones show a card.') + (q && q.n ? ' ' + L(`Bisher ${q.n} still verstaut (+${q.g} Gold).`, `So far ${q.n} handled quietly (+${q.g} gold).`) : '')
      : L('Jeder Fund zeigt eine Karte.', 'Every find shows a card.');
    return `<div class="optrow">${ic('u_bag', 20)}<span><b>${L('Ruhige Beute', 'Quiet loot')}: ${on ? L('an', 'on') : L('aus', 'off')}</b> ${txt}</span><button id="bCalm">${on ? L('Ausschalten', 'Switch off') : L('Einschalten', 'Switch on')}</button></div>`;
  }
  // Gefundenes Item: gleich der Vergleich mit dem angelegten Stück
  function foundItem(it) {
    const lg = G.legendFound(it);
    if (lg && lg.first) S.level();
    compareView(it, { ctx: 'found', lg });
  }
  // Stücke in Truhen, Ereignissen und im Beutel: Antippen öffnet den Vergleich (nicht auf den Knöpfen Anlegen, Verkaufen, Kaufen)
  function bindCmp(back) {
    overlay.querySelectorAll('[data-cmp]').forEach(el => el.onclick = (e) => {
      if (e.target.closest('[data-eq],[data-sell],[data-buy]')) return;
      const it = G.run.bag.find(x => x.uid === el.dataset.cmp); if (!it) return;
      S.click(); compareView(it, { ctx: 'bag', back });
    });
  }
  // Beute, die schon im Beutel liegt (Truhen, Ereignisse): mit Urteil; inzwischen angelegt oder verkauft steht dabei
  function lootRow(it) {
    const r = G.run, inBag = r.bag.includes(it), worn = A.SLOTS.some(s => r.gear[s] === it);
    return itemHtml(it, inBag ? `<button class="cmpgo">${L('Vergleich', 'Compare')}</button>` : null, worn || inBag ? vChip(it) : `<span class="vchip sold">${L('Verkauft', 'Sold')}</span>`, inBag ? 'tap' : '', inBag ? `data-cmp="${it.uid}"` : '', !inBag && !worn);
  }
  // Treppe hinunter (auch am Ausgang: «Weiter nach unten»)
  function goDown() { S.descend(); overlay.classList.remove('on'); overlay.innerHTML = ''; if (Wd.W) Wd.W.sinkT = draw.t; const run0 = G.run; fadeOut(() => { if (!run0 || G.run !== run0 || run0.over) return; const res = G.descend(); if (res === 'won' || res == null) { runOver(); return; } Portal.showAd(() => dungeon(true)); }, 220); }
  // Heimkehren (v39): der Durchlauf endet mit allen Funken und Bonus (am Ausgang als Sieg), ab ins Lager
  function homeBtn(exit) {
    const pc = Math.round((exit ? A.EXIT_SPARKS : A.HOME_SPARKS) * 100);
    return `<button class="btn two ${exit ? 'primary' : ''}" id="bHome"><span class="bl">${ic(exit ? 'crown' : 'u_tent', 24)}${L('Heimkehren', 'Go home')}</span><span class="bs">${exit ? L('Als Sieger die Treppe hoch. Zu Fuss.', 'Back up the stairs as a winner. On foot.') : L('Lauf beenden, alle Funken behalten', 'End the run, keep all sparks')} · ${spark('+' + pc + ' %', 12)}</span></button>`;
  }
  function goHomeNow() {
    S.click(); overlay.classList.remove('on'); overlay.innerHTML = '';
    if (!G.goHome()) { Wd.pause(false); hudUpdate(); return; }
    S.level(); fadeOut(() => { runOver(); fadeIn(); }, 120);
  }
  // Der Ausgang auf Ebene 24 (48, 72 ...): eine grosse Tür mit Schild; sie geht auf, dahinter hängt das zweite Schild
  function exitScene() {
    const r = G.run, k = Math.max(1, Math.round(r.floor / A.MAX_FLOOR)), X = A.EXITS[Math.min(A.EXITS.length, k) - 1], next = r.floor + A.MAX_FLOOR, nf = r.floor + 1;
    ov(`<div class="center exitwin"><div class="exitdoor" id="exDoor"><div class="ed-sign">${esc(t(X.sign))}</div><div class="ed-in"><div class="ed-note">${esc(t(X.note).replace('{n}', next))}</div></div><div class="ed-l"></div><div class="ed-r"></div></div>
      <h2 class="mid">${k === 1 ? L('Der Ausgang!', 'The exit!') : L('Noch ein Ausgang!', 'Another exit!')}</h2>
      <div class="sub">${k === 1 ? L('Unten ist der Ausgang. Angeblich. Hier ist er. Fast.', 'The exit is at the bottom. Allegedly. Here it is. Almost.') : L('Du hast den Umweg geschafft. Der Abgrund hat noch mehr Umwege.', 'You survived the detour. The abyss has more detours.')}</div>
      <div class="exbtns">${homeBtn(true)}<button class="btn two" id="bOk"><span class="bl">${ic('u_down', 24)}${L('Weiter nach unten', 'Keep descending')}</span><span class="bs">${L('Umleitung: Ebene', 'Detour: floor')} ${nf} · ${esc(A.worldName(nf))}</span></button><button class="btn" id="bClose">${t(U.back)}</button></div></div>`, 'exitbox');
    const door = $('#exDoor'); S.open && S.open();
    setTimeout(() => { if (door && door.isConnected) { door.classList.add('open'); if (A.FX) A.FX.shake(0.2); } }, 650);
    $('#bHome').onclick = () => goHomeNow();
    $('#bOk').onclick = () => goDown();
    $('#bClose').onclick = () => { S.click(); ovClose(); };
  }
  // Dinge im Raum
  function useProp(p) {
    const r = G.run;
    if (!r || r.over) return;   // Lauf schon vorbei (gestorben oder heimgekehrt): keine Treppe, keine Truhe mehr
    if (p.kind === 'stairs') {
      if (Wd.W && Wd.W.sinkT != null) return;   // schon auf dem Weg nach unten: sonst springt ein zweites «Tiefer» über eine ganze Ebene
      if (A.isExitFloor(r.floor) && G.canGoHome()) { exitScene(); return; }   // Ebene 24, 48 ...: der Ausgang (v39)
      const nf = r.floor + 1, newWorld = A.worldIndex(nf) !== A.worldIndex(r.floor), home = G.canGoHome();   // nach einem Welt-Boss: Heimkehren
      ov(`<div class="center"><div class="bigicon">${ic('u_down', 60)}</div><h2 class="mid">${t(U.floor)} ${nf}</h2><div class="sub"><b class="goldc">${esc(A.worldName(nf))}</b><br>${newWorld ? L('Eine neue Welt. Andere Gegner, anderer Boden, andere Regeln.', 'A new world. New enemies, new ground, new rules.') : A.isBossFloor(nf) ? L('Unten wartet der Boss dieser Welt.', 'The boss of this world waits below.') : L('Neue Schicht, neue Gegner, neue Aufgabe.', 'New layer, new enemies, new quest.')}</div><button class="btn primary" id="bOk">${t(U.descend)}</button>${home ? homeBtn(false) : ''}<button class="btn" id="bClose">${t(U.back)}</button></div>`);
      $('#bOk').onclick = () => goDown();
      if (home) $('#bHome').onclick = () => goHomeNow();
      $('#bClose').onclick = () => { S.click(); ovClose(); };
    }
    else if (p.kind === 'chest') { if (p.hidden || (p.mimic && A.Surprise.wake(p))) return; Wd.markUsed(p); if (p.secret) secretTreasure(); else treasure(); }
    else if (p.kind === 'rubble') Wd.openRubble(p);
    else if (p.kind === 'fire') { Wd.markUsed(p); rest(); }
    else if (p.kind === 'merchant') { G.roomContent('merchant'); shop(); }
    else if (p.kind === 'statue') { Wd.markUsed(p); G.roomContent('statue'); eventScreen(); }
    else if (p.kind === 'shrine') { r.pendingBoon = (r.pendingBoon || 0) + 1; Wd.markUsed(p); boonPick(); }
    else if (p.kind === 'forge') { S.forge(); forge(); }
    else if (p.kind === 'cage') petWin(p);
    else if (p.kind === 'pact') pactWin(p);
  }
  // Pakt-Altar (pacts.js): 3 Pakte mit Fluch und Lohn; einen unterschreiben oder gehen (der Altar wartet dann weiter)
  function pactRow(id, btn) {
    const P = A.PACTS[id];
    return `<div class="skill pact" style="cursor:default"><div class="si">${ic('pactaltar', 30)}</div><div style="flex:1;min-width:0"><div class="nm" style="color:${P.col}">${esc(A.Pacts.name(id))}</div>
      <div class="ds"><span class="curse">${L('Fluch', 'Curse')}: ${esc(A.Pacts.curse(id))}</span><br><span class="gift">${L('Lohn', 'Reward')}: ${esc(A.Pacts.gift(id))}</span></div>${btn ? `<div class="mini"><i>${esc(t(P.flavor))}</i></div><button class="sign" data-pact="${id}">${L('Unterschreiben', 'Sign')}</button>` : ''}</div></div>`;
  }
  function pactWin(p) {
    const have = A.Pacts.list(), offers = A.Pacts.offer(), full = have.length >= A.PACT_MAX, pct = Math.round(A.PACT_SPARKS * 100);
    S.open();
    const sub = full ? L('Du hast schon alle Pakte unterschrieben, die eine Seele tragen kann. Der Altar schweigt beleidigt.', 'You have already signed every pact one soul can carry. The altar sulks in silence.')
      : L(`Eine Stimme flüstert: «Unterschreib hier. Und hier. Und hier.» Ein Pakt gilt bis zum Ende des Durchlaufs, mit Fluch und Lohn, und bringt am Ende +${pct} % Seelenfunken. Pakte: <b class="goldc">${have.length}/${A.PACT_MAX}</b>.`, `A voice whispers: "Sign here. And here. And here." A pact lasts until the end of the run, with a curse and a reward, and brings +${pct}% soul sparks at the end. Pacts: <b class="goldc">${have.length}/${A.PACT_MAX}</b>.`);
    ov(`<div class="center"><div class="bigicon">${ic('pactaltar', 60)}</div><h2 class="mid" style="color:#e43b44">${L('Pakt-Altar', 'Pact Altar')}</h2></div><div class="sub">${sub}</div>
      ${full ? '' : offers.map(id => pactRow(id, true)).join('')}
      <button class="btn" id="bClose" data-esc>${full ? t(U.back) : L('Lieber nicht', 'Better not')}</button>`);
    overlay.querySelectorAll('[data-pact]').forEach(el => el.onclick = () => {
      const id = el.dataset.pact; if (!A.Pacts.sign(id)) return;
      Wd.markUsed(p); S.level(); if (A.FX) A.FX.shake(0.25);
      A.FX.banner(L('Pakt', 'Pact') + ': ' + A.Pacts.name(id), A.Pacts.gift(id), A.PACTS[id].col, 2.5);
      if (Wd.W) Wd.refreshHero();
      ovClose(); pendingPicks();
    });
    $('#bClose').onclick = () => { S.click(); ovClose(); };
  }
  // Käfig öffnen: wer sitzt drin? Mitnehmen (sind alle Plätze voll, geht eins dafür ins Lager) oder ins Lager schicken
  function petWin(p) {
    const id = A.Pets.cagePick(); Wd.markUsed(p);
    if (!id) { ov(`<div class="center"><div class="bigicon">${ic('cage', 60)}</div><h2 class="mid">${L('Leer', 'Empty')}</h2><div class="msg">${L('Nur Stroh. Alle Tiere, die hier wohnen könnten, sind schon bei dir.', 'Just straw. Every animal that could live here is already with you.')}</div><button class="btn primary" id="bClose">${t(U.leave)}</button></div>`); $('#bClose').onclick = () => { S.click(); ovClose(); }; return; }
    const P = A.PETS[id], res = A.Pets.free(id), lv = A.Pets.treue(id), have = A.Pets.withMe(), full = have.length >= A.Pets.slots();
    S.open(); if (res.first) S.level();
    const hut = G.campLevel('tier') > 0;
    const news = res.first ? `<div class="msg legnew">${ic('u_paw', 18)}<span>${L(`<b>Neuer Begleiter</b> (${res.n}/${Object.keys(A.PETS).length}): +${res.sparks} Seelenfunken. ${esc(t(P.name))} wohnt jetzt für immer in deinem Lager.`, `<b>New pet</b> (${res.n}/${Object.keys(A.PETS).length}): +${res.sparks} soul sparks. ${esc(t(P.name))} now lives in your camp for good.`)}</span></div>`
      : `<div class="msg">${L('Ihr kennt euch schon! Es freut sich riesig: +10 Treue.', 'You already know each other! It is overjoyed: +10 loyalty.')}</div>`;
    const take = full ? have.map(o => `<button class="btn two" data-swap="${o}"><span class="bl">${petImg(o, 22)}${L(`Statt ${esc(A.Pets.name(o))} mitnehmen`, `Take instead of ${esc(A.Pets.name(o))}`)}</span><span class="bs">${L(`${esc(A.Pets.name(o))} geht ins Lager.`, `${esc(A.Pets.name(o))} goes to the camp.`)}</span></button>`).join('')
      : `<button class="btn primary" id="bTake">${L('Mitnehmen', 'Take along')}</button>`;
    ov(`<div class="center"><div class="bigicon petbig">${petImg(id, 72)}</div><h2 class="mid" style="color:${P.col}">${esc(t(P.name))}</h2><div class="sub">${esc(t(P.kind))} · ${L('Treue', 'Loyalty')} ${petStars(lv)}</div>
      ${news}<div class="msg">${esc(t(P.text))}<br><i class="mini">${esc(t(P.flavor))}</i></div>
      ${take}<button class="btn" id="bHome">${L('Ins Lager schicken', 'Send to the camp')}</button>
      <div class="mini">${hut ? L('In der Tierhütte wählst du, wer von Anfang an mitkommt.', 'In the pet hut you choose who joins from the start.') : L('Mit der Tierhütte im Lager kommen Tiere von Anfang an mit.', 'With the pet hut in your camp, pets join you from the start.')}</div></div>`);
    const go = (out) => { A.Pets.join(id, out); S.buy(); ovClose(); };
    const bt = $('#bTake'); if (bt) bt.onclick = () => go(null);
    overlay.querySelectorAll('[data-swap]').forEach(b => b.onclick = () => go(b.dataset.swap));
    $('#bHome').onclick = () => { S.click(); ovClose(); };
  }
  // ---------- Heldenblatt ----------
  function showSheet(tab) {
    const r = G.run, d = G.derived();
    tab = tab || 'stats';
    const race = A.RACES.find(x => x.id === r.race), cls = A.CLASSES.find(x => x.id === r.cls);
    const head = `<div class="sheethead"><img class="px" src="${Art.heroUrl(r.race, r.cls, 3)}" width="54" height="54" alt=""><div><div class="nm">${esc(t(cls.name))}</div><div class="mini">${esc(t(race.name))} · ${t(U.level)} ${r.level} · ${t(U.floor)} ${r.floor}</div>${buildLine(r, d)}</div></div>`;
    const statsHtml = ['str', 'tou', 'dex', 'mind', 'luck'].map(k => `<div class="stat"><span>${ic(STAT_ICON[k], 22)}${t(U.stat[k])}</span><span><b>${r.stats[k]}</b>${r.points > 0 ? `<button data-sp="${k}" aria-label="+">+</button>` : ''}</span></div>`).join('');
    const kv = `<div class="kv" style="margin-top:12px"><span>${t(U.hp)} <b>${d.maxHp}</b></span><span>${t(U.derived.atk)} <b>${d.atk}</b></span><span>${t(U.derived.mag)} <b>${d.mag}</b></span><span>${t(U.derived.def)} <b>${d.def}</b></span><span>${t(U.derived.spd)} <b>${d.spd}</b></span><span>${t(U.derived.crit)} <b>${d.crit} %</b></span><span>${t(U.derived.dodge)} <b>${d.dodge} %</b></span><span>${t(U.xp)} <b>${r.xp}/${G.xpNeed(r.level)}</b></span></div>`;
    const quest = r.quest ? `<div class="q">${ic('u_scroll', 22)}<span><b>${t(U.quest)}:</b> ${esc(t(r.quest.text))} <b class="${r.questDone ? 'up' : 'goldc'}">${r.questDone ? L('erfüllt', 'done') : Math.min(r.questProg || 0, r.quest.n) + '/' + r.quest.n}</b></span></div>` : '';
    const gear = buildHtml(r) + A.SLOTS.map(s => { const it = r.gear[s]; return it ? itemHtml(it) : emptySlot(s); }).join('');
    const bag = r.bag.length ? `<div class="mini" style="margin:-4px 0 8px">${L('Antippen: Vergleich mit dem, was du trägst.', 'Tap: compare with what you wear.')}</div>` + r.bag.map(it => itemHtml(it, `<button class="primary" data-eq="${it.uid}">${t(U.equip)}</button><button data-sell="${it.uid}">${coin(G.sellValue(it))}</button>`, vChip(it), 'tap', `data-cmp="${it.uid}"`)).join('') : `<div class="mini">${L('Leer.', 'Empty.')}</div>`;
    const skills = r.known.map(id => { const sk = A.SKILLS[id]; const on = r.active.includes(id); return `<div class="skill ${on ? 'on' : ''}" data-sk="${id}"><div class="si">${skIcon(id, 36)}</div><div><div class="nm">${esc(A.Boons.skName(id))}</div><div class="ds">${t(sk.desc)}${A.Boons.upgOf(id) ? ` <b class="goldc">+${A.Boons.upgOf(id) * 30} %</b>` : ''}</div></div><div class="cd">${on ? `<b class="goldc">${L('aktiv', 'active')}</b><br>` : ''}${cdTxt(id)}</div></div>`; }).join('');
    const tals = (r.talents || []).map(id => { const T = A.TALENTS[id]; return `<div class="skill on" style="cursor:default"><div class="si">${talIcon(id, 30)}</div><div><div class="nm">${esc(t(T.name))}</div><div class="ds">${esc(t(T.desc))}</div></div></div>`; }).join('');
    // Kombos: was wirkt, was am nächsten Schrein erwacht, was ruht und wo nur noch ein Teil fehlt (mit Fundort)
    const cbl = A.Combos.list(r, d), nCb = cbl.filter(x => x.st === 'on' || x.st === 'ready').length;
    const missHtml = (x) => x.miss.map(p => `${esc(A.Combos.partName(p))} (${esc(A.Combos.partWhere(p))})`).join(', ');
    const CB_TAG = { on: L('Wirkt', 'Active'), ready: L('Bereit', 'Ready'), rest: L('Ruht', 'Resting'), near: L('Fast', 'Almost') };
    const cbs = cbl.map(x => comboCard(x.id, CB_TAG[x.st], x.st, 22, x.st === 'on' ? `<div class="rc">${esc(A.Combos.recipe(x.id))}</div>`
      : `<div class="cbhint">${x.st === 'ready' ? L('Erwacht am nächsten Schrein.', 'Awakens at the next shrine.') : L('Es fehlt: ', 'Missing: ') + missHtml(x)}</div>`)).join('');
    const cbSec = `<h3>${L('Kombos', 'Combos')} <span class="mini">${L('Kombo-Buch', 'Combo book')} ${G.comboCount()}/${Object.keys(A.COMBOS).length}</span></h3>${cbs || `<div class="mini">${L('Zwei passende Teile (Segen, Zauber, Element, Legende, Trophäe) wecken am Schrein eine Kombo. Hier steht, sobald dir nur noch ein Teil fehlt.', 'Two matching pieces (blessing, spell, element, legend, trophy) awaken a combo at the shrine. It shows up here as soon as only one piece is missing.')}</div>`}`;
    // Begleiter, die gerade dabei sind, mit Treue und dem, was sie schon können
    const pets = (r.pets || []).filter(id => A.PETS[id]).map(id => { const P = A.PETS[id], lv = A.Pets.treue(id), pr = A.Pets.progress(id);
      return `<div class="skill on" style="cursor:default"><div class="si">${petImg(id, 30)}</div><div style="flex:1;min-width:0"><div class="nm" style="color:${P.col}">${esc(t(P.name))} ${petStars(lv)}</div><div class="ds">${A.Pets.tricks(id).filter(x => lv >= x.lv).map(x => esc(x.text)).join(' ')}${pr ? ` <span class="mini">${L(`(noch ${pr[1] - pr[0]} bis Treue ${lv + 1})`, `(${pr[1] - pr[0]} more to loyalty ${lv + 1})`)}</span>` : ''}</div></div></div>`; }).join('');
    // Punkte automatisch verteilen (v40): einmal jetzt, oder immer (meta.autoPts)
    const autoRow = `<div class="optrow">${ic('u_star', 20)}<span><b>${L('Immer automatisch', 'Always automatic')}: ${G.meta.autoPts ? L('an', 'on') : L('aus', 'off')}</b> ${L('Neue Punkte gehen gleich nach den Stärken deiner Klasse.', 'New points go straight to your class strengths.')}</span><button id="bAutoAll">${G.meta.autoPts ? L('Ausschalten', 'Switch off') : L('Einschalten', 'Switch on')}</button></div>`;
    const content = tab === 'stats' ? `${quest}${r.points > 0 ? `<div class="q">${ic('u_star', 22)}<span><b class="goldc">${r.points}</b> ${t(U.points)}</span><button id="bAuto">${L('Automatisch', 'Auto')}</button></div>` : ''}${statsHtml}${kv}${autoRow}${pets ? `<h3>${L('Begleiter', 'Pets')}</h3>${pets}` : ''}${A.Pacts.list(r).length ? `<h3>${L('Pakte', 'Pacts')} <span class="mini">${A.Pacts.list(r).length}/${A.PACT_MAX}</span></h3>${A.Pacts.list(r).map(id => pactRow(id, false)).join('')}` : ''}` :
      tab === 'gear' ? `${gear}<h3>${t(U.bag)} (${r.bag.length}/${G.BAG_MAX})</h3>${bag}${r.potions > 0 ? `<button class="btn" id="bPot">${ic('potion', 22)}${L('Trank trinken', 'Drink potion')} (+${Math.round(G.potionPct() * 100)} %)</button>` : ''}${calmRow(r)}` :
      tab === 'skills' ? `<div class="mini" style="margin-bottom:8px">${L(`Bis zu ${d.skillSlots} aktiv, auf den Knöpfen 1 bis ${d.skillSlots}. Antippen zum Wechseln.`, `Up to ${d.skillSlots} active, on buttons 1 to ${d.skillSlots}. Tap to switch.`)}</div>${skills}` :
      `<div class="mini" style="margin-bottom:8px">${L(`Passive Segen vom Schrein: ${(r.talents || []).length} von ${d.talentSlots} Plätzen belegt.`, `Passive blessings from shrines: ${(r.talents || []).length} of ${d.talentSlots} slots used.`)}</div>${tals || `<div class="mini">${L('Noch keine. Finde den Schrein auf jeder Ebene.', 'None yet. Find the shrine on every floor.')}</div>`}${cbSec}`;
    ov(`${head}<div class="tabs"><button data-tab="stats" class="${tab === 'stats' ? 'on' : ''}">${t(U.stats)}</button><button data-tab="gear" class="${tab === 'gear' ? 'on' : ''}">${t(U.items)}</button><button data-tab="skills" class="${tab === 'skills' ? 'on' : ''}">${t(U.skills)}</button><button data-tab="tal" class="${tab === 'tal' ? 'on' : ''}">${L('Segen', 'Blessings')}${nCb ? ` <b class="goldc">★${nCb}</b>` : ''}</button></div>${content}<button class="btn" id="bClose">${t(U.back)}</button>`);
    overlay.querySelectorAll('[data-tab]').forEach(b => b.onclick = () => { S.click(); showSheet(b.dataset.tab); });
    overlay.querySelectorAll('[data-sp]').forEach(b => b.onclick = () => { G.spend(b.dataset.sp); S.click(); showSheet('stats'); });
    // Anlegen geht sofort; sind beide Schmuck-Plätze belegt, fragt der Vergleich, welcher Schmuck weichen soll
    overlay.querySelectorAll('[data-eq]').forEach(b => b.onclick = () => { const it = r.bag.find(x => x.uid === b.dataset.eq); if (A.Compare.slots(it).length > 1) { S.click(); compareView(it, { ctx: 'bag', back: () => showSheet('gear') }); return; } G.equip(it); S.buy(); showSheet('gear'); });
    bindCmp(() => showSheet('gear'));
    overlay.querySelectorAll('[data-sell]').forEach(b => b.onclick = () => { G.sell(r.bag.find(x => x.uid === b.dataset.sell)); S.buy(); showSheet('gear'); });
    overlay.querySelectorAll('[data-sk]').forEach(el => el.onclick = () => { const id = el.dataset.sk; let a = r.active.slice(); if (a.includes(id)) a = a.filter(x => x !== id); else if (a.length < d.skillSlots) a.push(id); else return; G.setActive(a); S.click(); showSheet('skills'); });
    const bp = $('#bPot'); if (bp) bp.onclick = () => { G.usePotion(); if (Wd.W) Wd.W.hero.hp = r.hp; S.potion(); showSheet('gear'); };
    const bc = $('#bCalm'); if (bc) bc.onclick = () => { G.meta.calm = !calmOn(); G.saveMeta(); S.click(); showSheet('gear'); };
    const ba = $('#bAuto'); if (ba) ba.onclick = () => { G.autoSpend(); S.click(); showSheet('stats'); };
    const baa = $('#bAutoAll'); if (baa) baa.onclick = () => { G.meta.autoPts = !G.meta.autoPts; G.saveMeta(); if (G.meta.autoPts && r.points > 0) G.autoSpend(); S.click(); showSheet('stats'); };
    const bf = $('#bFocus'); if (bf) bf.onclick = () => { S.click(); focusPick(tab); };
    const bft = $('#bFate'); if (bft) bft.onclick = () => { S.click(); fatePick(tab); };
    $('#bClose').onclick = () => { S.click(); ovClose(); buildControls(); pendingPicks(); };
  }
  // Dein Build (build.js): Name, die stärksten Richtungen, der Fokus-Knopf und die Schicksalspunkte
  function buildLine(r, d) {
    const p = A.Build.profile(r, d), col = p.first ? A.BUILD_DIRS[p.first].col : 'var(--mist)';
    const nf = Object.values(r.fate || {}).reduce((a, n) => a + n, 0), fb = (r.fatePts > 0 || nf) ? `<button id="bFate"${r.fatePts > 0 ? ' class="goldc"' : ''}>${L('Schicksal', 'Fate')} ${r.fatePts > 0 ? `<b>+${r.fatePts}</b>` : nf} ▾</button>` : '';
    return `<div class="mini bld">${L('Build', 'Build')}: <b style="color:${col}">${esc(A.Build.name(p))}</b>${p.top.length ? ` <span>(${esc(A.Build.summary(p))})</span>` : ''}<button id="bFocus">${r.focus ? L('Fokus: ', 'Focus: ') + esc(A.Build.dirName(r.focus)) : L('Fokus', 'Focus')} ▾</button>${fb}</div>`;
  }
  // Schicksalspunkte (build.js, data.js A.FATE): je Welt-Boss und Hauptmann einer; eine Richtung wählen, höchstens 3 je Richtung
  function fatePick(tab) {
    const r = G.run, p = A.Build.profile(r), pts = r.fatePts || 0, mine = [p.first, p.second].filter(Boolean);
    const keys = Object.keys(A.BUILD_DIRS).filter(k => A.FATE[k]).sort((a, b) => (mine.includes(b) - mine.includes(a)) || ((p.score[b] || 0) - (p.score[a] || 0)) || a.localeCompare(b));
    const rows = keys.map(k => {
      const D = A.BUILD_DIRS[k], n = A.Build.fateLv(k, r), full = n >= A.FATE_MAX, pips = Array.from({ length: A.FATE_MAX }, (_, i) => `<i class="${i < n ? 'on' : ''}"></i>`).join('');
      const now = n ? `<b class="goldc">${L('Jetzt', 'Now')}:</b> ${esc(A.Build.fateText(k, n))}` : '';
      return `<div class="skill ${full ? 'on' : ''} ${pts && !full ? '' : 'off'}" data-fate="${k}"><div class="si">${ic(D.icon, 30)}</div><div style="flex:1;min-width:0"><div class="nm" style="color:${D.col}">${esc(t(D.name))}${mine.includes(k) ? ` <span class="mini goldc">${L('dein Build', 'your build')}</span>` : ''} <span class="pips fate">${pips}</span></div><div class="ds">${n ? now + (full ? ` <span class="mini">(${L('voll', 'maxed')})</span>` : '') : esc(A.Build.fateText(k, 1))}</div></div></div>`;
    }).join('');
    const sub = pts ? L(`Du hast <b class="goldc">${pts}</b> Schicksalspunkt${pts > 1 ? 'e' : ''}. Jeder gibt der Richtung einen festen Bonus und zählt ${A.FATE_W} Punkte für deinen Build: passende Beute kommt öfter. Höchstens ${A.FATE_MAX} je Richtung.`, `You have <b class="goldc">${pts}</b> fate point${pts > 1 ? 's' : ''}. Each gives the direction a fixed bonus and counts ${A.FATE_W} points for your build: fitting loot drops more often. At most ${A.FATE_MAX} per direction.`)
      : L('Keine Punkte offen. Neue gibt es für jeden Welt-Boss und Hauptmann.', 'No points left. You get new ones for every world boss and captain.');
    ov(`<h2 class="mid">${ic('u_star', 30)}${L('Schicksal', 'Fate')}</h2><div class="sub">${sub}</div>${rows}<button class="btn" id="bClose"${pts ? '' : ' data-esc'}>${pts ? L('Später', 'Later') : t(U.back)}</button>`);
    overlay.querySelectorAll('[data-fate]').forEach(el => el.onclick = () => {
      const k = el.dataset.fate; if (!G.fateSpend(k)) return;
      S.buy(); A.FX.banner(L('Schicksal', 'Fate') + ': ' + t(A.BUILD_DIRS[k].name), A.Build.fateText(k, A.Build.fateLv(k)), A.BUILD_DIRS[k].col, 2);
      if (Wd.W) Wd.refreshHero();
      if (G.run.fatePts > 0) fatePick(tab); else if (tab) showSheet(tab); else { ovClose(); pendingPicks(); }
    });
    $('#bClose').onclick = () => { S.click(); if (G.run.fatePts > 0) G.fateLater(); if (tab) showSheet(tab); else { ovClose(); pendingPicks(); } };
  }
  // Fokus wählen: eine Richtung, die ab jetzt mehr zählt (Beute, Händler, Truhen, Schrein), oder automatisch
  function focusPick(tab) {
    const r = G.run, p = A.Build.profile(r);
    const rows = Object.keys(A.BUILD_DIRS).map(k => { const D = A.BUILD_DIRS[k], sc = p.score[k] || 0; return `<div class="skill ${r.focus === k ? 'on' : ''}" data-focus="${k}"><div class="si">${ic(D.icon, 30)}</div><div style="flex:1;min-width:0"><div class="nm" style="color:${D.col}">${esc(t(D.name))}${sc ? ` <span class="mini">${Math.round(sc * 10) / 10}</span>` : ''}</div><div class="ds">${esc(t(D.noun))}</div></div></div>`; }).join('');
    ov(`<h2 class="mid">${L('Fokus', 'Focus')}</h2><div class="sub">${L('Welche Richtung soll dein Build nehmen? Beute, Händler, Truhen und Schrein-Segen richten sich danach (zählt wie 3 Punkte). Ohne Fokus entscheidet, was du trägst und kannst.', 'Which direction should your build take? Loot, merchants, chests and shrine blessings follow it (counts as 3 points). Without a focus, what you wear and know decides.')}</div>
      <div class="skill ${r.focus ? '' : 'on'}" data-focus=""><div class="si">${ic('u_star', 30)}</div><div><div class="nm">${L('Automatisch', 'Automatic')}</div><div class="ds">${L('Das Spiel schaut, was du spielst.', 'The game looks at what you play.')}</div></div></div>${rows}
      <button class="btn" id="bClose" data-esc>${t(U.back)}</button>`);
    overlay.querySelectorAll('[data-focus]').forEach(el => el.onclick = () => { G.setFocus(el.dataset.focus || null); S.click(); showSheet(tab); });
    $('#bClose').onclick = () => { S.click(); showSheet(tab); };
  }
  // Build-Übersicht: wie viele Teile je Element, welche Boni laufen, welche Kräfte wirken
  function buildHtml(r) {
    const sum = A.Gear.summary(r);
    const chips = Object.keys(A.ELEMENTS).map(el => { const E = A.ELEMENTS[el], n = sum.count[el] || 0, tr = sum.tier[el] || 0; return `<div class="elc ${n ? 'on' : ''}" style="--ec:${E.col}" title="${esc(t(E.name))}">${ic(E.icon, 18)}<b>${n}</b><span class="pips">${A.EL_TIERS.map((k, i) => `<i class="${tr > i ? 'on' : ''}"></i>`).join('')}</span></div>`; }).join('');
    const bon = [];
    for (const el of Object.keys(A.ELEMENTS)) {
      const E = A.ELEMENTS[el], n = sum.count[el] || 0, tr = sum.tier[el] || 0;
      for (let i = 0; i < tr; i++) bon.push(`<div class="eld on">${ic(E.icon, 14)}<span><b style="color:${E.col}">${esc(t(E.name))} ${A.EL_TIERS[i]}:</b> ${esc(t(E.tiers[i]))}</span></div>`);
      if (n && tr < 3) bon.push(`<div class="eld next">${ic(E.icon, 14)}<span><b style="color:${E.col}">${esc(t(E.name))} ${n}/${A.EL_TIERS[tr]}:</b> ${esc(t(E.tiers[tr]))}</span></div>`);
    }
    const pws = Object.keys(sum.pw).map(id => powerHtml({ id, v: sum.pw[id] }, sum.pwN[id])).join('') + (Object.values(sum.pwN).some(n => n > 1) ? `<div class="mini">${L('Gleiche Kräfte stapeln: jedes weitere Stück zählt halb dazu.', 'Equal powers stack: every extra piece adds half.')}</div>` : '');
    return `<h3>${L('Dein Build', 'Your build')}</h3><div class="elgrid">${chips}</div>
      ${bon.join('') || `<div class="mini" style="margin-bottom:8px">${L('Trage 2 Teile mit demselben Element für einen Bonus. 4 und 6 Teile schalten stärkere Boni frei. Die Schmiede ändert Elemente.', 'Wear 2 pieces of the same element for a bonus. 4 and 6 pieces unlock stronger ones. The forge changes elements.')}</div>`}
      ${pws ? `<div class="pwbox">${pws}</div>` : ''}<h3>${L('Angelegt', 'Equipped')}</h3>`;
  }
  function skillPick() {
    const r = G.run; const offer = G.skillOffer();
    if (!offer.length) { r.pendingSkillPick = 0; G.save(); return; }
    S.level();
    ov(`<h2>${ic('u_scroll', 30)}${t(U.newSkill)}</h2>${offer.map(id => { const sk = A.SKILLS[id]; return `<div class="skill" data-pick="${id}"><div class="si">${skIcon(id, 36)}</div><div><div class="nm">${t(sk.name)}</div><div class="ds">${t(sk.desc)}</div></div><div class="cd">${cdTxt(id)}</div></div>`; }).join('')}`);
    overlay.querySelectorAll('[data-pick]').forEach(el => el.onclick = () => { const id = el.dataset.pick; S.click(); chooseSlot(id, (rep) => { G.learnSkill(id, rep); S.buy(); ovClose(); buildControls(); pendingPicks(); }); });
  }
  // Offene Wahlen nacheinander zeigen (Stufenaufstieg, dann Segen); wartet, solange ein anderes Fenster offen ist
  function pendingPicks() {
    const r = G.run; if (!r || r.over || !dungeonEl.classList.contains('on')) return;
    const fate = G.fateOpen() && !r.fateLater && !(Wd.W && (Wd.W.active || !Wd.W.hero.alive));   // Schicksalspunkt: erst, wenn der Raum frei ist
    if (!(r.pendingSkillPick > 0) && !(r.pendingBoon > 0) && !fate) return;
    if (overlay.classList.contains('on')) { setTimeout(pendingPicks, 600); return; }
    if (r.pendingSkillPick > 0) skillPick(); else if (r.pendingBoon > 0) boonPick(); else fatePick();
  }
  // Alle Zauber-Knöpfe belegt? Dann fragen, welcher Platz frei wird (der alte bleibt im Zauberbuch)
  function chooseSlot(id, done) {
    const r = G.run, d = G.derived();
    if (r.active.includes(id) || r.active.length < d.skillSlots) { done(null); return; }
    const sk = A.SKILLS[id];
    ov(`<div class="center"><div class="bigicon">${skIcon(id, 54)}</div><h2 class="mid">${esc(t(sk.name))}</h2><div class="sub">${L(`Alle ${d.skillSlots} Zauber-Knöpfe sind belegt. Welchen Zauber ersetzen? Der alte bleibt im Zauberbuch (Heldenbild oben links) und lässt sich später wieder tauschen.`, `All ${d.skillSlots} spell buttons are taken. Which spell should it replace? The old one stays in your spell book (hero picture top left).`)}</div></div>
      ${r.active.map(a => `<div class="skill" data-rep="${a}"><div class="si">${skIcon(a, 36)}</div><div><div class="nm">${esc(A.Boons.skName(a))}</div><div class="ds">${esc(t(A.SKILLS[a].desc))}</div></div><div class="cd">${L('ersetzen', 'replace')}</div></div>`).join('')}
      <button class="btn" id="bBook">${ic('u_scroll', 22)}${L('Nur ins Zauberbuch legen', 'Just add to spell book')}</button>`);
    overlay.querySelectorAll('[data-rep]').forEach(el => el.onclick = () => { S.click(); done(el.dataset.rep); });
    $('#bBook').onclick = () => { S.click(); done(null); };
  }
  // ---------- Segen am Schrein: 3 Angebote (neuer Zauber, passiver Effekt, Verstärkung) ----------
  function boonText(b) {
    if (b.type === 'spell') { const sk = A.SKILLS[b.id]; return { tg: L('Neuer Zauber', 'New spell'), nm: t(sk.name), ds: t(sk.desc), cd: cdTxt(b.id), icon: skIcon(b.id, 40) }; }
    if (b.type === 'talent') { const T = A.TALENTS[b.id]; return { tg: L('Passiv', 'Passive'), nm: t(T.name), ds: t(T.desc), cd: '', icon: talIcon(b.id, 34) }; }
    const u = A.Boons.upgOf(b.id) + 1, nm = t(A.SKILLS[b.id].name) + ' ' + ['', 'II', 'III'][u];
    return { tg: L('Verstärkung', 'Upgrade'), nm, ds: L(`Dein Zauber wird 30 % stärker und lädt 20 % schneller.`, `Your spell gets 30% stronger and recharges 20% faster.`), cd: '', icon: skIcon(b.id, 40) };
  }
  function boonPick() {
    const r = G.run, d = G.derived(); if (!(r.pendingBoon > 0)) return;
    const awake = G.takeCombos(); if (awake.length) { comboWin(awake, () => { ovClose(); boonPick(); }); return; }   // bereite Kombos erwachen zuerst
    const offer = G.boonOffer();
    if (!offer.length) { G.skipBoon(); return; }
    S.level();
    const nT = (r.talents || []).length;
    ov(`<h2>${ic('u_star', 30)}${L('Wähle einen Segen', 'Choose a blessing')}</h2>
      <div class="sub center">${L('Der Schrein flüstert. Eins davon darfst du behalten.', 'The shrine whispers. You may keep one of these.')}<br><span class="mini">${L('Zauber', 'Spells')} ${r.active.length}/${d.skillSlots} · ${L('Passiv', 'Passive')} ${nT}/${d.talentSlots}</span></div>
      ${offer.map((b, i) => { const x = boonText(b), cb = A.Combos.completes(b, r, d); return `<div class="skill boon ${b.type} ${cb.length ? 'hascombo' : ''}" data-b="${i}" tabindex="0"><div class="si">${x.icon}</div><div><div class="tg ${b.type}">${x.tg}</div><div class="nm">${esc(x.nm)}</div><div class="ds">${esc(x.ds)}</div>${cb.map(id => `<div class="cbhint">${cbIcon(id, 14)}<span>${L('Weckt die Kombo', 'Awakens the combo')} ${esc(t(A.COMBOS[id].name))}</span></div>`).join('')}</div><div class="cd">${x.cd}</div></div>`; }).join('')}
      <button class="btn" id="bSkip">${L('Verzichten', 'Skip')} ${coin('+' + G.boonGold())}</button>`);
    overlay.querySelectorAll('[data-b]').forEach(el => el.onclick = () => {
      const b = offer[+el.dataset.b]; S.click();
      const finish = (rep) => {
        G.takeBoon(b, rep); S.buy();
        const woke = G.takeCombos();   // macht der Segen eine Kombo ganz, erwacht sie gleich hier
        const done = () => {
          ovClose(); buildControls(); const x = boonText(b), cb = woke.length && A.COMBOS[woke[0].id];
          if (cb) A.FX.banner(t(cb.name), L('Kombo erwacht!', 'Combo awakened!'), '#fee761', 2.4); else A.FX.banner(x.nm, x.tg, b.type === 'talent' ? '#63c74d' : b.type === 'upg' ? '#feae34' : '#7fd8ff', 1.8);
          if (Wd.W) A.FX.ev('nova', { e: Wd.W.hero, r: cb ? 140 : 90, color: cb ? '#fee761' : '#2ce8f5', magic: true });
          pendingPicks();
        };
        if (woke.length) comboWin(woke, done); else done();
      };
      if (b.type === 'spell') chooseSlot(b.id, finish);
      else if (b.type === 'talent' && nT >= d.talentSlots) chooseTalent(b, finish);
      else finish(null);
    });
    $('#bSkip').onclick = () => { const g = G.skipBoon(); S.coin(); ovClose(); A.FX.banner('+' + g + ' ' + t(U.gold), null, '#feae34', 1.4); pendingPicks(); };
  }
  // Kombo erwacht (am Schrein): goldenes Fenster mit allem, was gerade erwacht
  function comboWin(list, done) {
    S.level(); setTimeout(() => S.drop('legendary'), 260);
    const tag = (x) => x.first ? `${L('Neu im Kombo-Buch', 'New in the combo book')} ${spark('+' + A.COMBO_SPARKS, 14)}` : L('Erwacht', 'Awakened');
    ov(`<div class="center"><div class="bigicon">${ic('u_star', 54)}</div><h2 class="mid goldc">${list.length > 1 ? L(`${list.length} Kombos erwachen!`, `${list.length} combos awaken!`) : L('Eine Kombo erwacht!', 'A combo awakens!')}</h2>
      <div class="sub">${L('Zwei Teile passen zusammen. Daraus wird etwas, das es nur zusammen gibt.', 'Two pieces fit together. They become something that only exists together.')}</div></div>
      ${list.map(x => comboCard(x.id, tag(x), 'woke', 26, `<div class="fl">${esc(t(A.COMBOS[x.id].flavor))}</div><div class="rc">${esc(A.Combos.recipe(x.id))}</div>`)).join('')}
      <button class="btn primary" id="bCombo" data-esc>${L('Weiter', 'Continue')}</button>`);
    $('#bCombo').onclick = () => { S.click(); done(); };
  }
  // Kombo bereit (beide Teile da, aber noch nicht erwacht): kurz melden, sobald kein Fenster offen ist
  function comboNews() {
    const r = G.run; if (!r || r.over) return;
    const ids = G.comboFresh(); if (!ids.length) return;
    const say = () => {
      if (!dungeonEl.classList.contains('on') || G.run !== r) return;
      if (overlay.classList.contains('on')) { setTimeout(say, 700); return; }
      const left = ids.filter(id => !(r.combos || []).includes(id)); if (!left.length) return;   // inzwischen schon am Schrein erwacht
      const many = left.length > 1;
      A.FX.banner((many ? L('Kombos bereit: ', 'Combos ready: ') : L('Kombo bereit: ', 'Combo ready: ')) + left.map(id => t(A.COMBOS[id].name)).join(' · '), many ? L('Am nächsten Schrein erwachen sie.', 'They awaken at the next shrine.') : L('Am nächsten Schrein erwacht sie.', 'It awakens at the next shrine.'), '#fee761', 3);
      S.drop('epic');
    };
    setTimeout(say, 450);
  }
  // Alle Talent-Plätze voll: eins wird ersetzt
  function chooseTalent(b, done) {
    const r = G.run, T = A.TALENTS[b.id];
    ov(`<div class="center"><div class="bigicon">${talIcon(b.id, 48)}</div><h2 class="mid">${esc(t(T.name))}</h2><div class="sub">${L('Alle Plätze für passive Segen sind voll. Welchen gibst du dafür her? Er ist dann weg.', 'All passive slots are full. Which one do you give up? It will be gone.')}</div></div>
      ${r.talents.map(id => `<div class="skill" data-rep="${id}"><div class="si">${talIcon(id, 30)}</div><div><div class="nm">${esc(t(A.TALENTS[id].name))}</div><div class="ds">${esc(t(A.TALENTS[id].desc))}</div></div><div class="cd">${L('hergeben', 'give up')}</div></div>`).join('')}
      <button class="btn" id="bClose">${t(U.back)}</button>`);
    overlay.querySelectorAll('[data-rep]').forEach(el => el.onclick = () => { S.click(); done(el.dataset.rep); });
    $('#bClose').onclick = () => { S.click(); boonPick(); };
  }

  // ---------- Räume ----------
  function rest() {
    ov(`<div class="bigicon">${ic('flame', 60)}</div><h2 class="mid">${t(U.node.rest)}</h2><div class="sub center">${L('Ein Feuer. Endlich. Niemand will dich fressen. Vorerst.', 'A fire. Finally. Nothing wants to eat you. For now.')}</div>
      <button class="btn primary" id="bHeal">${ic('u_heart', 22)}${L(`Ausruhen (+${Math.round(50 * (1 - A.gradeVal('restCut', G.run)))} % Leben)`, `Rest (+${Math.round(50 * (1 - A.gradeVal('restCut', G.run)))}% health)`)}</button><button class="btn" id="bTrain">${ic('u_star', 22)}${t(U.train)}</button>`);
    $('#bHeal').onclick = () => { G.doRest('heal'); Wd.W.hero.hp = G.run.hp; S.heal(); ovClose(); };
    $('#bTrain').onclick = () => { G.doRest('train'); S.buy(); ovClose(); };
  }
  function eventScreen() {
    const r = G.run, ev = r.currentEvent;
    ov(`<div class="bigicon">${ic('statue', 51)}</div><h2 class="mid">${t(ev.title)}</h2><div class="msg">${t(ev.text)}</div>${ev.choices.map((c, i) => `<button class="btn ${i === 0 ? 'primary' : ''}" data-c="${i}" ${c.needItem && !r.bag.length ? 'disabled' : ''}>${t(c.text)}</button>`).join('')}`);
    overlay.querySelectorAll('[data-c]').forEach(b => b.onclick = () => { const res = G.doEvent(+b.dataset.c); S.click(); r.currentEvent = null; Wd.W.hero.hp = r.hp; hudUpdate();
      const show = () => {
        ov(`<h2 class="mid">${t(ev.title)}</h2><div class="msg">${esc(res.msg)}</div>${res.items.map(lootRow).join('')}${res.items.length ? `<div class="mini">${L('Liegt im Beutel. Antippen zum Vergleichen und Anlegen.', 'Now in your bag. Tap to compare and equip.')}</div>` : ''}<button class="btn primary" id="bClose">${t(U.leave)}</button>`);
        bindCmp(show); $('#bClose').onclick = () => { S.click(); ovClose(); };
      };
      show(); });
  }
  function shop() {
    const r = G.run;
    const items = r.shopItems.map((s, i) => s ? itemHtml(s.it, `<button class="${r.gold >= s.price ? 'primary' : ''}" data-buy="${i}" ${r.gold >= s.price ? '' : 'disabled'}>${t(U.buy)} ${coin(s.price)}</button>`, vChip(s.it), 'tap', `data-shop="${i}"`) : '').join('');
    const bag = r.bag.map(it => itemHtml(it, `<button data-sell="${it.uid}">${t(U.sell)} ${coin(G.sellValue(it))}</button>`, vChip(it), 'tap', `data-cmp="${it.uid}"`)).join('');
    const pp = G.potionPrice(), canPot = r.gold >= pp;
    ov(`<div class="bigicon">${A.Art.img('merchant', 64)}</div><h2 class="mid">${t(U.node.shop)}</h2><div class="sub center">${L('«Alles frisch. Fast alles. Keine Rückgabe.»', '"All fresh. Mostly. No returns."')}<br>${L('Dein Gold', 'Your gold')}: <b class="goldc">${coin(r.gold)}</b></div>${items.length ? `<div class="mini" style="margin:-6px 0 8px;text-align:center">${L('Antippen: Vergleich mit dem, was du trägst.', 'Tap: compare with what you wear.')}</div>` : ''}${items}
      <div class="item" style="--rc:#e43b44"><div class="ic">${ic('potion', 36)}</div><div class="bd"><div class="nm">${t(U.potion)}</div><div class="ln">+${Math.round(G.potionPct() * 100)} % ${t(U.hp)}</div></div><div class="act"><button class="${canPot ? 'primary' : ''}" id="bPot" ${canPot ? '' : 'disabled'}>${t(U.buy)} ${coin(pp)}</button></div></div>
      ${bag ? `<h3>${t(U.bag)}</h3>${bag}` : ''}<button class="btn primary" id="bClose">${t(U.leave)}</button>`);
    overlay.querySelectorAll('[data-buy]').forEach(b => b.onclick = () => { if (G.buy(+b.dataset.buy)) { S.buy(); shop(); } });
    overlay.querySelectorAll('[data-sell]').forEach(b => b.onclick = () => { G.sell(r.bag.find(x => x.uid === b.dataset.sell)); S.buy(); shop(); });
    overlay.querySelectorAll('[data-shop]').forEach(el => el.onclick = (e) => { if (e.target.closest('[data-buy]')) return; const i = +el.dataset.shop, s = r.shopItems[i]; if (!s) return; S.click(); compareView(s.it, { ctx: 'shop', idx: i, price: s.price, back: shop }); });
    bindCmp(shop);
    $('#bPot').onclick = () => { if (G.buyPotion()) { S.buy(); shop(); } };
    $('#bClose').onclick = () => { S.click(); ovClose(); };
  }
  // ---------- Schmiede: Werte, Kraft oder Element neu schmieden ----------
  function forge(hl) {
    const r = G.run;
    const row = (it) => {
      const b = (kind, label) => { if (!G.canForge(it, kind)) return ''; const c = G.forgeCost(it, kind), ok = r.gold >= c; return `<button class="${ok ? 'primary' : ''}" data-f="${kind}" data-uid="${it.uid}" ${ok ? '' : 'disabled'}><span>${label}</span><span class="fc">${coin(c)}</span></button>`; };
      const acts = b('stats', L('Werte', 'Stats')) + b('power', it.power ? L('Kraft', 'Power') : L('Kraft +', 'Power +')) + b('el', L('Element', 'Element'));
      return itemHtml(it, acts || `<span class="mini">${L('Einzelstück', 'One of a kind')}</span>`, undefined, 'fitem' + (it.uid === hl ? ' forged' : ''));
    };
    const worn = A.SLOTS.map(s => r.gear[s]).filter(Boolean);
    ov(`<div class="bigicon">${A.Art.img('smith', 56)}</div><h2 class="mid">${t(U.node.forge)}</h2>
      <div class="sub center">${L('«Ich schmiede alles. Ausser Ausreden.»', '"I forge anything. Except excuses."')}<br>${L('Dein Gold', 'Your gold')}: <b class="goldc">${coin(r.gold)}</b></div>
      <div class="mini fhelp">${L('<b>Werte</b>: neue Zufallswerte. <b>Kraft</b>: eine neue besondere Kraft (ab selten). <b>Element</b>: du wählst eins von sechs. Einzelstücke, Trophäen und Legenden bleiben, wie sie sind.', '<b>Stats</b>: new random stats. <b>Power</b>: a new special power (rare and up). <b>Element</b>: pick one of six. Uniques, trophies and legends stay as they are.')}</div>
      <h3>${L('Angelegt', 'Equipped')}</h3>${worn.map(row).join('')}
      ${r.bag.length ? `<h3>${t(U.bag)}</h3>${r.bag.map(row).join('')}` : ''}
      <button class="btn primary" id="bClose">${t(U.leave)}</button>`, hl ? 'nopop' : '');
    const find = (uid) => worn.concat(r.bag).find(x => x.uid === uid);
    overlay.querySelectorAll('[data-f]').forEach(b => b.onclick = () => {
      const it = find(b.dataset.uid), kind = b.dataset.f; if (!it) return;
      if (kind === 'el') { S.click(); forgeElement(it); return; }
      if (G.forge(it, kind)) { S.forge(); forge(it.uid); }
    });
    if (hl) { const el = overlay.querySelector('.item.forged'); if (el && el.scrollIntoView) el.scrollIntoView({ block: 'center' }); }
    $('#bClose').onclick = () => { S.click(); ovClose(); };
  }
  function forgeElement(it) {
    const r = G.run, cost = G.forgeCost(it, 'el'), worn = A.SLOTS.some(s => r.gear[s] === it), c = A.Gear.counts(r);
    ov(`<div class="center"><div class="bigicon">${itIcon(it, 54)}</div><h2 class="mid">${L('Element wählen', 'Choose element')}</h2><div class="sub">${esc(G.itemName(it))} · ${coin(cost)}</div></div>
      ${Object.keys(A.ELEMENTS).map(el => { const E = A.ELEMENTS[el], cur = it.el === el, n = (c[el] || 0) - (worn && cur ? 1 : 0);
        const info = worn ? (cur ? `<div class="mini">${L('Hat dieses Element schon.', 'Already has this element.')}</div>` : elDelta({ el }, it) || `<div class="mini">${L(`Du trägst dann ${n + 1} Teile`, `You will wear ${n + 1} pieces`)}</div>`) : `<div class="mini">${L(`Du trägst ${c[el] || 0} Teile. Ab 2 Teilen`, `You wear ${c[el] || 0} pieces. At 2 pieces`)}: ${esc(t(E.tiers[0]))}</div>`;
        return `<div class="skill elpick ${cur ? 'on' : ''}" data-el="${el}" style="--ec:${E.col}"><div class="si">${ic(E.icon, 28)}</div><div style="flex:1;min-width:0"><div class="nm" style="color:${E.col}">${esc(t(E.name))}</div>${info}</div></div>`; }).join('')}
      <button class="btn" id="bClose">${t(U.back)}</button>`);
    overlay.querySelectorAll('[data-el]').forEach(b => b.onclick = () => { if (G.forge(it, 'el', b.dataset.el)) { S.forge(); forge(it.uid); } });
    $('#bClose').onclick = () => { S.click(); forge(); };
  }
  function treasure() {
    const res = G.treasure(); let fresh = null;
    for (const it of res.items) { G.addToBag(it); const lg = G.legendFound(it); if (lg && lg.first) fresh = lg; }   // ein verrücktes Stück kann auch in einer normalen Truhe liegen
    const wild = res.items.some(it => it.legend);
    S.loot(wild ? 'legendary' : res.items.some(it => it.rarity === 'legendary' || it.rarity === 'epic') ? 'epic' : 'rare'); if (fresh) S.level();
    const show = () => {
      ov(`<div class="bigicon">${ic('chest', 72)}</div><h2 class="mid">${t(U.node.treasure)}</h2><div class="msg">${wild ? L('Eine Truhe. Darin: etwas sehr Seltsames.', 'A chest. Inside: something very strange.') : L('Eine Truhe. Unverschlossen. Verdächtig.', 'A chest. Unlocked. Suspicious.')} <b class="goldc">+${coin(res.gold)}</b></div>${res.items.map(lootRow).join('')}${legNewHtml(fresh)}<div class="mini">${L('Liegt im Beutel. Antippen zum Vergleichen und Anlegen.', 'Now in your bag. Tap to compare and equip.')}</div><button class="btn primary" id="bClose">${t(U.leave)}</button>`);
      bindCmp(show); $('#bClose').onclick = () => { S.click(); ovClose(); };
    };
    show();
  }
  // Truhe im geheimen Raum: viel Gold, ein gutes Stück und oft die Legende dieser Welt
  function secretTreasure() {
    const res = G.secretChest(); let fresh = null;
    for (const it of res.items) { G.addToBag(it); const lg = G.legendFound(it); if (lg && lg.first) fresh = lg; }
    S.loot(res.legend ? 'legendary' : 'epic'); if (fresh) S.level();
    const show = () => {
      ov(`<div class="bigicon legicon">${Art.img('chest', 72, { m: '#68386c', M: '#b55088', N: '#3e2731', n: '#262b44' }, 'secret')}</div><h2 class="mid goldc">${L('Geheime Truhe', 'Secret chest')}</h2><div class="msg">${res.legend ? L('Jemand hat hier etwas versteckt. Jemand mit Geschmack.', 'Someone hid something here. Someone with taste.') : L('Jemand hat hier etwas versteckt. Nicht das Allerbeste, aber immerhin.', 'Someone hid something here. Not the very best, but still.')} <b class="goldc">+${coin(res.gold)}</b></div>${res.items.map(lootRow).join('')}${legNewHtml(fresh)}<div class="mini">${L('Liegt im Beutel. Antippen zum Vergleichen und Anlegen.', 'Now in your bag. Tap to compare and equip.')}</div><button class="btn primary" id="bClose">${t(U.leave)}</button>`);
      bindCmp(show); $('#bClose').onclick = () => { S.click(); ovClose(); };
    };
    show();
  }

  // ---------- Ende ----------
  // Fairer Tod (v40): ein Tipp zu dem, was dich erwischt hat, dazu ein Hinweis auf Punkte oder Tränke, die noch übrig waren
  function deathTips(r) {
    const by = r.deathBy || {}, k = by.kind, tips = [];
    tips.push(k === 'burn' ? L('Feuer brennt nach dem Treffer weiter. Raus aus den Flammen, dann trinken.', 'Fire keeps burning after the hit. Get out of the flames, then drink.')
      : k === 'poison' ? L('Gift wirkt noch eine Weile nach. Lieber zu früh trinken als zu spät.', 'Poison lingers for a while. Better drink too early than too late.')
      : k === 'rock' ? L('Wo Staub von der Decke rieselt, kommt gleich ein Stein. Kurz zur Seite.', 'Where dust trickles from the ceiling, a rock follows. Step aside.')
      : k === 'lava' ? L('Glühender Boden wird gleich zu Lava. Nicht darauf stehen bleiben.', 'Glowing ground is about to turn into lava. Do not stand on it.')
      : k === 'pot' ? L('Ein Knallkrug zischt eine Sekunde lang. Das ist dein Zeichen zu gehen.', 'A blast jar hisses for one second. That is your cue to leave.')
      : by.boss ? L('Bosse halten bei halbem und bei viertel Leben kurz inne und holen dann zum grossen Angriff aus. Dann raus aus dem Warnkreis.', 'Bosses pause at half and at a quarter of their health, then wind up their big attack. Get out of the warning circle.')
      : by.cap ? L('Hauptleute haben eine Masche, und ihr Spruch verrät sie meistens. Zuhören lohnt sich.', 'Captains have a trick, and their shout usually gives it away. Listen.')
      : by.elite ? L('Die Eigenschaften einer Elite stehen oben im Balken. Erst lesen, dann reinlaufen.', 'An elite\'s traits are listed in the bar at the top. Read first, then charge in.')
      : L('Warnkreise am Boden zeigen, wo gleich etwas einschlägt. Ausweichen lohnt sich.', 'Warning circles on the ground show where something is about to hit. Dodging pays off.'));
    if (r.points > 0 && !G.meta.autoPts) tips.push(L(`Du hattest noch ${r.points} Punkte nicht verteilt. Im Heldenblatt gibt es dafür «Immer automatisch».`, `You still had ${r.points} unspent points. The hero sheet has «Always automatic» for that.`));
    else if (r.potions > 0) tips.push(L(`Du hattest noch ${r.potions} ${r.potions === 1 ? 'Trank' : 'Tränke'} dabei. Trink, sobald dein Leben rot wird.`, `You still had ${r.potions} potion${r.potions === 1 ? '' : 's'}. Drink as soon as your health turns red.`));
    return tips;
  }
  // Was reicht im Lager jetzt? Das günstigste Gebäude (sonst ein Volk), für den Ende-Bildschirm
  function campNext() {
    const m = G.meta, can = A.CAMP.filter(b => G.campOpen(b.id) && G.campCost(b.id) != null && G.campCost(b.id) <= m.sparks).sort((a, b) => G.campCost(a.id) - G.campCost(b.id));
    if (can.length) { const b = can[0]; return t(b.name) + ' ' + L(`(Stufe ${G.campLevel(b.id) + 1})`, `(level ${G.campLevel(b.id) + 1})`) + (can.length > 1 ? L(` und ${can.length - 1} mehr`, ` and ${can.length - 1} more`) : ''); }
    const race = A.META_SHOP.find(u => u.effect.race && !m.unlocked.includes(u.id) && u.cost <= m.sparks);
    return race ? t(race.name) : null;
  }
  function runOver() {
    const r = G.run; if (!r) return;
    if (!r.over) { r.over = true; G.finishRun(); }
    Portal.gameplayStop();
    overlay.classList.remove('on'); overlay.innerHTML = '';
    const won = r.won, home = r.home, g = A.gradeOf(r), Cl = A.CLASSES.find(c => c.id === r.cls);   // home: 'boss' = nach einem Welt-Boss heimgekehrt, 'exit' = am Ausgang (v39)
    const died = !home, cause = died ? A.Achieve.causeText({ by: r.deathBy }) : '', next = campNext();   // Fairer Tod (v40)
    const head = home === 'exit' || (home && won) ? L('Sieg! Heimgekehrt.', 'Victory! Home again.') : home ? L('Heimgekehrt!', 'Home again!') : won ? t(U.victory) : t(U.runOver);   // schon am Ausgang vorbei und später nach einem Boss heim: auch ein Sieg
    const msg = home === 'exit' ? L(`Der Ausgang war zu. Also bist du die Treppe hoch. Alle ${r.floor} Ebenen. Zu Fuss.`, `The exit was closed. So you took the stairs. All ${r.floor} floors. On foot.`)
      : home && won ? L(`Am Ausgang vorbei, noch tiefer, noch ein Boss. Dann die Treppe hoch, alle ${r.floor} Ebenen. Sieger dürfen das.`, `Past the exit, deeper still, one more boss. Then up the stairs, all ${r.floor} floors. Winners get to do that.`)
      : home ? L('Boss besiegt, Beute eingesteckt, ab nach Hause. Vernünftig.', 'Boss down, loot pocketed, off home. Sensible.') : won ? t(U.win) : '';
    show(`<div class="center fade-in" style="padding-top:5vh">
      <div class="bigicon">${won || home === 'exit' ? ic('crown', 63) : home ? ic('u_tent', 60) : ic('u_skull', 60)}</div>
      <h2 class="mid">${head}</h2>
      ${msg ? `<div class="msg">${msg}</div>` : ''}<div class="sub">${home ? L(`Heimgekehrt von Ebene ${r.floor}`, `Went home from floor ${r.floor}`) : `${t(U.dead)} ${r.floor}`} (${esc(A.worldName(r.floor))}).${g ? ` ${L('Grad', 'Grade')} ${g}.` : ''}</div>
      ${died ? `<div class="deathbox"><div class="dby">${ic('u_skull', 20)}<b>${esc(cause.charAt(0).toUpperCase() + cause.slice(1))}.</b></div>${deathTips(r).map(x => `<div class="tip">${esc(x)}</div>`).join('')}</div>` : ''}
      ${r.gradeNew ? `<div class="msg gradenew">${ic('crown', 22)} <b>${L(`Neu: Grad ${r.gradeNew}`, `New: grade ${r.gradeNew}`)}</b> ${L('für', 'for')} ${esc(Cl ? t(Cl.name) : r.cls)}. <i>${esc(t(A.GRADES[r.gradeNew - 1].name))}</i>: ${esc(t(A.GRADES[r.gradeNew - 1].text))} ${L('Wähle ihn beim nächsten Helden.', 'Pick it with your next hero.')}</div>` : r.gradeTop ? `<div class="msg gradenew">${ic('crown', 22)} <b>${L('Grad 10 geschafft!', 'Grade 10 done!')}</b> ${L('Mehr Grade gibt es nicht. Noch nicht.', 'There are no more grades. Not yet.')}</div>` : ''}
      <div class="result"><div>${t(U.reached)}<b>${r.floor}</b></div><div>${t(U.level)}<b>${r.level}</b></div><div>${t(U.kills)}<b>${r.kills}</b></div><div>${t(U.gold)}<b>${r.gold}</b></div></div>
      ${(() => { const p = A.Build.profile(r); return p.first ? `<div class="mini">${L('Build', 'Build')}: <b style="color:${A.BUILD_DIRS[p.first].col}">${esc(A.Build.name(p))}</b></div>` : ''; })()}
      <div class="big">${spark('+' + r.sparksEarned, 40)}</div><div class="mini">${t(U.sparksEarned)}</div>
      ${r.sparksRecord || r.sparksBanners || r.sparksElite || r.sparksBook || r.sparksLegend || r.sparksCombo || r.sparksPet || r.sparksAch || r.sparksPact || r.sparksGrade || r.sparksHome || r.sparksCandle ? `<div class="mini extra">${[r.sparksHome ? L(`Heimkehren: +${r.sparksHome}`, `Going home: +${r.sparksHome}`) : '', r.sparksGrade ? L(`Grad ${g}: +${r.sparksGrade}`, `Grade ${g}: +${r.sparksGrade}`) : '', r.sparksRecord ? L(`Neuer Rekord: +${r.sparksRecord}`, `New record: +${r.sparksRecord}`) : '', r.sparksBanners ? L(`Wimpel für das Lager: +${r.sparksBanners}`, `Pennants for the camp: +${r.sparksBanners}`) : '', r.sparksElite ? L(`Elite-Gegner: +${r.sparksElite}`, `Elite enemies: +${r.sparksElite}`) : '', r.sparksBook ? L(`Elite-Buch: +${r.sparksBook}`, `Elite book: +${r.sparksBook}`) : '', r.sparksLegend ? L(`Neue Legenden: +${r.sparksLegend}`, `New legends: +${r.sparksLegend}`) : '', r.sparksCombo ? L(`Neue Kombos: +${r.sparksCombo}`, `New combos: +${r.sparksCombo}`) : '', r.sparksPet ? L(`Neue Begleiter: +${r.sparksPet}`, `New pets: +${r.sparksPet}`) : '', r.sparksAch ? L(`Erfolge: +${r.sparksAch}`, `Achievements: +${r.sparksAch}`) : '', r.sparksPact ? L(`Pakte: +${r.sparksPact}`, `Pacts: +${r.sparksPact}`) : '', r.sparksCandle ? L(`${r.candles === 1 ? 'Kerze' : 'Kerzen'} am Feuer: +${r.sparksCandle}`, `Campfire candle${r.candles === 1 ? '' : 's'}: +${r.sparksCandle}`) : ''].filter(Boolean).join(' · ')}</div>` : ''}
      ${r.achIds && r.achIds.length ? `<div class="mini extra"><b class="goldc">${L('Erfolg', 'Achievement')}:</b> ${esc(r.achIds.map(id => { const a = A.ACHIEVEMENTS.find(x => x.id === id); return a ? t(a.name) : id; }).join(' · '))}</div>` : ''}
      ${r.candleUp ? `<div class="mini extra candlemsg">${ic('candle', 18)} ${r.candles >= A.CANDLE_MAX ? L(`Alle ${A.CANDLE_MAX} Kerzen brennen. +${Math.round(A.CANDLE_SPARKS * A.CANDLE_MAX * 100)} % Funken auf jeden Lauf, solange du jeden Tag vorbeischaust.`, `All ${A.CANDLE_MAX} candles are burning. +${Math.round(A.CANDLE_SPARKS * A.CANDLE_MAX * 100)} % sparks on every run, as long as you drop by each day.`) : L(`Neue Kerze am Lagerfeuer (${r.candles}/${A.CANDLE_MAX}). Morgen wieder ein Lauf, dann brennt die nächste.`, `New candle at the campfire (${r.candles}/${A.CANDLE_MAX}). One run tomorrow and the next one burns.`)}</div>` : ''}
      ${next ? `<div class="mini extra">${L('Im Lager reicht es jetzt für:', 'In the camp you can now afford:')} <b class="goldc">${esc(next)}</b></div>` : ''}
      <div class="endbtns"><button class="btn ${died && !next ? 'primary' : ''}" id="bAgain">${ic('u_down', 26)}${L('Nochmal', 'Again')}</button><button class="btn ${died && !next ? '' : 'primary'}" id="bCamp">${ic('u_tent', 28)}${t(U.toCamp)}</button></div>
      <div class="mini">${L('Nochmal: derselbe Held', 'Again: the same hero')}${g ? L(`, Grad ${g}`, `, grade ${g}`) : ''}.</div></div>`);
    let left = false; const once = (f) => () => { if (left) return; left = true; f(); };   // nur ein Knopf, nur einmal
    $('#bCamp').onclick = once(() => { S.click(); G.clearRun(); Portal.showAd(() => camp()); });
    // Nochmal (v40): gleich der nächste Lauf mit Volk, Klasse und Grad von eben (Begleiter wie zuletzt gewählt)
    $('#bAgain').onclick = once(() => {
      S.buy(); const race = A.RACES.find(x => x.id === r.race), cls = A.CLASSES.find(x => x.id === r.cls), gr = cls && G.gradeMax(cls.id) ? Math.min(g, G.gradeMax(cls.id)) : undefined;
      G.clearRun();
      if (!race || !cls || !G.raceUnlocked(race) || !G.classUnlocked(cls)) { Portal.showAd(() => heroSelect()); return; }
      Portal.showAd(() => { A.Scenes.stage(null); G.newRun(race.id, cls.id, gr); Portal.gameplayStart(); dungeon(true); });
    });
  }

  // ---------- Start ----------
  document.addEventListener('visibilitychange', () => { if (document.hidden && G.run) { G.save(); G.saveMeta(); } });
  window.__abstieg = { G, Wd, title, dungeon, draw, get overlay() { return overlay; }, screens: { heroSelect, camp, showSheet, skillPick, boonPick, pendingPicks, fatePick, shop, rest, eventScreen, treasure, secretTreasure, runOver, useProp, foundItem, compareView, forge, forgeElement, comboWin, petWin } };
  title();
})();
