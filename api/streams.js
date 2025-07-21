import axios from 'axios';

const clientId     = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

// Your four Spotify track IDs
const TRACK_IDS = {
  sodaPop:  '1CPZ5BxNNd0n0nF4Orb9JS',
  yourIdol: '1I37Zz2g3hk9eWxaNkj031',
  golden:   '1CPZ5BxNNd0n0nF4Orb9JS',           
  sounds:   '5sBDrrtLGbV64QJnEqfjer'           
};

let _token     = null;
let _expiresAt = 0;

async function getToken() {
  if (_token && Date.now() < _expiresAt) return _token;

  const resp = await axios.post(
    'https://accounts.spotify.com/api/token',
    'grant_type=client_credentials',
    {
      headers: {
        Authorization:
          'Basic ' +
          Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );

  _token     = resp.data.access_token;
  _expiresAt = Date.now() + resp.data.expires_in * 1000;
  return _token;
}

export default async function handler(req, res) {
  try {
    const token   = await getToken();
    const headers = { Authorization: `Bearer ${token}` };

    // fetch all four tracks in parallel
    const [soda, idol, gold, sounds] = await Promise.all([
      axios.get(`https://api.spotify.com/v1/tracks/${TRACK_IDS.sodaPop}`,     { headers }),
      axios.get(`https://api.spotify.com/v1/tracks/${TRACK_IDS.yourIdol}`,    { headers }),
      axios.get(`https://api.spotify.com/v1/tracks/${TRACK_IDS.golden}`,      { headers }),
      axios.get(`https://api.spotify.com/v1/tracks/${TRACK_IDS.sounds}`,      { headers })
    ]);

    const popScore = (t) => t.data.popularity || 0;

    const scores = {
      sodaPop:  popScore(soda),
      yourIdol: popScore(idol),
      golden:   popScore(gold),
      sounds:   popScore(sounds)
    };

    const sajaAvg  = Math.round((scores.sodaPop  + scores.yourIdol) / 2);
    const huntrixAvg = Math.round((scores.golden + scores.sounds)   / 2);

    return res.status(200).json({
      scores,
      sajaBoysScore:  sajaAvg,
      huntrixScore:   huntrixAvg,
      trending:       sajaAvg > huntrixAvg ? 'Saja Boys' : 'Huntr/x'
    });
  } catch (err) {
    console.error('Spotify API error:', err.response?.data || err.message);
    return res.status(500).json({ error: 'Spotify API error' });
  }
}


