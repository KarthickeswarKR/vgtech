var express = require('express');
var router = express.Router();
var utils = require("../common/utils.js");
var stockareaservice = require('../services/stockareaservice');
var requestValidator=require('../common/requestValidator');
var commonService = require("../common/commonService.js");
var config = require('../config/config')
var InputsError = config.get('errorcodes:InputsError');

router.post('/addstockarea', function(req, res, next) {
  stockareaservice.addstockarea(req, res);
});
router.post('/up', function(req, res, next) {
  stockareaservice.updatestockinfodata(req, res);
});
router.post('/addnewemail', function(req, res, next) {
  stockareaservice.addmail(req, res);
});
router.get('/autocomplete', function(req, res, next) {
  stockareaservice.autocomplete(req, res);
});
router.post('/updatevisiblity', function(req, res, next) {
  stockareaservice.updatevisiblity(req, res);
});
router.post('/addnewmobile', function(req, res, next) {
  stockareaservice.addmobile(req, res);
});
router.post('/primaryemail', function(req, res, next) {
  stockareaservice.primaryemail(req, res);
});
router.post('/deleteemail', function(req, res, next) {
  stockareaservice.deleteemail(req, res);
});
router.post('/deletemobile', function(req, res, next) {
  stockareaservice.deletemobile(req, res);
});
router.post('/primarymobile', function(req, res, next) {
  stockareaservice.primarymobile(req, res);
});
router.post('/updatestockarea', function(req, res, next) {
  stockareaservice.updatestockarea(req, res);
});
router.get('/getallstockareas', function(req, res, next) {
  stockareaservice.getallstockareas(req, res);
});
router.get('/getstockareainfo', function(req, res, next) {
  stockareaservice.getstockareainfo(req, res);
});

router.get('/destiny', function(req, res, next) {
  stockareaservice.destiny(req, res);
});
router.post('/delete', function(req, res, next) {
  utils.delete(req, res, 'stockarea');
});
router.post('/checkstockarea', function(req, res) {
  stockareaservice.checkstockarea(req, res);
});
router.post('/deleteproduct', function(req, res) {
  stockareaservice.deleteproduct(req, res);
});
router.post('/rename', function(req, res) {
  stockareaservice.rename(req, res);
})
router.post('/updateproducts', function(req, res) {
  stockareaservice.updateproducts(req, res);
})
router.get('/getproductinfoforstockarea', function(req, res) {
  stockareaservice.getproductinfoforstockarea(req, res);
})
router.get('/getstockareas', function(req, res) {
  stockareaservice.getstockareas(req, res);
})
router.get('/getallstockareasofuser', function(req, res) {
  stockareaservice.getallstockareasofuser(req, res);
})
router.get('/getproductsofstockarea', function(req, res) {
  stockareaservice.getproductsofstockarea(req, res);
})
router.get('/getstockarea', function(req, res) {
  stockareaservice.getstockarea(req, res);
})


module.exports = router;
