var path = require('path');
var util = require(path.join(__base, 'persistence/mongoUtils'));
var config = require(path.join(__base, 'config/index'));
var location = {};

location.addLocation = function (uid, locObj) {
    //TODO: Write utility function for getting user collection
    locObj.uid = uid;
    util.getDb().collection(config.locationCollection + uid)
        .insertOne(locObj, function (err, result) {
            if (err) {
                console.error("Error while inserting to collection, uid: ", uid);
                throw err
            }
            console.log("Inserting success ", locObj)
        })
};

location.updateLastLocation = function (uid, timeStamp) {
    console.log(util.getDb().collection(config.locationCollection + uid).find().limit(1).sort({$natural:-1}))
};
module.exports = location;