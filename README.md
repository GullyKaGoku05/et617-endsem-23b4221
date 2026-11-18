# LaunchLab – Explore Projectile Motion

An inquiry-based virtual laboratory for Class 11 projectile motion (angle, speed and horizontal range), designed for a learner repeating the topic with high anxiety and low confidence. One complete session fits in **10 minutes** and can be paused and resumed.

**ET617 practical · Identity token:** `23B4221`

🔗 **Live app:** https://gullykagoku05.github.io/et617-endsem-23b4221/

---

## How to run

Option 1: double-click `index.html`. It opens in any modern browser and needs no internet or installation.

Option 2: VS Code → right-click `index.html` → **Open with Live Server**.

**Before a demo:** click **Reset session** in the footer to start from a clean state.

## How to set your roll number

Open `script.js`, line 30:

```js
IDENTITY_TOKEN: "23B4221",
```

Replace the text inside the quotes. It updates the header, footer and pause screens. Also update this README and `docs/DELIVERABLES.md`.

## Features

| Area | What it does |
|---|---|
| 7 connected screens | Welcome → Prediction → Lab → Observation → Concept → Knowledge Check → Results |
| Simulator | HTML Canvas animation of x = u cosθ·t, y = u sinθ·t − ½gt²; shows R, H, T, the angle, the speed; Launch / Pause / Reset / Compare |
| Inquiry activities | Predict → test 30°/45°/70° → compare 30°/45°/60° → change speed 10 vs 20 m/s → reflect |
| Misconception detection | M1 "bigger angle always goes further", M2 "angle and speed have the same effect", with step-by-step hints and revision of predictions |
| Hint feature | "Get a Hint" builds the tutor prompt from the learner's data; **rule-based demo** (no live AI unless a backend is configured) |
| Assessment | 6 questions (4 multiple-choice, 2 numerical) with hints, retries and model answers |
| C4: 10-minute session | Countdown timer, pause/resume, auto-save to LocalStorage, restore after refresh, time-up message |
| Results | Activities, scores, experiments, initial vs revised predictions, misconceptions, time taken, reflection |

## Files

```
index.html   all 7 screens + pause / time-up overlays
style.css    design, layout, mobile responsiveness
script.js    physics, simulator, activities, feedback, hints, quiz, timer, saving
docs/        D1–D8 deliverables, demo guide, AI-use log
```

## Deploy on GitHub Pages

```bash
git add .
git commit -m "LaunchLab complete"
git push
```

Then go to the repository on GitHub, open **Settings → Pages**, set Source to *Deploy from branch*, choose `main` and `/ (root)`, and click Save. After 1–2 minutes the link above works.

## Physics model

Ideal projectile motion: no air resistance, g = 9.8 m/s², same launch and landing height.
T = 2u sinθ / g · R = u² sin2θ / g · H = u² sin²θ / 2g
