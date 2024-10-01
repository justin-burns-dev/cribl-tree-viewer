const express = require('express');
const db = require('./db');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

app.get('/api/files', async (_, res) => {
  res.json(await db.getMockFileSystemData())
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});