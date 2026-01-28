const express = require('express');
const app = express();
const port = 7860; // Port required by Hugging Face

app.get('/', (req, res) => {
  res.send({ status: "success", message: "Container is LIVE!", time: new Date() });
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
