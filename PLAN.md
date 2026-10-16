# Moneyprojekt – Plan

Stand: 16.10.2026, Entscheidung von Christoph (Thread «Moneyprojekt-Ideen», 09:57).

## Entscheidung

Zwei Linien, beide: zuerst Publikum, dann Verkauf. Ideen zur Auswahl siehe IDEEN-2026-10-16.md.

- **Projekt 1 – Geschichten für Erwachsene:** Die YouTube-Geschichte B17 fertig machen (läuft im Projekt YouTube-Geschichten). Danach Kurzgeschichten: ein Kapitel = ein Video und ein E-Book-Band. Vergleichen, was besser ankommt.
- **Projekt 2 – Kindergeschichten:** Eigener Kinderkanal mit einer festen Figur. Wenn es gut läuft, zusätzlich Kinderbuch und Kindermalbuch zur Figur anbieten.

Gestrichen: Charakterbögen, Web-Generatoren. One-Shots als PDF gehören als Shop-Vorschlag zu TAEHRON (nur mit Christophs Okay).

## Beilage: One-Shots und D&D-Lizenz (für TAEHRON)

- **Nur SRD-Inhalte (5.1 und 5.2, CC-BY-4.0):** frei nutzbar, auch kommerziell, in jedem Shop (eigener Shop, DriveThruRPG, itch.io), Erlös bleibt bis auf die Shop-Gebühr (0 bis 35 %) bei uns. Pflicht: Hinweistext auf Wizards of the Coast und CC-BY. Verboten: der Name «Dungeons & Dragons», Logos, Welten (Forgotten Realms), geschützte Wesen (Beholder, Mind Flayer, Displacer Beast u.a.) und geschützte Figuren.
- **Volle D&D-Inhalte:** nur über die DMs Guild. Dort sind Welten und Namen erlaubt, aber Wizards und die Plattform nehmen 50 %, und das Produkt darf nirgends sonst verkauft werden.
- **Empfehlung:** SRD-Weg mit eigener Welt, dann sind die Produkte überall verkaufbar und passen zur TAEHRON-App.

## Regeln

- Ideen, Planung und Marketing: Claude Fable 5.1, mindestens Effort mittel. Klar definierte Umsetzungsschritte dürfen an Opus 5.5 oder den Bot.
- Christoph entscheidet über Veröffentlichung und Verkauf. Konten (YouTube, KDP, Zahlung) legt er an, Claude liefert Texte, Bilder, Dateien.
- Kein Riesendateien-Problem wiederholen: ein Kapitel oder eine Geschichte = eine Datei = ein Video.
- Kinderinhalte: Videos als «für Kinder» markieren, keine Kommentare, keine Gewalt, keine Werbung in der Geschichte, Figur und Ton altersgerecht (Zielalter festlegen, Vorschlag 4 bis 7).

## Projekt 1 – Geschichten für Erwachsene

| Meilenstein | Was | Wer | Fertig wenn |
|-------------|-----|-----|-------------|
| 1.1 | B17 als Kapitel-Videos hochladen (läuft im YouTube-Projekt) | KI + Christoph | alle 6 Kapitel online |
| 1.2 | Kurzgeschichten-Format festlegen: Genre, Länge (ca. 3000 bis 5000 Wörter), Welt (eigene oder B17-Welt), Serienname | Claude schlägt vor, Christoph wählt | Formatblatt im Repo |
| 1.3 | Kurzgeschichte 1 schreiben, als Video produzieren (gleicher Ablauf wie B17) | KI | Video online |
| 1.4 | Kurzgeschichte 1 als E-Book auf KDP (Cover, Beschreibung, Preis 0.99 bis 2.99) | KI liefert, Christoph stellt ein | Band 1 kaufbar |
| 1.5 | 3 Kurzgeschichten, dann Vergleich: Aufrufe B17-Kapitel vs. Kurzgeschichten, Verkäufe KDP | KI wertet aus | Entscheid, welches Format weiterläuft |

