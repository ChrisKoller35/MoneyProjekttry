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
- **Anzeige:** das Fund-Fenster vergleicht mit dem angelegten Stück (siehe «Vergleich beim Fund»); Heldenblatt «Ausrüstung» zeigt «Dein Build» (Teile je Element, laufende Boni, nächster Bonus, alle Kräfte). Bei zwei vollen Schmuckplätzen fragt das Spiel, welcher weichen soll.
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

## Vergleich beim Fund (21.10.2026)
Wunsch: «wenn ich neue bekomm ist es mir nicht übersichtlich genug, welche das alte ist und ob ich es wirklich ersetzen oder verkaufen soll». Rechnung in `js/compare.js`, Fenster in `js/ui.js` (`compareView`):
- **Altes und neues Stück nebeneinander:** links «Neu» (beim Händler «Zu kaufen», aus dem Beutel «Im Beutel»), rechts «Angelegt» (oder «Nichts», wenn der Platz frei ist). Auf dem Handy passen beide Karten nebeneinander.
- **Urteil:** «Besser», «Schlechter», «Anders» (Vor- und Nachteile, dazu «unterm Strich eher stärker/schwächer» oder «Geschmackssache») oder «Gleich», mit einem kurzen Satz wie «Mehr Angriff und eine neue Kraft.» Gerechnet wird mit den echten Heldenwerten vorher und nachher, also mit Stufe, Werten, Talenten, Element-Boni (auch Boni, die wegfallen), Kräften, Trophäen und Legenden. Schaden zählt so viel wie Leben; was die Klasse nicht braucht (Zauberkraft bei Klinge und Schütze, Angriff bei Weber und Rufer), steht grau mit «nützt dir kaum» da und zählt nicht.
- **Werte farbig:** jede Zeile «Angriff 28 ▸ 39 +11», grün mehr, rot weniger. Darunter, was dazukommt oder wegfällt: Element-Bonus, Kraft, Legende (mit ihrer Wirkung), Trophäen-Kraft, zweite Chance; grau, wenn ein Teil näher am nächsten Element-Bonus ist.
- **Knöpfe immer in derselben Reihenfolge,** der Tipp leuchtet golden: «Anlegen» (sagt, welches Stück in den Beutel kommt), «Behalten» (in den Beutel), «Verkaufen» (mit Gold). Esc, I und Tab behalten das Stück (früher: verkauft). Ist der Beutel voll, steht da, welches Stück dafür verkauft wird.
- **Überall:** im Heldenblatt (Beutel), beim Händler (mit «Kaufen und anlegen»), in Truhen, geheimen Truhen und Ereignissen hat jedes Stück ein Abzeichen «Besser/Schlechter/Anders/Gleich»; Antippen öffnet den Vergleich. Bei zwei vollen Schmuckplätzen wählt man im Vergleich, welcher Schmuck weichen soll (der bessere Tausch steht oben).
- Behoben: ein Fund, der bei vollem Beutel angelegt wurde, konnte gleichzeitig verkauft werden; Flüche zeigen «−2 % Leben alle 2 Sekunden» statt «+-2».
- Spielstand bleibt: nur Anzeige, keine neuen Felder.

