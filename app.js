const express = require('express');
const fs = require('fs')
const cors = require('cors');

const port = 3000;

const app = express();

app.use(cors());
app.use(express.static('static'));

app.get('/', (req, res) => res.sendFile('/index.html', {root: __dirname }));

app.get('/data', (req, res) => {
  fs.readFile('data/hosting-alexa-web.json', (err, data) => {
    if (err) throw err;

    res.send(data)
  });
})

app.listen(3000, () => {
  console.log('Listening to port 3000');
});
