const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// API route for stream counts
app.get('/api/streams', async (req, res) => {
  const headers = {
    'X-RapidAPI-Key': 'ef16e0854amsh9769731858997eep149822jsnc17a46c91c61', // your real key
    'X-RapidAPI-Host': 'spotify-track-streams-playback-count1.p.rapidapi.com'
  };

  const goldenISRC = 'QZ8BZ2513510';
  const idolISRC = 'QZ8BZ2513512';

  try {
    const [goldenRes, idolRes] = await Promise.all([
      axios.get(`https://spotify-track-streams-playback-count1.p.rapidapi.com/streams/isrc/${goldenISRC}`, { headers }),
      axios.get(`https://spotify-track-streams-playback-count1.p.rapidapi.com/streams/isrc/${idolISRC}`, { headers })
    ]);

    const golden = goldenRes.data?.streams || 0;
    const idol = idolRes.data?.streams || 0;

    res.json({
      goldenStreams: golden,
      idolStreams: idol,
      trending: idol > golden ? 'your idol' : 'golden'
    });

  } catch (error) {
    console.error('Error fetching streams:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch stream data' });
  }
});

// Fallback to frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

