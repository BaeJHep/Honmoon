// index.js

// 1) Firebase App + Auth
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAAjM5tVDJ5ynaoN-Ju3TgbsfXm0lBEbVI",
  authDomain: "honmoon-kpop.firebaseapp.com",
  projectId: "honmoon-kpop",
};
initializeApp(firebaseConfig);
const auth = getAuth();

// 2) callVoteAPI must be defined *before* any handlers use it
async function callVoteAPI(method, data) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not signed in");
  const token = await user.getIdToken();
  const res = await fetch("/api/vote", {
    method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: data ? JSON.stringify(data) : undefined,
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

// 3) fetchCounts to drive your UI
let votes = { saja: 0, huntrix: 0 };
async function fetchCounts() {
  const res = await fetch("/api/voteCount");
  if (!res.ok) throw new Error("Count API failed");
  return res.json();
}

// 4) Your CodePen UI helpers
function spawnParticle() { /* ... */ }
function startParticles() { /* ... */ }
function stopParticles() { /* ... */ }
function renderMoon(mode) { /* ... */ }
function updateMoon() { /* ... */ }

// 5) Wire up after sign‐in
signInAnonymously(auth).then(async () => {
  // load initial counts + render
  votes = await fetchCounts();
  updateMoon();

  // now these handlers see callVoteAPI!
  document.getElementById("vote-saja").onclick = async () => {
    await callVoteAPI("POST", { choice: "saja" });
    votes = await fetchCounts();
    updateMoon();
  };
  document.getElementById("vote-huntrix").onclick = async () => {
    await callVoteAPI("POST", { choice: "huntrix" });
    votes = await fetchCounts();
    updateMoon();
  };
  document.getElementById("redact-vote").onclick = async () => {
    await callVoteAPI("DELETE");
    votes = await fetchCounts();
    updateMoon();
  };
}).catch(console.error);


