var path = require('path');
var app = require(path.join(__base, 'app'));
var express = require('express');
var config = require(path.join(__base, 'config/index'));
var locationService = require('./location');
var router = express.Router();

//TODO: After auth implementing change this mock


router.get('/users/:uid', function (req, res, next) {
  console.log(req);
  locationService.getUserLocation(req.params.uid, req.query.from, req.query.to).then(function (result) {
    res.status(200).send(result)
  }, function (error) {
    console.error("Error during getting user location, uid: ", uid, error)
    res.status(500).send("Error during getting user location")
  });
});

router.get('/isAlive', function (req, res, next) {
  res.status(200).send()
});

module.exports = router;
