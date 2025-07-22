let flashInterval = null;

async function updateTracker() {
  try {
    const res  = await fetch('/api/streams');
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
    const saja    = data.sajaBoysScore;
    const huntrix = data.huntrixScore;

    // Update display values
    sajaScoreEl.textContent    = saja   ?? '--';
    huntrixScoreEl.textContent = huntrix ?? '--';
    yourIdolEl.textContent     = data.scores.yourIdol ?? '--';
    sodaPopEl.textContent      = data.scores.sodaPop  ?? '--';
    goldenEl.textContent       = data.scores.golden   ?? '--';
    soundsEl.textContent       = data.scores.sounds   ?? '--';  // fixed property name

    // Clear any existing flash interval
    if (flashInterval) {
      clearInterval(flashInterval);
      flashInterval = null;
    }

    // Tie → flash between strong/weak
    if (saja === huntrix) {
      statusEl.textContent = 'TIE';
      let showSaja = false;
      flashInterval = setInterval(() => {
        showSaja = !showSaja;
        honmoon.classList.toggle('strong', !showSaja);
        honmoon.classList.toggle('weak', showSaja);
      }, 1000);
    }
    // Saja Boys lead → pink ("weak")
    else if (saja > huntrix) {
      honmoon.classList.replace('strong', 'weak');
      statusEl.textContent = 'WEAK';
    }
    // Huntr/x lead → purple ("strong")
    else {
      honmoon.classList.replace('weak', 'strong');
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

