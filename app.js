const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const cors = require('cors');

const app = express();

// app.use(cors());
// app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.get('*', (req, res) => {
  // request(
  //   { url: 'https://nameless-ravine-33561.herokuapp.com/token.js' },
  //   (error, response, body) => {
  //     if (error || response.statusCode !== 200) {
  //       return res.status(500).json({ type: 'error', message: err.message });
  //     }
  //     console.log("PROXY RES \n", body)
  //     return body;
  //   }
  // )
  const url = "https://nameless-ravine-33561.herokuapp.com/token.js"
  request(url).pipe(res.json())


});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`listening on ${PORT}`));
//❤