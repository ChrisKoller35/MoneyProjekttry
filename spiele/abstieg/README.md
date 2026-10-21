# Der Abstieg

Dungeon-Action-Roguelite für Spieleportale: Rasse und Klasse wählen, den Helden selbst durch die Räume steuern (Joystick am Handy, WASD am PC), Gegner in Echtzeit bekämpfen, Items sammeln, aufsteigen, sterben, Seelenfunken ausgeben, nochmal.

Konzept: `/mnt/project-files/inventar/moneyprojekt/spiele/abstieg/KONZEPT.md` (Projekt-Ordner).

## Stand Stufe 1
- 6 Ebenen (Boss auf 3 und 6), je Ebene 6-8 verbundene Räume (Kampf, Elite, Truhe, Händler, Feuer, Ereignis, Treppe/Boss); Kampfräume verriegeln die Türen bis alle Gegner tot sind. Kein Auto-Kampf mehr (Christoph 18.10.).
- 2 Rassen frei (Mensch, Felsgeborener), 3 freischaltbar im Lager. 3 Klassen (Klinge, Schütze, Weber); Rufer und Braumeister kamen am 20.10. dazu (siehe unten).
- 22 Gegenstands-Grundformen, 14 Zusätze, 6 Einzelstücke, verfluchte Items; Beutel mit 8 Plätzen.
- 12 Monster, 2 Bosse, 6 Ereignisse, Händler, Rast, Schatz. 4 Aufgaben.
- Stufenaufstieg mit Statpunkten, alle 3 Stufen eine neue Fähigkeit.
- Seelenfunken nach jedem Durchlauf, Lager mit 10 Freischaltungen (seit 20.10. ein ausbaubares Lager, siehe unten).
- Speichert im Browser (laufender Durchlauf und Lager). Deutsch/Englisch nach Browser-Sprache.

## Welten und Segen (19.10.2026)
- **6 Welten mit je 4 Ebenen** (Graue Gewölbe, Dschungel-Ruinen, Wüstengrab, Versunkene Stadt, Vulkanschmiede, Abgrund), Boss auf jeder 4. Ebene. Nach Ebene 24 geht es endlos weiter: die Welten kommen wieder (II, III …), die Gegner werden stärker.
- Jede Welt hat eigenen Boden, eigene Wände, eigene Hindernisse (Säulen, Bäume, Kakteen, Korallen, Obsidian, Kristalle), eigene Gruben (Wasser, Lava, Leere; nicht begehbar, Geschosse fliegen darüber), eigenen Gefahr-Boden (Schlamm, Treibsand, seichtes Wasser, Glut, Schatten; bremst oder brennt), eigene Gegner, eigenen Boss und eigene Musik.
- **Räume in vielen Formen** (`js/levels.js`): Rechteck, Achteck, rund, Kreuz, L, Ring, Säulenhalle, zweigeteilt, Insel, Teich, Streifen, Garten. 7 bis 12 Räume je Ebene auf einem 4×4-Raster, Gegner laufen über ein Wegenetz um Hindernisse herum.
- **Schrein auf jeder Ebene** (`js/boons.js`): 3 Angebote, eins davon nehmen oder für Gold verzichten. Arten: neuer Zauber (11 Zauber für alle Klassen: Feuerball, Eisnova, Kettenblitz, Blitzschritt, Giftwolke, Meteor, Heilquelle, Geisterschwarm, Geisterwolf, Erdstoss, Klingenfächer), passiver Segen (23 Talente, z. B. Kettenreaktion, Kreisende Klingen, Treuer Begleiter, Frostaura, Glaskanone) oder Verstärkung eines Zaubers (bis Stufe III, je +30 % Stärke und 20 % schneller). Nach Elite- und Boss-Kämpfen gibt es eine zweite Wahl.
- **Grenzen:** 4 Zauber-Knöpfe (weitere liegen im Zauberbuch und lassen sich tauschen), 6 passive Segen (Mensch 7). Ist alles voll, wählt man, was ersetzt wird (eigene Fenster im Spiel, keine Browser-Rückfragen).
- Spielstand-Schlüssel `abstieg.v2`: ein alter laufender Durchlauf beginnt neu, Seelenfunken und Freischaltungen bleiben.

