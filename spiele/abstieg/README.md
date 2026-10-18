# Der Abstieg (Stufe 1)

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

## Look (18.10.2026)
Pixel-Grafik komplett aus Code (keine Bilddateien, keine KI-Bilder): feste Palette mit 32 Farben (Endesga 32), dunkle Umrisse, Licht und Schatten (Fackeln, Lichtkreis um den Helden, leuchtende Beute), Treffer-Gefühl (kurzes Anhalten, Wackeln, Funken, Zahlen, Töne). 4 Farbwelten nach Tiefe. Titelbild mit Tor in die Tiefe, Heldenwahl auf einer Bühne. Kommt ein Gerät nicht mit, schaltet das Spiel selbst auf eine einfachere Licht-Darstellung um. Begründung, Vorher/Nachher-Bilder und offene Grenzen: `/mnt/project-files/inventar/moneyprojekt/spiele/abstieg/LOOK.md` (Projekt-Ordner).

## Zweiter Look «3D» (18.10.2026, abends)
Umschaltbar im Titel (Knopf «Look»), im Spiel mit Taste L oder per `?look=3d` in der Adresse; Retro bleibt Standard und wird gespeichert. Klötzchen-Figuren, Steinboden und Ziegelwände als echte Körper, Fackeln mit Lichtschein, Schatten, Nebel, Gitter an verriegelten Türen, leuchtende Beute; alle Texte, Balken, Minikarte und Joystick kommen aus dem gleichen Code wie im Retro-Look. Gebaut mit three.js (MIT-Lizenz, im Bündel `js/draw3.js` eingebettet). Kommt ein Gerät nicht mit, schaltet das Spiel die Schatten ab und zeichnet gröber. Bilder und Grenzen: `LOOK.md` im Projekt-Ordner (Abschnitt «Zweiter Look»).

## Dateien
- `index.html` + `js/*.js` – Quelltext:
  - `rng`, `data`, `game` – Zufall, Inhalte (Rassen, Klassen, Gegenstände, Monster), Spielstand.
  - `world` – Räume, Gegner, Treffer.
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
