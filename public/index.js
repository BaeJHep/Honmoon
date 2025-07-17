function updateTracker() {
  fetch('/api/streams')
    .then(res => res.json())
    .then(data => {
      const honmoon = document.getElementById('honmoon');
      const status = document.getElementById('status');
      const golden = document.getElementById('goldenCount');
      const idol = document.getElementById('idolCount');

      if (data.trending === 'your idol') {
        honmoon.classList.remove('strong');
        honmoon.classList.add('weak');
        status.textContent = 'WEAK';
      } else {
        honmoon.classList.remove('weak');
        honmoon.classList.add('strong');
        status.textContent = 'STRONG';
      }

      golden.textContent = data.goldenStreams.toLocaleString();
      idol.textContent = data.idolStreams.toLocaleString();
    })
    .catch(error => {
      console.error('Error fetching stream data:', error);
    });
}

// Initial load + repeat every 15 seconds
updateTracker();
setInterval(updateTracker, 15000);
