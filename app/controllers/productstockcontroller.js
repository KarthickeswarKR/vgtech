var express = require('express');
var router = express.Router();
var commonService = require("../common/utils.js");
var productstockservice = require('../services/productstockservice');
router.post('/addproductstock', function(req, res, next) {
  productstockservice.addproductstock(req, res);
});
router.get('/getproductstockinfo', function(req, res, next) {
  productstockservice.getproductstockinfo(req, res);
});
router.get('/getuserstockinfo', function(req, res, next) {
  productstockservice.getuserstockinfo(req, res);
});
router.get('/getsellinfo', function(req, res, next) {
  productstockservice.getsellinfo(req, res);
});
router.post('/delete', function(req, res, next) {
  commonService.delete(req, res, 'productstock');
});
router.post('/updatesource', function(req, res, next) {
  productstockservice.updatesource(req, res);
});
module.exports = router;
