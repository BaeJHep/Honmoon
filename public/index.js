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
const fanmoonDiv      = document.getElementById('fanmoon');
const splitContainer  = document.getElementById('splitmoon-container');
const particlesDiv    = fanmoonDiv.querySelector('.particles');
const riftSvg         = fanmoonDiv.querySelector('.rift-svg');
const huntrixOverlay  = fanmoonDiv.querySelector('.huntrix-overlay');
const huntrixGlitter  = fanmoonDiv.querySelector('.huntrix-glitter');
const huntrixHighlight= fanmoonDiv.querySelector('.huntrix-highlight');

const sajaCountEl     = document.getElementById('saja-count');
const huntrixCountEl  = document.getElementById('huntrix-count');
const sajaBtn         = document.getElementById('vote-saja');
const huntrixBtn      = document.getElementById('vote-huntrix');
const redactBtn       = document.getElementById('redact-vote');
