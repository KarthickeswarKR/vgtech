var express = require('express');
var uuid = require("node-uuid");
var resHandler = require("../common/res-handler");
var commonService = require("../common/commonService.js");
var message = require('../models/message');
var user = require('../models/users');
var config = require('../config/config')
var InternalServerError = config.get('errorcodes:InternalServerError');
var InputsError = config.get('errorcodes:InputsError');
var DuplicateUser = config.get('errorcodes:DuplicateUser');
var DuplicateEmail = config.get('errorcodes:DuplicateEmail/Mobile');
var tokenExpired = config.get('errorcodes:tokenExpired');
var unauthorised = config.get('errorcodes:unauthorised');
var passwordNotMatch = config.get('errorcodes:passwordNotMatch');
var EmailNotverified = config.get('errorcodes:EmailNotverified');
exports.addmessage = function(req,res) {
  try {
    if(!req.body.to ||  !req.body.message){
      commonService.error(res, "InputsError", {
        code: InputsError
      });
    }else{
    var Id = uuid.v1();
    var info=new message({
      _id:Id,
      initiator:req.headers['userid'],
      receiptent:req.body.to,
      initiatorOrganisation:req.headers['organisationid'],
      message:req.body.message
    })
    info.save(function(err,info){
      if (err) {
        commonService.error(res, err.message, {
          code: InternalServerError
        });
      } else {
        resHandler.success(res, info);
      }
    })
  }
  } catch (err) {
    commonService.error(res, err.message, {
      code: InternalServerError
    });
  }
};
exports.getinfo = function(req, res, next) {
  try {
    message.find({$or:[{'receiptent.userId':req.headers['userid']},{initiator:req.headers['userid']}]}).populate('initiator receiptent.userId receiptent.organisationId initiatorOrganisation').exec(function(err, data){
      if (err) {
        commonService.error(res, err.message, {
          code: InternalServerError
        });
      } else {
        resHandler.success(res, data);
      }
    });
  } catch (err) {
    commonService.error(res, err.message, {
      code: InternalServerError
    });
  }
};
exports.update = function(req, res, next) {
  try {
    message.update({'receiptent.userId':req.headers['userid'],'receiptent.status':config.get('status:message:unread')},{$set:{'receiptent.$.status':config.get('stats:message:read')}},{multi:true}).exec(function(err, data){
      if (err) {
        commonService.error(res, err.message, {
          code: InternalServerError
        });
      } else {
        resHandler.success(res, data);
      }
    });
  } catch (err) {
    commonService.error(res, err.message, {
      code: InternalServerError
    });
  }
};
