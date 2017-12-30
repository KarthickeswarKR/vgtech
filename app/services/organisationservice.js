var express = require('express');
var uuid = require("node-uuid");
var UserIdentificationKeys = require('../models/user-identification-keys');
var users = require('../models/users.js');
var mailService = require('../common/mail/mailService');
var resHandler = require("../common/res-handler");
var commonService = require("../common/commonService.js");
var userservice = require("../services/userservice.js");
var notificationservice = require("../services/notificationservice.js");
var stockareaservice = require("../services/stockareaservice.js");
var md5 = require('md5');
var async = require("async");
var product = require('../models/product');
var organisation = require('../models/organisation');
var config = require('../config/config')
var InternalServerError = config.get('errorcodes:InternalServerError');
var InputsError = config.get('errorcodes:InputsError');
var DuplicateUser = config.get('errorcodes:DuplicateUser');
var DuplicateEmail = config.get('errorcodes:DuplicateEmail/Mobile');
var tokenExpired = config.get('errorcodes:tokenExpired');
var unauthorised = config.get('errorcodes:unauthorised');
var passwordNotMatch = config.get('errorcodes:passwordNotMatch');
var EmailNotverified = config.get('errorcodes:EmailNotverified');
exports.getuserorginfo=function(req,res){
  var index=req.query.term.indexOf('@');
  var term=req.query.term.slice(0,index)
  try{
  organisation.findOne({
        organisationId:term   }, function(err, data) {
        if (err) {
   commonService.error(res, "Internal Server Error", {
            code: InternalServerError
          });
        } else {
        resHandler.update(res, {userId:data.userId,organisationId:data._id});
        }
      })
    } catch (err) {
    commonService.error(res, "Internal Server Error", {
        code: InternalServerError
      });

    }

}
exports.autocomplete = function(req, res) {

  try {
organisation.find({
      organisationId: {
        "$regex": req.query.term,
        "$options": "i"
      },_id: {"$ne":req.headers['organisationid']}//,"collabrators.organisationId": { $nin: [req.headers['organisationid']]}
    }, function(err, data) {
      if (err) {
        //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,"term":req.query.term });

        console.log(err);         commonService.error(res, "Internal Server Error", {
          code: InternalServerError
        });
      } else {
        //log.info({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,"term":req.query.term });


        resHandler.update(res, data);
      }
    })
  } catch (err) {

    //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,"term":req.query.term });

    console.log(err);         commonService.error(res, "Internal Server Error", {
      code: InternalServerError
    });

  }
};
exports.delete = function(info, data, callback) {
  try {
    organisation.update(info, {
        $set: {
          status: config.get('status:organisation:inactive:' + data + 'Deleted')
        }
      }, {
        multi: true
      },
      function(err, source) {
        if (err) {
          callback(err)
        } else {
          callback(null, source)
        }
      })
  } catch (err) {
    callback(err);
  }
}
exports.addorganisation = function(req, res) {
  try {
    if (!req.body.organisationId || req.body.organisationId == null || req.body.organisationId == undefined || !req.body.organisationName || req.body.organisationName == null || req.body.organisationName == undefined) {

      commonService.error(res, "No proper input", {
        code: InputsError
      });
    } else {
      organisation.findOne({
        _id: req.headers['organisationid'],
        status: config.get('status:organisation:active:default')
      }, function(err, data) {
        if (err) {

          commonService.error(res, err.message, {
            code: InternalServerError
          });

        } else if (data) {
          organisation.update({
            _id: req.headers['organisationid']
          }, {
            $set: {
              organisationId: req.body.organisationId.toUpperCase(),
              organisationName: req.body.organisationName,
              status: config.get('status:organisation:active:createdByuser')
            }
          }, function(err, data) {
            if (err) {

              commonService.error(res, err.message, {
                code: InternalServerError
              });

            } else {
              users.findOne({_id:req.headers['userid']},function(err,userdata){
                if(err){
                  commonService.error(res, err.message, {
                    code: InternalServerError
                  });
                }else{
                  users.update({_id:req.headers['userid']},{$set:{mailId:userdata.Id+'@'+req.body.organisationId.toUpperCase()}},{safe:true},function(err,userdata){
                    if(err){
                      commonService.error(res, err.message, {
                        code: InternalServerError
                      });
                    }else{
                      resHandler.success(res, data)
                    }
                  })
                }
              })
            }
          })
        } else {
          var orgid = uuid.v1();
          var org = new organisation({
            _id: orgid,
            organisationId: req.body.organisationId.toUpperCase(),
            userId: req.headers['userid'],
            organisationName: req.body.organisationName,
            status: config.get('status:organisation:active:createdByuser')
          });
          org.save(function(err, info) {
            if (err) {

              commonService.error(res, err.message, {
                code: InternalServerError
              });

            } else {
              userservice.updateorg(req, res, orgid, 'admin', req.headers['userid']);
            }
          })
        }
      })
    }
  } catch (err) {

    commonService.error(res, err.message, {
      code: InternalServerError
    });
  }
};
exports.updateorganisation = function(req, res) {
  try {

    organisation.update({
      _id: req.body.organisationId
    }, {
      $set: {
        userId: req.headers['userid'],
        organisationName: req.body.organisationName
      }
    }, {
      upsert: true
    }, function(err, info) {
      if (err) {

        commonService.error(res, err.message, {
          code: InternalServerError
        });

      } else {
        resHandler.success(res, info)
      }
    })
  } catch (err) {

    commonService.error(res, err.message, {
      code: InternalServerError
    });
  }
};

