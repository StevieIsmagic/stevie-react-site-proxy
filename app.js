const express = require('express');
const ky = require('ky-universal');
const bluebird = require('bluebird');
const {
  port,
  instagramGraphAPI,
  longLivedToken,
  userDataEndpoint,
  mediaDataEndpoint,
  singleMediaEndpoint
} = require('./config');

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

const PORT = port || 3000;
app.listen(PORT, () => console.log(`listening on ${PORT}`));
//❤

/* TO DO
  - refactor / endpoint
  - error handling on try / catch
*/

app.get('/', async (req, res) => {
  // refactor lines 31-33
  const token = await refresh60DayToken()
  // const basicUserData = await getBasicUserData(token)
  const userMediaIds = await getUserMediaIds(token)

 // (5) return array of these single media objects to client
 // TODO - extract this logic into a f(x)
 try {
   const mediaObjects = await bluebird.map(userMediaIds, (id, index) => { 
     return getSingleMediaObject(id, token)
    }, { concurrency: 3 })

    return res.status(200).json(mediaObjects).send()
  } catch (err) {
    console.log(`blue bird err`, err)
  }
  
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
    return access_token
  } catch (err) {
    console.log('\n Get Token Err:', err)
    //what could we return here if refreshing token fails ?
  }
}

async function getBasicUserData(token) {
  const getUserURL = `${userDataEndpoint}${token}`;
  try {
    const userData = await ky.get(getUserURL).json()
    return userData
  } catch (err) {
    console.log('\n Get Basic User Data Err:', err)
  }
}

async function getUserMediaIds(token) {
  const getMediaURL = `${mediaDataEndpoint}${token}`;
  try {
    const { data } = await ky.get(getMediaURL).json()
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
    return singleMediaObject
  } catch (err) {
    console.log('\n Get Single Media Object Err :', err)
  }
}
