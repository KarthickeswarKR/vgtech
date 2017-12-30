var express = require('express');
var package = require('../models/package.js');
var product = require('../models/product');
var resHandler = require("../common/res-handler");
var config = require('../config/config');
var uuid = require("node-uuid");
var sell = require('../models/sell.js');
var notificationservice=require('../services/notificationservice');
var commonService = require("../common/commonService.js");

exports.addpackage=function(req,res){
try{
  if(!req.body.productId || !req.body.packagesize || req.body.packagesize==null || req.body.packagesize==undefined || !req.body.unit || req.body.unit==null || req.body.unit==undefined || !req.body.packagesize || req.body.packagesize==null || req.body.packagesize==undefined){
    commonService.error(res, "InputsError", {
      code: InputsError
    });
  }else{
    var uid=uuid.v1();
    var name=req.body.packagesize;
    name=name+' '+req.body.unit+' '+req.body.packagetype;
    if(req.body.packagetype || req.body.packagetype!==null || req.body.packagetype!==undefined){
      name=name+' '+req.body.packagetype;
    }
    if(req.body.packageshape || req.body.packageshape!==null || req.body.packageshape!==undefined){
      name=name+' '+req.body.packageshape;
    }

    var pack=new package(
      {
_id:uid,
name:name,
size:req.body.packagesize,
shape:req.body.packageshape,
type:req.body.packagetype,
unit:req.body.unit,
productId:req.body.productId

      }
    );
    pack.save(function(err,data)
  {
    if(err)
    res.send(err)
    else{
      product.update(
       { "_id": req.body.productId },
       { "$push": { "package": data._id } },
       function (err,info) {
           if (err)
           res.send(err)
           else{
             sell.update({productId:req.body.productId},{$push:{"package":data}},{multi:true},function(err,packsinfo){
               if(err){
                 res.send(err)

               }else{
                 res.send("success");

               }
             })
           }
       }
    );
    }
  });
}
}catch(err){
  commonService.error(res, "Internal Server Error", {
    code: InternalServerError
  });
}
}
exports.deletepackage=function(req,res){
  sell.update({'package._id':req.body.packageId},{$pull:{package:{_id:req.body.packageId}}},{multi:true},function(err,info){
    if(err){
      commonService.error(res, "Internal Server Error", {
        code: InternalServerError
      });
    }else{
      product.update({'package':req.body.packageId},{$pull:{package:req.body.packageId}},{multi:true},function(err,info){
        if(err){
          commonService.error(res, "Internal Server Error", {
            code: InternalServerError
          });
        }else{
          resHandler.success(res, info);
        }
      })
    }
  })
}
exports.suggestpackage=function(req,res){
try{
  if(!req.body.productId || !req.body.packagesize || req.body.packagesize==null || req.body.packagesize==undefined || !req.body.unit || req.body.unit==null || req.body.unit==undefined || !req.body.packagesize || req.body.packagesize==null || req.body.packagesize==undefined){
    commonService.error(res, "InputsError", {
      code: InputsError
    });
  }else{
    var uid=uuid.v1();
    var name=req.body.packagesize;
    if(req.body.packagetype || req.body.packagetype!==null || req.body.packagetype!==undefined){
      name=name+' '+req.body.packagetype;
    }
    if(req.body.packageshape || req.body.packageshape!==null || req.body.packageshape!==undefined){
      name=name+' '+req.body.packageshape;
    }
      name=name+' '+req.body.unit+' '+req.body.packagetype;

    var pack=new package(
      {
_id:uid,
name:name,
productId:req.body.productId,
size:req.body.packagesize,
shape:req.body.packageshape,
type:req.body.packagetype,
unit:req.body.unit,
createdBy:req.headers['userid']
      }
    );
    pack.save(function(err,data)
  {
    if(err)
    res.send(err)
    else{
      notificationservice.sendnotification(req.headers['userid'],config.get('virtualgodownId'),"User requested to move product"+req.query.productId+"to virtualgodown");
      res.send("success");
    }
  });
}
}catch(err){
  commonService.error(res, "Internal Server Error", {
    code: InternalServerError
  });
}
}
