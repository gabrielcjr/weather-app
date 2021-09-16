import express from 'express';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const PORT = 4000;
const app = express();
const __dirname = path.resolve();

app.get('/', (req, res) => {
  const options = {
    root: path.join(__dirname)
};
  const fileName = 'index.html';
  res.sendFile(fileName, options)
});

import cityRouter from './city.js';
app.use('/api/', cityRouter);



app.listen(PORT, () => console.log(`Running on ${PORT}`));
