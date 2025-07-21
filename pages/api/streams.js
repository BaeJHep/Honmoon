const axios = require('axios');

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

const ISRC_SONGS = {
  sodaPop: 'QZ8BZ2513509',
  yourIdol: 'QZ8BZ2513512',
  golden: 'QZ8BZ2513510',
  thisIsWhatItSoundsLike: 'QZ8BZ2513514'
};

export default async function handler(req, res) {
  const headers = {
    'X-RapidAPI-Key': RAPIDAPI_KEY,
    'X-RapidAPI-Host': 'spotify-track-streams-playback-count1.p.rapidapi.com'
  };

  try {
    const [sodaPopRes, yourIdolRes, goldenRes, thisIsWhatItSoundsLikeRes] = await Promise.all([
      axios.get(`https://spotify-track-streams-playback-count1.p.rapidapi.com/streams/isrc/${ISRC_SONGS.sodaPop}`, { headers }),
      axios.get(`https://spotify-track-streams-playback-count1.p.rapidapi.com/streams/isrc/${ISRC_SONGS.yourIdol}`, { headers }),
      axios.get(`https://spotify-track-streams-playback-count1.p.rapidapi.com/streams/isrc/${ISRC_SONGS.golden}`, { headers }),
      axios.get(`https://spotify-track-streams-playback-count1.p.rapidapi.com/streams/isrc/${ISRC_SONGS.thisIsWhatItSoundsLike}`, { headers })
    ]);

    const getPopularity = (res) => res?.data?.data?.popularity ?? 0;

    const scores = {
      sodaPop: getPopularity(sodaPopRes),
      yourIdol: getPopularity(yourIdolRes),
      golden: getPopularity(goldenRes),
      thisIsWhatItSoundsLike: getPopularity(thisIsWhatItSoundsLikeRes)
    };

    const sajaBoysScore = Math.round((scores.sodaPop + scores.yourIdol) / 2);
    const huntrixScore = Math.round((scores.golden + scores.thisIsWhatItSoundsLike) / 2);

    res.status(200).json({
      scores,
      sajaBoysScore,
      huntrixScore,
      trending: sajaBoysScore > huntrixScore ? 'Saja Boys' : 'Huntr/x'
    });
  } catch (error) {
    console.error('API error:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch stream data' });
  }
}

    console.error('API error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch popularity data' });
  }
}
