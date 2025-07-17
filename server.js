const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Stream data
app.get('/api/streams', async (req, res) => {
  const goldenISRC = 'QZ8BZ2513510';
  const idolISRC = 'QZ8BZ2513512';

  const headers = {
    'X-RapidAPI-Key': 'ef16e0854amsh9769731858997eep149822jsnc17a46c91c61',
    'X-RapidAPI-Host': 'spotify-track-streams-playback-count1.p.rapidapi.com'
  };

  try {
    const [goldenRes, idolRes] = await Promise.all([
      axios.get(`https://spotify-track-streams-playback-count1.p.rapidapi.com/streams/isrc/${goldenISRC}`, { headers }),
      axios.get(`https://spotify-track-streams-playback-count1.p.rapidapi.com/streams/isrc/${idolISRC}`, { headers })
    ]);

    const goldenStreams = goldenRes.data?.streams || 0;
    const idolStreams = idolRes.data?.streams || 0;

    res.json({
      goldenStreams,
      idolStreams,
      trending: idolStreams > goldenStreams ? 'your idol' : 'golden',
      sources: {
        golden: 'https://open.spotify.com/track/1CPZ5BxNNd0n0nF4Orb9JS',
        idol: 'https://open.spotify.com/track/1I37Zz2g3hk9eWxaNkj031'
      }
    });
  } catch (error) {
    console.error('RapidAPI fetch failed:', error?.response?.status, error?.response?.data);
    res.status(500).json({ error: 'Failed to fetch stream data' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
