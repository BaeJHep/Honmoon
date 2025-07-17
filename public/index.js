async function updateTracker() {
  try {
    const res = await fetch('/api/streams');
    const data = await res.json();

    const honmoon = document.getElementById('honmoon');
    const status = document.getElementById('status');
    const goldenCount = document.getElementById('goldenCount');
    const idolCount = document.getElementById('idolCount');

    // Update popularity scores
    goldenCount.textContent = data.golden.toLocaleString();
    idolCount.textContent   = data.idol.toLocaleString();

    // Update Honmoon strength
    if (data.trending === 'your idol') {
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
