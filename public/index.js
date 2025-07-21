let flashInterval = null;

async function updateTracker() {
  try {
    const res = await fetch('/api/streams');
    const data = await res.json();

    const honmoon        = document.getElementById('honmoon');
    const statusEl       = document.getElementById('status');
    const sajaScoreEl    = document.getElementById('sajaScore');
    const huntrixScoreEl = document.getElementById('huntrixScore');
    const yourIdolEl     = document.getElementById('yourIdolScore');
    const sodaPopEl      = document.getElementById('sodaPopScore');
    const goldenEl       = document.getElementById('goldenScore');
    const soundsEl       = document.getElementById('soundsScore');

    // Combined scores
    const saja = data.sajaBoysScore;
    const huntrix = data.huntrixScore;
    sajaScoreEl.textContent    = saja  ?? '--';
    huntrixScoreEl.textContent = huntrix ?? '--';

    // Individual scores
    yourIdolEl.textContent = data.scores.yourIdol              ?? '--';
    sodaPopEl.textContent  = data.scores.sodaPop               ?? '--';
    goldenEl.textContent   = data.scores.golden                ?? '--';
    soundsEl.textContent   = data.scores.thisIsWhatItSoundsLike?? '--';

    // Clear any existing flash
    if (flashInterval) {
      clearInterval(flashInterval);
      flashInterval = null;
    }

    // Tie: flash between classes
    if (saja === huntrix) {
      statusEl.textContent = 'TIE';
      let showSaja = false;
      flashInterval = setInterval(() => {
        showSaja = !showSaja;
        honmoon.classList.toggle('strong', !showSaja);
        honmoon.classList.toggle('weak', showSaja);
      }, 1000);
    }
    // No tie: solid state
    else if (huntrix > saja) {
      honmoon.classList.replace('strong','weak');
      statusEl.textContent = 'WEAK';
    } else {
      honmoon.classList.replace('weak','strong');
      statusEl.textContent = 'STRONG';
    }

  } catch (err) {
    console.error('Error fetching stream data:', err);
  }
}

// Initial load + refresh every 15 seconds
updateTracker();
setInterval(updateTracker, 15000);


// Initial load + refresh every 15 seconds
updateTracker();
setInterval(updateTracker, 15000);

