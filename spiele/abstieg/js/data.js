// Der Abstieg – Spieldaten (Rassen, Klassen, Fähigkeiten, Items, Monster, Ereignisse, Texte)
// Alle Namen und Texte sind zweisprachig: { de, en }. A.L wählt beim Start die Sprache.
'use strict';
window.A = window.A || {};

A.LANG = (navigator.language || 'de').toLowerCase().startsWith('de') ? 'de' : 'en';
A.t = (o) => (o && typeof o === 'object' && (o.de || o.en)) ? (o[A.LANG] || o.de || o.en) : o;

// ---------- Texte der Oberfläche ----------
A.UI = {
  title: { de: 'Der Abstieg', en: 'The Descent' },
  tagline: { de: 'Sechs Welten. Unten ist der Ausgang. Angeblich.', en: 'Six worlds. The exit is at the bottom. Allegedly.' },
  howto: { de: 'Laufen: Joystick links / WASD · Schlagen: gelber Knopf / Leertaste · Fähigkeiten: 1-4 · Trank: Q · Benutzen: E · Heldenblatt: I', en: 'Move: joystick left / WASD · Attack: yellow button / Space · Skills: 1-4 · Potion: Q · Use: E · Hero sheet: I' },
  play: { de: 'Abstieg beginnen', en: 'Begin descent' },
  continueRun: { de: 'Durchlauf fortsetzen', en: 'Continue run' },
  meta: { de: 'Seelenfunken', en: 'Soul sparks' },
  race: { de: 'Rasse', en: 'Race' }, cls: { de: 'Klasse', en: 'Class' },
  locked: { de: 'Gesperrt', en: 'Locked' }, unlock: { de: 'Freischalten', en: 'Unlock' },
  start: { de: 'Los', en: 'Go' }, back: { de: 'Zurück', en: 'Back' },
  floor: { de: 'Ebene', en: 'Floor' }, gold: { de: 'Gold', en: 'Gold' }, hp: { de: 'Leben', en: 'Health' },
  level: { de: 'Stufe', en: 'Level' }, xp: { de: 'EP', en: 'XP' },
  node: { shrine: { de: 'Schrein', en: 'Shrine' }, fight: { de: 'Kampf', en: 'Fight' }, elite: { de: 'Elite', en: 'Elite' }, treasure: { de: 'Schatz', en: 'Treasure' }, shop: { de: 'Händler', en: 'Merchant' }, event: { de: 'Ereignis', en: 'Event' }, rest: { de: 'Rast', en: 'Rest' }, boss: { de: 'Boss', en: 'Boss' }, forge: { de: 'Schmiede', en: 'Forge' } },
  chooseRoom: { de: 'Wähle deinen Weg', en: 'Choose your path' },
  prep: { de: 'Aufstellung', en: 'Loadout' }, fightBtn: { de: 'Kämpfen!', en: 'Fight!' },
  front: { de: 'Vorne', en: 'Front' }, backRow: { de: 'Hinten', en: 'Back' },
  skills: { de: 'Zauber', en: 'Spells' }, items: { de: 'Ausrüstung', en: 'Gear' }, bag: { de: 'Beutel', en: 'Bag' },
  stats: { de: 'Werte', en: 'Stats' },
  stat: { str: { de: 'Stärke', en: 'Strength' }, tou: { de: 'Zähigkeit', en: 'Toughness' }, dex: { de: 'Geschick', en: 'Dexterity' }, mind: { de: 'Geist', en: 'Mind' }, luck: { de: 'Glück', en: 'Luck' } },
  derived: { atk: { de: 'Angriff', en: 'Attack' }, def: { de: 'Rüstung', en: 'Armor' }, spd: { de: 'Tempo', en: 'Speed' }, crit: { de: 'Volltreffer', en: 'Crit' }, dodge: { de: 'Ausweichen', en: 'Dodge' }, mag: { de: 'Zauberkraft', en: 'Magic' } },
  points: { de: 'Punkte frei', en: 'points to spend' },
  victory: { de: 'Sieg!', en: 'Victory!' }, defeat: { de: 'Gefallen', en: 'Fallen' },
  pickReward: { de: 'Wähle eine Belohnung', en: 'Choose a reward' }, skip: { de: 'Nichts nehmen', en: 'Take nothing' },
  equip: { de: 'Anlegen', en: 'Equip' }, sell: { de: 'Verkaufen', en: 'Sell' }, buy: { de: 'Kaufen', en: 'Buy' }, take: { de: 'Nehmen', en: 'Take' },
  levelUp: { de: 'Stufenaufstieg!', en: 'Level up!' }, newSkill: { de: 'Neuen Zauber wählen', en: 'Choose a new spell' },
  heal: { de: 'Ausruhen (+50 % Leben)', en: 'Rest (+50% health)' }, train: { de: 'Trainieren (+1 Statpunkt)', en: 'Train (+1 stat point)' },
  leave: { de: 'Weiter', en: 'Continue' }, descend: { de: 'Tiefer', en: 'Descend' },
  runOver: { de: 'Durchlauf vorbei', en: 'Run over' }, reached: { de: 'Erreichte Ebene', en: 'Reached floor' }, kills: { de: 'Besiegte Gegner', en: 'Enemies slain' },
  sparksEarned: { de: 'Seelenfunken erhalten', en: 'Soul sparks earned' },
  toCamp: { de: 'Zum Lager', en: 'To camp' },
  camp: { de: 'Das Lager', en: 'The camp' }, campInfo: { de: 'Hier oben wartet man. Und baut aus.', en: 'Up here you wait. And build.' },
  bought: { de: 'Freigeschaltet', en: 'Unlocked' },
  speed: { de: 'Tempo', en: 'Speed' },
  cooldown: { de: 'Abklingzeit', en: 'Cooldown' }, rounds: { de: 'Runden', en: 'rounds' },
  blocked: { de: 'Ebene 7 ist versperrt. Noch. Der Abstieg geht bald weiter.', en: 'Floor 7 is sealed. For now. The descent continues soon.' },
  win: { de: 'Du hast alle sechs Welten bezwungen! Und bist trotzdem weitergegangen.', en: 'You conquered all six worlds! And kept going anyway.' },
  potion: { de: 'Trank', en: 'Potion' }, usePotion: { de: 'Trank trinken (+40 %)', en: 'Drink potion (+40%)' },
  cursed: { de: 'verflucht', en: 'cursed' },
  rarity: { common: { de: 'gewöhnlich', en: 'common' }, good: { de: 'gut', en: 'good' }, rare: { de: 'selten', en: 'rare' }, epic: { de: 'episch', en: 'epic' }, legendary: { de: 'legendär', en: 'legendary' }, cursed: { de: 'verflucht', en: 'cursed' } },
  slot: { weapon: { de: 'Waffe', en: 'Weapon' }, armor: { de: 'Rüstung', en: 'Armor' }, helm: { de: 'Helm', en: 'Helm' }, boots: { de: 'Stiefel', en: 'Boots' }, trinket: { de: 'Schmuck', en: 'Trinket' } },
  sound: { de: 'Ton', en: 'Sound' },
  reset: { de: 'Alles löschen', en: 'Delete everything' },
  elitePrefix: { de: 'Elite', en: 'Elite' },
  dead: { de: 'Du bist gefallen auf Ebene', en: 'You fell on floor' },
  quest: { de: 'Aufgabe', en: 'Quest' }, questDone: { de: 'Aufgabe erfüllt!', en: 'Quest complete!' },
};

// ---------- Rassen ----------
// base: Grundwerte; perk: kurzer Text; mod: Änderungen an abgeleiteten Werten
A.RACES = [
  { id: 'mensch', name: { de: 'Mensch', en: 'Human' }, color: '#e8b98a', unlock: 0,
    perk: { de: 'Ausgeglichen. Ein Platz mehr für passive Segen.', en: 'Balanced. One extra slot for passive blessings.' },
    base: { str: 5, tou: 5, dex: 5, mind: 5, luck: 5 }, mod: { talentSlots: 1 } },
  { id: 'fels', name: { de: 'Felsgeborener', en: 'Stoneborn' }, color: '#9a9aa8', unlock: 0,
    perk: { de: 'Viel Leben und Rüstung, langsam.', en: 'Lots of health and armor, slow.' },
    base: { str: 6, tou: 9, dex: 2, mind: 3, luck: 5 }, mod: { hpMul: 1.25, def: 4, spd: -2 } },
  { id: 'schatten', name: { de: 'Schattenkind', en: 'Shadowkin' }, color: '#6d5ca8', unlock: 60,
    perk: { de: 'Ausweichen und Volltreffer, wenig Leben.', en: 'Dodge and crits, little health.' },
    base: { str: 4, tou: 3, dex: 9, mind: 4, luck: 5 }, mod: { hpMul: 0.8, dodge: 12, crit: 10 } },
  { id: 'pilz', name: { de: 'Pilzling', en: 'Sporeling' }, color: '#7fbf6a', unlock: 120,
    perk: { de: 'Vergiftet beim Treffen, heilt sich langsam.', en: 'Poisons on hit, slowly regenerates.' },
    base: { str: 4, tou: 6, dex: 4, mind: 6, luck: 5 }, mod: { poisonOnHit: 2, regen: 3 } },
  { id: 'kobold', name: { de: 'Blechkobold', en: 'Tin Kobold' }, color: '#c9a54a', unlock: 200,
    perk: { de: 'Mehr Gold, bessere Items, baut Fallen.', en: 'More gold, better items, sets traps.' },
    base: { str: 4, tou: 4, dex: 6, mind: 5, luck: 8 }, mod: { goldMul: 1.4, itemLuck: 1, trap: 8 } },
];

// ---------- Fähigkeiten ----------
// kind: 'attack' (phys), 'magic', 'heal', 'shield', 'buff', 'multi' (alle Gegner)
// pow: Vielfaches des Angriffs bzw. der Zauberkraft; cd: Abklingzeit in Runden; row: 'any' | 'front'
A.SKILLS = {
  // Klingenträger
  hieb:      { name: { de: 'Wuchthieb', en: 'Heavy Blow' }, kind: 'attack', pow: 1.8, cd: 2, desc: { de: '180 % Schaden auf einen Gegner.', en: '180% damage to one enemy.' } },
  wirbel:    { name: { de: 'Wirbelsturm', en: 'Whirlwind' }, kind: 'multi', pow: 0.9, cd: 3, desc: { de: '90 % Schaden auf alle Gegner.', en: '90% damage to all enemies.' } },
  schild:    { name: { de: 'Schildwall', en: 'Shield Wall' }, kind: 'shield', pow: 0.6, cd: 4, desc: { de: 'Schild in Höhe von 60 % des max. Lebens.', en: 'Shield worth 60% of max health.' } },
  kampfschrei: { name: { de: 'Kampfschrei', en: 'War Cry' }, kind: 'buff', stat: 'atk', pow: 0.3, dur: 3, cd: 5, desc: { de: '+30 % Angriff für 6 Sekunden.', en: '+30% attack for 6 seconds.' } },
  rache:     { name: { de: 'Vergeltung', en: 'Retribution' }, kind: 'attack', pow: 1.2, cd: 3, bonusMissingHp: 2, desc: { de: '120 % Schaden, bis zu +200 % je nach fehlendem Leben.', en: '120% damage, up to +200% based on missing health.' } },
  hinrichtung: { name: { de: 'Hinrichtung', en: 'Execute' }, kind: 'attack', pow: 1.0, cd: 3, execute: 0.3, desc: { de: '100 % Schaden, tötet Gegner unter 30 % Leben sofort.', en: '100% damage, instantly kills enemies below 30% health.' } },
  // Pfeilschütze
  zielschuss: { name: { de: 'Zielschuss', en: 'Aimed Shot' }, kind: 'attack', pow: 1.6, cd: 2, critBonus: 30, desc: { de: '160 % Schaden, +30 % Volltreffer-Chance.', en: '160% damage, +30% crit chance.' } },
  pfeilregen: { name: { de: 'Pfeilregen', en: 'Arrow Rain' }, kind: 'multi', pow: 0.7, cd: 3, desc: { de: '70 % Schaden auf alle Gegner.', en: '70% damage to all enemies.' } },
  giftpfeil: { name: { de: 'Giftpfeil', en: 'Poison Arrow' }, kind: 'attack', pow: 0.8, cd: 2, poison: 1.0, desc: { de: '80 % Schaden und Gift (100 % Angriff über 3 Sekunden).', en: '80% damage plus poison (100% attack over 3 seconds).' } },
  rueckzug:  { name: { de: 'Rückzug', en: 'Fall Back' }, kind: 'buff', stat: 'dodge', pow: 40, dur: 2, cd: 4, desc: { de: '+40 % Ausweichen für 4 Sekunden.', en: '+40% dodge for 4 seconds.' } },
  doppelschuss: { name: { de: 'Doppelschuss', en: 'Double Shot' }, kind: 'attack', pow: 0.9, hits: 2, cd: 2, desc: { de: 'Zwei Treffer zu je 90 %.', en: 'Two hits of 90% each.' } },
  kopfschuss: { name: { de: 'Kopfschuss', en: 'Headshot' }, kind: 'attack', pow: 2.6, cd: 4, desc: { de: '260 % Schaden auf einen Gegner.', en: '260% damage to one enemy.' } },
  // Fadenweber
  funke:     { name: { de: 'Fadenfunke', en: 'Thread Spark' }, kind: 'magic', pow: 1.7, cd: 2, desc: { de: '170 % Zauberschaden auf einen Gegner.', en: '170% magic damage to one enemy.' } },
  flaeche:   { name: { de: 'Gewebebrand', en: 'Weave Burn' }, kind: 'magic', multi: true, pow: 0.9, cd: 3, burn: 0.5, desc: { de: '90 % Zauberschaden auf alle, dazu Brand.', en: '90% magic damage to all, plus burn.' } },
  gewebe:    { name: { de: 'Schutzgewebe', en: 'Ward Weave' }, kind: 'shield', pow: 0.5, magic: true, cd: 3, desc: { de: 'Schild in Höhe von 50 % des max. Lebens.', en: 'Shield worth 50% of max health.' } },
  flicken:   { name: { de: 'Flicken', en: 'Mend' }, kind: 'heal', pow: 0.3, cd: 4, desc: { de: 'Heilt 30 % des max. Lebens.', en: 'Heals 30% of max health.' } },
  fesseln:   { name: { de: 'Fadenfessel', en: 'Thread Bind' }, kind: 'magic', pow: 0.8, cd: 3, stun: 1, desc: { de: '80 % Zauberschaden, Gegner ist 1 Sekunde betäubt.', en: '80% magic damage, stuns the enemy for 1 second.' } },
  entladung: { name: { de: 'Entladung', en: 'Discharge' }, kind: 'magic', multi: true, pow: 1.6, cd: 5, desc: { de: '160 % Zauberschaden auf alle Gegner.', en: '160% magic damage to all enemies.' } },
  // Rufer (wirkt in classes.js): Diener rufen, stärken und opfern; pow bei Dienern = Schaden pro Schlag
  knochenruf: { name: { de: 'Knochenruf', en: 'Bone Call' }, kind: 'summon', look: 'skel', n: 2, any: true, pow: 0.45, dur: 10, cd: 4, col: '#e0a4ff', icon: 's_skel', desc: { de: '2 Skelette steigen aus dem Boden und kämpfen 10 Sekunden mit (je 45 % pro Schlag).', en: '2 skeletons rise from the ground and fight for 10 seconds (45% per hit each).' } },
  seelenpfeil: { name: { de: 'Seelenpfeil', en: 'Soul Arrow' }, kind: 'magic', pow: 1.6, cd: 2, raise: true, col: '#e0a4ff', icon: 's_soul', desc: { de: '160 % Zauberschaden. Stirbt das Ziel, steht es als Geist auf und kämpft für dich.', en: '160% magic damage. If the target dies, it rises as a ghost and fights for you.' } },
  grabhaende: { name: { de: 'Grabeshände', en: 'Grave Hands' }, kind: 'grab', any: true, pow: 0.9, radius: 85, hold: 1.5, dur: 3, cd: 4, col: '#b55088', icon: 's_hand', desc: { de: 'Knochenhände packen alle Gegner im Kreis: 90 % Schaden, 1,5 Sekunden festgehalten, danach langsam.', en: 'Bone hands grab every enemy in a circle: 90% damage, held for 1.5 seconds, then slowed.' } },
  seelenband: { name: { de: 'Seelenband', en: 'Soul Bond' }, kind: 'rally', pow: 0.1, dur: 6, extend: 4, cd: 5, col: '#f6757a', icon: 's_band', desc: { de: 'Heilt dich um 10 %. Deine Diener sind 6 Sekunden schneller, machen 50 % mehr Schaden und bleiben 4 Sekunden länger.', en: 'Heals you 10%. Your minions are faster for 6 seconds, deal 50% more damage and stay 4 seconds longer.' } },
  opfergabe: { name: { de: 'Opfergabe', en: 'Offering' }, kind: 'sacrifice', any: true, pow: 1.3, radius: 80, cd: 3, col: '#b55088', icon: 's_offer', desc: { de: 'Alle Diener zerplatzen: je 130 % Schaden um sie herum, du heilst 5 % pro Diener.', en: 'All minions burst: 130% damage around each, you heal 5% per minion.' } },
  totenheer: { name: { de: 'Totenheer', en: 'Army of the Dead' }, kind: 'summon', look: 'skel', n: 5, any: true, pow: 0.4, dur: 8, cd: 7, col: '#e0a4ff', icon: 's_army', desc: { de: 'Ruft 5 Skelette auf einmal, 8 Sekunden lang.', en: 'Calls 5 skeletons at once, for 8 seconds.' } },
  // Braumeister (wirkt in classes.js): Flaschen fliegen im Bogen und zerplatzen am Ziel
  brandflasche: { name: { de: 'Brandflasche', en: 'Fire Flask' }, kind: 'lob', any: true, pow: 0.8, radius: 70, zone: 'fire', zpow: 0.3, zdur: 4, cd: 3, col: '#f77622', icon: 's_fflask', desc: { de: 'Wirft eine Flasche: 80 % Schaden in der Fläche, danach brennt der Boden 4 Sekunden.', en: 'Throws a flask: 80% area damage, then the ground burns for 4 seconds.' } },
  heiltrunk: { name: { de: 'Heiltrunk', en: 'Healing Draught' }, kind: 'brew', pow: 0.25, dur: 6, cd: 4, col: '#e43b44', icon: 's_brew', desc: { de: 'Heilt 25 % und gibt 6 Sekunden Rausch: schneller laufen und angreifen.', en: 'Heals 25% and gives 6 seconds of rush: move and attack faster.' } },
  giftflasche: { name: { de: 'Giftflasche', en: 'Poison Flask' }, kind: 'lob', any: true, pow: 0.4, radius: 85, zone: 'poison', zpow: 0.3, zdur: 5, cd: 3, col: '#63c74d', icon: 's_pflask', desc: { de: 'Wirft eine Flasche: eine Giftwolke vergiftet 5 Sekunden lang alles darin.', en: 'Throws a flask: a poison cloud poisons everything inside for 5 seconds.' } },
  frostflasche: { name: { de: 'Frostflasche', en: 'Frost Flask' }, kind: 'lob', any: true, pow: 0.9, radius: 80, freeze: 1, cd: 3, col: '#2ce8f5', icon: 's_iflask', desc: { de: 'Wirft eine Flasche: 90 % Schaden, alle Getroffenen frieren 1 Sekunde ein und werden langsam.', en: 'Throws a flask: 90% damage, everything hit freezes for 1 second and is slowed.' } },
  sprengfass: { name: { de: 'Sprengfass', en: 'Powder Keg' }, kind: 'barrel', any: true, pow: 2.4, radius: 115, cd: 5, col: '#feae34', icon: 's_barrel', desc: { de: 'Wirft ein Fass mit brennender Lunte. Kurz danach: 240 % Schaden in grosser Fläche.', en: 'Throws a keg with a burning fuse. Moments later: 240% damage in a large area.' } },
  wundertrank: { name: { de: 'Wundertrank', en: 'Wonder Brew' }, kind: 'wonder', any: true, pow: 0.7, cd: 4, col: '#c77dff', icon: 's_wonder', desc: { de: 'Trinkt etwas Unbekanntes: Riesenwuchs, Feuerspucke, Glückssträhne oder Blubberblasen.', en: 'Drinks something unknown: giant growth, fire breath, lucky streak or bubbles.' } },
};

