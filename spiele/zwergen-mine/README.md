# Zwergen-Mine

**Stand 18.10.2026:** Ausbau 2 spielbar, im Browser geprüft (Handy-Grösse und PC, Deutsch und Englisch). Portal-Anbindung noch Platzhalter.

## Spielregel

Tippen auf den Felsen baut ihn ab, jeder Felsen gibt Gold. Mit Gold kauft man eine bessere Spitzhacke (mehr pro Tipp), Zwerge (graben von allein, auch wenn man weg ist) und Werkzeuge (einmalige Käufe). Alle 10 Tiefen wartet ein Boss-Felsen mit Zeitlimit, alle 50 Tiefen ein Grossboss (zehnfach so stark, 40 Sekunden, dreifach Steine). Schafft man ihn, gibt es Edelsteine für dauerhafte Verbesserungen (Zwergenkraft, Goldgier, Glückstreffer, Nachtschicht, Schatzspürer). Schafft man ihn nicht, gräbt man eine Tiefe höher weiter und probiert es später nochmal.

- **14 Schichten** zu je 10 Tiefen: Erde, Stein, Kohle, Kupfer, Eisen, Silber, Gold, Kristall, Lava, Tiefe, Obsidian, Mithril, Glutkern, Leere (danach wieder von vorn, aber immer härter).
- **8 Zwerge**, der siebte ab Tiefe 60, der achte ab Tiefe 80. Bei 10, 25, 50, 100, 150, 200 Zwergen einer Sorte verdoppelt sich deren Leistung.
- **15 Werkzeuge** (Reiter «Hacke»), freigeschaltet nach Tiefe: Stahlspitze, Doppelschlag, Förderband, Grosse Laterne, Dynamit, Zeitlupe, Bierfass, Goldwaage, Sprengkurs, Erz-Magnet, Glücksbringer, Zwergenlied, Diamantbohrer, Doppelschicht, Kristallkugel.
- **Dynamit** (Knopf unten links, Taste D): 30 Tipps auf einmal, alle 90 Sekunden. **Bierfass** (Knopf unten rechts, Taste B): Zwerge 20 Sekunden lang dreifach, alle 3 Minuten.
- **25 Ziele** (Reiter «Ziele»): Tiefe, Tipps, Zwerge, Bosse, Truhen, Hacken-Stufe, Werkzeuge, Umzüge. Jedes Ziel gibt einmal Steine.
- **Neue Mine (Umzug):** Nach dem Grossboss auf Tiefe 50 kann man neu anfangen. Gold, Zwerge, Hacke und Werkzeuge fangen bei null an, Steine und Ziele bleiben. Dafür gibt es Erbstücke, jedes bringt für immer +5 % Gold und Graben. Je tiefer man vorher kommt, desto mehr Erbstücke.
- Zwischendurch taucht eine Schatztruhe auf (Gold oder 15 Sekunden dreifacher Hacken-Schaden).
- Kommt man zurück, bekommt man das Gold, das die Zwerge in der Zwischenzeit gegraben haben (bis 8 Stunden), mit Werbung doppelt.

## Dateien

- `index.html` – das ganze Spiel in einer Datei (kein Internet nötig, ca. 60 KB), Texte Deutsch/Englisch je nach Browser-Sprache
- `test-mine.js` – Browser-Test mit 17 Prüfungen und Bildschirmfotos: `node test-mine.js <bilder-ordner>`
- Bilder im Projektordner `inventar/moneyprojekt/spiele/zwergen-mine/bilder/` (erste Fassung) und `bilder-v2/` (Ausbau 2)

## Bedienung

- Handy: tippen auf den Felsen, Reiter unten für Käufe. PC: Klick, Leertaste oder Enter; D für Dynamit, B für Bierfass.
- Grüner Punkt am Reiter: dort kann man gerade etwas kaufen (beim Reiter «Ziele»: Umzug ist möglich).
- Spielstand wird im Browser gespeichert (alle 5 Sekunden und beim Verlassen). Alte Spielstände laden weiter, erreichte Ziele werden beim ersten Laden gutgeschrieben.

## Portal-Anbindung

Objekt `Portal` oben im Code: `gameplayStart`, `gameplayStop`, `happytime` (Boss besiegt, Umzug), `showRewardedAd` (freiwillige Werbung für doppeltes Offline-Gold). Beim Einreichen durch die Portal-Schnittstelle ersetzen. Das Spiel nutzt keine Browser-Dialogfenster (Rückfrage beim Umzug ist ein eigenes Fenster im Spiel).

## Formeln

Zwischen `FORMELN_START` und `FORMELN_ENDE` im Code.

- Felsen: Leben ×1.21 pro Tiefe, ab Tiefe 40 zusätzlich ×1.025 pro Tiefe. Gold ×1.2 pro Tiefe.
- Boss: 7-faches Leben, 5-faches Gold, 30 Sekunden. Grossboss (alle 50): 10-faches Leben, 40 Sekunden, dreifach Steine.
- Erbstücke beim Umzug: (beste Tiefe − 30) ÷ 10, im Quadrat, abgerundet. Tiefe 60 gibt 9, Tiefe 100 gibt 49, Tiefe 150 gibt 144.
- Durchgerechnet mit 3 Tipps pro Sekunde und klugem Einkauf: Tiefe 50 nach ca. 2 Minuten, Tiefe 80 nach ca. 11 bis 14 Minuten, erster sinnvoller Umzug nach ca. 25 Minuten auf Tiefe 90 bis 100. Danach wird jede Runde tiefer, nach ca. 6 Stunden Spielzeit flacht es bei Tiefe 170 bis 180 ab.

## Beschreibung für Portale

**Deutsch:** Grab dich durch die Erde! Hacke Felsen, heuere Zwerge an, sprenge Grossbosse mit Dynamit und zieh mit Erbstücken in immer tiefere Minen. Wie tief kommst du?

**English:** Dig your way down! Smash rocks, hire dwarves, blast big bosses with dynamite and move to ever deeper mines with your heirlooms. How deep can you go?

Schlagwörter: idle, clicker, mining, dwarves, incremental, prestige, casual
