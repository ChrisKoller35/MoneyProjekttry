# Stimmvorschlag ElevenLabs – Pino-Geschichten

Stand: 17.10.2026. Dieser Thread hat keinen ElevenLabs-Key, darum nur Vorschlag und Testplan; die Proben macht der Thread mit dem Key (B17-Stimmproben-Thread, Werkzeuge unter youtube-b17/stimmproben/).

## Ausgangslage

- Konto: ElevenLabs Starter, 40 000 Zeichen pro Monat. Stand 16.10. abends ca. 15 000 verbraucht (B17 Kapitel 1 und Proben).
- Die fünf Pino-Geschichten brauchen zusammen ca. 21 000 Zeichen (siehe Sprechfassungen). Drei Proben à 60 Sekunden kosten ca. 2 500 Zeichen.
- Folge: Im Oktober reichen die Zeichen für die Proben und zwei bis drei Pino-Geschichten, nicht für alle fünf plus weitere B17-Kapitel. Entweder im November weiter, oder Christoph entscheidet über die nächste Abo-Stufe (Creator, 100 000 Zeichen, ca. 22 USD pro Monat). Entscheid liegt beim Manager und Christoph (Geld).

## Kandidaten (alle Library-Stimmen, Modell eleven_multilingual_v2, Deutsch getestet bei B17)

| Nr. | Stimme | Voice-ID | Charakter | Warum für Pino |
|---|---|---|---|---|
| 1 | **Lea** (Empfehlung) | `7eVMgwCnXydb3CikjV7a` | weiblich, warm, weich | Gute-Nacht-Ton, hebt den Kinderkanal hörbar vom Erwachsenen-Kanal (Christian) ab. Bei B17 als zu sanft für Krimi empfunden, genau das passt hier. |
| 2 | **Clemens** | `elrPOnQZaau5IoISMrJe` | männlich, freundlich, etwas heller als Christian | Vorlese-Papa-Ton, gut für die Lacher und Pinos Hüpfer. |
| 3 | **Christian** | `NBqeXKdZHweef6y0B67V` | männlich, warm, Hörbuch | Schon bewährt, aber derselbe Erzähler wie B17. Nur nehmen, wenn 1 und 2 nicht überzeugen. |

Nicht im Testplan: Stimmen, die bei Kindern als «Werbestimme» wirken (zu glatt, zu laut). Falls Lea und Clemens beide nicht passen, in der ElevenLabs-Library nach «German, narrative, calm, children» suchen und zwei weitere IDs testen.

## Einstellungen (Vorschlag, abweichend von B17)

```
voice_settings: stability 0.65, similarity_boost 0.75, style 0.10, speed 0.88
```

Höhere Stabilität und langsameres Tempo als bei B17 (0.55 / 0.95), weil Einschlafgeschichten gleichmässig und langsam sein müssen. Die Mitmach-Pausen als `<break time="3.0s" />`.

## Testplan (für den Thread mit dem Key)

1. Probetext: `kinder/vertonung/PROBE-TEXT.txt` (Anfang von Geschichte 1 bis zur ersten Mitmach-Pause, ca. 60 Sekunden).
2. Aufruf wie bei B17: `PROBE_TEXT=... PROBE_PREFIX=pino-probe- python3 youtube-b17/stimmproben/probe.py 7eVMgwCnXydb3CikjV7a:lea elrPOnQZaau5IoISMrJe:clemens NBqeXKdZHweef6y0B67V:christian` mit den Einstellungen oben.
3. Ablage: kinder/vertonung/proben/pino-probe-*.mp3. Christoph hört die drei Proben, der Manager entscheidet, falls Christoph es ihm überlässt.
4. Danach Geschichte 1 komplett mit `sprechen_kinder.py`, Ergebnis kinder/vertonung/audio/01-pino-und-die-wandernde-waerme.mp3.

## Prüfkriterien

- Klingt das «Brrr» wie Frösteln und nicht wie ein Buchstabe?
- Werden die Mitmach-Pausen wirklich still?
- Wird der Schluss hörbar leiser und langsamer?
- Würde ein Vierjähriger dabei einschlafen (und nicht aufwachen)?
