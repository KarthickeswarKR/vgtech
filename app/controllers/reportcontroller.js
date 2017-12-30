var express = require('express');
var router = express.Router();
var report = require('../models/report');
var uuid = require("node-uuid");
var resHandler = require("../common/res-handler");
var commonService = require("../common/commonService.js");
var config = require('../config/config')
var InternalServerError = config.get('errorcodes:InternalServerError');
var InputsError = config.get('errorcodes:InputsError');
var DuplicateUser = config.get('errorcodes:DuplicateUser');
var DuplicateEmail = config.get('errorcodes:DuplicateEmail/Mobile');
var tokenExpired = config.get('errorcodes:tokenExpired');
var unauthorised = config.get('errorcodes:unauthorised');
var passwordNotMatch = config.get('errorcodes:passwordNotMatch');
var EmailNotverified = config.get('errorcodes:EmailNotverified');
router.post('/addreport', function(req, res, next) {
  try {
    if(req.body.productId && req.body.message){
    var Id = uuid.v1();
    var info=new report({
      _id:Id,
      userId:userId,
      receiptent:receiptentId,
      initiatorOrganisationId:initiator,
      type:type,
  //    img:initiatorinfo.stockareaId.userId.profilePic,
      receiptentOrganisationId:receiptent,
      message:initiatorinfo.productId.productName+ " in " +initiatorinfo.stockareaId.stockareaName+ data.message + " in " + receiptentinfo.productId.productName + receiptentinfo.stockareaId.stockareaName
    })
    info.save(function(err,info){
if(err){
  commonService.error(res, err, {
    code: InternalServerError
  });
}else{
  resHandler.success(res, info);
}
    })
  }else{
    commonService.error(res, "inputs error", {
      code: InputsError
    });
  }
  } catch (err) {
    commonService.error(res, err, {
      code: InternalServerError
    });
    }
});
module.exports = router;
