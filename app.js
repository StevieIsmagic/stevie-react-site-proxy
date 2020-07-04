const express = require('express');
const request = require('request');
const { port, instagramGraphAPI, longLivedToken } = require('./config');


const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

const url = `${instagramGraphAPI}${longLivedToken}`

const daysLeft = body => {
  const secondsInADay = 86400;
  const secondsTillTokenExpires = body.expires_in

  console.log("Days Left Till Expire \n",  secondsTillTokenExpires / secondsInADay)
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
      return res.status(200).send(`Hi Hi. ${Math.floor(daysLeft(parsedBody))} days till Instagram token expires. Enjoy =)`)
      }
    );
};


app.get('*', (req, res) => {
 return refresh60DayToken(res)

});

const PORT = port || 3000;
app.listen(PORT, () => console.log(`listening on ${PORT}`));
//❤