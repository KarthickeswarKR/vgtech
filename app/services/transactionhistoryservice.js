var express = require('express');
var order = require('../models/order.js');
var product = require('../models/product.js');
var stockarea = require('../models/stockarea.js');
var statuscode = require('../models/statuscode');
var config = require('../config/config')
var InternalServerError = config.get('errorcodes:InternalServerError');
var InputsError = config.get('errorcodes:InputsError');
var DuplicateUser = config.get('errorcodes:DuplicateUser');
var DuplicateEmail = config.get('errorcodes:DuplicateEmail/Mobile');
var tokenExpired = config.get('errorcodes:tokenExpired');
var unauthorised = config.get('errorcodes:unauthorised');
var passwordNotMatch = config.get('errorcodes:passwordNotMatch');
var EmailNotverified = config.get('errorcodes:EmailNotverified');
var uuid = require("node-uuid");
var transactionhistoryservice = require('../services/transactionhistoryservice');
var productstockservice = require('../services/productstockservice');
var transactionhistory = require('../models/transactionhistory');
var resHandler = require("../common/res-handler");
var commonService = require("../common/commonService.js");
var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
exports.add = function(userId, productId, productstockId, stockareaId, destinationStockareaId, orderId, sellId, stockId) {

  var today = new Date()
  var dd = today.getDate();
  var mm = monthNames[today.getMonth()]; //January is 0!
  var yyyy = today.getFullYear();
  var date = dd + "-" + mm + "-" + yyyy;
  var Id = uuid.v1();
  var productName;
  var stockareaName;

  product.findOne({
    _id: productId
  }, function(err, productdata) {
    if (err) {} else if (productdata == null) {} else {
      productName = productdata.productName;
    }
  })
  stockarea.findOne({
    _id: stockareaId
  }, function(err, stockdata) {
    if (err) {} else if (stockdata == null) {} else {
      var d = new Date()
      var history = {
        "date": d,
        "statusCode": "initiatebuyer",
        "statusDescription": "Order placed"
      };
      stockareaName = stockdata.stockareaName;
      var stock = new transactionhistory({
        _id: Id,
        userId: userId,
        stockareaId: stockareaId,
        orderId: orderId,
        productId: productId,
        productstockId: productstockId,
        sellId: sellId,
        statusCode: "initiatebuyer",
        destinationStockareaId: destinationStockareaId,
        type: "buysell",
        statusDescription: "Order Pending",
        selling: false,
        status: "orderPending",
        history: history,
        message: "You are created an order for  " + productName + " from " + stockareaName + " on " + date
      });
      stock.save(function(err, add) {
        if (err) {
          console.log(err);
        } else {
          transactionhistoryservice.addsell(productId, productstockId, stockareaId, destinationStockareaId, sellId, orderId)
        }
      });
    }
  })
};
exports.addsell1 = function(userId, productId, productstockId, stockareaId, sellId) {
  var today = new Date()
  var dd = today.getDate();
  var mm = monthNames[today.getMonth()]; //January is 0!
  var yyyy = today.getFullYear();
  var date = dd + "-" + mm + "-" + yyyy;
  var Id = uuid.v1();
  var productName;
  var stockareaName;
  var userid;
  product.findOne({
    _id: productId
  }, function(err, productdata) {
    if (err) {
      console.log(err);
    } else if (productdata == null) {
      console.log("data empty");
    } else {
      productName = productdata.productName;
    }
  })
  stockarea.findOne({
    _id: stockareaId
  }, function(err, stockdata) {
    if (err) {
      console.log(err);
    } else if (stockdata == null) {
      console.log("data empty");
    } else {
      userid = stockdata.userId;
      stockareaName = stockdata.stockareaName;
      var stock = new transactionhistory({
        _id: Id,
        userId: userid,
        productId: productId,
        productstockId: productstockId,
        sellId: sellId,
        stockareaId: stockareaId,
        status: "selling",
        statusCode: "initiateseller",
        type: "sell",
        message: "You have updated stockdetails for " + productName + " at " + stockareaName + " on " + date
      });
      stock.save(function(err, add) {
        if (err) {
          console.log(err);
        } else {
          console.log("success");
          //resHandler.add(res,add);
        }
      });
    }
  })

}
exports.removesell = function(userId, productId, productstockId, stockareaId) {
  var today = new Date()
  var dd = today.getDate();
  var mm = monthNames[today.getMonth()]; //January is 0!
  var yyyy = today.getFullYear();
  var date = dd + "-" + mm + "-" + yyyy;
  var Id = uuid.v1();
  var productName;
  var stockareaName;
  var userid;
  product.findOne({
    _id: productId
  }, function(err, productdata) {
    if (err) {
      console.log(err);
    } else if (productdata == null) {
      console.log("data empty");
    } else {
      productName = productdata.productName;
    }
  })
  stockarea.findOne({
    _id: stockareaId
  }, function(err, stockdata) {
    if (err) {
      console.log(err);
    } else if (stockdata == null) {
      console.log("data empty");
    } else {
      userid = stockdata.userId;
      stockareaName = stockdata.stockareaName;
      var stock = new transactionhistory({
        _id: Id,
        userId: userid,
        productId: productId,
        productstockId: productstockId,
        stockareaId: stockareaId,
        status: "selling",
        statusCode: "initiateseller",
        type: "sell",
        message: "You have removed stockdetails for " + productName + " at " + stockareaName + " on " + date
      });
      stock.save(function(err, add) {
        if (err) {
          console.log(err);
        } else {
          console.log("success");
          //resHandler.add(res,add);
        }
      });
    }
  })

}
exports.addstockarea = function(userId, stockareaId) {

  var Id = uuid.v1();
  var today = new Date()
  var dd = today.getDate();
  var mm = monthNames[today.getMonth()]; //January is 0!
  var yyyy = today.getFullYear();
  var date = dd + "-" + mm + "-" + yyyy;
  var stockareaName;
  stockarea.findOne({
    _id: stockareaId
  }, function(err, stockdata) {
    if (err) {
      console.log(err);
    } else if (stockdata == null) {
      console.log("data empty");
    } else {
      stockareaName = stockdata.stockareaName;
      var stock = new transactionhistory({
        _id: Id,
        userId: userId,
        stockareaId: stockareaId,
        status: "selling",

        type: "stockarea",
        message: "You have created stock area " + stockareaName + " on " + date
      });
      stock.save(function(err, add) {
        if (err) {
          console.log(err);
        } else {
          console.log("success");
          //resHandler.add(res,add);
        }
      });
    }
  })

}
exports.addproduct = function(userId, stockareaId, productId) {

  var Id = uuid.v1();
  var today = new Date()
  var dd = today.getDate();
  var mm = monthNames[today.getMonth()]; //January is 0!
  var yyyy = today.getFullYear();
  var date = dd + "-" + mm + "-" + yyyy;
  var stockareaName;
  stockarea.findOne({
    _id: stockareaId
  }, function(err, stockdata) {
    if (err) {
      console.log(err);
    } else if (stockdata == null) {
      console.log("data empty");
    } else {
      product.findOne({
        _id: productId
      }, function(err, productdata) {
        if (err) {
          console.log(err);
        } else if (productdata == null) {
          console.log("data empty");
        } else {
          stockareaName = stockdata.stockareaName;
          var stock = new transactionhistory({
            _id: Id,
            userId: userId,
            stockareaId: stockareaId,
            productId: productId,
            status: "selling",
            type: "product",
            message: "You have added" + productdata.productName + " to " + stockareaName + " on " + date
          });
          stock.save(function(err, add) {
            if (err) {
              console.log(err);
            } else {
              console.log("success");
              //resHandler.add(res,add);
            }
          });
        }
      })
    }
  })

}
exports.deleteproduct = function(userId, stockareaId, productId) {

  var Id = uuid.v1();
  var today = new Date()
  var dd = today.getDate();
  var mm = monthNames[today.getMonth()]; //January is 0!
  var yyyy = today.getFullYear();
  var date = dd + "-" + mm + "-" + yyyy;
  var stockareaName;
  stockarea.findOne({
    _id: stockareaId
  }, function(err, stockdata) {
    if (err) {
      console.log(err);
    } else if (stockdata == null) {
      console.log("data empty");
    } else {
      product.findOne({
        _id: productId
      }, function(err, productdata) {
        if (err) {
          console.log(err);
        } else if (productdata == null) {
          console.log("data empty");
        } else {
          stockareaName = stockdata.stockareaName;
          var stock = new transactionhistory({
            _id: Id,
            userId: userId,
            stockareaId: stockareaId,
            productId: productId,
            status: "selling",
            type: "product",
            message: "You are removed" + productdata.productName + " from " + stockareaName + " on " + date
          });
          stock.save(function(err, add) {
            if (err) {
              console.log(err);
            } else {
              console.log("success");
              //resHandler.add(res,add);
            }
          });
        }
      })
    }
  })

}
exports.updatestockarea = function(userId, stockareaId) {

  var Id = uuid.v1();

  var today = new Date()
  var dd = today.getDate();
  var mm = monthNames[today.getMonth()]; //January is 0!
  var yyyy = today.getFullYear();
  var date = dd + "-" + mm + "-" + yyyy;
  var stockareaName;
  stockarea.findOne({
    _id: stockareaId
  }, function(err, stockdata) {
    if (err) {
      console.log(err);
    } else if (stockdata == null) {
      console.log("data empty");
    } else {
      console.log("stockdata");
      stockareaName = stockdata.stockareaName;
      var stock = new transactionhistory({
        _id: Id,
        userId: userId,
        stockareaId: stockareaId,
        status: "selling",

        type: "stockarea",
        message: "You have updated stock area " + stockareaName + " on " + date
      });
      stock.save(function(err, add) {
        if (err) {
          console.log(err);
        } else {
          console.log("success");
          //resHandler.add(res,add);
        }
      });
    }
  })

}
exports.addsell = function(productId, productstockId, stockareaId, destinationStockareaId, sellId, orderId) {
  var Id = uuid.v1();
  var productName;
  var stockareaName;
  var today = new Date()
  var dd = today.getDate();
  var mm = monthNames[today.getMonth()]; //January is 0!
  var yyyy = today.getFullYear();
  var date = dd + "-" + mm + "-" + yyyy;
  product.findOne({
    _id: productId
  }, function(err, productdata) {
    if (err) {
      console.log(err);
    } else if (productdata == null) {
      console.log("data empty");
    } else {
      productName = productdata.productName;
    }
  })
  stockarea.findOne({
    _id: stockareaId
  }, function(err, stockdata) {
    if (err) {
      console.log(err);
    } else if (stockdata == null) {
      console.log("data empty");
    } else {
      var d = new Date()
      var history = {
        "date": d,
        "statusCode": "initiateseller",
        "statusDescription": "Order Requested"
      };
      stockareaName = stockdata.stockareaName;
      var stock = new transactionhistory({
        _id: Id,
        userId: stockdata.userId,
        stockareaId: stockareaId,
        productId: productId,
        productstockId: productstockId,
        sellId: sellId,
        orderId: orderId,
        destinationStockareaId: destinationStockareaId,
        statusCode: "initiateseller",
        statusDescription: "A buyer requested an order",
        status: "BuyRequest",
        type: "buysell",
        history: history,
        message: "You have updated stockdetails for " + productName + " at " + stockareaName + " on " + date
      });
      stock.save(function(err, add) {
        if (err) {
          console.log(err);
        } else {
          console.log("success");
          //resHandler.add(res,add);
        }
      });
    }
  })

}
exports.conform = function(orderId, userId) {
  transactionhistory.findOne({
    orderId: orderId,
    statusCode: "initiatebuyer"
  }, function(err, data) {
    if (err) {
      console.log(err);
    } else if (data == null || !data) {
      console.log("empty");
    } else {
      var history = {
        "date": data.createdOn,
        "statusCode": data.statusCode,
        "statusDescription": data.statusDescription
      }
      console.log("success");
      transactionhistory.update({
        orderId: orderId,
        statusCode: "initiatebuyer"
      }, {
        $set: {
          status: "InProgress",
          statusDescription: "You placed an Order",
          statusCode: "acceptbuyer"
        }
      }, {
        upsert: true
      }, function(err, data) {
        if (err) {
          console.log(err);
        } else if (data == null || !data) {
          console.log("empty");
        } else {
          transactionhistory.update({
            orderId: orderId,
            statusCode: "acceptbuyer"
          }, {
            $push: {
              "history": {
                "date": new Date(),
                "statusCode": "acceptbuyer",
                "statusDescription": "order Accepted"
              }
            }
          }, {
            upsert: true
          }, function(err, data) {
            if (err) {
              console.log(err);
            } else if (data == null || !data) {
              console.log("empty");
            } else {
              transactionhistory.findOne({
                orderId: orderId,
                statusCode: "initiateseller"
              }, function(err, data) {
                if (err) {
                  console.log(err);
                } else {
                  var history = {
                    "date": data.createdOn,
                    "statusCode": data.statusCode,
                    "statusDescription": data.statusDescription
                  }
                  transactionhistory.update({
                    orderId: orderId,
                    statusCode: "initiateseller"
                  }, {
                    $set: {
                      status: "InProgress",
                      statusCode: "acceptseller",
                      statusDescription: "A buyer send You a order Reqest"
                    }
                  }, function(err, data) {
                    if (err) {
                      console.log(err);
                    } else {
                      transactionhistory.update({
                        orderId: orderId,
                        statusCode: "acceptseller"
                      }, {
                        $push: {
                          "history": {
                            "date": new Date(),
                            "statusCode": "acceptseller",
                            "statusDescription": "You accepted the order"
                          }
                        }
                      }, {
                        upsert: true
                      }, function(err, data) {
                        if (err) {
                          console.log(err);
                        } else {
                          console.log("success");
                        }
                      });
                    }
                  });
                }
              })
            }
          })
        }
      })
    }
  })
}
exports.cancel = function(orderId, userId) {
  transactionhistory.findOne({
    orderId: orderId,
    statusCode: "initiatebuyer"
  }, function(err, data) {
    if (err) {
      console.log(err);
    } else if (data == null || data == undefined || !data) {
      transactionhistory.findOne({
        orderId: orderId,
        userId: userId
      }, function(err, data) {
        if (data.statusCode == "acceptseller") {
          transactionhistoryservice.sellercancel(orderId, userId);
        } else {
          transactionhistoryservice.buyercancel(orderId, userId);
        }
      })
    } else {
      transactionhistoryservice.initialcancel(orderId, userId);

    }
  })
}
exports.gethistoryview = function(req, res) {
  transactionhistory.find({
    userId: req.headers['userid']
  }, function(err, ordersinfo) {
    if (err) {
      //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });
      commonService.error(res, "Internal Server Error", {
        code: InternalServerError
      });
    } else {
      var orders = ordersinfo.reverse();
      resHandler.success(res, orders);
    }
  });
};
exports.gethistory = function(req, res) {
  console.log("in orders");
  var orders = {};
  transactionhistory.find({
    $or: [{
      userId: req.headers['userid'],
      type: "buysell",
      productId: req.query.productId,
      stockareaId: req.query.stockareaId
    }, {
      userId: req.headers['userid'],
      type: "buysell",
      productId: req.query.productId,
      destinationStockareaId: req.query.stockareaId
    }]
  }).populate('productId orderId').populate({
    path: 'stockareaId',
    populate: {
      path: 'userId',
      select: 'userId userName organisation email secondaryEmail address fullName'
    }
  }).populate({
    path: 'destinationStockareaId',
    populate: {
      path: 'userId',
      select: 'userId userName organisation email secondaryEmail address fullName'
    }
  }).populate({
    path: 'history.statusCode',
    model: 'statuscode'
  }).populate({
    path: 'statusCode',
    model: 'statuscode'
  }).exec(function(err, orders) {
    if (err) {
      console.log(err);
      //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });
      commonService.error(res, "Internal Server Error", {
        code: InternalServerError
      });
    } else {
      console.log("success");
      resHandler.success(res, orders);
    }
  });
};
exports.decline = function(orderId, userId) {
  console.log("in decline");
  transactionhistory.findOne({
    orderId: orderId,
    statusCode: "initiatebuyer"
  }, function(err, data) {
    if (err) {
      console.log(err);
    } else if (data == null || !data) {
      console.log("empty");
    } else {
      var history = {
        "date": data.createdOn,
        "statusCode": data.statusCode,
        "statusDescription": data.statusDescription
      }
      console.log("success");
      transactionhistory.update({
        orderId: orderId,
        statusCode: "initiatebuyer"
      }, {
        $set: {
          statusDescription: "Seller Declined the Request",
          status: "Declined",
          statusCode: "declinebuyer"
        }
      }, function(err, data) {
        if (err) {
          console.log(err);
        } else if (data == null || !data) {
          console.log("empty");
        } else {
          transactionhistory.update({
            orderId: orderId,
            statusCode: "declinebuyer"
          }, {
            $push: {
              "history": {
                "statusCode": "declinebuyer",
                "statusDescription": "Order Declined",
                "date": new Date()
              }
            }
          }, {
            upsert: true
          }, function(err, data) {
            if (err) {
              console.log(err);
            } else if (data == null || !data) {
              console.log("empty");
            } else {
              transactionhistory.findOne({
                orderId: orderId,
                statusCode: "initiateseller"
              }, function(err, data) {
                if (err) {
                  console.log(err);
                } else if (data == null || !data) {
                  console.log("empty");
                } else {
                  var history = {
                    "date": data.createdOn,
                    "statusCode": data.statusCode,
                    "statusDescription": data.statusDescription
                  }
                  transactionhistory.update({
                    orderId: orderId,
                    statusCode: "initiateseller"
                  }, {
                    $set: {
                      status: "Declined",
                      statusDescription: "You Declined the Request",
                      statusCode: "declineseller"
                    }
                  }, function(err, data) {
                    if (err) {
                      console.log(err);
                    } else if (data == null || !data) {
                      console.log("empty");
                    } else {
                      transactionhistory.update({
                        orderId: orderId,
                        statusCode: "declineseller"
                      }, {
                        $push: {
                          "history": {
                            "statusCode": "initiateseller",
                            "statusDescription": "Order Declined",
                            "date": new Date()
                          }
                        }
                      }, {
                        upsert: true
                      }, function(err, data) {
                        if (err) {
                          console.log(err);
                        } else if (data == null || !data) {
                          console.log("empty");
                        } else {
                          console.log("success");
                        }
                      })
                    }
                  });
                }
              });
            }
          })
        }
      })
    }
  })
}
exports.initialcancel = function(orderId, userId) {
  console.log("initia cancel");
  transactionhistory.findOne({
    orderId: orderId,
    statusCode: "initiatebuyer"
  }, function(err, data) {
    if (err) {
      console.log(err);
    } else if (data == null || !data) {
      console.log("empty");
    } else {
      console.log("success");
      var history = {
        "date": data.createdOn,
        "statusCode": data.statusCode,
        "statusDescription": data.statusDescription
      }
      transactionhistory.update({
        orderId: orderId,
        statusCode: "initiatebuyer"
      }, {
        $set: {
          statusDescription: "You cancelled the Request",
          status: "cancelled",
          statusCode: "initialcancelbuyer"
        }
      }, function(err, data) {
        if (err) {
          console.log(err);
        } else if (data == null || !data) {
          console.log("empty");
        } else {
          transactionhistory.update({
            orderId: orderId,
            statusCode: "initialcancelbuyer"
          }, {
            $push: {
              "history": {
                "statusCode": "initialcancelbuyer",
                "statusDescription": "Order Cancelled",
                "date": new Date()
              }
            }
          }, {
            upsert: true
          }, function(err, data) {
            if (err) {
              console.log(err);
            } else if (data == null || !data) {
              console.log("empty");
            } else {
              transactionhistory.findOne({
                orderId: orderId,
                statusCode: "initiateseller"
              }, function(err, data) {
                if (err) {
                  console.log(err);
                } else if (data == null || !data) {
                  console.log("empty");
                } else {
                  var history = {
                    "date": data.createdOn,
                    "statusCode": data.statusCode,
                    "statusDescription": data.statusDescription
                  }
                  transactionhistory.update({
                    orderId: orderId,
                    statusCode: "initiateseller"
                  }, {
                    $set: {
                      status: "cancelled",
                      statusDescription: "You Declined the Request",
                      statusCode: "initialcancelseller"
                    }
                  }, function(err, data) {
                    if (err) {
                      console.log(err);
                    } else if (data == null || !data) {
                      console.log("empty");
                    } else {
                      transactionhistory.update({
                        orderId: orderId,
                        statusCode: "initialcancelseller"
                      }, {
                        $push: {
                          "history": {
                            "statusCode": "initialcancelseller",
                            "statusDescription": "Order Cancelled",
                            "date": new Date()
                          }
                        }
                      }, {
                        upsert: true
                      }, function(err, data) {
                        if (err) {
                          console.log(err);
                        } else if (data == null || !data) {
                          console.log("empty");
                        } else {
                          console.log("success");
                        }
                      });
                    }
                  });
                }
              })
            }
          })
        }
      })
    }
  })
}
exports.buyercancel = function(orderId, userId) {
  transactionhistory.findOne({
    orderId: orderId,
    statusCode: "acceptbuyer"
  }, function(err, data) {
    if (err) {
      console.log(err);
    } else if (data == null || !data) {
      console.log("empty");
    } else {
      console.log("success");
      var history = {
        "date": data.createdOn,
        "statusCode": data.statusCode,
        "statusDescription": data.statusDescription
      }
      transactionhistory.update({
        orderId: orderId,
        statusCode: "acceptbuyer"
      }, {
        $set: {
          statusDescription: "You cancelled the Request",
          status: "cancelled",
          statusCode: "buyercancelbuyer"
        }
      }, function(err, data) {
        if (err) {
          console.log(err);
        } else if (data == null || !data) {
          console.log("empty");
        } else {

          transactionhistory.update({
            orderId: orderId,
            statusCode: "buyercancelbuyer"
          }, {
            $push: {
              "history": {
                "statusCode": "buyercancelbuyer",
                "statusDescription": "Order Cancelled",
                "date": new Date()
              }
            }
          }, {
            upsert: true
          }, function(err, data) {
            if (err) {
              console.log(err);
            } else if (data == null || !data) {
              console.log("empty");
            } else {
              transactionhistory.findOne({
                orderId: orderId,
                statusCode: "acceptseller"
              }, function(err, data) {
                if (err) {
                  console.log(err);
                } else if (data == null || !data) {
                  console.log("empty");
                } else {
                  var history = {
                    "date": data.createdOn,
                    "statusCode": data.statusCode,
                    "statusDescription": data.statusDescription
                  }
                  transactionhistory.update({
                    orderId: orderId,
                    statusCode: "acceptseller"
                  }, {
                    $set: {
                      status: "cancelled",
                      statusDescription: "You Declined the Request",
                      statusCode: "buyercancelseller"
                    }
                  }, function(err, data) {
                    if (err) {
                      console.log(err);
                    } else if (data == null || !data) {
                      console.log("empty");
                    } else {

                      transactionhistory.update({
                        orderId: orderId,
                        statusCode: "buyercancelseller"
                      }, {
                        $push: {
                          "history": {
                            "statusCode": "buyercancelseller",
                            "statusDescription": "Order Cancelled",
                            "date": new Date()
                          }
                        }
                      }, {
                        upsert: true
                      }, function(err, data) {
                        if (err) {
                          console.log(err);
                        } else if (data == null || !data) {
                          console.log("empty");
                        } else {
                          console.log("success");
                        }
                      });
                    }
                  });
                }
              })

            }
          })
        }
      })
    }
  })
}
exports.sellercancel = function(orderId, userId) {
  transactionhistory.findOne({
    orderId: orderId,
    statusCode: "acceptbuyer"
  }, function(err, data) {
    if (err) {
      console.log(err);
    } else if (data == null || !data) {
      console.log("empty");
    } else {
      console.log("success");
      var history = {
        "date": data.createdOn,
        "statusCode": data.statusCode,
        "statusDescription": data.statusDescription
      }
      transactionhistory.update({
        orderId: orderId,
        statusCode: "acceptbuyer"
      }, {
        $set: {
          statusDescription: "Seller cancelled the Order",
          status: "cancelled",
          statusCode: "sellercancelbuyer"
        }
      }, function(err, data) {
        if (err) {
          console.log(err);
        } else if (data == null || !data) {
          console.log("empty");
        } else {

          transactionhistory.update({
            orderId: orderId,
            statusCode: "sellercancelbuyer"
          }, {
            $push: {
              "history": {
                "statusCode": "sellercancelbuyer",
                "statusDescription": "Order Cancelled",
                "date": new Date()
              }
            }
          }, {
            upsert: true
          }, function(err, data) {
            if (err) {
              console.log(err);
            } else if (data == null || !data) {
              console.log("empty");
            } else {
              transactionhistory.findOne({
                orderId: orderId,
                statusCode: "acceptseller"
              }, function(err, data) {
                if (err) {
                  console.log(err);
                } else if (data == null || !data) {
                  console.log("empty");
                } else {
                  var history = {
                    "date": data.createdOn,
                    "statusCode": data.statusCode,
                    "statusDescription": data.statusDescription
                  }
                  transactionhistory.update({
                    orderId: orderId,
                    statusCode: "acceptseller"
                  }, {
                    $set: {
                      status: "cancelled",
                      statusDescription: "You cancelled the order",
                      statusCode: "sellercancelseller"
                    }
                  }, function(err, data) {
                    if (err) {
                      console.log(err);
                    } else if (data == null || !data) {
                      console.log("empty");
                    } else {

                      transactionhistory.update({
                        orderId: orderId,
                        statusCode: "sellercancelseller"
                      }, {
                        $push: {
                          "history": {
                            "statusCode": "sellercancelseller",
                            "statusDescription": "Order Cancelled",
                            "date": new Date()
                          }
                        }
                      }, {
                        upsert: true
                      }, function(err, data) {
                        if (err) {
                          console.log(err);
                        } else if (data == null || !data) {
                          console.log("empty");
                        } else {
                          console.log("success");
                        }
                      });
                    }
                  });
                }
              })
            }
          })

        }
      })
    }
  })
}
/*exports.buyercancel= function(orderId,userId) {
     console.log("in buyer cancel");
     transactionhistory.findOne({orderId:orderId,statusCode:"acceptbuyer"},function(err,data){
       if(err){
         console.log(err);
       }
       else{
         console.log("success");
         var history={
         "date":data.createdOn,
         "statusCode":data.statusCode,
         "statusDescription":data.statusDescription
         }
   transactionhistory.update({orderId:orderId,statusCode:"acceptbuyer"},{$set:{statusDescription:"You cancelled the Request",status:"cancelled",statusCode:"buyercancelbuyer"}},{$push:{"history":history}},function(err,data){
             if(err){
   console.log(err);
   }
             else{
               transactionhistory.findOne({orderId:orderId,statusCode:"acceptseller"},function(err,data){
                         if(err){
   console.log(err);                    }
                         else{
                           var history={
                           "date":data.createdOn,
                           "statusCode":data.statusCode,
                           "statusDescription":data.statusDescription
                           }
               transactionhistory.update({orderId:orderId,statusCode:"acceptseller"},{$set:{status:"cancelled",statusDescription:"You Declined the Request",statusCode:"buyercancelseller"}},{$push:{"history":history}},function(err,data){
                         if(err){
   console.log(err);                    }
                         else{
   console.log("success");
                         }
                       });
      }
   });
 }
   })
   }
   })
 }
   exports.sellercancel= function(orderId,userId) {
     console.log("in seller cancel");
     transactionhistory.findOne({orderId:orderId,statusCode:"acceptbuyer"},function(err,data){
       if(err){
         console.log(err);
       }
       else{
         console.log("success");
         var history={
         "date":data.createdOn,
         "statusCode":data.statusCode,
         "statusDescription":data.statusDescription
         }
   transactionhistory.update({orderId:orderId,statusCode:"acceptbuyer"},{$set:{statusDescription:"Seller cancelled the order",status:"cancelled",statusCode:"sellercancelbuyer"}},{$push:{"history":history}},function(err,data){
             if(err){
   console.log(err);
   }
             else{
               transactionhistory.findOne({orderId:orderId,statusCode:"acceptseller"},function(err,data){
   if(err){
     console.log(err);
}                         else{
  var history={
  "date":data.createdOn,
  "statusCode":data.statusCode,
  "statusDescription":data.statusDescription
  }
               transactionhistory.update({orderId:orderId,statusCode:"acceptseller"},{$set:{status:"cancelled",statusDescription:"You cancelled the order",statusCode:"sellercancelseller"}},{$push:{"history":history}},function(err,data){
                         if(err){
   console.log(err);                    }
                         else{
   console.log("success");
                         }
                       });
      }
   });
 }
   })
   }
   })
   }
*/
exports.delivery = function(orderId, userId) {
  transactionhistory.findOne({
    orderId: orderId,
    statusCode: "acceptbuyer"
  }, function(err, data) {
    if (err) {
      console.log(err);
    } else if (data == null || !data) {
      console.log("empty");
    } else {
      console.log("success");
      var history = {
        "date": data.createdOn,
        "statusCode": data.statusCode,
        "statusDescription": data.statusDescription
      }
      transactionhistory.update({
        orderId: orderId,
        statusCode: "acceptbuyer"
      }, {
        $set: {
          statusDescription: "Bought",
          status: "Bought",
          statusCode: "deliverbuyer"
        }
      }, function(err, data) {
        if (err) {
          console.log(err);
        } else if (data == null || !data) {
          console.log("empty");
        } else {

          transactionhistory.update({
            orderId: orderId,
            statusCode: "deliverbuyer"
          }, {
            $push: {
              "history": {
                "statusCode": "deliverbuyer",
                "statusDescription": "Order Deliveried",
                "date": new Date()
              }
            }
          }, {
            upsert: true
          }, function(err, data) {
            if (err) {
              console.log(err);
            } else if (data == null || !data) {
              console.log("empty");
            } else {
              transactionhistory.findOne({
                orderId: orderId,
                statusCode: "acceptseller"
              }, function(err, data) {
                if (err) {
                  console.log(err);
                } else if (data == null || !data) {
                  console.log("empty");
                } else {
                  var history = {
                    "date": data.createdOn,
                    "statusCode": data.statusCode,
                    "statusDescription": data.statusDescription
                  }
                  transactionhistory.update({
                    orderId: orderId,
                    statusCode: "acceptseller"
                  }, {
                    $set: {
                      status: "Sold",
                      statusDescription: "Order Deliveried",
                      statusCode: "deliverseller"
                    }
                  }, function(err, data) {
                    if (err) {
                      console.log(err);
                    } else if (data == null || !data) {
                      console.log("empty");
                    } else {

                      transactionhistory.update({
                        orderId: orderId,
                        statusCode: "deliverseller"
                      }, {
                        $push: {
                          "history": {
                            "statusCode": "deliverseller",
                            "statusDescription": "Order Deliveried",
                            "date": new Date()
                          }
                        }
                      }, {
                        upsert: true
                      }, function(err, data) {
                        if (err) {
                          console.log(err);
                        } else if (data == null || !data) {
                          console.log("empty");
                        } else {
                          console.log("success");
                        }
                      });
                    }
                  });
                }
              })
            }
          })
        }
      })
    }
  })
}