## Kombos (21.10.2026)
Wunsch: «stacken dann die Effekte mehr, gibt es crazy Kombinationen? … finde ich Sachen, die besser zu meinem Build passen, oder Sachen, die es total eskalieren lassen». Regeln in `js/combos.js`, Liste in `A.COMBOS` (`js/data.js`):
- **20 Kombos aus je zwei Teilen:** Segen vom Schrein, Zauber (das Zauberbuch reicht, er muss nicht auf einem Knopf liegen), Element (2 Ausrüstungs-Teile), Legende, Boss-Trophäe oder die eigene Klasse. Zum Beispiel Feuerwerk (Kettenreaktion + Feuer: jede Explosion schiesst 4 Raketen, die bunt zerplatzen), Königsfamilie (Pudding + Krone des Schleimkönigs: Pudding mit grosser Krone spuckt Baby-Schleime aus), Plasmaball (Feuerball + Kettenblitz), Das Rudel (Treuer Begleiter + Geisterwolf: 3 Wölfe), Todesmut (Glaskanone + Berserker: unter 35 % Leben nur Volltreffer). Jede Klasse hat ihre eigene (Wirbelwind, Pfeilhagel, Fadensturm, Knochenknall, Hausbrauerei).
- **Erwachen am Schrein:** sind beide Teile da, meldet ein Banner «Kombo bereit»; am nächsten Schrein erwacht sie im goldenen Fenster, oder gleich dort, wenn der gewählte Segen das fehlende Teil ist. Fehlt später ein Teil, ruht sie und wirkt wieder, sobald es zurück ist.
- **Der Schrein hilft mit:** je tiefer, desto öfter liegt ein Teil im Angebot, das eine Kombo ganz macht (Ebene 1 zu 30 %, ab Ebene 12 zu 85 %), die Karte sagt «Weckt die Kombo …».
- **Heldenblatt** (Reiter «Segen» mit ★ und Anzahl): was wirkt, was bereit ist, was ruht und welchen Kombos nur noch ein Teil fehlt, mit Fundort. Der Vergleich beim Fund zeigt «Kombo bereit», «Kombo ruht» oder «Kombo-Teil weg».
- **Kombo-Buch im Lager:** gefundene mit Name und Wirkung, unbekannte als «???» mit Rezept. Jede neue gibt sofort 15 Seelenfunken.
- **Gleiche Kräfte stapeln:** trägt man dieselbe Kraft mehrfach, zählt das beste Stück ganz und jedes weitere halb (wo kleiner besser ist, nimmt jedes weitere Stück ein Viertel weg), mit Grenzen für die starken (z. B. Raserei höchstens 16 %, Vampirkuss 8 %). Das Heldenblatt zeigt «×2», der Vergleich «stärker» mit dem neuen Wert.
- **Beute nach Build:** Kräfte, die man schon trägt, kommen auf neuen Stücken je tiefer desto öfter (ab Ebene 7 doppelt, ab Ebene 20 viermal so oft); Elemente kamen schon vorher bevorzugt.
- Spielstand bleibt: alte Durchläufe laden gleich (neue Felder erst, wenn eine Kombo bereit ist), das Kombo-Buch beginnt leer; ein Durchlauf mit Kombo lädt auch noch in der Version davor.
- **Nachschub (05.11.2026):** 8 neue Kombos, zusammen 28. Eissplitter (Doppelte Wucht + 2 Teile Eis): Treffer auf gebremste oder eingefrorene Gegner lassen 6 bremsende Splitter rundum fliegen. Magnetsturm (Goldgier + 2 Teile Blitz): jede Münze schlägt als kleiner Blitz in den nächsten Gegner. Schattenschritt (Zauber Blitzschritt + 2 Teile Schatten): nach dem Sprung 1,5 Sekunden unverwundbar, der nächste Treffer ist ein doppelter Volltreffer. Blitzpanzer (Eiserne Haut + 2 Teile Blitz): wer dich trifft, bekommt einen Blitz ab, der auf 2 weitere Gegner springt. Amok (Berserker + Blutrausch): unter 50 % Leben hält der Rausch doppelt so lang, jeder Sieg im Rausch heilt 2 %. Dampfkessel (Zauber Feuerball + Zauber Eisnova): Feuerball auf gebremste Gegner macht +50 % und betäubt sie 1 Sekunde im Dampf. Drachenfeuer (Begleiter Glut + Zauber Feuerball, die erste Kombo mit einem Tier): Feuerball-Explosionen 40 % grösser, dazu 3 Sekunden eine Glutlache. Sprengmeister (Schwarzpulver + Zauber Meteor): jeder Meteor zündet 3 Nachschläge rundum.

