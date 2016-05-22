/**
 * Created by wiktor on 21/05/16.
 */
var path = require('path');
var express = require('express');
var locationService = require('./location');
var config = require(path.join(__base, 'config/index'));
var NodeCache = require("node-cache");

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
    //FIXME: This should be retrieved from session
    var uid = 0;

    var clientActivenessCache = new NodeCache(config.cacheOpt);
    clientActivenessCache.on("expired", function (key, value) {
        console.log("Removing old key");
        locationService.setStopOnLastLocation(key, value)
    });

    wss.on('connection', function (socket) {
        clientActivenessCache.set(uid, new CacheEntry(-1, -1), cacheSetErrorCallback);
        socket.on('message', function (data, flags) {
            try {
                var request = JSON.parse(data);
                var lastCacheEntry = clientActivenessCache.get(uid);
                if (lastCacheEntry == undefined) {
                    console.error("Trying to update data of unlogged user. This is a sign of very serious consistency problem")
                }
                else if (request.type == 'keepAlive') {
                    console.log("Received keep alive", request);
                    locationService.updateTimeStamp(uid, lastCacheEntry);
                    lastCacheEntry.timestamp = request.data.timestamp;
                    clientActivenessCache.set(uid, lastCacheEntry, cacheSetErrorCallback)
                } else if (request.type == 'update') {
                    console.log("Received update", request);
                    locationService.addLocation(uid, request.data);
                    clientActivenessCache.set(uid, new CacheEntry(request.data.timestamp, request.data._id));
                    if (request.data.stop) {
                        console.log("Deleting old key");
                        var removedCount = clientActivenessCache.del([uid]);
                        if(removedCount != 1) {
                            console.error("Removed " + removedCount + " entries from cache instead of 1")
                        }
                    }
                }
            } catch (ex) {
                console.log("Error while processing webSocket message", ex)
            }
        });
    });
};