/* ==============================================================
   LaunchLab — script.js
   --------------------------------------------------------------
   Sections
    1. Configuration
    2. App state + saving (LocalStorage)           [Stage 6]
    3. Small helpers
    4. Identity token, session plan, progress
    5. Navigation + "no skipping" checks           [Stage 2]
    6. Physics                                     [Stage 3]
    7. Simulator (HTML Canvas)                     [Stage 3]
    8. Lab controls                                [Stage 3]
    9. Misconceptions                              [Stage 5]
   10. Inquiry activities + feedback               [Stages 4–5]
   11. Observation screen                          [Stage 4]
   12. Concept screen                              [Stage 5]
   13. Hint engine (rule-based, AI-ready)          [Stage 7]
   14. Knowledge check (quiz)                      [Stage 8]
   15. Results + reflection                        [Stage 8]
   16. 10-minute session timer, pause/resume       [Stage 6]
   17. Restore + initialise
   ============================================================== */


/* ==============================================================
   1. CONFIGURATION
   Change IDENTITY_TOKEN to your roll number.
   ============================================================== */
const CONFIG = {
  IDENTITY_TOKEN: "23B4221",
  SESSION_SECONDS: 10 * 60,           // C4 constraint: 10 minutes
  STORAGE_KEY: "launchlab-session-v1",

  // Optional: URL of YOUR OWN backend that calls an AI model.
  // Leave empty to use the rule-based hint engine (no API key in the browser!).
  AI_ENDPOINT: "",

  screens: [
    { id: "screen-welcome",     label: "Welcome" },
    { id: "screen-prediction",  label: "Prediction" },
    { id: "screen-lab",         label: "Experiment Lab" },
    { id: "screen-observation", label: "Observation" },
    { id: "screen-concept",     label: "Concept" },
    { id: "screen-quiz",        label: "Knowledge Check" },
    { id: "screen-results",     label: "Results & Reflection" }
  ],

  sessionPlan: [
    { label: "Welcome",      time: "0.5 min" },
    { label: "Prediction",   time: "1 min" },
    { label: "First launch", time: "2 min" },
    { label: "Compare",      time: "2 min" },
    { label: "Concept",      time: "1 min" },
    { label: "Quiz",         time: "2 min" },
    { label: "Reflection",   time: "1.5 min" }
  ]
};

const PREDICTION_TEXT = {
  increase: "The range increases",
  decrease: "The range decreases",
  same: "The range stays the same"
};

/* The physically correct predictions (ideal model, 20 m/s) */
const TRUE_PREDICTION = { p1: "increase", p2: "decrease" };


/* ==============================================================
   2. APP STATE + SAVING
   Everything the learner does lives in ONE object. It is saved
   to LocalStorage after every change, and loaded on page open.
   ============================================================== */
function freshState() {
  return {
    started: false,          // has the learner pressed Start?
    currentStep: 0,
    furthestStep: 0,
    secondsLeft: CONFIG.SESSION_SECONDS,
    elapsed: 0,              // seconds actually spent (not counting pauses)
    paused: false,
    timeUp: false,
    finished: false,         // reached the Results screen

    prediction: null,        // 30° → 45°
    prediction2: null,       // 45° → 70°
    revised: null,           // revised predictions { p1, p2 } (if needed)

    experiments: [],
    activities: {
      a1: { done: false, correctFirst: null, attempts: 0, feedback: null, needsRevision: false },
      a2: { done: false, questions: {} },
      a3: { done: false, questions: {} }
    },

    observation: "",
    difference: "",
    notesSaved: false,

    quiz: {},                // question id → { answer, attempts, correct, firstTry, revealed, feedback }
    misconceptions: {
      M1: { detected: false, resolved: false, evidence: [] },
      M2: { detected: false, resolved: false, evidence: [] }
    },
    hintsUsed: 0,
    reflection: "",
    reflectionSaved: false
  };
}

let state = freshState();

function saveState() {
  try {
    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    // Private browsing or storage blocked: the app still works, just without saving
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem(CONFIG.STORAGE_KEY);
    if (!raw) return false;
    const saved = JSON.parse(raw);
    // Merge with a fresh state so any missing fields get default values
    state = Object.assign(freshState(), saved);
    return true;
  } catch (e) {
    return false;
  }
}

function clearSavedState() {
  try { localStorage.removeItem(CONFIG.STORAGE_KEY); } catch (e) { /* ignore */ }
}


/* ==============================================================
   3. SMALL HELPERS
   ============================================================== */
function $(id) { return document.getElementById(id); }

