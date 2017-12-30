var express = require("express");
var router = express.Router();
var path = require("path");
var config = require('./app/config/config');
var environment = process.env.ENV || config.get('env');
router.get('/', function(req, res) {
  if (environment == 'development') {
    res.sendFile(path.join(__dirname + '/webapp/index.html'));
  } else {
    res.sendFile(path.join(__dirname + '/dist/index.html'));
  }
});
module.exports = router;
