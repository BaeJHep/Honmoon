async function updateTracker() {
  try {
    const res = await fetch('/api/streams');
    const data = await res.json();

    const honmoon       = document.getElementById('honmoon');
    const status        = document.getElementById('status');
    const sajaScoreEl   = document.getElementById('sajaScore');
    const huntrixScoreEl= document.getElementById('huntrixScore');
    const yourIdolEl    = document.getElementById('yourIdolScore');
    const sodaPopEl     = document.getElementById('sodaPopScore');
    const goldenEl      = document.getElementById('goldenScore');
    const soundsEl      = document.getElementById('soundsScore');

    // Combined scores
    sajaScoreEl.textContent    = data.sajaBoysScore  ?? '--';
    huntrixScoreEl.textContent = data.huntrixScore   ?? '--';

    // Individual track scores
    yourIdolEl.textContent = data.scores.yourIdol              ?? '--';
    sodaPopEl.textContent  = data.scores.sodaPop               ?? '--';
    goldenEl.textContent   = data.scores.golden                ?? '--';
    soundsEl.textContent   = data.scores.thisIsWhatItSoundsLike?? '--';

    // Honmoon state
    if (data.trending === 'Saja Boys') {
      honmoon.classList.replace('strong','weak');
      status.textContent = 'WEAK';
    } else {
      honmoon.classList.replace('weak','strong');
      status.textContent = 'STRONG';
    }
  } catch (err) {
    console.error('Error fetching stream data:', err);
  }
}

updateTracker();
setInterval(updateTracker, 15000);


// Initial load + refresh every 15 seconds
updateTracker();
setInterval(updateTracker, 15000);