exports.addorganisationbyuser = function(req, res, userId, orgId, role, data) {
  try {
    var org = new organisation({
      _id: orgId,
      userId:userId,
      organisationId: uuid.v1(),
      status: config.get('status:organisation:active:default')
    });
    org.save(function(err, info) {
      if (err) {

        commonService.error(res, err.message, {
          code: InternalServerError
        });

      } else {
        resHandler.success(res, data)
      }
    })
  } catch (err) {

    commonService.error(res, err.message, {
      code: InternalServerError
    });
  }
};
exports.checkorganisation = function(req, res) {

  try {
    if (req.query.term !== null || req.query.term !== undefined) {
      organisation.findOne({
        organisationId: req.query.term.toUpperCase()
      }, function(err, add) {
        if (err) {
          //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,"term":req.body.term });

          console.log(err);         commonService.error(res, "Internal Server Error", {
            code: InternalServerError
          });
        } else if (add == null || !add || add == undefined) {
          //log.info({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,"term":req.body.term });
          resHandler.success(res, {
            "exist": false
          });
        } else {
          //log.info({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,"term":req.body.term });
          resHandler.success(res, {
            "exist": true
          });
        }
      });
    } else {

      commonService.error(res, "check the inputs", {
        code: InputsError
      });
    }
  } catch (err) {
    //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,"term":req.body.term });

    console.log(err);         commonService.error(res, "Internal Server Error", {
      code: InternalServerError
    });

  }
}



exports.addcollabrator = function(req, res) {
  try {
    var token = uuid.v1();
    organisation.findOne({
      _id: req.headers['organisationid'],
      'collabrators.organisationId': req.body.organisationId
    }, function(err, data) {
      if (err) {

        console.log(err);         commonService.error(res, "Internal Server Error", {
          code: InternalServerError
        });
      } else if (!data) {
        organisation.update({
            _id: req.headers['organisationid']
          }, {
            $push: {
              collabrators: {
                organisationId: req.body.organisationId,
                status: [{
                  type: 'pending',
                  initiator: req.headers['organisationid']
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
              organisation.update({
                  _id: req.body.organisationId
                }, {
                  $push: {
                    collabrators: {
                      organisationId: req.headers['organisationid'],
                      status: [{
                        type: 'pending',
                        token: token,
                        initiator: req.headers['organisationid']
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
                    stockareaservice.addcollabrator(req,res);
                  }
                })
            }
          })
      } else {

        stockareaservice.addcollabrator(req,res);

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
stockareaservice.collabrator(req,res);
};

exports.ignorecollabrator = function(req, res) {
  stockareaservice.ignorecollabrator(req,res);

};
exports.deletecollabrator = function(req, res) {
  try {
    organisation.findOne({
      _id: req.headers['organisationid'],
      'collabrators.organisationId': req.query.organisationId
    }, function(err, data) {
      if (err) {

        commonService.error(res, err.message, {
          code: InternalServerError
        });

      } else if (data !== null) {
        organisation.findOne({
          _id: req.query.organisationId
        }, function(err, orgdata) {
          if (err) {

            commonService.error(res, err.message, {
              code: InternalServerError
            });

          }else{
        organisation.update({
            _id: req.headers['organisationid'],
            'collabrators.organisationId': req.query.organisationId
          }, {
            $push: {
              'collabrators.$.status': {
                type: 'declined',
                initiator: req.headers['organisationid']
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

              organisation.update({
                  _id: req.query.organisationId,
                  'collabrators.organisationId': req.headers['organisationid']
                }, {
                  $push: {
                    'collabrators.$.status': {
                      type: 'declined',
                      initiator: req.query.organisationId
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
                    stockareaservice.deletecollabrator(req,res);

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
exports.getinfo = function(req, res, next) {
  try {
    organisation.findOne({
      _id: req.query.orgId
    }).populate({
      path: 'collabrators.organisationId'
    }).exec(function(err, data) {
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