## Begleiter und verrückte Stücke (21.10.2026)
Wunsch: mehr vom Schlag «der Hut, der einen Schleim spawnt, ist ja mega». Regeln in `js/pets.js` und `js/wild.js`, Listen in `A.PETS` und `A.LEGENDS` (`js/data.js`):
- **6 Begleiter in Käfigen:** ab Ebene 2 steht manchmal (45 %) ein Käfig in einem Kampfraum; er taucht auf, wenn der Raum gesäubert ist. Wer noch nie ein Tier gefunden hat, findet auf Ebene 2 sicher eins. Flitz (Fuchs, flink), Huhu (Eule, zeigt geheime Räume auf der Karte), Glut (kleiner Drache, spuckt Feuer aus der Ferne), Brunhilde (Kröte mit Krone, springt Gegnern auf den Kopf), Stachel (Igel, rollt als Kugel durch die Gegner), Gacker (Huhn, legt Eier, daraus schlüpfen Küken). Jedes neue Tier: 25 Seelenfunken.
- **Treue:** wächst mit jedem Sieg, den ein Tier miterlebt (Elite 3, Weltenboss 15), und bleibt für immer. Jede Stufe +15 % Schaden; Treue 3 und 5 bringen je einen neuen Trick (z. B. Langfinger, Nachtauge, Feueratem, Königssprung, Flipperkugel, goldenes Ei).
- **Tierhütte im Lager** (ab Lager-Stufe 4, 5 Stufen): ein Tier kommt von Anfang an mit, mehr Schaden, schneller Treue, zwei Tiere gleichzeitig. Ohne Tierhütte bleibt ein Tier nur für den Durchlauf, in dem es gefunden wurde. Im Lager-Abschnitt «Begleiter» antippen, wer mitkommt; gefundene Tiere dösen im Lager-Bild bei der Hütte.
- **Käfig-Fenster:** Mitnehmen, oder (Plätze voll) «Statt X mitnehmen», oder ins Lager schicken. Ein bekanntes Tier freut sich: +10 Treue.
- **10 verrückte Stücke** (Legenden, Sammlung jetzt 30): Bienenkorb-Helm, Affenstiefel (Bananenschalen), Zipfelmütze der Gartenzwerge, Blubber-Teekessel (Seifenblasen fangen Gegner), Kisti die hungrige Truhe (frisst Münzen, spuckt alle 20 ein Item aus), Gewitterwolke an der Leine, Piñata-Keule (Bonbons heilen), Sparschwein-Panzer, Party-Tröte, Fliegenklatsche der Riesen (drückt schwache Gegner platt). Sie fallen überall (Truhen, Elite-Gegner, gesäuberte Kämpfe, Weltenbosse), ab Welt 2 dreimal so oft; noch nie gefundene öfter.
- Spielstand bleibt: alte Durchläufe laden gleich, die laufende Ebene bekommt keinen Käfig (neue Ebenen schon); der Käfig ist immer das letzte Ding im Raum und sein Raum hängt nur vom Startwert der Ebene ab. Neue Felder: `meta.pets`, `meta.petSel`, `run.pets` (leer, wenn nichts gefunden).

## Auftragsbrett und Chronik (05.11.2026)
Fortschritt, der über viele Durchläufe wächst, und ein Blick zurück. Regeln in `js/achieve.js`, Liste `A.ACHIEVEMENTS` in `js/data.js`:
- **Auftragsbrett im Lager:** 30 Erfolge in sechs Gruppen (seit «Dein Build» 33, seit «Hauptleute» 36) (Tiefe, Kampf, Sammlung, Helden, Tiere, verrückte Momente), z. B. «Erster Keller» (Ebene 5), «Hundert Nasen» (100 Gegner), «Kein Kratzer» (Weltenboss ohne Schaden), «Tänzer» (ganze Ebene ab Ebene 3 ohne Schaden, mindestens 5 Gegner), «Dagobert» (1000 Gold auf einmal), «Anfängerpech» (auf Ebene 1 gefallen), «Überlebenskünstler» (Raum mit unter 5 % Leben überstanden). Jeder zeigt seinen Fortschritt und bringt beim Erreichen Seelenfunken (10 bis 200, zusammen 2310, seit «Hauptleute» 2500), sofort gutgeschrieben: im Dungeon als goldene Einblendung (wartet, bis keine andere Einblendung läuft und kein Fenster offen ist), im Lager und im Titel mit «Neu!». Das Ende-Bild zählt die Erfolge des Durchlaufs mit auf.
- **Chronik im Lager:** die letzten 20 Durchläufe (Held, Ebene, Stufe, woran es endete: welcher Gegner, Gift, Flammen oder aufgegeben; Gegner, Gold, Spielzeit, Erfolge, Seelenfunken, wann) und Zahlen fürs ganze Spielerleben (Durchläufe, Siege, tiefste Ebene, Gegner, Weltenbosse, Elite, Gold, geheime Räume, Spielzeit, Lieblingsklasse). «Aufgeben» im Titel schreibt den Durchlauf ebenfalls in die Chronik (ohne Funken).
- **Brett im Lager-Bild:** rechts am Rand (auf dem Handy näher an der Mitte, das Gegenstück zur Tierhütte); je erreichtem Erfolg hängt ein Zettel (bis 12), solange etwas Neues dran hängt, leuchtet es.
- Spielstand bleibt: neue Felder `meta.stats` (Zähler), `meta.ach`, `meta.achNew`, `meta.chron`; im Durchlauf `achSparks`, `achIds`, `floorDmg`, `goldSeen`, `playT`, `deathBy`. Ein alter Durchlauf lädt gleich; nur seine laufende Ebene kann nicht als «ohne Schaden» zählen. Was das Spiel schon vorher gezählt hat (tiefste Ebene, Siege, Gegner, Wimpel, Sammlung, Kombos, Elite-Buch, Tiere, Lager-Stufe), wird beim ersten Start gleich angerechnet; neue Zähler (Bosse, Elite, Räume ohne Schaden, geheime Räume, Gold, Klassen, Völker) beginnen bei 0.

