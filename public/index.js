async function updateTracker() {
  try {
    const res = await fetch('/api/streams');
    const data = await res.json();

    const honmoon = document.getElementById('honmoon');
    const status = document.getElementById('status');

    // Group scores
    document.getElementById('sajaScore').textContent = data.sajaScore;
    document.getElementById('huntrixScore').textContent = data.huntrixScore;

    // Individual song scores
    document.getElementById('idolScore').textContent = data.idol;
    document.getElementById('sodaScore').textContent = data.soda;
    document.getElementById('goldenScore').textContent = data.golden;
    document.getElementById('soundsScore').textContent = data.sounds;

    // Update Honmoon state
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

updateTracker();
setInterval(updateTracker, 15000);
