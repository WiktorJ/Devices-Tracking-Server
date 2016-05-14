var path = require('path');
var db = require(path.join(__base, 'persistence/mongoUtils'));
var config = require(path.join(__base, 'config/index'));
var location = {};

location.addLocation = function (uid, locObj) {
    //TODO: Write utility function for getting user collection
    console.log(config.locationCollection + uid);
    locObj.uid = uid;
    db.getDb().collection(config.locationCollection + uid)
        .insertOne(locObj, function (err, result) {
            if (err) {
                console.error("Error while inserting to collection, uid: " + uid);
                throw err
            }
            console.log("Inserting success " + result)
        })
};

module.exports = location;