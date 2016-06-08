/**
 * Created by wiktor on 08/06/16.
 */
var path = require('path');
var config = require(path.join(__base, 'config/index'));
var GoogleAuth = require('google-auth-library');
var authFactory = new GoogleAuth();
var oauth = new authFactory.OAuth2(config.googleSignIn.clientId, config.googleSignIn.clientSecret);

var util = {};

util.verifyToken = function (token) {
    oauth.verifyIdToken(token, config.googleSignIn.clientId, function (err, login) {
        if(err) {
            console.log("ERROR VERIFING TOKEN", err);
            return false;
        } else {
            console.log("VERYFING GUT", login);
            return true;
        }
    });
};

module.exports = util;