// Der Abstieg – Spieldaten (Rassen, Klassen, Fähigkeiten, Items, Monster, Ereignisse, Texte)
// Alle Namen und Texte sind zweisprachig: { de, en }. A.L wählt beim Start die Sprache.
'use strict';
window.A = window.A || {};

A.LANG = (navigator.language || 'de').toLowerCase().startsWith('de') ? 'de' : 'en';
A.t = (o) => (o && typeof o === 'object' && (o.de || o.en)) ? (o[A.LANG] || o.de || o.en) : o;

// ---------- Texte der Oberfläche ----------
A.UI = {
  title: { de: 'Der Abstieg', en: 'The Descent' },
  tagline: { de: '18 Ebenen. Unten ist der Ausgang. Angeblich.', en: '18 floors. The exit is at the bottom. Allegedly.' },
  howto: { de: 'Laufen: Joystick links / WASD · Schlagen: gelber Knopf / Leertaste · Fähigkeiten: 1-3 · Trank: Q · Benutzen: E · Heldenblatt: I', en: 'Move: joystick left / WASD · Attack: yellow button / Space · Skills: 1-3 · Potion: Q · Use: E · Hero sheet: I' },
  play: { de: 'Abstieg beginnen', en: 'Begin descent' },
  continueRun: { de: 'Durchlauf fortsetzen', en: 'Continue run' },
  meta: { de: 'Seelenfunken', en: 'Soul sparks' },
  race: { de: 'Rasse', en: 'Race' }, cls: { de: 'Klasse', en: 'Class' },
  locked: { de: 'Gesperrt', en: 'Locked' }, unlock: { de: 'Freischalten', en: 'Unlock' },
  start: { de: 'Los', en: 'Go' }, back: { de: 'Zurück', en: 'Back' },
  floor: { de: 'Ebene', en: 'Floor' }, gold: { de: 'Gold', en: 'Gold' }, hp: { de: 'Leben', en: 'Health' },
  level: { de: 'Stufe', en: 'Level' }, xp: { de: 'EP', en: 'XP' },
  node: { fight: { de: 'Kampf', en: 'Fight' }, elite: { de: 'Elite', en: 'Elite' }, treasure: { de: 'Schatz', en: 'Treasure' }, shop: { de: 'Händler', en: 'Merchant' }, event: { de: 'Ereignis', en: 'Event' }, rest: { de: 'Rast', en: 'Rest' }, boss: { de: 'Boss', en: 'Boss' } },
  chooseRoom: { de: 'Wähle deinen Weg', en: 'Choose your path' },
  prep: { de: 'Aufstellung', en: 'Loadout' }, fightBtn: { de: 'Kämpfen!', en: 'Fight!' },
  front: { de: 'Vorne', en: 'Front' }, backRow: { de: 'Hinten', en: 'Back' },
  skills: { de: 'Fähigkeiten', en: 'Skills' }, items: { de: 'Ausrüstung', en: 'Gear' }, bag: { de: 'Beutel', en: 'Bag' },
  stats: { de: 'Werte', en: 'Stats' },
  stat: { str: { de: 'Stärke', en: 'Strength' }, tou: { de: 'Zähigkeit', en: 'Toughness' }, dex: { de: 'Geschick', en: 'Dexterity' }, mind: { de: 'Geist', en: 'Mind' }, luck: { de: 'Glück', en: 'Luck' } },
  derived: { atk: { de: 'Angriff', en: 'Attack' }, def: { de: 'Rüstung', en: 'Armor' }, spd: { de: 'Tempo', en: 'Speed' }, crit: { de: 'Volltreffer', en: 'Crit' }, dodge: { de: 'Ausweichen', en: 'Dodge' }, mag: { de: 'Zauberkraft', en: 'Magic' } },
  points: { de: 'Punkte frei', en: 'points to spend' },
  victory: { de: 'Sieg!', en: 'Victory!' }, defeat: { de: 'Gefallen', en: 'Fallen' },
  pickReward: { de: 'Wähle eine Belohnung', en: 'Choose a reward' }, skip: { de: 'Nichts nehmen', en: 'Take nothing' },
  equip: { de: 'Anlegen', en: 'Equip' }, sell: { de: 'Verkaufen', en: 'Sell' }, buy: { de: 'Kaufen', en: 'Buy' }, take: { de: 'Nehmen', en: 'Take' },
  levelUp: { de: 'Stufenaufstieg!', en: 'Level up!' }, newSkill: { de: 'Neue Fähigkeit wählen', en: 'Choose a new skill' },
  heal: { de: 'Ausruhen (+35 % Leben)', en: 'Rest (+35% health)' }, train: { de: 'Trainieren (+1 Statpunkt)', en: 'Train (+1 stat point)' },
  leave: { de: 'Weiter', en: 'Continue' }, descend: { de: 'Tiefer', en: 'Descend' },
  runOver: { de: 'Durchlauf vorbei', en: 'Run over' }, reached: { de: 'Erreichte Ebene', en: 'Reached floor' }, kills: { de: 'Besiegte Gegner', en: 'Enemies slain' },
  sparksEarned: { de: 'Seelenfunken erhalten', en: 'Soul sparks earned' },
  toCamp: { de: 'Zum Lager', en: 'To camp' },
  camp: { de: 'Das Lager', en: 'The camp' }, campInfo: { de: 'Hier oben wartet man. Und schaltet frei.', en: 'Up here you wait. And unlock things.' },
  bought: { de: 'Freigeschaltet', en: 'Unlocked' },
  speed: { de: 'Tempo', en: 'Speed' },
  cooldown: { de: 'Abklingzeit', en: 'Cooldown' }, rounds: { de: 'Runden', en: 'rounds' },
  blocked: { de: 'Ebene 7 ist versperrt. Noch. Der Abstieg geht bald weiter.', en: 'Floor 7 is sealed. For now. The descent continues soon.' },
  win: { de: 'Du hast das Ende der bekannten Tiefe erreicht!', en: 'You reached the end of the known depths!' },
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
    perk: { de: 'Ausgeglichen. Ein Fähigkeitsplatz mehr.', en: 'Balanced. One extra skill slot.' },
    base: { str: 5, tou: 5, dex: 5, mind: 5, luck: 5 }, mod: { skillSlots: 1 } },
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
  { id: 'rufer', name: { de: 'Rufer', en: 'Caller' }, color: '#b07cd8', unlock: 150, row: 'back', soon: true,
    perk: { de: 'Beschwört Wesen, die mitkämpfen. (Bald)', en: 'Summons creatures that fight along. (Soon)' },
    base: { str: 0, tou: 1, dex: 0, mind: 3, luck: 1 }, skills: ['funke', 'flicken', 'fesseln', 'gewebe', 'flaeche', 'entladung'], startSkills: ['funke', 'flicken'], weapon: 'stab' },
  { id: 'brau', name: { de: 'Braumeister', en: 'Brewmaster' }, color: '#e0a83a', unlock: 150, row: 'front', soon: true,
    perk: { de: 'Tränke, Gifte, Glücksspiel. (Bald)', en: 'Potions, poisons, gambling. (Soon)' },
    base: { str: 1, tou: 1, dex: 1, mind: 1, luck: 3 }, skills: ['giftpfeil', 'hieb', 'flicken', 'wirbel', 'rueckzug', 'rache'], startSkills: ['giftpfeil', 'flicken'], weapon: 'schwert' },
];

