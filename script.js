/* ==============================================================
   LaunchLab — script.js
   Stage 1: configuration, identity token, session plan, progress.
   Later stages will add: navigation, simulator, activities,
   timer, saving, hints, quiz and results.
   ============================================================== */

/* ---------- 1. CONFIGURATION ----------
   Change IDENTITY_TOKEN to your roll number. */
const CONFIG = {
  IDENTITY_TOKEN: "[ENTER YOUR ROLL NUMBER]",
  SESSION_SECONDS: 10 * 60,  // the C4 constraint: 10 minutes
  TOTAL_STEPS: 7,

  // The 7 screens in learning order (used for the progress bar)
  steps: [
    "Welcome",
    "Prediction",
    "Experiment Lab",
    "Observation",
    "Concept",
    "Knowledge Check",
    "Results & Reflection"
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

/* ---------- 2. IDENTITY TOKEN ----------
   Writes the token into every element that should show it. */
function showIdentityToken() {
  const ids = ["identity-token", "identity-token-footer"];
  ids.forEach(function (id) {
    const el = document.getElementById(id);
    if (el) el.textContent = CONFIG.IDENTITY_TOKEN;
  });
}

/* ---------- 3. SESSION PLAN ----------
   Builds the 10-minute plan list on the welcome screen. */
function renderSessionPlan() {
  const list = document.getElementById("session-plan");
  if (!list) return;
  list.innerHTML = "";
  CONFIG.sessionPlan.forEach(function (item) {
    const li = document.createElement("li");
    li.innerHTML = '<span class="plan-time">' + item.time + "</span>" + item.label;
    list.appendChild(li);
  });
}

/* ---------- 4. TIMER DISPLAY ----------
   Converts seconds to mm:ss. Countdown starts in Stage 6. */
function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
}

function showTimer(secondsLeft) {
  document.getElementById("timer-display").textContent = formatTime(secondsLeft);
}

/* ---------- 5. PROGRESS BAR ----------
   stepIndex starts at 0 (Welcome). Percentage = completed steps. */
function updateProgress(stepIndex) {
  const percent = Math.round((stepIndex / CONFIG.TOTAL_STEPS) * 100);
  document.getElementById("progress-fill").style.width = percent + "%";
  document.getElementById("progress-percent").textContent = percent + "%";
  document.getElementById("progress-label").textContent =
    "Step " + (stepIndex + 1) + " of " + CONFIG.TOTAL_STEPS + " · " + CONFIG.steps[stepIndex];
}

/* ---------- 6. START BUTTON ----------
   In Stage 2 this will open the Prediction screen. */
function onStartClicked() {
  alert("Great! The Prediction screen will be added in Stage 2.");
}

/* ---------- 7. INITIALISE APP ---------- */
function init() {
  showIdentityToken();
  renderSessionPlan();
  showTimer(CONFIG.SESSION_SECONDS);
  updateProgress(0);
  document.getElementById("btn-start").addEventListener("click", onStartClicked);
}

// Run init once the page has loaded
document.addEventListener("DOMContentLoaded", init);
