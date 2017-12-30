var express = require('express');
var router = express.Router();
var unit = require('../models/unit');
var derivedunit = require('../models/derivedunit');
var product = require('../models/product');
var statuscode = require('../models/statuscode');
var category = require('../models/category');
var categoryservice = require('../services/categoryservice');
//var jwt = require('jsonwebtoken');

router.post('/addcategory', function(req, res, next) {
categoryservice.addcategory(req,res);
});
router.get('/units', function(req, res, next) {
  unit.find({}, function(err, data) {
    if (err) {
      res.send(err);
    } else {
      res.send(data);
    }
  });
});
router.get('/derivedunits', function(req, res, next) {
  derivedunit.find({}).populate('baseunit').exec(function(err, data) {
    if (err) {
      res.send(err);
    } else {
      res.send(data);
    }
  });
});
router.get('/types', function(req, res, next) {
  statuscode.find({
    type: 'type'
  }, function(err, data) {
    if (err) {
      res.send(err);
    } else {
      res.send(data);
    }
  });
});
router.get('/stockareatypes', function(req, res, next) {
  statuscode.find({
    type: 'stockareatype'
  }, function(err, data) {
    if (err) {
      res.send(err);
    } else {
      res.send(data);
    }
  });
});
router.get('/category', function(req, res, next) {
  category.find({}, function(err, data) {
    if (err) {
      res.send(err);
    } else {
      res.send(data);
    }
  });
});
module.exports = router;
