var express = require('express');
var router = express.Router();

var stockareaservice = require('../services/stockareaservice');
var productservice = require('../services/privateproductservice');

router.get('/getproductinfobyid', function(req, res) {
  productservice.getproductinfobyid(req, res);
});
router.get('/getproductinfo', function(req, res) {
  productservice.getproductinfo(req, res);
});
router.get('/getprivateproducts', function(req, res) {
  productservice.getprivateproducts(req, res);
});
router.post('/addproduct', function(req, res) {
  productservice.add(req, res);
});
module.exports = router;
