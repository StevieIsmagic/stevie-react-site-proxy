const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const cors = require('cors');
const env = require('dotenv').config()

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

const urls = `${process.env.LONG_LIVED_TOKEN_REFRESH_URL}${process.env.LONG_LIVED_60_DAY_TOKEN}`
app.get('*', (req, res) => {
  request(
    { url: urls },
    (error, response, body) => {
      console.log('RESPONSE CODE', response.statusCode)
      if (error || response.statusCode !== 200) {
        console.log("ERR -", error)
        return res.status(500).json({ type: 'error', message: error.message });
      }
      // console.log("PROXY RES \n", body)

      return body;
    }
  )
  
  // request(url).pipe(res.json())


});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`listening on ${PORT}`));
//❤