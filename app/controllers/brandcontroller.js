var express = require('express');
var router = express.Router();
var productservice = require('../services/productservice');
var brandservice = require('../services/brandservice');
router.get('/autocomplete', function(req, res, next) {
  productservice.brandautocomplete(req, res);
});
router.get('/getbrands', function(req, res, next) {
  brandservice.getbrands(req, res);
});
router.post('/Id', function(req, res, next) {
  brandservice.brand(req, res);
});
router.get('/brandinfo', function(req, res, next) {
  brandservice.brandinfo(req, res);
});
router.post('/addbrand', function(req, res, next) {
  brandservice.addbrand(req, res);
});
router.post('/editbrand', function(req, res, next) {
  brandservice.editbrand(req, res);
});
router.post('/like', function(req, res, next) {
  brandservice.addlike(req, res);
});
router.post('/unlike', function(req, res, next) {
  brandservice.removelike(req, res);
});
module.exports = router;
