const axios = require('axios');

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const GOLDEN_TRACK_ID = '1CPZ5BxNNd0n0nF4Orb9JS';
const IDOL_TRACK_ID = '1I37Zz2g3hk9eWxaNkj031';

let tokenCache = { token: null, expires: 0 };

async function getAccessToken() {
  if (tokenCache.token && Date.now() < tokenCache.expires) {
    return tokenCache.token;
  }
  const resp = await axios({
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      Authorization:
        'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: 'grant_type=client_credentials'
  });
  tokenCache.token = resp.data.access_token;
  tokenCache.expires = Date.now() + resp.data.expires_in * 1000;
  return tokenCache.token;
}

module.exports = async (req, res) => {
  try {
    const token = await getAccessToken();
    const headers = { Authorization: `Bearer ${token}` };
    const [goldenRes, idolRes] = await Promise.all([
      axios.get(`https://api.spotify.com/v1/tracks/${GOLDEN_TRACK_ID}`, { headers }),
      axios.get(`https://api.spotify.com/v1/tracks/${IDOL_TRACK_ID}`, { headers })
    ]);
    const golden = goldenRes.data.popularity || 0;
    const idol = idolRes.data.popularity || 0;
    res.status(200).json({ golden, idol, trending: idol > golden ? 'your idol' : 'golden' });
  } catch (err) {
    console.error('Spotify API error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to fetch Spotify data' });
  }
};

