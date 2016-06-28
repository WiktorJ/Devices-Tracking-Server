/**
 * @file Defines utilities functions used for user authorization.
 */

/**
 * @module domain/location/authorization
 * @description Module implementing authorization utils.
 */

var path = require('path');
var mongoUtils = require(path.join(__base, 'persistence/mongoUtils'));
var config = require(path.join(__base, 'config/index'));
var auth = {};

/**
 * @function authorizeUID
 * @param email {String} E-mail address of signed in user.
 * @param uid {Integer} User ID submitting by signed in user.
 * @param fn {Function} Callback function to invoke.
 * @description Returns true to callback if only submitting User ID conforms with User ID mapped from passed E-mail address.
 */
auth.authorizeUID = function (email, uid, fn) {
    mongoUtils.getDb().collection(config.uidCollection)
        .find({'email': email}).toArray(function (err, result) {
            if(err) {
                console.log("Error while finding in collection for user: " + email + ". ", err);
                fn(false);
            }
            else {
                if (result.length != 1) {
                    fn(false);
                }
                else {
                    if (result[0].uid == uid) {
                        fn(true);
                    }
                    else {
                        fn(false);
                    }
                }
            }
    })
};

module.exports = auth;
