  fanmoonDiv.classList.toggle('huntrix-win', votes.huntrix > votes.saja);
  fanmoonDiv.classList.toggle('saja-win',    votes.saja > votes.huntrix);

  // 4) Split UI: show rift & particles when close
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
    // Draw the two-tone moon
    splitContainer.innerHTML = renderMoon();

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
