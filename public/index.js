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
async function callVoteAPI(method, data) {
  const user = auth.currentUser;
  if (!user) throw new Error('Not signed in');
  const token = await user.getIdToken();
  const res = await fetch('/api/vote', {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: data ? JSON.stringify(data) : undefined
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ` + await res.text());
  return res.json();
}

// ─── fetchCounts ────────────────────────────────
let votes = { saja:0, huntrix:0 };
async function fetchCounts() {
  try {
    const c = await fetch('/api/voteCount').then(r => r.json());
    votes = c;
    updateUI();
  } catch (e) {
    console.error('fetchCounts failed:', e);
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


