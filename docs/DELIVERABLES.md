# LaunchLab — Examination Deliverables D1–D8

| Field | Selection |
|---|---|
| Problem / pedagogy | **P5 — Inquiry-based virtual laboratory** |
| Topic | Projectile motion: angle and speed range (Class 11) |
| Learner | **L5 — Repeating the topic after failing once; high anxiety, low self-efficacy** |
| Constraint | **C4 — 10-minute sessions with pause and resume** |
| Identity token | **23B4221** |
| App | LaunchLab — Explore Projectile Motion (`index.html`, `style.css`, `script.js`) |

---

## D1 — Educational Problem

**Problem.** A learner who has failed projectile motion often memorises R = u² sin2θ / g without understanding how the angle and the speed each change the range. Two typical wrong ideas persist: "a steeper launch always goes further" and "angle and speed do the same thing". Reading a solved example and then answering numerical questions raises anxiety but does not let the learner *test* those ideas.

**Context.** Self-study on a phone or laptop, in one 10-minute session, which may be interrupted. LaunchLab gives a safe, repeatable experiment with small steps, visible progress and supportive feedback.

**Three measurable learning outcomes.** By the end of one session the learner will be able to:
1. **Predict** the direction of change in range when the angle changes (30°→45°, 45°→70°) at fixed speed. *Measured by:* the predictions, any revised predictions, and Quiz Q5.
2. **Compare** the ranges of 30°, 45° and 60° at the same speed and identify 45° as the maximum and 30°/60° as equal. *Measured by:* the Activity 2 question and Quiz Q1–Q2.
3. **Explain and apply** that range depends on u² (doubling speed gives ×4 range), and calculate a range with the formula. *Measured by:* the Activity 3 questions and Quiz Q3, Q4, Q6.

---

## D2 — Learner Persona

| | |
|---|---|
| **Name / age** | Aarav, 16, Class 11 (repeating the topic) |
| **Prior knowledge** | Knows that gravity acts downward and can split a velocity into components; has seen the range formula but cannot use it with confidence |
| **Misconception 1 (M1)** | "A larger launch angle always produces a larger horizontal range." |
| **Misconception 2 (M2)** | "Increasing the launch angle and increasing the initial speed have the same effect on range." |
| **Device** | Android smartphone (the app is fully responsive) |
| **Available time** | One focused 10-minute session, sometimes interrupted |
| **Language** | Simple English, short sentences |
| **Motivation** | Wants to pass the exam and feel confident again after a previous failure |
| **Support needs** | Low-pressure feedback, hints before answers, visible progress, the ability to retry and to pause |

---

## D3 — Learning Activity

### Learning sequence (inquiry cycle)

| # | Screen | Inquiry phase | Learner does | Time |
|---|---|---|---|---|
| 1 | Welcome | Question | Reads the goal and objectives, presses Start (the timer starts) | 0.5 min |
| 2 | Prediction | Prediction | Predicts 30°→45° and 45°→70° | 1 min |
| 3 | Lab: Activity 1 | Experiment | Launches 30°, 45°, 70° at 20 m/s; compares with the predictions; revises them if needed | 2 min |
| 3 | Lab: Activities 2–3 | Experiment + analysis | Compares 30/45/60°; compares 10 vs 20 m/s at 45° | 2 min |
| 4 | Observation | Observation + analysis | Comparison table; writes the pattern and what differed from the prediction (Activity 4) | (incl. above) |
| 5 | Concept | Explanation | 5 short cards linked to their own data, plus a bar chart | 1 min |
| 6 | Knowledge check | Assessment | 6 questions | 2 min |
| 7 | Results | Reflection | Summary and "one thing I understand now" | 1.5 min |

### Explanation (concept screen)
1. The angle splits the speed into a sideways part (u cosθ) and an upward part (u sinθ). A bigger angle gives more time in the air but less sideways speed.
2. sin(2θ) is at most 1, which happens at 2θ = 90°, so **45° gives the maximum range**.
3. 30° + 60° = 90° (complementary angles), and sin60° = sin120°, so **the ranges are equal**.
4. R ∝ u², so **doubling the speed gives 4 times the range**. More speed always helps; more angle helps only up to 45°.
5. Maximum height keeps rising up to 90°, but range does not. Height and range are different things.

### Tasks, model answers and feedback (13 tasks, 3 formats)

Formats: **multiple choice**, **numerical input**, **short written response**.

