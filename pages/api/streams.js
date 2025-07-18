import axios from 'axios';

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

const ISRC_CODES = {
  'Soda Pop': 'QZ8BZ2513509',
  'Your Idol': 'QZ8BZ2513512',
  'Golden': 'QZ8BZ2513510',
  'This Is What It Sounds Like': 'QZ8BZ2513514'
};

export default async function handler(req, res) {
  const headers = {
    'X-RapidAPI-Key': RAPIDAPI_KEY,
    'X-RapidAPI-Host': 'spotify-track-streams-playback-count1.p.rapidapi.com'
  };

  try {
    const results = await Promise.all(
      Object.entries(ISRC_CODES).map(async ([name, isrc]) => {
        const response = await axios.get(
          `https://spotify-track-streams-playback-count1.p.rapidapi.com/streams/isrc/${isrc}`,
          { headers }
        );
        return {
          name,
          score: response.data?.data?.popularity || 0
        };
      })
    );

    const sajaBoysSongs = results.filter(song => song.name === 'Soda Pop' || song.name === 'Your Idol');
    const huntrixSongs = results.filter(song => song.name === 'Golden' || song.name === 'This Is What It Sounds Like');

    const sajaBoysTotal = sajaBoysSongs.reduce((sum, song) => sum + song.score, 0);
    const huntrixTotal = huntrixSongs.reduce((sum, song) => sum + song.score, 0);

    res.status(200).json({
      SajaBoys: {
        total: sajaBoysTotal,
        songs: sajaBoysSongs
      },
      Huntrix: {
        total: huntrixTotal,
        songs: huntrixSongs
      },
      trending: sajaBoysTotal > huntrixTotal ? 'Saja Boys' : 'Huntr/x'
    });

  } catch (error) {
    console.error('API error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch popularity data' });
  }
}
