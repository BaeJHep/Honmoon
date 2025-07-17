const express = require('express');
const cors = require('cors');
const path = require('path'); // <-- ADD THIS

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public'))); // <-- SERVE STATIC FILES

app.get('/api/streams', (req, res) => {
  const golden = Math.floor(Math.random() * 100000);
  const idol = Math.floor(Math.random() * 100000);
  res.json({
    goldenStreams: golden,
    idolStreams: idol,
    trending: idol > golden ? 'your idol' : 'golden'
  });
});

// Default route to serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
