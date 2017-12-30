var express = require('express');
var sell = require('../models/sell.js');
var stockarea = require('../models/stockarea.js');
var organisationservice = require('../services/organisationservice.js');
var productstock = require('../models/productstock.js');
var uuid = require("node-uuid");
var imagethumbservice = require('../services/imagethumbservice');
var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
var countrycode = require('../models/countrycode');
var aws = require('aws-sdk');
var AWS_ACCESS_KEY = 'AKIAIEASSQYI2VJ7O4KQ';
var AWS_SECRET_KEY = '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';
var S3_BUCKET = 'virtualgd';
var userservice = require('../services/userservice');
var userdao = require('../dao/userdao');
var md5 = require('md5');
var http = require('http');
var accessToken = require('../models/accessToken');
var UserIdentificationKeys = require('../models/user-identification-keys');
var users = require('../models/users.js');
var organisation = require('../models/organisation.js');
var mailService = require('../common/mail/mailService');
var mailService1 = require('../common/mail/mailService1');
var crypto = require('crypto');
var config = require('../config/config')
var InternalServerError = config.get('errorcodes:InternalServerError');
var InputsError = config.get('errorcodes:InputsError');
var DuplicateUser = config.get('errorcodes:DuplicateUser');
var DuplicateEmail = config.get('errorcodes:DuplicateEmail/Mobile');
var tokenExpired = config.get('errorcodes:tokenExpired');
var unauthorised = config.get('errorcodes:unauthorised');
var passwordNotMatch = config.get('errorcodes:passwordNotMatch');
var EmailNotverified = config.get('errorcodes:Email/MobileNotverified');
var resHandler = require("../common/res-handler");
var commonService = require("../common/commonService.js");
var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
exports.addservice = function(req, res) {
  var start = new Date();
  var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  var userId = uuid.v1();
  var mailFormat = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})|([0-9]{10})+$/;
  var orgId = uuid.v1();
  var user = new users({
    _id: userId,
    userId: userId,
    Id:req.body.userid.toLowerCase(),
    ip:ip,
    userName: req.body.userName.toLowerCase(),
    fullName: req.body.fullName,
    password: req.body.password,
    email: [{
      email: req.body.userName.toLowerCase(),
      type: 2
    }],
    org: [{
      organisationId: orgId,
      role: 'admin'
    }]
  });
  try {
    users.findOne({
      userName: req.body.userName.toLowerCase()
    }, function(err, data) {
      if (err) {
        //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });
        commonService.error(res, "Email already exist", {
          code: DuplicateUser
        });
      } else {
        if (!data) {
          try {
            user.save(function(err, add) {
              if (err) {
                //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

                commonService.error(res, "Internal Server Error", {
                  code: InternalServerError
                });
              } else {
                organisationservice.addorganisationbyuser(req, res, userId, orgId, 'admin', add)
              }
            });
          } catch (err) {

            //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

            commonService.error(res, "Internal Server Error", {
              code: InternalServerError
            });

          }
        } else {
          //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

          commonService.error(res, "Email is already registered with virtualgodown . Try with different email or retrieve yours.", {
            code: tokenExpired
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
};
exports.getimage = function(req, res) {
  var start = new Date();
  var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  var httpOptions = {
    hostname: 'http://maps.googleapis.com',
    path: 'http://maps.googleapis.com/maps/vt?pb=!1m5!1m4!1i6!2i34!3i31!4i256!2m3!1e0!2sm!3i386080964!3m14!2sen-US!3sUS!5e18!12m1!1e68!12m3!1e37!2m1!1ssmartmaps!12m4!1e26!2m2!1sstyles!2zcy5lOmx8cC52Om9mZixzLnQ6MXxzLmU6Z3xwLnY6b2ZmLHMudDoyMXxwLnY6b2ZmLHMudDoyMHxwLnY6b2ZmLHMudDoyfHAudjpvZmYscy50OjN8cy5lOmwuaXxwLnY6b2ZmLHMudDo0fHAudjpvZmY!4e0!5m1!5f2&token=25076',
    port: 80,
    method: 'GET'
  };

  http.request(httpOptions, function(response) {
    var idx = 0;
    var len = parseInt(response.header("Content-Length"));
    var body = new Buffer(len);

    response.setEncoding('binary');

    response.on('data', function(chunk) {
      body.write(chunk, idx, "binary");
      idx += chunk.length;
    });

    response.on('end', function() {
      res.contentType = 'image/jpg';
      res.send(body);
    });
  })
}
exports.autocomplete = function(req, res) {
  var start = new Date();
  var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  try {
    users.find({
      userName: {
        "$regex": req.query.term,
        "$options": "i"
      }
    }).limit(5).exec(function(err, data) {
      if (err) {

        commonService.error(res, "Internal Server Error", {
          code: InternalServerError
        });
      } else {

        resHandler.success(res, data);
      }
    })
  } catch (err) {


    commonService.error(res, "Internal Server Error", {
      code: InternalServerError
    });

  }
};
exports.messagetoautocomplete = function(req, res) {
  try {
    var info=[];
    users.find({
      mailId: {
        "$regex": req.query.term,
        "$options": "i"
      }
    }).exec(function(err, data) {
      if (err) {
        commonService.error(res, "Internal Server Error", {
          code: InternalServerError
        });
      } else {
        if(data.length>0){
        for(i=0;i<data.length;i++){
          if(data[i].status==201){
            info.push({
              "label":data[i].Id,
              "userId":data[i]._id,
              "organisationId":data[i].org[0].organisationId
            })
          }
          info.push({
            "label":data[i].mailId,
            "userId":data[i]._id,
            "organisationId":data[i].org[0].organisationId
          })
        }
      }
        resHandler.success(res, info);
      }
    })
  } catch (err) {
    commonService.error(res, "Internal Server Error", {
      code: InternalServerError
    });
  }
};
exports.getUserRoles = function(userId, orgId, callback) {
  users.findOne({
    _id: userId,
    'org.organisationId': orgId
  }, function(err, add) {
    if (err) {
      callback(null)
    } else if (!add) {
      callback(null)
    } else {
      for (i = 0; i < add.org.length; i++) {
        if (add.org[i].organisationId == orgId) {
          callback({
            permission: add.org[i].role.toUpperCase()
          })
        }
      }
    }
  })
}

exports.checkuserid = function(req, res) {
    try {
      users.findOne({
        "Id": req.body.userid.toLowerCase()
      }, function(err, add) {
        if (err) {
          commonService.error(res, "Internal Server Error", {
            code: InternalServerError
          });
        } else if (add == null || !add || add == undefined) {
          //log.info({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start ,"term":req.query.term});
          resHandler.success(res, {
            "exist": false
          });
        } else {
          resHandler.success(res, {
            "exist": true
          });

        }
      });
    } catch (err) {
      commonService.error(res, "Internal Server Error", {
        code: InternalServerError
      });
    }
}
exports.checkemail = function(req, res) {
  var start = new Date();
  var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.term)) {
    try {
      users.findOne({
        "email.email": req.body.term
      }, function(err, add) {
        if (err) {



          commonService.error(res, "Internal Server Error", {
            code: InternalServerError
          });
        } else if (add == null || !add || add == undefined) {
          //log.info({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start ,"term":req.query.term});

          resHandler.success(res, {
            "exist": false
          });
        } else {


          resHandler.success(res, {
            "exist": true
          });

        }
      });
    } catch (err) {



      commonService.error(res, "Internal Server Error", {
        code: InternalServerError
      });

    }
  } else {


    resHandler.success(res, {
      "exist": false
    });
  }
}
exports.checkphone = function(req, res) {
  var start = new Date();
  var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  var phoneno = /^\d{10}$/;
  try {
    stockarea.findOne({
      phone: req.body.term
    }, function(err, add) {
      if (err) {




        commonService.error(res, "Internal Server Error", {
          code: InternalServerError
        });
      } else if (add == null || !add || add == undefined) {


        resHandler.success(res, {
          "exist": false
        });
      } else {
        if (add.userId == req.headers['userid']) {
          resHandler.success(res, {
            "exist": false
          });
        } else {

          resHandler.success(res, {
            "exist": true
          });
        }
      }
    });
  } catch (err) {


    commonService.error(res, "Internal Server Error", {
      code: InternalServerError
    });

  }
}

exports.update = function(req, res) {
  var start = new Date();
  var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  try {
    users.update({
      userId: req.headers['userid']
    }, {
      $set: {
        address: req.body.address,
        fullName: req.body.fullName,
        dob: req.body.dob,
        updatedOn: new Date()
      }
    }, function(err, data) {
      if (err) {
        //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

        commonService.error(res, "Internal Server Error", {
          code: InternalServerError
        });
      } else {
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
exports.getcodes = function(req, res) {
  var start = new Date();
  var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  try {
    countrycode.findOne({}, function(err, data) {
      if (err) {;
        //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

        commonService.error(res, "Internal Server Error", {
          code: InternalServerError
        });
      } else {
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

exports.updateorgbydeletecollabrator = function(req, res, orgId, role, userId) {
  var org = {
    "organisationId": orgId,
    "role": role
  }
  try {
    users.update({
      userId: userId
    }, {
      $pull: {
        org: org
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

exports.updateorg = function(req, res, orgId, role, userId) {
  var org = {
    "organisationId": orgId,
    "role": role
  }
  try {
    users.update({
      userId: userId
    }, {
      $push: {
        org: org
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
exports.updateorganisation = function(req, res) {
  var start = new Date();
  var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  var Id = uuid.v1();
  if (req.body.to == "till-now") {
    var to = new Date("12 31 9999");
  } else {
    var to = new Date(req.body.to)
  }
  var org = {
    "_id": Id,
    "name": req.body.name,
    "as": req.body.as,
    "from": new Date(req.body.from),
    "to": to
  }
  try {
    users.update({
      userId: req.headers['userid']
    }, {
      $push: {
        organisation: org
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

exports.deleteorganisation = function(req, res) {
  var start = new Date();
  var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  var Id = uuid.v1();
  try {
    users.update({
      userId: req.headers['userid']
    }, {
      $pull: {
        organisation: {
          _id: req.body.id
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
exports.editorganisation = function(req, res) {
  var start = new Date();
  var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  if (req.body.to == "till-now") {
    var to = new Date("12 31 9999");
  } else {
    var to = new Date(req.body.to);
  }
  var org = {
    "_id": req.body.id,
    "name": req.body.name,
    "as": req.body.as,
    "from": new Date(req.body.from),
    "to": to
  }
  try {
    users.update({
      userId: req.headers['userid']
    }, {
      $pull: {
        organisation: {
          _id: req.body.id
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
          users.update({
            userId: req.headers['userid']
          }, {
            $push: {
              organisation: org
            }
          }, {
            upsert: true
          }, function(err, data) {
            if (err) {
              //log.info({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

              commonService.error(res, "Internal Server Error", {
                code: InternalServerError
              });
            } else {
              //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });
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
  } catch (err) {
    //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

    commonService.error(res, "Internal Server Error", {
      code: InternalServerError
    });

  }
};
exports.addnewmail = function(req, res) {
  try {
    users.findOne({
      'email.email': req.body.email.toLowerCase()
    }, function(err, info) {
      if (err) {
        commonService.error(res, "Internal Server Error", {
          code: InternalServerError
        });
      } else if (!info) {
        try {
          users.update({
            userId: req.headers['userid']
          }, {
            $push: {
              email: {
                email: req.body.email.toLowerCase()
              }
            }
          }, {
            upsert: true
          }, function(err, data) {
            if (err) {
              commonService.error(res, "Internal Server Error", {
                code: InternalServerError
              });
            } else {
              resHandler.update(res, data);
            }
          })
        } catch (err) {
          commonService.error(res, "Internal Server Error", {
            code: InternalServerError
          });

        }
      } else {
        commonService.error(res, "Email you are trying to add is associated with other account.", {
          code: DuplicateEmail
        });

      }
    })
  } catch (err) {
    commonService.error(res, "Internal Server Error", {
      code: InternalServerError
    });

  }
};
exports.addnewmobile = function(req, res) {
  var start = new Date();
  var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  try {
    users.findOne({
      'mobile.mobile': req.body.mobile
    }, function(err, info) {
      if (err) {
        //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

        commonService.error(res, "Internal Server Error", {
          code: InternalServerError
        });
      } else if (!info) {
        try {

          stockarea.findOne({
            'mobiles.mobile': req.body.mobile,
            'userId': {
              $ne: req.headers['userid']
            }
          }, function(err, info1) {
            if (err) {
              //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

              commonService.error(res, "Internal Server Error", {
                code: InternalServerError
              });
            } else if (!info1) {
              users.update({
                userId: req.headers['userid']
              }, {
                $push: {
                  mobile: {
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
                  resHandler.update(res, data);

                }
              })
              //log.info({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });
            } else {
              //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

              commonService.error(res, "Mobile Number you are trying to add is associated with other account.", {
                code: DuplicateEmail
              });

            }
          })
        } catch (err) {

          //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

          commonService.error(res, "Internal Server Error", {
            code: InternalServerError
          });

        }
      } else {
        //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

        commonService.error(res, "Mobile Number you are trying to add is associated with other account.", {
          code: DuplicateEmail
        });

      }
    })
  } catch (err) {

    //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

    commonService.error(res, "Internal Server Error", {
      code: InternalServerError
    });

  }
};
exports.deleteemail = function(req, res) {
  var start = new Date();
  var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  try {
    users.update({
      userId: req.headers['userid']
    }, {
      $pull: {
        email: {
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
  var start = new Date();
  var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  try {
    users.update({
      userId: req.headers['userid']
    }, {
      $pull: {
        mobile: {
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
exports.verifyemail = function(req, res) {
  var start = new Date();
  var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  try {
    var userc;
    var stockc;
    UserIdentificationKeys.findOne({
      token: req.body.token
    }, function(err, use) {
      if (err) {
        //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

        commonService.error(res, "Internal Server Error", {
          code: InternalServerError
        });
      } else if (use == null || use == undefined) {
        commonService.error(res, "token expired", {
          code: tokenExpired
        });
      } else {
        var id = use.userId;
        try {
          users.findOne({
            _id: use.userId,
            "email.email": use.email
          }, function(err, data) {
            if (err) {
              //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

              commonService.error(res, "Internal Server Error", {
                code: InternalServerError
              });
            } else if (data == null || data == undefined) {
              userservice.stockareaemailverify(req, res, use.userId, use.email);
            } else {
              try {

                users.update({
                  _id: use.userId,
                  'email.email': use.email
                }, {
                  $set: {
                    'email.$.status': 'verified'
                  }
                }, {
                  multi: true
                }, function(err, user) {
                  if (err) {;
                    //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

                    commonService.error(res, "Internal Server Error", {
                      code: InternalServerError
                    });
                  } else {

                    userservice.stockareaemailverify(req, res, use.userId, use.email);

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
};
exports.stockareaemailverify = function(req, res, Id, email) {
  var start = new Date();
  var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  try {
    stockarea.findOne({
      userId: Id,
      "emails.email": email
    }, function(err, info) {
      if (err) {
        //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

        commonService.error(res, "Internal Server Error", {
          code: InternalServerError
        });
      } else if (info == null || info == undefined) {
        stockc = false;
        //log.info({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

        resHandler.update(res, info);
      } else {
        stockc = true;

        try {
          stockarea.update({
            userId: Id,
            'emails.email': email
          }, {
            $set: {
              'emails.$.status': 'verified'
            }
          }, {
            multi: true
          }, function(err, user) {
            if (err) {
              console.error("{" + "'Message':'error in resetpassword" + ",'Url':" + req.originalUrl + "}");
              //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

              commonService.error(res, "Internal Server Error", {
                code: InternalServerError
              });
            } else {
              //log.info({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

              resHandler.update(res, user);
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
};
exports.verifymobileotp = function(req, res) {
  var start = new Date();
  var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  try {
    var userc;
    var stockc;
    UserIdentificationKeys.findOne({
      token: req.body.token
    }, function(err, use) {
      if (err) {
        //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

        commonService.error(res, "Internal Server Error", {
          code: InternalServerError
        });
      } else if (use == null || use == undefined) {
        //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

        commonService.error(res, "token expired", {
          code: tokenExpired
        });
      } else {
        var id = use.userId;
        try {
          users.findOne({
            _id: use.userId,
            "mobile.mobile": use.email
          }, function(err, data) {
            if (err) {
              //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

              commonService.error(res, "Internal Server Error", {
                code: InternalServerError
              });
            } else if (data == null || data == undefined) {
              userservice.stockareamobileverify(req, res, use.userId, use.email);
            } else {
              try {
                users.update({
                  _id: use.userId,
                  'mobile.mobile': use.email
                }, {
                  $set: {
                    'mobile.$.status': 'verified'
                  }
                }, {
                  multi: true
                }, function(err, user) {
                  if (err) {
                    console.error("{" + "'Message':'error in resetpassword" + ",'Url':" + req.originalUrl + "}");
                    //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

                    commonService.error(res, "Internal Server Error", {
                      code: InternalServerError
                    });
                  } else {

                    userservice.stockareamobileverify(req, res, use.userId, use.email);

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
};
exports.stockareamobileverify = function(req, res, Id, mobile) {
  var start = new Date();
  var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  try {
    stockarea.findOne({
      userId: Id,
      "mobiles.mobile": mobile
    }, function(err, info) {
      if (err) {
        //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

        commonService.error(res, "Internal Server Error", {
          code: InternalServerError
        });
      } else if (info == null || info == undefined) {
        stockc = false;
        //log.info({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

        resHandler.update(res, info);
      } else {
        stockc = true;

        try {
          stockarea.update({
            userId: Id,
            'mobiles.mobile': mobile
          }, {
            $set: {
              'mobiles.$.status': 'verified'
            }
          }, {
            multi: true
          }, function(err, user) {
            if (err) {
              console.error("{" + "'Message':'error in resetpassword" + ",'Url':" + req.originalUrl + "}");
              //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

              commonService.error(res, "Internal Server Error", {
                code: InternalServerError
              });
            } else {
              //log.info({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

              resHandler.update(res, user);
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
};




var accountSid = 'AC21ca5dcd3c1af540462766311cb759b6';
var authToken = '6d69d4607b3b779954d28d4dc9415405';

var client = require('twilio')(accountSid, authToken);
exports.verifymobile = function(req, res) {
  var start = new Date();
  var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  try {
    var _id = uuid.v1();
    var userId = req.headers['userid'];
    var a = Math.floor(100000 + Math.random() * 900000);
    a = a.toString();
    a = a.substring(-2);
    // add userIdentificationKeys
    var userIdentificationKeys = new UserIdentificationKeys({
      _id: _id,
      userId: req.headers['userid'],
      type: "verifyemail",
      email: req.body.mobile,
      token: a,
      expiredOn: 120
    });
    try {
      userIdentificationKeys.save(function(err, userIdentificationKeys) {
        if (err) {;
          //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

          commonService.error(res, "Internal Server Error", {
            code: InternalServerError
          });
        } else {
          client.messages.create({
            to: "+91" + req.body.mobile,
            from: "+14156129644",
            body: "Welcome to the Virtualgodown Your Otp is " + a,
          }, function(err, message) {
            if (err) {
              if (err.code == 3000) {
                commonService.error(res, "Enter a valid mobile number", {
                  code: "405"
                });
              } else {;
                commonService.error(res, "something went wrong try again", {
                  code: InternalServerError
                });
              }
            } else {
              //log.info({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

              resHandler.success(res, {
                "message": "otp send Successfully"
              });
            }
          });
        }
      });
    } catch (error) {;
      //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

      commonService.error(res, "Internal Server Error", {
        code: InternalServerError
      });

    }
  } catch (err) {;
    //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

    commonService.error(res, "Internal Server Error", {
      code: InternalServerError
    });

  }
}

exports.verify = function(req, res) {
  var start = new Date();
  var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  var host = req.get('host');
  var origin = req.hostname;

  try {
    var _id = uuid.v1();
    var userId = req.headers['userid'];
    var timestamp = new Date().getTime();
    // add userIdentificationKeys
    var userIdentificationKeys = new UserIdentificationKeys({
      _id: _id,
      userId: req.headers['userid'],
      type: "verifyemail",
      email: req.body.email,
      token: md5(userId + timestamp),
      expiredOn: 12
    });
    try {
      userIdentificationKeys.save(function(err, userIdentificationKeys) {
        if (err) {;
          //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

          commonService.error(res, "Internal Server Error", {
            code: InternalServerError
          });
        } else {
          mailService.verifyemail(req, res, req.body.email, md5(userId + timestamp));
        }
      });
    } catch (error) {;
      //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

      commonService.error(res, "Internal Server Error", {
        code: InternalServerError
      });

    }
  } catch (err) {;
    //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

    commonService.error(res, "Internal Server Error", {
      code: InternalServerError
    });

  }
}
exports.mobileverifyemail = function(req, res) {

  var start = new Date();
  var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  var a = Math.floor(100000 + Math.random() * 900000);
  a = a.toString();
  a = a.substring(-2);
  try {
    var _id = uuid.v1();
    var userId = req.headers['userid'];
    var timestamp = new Date().getTime();
    // add userIdentificationKeys
    var userIdentificationKeys = new UserIdentificationKeys({
      _id: _id,
      userId: req.headers['userid'],
      type: "verifyemail",
      email: req.body.email,
      token: a,
      expiredOn: 12
    });
    try {
      userIdentificationKeys.save(function(err, userIdentificationKeys) {
        if (err) {;
          //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

          commonService.error(res, "Internal Server Error", {
            code: InternalServerError
          });
        } else {
          mailService1.mobileverifyemail(req, res, req.body.email, a);
        }
      });
    } catch (error) {;
      //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

      commonService.error(res, "Internal Server Error", {
        code: InternalServerError
      });

    }
  } catch (err) {;
    //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

    commonService.error(res, "Internal Server Error", {
      code: InternalServerError
    });

  }
}

exports.getemails = function(req, res) {
  var start = new Date();
  var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  try {
    users.find({
      userId: req.headers['userid']
    }).select('email').exec(function(err, data) {
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
exports.addprimary = function(req, res) {
  var start = new Date();
  var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  try {
    users.findOne({
      userId: req.headers['userid'],
      "email.email": req.body.email,
      "email.status": "verified"
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

          users.update({
            userId: req.headers['userid']
          }, {
            $set: {
              userName: req.body.email.toLowerCase()
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
                users.findOne({
                  userId: req.headers['userid'],
                  "email.type": 2
                }, function(err, info) {
                  if (err) {

                    //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

                    commonService.error(res, "Internal Server Error", {
                      code: InternalServerError
                    });
                  } else {
                    if (!info) {
                      try {
                        users.update({
                          userId: req.headers['userid'],
                          "email.email": req.body.email.toLowerCase()
                        }, {
                          $set: {
                            "email.$.type": 2
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
                      users.update({
                        userId: req.headers['userid'],
                        "email.type": 2
                      }, {
                        $set: {
                          "email.$.type": 1
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
                            users.update({
                              userId: req.headers['userid'],
                              "email.email": req.body.email.toLowerCase()
                            }, {
                              $set: {
                                "email.$.type": 2
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
exports.addprimarymobile = function(req, res) {
  var start = new Date();
  var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  try {
    users.findOne({
      userId: req.headers['userid'],
      "mobile.mobile": req.body.mobile,
      "mobile.status": "verified"
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
          users.update({
            userId: req.headers['userid']
          }, {
            $set: {
              primaryMobile: req.body.mobile
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
                users.findOne({
                  userId: req.headers['userid'],
                  "mobile.type": 2
                }, function(err, info) {
                  if (err) {;
                    //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

                    commonService.error(res, "Internal Server Error", {
                      code: InternalServerError
                    });
                  } else {
                    if (!info) {
                      try {

                        users.update({
                          userId: req.headers['userid'],
                          "mobile.mobile": req.body.mobile
                        }, {
                          $set: {
                            "mobile.$.type": 2
                          }
                        }, {
                          upsert: true
                        }, function(err, data) {
                          if (err) {;

                            //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

                            commonService.error(res, "Internal Server Error", {
                              code: InternalServerError
                            });
                          } else {
                            //log.info({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

                            resHandler.update(res, data);
                          }
                        })
                      } catch (err) {;

                        //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

                        commonService.error(res, "Internal Server Error", {
                          code: InternalServerError
                        });

                      }
                    } else {
                      users.update({
                        userId: req.headers['userid'],
                        "mobile.type": 2
                      }, {
                        $set: {
                          "mobile.$.type": 1
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

                            users.update({
                              userId: req.headers['userid'],
                              "mobile.mobile": req.body.mobile
                            }, {
                              $set: {
                                "mobile.$.type": 2
                              }
                            }, {
                              upsert: true
                            }, function(err, data) {
                              if (err) {;

                                //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

                                commonService.error(res, "Internal Server Error", {
                                  code: InternalServerError
                                });
                              } else {
                                //log.info({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

                                resHandler.update(res, data);
                              }
                            })
                          } catch (err) {;

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
exports.addsecondary = function(req, res) {
  var start = new Date();
  var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  try {
    users.update({
      userId: req.headers['userid']
    }, {
      $set: {
        secondaryEmail: req.body.email
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

exports.getuser = function(req, res) {
  var start = new Date();
  var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  try {
    users.findOne({
      userId: req.headers['userid']
    }).select('userId org status fullName profilePic dob address company userName organisation email secondaryEmail mobile primaryMobile').populate('email.type mobile.type org.organisationId').exec(function(err, data) {
      if (err) {
        //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });
        commonService.error(res, "Internal Server Error", {
          code: InternalServerError
        });
      } else if (!data) {
        commonService.error(res, "Internal Server Error", {
          code: InternalServerError
        });
      } else {
        try {
          var org = data.organisation.toObject();
          //log.info({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });
          for (i = 0; i < org.length; i++) {

            var month = monthNames[org[i].from.getUTCMonth()]; //months from 1-12
            var year = org[i].from.getUTCFullYear();
            var month1 = monthNames[org[i].to.getUTCMonth()]; //months from 1-12
            var year1 = org[i].to.getUTCFullYear();
            org[i].from = month + " " + year;
            org[i].to = month1 + " " + year1;
            if (org[i].to == "December 9999" || org[i].to == "undefined 9999") {
              org[i].to = "till-now"
            }
          }
          var info = data.toObject();
          info.organisation = org;
          resHandler.success(res, info);
        } catch (err) {
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
exports.updatepassword = function(req, res) {
  var start = new Date();
  var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  try {
    users.findOne({
      userId: req.headers['userid']
    }, function(err, data) {
      if (err) {
        //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

        commonService.error(res, "Internal Server Error", {
          code: InternalServerError
        });
      } else {
        if (req.body.oldPassword == null || req.body.oldPassword == undefined || !req.body.oldPassword) {
          //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

          commonService.error(res, "Internal Server Error", {
            code: InternalServerError
          });
        } else {
          var oldpassword = req.body.oldPassword.toString();
          var userpassword = req.body.newPassword;
          var salt2 = data.salt;
          var oldhash = data.hashedPassword;
          var userId = req.headers['userid'];
          var salt = salt2;
          var hash = crypto.createHmac('sha1', salt); /** Hashing algorithm sha512 */
          hash.update(oldpassword);
          var value = hash.digest('hex');
          var hashedpassword = value;

          if (hashedpassword == oldhash) {
            var salt = crypto.randomBytes(32).toString('hex'); /** Gives us salt of length 16 */
            var hash = crypto.createHmac('sha1', salt); /** Hashing algorithm sha512 */
            hash.update(userpassword);
            var value = hash.digest('hex');
            var hashedpassword = value;
            var salt1 = salt;

            users.update({
              _id: userId
            }, {
              $set: {
                hashedPassword: hashedpassword,
                salt: salt1
              }
            }, {
              upsert: true
            }, function(err, h) {
              if (err) {;
                //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

                commonService.error(res, "Internal Server Error", {
                  code: InternalServerError
                });
              } else {
                //log.info({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

                resHandler.success(res, "success");
              }
            })
          } else {
            commonService.error(res, "incorrect old password", {
              code: passwordNotMatch
            });
          }
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
exports.geturl = function(req, res) {
  aws.config.update({
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY
  });
  var Id = uuid.v1();
  var s3 = new aws.S3();
  var key = Id + ".jpg";
  var options = {
    Bucket: S3_BUCKET,
    Key: key,
    Expires: 60000000,
    ContentType: 'image/jpeg',
    ACL: 'public-read'
  };
  s3.getSignedUrl('putObject', options, function(err, data) {
    if (err) {;
      return res.send('Error with S3');
    } else {
      var url = 'https://s3.amazonaws.com/' + S3_BUCKET + '/' + Id + ".jpg";
      res.json({
        name: Id,
        signed_request: data,
        url: url
      });
    }
  });
};
exports.updateprofilepic = function(req, res) {
  var start = new Date();
  var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  try {
    var name2 = req.body.img.split(".jpg");
    var name = name2[0] + "_t.png";
    users.update({
      userId: req.headers['userid']
    }, {
      $set: {
        profilePic: req.body.img,
        profilePicThumbnail: name
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
      //  imagethumbservice.addservice(req.body.img);
        res.json({
          status: "success"
        });
      }
    })
  } catch (err) {

    //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

    commonService.error(res, "Internal Server Error", {
      code: InternalServerError
    });

  }
}
exports.delete = function(info, password, data, callback) {
  try {
    users.findOne(info, function(err, data) {
      if (err) {

        callback(err);

      } else {
        if (password == null || password == undefined || !password) {

          callback(err);
        } else {
          var oldpassword = password.toString();
          var salt2 = data.salt;
          var oldhash = data.hashedPassword;
          var userId = data._id;
          var salt = salt2;
          var hash = crypto.createHmac('sha1', salt); /** Hashing algorithm sha512 */
          hash.update(oldpassword);
          var value = hash.digest('hex');
          var hashedpassword = value;

          if (hashedpassword == oldhash) {

            try {
              users.update({
                userId: userId
              }, {
                $set: {
                  status: config.get('status:user:inactive:userDeleted')
                }
              }, {
                upsert: true
              }, function(err, data) {
                if (err) {

                  callback(err);
                } else {
                  callback(null, data);
                }
              })
            } catch (err) {

              callback(err);
            }
          } else {

            callback(err);

          }
        }
      }
    })
  } catch (err) {

    callback(err);

  }
}
exports.getuserstockinfo = function(req, res, info, userid) {
  var start = new Date();
  var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  try {
    users.findOne({
      _id: userid
    }).select('userName fullName email status organisation profilePic secondaryEmail mobile primaryMobile').exec(function(err, data) {
      if (err) {;
        //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

        commonService.error(res, "Internal Server Error", {
          code: InternalServerError
        });
      } else {
        info.selectedproduct.userinfo = data;
        //log.info({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

        resHandler.success(res, info);
      }
    })
  } catch (err) {

    //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

    commonService.error(res, "Internal Server Error", {
      code: InternalServerError
    });

  }
}
/**
 *
 * @param req
 * @param res
 * @description Service for forgetpassword
 */
exports.forgetpassword = function(req, res) {
  var start = new Date();
  var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  var username = req.body.username;
  try {
    users.findOne({
      $or: [{
        userName: username.toLowerCase()
      },{
        Id: username.toLowerCase()
      }, {
        'email.email': username.toLowerCase(),
        'email.status': 'verified'
      }]
    }, function(err, userdata) {
      if (err) {

        //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

        commonService.error(res, "Internal Server Error", {
          code: InternalServerError
        });
      } else {
        if (userdata === null || userdata === undefined || userdata === "") {

          commonService.error(res, 'error in forgetpassword', {
            code: tokenExpired
          });
        } else {
          var _id = uuid.v1();
          var userId = userdata._id;
          var timestamp = new Date().getTime();
          // add userIdentificationKeys
          var userIdentificationKeys = new UserIdentificationKeys({
            _id: _id,
            userId: userId,
            type: "forgetPassword",
            token: md5(userId + timestamp),
            expiredOn: 12
          });
          try {
            userIdentificationKeys.save(function(err, userIdentificationKeys) {
              if (err) {
                console.error("{" + "'Message':'error in forgetpassword'" + ",'Url':" + req.originalUrl + "}");
                //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

                commonService.error(res, "Internal Server Error", {
                  code: InternalServerError
                });
              } else {
                mailService.sendChangePasswordURL(req, res, userdata.userName, md5(userId + timestamp));
              }
            });
          } catch (error) {

            //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

            commonService.error(res, "Internal Server Error", {
              code: InternalServerError
            });

          }
        }
      }
    });
  } catch (err) {

    //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

    commonService.error(res, "Internal Server Error", {
      code: InternalServerError
    });

  }
};
exports.mobileforgetpassword = function(req, res) {
  var start = new Date();
  var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  var username = req.body.username;
  try {
    users.findOne({
      $or: [{
        userName: username.toLowerCase()
      }, {
        'email.email': username.toLowerCase(),
        'email.status': 'verified'
      }]
    }, function(err, userdata) {
      if (err) {
        console.error("{" + "'Message':'error in forgetpassword'" + ",'Url':" + req.originalUrl + "}");

        //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

        commonService.error(res, "Internal Server Error", {
          code: InternalServerError
        });
      } else {
        if (userdata === null || userdata === undefined || userdata === "") {
          console.error("{" + "'Message':'error in forgetpassword'" + ",'Url':" + req.originalUrl + "}");

          commonService.error(res, 'error in forgetpassword', {
            code: tokenExpired
          });
        } else {
          var _id = uuid.v1();
          var userId = userdata._id;
          var a = Math.floor(100000 + Math.random() * 900000);
          a = a.toString();
          a = a.substring(-2);
          var timestamp = new Date().getTime();
          // add userIdentificationKeys
          var userIdentificationKeys = new UserIdentificationKeys({
            _id: _id,
            userId: userId,
            type: "forgetPassword",
            token: a,
            expiredOn: 12
          });
          try {
            userIdentificationKeys.save(function(err, userIdentificationKeys) {
              if (err) {
                console.error("{" + "'Message':'error in forgetpassword'" + ",'Url':" + req.originalUrl + "}");
                //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

                commonService.error(res, "Internal Server Error", {
                  code: InternalServerError
                });
              } else {
                mailService1.mobilesendChangePasswordURL(req, res, req.body.username.toLowerCase(), a);
              }
            });
          } catch (error) {
            console.error("{" + "'Message':'error in forgetpassword'" + ",'Url':" + req.originalUrl + "}");

            //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

            commonService.error(res, "Internal Server Error", {
              code: InternalServerError
            });

          }
        }
      }
    });
  } catch (err) {
    console.error("{" + "'Message':'error in forgetpassword'" + ",'Url':" + req.originalUrl + "}");

    //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

    commonService.error(res, "Internal Server Error", {
      code: InternalServerError
    });

  }
};

/**
 *
 * @param req
 * @param res
 * @description Service for resetpassword
 */
exports.validatetoken = function(req, res) {
  try {
    UserIdentificationKeys.findOne({
      token: req.body.token
    }, function(err, use) {
      if (err) {
        console.error("{" + "'Message':'error in resetpassword" + ",'Url':" + req.originalUrl + "}");
        //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

        commonService.error(res, "Internal Server Error", {
          code: InternalServerError
        });
      } else {
        if (use == null || use == undefined) {
          //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });
          resHandler.success(res, {
            valid: false
          });
        } else {
          resHandler.success(res, {
            valid: true
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
exports.resetpassword = function(req, res) {
  var start = new Date();
  var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  try {
    UserIdentificationKeys.findOne({
      token: req.body.token
    }, function(err, use) {
      if (err) {
        console.error("{" + "'Message':'error in resetpassword" + ",'Url':" + req.originalUrl + "}");
        //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

        commonService.error(res, "Internal Server Error", {
          code: InternalServerError
        });
      } else {
        if (use == null || use == undefined) {
          //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

          commonService.error(res, "Internal Server Error", {
            code: InternalServerError
          });
        } else {
          var id = use.userId;
          users.findOne({
            _id: id
          }, function(err, user) {
            if (err) {
              //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });
              resHandler.serverError(err, res);
            } else {
              var password = req.body.newPassword;
              var salt = crypto.randomBytes(32).toString('hex');
              var hashedPassword = crypto.createHmac('sha1', salt).update(password).digest('hex');
              try {
                users.update({
                  _id: id
                }, {
                  $set: {
                    hashedPassword: hashedPassword,
                    salt: salt
                  }
                }, {
                  upsert: true
                }, function(err, user) {
                  if (err) {
                    console.error("{" + "'Message':'error in resetpassword" + ",'Url':" + req.originalUrl + "}");
                    //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

                    commonService.error(res, "Internal Server Error", {
                      code: InternalServerError
                    });
                  } else {
                    try {
                      accessToken.remove({
                        userId: id
                      }, function(err, rdata) {
                        if (err) {
                          console.error("{" + "'Message':'error in resetpassword" + ",'Url':" + req.originalUrl + "}");
                          //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

                          commonService.error(res, "Internal Server Error", {
                            code: InternalServerError
                          });
                        } else {
                          var data = {
                            "isadded": "true",
                            "message": "User Password updated Successfully"
                          }
                          //log.info({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

                          resHandler.success(res, data);
                        }
                      })
                    } catch (error) {

                      //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

                      commonService.error(res, "Internal Server Error", {
                        code: InternalServerError
                      });

                    }

                  }

                });
              } catch (error) {

                //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });

                commonService.error(res, "Internal Server Error", {
                  code: InternalServerError
                });

              }
            }
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
};
