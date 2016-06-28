/**
 * @file Defines utilities functions used for location management.
 */

/**
 * @module domain/location/location
 * @description Module implements location utils.
 */

var path = require('path');
var util = require(path.join(__base, 'persistence/mongoUtils'));
var config = require(path.join(__base, 'config/index'));
var location = {};

/**
 * @function addLocation
 * @param uid {Integer} User ID of signed in user.
 * @param locObj {Object} Location object.
 * @description Persists location object passed as argument in the database.
 */
location.addLocation = function (uid, locObj) {
    locObj.uid = uid;
    console.log("INSERTING: ", locObj);
    util.getDb().collection(config.locationCollection + uid)
        .insertOne(locObj, function (err, result) {
            if (err) {
                console.error("Error while inserting to collection, uid: ", uid, err);
            } else {
                console.log("Inserting success");
            }
        })
};

/**
 * @function updateTimeStamp
 * @param uid {Integer} User ID of signed in user.
 * @param cacheEntry {Object} Object cotaining new timestamp.
 * @description Updates timestamp of location object.
 */
location.updateTimeStamp = function (uid, cacheEntry) {
    util.getDb().collection(config.locationCollection + uid).updateOne({_id: cacheEntry.id}, {$set: {timestamp: cacheEntry.timestamp}})
};

/**
 * @function setStopOnLastLocation
 * @param uid {Integer} User ID of signed in user.
 * @param cacheEntry {Object} Reference object.
 * @description Sets stop property to true within the location object with the earliest timestamp.
 */
location.setStopOnLastLocation = function (uid, cacheEntry) {
    var that = this;
    util.getDb().collection(config.locationCollection + uid).find(cacheEntry.id).limit(1).next(function (err, result) {
        if (err) {
            console.log("Error during finding object, user uid: ", uid, cacheEntry)
        } else {
            result.timestamp = parseInt(result.timestamp > cacheEntry.timestamp ? result.timestamp : cacheEntry.timestamp) + parseInt(config.cacheOpt.stdTTL);
            result.stop = true;
            delete result._id;
            that.addLocation(uid, result);
        }
    });
};

/**
 * @function getUserLocation
 * @param uid {Integer} User ID of signed in user.
 * @param from {Integer} Required timestamp (oldest).
 * @param to {Integer} Required timestamp (earliest).
 * @returns {Object} Collection of location objects.
 * @description Finds location objects conforming with given parameters.
 */
location.getUserLocation = function (uid, from, to) {
    var userColl = util.getDb().collection(config.locationCollection + uid);
    if (!userColl) {
        console.log("No collection for user with id ", uid);
        return false
    } else {
        return userColl.find({timestamp : {$gt: (from ? parseInt(from) : 0), $lt: (to ? parseInt(to) : 99999999999999)}}).toArray()
    }
};

module.exports = location;
