const dotenv = require('dotenv');
dotenv.config();

module.exports = { 
  port: process.env.PORT,
  instagramGraphAPI: process.env.LONG_LIVED_TOKEN_REFRESH_URL,
  longLivedToken: process.env.LONG_LIVED_60_DAY_TOKEN

}