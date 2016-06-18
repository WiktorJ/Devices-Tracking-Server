var path = require('path');
var app = require(path.join(__base, 'app'));
var express = require('express');
var config = require(path.join(__base, 'config/index'));
var locationService = require('./location');
var authorizationService = require('./authorization');
var router = express.Router();

router.get('/users/:uid', function (req, res, next) {
    authorizationService.authorizeUID(req.query.email, req.params.uid, function (authorized) {
        if (authorized) {
            locationService.getUserLocation(req.params.uid, req.query.from, req.query.to)
                .then(
                    function (result) {
                        res.status(200).send(result)
                    },
                    function (error) {
                        console.error("Error during getting user location, uid: ", uid, error);
                        res.status(500).send("Error during getting user location")
                    }
                );
        }
        else {
            res.status(401).send("Access unauthorized.");
        }
    })
});

router.get('/isAlive', function (req, res, next) {
    res.status(200).send()
});

module.exports = router;
