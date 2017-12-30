var express = require('express');
var router = express.Router();
var notificationservice = require('../services/notificationservice');
router.post('/addnotification', function(req, res, next) {
  notificationservice.addnotification(req, res);
});
router.post('/updatenotification', function(req, res, next) {
  notificationservice.updatenotification(req, res);
});
router.get('/getinfo', function(req, res, next) {
  notificationservice.getinfo(req, res);
});
module.exports = router;
