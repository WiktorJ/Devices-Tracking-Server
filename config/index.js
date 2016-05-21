/**
 * Created by wiktor on 14/05/16.
 */
var config = {};

config.mongoAddress = "mongodb://heroku_9jgvm8jv:gm3t5fvn1f6i11kp5q54tnlmob@ds021922.mlab.com:21922/heroku_9jgvm8jv";
config.locationCollection = "location";
config.cacheOpt = {
    stdTTL: 5,
    checkperiod: 5
};

module.exports = config;