## Welt-Bosse (20.10.2026)
Jeder der 6 Bosse hat eine eigene Mechanik mit Anzeige am Boden (`js/bosses.js`) und wird ab halbem Leben wütend (schneller, mehr Angriffe):
- **Schleimkönig:** springt auf den Helden (grüner Kreis), hinterlässt bremsenden Schleim; in der Wut Schleimring bei jeder Landung. Teilt sich weiterhin.
- **Dornenmutter:** Ranken brechen unter dem Helden aus dem Boden und halten ihn kurz fest; in der Wut zusätzlich eine Rankenpeitsche in einer Reihe.
- **Sandpharao:** Sandsäulen in einer Reihe auf den Helden zu (in der Wut drei Reihen), Sandsog zieht den Helden zu ihm, in der Wut mit Treibsand.
- **Tiefenkraken:** Tentakel unter dem Helden; die Flut füllt den ganzen Raum, nur in den hellen Kreisen ist man sicher.
- **Rostkönig:** Hammerschläge hinterlassen Lava-Pfützen; in der Wut regnet Glut in den Raum. Waffentreffer heilen ihn nur noch um 2 %.
- **Wächter der Tiefe:** steht still und dreht einen Leerenstrahl durch den Raum (in der Wut zwei).
**Boss-Trophäen:** jeder Boss lässt einmal pro Durchgang ein eigenes legendäres Stück mit besonderer Kraft fallen (`A.TROPHIES` in `js/data.js`): Krone des Schleimkönigs (Schleimhülle), Dornenherz (Dornen beim Getroffenwerden), Sanduhr des Pharao (Zauber 20 % schneller), Tintenfass des Kraken (Tintenring jeder 4. Angriff), Glutstiefel (Glut-Spur), Auge der Tiefe (Volltreffer explodieren).

## Ausrüstung für eigene Builds (20.10.2026)
Waffe, Rüstung, Helm, Stiefel und zwei Schmuckstücke bekommen Zufalls-Eigenschaften, aus denen man einen eigenen Build baut (`js/gear.js`, Inhalte `A.ELEMENTS` und `A.POWERS` in `js/data.js`):
- **6 Elemente:** Feuer, Eis, Blitz, Gift, Schatten, Stein. Gute Stücke haben oft eins, seltene und bessere immer. 2, 4 und 6 Teile desselben Elements schalten je einen stärkeren Bonus frei (Feuer: Brand, dann Explosion beim Tod, dann Meteor alle 5 Sekunden; Eis: bremsen, einfrieren, Eisnova; Blitz: Tempo, Kettenblitz, schnellere Zauber; Gift: Gift, Giftwolke, doppeltes Gift das überspringt; Schatten: Volltreffer nach Ausweichen; Stein: Schild bei Kampfbeginn, weniger Schaden, Erdbeben). Elemente, die man schon trägt, fallen öfter.
- **15 besondere Kräfte** (selten 30 %, episch und legendär immer, verflucht 60 %): Zauberklinge, Riesentöter, Vampirkuss, Zweiter Wind, Seelensammler, Nachbeben, Schattenwolf, Raserei, Funkenflug, Goldmagnet, Panzerbrecher, Wirbelklingen, Sturmlauf, Glückspilz und Phönix (nur legendär oder verflucht, einmal pro Ebene wieder aufstehen). Gleiche Kräfte zählen nicht doppelt, es gilt der beste Wert.
- **Anzeige:** Fund-Fenster zeigt, welcher Element-Bonus dazukommt oder wegfällt; Heldenblatt «Ausrüstung» zeigt «Dein Build» (Teile je Element, laufende Boni, nächster Bonus, alle Kräfte). Bei zwei vollen Schmuckplätzen fragt das Spiel, welcher weichen soll.
- **Schmiede** auf jeder geraden Ebene ab 2 (Schmied mit Hammer, Esse, Amboss): Werte neu würfeln, eine neue Kraft schmieden (ab selten) oder das Element frei wählen, gegen Gold. Einzelstücke und Boss-Trophäen haben ein festes Element und bleiben, wie sie sind.
- Spielstand bleibt: ein laufender Durchlauf behält seine aktuelle Ebene genau so, wie sie war; die Schmiede kommt erst auf den nächsten Ebenen dazu.

