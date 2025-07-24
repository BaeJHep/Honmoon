// streams.js
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

let _token          = null;
let _expiresAt      = 0;

// In-memory cache for scores
let _cachedResult   = null;
let _cacheExpiresAt = 0;
const CACHE_DURATION = 60 * 1000; // 60 seconds

async function getToken() {
  if (_token && Date.now() < _expiresAt) {
    return _token;
  }

  const resp = await axios.post(
    'https://accounts.spotify.com/api/token',
    'grant_type=client_credentials',
    {
      headers: {
        Authorization:
          'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );

  _token     = resp.data.access_token;
  _expiresAt = Date.now() + resp.data.expires_in * 1000;
  return _token;
}

async function fetchScores() {
  // Return cached if still valid
  if (_cachedResult && Date.now() < _cacheExpiresAt) {
    return _cachedResult;
  }

  const token   = await getToken();
  const headers = { Authorization: `Bearer ${token}` };

  // Batch all track IDs in one request
  const ids  = Object.values(TRACK_IDS).join(',');
  const resp = await axios.get(
    `https://api.spotify.com/v1/tracks?ids=${ids}`,
    { headers }
  );

  const tracks = resp.data.tracks;
  const scores = {
    sodaPop:  tracks.find(t => t.id === TRACK_IDS.sodaPop)?.popularity || 0,
    yourIdol: tracks.find(t => t.id === TRACK_IDS.yourIdol)?.popularity || 0,
    golden:   tracks.find(t => t.id === TRACK_IDS.golden)?.popularity   || 0,
    sounds:   tracks.find(t => t.id === TRACK_IDS.sounds)?.popularity   || 0
  };

  const sajaAvg    = Math.round((scores.sodaPop + scores.yourIdol) / 2);
  const huntrixAvg = Math.round((scores.golden + scores.sounds)   / 2);

  const result = { scores, sajaBoysScore: sajaAvg, huntrixScore: huntrixAvg };

  // Cache it
  _cachedResult   = result;
  _cacheExpiresAt = Date.now() + CACHE_DURATION;

  return result;
}

export default async function handler(req, res) {
  try {
    // Try fetching fresh data
    const data = await fetchScores();
    return res.status(200).json(data);
  } catch (err) {
    console.error('Spotify API error:', err.response?.data || err.message);

    if (_cachedResult) {
      // On any error (rate limit, network, etc.), return cached data
      console.warn('Returning cached result due to Spotify error');
      return res.status(200).json(_cachedResult);
    }

    // If there is no cache yet, propagate the error
    return res.status(500).json({ error: 'Spotify API error' });
  }
}


