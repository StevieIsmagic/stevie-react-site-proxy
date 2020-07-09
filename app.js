const express = require('express');
const request = require('request');
const {
  port,
  instagramGraphAPI,
  longLivedToken,
  userDataEndpoint,
  mediaDataEndpoint,
  singleMediaEndpoint
} = require('./config');

// refactor to remove requeste package
// once media id is returned, as opinions on
// how to handle 20 individual media(id) requests
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
  return request({ url: getUserURL }, (error, response, body) => {
    if (error || response.statusCode !== 200) {
      console.log("Get User ERR -", error)
      return response.status(500).json({ type: 'error', message: error.message });
    }
    const parsedBody = JSON.parse(body)
    console.log('GET USER', parsedBody)
  })
}

const getUserMediaIds = token => {
  const getMediaURL = `${mediaDataEndpoint}${token}`;
  return request({ url: getMediaURL }, (error, response, body) => {
    if (error || response.statusCode !== 200) {
      console.log("Media Ids ERR -", error)
      return response.status(500).json({ type: 'error', message: error.message });
    }
    const parsedBody = JSON.parse(body)
    console.log('GET Single MEDIA', parsedBody.data.map(obj => getSingleMediaObject(obj.id)))
      return `Hello there lover .`
  })
}

const getSingleMediaObject = async (id, token) => {
  const singleMediaURL = `https://graph.instagram.com/${id}${singleMediaEndpoint}${token}`;
  return request(
    { url: singleMediaURL },
    (error, response, body) => {
      if (error || response.statusCode !== 200) {
        console.log("single media object ERR -", error)
        return response.status(500).json({ type: 'error', message: error.message });
      }
      const parsedBody = JSON.parse(body)
      console.log('Single Media Object',  parsedBody)
  })
}



const refresh60DayToken = res => {
  const refreshTokenUrl = `${instagramGraphAPI}${longLivedToken}`
  return request(
    { url: refreshTokenUrl },
    (error, response, body) => {
      if (error || response.statusCode !== 200) {
        console.log("60 day token ERR -", error)
        return response.status(500).json({ type: 'error', message: error.message });
      }
      const parsedBody = JSON.parse(body)
      const token = parsedBody.access_token;
      console.log('PARSED BODY',  token)
      getUserMediaIds(token)
      return res.status(200).send(`Hi Hi. ${Math.floor(daysLeft(parsedBody))} days till Instagram token expires. Enjoy =)`)
      }
    );
};


app.get('*', (req, res) => {
 return refresh60DayToken(res)
 // res.send(JSON.stringify({ Hello: ‘World’}));
});

const PORT = port || 3000;
app.listen(PORT, () => console.log(`listening on ${PORT}`));
//❤