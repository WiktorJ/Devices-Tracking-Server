var path = require('path');
var config = require(path.join(__base, 'config/index'));
var MongoClient = require('mongodb').MongoClient;
var db;

MongoClient.connect(config.mongoAddress)
    .then(function (mongo) {
        console.log('Connection established to', config.mongoAddress);
        db = mongo
    }).catch(function (error) {
    console.error("Unable to connect to MongoDB " + error)
});

var utils = {};
utils.getDb = function () {
        return db;
    };

module.exports = utils;