| Task | Format | Model answer | Feedback when correct | Feedback for a misconception or wrong answer |
|---|---|---|---|---|
| Prediction 1 (30°→45°) | MCQ | Increases | Checked against the evidence in Activity 1: "Both predictions matched your evidence!" | "Good attempt. Testing a prediction is exactly what scientists do! Your evidence: … Look carefully at what changed and what stayed constant." The learner is then asked to revise. |
| Prediction 2 (45°→70°) | MCQ | Decreases | as above | **M1**: answering "increases" is tagged M1, and the same revision flow follows |
| Activity 1 revision | MCQ ×2 | Increases / Decreases | "Well done for changing your mind based on evidence…" plus a *why* explanation | "You're getting closer. Compare the 45° chip with the 70° chip…" |
| Activity 2 pattern | MCQ | 45° furthest; 30° ≈ 60° | Explanation of complementary angles | **M1** ("60° went furthest because highest"): "60° really does go the highest! Is the highest path also the longest one?" Second try: "Switch Compare on and look where the paths land…" |
| Activity 3 speed | MCQ | About 4 times | "Range depends on u²…" | "Many people expect that! Look at the two R values…" then "Divide the 20 m/s range by the 10 m/s range" |
| Activity 3 angle vs speed | MCQ | Speed is stronger; angle helps only up to 45° | Explanation | **M2**: "Look at the sizes of the two changes… Are they similar?" then "Does increasing speed ever make the range smaller?" |
| Activity 4 pattern | Short text | e.g. "45° goes furthest; 30° and 60° are equal" | "Noticing the difference… is exactly how scientists learn." | A short sentence is required (supportive prompt) |
| Activity 4 difference | Short text | Learner's own comparison | as above | as above |
| Q1 max angle | MCQ | 45° | "Correct! Well reasoned." | **M1** (60°/90°): "60° goes higher, but does it go further?" Hint: ⭐ row |
| Q2 equal range to 25° | MCQ | 65° | | "Doubling the angle is a common idea. Think about 30° and 60°…" |
| Q3 R for 20 m/s, 30° | Numerical | 35.35 m (±0.5) | | Hint: "R = u² sin2θ / g; sin 60° ≈ 0.866" |
| Q4 8 m at 10 m/s → 20 m/s | Numerical | 32 m (±0.5) | | **M2** (answer 16): "You saw the range grows. But is it exactly double?" Hint: u² |
| Q5 45°→75° | MCQ | Decreases | | **M1** (increases): "Remember your 70° launch in Activity 1…" |
| Q6 statement | MCQ | Speed ×2 → R ×4; 30°→60° same range | | **M2** (both double): "Did speed and angle change the range in the same way?" |
| Reflection | Short text | Learner's own | "Thank you for reflecting! … You should be proud of this session." | A short sentence is required |

After two tries, every quiz question offers **Show model answer**.

---

## D4 — Working Application

| Requirement | Implementation |
|---|---|
| ≥ 5 connected screens | 7 screens plus 2 overlay states (Pause, Time up); `showScreen()` switches them with no page reload |
| Learner inputs | Radio predictions, sliders and number boxes, launch chips, MCQ, numeric inputs, text areas, Pause/Resume |
| Outputs | Animated trajectory, R/H/T readout, experiment chips, comparison table (best row ⭐), feedback boxes, hints, concept bar chart, results dashboard |
| Functional transitions | Back/Next on every screen; forward navigation is blocked until each screen's key activity is done (supportive message) |
| Visible C4 | Countdown in the header on every screen; ⏸ pause; amber warning in the last 2 minutes; "Your 10-minute session is complete" message; time taken on Results; auto-save and "Welcome back" resume |
| Identity token | Header (every screen), footer, Pause overlay, Time-up overlay. Set in `script.js` → `CONFIG.IDENTITY_TOKEN` |

**Physics verification** (g = 9.8): 30°/20 m/s → 35.35 m; 45°/20 → 40.82 m; 60°/20 → 35.35 m; 70°/20 → 26.24 m; 45°/10 → 10.20 m; 90° → 0 m. Each was checked against a hand calculation, and the animated landing point x(T) equals R.

---

## D5 — Learner Scenarios

See `docs/DEMO_GUIDE.md` for click-by-click steps and the screenshot list.

**Scenario A: successful learner.** Predicts *increase* and *decrease* → runs 30/45/70° → "Both predictions matched" → picks the correct pattern in Activity 2 and "4 times" and "speed is stronger" in Activity 3 → writes notes → answers all 6 quiz questions correctly → Results: 4/4 activities, 6/6 quiz, 4/4 lab, no misconceptions.

**Scenario B: learner with misconception M1.** Predicts 45°→70° *increases* → the 70° launch lands at 26.24 m (shorter than 40.82 m) → the app acknowledges, shows the evidence and gives a hint (no answer) → *Get a Hint* gives an M1-specific hint → the learner revises the predictions → explanation shown, M1 marked *revised with evidence* → in Activity 2 picks "60° went furthest" → hint → second hint suggesting the Compare experiment → correct → Results list M1 with the evidence trail and initial vs revised predictions.

---

## D6 — AI Feature Specification

**What it does.** The **Get a Hint** button in the Lab gives one short, encouraging hint that points the learner to the evidence without revealing the answer.

**Inputs.** Current angle, speed and observed range (latest launch); both predictions; current activity; the misconception currently detected (M1/M2/none).

**Actual prompt** (built by `buildHintPrompt()` in `script.js`; the learner can view it under "See the tutor prompt"):

```
You are a supportive Class 11 Physics tutor. The learner is anxious and has previously struggled with projectile motion.
Their current launch angle is [ANGLE]°.
Their initial velocity is [SPEED] m/s.
Their observed range is [RANGE].
Their prediction was: [PREDICTION].
Current activity: [ACTIVITY].
Identified misconception: [MISCONCEPTION].
Give one short guiding hint that encourages the learner to inspect the experimental evidence.
Do not reveal the final answer immediately.
Use simple English, supportive language and encourage further experimentation.
```

