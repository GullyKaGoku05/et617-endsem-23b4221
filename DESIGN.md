# DESIGN.md — ET617 End-Semester Educational App

## Identity Card

| Field | Selection |
|---|---|
| Problem | **P5 — Inquiry-based virtual laboratory** |
| Topic | **P5-T10 — Projectile motion: angle and speed range (Class 11)** |
| Learner context | **L5 — Learner repeating the topic after failing it once, with high anxiety and low self-efficacy** |
| Design constraint | **C4 — 10-minute sessions** |
| Identity token | **[ENTER YOUR ROLL NUMBER]** |

**Working app name:** LaunchLab — Explore Projectile Motion

**One-line idea:** A short, supportive virtual experiment in which a learner predicts, launches, observes, compares and revises their explanation of projectile range.

---

## D1. Educational Problem and Learning Outcomes

### Educational problem

A learner who has previously failed projectile motion may remember formulas without understanding how launch angle and initial speed affect the horizontal range. They may assume that a larger launch angle always produces a larger range, or that changing the angle has the same effect as changing the launch speed. A conventional explanation followed by numerical questions may increase anxiety without helping the learner test these ideas. LaunchLab gives the learner a safe, repeatable experiment with small steps, clear observations and supportive feedback.

### Measurable learning outcomes

By the end of one session, the learner will be able to:

1. **Predict** how changing launch angle or initial speed affects the horizontal range.
2. **Compare** the ranges produced by at least three launch angles while keeping speed constant.
3. **Explain** why, for a projectile launched and landing at the same height under ideal conditions, the range is greatest at 45° and complementary angles give equal ranges.

### Context of use

- A learner uses the app independently on a mobile phone.
- One complete learning sequence takes approximately 8–10 minutes.
- The learner can complete the activity in one sitting; the app shows progress and a short end-of-session summary.
- Language is calm, encouraging and appropriate for a Class 11 learner.

---

## D2. Learner Persona

**Name:** Aarav  
**Age:** 16  
**Class:** 11  
**Prior knowledge:** Knows that gravity acts downward, can identify horizontal and vertical components of velocity, and has seen the equations of motion. Has attempted projectile-motion questions before but is not confident using the range formula.

### Likely misconceptions

1. **Bigger-angle misconception:** A larger launch angle always produces a larger horizontal range.
2. **Speed-angle confusion:** Increasing launch angle and increasing launch speed affect range in the same way, so the learner does not distinguish the effect of each variable.

### Device, time, language and motivation

- **Device:** Android smartphone.
- **Available time:** One focused 10-minute session.
- **Language:** Simple English, with short sentences and familiar examples.
- **Motivation:** Wants to understand the topic well enough to solve exam questions and feel confident after a previous failure.
- **Support need:** Low-pressure feedback, hints before answers, visible progress and the ability to repeat an experiment.

---

## D3. Educational Content and Learning Activity

### Core concept explanation

A projectile is an object launched into the air that then moves under gravity (ignoring air resistance).

- The horizontal component of velocity remains constant in the ideal model.
- Gravity changes the vertical component of velocity.
- The horizontal range is the horizontal distance travelled before the projectile returns to its launch height.

For launch speed `u`, launch angle `θ`, and gravitational acceleration `g`, when launch and landing heights are equal:

`R = (u² sin(2θ)) / g`

For a fixed launch speed:
- The range is greatest at **45°**.
- Complementary angles such as **30° and 60°** give the same range.
- A 90° launch has zero horizontal range in this ideal same-height model.

If launch speed increases while angle stays the same, the range increases with the square of speed. For example, doubling the speed makes the range four times as large under the same ideal conditions.

**Model assumptions shown in the app:** no air resistance; constant gravitational acceleration; launch and landing at the same height.

### Ten-minute learning sequence

