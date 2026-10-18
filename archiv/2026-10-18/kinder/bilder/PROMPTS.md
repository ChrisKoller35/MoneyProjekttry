# Bild-Prompts für die Testbilder und Geschichten 1 bis 5

Stand: 16.10.2026. Alle Prompts beginnen mit dem festen Pino-Baustein aus PINO-FIGURENBLATT.md (unten «PINO»). Bildwerkzeug: Google Gemini-Bildmodell über Christophs Google-API-Key (Variable GOOGLE_API_KEY in der Projekt-Cloud-Umgebung, Domain generativelanguage.googleapis.com). Modell: gemini-3.1-flash-image (Skript-Option `--modell`). Für Konsistenz: Jedes Bild mit dem festen Referenzbild `pino-referenz.png` erzeugen (`--ref pino-referenz.png`). Seit 16.10.2026 ist dieses Bild Pinos fester Look (Manager-Entscheidung). Skript: erzeuge_bilder.py.

PINO = `Pino, a small chubby baby penguin with a big round head, black back and pure white belly, a white heart-shaped patch on his chest, big round dark eyes with a white highlight, small rounded orange beak, orange oversized feet, pink cheek spots, wearing a slightly tilted bright red knitted beanie with a white pompom.`
STIL = `Children's picture book illustration, soft rounded shapes, thick clean outlines, flat colors, minimal shading, warm and cozy, no text.`
NEGATIV = `realistic, photo, 3D render, text, watermark, extra limbs, scary, dark horror`
ANDERE = `Only Pino has pink cheeks, a heart patch and a beanie; adult penguins are plain with no pink cheeks and no heart patch. No dark blobs or shapes in the foreground.` (immer anhängen, sobald andere Pinguine im Bild sind)
LEUCHTTURM = `a tall lighthouse with clear red and white stripes` (statt nur «lighthouse»)

## Testbilder (Meilenstein 2.2, 5 Stück)

1. **Referenz:** PINO + `standing on flat sea ice, front view, neutral pose, soft blue sky, full body visible.` + STIL
2. PINO + `sitting at the edge of the ice looking at the water, side view, evening light.` + STIL
3. PINO + `walking through falling snow, hugging himself and shivering, wind lines, cheeks extra pink.` + STIL
4. PINO + `sleeping curled up between two large adult penguins, only their bellies visible, warm orange glow, lighthouse light in the background.` + STIL
5. PINO + `jumping with both feet off the ice, happy, wings spread, pompom flying up.` + STIL

Prüfung: Mütze rot mit weissem Bommel auf allen 5? Herzfleck auf allen 5? Gleiche Kopfform? Wenn 4 von 5 passen, ist der Stil fest.

## Geschichte 1: Pino und die wandernde Wärme

- 1.1 PINO + `standing alone at the edge of a large group of adult penguins, a tall lighthouse with clear red and white stripes in the background, its light blinking red, blue dusk.` + ANDERE + STIL
- 1.2 PINO + `sitting at the ice edge, a silver fish head poking out of dark water, moon reflection on the water.` + STIL
- 1.2b PINO + `lying with his belly on a flat stone in the water, a large old grey seal grandmother resting beside him with one eye open, evening light.` + STIL
- 1.3 PINO + `sleeping in the middle of a huddle of adult penguins, a mother penguin wing resting on his beanie, warm orange light, clean simple composition.` + ANDERE + STIL

## Geschichte 2: Pino und die verlorene Mütze

- 2.1 PINO (ohne Mütze: `his red beanie flying through the air above him, head bare`) + `on a flat rock, strong wind lines, worried face.` + STIL
- 2.2 PINO + `swimming in dark water toward a big blue iceberg with caves, a silver fish beside him, a white seagull flying above.` + STIL
- 2.3 PINO + `sleeping against a large grey old seal on a rock, seal flipper over his head, the red beanie drying on the seal's belly.` + STIL

## Geschichte 3: Pino und das Licht, das nicht schlief

- 3.1 PINO + `standing alone in front of a tall red and white striped lighthouse at night, looking up, red light on the snow.` + STIL
- 3.2 PINO + `sitting at the ice edge at night, a silver fish head in the water, a beam of light stretching over the waves into the dark.` + STIL
- 3.3 PINO + `sleeping inside a huddle of penguins, seen through a gap between two bellies, the lighthouse visible beyond.` + STIL

## Geschichte 4: Pino und der Tag ohne Fisch

- 4.1 PINO + `standing at the edge of a sad group of adult penguins by the water, everyone looking down, grey midday light.` + STIL
- 4.2 PINO + `standing in the middle of a circle of penguins, a white seagull landing, everyone laughing.` + STIL
- 4.3 PINO + `sleeping in a huddle, a father penguin above him, a bright warm streak on the horizon.` + STIL

## Geschichte 5: Pino und Kikis Geheimnis

- 5.1 PINO + `sitting at the base of a lighthouse, a small white seagull sitting at the very top, evening light.` + STIL
- 5.2 PINO + `sitting next to a white seagull at the lighthouse wall, a silver fish head in the water, lighthouse light on.` + STIL
- 5.3 PINO + `sleeping in a huddle, a white seagull perched on an adult penguin's back right beside him.` + STIL

## Malbuch-Test (später)

PINO + `standing and waving` + `black and white line art, thick clean outlines, no shading, no colors, white background, coloring book page for kids, no text.`
