// Der Abstieg – Automatischer Kampf. Rechnet den ganzen Kampf vor und liefert eine Liste von Ereignissen,
// die die Oberfläche dann Schritt für Schritt abspielt.
'use strict';
window.A = window.A || {};

A.Combat = (function () {
  const MAX_ROUNDS = 30;

  function mkEntity(o) {
    return Object.assign({ shield: 0, effects: [], skills: [], alive: true, cds: {}, stunned: 0, buffs: {} }, o);
  }

  function living(ents, side) { return ents.filter(e => e.alive && e.side === side); }

  function pickTarget(rng, attacker, ents, melee) {
    const foes = living(ents, attacker.side === 'hero' ? 'enemy' : 'hero');
    if (!foes.length) return null;
    if (melee) {
      const front = foes.filter(f => f.row === 'front');
      if (front.length) return rng.pick(front);
    }
    return rng.pick(foes);
  }

  function statOf(e, k) { return (e[k] || 0) + (e.buffs[k] ? e.buffs[k].val * ((k === 'atk' || k === 'mag') ? e[k] : 1) : 0); }

  function dealDamage(ctx, from, to, raw, opts) {
    const { rng, ev, snap } = ctx;
    opts = opts || {};
    // Ausweichen
    const dodge = Math.max(0, Math.min(75, statOf(to, 'dodge')));
    if (!opts.noDodge && rng.chance(dodge / 100)) { ev.push({ t: 'miss', from: from.id, to: to.id, hp: snap() }); return 0; }
    let dmg = raw * (0.9 + rng.next() * 0.2);
    // Rüstung
    const def = Math.max(0, statOf(to, 'def'));
    dmg = dmg * 100 / (100 + def * 4);
    // Volltreffer
    let crit = false;
    const critCh = Math.max(0, Math.min(90, statOf(from, 'crit') + (opts.critBonus || 0)));
    if (rng.chance(critCh / 100)) { dmg *= 1.75; crit = true; if (from.side === 'hero') ctx.stats.crits++; }
    dmg = Math.max(1, Math.round(dmg));
    // Schild
    let absorbed = 0;
    if (to.shield > 0) { absorbed = Math.min(to.shield, dmg); to.shield -= absorbed; dmg -= absorbed; }
    to.hp -= dmg;
    if (to.side === 'hero') ctx.stats.dmgTaken += dmg;
    ev.push({ t: 'hit', from: from.id, to: to.id, dmg, crit, absorbed, kind: opts.kind || 'phys', hp: snap() });
    // Nebenwirkungen des Angreifers
    if (from.lifesteal && dmg > 0 && from.alive) { const h = Math.max(1, Math.round(dmg * from.lifesteal / 100)); heal(ctx, from, h); }
    if (from.poisonOnHit && dmg > 0) addEffect(ctx, to, 'poison', Math.max(1, Math.round(from.poisonOnHit * (1 + ctx.floor * 0.3))), 3);
    if (from.burn && dmg > 0 && opts.kind !== 'poison') addEffect(ctx, to, 'burn', Math.max(1, Math.round(statOf(from, 'mag') * from.burn)), 2);
    if (opts.poison) addEffect(ctx, to, 'poison', Math.max(1, Math.round(statOf(from, 'atk') * opts.poison / 3)), 3);
    if (opts.burn) addEffect(ctx, to, 'burn', Math.max(1, Math.round(statOf(from, 'mag') * opts.burn)), 2);
    if (opts.stun) { to.stunned = opts.stun; ev.push({ t: 'effect', who: to.id, kind: 'stun', hp: snap() }); }
    // Dornen
    if (to.thorns && dmg > 0 && opts.kind === 'phys' && from.alive) {
      const back = Math.max(1, Math.round(dmg * to.thorns / 100));
      from.hp -= back; if (from.side === 'hero') ctx.stats.dmgTaken += back;
      ev.push({ t: 'hit', from: to.id, to: from.id, dmg: back, crit: false, absorbed: 0, kind: 'thorns', hp: snap() });
      checkDeath(ctx, from);
    }
    // Boss: heilt sich bei Waffentreffern
    if (to.healOnPhys && opts.kind === 'phys' && to.alive && to.hp > 0) heal(ctx, to, Math.round(to.maxHp * to.healOnPhys));
    checkDeath(ctx, to);
    return dmg;
  }

  function heal(ctx, who, amt) {
    if (!who.alive) return;
    const real = Math.max(0, Math.min(amt, who.maxHp - who.hp));
    if (real <= 0) return;
    who.hp += real;
    ctx.ev.push({ t: 'heal', who: who.id, amt: real, hp: ctx.snap() });
  }

  function addEffect(ctx, who, kind, val, dur) {
    if (!who.alive) return;
    const ex = who.effects.find(e => e.kind === kind);
    if (ex) { ex.val = Math.max(ex.val, val); ex.dur = Math.max(ex.dur, dur); }
    else who.effects.push({ kind, val, dur });
    ctx.ev.push({ t: 'effect', who: who.id, kind, val, hp: ctx.snap() });
  }

  function checkDeath(ctx, e) {
    if (!e.alive || e.hp > 0) return;
    if (e.revive > 0) { e.revive--; e.hp = 1; ctx.ev.push({ t: 'revive', who: e.id, hp: ctx.snap() }); return; }
    e.alive = false; e.hp = 0;
    ctx.ev.push({ t: 'die', who: e.id, hp: ctx.snap() });
    if (e.side === 'enemy') ctx.stats.kills++;
    if (e.split && !e.didSplit) {
      // Boss-Trick ist eigentlich bei 50 %, siehe tickBossTricks
    }
  }

  function tickBossTricks(ctx, e) {
    if (e.split && !e.didSplit && e.alive && e.hp <= e.maxHp * 0.5) {
      e.didSplit = true;
      const m = A.MONSTERS.find(x => x.id === 'schleimer');
      for (let i = 0; i < 2; i++) {
        const s = mkEntity(A.Game.monsterEntity(m, ctx.floor, false, ctx.ents.length + i + 1));
        s.hp = Math.round(s.maxHp * 0.6);
        ctx.ents.push(s);
        ctx.ev.push({ t: 'spawn', ent: snapshotEntity(s), hp: ctx.snap() });
      }
      ctx.ev.push({ t: 'say', who: e.id, text: A.LANG === 'de' ? 'Der Schleimkönig teilt sich!' : 'The Slime King splits!', hp: ctx.snap() });
    }
  }

  function useSkill(ctx, who, sk, ents) {
    const { rng, ev } = ctx;
    const foes = living(ents, who.side === 'hero' ? 'enemy' : 'hero');
    ev.push({ t: 'act', who: who.id, skill: sk.id, hp: ctx.snap() });
    const base = sk.kind === 'magic' || sk.magic ? statOf(who, 'mag') : statOf(who, 'atk');
    if (sk.kind === 'attack' || sk.kind === 'magic') {
      const targets = sk.multi ? foes.slice() : [pickTarget(rng, who, ents, sk.kind === 'attack' && who.melee)].filter(Boolean);
      for (const tg of targets) {
        const hits = sk.hits || 1;
        for (let h = 0; h < hits; h++) {
          if (!tg.alive) break;
          let pow = sk.pow;
          if (sk.bonusMissingHp) pow *= 1 + sk.bonusMissingHp * (1 - who.hp / who.maxHp);
          if (sk.execute && tg.hp <= tg.maxHp * sk.execute && !tg.boss) { tg.hp = 0; ev.push({ t: 'hit', from: who.id, to: tg.id, dmg: tg.maxHp, crit: true, absorbed: 0, kind: 'execute', hp: ctx.snap() }); ctx.stats.kills += 0; checkDeath(ctx, tg); if (!tg.alive) ctx.stats.kills += 0; continue; }
          dealDamage(ctx, who, tg, base * pow, { kind: sk.kind === 'magic' ? 'magic' : 'phys', critBonus: sk.critBonus, poison: sk.poison, burn: sk.burn, stun: sk.stun });
        }
      }
    } else if (sk.kind === 'multi') {
      for (const tg of foes.slice()) if (tg.alive) dealDamage(ctx, who, tg, base * sk.pow, { kind: 'phys' });
    } else if (sk.kind === 'shield') {
      const amt = Math.round(who.maxHp * sk.pow);
      who.shield += amt; ev.push({ t: 'shield', who: who.id, amt, hp: ctx.snap() });
    } else if (sk.kind === 'heal') {
      heal(ctx, who, Math.round(who.maxHp * sk.pow));
    } else if (sk.kind === 'buff') {
      who.buffs[sk.stat] = { val: sk.pow, dur: sk.dur };
      ev.push({ t: 'buff', who: who.id, stat: sk.stat, hp: ctx.snap() });
    }
  }

  function basicAttack(ctx, who, ents) {
    const magic = who.kind === 'magic';
    const tg = pickTarget(ctx.rng, who, ents, who.melee);
    if (!tg) return;
    ctx.ev.push({ t: 'act', who: who.id, skill: null, hp: ctx.snap() });
    dealDamage(ctx, who, tg, statOf(who, magic ? 'mag' : 'atk'), { kind: magic ? 'magic' : 'phys' });
    if (who.steal && tg.side === 'hero' && tg.alive) { ctx.stats.goldStolen += 5 + ctx.floor * 3; ctx.ev.push({ t: 'steal', who: who.id, hp: ctx.snap() }); }
  }

  function endOfRound(ctx, e) {
    if (!e.alive) return;
    for (const f of e.effects) {
      if (f.kind === 'poison' || f.kind === 'burn') {
        const d = Math.max(1, Math.round(f.val));
        e.hp -= d; if (e.side === 'hero') ctx.stats.dmgTaken += d;
        ctx.ev.push({ t: 'hit', from: null, to: e.id, dmg: d, crit: false, absorbed: 0, kind: f.kind, hp: ctx.snap() });
      }
      f.dur--;
    }
    e.effects = e.effects.filter(f => f.dur > 0);
    for (const k of Object.keys(e.buffs)) { e.buffs[k].dur--; if (e.buffs[k].dur <= 0) delete e.buffs[k]; }
    if (e.regen && e.alive) {
      const r = Math.round(e.maxHp * e.regen / 100);
      if (r > 0) heal(ctx, e, r);
      else if (r < 0) { e.hp += r; ctx.ev.push({ t: 'hit', from: null, to: e.id, dmg: -r, crit: false, absorbed: 0, kind: 'curse', hp: ctx.snap() }); }
    }
    checkDeath(ctx, e);
  }

  function snapshotEntity(e) {
    return { id: e.id, name: e.name, side: e.side, row: e.row, hp: e.hp, maxHp: e.maxHp, color: e.color, shape: e.shape, boss: !!e.boss, elite: !!e.elite };
  }

  // hero: Entity-Daten aus A.Game.heroEntity; enemies: Liste aus A.Game.monsterEntity
  function simulate(heroData, enemyData, floor, seed) {
    const rng = new A.RNG(seed);
    const ents = [mkEntity(heroData)].concat(enemyData.map(mkEntity));
    const ev = [];
    const stats = { dmgTaken: 0, crits: 0, kills: 0, goldStolen: 0, rounds: 0 };
    const snap = () => { const o = {}; for (const e of ents) o[e.id] = { hp: Math.max(0, Math.round(e.hp)), sh: Math.round(e.shield), fx: e.effects.map(f => f.kind), st: e.stunned > 0 }; return o; };
    const ctx = { rng, ev, ents, stats, floor, snap };
    const hero = ents[0];
    ev.push({ t: 'start', ents: ents.map(snapshotEntity), hp: snap() });
    if (hero.startShield) { hero.shield = Math.round(hero.maxHp * hero.startShield / 100); ev.push({ t: 'shield', who: hero.id, amt: hero.shield, hp: snap() }); }
    if (hero.trap) {
      for (const f of living(ents, 'enemy')) { const d = Math.round(f.maxHp * hero.trap / 100); f.hp -= d; ev.push({ t: 'hit', from: hero.id, to: f.id, dmg: d, crit: false, absorbed: 0, kind: 'trap', hp: snap() }); checkDeath(ctx, f); }
    }

    let round = 0;
    while (round < MAX_ROUNDS) {
      round++; stats.rounds = round;
      ev.push({ t: 'round', n: round, hp: snap() });
      const order = ents.filter(e => e.alive).sort((a, b) => (statOf(b, 'spd') + rng.next()) - (statOf(a, 'spd') + rng.next()));
      for (const e of order) {
        if (!e.alive) continue;
        if (!living(ents, 'hero').length || !living(ents, 'enemy').length) break;
        if (e.stunned > 0) { e.stunned--; ev.push({ t: 'skip', who: e.id, hp: snap() }); continue; }
        // Abklingzeiten
        for (const k of Object.keys(e.cds)) if (e.cds[k] > 0) e.cds[k]--;
        let used = false;
        for (const sid of e.skills) {
          const sk = A.SKILLS[sid]; if (!sk) continue;
          if ((e.cds[sid] || 0) > 0) continue;
          // sinnvoll? Heilen nur unter 70 %, Schild nur ohne Schild, Buff nur ohne Buff
          if (sk.kind === 'heal' && e.hp > e.maxHp * 0.7) continue;
          if (sk.kind === 'shield' && e.shield > e.maxHp * 0.2) continue;
          if (sk.kind === 'buff' && e.buffs[sk.stat]) continue;
          if ((sk.multi || sk.kind === 'multi') && living(ents, e.side === 'hero' ? 'enemy' : 'hero').length < 2 && sk.pow < 1.2) continue;
          useSkill(ctx, e, Object.assign({ id: sid }, sk), ents);
          e.cds[sid] = sk.cd;
          used = true; break;
        }
        if (!used) basicAttack(ctx, e, ents);
        for (const b of ents) if (b.boss) tickBossTricks(ctx, b);
      }
      for (const e of ents) endOfRound(ctx, e);
      if (!living(ents, 'hero').length || !living(ents, 'enemy').length) break;
    }
    const won = living(ents, 'hero').length > 0 && !living(ents, 'enemy').length;
    const fled = living(ents, 'hero').length > 0 && living(ents, 'enemy').length > 0;
    ev.push({ t: 'end', won, fled, hp: snap() });
    return { won, fled, events: ev, heroHp: Math.max(0, Math.round(hero.hp)), heroRevive: hero.revive, stats };
  }

  return { simulate, snapshotEntity };
})();