/* Make learner-typed text safe to put inside HTML */
function escapeHTML(text) {
  return String(text)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function formatTime(totalSeconds) {
  const s = Math.max(0, Math.round(totalSeconds));
  return String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
}

function showMessage(boxId, text, isOk) {
  const box = $(boxId);
  box.innerHTML = text;
  box.classList.toggle("ok", !!isOk);
  box.hidden = false;
}

function hideMessage(boxId) { $(boxId).hidden = true; }


/* ==============================================================
   4. IDENTITY TOKEN, SESSION PLAN, PROGRESS
   ============================================================== */
function showIdentityToken() {
  document.querySelectorAll(".js-token").forEach(function (el) {
    el.textContent = CONFIG.IDENTITY_TOKEN;
  });
}

function renderSessionPlan() {
  $("session-plan").innerHTML = CONFIG.sessionPlan.map(function (item) {
    return '<li><span class="plan-time">' + item.time + "</span>" + item.label + "</li>";
  }).join("");
}

function renderStepDots() {
  $("step-dots").innerHTML = CONFIG.screens.map(function (screen, i) {
    let cls = "";
    if (i <= state.furthestStep) cls = "done";
    if (i === state.currentStep) cls = "current";
    return '<li class="' + cls + '">' + screen.label + "</li>";
  }).join("");
}

function updateProgress() {
  const total = CONFIG.screens.length;
  const step = state.currentStep;
  const percent = Math.round((step / (total - 1)) * 100);
  $("progress-fill").style.width = percent + "%";
  $("progress-percent").textContent = percent + "%";
  $("progress-label").textContent =
    "Step " + (step + 1) + " of " + total + " · " + CONFIG.screens[step].label;
  renderStepDots();
}


/* ==============================================================
   5. NAVIGATION + "NO SKIPPING" CHECKS
   ============================================================== */
function showScreen(stepIndex) {
  document.querySelectorAll(".screen").forEach(function (sec) { sec.classList.remove("active"); });
  $(CONFIG.screens[stepIndex].id).classList.add("active");

  state.currentStep = stepIndex;
  state.furthestStep = Math.max(state.furthestStep, stepIndex);

  // Reaching the results screen ends the timed session
  if (CONFIG.screens[stepIndex].id === "screen-results") state.finished = true;

  updateProgress();
  refreshScreen(stepIndex);
  updateTimerDisplay();
  saveState();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* Returns true if the learner may leave this screen going forward */
function canLeaveScreen(stepIndex) {
  const id = CONFIG.screens[stepIndex].id;

  if (id === "screen-prediction" && (!state.prediction || !state.prediction2)) {
    showMessage("prediction-feedback",
      "💛 Please choose one answer for <strong>both</strong> predictions. Any guess is fine. We will test them together!");
    return false;
  }

  if (id === "screen-lab") {
    const a = state.activities;
    if (!(a.a1.done && a.a2.done && a.a3.done)) {
      showMessage("lab-feedback", "🔬 Please finish Activities 1–3 below first. They only take a few launches!");
      $("activities").scrollIntoView({ behavior: "smooth" });
      return false;
    }
  }

  if (id === "screen-observation" && !saveNotes()) return false;

  if (id === "screen-quiz" && !quizComplete()) {
    showMessage("quiz-feedback",
      "📝 Please answer every question. If one is tricky, use the hint, or after two tries open the model answer.");
    return false;
  }

  return true;
}

function goNext() {
  if (!canLeaveScreen(state.currentStep)) return;
  if (state.currentStep < CONFIG.screens.length - 1) showScreen(state.currentStep + 1);
}

function goBack() {
  if (state.currentStep > 0) showScreen(state.currentStep - 1);
}

/* Refresh the parts of a screen that depend on saved data */
function refreshScreen(stepIndex) {
  const id = CONFIG.screens[stepIndex].id;

  if (id === "screen-prediction" && state.activities.a1.feedback) {
    document.querySelectorAll('input[name="prediction"], input[name="prediction2"]').forEach(function (r) {
      r.disabled = true;
    });
    showMessage("prediction-feedback",
      "🔒 These are your first predictions. They are kept so you can compare them with your evidence. " +
      "You revised them in Activity 1 if needed.", true);
  }

  if (id === "screen-lab") {
    $("lab-prediction-echo").textContent = PREDICTION_TEXT[state.prediction] || "—";
    $("lab-prediction2-echo").textContent = PREDICTION_TEXT[state.prediction2] || "—";
    renderExperimentList();
    renderActivities();
    Sim.resize();
  }
  if (id === "screen-observation") {
    renderComparisonTable();
    $("obs-prediction-echo").textContent =
      "30°→45°: " + (PREDICTION_TEXT[state.prediction] || "—") +
      " · 45°→70°: " + (PREDICTION_TEXT[state.prediction2] || "—");
  }
  if (id === "screen-concept") renderConcept();
  if (id === "screen-quiz") renderQuiz();
  if (id === "screen-results") renderResults();
}


/* ==============================================================
   6. PHYSICS — ideal projectile motion
   No air resistance · constant g · same launch and landing height
   ============================================================== */
const G = 9.8; // m/s²

const Physics = {
  toRad: function (deg) { return deg * Math.PI / 180; },

  // T = 2u sinθ / g
  timeOfFlight: function (u, deg) { return (2 * u * Math.sin(this.toRad(deg))) / G; },

  // R = u² sin(2θ) / g
  range: function (u, deg) { return (u * u * Math.sin(2 * this.toRad(deg))) / G; },

  // H = u² sin²θ / (2g)
  maxHeight: function (u, deg) {
    const s = Math.sin(this.toRad(deg));
    return (u * u * s * s) / (2 * G);
  },

  // x = u cosθ t ,  y = u sinθ t − ½ g t²
  position: function (u, deg, t) {
    const th = this.toRad(deg);
    return { x: u * Math.cos(th) * t, y: u * Math.sin(th) * t - 0.5 * G * t * t };
  }
};

/* Remove tiny floating-point leftovers (e.g. range at 90° = 1e-15) */
function clean(n) { return Math.abs(n) < 1e-9 ? 0 : n; }


/* ==============================================================
   7. SIMULATOR (HTML Canvas)
   Fixed world scale (0–95 m × 0–48 m) so launches can be compared
   fairly by eye. Largest possible launch: R = 91.8 m, H = 45.9 m.
   ============================================================== */
const WORLD = { width: 95, height: 48 };
const TIME_SPEED = 1.5;   // animation runs 1.5× faster than real time
const COLORS = ["#2563eb", "#f59e0b", "#16a34a", "#db2777", "#7c3aed", "#0891b2", "#dc2626"];

const Sim = {
  canvas: null, ctx: null,
  current: null, t: 0,
  running: false, paused: false, lastFrame: 0,
  compare: false,

  init: function () {
    this.canvas = $("sim-canvas");
    this.ctx = this.canvas.getContext("2d");
    window.addEventListener("resize", () => this.resize());
  },

  resize: function () {
    const dpr = window.devicePixelRatio || 1;
    const w = this.canvas.clientWidth, h = this.canvas.clientHeight;
    if (w === 0) return;                 // canvas not visible
    this.canvas.width = w * dpr;
    this.canvas.height = h * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.w = w; this.h = h;
    this.pad = { left: 36, right: 14, top: 14, bottom: 28 };
    this.scale = Math.min(
      (w - this.pad.left - this.pad.right) / WORLD.width,
      (h - this.pad.top - this.pad.bottom) / WORLD.height
    );
    this.draw();
  },

  px: function (x) { return this.pad.left + x * this.scale; },
  py: function (y) { return this.h - this.pad.bottom - y * this.scale; },

  launch: function (angle, speed) {
    this.current = {
      angle: angle, speed: speed,
      range: clean(Physics.range(speed, angle)),
      height: clean(Physics.maxHeight(speed, angle)),
      time: clean(Physics.timeOfFlight(speed, angle))
    };
    this.t = 0;
    this.paused = false;
    if (this.current.time === 0) { this.finish(); return; }   // 0°: never leaves the ground
    this.running = true;
    this.lastFrame = performance.now();
    requestAnimationFrame((ts) => this.step(ts));
  },

  step: function (ts) {
    if (!this.running) return;
    if (!this.paused) {
      const dt = Math.min((ts - this.lastFrame) / 1000, 0.1);  // cap big jumps (tab switch)
      this.t = Math.min(this.t + dt * TIME_SPEED, this.current.time);
    }
    this.lastFrame = ts;
    this.draw();
    showLiveReadout(this.t, this.current);
    if (this.t >= this.current.time) this.finish();
    else requestAnimationFrame((t2) => this.step(t2));
  },

  finish: function () {
    this.running = false;
    this.t = this.current.time;
    this.draw();
    onExperimentFinished(this.current);
  },

  togglePause: function () { if (this.running) this.paused = !this.paused; },

  reset: function () {
    this.running = false; this.paused = false;
    this.current = null; this.t = 0;
    this.draw();
  },

  draw: function () {
    if (!this.ctx || !this.w) return;
    this.ctx.clearRect(0, 0, this.w, this.h);
    this.drawGrid();
    if (this.compare) {
      state.experiments.forEach((exp, i) => {
        this.drawPath(exp, exp.time, COLORS[i % COLORS.length], 0.55, "#" + (i + 1));
      });
    }
    if (this.current) {
      const col = COLORS[state.experiments.length % COLORS.length];
      this.drawPath(this.current, this.t, col, 1, null);
      this.drawAngle(this.current);
      this.drawBall(this.current, this.t);
      if (!this.running) this.drawMarkers(this.current, col);
    }
  },

  drawGrid: function () {
    const c = this.ctx;
    c.lineWidth = 1;
    c.font = "11px Segoe UI, sans-serif";
    c.fillStyle = "#8a99ad";
    for (let x = 0; x <= WORLD.width; x += 10) {
      c.strokeStyle = "#e6edf6";
      c.beginPath(); c.moveTo(this.px(x), this.py(0)); c.lineTo(this.px(x), this.py(WORLD.height)); c.stroke();
      c.textAlign = "center";
      c.fillText(x + "", this.px(x), this.py(0) + 15);
    }
    for (let y = 10; y <= WORLD.height; y += 10) {
      c.strokeStyle = "#e6edf6";
      c.beginPath(); c.moveTo(this.px(0), this.py(y)); c.lineTo(this.px(WORLD.width), this.py(y)); c.stroke();
      c.textAlign = "right";
      c.fillText(y + "", this.px(0) - 5, this.py(y) + 4);
    }
    c.strokeStyle = "#5b6b7f";
    c.lineWidth = 2;
    c.beginPath(); c.moveTo(this.px(0), this.py(0)); c.lineTo(this.px(WORLD.width), this.py(0)); c.stroke();
    c.textAlign = "right";
    c.fillText("metres", this.w - 4, this.py(0) + 15);
  },

  /* Trajectory from t = 0 to tEnd, calculated from the equations */
  drawPath: function (exp, tEnd, color, alpha, label) {
    const c = this.ctx, steps = 80;
    c.save();
    c.globalAlpha = alpha;
    c.strokeStyle = color;
    c.lineWidth = 2.5;
    c.setLineDash(label ? [6, 4] : []);
    c.beginPath();
    for (let i = 0; i <= steps; i++) {
      const p = Physics.position(exp.speed, exp.angle, (tEnd * i) / steps);
      const X = this.px(p.x), Y = this.py(Math.max(0, p.y));
      if (i === 0) c.moveTo(X, Y); else c.lineTo(X, Y);
    }
    c.stroke();
    if (label) {
      c.setLineDash([]);
      c.fillStyle = color;
      c.font = "bold 11px Segoe UI, sans-serif";
      c.textAlign = "center";
      c.fillText(label, this.px(exp.range / 2), this.py(exp.height) - 6);
    }
    c.restore();
  },

  drawBall: function (exp, t) {
    const p = Physics.position(exp.speed, exp.angle, t);
    const c = this.ctx;
    c.fillStyle = "#f59e0b";
    c.strokeStyle = "#b45309";
    c.lineWidth = 1.5;
    c.beginPath();
    c.arc(this.px(p.x), this.py(Math.max(0, p.y)), 7, 0, Math.PI * 2);
    c.fill(); c.stroke();
  },

  drawAngle: function (exp) {
    const c = this.ctx, ox = this.px(0), oy = this.py(0);
    const th = Physics.toRad(exp.angle);
    c.strokeStyle = "#1c2a3a";
    c.lineWidth = 1.5;
    c.setLineDash([]);
    c.beginPath(); c.arc(ox, oy, 26, -th, 0); c.stroke();
    c.beginPath(); c.moveTo(ox, oy); c.lineTo(ox + 40 * Math.cos(th), oy - 40 * Math.sin(th)); c.stroke();
    c.fillStyle = "#1c2a3a";
    c.font = "bold 12px Segoe UI, sans-serif";
    c.textAlign = "left";
    c.fillText(exp.angle + "°, " + exp.speed + " m/s", ox + 32, oy - 8);
  },

  drawMarkers: function (exp, color) {
    const c = this.ctx;
    c.save();
    c.strokeStyle = color;
    c.fillStyle = color;
    c.font = "bold 12px Segoe UI, sans-serif";
    c.setLineDash([4, 4]);
    c.lineWidth = 1.5;
    if (exp.height > 0) {
      const hx = this.px(exp.range / 2);
      c.beginPath(); c.moveTo(hx, this.py(0)); c.lineTo(hx, this.py(exp.height)); c.stroke();
      c.textAlign = "left";
      c.fillText("H = " + exp.height.toFixed(2) + " m", hx + 5, this.py(exp.height / 2));
    }
    c.setLineDash([]);
    const rx = this.px(exp.range);
    c.beginPath(); c.moveTo(rx, this.py(0)); c.lineTo(rx, this.py(0) - 18); c.stroke();
    const right = exp.range > WORLD.width * 0.8;
    c.textAlign = right ? "right" : "left";
    c.fillText("R = " + exp.range.toFixed(2) + " m", rx + (right ? -4 : 4), this.py(0) - 22);
    c.restore();
  }
};


/* ==============================================================
   8. LAB CONTROLS
   ============================================================== */
function showLiveReadout(t, exp) {
  const p = Physics.position(exp.speed, exp.angle, t);
  $("out-range").textContent = "x = " + p.x.toFixed(1) + " m";
  $("out-height").textContent = "y = " + Math.max(0, p.y).toFixed(1) + " m";
  $("out-time").textContent = "t = " + t.toFixed(2) + " s";
}

function showFinalReadout(exp) {
  $("out-range").textContent = exp.range.toFixed(2) + " m";
  $("out-height").textContent = exp.height.toFixed(2) + " m";
  $("out-time").textContent = exp.time.toFixed(2) + " s";
}

function clearReadout() {
  ["out-range", "out-height", "out-time"].forEach(function (id) { $(id).textContent = "—"; });
}

/* Called when the ball lands: record the experiment */
function onExperimentFinished(exp) {
  state.experiments.push({
    id: state.experiments.length + 1,
    angle: exp.angle, speed: exp.speed,
    range: exp.range, height: exp.height, time: exp.time
  });
  showFinalReadout(exp);
  setLabButtons(false);
  renderExperimentList();
  renderActivities();
  saveState();

  if (exp.angle === 0) {
    showMessage("lab-feedback", "At 0° the ball moves flat along the ground, so it never rises and the range is 0 m. Try a bigger angle!");
  } else if (exp.angle === 90) {
    showMessage("lab-feedback", "At 90° the ball goes straight up and lands where it started, so the range is 0 m. Interesting evidence!");
  } else {
    showMessage("lab-feedback", "✅ Experiment " + state.experiments.length +
      " recorded. Try changing ONE thing (angle or speed) and launch again.", true);
  }
}

function renderExperimentList() {
  $("lab-count").textContent = state.experiments.length;
  if (state.experiments.length === 0) {
    $("exp-list").innerHTML = '<li class="muted">No launches yet. Set an angle and speed, then press Launch.</li>';
    return;
  }
  $("exp-list").innerHTML = state.experiments.map(function (e, i) {
    return '<li class="exp-chip" style="--chip:' + COLORS[i % COLORS.length] + '">#' + e.id + " · " +
      e.angle + "°, " + e.speed + " m/s → R = " + e.range.toFixed(2) + " m</li>";
  }).join("");
}

function setLabButtons(flying) {
  $("btn-launch").disabled = flying;
  $("btn-pause").disabled = !flying;
  $("btn-pause").textContent = "⏸ Pause";
  ["angle-slider", "angle-input", "speed-slider", "speed-input"].forEach(function (id) {
    $(id).disabled = flying;
  });
}

/* Keep slider and number box in sync and within limits */
function linkControl(sliderId, inputId) {
  const slider = $(sliderId), input = $(inputId);
  slider.addEventListener("input", function () { input.value = slider.value; });
  input.addEventListener("change", function () {
    let v = Math.round(Number(input.value));
    if (isNaN(v)) v = Number(slider.value);
    v = Math.min(Number(slider.max), Math.max(Number(slider.min), v));
    input.value = v;
    slider.value = v;
  });
}

function setControls(angle, speed) {
  $("angle-slider").value = angle; $("angle-input").value = angle;
  $("speed-slider").value = speed; $("speed-input").value = speed;
}

function onLaunch() {
  hideMessage("lab-feedback");
  setLabButtons(true);
  Sim.launch(Number($("angle-slider").value), Number($("speed-slider").value));
}

function onPause() {
  Sim.togglePause();
  $("btn-pause").textContent = Sim.paused ? "▶ Resume" : "⏸ Pause";
}

function onReset() {
  Sim.reset();
  setLabButtons(false);
  clearReadout();
  hideMessage("lab-feedback");
  setControls(45, 20);
}

function onCompare() {
  Sim.compare = !Sim.compare;
  $("btn-compare").textContent = "📊 Compare: " + (Sim.compare ? "on" : "off");
  Sim.draw();
}


/* ==============================================================
   9. MISCONCEPTIONS
   M1: "A larger launch angle always produces a larger range."
   M2: "Increasing angle and increasing speed have the same effect."
   ============================================================== */
const MISCONCEPTIONS = {
  M1: "A larger launch angle always gives a larger range",
  M2: "Changing the angle and changing the speed have the same effect on range"
};

function markMisconception(id, evidence) {
  const m = state.misconceptions[id];
  m.detected = true;
  m.resolved = false;
  if (m.evidence.indexOf(evidence) === -1) m.evidence.push(evidence);
}

function resolveMisconception(id) {
  const m = state.misconceptions[id];
  if (m.detected) m.resolved = true;
}

/* The misconception the learner is currently working on (for hints) */
function activeMisconception() {
  if (state.misconceptions.M1.detected && !state.misconceptions.M1.resolved) return "M1";
  if (state.misconceptions.M2.detected && !state.misconceptions.M2.resolved) return "M2";
  return null;
}


/* ==============================================================
   10. INQUIRY ACTIVITIES + FEEDBACK
   Questions only appear after the needed launches, so the answer
   is never shown before the evidence.
   Feedback after a wrong answer follows 5 steps:
   acknowledge → inspect evidence → small hint → retry → explain.
   ============================================================== */
const ACTIVITIES = [
  {
    key: "a1",
    title: "Activity 1 · Test your predictions",
    task: "Keep the speed at 20 m/s. Launch at 30°, 45° and 70°.",
    trials: [[30, 20], [45, 20], [70, 20]]
    // Checks the two predictions from screen 2 (see checkActivity1)
  },
  {
    key: "a2",
    title: "Activity 2 · Compare complementary angles",
    task: "Keep the speed at 20 m/s. Launch at 30°, 45° and 60°.",
    trials: [[30, 20], [45, 20], [60, 20]],
    questions: [
      {
        id: "pattern",
        text: function () { return "Look at your three ranges. Which statement matches your evidence?"; },
        options: [
          { v: "highest", t: "60° went furthest because it went highest" },
          { v: "pattern", t: "45° went furthest, and 30° and 60° landed at about the same place" },
          { v: "equal",   t: "All three angles landed at the same place" }
        ],
        correct: "pattern",
        misconception: { highest: "M1" },
        feedback: {
          highest: "Good thinking. 60° really does go the highest! Look at the R values in your chips. Is the highest path also the longest one?",
          equal: "Nice try. Look at the three R values again. Are all three numbers really the same?"
        },
        hint2: "Try this: switch <strong>Compare: on</strong> and look at where the 30°, 45° and 60° paths touch the ground. Which two land close together?",
        explain: "30° and 60° add up to 90° (complementary angles), so they give the same range. 45° sits exactly in the middle and gives the maximum range."
      }
    ]
  },
  {
    key: "a3",
    title: "Activity 3 · Investigate initial velocity",
    task: "Keep the angle at 45°. Launch at 10 m/s, then at 20 m/s.",
    trials: [[45, 10], [45, 20]],
    questions: [
      {
        id: "four",
        text: function () { return "The speed doubled (10 → 20 m/s). What happened to the range?"; },
        options: [
          { v: "same",  t: "It stayed about the same" },
          { v: "twice", t: "It became about 2 times bigger" },
          { v: "four",  t: "It became about 4 times bigger" }
        ],
        correct: "four",
        misconception: {},
        feedback: {
          twice: "Good attempt. Many people expect that! Look at the two R values in your chips.",
          same: "Let's look again. Compare the two R values in your chips. Are they close to each other?"
        },
        hint2: "Divide the 20 m/s range by the 10 m/s range on a calculator. What number do you get?",
        explain: "Range depends on u² (speed squared). 2 × speed → 2² = 4 × range."
      },
      {
        id: "compare",
        text: function () {
          const r30 = fmt(rangeOf(30, 20)), r45 = fmt(rangeOf(45, 20)), r10 = fmt(rangeOf(45, 10));
          return "Changing the angle from 30° to 45° changed the range from " + r30 + " m to " + r45 +
            " m. Doubling the speed (10 → 20 m/s at 45°) changed it from " + r10 + " m to " + r45 +
            " m. Which statement fits your evidence?";
        },
        options: [
          { v: "same",  t: "Changing angle and changing speed have the same kind of effect" },
          { v: "speed", t: "Speed has a much stronger effect; angle only helps up to 45°" },
          { v: "angle", t: "Angle always has the bigger effect" }
        ],
        correct: "speed",
        misconception: { same: "M2", angle: "M2" },
        feedback: {
          same: "Thank you for sharing your idea. Look at the sizes of the two changes in the question. Are they similar?",
          angle: "Good attempt. Compare how much the range grew in each case. Which grew more?"
        },
        hint2: "Remember Activity 1: going from 45° to 70° made the range <em>smaller</em>. Does increasing speed ever make the range smaller?",
        explain: "More speed always gives more range (×4 when doubled). More angle helps only up to 45°, then the range falls again. So they are different kinds of effect."
      }
    ]
  }
];

function fmt(n) { return n === null ? "?" : n.toFixed(2); }

function hasTrial(angle, speed) {
  return state.experiments.some(function (e) { return e.angle === angle && e.speed === speed; });
}

function rangeOf(angle, speed) {
  for (let i = state.experiments.length - 1; i >= 0; i--) {
    const e = state.experiments[i];
    if (e.angle === angle && e.speed === speed) return e.range;
  }
  return null;
}

function activitiesCompleted() {
  const a = state.activities;
  return [a.a1.done, a.a2.done, a.a3.done, state.notesSaved].filter(Boolean).length;
}

/* Lab questions (incl. Activity 1 predictions) right on the first try */
function activityFirstTryScore() {
  let score = 0, total = 1;
  if (state.activities.a1.correctFirst) score++;
  ["a2", "a3"].forEach(function (k) {
    const act = ACTIVITIES.find(function (a) { return a.key === k; });
    act.questions.forEach(function (q) {
      total++;
      const st = state.activities[k].questions[q.id];
      if (st && st.firstTry) score++;
    });
  });
  return { score: score, total: total };
}

/* The first unfinished activity (used by hints) */
function currentActivity() {
  return ACTIVITIES.find(function (a) { return !state.activities[a.key].done; }) || null;
}

/* Builds the activity cards in the Lab */
function renderActivities() {
  let html = "";

  ACTIVITIES.forEach(function (act, i) {
    const st = state.activities[act.key];
    const locked = i > 0 && !state.activities[ACTIVITIES[i - 1].key].done;
    const allRun = act.trials.every(function (t) { return hasTrial(t[0], t[1]); });
    const badge = st.done ? "✓ Done" : (locked ? "🔒 Locked" : "In progress");

    html += '<div class="activity ' + (st.done ? "done" : (locked ? "locked" : "")) + '">';
    html += "<h3>" + act.title + '<span class="badge">' + badge + "</span></h3>";

    if (locked) {
      html += '<p class="muted">Unlocks after Activity ' + i + ".</p></div>";
      return;
    }

    html += "<p>" + act.task + "</p><div class=\"trials\">";
    act.trials.forEach(function (t) {
      const ok = hasTrial(t[0], t[1]);
      html += '<button class="trial ' + (ok ? "ok" : "") + '" data-setup="' + t[0] + "," + t[1] + '">' +
        (ok ? "✓ " : "○ ") + t[0] + "°, " + t[1] + " m/s" +
        (ok ? " → " + rangeOf(t[0], t[1]).toFixed(2) + " m" : "") + "</button>";
    });
    html += "</div>";

    if (!allRun) {
      html += '<p class="muted">Run all the launches above to unlock the next step.</p></div>';
      return;
    }

    if (act.key === "a1") html += renderActivity1(st);
    else act.questions.forEach(function (q) { html += renderActivityQuestion(act, q); });

    html += "</div>";
  });

  $("activities").innerHTML = html;
}

/* Activity 1: compare predictions with evidence; revise if needed */
function renderActivity1(st) {
  let html = "";
  if (!st.feedback) {
    return '<button class="btn btn-secondary" data-check="a1">Compare with my predictions</button>';
  }
  html += '<div class="feedback ' + (st.feedback.ok ? "ok" : "") + '">' + st.feedback.text + "</div>";

  if (st.needsRevision && !st.done) {
    html += '<div class="revise"><p class="question">✏️ Revise your predictions using your evidence:</p>';
    html += revisionGroup("rev-p1", "30° → 45°");
    html += revisionGroup("rev-p2", "45° → 70°");
    html += '<button class="btn btn-secondary" data-check="a1-revise">Submit revised predictions</button></div>';
  }
  if (st.done && st.explain) html += '<div class="explain">' + st.explain + "</div>";
  return html;
}

function revisionGroup(name, label) {
  let html = "<p><strong>" + label + ":</strong></p><div class=\"options\">";
  Object.keys(PREDICTION_TEXT).forEach(function (v) {
    html += '<label class="option"><input type="radio" name="' + name + '" value="' + v + '"><span>' +
      PREDICTION_TEXT[v] + "</span></label>";
  });
  return html + "</div>";
}

function renderActivityQuestion(act, q) {
  const st = state.activities[act.key].questions[q.id] || {};
  let html = '<p class="question">' + q.text() + '</p><div class="options">';
  q.options.forEach(function (o) {
    html += '<label class="option"><input type="radio" name="' + act.key + "-" + q.id + '" value="' + o.v + '"' +
      (st.answer === o.v ? " checked" : "") + (st.correct ? " disabled" : "") + "><span>" + o.t + "</span></label>";
  });
  html += "</div>";
  if (!st.correct) {
    html += '<button class="btn btn-secondary" data-check="' + act.key + '" data-q="' + q.id + '">Check my answer</button>';
  }
  if (st.feedback) html += '<div class="feedback ' + (st.correct ? "ok" : "") + '">' + st.feedback + "</div>";
  if (st.correct) html += '<div class="explain">💡 <strong>Why?</strong> ' + q.explain + "</div>";
  return html;
}

function onActivitiesClick(e) {
  const setup = e.target.closest("[data-setup]");
  if (setup) {
    if (Sim.running) return;
    const parts = setup.dataset.setup.split(",");
    setControls(Number(parts[0]), Number(parts[1]));
    $("sim-canvas").scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }
  const check = e.target.closest("[data-check]");
  if (!check) return;
  if (check.dataset.check === "a1") checkActivity1();
  else if (check.dataset.check === "a1-revise") checkRevision();
  else checkQuestion(check.dataset.check, check.dataset.q);
  renderActivities();
  saveState();
}

/* Activity 1: are the two predictions supported by the evidence? */
function checkActivity1() {
  const st = state.activities.a1;
  const r30 = fmt(rangeOf(30, 20)), r45 = fmt(rangeOf(45, 20)), r70 = fmt(rangeOf(70, 20));
  const ok1 = state.prediction === TRUE_PREDICTION.p1;
  const ok2 = state.prediction2 === TRUE_PREDICTION.p2;
  st.attempts = 1;
  st.correctFirst = ok1 && ok2;

  // Bigger-angle misconception: expecting 45° → 70° to go further
  if (state.prediction2 === "increase") {
    markMisconception("M1", "Predicted that 45° → 70° would increase the range");
  }

  if (st.correctFirst) {
    st.done = true;
    st.feedback = { ok: true, text: "🌟 Both predictions matched your evidence! 30° → " + r30 + " m, 45° → " +
      r45 + " m, 70° → " + r70 + " m. The range went up, then came down again." };
    st.explain = "A steeper launch stays in the air longer but moves sideways more slowly. After 45°, the slower sideways motion wins.";
    return;
  }

  // Not matched: acknowledge, point to evidence, small hint, ask to revise
  st.needsRevision = true;
  st.feedback = { ok: false, text: "💛 Good attempt. Testing a prediction is exactly what scientists do! " +
    "Your evidence: 30° → <strong>" + r30 + " m</strong>, 45° → <strong>" + r45 + " m</strong>, 70° → <strong>" +
    r70 + " m</strong>. Look carefully at what changed (the angle) and what stayed constant (the speed). " +
    "Did the range keep growing as the angle grew?" };
}

/* Activity 1: check the learner's revised predictions */
function checkRevision() {
  const st = state.activities.a1;
  const p1 = document.querySelector('input[name="rev-p1"]:checked');
  const p2 = document.querySelector('input[name="rev-p2"]:checked');
  if (!p1 || !p2) {
    st.feedback = { ok: false, text: "Please choose an answer for both revised predictions." };
    return;
  }
  st.attempts++;
  state.revised = { p1: p1.value, p2: p2.value };

  if (p1.value === TRUE_PREDICTION.p1 && p2.value === TRUE_PREDICTION.p2) {
    st.done = true;
    st.needsRevision = false;
    resolveMisconception("M1");
    st.feedback = { ok: true, text: "🌟 Well done for changing your mind based on evidence. That is real science! " +
      "The range increased from 30° to 45°, then decreased from 45° to 70°." };
    st.explain = "💡 <strong>Why?</strong> A steeper launch stays in the air longer but moves sideways more slowly. " +
      "Up to 45° the extra time wins; after 45° the slower sideways speed wins. So a bigger angle does NOT always mean a bigger range.";
  } else {
    st.feedback = { ok: false, text: "You're getting closer. Here is a hint: compare the 45° chip with the 70° chip. " +
      "Which number is bigger? You can launch them again and watch where each lands." };
  }
}

/* Activities 2–3: multiple-choice questions */
function checkQuestion(actKey, qId) {
  const act = ACTIVITIES.find(function (a) { return a.key === actKey; });
  const q = act.questions.find(function (x) { return x.id === qId; });
  const qs = state.activities[actKey].questions;
  const st = qs[qId] || (qs[qId] = { answer: null, attempts: 0, correct: false, firstTry: false, feedback: null });

  const chosen = document.querySelector('input[name="' + actKey + "-" + qId + '"]:checked');
  if (!chosen) { st.feedback = "Please choose one option first."; return; }

  st.answer = chosen.value;
  st.attempts++;

  if (st.answer === q.correct) {
    st.correct = true;
    st.firstTry = st.attempts === 1;
    st.feedback = st.firstTry
      ? "🌟 Great observation! Your answer matches the evidence."
      : "🌟 Well done! You looked at the evidence again and found the pattern.";
    // Correct after a misconception → resolved
    Object.keys(q.misconception).forEach(function (k) { resolveMisconception(q.misconception[k]); });
  } else {
    const mis = q.misconception[st.answer];
    if (mis) markMisconception(mis, "Lab: chose \"" + q.options.find(function (o) { return o.v === st.answer; }).t + "\"");
    // 1st wrong try: acknowledge + inspect. 2nd+: stronger hint + suggested experiment
    st.feedback = st.attempts === 1
      ? q.feedback[st.answer] + " Then try again."
      : "💛 Keep going, you're doing real science. " + q.hint2;
  }

  // Activity done when every question is correct
  state.activities[actKey].done = act.questions.every(function (x) {
    return qs[x.id] && qs[x.id].correct;
  });
}


/* ==============================================================
   11. OBSERVATION SCREEN
   ============================================================== */
function renderComparisonTable() {
  const body = $("compare-body");
  if (state.experiments.length === 0) {
    body.innerHTML = '<tr><td colspan="6" class="muted">No experiments yet.</td></tr>';
    return;
  }
  const best = Math.max.apply(null, state.experiments.map(function (e) { return e.range; }));
  body.innerHTML = state.experiments.map(function (e, i) {
    const isBest = Math.abs(e.range - best) < 0.005;
    return '<tr class="' + (isBest ? "best" : "") + '">' +
      '<td><span class="swatch" style="background:' + COLORS[i % COLORS.length] + '"></span>#' + e.id + "</td>" +
      "<td>" + e.angle + "°</td><td>" + e.speed + " m/s</td>" +
      "<td>" + e.range.toFixed(2) + " m" + (isBest ? " ⭐" : "") + "</td>" +
      "<td>" + e.height.toFixed(2) + " m</td><td>" + e.time.toFixed(2) + " s</td></tr>";
  }).join("");
}

/* Activity 4: save both notes. Returns true if OK. */
function saveNotes() {
  const pattern = $("observation-text").value.trim();
  const diff = $("diff-text").value.trim();
  if (pattern.length < 5 || diff.length < 5) {
    showMessage("observation-feedback", "✏️ Please write a short answer in both boxes. One sentence each is enough.");
    return false;
  }
  state.observation = pattern;
  state.difference = diff;
  state.notesSaved = true;
  saveState();
  showMessage("observation-feedback",
    "💛 Thank you! Noticing the difference between what you expected and what happened is exactly how scientists learn.", true);
  return true;
}


/* ==============================================================
   12. CONCEPT SCREEN
   Uses the learner's own lab data where available.
   ============================================================== */
function renderConcept() {
  const r30 = rangeOf(30, 20), r45 = rangeOf(45, 20), r60 = rangeOf(60, 20), r10 = rangeOf(45, 10);
  $("concept-data-45").textContent = r45 !== null ? "In your lab: 45° at 20 m/s → " + r45.toFixed(2) + " m (your longest)." : "";
  $("concept-data-comp").textContent = (r30 !== null && r60 !== null)
    ? "In your lab: 30° → " + r30.toFixed(2) + " m and 60° → " + r60.toFixed(2) + " m." : "";
  $("concept-data-speed").textContent = (r10 !== null && r45 !== null)
    ? "In your lab: " + r10.toFixed(2) + " m → " + r45.toFixed(2) + " m (× " + (r45 / r10).toFixed(1) + ")." : "";

  // Bar chart of range vs angle at 20 m/s
  const angles = [15, 30, 45, 60, 75, 90];
  const max = Physics.range(20, 45);
  $("range-chart").innerHTML = angles.map(function (a) {
    const r = clean(Physics.range(20, a));
    const cls = a === 45 ? "best" : (a === 30 || a === 60 ? "pair" : "");
    return '<div class="bar ' + cls + '"><span class="bar-val">' + r.toFixed(1) + ' m</span>' +
      '<div class="bar-fill" style="height:' + Math.max(2, (r / max) * 120) + 'px"></div>' +
      '<span class="bar-label">' + a + "°</span></div>";
  }).join("") ;
  if (!$("chart-key")) {
    $("range-chart").insertAdjacentHTML("afterend",
      '<p class="chart-key" id="chart-key"><span style="background:var(--primary)"></span>maximum (45°)' +
      '<span style="background:var(--accent)"></span>complementary pair (30° and 60°)</p>');
  }
}


/* ==============================================================
   13. HINT ENGINE
   ------------------------------------------------------------
   IMPORTANT (honest labelling): by default this is a RULE-BASED
   hint engine. It builds the exact tutor prompt from the learner's
   data (so it could be sent to an AI model), but it does NOT call
   a live AI model unless CONFIG.AI_ENDPOINT points to your own
   backend. API keys must never be placed in this file.
   ============================================================== */
function hintContext() {
  const last = state.experiments[state.experiments.length - 1];
  const act = currentActivity();
  const mis = activeMisconception();
  return {
    angle: last ? last.angle : Number($("angle-slider").value),
    speed: last ? last.speed : Number($("speed-slider").value),
    range: last ? last.range.toFixed(2) + " m" : "no launch yet",
    prediction: "30°→45°: " + (PREDICTION_TEXT[state.prediction] || "none") +
      "; 45°→70°: " + (PREDICTION_TEXT[state.prediction2] || "none"),
    activity: act ? act.title : "All lab activities complete",
    activityKey: act ? act.key : null,
    misconception: mis ? MISCONCEPTIONS[mis] : "none identified",
    misconceptionId: mis
  };
}

/* The prompt that would be sent to an AI model */
function buildHintPrompt(c) {
  return "You are a supportive Class 11 Physics tutor. The learner is anxious and has previously struggled with projectile motion.\n" +
    "Their current launch angle is " + c.angle + "°.\n" +
    "Their initial velocity is " + c.speed + " m/s.\n" +
    "Their observed range is " + c.range + ".\n" +
    "Their prediction was: " + c.prediction + ".\n" +
    "Current activity: " + c.activity + ".\n" +
    "Identified misconception: " + c.misconception + ".\n" +
    "Give one short guiding hint that encourages the learner to inspect the experimental evidence.\n" +
    "Do not reveal the final answer immediately.\n" +
    "Use simple English, supportive language and encourage further experimentation.";
}

/* Rule-based fallback: picks a hint from the learner's situation */
function ruleBasedHint(c) {
  const start = state.experiments.length
    ? "At " + c.angle + "° and " + c.speed + " m/s you got " + c.range + ". "
    : "";

  if (state.experiments.length === 0) {
    return "Let's start small: set 30° and 20 m/s and press Launch. Watch where the ball lands. That is your first piece of evidence.";
  }

  if (c.activityKey) {
    const act = ACTIVITIES.find(function (a) { return a.key === c.activityKey; });
    const missing = act.trials.filter(function (t) { return !hasTrial(t[0], t[1]); });
    if (missing.length) {
      return start + "For " + act.title.split("·")[0].trim() + " you still need a launch at " +
        missing[0][0] + "° and " + missing[0][1] + " m/s. Tap its grey chip, then Launch.";
    }
    if (c.misconceptionId === "M1") {
      return start + "Look at the R values for 45° and for a steeper angle like 60° or 70°. Did the steeper launch really go further, or just higher?";
    }
    if (c.misconceptionId === "M2") {
      return start + "Compare two changes: how much did the range grow when you changed the angle, and how much when you doubled the speed?";
    }
    if (c.activityKey === "a1") {
      return start + "Line up your three ranges in order of angle: 30°, 45°, 70°. Does the range keep growing all the way?";
    }
    if (c.activityKey === "a2") {
      return start + "Turn Compare on. Which two paths land almost at the same spot? What do their angles add up to?";
    }
    if (c.activityKey === "a3") {
      return start + "Divide the range at 20 m/s by the range at 10 m/s. Is the answer 2, or something else?";
    }
  }
  return start + "Great work so far! Look at your experiment table: which launch has the ⭐, and what was its angle?";
}

/* Safety check for any AI reply before showing it */
function isSafeHint(text) {
  if (typeof text !== "string") return false;
  const t = text.trim();
  if (t.length < 10 || t.length > 300) return false;
  // Do not let the AI give away the key answers directly
  if (/45\s*°?\s*(gives|is|produces).{0,20}(max|greatest|largest)/i.test(t)) return false;
  if (/four times|4 times|×\s*4/i.test(t)) return false;
  return true;
}

async function onGetHint() {
  const c = hintContext();
  const prompt = buildHintPrompt(c);
  let hint = null, source = "rule";

  if (CONFIG.AI_ENDPOINT) {
    try {
      const res = await fetch(CONFIG.AI_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt })
      });
      const data = await res.json();
      if (res.ok && isSafeHint(data.hint)) { hint = data.hint.trim(); source = "ai"; }
    } catch (e) { /* fall back below */ }
  }
  if (!hint) hint = ruleBasedHint(c);

  state.hintsUsed++;
  saveState();

  $("hint-output").textContent = "💡 " + hint;
  $("hint-output").hidden = false;
  $("hint-label").textContent = source === "ai"
    ? "Hint generated by an AI model through the teacher's server, then safety-checked."
    : "Rule-based hint (demonstration). No live AI model was called. The hint is chosen by rules using your experiment data.";
  $("hint-prompt").textContent = prompt;
  $("hint-prompt-box").hidden = false;
}


