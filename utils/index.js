/**
 * @file Defines general utilities functions.
 */

/**
 * @module utils/index
 * @description Module implementing general utils.
 */

var path = require('path');
var config = require(path.join(__base, 'config/index'));
var GoogleAuth = require('google-auth-library');
var authFactory = new GoogleAuth();
var oauth = new authFactory.OAuth2(config.googleSignIn.clientId, config.googleSignIn.clientSecret);

var util = {};

/**
 * @function verifyToken
 * @param token {Object} OAuth 2.0 token for Google Account.
 * @param callback {Function} Callback function to invoke.
 * @description Checks validity of the token passed as argument
 */
util.verifyToken = function (token, callback) {
    oauth.verifyIdToken(token, config.googleSignIn.clientId, function (err, login) {
        if(err) {
            console.log("ERROR VERIFING TOKEN", err);
            callback(false, err);
        } else {
            console.log("VERYFING GUT", login);
            callback(true, login);
        }
    });
};

module.exports = util;