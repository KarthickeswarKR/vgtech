var express = require('express');
var router = express.Router();

var packageservice = require('../services/packageservice');

router.post('/addpackage', function(req, res, next) {
  packageservice.addpackage(req, res);
});
router.post('/suggestpackage', function(req, res, next) {
  packageservice.suggestpackage(req, res);
});
module.exports = router;
