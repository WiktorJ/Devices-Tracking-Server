var express = require('express');
var router = express.Router();
var usersService = require('./users');
/* GET users listing. */
router.post('/update', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/keepAlive', function (req, res, next) {
  
});

router.get('/isAlive', function (req, res, next) {
  res.statusCode = 200;
  res.send()
});
module.exports = router;
