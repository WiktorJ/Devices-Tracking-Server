var path = require('path');
var util = require(path.join(__base, 'persistence/mongoUtils'));
var config = require(path.join(__base, 'config/index'));
var location = {};

location.addLocation = function (uid, locObj) {
    //TODO: Write utility function for getting user collection
    locObj.uid = uid;
    console.log("INSERTING: ", locObj);
    util.getDb().collection(config.locationCollection + uid)
        .insertOne(locObj, function (err, result) {
            if (err) {
                console.error("Error while inserting to collection, uid: ", uid, err);
            } else {
                console.log("Inserting success ", locObj);
            }
        })
};

location.updateTimeStamp = function (uid, cacheEntry) {
    util.getDb().collection(config.locationCollection + uid).find(cacheEntry.id).updateOne({$set: {timestamp: cacheEntry.timestamp}})
};

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
module.exports = location;