// ---------- Klassen ----------
A.CLASSES = [
  { id: 'klinge', name: { de: 'Klingenträger', en: 'Bladebearer' }, color: '#d9534f', unlock: 0, row: 'front',
    perk: { de: 'Nahkampf. Schaden und Verteidigung.', en: 'Melee. Damage and defense.' },
    base: { str: 3, tou: 2, dex: 0, mind: 0, luck: 0 }, skills: ['hieb', 'schild', 'kampfschrei', 'wirbel', 'rache', 'hinrichtung'], startSkills: ['hieb', 'schild'], weapon: 'schwert' },
  { id: 'schuetze', name: { de: 'Pfeilschütze', en: 'Arrowshot' }, color: '#5cb85c', unlock: 0, row: 'back',
    perk: { de: 'Schiesst aus der Ferne. Volltreffer.', en: 'Shoots from afar. Crits.' },
    base: { str: 1, tou: 0, dex: 3, mind: 0, luck: 1 }, skills: ['zielschuss', 'giftpfeil', 'doppelschuss', 'pfeilregen', 'rueckzug', 'kopfschuss'], startSkills: ['zielschuss', 'giftpfeil'], weapon: 'bogen' },
  { id: 'weber', name: { de: 'Fadenweber', en: 'Threadweaver' }, color: '#5bc0de', unlock: 0, row: 'back',
    perk: { de: 'Zauber aus der Ferne, Flächen, Schilde, Heilung.', en: 'Area spells, shields, healing.' },
    base: { str: 0, tou: 1, dex: 0, mind: 4, luck: 0 }, skills: ['funke', 'gewebe', 'flaeche', 'flicken', 'fesseln', 'entladung'], startSkills: ['funke', 'gewebe'], weapon: 'stab' },
  { id: 'rufer', name: { de: 'Rufer', en: 'Caller' }, color: '#b07cd8', unlock: 0, row: 'back',
    perk: { de: 'Ruft Skelette und Geister, die mitkämpfen. Besiegte Gegner stehen manchmal als Geist auf.', en: 'Calls skeletons and ghosts that fight alongside. Slain enemies sometimes rise as ghosts.' },
    base: { str: 0, tou: 1, dex: 0, mind: 3, luck: 1 }, skills: ['knochenruf', 'seelenpfeil', 'grabhaende', 'seelenband', 'opfergabe', 'totenheer'], startSkills: ['knochenruf', 'seelenpfeil'], weapon: 'zepter' },
  { id: 'brau', name: { de: 'Braumeister', en: 'Brewmaster' }, color: '#e0a83a', unlock: 0, row: 'back',
    perk: { de: 'Wirft platzende Flaschen. Tränke heilen 60 % und geben Rausch. Startet mit einem Trank mehr.', en: 'Throws bursting flasks. Potions heal 60% and give rush. Starts with one extra potion.' },
    base: { str: 1, tou: 1, dex: 1, mind: 1, luck: 3 }, skills: ['brandflasche', 'heiltrunk', 'giftflasche', 'frostflasche', 'sprengfass', 'wundertrank'], startSkills: ['brandflasche', 'heiltrunk'], weapon: 'kelle', potionPct: 0.6, startPotion: 1 },
];

// ---------- Items ----------
A.RARITY = {
  common:    { color: '#c0cbdc', affixes: 0, mult: 1.0,  weight: 50 },
  good:      { color: '#63c74d', affixes: 1, mult: 1.15, weight: 30 },
  rare:      { color: '#3fa9f5', affixes: 2, mult: 1.3,  weight: 14 },
  epic:      { color: '#c77dff', affixes: 3, mult: 1.5,  weight: 5 },
  legendary: { color: '#feae34', affixes: 3, mult: 1.8,  weight: 1 },
  cursed:    { color: '#e43b44', affixes: 3, mult: 1.9,  weight: 3 },
};
A.SLOTS = ['weapon', 'armor', 'helm', 'boots', 'trinket', 'trinket2'];

// Grund-Items je Platz (Werte bei Ebene 1, skalieren mit der Ebene)
A.BASES = [
  { id: 'schwert', slot: 'weapon', name: { de: 'Schwert', en: 'Sword' }, atk: 6, cls: ['klinge', 'brau'] },
  { id: 'axt', slot: 'weapon', name: { de: 'Axt', en: 'Axe' }, atk: 8, spd: -1, cls: ['klinge', 'brau'] },
  { id: 'dolch', slot: 'weapon', name: { de: 'Dolch', en: 'Dagger' }, atk: 4, crit: 10, spd: 1, cls: ['klinge', 'schuetze', 'brau'] },
  { id: 'bogen', slot: 'weapon', name: { de: 'Bogen', en: 'Bow' }, atk: 6, crit: 5, cls: ['schuetze'] },
  { id: 'armbrust', slot: 'weapon', name: { de: 'Armbrust', en: 'Crossbow' }, atk: 9, spd: -1, cls: ['schuetze'] },
  { id: 'stab', slot: 'weapon', name: { de: 'Stab', en: 'Staff' }, mag: 7, cls: ['weber', 'rufer'] },
  { id: 'zepter', slot: 'weapon', name: { de: 'Zepter', en: 'Scepter' }, mag: 5, hp: 15, cls: ['weber', 'rufer'] },
  { id: 'loeffel', slot: 'weapon', name: { de: 'Löffel', en: 'Spoon' }, atk: 3, mag: 3, cls: ['klinge', 'schuetze', 'weber', 'rufer', 'brau'] },
  { id: 'kelle', slot: 'weapon', name: { de: 'Braukelle', en: 'Brew Ladle' }, atk: 4, mag: 4, hp: 10, cls: ['brau'] },
  { id: 'leder', slot: 'armor', name: { de: 'Lederwams', en: 'Leather Jerkin' }, def: 3, dodge: 3 },
  { id: 'kette', slot: 'armor', name: { de: 'Kettenhemd', en: 'Chainmail' }, def: 6, spd: -1 },
  { id: 'robe', slot: 'armor', name: { de: 'Robe', en: 'Robe' }, def: 2, mag: 3 },
  { id: 'platte', slot: 'armor', name: { de: 'Plattenpanzer', en: 'Plate Armor' }, def: 9, spd: -2, hp: 10 },
  { id: 'kappe', slot: 'helm', name: { de: 'Kappe', en: 'Cap' }, def: 1, dodge: 2 },
  { id: 'topfhelm', slot: 'helm', name: { de: 'Topfhelm', en: 'Bucket Helm' }, def: 4 },
  { id: 'teekessel', slot: 'helm', name: { de: 'Teekessel', en: 'Tea Kettle' }, def: 3, mag: 3 },
  { id: 'stiefel', slot: 'boots', name: { de: 'Stiefel', en: 'Boots' }, spd: 1, def: 1 },
  { id: 'sandalen', slot: 'boots', name: { de: 'Sandalen', en: 'Sandals' }, spd: 2, dodge: 3 },
  { id: 'stahlstiefel', slot: 'boots', name: { de: 'Stahlstiefel', en: 'Steel Boots' }, def: 3 },
  { id: 'ring', slot: 'trinket', name: { de: 'Ring', en: 'Ring' }, crit: 4 },
  { id: 'amulett', slot: 'trinket', name: { de: 'Amulett', en: 'Amulet' }, hp: 20 },
  { id: 'socke', slot: 'trinket', name: { de: 'Socke', en: 'Sock' }, dodge: 4 },
  { id: 'zahn', slot: 'trinket', name: { de: 'Zahn', en: 'Tooth' }, atk: 2, mag: 2 },
];

// Zusatz-Eigenschaften: key -> Wert pro Stufe, Text
A.AFFIXES = [
  { key: 'atkPct', val: 12, name: { de: 'des Zorns', en: 'of Wrath' }, text: { de: '+{v} % Angriff', en: '+{v}% attack' } },
  { key: 'magPct', val: 12, name: { de: 'der Fäden', en: 'of Threads' }, text: { de: '+{v} % Zauberkraft', en: '+{v}% magic' } },
  { key: 'hp', val: 25, name: { de: 'des Ochsen', en: 'of the Ox' }, text: { de: '+{v} Leben', en: '+{v} health' } },
  { key: 'def', val: 4, name: { de: 'der Mauer', en: 'of the Wall' }, text: { de: '+{v} Rüstung', en: '+{v} armor' } },
  { key: 'crit', val: 8, name: { de: 'des Falken', en: 'of the Falcon' }, text: { de: '+{v} % Volltreffer', en: '+{v}% crit' } },
  { key: 'dodge', val: 7, name: { de: 'des Schattens', en: 'of Shadows' }, text: { de: '+{v} % Ausweichen', en: '+{v}% dodge' } },
  { key: 'spd', val: 2, name: { de: 'des Windes', en: 'of the Wind' }, text: { de: '+{v} Tempo', en: '+{v} speed' } },
  { key: 'lifesteal', val: 8, name: { de: 'des Blutegels', en: 'of the Leech' }, text: { de: '{v} % Schaden als Heilung', en: '{v}% damage as healing' } },
  { key: 'thorns', val: 15, name: { de: 'der Dornen', en: 'of Thorns' }, text: { de: 'Angreifer erleiden {v} % zurück', en: 'Attackers take {v}% back' } },
  { key: 'goldPct', val: 25, name: { de: 'des Krämers', en: 'of the Peddler' }, text: { de: '+{v} % Gold', en: '+{v}% gold' } },
  { key: 'xpPct', val: 20, name: { de: 'des Lehrlings', en: 'of the Apprentice' }, text: { de: '+{v} % Erfahrung', en: '+{v}% experience' } },
  { key: 'poisonOnHit', val: 3, name: { de: 'der Natter', en: 'of the Viper' }, text: { de: 'Treffer vergiften ({v}/Sekunde)', en: 'Hits poison ({v}/second)' } },
  { key: 'startShield', val: 15, name: { de: 'der Vorsicht', en: 'of Caution' }, text: { de: 'Ebenen-Start: Schild {v} %', en: 'Floor start: shield {v}%' } },
  { key: 'regen', val: 3, name: { de: 'des Moores', en: 'of the Moor' }, text: { de: '+{v} % Leben alle 2 Sekunden', en: '+{v}% health every 2 seconds' } },
];

