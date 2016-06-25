/**
 * Created by wiktor on 21/05/16.
 */
var path = require('path');
var express = require('express');
var locationService = require('./location');
var config = require(path.join(__base, 'config/index'));
var NodeCache = require("node-cache");
var utils = require(path.join(__base, 'utils/index'));

var cacheSetErrorCallback = function (err, success) {
    if (err) {
        console.error("Error during ser cache operation", err)
    }
};

//Probably we could hold only id here
function CacheEntry(timestamp, id) {
    this.timestamp = timestamp;
    this.id = id;
}

module.exports = function (wss) {

    var clientActivenessCache = new NodeCache(config.cacheOpt);
    clientActivenessCache.on("expired", function (key, value) {
        console.log("Removing old key");
        locationService.setStopOnLastLocation(key, value)
    });

    wss.on('connection', function (socket) {
        console.log("socket connecting");
        socket.on('message', function (data, flags) {
            try {
                var request = JSON.parse(data);
                //todo: this should not be handled like that
                var uid = request.uid ? request.uid : 0;
                if(clientActivenessCache.get(uid) == undefined) {
                    clientActivenessCache.set(uid, new CacheEntry(9999, 9999), cacheSetErrorCallback);
                }
                var lastCacheEntry = clientActivenessCache.get(uid);
                if (lastCacheEntry == undefined) {
                    console.error("Trying to update data of unlogged user. This is a sign of very serious consistency problem")
                } else {
                    utils.verifyToken(request.Authorization, function (success, data) {
                    if(success) {
                        if (request.type == 'keepAlive') {
                            console.log("Received keep alive");
                            locationService.updateTimeStamp(uid, lastCacheEntry);
                            lastCacheEntry.timestamp = request.data.timestamp;
                            clientActivenessCache.set(uid, lastCacheEntry, cacheSetErrorCallback)
                        } else if (request.type == 'update') {
                            console.log("Received update");
                            locationService.addLocation(uid, request.data);
                            clientActivenessCache.set(uid, new CacheEntry(request.data.timestamp, request.data._id));
                            if (request.data.stop) {
                                console.log("Deleting old key");
                                var removedCount = clientActivenessCache.del([uid]);
                                if (removedCount != 1) {
                                    console.error("Removed " + removedCount + " entries from cache instead of 1")
                                }
                            }
                        }
                    } else {
                        //TODO: This should be handled somehow
                        console.error("AUTHENTICATION ERROR IN WEBSOCKET REQUEST");
                    }
                    });
                }
            } catch (ex) {
                console.log("Error while processing webSocket message", ex)
            }
        });
    });
};