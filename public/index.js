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
const retractBtn       = document.getElementById('redact-vote');

// 3) Local vote state
let myVote = null; // 'saja' | 'huntrix' | null

// 4) Helper: call our new API with error handling
async function callVoteAPI(method, data) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not signed in");
  const token = await user.getIdToken();

  const res = await fetch('/api/vote', {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
    },
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }

  try {
    return await res.json();
  } catch (e) {
    throw new Error(`Invalid JSON response: ${e.message}`);
  }
}

// 5) Update UI: counts, retract button, and orb classes
function updateUI() {
  // vote counts (1 if it's your vote, else 0)
  sajaCountEl.textContent    = myVote === 'saja'    ? '1' : '0';
  huntrixCountEl.textContent = myVote === 'huntrix' ? '1' : '0';

  // show/hide the retract button
  retractBtn.style.display = myVote ? '' : 'none';

  // orb visuals (you can keep your split/particle logic here if you want)
  fanmoon.classList.remove('saja', 'huntrix', 'split');
  if (riftSVG)          riftSVG.style.display = 'none';
  if (glitter)          glitter.style.display = 'none';
  if (glitterParticles) glitterParticles.innerHTML = '';

  if (myVote === 'saja') {
    fanmoon.classList.add('saja');
  } else if (myVote === 'huntrix') {
    fanmoon.classList.add('huntrix');
  }
  // if you still want “split” behavior, you can re-introduce that logic here
}

// 6) Sign in & wire up
signInAnonymously(auth)
  .then(async () => {
    // 6a) Load your existing vote
    try {
      const { vote } = await callVoteAPI('GET');
      myVote = vote; 
    } catch (e) {
      console.error('Failed to load vote:', e);
    }
    updateUI();

    // 6b) Cast a new vote
    document.getElementById('vote-saja')
      .addEventListener('click', async () => {
        try {
          await callVoteAPI('POST', { choice: 'saja' });
          myVote = 'saja';
          updateUI();
        } catch (e) {
          console.error('Vote failed:', e);
        }
      });

    document.getElementById('vote-huntrix')
      .addEventListener('click', async () => {
        try {
          await callVoteAPI('POST', { choice: 'huntrix' });
          myVote = 'huntrix';
          updateUI();
        } catch (e) {
          console.error('Vote failed:', e);
        }
      });

    // 6c) Retract your vote
    retractBtn.addEventListener('click', async () => {
      try {
        await callVoteAPI('DELETE');
        myVote = null;
        updateUI();
      } catch (e) {
        console.error('Retract failed:', e);
      }
    });
  })
  .catch(console.error);

// 7) Initial render (in case signIn is instant)
updateUI();
