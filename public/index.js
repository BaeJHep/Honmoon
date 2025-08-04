// index.js

// ─────────── Imports & Firebase Init ───────────
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAAjM5tVDJ5ynaoN-Ju3TgbsfXm0lBEbVI",
  authDomain: "honmoon-kpop.firebaseapp.com",
  databaseURL: "https://honmoon-kpop-default-rtdb.firebaseio.com",
  projectId: "honmoon-kpop",
};
initializeApp(firebaseConfig);
const auth = getAuth();

// ─────────── Serverless API Helpers ───────────
async function callVoteAPI(method, data) {
  const user = auth.currentUser;
  if (!user) throw new Error('Not signed in');
  const token = await user.getIdToken();
  const res = await fetch('/api/vote', {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: data ? JSON.stringify(data) : undefined,
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

async function fetchCounts() {
  const res = await fetch('/api/voteCount');
  if (!res.ok) throw new Error(`Count API failed ${res.status}`);
  return res.json();
}

// ─────────── DOM References & State ───────────
const fanmoonDiv   = document.getElementById('fanmoon');
const particlesDiv = fanmoonDiv.querySelector('.particles');
const sajaCountEl    = document.getElementById('saja-count');
const huntrixCountEl = document.getElementById('huntrix-count');
const sajaBtn        = document.getElementById('vote-saja');
const huntrixBtn     = document.getElementById('vote-huntrix');
const redactBtn      = document.getElementById('redact-vote');

let votes = { saja: 0, huntrix: 0 };
let hasVoted = false;
const splitThreshold = 10;
let particleInterval;

// ─────────── Particle Logic ───────────
function spawnParticle() {
  const baseX = 120 + (Math.random() * 12 - 6);
  const baseY = 230 + (Math.random() * 8 - 4);
  const endX  = 120 + (Math.random() - 0.5) * 44;
  const endY  = Math.random() * 12;

  const s = document.createElement('span');
  s.style.left      = `${baseX/240*100}%`;
  s.style.top       = `${baseY/240*100}%`;
  const size        = Math.random() * 4 + 5;
  s.style.width     = s.style.height = `${size}px`;
  const color1      = ['#fff0fa','#ff46c7','#ff0080'][Math.floor(Math.random()*3)];
  const color2      = ['#ff0080','#ff0033','#ff1a53','#e00047'][Math.floor(Math.random()*4)];
  s.style.background= `radial-gradient(circle at 60% 50%,${color1} 25%,${color2} 100%)`;
  s.style.boxShadow = '0 0 16px 2px #ff1a5377';

  s.animate([
    { left: `${baseX/240*100}%`, top: `${baseY/240*100}%`, opacity: 0.96, filter: 'blur(0px)',   transform: 'scale(1)' },
    { left: `${endX/240*100}%`,      top: `${endY/240*100}%`,      opacity: 0,    filter: 'blur(10px)', transform: 'scale(1.3)' }
  ], {
    duration: 1900,
    easing: 'cubic-bezier(0.46,0.03,0.52,0.96)'
  });

  particlesDiv.appendChild(s);
  setTimeout(() => s.remove(), 1900);
}

function startParticles() {
  if (!particleInterval) particleInterval = setInterval(spawnParticle, 95);
  particlesDiv.style.opacity = '1';
}

function stopParticles() {
  clearInterval(particleInterval);
  particleInterval = null;
  particlesDiv.style.opacity = '0';
  particlesDiv.innerHTML = '';
}

// ─────────── UI Rendering ───────────
function createHuntrixOverlays() {
  return `
    <div class="huntrix-highlight"></div>
    <div class="huntrix-overlay"></div>
    <div class="huntrix-glitter">
      <span></span><span></span><span></span><span></span><span></span>
    </div>
  `;
}

function updateMoon() {
  // Update vote counts
  sajaCountEl.textContent = votes.saja;
  huntrixCountEl.textContent = votes.huntrix;

  // Show/hide the retract button
  redactBtn.style.display = hasVoted ? 'inline-block' : 'none';

  // Toggle orb classes based on which side is leading
  fanmoonDiv.classList.toggle('huntrix-win', votes.huntrix > votes.saja);
  fanmoonDiv.classList.toggle('saja-win',    votes.saja > votes.huntrix);

  // Start or stop particles based on threshold
  if (Math.abs(votes.saja - votes.huntrix) >= splitThreshold) {
    startParticles();
  } else {
    stopParticles();
  }
}

// ─────────── Authenticate & Bootstrap ───────────
signInAnonymously(auth)
  .then(async () => {
    // Initial fetch and UI render
    votes = await fetchCounts();
    updateMoon();

    // Wire up vote buttons
    sajaBtn.onclick = async () => {
      await callVoteAPI('POST', { choice: 'saja' });
      votes = await fetchCounts();
      hasVoted = true;
      updateMoon();
    };
    huntrixBtn.onclick = async () => {
      await callVoteAPI('POST', { choice: 'huntrix' });
      votes = await fetchCounts();
      hasVoted = true;
      updateMoon();
    };
    redactBtn.onclick = async () => {
      await callVoteAPI('DELETE');
      votes = await fetchCounts();
      hasVoted = false;
      updateMoon();
    };
  })
  .catch(console.error);



