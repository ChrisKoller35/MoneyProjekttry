#!/usr/bin/env python3
"""Erzeugt Pino-Bilder über die Replicate-API (Flux).

Nutzung:
  REPLICATE_API_TOKEN=... python3 erzeuge_bilder.py test        # 5 Testbilder
  REPLICATE_API_TOKEN=... python3 erzeuge_bilder.py 1            # Bilder für Geschichte 1
  REPLICATE_API_TOKEN=... python3 erzeuge_bilder.py 1 --ref referenz.png   # mit Referenzbild (Flux Kontext)

Ohne Token macht das Skript nichts ausser die Prompts anzuzeigen (--dry-run ist dann automatisch).
Kosten: Flux Schnell ca. 0.003 USD pro Bild, Flux Kontext Pro ca. 0.04 USD pro Bild (Stand beim Einrichten prüfen).
Keine Fremdbibliotheken nötig, nur urllib.
"""
import json, os, sys, time, urllib.request, pathlib

PINO = ("Pino, a small chubby baby penguin with a big round head, black back and white belly, "
        "a white heart-shaped patch on his chest, big round dark eyes with a white highlight, "
        "small rounded orange beak, orange oversized feet, pink cheek spots, wearing a slightly "
        "tilted red knitted beanie with a white pompom.")
STIL = ("Children's picture book illustration, soft rounded shapes, thick clean outlines, "
        "flat colors, minimal shading, warm and cozy, no text.")

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

MODELL_OHNE_REF = "black-forest-labs/flux-schnell"
MODELL_MIT_REF = "black-forest-labs/flux-kontext-pro"


def api(pfad, daten=None, token=None):
    req = urllib.request.Request("https://api.replicate.com/v1/" + pfad,
                                 data=json.dumps(daten).encode() if daten else None,
                                 headers={"Authorization": "Bearer " + token,
                                          "Content-Type": "application/json",
                                          "Prefer": "wait"})
    with urllib.request.urlopen(req, timeout=120) as r:
        return json.load(r)


def erzeuge(prompt, token, ref_url=None):
    if ref_url:
        body = {"input": {"prompt": prompt, "input_image": ref_url, "aspect_ratio": "16:9", "output_format": "png"}}
        modell = MODELL_MIT_REF
    else:
        body = {"input": {"prompt": prompt, "aspect_ratio": "16:9", "output_format": "png", "num_outputs": 1}}
        modell = MODELL_OHNE_REF
    pred = api(f"models/{modell}/predictions", body, token)
    while pred["status"] not in ("succeeded", "failed", "canceled"):
        time.sleep(2)
        pred = api(f"predictions/{pred['id']}", token=token)
    if pred["status"] != "succeeded":
        raise RuntimeError(pred.get("error") or pred["status"])
    out = pred["output"]
    return out[0] if isinstance(out, list) else out


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    satz = args[0] if args else "test"
    ref = None
    if "--ref" in sys.argv:
        ref = sys.argv[sys.argv.index("--ref") + 1]
    token = os.environ.get("REPLICATE_API_TOKEN")
    dry = "--dry-run" in sys.argv or not token
    ziel = pathlib.Path(__file__).parent / ("testbilder" if satz == "test" else f"geschichte-{satz}")
    ziel.mkdir(exist_ok=True)
    for i, szene in enumerate(SZENEN[satz], 1):
        prompt = f"{PINO} {szene} {STIL}"
        print(f"[{satz}.{i}] {prompt}")
        if dry:
            continue
        url = erzeuge(prompt, token, ref)
        datei = ziel / f"{satz}-{i}.png"
        urllib.request.urlretrieve(url, datei)
        print("   ->", datei)
    if dry:
        print("\nKein REPLICATE_API_TOKEN gesetzt oder --dry-run: nur Prompts angezeigt.")


if __name__ == "__main__":
    main()