## Rufer und Braumeister (20.10.2026)
Zwei neue Klassen, gleich von Anfang an spielbar, je mit eigener Figur, eigener Waffe und 6 eigenen Zaubern (2 zum Start, die anderen beim Aufsteigen). Regeln in `js/classes.js`, Zahlen in `A.SKILLS` und `A.CLASSES` (`js/data.js`):
- **Rufer** (Kapuze, Schädelstab, lila Zauberkugeln): Knochenruf (2 Skelette), Seelenpfeil (Ziel steht als Geist auf, wenn es stirbt), Grabeshände (Hände aus dem Boden halten fest), Seelenband (heilt, Diener schneller und stärker, länger da), Opfergabe (alle Diener explodieren), Totenheer (5 Skelette). Höchstens 7 Diener gleichzeitig, die ältesten zerfallen zuerst. Jeder besiegte Gegner (ausser Bossen) steht mit 20 % Chance als Geist auf. Diener verteilen sich auf die Gegner und stellen sich rundherum.
- **Braumeister** (Hut, Bart, Schürze): wirft Flaschen im Bogen, die beim Aufprall platzen (über Säulen und Gruben hinweg, an Wänden zerschellen sie); jede 4. Flasche ist eine Überraschung (Feuer, Gift oder Frost). Zauber: Brandflasche (Feuerlache), Heiltrunk, Giftflasche (Giftwolke), Frostflasche (friert ein), Sprengfass (Lunte, grosse Explosion), Wundertrank (zufällig Riesenwuchs, Feuerspucke, Glückssträhne oder Blubberblasen). Tränke heilen 60 % statt 40 % und geben «Rausch» (schneller laufen und werfen); startet mit einem Trank mehr.
- Spielstand bleibt: laufende Durchläufe und Lager sind unverändert, die zwei Klassen sind in der Heldenwahl einfach frei.

## Das Lager (20.10.2026)
Aus der Liste mit 10 einmaligen Käufen wird ein Lager, das man über viele Durchgänge mit Seelenfunken ausbaut (Zahlen in `A.CAMP`, `A.BANNERS` in `js/data.js`, Regeln in `js/game.js`, Bild in `js/scenes.js`):
- **9 Gebäude mit Stufen** (zusammen 49 Stufen, 8265 Funken): Lagerfeuer (10× +5 % Leben), Übungsplatz (10× +4 % Schaden), Schatzkiste (6× +25 Startgold), Kräuterkessel (3 Starttränke, Tränke heilen bis +15 %), Schreibstube (dritte Startfähigkeit, Zauber 10 % schneller, ein Segen-Platz mehr), Lagerschmiede (Start mit seltener Waffe, guter Rüstung, gutem Helm und Stiefeln), Händlerzelt (bis −20 % beim Händler), Glücksbrunnen (bessere Beute), Segensstein (1-2 Segen schon vor Ebene 1).
- **Lager-Stufe** = alle gebauten Stufen plus freigeschaltete Völker (höchstens 52). Kräuterkessel, Schreibstube, Schmiede, Händlerzelt, Brunnen und Segensstein öffnen sich erst ab Lager-Stufe 3, 6, 9, 12, 16 und 20. Die 3 Völker kauft man weiter im Lager (60/120/200).
- **Wimpel der Weltenbosse:** jeder der 6 Welt-Bosse hängt beim ersten Sieg einen Wimpel ins Lager (+50 Funken und ein kleiner Dauer-Bonus), ab Welten II wird er golden (+100 Funken, doppelter Bonus).
- **Rekord-Funken:** am Ende gibt es für jede Ebene über dem alten Rekord 5 Funken extra. Der Endbildschirm zeigt die Aufteilung und ob man jetzt etwas ausbauen kann; im Titel leuchtet dann ein Punkt am Lager-Knopf.
- **Das Lager-Bild wächst mit:** jedes Gebäude zeigt seine Stufe (Glut wird zu grossem Feuer mit Spiess, Strohpuppen und Zielscheibe, offene Truhe mit Gold, Schmied mit Hammer und Funken, Händler mit Laterne, Lichtsäule am Segensstein), freie Plätze leuchten, wenn man genug Funken hat. Freigeschaltete Völker sitzen ums Feuer, ab Stufe 15 kommt ein Palisadenzaun, ab 30 ein Wachturm, ganz ausgebaut eine Krone.
- Spielstand bleibt: alte Käufe werden einmal in gleich gute oder bessere Gebäude-Stufen umgewandelt (es geht nichts verloren), Wimpel für schon besiegte Bosse werden nachgeliefert, ein laufender Durchlauf geht normal weiter.