| Time | Stage | Learner action | App response |
|---|---|---|---|
| 0:00–1:00 | Welcome and check-in | Choose confidence level and answer one warm-up | Reassuring message and progress indicator |
| 1:00–2:00 | Explore the idea | Read the short concept card | Highlights angle, speed and range |
| 2:00–3:00 | Make a prediction | Predict which angle gives the greatest range | Saves prediction without judging it |
| 3:00–5:00 | Run experiment | Set angle and speed; launch | Shows trajectory, landing point and range |
| 5:00–7:00 | Compare results | Run 30°, 45° and 60° at the same speed | Displays a comparison table |
| 7:00–8:30 | Revise explanation | Explain what surprised them | Gives a targeted hint and feedback |
| 8:30–10:00 | Quick check and wrap-up | Answer two final questions | Shows outcome summary and next step |

### Tasks, model answers and feedback

**Task 1 — Prediction (multiple choice)**  
At the same launch speed, which angle is expected to give the greatest horizontal range in the ideal same-height model?

- A. 30°
- B. 45°
- C. 60°
- D. 90°

**Model answer:** B. 45°.

- Correct feedback: “Good prediction. Let’s test it in the lab.”
- Bigger-angle misconception (C or D): “It is reasonable to think a steeper launch travels farther. But a steeper path also spends less time moving forward. Let’s compare the results before deciding.”

**Task 2 — Controlled experiment (simulation)**  
Set the speed to 20 m/s. Run the experiment at 30°, 45° and 60°. Keep the speed unchanged.

**Expected ideal-model observations** (using g = 9.8 m/s²):
- 30°: approximately 35.3 m
- 45°: approximately 40.8 m
- 60°: approximately 35.3 m

**Prompt:** What do you notice about 30° and 60°?

**Model answer:** Their ranges are approximately equal because they are complementary angles.

- Correct feedback: “Exactly. The two angles add to 90°, and the ideal model gives them the same range.”
- If the learner says 60° must travel farther: “Look at the two landing marks. The 60° path is higher, but it also has less horizontal velocity. Compare the measured distances once more.”

**Task 3 — Identify the variable (short answer)**  
Keep the angle at 45°. Increase the launch speed from 10 m/s to 20 m/s. What happens to the range?

**Model answer:** The range becomes four times as large.

- Correct feedback: “Right. Range is proportional to the square of launch speed.”
- Speed-angle confusion: “You changed speed, not angle. Keep the angle fixed and compare the two ranges. Try describing the change as ‘twice’ or ‘four times’.”

**Task 4 — Interpret an unsuccessful experiment (multiple choice)**  
A learner predicts that 70° will give a greater range than 45° at the same speed. The simulation shows a shorter range. What is the best next step?

- A. Increase the angle further.
- B. Compare the horizontal and vertical parts of the motion.
- C. Assume the simulation is wrong.

**Model answer:** B.

- Correct feedback: “Good scientific thinking. The horizontal component and time in the air both matter.”
- If A: “Before changing the angle again, inspect what happens to horizontal motion as the launch gets steeper.”
- If C: “It is useful to question results, but first check the conditions: same speed, same height and same gravity. Does the experiment follow those conditions?”

**Task 5 — Explain the result (one-sentence response)**  
Why can 30° and 60° produce the same range?

**Model answer:** They are complementary angles; in the ideal same-height model, they have the same value of `sin(2θ)`.

- Correct feedback: “Well explained. You connected the observation to the relationship in the range formula.”
- Incomplete response: “You noticed the two angles, which is a good start. What is their sum? Now connect that to `sin(2θ)`.”

**Task 6 — Exit check (true/false)**  
If the launch speed is doubled and the angle stays fixed, the range doubles.

**Model answer:** False. The range becomes four times as large in the ideal model.

- Correct feedback: “Correct. The speed is squared in the range equation.”
- Incorrect feedback: “Check the `u²` term in the formula. If `u` doubles, what happens to `u²`?”

---

## D4. Working Application: Screens and States

### Minimum connected screens

1. **Welcome / confidence check**
   - Input: confidence level (low, okay, confident).
   - Output: reassuring introduction and session progress.
   - Transition: Start experiment.

