// index.js

// ─────────── Imports & Firebase Init ───────────
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

// Database integration via our serverless API
async function callVoteAPI(method, data) {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error("Not signed in");
  const token = await user.getIdToken();

  const res = await fetch('/api/vote', {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: data ? JSON.stringify(data) : undefined
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return res.json();
}

// ─────────── Firebase App + Auth only ───────────
const firebaseConfig = {
  apiKey: "AIzaSyAAjM5tVDJ5ynaoN-Ju3TgbsfXm0lBEbVI",
  authDomain: "honmoon-kpop.firebaseapp.com",
  projectId: "honmoon-kpop",
};
initializeApp(firebaseConfig);
const auth = getAuth();

// ─────────── DOM References ───────────
const container        = document.getElementById('splitmoon-container');
const particlesDiv     = container.querySelector('.particles');
const sajaBtn          = document.getElementById('vote-saja');
const huntrixBtn       = document.getElementById('vote-huntrix');
const kaasaCountEl     = document.getElementById('saja-count');
const huntrixCountEl   = document.getElementById('huntrix-count');
const fanmoonDiv       = document.getElementById('fanmoon');
const riftSVG          = document.querySelector('.rift-svg');
const glitterOverlay   = fanmoonDiv.querySelector('.huntrix-overlay');
const glitterDots      = fanmoonDiv.querySelector('.huntrix-glitter');
const highlightLayer   = fanmoonDiv.querySelector('.huntrix-highlight');

// ─────────── Local State ───────────
let votes = { saja:0, huntrix:0 };
const splitThreshold = 10;
let particleInterval;

// ─────────── Particle Logic ───────────
function spawnParticle() {
  const baseX = 120 + (Math.random()*12 - 6);
  const baseY = 230 + (Math.random()*8 - 4);
  const endX  = 120 + (Math.random()-0.5)*44;
  const endY  = Math.random()*12;

  const span = document.createElement('span');
  span.style.left   = `${baseX/240*100}%`;
  span.style.top    = `${baseY/240*100}%`;
  const size  = Math.random()*4 + 5;
  span.style.width  = span.style.height = `${size}px`;
  const color1 = ['#fff0fa','#ff46c7','#ff0080'][Math.floor(Math.random()*3)];
  const color2 = ['#ff0080','#ff0033','#ff1a53','#e00047'][Math.floor(Math.random()*4)];
  span.style.background = `radial-gradient(circle at 60% 50%,${color1} 25%,${color2} 100%)`;
  span.style.boxShadow   = '0 0 16px 2px #ff1a5377';

  particlesDiv.appendChild(span);
  span.animate([
    { left: `${baseX/240*100}%`, top: `${baseY/240*100}%`, opacity:0.9, filter:'blur(0px)', transform:'scale(1)' },
    { left: `${endX/240*100}%`, top: `${endY/240*100}%`, opacity:0, filter:'blur(10px)', transform:'scale(1.3)' }
  ], { duration:1900, easing:'cubic-bezier(0.46,0.03,0.52,0.96)' });
  setTimeout(() => span.remove(), 1900);
}
function startParticles() { if (!particleInterval) particleInterval = setInterval(spawnParticle, 95); particlesDiv.style.opacity='1'; }
function stopParticles()  { clearInterval(particleInterval); particleInterval = null; particlesDiv.style.opacity='0'; particlesDiv.innerHTML=''; }

// ─────────── Render Moon UI ───────────
function renderMoon(mode) {
  let svgHTML;
  if (mode==='split') {
    // two halves + overlays
    svgHTML = `<svg id="splitmoon-svg" viewBox="0 0 240 240">...split paths...</svg>`;
  } else if (mode==='saja') {
    svgHTML = `<svg id="splitmoon-svg" viewBox="0 0 240 240">...saja circle...</svg>`;
  } else {
    svgHTML = `<svg id="splitmoon-svg" viewBox="0 0 240 240">...huntrix circle...</svg>`;
  }
  container.innerHTML = svgHTML;
}

// ─────────── Update Fanmoon (DB + UI) ───────────
function updateFanmoon() {
  // update counts
  kaasaCountEl.textContent    = votes.saja;
  huntrixCountEl.textContent = votes.huntrix;

  const diff = Math.abs(votes.saja - votes.huntrix);
  let mode;
  if (diff<=splitThreshold && votes.saja!==votes.huntrix) mode='split';
  else if (votes.saja>votes.huntrix) mode='saja';
  else mode='huntrix';

  renderMoon(mode);
  if (mode==='split') startParticles(); else stopParticles();
}

// ─────────── Wire up DB Listeners & Buttons ───────────
signInAnonymously(auth).then(() => {
  const uid = auth.currentUser.uid;
  // global tallies
  onValue(ref(db,'counts'), snap => { votes = snap.val()||{saja:0, huntrix:0}; updateFanmoon(); });
  // cast vote
  sajaBtn.onclick    = () => callVoteAPI('POST',{choice:'saja'});
  huntrixBtn.onclick = () => callVoteAPI('POST',{choice:'huntrix'});
});

// Initial load
updateFanmoon();