## Dein Build (05.11.2026)
Das Spiel erkennt, was du spielst, und gibt dir das Passende. Regeln in `js/build.js`, Richtungen `A.BUILD_DIRS` in `js/data.js`:
- **Richtungen und Name:** 15 Richtungen (Feuer, Eis, Blitz, Gift, Schatten, Stein, Volltreffer, Dornen, Diener, Heilung, Tempo, Explosionen, Zauber, Gold, Wucht). Punkte gibt alles, was der Held trägt und kann: Element auf der Ausrüstung je Stück 1, Kraft 1, Zauber 1, Talent 1.5, Legende 1.5, Trophäe 1.5, Klasse 1. Ab 3 Punkten hat der Held einen Build und einen Namen aus der stärksten Richtung («Pyromane», «Igel», «Zoodirektor»); ist die zweite Richtung mindestens halb so stark (und 3 Punkte), kommt sie als Eigenschaft davor («Brennender Igel», «Giftiger Zoodirektor»). Der Name steht im Heldenblatt (mit den stärksten drei Richtungen), im Ende-Bild und in der Chronik.
- **Fokus:** Knopf im Heldenblatt. Eine Richtung zählt dann wie 3 Punkte mehr (`run.focus`), damit die Beute dorthin lenkt, bevor man genug trägt. «Automatisch» schaltet ihn ab.
- **Passende Beute:** Elemente und Kräfte der stärksten zwei Richtungen fallen öfter (bis dreimal so oft, dazu wie bisher das, was man schon trägt). Ab Ebene 3 passt beim Händler das erste Stück und in jeder Truhe eines, auch in der Truhe im geheimen Raum (bis zu sechsmal gewürfelt, die Seltenheit steht vorher fest), und am Schrein passt mit 50 % eine Karte zum Build, falls keine ohnehin passt; der Kombo-Köder geht immer vor. Der Kombo-Magnet zieht auch, wenn einer erweckten Kombo ein Element verloren ging, und nicht für Stücke, deren Platz dieses Element schon trägt.
- **Kombo-Magnet:** Fehlt einer Kombo nur noch ein Element (z. B. Stein für «Kaktus»), fällt dieses Element dreimal so oft, bis die Kombo voll ist.
- **Zeichen:** Im Fund-Fenster und beim Händler steht «Passt zu deinem Build (Feuer)» oder golden «Kombo-Teil: Stein für «Kaktus»»; im Beutel und in Truhen tragen passende Stücke ein kleines «Passt» oder «Kombo-Teil». Legenden und Trophäen bekommen kein Zeichen.
- **Erfolge dazu (33):** «Einseitig» (sechs Teile mit demselben Element), «Kombo-Jäger» (drei Kombos in einem Durchlauf), «Prinzipientreu» (Ebene 12 mit einem starken Build, 8 Punkte in der stärksten Richtung).

