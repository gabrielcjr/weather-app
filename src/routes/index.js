import express from 'express';
import path from 'path';

const PORT = 4000;
const app = express();
const __dirname = path.resolve();

// This get route will display the static page that will display the input field that will receive the name
// of the city
app.get('/', (req, res) => {
  const options = {
    root: path.join(__dirname)
};
  const fileName = 'index.html';
  res.sendFile(fileName, options)
});

import cityRouter from './city.js';

// This line separates the city route to another module. 
app.use('/api/', cityRouter);

app.listen(PORT, () => console.log(`Running on ${PORT}`));
