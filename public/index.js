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
const container       = document.getElementById('splitmoon-container');
let particlesDiv     = container.querySelector('.particles');
const sajaCountEl    = document.getElementById('saja-count');
const huntrixCountEl = document.getElementById('huntrix-count');
const sajaBtn        = document.getElementById('vote-saja');
const huntrixBtn     = document.getElementById('vote-huntrix');
const redactBtn      = document.getElementById('redact-vote');

let votes = { saja: 0, huntrix: 0 };
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
      <svg id="splitmoon-svg" viewBox="0 0 240 240">
        <defs>
          <clipPath id="leftHalf"><path d="M0,0 L120,0 L120,240 L0,240 Z"/></clipPath>
          <clipPath id="rightHalf"><path d="M120,0 L240,0 L240,240 L120,240 Z"/></clipPath>
          <radialGradient id="huntrixIrr" cx="70%" cy="40%" r="100%">
            <stop offset="0%" stop-color="#fffbe9"/>
            <stop offset="35%" stop-color="#e2c4ff"/>
            <stop offset="65%" stop-color="#b6fff7"/>
            <stop offset="100%" stop-color="#fceeec"/>
          </radialGradient>
          <radialGradient id="sajaFire" cx="35%" cy="60%" r="100%">
            <stop offset="10%" stop-color="#fff0fa"/>
            <stop offset="50%" stop-color="#ff46c7"/>
            <stop offset="80%" stop-color="#ff0080"/>
            <stop offset="100%" stop-color="#8b0058"/>
          </radialGradient>
        </defs>
        <g clip-path="url(#leftHalf)"><circle cx="120" cy="120" r="120" fill="url(#sajaFire)"/></g>
        <g clip-path="url(#rightHalf)"><circle cx="120" cy="120" r="120" fill="url(#huntrixIrr)"/></g>
        <polygon id="riftV" points="110,0 130,0 120,230" fill="#111"/>
      </svg>
      ${createHuntrixOverlays()}
      <div class="particles"></div>
    `;
  } else if (mode === 'saja') {
    html = `
      <svg id="splitmoon-svg" viewBox="0 0 240 240">
        <defs>
          <radialGradient id="sajaFire" cx="35%" cy="60%" r="100%">
            <stop offset="10%" stop-color="#fff0fa"/>
            <stop offset="50%" stop-color="#ff46c7"/>
            <stop offset="80%" stop-color="#ff0080"/>
            <stop offset="100%" stop-color="#8b0058"/>
          </radialGradient>
        </defs>
        <circle cx="120" cy="120" r="120" fill="url(#sajaFire)"/>
      </svg>
    `;
  } else {
    html = `
      <svg id="splitmoon-svg" viewBox="0 0 240 240">
        <defs>
          <radialGradient id="huntrixIrr" cx="70%" cy="40%" r="100%">
            <stop offset="0%" stop-color="#fffbe9"/>
            <stop offset="35%" stop-color="#e2c4ff"/>
            <stop offset="65%" stop-color="#b6fff7"/>
            <stop offset="100%" stop-color="#fceeec"/>
          </radialGradient>
        </defs>
        <circle cx="120" cy="120" r="120" fill="url(#huntrixIrr)"/>
      </svg>
      ${createHuntrixOverlays()}
    `;
  }
  container.innerHTML = html;
  // re-select particlesDiv inside new innerHTML
  particlesDiv = container.querySelector('.particles');
}

async function updateMoon() {
  sajaCountEl.textContent    = votes.saja;
  huntrixCountEl.textContent = votes.huntrix;

  const diff = Math.abs(votes.saja - votes.huntrix);
  let mode = votes.saja > votes.huntrix ? 'saja' : 'huntrix';
  if (diff <= splitThreshold && votes.saja !== votes.huntrix) mode = 'split';

  renderMoon(mode);
  if (mode === 'split') startParticles(); else stopParticles();

  redactBtn.style.display = auth.currentUser ? '' : 'none';
}

// ─────────── Bootstrap ───────────
signInAnonymously(auth)
  .then(async () => {
    votes = await fetchCounts();
    await updateMoon();

    sajaBtn.onclick = async () => {
      await callVoteAPI('POST', { choice: 'saja' });
      votes = await fetchCounts();
      updateMoon();
    };
    huntrixBtn.onclick = async () => {
      await callVoteAPI('POST', { choice: 'huntrix' });
      votes = await fetchCounts();
      updateMoon();
    };
    redactBtn.onclick = async () => {
      await callVoteAPI('DELETE');
      votes = await fetchCounts();
      updateMoon();
    };
  })
  .catch(console.error);