/* ==============================================================
   14. KNOWLEDGE CHECK (QUIZ)
   6 questions · 2 formats (multiple choice + numerical)
   ============================================================== */
const QUIZ = [
  {
    id: "q1", type: "mcq",
    text: "For a fixed launch speed (ideal model), which angle gives the maximum horizontal range?",
    options: [{ v: "30", t: "30°" }, { v: "45", t: "45°" }, { v: "60", t: "60°" }, { v: "90", t: "90°" }],
    correct: "45",
    misconception: { "60": "M1", "90": "M1" },
    feedback: {
      "30": "Good try. In your lab, did 30° land furthest? Check your table.",
      "60": "60° goes higher, but does it go further? Compare 45° and 60° in your table.",
      "90": "At 90° the ball goes straight up. Where does it land?"
    },
    hint: "Look for the ⭐ row in your Observation table.",
    model: "45°, because sin(2θ) is largest (= 1) when 2θ = 90°."
  },
  {
    id: "q2", type: "mcq",
    text: "A ball launched at 25° has a certain range. At the same speed, which other angle gives the SAME range?",
    options: [{ v: "50", t: "50°" }, { v: "65", t: "65°" }, { v: "75", t: "75°" }],
    correct: "65",
    misconception: {},
    feedback: {
      "50": "Nice try. Doubling the angle is a common idea. Think about 30° and 60°: what do they add up to?",
      "75": "Close! Think about 30° and 60°: what do they add up to?"
    },
    hint: "Complementary angles add up to 90°.",
    model: "65°, because 25° + 65° = 90° (complementary angles give equal range)."
  },
  {
    id: "q3", type: "num", unit: "m",
    text: "Calculate the range for u = 20 m/s and θ = 30°. Use g = 9.8 m/s². (Answer in metres, 1 decimal place is fine.)",
    correct: 35.35, tolerance: 0.5,
    hint: "Use R = u² sin(2θ) / g. Here 2θ = 60° and sin 60° ≈ 0.866.",
    model: "R = 20² × sin 60° / 9.8 = 400 × 0.866 / 9.8 ≈ 35.35 m"
  },
  {
    id: "q4", type: "num", unit: "m",
    text: "At 10 m/s a ball has a range of 8 m. The angle stays the same and the speed becomes 20 m/s. What is the new range?",
    correct: 32, tolerance: 0.5,
    misconceptionValue: { value: 16, id: "M2" },
    hint: "Range depends on u². If u doubles, what happens to u²?",
    model: "32 m. The speed doubled, so the range is 2² = 4 times bigger: 8 × 4 = 32 m."
  },
  {
    id: "q5", type: "mcq",
    text: "At the same speed, the launch angle changes from 45° to 75°. What happens to the range?",
    options: [{ v: "inc", t: "It increases" }, { v: "dec", t: "It decreases" }, { v: "same", t: "It stays the same" }],
    correct: "dec",
    misconception: { inc: "M1" },
    feedback: {
      inc: "Many people think a bigger angle always goes further. Remember your 70° launch in Activity 1. How did it compare with 45°?",
      same: "Good try. Is 75° complementary to 45°? (They would need to add up to 90°.)"
    },
    hint: "45° is the maximum. Moving away from 45° in either direction does what to the range?",
    model: "It decreases. 75° is past 45°, so the range is smaller (75° gives the same range as 15°)."
  },
  {
    id: "q6", type: "mcq",
    text: "Which statement is correct (ideal model)?",
    options: [
      { v: "both", t: "Doubling the speed and doubling the angle both double the range" },
      { v: "right", t: "Doubling the speed makes the range 4 times bigger; changing 30° → 60° keeps the range the same" },
      { v: "none", t: "Neither speed nor angle affects the range" }
    ],
    correct: "right",
    misconception: { both: "M2" },
    feedback: {
      both: "Thank you for trying. Look back at Activity 3: did speed and angle change the range in the same way?",
      none: "Look at your experiment table. Did the range change when you changed speed or angle?"
    },
    hint: "Remember Activity 2 (30° vs 60°) and Activity 3 (10 vs 20 m/s).",
    model: "Doubling the speed → ×4 range (R ∝ u²). 30° and 60° are complementary, so the range is the same."
  }
];

