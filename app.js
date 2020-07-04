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

const url = `${process.env.LONG_LIVED_TOKEN_REFRESH_URL}${process.env.LONG_LIVED_60_DAY_TOKEN}`

const daysLeft = body => {
  const secondsInADay = 86400;
  const secondsTillTokenExpires = body.expires_in

  console.log("Days Left Till Expire\n",  secondsTillTokenExpires / secondsInADay)
  return secondsTillTokenExpires / secondsInADay;
};

const refresh60DayToken = res => {
  return request(
    { url },
    (error, response, body) => {
      if (error || response.statusCode !== 200) {
        console.log("ERR -", error)
        return response.status(500).json({ type: 'error', message: error.message });
      }
      const parsedBody = JSON.parse(body)
      return res.status(200).send(`Hi Hi. ${Math.floor(daysLeft(parsedBody))} till Instagram Token Expires. Enjoy =)`)
      }
    );
};


app.get('*', (req, res) => {
 return refresh60DayToken(res)

});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`listening on ${PORT}`));
//❤