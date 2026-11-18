/* ==============================================================
   LaunchLab — script.js
   Stage 2: configuration, identity token, progress, navigation
   between 7 screens, and "no skipping" checks.
   Later stages add: simulator, activities, timer, saving, hints,
   quiz and results.
   ============================================================== */

/* ---------- 1. CONFIGURATION ----------
   Change IDENTITY_TOKEN to your roll number. */
const CONFIG = {
  IDENTITY_TOKEN: "[ENTER YOUR ROLL NUMBER]",
  SESSION_SECONDS: 10 * 60,  // the C4 constraint: 10 minutes

  // The 7 screens in learning order. id = the <section> id in index.html
  screens: [
    { id: "screen-welcome",     label: "Welcome" },
    { id: "screen-prediction",  label: "Prediction" },
    { id: "screen-lab",         label: "Experiment Lab" },
    { id: "screen-observation", label: "Observation" },
    { id: "screen-concept",     label: "Concept" },
    { id: "screen-quiz",        label: "Knowledge Check" },
    { id: "screen-results",     label: "Results & Reflection" }
  ],

  // How the 10 minutes are shared between activities
  sessionPlan: [
    { label: "Welcome",       time: "0.5 min" },
    { label: "Prediction",    time: "1 min" },
    { label: "First launch",  time: "2 min" },
    { label: "Compare",       time: "2 min" },
    { label: "Concept",       time: "1 min" },
    { label: "Quiz",          time: "2 min" },
    { label: "Reflection",    time: "1.5 min" }
  ]
};

/* Friendly text for each prediction choice */
const PREDICTION_TEXT = {
  increase: "The range increases",
  decrease: "The range decreases",
  same: "The range stays the same"
};

/* ---------- 2. APP STATE ----------
   Everything the learner has done is kept in this one object.
   (Stage 6 will save it to LocalStorage.) */
const state = {
  currentStep: 0,        // index into CONFIG.screens
  furthestStep: 0,       // furthest screen reached (for progress dots)
  prediction: null,      // "increase" | "decrease" | "same"
  experiments: [],       // list of experiment results (Stage 3)
  observation: "",
  reflection: ""
};

/* ---------- 3. IDENTITY TOKEN ---------- */
function showIdentityToken() {
  ["identity-token", "identity-token-footer"].forEach(function (id) {
    const el = document.getElementById(id);
    if (el) el.textContent = CONFIG.IDENTITY_TOKEN;
  });
}

/* ---------- 4. SESSION PLAN (welcome screen) ---------- */
function renderSessionPlan() {
  const list = document.getElementById("session-plan");
  list.innerHTML = "";
  CONFIG.sessionPlan.forEach(function (item) {
    const li = document.createElement("li");
    li.innerHTML = '<span class="plan-time">' + item.time + "</span>" + item.label;
    list.appendChild(li);
  });
}

/* ---------- 5. TIMER DISPLAY (countdown in Stage 6) ---------- */
function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
}

function showTimer(secondsLeft) {
  document.getElementById("timer-display").textContent = formatTime(secondsLeft);
}

/* ---------- 6. PROGRESS BAR + STEP DOTS ---------- */
function renderStepDots() {
  const list = document.getElementById("step-dots");
  list.innerHTML = "";
  CONFIG.screens.forEach(function (screen, i) {
    const li = document.createElement("li");
    li.textContent = screen.label;
    if (i < state.currentStep || i < state.furthestStep) li.classList.add("done");
    if (i === state.currentStep) { li.classList.remove("done"); li.classList.add("current"); }
    list.appendChild(li);
  });
}

function updateProgress() {
  const total = CONFIG.screens.length;
  const step = state.currentStep;
  // Last screen = 100%; otherwise based on how many steps are behind us
  const percent = Math.round((step / (total - 1)) * 100);
  document.getElementById("progress-fill").style.width = percent + "%";
  document.getElementById("progress-percent").textContent = percent + "%";
  document.getElementById("progress-label").textContent =
    "Step " + (step + 1) + " of " + total + " · " + CONFIG.screens[step].label;
  renderStepDots();
}

/* ---------- 7. NAVIGATION ----------
   showScreen() hides every <section class="screen"> and shows one.
   No page reload happens. */
