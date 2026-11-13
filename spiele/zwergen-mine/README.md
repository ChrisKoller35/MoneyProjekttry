# Zwergen-Mine

**Stand 13.11.2026:** Version 18 spielbar: Mauli, der zahme Maulwurf (ab 5 erwischten Maulwürfen bringt einer alle 40 Sekunden einen Sack Gold im Wert von 2 + Stufe Felsen; Stufe steigt alle 5 weiteren bis 10; Zeile im Reiter «Zwerge»; `petLv`, `petGold`, `petGive`, Testhaken `__minePet`). Version 17: Vorbereitung für CrazyGames (Ordner `portal/`), Pause und Ton aus bei Portal-Werbung, fünf Kleinigkeiten aus einer zweiten Durchsicht behoben (Krämer-Mindestpreis, Heldenwechsel im Bosskampf, Krämer überdeckt kein offenes Fenster, Sternzähler, gehaltene Leertaste). Version 16: Schmiede und Treue-Serie. Version 15: acht neue Ziele für Helden, Beute und Ränge, Dauertest. Version 14: fünfter Block «Sternenschacht» und das Fenster «Was ist neu?». Version 13: Ränge nach Punktestand. Version 12: Beute (Ausrüstung von Bossen). Version 11: Helden-Zwerge und der Kobold-Krämer. Version 10: die Zwerge reden in Sprechblasen (Nacht-Bot, geprüft). Version 9: jede Schicht sieht anders aus und jeden Tag gibt es drei Tagesziele (Nacht-Bot, geprüft). Version 8: Runde 2 mit Gletscher, Grotte und Kronen-Laden. Version 7: besondere Felsen, der freche Maulwurf und 42 Fundstücke (Nacht-Bot, geprüft). Version 6: Blöcke und Kronen (Runde 1). Jeder Block endet auf Tiefe 150 mit dem Endboss, danach fördert ein Förderturm Kronen über Zeit. Karte mit Altem Berg und Vulkan, Gletscher und Grotte kommen in Runde 2 (dazu ein Kronen-Laden). Im Browser geprüft (Handy-Grösse und PC, Deutsch und Englisch). Portal-Anbindung noch Platzhalter.

## Spielregel

Tippen auf den Felsen baut ihn ab, jeder Felsen gibt Gold. Mit Gold kauft man eine bessere Spitzhacke (mehr pro Tipp), Zwerge (graben von allein, auch wenn man weg ist) und Werkzeuge (einmalige Käufe). Alle 10 Tiefen wartet ein Boss-Felsen mit Zeitlimit, alle 50 Tiefen ein Grossboss (zehnfach so stark, 40 Sekunden, dreifach Steine). Schafft man ihn, gibt es Edelsteine für dauerhafte Verbesserungen (Zwergenkraft, Goldgier, Glückstreffer, Nachtschicht, Schatzspürer). Schafft man ihn nicht («Zeit um!»), gräbt man eine Tiefe höher weiter und probiert es später nochmal.

