const express = require('express');
const request = require('request');
const ky = require('ky-universal');
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
// Promise All ?

/* REFACTOR - Remove deprecated 'request' package
use ky + bluebird.js

 function getMediaIDS(token: string){
    return new Promise((resolve, reject) => {
      request(url, (err, res) => {
        if(err){
          return reject(err)
        }
        resolve(res)
      })
    })
  }

*/
const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});


const daysLeft = body => {
  const secondsInADay = 86400;
  const secondsTillTokenExpires = body.expires_in

  console.log("Days Left Till Expire \n",  secondsTillTokenExpires / secondsInADay)
  return Math.floor(secondsTillTokenExpires / secondsInADay);
};

async function getBasicUserData(token) {
  const getUserURL = `${userDataEndpoint}${token}`;
  try {
    const userData = await ky.get(getUserURL).json()
    console.log('\n (2) Basic User Data:', userData)
    return userData
  } catch (err) {
    console.log('\n Get Basic User Data Err:', err)
  }
}

const getUserMediaIds = (token) => {
  const getMediaURL = `${mediaDataEndpoint}${token}`;
  const response = request({ url: getMediaURL }, (error, response, body) => {
    if (error || response.statusCode !== 200) {
      console.log("Media Ids ERR -", error)
      return response.status(500).json({ type: 'error', message: error.message });
    }
    const parsedBody = JSON.parse(body)
    const mediaIdsArray = parsedBody.data.map(obj => obj.id)
    console.log('ids', mediaIdsArray)
    return mediaIdsArray
  })
  return response
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

async function refresh60DayToken() {
  const refreshTokenUrl = `${instagramGraphAPI}${longLivedToken}`
  try {
    const { access_token } = await ky.get(refreshTokenUrl).json()
    console.log('\n (1) Access Token:', access_token)
    return access_token
  } catch (err) {
    console.log('\n Get Token Err:', err)
    //what could we return here ?
  }
}

app.get('/', async (req, res) => {
  // (1) We want to refresh 60 day Token and return it for our API calls to use - refresh60DayToken()
  const token = await refresh60DayToken()
  console.log("\n Token:", token)
  // (2) get basic user data object - getBasicUserData(token)
  const basicUserData = await getBasicUserData(token)
  console.log("\n User Data :", basicUserData)
  // (3) get array of user media ids - getUserMediaIds(token)
  // getUserMediaIds(token)

 // (4) use each id to get its single media object - getSingleMediaObject(id, token)
 // (5) return array of these single media objects to client
 return res.status(200).send(`Hello World ${token}`)
});

const PORT = port || 3000;
app.listen(PORT, () => console.log(`listening on ${PORT}`));
//❤