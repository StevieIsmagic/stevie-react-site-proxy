const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('https://nameless-ravine-33561.herokuapp.com/token.js', (req, res) => {
  request(
    { url: 'https://nameless-ravine-33561.herokuapp.com/token.js' },
    (error, response, body) => {
      if (error || response.statusCode !== 200) {
        return res.status(500).json({ type: 'error', message: err.message });
      }
      console.log("PROXY RES \n", body)
      return body;
    }
  )
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`listening on ${PORT}`));
//❤