function quizState(id) {
  return state.quiz[id] || (state.quiz[id] = {
    answer: null, attempts: 0, correct: false, firstTry: false, revealed: false, feedback: null
  });
}

function quizComplete() {
  return QUIZ.every(function (q) {
    const st = state.quiz[q.id];
    return st && (st.correct || st.revealed);
  });
}

function quizScore() {
  return QUIZ.filter(function (q) { return state.quiz[q.id] && state.quiz[q.id].firstTry; }).length;
}

function renderQuiz() {
  $("quiz").innerHTML = QUIZ.map(function (q, i) {
    const st = quizState(q.id);
    const finished = st.correct || st.revealed;
    let html = '<div class="card quiz-q ' + (finished ? "done" : "") + '">';
    html += '<span class="q-type">' + (q.type === "mcq" ? "Multiple choice" : "Number answer") + "</span>";
    html += "<h3>Q" + (i + 1) + ". " + q.text + "</h3>";

    if (q.type === "mcq") {
      html += '<div class="options">';
      q.options.forEach(function (o) {
        html += '<label class="option"><input type="radio" name="' + q.id + '" value="' + o.v + '"' +
          (st.answer === o.v ? " checked" : "") + (finished ? " disabled" : "") + "><span>" + o.t + "</span></label>";
      });
      html += "</div>";
    } else {
      html += '<div class="num-row"><input type="number" step="any" id="' + q.id + '-input" value="' +
        (st.answer !== null ? escapeHTML(st.answer) : "") + '"' + (finished ? " disabled" : "") +
        '><span class="unit">' + q.unit + "</span></div>";
    }

    html += '<div class="q-buttons">';
    if (!finished) html += '<button class="btn btn-secondary" data-quiz="' + q.id + '">Check answer</button>';
    if (!finished && st.attempts >= 2) {
      html += '<button class="btn btn-ghost" data-reveal="' + q.id + '">Show model answer</button>';
    }
    html += "</div>";

    if (st.feedback) html += '<div class="feedback ' + (st.correct ? "ok" : "") + '">' + st.feedback + "</div>";
    if (finished) html += '<div class="model-answer"><strong>Model answer:</strong> ' + q.model + "</div>";
    return html + "</div>";
  }).join("");
}