## Hauptleute und schlauere Feinde (05.11.2026)
Jede Welt hat einen Offizier, und die Gegner reagieren auf das, was passiert. Regeln in `js/foes.js`, Hauptleute `A.CAPTAINS` in `js/data.js`:
- **Hauptleute:** auf der dritten Ebene jeder Welt (Ebene 3, 7, 11 ... und in den Welten II wieder) wartet im Elite-Raum statt einer zufälligen Elite der Hauptmann der Welt, mit Namen, eigener Farbe, festen Elite-Eigenschaften, etwa 2,5-mal so viel Leben wie eine Elite und einer eigenen Masche: **Ratz, der Rattenkönig** (ruft Ratten, rennt bei halbem Leben weg und holt den Schwarm), **Sporenmutter** (Giftspur, heilt ihre Brut; brennt sie, kommt eine Sporenwolke), **Hauptmann Sandak** (Sturmangriff in gerader Linie; sein Panzer halbiert Treffer mit dem Element, das du am meisten trägst), **Krabbenkaiser** (Schild aus Licht, riesig; bei 30 % Leben 2,5 Sekunden im Panzer, danach heilt er sich), **Glutschmied Brokk** (Feuerring, riesig; bei 30 % Wut und zwei Glutwichte), **Der Flüsterer** (verschwindet, Spiegelbilder, heilt sich an dir; sein Flüstern verlängert laufende Abklingzeiten um 1,5 Sekunden). Beim Auftritt eine grosse Einblendung mit der Masche, dazu Sprüche beim Auftauchen, bei halbem Leben, bei 30 % und beim Tod (Sandak nennt dein Element, der Flüsterer deinen Build-Namen). Ab Ebene 7 bringt der Hauptmann einen normalen Gegner mit.
- **Belohnung:** zählt als Elite (Buch, Elite-Funken), dazu 8 Seelenfunken, ein Stück extra (Seltenheit mit Glück +2) und die Beute des Elite-Raums. Im Lager zeigt die Karte **Hauptleute x/6**, wen man schon besiegt hat (mit Masche und Zähler). Die Chronik nennt ihn beim Namen («Hauptmann Sandak hat dich erwischt»). Erfolge: «Offiziersjagd» (ein Hauptmann, 40), «Alle Offiziere» (alle sechs, 120), «Keine Flucht» (20 fliehende Gegner erwischen, 30); damit 36 Erfolge und 2500 Funken.
- **Reaktionen normaler Gegner:** Ratten, Fledermäuse, Kobold-Diebe und Giftfrösche **fliehen** unter 30 % Leben für knapp zwei Sekunden («Hilfe!», der Kobold «Tschüss!») in die Richtung mit dem meisten freien Weg, dann kämpfen sie weiter. **Rache:** fällt ein Gegner, werden Kumpels im Umkreis von 180 Pixeln vier Sekunden lang 30 % schneller und 25 % stärker (roter Rauch, «Rache!»), jeder nur einmal; Beschworene und Spiegelbilder lösen keine Rache aus, Bosse und Hauptleute nehmen keine. **Sporen:** ein brennender Pilzkrieger stösst eine Giftwolke aus (alle 3 Sekunden). **Panzer:** eine Panzerkrabbe geht bei 30 % Leben einmal für 1,2 Sekunden zu (nichts geht durch) und heilt sich danach um 10 %.
- **Spielstand:** neu nur `meta.capt` (besiegte Hauptleute je Art) und die Zähler `meta.stats.captains` und `fleeKills`; eine laufende Ebene aus einem alten Spielstand baut sich gleich, der Hauptmann steht dann im noch nicht gesäuberten Elite-Raum.

