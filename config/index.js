/**
 * @file Defines general server configuration.
 */

var config = {};

config.mongoAddress = "mongodb://heroku_9jgvm8jv:gm3t5fvn1f6i11kp5q54tnlmob@ds021922.mlab.com:21922/heroku_9jgvm8jv";
config.locationCollection = "location";
config.uidCollection = "uid";
config.cacheOpt = {
    stdTTL: 12,
    checkperiod: 12
};
config.googleSignIn = {
    clientId: "583088429615-npskj15ed319bim2k7a43ied661hm3jq.apps.googleusercontent.com",
    clientSecret: "kSWATwglcCMwghSyRlUBM0Ml"
};

module.exports = config;
