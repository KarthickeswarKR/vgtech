var express = require('express');
var uuid = require("node-uuid");
var productstock = require('../models/productstock.js');
var resHandler = require("../common/res-handler");
var commonService = require("../common/commonService.js");
var notification = require('../models/notification');
var message = require('../models/message');

var user = require('../models/users');
var stockarea = require('../models/stockarea');
var organisation = require('../models/organisation');
var masternotification = require('../models/masternotification');
var config = require('../config/config')
var InternalServerError = config.get('errorcodes:InternalServerError');
var InputsError = config.get('errorcodes:InputsError');
var DuplicateUser = config.get('errorcodes:DuplicateUser');
var DuplicateEmail = config.get('errorcodes:DuplicateEmail/Mobile');
var tokenExpired = config.get('errorcodes:tokenExpired');
var unauthorised = config.get('errorcodes:unauthorised');
var passwordNotMatch = config.get('errorcodes:passwordNotMatch');
var EmailNotverified = config.get('errorcodes:EmailNotverified');
exports.addnotification = function(type,initiator,receiptent,notificationtype,userId,receiptentId) {
  try {
    console.log(notificationtype);
    masternotification.findOne({_id:notificationtype},function(err,data){
      if(err){
      console.log(err);
      }else{
        console.log(data);
      productstock.findOne({_id:initiator}).populate({
        path:'stockareaId',
        populate:{
          path:'organisationId'
        }
      }).populate('productId').exec(function(err,initiatorinfo){
        console.log(initiatorinfo);
        if(err){
        console.log(err);
        }else{
        productstock.findOne({_id:receiptent}).populate({
          path:'stockareaId',
          populate:{
            path:'organisationId'
          }
        }).populate('productId').exec(function(err,receiptentinfo){
          if(err){
          console.log(err);
          }else{
          console.log();
    var Id = uuid.v1();
    if(initiatorinfo.stockareaId.organisationId.organisationName){
      var message=initiatorinfo.stockareaId.stockareaName+" from "+initiatorinfo.stockareaId.organisationId.organisationName+ data.message + " " + receiptentinfo.productId.productName + " in " + receiptentinfo.stockareaId.stockareaName
    }else{
      var message=initiatorinfo.stockareaId.stockareaName + data.message + " " + receiptentinfo.productId.productName + " in " + receiptentinfo.stockareaId.stockareaName
    }
    var info=new notification({
      _id:Id,
      userId:userId,
      receiptent:receiptentId,
      initiatorOrganisationId:initiator,
      type:type,
  //    img:initiatorinfo.stockareaId.userId.profilePic,
      receiptentOrganisationId:receiptent,
      //stockareaname from orgnisationname requested to collabrate with stockarea productaname
      message:message
    })
    info.save(function(err,info){
if(err){
console.log(err);
}else{
  console.log("success");
}
    })
  }
  })
}
})
}
  })
  } catch (err) {
  console.log(err);
  }
};
exports.sendnotification= function(initiator,receiptent,message) {
  try {
    var Id = uuid.v1();
    var info=new notification({
      _id:Id,
      userId:initiator,
      receiptent:receiptent,
      message:message
    })
    info.save(function(err,info){
if(err){
console.log(err);
}else{
  console.log("success");
}
  })
  } catch (err) {
  console.log(err);
  }
};

exports.addnotificationsource = function(type,initiator,receiptent,notificationtype,userId,receiptentId,initiatorstockarea,receiptentstockarea) {
  try {
    console.log(notificationtype);
    masternotification.findOne({_id:notificationtype},function(err,data){
      if(err){
      console.log(err);
      }else{
        console.log(data);
      user.findOne({_id:userId},function(err,initiatorinfo){
        if(err){
        console.log(err);
        }else{
        stockarea.findOne({_id:receiptentstockarea},function(err,receiptentinfo){
          if(err){
          console.log(err);
          }else{
    var Id = uuid.v1();
    var info=new notification({
      _id:Id,
      userId:userId,
      receiptent:receiptentId,
      img:initiatorinfo.profilePic,
      initiatorStockareaId:initiatorstockarea,
      receiptentStockareaId:receiptentstockarea,
      initiatorOrganisationId:initiator,
      type:type,
      receiptentOrganisationId:receiptent,
      message:initiatorinfo.fullName+ data.message + receiptentinfo.stockareaName
    })
    info.save(function(err,info){
if(err){
console.log(err);
}else{
  console.log("success");
}
    })
  }
  })
}
})
}
  })
  } catch (err) {
  console.log(err);
  }
};

exports.getinfo = function(req, res, next) {
  try {
    notification.find({receiptent:req.headers['userid'],status:config.get('status:notification:unread')}).populate('userId receiptent initiatorOrganisationId receiptentOrganisationId initiatorStockareaId receiptentStockareaId').exec(function(err, data) {
      if (err) {
        console.log(1);
        console.log(err);
        commonService.error(res, err.message, {
          code: InternalServerError
        });
      } else {
        message.find({$or:[{'receiptent.userId':req.headers['userid']},{initiator:req.headers['userid']}]}).populate('initiator receiptent.userId receiptent.organisationId initiatorOrganisation').exec(function(err, messagedata){
          if (err) {
            console.log(2);
            console.log(err);
            commonService.error(res, err.message, {
              code: InternalServerError
            });
          } else {
            notification.find({receiptent:req.headers['userid']}).populate('userId receiptent initiatorOrganisationId receiptentOrganisationId initiatorStockareaId receiptentStockareaId').exec(function(err, alldata) {
              if (err) {
                console.log(1);
                console.log(err);
                commonService.error(res, err.message, {
                  code: InternalServerError
                });
              } else {

            var info={};
            info.notification=data;
            info.allnotification=alldata;
            info.messages=messagedata;
            resHandler.success(res, info);
          }
        })
          }
        });
      }
    });
  } catch (err) {
    console.log(3);
    console.log(err);

    commonService.error(res, err.message, {
      code: InternalServerError
    });
  }
};
exports.updatenotification = function(req, res, next) {
  try {
    notification.update({receiptent:req.headers['userid']},{$set:{status:config.get('status:notification:read')}},{multi:true},function(err, data) {
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