2. **Concept card**
   - Output: short explanation, range formula and model assumptions.
   - Input: learner taps “I’m ready”.
   - Transition: Make a prediction.

3. **Prediction screen**
   - Input: choose which angle they think gives the greatest range.
   - Output: prediction saved; no immediate penalty.
   - Transition: Open virtual lab.

4. **Virtual lab**
   - Input: launch angle slider and speed control; Launch button.
   - Output: projectile path, landing point and calculated range.
   - Transition: Save result and compare.

5. **Results / comparison**
   - Output: table of angle, speed and range for saved trials.
   - Input: choose another angle or continue.
   - Transition: Revise explanation.

6. **Reflection / feedback**
   - Input: short explanation or choice-based response.
   - Output: misconception-specific hint and feedback.
   - Transition: Quick check.

7. **Quick check / completion**
   - Input: final two questions and confidence rating.
   - Output: score, learning summary and completion status.

### Simple simulation logic

Use the ideal projectile equations for equal launch and landing heights:

- `time = (2 * u * sin(θ)) / g`
- `range = u * cos(θ) * time`
- `height(t) = u * sin(θ) * t - 0.5 * g * t * t`
- `x(t) = u * cos(θ) * t`

Use `g = 9.8 m/s²`. Convert degrees to radians before using sine and cosine.

For the trajectory, calculate points from `t = 0` to the total flight time and draw a simple curve on a canvas or SVG. Label the simulation as an ideal model.

### C4 — 10-minute sessions: visible implementation

- Show a **10-minute session timer or elapsed-time indicator**.
- Display the current stage and progress, for example “Experiment 2 of 5”.
- Keep each screen focused on one small action.
- Provide a “Pause and resume” control. Store the current stage and saved trials locally so the learner can continue.
- At the end, show a short completion summary and the time taken.
- Avoid adding optional activities that prevent completion within 10 minutes.

### Identity token

Show `[ENTER YOUR ROLL NUMBER]` in the footer of every screen and on an About section.

---

## D5. Two Contrasting Learner Scenarios

### Scenario A — Correct reasoning path

1. Aarav predicts 45° will give the greatest range.
2. He sets speed to 20 m/s and tests 30°, 45° and 60°.
3. The results show approximately 35.3 m, 40.8 m and 35.3 m.
4. He identifies that 30° and 60° give approximately equal ranges.
5. He answers that 45° gives the greatest range in the ideal same-height model.
6. The app confirms his reasoning and records the completed outcomes.

**Evidence to capture:** prediction screen, three saved trials, comparison table and final feedback.

### Scenario B — Bigger-angle misconception

1. Aarav predicts 70° will give a greater range than 45° because it is a higher launch.
2. He runs both experiments at the same speed.
3. The 70° result is shorter than the 45° result.
4. The app does not reveal the answer immediately. It asks him to inspect the horizontal component and time in the air.
5. Aarav retries at 30° and 60° and compares the ranges.
6. He revises his explanation: a higher path does not always mean a greater horizontal range.

**Evidence to capture:** initial prediction, unsuccessful result, hint screen and revised explanation.

---

## D6. AI Functionality Specification

### AI feature: supportive misconception hint

**Purpose:** Give a short hint based on the learner's prediction, experiment settings and explanation. The AI should guide the learner to inspect evidence, not reveal the final answer immediately.

**Input fields:**
- Topic: projectile motion, Class 11.
- Launch angle and speed selected.
- Learner prediction.
- Observed range from the simulation.
- Learner's short explanation.
- Misconception label, if identified by the app's rule-based check.

**Example prompt:**

> You are a supportive Class 11 physics tutor. The learner is repeating projectile motion after a previous failure and may feel anxious. Use simple, encouraging English. Do not shame the learner. Do not immediately give the final answer. Use the experiment evidence below to give one short hint and one question that helps the learner reason.
>
> Topic: projectile motion, ideal model, same launch and landing height.  
> Launch speed: 20 m/s.  
> Trials: 45° range = 40.8 m; 70° range = approximately 26.3 m.  
> Learner prediction: 70° will travel farther.  
> Misconception: a larger angle always gives a larger range.  
>
> Return: (1) one encouraging sentence, (2) one evidence-based hint, (3) one question for the learner. Do not state the final answer.

