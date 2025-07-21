import axios from 'axios';

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const HOST = 'spotify-track-streams-playback-count1.p.rapidapi.com';

const ISRC = {
  sodaPop: 'QZ8BZ2513509',
  yourIdol: 'QZ8BZ2513512',
  golden: 'QZ8BZ2513510',
  sounds: 'QZ8BZ2513514'
};

export default async function handler(req, res) {
  const headers = {
    'X-RapidAPI-Key': RAPIDAPI_KEY,
    'X-RapidAPI-Host': HOST
  };

  try {
    const [soda, idol, gold, sounds] = await Promise.all([
      axios.get(`https://${HOST}/streams/isrc/${ISRC.sodaPop}`, { headers }),
      axios.get(`https://${HOST}/streams/isrc/${ISRC.yourIdol}`, { headers }),
      axios.get(`https://${HOST}/streams/isrc/${ISRC.golden}`, { headers }),
      axios.get(`https://${HOST}/streams/isrc/${ISRC.sounds}`, { headers })
    ]);

    const cnt = r => r.data?.data?.streamCount || 0;

    const scores = {
      sodaPop: cnt(soda),
      yourIdol: cnt(idol),
      golden: cnt(gold),
      thisIsWhatItSoundsLike: cnt(sounds)
    };

    const sajaAvg = Math.round((scores.sodaPop + scores.yourIdol) / 2);
    const huntrixAvg = Math.round((scores.golden + scores.thisIsWhatItSoundsLike) / 2);

    res.status(200).json({
      scores,
      sajaScore: sajaAvg,
      huntrixScore: huntrixAvg,
      trending: sajaAvg > huntrixAvg ? 'Saja Boys' : 'Huntr/x'
    });
  } catch (e) {
    console.error('API error:', e.response?.data || e.message);
    res.status(500).json({ error: 'Failed to fetch stream data' });
  }
}


