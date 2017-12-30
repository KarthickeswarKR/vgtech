var express = require('express');
var distance = require('google-distance-matrix');
var stockarea = require('../models/stockarea.js');
var users = require('../models/users.js');
var UserIdentificationKeys=require('../models/identificationkeys')
var mailService = require('../common/mail/mailService');
var uuid = require("node-uuid");
var productstockservice=require('../services/productstockservice');
var productstock = require('../models/productstock.js');
var notificationservice = require("../services/notificationservice.js");
var product = require('../models/product.js');
var buysell = require('../models/buysell.js');
var organisation = require('../models/organisation.js');
var sell = require('../models/sell.js');
var config = require('../config/config');
var InternalServerError = config.get('errorcodes:InternalServerError');
var InputsError = config.get('errorcodes:InputsError');
var DuplicateUser = config.get('errorcodes:DuplicateUser');
var DuplicateEmail = config.get('errorcodes:DuplicateEmail/Mobile');
var tokenExpired = config.get('errorcodes:tokenExpired');
var unauthorised = config.get('errorcodes:unauthorised');
var passwordNotMatch = config.get('errorcodes:passwordNotMatch');
var EmailNotverified = config.get('errorcodes:Email/MobileNotverified');
var transactionhistory = require('../services/transactionhistoryservice');
var https = require("https");
var stockareadao = require('../dao/stockareadao');
var productstockservice = require('../services/productstockservice')
var resHandler = require("../common/res-handler");
var commonService = require("../common/commonService.js");
exports.addstockarea = function(req, res) {
  var stockareaId = uuid.v1();
  try {
    if (req.body.stockareaName !== null)
      var name = req.body.stockareaName.toString();
    if (name.length > 3 || name.length < 15) {
      stockarea.findOne({
        stockareaName: req.body.stockareaName.toUpperCase()
      }, function(err, resdata) {
        stockarea.findOne({
          stockareaName: req.body.stockareaName.toUpperCase(),
          userId: req.headers['userid'],
          status: {
            $gt: 499,
            $lt: 600
          }
        }, function(err, resdata1) {
          if (resdata1 !== null || resdata1) {
            stockarea.update({
              stockareaName: req.body.stockareaName.toUpperCase()
            }, {
              $set: {
                latitude: req.body.latitude,
                longitude: req.body.longitude,
                address: req.body.address,
                phone: req.body.phone,
                code: req.body.code,
                status: config.get('status:stockarea:active:After_Reactivation')
              }
            }, {
              upsert: true
            }, function(err, data) {
              if (err) {

                commonService.error(res, "Internal Server Error", {
                  code: InternalServerError
                });
              } else {
                resHandler.add(res, data);
              }
            })
          } else if (resdata == null || !resdata) {
            users.findOne({
              _id: req.headers['userid']
            }, function(err, userinfo) {
              if (err) {
                //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

                commonService.error(res, "Internal Server Error", {
                  code: InternalServerError
                });
              } else {
                stockarea.findOne({
                  userId: req.headers['userid'],
                  status: {
                    $gt: 199,
                    $lt: 300
                  }

                }, function(err, resp) {
                  if (resp == null || !resp) {
                    users.update({
                      _id: req.headers['userid']
                    }, {
                      $set: {
                        status: config.get("status:stockarea:active:created")
                      }
                    }, {
                      upsert: true
                    }, function(err, data1) {
                      if (err) {
                        //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

                        commonService.error(res, "Internal Server Error", {
                          code: InternalServerError
                        });

                      } else {

                        var stock = new stockarea({
                          _id: stockareaId,
                          userId: req.headers['userid'],
                          stockareaId: stockareaId,
                          stockareaName: req.body.stockareaName.toUpperCase(),
                          latitude: req.body.latitude,
                          longitude: req.body.longitude,
                          address: req.body.address,
                          visiblity:req.body.visiblity,
                          phone: req.body.phone,
                          code: req.body.code,
                          organisationId: req.body.organisationId

                        });
                        try {
                          stock.save(function(err, add) {
                            if (err) {
                              //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

                              commonService.error(res, "Internal Server Error", {
                                code: InternalServerError
                              });
                            } else {
                              try {
                                stockarea.update({
                                  _id: stockareaId
                                }, {
                                  $push: {
                                    emails: {
                                      email: userinfo.userName,
                                      type: 2
                                    }
                                  }
                                }, {
                                  upsert: true
                                }, function(err, data) {
                                  if (err) {
                                    //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

                                    commonService.error(res, "Internal Server Error", {
                                      code: InternalServerError
                                    });
                                  } else {
                                    try {
                                      stockarea.update({
                                        _id: stockareaId
                                      }, {
                                        $push: {
                                          mobiles: {
                                            mobile: req.body.code + req.body.phone,
                                            type: 2
                                          }
                                        }
                                      }, {
                                        upsert: true
                                      }, function(err, data) {
                                        if (err) {
                                          //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

                                          commonService.error(res, "Internal Server Error", {
                                            code: InternalServerError
                                          });
                                        } else {
                                          try {
                                            stockarea.update({
                                              _id: stockareaId
                                            }, {
                                              primaryemail: userinfo.userName
                                            }, {
                                              upsert: true
                                            }, function(err, data) {
                                              if (err) {
                                                //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

                                                commonService.error(res, "Internal Server Error", {
                                                  code: InternalServerError
                                                });
                                              } else {
                                                organisation.update({_id:req.body.organisationId},{$push:{stockareas:stockareaId}},{upsert:true},function(err,orginfo){
                                                  if (err) {
                                                    //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

                                                    commonService.error(res, "Internal Server Error", {
                                                      code: InternalServerError
                                                    });
                                                  } else {
                                                    resHandler.add(res, add);
                                                    transactionhistory.addstockarea(req.headers['userid'], stockareaId);
                                                  }
                                                })
                                              }
                                            })
                                          } catch (err) {

                                            //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

                                            commonService.error(res, "Internal Server Error", {
                                              code: InternalServerError
                                            });

                                          }
                                        }
                                      })
                                    } catch (err) {

                                      //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

                                      commonService.error(res, "Internal Server Error", {
                                        code: InternalServerError
                                      });

                                    }
                                  }
                                });
                              } catch (err) {

                                //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

                                commonService.error(res, "Internal Server Error", {
                                  code: InternalServerError
                                });

                              }
                            }
                          })
                        } catch (err) {

                          //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

                          commonService.error(res, "Internal Server Error", {
                            code: InternalServerError
                          });

                        }
                      }
                    })

                  } else {
                    var stock = new stockarea({
                      _id: stockareaId,
                      userId: req.headers['userid'],
                      stockareaId: stockareaId,
                      stockareaName: req.body.stockareaName.toUpperCase(),
                      latitude: req.body.latitude,
                      longitude: req.body.longitude,
                      address: req.body.address,
                      visiblity:req.body.visiblity,
                      phone: req.body.phone,
                      code: req.body.code,
                      organisationId: req.body.organisationId

                    });
                    try {
                      stock.save(function(err, add) {
                        if (err) {
                          //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

                          commonService.error(res, "Internal Server Error", {
                            code: InternalServerError
                          });
                        } else {
                          try {
                            stockarea.update({
                              _id: stockareaId
                            }, {
                              $push: {
                                emails: {
                                  email: userinfo.userName.toLowerCase(),
                                  type: 2
                                }
                              }
                            }, {
                              upsert: true
                            }, function(err, data) {
                              if (err) {
                                //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

                                commonService.error(res, "Internal Server Error", {
                                  code: InternalServerError
                                });
                              } else {
                                try {
                                  stockarea.update({
                                    _id: stockareaId
                                  }, {
                                    $push: {
                                      mobiles: {
                                        mobile: req.body.phone,
                                        type: 2
                                      }
                                    }
                                  }, {
                                    upsert: true
                                  }, function(err, data) {
                                    if (err) {
                                      //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

                                      commonService.error(res, "Internal Server Error", {
                                        code: InternalServerError
                                      });
                                    } else {
                                      try {
                                        stockarea.update({
                                          _id: stockareaId
                                        }, {
                                          primaryemail: userinfo.userName
                                        }, {
                                          upsert: true
                                        }, function(err, data) {
                                          if (err) {
                                            //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

                                            commonService.error(res, "Internal Server Error", {
                                              code: InternalServerError
                                            });
                                          } else {
                                            organisation.update({_id:req.body.organisationId},{$push:{stockareas:stockareaId}},{upsert:true},function(err,orginfo){
                                              if (err) {
                                                //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

                                                commonService.error(res, "Internal Server Error", {
                                                  code: InternalServerError
                                                });
                                              } else {
                                                resHandler.add(res, add);
                                                transactionhistory.addstockarea(req.headers['userid'], stockareaId);
                                              }
                                            })
                                          }
                                        })
                                      } catch (err) {

                                        //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

                                        commonService.error(res, "Internal Server Error", {
                                          code: InternalServerError
                                        });

                                      }
                                    }
                                  })
                                } catch (err) {

                                  //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

                                  commonService.error(res, "Internal Server Error", {
                                    code: InternalServerError
                                  });

                                }
                              }
                            })
                          } catch (err) {

                            //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

                            commonService.error(res, "Internal Server Error", {
                              code: InternalServerError
                            });

                          }
                        }
                      });
                    } catch (err) {

                      //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

                      commonService.error(res, "Internal Server Error", {
                        code: InternalServerError
                      });

                    }
                  }
                })
              }
            })
          } else {

            commonService.error(res, "Stockarea name already taken. Stockarea name should be unique. ", {
              code: tokenExpired
            });
          }
        })
      })
    } else {

      commonService.error(res, "Stockarea name already taken. Stockarea name should be unique. ", {
        code: tokenExpired
      });
    }
  } catch (err) {

    //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

    commonService.error(res, "Internal Server Error", {
      code: InternalServerError
    });

  }
};

