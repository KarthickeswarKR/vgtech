var express = require('express');
var router = express.Router();
var uuid = require("node-uuid");

var resHandler = require("../common/res-handler");
var commonService = require("../common/commonService.js");
var brandmaterial = require('../models/brandmaterial');
var brandmaterialservice = require('../services/brandmaterialservice');
var material = require('../models/material');
router.post('/addlike', function(req, res, next) {
  brandmaterialservice.addlike(req, res);
});
router.post('/removelike', function(req, res, next) {
  brandmaterialservice.removelike(req, res);

});
router.post('/addreview', function(req, res, next) {
  brandmaterialservice.addreview(req, res);
});
router.get('/getinfo', function(req, res, next) {
  brandmaterialservice.getinfo(req, res);
});
module.exports = router;
