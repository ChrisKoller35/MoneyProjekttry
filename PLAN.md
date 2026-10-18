# Moneyprojekt – Plan

Stand: 18.10.2026, Entscheidung von Christoph (Thread «Moneyprojekt: Neustart», 09:13): **Vorschlag 1, kleine Browser-Spiele für Spieleportale.** Nur noch eine Linie.

> Neustart 18.10.2026: Die Kurzgeschichten (Shorts) und die Pino-Kindergeschichten werden nicht weiterverfolgt. Alte Dateien liegen in `archiv-2026-10-18/`, der alte Plan in `archiv-2026-10-18/PLAN-alt.md`. Vorschläge und Begründung in `NEUSTART-VORSCHLAEGE.md`.

## Was wir machen

Kleine Spiele, die im Browser laufen (Handy mit Finger, PC mit Maus), ohne Sprache, Grafik aus Code. Sie kommen auf Spieleportale (zuerst CrazyGames, danach GameDistribution und weitere). Die Portale zeigen Werbung im Spiel und zahlen dem Hersteller einen Anteil. Kosten: 0 CHF, keine Stimm- oder Bild-Credits.

## Regeln

- KI baut, testet und schreibt alle Texte; Christoph legt Konten an, trägt die Auszahlung ein und lädt Spiele hoch (ca. 10 Minuten pro Spiel).
- Jedes Spiel: eigener Ordner im Repo MoneyProjekttry (`spiele/<name>/`), eine einzige HTML-Datei plus Code, läuft offline, unter 5 MB, Start in unter 3 Sekunden, Touch und Maus, flüssig auf einem alten Handy.
- Zuerst klein und fertig, dann gross. Was gut läuft, bekommt Nachschub (Levels, Verbesserungen); was nicht läuft, bleibt liegen.
- Werbung nur über die Schnittstelle des Portals (vor dem Start, zwischen Runden, freiwillig für Bonus). Keine eigene Werbung, kein Kauf im Spiel.
- Kein D&D, keine geschützten Figuren oder Namen.
- Nachtbot (ki-bot) darf: Fehler beheben, Levels ergänzen, Tests schreiben. Neue Spiele und Spielregeln entscheidet der Thread.

## Spielideen (Christoph: Reihenfolge noch zu bestätigen)

| Kürzel | Spiel | Kern | Bauzeit |
|--------|-------|------|---------|
| C | Turmstapler | Blöcke fallen, im richtigen Moment tippen, Turm wächst und wackelt; Runde 30 s, Highscore | ca. 1 Woche |
| A | Zwergen-Mine | Idle: tippen zum Abbauen, Zwerge anheuern, Verbesserungen, immer tiefer, Fortschritt bleibt | 2–3 Wochen |
| B | Tier-Merge | Zwei gleiche Tiere zusammenschieben ergibt das nächste; Kette Maus bis Wal | 1–2 Wochen |
| D | Linien-Rätsel | Linie zeichnen, Kugel rollt ins Ziel; 60 Levels mit Physik | 2–3 Wochen |
| E | Käfer-Verteidigung | Mini-Tower-Defense, 20 Karten, Wellen und Aufrüsten | 2–3 Wochen |

Vorschlag: C zuerst (ganzer Weg bis zur Annahme einmal durchlaufen), dann A, dann nach Zahlen.

## Meilensteine

| Nr. | Was | Wer | Fertig wenn |
|-----|-----|-----|-------------|
| 1 | Repo MoneyProjekttry aufräumen: Geschichten-Dateien nach `archiv/`, neuer Ordner `spiele/`, Vorlage für ein Spiel (HTML, Build, Tests, Portal-Anbindung als Platzhalter) | KI | PR gemergt |
| 2 | Spiel C fertig: spielbar, Touch + Maus, Highscore gespeichert, Vorschaubild, Beschreibung in Deutsch und Englisch | KI | im Browser geprüft, Bilder im Thread |
| 3 | Konto bei CrazyGames (Entwicklerbereich), Auszahlung eintragen | Christoph | Konto da |
| 4 | Werbe-Schnittstelle von CrazyGames einbauen, Spiel einreichen | KI baut, Christoph lädt hoch | eingereicht |
| 5 | Annahme abwarten, Rückmeldungen umsetzen; parallel Spiel A beginnen | KI | C online |
| 6 | Nach 4 Wochen online: Zahlen (Spiele, Spielzeit, Einnahmen) auswerten, zweites Portal (GameDistribution) dazunehmen | KI | Bericht im Thread |

## Offen

- Christoph: Reihenfolge C, dann A bestätigen oder Lieblinge nennen.
- Später: Spiele zusätzlich als Handy-App (Google Play, 25 USD einmalig), wenn ein Spiel gut läuft. Steam (Vorschlag 3) als grosser zweiter Schritt bei einem Hit.
