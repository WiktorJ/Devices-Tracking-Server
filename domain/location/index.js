var path = require('path');
var app = require(path.join(__base, 'app'));
var express = require('express');
var config = require(path.join(__base, 'config/index'));

var router = express.Router();

//TODO: After auth implementing change this mock


router.get('/isAlive', function (req, res, next) {
  res.status(200).send()
});

module.exports = router;
