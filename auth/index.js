/**
 *
 * Created by wiktor on 14/05/16.
 */
var path = require('path');
var app = require(path.join(__base, 'app'));
var express = require('express');
var config = require(path.join(__base, 'config/index'));
var uidService = require('./uid');
var router = express.Router();

router.post('/login', function (req, res, next) {
    console.log('received login request');
    
    uidService.mapEmail(req.body.email, function (uid) {
        if(uid == -1) {
            res.status(500).send("\"{\"reason\": \"Unable to map e-mail to UID.\"}\"")
        }
        else {
            // res.status(200).send("\"{\"uid\": \"" + uid + "\"}\"");
            res.status(200).header('uid', uid).send({uid: uid});
        }
    });
});

module.exports = router;