## Elite-Gegner (20.10.2026)
Elite-Gegner sind keine stärkeren Zahlen mehr, sondern haben Eigenschaften, die man sieht und auf die man reagieren muss (Regeln und Bild in `js/elites.js`, Texte in `A.ELITE_TRAITS` in `js/data.js`):
- **16 Eigenschaften:** Flink (Nachbilder), Gepanzert (Funken, kein Rückstoss), Giftig (Giftpfützen), Feurig (Feuerring mit Warnkreis), Frostig (Eiskreis unter dem Helden, friert fest), Explosiv (platzt kurz nach dem Tod, trifft auch Gegner), Beschwörer (ruft Helfer), Blinzelnd (springt durch den Raum), Schildträger (Lichtschild, lädt nach), Vampir (heilt sich mit Treffern), Riesig (doppelt so gross, Stampfer), Gewitter (drei markierte Blitze), Wütend (ab halbem Leben rasend), Spiegelnd (zwei Spiegelbilder bei halbem Leben), Klingenwirbel (drei kreisende Klingen), Heiler (heilt die anderen Gegner).
- **Mehr Eigenschaften in der Tiefe:** 1 bis Ebene 4, 2 ab Ebene 5, 3 ab Ebene 15, 4 ab Welten II. Ab Ebene 3 hat ein Kampfraum manchmal einen «Champion» mit einer Eigenschaft weniger (13 % bis höchstens 30 %). Was nicht zusammenpasst, kommt nicht zusammen: höchstens eine Eigenschaft, die ihn am Leben hält (Schild, Vampir, Heiler), nie Flink und Riesig zugleich, kein Beschwörer bei Gegnern, die schon rufen.
- **Anzeige:** farbige Aura und Name mit Symbolen über dem Gegner, oben ein eigener Balken mit allen Eigenschaften und einem kurzen Tipp, Warnkreise am Boden. Taucht eine Eigenschaft zum ersten Mal auf, erklärt ein Banner sie.
- **Belohnung je Eigenschaft:** mehr Gold und Erfahrung, bessere Beute (ab 3 Eigenschaften manchmal ein zweites Stück), am Ende 1 Seelenfunke pro besiegter Eigenschaft.
- **Elite-Buch im Lager:** eine Seite pro Eigenschaft. Die erste besiegte Elite mit einer neuen Eigenschaft gibt sofort 10 Seelenfunken, jede Seite macht für immer 2 % mehr Schaden gegen Elite-Gegner (alle 16: +32 %). Das Buch zählt auch, wie oft man jede Eigenschaft besiegt hat.
- Nebenbei: Balken und Hinweise oben weichen am Handy der Minikarte aus, lange Einblendungen passen auf schmale Bildschirme. Behoben: wer während des Abstiegs noch einmal die Treppe benutzte, konnte zweimal «Tiefer» wählen und übersprang eine ganze Ebene (auch einen Boss).
- Spielstand bleibt: altes Lager und laufende Durchläufe laden normal, das Elite-Buch beginnt leer.

