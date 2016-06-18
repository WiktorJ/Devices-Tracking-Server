var path = require('path');
var mongoUtils = require(path.join(__base, 'persistence/mongoUtils'));
var config = require(path.join(__base, 'config/index'));
var uid = {};


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