- **14 Schichten** zu je 10 Tiefen: Erde, Stein, Kohle, Kupfer, Eisen, Silber, Gold, Kristall, Lava, Tiefe, Obsidian, Mithril, Glutkern, Leere.
- **Schicht-Looks (7.11.2026):** jede der 14 Schichten hat eigene Felsform, eigenes Erzmuster und eigene Stollen-Deko (Wurzeln, Stalaktiten, Lavatropfen, Glutfunken, Sterne …); Ringe behalten Form und bekommen die Farbverschiebung.
- **Letzte Schicht und Endboss:** Tiefe 141 bis 150 ist das «Herz des Berges» (im Vulkan «Herz des Vulkans»), leuchtend; wer sie zum ersten Mal erreicht, bekommt 30 Steine. Auf Tiefe 150 wartet der Endboss mit Krone (Grossboss, 40 Sekunden). Tiefer geht es in einem Block nicht.
- **Block geschafft:** Endboss besiegt gibt sofort 👑 10 Kronen und einen Förderturm. Jeder Turm fördert Kronen über echte Zeit, auch wenn man weg ist (Alter Berg 1 pro Stunde, Vulkan 2). Das Lager fasst 12 Stunden, danach fördert der Turm nichts mehr, bis man abholt (Uhr verstellen bringt nichts). Ein grüner Punkt an der Krone oben zeigt, dass Kronen im Lager liegen.
- **Dein Reich (Karte):** Klick auf die Krone oben, den Knopf «Nächster Block» oder Reiter «Ziele», «Dein Reich». Dort: Kronen, Punktestand, Fördertürme mit Lager und «Abholen», und die Blöcke. Alter Berg ist frei, Vulkan kostet 10 Kronen, Gletscher 25, Grotte 50, Sternenschacht 100 (je einmal). Einen Block kann man beliebig oft spielen, jeder geschaffte gibt einen weiteren Turm. Wechselt man mitten im Block, fragt das Spiel nach.
- **Punktestand:** alle Kronen, die man je bekommen hat. Ausgeben senkt ihn nicht. Er geht an die Rangliste des Portals (`Portal.submitScore`).
- **Neuer Block:** Gold, Zwerge, Hacke, Werkzeuge und Erbstücke fangen neu an. Kronen, Steine samt Stein-Verbesserungen, Ziele und Rekorde bleiben.
- **Vulkan:** eigene Schichten (Asche, Bimsstein, Basalt … Höllenschlot), alles rot, Glut in der Luft. Alle 45 bis 60 Sekunden ein Lava-Ausbruch: 10 Sekunden lang zählen Tipps (und Dynamit) dreifach, die Zwerge gehen in Deckung und graben nicht.
- **Gletscher:** eigene Schichten (Schnee, Firn, Packeis … Ewiges Eis), eisblau, Schnee fällt. Jeder vierte Felsen steckt im Eis: halber Schaden, bis Dynamit das Eis schmilzt, dafür doppelt Gold. Alle 45 bis 60 Sekunden ein Kälteeinbruch: 12 Sekunden graben die Zwerge nur einen Viertel so schnell, ausser das Bierfass läuft (Bier wärmt). Turm: 2 Kronen pro Stunde.
- **Grotte:** eigene Schichten (Tropfstein, Kalkstein … Abgrund), türkis, Luftblasen. Doppelt so viele Truhen. Bei Bossen steigt sichtbar das Wasser; verliert man, geht es 2 Tiefen zurück statt einer. Turm: 3 Kronen pro Stunde.
- **Kronen-Laden** (Karte, Knopf «Kronen-Laden»; Ausgeben senkt den Punktestand nicht): Kronen-Kraft (+20 % Graben je Stufe, 10 Stufen), Startkapital (jeder neue Block und jede neue Mine beginnt mit 1000, 10'000 … bis 10 Mio. Gold), Zwergen-Gilde (Start mit 10, 20 oder 30 Gräbern), Grösseres Lager (Türme sammeln 18 oder 24 Stunden), Turm-Antrieb (alle Türme +25 % je Stufe, 4 Stufen), Goldhelme und Goldene Hacke (nur zum Anschauen).
- **Alte Spielstände:** Wer das Herz auf 150 schon besiegt hatte (Rekord über 150), bekommt beim ersten Laden den Alten Berg als geschafft: 10 Kronen, einen Turm und ein Erklär-Fenster. Steckt die laufende Mine tiefer als 150, ist der Block fertig (Tiefe 150, Knopf «Nächster Block»), sonst gräbt man weiter und kann den Berg nochmal schaffen.
- **8 Zwerge**, der siebte ab Tiefe 60, der achte ab Tiefe 80. Bei 10, 25, 50, 100, 150, 200 Zwergen einer Sorte verdoppelt sich deren Leistung.
- **15 Werkzeuge** (Reiter «Hacke»), freigeschaltet nach Tiefe: Stahlspitze, Doppelschlag, Förderband, Grosse Laterne, Dynamit, Zeitlupe, Bierfass, Goldwaage, Sprengkurs, Erz-Magnet, Glücksbringer, Zwergenlied, Diamantbohrer, Doppelschicht, Kristallkugel.
- **Dynamit** (Knopf unten links, Taste D): 30 Tipps auf einmal, alle 90 Sekunden. **Bierfass** (Knopf unten rechts, Taste B): Zwerge 20 Sekunden lang dreifach, alle 3 Minuten.
- **55 Ziele** (Reiter «Ziele», seit 13.11. auch Helden, Ausrüstung und Ränge): Tiefe (bis 150), Tipps, Zwerge, Bosse, Truhen, Hacken-Stufe, Werkzeuge, Umzüge, Erbstücke, geschaffte Blöcke (1, 3, 6) und gesammelte Kronen (50, 200). Jedes Ziel gibt einmal Steine.
- **Schmiede (2026-11-13):** im Fenster «Ausrüstung» würfelt ein Hammer-Knopf für 8 Steine ein neues Stück für genau diesen Platz (Chancen wie bei einem normalen Boss). Ist es besser, bleibt es, sonst ist es weg.
- **Treue-Serie (2026-11-13):** wer an aufeinanderfolgenden Tagen spielt, bekommt beim ersten Start des Tages Steine: Tag 2 gibt 2, Tag 3 gibt 3, höchstens 7. Eine Lücke fängt wieder bei 1 an. Spielstand-Feld `streak`.
- **Sternenschacht (2026-11-13):** fünfter Block, 100 Kronen, Turm 5 Kronen pro Stunde. Dünne Luft: Zwerge graben halb so schnell, dafür ist jeder 10. Tipp ein Sternschlag (×15); zehn Punkte über dem Felsen zeigen den Stand.
- **Was ist neu? (2026-11-13):** wer mit einem älteren Spielstand zurückkommt, sieht einmal eine kurze Liste der Neuigkeiten seit seiner Version (Spielstand-Feld `ver`, Liste `NEWS`; bei jeder neuen Version `VERSION` erhöhen und eine Zeile ergänzen).
- **Ränge (2026-11-13):** der Punktestand (alle je gesammelten Kronen) gibt einen von zehn Titeln, vom Kieselklopfer bis zur Legende des Berges (ab 0, 10, 30, 60, 120, 250, 500, 1000, 2500, 6000 Kronen). Jeder Rang gibt +10 % Gold und Graben. Zu sehen in der Karte «Dein Reich» und in den Rekorden. Spielstand-Feld `rankSeen`.
- **Beute (2026-11-13):** Bosse lassen mit 40 % Chance Ausrüstung fallen, Grossbosse immer. Drei Plätze: Hacke (Tippen), Helm (Zwerge), Amulett (Gold). Vier Seltenheiten: Gewöhnlich +5 bis 10 %, Selten +12 bis 20 %, Episch +25 bis 35 %, Legendär +45 bis 60 %. Das bessere Stück bleibt, schwächere werden zu einem Stein. Ansehen im Reiter «Hacke», «Ausrüstung». Bleibt für immer, Spielstand-Feld `gear`.
- **Helden-Zwerge (2026-11-13):** fünf Helden im Reiter «Zwerge» (ab Tiefe 20, 40, 60, 80, 100), mit Steinen anheuern und bis Stufe 5 aufwerten (4, 8, 16, 32, 64 Steine). Genau einer kommt mit: Borin (Tippen +25 % je Stufe), Thrain (Zwerge +15 %), Gundi (Gold +15 %), Flinka (Truhen +30 %), Dvala (Boss-Zeit +3 s). Helden bleiben für immer. Spielstand-Feld `hero`.
- **Kobold-Krämer (2026-11-13):** ab Tiefe 12 alle 5 bis 8 Minuten ein Besuch am Stollenrand, 15 Sekunden lang. Antippen öffnet ein Angebot: Steine gegen 30 % des Goldes (2 bis 5 je nach Schicht), ein Bierfass (Zwerge ×3 für 30 s) gegen 20 %, oder der Koboldwürfel (Einsatz die Hälfte, 50 % Chance auf doppelt zurück, mit Glücksbringer 55 %). «Verjagen» lässt ihn zwei Felsen Gold fallen.
- **Die Zwerge reden:** alle 40–80 Sekunden ein Spruch in einer Sprechblase, passend zur Lage (Kälte, Lava, Boss, Maulwurf, Tiefe, Gold, Untätigkeit).
- **Tagesziele (2026-11-07):** jeden Tag drei neue kleine Ziele (Tipps, Bosse, Zwerge, Truhen) oben im Reiter «Ziele», Lohn in Steinen, alle drei geschafft gibt 5 Steine extra; die Grösse wächst mit der Tiefe.
- **Fundstücke (2026-11-06):** drei je Schicht, 42 insgesamt; Chance beim Durchbruch in eine neue Tiefe (nicht im Herz ab 141), +1 Stein je Fund, +5 je vollständige Schicht, +50 für alle; Sammlung im Reiter «Ziele».
- **Rekorde:** Klick auf die Tiefe oben rechts (oder Reiter «Ziele», «Rekorde»): Punktestand, geschaffte Blöcke, tiefster Punkt aller Zeiten, die laufende Mine, die besten 8 früheren Minen und Blöcke mit Tiefe, Erbstücken oder Kronen und Spielzeit sowie die ganze Spielzeit. Neben der Tiefe steht der Rekord dieses Blocks (🏆), solange man darüber liegt. Wer nach einem Umzug den alten Rekord des Blocks knackt, bekommt «Neuer Rekord!».
- **Neue Mine (Umzug):** Nach dem Grossboss auf Tiefe 50 kann man neu anfangen. Gold, Zwerge, Hacke und Werkzeuge fangen bei null an, Steine und Ziele bleiben. Dafür gibt es Erbstücke, jedes bringt für immer +5 % Gold und Graben. Je tiefer man vorher kommt, desto mehr Erbstücke.
- **Tipps für Neue:** In den ersten Minuten erklären kurze Sprechblasen das Spiel: Felsen antippen, ersten Zwerg kaufen, erster Boss, Steine ausgeben. Ab Tiefe 100 kommt einmal der Hinweis auf das Herz des Berges. Jeder Tipp kommt nur einmal, geht mit «OK» oder nach ein paar Sekunden weg und erscheint nur in einem neuen Spiel. Alte Spielstände sehen sie nicht (ausser dem Umzugs-Tipp).
- **Boss zu stark:** Nach einem verlorenen Boss steht oben in jeder Liste eine rote Karte «Boss auf Tiefe N zu stark». Sie zeigt, wie viel vom Boss die Zwerge allein in der Zeit schaffen, und hat den Knopf «Nochmal». Bei 100 % greifen die Zwerge von selbst an («Jetzt schaffen sie es!»).
- **Umzug lohnt sich:** Hängt man fest (eine Minute nach einem verlorenen Boss oder 5 Minuten ohne neue Tiefe) und macht ein Umzug mindestens 15 % stärker, zeigt ein Tipp auf den Reiter «Ziele», die rote Karte nennt das Plus, und die Karte «Neue Mine» sagt «Lohnt sich jetzt!».
- **Effekte:** Funken und ein kleiner Hüpfer beim Kaufen, roter Blitz mit Trommel, wenn ein Boss kommt, Ticken in den letzten 5 Sekunden, Konfetti beim Sieg, absteigende Töne bei «Zeit um!».
- **Besondere Felsen (5.11.2026):** ab Tiefe 5 ab und zu Goldader (×4 Gold), Kristall mit wandernder Schwachstelle (×8 Schaden auf den Punkt, +1 Stein) oder Panzerfels (nur Dynamit, ×6 Gold, verwittert nach 30 s).
- Zwischendurch taucht eine Schatztruhe auf (Gold oder 15 Sekunden dreifacher Hacken-Schaden).
- Kommt man zurück, bekommt man das Gold, das die Zwerge in der Zwischenzeit gegraben haben (bis 8 Stunden), mit Werbung doppelt.
- **Maulwurf (6.11.2026):** alle 2-4 Minuten klaut ein Maulwurf einen kleinen Sack Gold und rennt ganz unten zwischen den Knöpfen durch; antippen bringt den Sack doppelt zurück, sonst ist er weg.

## Dateien

- `index.html` – das ganze Spiel in einer Datei (kein Internet nötig, ca. 80 KB), Texte Deutsch/Englisch je nach Browser-Sprache
- `soak-mine.js` – Dauertest mit allem Zufall an (Maulwurf, Kobold, besondere Felsen, Sprüche, Beute, Helden) in allen fünf Blöcken: `node soak-mine.js`, am Ende muss «errors 0» stehen.
- `test-mine.js` – Browser-Test mit 121 Prüfungen (Zufall von Felsen und Maulwurf ist im Test abgeschaltet, eigene Prüfungen dafür) und Bildschirmfotos: `node test-mine.js <bilder-ordner>`
- Bilder im Projektordner `inventar/moneyprojekt/spiele/zwergen-mine/bilder/` (erste Fassung), `bilder-v2/` (Ausbau 2), `bilder-v3/` (Ringe und Rekorde), `bilder-v5/` (Tipps, Boss-Hilfe, Umzugs-Hinweis) `bilder-v6/` (Endboss, Förderturm, Karte, Vulkan) `bilder-v7/` (Felsen, Maulwurf, Fundstücke) und `bilder-v8/` (Gletscher, Grotte, Kronen-Laden)

## Bedienung

- Handy: tippen auf den Felsen, Reiter unten für Käufe. PC: Klick, Leertaste oder Enter; D für Dynamit, B für Bierfass.
- Grüner Punkt am Reiter: dort kann man gerade etwas kaufen (beim Reiter «Ziele»: Umzug ist möglich oder lohnt sich). Golden leuchtend: ein Tipp zeigt gerade auf diesen Reiter.
- Spielstand wird im Browser gespeichert (alle 5 Sekunden und beim Verlassen). Alte Spielstände laden weiter, erreichte Ziele werden beim ersten Laden gutgeschrieben.
- **Ganz neu anfangen:** Knopf unten im Fenster «Rekorde». Nach einer Rückfrage wird alles gelöscht (Gold, Steine, Zwerge, Erbstücke, Ziele, Rekorde), nur die Ton-Einstellung bleibt.
- Der Ton geht aus, sobald man woanders hinklickt (anderes Fenster oder ausserhalb des Spiels), und wieder an beim nächsten Tipp ins Spiel. Die Zwerge graben weiter.

## Portal-Anbindung

Objekt `Portal` oben im Code: `gameplayStart`, `gameplayStop`, `happytime` (Boss besiegt, Umzug), `showRewardedAd` (freiwillige Werbung für doppeltes Offline-Gold), `submitScore` (Punktestand = alle Kronen je, bei jedem geschafften Block und jedem Abholen; für die Rangliste des Portals, z. B. CrazyGames, die es nur für eingeladene Spiele gibt). Beim Einreichen durch die Portal-Schnittstelle ersetzen. Das Spiel nutzt keine Browser-Dialogfenster (Rückfrage beim Umzug ist ein eigenes Fenster im Spiel).

### CrazyGames (Ordner `portal/`)

- `portal/crazygames-adapter.js` setzt `window.ZwergenMinePortal` auf das CrazyGames-SDK (Version 3): Spielbeginn und Pause, «happytime», freiwillige Werbung mit Belohnung nur nach ganz gesehener Werbung.
- `node portal/build-crazygames.js` schreibt die fertige Datei nach `portal/dist/crazygames/index.html` (SDK und Adapter vor dem Spiel eingefügt). `dist` wird nicht ins Repo gelegt.
- Während Werbung läuft, schickt der Adapter `zm-ad-start` und `zm-ad-end`; das Spiel pausiert, ist stumm und läuft danach weiter (im Test geprüft).
- `node portal/cover.js <ordner>` erzeugt die Titelbilder (1920×1080, 800×1200, 800×800) und fünf Bildschirmfotos aus dem Spiel selbst. Schritt für Schritt für Christoph: `portal/EINREICHEN.md`.
- **Noch nicht geprüft:** der Adapter ist nach der SDK-Beschreibung geschrieben, aber nicht auf dem echten Portal gelaufen. Vor dem Einreichen im CrazyGames-Prüfwerkzeug («QA Tool») testen. Rangliste (`submitScore`) hat bei CrazyGames kein Gegenstück und tut dort nichts.

## Formeln

Zwischen `FORMELN_START` und `FORMELN_ENDE` im Code.

- Felsen: Leben ×1.21 pro Tiefe, ab Tiefe 40 zusätzlich ×1.025 pro Tiefe, ab Tiefe 140 nur noch ×1.15 pro Tiefe. Gold ×1.2 pro Tiefe.
- Blöcke (`BLOCKS`, `F.blockEnd` 150, `F.blockCrowns` 10, `F.towerMaxH` 12, `F.towerRate`): Kronen pro Stunde je Turm Alter Berg 1, Vulkan 2, Gletscher 2, Grotte 3; Freischalten 0 / 10 / 25 / 50 Kronen. Lava: alle 45 bis 60 s, 10 s, Tipps ×3. Kälte: alle 45 bis 60 s, 12 s, Zwerge ×¼. Eis: 25 % der Felsen ab Tiefe 3, Schaden ×½, Gold ×2. Laden (`SHOP`, `F.shopLv`, `F.towerCap`, `F.startGold`, `F.startDw`); Kronen-Kraft steckt in `F.powerMult` (der Sim ohne Laden ändert das nichts).
- Boss: 7-faches Leben, 5-faches Gold, 30 Sekunden. Grossboss (alle 50): 10-faches Leben, 40 Sekunden, dreifach Steine.
- Erbstücke beim Umzug: (beste Tiefe − 30) ÷ 10, im Quadrat, abgerundet. Tiefe 60 gibt 9, Tiefe 100 gibt 49, Tiefe 150 gibt 144.
- Durchgerechnet mit 3 Tipps pro Sekunde und klugem Einkauf (Umzug ab Tiefe 60, wenn 10 Minuten kein neuer Rekord): Tiefe 50 nach ca. 2 Minuten, Tiefe 100 nach ca. 30 Minuten, Tiefe 150 (erster Block geschafft) nach ca. 2,3 Stunden. Mit 6 Tipps pro Sekunde ca. 1,4 Stunden, mit 1 Tipp pro Sekunde ca. 3,6 Stunden. Weitere Blöcke gehen schneller, weil Steine und ihre Verbesserungen bleiben.

## Beschreibung für Portale

**Deutsch:** Grab dich durch die Erde! Hacke Felsen, heuere Zwerge an, sprenge Grossbosse mit Dynamit und zieh mit Erbstücken in immer tiefere Minen. Fünf Welten vom Alten Berg über Vulkan, Gletscher und Grotte bis in den Sternenschacht. Sammle Helden-Zwerge, Beute von Bossen und 42 Fundstücke, feilsche mit dem Kobold-Krämer und steig im Rang auf. Deine Zwerge graben weiter, auch wenn du weg bist. Wie tief kommst du?

**English:** Dig your way down! Smash rocks, hire dwarves, blast big bosses with dynamite and move to ever deeper mines with your heirlooms. Five worlds, from the Old Mountain through Volcano, Glacier and Grotto to the Star Shaft. Collect hero dwarves, boss loot and 42 finds, haggle with the goblin peddler and climb the ranks. Your dwarves keep digging while you are away. How deep can you go?

**Steuerung / Controls:** Tippen oder klicken auf den Felsen; am PC auch Leertaste, D für Dynamit, B für Bier. / Tap or click the rock; on desktop also Space, D for dynamite, B for beer.

Schlagwörter: idle, clicker, mining, dwarves, incremental, prestige, casual
