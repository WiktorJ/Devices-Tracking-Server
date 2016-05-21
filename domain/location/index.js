var path = require('path');
var express = require('express');
var locationService = require('./location');
var config = require(path.join(__base, 'config/index'));

var router = express.Router();

router.get('/isAlive', function (req, res, next) {
  res.status(200).send()
});

module.exports = router;