## Welten mit Eigenheiten (05.11.2026)
Jede Welt spielt sich jetzt anders, nicht nur farbig. Regeln in `js/weather.js`, Namen und Hinweise `A.WORLD_FX` in `js/data.js`. Beim ersten Betreten einer Welt sagt ein Hinweis oben, was hier anders ist; die Einblendung nennt Welt und Eigenheit.
- **Graue Gewölbe – Steinschlag** (ab Ebene 2): im Kampf wächst alle paar Sekunden ein Schatten am Boden, gut eine Sekunde später kracht ein Stein runter. Trifft den Helden (etwa 10 % Leben) und Gegner (28 %, Elite 12 %, Boss 5 %, kurz betäubt). Gegner in den Schatten locken lohnt sich.
- **Dschungel-Ruinen – Wolkenbruch**: Regen kommt und geht (9 Sekunden). Im Regen erlischt jedes Brennen, Kettenblitze treffen 30 % härter, Schlamm bremst stärker, das Licht wird dunkler.
- **Wüstengrab – Treibsand und Sandsturm**: Treibsand zieht zur Mitte des Flecks. Im Sandsturm (7 Sekunden) schiebt der Wind Held, Gegner und alle Geschosse zur Seite.
- **Versunkene Stadt – Strömung**: seichtes Wasser fliesst je Raum in eine Richtung und trägt alle mit; im Wasser erlischt Brennen.
- **Vulkanschmiede – Ausbruch**: im Kampf leuchten drei Kreise auf (einer beim Helden), dann schlägt Lava ein: Schaden und Brennen für Held und Gegner.
- **Der Abgrund – Finsternis**: viel dunkler, der Held trägt ein grösseres Licht, Gegner im Dunkeln verraten sich durch rote Augen. Der Boss-Raum ist etwas heller.
In späteren Durchgängen (Welten II, III …) kommt alles öfter. Wer an Steinschlag oder Lava stirbt, steht so in der Chronik. Nichts davon steht im Spielstand.

## Endphase der Bosse und neue Elite-Eigenschaften (05.11.2026)
- **Bosse rufen ihre Welt:** fällt ein Welt-Boss unter ein Viertel Leben, kommt nach der Wut eine **letzte Phase** mit der Eigenheit seiner Welt (Einblendung «Letzte Phase!», Regeln in `js/bosses.js`, Wetter in `js/weather.js`). **Schleimkönig:** «Die Decke stürzt ein!», alle 3 Sekunden Steine auf dich und in den Raum (treffen auch ihn). **Dornenmutter:** «Ruft das Gewitter!», Dauerregen und Blitze in markierte Kreise. **Sandpharao:** «Ewiger Sandsturm!», der Wind dreht alle 3 Sekunden und trägt alle Geschosse mit, dazu Treibsand-Pfützen. **Tiefenkraken:** «Der Strudel erwacht!», ein Sog zieht dich zu ihm, die Flut kommt öfter. **Rostkönig:** «Der Vulkan bricht aus!», Lava schlägt ein. **Wächter der Tiefe:** «Das Licht geht aus!», alle 9 Sekunden 3,5 Sekunden fast völlige Dunkelheit, nur deine Lampe und rote Augen. Fällt der Boss, hört alles auf.
- **Vier neue Elite-Eigenschaften (jetzt 20):** **Magnetisch** zieht dich langsam heran (nicht im Boss-Raum; mehrere ziehen nicht stärker, festgehalten nur ein Drittel), **Bombenleger** legt alle 5 Sekunden eine Bombe, die dich und seine Freunde trifft, **Dornenpanzer** sticht ein Drittel deines Waffen-Schadens zurück, auch bei Pfeilen (Zauber gehen durch), **Zäh** steht einmal mit einem Drittel Leben wieder auf («Noch nicht!»). Das Elite-Buch hat damit 20 Seiten (bis +40 % Schaden gegen Elite), der Erfolg «Elite-Kenner» verlangt alle 20; wer ihn schon hat, behält ihn.

