var express = require('express');
var productstock = require('../models/productstock.js');
var uuid = require("node-uuid");
var config = require('../config/config');
var UserIdentificationKeys=require('../models/identificationkeys')
var mailService = require('../common/mail/mailService');

var notificationservice = require("../services/notificationservice.js");
var InternalServerError = config.get('errorcodes:InternalServerError');
var InputsError = config.get('errorcodes:InputsError');
var DuplicateUser = config.get('errorcodes:DuplicateUser');
var DuplicateEmail = config.get('errorcodes:DuplicateEmail/Mobile');
var tokenExpired = config.get('errorcodes:tokenExpired');
var unauthorised = config.get('errorcodes:unauthorised');
var passwordNotMatch = config.get('errorcodes:passwordNotMatch');
var EmailNotverified = config.get('errorcodes:EmailNotverified');
var stockarea = require('../models/stockarea');
var sell = require('../models/sell.js');
var user = require('../models/users.js');
var product = require('../models/product');
var userservice = require('../services/userservice');
var sellservice = require('../services/sellservice');
var transactionhistory = require('../services/transactionhistoryservice');
var resHandler = require("../common/res-handler");
var commonService = require("../common/commonService.js");
exports.addproductstock = function(req,res,productId,stockareaId) {
  var productstockId = uuid.v1();
  var unit = "kg";
  var type;
 productstock.findOne({
    productId: productId,
    stockareaId: stockareaId,
    status: {
      $gt: 199,
      $lt: 300
    }
  }, function(err, data) {

    if (err) {
      commonService.error(res, "Internal Server Error", {
        code: InternalServerError
      });
        } else if (data == null || data == [] || data == undefined) {

      var stock = new productstock({
        _id: productstockId,
        productstockId: productstockId,
        stockareaId: stockareaId,
        productId: productId,
        unit: unit,
        stockDetails:[{"inStock":0}]
      });

      stock.save(function(err, info) {
        if (err) {
          commonService.error(res, "Internal Server Error", {
            code: InternalServerError
          });
                } else {
                  stockarea.update({
                    stockareaId: stockareaId
                  }, {
                    $addToSet: {
                      products: productstockId
                    }
                  }, {
                    safe: true
                  }, function(err, add) {
                    if (err) {
                      commonService.error(res, "Internal Server Error", {
                        code: InternalServerError
                      });
                            } else {
                              resHandler.add(res, info);
                    }
                  })
            }
      });

    } else {
      commonService.error(res, "Product already added", {
        code: DuplicateUser
      });
        }
  })
};
exports.deletebystockarea = function(req, res) {
  var start = new Date();
  var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  var stockareaId = req.body.stockareaId;
  productstock.update({
    stockareaId: stockareaId
  }, {
    $set: {
      status: config.get('status:inventory:inactive:RemovedFromInventory'),
    }
  }, {
    multi: true
  }, function(err, data) {
    if (err) {

      commonService.error(res, "Internal Server Error", {
        code: InternalServerError
      });
    } else {
      sellservice.deletebystockarea(req, res);
    }
  })
}
exports.delete = function(info, data, callback) {
  productstock.update(info, {
    $set: {
      status: config.get('status:inventory:inactive:' + data + 'Deleted')
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
exports.getproductstockinfo = function(req, res) {
  var start = new Date();
  var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  productstock.findOne({
    stockareaId: req.query.stockareaId,
    productId: req.query.productId,
    status: {
      $gt: 199,
      $lt: 300
    }
  }).populate({
    path:'collabrators.productstockId collabrators.status.initiator',
    populate:{
      path:'stockareaId',
      populate:{
        path:'organisationId'
      }
    }
  }).exec(function(err, data) {
    if (err) {
      commonService.error(res, "Internal Server Error", {
        code: InternalServerError
      });
    } else {
      resHandler.success(res, data);
    }
  })
}
exports.getsellinfo = function(req, res) {
  var start = new Date();
  var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  sell.findOne({
    stockareaId: req.query.stockareaId,
    productId: req.query.productId,
    status: {
      $gt: 199,
      $lt: 300
    }
  }, function(err, selldata) {
    if (selldata == undefined || selldata == null || !selldata) {
      productstock.findOne({
        stockareaId: req.query.stockareaId,
        productId: req.query.productId
      }).populate('stockareaId').populate({
        path: 'productId',
        populate: {
          path: 'package',
          model: 'package'
        }
      }).exec(function(err, data) {
        if (err) {

          commonService.error(res, "Internal Server Error", {
            code: InternalServerError
          });
        } else {
          resHandler.delete(res, data);
        }
      })
    } else {
      productstock.findOne({
        stockareaId: req.query.stockareaId,
        productId: req.query.productId,
        status: {
          $gt: 199,
          $lt: 300
        }
      }).populate('stockareaId').populate({
        path: 'productId',
        populate: {
          path: 'materialId'
        }
      }).exec(function(err, data) {
        if (err) {
          commonService.error(res, "Internal Server Error", {
            code: InternalServerError
          });
        } else {
          data.productId.package = selldata.package;
          resHandler.delete(res, data);
        }
      })
    }
  })
}
exports.updatestocks = function(req, res, orders) {
  var start = new Date();
  var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  productstock.update({
    stockareaId: req.body.stockareaId,
    productId: req.body.productId
  }, {
    $inc: {
      "stockDetails.outgoingStock": orders.quantity
    }
  }, {
    upsert: true
  }, function(err, data) {
    if (err) {
      commonService.error(res, "Internal Server Error", {
        code: InternalServerError
      });
    } else {
      productstock.update({
        stockareaId: req.body.destinationstockareaId,
        productId: req.body.productId
      }, {
        $inc: {
          "stockDetails.incomingStock": orders.quantity
        }
      }, {
        upsert: true
      }, function(err, data) {
        if (err) {
          commonService.error(res, "Internal Server Error", {
            code: InternalServerError
          });
        } else {
          transactionhistory.add(req.headers['userid'], req.body.productId, req.body.productstockId, req.body.stockareaId, req.body.destinationstockareaId, orders._id, req.body.sellId, req.body.stockareaId);
          resHandler.add(res, orders);
        }
      })
    }
  })
}
exports.updatestocksbysells = function(req, res, sells,stockinfo) {
  var start = new Date();
  var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  productstock.update({
      stockareaId: req.body.stockareaId,
      productId: req.body.productId,
      status: {
        $gt: 199,
        $lt: 300
      }
    }, {
      $set: {
        "stockDetails":stockinfo
      }
    }, {
      upsert: true
    },
    function(err, data) {
      if (err) {
        commonService.error(res, "Internal Server Error", {
          code: InternalServerError
        });
      } else {
        productstock.update({
            stockareaId: req.body.stockareaId,
            productId: req.body.productId,
            status: {
              $gt: 199,
              $lt: 300
            }
          }, {
            $set: {
              "updatedOn": new Date()
            }
          }, {
            safe: true
          },
          function(err, data) {
            if (err) {
              commonService.error(res, "Internal Server Error", {
                code: InternalServerError
              });
            } else {
              transactionhistory.addsell1(req.headers['userid'], req.body.productId, req.body.productstockId, req.body.stockareaId, sells.sellId);
              resHandler.add(res, sells);
            }
          })
      }
    })
}
exports.updatestocksbysells1 = function(req, res, sells, quantity) {
  var start = new Date();
  var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  productstock.update({
      stockareaId: req.body.stockareaId,
      productId: req.body.productId,
      status: {
        $gt: 199,
        $lt: 300
      }
    }, {
      $set: {
        "stockDetails": quantity
      }
    }, {
      safe: true
    },
    function(err, data) {
      if (err) {
        commonService.error(res, "Internal Server Error", {
          code: InternalServerError
        });
      } else {
        productstock.update({
            stockareaId: req.body.stockareaId,
            productId: req.body.productId,
            status: {
              $gt: 199,
              $lt: 300
            }
          }, {
            $set: {
              "updatedOn": new Date()
            }
          }, {
            safe: true
          },
          function(err, data) {
            if (err) {
              commonService.error(res, "Internal Server Error", {
                code: InternalServerError
              });
            } else {
              resHandler.add(res, sells);
            }
          })
      }
    })
}
exports.deletebystockareaproduct = function(req, res) {
  var start = new Date();
  var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  var stockareaId = req.body.stockareaId;
  var productId = req.body.productId;
  productstock.update({
    stockareaId: stockareaId,
    productId: productId,
    status: {
      $gt: 199,
      $lt: 300
    }
  }, {
    $set: {
      status: config.get('status:inventory:inactive:RemovedFromInventory'),
      updatedOn: new Date()
    }
  }, {
    upsert: true
  }, function(err, data) {
    if (err) {

      commonService.error(res, "Internal Server Error", {
        code: InternalServerError
      });
    } else {
      sellservice.deletebyproduct(req, res);
    }
  })
};
exports.updatesource = function(req, res) {
  var stockareaId = req.body.stockareaId;
  var productId = req.body.productId;
  productstock.findOne({
    stockareaId: stockareaId,
    productId: productId,
    status: {
      $gt: 199,
      $lt: 300
    }}).exec(function(err,info){
      if (err) {
        commonService.error(res, "Internal Server Error", {
          code: InternalServerError
        });
      } else if(!info){
        commonService.error(res, "Internal Server Error", {
          code: InternalServerError
        });
      }else{
        stockarea.findOne({
          stockareaId: req.body.sourceId}).exec(function(err,productstockinfo){
            if (err) {
              commonService.error(res, "Internal Server Error", {
                code: InternalServerError
              });
            } else if(!productstockinfo){
              commonService.error(res, "Internal Server Error", {
                code: InternalServerError
              });
            }else{
  productstock.update({
    stockareaId: stockareaId,
    productId: productId,
    status: {
      $gt: 199,
      $lt: 300
    }
  }, {
    $set: {
      source: req.body.sourceId,
      updatedOn: new Date()
    }
  }, {
    upsert: true
  }, function(err, data) {
    if (err) {
      commonService.error(res, "Internal Server Error", {
        code: InternalServerError
      });
    } else {
      notificationservice.addnotificationsource('source','','',config.get('type:notification:source'),req.headers['userid'],productstockinfo.userId,stockareaId,req.body.sourceId);
      resHandler.add(res, data);
    }
  })
}
})
}
})
};
exports.getuserstockinfo = function(req, res) {
  var start = new Date();
  var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  var packs = [];
  var selectedproduct = {};
  var info = {};
  var productId;
  var stockareaId
  stockarea.findOne({
    stockareaName: req.query.stockareaName
  }).populate('organisationId').exec(function(err, stock) {
    if (err) {

      commonService.error(res, "Internal Server Error", {
        code: InternalServerError
      });
    } else if (stock == null) {

      commonService.error(res, "stockarea not found", {
        code: InputsError
      });
    } else {
      product.findOne({
        productName: req.query.productName
      }, function(err, productdata) {
        if (err) {

          commonService.error(res, "Internal Server Error", {
            code: InternalServerError
          });
        } else if (productdata == null) {

          commonService.error(res, "Internal Server Error", {
            code: InputsError
          });
        } else {
          productId = productdata._id;
          stockareaId = stock._id;
          productstock.findOne({
            stockareaId: stockareaId,
            productId: productId,
            status: {
              $gt: 199,
              $lt: 300
            }
          }).populate({
            path: 'productId',
            populate: {
              path: 'package',
              model: 'package'
            }
          }).populate({
            path: 'productId',
            populate: {
              path: 'brandId'
            }
          }).exec(function(err, data) {
            if (err) {

              commonService.error(res, "Internal Server Error", {
                code: InternalServerError
              });
            } else if (data == null) {

              commonService.error(res, "Internal Server Error", {
                code: InternalServerError
              });

            } else {
              user.findOne({
                _id: stock.userid
              }).select('userName fullName email profilePic dob organisation org').exec(function(err, userinfo) {
                if (err) {

                  commonService.error(res, "Internal Server Error", {
                    code: InternalServerError
                  });
                } else {
                  stockarea.findOne({
                    _id: stockareaId
                  }).populate({
                    path: 'products',
                    match: {
                      _id: {
                        $ne: data._id
                      }
                    },
                    populate: {
                      path: 'productId'
                    }
                  }).exec(function(err, sa) {
                    if (err) {

                      commonService.error(res, "Internal Server Error", {
                        code: InternalServerError
                      });
                    } else {
                      sell.findOne({
                        stockareaId: stockareaId,
                        productId: productId,
                        status: {
                          $gt: 199,
                          $lt: 300
                        }
                      }, function(err, sellinfo) {
                        if (err) {

                          commonService.error(res, "Internal Server Error", {
                            code: InternalServerError
                          });
                        } else {

                          selectedproduct.productinfo = data;
                          selectedproduct.sellinfo = sellinfo;
                          selectedproduct.stockareaInfo = stock;
                          selectedproduct.userinfo = userinfo;
                          info.selectedproduct = selectedproduct;
                          info.otherproducts = sa.products;
                          userservice.getuserstockinfo(req, res, info, stock.userId);
                        }
                      })
                    }
                  })
                }
              })

            }
          })
        }
      })
    }
  })
}

exports.addcollabrator = function(req, res) {
  try {
    var token = uuid.v1();
    productstock.findOne({
      _id: req.body.initiatorproductstockId,
      'collabrators.productstockId': req.body.productstockId
    }, function(err, data) {
      if (err) {

        console.log(err);         commonService.error(res, "Internal Server Error", {
          code: InternalServerError
        });
      } else if (!data) {
        productstock.update({
            _id: req.body.initiatorproductstockId
          }, {
            $push: {
              collabrators: {
                productstockId: req.body.productstockId,
                status: [{
                  type: 'pending',
                  initiator: req.body.initiatorproductstockId
                }],
              }
            }
          }, {
            upsert: true
          },
          function(err, data) {
            if (err) {

              console.log(err);         commonService.error(res, "Internal Server Error", {
                code: InternalServerError
              });
            } else {
              productstock.update({
                  _id: req.body.productstockId
                }, {
                  $push: {
                    collabrators: {
                      productstockId: req.body.initiatorproductstockId,
                      status: [{
                        type: 'pending',
                        token: token,
                        initiator: req.body.initiatorproductstockId
                      }],
                    }
                  }
                }, {
                  upsert: true
                },
                function(err, data) {
                  if (err) {

                    console.log(err);         commonService.error(res, "Internal Server Error", {
                      code: InternalServerError
                    });
                  } else {
                    productstock.findOne({
                      _id: req.body.productstockId,

                    }).populate({
                      path:'stockareaId',
                      populate:{
                        path:'userId'
                      }
                    }).exec(function(err, userdata) {
                      console.log("user");
                      console.log(userdata);
                      if (err) {

                        //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

                        console.log(err);         commonService.error(res, "Internal Server Error", {
                          code: InternalServerError
                        });
                      } else {
                        if (userdata === null || userdata === undefined || userdata === "") {


                          commonService.error(res, 'error in forgetpassword', {
                            code: tokenExpired
                          });
                        } else {
                          var _id = uuid.v1();
                          var timestamp = new Date().getTime();
                          // add userIdentificationKeys
                          var userIdentificationKeys = new UserIdentificationKeys({
                            _id: _id,
                            userId: userdata.stockareaId.userId._id,
                            orgId: req.body.initiatorproductstockId,
                            collabratorId: req.body.productstockId,
                            type: "collabrator",
                            token: token,
                            expiredOn: 12
                          });
                          try {
                            userIdentificationKeys.save(function(err, userIdentificationKeys) {
                              if (err) {
                                //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });


                                console.log(err);         commonService.error(res, "Internal Server Error", {
                                  code: InternalServerError
                                });
                              } else {
                                notificationservice.addnotification('collabrator',req.body.initiatorproductstockId,req.body.productstockId,config.get('type:notification:request'),req.headers['userid'],userdata.stockareaId.userId._id);
                                mailService.collabrator(req, res, userdata.stockareaId.userId.userName, token);
                              }
                            });
                          } catch (error) {

                            //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });
                            ;

                            console.log(err);         commonService.error(res, "Internal Server Error", {
                              code: InternalServerError
                            });

                          }
                        }
                      }
                    });
                  }
                })
            }
          })
      } else {

        commonService.error(res, "collabrator already exist", {
          code: "360"
        });
      }
    })
  } catch (err) {

    //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });
    ;

    console.log(err);         commonService.error(res, "Internal Server Error", {
      code: InternalServerError
    });

  }
};

exports.collabrator = function(req, res) {
  try {
    UserIdentificationKeys.findOne({
      token: req.body.token
    }, function(err, use) {
      if (err) { //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });
        console.log(err);         commonService.error(res, "Internal Server Error", {
          code: InternalServerError
        });
      } else {
        if (use == null || use == undefined) {
          //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });
          console.log("nulllllllllllllllllllllllllllllllllllllllllllllllllll");         commonService.error(res, "Internal Server Error", {
            code: InternalServerError
          });
        } else {
          var collabratorId = use.collabratorId;
          var orgId = use.orgId;
          productstock.findOne({_id:orgId}).populate('stockareaId').exec(function(err,orgdata){
            if(err){
              commonService.error(res, "Internal Server Error", {
                code: InternalServerError
              });
            }else{
          try {
            var inputdata = {
              "type": "active",
              "initiator": use.collabratorId
            }
            var inputdata1 = {
              "type": "active",
              "initiator": use.collabratorId
            }
            productstock.update({
                _id: orgId,
                'collabrators.productstockId': collabratorId
              }, {
                $push: {
                  'collabrators.$.status': inputdata
                }
              }, {
                upsert: true
              },
              function(err, info) {
                if (err) {;

                  commonService.error(res, err.message, {
                    code: InternalServerError
                  });

                } else {
                  productstock.update({
                      _id: collabratorId,
                      'collabrators.productstockId': orgId

                    }, {
                      $push: {
                        'collabrators.$.status': inputdata1
                      }
                    }, {
                      upsert: true
                    },
                    function(err, info) {
                      if (err) {

                        commonService.error(res, err.message, {
                          code: InternalServerError
                        });

                      } else {
                        product.update({
                          createdBy: orgdata.stockareaId.userId
                        }, {
                          $push: {
                            collabrators: req.headers['stockareaid']
                          }
                        }, {
                          multi: true
                        }, function(err, data) {
                          if (err) {

                            commonService.error(res, err.message, {
                              code: InternalServerError
                            });

                          } else {
                            product.update({
                              createdBy: req.headers['userid']
                            }, {
                              $push: {
                                collabrators: orgdata.stockareaId.stockareaId
                              }
                            }, {
                              multi: true
                            }, function(err, data) {
                              if (err) {

                                commonService.error(res, err.message, {
                                  code: InternalServerError
                                });

                              } else {
console.log(orgdata);
                                notificationservice.addnotification('collabrator',collabratorId,orgId,config.get('type:notification:accept'),use.userId,orgdata.stockareaId.userId);
                                resHandler.success(res, info);
                              }
                            })
                          }
                        })


                      }
                    })
                }
              })
          } catch (err) {

            commonService.error(res, err.message, {
              code: InternalServerError
            });
          }
        }
      })
        }
      }
    });
  } catch (err) {

    //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

    console.log(err);         commonService.error(res, "Internal Server Error", {
      code: InternalServerError
    });

  }
};

exports.ignorecollabrator = function(req, res) {
  try {
    UserIdentificationKeys.findOne({
      token: req.body.token
    }, function(err, use) {
      if (err) { //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });


        console.log(err);         commonService.error(res, "Internal Server Error", {
          code: InternalServerError
        });
      } else {
        if (use == null || use == undefined) {
          //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });


          console.log(err);         commonService.error(res, "Internal Server Error", {
            code: InternalServerError
          });
        } else {
          var collabratorId = use.collabratorId;
          var orgId = use.orgId;
productstock.findOne({_id:orgId}).populate('stockareaId').exec(function(err,orgdata){
  if(err){
    commonService.error(res, "Internal Server Error", {
     code: InternalServerError
   });
  }else{


          try {
            var inputdata = {
              "type": "declined",
              "initiator": use.collabratorId
            }
            var inputdata1 = {
              "type": "declined",
              "initiator": use.collabratorId
            }

            productstock.update({
                _id: orgId,
                'collabrators.productstockId': collabratorId
              }, {
                $push: {
                  'collabrators.$.status': inputdata
                }
              }, {
                upsert: true
              },
              function(err, info) {
                if (err) {

                  commonService.error(res, err.message, {
                    code: InternalServerError
                  });

                } else {
                  productstock.update({
                      _id: collabratorId,
                      'collabrators.productstockId': orgId

                    }, {
                      $push: {
                        'collabrators.$.status': inputdata1
                      }
                    }, {
                      upsert: true
                    },
                    function(err, info) {
                      if (err) {

                        commonService.error(res, err.message, {
                          code: InternalServerError
                        });

                      } else {
                        notificationservice.addnotification('collabrator',collabratorId,orgId,config.get('type:notification:reject'),use.userId,orgdata.stockareaId.userId);
                        resHandler.success(res, info);
                      }
                    })
                }
              })
          } catch (err) {

            commonService.error(res, err.message, {
              code: InternalServerError
            });
          }
        }
      })
        }
      }
    });
  } catch (err) {

    //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });


    console.log(err);         commonService.error(res, "Internal Server Error", {
      code: InternalServerError
    });

  }
};
exports.deletecollabrator = function(req, res) {
  try {
    productstock.findOne({
      stockareaId:req.query.stockareaId,
      productId:req.query.productId
        }, function(err, data) {
      if (err) {

        commonService.error(res, err.message, {
          code: InternalServerError
        });

      } else if (data !== null) {
        productstock.findOne({
          stockareaId:req.headers['stockareaid'],
          productId:req.query.productId
                }, function(err, orgdata) {
          if (err) {

            commonService.error(res, err.message, {
              code: InternalServerError
            });

          }else{
        productstock.update({
          stockareaId:req.query.stockareaId,
          productId:req.query.productId,
            'collabrators.productstockId': orgdata._id
          }, {
            $push: {
              'collabrators.$.status': {
                type: 'declined',
                initiator: orgdata._id
              }
            }
          }, {
            upsert: true
          },
          function(err, info) {
            if (err) {

              commonService.error(res, err.message, {
                code: InternalServerError
              });

            } else {

              productstock.update({
                stockareaId:req.headers['stockareaid'],
                productId:req.query.productId,
                'collabrators.productstockId': data._id
                }, {
                  $push: {
                    'collabrators.$.status': {
                      type: 'declined',
                      initiator: orgdata._id
                    }
                  }
                }, {
                  upsert: true
                },
                function(err, info) {
                  if (err) {

                    commonService.error(res, err.message, {
                      code: InternalServerError
                    });

                  } else {
                    product.update({
                      ownedBy: req.query.organisationId
                    }, {
                      $pull: {
                        collabrators: req.headers['stockareaid']
                      }
                    }, {
                      multi: true
                    }, function(err, data) {
                      if (err) {

                        commonService.error(res, err.message, {
                          code: InternalServerError
                        });

                      } else {
                        product.update({
                          ownedBy: req.headers['organisationid']
                        }, {
                          $pull: {
                            collabrators: req.query.stockareaId
                          }
                        }, {
                          multi: true
                        }, function(err, data) {
                          if (err) {

                            commonService.error(res, err.message, {
                              code: InternalServerError
                            });

                          } else {
                            notificationservice.addnotification('collabrator',req.headers['stockareaid'],req.query.stockareaId,config.get('type:notification:stop'),req.headers['userid'],orgdata.userId);
                            resHandler.success(res, info);
                          }
                        })
                      }
                    })
                  }
                })
            }
          })
        }
      })
      } else {

        commonService.error(res, 'User not added', {
          code: InternalServerError
        });
      }
    })
  } catch (err) {

    commonService.error(res, err.message, {
      code: InternalServerError
    });
  }
};