// Frech-Texte für Items (reine Deko)
A.QUIRKS = [
  { de: 'Riecht nach nassem Hund.', en: 'Smells like wet dog.' },
  { de: 'Pfeift bei jedem Treffer.', en: 'Whistles on every hit.' },
  { de: 'Vorbesitzer: unbekannt, vermutlich tot.', en: 'Previous owner: unknown, probably dead.' },
  { de: 'Glänzt nur, wenn niemand hinschaut.', en: 'Only shines when nobody looks.' },
  { de: 'Hat eine Delle. Die Delle hat eine Geschichte.', en: 'Has a dent. The dent has a story.' },
  { de: 'Flüstert nachts Rezepte.', en: 'Whispers recipes at night.' },
  { de: 'Gönner-Kommentar: «Mutig. Dumm, aber mutig.»', en: 'Patron comment: "Brave. Stupid, but brave."' },
  { de: 'Passt perfekt. Beunruhigend perfekt.', en: 'Fits perfectly. Disturbingly perfectly.' },
  { de: 'Kratzt. Egal wo.', en: 'Itches. Everywhere.' },
  { de: 'Zählt deine Schritte. Laut.', en: 'Counts your steps. Out loud.' },
];

// ---------- Elemente auf Ausrüstung: 2, 4 und 6 Teile desselben Elements schalten Boni frei (wirkt in gear.js) ----------
A.ELEMENTS = {
  feuer: { name: { de: 'Feuer', en: 'Fire' }, col: '#f77622', icon: 'el_feuer', tiers: [
    { de: 'Treffer setzen Gegner in Brand (15 % deiner Stärke pro Sekunde).', en: 'Hits set enemies on fire (15% of your power per second).' },
    { de: 'Brennende Gegner explodieren beim Tod (60 % Stärke im Umkreis).', en: 'Burning enemies explode on death (60% power around them).' },
    { de: 'Alle 5 Sekunden schlägt ein Meteor beim nächsten Gegner ein (150 % Stärke).', en: 'Every 5 seconds a meteor strikes the nearest enemy (150% power).' }] },
  eis: { name: { de: 'Eis', en: 'Ice' }, col: '#9be8ff', icon: 'el_eis', tiers: [
    { de: 'Treffer verlangsamen Gegner.', en: 'Hits slow enemies.' },
    { de: 'Jeder 4. Treffer friert das Ziel 1 Sekunde ein (Bosse kürzer).', en: 'Every 4th hit freezes the target for 1 second (bosses shorter).' },
    { de: '+40 % Schaden gegen langsame und gefrorene Gegner. Wirst du getroffen: Eisnova (alle 4 Sekunden).', en: '+40% damage to slowed and frozen enemies. When hit: ice nova (every 4 seconds).' }] },
  blitz: { name: { de: 'Blitz', en: 'Lightning' }, col: '#fee761', icon: 'el_blitz', tiers: [
    { de: '+2 Tempo, Angriffe 10 % schneller.', en: '+2 speed, attacks 10% faster.' },
    { de: 'Alle 3 Sekunden springt ein Blitz auf bis zu 3 Gegner (60 % Stärke).', en: 'Every 3 seconds lightning jumps to up to 3 enemies (60% power).' },
    { de: 'Zauber laden 25 % schneller, jeder Zauber löst einen Kettenblitz aus.', en: 'Spells recharge 25% faster, every spell triggers chain lightning.' }] },
  gift: { name: { de: 'Gift', en: 'Poison' }, col: '#63c74d', icon: 'el_gift', tiers: [
    { de: 'Treffer vergiften (20 % Stärke pro Sekunde, 3 Sekunden).', en: 'Hits poison (20% power per second, 3 seconds).' },
    { de: 'Vergiftete Gegner hinterlassen beim Tod eine Giftwolke.', en: 'Poisoned enemies leave a poison cloud on death.' },
    { de: 'Gift wirkt doppelt so stark und springt beim Tod auf 2 Gegner in der Nähe.', en: 'Poison is twice as strong and jumps to 2 nearby enemies on death.' }] },
  schatten: { name: { de: 'Schatten', en: 'Shadow' }, col: '#b55088', icon: 'el_schatten', tiers: [
    { de: '+8 % Volltreffer, +5 % Ausweichen.', en: '+8% crit, +5% dodge.' },
    { de: 'Nach dem Ausweichen ist dein nächster Treffer ein Volltreffer.', en: 'After you dodge, your next hit is a critical hit.' },
    { de: 'Volltreffer machen +60 % mehr Schaden und verkürzen deine Abklingzeiten um 0,4 Sekunden.', en: 'Crits deal +60% more damage and cut your cooldowns by 0.4 seconds.' }] },
  stein: { name: { de: 'Stein', en: 'Stone' }, col: '#c0cbdc', icon: 'el_stein', tiers: [
    { de: '+15 % Leben, +3 Rüstung.', en: '+15% health, +3 armor.' },
    { de: 'Bei jedem Kampfbeginn: Schild mit 30 % deines Lebens.', en: 'At the start of every fight: shield worth 30% of your health.' },
    { de: 'Du nimmst 20 % weniger Schaden. Bricht dein Schild, bebt die Erde (150 % Stärke).', en: 'You take 20% less damage. When your shield breaks, the earth quakes (150% power).' }] },
};
A.EL_TIERS = [2, 4, 6];

// ---------- Besondere Kräfte auf seltenen, epischen und legendären Items ({v} = zufällige Stärke; low: kleiner ist besser) ----------
// Gleiche Kräfte auf mehreren Stücken stapeln (gear.js): cap = höchstens so viel, minv = bei «low» nie kleiner als das
A.POWERS = {
  zauberklinge: { name: { de: 'Zauberklinge', en: 'Spellblade' }, min: 60, max: 120, text: { de: 'Nach einem Zauber macht dein nächster Angriff +{v} % Schaden.', en: 'After a spell, your next attack deals +{v}% damage.' } },
  riesentoeter: { name: { de: 'Riesentöter', en: 'Giantslayer' }, min: 20, max: 40, text: { de: '+{v} % Schaden gegen Elite-Gegner und Bosse.', en: '+{v}% damage to elites and bosses.' } },
  vampirkuss: { name: { de: 'Vampirkuss', en: 'Vampire Kiss' }, min: 2, max: 4, cap: 8, text: { de: 'Volltreffer heilen {v} % deines Lebens.', en: 'Crits heal {v}% of your health.' } },
  zweiterwind: { name: { de: 'Zweiter Wind', en: 'Second Wind' }, min: 20, max: 35, cap: 70, text: { de: 'Einmal pro Raum: Fällst du unter 30 % Leben, heilst du {v} %.', en: 'Once per room: dropping below 30% health heals you {v}%.' } },
  seelensammler: { name: { de: 'Seelensammler', en: 'Soul Collector' }, min: 15, max: 30, text: { de: 'Jeder Sieg: +1 % Schaden bis zum Ende der Ebene (höchstens +{v} %).', en: 'Every kill: +1% damage until the end of the floor (up to +{v}%).' } },
  nachbeben: { name: { de: 'Nachbeben', en: 'Aftershock' }, min: 4, max: 6, low: true, minv: 2, text: { de: 'Jeder {v}. Treffer löst einen Erdstoss um das Ziel aus.', en: 'Every {v}th hit triggers a quake around the target.' } },
  schattenwolf: { name: { de: 'Schattenwolf', en: 'Shadow Wolf' }, min: 9, max: 14, low: true, minv: 5, text: { de: 'Alle {v} Sekunden kämpft ein Schattenwolf 6 Sekunden mit.', en: 'Every {v} seconds a shadow wolf fights along for 6 seconds.' } },
  raserei: { name: { de: 'Raserei', en: 'Frenzy' }, min: 4, max: 8, cap: 16, text: { de: 'Jeder Treffer: +{v} % Angriffstempo für 2 Sekunden (bis 5-mal).', en: 'Every hit: +{v}% attack speed for 2 seconds (up to 5 times).' } },
  funkenflug: { name: { de: 'Funkenflug', en: 'Sparkflight' }, min: 3, max: 5, text: { de: 'Jeder Zauber schickt {v} Funken zu Gegnern in der Nähe.', en: 'Every spell sends {v} sparks at nearby enemies.' } },
  goldmagnet: { name: { de: 'Goldmagnet', en: 'Gold Magnet' }, min: 20, max: 40, text: { de: '+{v} % Gold, und Gold fliegt von weit her zu dir.', en: '+{v}% gold, and gold flies to you from afar.' } },
  panzerbrecher: { name: { de: 'Panzerbrecher', en: 'Armor Breaker' }, min: 2, max: 4, text: { de: 'Treffer senken die Rüstung des Ziels um {v} (bis 5-mal).', en: 'Hits lower the target\'s armor by {v} (up to 5 times).' } },
  wirbelklingen: { name: { de: 'Wirbelklingen', en: 'Whirling Blades' }, min: 6, max: 9, low: true, minv: 4, text: { de: 'Alle {v} Sekunden kreisen 4 Sekunden lang 3 Klingen um dich.', en: 'Every {v} seconds 3 blades circle you for 4 seconds.' } },
  sturmlauf: { name: { de: 'Sturmlauf', en: 'Stormrun' }, min: 20, max: 40, cap: 80, text: { de: 'Nach jedem Sieg: 3 Sekunden lang +{v} % Lauftempo.', en: 'After every kill: +{v}% move speed for 3 seconds.' } },
  glueckspilz: { name: { de: 'Glückspilz', en: 'Lucky Charm' }, min: 3, max: 6, cap: 15, text: { de: '+{v} % Chance, dass Gegner ein Item fallen lassen.', en: '+{v}% chance that enemies drop an item.' } },
  phoenix: { name: { de: 'Phönix', en: 'Phoenix' }, min: 30, max: 50, cap: 100, legendary: true, text: { de: 'Einmal pro Ebene: Stirbst du, stehst du mit {v} % Leben wieder auf.', en: 'Once per floor: if you die, you rise again with {v}% health.' } },
};

// Legendäre und verfluchte Einzelstücke
A.UNIQUES = [
  { id: 'u_loeffel', base: 'loeffel', rarity: 'legendary', el: 'blitz', name: { de: 'Löffel der Verzweiflung', en: 'Spoon of Despair' }, stats: { atkPct: 40, magPct: 40, dodge: -10 }, flavor: { de: 'Gegner lachen dich aus. Dann sterben sie.', en: 'Enemies laugh at you. Then they die.' } },
  { id: 'u_socke', base: 'socke', rarity: 'legendary', el: 'schatten', name: { de: 'Socke der zweiten Chance', en: 'Sock of Second Chances' }, stats: { revive: 1, dodge: 5 }, flavor: { de: 'Einmal pro Durchlauf überlebst du mit 1 Leben.', en: 'Once per run you survive with 1 health.' } },
  { id: 'u_kessel', base: 'teekessel', rarity: 'legendary', el: 'feuer', name: { de: 'Helm aus Teekesseln', en: 'Helm of Tea Kettles' }, stats: { def: 10, magPct: 25 }, flavor: { de: 'Pfeift bei jedem Treffer. Gegner hassen das.', en: 'Whistles on every hit. Enemies hate it.' } },
  { id: 'u_zahn', base: 'zahn', rarity: 'cursed', el: 'gift', name: { de: 'Verfluchter Goldzahn', en: 'Cursed Gold Tooth' }, stats: { goldPct: 200, regen: -2 }, flavor: { de: 'Dreifaches Gold. Du verlierst laufend Leben.', en: 'Triple gold. You keep losing health.' } },
  { id: 'u_axt', base: 'axt', rarity: 'cursed', el: 'feuer', name: { de: 'Axt des Wahnsinns', en: 'Axe of Madness' }, stats: { atkPct: 70, def: -8 }, flavor: { de: 'Schlägt doppelt so hart. Vergisst, sich zu ducken.', en: 'Hits twice as hard. Forgets to duck.' } },
  { id: 'u_ring', base: 'ring', rarity: 'legendary', el: 'blitz', name: { de: 'Ring des Gönners', en: 'Patron\'s Ring' }, stats: { goldPct: 50, xpPct: 30, luck: 3 }, flavor: { de: 'Jemand da oben mag dich. Vorerst.', en: 'Someone up there likes you. For now.' } },
];

