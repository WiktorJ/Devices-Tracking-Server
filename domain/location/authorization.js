var path = require('path');
var mongoUtils = require(path.join(__base, 'persistence/mongoUtils'));
var config = require(path.join(__base, 'config/index'));
var auth = {};


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
