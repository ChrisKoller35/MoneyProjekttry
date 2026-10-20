// Der Abstieg – Segen am Schrein: neue Zauber für alle Klassen, passive Talente und Verstärkungen bestehender Zauber
'use strict';
window.A = window.A || {};

// ---------- Zauber für alle (nur am Schrein) ----------
// any: Stärke ist der höhere Wert aus Angriff und Zauberkraft; col: Farbe; icon: Symbol
// neue Arten: dash (Sprung nach vorn), zone (Wolke/Quelle am Boden), meteor (schlägt verzögert ein), orbit (kreisende Geister), ally (Begleiter), fan (Fächer aus Geschossen)
Object.assign(A.SKILLS, {
  feuerball: { name: { de: 'Feuerball', en: 'Fireball' }, kind: 'magic', any: true, pow: 1.5, cd: 3, blast: 80, burn: 0.4, col: '#f77622', icon: 's_fire', desc: { de: 'Explodiert beim Aufprall: 150 % Schaden in der Fläche, dazu Brand.', en: 'Explodes on impact: 150% area damage plus burn.' } },
  eisnova: { name: { de: 'Eisnova', en: 'Ice Nova' }, kind: 'magic', multi: true, any: true, pow: 0.8, cd: 4, radius: 150, slow: true, col: '#9be8ff', icon: 's_ice', desc: { de: '80 % Schaden rundherum, alle Getroffenen werden langsam.', en: '80% damage around you, slows everything hit.' } },
  kettenblitz: { name: { de: 'Kettenblitz', en: 'Chain Lightning' }, kind: 'magic', any: true, pow: 1.1, cd: 3, chain: 4, col: '#fee761', icon: 's_bolt', desc: { de: 'Blitz springt über bis zu 5 Gegner, je 110 % Schaden.', en: 'Lightning jumps across up to 5 enemies, 110% each.' } },
  blitzschritt: { name: { de: 'Blitzschritt', en: 'Flash Step' }, kind: 'dash', any: true, pow: 1.2, cd: 3, col: '#2ce8f5', icon: 's_dash', desc: { de: 'Springt nach vorn, unverwundbar, 120 % Schaden an allem auf dem Weg.', en: 'Dash forward, invulnerable, 120% damage to everything in the way.' } },
  giftwolke: { name: { de: 'Giftwolke', en: 'Poison Cloud' }, kind: 'zone', zone: 'poison', any: true, pow: 0.3, dur: 5, radius: 80, cd: 4, col: '#63c74d', icon: 's_cloud', desc: { de: 'Wolke beim nächsten Gegner, vergiftet 5 Sekunden lang alles darin.', en: 'Cloud at the nearest enemy, poisons everything inside for 5 seconds.' } },
  meteor: { name: { de: 'Meteor', en: 'Meteor' }, kind: 'meteor', any: true, pow: 3.0, cd: 5, radius: 95, burn: 0.6, col: '#f77622', icon: 's_meteor', desc: { de: 'Nach kurzer Zeit schlägt ein Meteor ein: 300 % Schaden. Rote Markierung zeigt wo.', en: 'After a moment a meteor hits: 300% damage. A red mark shows where.' } },
  heilquelle: { name: { de: 'Heilquelle', en: 'Healing Spring' }, kind: 'zone', zone: 'heal', pow: 0.025, dur: 6, radius: 70, cd: 6, col: '#63c74d', icon: 's_spring', desc: { de: 'Quelle unter dir: heilt 6 Sekunden lang, solange du drinstehst.', en: 'A spring under you: heals for 6 seconds while you stand in it.' } },
  geisterschwarm: { name: { de: 'Geisterschwarm', en: 'Spirit Swarm' }, kind: 'orbit', any: true, n: 3, pow: 0.6, dur: 8, cd: 5, col: '#c0cbdc', icon: 's_ghost', desc: { de: '3 Geister kreisen 8 Sekunden um dich und beissen alles, was sie berühren.', en: '3 spirits circle you for 8 seconds and bite whatever they touch.' } },
  geisterwolf: { name: { de: 'Geisterwolf', en: 'Spirit Wolf' }, kind: 'ally', any: true, pow: 0.8, dur: 15, cd: 8, col: '#2ce8f5', icon: 's_wolf', desc: { de: 'Ein Geisterwolf jagt 15 Sekunden lang deine Gegner.', en: 'A spirit wolf hunts your enemies for 15 seconds.' } },
  erdstoss: { name: { de: 'Erdstoss', en: 'Earthquake' }, kind: 'magic', multi: true, any: true, pow: 1.0, cd: 4, radius: 115, stun: 0.8, col: '#d77643', icon: 's_quake', desc: { de: '100 % Schaden rundherum, Gegner sind kurz betäubt.', en: '100% damage around you, enemies are briefly stunned.' } },
  klingenfaecher: { name: { de: 'Klingenfächer', en: 'Blade Fan' }, kind: 'fan', any: true, n: 7, pow: 0.6, cd: 3, col: '#c0cbdc', icon: 's_fan', desc: { de: '7 Klingen im Fächer nach vorn, je 60 % Schaden.', en: '7 blades in a fan, 60% damage each.' } },
});
A.SHRINE_SPELLS = ['feuerball', 'eisnova', 'kettenblitz', 'blitzschritt', 'giftwolke', 'meteor', 'heilquelle', 'geisterschwarm', 'geisterwolf', 'erdstoss', 'klingenfaecher'];