**Model/API call.** *Honest statement:* the submitted version does **not** call a live AI model. Calling one from the browser would expose a secret API key. `CONFIG.AI_ENDPOINT` is empty, so the **rule-based engine** (`ruleBasedHint()`) produces the hint, and the app labels it on screen: *"Rule-based hint (demonstration). No live AI model was called."* If a teacher sets `AI_ENDPOINT` to their own backend (which holds the key and calls the model), the app POSTs `{ prompt }` and expects `{ hint }`.

**Expected output example.** For 70°, 20 m/s, 26.24 m, prediction "increases", M1: *"At 70° and 20 m/s you got 26.24 m. Look at the R values for 45° and for a steeper angle like 60° or 70°. Did the steeper launch really go further, or just higher?"*

**Safety and correctness checks** (`isSafeHint()`):
- Hints of 10–300 characters only.
- Rejected if they give away a key answer ("45° gives the maximum…", "4 times").
- The AI never calculates or changes physics results, scores or saved data; all of those are deterministic code.
- On an empty, malformed, unsafe or failed response, the app falls back to the rule-based hint.

**Fallback.** The rule-based engine covers: no launch yet, a missing launch for the current activity, M1, M2, each activity's question, and all activities complete.

---

## D7 — Pedagogical Rationale

**Why inquiry-based learning.** The learner's problem is wrong *beliefs*, not missing formulas. Inquiry (predict → test → observe → compare → explain → reflect) makes the learner commit to a belief and then meet evidence that confirms or challenges it. That conflict is what changes a misconception. The formula is shown *after* the learner has discovered the patterns.

**Addressing anxiety.**
- Predictions are explicitly "just guesses" and are never scored.
- No feedback says "Wrong" or "You failed". Every message starts by acknowledging the attempt.
- One small action per screen, a visible progress bar and step dots, and launch chips that set up experiments in one tap all reduce cognitive load.
- The learner can pause at any time, and on return sees "Welcome back! 👋".
- Retries are always allowed; a model answer is available after two tries, so no learner gets stuck.
- The final message praises the process (predicting, testing, revising), not just the score.

**Unsuccessful experiments as evidence.** When a prediction fails, the app (1) acknowledges the attempt, (2) shows the measured numbers, (3) asks the learner to inspect what changed and what stayed constant, (4) gives a small hint, then a stronger one with a suggested experiment, (5) lets them revise, and (6) explains only after they have engaged with the evidence. The failed 70° launch becomes the most useful data point of the session.

**Meeting the learner's needs.** Works on a phone; simple English; the concept cards quote the learner's own measured ranges; the results show the misconceptions as "ideas you worked on", with a "revised with evidence" tag.

**How C4 is implemented.** A 10-minute countdown starts at Start and is visible in the header on every screen. The time plan is shown on the welcome screen. Each activity is sized to its slot, and launch chips speed up setup. ⏸ stops the clock and the animation. State (screen, remaining time, experiments, answers, notes) is saved to LocalStorage every second and after every action, and restored after refresh or reopening. At 0:00 a supportive "session complete" message offers to finish or jump to the results. Time taken is reported at the end.

---

## D8 — Evaluation Plan

| Outcome | Evidence collected by the app | Success criterion |
|---|---|---|
| LO1 Predict | Initial and revised predictions; Q5 | Revised (or initial) predictions match the evidence; Q5 correct |
| LO2 Compare | 30/45/60° launches; Activity 2 answer; Q1, Q2 | Identifies 45° as the maximum and 30°≈60° (in the activity or the quiz) |
| LO3 Explain/apply | Activity 3 answers; Q3, Q4, Q6; written notes | ≥ 2 of Q3, Q4, Q6 correct; the note mentions 45° or complementary angles or u² |

**Rubric (per learner session)**

| Criterion | 3 – Secure | 2 – Developing | 1 – Beginning |
|---|---|---|---|
| Prediction & revision | Correct first time, or revised correctly after the evidence | Revised after hints | Did not revise |
| Experimentation | All required launches plus extra exploration | All required launches | Missing launches |
| Misconceptions | None, or all resolved | One unresolved | Both unresolved |
| Quiz | 5–6 correct | 3–4 correct | 0–2 correct |
| Reflection | Names a specific concept (45°, complementary angles, u²) | General statement | Missing |
| Time (C4) | ≤ 10 min | 10–12 min | > 12 min |

**Data / logs** (in LocalStorage key `launchlab-session-v1`): predictions and revisions; every experiment (angle, speed, R, H, T); answers and attempts per question; first-try correctness; misconception tags with evidence and resolved status; hints used; notes and reflection; elapsed time, time left, whether time ran out; screens reached.

**Success criteria (overall).** The session is completed in ≤ 10 minutes; all 4 activities are done; any detected misconception is marked *revised with evidence*; quiz ≥ 4/6; and a meaningful reflection is written.

---

## AI-use Log and Reflection

See `docs/AI_USE_LOG.md`.