// ---------- Monster ----------
// stats bei Ebene 1: hp, atk, def, spd; row: front/back; kind: melee/ranged/magic; floors: ab Ebene
A.MONSTERS = [
  { id: 'schleimer', name: { de: 'Schleimer', en: 'Slimer' }, hp: 22, atk: 5, def: 0, spd: 3, row: 'front', kind: 'melee', floors: [1, 4], color: '#6fdc7a', shape: 'blob' },
  { id: 'ratte', name: { de: 'Höhlenratte', en: 'Cave Rat' }, hp: 16, atk: 6, def: 0, spd: 7, row: 'front', kind: 'melee', floors: [1, 5], color: '#8a6a4a', shape: 'rat', crit: 10 },
  { id: 'fledermaus', name: { de: 'Fledermaus', en: 'Bat' }, hp: 12, atk: 5, def: 0, spd: 9, row: 'back', kind: 'ranged', floors: [1, 4], color: '#5a4a6a', shape: 'bat', dodge: 20 },
  { id: 'pilzkrieger', name: { de: 'Pilzkrieger', en: 'Fungus Warrior' }, hp: 34, atk: 7, def: 2, spd: 3, row: 'front', kind: 'melee', floors: [2, 6], color: '#b86fa0', shape: 'mushroom', poisonOnHit: 2 },
  { id: 'knochen', name: { de: 'Knochenwächter', en: 'Bone Warden' }, hp: 40, atk: 8, def: 4, spd: 4, row: 'front', kind: 'melee', floors: [3, 6], color: '#e8e2d0', shape: 'skeleton' },
  { id: 'glutmotte', name: { de: 'Glutmotte', en: 'Ember Moth' }, hp: 18, atk: 7, def: 0, spd: 8, row: 'back', kind: 'magic', floors: [3, 6], color: '#ff8a3d', shape: 'moth', burn: 0.4 },
  { id: 'spinne', name: { de: 'Fadenspinne', en: 'Thread Spider' }, hp: 26, atk: 7, def: 1, spd: 6, row: 'back', kind: 'ranged', floors: [2, 6], color: '#3a3a4a', shape: 'spider', poisonOnHit: 2 },
  { id: 'rostgolem', name: { de: 'Rostgolem', en: 'Rust Golem' }, hp: 70, atk: 10, def: 7, spd: 1, row: 'front', kind: 'melee', floors: [4, 6], color: '#a0522d', shape: 'golem' },
  { id: 'schattenfaenger', name: { de: 'Schattenfänger', en: 'Shadow Catcher' }, hp: 30, atk: 11, def: 1, spd: 7, row: 'back', kind: 'magic', floors: [4, 6], color: '#2e2a4a', shape: 'ghost', dodge: 15 },
  { id: 'tunnelwurm', name: { de: 'Tunnelwurm', en: 'Tunnel Worm' }, hp: 55, atk: 9, def: 3, spd: 2, row: 'front', kind: 'melee', floors: [5, 6], color: '#c08a6a', shape: 'worm' },
  { id: 'spiegelgeist', name: { de: 'Spiegelgeist', en: 'Mirror Ghost' }, hp: 28, atk: 9, def: 0, spd: 6, row: 'back', kind: 'magic', floors: [5, 6], color: '#9fd8ff', shape: 'ghost', thorns: 30 },
  { id: 'kobolddieb', name: { de: 'Kobold-Dieb', en: 'Kobold Thief' }, hp: 24, atk: 6, def: 1, spd: 8, row: 'front', kind: 'melee', floors: [2, 5], color: '#c9a54a', shape: 'kobold', steal: 1 },
];
// Neue Gegner der Welten (Werte bei Ebene 1, sie wachsen mit der Tiefe)
// Besonderes: leap (springt), rooted (steht fest), spread (Fächer aus Geschossen), slowOnHit (bremst), teleport (verschwindet und taucht neben dir auf), fly (schwebt über Gefahr-Boden)
A.MONSTERS.push(
  { id: 'frosch', name: { de: 'Giftfrosch', en: 'Poison Frog' }, hp: 24, atk: 7, def: 1, spd: 5, kind: 'melee', color: '#63c74d', shape: 'frog', leap: true, poisonOnHit: 2 },
  { id: 'ranke', name: { de: 'Rankenschlinger', en: 'Vine Lasher' }, hp: 36, atk: 7, def: 2, spd: 0, kind: 'ranged', color: '#3e8948', shape: 'vine', rooted: true, spread: 3, shotCol: '#63c74d' },
  { id: 'skorpion', name: { de: 'Sandskorpion', en: 'Sand Scorpion' }, hp: 30, atk: 8, def: 4, spd: 6, kind: 'melee', color: '#d77643', shape: 'scorpion', poisonOnHit: 3 },
  { id: 'mumie', name: { de: 'Mumie', en: 'Mummy' }, hp: 50, atk: 9, def: 2, spd: 2, kind: 'melee', color: '#ead4aa', shape: 'mummy', slowOnHit: true },
  { id: 'krabbe', name: { de: 'Panzerkrabbe', en: 'Shell Crab' }, hp: 38, atk: 8, def: 8, spd: 4, kind: 'melee', color: '#e43b44', shape: 'crab' },
  { id: 'qualle', name: { de: 'Blitzqualle', en: 'Shock Jelly' }, hp: 24, atk: 8, def: 0, spd: 5, kind: 'magic', color: '#2ce8f5', shape: 'jelly', fly: true, dodge: 10, shotCol: '#2ce8f5' },
  { id: 'glutwicht', name: { de: 'Glutwicht', en: 'Ember Imp' }, hp: 22, atk: 9, def: 1, spd: 8, kind: 'magic', color: '#f77622', shape: 'imp', burn: 0.6, shotCol: '#feae34' },
  { id: 'leerenauge', name: { de: 'Leerenauge', en: 'Void Eye' }, hp: 30, atk: 10, def: 1, spd: 5, kind: 'magic', color: '#b55088', shape: 'eye', teleport: true, fly: true },
);
for (const id of ['fledermaus', 'glutmotte', 'schattenfaenger', 'spiegelgeist']) A.MONSTERS.find(m => m.id === id).fly = true;
// Elite-Eigenschaften (Regeln in js/elites.js): je tiefer, desto mehr davon. col = Farbe für Schein und Namen, tip = kurzer Hinweis im Kampf,
// text = Erklärung im Elite-Buch, heal = hält sich am Leben (davon höchstens eine pro Elite)
A.ELITE_TRAITS = {
  flink: { name: { de: 'Flink', en: 'Swift' }, col: '#fee761', icon: 'ef_flink', tip: { de: 'viel schneller', en: 'much faster' }, text: { de: 'Läuft und schlägt viel schneller und zieht Nachbilder hinter sich her.', en: 'Moves and strikes much faster, leaving afterimages behind.' } },
  gepanzert: { name: { de: 'Gepanzert', en: 'Armored' }, col: '#c0cbdc', icon: 'ef_panzer', tip: { de: 'dicke Rüstung, kein Rückstoss', en: 'thick armor, no knockback' }, text: { de: 'Viel mehr Rüstung und lässt sich nicht zurückstossen. Bei jedem Treffer sprühen Funken.', en: 'Much more armor and cannot be knocked back. Sparks fly with every hit.' } },
  giftig: { name: { de: 'Giftig', en: 'Toxic' }, col: '#63c74d', icon: 'el_gift', tip: { de: 'hinterlässt eine Giftspur', en: 'leaves a poison trail' }, text: { de: 'Hinterlässt grüne Giftpfützen und vergiftet bei Treffern.', en: 'Leaves green poison puddles and poisons with its hits.' } },
  feurig: { name: { de: 'Feurig', en: 'Fiery' }, col: '#f77622', icon: 'el_feuer', tip: { de: 'Feuerring: Abstand halten!', en: 'ring of fire: keep away!' }, text: { de: 'Bleibt stehen, glüht auf und lässt einen Feuerring um sich los. Wer drinsteht, brennt.', en: 'Stops, glows up and unleashes a ring of fire. Whoever stands in it burns.' } },
  frostig: { name: { de: 'Frostig', en: 'Frosty' }, col: '#9be8ff', icon: 'el_eis', tip: { de: 'Eiskreis unter dir: raus!', en: 'ice circle under you: get out!' }, text: { de: 'Lässt unter dir einen Eiskreis entstehen. Wer zu langsam ist, friert fest. Seine Treffer bremsen.', en: 'Makes an ice circle appear under you. Too slow and you freeze. Its hits slow you.' } },
  explosiv: { name: { de: 'Explosiv', en: 'Explosive' }, col: '#feae34', icon: 'ef_bombe', tip: { de: 'platzt beim Tod: weg da!', en: 'bursts on death: run!' }, text: { de: 'Platzt kurz nach dem Tod. Die Explosion trifft dich und auch die anderen Gegner.', en: 'Bursts shortly after death. The blast hits you and other enemies too.' } },
  beschwoerer: { name: { de: 'Beschwörer', en: 'Summoner' }, col: '#b55088', icon: 'ef_ruf', tip: { de: 'ruft Helfer', en: 'calls helpers' }, text: { de: 'Ruft immer wieder Helfer aus dem Boden.', en: 'Keeps calling helpers out of the ground.' } },
  blinzelnd: { name: { de: 'Blinzelnd', en: 'Blinking' }, col: '#e0a4ff', icon: 'ef_blink', tip: { de: 'springt durch den Raum', en: 'jumps around the room' }, text: { de: 'Verschwindet und taucht an einer anderen Stelle wieder auf.', en: 'Vanishes and reappears somewhere else.' } },
  schild: { name: { de: 'Schildträger', en: 'Shielded' }, col: '#2ce8f5', icon: 'ef_schild', heal: true, tip: { de: 'Schild lädt nach', en: 'shield recharges' }, text: { de: 'Trägt einen Schild aus Licht. Lässt man ihn kurz in Ruhe, lädt der Schild wieder auf.', en: 'Wears a shield of light. Leave it alone for a moment and the shield recharges.' } },
  vampir: { name: { de: 'Vampir', en: 'Vampire' }, col: '#f6757a', icon: 'ef_vampir', heal: true, tip: { de: 'heilt sich mit Treffern', en: 'heals with its hits' }, text: { de: 'Jeder Treffer an dir heilt ihn.', en: 'Every hit on you heals it.' } },
  riese: { name: { de: 'Riesig', en: 'Giant' }, col: '#e4a672', icon: 'ef_riese', tip: { de: 'Stampfer: Abstand halten!', en: 'stomp: keep away!' }, text: { de: 'Doppelt so gross, viel mehr Leben. Stampft auf den Boden und wirft dich um.', en: 'Twice the size, much more health. Stomps the ground and knocks you down.' } },
  gewitter: { name: { de: 'Gewitter', en: 'Stormcaller' }, col: '#7fd8ff', icon: 'el_blitz', tip: { de: 'Blitze schlagen ein: ausweichen!', en: 'lightning strikes: dodge!' }, text: { de: 'Ruft Blitze, die an den markierten Stellen einschlagen.', en: 'Calls lightning that strikes the marked spots.' } },
  wuetend: { name: { de: 'Wütend', en: 'Enraged' }, col: '#e43b44', icon: 'ef_wut', tip: { de: 'ab halbem Leben rasend', en: 'frenzied below half health' }, text: { de: 'Ab halbem Leben wird er rasend: schneller und stärker.', en: 'Below half health it goes into a frenzy: faster and stronger.' } },
  spiegel: { name: { de: 'Spiegelnd', en: 'Mirrored' }, col: '#ffffff', icon: 'ef_spiegel', tip: { de: 'spaltet sich in Spiegelbilder', en: 'splits into mirror images' }, text: { de: 'Bei halbem Leben tauchen zwei Spiegelbilder auf, die mitkämpfen.', en: 'At half health two mirror images appear and join the fight.' } },
  klingen: { name: { de: 'Klingenwirbel', en: 'Bladestorm' }, col: '#8b9bb4', icon: 'ef_klingen', tip: { de: 'Klingen kreisen um ihn', en: 'blades circle around it' }, text: { de: 'Drei Klingen kreisen um ihn. Nicht zu lange danebenstehen.', en: 'Three blades circle around it. Do not stand next to it for long.' } },
  heiler: { name: { de: 'Heiler', en: 'Healer' }, col: '#c8f5a0', icon: 'ef_heil', heal: true, tip: { de: 'heilt andere Gegner: zuerst besiegen!', en: 'heals other enemies: defeat it first!' }, text: { de: 'Heilt die anderen Gegner im Raum. Am besten zuerst besiegen.', en: 'Heals the other enemies in the room. Best defeated first.' } },
};
A.ELITE_BOOK_SPARKS = 10;   // Seelenfunken, wenn man eine Eigenschaft zum ersten Mal besiegt (Elite-Buch im Lager)
A.ELITE_BOOK_DMG = 0.02;    // jede Seite im Elite-Buch: +2 % Schaden gegen Elite-Gegner, für immer
// Bosse, je einer am Ende jeder Welt (jede 4. Ebene)
A.BOSSES = {
  schleimkoenig: { id: 'schleimkoenig', name: { de: 'Schleimkönig', en: 'Slime King' }, hp: 170, atk: 11, def: 2, spd: 3, kind: 'melee', color: '#3fbf5a', shape: 'blob', boss: true,
       trick: { de: 'Springt auf dich: weg aus dem grünen Kreis! Teilt sich bei halbem Leben.', en: 'Leaps at you: leave the green circle! Splits at half health.' }, split: true },
  dornenmutter: { id: 'dornenmutter', name: { de: 'Dornenmutter', en: 'Thorn Mother' }, hp: 200, atk: 11, def: 3, spd: 1, kind: 'ranged', color: '#63c74d', shape: 'vine', boss: true, spread: 5, shotCol: '#a2e05a', summon: 'frosch', summonCd: 9,
       trick: { de: 'Ranken brechen aus dem Boden und halten dich fest. Ruft Giftfrösche.', en: 'Vines burst from the ground and hold you. Calls poison frogs.' } },
  sandpharao: { id: 'sandpharao', name: { de: 'Sandpharao', en: 'Sand Pharaoh' }, hp: 230, atk: 13, def: 6, spd: 3, kind: 'melee', color: '#feae34', shape: 'mummy', boss: true, ring: 8, ringCd: 6, summon: 'mumie', summonCd: 12, slowOnHit: true,
       trick: { de: 'Sandsäulen in einer Reihe, Sandsog zieht dich zu ihm. Weckt Mumien.', en: 'Rows of sand pillars, a sand pull drags you in. Wakes mummies.' } },
  kraken: { id: 'kraken', name: { de: 'Tiefenkraken', en: 'Deep Kraken' }, hp: 250, atk: 12, def: 5, spd: 2, kind: 'magic', color: '#b55088', shape: 'octopus', boss: true, ring: 10, ringCd: 6, spread: 3, shotCol: '#68386c',
       trick: { de: 'Die Flut kommt: rein in einen hellen Kreis! Tentakel aus dem Boden.', en: 'The tide comes: get into a bright circle! Tentacles from below.' } },
  rostkoenig: { id: 'rostkoenig', name: { de: 'Rostkönig', en: 'Rust King' }, hp: 280, atk: 15, def: 9, spd: 2, kind: 'melee', color: '#8a3a1a', shape: 'golem', boss: true, ring: 6, ringCd: 7,
       trick: { de: 'Hammerschläge hinterlassen Lava. Waffentreffer heilen ihn um 2 %.', en: 'Hammer slams leave lava. Weapon hits heal him 2%.' }, healOnPhys: 0.02 },
  waechter: { id: 'waechter', name: { de: 'Wächter der Tiefe', en: 'Warden of the Deep' }, hp: 320, atk: 16, def: 8, spd: 4, kind: 'magic', color: '#e43b44', shape: 'eye', boss: true, ring: 12, ringCd: 5, teleport: true, summon: 'leerenauge', summonCd: 10, fly: true,
       trick: { de: 'Ein Leerenstrahl dreht durch den Raum. Taucht neben dir auf.', en: 'A void beam sweeps the room. Appears beside you.' } },
};

// Boss-Trophäen: gibt es nur einmal pro Durchgang vom jeweiligen Boss, mit einer besonderen Kraft (wirkt in world.js)
A.TROPHIES = {
  schleimkoenig: { base: 'kappe', power: 'schleim', el: 'stein', name: { de: 'Krone des Schleimkönigs', en: 'Crown of the Slime King' }, stats: { hp: 40, regen: 1 },
    text: { de: 'Fällst du unter 30 % Leben, umhüllt dich Schleim (Schild 35 %), einmal pro Raum.', en: 'Below 30% health, slime wraps you (35% shield), once per room.' }, flavor: { de: 'Klebt. Für immer.', en: 'Sticky. Forever.' } },
  dornenmutter: { base: 'amulett', power: 'dorn', el: 'gift', name: { de: 'Dornenherz', en: 'Thorn Heart' }, stats: { thorns: 25 },
    text: { de: 'Wirst du getroffen, schiessen 8 Dornen rundum (alle 2 Sekunden).', en: 'When hit, 8 thorns burst out around you (every 2 seconds).' }, flavor: { de: 'Schlägt noch. Sticht auch.', en: 'Still beating. Also stinging.' } },
  sandpharao: { base: 'ring', power: 'sand', el: 'blitz', name: { de: 'Sanduhr des Pharao', en: 'Pharaoh\'s Hourglass' }, stats: { spd: 2 },
    text: { de: 'Alle Zauber laden 20 % schneller.', en: 'All spells recharge 20% faster.' }, flavor: { de: 'Der Sand läuft nach oben. Niemand weiss, warum.', en: 'The sand runs upward. Nobody knows why.' } },
  kraken: { base: 'zahn', power: 'tinte', el: 'eis', name: { de: 'Tintenfass des Kraken', en: 'Kraken\'s Inkwell' }, stats: { magPct: 20, atkPct: 10 },
    text: { de: 'Jeder 4. Angriff schiesst einen Tintenring (8 Kugeln).', en: 'Every 4th attack fires an ink ring (8 orbs).' }, flavor: { de: 'Schreibt nur Drohbriefe.', en: 'Only writes threatening letters.' } },
  rostkoenig: { base: 'stahlstiefel', power: 'glut', el: 'feuer', name: { de: 'Glutstiefel des Rostkönigs', en: 'Rust King\'s Ember Boots' }, stats: { def: 6, spd: 1 },
    text: { de: 'Beim Laufen hinterlässt du Glut, die Gegner verbrennt.', en: 'You leave embers while walking that burn enemies.' }, flavor: { de: 'Warme Füsse, heisse Spur.', en: 'Warm feet, hot trail.' } },
  waechter: { base: 'socke', power: 'auge', el: 'schatten', name: { de: 'Auge der Tiefe', en: 'Eye of the Deep' }, stats: { crit: 12 },
    text: { de: 'Volltreffer reissen ein Leerenloch auf, das explodiert.', en: 'Critical hits tear open a void rift that explodes.' }, flavor: { de: 'Es blinzelt, wenn du nicht hinschaust.', en: 'It blinks when you are not looking.' } },
};

