# LaunchLab — Demonstration Guide

## Before you start (1 minute)
1. Open `index.html` (or the GitHub Pages link) in Chrome.
2. Click **Reset session** in the footer, then OK, so you start fresh.
3. Check that your roll number shows in the header (`script.js` line 30).
4. For a phone view: press F12 → the device toolbar icon → pick a phone.

---

## 3–5 minute live demo script

| Time | Do | Say |
|---|---|---|
| 0:00 | Show the Welcome screen | "LaunchLab is an inquiry lab for a Class 11 learner who failed projectile motion once and is anxious. Note the roll number, the 10-minute timer and the progress bar on every screen." |
| 0:20 | Press **Start Experiment** | "The 10-minute session timer starts now. It doesn't restart between screens." |
| 0:30 | Choose *increases* and **increases** (Scenario B: misconception) → Submit | "The learner commits to predictions first. Prediction 2 shows the 'bigger angle always goes further' misconception." |
| 0:50 | Tap the 30°, 45° and 70° chips, pressing **Launch** each time | "A real canvas simulation from x = u cosθ·t, y = u sinθ·t − ½gt². It shows R, H and T." |
| 1:40 | **Compare with my predictions** | "No 'Wrong'. It acknowledges the attempt, shows the evidence, and asks the learner to revise." |
| 2:00 | **Get a Hint** → open "See the tutor prompt" | "The hint uses their angle, speed, range, prediction and misconception. It's a clearly labelled rule-based demo, so no API key sits in the browser." |
| 2:20 | Revise to *increases / decreases* → Submit | "The explanation comes only after the learner engaged with the evidence. M1 is now marked as resolved." |
| 2:40 | Launch 60°, answer correctly; launch 45°/10, answer both | "Activity 2: complementary angles. Activity 3: doubling speed gives 4 times the range, and angle and speed act differently (M2)." |
| 3:10 | Press **⏸** in the header, then refresh the page | "Pause stops the clock. After a refresh: 'Welcome back', same screen, same data." Then press **Resume**. |
| 3:30 | Observation table → write two notes → Concept → Quiz (answer 2–3, show a hint on one) | "Comparison table with the best row starred. The concept cards use the learner's own numbers. The quiz mixes multiple-choice and number answers." |
| 4:20 | Results screen | "Activities, scores, experiments, initial vs revised predictions, misconceptions with an evidence trail, time taken, then the reflection question." |

Tip: to show the time-up message quickly, open the browser console (F12) and run `state.secondsLeft = 3`.

---

## Scenario A: successful learner

1. Reset session → **Start Experiment**.
2. Prediction 1: **The range increases**. Prediction 2: **The range decreases**. Submit.
3. Activity 1: launch the 30°, 45° and 70° chips → **Compare with my predictions** → "🌟 Both predictions matched your evidence!"
4. Activity 2: launch 60° → choose "45° went furthest, and 30° and 60°…" → Check.
5. Activity 3: launch 45°/10 m/s → "about 4 times bigger" → "Speed has a much stronger effect…" → Check each.
6. Go to observations → write both notes → Next.
7. Concept → Next.
8. Quiz answers: Q1 **45°**, Q2 **65°**, Q3 **35.35**, Q4 **32**, Q5 **It decreases**, Q6 **Doubling the speed makes the range 4 times bigger…**
9. Results: 4/4 activities, 6/6 quiz, 4/4 lab questions, both misconceptions "Not seen". Write a reflection → Submit.

**Screenshots to capture:** prediction screen; the lab with 3 trajectories and Compare on; the Activity 1 "matched" feedback; the comparison table; the quiz with correct feedback; the Results screen.

## Scenario B: learner with misconception (M1)

1. Reset session → Start.
2. Prediction 1: **increases**. Prediction 2: **increases** (the bigger-angle misconception). Submit.
3. Launch 30°, 45°, 70°. The 70° launch lands at **26.24 m**, shorter than 45° (**40.82 m**).
4. **Compare with my predictions** → supportive message, the evidence, "Did the range keep growing…?", plus the revision box.
5. **Get a Hint** → "…Did the steeper launch really go further, or just higher?" (labelled rule-based).
6. Revise wrongly once (e.g. 45°→70°: stays the same) → "You're getting closer… compare the 45° chip with the 70° chip".
7. Revise correctly (**increases / decreases**) → praise plus the *Why?* explanation.
8. Activity 2: launch 60°, choose "**60° went furthest because it went highest**" → hint. Choose it again → the second hint suggests a Compare experiment. Turn **Compare: on**, then pick the correct answer.
9. Finish Activity 3, the notes, the concept screen and the quiz (optionally answer Q5 "increases" first to show the M1 feedback again).
10. Results: initial vs revised predictions, M1 "**Revised with evidence ✓**" with its evidence trail.

**Screenshots to capture:** the initial predictions; the 70° result; the supportive feedback and revision box; the hint with the prompt opened; the revised-prediction explanation; the Activity 2 hint; the Results misconception panel.

---

## Final requirement checklist

| Requirement | Status |
|---|---|
| 7 connected screens, working Back/Next, no-skip checks | ✅ |
| Canvas simulation with correct physics (R, H, T, angle, speed, ground, trajectory) | ✅ |
| Launch / Pause / Reset / Compare | ✅ |
| Predictions saved and compared with results | ✅ |
| Activities 1–4 (angle, complementary angles, speed, reflection) | ✅ |
| Comparison table and "What pattern do you observe?" | ✅ |
| Concept explanation (5 points, equations, chart) | ✅ |
| M1 and M2 detection, supportive step-by-step feedback, revision | ✅ |
| Get a Hint with data-driven prompt, rule-based fallback, honest label, no keys | ✅ |
| Quiz: 6 questions, 2 formats, hints, retry, model answers | ✅ |
| Results: activities, correct answers, experiments, predictions, misconceptions, progress, time | ✅ |
| Reflection question saved | ✅ |
| 10-minute timer, pause/resume, LocalStorage save/restore, time-up message | ✅ |
| Identity token on every screen | ✅ 23B4221 |
| Responsive on desktop and mobile | ✅ |
| D1–D8 documentation | ✅ `docs/DELIVERABLES.md` |
| AI-use log and reflection | ⚠️ Fill in your personal reflection in `docs/AI_USE_LOG.md` |
| Real roll number | ✅ 23B4221 |
| Screenshots for D5 | ⚠️ Capture them using the lists above |
| Live AI model | ➖ Not implemented on purpose (key safety); a rule-based demo, clearly labelled |
