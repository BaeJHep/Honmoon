const axios = require('axios');

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const ISRC_GOLDEN = 'QZ8BZ2513510';
const ISRC_YOUR_IDOL = 'QZ8BZ2513512';

export default async function handler(req, res) {
  const headers = {
    'X-RapidAPI-Key': RAPIDAPI_KEY,
    'X-RapidAPI-Host': 'spotify-track-streams-playback-count1.p.rapidapi.com',
  };

  try {
    const [goldenRes, idolRes] = await Promise.all([
      axios.get(`https://spotify-track-streams-playback-count1.p.rapidapi.com/streams/isrc/${ISRC_GOLDEN}`, { headers }),
      axios.get(`https://spotify-track-streams-playback-count1.p.rapidapi.com/streams/isrc/${ISRC_YOUR_IDOL}`, { headers }),
    ]);

    const goldenStreams = goldenRes.data?.data?.streamCount || 0;
    const idolStreams = idolRes.data?.data?.streamCount || 0;

    res.status(200).json({
      goldenStreams,
      idolStreams,
      trending: idolStreams > goldenStreams ? 'your idol' : 'golden'
    });
  } catch (error) {
    console.error('API error:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch stream data' });
  }
}
