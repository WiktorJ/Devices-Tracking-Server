/**
 * Created by wiktor on 21/05/16.
 */
var path = require('path');
var express = require('express');
var locationService = require('./location');
var config = require(path.join(__base, 'config/index'));


module.exports = function (wss) {
    var uid = 0;
    wss.on('connection', function (socket) {
        socket.on('message', function (data, flags) {
            console.log("RECEIVED MESSAGE: ", data, flags);
            try {
                var request = JSON.parse(data);
                if (request.type == 'keepAlive') {
                    console.log("Received keep alive", request)
                } else if (request.type == 'update') {
                    console.log("Received update", request);
                    locationService.addLocation(uid, request.data);
                }
            } catch (ex) {
                console.log("Error while receiving webSocket message")
            }
        });
    });
};