function checkQuiz(id) {
  const q = QUIZ.find(function (x) { return x.id === id; });
  const st = quizState(id);
  let answer, correct;

  if (q.type === "mcq") {
    const chosen = document.querySelector('input[name="' + id + '"]:checked');
    if (!chosen) { st.feedback = "Please choose one option first."; return; }
    answer = chosen.value;
    correct = answer === q.correct;
  } else {
    const raw = $(id + "-input").value.trim();
    if (raw === "" || isNaN(Number(raw))) { st.feedback = "Please type a number first."; return; }
    answer = raw;
    correct = Math.abs(Number(raw) - q.correct) <= q.tolerance;
  }

  st.answer = answer;
  st.attempts++;

  if (correct) {
    st.correct = true;
    st.firstTry = st.attempts === 1;
    st.feedback = st.firstTry ? "🌟 Correct! Well reasoned." : "🌟 Correct! Well done for trying again.";
    // A correct answer on a misconception question shows the idea has changed
    if (q.misconception) Object.keys(q.misconception).forEach(function (k) { resolveMisconception(q.misconception[k]); });
    if (q.misconceptionValue) resolveMisconception(q.misconceptionValue.id);
    return;
  }

  // Not correct yet: misconception check + supportive feedback + hint
  let text;
  if (q.type === "mcq") {
    const mis = q.misconception[answer];
    if (mis) markMisconception(mis, "Quiz " + q.id.toUpperCase() + ": chose \"" +
      q.options.find(function (o) { return o.v === answer; }).t + "\"");
    text = q.feedback[answer] || "Good attempt.";
  } else if (q.misconceptionValue && Math.abs(Number(answer) - q.misconceptionValue.value) < 0.5) {
    markMisconception(q.misconceptionValue.id, "Quiz " + q.id.toUpperCase() + ": answered " + answer +
      " m (treated speed as a simple doubling)");
    text = "Good thinking: you saw that the range grows. But is it exactly double? Remember Activity 3.";
  } else {
    text = "Good attempt. Let's check the working.";
  }
  st.feedback = "💛 " + text + " <br><strong>Hint:</strong> " + q.hint;
}