## Legendäre Gegenstände (21.10.2026)
20 Legenden (`js/legends.js`, Texte in `A.LEGENDS` in `js/data.js`), jede verändert die Spielweise und hat ein eigenes Bild:
- **Von den 6 Weltenbossen:** Pudding, der Thronfolger (Schleim-Begleiter, verschluckt angeschlagene Gegner und wächst), Strickjacke der Dornenmutter (doppelte Dornen, Ranken halten Gegner fest), Totenmaske des Pharao (alle 15 Sekunden steht die Zeit 2 Sekunden still), Bademantel des Kraken (Tintenwolke, Gegner darin schlagen daneben), Amboss im Abo (alle 4 Sekunden ein Amboss auf den stärksten Gegner), Wächterauge am Stiel (jeder 4. besiegte Gegner reisst ein Leerenloch auf).
- **Von Elite-Gegnern mit der passenden Eigenschaft:** Riesenpilz-Hut (Riesig: du wirst riesig), Spiegelscherbe (Spiegelnd: dein Spiegelbild zaubert mit), Gebiss des Grafen (Vampir: Überheilung wird Schild), Blitzableiter (Gewitter: Angriffe springen über), Grillschürze (Feurig: Gegner um dich brennen), Schneekugel (Frostig: einfrieren und zerspringen lassen), Quietsche-Latschen (Explosiv: Quietsche-Ente als Köder, die explodiert), Fliegender Teppich (Flink: schweben über schlechtem Boden).
- **Aus geheimen Räumen** (eine Legende pro Welt): Flöte des Rattenfängers (Ratten kämpfen mit), Würfel des Gönners (Würfel zu Kampfbeginn), Prahlhans (jeder Sieg im Raum macht stärker), Rüstung aus Bratpfannen (jeder 3. Treffer prallt ab), Münzfresser (Angriffe kosten Gold und treffen härter), Voodoo-Puppe (andere Gegner spüren mit).
- **Geheime Räume:** ab Ebene 2 manchmal am Ende eines Gangs, der ins Geröll führt. Geröll wegräumen (nicht mitten im Kampf), dahinter steht eine lila Truhe mit viel Gold, einem guten Stück und oft der Legende dieser Welt.
- **Regeln:** jede Legende höchstens einmal pro Durchlauf, Waffen passen immer zur Klasse, Werte wachsen mit der Ebene wie bei den Boss-Trophäen. Die Schmiede lässt Legenden, wie sie sind; die volle Tasche verkauft sie nicht von selbst.
- **Legenden-Sammlung im Lager:** gefundene mit Bild, Name und Wirkung, unbekannte als Schatten mit Fundort. Jede neue gibt sofort 20 Seelenfunken und für immer +1 % Schaden (alle 20: +20 %).
- Spielstand bleibt: altes Lager lädt normal mit leerer Sammlung, laufende Durchläufe bauen ihre Ebene gleich wie vorher (geheime Räume erst in neuen Durchläufen).

## Grössere Räume (21.10.2026)
Wunsch: «die Räume sind bisschen eng, doppelt so viel Platz». Neue Ebenen bauen mit grösseren Zellen (24×18 statt 17×13 Kacheln, `A.Levels.BIG` in `js/levels.js`):
- **Kampfräume etwa doppelt so gross** (Fläche im Mittel ×1.97, begehbarer Boden ×1.94), Start-, Truhen-, Laden-, Schmiede- und geheime Räume etwas grösser, Boss-Räume 21×15 statt 15×11. Die Formen wachsen mit (breitere Gänge im Ring, Säulen weiter auseinander, Graben der Insel weiter innen).
- **Damit es nicht leer wirkt:** ein Gegner mehr pro Kampfraum (Abstand beim Erscheinen 160 statt 130), etwa doppelt so viele Hindernisse, Gruben und Flecken Gefahr-Boden.
- **Überblick:** die Kamera zoomt auf fast allen Bildschirmen eine Stufe heraus (man sieht in jede Richtung etwa ein Viertel mehr), auf Handy und PC. Der Kraken setzt in grossen Räumen einen sicheren Kreis mehr.
- Spielstand bleibt: eine laufende Ebene bleibt wie sie ist, ab der nächsten Ebene sind die Räume gross (`lvVer` 4 in `game.js`).

