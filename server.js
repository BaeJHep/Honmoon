const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Serve frontend files from /public
app.use(express.static(path.join(__dirname, 'public')));

// API route
app.get('/api/streams', (req, res) => {
  const golden = Math.floor(Math.random() * 100000);
  const idol = Math.floor(Math.random() * 100000);
  res.json({
    goldenStreams: golden,
    idolStreams: idol,
    trending: idol > golden ? 'your idol' : 'golden'
  });
});

// Serve index.html for all other routes (for frontend refresh)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