## Welt-Dinge (05.11.2026)
In jedem Kampfraum (nicht im Boss-Raum, nicht auf Ebene 1) steht ein Ding, das die Eigenheit der Welt gegen die Gegner dreht. Hinlaufen und berühren, einmal je Raum. Beim ersten Mal auf der Ebene steht oben, was es tut.
- **Graue Gewölbe, Morscher Pfeiler:** Steine fallen auf die fünf nächsten Gegner, nie auf dich.
- **Dschungel, Blitzstein:** Blitze in drei Gegner, im Regen in fünf. Betäubt kurz.
- **Wüstengrab, Sandhorn:** Eine Sandböe fegt alle in der Nähe weg und macht sie langsam.
- **Versunkene Stadt, Schleuse:** Eine Welle wirft alle im Raum um, löscht dein Feuer und heilt dich um ein Zehntel.
- **Vulkanschmiede, Lavafass:** Lava auf die fünf nächsten Gegner, nie auf dich.
- **Abgrund, Seelenlaterne:** Grelles Licht blendet alle in der Nähe (2 Sekunden betäubt, 8 Sekunden 25 % mehr Schaden), der Raum bleibt hell.
Code: `weather.js` (placeTool, useTool, drawTool), Namen in `data.js` A.WORLD_FX (tool, toolTip). Nicht im Spielstand.

## Schicksalspunkte (06.11.2026)
Jeder Welt-Boss und jeder Hauptmann gibt einen **Schicksalspunkt** («+1 Schicksalspunkt» über dem Besiegten). Ist der Raum frei, öffnet sich das Fenster «Schicksal»: du setzt den Punkt auf eine der 15 Build-Richtungen, höchstens 3 je Richtung. «Später» behält ihn; im Heldenblatt steht dann der Knopf «Schicksal +n».
- Jeder Punkt gibt einen **festen Bonus**: Feuer +10 % Schaden gegen Brennende, Eis +10 % gegen Gebremste oder Betäubte, Blitz +12 % Blitzschaden, Gift +10 % gegen Vergiftete, Schatten +3 % Volltreffer und +3 % Ausweichen, Stein +6 % Leben und +2 Rüstung, Volltreffer +5 %, Dornen +8 %, Diener +15 % Schaden der Helfer und Tiere, Heilung +2 % Lebensraub, Tempo +2, Explosionen +12 %, Zauber +8 % Zauberkraft, Gold +15 %, Wucht +8 % Angriff.
- Jeder Punkt zählt **2 Punkte** für die Richtung: Build-Name, Beute, Händler, Truhen und Schrein lehnen sich stärker daran an. Du bestimmst die Richtung, der Zufall liefert die Teile.
- Steht im Durchlauf (`run.fate`, `run.fatePts`); alte Spielstände laden ohne Punkte. Daten `data.js` A.FATE, Rechnung `build.js` (fateMods, pre, boomMul), Fenster `ui.js` fatePick.

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
  - `bosses` – Boss-Mechaniken mit Warnkreisen; `elites` – Elite-Eigenschaften (Würfeln, Verhalten, Aura, Balken oben, Warnkreise); `legends` – Wirkung der 20 Legenden (die 10 verrückten in `wild`) (Haken für Treffer, Siege, Zauber, Kampfbeginn, Zeichnen).
  - `compare` – Vergleich: Heldenwerte mit dem alten und dem neuen Stück, Urteil besser/schlechter/anders/gleich.
  - `pets` – Begleiter: Käfige, Treue, Tricks, Tierhütte, Verhalten im Kampf, Eier, Zunge, Käfig zeichnen; `wild` – die 10 verrückten Stücke (Bienen, Bananenschalen, Gartenzwerge, Seifenblasen, Kisti, Gewitterwolke, Piñata, Sparschwein, Tröte, Fliegenklatsche).
  - `achieve` – Auftragsbrett (33 Erfolge mit Zählern und Einblendung) und Chronik (letzte 20 Durchläufe, Zahlen fürs ganze Spielerleben).
  - `weather` – Eigenheiten der Welten: Steinschlag, Wolkenbruch, Treibsand und Sandsturm, Strömung, Ausbruch, Finsternis.
  - `foes` – Hauptleute (je Welt einer, Maschen, Sprüche, Belohnung) und Reaktionen normaler Gegner (Flucht, Rache, Sporen, Panzer).
  - `build` – Dein Build: Richtungen erkennen, Name, Fokus, passende Beute und Kombo-Magnet (Gewichte fürs Würfeln, Zeichen an Stücken).
  - `combos` – Kombos: Teile prüfen, bereit/erwacht/ruht, Wirkung im Kampf (Haken aus world, classes, legends, gear), Raketen, Blutkugeln, Giftpilze, Baby-Schleime und Schattenklone zeichnen.
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