## Look (18.10.2026)
Pixel-Grafik komplett aus Code (keine Bilddateien, keine KI-Bilder): feste Palette mit 32 Farben (Endesga 32), dunkle Umrisse, Licht und Schatten (Fackeln, Lichtkreis um den Helden, leuchtende Beute), Treffer-Gefühl (kurzes Anhalten, Wackeln, Funken, Zahlen, Töne). 4 Farbwelten nach Tiefe. Titelbild mit Tor in die Tiefe, Heldenwahl auf einer Bühne. Kommt ein Gerät nicht mit, schaltet das Spiel selbst auf eine einfachere Licht-Darstellung um. Begründung, Vorher/Nachher-Bilder und offene Grenzen: `/mnt/project-files/inventar/moneyprojekt/spiele/abstieg/LOOK.md` (Projekt-Ordner).

## Kein 3D mehr (21.10.2026)
Den zweiten Look «3D» (three.js, 18.10.) gibt es nicht mehr: Christoph braucht ihn nicht, es gibt nur noch das Retro-Spiel. Weg sind der Knopf «Look» im Titel, die Taste L, `?look=3d`, `js/draw3.js`, `src3d/` und `build3d.js`; die Spiel-Datei ist dadurch nur noch gut halb so gross (rund 700 statt 1270 KB). Wer 3D gewählt hatte, spielt mit seinem Spielstand einfach im Retro-Look weiter.

## Dateien
- `index.html` + `js/*.js` – Quelltext:
  - `rng`, `data`, `game` – Zufall, Inhalte (Rassen, Klassen, Gegenstände, Monster), Spielstand.
  - `boons` – Schrein: Zauber für alle, passive Talente, Verstärkungen.
  - `gear` – Ausrüstung: Element-Boni (2/4/6 Teile) und besondere Kräfte im Kampf, Build-Übersicht.
  - `classes` – eigene Spielweise von Rufer (Diener) und Braumeister (Flaschen im Bogen, Sprengfass, Tränke).
  - `bosses` – Boss-Mechaniken mit Warnkreisen; `elites` – Elite-Eigenschaften (Würfeln, Verhalten, Aura, Balken oben, Warnkreise); `legends` – Wirkung der 20 Legenden (Haken für Treffer, Siege, Zauber, Kampfbeginn, Zeichnen).
  - `levels` – Ebenen-Bau: Raster, Raumformen, Gänge, Hindernisse, Erreichbarkeit.
  - `world` – Räume, Gegner, Treffer, Wegenetz, Gefahr-Boden, Zauber und Talente in der Welt.
  - `art` – alle Figuren, Gegner, Gegenstände und Symbole als Pixel-Raster mit Palette.
  - `draw` – Dungeon zeichnen, Licht und Schatten, Minikarte, Boss-Balken.
  - `fx` – Effekte (Funken, Wackeln, Treffer-Pause, Zeitlupe, Banner, Flecken am Boden).
  - `sound` – Töne aus Code (Web Audio), keine Tondateien.
  - `scenes` – Titelbild (Tor in die Tiefe), Bühne der Heldenwahl und das Lager-Bild, das mit den Gebäuden wächst.
  - `input` – Tasten, Joystick, Knöpfe; `ui` – Menüs, Anzeige oben, Knöpfe.
- `fonts/` – Pixelify Sans und Jacquard 24 (beide SIL Open Font License, Lizenztext in `fonts/OFL-*.txt`), werden beim Bauen in die Datei eingebettet.
- `node build.js` – baut `dist/index.html` (eine Datei mit allem, auch den Schriften; für Artifact und Portal).
- `node test-abstieg.js <ordner> [playwright-pfad] [chromium-pfad] [klasse]` – steuert den Helden automatisch durch die Räume (läuft, schlägt, benutzt Truhen und Treppen), macht Bildschirmfotos, bricht bei Fehlern ab. Klasse z. B. `rufer` oder `brau` (sonst Klinge).
- `node shots.js dist/index.html <ordner> [handy|pc|beide]` – Vergleichsbilder aller wichtigen Bildschirme.

## Portal
`Portal`-Objekt in `ui.js` ist ein Platzhalter; wird beim Einreichen durch das CrazyGames-SDK ersetzt.
