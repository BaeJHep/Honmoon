// index.js

// 1) Firebase App + Auth only
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAAjM5tVDJ5ynaoN-Ju3TgbsfXm0lBEbVI",
  authDomain: "honmoon-kpop.firebaseapp.com",
  projectId: "honmoon-kpop",
};
initializeApp(firebaseConfig);
const auth = getAuth();

// 2) DOM refs
const fanmoon          = document.getElementById('fanmoon');
const glitter          = fanmoon.querySelector('.glitter');
const riftSVG          = document.querySelector('.rift-svg');
const glitterParticles = document.querySelector('.glitter-particles');
const sajaCountEl      = document.getElementById('saja-count');
const huntrixCountEl   = document.getElementById('huntrix-count');

// 3) Local vote state
let myVote = null;        // 'saja' | 'huntrix' | null
let votes  = { saja: 0, huntrix: 0 };

// 4) Helper: call our new API
async function callVoteAPI(method, data) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not signed in");
  const token = await user.getIdToken();
  const res = await fetch('/api/vote', {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: data ? JSON.stringify(data) : undefined
  });
  return res.json();
}

// 5) Update the UI based on myVote & (optionally) global counts
function updateFanmoon() {
  fanmoon.classList.remove('saja', 'huntrix', 'split');
  if (riftSVG)          riftSVG.style.display = 'none';
  if (glitter)          glitter.style.display = 'none';
  if (glitterParticles) glitterParticles.innerHTML = '';

  // simple “split” logic
  const diff = Math.abs(votes.saja - votes.huntrix);
  if (diff <= 10 && votes.saja !== votes.huntrix) {
    fanmoon.classList.add('split');
    if (riftSVG) startBurnParticles(), riftSVG.style.display = 'block';
    if (glitter) glitter.style.display = '';
  }
  else if (votes.huntrix > votes.saja) {
    fanmoon.classList.add('huntrix');
    if (glitter) glitter.style.display = '';
  } else {
    fanmoon.classList.add('saja');
  }

  // show *your* vote count as 1 or 0
  sajaCountEl.textContent    = myVote === 'saja'    ? '1' : '0';
  huntrixCountEl.textContent = myVote === 'huntrix' ? '1' : '0';
}

// (If you still want global tallies, you’d need another API like `/api/voteCount` here.)

// 6) Sign in & wire up
signInAnonymously(auth)
  .then(async () => {
    // 6a) load *your* vote
    const { vote } = await callVoteAPI('GET');
    myVote = vote;
    updateFanmoon();

    // 6b) button handlers
    document.getElementById('vote-saja')
      .addEventListener('click', async () => {
        await callVoteAPI('POST', { choice: 'saja' });
        myVote = 'saja';
        updateFanmoon();
      });

    document.getElementById('vote-huntrix')
      .addEventListener('click', async () => {
        await callVoteAPI('POST', { choice: 'huntrix' });
        myVote = 'huntrix';
        updateFanmoon();
      });

    document.getElementById('redact-vote')
      .addEventListener('click', async () => {
        await callVoteAPI('DELETE');
        myVote = null;
        updateFanmoon();
      });
  })
  .catch(console.error);

// ─────────── Initial Render ───────────
updateFanmoon();