exports.addmail = function(req, res) {
  try {
    stockarea.findOne({
      'emails.email': req.body.email.toLowerCase()
    }, {
      upsert: true
    }, function(err, info) {
      if (err) {
        //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

        commonService.error(res, "Internal Server Error", {
          code: InternalServerError
        });
      } else {
        if (!info) {
          try {
            stockarea.update({
              userId: req.headers['userid'],
              _id: req.body.stockareaId
            }, {
              $push: {
                emails: {
                  email: req.body.email
                }
              }
            }, {
              upsert: true
            }, function(err, data) {
              if (err) {
                //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

                commonService.error(res, "Internal Server Error", {
                  code: InternalServerError
                });
              } else {
                //log.info({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });
                resHandler.update(res, data);
              }
            })
          } catch (err) {

            //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

            commonService.error(res, "Internal Server Error", {
              code: InternalServerError
            });

          }
        } else {

          commonService.error(res, "Email you are trying to add is associated with other account.", {
            code: DuplicateEmail
          });

        }
      }
    })
  } catch (err) {

    //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

    commonService.error(res, "Internal Server Error", {
      code: InternalServerError
    });

  }
}

exports.autocomplete = function(req, res) {
  try {

    var info=[];
    productstock.find({productId:req.query.productId}).populate({
      path:'stockareaId',
      match:
        {
          stockareaName: {
            "$regex": req.query.term,
            "$options": "i"
          },
          _id:{$ne:req.headers['stockareaid']},
          visiblity:{$ne:config.get('stockarea:type:onlyme')}
      },
      populate:{
        path:'organisationId'
      }
    }).populate({
      path:'productId',
      match:{
        status:201
      }
    }).exec(

    /*stockarea.find({$or:[{
      stockareaName: {
        "$regex": req.query.term,
        "$options": "i"
      },
      _id:{$ne:req.headers['stockareaid']},
      visiblity:config.get('stockarea:type:public')
    },{
      stockareaName: {
        "$regex": req.query.term,
        "$options": "i"
      },
      visiblity:config.get('stockarea:type:private'),
      _id:{$ne:req.headers['stockareaid']},
      userId:req.headers['userid'],
      visiblity:{$ne:config.get('stockarea:type:onlyme')}

    }]}).populate('organisationId').exec(*/
    function(err, data) {
      if (err) {
        //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,"term":req.query.term });

        commonService.error(res, "Internal Server Error", {
          code: InternalServerError
        });
      } else {
        console.log(data);
for(i=0;i<data.length;i++){
  if(data[i].stockareaId){
info.push(data[i].stockareaId);
  }
}
        resHandler.update(res, info);
      }
    })
  } catch (err) {

    //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,"term":req.query.term });

    commonService.error(res, "Internal Server Error", {
      code: InternalServerError
    });

  }
};
exports.addmobile = function(req, res) {

  try {
    stockarea.findOne({
      'mobiles.mobile': req.body.mobile
    }, {
      upsert: true
    }, function(err, info) {
      if (err) {
        //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

        commonService.error(res, "Internal Server Error", {
          code: InternalServerError
        });
      } else {
        if (!info) {
          try {
            stockarea.update({
              userId: req.headers['userid'],
              _id: req.body.stockareaId
            }, {
              $push: {
                mobiles: {
                  mobile: req.body.mobile,
                  code: req.body.code
                }
              }
            }, {
              upsert: true
            }, function(err, data) {
              if (err) {
                //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

                commonService.error(res, "Internal Server Error", {
                  code: InternalServerError
                });
              } else {
                //log.info({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });
                resHandler.update(res, data);
              }
            })
          } catch (err) {

            //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

            commonService.error(res, "Internal Server Error", {
              code: InternalServerError
            });

          }
        } else {

          commonService.error(res, "Email you are trying to add is associated with other account.", {
            code: DuplicateEmail
          });

        }
      }
    })
  } catch (err) {

    //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

    commonService.error(res, "Internal Server Error", {
      code: InternalServerError
    });

  }
}
exports.deleteemail = function(req, res) {

  try {
    stockarea.update({
      userId: req.headers['userid'],
      _id: req.body.stockareaId
    }, {
      $pull: {
        emails: {
          email: req.body.email
        }
      }
    }, {
      upsert: true
    }, function(err, data) {
      if (err) {
        //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

        commonService.error(res, "Internal Server Error", {
          code: InternalServerError
        });
      } else {
        //log.info({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });
        resHandler.update(res, data);
      }
    })
  } catch (err) {

    //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

    commonService.error(res, "Internal Server Error", {
      code: InternalServerError
    });

  }
};
exports.deletemobile = function(req, res) {

  try {
    stockarea.update({
      userId: req.headers['userid'],
      _id: req.body.stockareaId
    }, {
      $pull: {
        mobiles: {
          mobile: req.body.mobile
        }
      }
    }, {
      upsert: true
    }, function(err, data) {
      if (err) {
        //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

        commonService.error(res, "Internal Server Error", {
          code: InternalServerError
        });
      } else {
        //log.info({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });
        resHandler.update(res, data);
      }
    })
  } catch (err) {

    //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

    commonService.error(res, "Internal Server Error", {
      code: InternalServerError
    });

  }
};
exports.primaryemail = function(req, res) {

  try {
    stockarea.findOne({
      userId: req.headers['userid'],
      "emails.email": req.body.email,
      "emails.status": "verified"
    }, function(err, data) {
      if (err) {
        //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });
        commonService.error(res, "Internal Server Error", {
          code: InternalServerError
        });
      } else {
        if (!data) {
          commonService.error(res, "email Id is not verified", {
            code: EmailNotverified
          });
        } else {
          stockarea.update({
            userId: req.headers['userid'],
            _id: req.body.stockareaId
          }, {
            $set: {
              primaryemail: req.body.email.toLowerCase()
            }
          }, {
            upsert: true
          }, function(err, data) {
            if (err) {
              //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });
              commonService.error(res, "Internal Server Error", {
                code: InternalServerError
              });
            } else {
              try {
                stockarea.findOne({
                  userId: req.headers['userid'],
                  _id: req.body.stockareaId,
                  "emails.type": 2
                }, function(err, info) {
                  if (err) {
                    //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });
                    commonService.error(res, "Internal Server Error", {
                      code: InternalServerError
                    });
                  } else {
                    if (!info) {
                      stockarea.update({
                        userId: req.headers['userid'],
                        _id: req.body.stockareaId,
                        "emails.email": req.body.email.toLowerCase()
                      }, {
                        $set: {
                          "emails.$.type": 2
                        }
                      }, {
                        upsert: true
                      }, function(err, data) {
                        if (err) {
                          //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

                          commonService.error(res, "Internal Server Error", {
                            code: InternalServerError
                          });
                        } else {
                          //log.info({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });
                          resHandler.update(res, data);
                        }
                      })
                    } else {
                      stockarea.update({
                        userId: req.headers['userid'],
                        _id: req.body.stockareaId,
                        "emails.type": 2
                      }, {
                        $set: {
                          "emails.$.type": 1
                        }
                      }, {
                        upsert: true
                      }, function(err, data) {
                        if (err) {
                          //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

                          commonService.error(res, "Internal Server Error", {
                            code: InternalServerError
                          });
                        } else {
                          stockarea.update({
                            userId: req.headers['userid'],
                            _id: req.body.stockareaId,
                            "emails.email": req.body.email.toLowerCase()
                          }, {
                            $set: {
                              "emails.$.type": 2
                            }
                          }, {
                            upsert: true
                          }, function(err, data) {
                            if (err) {
                              //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

                              commonService.error(res, "Internal Server Error", {
                                code: InternalServerError
                              });
                            } else {
                              //log.info({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });
                              resHandler.update(res, data);
                            }
                          })
                        }
                      })
                    }
                  }
                })
              } catch (err) {

                //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

                commonService.error(res, "Internal Server Error", {
                  code: InternalServerError
                });

              }
            }
          })
        }
      }
    })
  } catch (err) {

    //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

    commonService.error(res, "Internal Server Error", {
      code: InternalServerError
    });

  }
};
exports.primarymobile = function(req, res) {

  try {
    stockarea.findOne({
      userId: req.headers['userid'],
      "mobiles.mobile": req.body.mobile,
      "mobiles.status": "verified"
    }, function(err, data) {
      if (err) {
        //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });


        commonService.error(res, "Internal Server Error", {
          code: InternalServerError
        });
      } else {
        if (!data) {

          commonService.error(res, "email Id is not verified", {
            code: EmailNotverified
          });
        } else {
          stockarea.update({
            userId: req.headers['userid'],
            _id: req.body.stockareaId
          }, {
            $set: {
              phone: req.body.mobile
            }
          }, {
            upsert: true
          }, function(err, data) {
            if (err) {
              //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

              commonService.error(res, "Internal Server Error", {
                code: InternalServerError
              });
            } else {
              try {
                stockarea.findOne({
                  userId: req.headers['userid'],
                  _id: req.body.stockareaId,
                  "mobiles.type": 2
                }, function(err, info) {
                  if (err) {
                    //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

                    commonService.error(res, "Internal Server Error", {
                      code: InternalServerError
                    });
                  } else {
                    if (!info) {
                      try {
                        stockarea.update({
                          userId: req.headers['userid'],
                          _id: req.body.stockareaId,
                          "mobiles.mobile": req.body.mobile
                        }, {
                          $set: {
                            "mobiles.$.type": 2
                          }
                        }, {
                          upsert: true
                        }, function(err, data) {
                          if (err) {
                            //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

                            commonService.error(res, "Internal Server Error", {
                              code: InternalServerError
                            });
                          } else {
                            //log.info({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });
                            resHandler.update(res, data);
                          }
                        })
                      } catch (err) {

                        //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

                        commonService.error(res, "Internal Server Error", {
                          code: InternalServerError
                        });

                      }
                    } else {
                      stockarea.update({
                        userId: req.headers['userid'],
                        _id: req.body.stockareaId,
                        "mobiles.type": 2
                      }, {
                        $set: {
                          "mobiles.$.type": 1
                        }
                      }, {
                        upsert: true
                      }, function(err, data) {
                        if (err) {
                          //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

                          commonService.error(res, "Internal Server Error", {
                            code: InternalServerError
                          });
                        } else {
                          try {
                            stockarea.update({
                              userId: req.headers['userid'],
                              _id: req.body.stockareaId,
                              "mobiles.mobile": req.body.mobile
                            }, {
                              $set: {
                                "mobiles.$.type": 2
                              }
                            }, {
                              upsert: true
                            }, function(err, data) {
                              if (err) {
                                //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

                                commonService.error(res, "Internal Server Error", {
                                  code: InternalServerError
                                });
                              } else {
                                //log.info({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });
                                resHandler.update(res, data);
                              }
                            })
                          } catch (err) {

                            //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

                            commonService.error(res, "Internal Server Error", {
                              code: InternalServerError
                            });

                          }
                        }
                      })
                    }
                  }
                })
              } catch (err) {

                //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

                commonService.error(res, "Internal Server Error", {
                  code: InternalServerError
                });

              }
            }
          })
        }
      }
    })
  } catch (err) {

    //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

    commonService.error(res, "Internal Server Error", {
      code: InternalServerError
    });

  }
};

