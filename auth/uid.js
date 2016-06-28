/**
 * @file Defines utilities functions used for processing authentication requests.
 */

/**
 * @module auth/uid
 * @description Module implementing authentication utils.
 */

var path = require('path');
var mongoUtils = require(path.join(__base, 'persistence/mongoUtils'));
var config = require(path.join(__base, 'config/index'));
var uid = {};

/**
 * @function findNextUid
 * @param fn {Function} Callback function to invoke.
 * @description Finds the lowest User ID to map new user's e-mail address. Takes care of no User ID duplicates.
 */
uid.findNextUid = function (fn) {
    var nextUid = -1;

    mongoUtils.getDb().collection(config.uidCollection)
        .find({}).toArray(function (err, result) {
            if(err) {
                console.log("Error while finding in collection for user: " + email + ". ", err);
                fn(-1);
            }
            else {
                result.forEach(function (document) {
                    if (document.uid > nextUid) {
                        nextUid = document.uid;
                    }
                });

                fn(++nextUid);
            }
    });
};

/**
 * @function mapEmail
 * @param email {String} E-mail address of signed in user.
 * @param fn {Function} Callback function to invoke.
 * @description Maps e-mail address submitted with login request to User ID. Returns User ID saved in database or creates and persists new mapping between e-mail address and USer ID (for the first signing in).
 */
uid.mapEmail = function (email, fn) {
    var topContext = this;
    
    mongoUtils.getDb().collection(config.uidCollection)
        .find({"email": email}).toArray(function (err, result) {
            if(err) {
                console.log("Error while finding in collection for user: " + email + ". ", err);
                fn(-1);
                return;
            }
        
            if(result.length == 0) {
                topContext.findNextUid(function (uid) {
                    if(uid == -1) {
                        fn(-1);
                    }

                    mongoUtils.getDb().collection(config.uidCollection)
                        .insertOne(
                            {
                                "email" : email,
                                "uid": uid
                            },
                            function (err, result) {
                                if (err) {
                                    console.error("Error while inserting to collection for user: " + email + ". ", err);
                                    fn(-1);
                                } else {
                                    console.log("UID entry inserted.");
                                    fn(uid);
                                }
                            }
                        );
                });
            }
            else if(result.length == 1) {
                fn(result[0].uid);
            }
            else {
                console.log("Error: two or more UID entries in database for user: " + email + ".");
                fn(-1);
            }
        });
};

module.exports = uid;