// Legendäre Gegenstände (Regeln in js/legends.js): 20 Einzelstücke, die die Spielweise verändern, und eine Sammlung im Lager.
// src: boss = vom Weltenboss (boss), elite = von Elite-Gegnern mit dieser Eigenschaft (trait), secret = Truhe im geheimen Raum dieser Welt (world, 0-5).
// base: Grund-Item ('weapon' = Waffe der eigenen Klasse), ico: eigenes Bildchen (art.js i_...), stats: kommen zu den Grundwerten dazu
A.LEGENDS = {
  pudding: { src: 'boss', boss: 'schleimkoenig', base: 'amulett', ico: 'pudding', el: 'stein', stats: { hp: 25, regen: 1 },
    name: { de: 'Pudding, der Thronfolger', en: 'Pudding, Heir to the Throne' },
    text: { de: 'Ein kleiner Schleim kämpft an deiner Seite. Er beisst zu und verschluckt angeschlagene Gegner ganz. Jeder macht ihn grösser und stärker (bis 10 pro Ebene).', en: 'A little slime fights at your side. It bites and swallows weakened enemies whole. Each one makes it bigger and stronger (up to 10 per floor).' },
    flavor: { de: 'Der Schleimkönig hatte einen Sohn. Jetzt hast du einen.', en: 'The Slime King had a son. Now you do.' } },
  strickjacke: { src: 'boss', boss: 'dornenmutter', base: 'leder', ico: 'strick', el: 'gift', stats: { def: 4, thorns: 20 },
    name: { de: 'Strickjacke der Dornenmutter', en: 'Thorn Mother\'s Cardigan' },
    text: { de: 'Doppelter Dornen-Rückschaden. Wirst du getroffen, schiessen Ranken aus dem Boden und halten die Gegner rundum fest (alle 4 Sekunden).', en: 'Double thorn damage. When you are hit, vines burst from the ground and hold the enemies around you (every 4 seconds).' },
    flavor: { de: 'Selbst gestrickt. Aus Dornen. Mit Liebe. Hauptsächlich Dornen.', en: 'Hand-knitted. From thorns. With love. Mostly thorns.' } },
  totenmaske: { src: 'boss', boss: 'sandpharao', base: 'kappe', ico: 'maske', el: 'blitz', stats: { def: 3, crit: 5, spd: 1 },
    name: { de: 'Totenmaske des Pharao', en: 'Pharaoh\'s Death Mask' },
    text: { de: 'Alle 15 Sekunden im Kampf steht die Zeit 2 Sekunden still: Gegner und ihre Geschosse erstarren zu Sand (Bosse nur kurz).', en: 'Every 15 seconds in battle, time stands still for 2 seconds: enemies and their projectiles freeze into sand (bosses only briefly).' },
    flavor: { de: 'Der Pharao wollte ewig leben. Die Maske hat es wenigstens versucht.', en: 'The pharaoh wanted to live forever. The mask at least tried.' } },
  bademantel: { src: 'boss', boss: 'kraken', base: 'robe', ico: 'mantel', el: 'eis', stats: { def: 3, dodge: 6, magPct: 10 },
    name: { de: 'Bademantel des Kraken', en: 'Kraken\'s Bathrobe' },
    text: { de: 'Wirst du getroffen, spritzt eine Tintenwolke (alle 4 Sekunden). Gegner darin sehen nichts und schlagen jedes zweite Mal daneben.', en: 'When you are hit, you squirt an ink cloud (every 4 seconds). Enemies inside can\'t see and miss every other attack.' },
    flavor: { de: 'Acht Ärmel. Riecht nach Meer und schlechten Entscheidungen.', en: 'Eight sleeves. Smells of sea and bad decisions.' } },
  amboss: { src: 'boss', boss: 'rostkoenig', base: 'ring', ico: 'amboss', el: 'feuer', stats: { def: 4, atkPct: 10 },
    name: { de: 'Amboss im Abo', en: 'Anvil Subscription' },
    text: { de: 'Alle 4 Sekunden fällt ein Amboss auf den Gegner mit dem meisten Leben: grosser Schaden, kurz betäubt, weniger Rüstung.', en: 'Every 4 seconds an anvil drops on the enemy with the most health: big damage, a short stun, less armor.' },
    flavor: { de: 'Monatlich kündbar. Hat noch nie jemand geschafft.', en: 'Cancel any month. Nobody ever has.' } },
  waechterauge: { src: 'boss', boss: 'waechter', base: 'weapon', ico: 'auge', el: 'schatten', stats: { crit: 8, atkPct: 12, magPct: 12 },
    name: { de: 'Wächterauge am Stiel', en: 'Warden\'s Eye on a Stick' },
    text: { de: 'Jeder 4. besiegte Gegner reisst ein Leerenloch auf: Es saugt die Gegner an und explodiert.', en: 'Every 4th enemy you defeat tears open a void rift: it pulls enemies in and explodes.' },
    flavor: { de: 'Es schaut dir beim Kämpfen zu. Und macht sich Notizen.', en: 'It watches you fight. And takes notes.' } },
  riesenpilz: { src: 'elite', trait: 'riese', base: 'kappe', ico: 'pilz', el: 'stein', stats: { hp: 30, def: 2, atkPct: 15, magPct: 15 },
    name: { de: 'Riesenpilz-Hut', en: 'Giant Mushroom Hat' },
    text: { de: 'Du bist riesig: mehr Leben, breitere Schläge, grössere Geschosse, Gegner fliegen weiter. Dafür etwas langsamer.', en: 'You are huge: more health, wider swings, bigger projectiles, enemies fly farther. A bit slower, though.' },
    flavor: { de: 'Nebenwirkungen: Grösse. Weitere Nebenwirkungen: noch mehr Grösse.', en: 'Side effects: size. Further side effects: more size.' } },
  spiegelscherbe: { src: 'elite', trait: 'spiegel', base: 'ring', ico: 'scherbe', el: 'schatten', stats: { crit: 6, magPct: 10 },
    name: { de: 'Spiegelscherbe', en: 'Mirror Shard' },
    text: { de: 'Angriffs-Zauber wirkt dein Spiegelbild gleich noch einmal, mit halber Kraft.', en: 'Your mirror image casts your attack spells once more, at half power.' },
    flavor: { de: 'Sieben Jahre Pech. Aber doppelt so viele Feuerbälle.', en: 'Seven years of bad luck. But twice the fireballs.' } },
  gebiss: { src: 'elite', trait: 'vampir', base: 'zahn', ico: 'gebiss', el: 'gift', stats: { lifesteal: 8, atk: 3, mag: 3 },
    name: { de: 'Gebiss des Grafen', en: 'The Count\'s Dentures' },
    text: { de: 'Heilung über dein volles Leben hinaus wird zu einem Schild (bis 40 % deines Lebens).', en: 'Healing beyond your full health becomes a shield (up to 40% of your health).' },
    flavor: { de: 'Der Graf vermisst es nicht. Er hat ein zweites.', en: 'The Count won\'t miss it. He has a spare.' } },
  blitzableiter: { src: 'elite', trait: 'gewitter', base: 'topfhelm', ico: 'blitzab', el: 'blitz', stats: { def: 3, spd: 1, crit: 4 },
    name: { de: 'Blitzableiter', en: 'Lightning Rod' },
    text: { de: 'Deine normalen Angriffe springen als Blitz auf 2 weitere Gegner über (halber Schaden, mit 4 Blitz-Teilen auf 3).', en: 'Your basic attacks arc to 2 more enemies as lightning (half damage, 3 with 4 lightning pieces).' },
    flavor: { de: 'Zieht Blitze an. Das ist der Sinn der Sache. Glaubst du.', en: 'Attracts lightning. That\'s the point. You think.' } },
  grillschuerze: { src: 'elite', trait: 'feurig', base: 'leder', ico: 'schuerze', el: 'feuer', stats: { def: 4, hp: 15 },
    name: { de: 'Grillschürze', en: 'Grill Apron' },
    text: { de: 'Gegner in deiner Nähe brennen ständig. Du selbst brennst nicht mehr.', en: 'Enemies near you keep burning. You no longer burn.' },
    flavor: { de: 'Küss den Koch. Oder lieber nicht, er brennt.', en: 'Kiss the cook. Or better not, he\'s on fire.' } },
  schneekugel: { src: 'elite', trait: 'frostig', base: 'ring', ico: 'kugel', el: 'eis', stats: { crit: 4, atkPct: 8, magPct: 8 },
    name: { de: 'Schneekugel', en: 'Snow Globe' },
    text: { de: 'Jeder 5. Treffer friert den Gegner ein. Eingefrorene oder betäubte Gegner unter 30 % Leben zerspringen in Eissplitter.', en: 'Every 5th hit freezes the enemy. Frozen or stunned enemies below 30% health shatter into ice shards.' },
    flavor: { de: 'Schütteln auf eigene Gefahr.', en: 'Shake at your own risk.' } },
  latschen: { src: 'elite', trait: 'explosiv', base: 'sandalen', ico: 'ente', el: 'eis', stats: { spd: 1, dodge: 4 },
    name: { de: 'Quietsche-Latschen', en: 'Squeaky Flip-Flops' },
    text: { de: 'Alle 9 Sekunden lässt du eine Quietsche-Ente fallen. Gegner prügeln auf sie ein, bis sie explodiert.', en: 'Every 9 seconds you drop a rubber duck. Enemies beat on it until it explodes.' },
    flavor: { de: 'Anschleichen war gestern.', en: 'Sneaking was yesterday.' } },
  teppich: { src: 'elite', trait: 'flink', base: 'stiefel', ico: 'teppich', el: 'blitz', stats: { spd: 2, dodge: 8 },
    name: { de: 'Fliegender Teppich', en: 'Flying Carpet' },
    text: { de: 'Du schwebst: Schlamm, Treibsand, Glut und Giftpfützen können dir nichts mehr.', en: 'You hover: mud, quicksand, embers and poison puddles can\'t touch you anymore.' },
    flavor: { de: 'Fliegt nur zwei Handbreit hoch. Mehr steht nicht in der Garantie.', en: 'Flies only two hands high. The warranty says nothing more.' } },
  floete: { src: 'secret', world: 0, base: 'weapon', ico: 'floete', el: 'gift', stats: { atkPct: 10, magPct: 10, dodge: 3 },
    name: { de: 'Flöte des Rattenfängers', en: 'Pied Piper\'s Flute' },
    text: { de: 'Alle 7 Sekunden folgen dir 3 Ratten in den Kampf.', en: 'Every 7 seconds, 3 rats follow you into battle.' },
    flavor: { de: 'Spielt nur ein Lied. Die Ratten mögen es trotzdem.', en: 'Plays only one song. The rats like it anyway.' } },
  wuerfel: { src: 'secret', world: 1, base: 'ring', ico: 'wuerfel', el: 'schatten', stats: { luck: 3, crit: 5 },
    name: { de: 'Würfel des Gönners', en: 'Patron\'s Die' },
    text: { de: 'Zu Beginn jedes Kampfs wird gewürfelt: 1 Gold, 2 schneller schlagen, 3 Gegner verlieren Leben, 4 Schild, 5 mehr Volltreffer, 6 doppelter Schaden.', en: 'At the start of every fight the die is rolled: 1 gold, 2 faster attacks, 3 enemies lose health, 4 shield, 5 more crits, 6 double damage.' },
    flavor: { de: 'Die Gönner wetten auf dich. Meistens dagegen.', en: 'The patrons bet on you. Mostly against.' } },
  prahlhans: { src: 'secret', world: 2, base: 'weapon', ico: 'prahl', el: 'feuer', stats: { atkPct: 12, magPct: 12, crit: 5 },
    name: { de: 'Prahlhans', en: 'The Braggart' },
    text: { de: 'Jeder besiegte Gegner im Raum: +8 % Schaden (bis +80 %). Ein harter Treffer halbiert die Prahlerei.', en: 'Each enemy defeated in a room: +8% damage (up to +80%). A hard hit halves the bragging.' },
    flavor: { de: 'Erzählt jedem, wie viele es waren. Übertreibt immer.', en: 'Tells everyone how many it was. Always exaggerates.' } },
  pfannen: { src: 'secret', world: 3, base: 'platte', ico: 'pfanne', el: 'stein', stats: { def: 8, hp: 20 },
    name: { de: 'Rüstung aus Bratpfannen', en: 'Frying Pan Armor' },
    text: { de: 'Jeder 3. Treffer prallt ab. Dich schiebt nichts mehr weg. Ausweichen kannst du darin aber nicht.', en: 'Every 3rd hit bounces off. Nothing pushes you around anymore. But you can\'t dodge in it.' },
    flavor: { de: 'Schwer, laut und mit Antihaft-Beschichtung.', en: 'Heavy, loud and non-stick.' } },
  muenzfresser: { src: 'secret', world: 4, base: 'weapon', ico: 'muenz', el: 'feuer', stats: { atkPct: 10, magPct: 10, goldPct: 50 },
    name: { de: 'Münzfresser', en: 'Coin Eater' },
    text: { de: 'Jeder normale Angriff frisst 1 Gold und trifft dafür 60 % härter. Ohne Gold schlägt er nur schwach zu.', en: 'Every basic attack eats 1 gold and hits 60% harder for it. Without gold it only hits weakly.' },
    flavor: { de: 'Er liebt dich. Vor allem dein Geld.', en: 'It loves you. Especially your money.' } },
  voodoo: { src: 'secret', world: 5, base: 'socke', ico: 'voodoo', el: 'schatten', stats: { crit: 6, dodge: 3 },
    name: { de: 'Voodoo-Puppe', en: 'Voodoo Doll' },
    text: { de: 'Was du einem Gegner antust, spüren alle anderen im Raum ein bisschen mit (20 %).', en: 'Whatever you do to one enemy, all others in the room feel a little of it too (20%).' },
    flavor: { de: 'Sieht aus wie jemand, den du kennst. Gut so.', en: 'Looks like someone you know. Good.' } },
};
// Zehn verrückte Stücke (Regeln in js/wild.js): fallen überall (Truhen, Elite-Gegner, Kämpfe, Weltenbosse), ab Welt 2 viel öfter
Object.assign(A.LEGENDS, {
  bienen: { src: 'wild', base: 'topfhelm', ico: 'bienen', el: 'gift', stats: { hp: 15, dodge: 3, def: 2 },
    name: { de: 'Bienenkorb-Helm', en: 'Beehive Helmet' },
    text: { de: 'Ein Bienenvolk wohnt in deinem Helm: 6 Bienen stechen Gegner (Gift). Wirst du getroffen, werden sie sauer: doppelt so viele, 5 Sekunden lang.', en: 'A bee colony lives in your helmet: 6 bees sting enemies (poison). When you are hit they get angry: twice as many, for 5 seconds.' },
    flavor: { de: 'Summt. Immer. Auch nachts.', en: 'Buzzes. Always. Even at night.' } },
  banane: { src: 'wild', base: 'stiefel', ico: 'banane', el: 'blitz', stats: { spd: 2, luck: 2 },
    name: { de: 'Affenstiefel', en: 'Monkey Boots' },
    text: { de: 'Läufst du im Kampf, fallen Bananenschalen aus den Stiefeln. Wer drauftritt, rutscht aus, überschlägt sich und bleibt kurz liegen.', en: 'When you run in battle, banana peels drop from your boots. Whoever steps on one slips, flips over and lies there for a moment.' },
    flavor: { de: 'Der älteste Witz der Welt. Funktioniert immer noch.', en: 'The oldest joke in the world. Still works.' } },
  zwerg: { src: 'wild', base: 'kappe', ico: 'zwerg', el: 'stein', stats: { def: 3, hp: 20 },
    name: { de: 'Zipfelmütze der Gartenzwerge', en: 'Garden Gnome Hat' },
    text: { de: 'Im Kampf stellst du alle 6 Sekunden einen Gartenzwerg auf (bis 3). Die Zwerge werfen Steinchen auf die Gegner.', en: 'In battle you set up a garden gnome every 6 seconds (up to 3). The gnomes throw pebbles at enemies.' },
    flavor: { de: 'Sie lächeln. Immer. Das ist das Unheimliche.', en: 'They smile. Always. That is the creepy part.' } },
  blasen: { src: 'wild', base: 'teekessel', ico: 'blasen', el: 'eis', stats: { def: 2, magPct: 12, atkPct: 6 },
    name: { de: 'Blubber-Teekessel', en: 'Bubbling Kettle' },
    text: { de: 'Der Kessel auf deinem Kopf kocht Seifenblasen. Gegner, die eine berühren, schweben 2.5 Sekunden hilflos darin, dann platzt sie mit Wucht.', en: 'The kettle on your head boils soap bubbles. Enemies that touch one float helplessly inside for 2.5 seconds, then it bursts with force.' },
    flavor: { de: 'Pfeift beim Kochen. Blubbert beim Kämpfen.', en: 'Whistles when boiling. Bubbles when fighting.' } },
  kisti: { src: 'wild', base: 'amulett', ico: 'kisti', el: 'schatten', stats: { luck: 2, goldPct: 20 },
    name: { de: 'Kisti, die hungrige Truhe', en: 'Chesty, the Hungry Chest' },
    text: { de: 'Eine kleine Truhe mit Zähnen hüpft dir nach und beisst Gegner. Sie frisst herumliegende Münzen (das Gold bekommst du trotzdem) und spuckt alle 20 Münzen ein Item aus.', en: 'A little chest with teeth hops after you and bites enemies. It eats coins lying around (you still get the gold) and spits out an item every 20 coins.' },
    flavor: { de: 'Füttern erlaubt. Streicheln auf eigene Gefahr.', en: 'Feeding allowed. Petting at your own risk.' } },
  wolke: { src: 'wild', base: 'ring', ico: 'wolke', el: 'blitz', stats: { crit: 5, magPct: 10 },
    name: { de: 'Gewitterwolke an der Leine', en: 'Storm Cloud on a Leash' },
    text: { de: 'Eine kleine Gewitterwolke schwebt über dir und schlägt alle 1.4 Sekunden einen Blitz in den nächsten Gegner. Jeder 5. Blitz springt weiter.', en: 'A little storm cloud floats above you and strikes the nearest enemy with lightning every 1.4 seconds. Every 5th bolt jumps on.' },
    flavor: { de: 'Hat schlechte Laune. Aber auf deiner Seite.', en: 'In a bad mood. But on your side.' } },
  pinata: { src: 'wild', base: 'weapon', ico: 'pinata', el: 'feuer', stats: { atkPct: 12, magPct: 12, hp: 10 },
    name: { de: 'Piñata-Keule', en: 'Piñata Club' },
    text: { de: 'Besiegte Gegner platzen wie eine Piñata: Konfetti und 3 Bonbons, die dich heilen (je 2 %). Elite-Gegner platzen in 8 Bonbons.', en: 'Defeated enemies burst like a piñata: confetti and 3 candies that heal you (2% each). Elites burst into 8 candies.' },
    flavor: { de: 'Drinnen war Süsses. Draussen ist Chaos.', en: 'Inside was candy. Outside is chaos.' } },
  sparschwein: { src: 'wild', base: 'platte', ico: 'sparschwein', el: 'stein', stats: { def: 6, hp: 25, goldPct: 15 },
    name: { de: 'Sparschwein-Panzer', en: 'Piggy Bank Armor' },
    text: { de: 'Jede Münze, die du aufhebst, legt eine Münze ins Sparschwein über deinem Kopf. Ein harter Treffer lässt es platzen: die Münzen schiessen rundum (je voller, desto stärker) und fallen als Gold zu Boden.', en: 'Every coin you pick up drops a coin into the piggy bank above your head. A hard hit makes it burst: the coins shoot out all around (the fuller, the stronger) and fall to the ground as gold.' },
    flavor: { de: 'Oink. Klimper. BUMM.', en: 'Oink. Clink. BOOM.' } },
  troete: { src: 'wild', base: 'zahn', ico: 'troete', el: 'feuer', stats: { spd: 1, crit: 4, hp: 10 },
    name: { de: 'Party-Tröte', en: 'Party Horn' },
    text: { de: 'Alle 7 Sekunden im Kampf trötest du: eine Schallwelle mit Konfetti stösst alle Gegner rundum weg und betäubt sie kurz.', en: 'Every 7 seconds in battle you toot: a sound wave with confetti knocks all enemies around you away and stuns them briefly.' },
    flavor: { de: 'Die Party ist da, wo du bist. Ob die anderen wollen oder nicht.', en: 'The party is wherever you are. Whether the others like it or not.' } },
  klatsche: { src: 'wild', base: 'weapon', ico: 'klatsche', el: 'schatten', stats: { atkPct: 15, magPct: 15, crit: 4 },
    name: { de: 'Fliegenklatsche der Riesen', en: 'Giant\'s Fly Swatter' },
    text: { de: 'Jeder 4. normale Angriff ist eine riesige Fliegenklatsche: grosser Schaden in einer Linie vor dir. Gegner unter 30 % Leben werden plattgedrückt.', en: 'Every 4th basic attack is a giant fly swatter: big damage in a line in front of you. Enemies below 30% health get flattened.' },
    flavor: { de: 'Für sehr grosse Fliegen. Und kleine Drachen.', en: 'For very big flies. And small dragons.' } },
});
// Chance auf ein verrücktes Stück je Gelegenheit: [Welt 1, ab Welt 2]; noch nie gefundene Stücke 1.5-mal so oft
A.WILD_CHANCE = { chest: [0.04, 0.12], elite: [0.02, 0.06], room: [0.01, 0.03], boss: [0, 0.25] };
A.LEGEND_SPARKS = 20;   // Seelenfunken für jede Legende, die zum ersten Mal in die Sammlung kommt
A.LEGEND_DMG = 0.01;     // jede Legende in der Sammlung: +1 % Schaden, für immer