exports.updatestockarea = function(req, res) {
  try {
    stockarea.update({
      _id: req.body.Id
    }, {
      $set: {
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        phone: req.body.phone,
        code: req.body.code,
        address: req.body.address,
        status: config.get("status:stockarea:active:FindingDistance")
      }
    }, {
      upsert: true
    }, function(err, data) {
      if (err) {
        //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

        commonService.error(res, "Internal Server Error", {
          code: InternalServerError
        });
      } else {
        try {
          buysell.remove({
            $or: [{
              stockareaId: req.body.Id
            }, {
              destinationStockareaId: req.body.Id
            }]
          }, function(err, data1) {
            if (err) {
              //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

              commonService.error(res, "Internal Server Error", {
                code: InternalServerError
              });
            } else {
              //log.info({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });
              resHandler.add(res, data);
              transactionhistory.updatestockarea(req.headers['userid'], req.body.Id);
            }
          })
        } catch (err) {

          //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

          commonService.error(res, "Internal Server Error", {
            code: InternalServerError
          });

        }
      }
    })
  } catch (err) {

    //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

    commonService.error(res, "Internal Server Error", {
      code: InternalServerError
    });

  }
}
exports.getstockareainfo = function(req, res) {
  var data = {};
  stockarea.findOne({
    _id: req.query.stockareaId
  }).populate({
    path:'emails.type mobiles.type collabrators.stockareaId',
    populate:{
      path:'organisationId'
    }
  }).exec(function(err, source) {
    if (err) {
      //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,"stockareaId":req.query.stockareaId });

      commonService.error(res, "Internal Server Error", {
        code: InternalServerError
      });
    } else {
      data.source = source;
      //log.info({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start ,"stockareaId":req.query.stockareaId});
      resHandler.add(res, data);
    }
  })
}
exports.delete = function(info, data, callback) {
  stockarea.update(info, {
    $set: {
      status: config.get('status:stockarea:inactive:' + data + 'Deleted')
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
exports.updatevisiblity = function(req,res) {
  if(req.body.visiblity!==null){
  stockarea.update({_id:req.headers['stockareaid']}, {
    $set: {
      visiblity:req.body.visiblity
    }
  }, {
    safe: true
  }).exec(function(err, source) {
    if (err) {
      commonService.error(res, "Internal Server Error", {
        code: InternalServerError
      });
    } else {
      resHandler.add(res, source);
    }
  })
}else{
  commonService.error(res, "incorrect visiblity code", {
    code: InputsError
  });
}
}
exports.getallstockareas = function(req, res) {
  try {
    stockarea.find({
      userId: req.headers['userid'],
      status: {

      }
    }).populate({
      path:'emails.type mobiles.type collabrators.stockareaId',
      populate:{
        path:'organisationId'
      }
    }).exec(function(err, data) {
      if (err) {
        //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

        commonService.error(res, "Internal Server Error", {
          code: InternalServerError
        });
      } else {
        //log.info({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });
        resHandler.add(res, data);
      }
    })
  } catch (err) {

    //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

    commonService.error(res, "Internal Server Error", {
      code: InternalServerError
    });

  }
}
exports.updateproducts = function(req, res) {
product.findOne({_id:req.body.products[0]},function(err,productdata){
  if (err) {
    commonService.error(res, "Internal Server Error", {
      code: InternalServerError
    });
  } else if (productdata == null || !productdata || productdata == undefined) {
    commonService.error(res, "No product found", {
      code: InputsError
    });
  }else{
    stockarea.findOne({_id:req.body.stockareaId},function(err,stockareadata){
      if (err) {
        commonService.error(res, "Internal Server Error", {
          code: InternalServerError
        });
      } else if (stockareadata == null || !stockareadata || stockareadata == undefined) {
        commonService.error(res, "No stockarea found", {
          code: InputsError
        });
      }else{
          productstockservice.addproductstock(req,res,req.body.products[0],req.body.stockareaId)
          transactionhistory.addproduct(req.headers['userid'], req.body.stockareaId, req.body.products[0]);
  }
    })
  }
})
}
exports.checkstockarea = function(req, res) {

  try {
    stockarea.findOne({
      stockareaName: req.body.term.toUpperCase()
    }, function(err, add) {
      if (err) {
        commonService.error(res, "Internal Server Error", {
          code: InternalServerError
        });
      } else if (add == null || !add || add == undefined) {
        //log.info({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,"term":req.body.term });
        resHandler.success(res, {
          "exist": false
        });
      } else {
        if (add.userId == req.headers['userid']) {
          resHandler.success(res, {
            "exist": false
          });
        } else {
          //log.info({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,"term":req.body.term });
          resHandler.success(res, {
            "exist": true
          });
        }
      }
    });
  } catch (err) {

    //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,"term":req.body.term });

    commonService.error(res, "Internal Server Error", {
      code: InternalServerError
    });

  }
}

exports.rename = function(req, res) {

  try {
    stockarea.update({
      stockareaId: req.body.stockareaId,
      status: {
        $gt: 199,
        $lt: 300
      }
    }, {
      $set: {
        stockareaName: req.body.stockareaName
      }
    }, {
      upsert: true
    }, function(err, add) {
      if (err) {
        //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

        commonService.error(res, "Internal Server Error", {
          code: InternalServerError
        });
      } else {
        //log.info({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });
        resHandler.update(res, add);

      }
    });
  } catch (err) {

    //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

    commonService.error(res, "Internal Server Error", {
      code: InternalServerError
    });

  }
}
exports.deleteproduct = function(req, res) {
  var stockareaId = req.body.stockareaId;
  var productId = req.body.productId;
  try {
    productstock.findOne({
      stockareaId: stockareaId,
      productId: productId,
      status: {
        $gt: 199,
        $lt: 300
      }
    }, function(err, data) {
      if (err) {
        //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

        commonService.error(res, "Internal Server Error", {
          code: InternalServerError
        });

      } else {
        try {
          stockarea.update({
            stockareaId: req.body.stockareaId
          }, {
            $pull: {
              products: data._id
            }
          }, {
            upsert: true
          }, function(err, add) {
            if (err) {
              //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

              commonService.error(res, "Internal Server Error", {
                code: InternalServerError
              });
            } else {
              try {
                sell.update({
                  stockareaId: stockareaId,
                  productId: productId
                }, {
                  $set: {
                    status: config.get('status:stockarea:inactive:stockareaDeleted')
                  }
                }, {
                  multi: true
                }, function(err, data) {
                  if (err) {
                    //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

                    commonService.error(res, "Internal Server Error", {
                      code: InternalServerError
                    });
                  } else {
                    productstockservice.deletebystockareaproduct(req, res);
                    transactionhistory.deleteproduct(req.headers['userid'], stockareaId, productId);
                  }
                })
              } catch (err) {

                //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

                commonService.error(res, "Internal Server Error", {
                  code: InternalServerError
                });

              }
            }
          })
        } catch (err) {

          //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

          commonService.error(res, "Internal Server Error", {
            code: InternalServerError
          });

        }
      }
    });
  } catch (err) {

    //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

    commonService.error(res, "Internal Server Error", {
      code: InternalServerError
    });

  }
}
exports.getproductinfoforstockarea = function(req, res) {

  try {
    stockarea.findOne({
      stockareaId: req.query.stockareaId,
      status: {
        $gt: 199,
        $lt: 300
      }
    }).populate({
      path: 'products',
      populate: {
        path: 'productId',
        match: {
          productId: req.query.productId
        },populate:{
          path:'categoryId'
        }
      }
    }).populate('emails.type mobiles.type').exec(function(err, add) {
      if (err) {
        //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,"stockareaId":req.query.stockareaId });

        commonService.error(res, "Internal Server Error", {
          code: InternalServerError
        });
      } else {
        var products = add.products;
        for (i = 0; i < products.length; i++) {
          if (products[i].productId == null) {
            products.pull(products[i]);
          }
        }
        //log.info({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,"stockareaId":req.query.stockareaId });
        resHandler.success(res, add);
      }
    });
  } catch (err) {

    //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,"stockareaId":req.query.stockareaId });

    commonService.error(res, "Internal Server Error", {
      code: InternalServerError
    });

  }
}
exports.getproductsofstockarea = function(req, res) {

  try {
    stockarea.findOne({
      stockareaId: req.query.stockareaId,
      status: {
        $gt: 199,
        $lt: 300
      }
    }).select('stockareaId stockareaName latitude longitude products address visiblity').populate({
      path: 'products',
      populate: {
        path: 'productId',
        populate:{
          path:'package',
          model:'package'
        }

            }
    }).exec(function(err, add) {
      if (err) {
        //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,"stockareaId":req.query.stockareaId });

        commonService.error(res, "Internal Server Error", {
          code: InternalServerError
        });
      } else {
        //log.info({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,"stockareaId":req.query.stockareaId });
        resHandler.success(res, add);
      }
    });
  } catch (err) {

    //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,"stockareaId":req.query.stockareaId });

    commonService.error(res, "Internal Server Error", {
      code: InternalServerError
    });

  }
}
exports.getstockareas = function(req, res) {

  try {
    stockarea.find({
      userId: req.headers['userid'],
      status: {
        $gt: 199,
        $lt: 300
      }
    }).populate({
      path: 'products',
      populate: {
        path: 'productId'
            }
    }).populate('emails.type mobiles.type').populate({
      path:'collabrators.stockareaId',
      populate:{
        path:'organisationId'
      }
    }).exec(function(err, add) {
      if (err) {
        //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

        commonService.error(res, "Internal Server Error", {
          code: InternalServerError
        });
      } else {
        //log.info({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });
        resHandler.success(res, add);
      }
    });
  } catch (err) {

    //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

    commonService.error(res, "Internal Server Error", {
      code: InternalServerError
    });

  }
}
exports.getallstockareasofuser = function(req, res) {
  try {
    stockarea.find({
      organisationId: req.headers['organisationid'],
      status: {
        $gt: 199,
        $lt: 300
      }
    }).populate({
      path: 'products',
      populate: {
        path: 'productId'
            }
    }).populate('emails.type mobiles.type').populate({
      path:'collabrators.stockareaId',
      populate:{
        path:'organisationId'
      }
    }).exec(function(err, add) {
      if (err) {
        //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

        commonService.error(res, "Internal Server Error", {
          code: InternalServerError
        });
      } else {
        //log.info({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });
        resHandler.success(res, add);
      }
    });
  } catch (err) {

    //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

    commonService.error(res, "Internal Server Error", {
      code: InternalServerError
    });

  }
}
exports.getstockarea = function(req, res) {
  try {
    stockarea.find({
      stockareaId: req.query.stockareaId,
    }).populate('emails.type mobiles.type').exec(function(err, add) {
      if (err) {
        //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,"stockareaId":req.query.stockareaId });

        commonService.error(res, "Internal Server Error", {
          code: InternalServerError
        });
      } else {
        //log.info({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,"stockareaId":req.query.stockareaId });
        resHandler.success(res, add);
      }
    });
  } catch (err) {

    //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,"stockareaId":req.query.stockareaId });

    commonService.error(res, "Internal Server Error", {
      code: InternalServerError
    });

  }
}
exports.destiny = function(req, res) {

  stockarea.find({
    status: {
      $gt: 199,
      $lt: 300
    }
  }).exec(function(err, add) {
    if (err) {
      //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

      commonService.error(res, "Internal Server Error", {
        code: InternalServerError
      });
    } else {
      for (i = 0; i < add.length; i++) {
        destinations.push(add[i].latitude + "," + add[i].longtitude)
      }
      var origins = ['40.7421,-73.9914'];

      distance.key('AIzaSyAgdp-bCCURd1QiGrNsplEOLo68b_FfflY');
      distance.units('imperial');

      distance.matrix(origins, destinations, function(err, distances) {
        if (err) {
          return
        }
        if (!distances) {
          return
        }
        if (distances.status == 'OK') {
          res.send(distances);
        }
      });
    }
  });
}
exports.getinfo = function(req, res, stockareas) {
  var sk = {};
  try {
    if(stockareas.length!==0){
    stockareas.sort(function(a, b) {
      return parseFloat(a.tradeinfo.Distance) - parseFloat(b.tradeinfo.Distance);
    });
  }
    stockarea.findOne({
      stockareaId: req.body.stockareaId,
      status: {
        $gt: 199,
        $lt: 300
      }
    }).populate('emails.type mobiles.type').exec(function(err, add) {
      if (err) {
        //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

        commonService.error(res, "Internal Server Error", {
          code: InternalServerError
        });
      } else {
        sk.source = add;
        sk.destinations = stockareas;
        //log.info({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });
        resHandler.success(res, sk);
      }
    });
  } catch (err) {

    //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

    commonService.error(res, "Internal Server Error", {
      code: InternalServerError
    });

  }
}
exports.updatestockinfodata = function(req, res) {
  var info = stockarea.findOne({})
  //log.info({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });
  resHandler.success(res, info);

}
exports.viewdetails = function(req, res, stocks) {
  var stockareas = [];
  var tradeinfo = {
    "Cost": "15$ per KG",
    "Distance": "2500KM",
    "Time": "125Mins"
  }
  for (i = 0; i < stocks.length; i++) {
    return stockarea.find({
      stockareaId: stocks[i]
    }).exec(function(err, add) {
      if (err) {
        return err;
      } else {
        add.tradeinfo = tradeinfo;
        stockareas.push(add);
      }
    });
  }
  return stockareas;
}


exports.addcollabrator = function(req, res) {
  try {
    var token = uuid.v1();
    stockarea.findOne({
      _id: req.headers['stockareaid'],
      'collabrators.stockareaId': req.body.stockareaId
    }, function(err, data) {
      if (err) {

        console.log(err);         commonService.error(res, "Internal Server Error", {
          code: InternalServerError
        });
      } else if (!data) {
        stockarea.update({
            _id: req.headers['stockareaid']
          }, {
            $push: {
              collabrators: {
                stockareaId: req.body.stockareaId,
                status: [{
                  type: 'pending',
                  initiator: req.headers['stockareaid']
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
              stockarea.update({
                  _id: req.body.stockareaId
                }, {
                  $push: {
                    collabrators: {
                      stockareaId: req.headers['stockareaid'],
                      status: [{
                        type: 'pending',
                        token: token,
                        initiator: req.headers['stockareaid']
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
                    productstockservice.addcollabrator(req,res);
                  }
                })
            }
          })
      } else {
        productstockservice.addcollabrator(req,res);
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
    productstockservice.collabrator(req,res);
  } catch (err) {

    //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

    console.log(err);         commonService.error(res, "Internal Server Error", {
      code: InternalServerError
    });

  }
};

exports.ignorecollabrator = function(req, res) {
  try {
    productstockservice.ignorecollabrator(req,res);
  } catch (err) {

    //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });


    console.log(err);         commonService.error(res, "Internal Server Error", {
      code: InternalServerError
    });

  }
};
exports.deletecollabrator = function(req, res) {
  try {
    stockarea.findOne({
      _id: req.headers['stockareaid'],
      'collabrators.stockareaId': req.query.stockareaId
    }, function(err, data) {
      if (err) {

        commonService.error(res, err.message, {
          code: InternalServerError
        });

      } else if (data !== null) {
        stockarea.findOne({
          _id: req.query.stockareaId
        }, function(err, orgdata) {
          if (err) {

            commonService.error(res, err.message, {
              code: InternalServerError
            });

          }else{
        stockarea.update({
            _id: req.headers['stockareaid'],
            'collabrators.stockareaId': req.query.stockareaId
          }, {
            $push: {
              'collabrators.$.status': {
                type: 'declined',
                initiator: req.headers['stockareaid']
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

              stockarea.update({
                  _id: req.query.stockareaId,
                  'collabrators.stockareaId': req.headers['stockareaid']
                }, {
                  $push: {
                    'collabrators.$.status': {
                      type: 'declined',
                      initiator: req.query.stockareaId
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
                    productstockservice.deletecollabrator(req,res);

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
