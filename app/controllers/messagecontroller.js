var express = require('express');
var router = express.Router();
var messageservice = require('../services/messageservice');
router.post('/addmessage', function(req, res, next) {
  messageservice.addmessage(req, res);
});
router.get('/getinfo', function(req, res, next) {
  messageservice.getinfo(req, res);
});
router.post('/update', function(req, res, next) {
  messageservice.update(req, res);
});
module.exports = router;