// ---------- Items ----------
A.RARITY = {
  common:    { color: '#b8b8b8', affixes: 0, mult: 1.0,  weight: 50 },
  good:      { color: '#6fdc7a', affixes: 1, mult: 1.15, weight: 30 },
  rare:      { color: '#57a6ff', affixes: 2, mult: 1.3,  weight: 14 },
  epic:      { color: '#c77dff', affixes: 3, mult: 1.5,  weight: 5 },
  legendary: { color: '#f5c542', affixes: 3, mult: 1.8,  weight: 1 },
  cursed:    { color: '#ff5f5f', affixes: 3, mult: 1.9,  weight: 3 },
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

// Legendäre und verfluchte Einzelstücke
A.UNIQUES = [
  { id: 'u_loeffel', base: 'loeffel', rarity: 'legendary', name: { de: 'Löffel der Verzweiflung', en: 'Spoon of Despair' }, stats: { atkPct: 40, magPct: 40, dodge: -10 }, flavor: { de: 'Gegner lachen dich aus. Dann sterben sie.', en: 'Enemies laugh at you. Then they die.' } },
  { id: 'u_socke', base: 'socke', rarity: 'legendary', name: { de: 'Socke der zweiten Chance', en: 'Sock of Second Chances' }, stats: { revive: 1, dodge: 5 }, flavor: { de: 'Einmal pro Durchlauf überlebst du mit 1 Leben.', en: 'Once per run you survive with 1 health.' } },
  { id: 'u_kessel', base: 'teekessel', rarity: 'legendary', name: { de: 'Helm aus Teekesseln', en: 'Helm of Tea Kettles' }, stats: { def: 10, magPct: 25 }, flavor: { de: 'Pfeift bei jedem Treffer. Gegner hassen das.', en: 'Whistles on every hit. Enemies hate it.' } },
  { id: 'u_zahn', base: 'zahn', rarity: 'cursed', name: { de: 'Verfluchter Goldzahn', en: 'Cursed Gold Tooth' }, stats: { goldPct: 200, regen: -2 }, flavor: { de: 'Dreifaches Gold. Du verlierst laufend Leben.', en: 'Triple gold. You keep losing health.' } },
  { id: 'u_axt', base: 'axt', rarity: 'cursed', name: { de: 'Axt des Wahnsinns', en: 'Axe of Madness' }, stats: { atkPct: 70, def: -8 }, flavor: { de: 'Schlägt doppelt so hart. Vergisst, sich zu ducken.', en: 'Hits twice as hard. Forgets to duck.' } },
  { id: 'u_ring', base: 'ring', rarity: 'legendary', name: { de: 'Ring des Gönners', en: 'Patron\'s Ring' }, stats: { goldPct: 50, xpPct: 30, luck: 3 }, flavor: { de: 'Jemand da oben mag dich. Vorerst.', en: 'Someone up there likes you. For now.' } },
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
A.BOSSES = {
  3: { id: 'schleimkoenig', name: { de: 'Schleimkönig', en: 'Slime King' }, hp: 160, atk: 11, def: 2, spd: 3, row: 'front', kind: 'melee', color: '#3fbf5a', shape: 'blob', boss: true,
       trick: { de: 'Teilt sich bei 50 % Leben in zwei Schleimer.', en: 'Splits into two slimers at 50% health.' }, split: true },
  6: { id: 'rostkoenig', name: { de: 'Rostkönig', en: 'Rust King' }, hp: 320, atk: 16, def: 9, spd: 2, row: 'front', kind: 'melee', color: '#8a3a1a', shape: 'golem', boss: true,
       trick: { de: 'Jeder Waffentreffer heilt ihn um 5 %. Zauber und Gift nicht.', en: 'Every weapon hit heals him 5%. Spells and poison do not.' }, healOnPhys: 0.05 },
};

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

// ---------- Lager (Freischaltungen mit Seelenfunken) ----------
A.META_SHOP = [
  { id: 'hp1', name: { de: 'Zähe Haut I', en: 'Tough Skin I' }, desc: { de: '+10 % Leben in jedem Durchlauf', en: '+10% health every run' }, cost: 30, effect: { hpMul: 0.1 } },
  { id: 'hp2', name: { de: 'Zähe Haut II', en: 'Tough Skin II' }, desc: { de: '+10 % Leben', en: '+10% health' }, cost: 80, effect: { hpMul: 0.1 }, needs: 'hp1' },
  { id: 'gold1', name: { de: 'Startkapital', en: 'Seed Money' }, desc: { de: 'Start mit 40 Gold', en: 'Start with 40 gold' }, cost: 25, effect: { startGold: 40 } },
  { id: 'atk1', name: { de: 'Alte Narben', en: 'Old Scars' }, desc: { de: '+8 % Angriff und Zauberkraft', en: '+8% attack and magic' }, cost: 50, effect: { dmgMul: 0.08 } },
  { id: 'potion1', name: { de: 'Reiseapotheke', en: 'Travel Kit' }, desc: { de: 'Start mit einem Trank', en: 'Start with a potion' }, cost: 40, effect: { startPotion: 1 } },
  { id: 'race_schatten', name: { de: 'Schattenkind', en: 'Shadowkin' }, desc: { de: 'Neue Rasse', en: 'New race' }, cost: 60, effect: { race: 'schatten' } },
  { id: 'race_pilz', name: { de: 'Pilzling', en: 'Sporeling' }, desc: { de: 'Neue Rasse', en: 'New race' }, cost: 120, effect: { race: 'pilz' } },
  { id: 'race_kobold', name: { de: 'Blechkobold', en: 'Tin Kobold' }, desc: { de: 'Neue Rasse', en: 'New race' }, cost: 200, effect: { race: 'kobold' } },
  { id: 'skill1', name: { de: 'Alte Schriften', en: 'Old Scrolls' }, desc: { de: 'Start mit drei Fähigkeiten statt zwei', en: 'Start with three skills instead of two' }, cost: 70, effect: { extraStartSkill: 1 } },
  { id: 'luck1', name: { de: 'Glückspfennig', en: 'Lucky Penny' }, desc: { de: 'Bessere Items fallen öfter', en: 'Better items drop more often' }, cost: 90, effect: { itemLuck: 1 } },
];

// ---------- Aufgaben je Ebene ----------
A.QUESTS = [
  { id: 'kill5', text: { de: 'Besiege 5 Gegner auf dieser Ebene', en: 'Defeat 5 enemies on this floor' }, type: 'kills', n: 5, reward: { gold: 30 } },
  { id: 'nodmg', text: { de: 'Säubere einen Raum ohne Schaden', en: 'Clear a room without taking damage' }, type: 'nodmg', n: 1, reward: { item: 'rare' } },
  { id: 'crit3', text: { de: 'Lande 3 Volltreffer', en: 'Land 3 critical hits' }, type: 'crits', n: 3, reward: { xp: 40 } },
  { id: 'elite', text: { de: 'Besiege einen Elite-Gegner', en: 'Defeat an elite enemy' }, type: 'elite', n: 1, reward: { gold: 50 } },
];

A.MAX_FLOOR = 6;
