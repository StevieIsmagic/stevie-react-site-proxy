const express = require('express');
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

const PORT = port || 3000;
app.listen(PORT, () => console.log(`listening on ${PORT}`));
//❤

app.get('/', async (req, res) => {
  // (1) We want to refresh 60 day Token and return it for our API calls to use - refresh60DayToken()
  const token = await refresh60DayToken()
  console.log("\n Token:", token)
  // (2) get basic user data object - getBasicUserData(token)
  const basicUserData = await getBasicUserData(token)
  console.log("\n User Data :", basicUserData)
  // (3) get array of user media ids - getUserMediaIds(token)
  const userMediaIds = await getUserMediaIds(token)
  console.log('Media Ids Array :', userMediaIds)
 // (4) use each id to get its single media object - getSingleMediaObject(id, token)
  getSingleMediaObject(userMediaIds[1], token)
 // (5) return array of these single media objects to client

 return res.status(200).send(`Hello World ${token}`)
});

const daysLeft = body => {
  const secondsInADay = 86400;
  const secondsTillTokenExpires = body.expires_in

  console.log("Days Left Till Expire \n",  secondsTillTokenExpires / secondsInADay)
  return Math.floor(secondsTillTokenExpires / secondsInADay);
};

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

async function getUserMediaIds(token) {
  const getMediaURL = `${mediaDataEndpoint}${token}`;
  try {
    const { data } = await ky.get(getMediaURL).json()
    console.log('\n (3) Media Ids:', data)
    const mediaIdsArray = data.map(obj => obj.id)
    return mediaIdsArray
  } catch (err) {
    console.log('\n Get Media Ids Err:', err)
  }
}

async function getSingleMediaObject(id, token) {
  const singleMediaURL = `https://graph.instagram.com/${id}${singleMediaEndpoint}${token}`;
  try {
    const singleMediaObject = await ky.get(singleMediaURL).json()
    console.log('\n (4) Single Media Object :', singleMediaObject)
    return singleMediaObject
  } catch (err) {
    console.log('\n Get Single Media Object Err :', err)
  }
}
