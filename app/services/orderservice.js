var express = require('express');
var order = require('../models/order.js');
var uuid = require("node-uuid");
var productstockservice = require('../services/productstockservice');
var stockarea = require('../services/stockareaservice');
var config = require('../config/config')
var InternalServerError = config.get('errorcodes:InternalServerError');
var InputsError = config.get('errorcodes:InputsError');
var DuplicateUser = config.get('errorcodes:DuplicateUser');
var DuplicateEmail = config.get('errorcodes:DuplicateEmail/Mobile');
var tokenExpired = config.get('errorcodes:tokenExpired');
var unauthorised = config.get('errorcodes:unauthorised');
var passwordNotMatch = config.get('errorcodes:passwordNotMatch');
var EmailNotverified = config.get('errorcodes:EmailNotverified');
var transactionhistory = require('../services/transactionhistoryservice');
var resHandler = require("../common/res-handler");
var commonService = require("../common/commonService.js");
exports.addorder = function(req, res) {
  var start = new Date();
  var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  var orderId = uuid.v1();
  var stock = new order({
    _id: orderId,
    orderId: orderId,
    userId: req.headers['userid'],
    productId: req.body.productId,
    productstockId: req.body.productstockId,
    sellId: req.body.sellId,
    stockareaId: req.body.stockareaId,
    destinationStockareaId: req.body.destinationstockareaId,
    quantity: req.body.quantity,
    cost: req.body.cost,
    package: req.body.package,
    noOfPackages: req.body.noOfPackage
  });
  stock.save(function(err, add) {
    if (err) {
      //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });
      commonService.error(res, "Internal Server Error", {
        code: InternalServerError
      });
    } else {
      productstockservice.updatestocks(req, res, add);
    }
  });
};
exports.getordersofstockarea = function(req, res) {
  var start = new Date();
  var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  var data = {};
  order.find({
    stockareaId: req.query.stockareaId
  }).populate({
    path: 'productId',
    select: 'productId productName specifications package unit'
  }).exec(function(err, orders) {
    if (err) {
      //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,'stockareaId':req.query.stockareaId });
      commonService.error(res, "Internal Server Error", {
        code: InternalServerError
      });
    } else {
      data.userId = req.query.userId;
      data.stockareaId = req.query.stockareaId;
      data.orders = orders;
      //log.info({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start, 'stockareaId':req.query.stockareaId });
      resHandler.success(res, data);
    }
  })
};
exports.getordersformap = function(req, res) {
  var start = new Date();
  var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  order.find({
    stockareaId: req.query.stockareaId,
    productId: req.query.productId
  }).exec(function(err, orders) {
    if (err) {
      //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,'stockareaId':req.query.stockareaId,
      //log.error
      commonService.error(res, "Internal Server Error", {
        code: InternalServerError
      });
    } else {
      //log.info({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,'stockareaId':req.query.stockareaId,
      //log.error
      resHandler.success(res, orders);
    }
  })
};
exports.conform = function(req, res) {
  var start = new Date();
  var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  order.update({
    _id: req.body.orderId
  }, {
    $set: {
      status: "Approved"
    }
  }, {
    upsert: true
  }, function(err, orders) {
    if (err) {
      //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });
      commonService.error(res, "Internal Server Error", {
        code: InternalServerError
      });
    } else {
      //log.info({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });
      resHandler.success(res, orders);
      transactionhistory.conform(req.body.orderId, req.headers['userid'])
    }
  })
};
exports.cancel = function(req, res) {
  var start = new Date();
  var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  order.update({
    _id: req.body.orderId
  }, {
    $set: {
      status: "cancelled"
    }
  }, {
    upsert: true
  }, function(err, orders) {
    if (err) {
      //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });
      commonService.error(res, "Internal Server Error", {
        code: InternalServerError
      });
    } else {
      //log.info({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });
      resHandler.success(res, orders);
      transactionhistory.cancel(req.body.orderId, req.headers['userid']);
    }
  })
};
exports.decline = function(req, res) {
  var start = new Date();
  var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  order.update({
    _id: req.body.orderId
  }, {
    $set: {
      status: "cancelled"
    }
  }, {
    upsert: true
  }, function(err, orders) {
    if (err) {
      //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });
      commonService.error(res, "Internal Server Error", {
        code: InternalServerError
      });
    } else {
      //log.info({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });
      resHandler.success(res, orders);
      transactionhistory.decline(req.body.orderId, req.headers['userid']);
    }
  })
};
exports.deliveried = function(req, res) {
  var start = new Date();
  var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  order.update({
    _id: req.body.orderId
  }, {
    $set: {
      status: "deliveried"
    }
  }, {
    upsert: true
  }, function(err, orders) {
    if (err) {
      //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });
      commonService.error(res, "Internal Server Error", {
        code: InternalServerError
      });
    } else {
      //log.info({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });
      resHandler.success(res, orders);
      transactionhistory.delivery(req.body.orderId, req.headers['userid']);
    }
  })
};
exports.getordersbyproductinstockarea = function(req, res) {
  var start = new Date();
  var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  var data = {};
  order.find({
    stockareaId: req.query.stockareaId,
    productId: req.query.productId
  }).populate({
    path: 'productId',
    select: 'productName specifications package unit images'
  }).exec(function(err, orders) {
    if (err) {
      //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });
      commonService.error(res, "Internal Server Error", {
        code: InternalServerError
      });
    } else {
      data.userId = req.query.userId;
      data.stockareaId = req.query.stockareaId;
      data.orders = orders;
      //log.info({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });
      resHandler.success(res, data);
    }
  })
};