/*   exports.delivery= function(orderId,userId) {
     console.log("indelivery");
     transactionhistory.findOne({orderId:orderId,statusCode:"acceptbuyer"},function(err,data){
       if(err){
         console.log(err);
       }
       else{
         console.log("success");
         var history={
         "date":data.createdOn,
         "statusCode":data.statusCode,
         "statusDescription":data.statusDescription
         }
   transactionhistory.update({orderId:orderId,statusCode:"acceptbuyer"},{$set:{status:"Bought",statusCode:"BASB",statusDescription:"Your order is succesfully deliveried"}},{$push:{"history":history}},function(err,data){
             if(err){
   console.log(err);
   }
             else{
               transactionhistory.findOne({orderId:orderId,statusCode:"acceptseller"},function(err,data){
                         if(err){
   console.log(err);                    }
                         else{
                           var history={
                           "date":data.createdOn,
                           "statusCode":data.statusCode,
                           "statusDescription":data.statusDescription
                           }
               transactionhistory.update({orderId:orderId,statusCode:"acceptseller"},{$set:{status:"Sold",statusCode:"deliverseller",statusDescription:"You succesfully deliveried the Order"}},{$push:{"history":history}},function(err,data){
                         if(err){
   console.log(err);                    }
                         else{
   console.log("success");
                         }
                       });
      }
   });
   }
   })
   }
   })
   }
*/
