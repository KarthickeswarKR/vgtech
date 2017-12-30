var express = require('express');
var router = express.Router();
var sellservice = require('../services/sellservice');
var transactionhistoryservice = require('../services/transactionhistoryservice');
router.post('/addorderhistory', function(req, res, next) {
  transactionhistoryservice.add(req, res);
});
router.get('/gethistory', function(req, res, next) {

  transactionhistoryservice.gethistory(req, res);
});
router.get('/gethistoryview', function(req, res, next) {
  transactionhistoryservice.gethistoryview(req, res);
});
router.post('/conform', function(req, res, next) {
  transactionhistoryservice.conform(req, res);
});
router.post('/cancel', function(req, res, next) {
  transactionhistoryservice.cancel(req, res);
});
module.exports = router;
