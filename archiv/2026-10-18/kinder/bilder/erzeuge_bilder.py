#!/usr/bin/env python3
"""Erzeugt Pino-Bilder über die Google-Gemini-API (Bildmodell).

Nutzung:
  GOOGLE_API_KEY=... python3 erzeuge_bilder.py test                 # 5 Testbilder
  GOOGLE_API_KEY=... python3 erzeuge_bilder.py 1                    # Bilder für Geschichte 1
  GOOGLE_API_KEY=... python3 erzeuge_bilder.py 1 --ref testbilder/test-1.png   # mit Referenzbild für konsistente Figur
  python3 erzeuge_bilder.py test --dry-run                          # nur Prompts anzeigen

Ohne GOOGLE_API_KEY zeigt das Skript nur die Prompts (automatisch --dry-run).
Modell: Standard ist das Gemini-Bildmodell (Text und Bild rein, Bild raus); mit --modell lässt es sich ändern,
falls Google den Namen geändert hat. Preise und Modellnamen beim ersten Lauf unter ai.google.dev prüfen.
Keine Fremdbibliotheken nötig, nur urllib.
"""
import base64, json, mimetypes, os, pathlib, sys, time, urllib.request

PINO = ("Pino, a small chubby baby penguin with a big round head, black back and white belly, "
        "a white heart-shaped patch on his chest, big round dark eyes with a white highlight, "
        "small rounded orange beak, orange oversized feet, pink cheek spots, wearing a slightly "
        "tilted bright red knitted beanie with a white pompom.")
STIL = ("Children's picture book illustration, soft rounded shapes, thick clean outlines, "
        "flat colors, minimal shading, warm and cozy, 16:9 landscape, no text, no watermark, "
        "not realistic, not 3D.")
REF_HINWEIS = ("Use the attached image as the exact character reference: same penguin, same beanie, "
               "same proportions, same drawing style. Only the scene changes.")

SZENEN = {
    "test": [
        "standing on flat sea ice, front view, neutral pose, soft blue sky, full body visible.",
        "sitting at the edge of the ice looking at the water, side view, evening light.",
        "walking through falling snow, hugging himself and shivering, wind lines, cheeks extra pink.",
        "sleeping curled up between two large adult penguins, only their bellies visible, warm orange glow, lighthouse light in the background.",
        "jumping with both feet off the ice, happy, wings spread, pompom flying up.",
    ],
    "1": [
        "standing alone at the edge of a large group of adult penguins, lighthouse blinking red in the background, blue dusk.",
        "sitting at the ice edge, a silver fish head poking out of dark water, moon reflection on the water.",
        "sleeping in the middle of a huddle of adult penguins, a mother penguin wing resting on his beanie, warm orange light.",
    ],
    "2": [
        "on a flat rock, his red beanie flying through the air above him, head bare, strong wind lines, worried face.",
        "swimming in dark water toward a big blue iceberg with caves, a silver fish beside him, a white seagull flying above.",
        "sleeping against a large grey old seal on a rock, seal flipper over his head, the red beanie drying on the seal's belly.",
    ],
    "3": [
        "standing alone in front of a tall red and white striped lighthouse at night, looking up, red light on the snow.",
        "sitting at the ice edge at night, a silver fish head in the water, a beam of light stretching over the waves into the dark.",
        "sleeping inside a huddle of penguins, seen through a gap between two bellies, the lighthouse visible beyond.",
    ],
    "4": [
        "standing at the edge of a sad group of adult penguins by the water, everyone looking down, grey midday light.",
        "standing in the middle of a circle of penguins, a white seagull landing, everyone laughing.",
        "sleeping in a huddle, a father penguin above him, a bright warm streak on the horizon.",
    ],
    "5": [
        "sitting at the base of a lighthouse, a small white seagull sitting at the very top, evening light.",
        "sitting next to a white seagull at the lighthouse wall, a silver fish head in the water, lighthouse light on.",
        "sleeping in a huddle, a white seagull perched on an adult penguin's back right beside him.",
    ],
}

STANDARD_MODELL = "gemini-3.1-flash-image"
BASIS = "https://generativelanguage.googleapis.com/v1beta/models/"


def erzeuge(prompt, key, modell, ref_pfad=None):
    teile = [{"text": prompt}]
    if ref_pfad:
        mime = mimetypes.guess_type(ref_pfad)[0] or "image/png"
        daten = base64.b64encode(pathlib.Path(ref_pfad).read_bytes()).decode()
        teile = [{"text": REF_HINWEIS + " " + prompt}, {"inline_data": {"mime_type": mime, "data": daten}}]
    body = {"contents": [{"parts": teile}],
            "generationConfig": {"responseModalities": ["IMAGE"]}}
    req = urllib.request.Request(f"{BASIS}{modell}:generateContent",
                                 data=json.dumps(body).encode(),
                                 headers={"x-goog-api-key": key, "Content-Type": "application/json"})
    for versuch in range(3):
        try:
            with urllib.request.urlopen(req, timeout=180) as r:
                antwort = json.load(r)
            break
        except urllib.error.HTTPError as e:
            fehler = e.read().decode(errors="replace")
            if e.code in (429, 500, 503) and versuch < 2:
                time.sleep(10 * (versuch + 1))
                continue
            raise RuntimeError(f"HTTP {e.code}: {fehler[:500]}")
    for teil in antwort["candidates"][0]["content"]["parts"]:
        if "inlineData" in teil:
            return base64.b64decode(teil["inlineData"]["data"]), teil["inlineData"].get("mimeType", "image/png")
    raise RuntimeError("Antwort enthielt kein Bild: " + json.dumps(antwort)[:500])


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    satz = args[0] if args else "test"
    ref = sys.argv[sys.argv.index("--ref") + 1] if "--ref" in sys.argv else None
    modell = sys.argv[sys.argv.index("--modell") + 1] if "--modell" in sys.argv else STANDARD_MODELL
    key = os.environ.get("GOOGLE_API_KEY")
    dry = "--dry-run" in sys.argv or not key
    ziel = pathlib.Path(__file__).parent / ("testbilder" if satz == "test" else f"geschichte-{satz}")
    ziel.mkdir(exist_ok=True)
    for i, szene in enumerate(SZENEN[satz], 1):
        prompt = f"{PINO} {szene} {STIL}"
        print(f"[{satz}.{i}] {prompt}")
        if dry:
            continue
        bild, mime = erzeuge(prompt, key, modell, ref)
        endung = ".jpg" if "jpeg" in mime else ".png"
        datei = ziel / f"{satz}-{i}{endung}"
        datei.write_bytes(bild)
        print("   ->", datei)
    if dry:
        print("\nKein GOOGLE_API_KEY gesetzt oder --dry-run: nur Prompts angezeigt.")


if __name__ == "__main__":
    main()
