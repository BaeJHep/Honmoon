import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;

// Allow frontend access
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

// ✅ GOLDEN ROUTE
app.get('/golden', async (req, res) => {
  try {
    const response = await fetch('https://spotify-track-streams-playback-count1.p.rapidapi.com/tracks/spotify_track_streams?spotify_track_id=1CPZ5BxNNd0n0nF4Orb9JS&isrc=QZ8BZ2513510', {
      headers: {
        'x-rapidapi-host': 'spotify-track-streams-playback-count1.p.rapidapi.com',
        'x-rapidapi-key': 'ef16e0854amsh9769731858997eep149822jsnc17a46c91c61'
      }
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch Golden stream count.' });
  }
});

// ✅ YOUR IDOL ROUTE
app.get('/youridol', async (req, res) => {
  try {
    const response = await fetch('https://spotify-track-streams-playback-count1.p.rapidapi.com/tracks/spotify_track_streams?spotify_track_id=6ho0GyrWZN3mhi9zVRW7xi&isrc=CA5KR1821202', {
      headers: {
        'x-rapidapi-host': 'spotify-track-streams-playback-count1.p.rapidapi.com',
        'x-rapidapi-key': 'ef16e0854amsh9769731858997eep149822jsnc17a46c91c61'
      }
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch Your Idol stream count.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
