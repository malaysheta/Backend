const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello from Models Praacties backend!');
});

app.listen(port, () => {
  console.log(`Models Praacties backend listening at http://localhost:${port}`);
});