exports.getorderdetails = function(req, res) {
  var start = new Date();
  var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  var data = {};
  try {
    order.findOne({
      orderId: req.query.orderId
    }).populate({
      path: 'productId',
      populate: {
        path: 'brandId variantId materialId'
      }
    }).populate('stockareaId destinationStockareaId').exec(function(err, orders) {
      if (err) {
        //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });
        commonService.error(res, "Internal Server Error", {
          code: InternalServerError
        });
      } else {
        data.stockareaId = orders.stockareaId;
        data.orders = orders;
        //log.info({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });
        resHandler.success(res, data);
      }
    })
  } catch (err) {
    //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });
    commonService.error(res, "Internal Server Error", {
      code: InternalServerError
    });

  }
};
exports.getdestinationsforproduct = function(req, res) {
  var start = new Date();
  var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  var stockareas = [];
  var sk = {};
  var tradeinfo = {
    "Cost": "15$ per KG",
    "Distance": "2500KM",
    "Time": "125Mins"
  }
  order.find({
    stockareaId: req.query.stockareaId,
    productId: req.query.productId
  }, function(err, ordr) {
    if (err) {
      //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });
      commonService.error(res, "Internal Server Error", {
        code: InternalServerError
      });
    } else {
      for (i = 0; i < ordr.length; i++) {
        stockareas.push(ordr[i].destinationStockareaId);
      }
      stockarea.viewdetails(req, res, stockareas).then(function(data) {
        for (i = 0; i < data.length; i++) {
          data[i].tradeinfo = tradeinfo;

        }
        stockarea.getinfo(req, res).then(function(data1) {
          sk.source = data1;
          sk.destinations = data;
          if (data !== null) {
            for (i = 0; i < data.length; i++) {
              data[i].tradeinfo = tradeinfo;

            }
            Promise.all(data).then(function() {
              //log.info({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });
              resHandler.success(res, sk)
            })
          }

        }, function(err) {
          //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });
          commonService.error(res, "Internal Server Error", {
            code: InternalServerError
          });

        })
      }, function(err) {
        //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });
        commonService.error(res, "Internal Server Error", {
          code: InternalServerError
        });

      })
    }
  })
};
