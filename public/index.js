// index.js

let flashInterval = null;

// grab the two elements we need to swap classes on
const wrapper   = document.querySelector('.honmoon-wrapper');
const honmoon   = document.getElementById('honmoon');

// grab all the DOM nodes we’ll update
const statusEl       = document.getElementById('status');
const sajaScoreEl    = document.getElementById('sajaScore');
const huntrixScoreEl = document.getElementById('huntrixScore');
const yourIdolEl     = document.getElementById('yourIdolScore');
const sodaPopEl      = document.getElementById('sodaPopScore');
const goldenEl       = document.getElementById('goldenScore');
const soundsEl       = document.getElementById('soundsScore');

async function updateTracker() {
  try {
    const res = await fetch('/api/streams');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    const saja    = data.sajaBoysScore;
    const huntrix = data.huntrixScore;

    // 1) update the numbers
    sajaScoreEl.textContent    = saja    ?? '--';
    huntrixScoreEl.textContent = huntrix ?? '--';
    yourIdolEl.textContent     = data.scores.yourIdol ?? '--';
    sodaPopEl.textContent      = data.scores.sodaPop  ?? '--';
    goldenEl.textContent       = data.scores.golden   ?? '--';
    soundsEl.textContent       = data.scores.sounds   ?? '--';

    // 2) clear any existing tie-flash
    if (flashInterval) {
      clearInterval(flashInterval);
      flashInterval = null;
    }

    // 3) decide state
    if (saja === huntrix) {
      // ––––– TIE: flash both sphere & rings
      statusEl.textContent = 'TIE';
      let showSaja = false;

      flashInterval = setInterval(() => {
        showSaja = !showSaja;
        // toggle both honmoon and wrapper
        honmoon .classList.toggle('strong', !showSaja);
        honmoon .classList.toggle('weak',    showSaja);
        wrapper .classList.toggle('strong', !showSaja);
        wrapper .classList.toggle('weak',    showSaja);
      }, 1000);
    }
    else if (saja > huntrix) {
      // ––––– SAJA BOYS lead → WEAK (pink)
      statusEl.textContent = 'WEAK';
      honmoon.classList.replace('strong','weak');
      wrapper.classList.replace('strong','weak');
    }
    else {
      // ––––– HUNTR/X lead → STRONG (blue)
      statusEl.textContent = 'STRONG';
      honmoon.classList.replace('weak','strong');
      wrapper.classList.replace('weak','strong');
    }

  } catch (err) {
    console.error('Honmoon Tracker error:', err);
    statusEl.textContent = 'ERROR';
  }
}

// initial load + 15s refresh
updateTracker();
setInterval(updateTracker, 15000);
