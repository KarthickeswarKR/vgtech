var express = require('express');
var product = require('../models/privateproduct.js');
var uuid = require("node-uuid");
var resHandler = require("../common/res-handler");
var config = require('../config/config');
var commonService = require("../common/commonService.js");
var InternalServerError = config.get('errorcodes:InternalServerError');
var InputsError = config.get('errorcodes:InputsError');
var InternalServerError = config.get('errorcodes:InternalServerError');
var InputsError = config.get('errorcodes:InputsError');
var DuplicateUser = config.get('errorcodes:DuplicateUser');
var DuplicateEmail = config.get('errorcodes:DuplicateEmail/Mobile');
var tokenExpired = config.get('errorcodes:tokenExpired');
var unauthorised = config.get('errorcodes:unauthorised');
var passwordNotMatch = config.get('errorcodes:passwordNotMatch');
var EmailNotverified = config.get('errorcodes:EmailNotverified');
exports.add = function(req, res) {
  var Id = uuid.v1();
  try {
    if (req.body.productname != null || req.body.productname !== undefined || req.body.orgId !== null || req.body.orgId !== undefined || req.body.pics !== null || req.body.pics !== undefined || req.body.productmanufacturer !== null || req.body.productmanufacturer !== undefined) {
      var products = new product({
        _id: Id,
        productId: Id,
        productName: req.body.productname,
        productOwner: req.body.orgId,
        primaryImage: req.body.pics[0].img,
        brandId: req.body.productbrand,
        specifications: req.body.productdescription,
        images: req.body.pics,
        type: req.body.producttype,
        createdBy: req.headers['userid'],
        manufacturer: req.body.productmanufacturer,
        categoryId: req.body.productcategory,
        unit: req.body.productunit,
      });
      products.save(function(err, add) {
        if (err) {
          commonService.error(res, "product not added", {
            code: InternalServerError
          });
        } else {
          resHandler.success(res, add);
        }
      })
    } else {
      commonService.error(res, "error in inputs", {
        code: InputsError
      });
    }
  } catch (err) {
    commonService.error(res, "Internal Server Error", {
      code: InternalServerError
    });
  }
};

exports.getprivateproducts = function(req, res) {
  try {
    product.find({
      userId: req.headers['userid']
    }).exec(function(err, data) {
      if (err) {
        //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,'productId': req.query.productId });
        commonService.error(res, "Internal Server Error", {
          code: InternalServerError
        });
      } else {
        //log.info({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,'productId': req.query.productId });
        resHandler.success(res, data);
      }
    })
  } catch (err) {

    //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,'productId': req.query.productId });
    commonService.error(res, "Internal Server Error", {
      code: InternalServerError
    });

  }
};

exports.getproductinfobyid = function(req, res) {
  var start = new Date();
  var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  try {
    product.findOne({
      productId: req.query.productId
    }).populate('brandId variantId').populate({
      path: 'package',
      model: 'package'
    }).exec(function(err, data) {
      if (err) {
        //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,'productId': req.query.productId });
        commonService.error(res, "Internal Server Error", {
          code: InternalServerError
        });
      } else {
        //log.info({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,'productId': req.query.productId });
        resHandler.success(res, data);
      }
    })
  } catch (err) {

    //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,'productId': req.query.productId });
    commonService.error(res, "Internal Server Error", {
      code: InternalServerError
    });

  }
};
exports.getproductinfo = function(req, res) {
  var start = new Date();
  var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  try {
    productstock.findOne({
      productId: req.query.productId,
      stockareaId: req.query.stockareaId
    }, function(err, data) {
      if (err) {
        //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,'productId': req.query.productId,'stockareaId':req.query.stockareaId });
        commonService.error(res, "Internal Server Error", {
          code: InternalServerError
        });
      } else {
        if (!data) {
          try {
            product.findOne({
              _id: req.query.productId
            }, function(err, productinfo) {
              if (err) {
                //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,'productId': req.query.productId,'stockareaId':req.query.stockareaId });
                commonService.error(res, "Internal Server Error", {
                  code: InternalServerError
                });
              } else if (!productinfo) {
                commonService.error(res, "null", {
                  code: InternalServerError
                });
              } else {
                var productdata = productinfo.toObject();
                productdata.added = false;
                //log.info({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start ,'productId': req.query.productId,'stockareaId':req.query.stockareaId});
                resHandler.success(res, productdata);
              }
            })
          } catch (err) {

            //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start ,'productId': req.query.productId,'stockareaId':req.query.stockareaId});
            commonService.error(res, "Internal Server Error", {
              code: InternalServerError
            });

          }
        } else {
          try {
            stockarea.findOne({
              _id: req.query.stockareaId,
              products: data._id
            }, function(err, stockareainfo) {
              if (err) {
                //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,'productId': req.query.productId,'stockareaId':req.query.stockareaId });
                commonService.error(res, "Internal Server Error", {
                  code: InternalServerError
                });
              } else {
                try {
                  product.findOne({
                    productId: req.query.productId
                  }, function(err, productinfo) {
                    if (err) {
                      //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,'productId': req.query.productId,'stockareaId':req.query.stockareaId });
                      commonService.error(res, "Internal Server Error", {
                        code: InternalServerError
                      });
                    } else {
                      var productdata = productinfo.toObject();
                      if (stockareainfo == null || stockareainfo == undefined) {
                        productdata.added = false;
                        //log.info({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,'productId': req.query.productId,'stockareaId':req.query.stockareaId });
                        resHandler.success(res, productdata);
                      } else {
                        productdata.added = true;
                        //log.info({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start ,'productId': req.query.productId,'stockareaId':req.query.stockareaId});
                        resHandler.success(res, productdata);
                      }
                    }
                  })
                } catch (err) {

                  //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,'productId': req.query.productId,'stockareaId':req.query.stockareaId });
                  commonService.error(res, "Internal Server Error", {
                    code: InternalServerError
                  });

                }
              }
            })
          } catch (err) {

            //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start ,'productId': req.query.productId,'stockareaId':req.query.stockareaId});
            commonService.error(res, "Internal Server Error", {
              code: InternalServerError
            });

          }
        }
      }
    })
  } catch (err) {

    //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,'productId': req.query.productId,'stockareaId':req.query.stockareaId });
    commonService.error(res, "Internal Server Error", {
      code: InternalServerError
    });

  }
};
