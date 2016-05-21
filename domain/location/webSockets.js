/**
 * Created by wiktor on 21/05/16.
 */
var path = require('path');
var express = require('express');
var locationService = require('./location');
var config = require(path.join(__base, 'config/index'));
var NodeCache = require( "node-cache" );

var cacheSetErrorCallback = function (err, success) {
  if(err) {
      console.error("Error during ser cache operation", err)
  }
};

module.exports = function (wss) {
    //FIXME: This should be retrieved from session
    var uid = 0;

    var clientActivenessCache  = new NodeCache(config.cacheOpt);
    clientActivenessCache.on("expired", function (key, value) {
       locationService.setStopOnLastLocation(uid) 
    });

    wss.on('connection', function (socket) {
        !clientActivenessCache.set(uid, 0, cacheSetErrorCallback);
        socket.on('message', function (data, flags) {
            console.log("RECEIVED MESSAGE: ", data, flags);
            try {
                var request = JSON.parse(data);
                if(clientActivenessCache.get(uid) == undefined) {
                    console.error("Trying to update data of unlogged user. This is a sign of very serious consistency problem")
                }
                else if (request.type == 'keepAlive') {
                    console.log("Received keep alive", request);
                    clientActivenessCache.set(uid, request.data.timeStamp, cacheSetErrorCallback)
                } else if (request.type == 'update') {
                    console.log("Received update", request);
                    locationService.addLocation(uid, request.data);
                    if(request.data.stop) {
                        clientActivenessCache.del(uid)
                    }
                }
            } catch (ex) {
                console.log("Error while processing webSocket message")
            }
        });
    });
};