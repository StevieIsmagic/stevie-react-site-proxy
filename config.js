const dotenv = require('dotenv');
dotenv.config();

module.exports = { 
  port: process.env.PORT,
  instagramGraphAPI: process.env.LONG_LIVED_TOKEN_REFRESH_URL,
  longLivedToken: process.env.LONG_LIVED_60_DAY_TOKEN,
  userDataEndpoint: process.env.IG_GRAPH_USER_DATA_ENDPOINT,
  mediaDataEndpoint: process.env.IG_GRAPH_MEDIA_DATA_ENDPOINT,
  singleMediaEndpoint: process.env.IG_GRAPH_SINGLE_MEDIA_OBJECT_ENDPOINT
}