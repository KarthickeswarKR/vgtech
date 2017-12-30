var express = require('express');
var uuid = require("node-uuid");
var resHandler = require("../common/res-handler");
var material = require("../models/material");
var config = require('../config/config');
var InternalServerError = config.get('errorcodes:InternalServerError');
var InputsError = config.get('errorcodes:InputsError');
var DuplicateUser = config.get('errorcodes:DuplicateUser');
var DuplicateEmail = config.get('errorcodes:DuplicateEmail/Mobile');
var tokenExpired = config.get('errorcodes:tokenExpired');
var unauthorised = config.get('errorcodes:unauthorised');
var passwordNotMatch = config.get('errorcodes:passwordNotMatch');
var EmailNotverified = config.get('errorcodes:EmailNotverified');
var commonService = require("../common/commonService.js");
var utils = require("../common/utils.js");
exports.autocomplete = function(req, res) {
  try {
    var userId = utils.getUserId(req.header('Authorization'));
    material.find({
      $or: [{
        materialName: {
          "$regex": req.query.term,
          "$options": "i"
        },
        type: config.get('product:type:virtualgodown')
      }, {
        materialName: {
          "$regex": req.query.term,
          "$options": "i"
        },
        type: config.get('product:type:withInOrganisation'),
        createdBy: userId
      }, {
        materialName: {
          "$regex": req.query.term,
          "$options": "i"
        },
        type: config.get('product:type:withInNetwork'),
        createdBy: userId
      }]
    }, function(err, value) {
      if (err) {
        commonService.error(res, err.message, InternalServerError);
      } else {
        resHandler.success(res, value);
      }
    })
  } catch (err) {
    console.error("{" + "'Message':'error in search" + ",'Url':" + req.originalUrl + "}");
    commonService.error(res, "Something went Wrong Try again", InternalServerError);
  }
};
exports.material = function(req, res) {
  material.find({
    materialName: req.body.name
  }, function(err, data) {
    if (err) {
      res.send(err);
    } else {

      res.send(data[0]);
    }
  })
};
exports.getmaterial = function(req, res) {
  material.find({
    _id: req.body.materialId
  }, function(err, data) {
    if (err) {
      res.send(err);
    } else {
      res.send(data[0]);
    }
  })
};
exports.getallmaterials = function(req, res) {
  material.find({
    status: 'active'
  }, function(err, data) {
    if (err) {
      res.send(err);
    } else {
      res.send(data);
    }
  })
};
