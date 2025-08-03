// ─────────── Imports & Firebase Init ───────────
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import {
  getDatabase,
  ref,
  onValue,
  set
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAAjM5tVDJ5ynaoN-Ju3TgbsfXm0lBEbVI",
  authDomain: "honmoon-kpop.firebaseapp.com",
  databaseURL: "https://honmoon-kpop-default-rtdb.firebaseio.com",
  projectId: "honmoon-kpop",
  storageBucket: "honmoon-kpop.appspot.com",
  messagingSenderId: "1009037444916",
  appId: "1:1009037444916:web:a54fb2bed4dd8ff21f8761",
  measurementId: "G-KDLM6N65DE"
};

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getDatabase(app);

// ─────────── Cached DOM References ───────────
const fanmoon          = document.getElementById('fanmoon');
const glitter          = fanmoon.querySelector('.glitter');
const riftSVG          = document.querySelector('.rift-svg');
const glitterParticles = document.querySelector('.glitter-particles');
const sajaCountEl      = document.getElementById('saja-count');
const huntrixCountEl   = document.getElementById('huntrix-count');

// ─────────── Local State ───────────
let votes       = { saja: 0, huntrix: 0 };
let burnInterval;

// ─────────── Utility: Update Vote Counters ───────────
function updateVoteCounts() {
  sajaCountEl.textContent    = votes.saja;
  huntrixCountEl.textContent = votes.huntrix;
}

// ─────────── Particle Logic (unchanged) ───────────
function spawnParticle() {
  // ... copy your existing spawnParticle() implementation here ...
}

function startBurnParticles() {
  stopBurnParticles();
  burnInterval = setInterval(spawnParticle, 200);
}

function stopBurnParticles() {
  clearInterval(burnInterval);
}

// ─────────── Main Fanmoon Update ───────────
function updateFanmoon() {
  fanmoon.classList.remove('saja', 'huntrix', 'split');
  if (riftSVG)          riftSVG.style.display = 'none';
  if (glitter)          glitter.style.display = 'none';
  if (glitterParticles) glitterParticles.innerHTML = '';
  stopBurnParticles();

  const diff = Math.abs(votes.saja - votes.huntrix);
  if (diff <= 10 && votes.saja !== votes.huntrix) {
    fanmoon.classList.add('split');
    if (riftSVG) startBurnParticles(), riftSVG.style.display = 'block';
    if (glitter) glitter.style.display = '';
  }
  else if (votes.huntrix > votes.saja) {
    fanmoon.classList.add('huntrix');
    if (glitter) glitter.style.display = '';
  }
  else {
    fanmoon.classList.add('saja');
  }

  updateVoteCounts();
}

// ─────────── Vote Cast Helper ───────────
function castVote(band) {
  // Write your single vote; null removes it
  set(ref(db, `votes/${auth.currentUser.uid}`), band);
}

// ─────────── Wire up Firebase & Buttons ───────────
signInAnonymously(auth)
  .then(() => {
    const uid = auth.currentUser.uid;

    // 1) Listen to global tallies
    onValue(ref(db, 'counts'), snap => {
      const c = snap.val() || {};
      votes.saja    = c.saja    || 0;
      votes.huntrix = c.huntrix || 0;
      updateFanmoon();
    });

    // 2) Listen to *this* user’s vote (to highlight buttons if desired)
    onValue(ref(db, `votes/${uid}`), snap => {
      const vote = snap.val(); // 'saja' | 'huntrix' | null
      // e.g. toggle active styling on your vote buttons here
      console.log("My vote:", vote);
    });

    // 3) Attach vote buttons
    document.getElementById('vote-saja')
            .addEventListener('click', () => castVote('saja'));
    document.getElementById('vote-huntrix')
            .addEventListener('click', () => castVote('huntrix'));
    document.getElementById('redact-vote')
            .addEventListener('click', () => castVote(null));
  })
  .catch(console.error);

// ─────────── Initial Render ───────────
updateFanmoon();
