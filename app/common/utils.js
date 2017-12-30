/**
 * Created by Karthick Eswar K R on 18/10/2016.
 */
var async = require("async");
var jwtDecode = require('jwt-decode');
var accessToken = require('../models/accessToken');
var userservice = require('../services/userservice');
var resHandler = require("../common/res-handler");
var organisationservice = require('../services/organisationservice');
var productservice = require('../services/productservice');
var sellservice = require('../services/sellservice');
var productstockservice = require('../services/productstockservice');
var stockareaservice = require('../services/stockareaservice');
var config = require('../config/config');
var commonService = require('../common/commonService');
var utils = require('../common/utils');
var InternalServerError = config.get('errorcodes:InternalServerError');
exports.getUserId = function(accessToken) {
  var token = utils.getToken(accessToken)
  var decoded = jwtDecode(token);
  return decoded.sub;
};
exports.getToken = function(bearerToken) {
  return bearerToken != null && bearerToken.split(' ').length == 2 ? bearerToken.split(' ')[1] : null;
};
exports.delete = function(req, res, data) {
  var value = config.get("deleteType:" + data);
  var errorcode;
  var userId = utils.getUserId(req.header('Authorization'));
  var info;
  if (data == 'user') {
    info = {
      userId: userId
    }
  }
  if (data == 'organisation') {
    info = {
      userId: userId,
      organisationId: req.body.organisationId
    }
  }
  if (data == 'stockarea') {
    info = {
      userId: userId,
      stockareaId: req.body.stockareaId
    }
  }
  if (data == 'product') {
    info = {
      userId: userId,
      productId: req.body.productId
    }
  }
  if (data == 'sell') {
    info = {
      userId: userId,
      sellId: req.body.sellId
    }
  }
  async.waterfall([
      function(callback) {
        console.log("in user");
        if (value <= 1) {
          userservice.delete(info, req.body.password, data, (err, info) => {
            if (err) {
              callback(err);
            } else {
              callback(null);
            }
          })
        } else {
          callback(null);
        }
      },
      function(callback, org) {
        console.log("in org");
        if (value <= 2) {
          organisationservice.delete(info, data, (err, orginfo) => {
            if (err) {
              callback(err);
            } else {
              callback(null);
            }
          })
        } else {
          callback(null);
        }
      },
      function(callback) {
        console.log("in stockarea");
        if (value <= 3) {
          stockareaservice.delete(info, data, (err, stockinfo) => {
            if (err) {
              callback(err);
            } else {
              callback(null);
            }
          })
        } else {
          callback(null);
        }
      },
      function(callback) {
        console.log("in products");
          callback(null);
      },
      function(callback) {
        console.log("in ps");
        if (value <= 5) {
          productstockservice.delete(info, data, (err, productstockinfo) => {
            if (err) {
              callback(err);
            } else {
              callback(null);
            }
          })
        } else {
          callback(null);
        }
      },
      function(callback) {
        if (value <= 6) {
          sellservice.delete(info, data, (err, sellinfo) => {
            if (err) {
              callback(err);
            } else {
              callback(null);
            }
          })
        } else {
          callback(null);
        }
      }
    ],
    function(err, result) {
      if (err) {
        console.log(err);
        commonService.error(res, "Internal Server Error", {
          code: InternalServerError
        });
      } else {
        resHandler.success(res, "Successfully deleted");
      }
    });

};
