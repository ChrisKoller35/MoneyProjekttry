# Turmstapler

**Stand 18.10.2026:** spielbar, im Browser geprüft (Handy-Grösse und PC). Portal-Anbindung noch Platzhalter.

## Spielregel

Ein Block fährt über dem Turm hin und her. Tippen (oder Leertaste) lässt ihn fallen. Was über den Turm hinausragt, wird abgeschnitten und fällt herunter, der Turm wird schmaler. Trifft man genau, blitzt es, die Kombo zählt hoch und der Turm wird wieder etwas breiter. Daneben getippt heisst Spiel vorbei. Punkte = gestapelte Blöcke. Der Rekord bleibt im Browser gespeichert.

## Dateien

- `index.html` – das ganze Spiel in einer Datei (kein Internet nötig, ca. 20 KB)
- `bilder/` liegen im Projektordner (`inventar/moneyprojekt/spiele/turmstapler/bilder/`), nicht im Repo
- `test-turm.js` – Browser-Test (Playwright)

## Bedienung

- Handy: tippen. PC: Klick, Leertaste, Enter oder Pfeil nach unten.
- Lautsprecher-Knopf oben rechts: Ton an/aus (Töne kommen aus Code, keine Audiodateien).
- Wechselt man das Fenster, pausiert das Spiel.

## Portal-Anbindung

Im Code steht oben ein Objekt `Portal` mit `gameplayStart`, `gameplayStop`, `happytime` und `showAd`. Beim Einreichen wird es durch die Schnittstelle des Portals ersetzt (CrazyGames: SDK v3, gleiche Aufruf-Namen). Werbung kommt nach jedem dritten Spielende vor dem Neustart.

## Beschreibung für Portale

**Deutsch:** Stapel die Blöcke so genau wie möglich! Jeder Fehler macht den Turm schmaler, jeder perfekte Treffer macht ihn breiter. Wie hoch kommst du?

**English:** Stack the blocks as precisely as you can! Every miss makes the tower thinner, every perfect drop makes it wider. How high can you go?

Schlagwörter: stack, tower, arcade, one tap, casual, highscore

## Test

`node test-turm.js <bilder-ordner>` (braucht Playwright und Chromium) startet das Spiel in Chromium, setzt 25 Blöcke, verliert absichtlich und macht Bildschirmfotos. Prüft auch Tastatur am PC und dass keine Fehler in der Konsole stehen.