// Kombos (Regeln in js/combos.js): zwei passende Teile wecken am Schrein eine neue Kraft, die es nur zusammen gibt.
// need: die zwei Teile. tal = passiver Segen, el = mindestens 2 Ausrüstungs-Teile dieses Elements, spell = Zauber (im Zauberbuch reicht),
// leg = getragene Legende, tro = getragene Trophäe dieses Bosses, cls = Klasse. col: Farbe der Kombo
A.COMBOS = {
  feuerwerk: { need: [{ tal: 'kette' }, { el: 'feuer' }], col: '#f77622',
    name: { de: 'Feuerwerk', en: 'Fireworks' },
    text: { de: 'Jede Explosion der Kettenreaktion schiesst 4 Raketen auf Gegner in der Nähe. Sie zerplatzen bunt und setzen alles in Brand.', en: 'Every chain reaction blast launches 4 rockets at nearby enemies. They burst in color and set everything on fire.' },
    flavor: { de: 'Ab jetzt ist jeden Abend Silvester.', en: 'From now on, every night is New Year\'s Eve.' } },
  domino: { need: [{ tal: 'kette' }, { tal: 'pulver' }], col: '#feae34',
    name: { de: 'Domino', en: 'Domino' },
    text: { de: 'Jede Explosion hat 35 % Chance, gleich daneben noch eine auszulösen, bis zu 2-mal hintereinander.', en: 'Every explosion has a 35% chance to set off another one right next to it, up to 2 in a row.' },
    flavor: { de: 'Einer fällt. Alle fallen. Laut.', en: 'One falls. All fall. Loudly.' } },
  gewitterklingen: { need: [{ tal: 'klingen' }, { el: 'blitz' }], col: '#fee761',
    name: { de: 'Gewitterklingen', en: 'Storm Blades' },
    text: { de: 'Deine kreisenden Klingen laden sich auf: Jede schickt alle 1,2 Sekunden einen Blitz in einen Gegner in der Nähe (50 % Stärke).', en: 'Your orbiting blades charge up: each one zaps a nearby enemy every 1.2 seconds (50% power).' },
    flavor: { de: 'Nicht anfassen. Wirklich nicht.', en: 'Do not touch. Seriously.' } },
  permafrost: { need: [{ tal: 'frost' }, { el: 'eis' }], col: '#9be8ff',
    name: { de: 'Permafrost', en: 'Permafrost' },
    text: { de: 'Wer 1,5 Sekunden in deiner Frostaura steht, friert 1,2 Sekunden ein (Bosse kürzer).', en: 'Whoever stays in your frost aura for 1.5 seconds freezes for 1.2 seconds (bosses shorter).' },
    flavor: { de: 'Bleib doch noch. Für immer.', en: 'Do stay. Forever.' } },
  pilzteppich: { need: [{ tal: 'giftspur' }, { el: 'gift' }], col: '#63c74d',
    name: { de: 'Pilzteppich', en: 'Mushroom Carpet' },
    text: { de: 'Im Kampf wachsen in deiner Giftspur Giftpilze (bis 8). Tritt ein Gegner drauf: Puff! Schaden und eine Giftwolke.', en: 'In battle, poison mushrooms sprout in your trail (up to 8). An enemy steps on one: poof! Damage and a poison cloud.' },
    flavor: { de: 'Nicht essen. Nicht drauftreten. Ausser du bist ein Gegner.', en: 'Do not eat. Do not step on. Unless you are an enemy.' } },
  rudel: { need: [{ tal: 'begleiter' }, { spell: 'geisterwolf' }], col: '#2ce8f5',
    name: { de: 'Das Rudel', en: 'The Pack' },
    text: { de: 'Statt einem Geisterwolf kämpfen 3 dauerhaft an deiner Seite.', en: 'Instead of one spirit wolf, three fight at your side permanently.' },
    flavor: { de: 'Einer ist ein Haustier. Drei sind ein Problem. Für die anderen.', en: 'One is a pet. Three are a problem. For the others.' } },
  vampirfuerst: { need: [{ tal: 'vampir' }, { tal: 'seele' }], col: '#e43b44',
    name: { de: 'Vampirfürst', en: 'Vampire Lord' },
    text: { de: 'Jeder besiegte Gegner schickt dir eine Blutkugel: Sie heilt ein wenig und gibt 4 Sekunden +6 % Schaden (bis 5-mal).', en: 'Every defeated enemy sends you a blood orb: it heals a little and gives +6% damage for 4 seconds (up to 5 times).' },
    flavor: { de: 'Du hast jetzt einen Umhang. Innerlich.', en: 'You have a cape now. On the inside.' } },
  echokaskade: { need: [{ tal: 'echo' }, { tal: 'geist' }], col: '#2ce8f5',
    name: { de: 'Echokaskade', en: 'Echo Cascade' },
    text: { de: 'Zauberecho kommt öfter (40 %), und jedes Echo wirkt den Zauber gleich noch einmal (60 % Kraft).', en: 'Spell echo happens more often (40%), and every echo casts the spell once more right away (60% power).' },
    flavor: { de: 'Echo! Echo! Echo! Aua.', en: 'Echo! Echo! Echo! Ouch.' } },
  goldregen: { need: [{ tal: 'gold' }, { tal: 'glueck' }], col: '#feae34',
    name: { de: 'Goldregen', en: 'Golden Rain' },
    text: { de: 'Jede Münze, die du im Kampf aufhebst, schiesst einen Goldsplitter auf den nächsten Gegner (40 % Stärke).', en: 'Every coin you pick up in battle fires a gold shard at the nearest enemy (40% power).' },
    flavor: { de: 'Geld regiert die Welt. Und trifft.', en: 'Money rules the world. And hits.' } },
  kaktus: { need: [{ tal: 'dornen' }, { el: 'stein' }], col: '#a2e05a',
    name: { de: 'Kaktus', en: 'Cactus' },
    text: { de: 'Wirst du getroffen, schiessen 6 Steinstacheln rundum (50 % Stärke, alle 1,2 Sekunden).', en: 'When you are hit, 6 stone spikes burst out around you (50% power, every 1.2 seconds).' },
    flavor: { de: 'Umarmungen nur nach Vereinbarung.', en: 'Hugs by appointment only.' } },
  koenigsfamilie: { need: [{ leg: 'pudding' }, { tro: 'schleimkoenig' }], col: '#9be37a',
    name: { de: 'Königsfamilie', en: 'Royal Family' },
    text: { de: 'Pudding trägt jetzt die grosse Krone: stärker, grösser, verschluckt Gegner schon unter 25 % Leben, und jeder Happen spuckt einen Baby-Schleim aus, der 15 Sekunden mitkämpft (bis 4).', en: 'Pudding now wears the big crown: stronger, bigger, swallows enemies below 25% health, and every gulp spits out a baby slime that fights for 15 seconds (up to 4).' },
    flavor: { de: 'Lang lebe der König. Und seine 37 Enkel.', en: 'Long live the king. And his 37 grandchildren.' } },
  knochenknall: { need: [{ cls: 'rufer' }, { tal: 'kette' }], col: '#e0a4ff',
    name: { de: 'Knochenknall', en: 'Bone Blast' },
    text: { de: 'Läuft die Zeit eines Dieners ab, zerplatzt er in einer Knochenexplosion (60 % Stärke). Wer dabei fällt, steht als Geist auf.', en: 'When a minion\'s time runs out, it bursts in a bone explosion (60% power). Whoever falls rises as a ghost.' },
    flavor: { de: 'Recycling, aber laut.', en: 'Recycling, but loud.' } },
  brauerei: { need: [{ cls: 'brau' }, { tal: 'pulver' }], col: '#c77dff',
    name: { de: 'Hausbrauerei', en: 'House Brewery' },
    text: { de: 'Jede 3. Flasche ist eine Überraschung (statt jede 4.), und Überraschungen springen noch 2-mal zum nächsten Gegner weiter.', en: 'Every 3rd flask is a surprise (instead of every 4th), and surprises bounce on to the next enemy 2 more times.' },
    flavor: { de: 'Prost! In Deckung!', en: 'Cheers! Take cover!' } },
  pfeilhagel: { need: [{ cls: 'schuetze' }, { tal: 'spalt' }], col: '#e8dcc0',
    name: { de: 'Pfeilhagel', en: 'Arrow Hail' },
    text: { de: 'Normale Pfeile teilen sich beim Treffer in 2 weitere Pfeile (je 50 %).', en: 'Basic arrows split into 2 more arrows on impact (50% each).' },
    flavor: { de: 'Zielen wird überschätzt.', en: 'Aiming is overrated.' } },
  wirbelwind: { need: [{ cls: 'klinge' }, { tal: 'klingen' }], col: '#c0cbdc',
    name: { de: 'Wirbelwind', en: 'Whirlwind' },
    text: { de: 'Jeder 4. Schlag schleudert deine kreisenden Klingen weit hinaus und wieder zurück, mit doppeltem Schaden.', en: 'Every 4th swing flings your orbiting blades far out and back again, with double damage.' },
    flavor: { de: 'Abstand halten ist auch keine Lösung.', en: 'Keeping your distance won\'t help either.' } },
  fadensturm: { need: [{ cls: 'weber' }, { tal: 'strom' }], col: '#7fd8ff',
    name: { de: 'Fadensturm', en: 'Thread Storm' },
    text: { de: 'Jeder besiegte Gegner schickt einen Fadenfunken zum nächsten (70 % Zauberkraft). Fällt der auch, springt der Funke weiter.', en: 'Every defeated enemy sends a thread spark to the next one (70% magic). If that one falls too, the spark jumps on.' },
    flavor: { de: 'Ein Faden, viele Knoten.', en: 'One thread, many knots.' } },
  meteorschauer: { need: [{ spell: 'meteor' }, { el: 'feuer' }], col: '#f77622',
    name: { de: 'Meteorschauer', en: 'Meteor Shower' },
    text: { de: 'Alle 7 Sekunden im Kampf fällt ein Meteor auf den stärksten Gegner, und jeder Meteor bringt 2 kleine Brocken mit.', en: 'Every 7 seconds in battle a meteor strikes the strongest enemy, and every meteor brings 2 small chunks along.' },
    flavor: { de: 'Wetterbericht: heiter bis brennend.', en: 'Forecast: sunny, turning to fire.' } },
  plasmaball: { need: [{ spell: 'feuerball' }, { spell: 'kettenblitz' }], col: '#c77dff',
    name: { de: 'Plasmaball', en: 'Plasma Ball' },
    text: { de: 'Feuerball-Explosionen schicken Blitze in 3 Gegner, und jeder Treffer des Kettenblitzes macht eine kleine Explosion.', en: 'Fireball blasts send lightning into 3 enemies, and every chain lightning hit causes a small explosion.' },
    flavor: { de: 'Physiklehrer hassen diesen Trick.', en: 'Physics teachers hate this trick.' } },
  schattenklon: { need: [{ el: 'schatten' }, { tal: 'flink' }], col: '#b55088',
    name: { de: 'Schattenklon', en: 'Shadow Clone' },
    text: { de: 'Weichst du aus, springt ein Schattenklon von dir heraus und kämpft 4 Sekunden mit (höchstens alle 1,5 Sekunden).', en: 'When you dodge, a shadow clone of you jumps out and fights for 4 seconds (at most every 1.5 seconds).' },
    flavor: { de: 'Ich war das nicht. Das war der andere.', en: 'Wasn\'t me. It was the other one.' } },
  todesmut: { need: [{ tal: 'glaskanone' }, { tal: 'berserker' }], col: '#e43b44',
    name: { de: 'Todesmut', en: 'Death Wish' },
    text: { de: 'Unter 35 % Leben ist jeder deiner Treffer ein Volltreffer.', en: 'Below 35% health, every hit you land is a critical hit.' },
    flavor: { de: 'Glas bricht. Du nicht. Noch nicht.', en: 'Glass breaks. You don\'t. Not yet.' } },
};
A.COMBO_SPARKS = 15;   // Seelenfunken für jede Kombo, die zum ersten Mal ins Kombo-Buch kommt

