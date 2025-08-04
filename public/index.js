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

  // if you have a renderMoon() from CodePen, call it here:
  // renderMoon(votes);

  // 5) Split UI: show rift SVG & particles when threshold reached
  if (Math.abs(votes.saja - votes.huntrix) <= splitThreshold) {
    riftSvg.style.display        = 'block';
    huntrixOverlay.style.display = 'none';
    huntrixGlitter.style.display = 'none';
    huntrixHighlight.style.display = 'none';
    startParticles();
  } else {
    riftSvg.style.display        = 'none';
    huntrixOverlay.style.display = '';
    huntrixGlitter.style.display = '';
    huntrixHighlight.style.display = '';
    stopParticles();
  }
}

// ─────────── Authenticate & Bootstrap ───────────
signInAnonymously(auth)
  .then(async () => {
    // Initial load: fetch counts & render
    votes = await fetchCounts();
    updateMoon();

    // Bind vote handlers
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
