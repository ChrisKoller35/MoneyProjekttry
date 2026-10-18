# Zwergen-Mine

**Stand 18.10.2026:** spielbar, im Browser geprüft (Handy-Grösse und PC). Portal-Anbindung noch Platzhalter.

## Spielregel

Tippen auf den Felsen baut ihn ab, jeder Felsen gibt Gold. Mit Gold kauft man eine bessere Spitzhacke (mehr pro Tipp) und Zwerge (graben von allein, auch wenn man weg ist). Alle 10 Tiefen wartet ein Boss-Felsen mit Zeitlimit; schafft man ihn, gibt es Edelsteine für dauerhafte Verbesserungen (Zwergenkraft, Goldgier, Glückstreffer, Nachtschicht, Schatzspürer). Schafft man ihn nicht, gräbt man eine Tiefe höher weiter und probiert es später nochmal. Alle 10 Tiefen wechselt die Schicht (Erde, Stein, Kohle, Kupfer, Eisen, Silber, Gold, Kristall, Lava, Tiefe). Zwischendurch taucht eine Schatztruhe auf (Gold oder 15 Sekunden dreifacher Schaden). Bei 10, 25, 50, 100 Zwergen einer Sorte verdoppelt sich deren Leistung. Kommt man zurück, bekommt man das Gold, das die Zwerge in der Zwischenzeit gegraben haben (bis 8 Stunden), mit Werbung doppelt.

## Dateien

- `index.html` – das ganze Spiel in einer Datei (kein Internet nötig, ca. 40 KB), Texte Deutsch/Englisch je nach Browser-Sprache
- `test-mine.js` – Browser-Test (Playwright)
- Bilder im Projektordner `inventar/moneyprojekt/spiele/zwergen-mine/bilder/`

## Bedienung

- Handy: tippen auf den Felsen, Reiter unten für Käufe. PC: Klick, Leertaste oder Enter.
- Grüner Punkt am Reiter: dort kann man gerade etwas kaufen.
- Spielstand wird im Browser gespeichert (alle 5 Sekunden und beim Verlassen).

## Portal-Anbindung

Objekt `Portal` oben im Code: `gameplayStart`, `gameplayStop`, `happytime` (Boss besiegt), `showRewardedAd` (freiwillige Werbung für doppeltes Offline-Gold). Beim Einreichen durch die Portal-Schnittstelle ersetzen.

## Formeln

Zwischen `FORMELN_START` und `FORMELN_ENDE` im Code. Felsen: Leben ×1.21 pro Tiefe, Gold ×1.2 pro Tiefe. Boss: 7-faches Leben, 5-faches Gold, 30 Sekunden.

## Beschreibung für Portale

**Deutsch:** Grab dich durch die Erde! Hacke Felsen, heuere Zwerge an, besiege Boss-Felsen und finde Edelsteine. Wie tief kommst du?

**English:** Dig your way down! Smash rocks, hire dwarves, beat boss rocks and collect gems. How deep can you go?

Schlagwörter: idle, clicker, mining, dwarves, incremental, casual
