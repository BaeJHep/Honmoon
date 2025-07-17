const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// TEMP: Fake stream numbers
app.get('/api/streams', (req, res) => {
  const golden = Math.floor(Math.random() * 100000);
  const idol = Math.floor(Math.random() * 100000);
  res.json({
    goldenStreams: golden,
    idolStreams: idol,
    trending: idol > golden ? 'your idol' : 'golden'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
