var express = require('express');
var router = express.Router();
var commonService = require("../common/utils.js");
var stockareaservice = require('../services/stockareaservice');
var productservice = require('../services/productservice');
router.get('/getproducts', function(req, res, next) {
  productservice.productdetails(req, res);
});
router.get('/updateinfo', function(req, res, next) {
  productservice.updateinfo(req, res);
});
router.get('/movetovg', function(req, res, next) {
  productservice.movetovg(req, res);
});
router.get('/sellaccess', function(req, res, next) {
  productservice.sellaccess(req, res);
});
/*router.get('/oneshot', function(req, res, next) {
  productservice.oneshot(req, res);
});*/
router.post('/updateproduct', function(req, res, next) {
  productservice.updateproduct(req, res);
});
router.post('/like', function(req, res, next) {
  productservice.addlike(req, res);
});
router.post('/unlike', function(req, res, next) {
  productservice.removelike(req, res);
});
router.post('/addproduct', function(req, res, next) {
  if (req.body.newvariant == 'true') {
    productservice.addvariantforproduct(req, res);
  } else {
    productservice.addnewproduct(req, res);
  }
});
router.get('/getprivateproducts', function(req, res) {
  productservice.getprivateproducts(req, res)
})
router.get('/getSearchProductsbycategory', function(req, res, next) {
  productservice.getSearchProductsbycategory(req, res);
});
router.get('/getproductsdata', function(req, res, next) {
  productservice.getproductsdata(req, res);
});
router.get('/autocomplete', function(req, res) {
  productservice.autocomplete(req, res);
});
router.get('/getproductinfobyid', function(req, res) {
  productservice.getproductinfobyid(req, res);
});
router.get('/getproductsbystockarea', function(req, res) {
  stockareaservice.getproductsofstockarea(req, res);
});
router.get('/getproductinfo', function(req, res) {
  productservice.getproductinfo(req, res);
});
router.get('/getinfobymaterial', function(req, res) {
  productservice.getinfobymaterial(req, res);
});
router.post('/delete', function(req, res, next) {
  commonService.delete(req, res, 'product');
});
module.exports = router;
