var path = require('path');
var dbUtils = require(path.join(__base, 'persistence/mongoUtils'));
var config = require(path.join(__base, 'config/index'));
var location = {};

location.addLocation = function (uid, locObj) {
    var col = dbUtils.getCollection(config.locationCollection + uid);
    if(!col.exists) {
        console.error("There is no collection for user: " + uid);
    } else {
        locObj.uid = uid;
        col.insert(locObj, function (err, result) {
            if(err) {
                console.error("Error while inserting to collection, uid: " + uid)
                throw err
            }
            console.log("Inserting success " + result)
        })
    }
};

module.exports = location;