Kosten: 0 CHF. KDP braucht Steuerangaben (Schweiz: Formular im KDP-Konto, kein US-Konto nötig).

## Projekt 2 – Kindergeschichten

| Meilenstein | Was | Wer | Fertig wenn |
|-------------|-----|-----|-------------|
| 2.1 | Figur und Welt: 3 Vorschläge (Name, Aussehen, Grundidee, Zielalter), Christoph wählt | Claude Fable 5.1 | Figurenblatt im Repo |
| 2.2 | Bildstil und Bildwerkzeug festlegen (Stable Diffusion lokal oder Bilddienst), 5 Testbilder derselben Figur | KI, Christoph wählt | Figur sieht auf allen Bildern gleich aus |
| 2.3 | Kanal-Setup: Name, Logo, Banner, Beschreibung; Kanal legt Christoph an, «für Kinder» markieren | KI liefert, Christoph richtet ein | Kanal steht |
| 2.4 | 5 Gute-Nacht-Geschichten (je 5 bis 8 Minuten) schreiben, vertonen, Video, hochladen; Rhythmus 1 pro Woche | KI | 5 Videos online |
| 2.5 | Nach 10 Videos: Aufrufe, Wiedergabezeit, Abos auswerten; Entscheid Buch/Malbuch | KI wertet aus, Christoph entscheidet | Entscheid im Repo |
| 2.6 | Wenn ja: Malbuch (30 Seiten) und Bilderbuch (Band 1) zur Figur auf KDP, mit KI-Angabe | KI liefert, Christoph stellt ein | Produkte kaufbar |

Kosten: Bildwerkzeug 0 CHF (lokal) bis ca. 10 CHF pro Monat (Dienst). Stimme: Vorschlag dieselbe Technik wie bei B17; falls eine warme Kinderstimme gebraucht wird, Stimmen-Dienst ca. 5 bis 11 USD pro Monat.

## Entscheidungen 16.10.2026 (Manager, von Christoph übertragen)

Christoph hat die offenen Entscheidungen dem Manager übergeben (Projekt-Chat 10:00). Festgelegt:

- **Kinderfigur:** A, Pino der Pinguin mit roter Wollmütze. Figurenblatt: kinder/PINO-FIGURENBLATT.md.
- **Zielalter:** 4 bis 7.
- **Genre Kurzgeschichten:** Option 1, dunkle Fantasy in eigener Welt. Serienname vorläufig «Aus den Randlanden».
- **Bildwerkzeug:** Flux über Replicate (API, Bezahlung pro Bild, ca. 0.003 bis 0.04 USD je nach Modell; 100 Bilder im Monat unter 5 CHF). Figurenkonsistenz über Flux Kontext (Bild-zu-Bild mit Referenzbild von Pino) und festen Prompt-Baustein aus dem Figurenblatt. Grund: per Skript aus dem Bot ansteuerbar, kein Grafikkarten-Zwang, kein Abo. Rückfall ohne Kosten: Stable Diffusion lokal auf Christophs PC, falls die Grafikkarte reicht. Preise beim Einrichten prüfen.
- **Stimme:** dieselbe Technik wie bei B17, erst wechseln, wenn Testhörer die Stimme als zu hart für Kinder empfinden.
- Fragen zum Projekt gehen an den Manager (Projekt-Session), nicht an Christoph; Ausnahme Geld, Konten, PC.

## Nächste Schritte

1. Christoph (Konto): Replicate-Konto anlegen, API-Token als Secret REPLICATE_API_TOKEN im Repo Manager hinterlegen (nie im Chat).
2. Claude: 5 Testbilder von Pino (Meilenstein 2.2), sobald das Token da ist. Bis dahin: Geschichten schreiben (kinder/geschichten/).
3. Christoph (Konto): YouTube-Kinderkanal anlegen, wenn Figur und Logo stehen (Meilenstein 2.3).
4. Morgen-Manager: Geschichten 2 bis 5 als ki-bot-Issues oder Thread-Aufgaben einplanen, Vertonung nach dem B17-Ablauf.
