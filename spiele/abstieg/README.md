# Der Abstieg (Stufe 1)

Dungeon-Roguelite für Spieleportale: Rasse und Klasse wählen, Raum für Raum tiefer, Gegner im Auto-Kampf besiegen, Items sammeln, aufsteigen, sterben, Seelenfunken ausgeben, nochmal.

Konzept: `/mnt/project-files/inventar/moneyprojekt/spiele/abstieg/KONZEPT.md` (Projekt-Ordner).

## Stand Stufe 1
- 6 Ebenen (Boss auf 3 und 6), je Ebene 4 Räume zur Wahl plus Boss.
- 2 Rassen frei (Mensch, Felsgeborener), 3 freischaltbar im Lager. 3 Klassen (Klinge, Schütze, Weber); Rufer und Brauerin kommen in Stufe 2.
- 22 Gegenstands-Grundformen, 14 Zusätze, 6 Einzelstücke, verfluchte Items; Beutel mit 8 Plätzen.
- 12 Monster, 2 Bosse, 6 Ereignisse, Händler, Rast, Schatz. 4 Aufgaben.
- Stufenaufstieg mit Statpunkten, alle 3 Stufen eine neue Fähigkeit.
- Seelenfunken nach jedem Durchlauf, Lager mit 10 Freischaltungen.
- Speichert im Browser (laufender Durchlauf und Lager). Deutsch/Englisch nach Browser-Sprache.

## Dateien
- `index.html` + `js/*.js` – Quelltext (rng, data, combat, game, render, ui).
- `node build.js` – baut `dist/index.html` (eine Datei, für Artifact und Portal).
- `node test-abstieg.js <ordner>` – spielt einen Durchlauf automatisch durch, macht Bildschirmfotos, bricht bei Fehlern ab.

## Portal
`Portal`-Objekt in `ui.js` ist ein Platzhalter; wird beim Einreichen durch das CrazyGames-SDK ersetzt.
