async function updateTracker() {
  try {
    const res = await fetch('/api/streams');
    const data = await res.json();

    const honmoon = document.getElementById('honmoon');
    const status = document.getElementById('status');
    const sajaScoreEl = document.getElementById('sajaScore');
    const huntrixScoreEl = document.getElementById('huntrixScore');

    // Individual song score elements
    const sodaPopEl = document.getElementById('sodaPopScore');
    const yourIdolEl = document.getElementById('yourIdolScore');
    const goldenEl = document.getElementById('goldenScore');
    const soundsLikeEl = document.getElementById('soundsLikeScore');

    // Update combined scores
    sajaScoreEl.textContent = data.sajaBoysScore ?? '--';
    huntrixScoreEl.textContent = data.huntrixScore ?? '--';

    // Update individual scores
    sodaPopEl.textContent = data.scores?.sodaPop ?? '--';
    yourIdolEl.textContent = data.scores?.yourIdol ?? '--';
    goldenEl.textContent = data.scores?.golden ?? '--';
    soundsLikeEl.textContent = data.scores?.thisIsWhatItSoundsLike ?? '--';

    // Update Honmoon strength
    if (data.trending === 'Saja Boys') {
      honmoon.classList.remove('strong');
      honmoon.classList.add('weak');
      status.textContent = 'WEAK';
    } else {
      honmoon.classList.remove('weak');
      honmoon.classList.add('strong');
      status.textContent = 'STRONG';
    }
  } catch (err) {
    console.error('Error fetching stream data:', err);
  }
}

// Initial load + refresh every 15 seconds
updateTracker();
setInterval(updateTracker, 15000);