// ---------- Begleiter (Regeln in js/pets.js) ----------
// Tiere sitzen in Käfigen: ab Ebene 2 manchmal in einem Kampfraum, der Käfig taucht auf, wenn der Raum gesäubert ist.
// Treue wächst mit jedem Sieg, den ein Tier miterlebt, und bleibt für immer (meta.pets). Treue 3 und 5 bringen neue Tricks.
// Ohne Tierhütte bleibt ein Tier nur für den Durchlauf, in dem du es findest; die Tierhütte im Lager nimmt Tiere von Anfang an mit.
// pow: Schaden (mal Kraft des Helden), rate: Sekunden zwischen Angriffen, spd: Tempo, range: kämpft aus der Ferne, fly: fliegt
A.PETS = {
  flitz: { spr: 'pet_fox', col: '#f77622', pow: 0.3, rate: 0.42, spd: 1.35,
    name: { de: 'Flitz', en: 'Zippy' }, kind: { de: 'Fuchs', en: 'Fox' },
    text: { de: 'Schnell wie der Wind. Beisst zu, bevor Gegner gucken können.', en: 'Fast as the wind. Bites before enemies can blink.' },
    t3: { de: 'Langfinger: Gegner, die Flitz besiegt, lassen doppelt so viel Gold fallen.', en: 'Sticky fingers: enemies Zippy defeats drop twice the gold.' },
    t5: { de: 'Zickzack: alle 6 Sekunden springt Flitz im Zickzack durch bis zu 5 Gegner.', en: 'Zigzag: every 6 seconds Zippy zigzags through up to 5 enemies.' },
    flavor: { de: 'Hat noch nie etwas gestohlen. Sagt er.', en: 'Has never stolen anything. He says.' } },
  huhu: { spr: 'pet_owl', col: '#e4a672', pow: 0.4, rate: 0.85, spd: 1.15, fly: true,
    name: { de: 'Huhu', en: 'Hoot' }, kind: { de: 'Eule', en: 'Owl' },
    text: { de: 'Stösst lautlos auf Gegner herab. Zeigt dir auf der Karte, wo ein geheimer Raum liegt.', en: 'Swoops down on enemies without a sound. Shows you on the map where a secret room is.' },
    t3: { de: 'Nachtauge: die ganze Ebene liegt offen auf der Karte.', en: 'Night eye: the whole floor lies open on the map.' },
    t5: { de: 'Schuhu: alle 8 Sekunden betäubt ein Schrei alle Gegner rundum.', en: 'Hoo-hoo: every 8 seconds a screech stuns all enemies around.' },
    flavor: { de: 'Dreht den Kopf ganz herum. Vor allem, wenn du gerade etwas Peinliches machst.', en: 'Turns its head all the way round. Especially when you do something embarrassing.' } },
  glut: { spr: 'pet_drake', col: '#e43b44', pow: 0.42, rate: 1.2, spd: 1.05, range: true,
    name: { de: 'Glut', en: 'Ember' }, kind: { de: 'Kleiner Drache', en: 'Little dragon' },
    text: { de: 'Spuckt aus sicherer Entfernung Feuer. Wer getroffen wird, brennt.', en: 'Spits fire from a safe distance. Whoever gets hit burns.' },
    t3: { de: 'Feuerball: das Feuer explodiert beim Aufprall.', en: 'Fireball: the fire explodes on impact.' },
    t5: { de: 'Feueratem: alle 7 Sekunden ein Flammenstrahl, der alles vor ihm anzündet.', en: 'Fire breath: every 7 seconds a stream of flame sets everything ahead alight.' },
    flavor: { de: 'Wird mal ganz gross. Übt schon mal.', en: 'Will be huge one day. Practising already.' } },
  brunhilde: { spr: 'pet_toad', col: '#63c74d', pow: 0.75, rate: 1.7, spd: 0.9,
    name: { de: 'Brunhilde', en: 'Brunhilde' }, kind: { de: 'Kröte mit Krone', en: 'Crowned toad' },
    text: { de: 'Springt Gegnern mit vollem Gewicht auf den Kopf. Wer daneben steht, kriegt auch was ab.', en: 'Jumps on enemies\' heads with all her weight. Whoever stands next to them gets some too.' },
    t3: { de: 'Lange Zunge: alle 5 Sekunden holt sie einen Gegner von weit weg zu sich und betäubt ihn.', en: 'Long tongue: every 5 seconds she pulls a far enemy to her and stuns it.' },
    t5: { de: 'Königssprung: alle 9 Sekunden ein riesiger Sprung, die Landung erschüttert den ganzen Raum.', en: 'Royal leap: every 9 seconds a giant jump, the landing shakes the whole room.' },
    flavor: { de: 'Wartet seit Jahren auf einen Kuss. Bitte nicht.', en: 'Has been waiting for a kiss for years. Please don\'t.' } },
  stachel: { spr: 'pet_hog', col: '#b86f50', pow: 0.55, rate: 2.4, spd: 0.95,
    name: { de: 'Stachel', en: 'Prickles' }, kind: { de: 'Igel', en: 'Hedgehog' },
    text: { de: 'Rollt sich zur Kugel und rollt quer durch die Gegner.', en: 'Curls into a ball and rolls right through the enemies.' },
    t3: { de: 'Stachelregen: nach jeder Rolle schiesst er Stacheln rundum.', en: 'Spike rain: after every roll he shoots spikes all around.' },
    t5: { de: 'Flipperkugel: alle 10 Sekunden rast Stachel als riesige Kugel durch den Raum und prallt von den Wänden ab.', en: 'Pinball: every 10 seconds Prickles races through the room as a giant ball, bouncing off the walls.' },
    flavor: { de: 'Kuscheln nur mit Handschuhen.', en: 'Cuddles with gloves only.' } },
  gacker: { spr: 'pet_hen', col: '#fee761', pow: 0.25, rate: 0.55, spd: 1.05,
    name: { de: 'Gacker', en: 'Cluck' }, kind: { de: 'Huhn', en: 'Hen' },
    text: { de: 'Pickt Gegner und legt im Kampf alle 6 Sekunden ein Ei. Daraus schlüpft ein wütendes Küken.', en: 'Pecks enemies and lays an egg every 6 seconds in a fight. An angry chick hatches from it.' },
    t3: { de: 'Doppeldotter: aus jedem Ei schlüpfen zwei Küken.', en: 'Double yolk: two chicks hatch from every egg.' },
    t5: { de: 'Goldenes Ei: jedes 4. Ei ist aus Gold und platzt in einen Haufen Münzen.', en: 'Golden egg: every 4th egg is made of gold and bursts into a pile of coins.' },
    flavor: { de: 'Das Ei war zuerst da. Sagt das Huhn.', en: 'The egg came first. Says the hen.' } },
};
A.PET_TREUE = [0, 40, 120, 260, 480];   // Treue-Punkte für die Stufen 1 bis 5
A.PET_GROW = 0.15;                      // jede Treue-Stufe über 1: +15 % Schaden
A.PET_XP = { kill: 1, elite: 3, boss: 15 };   // Treue je Sieg, den ein Tier miterlebt
A.PET_SPARKS = 25;                      // Seelenfunken für jedes neue Tier
A.PET_CAGE = 0.45;                      // Chance auf einen Käfig je Ebene (ab Ebene 2; wer noch kein Tier hat, findet auf Ebene 2 sicher eins)