function onQuizClick(e) {
  const check = e.target.closest("[data-quiz]");
  const reveal = e.target.closest("[data-reveal]");
  if (check) checkQuiz(check.dataset.quiz);
  if (reveal) {
    const st = quizState(reveal.dataset.reveal);
    st.revealed = true;
    st.feedback = "That's okay. Read the model answer, then compare it with your own working.";
  }
  if (check || reveal) {
    hideMessage("quiz-feedback");
    renderQuiz();
    saveState();
  }
}


/* ==============================================================
   15. RESULTS + REFLECTION
   ============================================================== */
function renderResults() {
  const act = activityFirstTryScore();
  const done = activitiesCompleted();
  const quizDone = QUIZ.filter(function (q) {
    const s = state.quiz[q.id]; return s && (s.correct || s.revealed);
  }).length;

  $("res-activities").textContent = done + " / 4";
  $("res-score").textContent = quizScore() + " / " + QUIZ.length;
  $("res-act-score").textContent = act.score + " / " + act.total;
  $("res-experiments").textContent = state.experiments.length;
  $("res-time").textContent = formatTime(state.elapsed) + (state.timeUp ? " ⏰" : "");

  // Progress = completed tasks out of all tasks (4 activities + 6 quiz + reflection)
  const tasksDone = done + quizDone + (state.reflectionSaved ? 1 : 0);
  $("res-progress").textContent = Math.round((tasksDone / 11) * 100) + "%";

  $("res-message").textContent = state.elapsed <= CONFIG.SESSION_SECONDS && !state.timeUp
    ? "You completed the LaunchLab journey inside your 10-minute session. Every experiment you ran was useful evidence."
    : "You completed the LaunchLab journey. Taking extra time to think is completely fine.";

  // Predictions: initial vs revised
  const rows = [
    ["", "Initial", "Revised", "Evidence"],
    ["30° → 45°", PREDICTION_TEXT[state.prediction] || "—",
      state.revised ? PREDICTION_TEXT[state.revised.p1] : "No change needed", "Increases"],
    ["45° → 70°", PREDICTION_TEXT[state.prediction2] || "—",
      state.revised ? PREDICTION_TEXT[state.revised.p2] : "No change needed", "Decreases"]
  ];
  $("res-predictions").innerHTML = rows.map(function (r, i) {
    const tag = i === 0 ? "th" : "td";
    return "<tr>" + r.map(function (c) { return "<" + tag + ">" + c + "</" + tag + ">"; }).join("") + "</tr>";
  }).join("");

  // Misconceptions
  const items = Object.keys(MISCONCEPTIONS).map(function (id) {
    const m = state.misconceptions[id];
    if (!m.detected) {
      return "<li>✅ <strong>" + MISCONCEPTIONS[id] + "</strong>. Not seen in your answers.</li>";
    }
    return "<li>🧭 <strong>" + MISCONCEPTIONS[id] + "</strong>" +
      (m.resolved ? '<span class="tag ok">Revised with evidence ✓</span>' : '<span class="tag work">Worth revisiting</span>') +
      '<br><span class="muted small">' + m.evidence.map(escapeHTML).join(" · ") + "</span></li>";
  });
  $("res-misconceptions").innerHTML = items.join("") +
    '<li class="muted small">Hints used: ' + state.hintsUsed + "</li>";

  // Review of the learner's own work
  let review = "";
  review += reviewItem("Pattern you observed", state.observation);
  review += reviewItem("Different from your prediction", state.difference);
  review += reviewItem("Experiments", state.experiments.map(function (e) {
    return "#" + e.id + " " + e.angle + "° / " + e.speed + " m/s → " + e.range.toFixed(2) + " m";
  }).join(" · "));
  $("res-review").innerHTML = review;

  $("reflection-text").value = state.reflection;
  if (state.reflectionSaved) showReflectionThanks();
}