// ---------- Passive Talente ----------
// mod: verändert die Heldenwerte (in derived); alles andere wirkt direkt in der Welt (world.js, h.tal)
A.TALENTS = {
  vampir:     { name: { de: 'Vampirzahn', en: 'Vampire Fang' }, icon: 't_fang', mod: { lifesteal: 5 }, desc: { de: '5 % des Schadens kommen als Leben zurück.', en: '5% of damage dealt returns as health.' } },
  dornen:     { name: { de: 'Dornenpanzer', en: 'Thorn Armor' }, icon: 't_thorn', mod: { thorns: 25, def: 2 }, desc: { de: 'Wer dich schlägt, bekommt 25 % zurück. +2 Rüstung.', en: 'Attackers take 25% back. +2 armor.' } },
  glaskanone: { name: { de: 'Glaskanone', en: 'Glass Cannon' }, icon: 't_glass', mod: { dmgPct: 35, hpPct: -20 }, desc: { de: '+35 % Schaden, aber 20 % weniger Leben.', en: '+35% damage, but 20% less health.' } },
  berserker:  { name: { de: 'Berserker', en: 'Berserker' }, icon: 't_rage', desc: { de: 'Je weniger Leben, desto mehr Schaden (bis +60 %).', en: 'The lower your health, the more damage (up to +60%).' } },
  kette:      { name: { de: 'Kettenreaktion', en: 'Chain Reaction' }, icon: 't_boom', desc: { de: 'Besiegte Gegner explodieren und treffen alle in der Nähe.', en: 'Defeated enemies explode and hit everything nearby.' } },
  wucht:      { name: { de: 'Doppelte Wucht', en: 'Double Impact' }, icon: 't_double', desc: { de: 'Jeder dritte normale Angriff trifft doppelt so hart.', en: 'Every third basic attack hits twice as hard.' } },
  rausch:     { name: { de: 'Blutrausch', en: 'Bloodlust' }, icon: 't_blood', desc: { de: 'Nach jedem Sieg über einen Gegner 3 Sekunden viel schneller angreifen.', en: 'After each kill, attack much faster for 3 seconds.' } },
  flink:      { name: { de: 'Flinke Füsse', en: 'Quick Feet' }, icon: 't_boots', mod: { spd: 3, dodge: 6 }, desc: { de: 'Schneller laufen, +6 % Ausweichen.', en: 'Move faster, +6% dodge.' } },
  frost:      { name: { de: 'Frostaura', en: 'Frost Aura' }, icon: 's_ice', desc: { de: 'Gegner in deiner Nähe werden langsam.', en: 'Enemies near you are slowed.' } },
  giftspur:   { name: { de: 'Giftspur', en: 'Poison Trail' }, icon: 's_poison', desc: { de: 'Beim Laufen bleibt eine giftige Spur am Boden.', en: 'You leave a poisonous trail when you move.' } },
  klingen:    { name: { de: 'Kreisende Klingen', en: 'Orbiting Blades' }, icon: 's_fan', desc: { de: 'Zwei Klingen kreisen ständig um dich.', en: 'Two blades constantly circle you.' } },
  engel:      { name: { de: 'Schutzengel', en: 'Guardian Angel' }, icon: 't_angel', desc: { de: 'Jeder Kampf beginnt mit einem Schild (25 % Leben).', en: 'Every fight starts with a shield (25% health).' } },
  geist:      { name: { de: 'Schneller Geist', en: 'Quick Mind' }, icon: 't_mind', desc: { de: 'Alle Zauber laden 20 % schneller.', en: 'All spells recharge 20% faster.' } },
  echo:       { name: { de: 'Zauberecho', en: 'Spell Echo' }, icon: 't_echo', desc: { de: '25 % Chance, dass ein Zauber sofort wieder bereit ist.', en: '25% chance a spell is ready again instantly.' } },
  strom:      { name: { de: 'Zauberstrom', en: 'Spell Surge' }, icon: 'u_spark', desc: { de: 'Jeder besiegte Gegner lädt alle Zauber 1 Sekunde schneller.', en: 'Each kill recharges all spells by 1 second.' } },
  gold:       { name: { de: 'Goldgier', en: 'Gold Greed' }, icon: 'coin', mod: { goldPct: 40 }, desc: { de: '+40 % Gold, Münzen fliegen von weiter her zu dir.', en: '+40% gold, coins fly to you from further away.' } },
  glueck:     { name: { de: 'Glückspilz', en: 'Lucky Mushroom' }, icon: 'u_star', mod: { crit: 8, itemLuck: 1 }, desc: { de: '+8 % Volltreffer, bessere Beute.', en: '+8% crit, better loot.' } },
  pulver:     { name: { de: 'Schwarzpulver', en: 'Black Powder' }, icon: 't_powder', desc: { de: 'Normale Angriffe explodieren manchmal (25 %).', en: 'Basic attacks sometimes explode (25%).' } },
  eisen:      { name: { de: 'Eiserne Haut', en: 'Iron Skin' }, icon: 's_shield', mod: { hpPct: 25, def: 3 }, desc: { de: '+25 % Leben und +3 Rüstung.', en: '+25% health and +3 armor.' } },
  spalt:      { name: { de: 'Gespaltener Schlag', en: 'Split Strike' }, icon: 's_whirl', desc: { de: 'Normale Angriffe: Nahkampf trifft weiter, Fernkampf schiesst 2 Extra-Geschosse.', en: 'Basic attacks: melee reaches further, ranged fires 2 extra shots.' } },
  seele:      { name: { de: 'Seelenfresser', en: 'Soul Eater' }, icon: 'u_skull', desc: { de: 'Jeder besiegte Gegner heilt dich um 3 % deines Lebens.', en: 'Each kill heals you for 3% of your health.' } },
  zaeh:       { name: { de: 'Zähes Leben', en: 'Tenacity' }, icon: 'u_heart', mod: { regen: 1, hpPct: 10 }, desc: { de: '+10 % Leben, heilt sich langsam selbst.', en: '+10% health, slowly regenerates.' } },
  begleiter:  { name: { de: 'Treuer Begleiter', en: 'Loyal Companion' }, icon: 's_wolf', desc: { de: 'Ein Geisterwolf kämpft dauerhaft an deiner Seite.', en: 'A spirit wolf fights at your side permanently.' } },
};

