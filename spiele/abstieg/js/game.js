// Der Abstieg – Spiellogik: Held, Items, Ebenen, Belohnungen, Lager, Speichern (die Welt selbst steht in world.js)
'use strict';
window.A = window.A || {};

A.Game = (function () {
  const SAVE = 'abstieg.v1';
  const META = 'abstieg.meta.v1';

  // ---------- Dauerhaft (Lager) ----------
  let meta = { sparks: 0, unlocked: [], runs: 0, best: 0, sound: true, totalKills: 0, look: 'retro' };   // look: 'retro' (Pixel) oder '3d'
  function loadMeta() { try { const d = JSON.parse(localStorage.getItem(META)); if (d) meta = Object.assign(meta, d); } catch (e) {} }
  function saveMeta() { try { localStorage.setItem(META, JSON.stringify(meta)); } catch (e) {} }
  function metaEffects() {
    const eff = { hpMul: 0, startGold: 0, dmgMul: 0, startPotion: 0, extraStartSkill: 0, itemLuck: 0, races: [] };
    for (const id of meta.unlocked) {
      const u = A.META_SHOP.find(x => x.id === id); if (!u) continue;
      for (const k of Object.keys(u.effect)) { if (k === 'race') eff.races.push(u.effect.race); else eff[k] += u.effect[k]; }
    }
    return eff;
  }
  function raceUnlocked(r) { return r.unlock === 0 || metaEffects().races.includes(r.id); }
  function classUnlocked(c) { return c.unlock === 0 && !c.soon; }

  // ---------- Durchlauf ----------
  let run = null;
  function newRun(raceId, classId) {
    const race = A.RACES.find(r => r.id === raceId), cls = A.CLASSES.find(c => c.id === classId);
    const me = metaEffects();
    const skills = cls.startSkills.slice();
    if (me.extraStartSkill) skills.push(cls.skills.find(s => !skills.includes(s)));
    run = {
      seed: Math.floor(Math.random() * 1e9), race: race.id, cls: cls.id,
      floor: 1, step: 0, level: 1, xp: 0, points: 0,
      stats: { str: race.base.str + cls.base.str, tou: race.base.tou + cls.base.tou, dex: race.base.dex + cls.base.dex, mind: race.base.mind + cls.base.mind, luck: race.base.luck + cls.base.luck },
      hp: 0, gold: 10 + me.startGold, potions: me.startPotion,
      gear: { weapon: null, armor: null, helm: null, boots: null, trinket: null, trinket2: null },
      bag: [], known: skills, active: skills.slice(0, 3),
      kills: 0, quest: null, questProg: 0, questDone: false, pendingSkillPick: null, floorSeed: 0, rooms: null,
      log: [], reviveUsed: false, over: false, won: false,
    };
    run.rng = new A.RNG(run.seed);
    // Startwaffe
    const base = A.BASES.find(b => b.id === cls.weapon);
    run.gear.weapon = makeItem(base, 'common', 1);
    run.gear.armor = makeItem(A.BASES.find(b => b.id === 'leder'), 'common', 1);
    run.hp = derived().maxHp;
    newFloor();
    save();
    return run;
  }

  // ---------- Abgeleitete Werte ----------
  function gearList() { return A.SLOTS.map(s => run.gear[s]).filter(Boolean); }
  function derived(r) {
    r = r || run;
    const race = A.RACES.find(x => x.id === r.race), me = metaEffects();
    const s = r.stats;
    const sum = (k) => gearList().reduce((a, it) => a + (it.stats[k] || 0), 0);
    const mod = race.mod || {};
    const atkPct = sum('atkPct') / 100 + me.dmgMul, magPct = sum('magPct') / 100 + me.dmgMul;
    const d = {
      maxHp: Math.round((40 + s.tou * 8 + r.level * 6 + sum('hp')) * (mod.hpMul || 1) * (1 + me.hpMul)),
      atk: Math.round((4 + s.str * 2 + sum('atk')) * (1 + atkPct)),
      mag: Math.round((4 + s.mind * 2 + sum('mag')) * (1 + magPct)),
      def: Math.round(s.tou * 0.5 + sum('def') + (mod.def || 0)),
      spd: Math.round(5 + s.dex * 0.6 + sum('spd') + (mod.spd || 0)),
      crit: Math.round(5 + s.dex * 0.8 + s.luck * 0.6 + sum('crit') + (mod.crit || 0)),
      dodge: Math.round(s.dex * 0.5 + sum('dodge') + (mod.dodge || 0)),
      lifesteal: sum('lifesteal'), thorns: sum('thorns'), poisonOnHit: sum('poisonOnHit') + (mod.poisonOnHit || 0),
      regen: sum('regen') + (mod.regen || 0), startShield: sum('startShield'), goldPct: sum('goldPct') + ((mod.goldMul || 1) - 1) * 100,
      xpPct: sum('xpPct'), revive: sum('revive'), trap: mod.trap || 0, luck: s.luck + sum('luck'),
      skillSlots: 3 + (mod.skillSlots || 0), itemLuck: me.itemLuck + (mod.itemLuck || 0),
    };
    return d;
  }

  function monsterEntity(m, floor, elite, idx) {
    const hpM = 1 + 0.32 * (floor - 1), atkM = 1 + 0.22 * (floor - 1);
    const e = {
      id: 'e' + idx, mid: m.id, name: (elite ? A.t(A.UI.elitePrefix) + ' ' : '') + A.t(m.name), side: 'enemy', kind: m.kind,
      maxHp: Math.round(m.hp * hpM * (elite ? 1.8 : 1) * (m.boss ? 1 : 1)), atk: Math.round(m.atk * atkM * (elite ? 1.3 : 1)), mag: Math.round(m.atk * atkM * (elite ? 1.3 : 1)),
      def: Math.round((m.def || 0) * (1 + 0.15 * (floor - 1))), spd: m.spd + (elite ? 2 : 0), crit: m.crit || 5, dodge: m.dodge || 0,
      poisonOnHit: m.poisonOnHit || 0, burn: m.burn || 0, thorns: m.thorns || 0, steal: m.steal || 0, color: m.color, shape: m.shape,
      boss: !!m.boss, elite: !!elite, split: !!m.split, healOnPhys: m.healOnPhys || 0, skills: [],
    };
    e.hp = e.maxHp;
    if (elite) { const t = run ? run.rng.pick(['giftig', 'gepanzert', 'schnell']) : 'gepanzert'; e.eliteKind = t; if (t === 'giftig') e.poisonOnHit += 3; if (t === 'gepanzert') e.def += 5; if (t === 'schnell') e.spd += 4; }
    return e;
  }

  // ---------- Items ----------
  function rollRarity(bonusLuck) {
    const rng = run ? run.rng : A.rng;
    const luck = (bonusLuck || 0) + (run ? derived().itemLuck : 0);
    const list = Object.keys(A.RARITY);
    return rng.weighted(list, k => {
      const r = A.RARITY[k];
      let w = r.weight;
      if (k !== 'common' && k !== 'cursed') w *= 1 + luck * 0.35;
      if (k === 'common') w /= 1 + luck * 0.35 + (run ? run.floor * 0.15 : 0);
      return w;
    });
  }
  let itemSeq = 0;
  function makeItem(base, rarity, floor, forceUnique) {
    const rng = run ? run.rng : A.rng;
    const R = A.RARITY[rarity];
    const scale = (1 + 0.18 * (floor - 1)) * R.mult;
    const it = { uid: 'i' + (++itemSeq) + '_' + Math.floor(rng.next() * 1e6), base: base.id, slot: base.slot, rarity, floor, stats: {}, affixes: [], name: null, flavor: null };
    for (const k of ['atk', 'mag', 'def', 'hp', 'spd', 'crit', 'dodge']) if (base[k]) it.stats[k] = Math.round(base[k] * (k === 'spd' || k === 'crit' || k === 'dodge' ? 1 : scale));
    // Einzelstück?
    const uniq = forceUnique || ((rarity === 'legendary' || rarity === 'cursed') ? A.UNIQUES.filter(u => u.rarity === rarity && (!run || !run.seenUniques || !run.seenUniques.includes(u.id))) : []);
    if (Array.isArray(uniq) ? uniq.length && rng.chance(0.7) : uniq) {
      const u = Array.isArray(uniq) ? rng.pick(uniq) : uniq;
      const ub = A.BASES.find(b => b.id === u.base);
      it.base = ub.id; it.slot = ub.slot; it.unique = u.id; it.name = u.name; it.flavor = u.flavor;
      it.stats = {};
      for (const k of ['atk', 'mag', 'def', 'hp', 'spd', 'crit', 'dodge']) if (ub[k]) it.stats[k] = Math.round(ub[k] * (k === 'spd' || k === 'crit' || k === 'dodge' ? 1 : scale));
      for (const k of Object.keys(u.stats)) it.stats[k] = (it.stats[k] || 0) + u.stats[k];
      if (run) { run.seenUniques = run.seenUniques || []; run.seenUniques.push(u.id); }
      return it;
    }
    const pool = rng.shuffle(A.AFFIXES).slice(0, R.affixes);
    for (const a of pool) {
      const v = Math.round(a.val * (['hp', 'def'].includes(a.key) ? (1 + 0.15 * (floor - 1)) : 1) * (rarity === 'epic' || rarity === 'legendary' || rarity === 'cursed' ? 1.3 : 1));
      it.stats[a.key] = (it.stats[a.key] || 0) + v; it.affixes.push(a.key);
    }
    if (rarity === 'cursed') { const bad = rng.pick(['def', 'dodge', 'spd', 'regen']); it.stats[bad] = (it.stats[bad] || 0) - (bad === 'spd' ? 3 : bad === 'regen' ? 2 : 8); it.curse = bad; }
    if (rng.chance(rarity === 'common' ? 0.15 : 0.5)) it.flavor = rng.pick(A.QUIRKS);
    return it;
  }
  function itemName(it) {
    if (it.name) return A.t(it.name);
    const base = A.BASES.find(b => b.id === it.base);
    let n = A.t(base.name);
    if (it.affixes.length) n += ' ' + A.t(A.AFFIXES.find(a => a.key === it.affixes[0]).name);
    if (it.rarity === 'cursed') n = (A.LANG === 'de' ? 'Verfluchte(r) ' : 'Cursed ') + n;
    return n;
  }
  function itemLines(it) {
    const out = [];
    const L = { atk: A.UI.derived.atk, mag: A.UI.derived.mag, def: A.UI.derived.def, hp: A.UI.hp, spd: A.UI.derived.spd, crit: A.UI.derived.crit, dodge: A.UI.derived.dodge };
    for (const k of ['atk', 'mag', 'def', 'hp', 'spd', 'crit', 'dodge']) if (it.stats[k]) out.push((it.stats[k] > 0 ? '+' : '') + it.stats[k] + (k === 'crit' || k === 'dodge' ? ' %' : '') + ' ' + A.t(L[k]));
    for (const a of A.AFFIXES) if (it.stats[a.key] && !['atk', 'mag', 'def', 'hp', 'spd', 'crit', 'dodge'].includes(a.key)) out.push(A.t(a.text).replace('{v}', it.stats[a.key]));
    if (it.stats.revive) out.push(A.LANG === 'de' ? 'Einmal pro Durchlauf überleben' : 'Survive once per run');
    if (it.stats.luck) out.push('+' + it.stats.luck + ' ' + A.t(A.UI.stat.luck));
    return out;
  }
  function randomItem(rarity, slotPref) {
    const rng = run.rng;
    let bases = A.BASES.filter(b => !b.cls || b.cls.includes(run.cls));
    if (slotPref) bases = bases.filter(b => b.slot === slotPref);
    return makeItem(rng.pick(bases), rarity || rollRarity(), run.floor);
  }
  function equip(it) {
    let slot = it.slot;
    if (slot === 'trinket' && run.gear.trinket && !run.gear.trinket2) slot = 'trinket2';
    const old = run.gear[slot];
    run.gear[slot] = it;
    run.bag = run.bag.filter(x => x.uid !== it.uid);
    if (old) run.bag.push(old);
    const d = derived(); if (run.hp > d.maxHp) run.hp = d.maxHp;
    save();
  }
  function sellValue(it) { return Math.round((8 + it.floor * 6) * A.RARITY[it.rarity].mult); }
  function sell(it) { run.gold += sellValue(it); run.bag = run.bag.filter(x => x.uid !== it.uid); save(); }
  function addToBag(it) { run.bag.push(it); while (run.bag.length > 8) { const worst = run.bag.slice().sort((a, b) => A.RARITY[a.rarity].mult - A.RARITY[b.rarity].mult)[0]; run.gold += sellValue(worst); run.bag = run.bag.filter(x => x.uid !== worst.uid); } save(); }

  // ---------- Ebenen (Räume) ----------
  function newFloor() {
    run.floorSeed = run.rng.int(1, 2e9); run.rooms = null;
    run.quest = run.rng.pick(A.QUESTS); run.questProg = 0; run.questDone = false; run.floorKills = 0;
    run.shopItems = null; run.currentEvent = null;
  }
  function descend() {
    if (run.floor >= A.MAX_FLOOR) { run.over = true; run.won = true; finishRun(); return 'won'; }
    run.floor++; newFloor(); save(); return 'descend';
  }
  // Raum betreten: Händler-Ware oder Ereignis festlegen (einmal pro Raum)
  function roomContent(kind) {
    if (kind === 'merchant' && !run.shopItems) run.shopItems = [randomItem(), randomItem(), randomItem(rollRarity(1))].map(it => ({ it, price: Math.round(sellValue(it) * 2.5) }));
    if (kind === 'statue' && !run.currentEvent) { run.currentEvent = run.rng.pick(A.EVENTS.filter(e => e.id !== run.lastEvent)); run.lastEvent = run.currentEvent.id; }
    save();
  }
  function questEvent(kind) {
    const q = run.quest; if (!q || run.questDone) return;
    if (q.type === 'crits' && kind === 'crit') run.questProg++;
    if (q.type === 'elite' && kind === 'elite') run.questProg = 1;
    if (q.type === 'nodmg' && kind === 'nodmg') run.questProg = 1;
    if (q.type === 'kills') run.questProg = run.floorKills;
    if (run.questProg >= q.n) { run.questDone = true; run.questRewardPending = q.reward; }
  }
  // Belohnung für einen getöteten Gegner
  function killReward(e) {
    const f = run.floor, d = derived();
    const mult = e.boss ? 10 : e.elite ? 2.5 : 1;
    const gold = Math.round(run.rng.int(3, 6) * (1 + 0.25 * (f - 1)) * mult * (1 + d.goldPct / 100));
    const xp = Math.round((6 + f * 3) * (e.boss ? 6 : e.elite ? 2 : 1) * (1 + d.xpPct / 100));
    run.kills++; run.floorKills++; meta.totalKills++;
    const items = [];
    if (e.boss) { items.push(randomItem('legendary'), randomItem(rollRarity(2))); }
    else if (e.elite) { items.push(randomItem(rollRarity(1))); questEvent('elite'); }
    else if (run.rng.chance(0.08 + d.itemLuck * 0.03)) items.push(randomItem());
    const levels = addXp(xp);
    questEvent('kill');
    save();
    return { gold, coins: e.boss ? 8 : e.elite ? 4 : Math.max(1, Math.round(gold / 4)), xp, items, levels, potion: !e.boss && run.rng.chance(0.04) };
  }
  // Raum gesäubert: ein Item als Belohnung, Aufgabe prüfen
  function roomCleared(room, stats) {
    const items = [];
    if (room.type === 'fight') items.push(randomItem());
    if (room.type === 'elite') items.push(randomItem(rollRarity(1)));
    if (stats && stats.dmgRoom === 0) questEvent('nodmg');
    if (run.questRewardPending) { const rw = run.questRewardPending; run.questRewardPending = null; if (rw.gold) run.gold += rw.gold; if (rw.xp) addXp(rw.xp); if (rw.item) items.push(randomItem(rw.item)); run.questJustDone = true; }
    save();
    return { items };
  }
  function xpNeed(l) { return Math.round(40 * Math.pow(l, 1.4)); }
  function addXp(xp) {
    run.xp += xp; let ups = 0;
    while (run.xp >= xpNeed(run.level)) { run.xp -= xpNeed(run.level); run.level++; run.points += 3; ups++; if (run.level % 3 === 0) run.pendingSkillPick = (run.pendingSkillPick || 0) + 1; }
    if (ups) { const d = derived(); run.hp = Math.min(d.maxHp, run.hp + Math.round(d.maxHp * 0.2 * ups)); run.levelUpFlag = true; }
    return ups;
  }
  function spend(stat) { if (run.points <= 0) return; run.points--; run.stats[stat]++; const before = derived(); run.hp = Math.min(before.maxHp, run.hp + (stat === 'tou' ? 8 : 0)); save(); }
  function skillOffer() {
    const cls = A.CLASSES.find(c => c.id === run.cls);
    const rest = cls.skills.filter(s => !run.known.includes(s));
    return run.rng.shuffle(rest).slice(0, 3);
  }
  function learnSkill(id) { run.known.push(id); run.pendingSkillPick--; if (run.active.length < derived().skillSlots) run.active.push(id); save(); }
  function setActive(ids) { run.active = ids.slice(0, derived().skillSlots); save(); }

  // ---------- Räume ----------
  function doRest(kind) { const d = derived(); if (kind === 'heal') run.hp = Math.min(d.maxHp, run.hp + Math.round(d.maxHp * 0.5)); else run.points++; save(); }
  function doEvent(choiceIdx) {
    const ev = run.currentEvent, ch = ev.choices[choiceIdx], rng = run.rng;
    let r = rng.next(), oc = ch.outcomes[ch.outcomes.length - 1];
    for (const o of ch.outcomes) { if (r < o.p) { oc = o; break; } r -= o.p; }
    const d = derived(); const res = { msg: A.t(oc.msg), items: [] };
    if (oc.heal) run.hp = Math.min(d.maxHp, run.hp + Math.round(d.maxHp * oc.heal));
    if (oc.dmg) run.hp = Math.max(1, run.hp - Math.round(d.maxHp * oc.dmg));
    if (oc.gold) run.gold = Math.max(0, run.gold + oc.gold);
    if (oc.xp) addXp(oc.xp);
    if (oc.stat) run.stats[oc.stat]++;
    if (oc.potion) run.potions += oc.potion;
    if (oc.item) res.items.push(randomItem(oc.item));
    if (oc.curse) res.items.push(randomItem('cursed'));
    if (oc.sacrifice) { const worst = run.bag[0]; if (worst) run.bag.shift(); run.points += 2; }
    for (const it of res.items) addToBag(it);
    save(); return res;
  }
  function treasure() { const items = [randomItem(rollRarity(1)), randomItem(rollRarity(1))]; const gold = Math.round(run.rng.int(15, 30) * (1 + 0.3 * (run.floor - 1))); run.gold += gold; save(); return { items, gold }; }
  function buy(idx) { const s = run.shopItems[idx]; if (!s || run.gold < s.price) return false; run.gold -= s.price; run.shopItems[idx] = null; addToBag(s.it); return true; }
  function buyPotion() { const p = 25 + run.floor * 5; if (run.gold < p) return false; run.gold -= p; run.potions++; save(); return true; }
  function potionPrice() { return 25 + run.floor * 5; }
  function usePotion() { if (run.potions <= 0) return false; run.potions--; const d = derived(); run.hp = Math.min(d.maxHp, run.hp + Math.round(d.maxHp * 0.4)); save(); return true; }

  // ---------- Ende ----------
  function finishRun() {
    const sparks = run.floor * 8 + Math.floor(run.kills * 1.2) + (run.won ? 60 : 0) + run.level * 2;
    run.sparksEarned = sparks; meta.sparks += sparks; meta.runs++; meta.best = Math.max(meta.best, run.floor);
    saveMeta(); save();
  }
  function metaBuy(id) { const u = A.META_SHOP.find(x => x.id === id); if (!u || meta.unlocked.includes(id) || meta.sparks < u.cost || (u.needs && !meta.unlocked.includes(u.needs))) return false; meta.sparks -= u.cost; meta.unlocked.push(id); saveMeta(); return true; }

  // ---------- Speichern ----------
  function save() { if (!run) return; try { const { rng, ...rest } = run; localStorage.setItem(SAVE, JSON.stringify(Object.assign({}, rest, { rngState: rng.s }))); } catch (e) {} }
  function load() { try { const d = JSON.parse(localStorage.getItem(SAVE)); if (!d || d.over) return null; run = d; run.rng = new A.RNG(d.rngState || d.seed); return run; } catch (e) { return null; } }
  function clearRun() { run = null; try { localStorage.removeItem(SAVE); } catch (e) {} }
  function resetAll() { clearRun(); meta = { sparks: 0, unlocked: [], runs: 0, best: 0, sound: true, totalKills: 0 }; saveMeta(); }

  loadMeta();
  return {
    get run() { return run; }, get meta() { return meta; }, metaEffects, raceUnlocked, classUnlocked,
    newRun, load, clearRun, resetAll, save, saveMeta, derived, monsterEntity,
    makeItem, itemName, itemLines, randomItem, rollRarity, equip, sell, sellValue, addToBag,
    newFloor, descend, roomContent, questEvent, killReward, roomCleared, xpNeed, spend, skillOffer, learnSkill, setActive,
    doRest, doEvent, treasure, buy, buyPotion, potionPrice, usePotion, finishRun, metaBuy,
  };
})();
