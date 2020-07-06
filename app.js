const express = require('express');
const request = require('request');
const { port, instagramGraphAPI, longLivedToken, userDataEndpoint, mediaDataEndpoint } = require('./config');


const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});


const daysLeft = body => {
  const secondsInADay = 86400;
  const secondsTillTokenExpires = body.expires_in

  console.log("Days Left Till Expire \n",  secondsTillTokenExpires / secondsInADay)
  return secondsTillTokenExpires / secondsInADay;
};

const getUser = token => {
  const getUserURL = `${userDataEndpoint}${token}`;
  console.log("USER URL", getUserURL)
  return request({ url: getUserURL }, (error, response, body) => {
    if (error || response.statusCode !== 200) {
      console.log("USER ERR -", error)
      return response.status(500).json({ type: 'error', message: error.message });
    }
    const parsedBody = JSON.parse(body)
    console.log('GET USER', parsedBody)
  })
}

const getUserMedia = token => {
  const getMediaURL = `${mediaDataEndpoint}${token}`;
  console.log("MEDIA URL", getMediaURL)
  return request({ url: getMediaURL }, (error, response, body) => {
    if (error || response.statusCode !== 200) {
      console.log("MEDIA ERR -", error)
      return response.status(500).json({ type: 'error', message: error.message });
    }
    const parsedBody = JSON.parse(body)
    console.log('GET MEDIA', parsedBody)
      return parsedBody
  })
}

const refresh60DayToken = res => {
  const refreshTokenUrl = `${instagramGraphAPI}${longLivedToken}`
  return request(
    { url: refreshTokenUrl },
    (error, response, body) => {
      if (error || response.statusCode !== 200) {
        console.log("ERR -", error)
        return response.status(500).json({ type: 'error', message: error.message });
      }
      const parsedBody = JSON.parse(body)
      const token = parsedBody.access_token;
      console.log('PARSED BODY',  token)
      getUserMedia(token)
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