function reviewItem(label, text) {
  return '<div class="review-item"><strong>' + label + ":</strong><p>" +
    (text ? escapeHTML(text) : '<span class="muted">Not completed</span>') + "</p></div>";
}

function onSubmitReflection() {
  const text = $("reflection-text").value.trim();
  if (text.length < 5) {
    $("reflection-feedback").classList.remove("ok");
    $("reflection-feedback").textContent = "✏️ Please write one sentence about what you understand now.";
    $("reflection-feedback").hidden = false;
    return;
  }
  state.reflection = text;
  state.reflectionSaved = true;
  saveState();
  renderResults();
}

function showReflectionThanks() {
  $("reflection-feedback").classList.add("ok");
  $("reflection-feedback").innerHTML = "💛 <strong>Thank you for reflecting!</strong> You predicted, experimented, " +
    "looked at evidence and changed your ideas where needed. That is exactly how physicists think. " +
    "You should be proud of this session.";
  $("reflection-feedback").hidden = false;
}


/* ==============================================================
   16. 10-MINUTE SESSION TIMER + PAUSE/RESUME
   The timer starts when the learner presses Start. It does NOT
   restart when moving between screens, and the remaining time is
   saved every second.
   ============================================================== */
let timerId = null;

function startSession() {
  if (!state.started) {
    state.started = true;
    state.secondsLeft = CONFIG.SESSION_SECONDS;
  }
  $("btn-session-pause").disabled = false;
  if (!timerId) timerId = setInterval(tick, 1000);
}