// ---------- Helfer ----------
A.Boons = (function () {
  const MAX_UPG = 2;
  const run = () => A.Game.run;
  const has = (id, r) => { r = r || run(); return !!(r && r.talents && r.talents.includes(id)); };
  const upgOf = (id, r) => { r = r || run(); return (r && r.upg && r.upg[id]) || 0; };
  // Stärke und Abklingzeit (Sekunden) eines Zaubers mit Verstärkungen und Talenten
  function pow(id) { return A.SKILLS[id].pow * (1 + 0.3 * upgOf(id)); }
  function cd(id) { return A.SKILLS[id].cd * 2 * (1 - 0.2 * upgOf(id)) * (has('geist') ? 0.8 : 1) * (hasTrophy('sandpharao') ? 0.8 : 1) * A.Gear.cdMul() * (1 - Math.min(0.5, A.Game.metaEffects().cdr)); }   // cdr: Schreibstube und Wimpel im Lager
  function hasTrophy(id) { const r = run(); return !!(r && r.gear && Object.values(r.gear).some(it => it && it.trophy === id)); }
  function icon(id) { const s = A.SKILLS[id]; return s && s.icon; }
  // Name mit Stufe (Feuerball II)
  function skName(id) { const n = A.t(A.SKILLS[id].name), u = upgOf(id); return u ? n + ' ' + ['', 'II', 'III'][u] : n; }
  // Summe der Talent-Werte für derived()
  function mods(r) {
    const o = {}; if (!r || !r.talents) return o;
    for (const id of r.talents) { const T = A.TALENTS[id]; if (T && T.mod) for (const k in T.mod) o[k] = (o[k] || 0) + T.mod[k]; }
    return o;
  }
  // Drei Angebote: möglichst je ein neuer Zauber, ein Talent und eine Verstärkung
  function offer(r, rng) {
    const cls = A.CLASSES.find(c => c.id === r.cls);
    const spells = rng.shuffle(A.SHRINE_SPELLS.concat(cls.skills).filter((s, i, a) => a.indexOf(s) === i && !r.known.includes(s))).map(id => ({ type: 'spell', id }));
    const tals = rng.shuffle(Object.keys(A.TALENTS).filter(id => !(r.talents || []).includes(id))).map(id => ({ type: 'talent', id }));
    const ups = rng.shuffle(r.active.filter(id => id && upgOf(id, r) < MAX_UPG)).map(id => ({ type: 'upg', id }));
    const out = [];
    for (const list of [spells, tals, ups]) if (list.length) out.push(list.shift());
    const rest = rng.shuffle(spells.concat(tals, ups));
    while (out.length < 3 && rest.length) out.push(rest.shift());
    return rng.shuffle(out);
  }
  return { MAX_UPG, has, upgOf, pow, cd, icon, skName, mods, offer };
})();
