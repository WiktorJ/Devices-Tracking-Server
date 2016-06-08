/**
 *
 * Created by wiktor on 14/05/16.
 */
var path = require('path');
var app = require(path.join(__base, 'app'));
var express = require('express');
var config = require(path.join(__base, 'config/index'));
var router = express.Router();

router.post('/login', function (req, res, next) {
    console.log('received login request');
    console.log(req);
    res.status(200).send('{}')
});

module.exports = router;


