var express = require('express');

var router = express.Router();
var materialservice = require('../services/materialservice');

router.get('/autocomplete', function(req, res, next) {
  materialservice.autocomplete(req, res);
});
router.post('/getmaterial', function(req, res, next) {
  materialservice.getmaterial(req, res);
});
router.post('/getallmaterial', function(req, res, next) {
  materialservice.getallmaterials(req, res);
});
module.exports = router;