function tick() {
  if (!state.started || state.paused || state.finished) return;
  state.elapsed++;
  if (!state.timeUp) {
    state.secondsLeft--;
    if (state.secondsLeft <= 0) {
      state.secondsLeft = 0;
      state.timeUp = true;
      $("timeup-overlay").hidden = false;
    }
  }
  updateTimerDisplay();
  saveState();
}

function updateTimerDisplay() {
  const timer = $("timer");
  timer.classList.remove("warn", "over");
  if (state.timeUp) {
    $("timer-display").textContent = "Time up";
    timer.classList.add("over");
  } else {
    $("timer-display").textContent = formatTime(state.secondsLeft);
    if (state.started && state.secondsLeft <= 120) timer.classList.add("warn");
  }
  if (state.finished) $("timer-display").textContent = "✓ " + formatTime(state.elapsed);
  $("btn-session-pause").disabled = !state.started || state.finished;
}

function pauseSession(title, text) {
  if (!state.started || state.finished) return;
  state.paused = true;
  if (Sim.running && !Sim.paused) onPause();      // freeze the ball too
  $("pause-title").textContent = title || "Session paused";
  $("pause-text").textContent = text || "Take a breath. Your progress and time are saved.";
  $("pause-time").textContent = state.timeUp ? "Time up" : formatTime(state.secondsLeft);
  $("pause-overlay").hidden = false;
  saveState();
}

function resumeSession() {
  state.paused = false;
  $("pause-overlay").hidden = true;
  if (Sim.running && Sim.paused) onPause();
  startSession();
  saveState();
}


/* ==============================================================
   17. RESTORE + INITIALISE
   ============================================================== */

/* Put saved answers back into the form fields */
function restoreInputs() {
  document.querySelectorAll('input[name="prediction"]').forEach(function (r) { r.checked = r.value === state.prediction; });
  document.querySelectorAll('input[name="prediction2"]').forEach(function (r) { r.checked = r.value === state.prediction2; });
  $("observation-text").value = state.observation;
  $("diff-text").value = state.difference;
  $("reflection-text").value = state.reflection;
  if (state.notesSaved) {
    showMessage("observation-feedback", "💛 Your notes are saved.", true);
  }
}

function onSubmitPrediction() {
  // After Activity 1 has checked them, the initial predictions are fixed
  if (state.activities.a1.feedback) { showScreen(state.currentStep + 1); return; }
  const p1 = document.querySelector('input[name="prediction"]:checked');
  const p2 = document.querySelector('input[name="prediction2"]:checked');
  state.prediction = p1 ? p1.value : null;
  state.prediction2 = p2 ? p2.value : null;
  if (!canLeaveScreen(state.currentStep)) return;
  hideMessage("prediction-feedback");
  showScreen(state.currentStep + 1);
}

function onStart() {
  startSession();
  goNext();
}

/* Wipe everything and start again */
function resetEverything(askFirst) {
  if (askFirst && !confirm("Start a new session? This clears all saved progress on this device.")) return;
  clearSavedState();
  location.reload();
}

function init() {
  showIdentityToken();
  renderSessionPlan();
  Sim.init();

  // Navigation
  document.querySelectorAll("[data-nav]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (btn.dataset.nav === "next") goNext(); else goBack();
    });
  });
  $("btn-start").addEventListener("click", onStart);
  $("btn-submit-prediction").addEventListener("click", onSubmitPrediction);
  document.querySelectorAll('input[name="prediction"], input[name="prediction2"]').forEach(function (r) {
    r.addEventListener("change", function () {
      hideMessage("prediction-feedback");
      const p1 = document.querySelector('input[name="prediction"]:checked');
      const p2 = document.querySelector('input[name="prediction2"]:checked');
      // Predictions can only be changed until Activity 1 has been checked
      if (!state.activities.a1.feedback) {
        state.prediction = p1 ? p1.value : null;
        state.prediction2 = p2 ? p2.value : null;
        saveState();
      }
    });
  });

  // Lab
  linkControl("angle-slider", "angle-input");
  linkControl("speed-slider", "speed-input");
  $("btn-launch").addEventListener("click", onLaunch);
  $("btn-pause").addEventListener("click", onPause);
  $("btn-reset").addEventListener("click", onReset);
  $("btn-compare").addEventListener("click", onCompare);
  $("activities").addEventListener("click", onActivitiesClick);
  $("btn-hint").addEventListener("click", onGetHint);

  // Observation
  $("btn-save-notes").addEventListener("click", saveNotes);
  ["observation-text", "diff-text"].forEach(function (id) {
    $(id).addEventListener("input", function () {
      state.observation = $("observation-text").value;
      state.difference = $("diff-text").value;
      saveState();
    });
  });

  // Quiz + results
  $("quiz").addEventListener("click", onQuizClick);
  $("btn-submit-reflection").addEventListener("click", onSubmitReflection);
  $("reflection-text").addEventListener("input", function () {
    state.reflection = $("reflection-text").value;
    saveState();
  });

  // Session controls
  $("btn-session-pause").addEventListener("click", function () { pauseSession(); });
  $("btn-resume").addEventListener("click", resumeSession);
  $("btn-timeup-continue").addEventListener("click", function () { $("timeup-overlay").hidden = true; });
  $("btn-timeup-results").addEventListener("click", function () {
    $("timeup-overlay").hidden = true;
    showScreen(CONFIG.screens.length - 1);
  });
  $("btn-restart").addEventListener("click", function () { resetEverything(true); });
  $("btn-reset-session").addEventListener("click", function () { resetEverything(true); });

  // Restore a saved session, if there is one
  const restored = loadState();
  restoreInputs();
  showScreen(state.currentStep);
  if (restored && state.started) {
    startSession();
    if (!state.finished) {
      pauseSession("Welcome back! 👋", "Your progress was saved. You will continue from the " +
        CONFIG.screens[state.currentStep].label + " step.");
    }
  }
  updateTimerDisplay();
}

document.addEventListener("DOMContentLoaded", init);
