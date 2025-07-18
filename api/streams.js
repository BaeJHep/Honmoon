const axios = require('axios');

module.exports = async (req, res) => {
  const headers = {
    'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
    'X-RapidAPI-Host': 'spotify-track-streams-playback-count1.p.rapidapi.com'
  };

  const url = 'https://spotify-track-streams-playback-count1.p.rapidapi.com/streams/isrc/';
  const isrcs = {
    idol: 'QZ8BZ2513512',
    soda: 'QZ8BZ2513509',
    golden: 'QZ8BZ2513510',
    sounds: 'QZ8BZ2513514'
  };

  try {
    const [idolRes, sodaRes, goldenRes, soundsRes] = await Promise.all([
      axios.get(url + isrcs.idol, { headers }),
      axios.get(url + isrcs.soda, { headers }),
      axios.get(url + isrcs.golden, { headers }),
      axios.get(url + isrcs.sounds, { headers })
    ]);

    const sajaScore = (
      (idolRes.data?.data?.popularity || 0) +
      (sodaRes.data?.data?.popularity || 0)
    ) / 2;

    const huntrixScore = (
      (goldenRes.data?.data?.popularity || 0) +
      (soundsRes.data?.data?.popularity || 0)
    ) / 2;

    res.status(200).json({
      idol: idolRes.data?.data?.popularity || 0,
      soda: sodaRes.data?.data?.popularity || 0,
      golden: goldenRes.data?.data?.popularity || 0,
      sounds: soundsRes.data?.data?.popularity || 0,
      sajaScore: Math.round(sajaScore),
      huntrixScore: Math.round(huntrixScore),
      trending: sajaScore > huntrixScore ? 'Saja Boys' : 'Huntrix'
    });
  } catch (error) {
    console.error('Error fetching stream data:', error);
    res.status(500).json({ error: 'Failed to fetch stream data' });
  }
};