**Expected output example:**
- Encouragement: “Your prediction was worth testing.”
- Hint: “Compare how much of the launch speed acts horizontally at 45° and 70°.”
- Question: “Which launch has more horizontal motion?”

**Checking before display:**
- The app calculates range itself; the AI does not calculate or override simulation results.
- Limit the displayed response to a short, age-appropriate hint.
- Reject empty or malformed responses and use the fixed fallback hint.
- Do not allow the AI to change the learner's recorded experiment data or score.

**Fallback if the AI call fails:**
“Look at the two landing marks. Keep the speed the same. What changes when the angle becomes steeper?”

### Non-AI logic

The physics simulation, numerical range calculation, answer checking, timer, progress tracking and misconception detection should use deterministic code. This keeps scientific results consistent and makes the app usable if the AI service is unavailable.

---

## D7. Pedagogical Rationale

### Inquiry-based learning

The learner follows the inquiry cycle: predict, experiment, observe, compare and revise. The learner sees the result of their own choices rather than only reading a solved example.

### Learning from an unsuccessful experiment

When the learner's prediction is incorrect, the app does not immediately reveal the correct answer. It:
1. Acknowledges that testing a prediction is useful.
2. Shows the observed result clearly.
3. Gives a hint about the relevant variable.
4. Asks the learner to compare evidence.
5. Allows another experiment and a revised explanation.

This directly addresses P5's design challenge.

### Support for the learner

- A low-pressure prediction stage separates guessing from assessment.
- Short steps reduce cognitive load and anxiety.
- Feedback focuses on the idea, not on the learner.
- Repeated experiments let the learner test and improve their explanation.
- A visible progress indicator helps the learner see that the session is manageable.

### Why C4 shaped the design

The activity is designed as one complete 10-minute sequence. Each screen has one main action, and the progress indicator makes the remaining work clear. Pause and resume support helps the learner stop without losing their experiment results.

---

## D8. Evaluation Plan

| Learning outcome | Assessment evidence | Success criterion |
|---|---|---|
| Predict effects of angle and speed | Prediction and pre/post response | Learner correctly predicts the 45° maximum for fixed speed in the ideal model |
| Compare ranges | Saved 30°, 45° and 60° trials | Learner identifies 45° as the greatest and 30°/60° as approximately equal |
| Explain the relationship | Exit response | Learner explains complementary angles or connects the result to `sin(2θ)` |

### Data to log

- Session start and completion time.
- Current stage and whether the learner paused/resumed.
- Predictions and selected experiment settings.
- Calculated range for each trial.
- Number of experiments and retries.
- Answers to tasks and misconception tags.
- Hints shown and whether the learner revised their explanation.
- Pre-session and post-session confidence rating.

### Overall success

A successful session is one in which the learner completes the activity within 10 minutes, correctly compares the three angle trials, explains at least one observed relationship, and reports equal or higher confidence at the end.

---

## AI-use Log and Reflection

Record every AI tool used during the examination in the order used. Include share links or exports as required by the exam instructions.

**Reflection template:**
- What AI helped me plan or build:
- What I checked manually:
- One AI suggestion I changed and why:
- How I verified the physics calculations:
- What fallback works if the AI service fails:

---

## Build Priorities Under Exam Time

1. Build the 7 connected screens and navigation.
2. Implement the angle and speed controls and correct range calculation.
3. Add the comparison table for 30°, 45° and 60°.
4. Add misconception-specific feedback and the retry path.
5. Add the 10-minute timer, progress indicator and pause/resume.
6. Deploy early, then improve styling and capture both learner scenarios.

**Important:** Replace `[ENTER YOUR ROLL NUMBER]` with your actual roll number. Use the exact card disclosed for your exam. The app and report must match that card.
