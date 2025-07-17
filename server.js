const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// REAL stream data from RapidAPI
app.get('/api/streams', async (req, res) => {
  const headers = {
    'X-RapidAPI-Key': 'ef16e0854amsh9769731858997eep149822jsnc17a46c91c61',
    'X-RapidAPI-Host': 'spotify-track-streams-playback-count1.p.rapidapi.com'
  };

  const url = 'https://spotify-track-streams-playback-count1.p.rapidapi.com/streams/isrc/';
  const goldenISRC = 'QZ8BZ2513510';
  const idolISRC = 'QZ8BZ2513512';

  try {
    const [goldenRes, idolRes] = await Promise.all([
      axios.get(url + goldenISRC, { headers }),
      axios.get(url + idolISRC, { headers })
    ]);

    const goldenStreams = goldenRes.data?.data?.streamCount || 0;
    const idolStreams = idolRes.data?.data?.streamCount || 0;

    res.json({
      goldenStreams,
      idolStreams,
      trending: idolStreams > goldenStreams ? 'your idol' : 'golden'
    });
  } catch (error) {
    console.error('Error fetching stream counts:', error);
    res.status(500).json({ error: 'Failed to fetch stream data' });
  }
});

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
