/**
 * @file Defines general structure of HTTP Server.
 */

/**
 * @module app
 * @description Module containing skeleton of server's architecture.
 */

global.__base = __dirname + '/';
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var location = require('./domain/location/index');
var users = require('./domain/users/index');
var auth = require('./auth/index');
var config = require(path.join(__base, 'config/index'));
var utils = require(path.join(__base, 'utils/index'));

var app = express();


// add response headers, which allow to communicate between different hosts.
app.use(
    /**
     * @callback callback
     * @param req {Object} Standard express parameter representing HTTP request.
     * @param res {Object} Standard express parameter representing HTTP response.
     * @param next {Object} Standard express parameter allowing to pass request processing flow.
     * @description Defines CORS Headers and handles HTTP OPTIONS pre-flight.
     */
    function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

        if (req.method === 'OPTIONS') {
            res.status(200).send();
        }
        else {
            next();
        }
    });


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(
    /**
     * @callback callback
     * @param req {Object} Standard express parameter representing HTTP request.
     * @param res {Object} Standard express parameter representing HTTP response.
     * @param next {Object} Standard express parameter allowing to pass request processing flow.
     * @description Invokes authorization check.
     */
    function (req, res, next) {
        var token = req.headers.authorization;
        utils.verifyToken(token, function (success, data) {
            if (success) {
                next()
            } else {
                res.status(401).send("\"{\"reason\": \"Google sign in token verification failed\"}\"")
            }
        });
    });

// additional custom scripts
app.use('/auth', auth);
app.use('/users', users);
app.use('/location', location);


// catch 404 and forward to error handler
app.use(
    /**
     * @callback callback
     * @param req {Object} Standard express parameter representing HTTP request.
     * @param res {Object} Standard express parameter representing HTTP response.
     * @param next {Object} Standard express parameter allowing to pass request processing flow.
     * @description Catches 404 Not Found error and fowards flow to and error handler.
     */
    function (req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });


// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(
        /**
         * @callback callback
         * @param err {Object} Standard express parameter representing an error occurred while server processing.
         * @param req {Object} Standard express parameter representing HTTP request.
         * @param res {Object} Standard express parameter representing HTTP response.
         * @param next {Object} Standard express parameter allowing to pass request processing flow.
         * @description Handles server errors in development mode.
         */
        function (err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
}

// production error handler
// no stacktraces leaked to user
app.use(
    /**
     * @callback callback
     * @param err {Object} Standard express parameter representing an error occurred while server processing.
     * @param req {Object} Standard express parameter representing HTTP request.
     * @param res {Object} Standard express parameter representing HTTP response.
     * @param next {Object} Standard express parameter allowing to pass request processing flow.
     * @description Handles server errors in production mode.
     */
    function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });


module.exports = app;
