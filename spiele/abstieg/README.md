# Der Abstieg

Dungeon-Action-Roguelite für Spieleportale: Rasse und Klasse wählen, den Helden selbst durch die Räume steuern (Joystick am Handy, WASD am PC), Gegner in Echtzeit bekämpfen, Items sammeln, aufsteigen, sterben, Seelenfunken ausgeben, nochmal.

Konzept: `/mnt/project-files/inventar/moneyprojekt/spiele/abstieg/KONZEPT.md` (Projekt-Ordner).

## Stand Stufe 1
- 6 Ebenen (Boss auf 3 und 6), je Ebene 6-8 verbundene Räume (Kampf, Elite, Truhe, Händler, Feuer, Ereignis, Treppe/Boss); Kampfräume verriegeln die Türen bis alle Gegner tot sind. Kein Auto-Kampf mehr (Christoph 18.10.).
- 2 Rassen frei (Mensch, Felsgeborener), 3 freischaltbar im Lager. 3 Klassen (Klinge, Schütze, Weber); Rufer und Brauerin kommen in Stufe 2.
- 22 Gegenstands-Grundformen, 14 Zusätze, 6 Einzelstücke, verfluchte Items; Beutel mit 8 Plätzen.
- 12 Monster, 2 Bosse, 6 Ereignisse, Händler, Rast, Schatz. 4 Aufgaben.
- Stufenaufstieg mit Statpunkten, alle 3 Stufen eine neue Fähigkeit.
- Seelenfunken nach jedem Durchlauf, Lager mit 10 Freischaltungen.
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

## Look (18.10.2026)
Pixel-Grafik komplett aus Code (keine Bilddateien, keine KI-Bilder): feste Palette mit 32 Farben (Endesga 32), dunkle Umrisse, Licht und Schatten (Fackeln, Lichtkreis um den Helden, leuchtende Beute), Treffer-Gefühl (kurzes Anhalten, Wackeln, Funken, Zahlen, Töne). 4 Farbwelten nach Tiefe. Titelbild mit Tor in die Tiefe, Heldenwahl auf einer Bühne. Kommt ein Gerät nicht mit, schaltet das Spiel selbst auf eine einfachere Licht-Darstellung um. Begründung, Vorher/Nachher-Bilder und offene Grenzen: `/mnt/project-files/inventar/moneyprojekt/spiele/abstieg/LOOK.md` (Projekt-Ordner).

## Zweiter Look «3D» (18.10.2026, abends)
Umschaltbar im Titel (Knopf «Look»), im Spiel mit Taste L oder per `?look=3d` in der Adresse; Retro bleibt Standard und wird gespeichert. Klötzchen-Figuren, Steinboden und Ziegelwände als echte Körper, Fackeln mit Lichtschein, Schatten, Nebel, Gitter an verriegelten Türen, leuchtende Beute; alle Texte, Balken, Minikarte und Joystick kommen aus dem gleichen Code wie im Retro-Look. Gebaut mit three.js (MIT-Lizenz, im Bündel `js/draw3.js` eingebettet). Kommt ein Gerät nicht mit, schaltet das Spiel die Schatten ab und zeichnet gröber. Bilder und Grenzen: `LOOK.md` im Projekt-Ordner (Abschnitt «Zweiter Look»).

## Dateien
- `index.html` + `js/*.js` – Quelltext:
  - `rng`, `data`, `game` – Zufall, Inhalte (Rassen, Klassen, Gegenstände, Monster), Spielstand.
  - `boons` – Schrein: Zauber für alle, passive Talente, Verstärkungen.
  - `gear` – Ausrüstung: Element-Boni (2/4/6 Teile) und besondere Kräfte im Kampf, Build-Übersicht.
  - `levels` – Ebenen-Bau: Raster, Raumformen, Gänge, Hindernisse, Erreichbarkeit.
  - `world` – Räume, Gegner, Treffer, Wegenetz, Gefahr-Boden, Zauber und Talente in der Welt.
  - `art` – alle Figuren, Gegner, Gegenstände und Symbole als Pixel-Raster mit Palette.
  - `draw` – Dungeon zeichnen, Licht und Schatten, Minikarte, Boss-Balken.
  - `draw3` – 3D-Look (gebündelt aus `src3d/draw3.js` plus three.js; nicht von Hand ändern, sondern `src3d/draw3.js` ändern und `node build3d.js` laufen lassen).
  - `fx` – Effekte (Funken, Wackeln, Treffer-Pause, Zeitlupe, Banner, Flecken am Boden).
  - `sound` – Töne aus Code (Web Audio), keine Tondateien.
  - `scenes` – Titelbild (Tor in die Tiefe) und Bühne der Heldenwahl.
  - `input` – Tasten, Joystick, Knöpfe; `ui` – Menüs, Anzeige oben, Knöpfe.
- `fonts/` – Pixelify Sans und Jacquard 24 (beide SIL Open Font License, Lizenztext in `fonts/OFL-*.txt`), werden beim Bauen in die Datei eingebettet.
- `npm install` (einmal) und `node build3d.js` – bündelt den 3D-Look nach `js/draw3.js` (esbuild + three.js aus `package.json`).
- `node build.js` – baut `dist/index.html` (eine Datei mit allem, auch den Schriften; für Artifact und Portal).
- `node test-abstieg.js <ordner> [playwright-pfad] [chromium-pfad] [retro|3d]` – steuert den Helden automatisch durch die Räume (läuft, schlägt, benutzt Truhen und Treppen), macht Bildschirmfotos, bricht bei Fehlern ab.
- `node shots.js dist/index.html <ordner> [handy|pc|beide] [retro|3d]` – Vergleichsbilder aller wichtigen Bildschirme.

## Portal
`Portal`-Objekt in `ui.js` ist ein Platzhalter; wird beim Einreichen durch das CrazyGames-SDK ersetzt.
