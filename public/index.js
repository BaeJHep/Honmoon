// ===== public/index.js =====
// Combined CodePen UI + DB integration
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAAjM5tVDJ5ynaoN-Ju3TgbsfXm0lBEbVI",
  authDomain: "honmoon-kpop.firebaseapp.com",
  projectId: "honmoon-kpop",
};
initializeApp(firebaseConfig);
const auth = getAuth();

// ─── callVoteAPI ─────────────────────────────────
signInAnonymously(auth).then(async () => {
  // initial load
  votes = await fetchCounts();
  updateFanmoon();

  document.getElementById("vote-saja").onclick = async () => {
    await callVoteAPI("POST", { choice: "saja" });
    votes = await fetchCounts();
    updateFanmoon();
  };
  document.getElementById("vote-huntrix").onclick = async () => {
    await callVoteAPI("POST", { choice: "huntrix" });
    votes = await fetchCounts();
    updateFanmoon();
  };
  document.getElementById("redact-vote").onclick = async () => {
    await callVoteAPI("DELETE");
    votes = await fetchCounts();
    updateFanmoon();
  };
});

// ─── fetchCounts ────────────────────────────────
async function fetchCounts() {
  const res = await fetch("/api/voteCount");
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Count API error ${res.status}: ${text}`);
  }
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Invalid JSON from /api/voteCount: ${text}`);
  }
}

// ─── UI Elements ────────────────────────────────
const container      = document.getElementById('splitmoon-container');
const particlesDiv   = container.querySelector('.particles');
const sajaCountEl    = document.getElementById('saja-count');
const huntrixCountEl = document.getElementById('huntrix-count');
const sajaBtn        = document.getElementById('vote-saja');
const huntrixBtn     = document.getElementById('vote-huntrix');
const retractBtn     = document.getElementById('redact-vote');
let particleInterval;
const splitThreshold = 10;

// ─── Particle Logic ─────────────────────────────
function spawnParticle() {
  /* copy your CodePen spawnParticle implementation here */
}
function startParticles() { if (!particleInterval) particleInterval = setInterval(spawnParticle, 95); particlesDiv.style.opacity = '1'; }
function stopParticles()  { clearInterval(particleInterval); particleInterval = null; particlesDiv.style.opacity = '0'; particlesDiv.innerHTML = ''; }

// ─── renderMoon ────────────────────────────────
function createHuntrixOverlays() {
  return `
    <div class="huntrix-overlay"></div>
    <div class="huntrix-glitter">
      <span></span><span></span><span></span><span></span><span></span>
    </div>
    <div class="huntrix-highlight"></div>
  `;
}

function renderMoon(mode) {
  let html = '';
  if (mode === 'split') {
    html = `
      <svg id="splitmoon-svg" viewBox="0 0 240 240">...defs+split paths...</svg>
      ${createHuntrixOverlays()}
      <div class="particles"></div>
    `;
  } else if (mode === 'saja') {
    html = `<svg id="splitmoon-svg" viewBox="0 0 240 240">...saja circle defs...</svg>`;
  } else {
    html = `
      <svg id="splitmoon-svg" viewBox="0 0 240 240">...huntrix circle defs...</svg>
      ${createHuntrixOverlays()}
    `;
  }
  container.innerHTML = html;
}

// ─── updateUI ──────────────────────────────────
function updateUI() {
  sajaCountEl.textContent    = votes.saja;
  huntrixCountEl.textContent = votes.huntrix;
  const diff = Math.abs(votes.saja - votes.huntrix);
  let mode = votes.saja > votes.huntrix ? 'saja' : 'huntrix';
  if (diff <= splitThreshold && votes.saja !== votes.huntrix) mode = 'split';
  renderMoon(mode);
  if (mode === 'split') startParticles(); else stopParticles();
  retractBtn.style.display = auth.currentUser ? '' : 'none';
}

// ─── Wire Up ──────────────────────────────────
signInAnonymously(auth).then(() => {
  fetchCounts();
  sajaBtn.onclick    = async () => { await callVoteAPI('POST',{choice:'saja'}); await fetchCounts(); };
  huntrixBtn.onclick = async () => { await callVoteAPI('POST',{choice:'huntrix'}); await fetchCounts(); };
  retractBtn.onclick = async () => { await callVoteAPI('DELETE'); await fetchCounts(); };
}).catch(console.error);

// Initial UI render
updateUI();


