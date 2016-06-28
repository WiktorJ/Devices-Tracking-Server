/**
 * @file Defines server API used for authentication.
 */

/**
 * @module auth/index
 * @description Module implementing authentication API.
 */

var path = require('path');
var app = require(path.join(__base, 'app'));
var express = require('express');
var config = require(path.join(__base, 'config/index'));
var uidService = require('./uid');
var router = express.Router();

router.post(
    '/login',
    /**
     * @callback callback
     * @param req {Object} Standard express parameter representing HTTP request.
     * @param res {Object} Standard express parameter representing HTTP response.
     * @param next {Object} Standard express parameter allowing to pass request processing flow.
     * @description Manages HTTP POST request on /auth/login URL.
     */
    function (req, res, next) {
        console.log('received login request');

        uidService.mapEmail(req.body.email, function (uid) {
            if(uid == -1) {
                res.status(500).send("\"{\"reason\": \"Unable to map e-mail to UID.\"}\"")
            }
            else {
                res.status(200).header('uid', uid).send({uid: uid});
            }
        });
});

module.exports = router;
