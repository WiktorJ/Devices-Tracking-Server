global.__base = __dirname + '/';
var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
// var logger = require('morgan');
// var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var location = require('./domain/location/index');
var users = require('./domain/users/index');
var auth = require('./auth/index');
var GoogleAuth = require('google-auth-library');

var app = express();

var authFactory = new GoogleAuth();

var oauth = new authFactory.OAuth2("583088429615-npskj15ed319bim2k7a43ied661hm3jq.apps.googleusercontent.com", "kSWATwglcCMwghSyRlUBM0Ml");


// add response headers, which allow to communicate between different hosts.
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
// app.use(cookieParser());
// app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(function (req, res, next) {
    var token = req.body.Authorization;
    if(!token)
        token = "SOME FAKE TOKEN";
    oauth.verifyIdToken(token, "", function (err, login) {
        if(err) {
            console.log("ERROR VERIFING TOKEN", err)
        } else {
            console.log("VERYFING GUT", login)
        }
    });
    next()
});

// additional custom scripts
app.use('/auth', auth);
app.use('/users', users);
app.use('/location', location);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