function showScreen(stepIndex) {
  document.querySelectorAll(".screen").forEach(function (sec) {
    sec.classList.remove("active");
  });
  document.getElementById(CONFIG.screens[stepIndex].id).classList.add("active");

  state.currentStep = stepIndex;
  state.furthestStep = Math.max(state.furthestStep, stepIndex);
  updateProgress();
  refreshScreen(stepIndex);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* Shows a supportive message in a feedback box */
function showMessage(boxId, text, isOk) {
  const box = document.getElementById(boxId);
  box.textContent = text;
  box.classList.toggle("ok", !!isOk);
  box.hidden = false;
}

function hideMessage(boxId) {
  document.getElementById(boxId).hidden = true;
}

/* ---------- 8. "NO SKIPPING" CHECKS ----------
   Before leaving a screen, we check its key activity is done.
   Returns true if the learner may move forward. */
function canLeaveScreen(stepIndex) {
  const id = CONFIG.screens[stepIndex].id;

  if (id === "screen-prediction" && !state.prediction) {
    showMessage("prediction-feedback",
      "💛 Please choose one answer first. Any guess is fine. We will test it together!");
    return false;
  }

  if (id === "screen-lab" && state.experiments.length === 0) {
    showMessage("lab-feedback",
      "🚀 Try at least one launch first. Your results are the evidence we'll look at next.");
    return false;
  }

  if (id === "screen-observation") {
    const text = document.getElementById("observation-text").value.trim();
    if (text.length < 5) {
      showMessage("observation-feedback",
        "✏️ Write a short note about what you noticed. Even one sentence is great.");
      return false;
    }
    state.observation = text;
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

/* Updates screen content that depends on earlier answers */
function refreshScreen(stepIndex) {
  const id = CONFIG.screens[stepIndex].id;

  if (id === "screen-lab") {
    document.getElementById("lab-prediction-echo").textContent =
      PREDICTION_TEXT[state.prediction] || "—";
    document.getElementById("lab-count").textContent =
      "Experiments run: " + state.experiments.length;
  }

  if (id === "screen-results") {
    document.getElementById("res-prediction").textContent =
      PREDICTION_TEXT[state.prediction] || "—";
    document.getElementById("res-experiments").textContent = state.experiments.length;
  }
}

/* ---------- 9. SCREEN-SPECIFIC BUTTONS ---------- */

// Prediction: save the chosen option, then open the lab
function onSubmitPrediction() {
  const chosen = document.querySelector('input[name="prediction"]:checked');
  state.prediction = chosen ? chosen.value : null;
  if (!canLeaveScreen(state.currentStep)) return;
  hideMessage("prediction-feedback");
  showScreen(state.currentStep + 1);
}

// TEMPORARY (replaced by the real simulator in Stage 3)
function onDemoLaunch() {
  state.experiments.push({ angle: 45, speed: 20 });
  hideMessage("lab-feedback");
  refreshScreen(state.currentStep);
}

// Results: start the whole journey again
function onRestart() {
  if (!confirm("Start the session again from the beginning?")) return;
  state.prediction = null;
  state.experiments = [];
  state.observation = "";
  state.reflection = "";
  state.furthestStep = 0;
  document.querySelectorAll('input[name="prediction"]').forEach(function (r) { r.checked = false; });
  document.getElementById("observation-text").value = "";
  document.getElementById("reflection-text").value = "";
  showScreen(0);
}

/* ---------- 10. INITIALISE APP ---------- */
function init() {
  showIdentityToken();
  renderSessionPlan();
  showTimer(CONFIG.SESSION_SECONDS);

  // Generic Back / Next buttons (any button with data-nav)
  document.querySelectorAll("[data-nav]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (btn.dataset.nav === "next") goNext();
      else goBack();
    });
  });

  document.getElementById("btn-start").addEventListener("click", goNext);
  document.getElementById("btn-submit-prediction").addEventListener("click", onSubmitPrediction);
  document.getElementById("btn-demo-launch").addEventListener("click", onDemoLaunch);
  document.getElementById("btn-restart").addEventListener("click", onRestart);

  // Hide the "please choose" message as soon as an option is picked
  document.querySelectorAll('input[name="prediction"]').forEach(function (r) {
    r.addEventListener("change", function () { hideMessage("prediction-feedback"); });
  });

  showScreen(0);
}

document.addEventListener("DOMContentLoaded", init);
