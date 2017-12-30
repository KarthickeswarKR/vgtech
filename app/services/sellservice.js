var express = require('express');
var sell = require('../models/sell.js');
var product = require('../models/product.js');
var uuid = require("node-uuid");
var unit = require('../models/unit');
var derivedunit = require('../models/derivedunit');
var buysell = require('../models/buysell.js');
var stockarea = require('../models/stockarea.js');
var config = require('../config/config')
var InternalServerError = config.get('errorcodes:InternalServerError');
var InputsError = config.get('errorcodes:InputsError');
var DuplicateUser = config.get('errorcodes:DuplicateUser');
var DuplicateEmail = config.get('errorcodes:DuplicateEmail/Mobile');
var tokenExpired = config.get('errorcodes:tokenExpired');
var unauthorised = config.get('errorcodes:unauthorised');
var passwordNotMatch = config.get('errorcodes:passwordNotMatch');
var EmailNotverified = config.get('errorcodes:EmailNotverified');
var productstockservice = require('../services/productstockservice');
var resHandler = require("../common/res-handler");
var stockareaservice = require('../services/stockareaservice');
var transactionhistory = require('../services/transactionhistoryservice');
var commonService = require("../common/commonService.js");
var sellservice = require("../services/sellservice");
exports.addsell = function(req, res) {
  var package = [];
  var quantit = 0;

  if (!req.body.stockareaId || req.body.stockareaId !== null || req.body.stockareaId !== undefined) {
    stockarea.findOne({
      _id: req.body.stockareaId
    }, function(err, stockinfo) {
      if (err) {
        //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });
        commonService.error(res, err, {
          code: InternalServerError
        });
      } else if (!stockinfo || stockinfo == null || stockinfo == undefined) {
        //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });
        commonService.error(res, "Internal Server Error1", {
          code: InternalServerError
        });
      } else {
        for (var i = 0; i < req.body.packages.length; i++) {
          if (req.body.packages[i].status == true) {
            package.push(req.body.packages[i]);
          }
        }
        if (package.length == 0) {
          sell.update({
            productId: req.body.productId,
            productstockId: req.body.productstockId,
            stockareaId: req.body.stockareaId
          }, {
            $set: {
              package: req.body.packages,
              unit: req.body.unit,
              updatedOn: new Date(),
              status: config.get('status:quote:inactive:quoteDeleted')
            }
          }, {
            upsert: true
          }, function(err, data) {
            if (err) {
              //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });
              commonService.error(res, err, {
                code: InternalServerError
              });
            } else {
              var quantity = [{"inStock":0}];
              productstockservice.updatestocksbysells1(req, res, data, quantity);
              transactionhistory.removesell(req.headers['userid'], req.body.productId, req.body.productstockId, req.body.stockareaId);
              sellservice.updateproductsellstatus(req.body.productId);
            }
          })
        } else {
          var unit;
          var stockdetails=[];
          package.forEach(function(packageinfo){
            var promise=derivedunit.findOne({unit:packageinfo.unit}).populate('baseunit').exec();
            promise.then(function(info){
              if(stockdetails.length==0){
                stockdetails.push({inStock:packageinfo.packagesAvailable * info.factor * packageinfo.size,unit:info.baseunit.name})
              }else{
                for(i=0;i<stockdetails.length;i++){
                  if(stockdetails[i].unit==info.baseunit.name){
                    var q=packageinfo.packagesAvailable * info.factor * packageinfo.size;
                    stockdetails[i].inStock=stockdetails[i].inStock+q;
                  }else{
                    stockdetails.push({inStock:packageinfo.packagesAvailable * info.factor * packageinfo.size,unit:info.baseunit.name})
                  }
            }
            }
              if(package[package.length-1]._id==packageinfo._id){
                sellservice.all(req,res,stockdetails,stockinfo)
              }
           })
        })
        }
      }
    })
  } else {
    //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });
    commonService.error(res, err, {
      code: InternalServerError
    });
  }
};
exports.all=function(req,res,stockdetails,stockinfo){
    try {
      sell.findOne({
        $or: [{
          productId: req.body.productId,
          productstockId: req.body.productstockId,
          stockareaId: req.body.stockareaId,
          status: {
            $gt: 199,
            $lt: 300
          }
        }, {
          productId: req.body.productId,
          productstockId: req.body.productstockId,
          stockareaId: req.body.stockareaId,
          status: config.get('status:quote:inactive:quoteDeleted')
        }]
      }, function(err, data) {
        if (err) {
          //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });
          commonService.error(res, err, {
            code: InternalServerError
          });
        } else {
          if (data == null || data == undefined || !data) {
            var sellId = uuid.v1();
            var stock = new sell({
              _id: sellId,
              sellId: sellId,
              userId: req.headers['userid'],
              productId: req.body.productId,
              productstockId: req.body.productstockId,
              stockareaId: req.body.stockareaId,
              package: req.body.packages,
              location:{
                type:'Point',
                coordinates:[stockinfo.latitude,stockinfo.longitude]
              },
              unit:unit
            });
            stock.save(function(err, add) {
              if (err) {
                console.log(err);
                //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });
                commonService.error(res, err, {
                  code: InternalServerError
                });
              } else {
                transactionhistory.addsell1(req.headers['userid'], req.body.productId, req.body.productstockId, req.body.stockareaId, add._id);
                productstockservice.updatestocksbysells(req, res, add, stockdetails);
                sellservice.updateproductsellstatus(req.body.productId);
              }
            });

          } else {
            sell.update({
              productId: req.body.productId,
              productstockId: req.body.productstockId,
              stockareaId: req.body.stockareaId
            }, {
              $set: {
                package: req.body.packages,
                unit: req.body.unit,
                updatedOn: new Date(),
                status: config.get('status:quote:active:created')
              }
            }, {
              upsert: true
            }, function(err, data) {
              if (err) {
                //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });
                commonService.error(res, err, {
                  code: InternalServerError
                });
              } else {
                transactionhistory.addsell1(req.headers['userid'], req.body.productId, req.body.productstockId, req.body.stockareaId, data._id);
                productstockservice.updatestocksbysells1(req, res, data, stockdetails);
                sellservice.updateproductsellstatus(req.body.productId);
                }
            })
          }
        }
      })
    } catch (err) {

      //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });
      commonService.error(res, err, {
        code: InternalServerError
      });

    }
}
exports.updateproductsellstatus=function(productid){
  sell.findOne({productId:productid,status: config.get('status:quote:active:created')},function(err,selldata){
    if(err){
      console.log(err);
    }else{
      if(!selldata){
        product.update({_id:productid},{$set:{status:config.get('status:product:active:created')}},{safe:true},function(err,data){
          if(err){
            console.log(err);
          }else{
            console.log("finished");
          }
        });
      }else{
        product.update({_id:productid},{$set:{status:config.get('status:product:active:createdwithsell')}},{safe:true},function(err,data){
          if(err){
            console.log(err);
          }else{
            console.log("finished2");
          }
        });
      }
    }
  })
}
exports.delete = function(info, data, callback) {
  sell.update(info, {
    $set: {
      status: config.get('status:quote:inactive:' + data + 'Deleted')
    }
  }, {
    multi: true
  }).exec(function(err, source) {
    if (err) {
      callback(err)
    } else {
      callback(null, source)
    }
  })
}
exports.getsellbyproductsinstockarea = function(req, res) {
  var start = new Date();
  var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  try {
    sell.find({
      stockareaId: req.query.stockareaId,
      productId: req.query.productId,
      status: config.get('status:quote:active:created')
    }, function(err, add) {
      if (err) {
        //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,"stockareaId":req.query.stockareaId,"productId":req.query.productId });
        commonService.error(res, err, {
          code: InternalServerError
        });
      } else {
        //log.info({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start ,"stockareaId":req.query.stockareaId,"productId":req.query.productId });
        resHandler.success(res, add);
      }
    });
  } catch (err) {

    //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,"stockareaId":req.query.stockareaId,"productId":req.query.productId  });
    commonService.error(res, err, {
      code: InternalServerError
    });

  }
};
exports.getsell = function(req, res) {
  var start = new Date();
  var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  try {
    sell.findOne({
      productstockId: req.query.productstockId,
      productId: req.query.productId,
      status: config.get('status:quote:active:created')
    }).populate('stockareaId').exec(function(err, add) {
      if (err) {
        //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start ,"productstockId":req.query.productstockId,"productId":req.query.productId });
        commonService.error(res, err, {
          code: InternalServerError
        });
      } else {
        //log.info({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,"productstockId":req.query.productstockId,"productId":req.query.productId });
        resHandler.success(res, add);
      }
    });
  } catch (err) {

    //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,"productstockId":req.query.productstockId,"productId":req.query.productId });
    commonService.error(res, err, {
      code: InternalServerError
    });

  }
};
exports.getsellbystockareaId = function(req, res) {
  var start = new Date();
  var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  try {
    sell.findOne({
      stockareaId: req.query.stockareaId,
      productId: req.query.productId,
      status: config.get('status:quote:active:created')
    }).select('stockareaId productId sellId productstockId package').populate({
      path: 'stockareaId',
      select: 'stockareaId stockareaName latitude longitude address'
    }).exec(function(err, add) {
      if (err) {
        //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,stockareaId:req.query.stockareaId,productId:req.query.productId });
        commonService.error(res, err, {
          code: InternalServerError
        });
      } else {
        //log.info({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,stockareaId:req.query.stockareaId,productId:req.query.productId });
        resHandler.success(res, add);
      }
    });
  } catch (err) {

    //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,stockareaId:req.query.stockareaId,productId:req.query.productId });
    commonService.error(res, err, {
      code: InternalServerError
    });

  }
};
exports.getdestinationsforproduct = function(req, res) {
  var stockareas = [];
  var s = [];
  var trade = {};
  try {
    product.findOne({
      productId: req.body.productId
    }, function(err, prod) {
      if (err) {
        //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,"productId":req.query.productId });
console.log(err);
        commonService.error(res, err, {
          code: InternalServerError
        });
      } else if (prod == null || prod == undefined || prod == [] || !prod) {
        console.log("null");
        //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,"productId":req.query.productId });
        commonService.error(res, err, {
          code: InternalServerError
        });

      } else {
        try {
          sell.find({
            productId: req.body.productId,
            stockareaId:{$ne:req.body.stockareaId},
            status: {
              $gt: 199,
              $lt: 300
            },
            'location.coordinates':{ $geoWithin: { $box:  [ [ req.body.position.south, req.body.position.west ], [ req.body.position.north, Math.abs(req.body.position.east) ] ] } }
          }).populate({
            path: 'stockareaId',
            match:{
              visiblity:{$ne:config.get('stockarea:type:onlyme')},
              $or: [{
                  visiblity: config.get('stockarea:type:public')
                }, {
                  userId:req.headers['userid'],
                  visiblity: config.get('stockarea:type:private')
                }, {
                  'collabrators.stockareaId':req.headers['stockareaid'],
                  visiblity: config.get('stockarea:type:private')
                }]
            }
          }).exec(function(err, add) {
            console.log(add);
            if (err) {
              console.log(err);

              //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,"productId":req.query.productId });
              commonService.error(res, err, {
                code: InternalServerError
              });
            } else if (add.length == 0 || add == null || add == undefined || add == [] || !add) {
              stockareaservice.getinfo(req, res, s);
            } else {
              add.forEach(function(data) {
                if(data.stockareaId!==null){
                if (stockareas.indexOf(data.stockareaId) === -1) {

                  stockareas.push(data.stockareaId);
                }
              }
              })
              if(stockareas.length !== 0 && stockareas!==null ){
              stockareas.forEach(function(item) {
                var r = item.toObject();
                try {
                  buysell.findOne({
                    $or: [{
                      stockareaId: req.body.stockareaId,
                      destinationStockareaId: item._id
                    }, {
                      stockareaId: item._id,
                      destinationStockareaId: req.body.stockareaId
                    }]
                  }, function(err, data) {
                    if (err) {
                      console.log(err);

                      //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,"productId":req.query.productId });
                      commonService.error(res, err, {
                        code: InternalServerError
                      });
                    } else if (data == undefined || data == null || !data) {
                      if(stockareas[stockareas.length-1]._id==item._id){
                        stockareaservice.getinfo(req, res, s);
                      }
                    } else {
                      trade.Distance = data.actualDistance;
                      trade.visiblity = item.visiblity;
                      trade.Phone = item.phone;
                      trade.code = item.code;
                      trade.stockareaName = item.stockareaName;
                      trade.productName = prod.productName;
                      r.tradeinfo = trade;
                      s.push(r);
                      if (item._id == stockareas[stockareas.length - 1]._id) {
                        stockareaservice.getinfo(req, res, s);
                      }
                    }
                    trade = {};
                  })
                } catch (err) {
                  console.log(err);

                  //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,"productId":req.query.productId });
                  commonService.error(res, err, {
                    code: InternalServerError
                  });

                }
              })
            }else{
              stockareaservice.getinfo(req, res, s);
            }
            }
          });
        } catch (err) {

          console.log(err);
          //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,"productId":req.query.productId });
          commonService.error(res, err, {
            code: InternalServerError
          });

        }
      }
    })
  } catch (err) {
    console.log(err);

    //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,"productId":req.query.productId });
    commonService.error(res, err, {
      code: InternalServerError
    });

  }
};
exports.getdestinationsforproduct1 = function(req, res) {
  var stockareas = [];
  var s = [];
  var trade = {};
  try {
    product.findOne({
      productId: req.body.productId
    }, function(err, prod) {
      if (err) {
        //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,"productId":req.query.productId });
        commonService.error(res, err, {
          code: InternalServerError
        });
      } else if (prod == null || prod == undefined || prod == [] || !prod) {
        //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,"productId":req.query.productId });
        commonService.error(res, err, {
          code: InternalServerError
        });

      } else {
        try {
          sell.find({
            productId: req.body.productId,
            stockareaId:{$ne:req.body.stockareaId},
            status: {
              $gt: 199,
              $lt: 300
            }
                    }).populate({
            path: 'stockareaId',
            match:{
              visiblity:{$ne:1005}
            }
          }).exec(function(err, add) {
            console.log(add);
            if (err) {
              //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,"productId":req.query.productId });
              commonService.error(res, err, {
                code: InternalServerError
              });
            } else if (add.length == 0 || add == null || add == undefined || add == [] || !add) {
              stockareaservice.getinfo(req, res, s);
            } else {
              add.forEach(function(data) {
                if(data.stockareaId!==null){
                if (stockareas.indexOf(data.stockareaId) === -1) {

                  stockareas.push(data.stockareaId);
                }
              }
              })
              if(stockareas.length !== 0 && stockareas!==null ){
              stockareas.forEach(function(item) {
                var r = item.toObject();
                try {
                  buysell.findOne({
                    $or: [{
                      stockareaId: req.body.stockareaId,
                      destinationStockareaId: item._id
                    }, {
                      stockareaId: item._id,
                      destinationStockareaId: req.body.stockareaId
                    }]
                  }, function(err, data) {
                    if (err) {
                      //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,"productId":req.query.productId });
                      commonService.error(res, err, {
                        code: InternalServerError
                      });
                    } else if (data == undefined || data == null || !data) {
                      if(stockareas[stockareas.length-1]._id==item._id){
                        stockareaservice.getinfo(req, res, s);
                      }
                    } else {
                      console.log(prod.type);
                      if(item.visiblity!==config.get('stockarea:type:public')){
                        trade.viewmore = false;
                      }else{
                        trade.viewmore = true;
                      }
                      trade.Distance = data.actualDistance;
                      trade.Phone = item.phone;
                      trade.code = item.code;
                      trade.stockareaName = item.stockareaName;
                      trade.stockareaId = item._id;
                      trade.organisationId = item.organisationId;
                      trade.productName = prod.productName;
                      r.tradeinfo = trade;
                      s.push(r);
                      if (item._id == stockareas[stockareas.length - 1]._id) {
                        stockareaservice.getinfo(req, res, s);
                      }
                    }
                    trade = {};
                  })
                } catch (err) {

                  //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,"productId":req.query.productId });
                  commonService.error(res, err, {
                    code: InternalServerError
                  });

                }
              })
            }else{
              stockareaservice.getinfo(req, res, s);
            }
            }
          });
        } catch (err) {

          //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,"productId":req.query.productId });
          commonService.error(res, err, {
            code: InternalServerError
          });

        }
      }
    })
  } catch (err) {

    //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,"productId":req.query.productId });
    commonService.error(res, err, {
      code: InternalServerError
    });

  }
};
exports.getsellinfo = function(req, res) {
  var start = new Date();
  var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  try {
    sell.findOne({
      sellId: req.query.sellId,
      status: {
        $gt: 199,
        $lt: 300
      }
    }, function(err, add) {
      if (err) {
        //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,"sellId":req.query.sellId });
        commonService.error(res, err, {
          code: InternalServerError
        });
      } else {
        //log.info({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start ,"sellId":req.query.sellId});
        resHandler.success(res, add);
      }
    });
  } catch (err) {

    //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,"sellId":req.query.sellId });
    commonService.error(res, err, {
      code: InternalServerError
    });

  }
};
exports.deletebystockarea = function(req, res) {
  var start = new Date();
  var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  try {
    sell.update({
      stockareaId: req.body.stockareaId,
      status: {
        $gt: 199,
        $lt: 300
      }
    }, {
      $set: {
        status: config.get('status:quote:inactive:stockareaDeleted'),
        updatedOn: new Date()
      }
    }, {
      multi: true
    }, function(err, add) {
      if (err) {
        //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });
        commonService.error(res, err, {
          code: InternalServerError
        });
      } else {
        //log.info({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });
        resHandler.success(res, add);
      }
    });
  } catch (err) {

    //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });
    commonService.error(res, err, {
      code: InternalServerError
    });

  }
};
exports.deletebyproduct = function(req, res) {
  var start = new Date();
  var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  try {
    sell.update({
      stockareaId: req.body.stockareaId,
      productId: req.body.productId,
      status: {
        $gt: 199,
        $lt: 300
      }
    }, {
      $set: {
        status: config.get('status:quote:inactive:RemovedFromInventory'),
        updatedOn: new Date()
      }
    }, function(err, add) {
      if (err) {
        //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });
        commonService.error(res, err, {
          code: InternalServerError
        });
      } else {
        //log.info({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });
        resHandler.success(res, add);
      }
    });
  } catch (err) {

    //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });
    commonService.error(res, err, {
      code: InternalServerError
    });

  }
};
