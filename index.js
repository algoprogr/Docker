const express = require('express');
const path = require('path');
const app = express();
const port = 7860;

// Tell Express to serve files from a folder named "public"
app.use(express.static('public'));

// The API route you already have
app.get('/api', (req, res) => {
  res.json({ status: "success", message: "Container is LIVE!", time: new Date() });
});

// Serve the UI (index.html) when someone visits the main URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => console.log(`UI running on http://localhost:${port}`));
