var express = require('express');
var router = express.Router();
var commonService = require("../common/utils.js");
var sellservice = require('../services/sellservice');
router.post('/addsell', function(req, res, next) {
  sellservice.addsell(req, res);
});
router.get('/getsellbyproductsinstockarea', function(req, res, next) {
  sellservice.getsellbyproductsinstockarea(req, res);
});
router.get('/getsellbyproductsinstockarea', function(req, res, next) {
  sellservice.getsellbyproductsinstockarea(req, res);
});
router.get('/getsellinfo', function(req, res, next) {
  sellservice.getsellinfo(req, res);
});

router.get('/getsell', function(req, res, next) {
  sellservice.getsell(req, res);
});
router.get('/getsellbystockareaId', function(req, res, next) {
  sellservice.getsellbystockareaId(req, res);
});
router.post('/delete', function(req, res, next) {
  commonService.delete(req, res, 'sell');
});
module.exports = router;
