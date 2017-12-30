var express = require('express');
var router = express.Router();
var commonService = require("../common/utils.js");
var organisationservice = require('../services/organisationservice');
var organisation = require('../models/organisation');
router.post('/addorganisation', function(req, res, next) {
  organisationservice.addorganisation(req, res);
});
router.get('/checkorganisation', function(req, res, next) {
  organisationservice.checkorganisation(req, res);
});
router.get('/getuserorginfo', function(req, res, next) {
  organisationservice.getuserorginfo(req, res);
});

router.get('/autocomplete', function(req, res, next) {
  organisationservice.autocomplete(req, res);
});
router.post('/updateorganisation', function(req, res, next) {
  organisationservice.updateorganisation(req, res);
});
router.post('/ignorecollabrator', function(req, res, next) {
  organisationservice.ignorecollabrator(req, res);
});
router.get('/getorganisation', function(req, res, next) {
  organisationservice.getinfo(req, res);
});
router.get('/deletecollabrator', function(req, res, next) {
  organisationservice.deletecollabrator(req, res);
});
router.post('/addcollabrator', function(req, res, next) {
  organisationservice.addcollabrator(req, res);
});
router.post('/collabrator', function(req, res, next) {
  organisationservice.collabrator(req, res);
});
router.post('/delete', function(req, res, next) {
  commonService.delete(req, res, 'organisation');
});
module.exports = router;
