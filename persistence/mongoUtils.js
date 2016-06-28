/**
 * @file Defines utilities functions used for accessing database.
 */

/**
 * @module persistence/mognoUtils
 * @description Module implementing database utils.
 */

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

/**
 * @function getDb
 * @returns {Object} Database representation.
 * @description Returns database instance.
 */
utils.getDb = function () {
        return db;
    };

module.exports = utils;
