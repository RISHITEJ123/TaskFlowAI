const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('TaskFlowAI Server Running!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});