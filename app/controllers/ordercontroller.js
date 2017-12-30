var express = require('express');
var router = express.Router();

var sellservice = require('../services/sellservice');
var orderservice = require('../services/orderservice');
var transactionhistoryservice = require('../services/transactionhistoryservice');

router.post('/addorder', function(req, res, next) {
  orderservice.addorder(req, res);
});
router.get('/getordersofstockarea', function(req, res, next) {
  orderservice.getordersofstockarea(req, res);
});
router.get('/getordersformap', function(req, res, next) {
  orderservice.getordersformap(req, res);
});

router.get('/getorderdetails', function(req, res, next) {
  orderservice.getorderdetails(req, res);
});
router.get('/getordersbyproductinstockarea', function(req, res, next) {
  transactionhistoryservice.gethistory(req, res);
});
/*.get('/getordersbyproductinstockarea',passport.authenticate('jwt', {
    session: false
}),function(req, res, next) {
    orderservice.getordersbyproductinstockarea(req,res);
});*/
router.post('/conform', function(req, res, next) {
  orderservice.conform(req, res);
});
router.post('/cancel', function(req, res, next) {
  orderservice.cancel(req, res);
});
router.post('/decline', function(req, res, next) {
  orderservice.decline(req, res);
});
router.post('/deliveried', function(req, res, next) {
  orderservice.deliveried(req, res);
});
router.post('/getdestinationsforproduct', function(req, res, next) {
  sellservice.getdestinationsforproduct1(req, res);
});

module.exports = router;
