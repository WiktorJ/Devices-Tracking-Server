var express = require('express');
var locationService = require('./location');

var router = express.Router();
/* GET home page. */
router.post('/update', function(req, res, next) {
  //TODO: After auth implementing change this mock
  var uid = 0;
  locationService.addLocation(uid, req.body);
  res.status(200).send();
});

router.get('/keepAlive', function (req, res, next) {

});

router.get('/isAlive', function (req, res, next) {
  res.status(200).send()
});

module.exports = router;
