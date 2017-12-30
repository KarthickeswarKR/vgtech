/**
 * Created by Karthick Eswar K R on 16/05/2017.
 */
var express = require('express');
var router = express.Router();
var utils = require("../common/utils.js");
var userservice = require('../services/userservice');
var requestValidator=require('../common/requestValidator');
var commonService = require("../common/commonService.js");
var config = require('../config/config')
var InputsError = config.get('errorcodes:InputsError');

router.post('/adduser', function(req, res, next) {
  var validator=requestValidator.adduser(req,res);
  if(validator !== true){
    commonService.error(res, validator, {
      code: InputsError
    });
  }
  else
  userservice.addservice(req, res);

});
router.get('/geturl', function(req, res, next) {
  userservice.geturl(req, res);
});
router.post('/verifyemail', function(req, res, next) {
  userservice.verifyemail(req, res);
});
router.get('/autocomplete', function(req, res, next) {
  userservice.autocomplete(req, res);
});
router.get('/messagetoautocomplete', function(req, res, next) {
  userservice.messagetoautocomplete(req, res);
});
router.post('/validatetoken', function(req, res, next) {
  userservice.validatetoken(req, res);
});

router.get('/getcodes', function(req, res, next) {
  userservice.getcodes(req, res);
});
router.get('/getimage', function(req, res, next) {
  userservice.getimage(req, res);
});
router.post('/update', function(req, res, next) {
  userservice.update(req, res);
});
router.post('/checkemail', function(req, res, next) {

  userservice.checkemail(req, res);
});
router.post('/checkuserid', function(req, res, next) {
  userservice.checkuserid(req, res);
});
router.post('/checkphone', function(req, res, next) {
  userservice.checkphone(req, res);
});
router.post('/updateprofilepic', function(req, res, next) {
  userservice.updateprofilepic(req, res);
});
router.post('/verify', function(req, res, next) {
  userservice.verify(req, res);
});
router.post('/mobile/verifyemail', function(req, res, next) {
  userservice.mobileverifyemail(req, res);
});
router.post('/verifymobileotp', function(req, res, next) {
  userservice.verifymobileotp(req, res);
});
router.post('/forgetPassword', function(req, res, next) {
  var validator=requestValidator.forgetpassword(req,res);
  if(validator !== true){
    commonService.error(res, validator, {
      code: InputsError
    });
  }
  userservice.forgetpassword(req, res);
});
router.post('/mobile/forgetPassword', function(req, res, next) {
  userservice.mobileforgetpassword(req, res);
});
router.post('/verifyemail', function(req, res, next) {
  userservice.verifyemail(req, res);
});
router.post('/verifymobile', function(req, res, next) {
  userservice.verifymobile(req, res);
});
router.post('/onVerifyAction', function(req, res, next) {
  userservice.resetpassword(req, res);
});
router.get('/getemails', function(req, res, next) {
  userservice.getemails(req, res);
});
router.post('/updateorganisation', function(req, res, next) {
  userservice.updateorganisation(req, res);
});
router.post('/deleteemail', function(req, res, next) {
  userservice.deleteemail(req, res);
});
router.post('/deletemobile', function(req, res, next) {
  userservice.deletemobile(req, res);
});
router.post('/deleteorganisation', function(req, res, next) {
  userservice.deleteorganisation(req, res);
});
router.post('/editorganisation', function(req, res, next) {
  userservice.editorganisation(req, res);
});
router.post('/addnewmail', function(req, res, next) {
  userservice.addnewmail(req, res);
});
router.post('/addprimary', function(req, res, next) {
  userservice.addprimary(req, res);
});
router.post('/addnewmobile', function(req, res, next) {
  userservice.addnewmobile(req, res);
});
router.post('/addprimarymobile', function(req, res, next) {
  userservice.addprimarymobile(req, res);
});
router.post('/addsecondary', function(req, res, next) {
  userservice.addsecondary(req, res);
});

router.post('/updatepassword', function(req, res, next) {
  userservice.updatepassword(req, res);
});
router.get('/getuser', function(req, res, next) {
  userservice.getuser(req, res);
});
router.post('/deleteuser', function(req, res, next) {
  utils.delete(req, res, 'user');
});

module.exports = router;
