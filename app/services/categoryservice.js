var express = require('express');
var category = require('../models/category');
var uuid = require("node-uuid");
var resHandler = require("../common/res-handler");
var utils = require("../common/utils.js");
var uuid=require('node-uuid');
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
exports.addcategory = function(req, res) {
  if(!req.body.categoryname){
    commonService.error(res, "Inputs Error", {
      code: InputsError
    });
  }else{
  var userId = utils.getUserId(req.header('Authorization'));
  var Id = uuid.v1();
  var newcategory = new category({
    _id: Id,
    createdBy: userId,
    name: req.body.categoryname,
    description:req.body.categorydescription,
  });
  newcategory.save(function(err, add) {
    if (err) {
      console.log(err);
      //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });
      commonService.error(res, "Internal Server Error", {
        code: InternalServerError
      });
    } else {
      resHandler.success(res, add);
    }
  });
}
};