// ---------- Welten: je 4 Ebenen, danach wiederholen sie sich, nur härter ----------
// pit: Grube (nicht begehbar, Geschosse fliegen drüber), hazard: Gefahr-Boden, obst: Hindernisse in den Räumen, corner: Dinge in Ecken, favor: bevorzugte Raumformen
A.WORLDS = [
  { id: 'stone', name: { de: 'Graue Gewölbe', en: 'Grey Vaults' }, mons: ['schleimer', 'ratte', 'fledermaus', 'kobolddieb', 'spinne', 'knochen'], boss: 'schleimkoenig',
    pit: null, hazard: null, obst: ['pillar'], corner: ['barrel', 'crate', 'pot', 'barrel'], favor: ['pillars', 'octagon', 'cross'] },
  { id: 'jungle', name: { de: 'Dschungel-Ruinen', en: 'Jungle Ruins' }, mons: ['frosch', 'pilzkrieger', 'ranke', 'spinne', 'fledermaus', 'schleimer'], boss: 'dornenmutter',
    pit: 'water', hazard: 'mud', obst: ['tree', 'bush', 'tree'], corner: ['bush', 'pot', 'bush'], favor: ['garden', 'garden', 'island'], dense: 3 },
  { id: 'desert', name: { de: 'Wüstengrab', en: 'Desert Tomb' }, mons: ['skorpion', 'mumie', 'knochen', 'kobolddieb', 'ratte', 'glutwicht'], boss: 'sandpharao',
    pit: null, hazard: 'quicksand', obst: ['cactus', 'obelisk', 'urn'], corner: ['urn', 'pot', 'urn'], favor: ['pool', 'pillars', 'garden'], dense: 1 },
  { id: 'water', name: { de: 'Versunkene Stadt', en: 'Sunken City' }, mons: ['krabbe', 'qualle', 'frosch', 'spiegelgeist', 'schleimer', 'tunnelwurm'], boss: 'kraken',
    pit: 'water', hazard: 'shallow', obst: ['coral', 'column'], corner: ['barrel', 'crate', 'coral'], favor: ['island', 'stripes', 'ring'] },
  { id: 'volcano', name: { de: 'Vulkanschmiede', en: 'Volcano Forge' }, mons: ['glutmotte', 'glutwicht', 'rostgolem', 'tunnelwurm', 'skorpion', 'spinne'], boss: 'rostkoenig',
    pit: 'lava', hazard: 'embers', obst: ['obsidian', 'anvil'], corner: ['barrel', 'crate', 'anvil'], favor: ['stripes', 'pool', 'ring'] },
  { id: 'abyss', name: { de: 'Der Abgrund', en: 'The Abyss' }, mons: ['schattenfaenger', 'leerenauge', 'spiegelgeist', 'knochen', 'pilzkrieger', 'qualle'], boss: 'waechter',
    pit: 'void', hazard: 'shadow', obst: ['crystal'], corner: ['crystal', 'pot'], favor: ['island', 'stripes', 'cross'] },
];
// Gefahr-Boden: slow = Tempo-Faktor, burn = brennt
A.HAZARDS = {
  mud: { slow: 0.6, name: { de: 'Schlamm', en: 'Mud' } },
  quicksand: { slow: 0.45, name: { de: 'Treibsand', en: 'Quicksand' } },
  shallow: { slow: 0.7, name: { de: 'Seichtes Wasser', en: 'Shallows' } },
  embers: { burn: true, name: { de: 'Glut', en: 'Embers' } },
  shadow: { slow: 0.6, name: { de: 'Schattenpfütze', en: 'Shadow pool' } },
};
A.FLOORS_PER_WORLD = 4;
A.worldIndex = (f) => Math.floor((Math.max(1, f) - 1) / A.FLOORS_PER_WORLD);
A.worldOf = (f) => A.WORLDS[A.worldIndex(f) % A.WORLDS.length];
A.worldRound = (f) => Math.floor(A.worldIndex(f) / A.WORLDS.length);      // 0 = erster Durchgang, 1 = die Welten kommen wieder ...
A.isBossFloor = (f) => f % A.FLOORS_PER_WORLD === 0;
A.bossOf = (f) => A.isBossFloor(f) ? A.BOSSES[A.worldOf(f).boss] : null;
A.worldName = (f) => { const n = A.t(A.worldOf(f).name), r = A.worldRound(f); return r ? n + ' ' + ['', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'][Math.min(r, 7)] : n; };
// Gegner-Auswahl: auf der ersten Ebene einer Welt die ersten drei Arten, dann je Ebene eine mehr
A.monsterPool = (f) => { const w = A.worldOf(f), k = (Math.max(1, f) - 1) % A.FLOORS_PER_WORLD; return w.mons.slice(0, 3 + k).map(id => A.MONSTERS.find(m => m.id === id)).filter(Boolean); };

// ---------- Ereignisse ----------
A.EVENTS = [
  { id: 'brunnen', title: { de: 'Der Brunnen', en: 'The Well' }, text: { de: 'Ein Brunnen mit leuchtendem Wasser. Riecht nach Kupfer und Hoffnung.', en: 'A well with glowing water. Smells of copper and hope.' },
    choices: [
      { text: { de: 'Trinken', en: 'Drink' }, outcomes: [{ p: 0.6, heal: 0.5, msg: { de: 'Erfrischend! +50 % Leben.', en: 'Refreshing! +50% health.' } }, { p: 0.4, dmg: 0.2, stat: 'tou', msg: { de: 'Bäh. −20 % Leben, aber +1 Zähigkeit. Charakterbildend.', en: 'Yuck. −20% health, but +1 toughness. Character-building.' } }] },
      { text: { de: 'Münze werfen', en: 'Toss a coin' }, outcomes: [{ p: 1, gold: -10, item: 'good', msg: { de: 'Plopp. Etwas kommt zurück.', en: 'Plop. Something comes back.' } }] },
      { text: { de: 'Weitergehen', en: 'Walk on' }, outcomes: [{ p: 1, msg: { de: 'Vernünftig. Langweilig, aber vernünftig.', en: 'Sensible. Boring, but sensible.' } }] },
    ] },
  { id: 'haendlerleiche', title: { de: 'Der tote Händler', en: 'The Dead Merchant' }, text: { de: 'Ein Händler, der nicht mehr handelt. Sein Beutel schon.', en: 'A merchant who no longer trades. His purse still does.' },
    choices: [
      { text: { de: 'Beutel nehmen', en: 'Take the purse' }, outcomes: [{ p: 0.7, gold: 40, msg: { de: '+40 Gold. Er braucht es nicht mehr.', en: '+40 gold. He won\'t need it.' } }, { p: 0.3, gold: 40, curse: true, msg: { de: '+40 Gold und ein Fluch-Item. Er brauchte es wirklich nicht mehr.', en: '+40 gold and a cursed item. He really didn\'t need it.' } }] },
      { text: { de: 'Begraben', en: 'Bury him' }, outcomes: [{ p: 1, xp: 30, msg: { de: 'Anstand. +30 Erfahrung.', en: 'Decency. +30 experience.' } }] },
    ] },
  { id: 'statue', title: { de: 'Die Statue', en: 'The Statue' }, text: { de: 'Eine Statue mit ausgestreckter Hand. Die Hand will etwas.', en: 'A statue with an outstretched hand. The hand wants something.' },
    choices: [
      { text: { de: '30 Gold geben', en: 'Give 30 gold' }, outcomes: [{ p: 1, gold: -30, stat: 'luck', msg: { de: 'Die Statue zwinkert. +1 Glück.', en: 'The statue winks. +1 luck.' } }] },
      { text: { de: 'Hand abbrechen', en: 'Break the hand off' }, outcomes: [{ p: 0.5, item: 'rare', msg: { de: 'In der Hand steckte etwas.', en: 'Something was inside the hand.' } }, { p: 0.5, dmg: 0.3, msg: { de: 'Die Statue schlägt zurück. −30 % Leben.', en: 'The statue hits back. −30% health.' } }] },
      { text: { de: 'Ignorieren', en: 'Ignore it' }, outcomes: [{ p: 1, msg: { de: 'Die Hand bleibt leer. Wie dein Herz.', en: 'The hand stays empty. Like your heart.' } }] },
    ] },
  { id: 'goenner', title: { de: 'Gönner-Kiste', en: 'Patron Crate' }, text: { de: 'Eine Kiste fällt von oben. Zettel: «Für den Unterhaltungswert.»', en: 'A crate drops from above. Note: "For entertainment value."' },
    choices: [
      { text: { de: 'Öffnen', en: 'Open it' }, outcomes: [{ p: 0.75, item: 'epic', msg: { de: 'Jemand da oben mag dich.', en: 'Someone up there likes you.' } }, { p: 0.25, item: 'cursed', msg: { de: 'Jemand da oben mag dich. Auf seine Art.', en: 'Someone up there likes you. In their own way.' } }] },
    ] },
  { id: 'rattenkoenig', title: { de: 'Der Rattenhändler', en: 'The Rat Trader' }, text: { de: 'Eine sprechende Ratte bietet dir ein Geschäft an. Ihre Zähne glänzen.', en: 'A talking rat offers you a deal. Its teeth gleam.' },
    choices: [
      { text: { de: 'Trank kaufen (20 Gold)', en: 'Buy potion (20 gold)' }, outcomes: [{ p: 1, gold: -20, potion: 1, msg: { de: 'Ein Trank. Leicht angenagt.', en: 'A potion. Slightly gnawed.' } }] },
      { text: { de: 'Leben tauschen', en: 'Trade life' }, outcomes: [{ p: 1, dmg: 0.25, stat: 'str', msg: { de: '−25 % Leben, +1 Stärke. Die Ratte nickt anerkennend.', en: '−25% health, +1 strength. The rat nods approvingly.' } }] },
      { text: { de: 'Ratte vertreiben', en: 'Shoo the rat' }, outcomes: [{ p: 1, msg: { de: 'Sie geht. Beleidigt.', en: 'It leaves. Offended.' } }] },
    ] },
  { id: 'altar', title: { de: 'Der Altar', en: 'The Altar' }, text: { de: 'Ein Altar. Darauf: ein Loch in Itemform.', en: 'An altar. On it: a hole shaped like an item.' },
    choices: [
      { text: { de: 'Item opfern', en: 'Sacrifice an item' }, needItem: true, outcomes: [{ p: 1, sacrifice: true, msg: { de: 'Der Altar kaut. Du fühlst dich stärker: +2 Statpunkte.', en: 'The altar chews. You feel stronger: +2 stat points.' } }] },
      { text: { de: 'Weitergehen', en: 'Walk on' }, outcomes: [{ p: 1, msg: { de: 'Der Altar seufzt.', en: 'The altar sighs.' } }] },
    ] },
];

// ---------- Lager ----------
// Völker (Rassen) schaltet man einzeln frei. Die übrigen Einträge gab es nur im alten Lager: wer sie gekauft hat, bekommt sie beim Laden als Gebäude-Stufen (game.js, migrateCamp)
A.META_SHOP = [
  { id: 'hp1', old: true, name: { de: 'Zähe Haut I', en: 'Tough Skin I' }, desc: { de: '+10 % Leben in jedem Durchlauf', en: '+10% health every run' }, cost: 30, effect: { hpMul: 0.1 } },
  { id: 'hp2', old: true, name: { de: 'Zähe Haut II', en: 'Tough Skin II' }, desc: { de: '+10 % Leben', en: '+10% health' }, cost: 80, effect: { hpMul: 0.1 }, needs: 'hp1' },
  { id: 'gold1', old: true, name: { de: 'Startkapital', en: 'Seed Money' }, desc: { de: 'Start mit 40 Gold', en: 'Start with 40 gold' }, cost: 25, effect: { startGold: 40 } },
  { id: 'atk1', old: true, name: { de: 'Alte Narben', en: 'Old Scars' }, desc: { de: '+8 % Angriff und Zauberkraft', en: '+8% attack and magic' }, cost: 50, effect: { dmgMul: 0.08 } },
  { id: 'potion1', old: true, name: { de: 'Reiseapotheke', en: 'Travel Kit' }, desc: { de: 'Start mit einem Trank', en: 'Start with a potion' }, cost: 40, effect: { startPotion: 1 } },
  { id: 'race_schatten', name: { de: 'Schattenkind', en: 'Shadowkin' }, desc: { de: 'Neue Rasse', en: 'New race' }, cost: 60, effect: { race: 'schatten' } },
  { id: 'race_pilz', name: { de: 'Pilzling', en: 'Sporeling' }, desc: { de: 'Neue Rasse', en: 'New race' }, cost: 120, effect: { race: 'pilz' } },
  { id: 'race_kobold', name: { de: 'Blechkobold', en: 'Tin Kobold' }, desc: { de: 'Neue Rasse', en: 'New race' }, cost: 200, effect: { race: 'kobold' } },
  { id: 'skill1', old: true, name: { de: 'Alte Schriften', en: 'Old Scrolls' }, desc: { de: 'Start mit drei Fähigkeiten statt zwei', en: 'Start with three skills instead of two' }, cost: 70, effect: { extraStartSkill: 1 } },
  { id: 'luck1', old: true, name: { de: 'Glückspfennig', en: 'Lucky Penny' }, desc: { de: 'Bessere Items fallen öfter', en: 'Better items drop more often' }, cost: 90, effect: { itemLuck: 1 } },
];
// Gebäude mit Stufen: lv = Wirkung je Stufe (wird zusammengezählt), cost = Preis je Stufe, rank = ab welcher Lager-Stufe man es bauen kann
// Lager-Stufe = alle gebauten Stufen zusammen plus freigeschaltete Völker
const lvEach = (n, eff) => Array.from({ length: n }, () => Object.assign({}, eff));
A.CAMP = [
  { id: 'feuer', name: { de: 'Lagerfeuer', en: 'Campfire' }, info: { de: 'Wärmt die Knochen. Und den Mut.', en: 'Warms the bones. And the courage.' }, icon: 'c_fire', rank: 0,
    cost: [25, 40, 60, 85, 115, 150, 190, 235, 285, 340], lv: lvEach(10, { hpMul: 0.05 }) },
  { id: 'platz', name: { de: 'Übungsplatz', en: 'Training Ground' }, info: { de: 'Die Strohpuppen haben nie eine Chance.', en: 'The straw dummies never stand a chance.' }, icon: 'c_dummy', rank: 0,
    cost: [35, 55, 80, 110, 145, 185, 230, 280, 335, 400], lv: lvEach(10, { dmgMul: 0.04 }) },
  { id: 'kiste', name: { de: 'Schatzkiste', en: 'Treasure Chest' }, info: { de: 'Für schlechte Zeiten. Und für gute.', en: 'For bad times. And for good ones.' }, icon: 'chest', rank: 0,
    cost: [20, 35, 55, 80, 110, 145], lv: lvEach(6, { startGold: 25 }) },
  { id: 'kessel', name: { de: 'Kräuterkessel', en: 'Herb Cauldron' }, info: { de: 'Blubbert. Riecht nach Wald und ein bisschen nach Socke.', en: 'Bubbles. Smells of forest and a little of sock.' }, icon: 'c_cauldron', rank: 3,
    cost: [40, 70, 110, 160, 220, 290], lv: [{ startPotion: 1 }, { potionHeal: 0.05 }, { startPotion: 1 }, { potionHeal: 0.05 }, { startPotion: 1 }, { potionHeal: 0.05 }] },
  { id: 'tier', name: { de: 'Tierhütte', en: 'Pet Hut' }, info: { de: 'Ein Zuhause für alles, was dir aus den Käfigen gefolgt ist.', en: 'A home for everything that followed you out of the cages.' }, icon: 'c_hut', rank: 4,
    cost: [50, 100, 170, 260, 380], lv: [{ petStart: 1 }, { petDmg: 0.25 }, { petXp: 0.5 }, { petSlots: 1 }, { petDmg: 0.25, petStart: 1 }] },
  { id: 'schreib', name: { de: 'Schreibstube', en: 'Scriptorium' }, info: { de: 'Alte Bücher, neue Tricks.', en: 'Old books, new tricks.' }, icon: 'c_lectern', rank: 6,
    cost: [70, 140, 250, 450], lv: [{ extraStartSkill: 1 }, { cdr: 0.05 }, { cdr: 0.05 }, { talentSlots: 1 }] },
  { id: 'schmiede', name: { de: 'Lagerschmiede', en: 'Camp Forge' }, info: { de: 'Hier wird für den Abstieg geschmiedet.', en: 'Forging for the descent.' }, icon: 'anvil', rank: 9,
    cost: [80, 150, 260, 400], lv: [{ gearW: 1 }, { gearA: 1 }, { gearW: 1 }, { gearHB: 1 }] },
  { id: 'zelt', name: { de: 'Händlerzelt', en: 'Merchant Tent' }, info: { de: 'Wer oben Kunde ist, zahlt unten weniger.', en: 'Be a customer up here, pay less down there.' }, icon: 'c_stall', rank: 12,
    cost: [60, 110, 170, 240], lv: lvEach(4, { shopOff: 0.05 }) },
  { id: 'brunnen', name: { de: 'Glücksbrunnen', en: 'Wishing Well' }, info: { de: 'Münze rein, Wunsch raus.', en: 'Coin in, wish out.' }, icon: 'c_well', rank: 16,
    cost: [90, 200, 380], lv: lvEach(3, { itemLuck: 1 }) },
  { id: 'segen', name: { de: 'Segensstein', en: 'Blessing Stone' }, info: { de: 'Ein kleiner Schrein, der schon hier oben flüstert.', en: 'A little shrine that already whispers up here.' }, icon: 'shrine', rank: 20,
    cost: [150, 350], lv: [{ startBoon: 1 }, { startBoon: 1 }] },
];
A.CAMP_MAX = A.CAMP.reduce((a, b) => a + b.lv.length, 0) + A.META_SHOP.filter(u => u.effect.race).length;   // höchste Lager-Stufe
// Wimpel der Weltenbosse: erster Sieg = Wimpel (Bonus für immer, 50 Seelenfunken), erster Sieg in den Welten II = goldener Wimpel (doppelter Bonus, 100 Seelenfunken)
A.BANNERS = {
  schleimkoenig: { hpMul: 0.05 },
  dornenmutter: { thorns: 10 },
  sandpharao: { cdr: 0.05 },
  kraken: { dmgMul: 0.04 },
  rostkoenig: { def: 2 },
  waechter: { crit: 4 },
};
A.BANNER_SPARKS = [0, 50, 100];

// ---------- Aufgaben je Ebene ----------
A.QUESTS = [
  { id: 'kill5', text: { de: 'Besiege 5 Gegner auf dieser Ebene', en: 'Defeat 5 enemies on this floor' }, type: 'kills', n: 5, reward: { gold: 30 } },
  { id: 'nodmg', text: { de: 'Säubere einen Raum ohne Schaden', en: 'Clear a room without taking damage' }, type: 'nodmg', n: 1, reward: { item: 'rare' } },
  { id: 'crit3', text: { de: 'Lande 3 Volltreffer', en: 'Land 3 critical hits' }, type: 'crits', n: 3, reward: { xp: 40 } },
  { id: 'elite', text: { de: 'Besiege einen Elite-Gegner', en: 'Defeat an elite enemy' }, type: 'elite', n: 1, reward: { gold: 50 } },
];

A.MAX_FLOOR = 24;   // Ende der sechs Welten; danach geht es endlos weiter
