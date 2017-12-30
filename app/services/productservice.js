var express = require('express');
var product = require('../models/product.js');
var stockarea = require('../models/stockarea.js');
var config = require('../config/config');
var brandmaterial = require('../models/brandmaterial');
var notificationservice=require('../services/notificationservice');
var material = require('../models/material');
var sell = require('../models/sell');
var variant = require('../models/variants');
var InternalServerError = config.get('errorcodes:InternalServerError');
var InputsError = config.get('errorcodes:InputsError');
var DuplicateUser = config.get('errorcodes:DuplicateUser');
var DuplicateEmail = config.get('errorcodes:DuplicateEmail/Mobile');
var tokenExpired = config.get('errorcodes:tokenExpired');
var unauthorised = config.get('errorcodes:unauthorised');
var passwordNotMatch = config.get('errorcodes:passwordNotMatch');
var EmailNotverified = config.get('errorcodes:EmailNotverified');
var productstock = require('../models/productstock.js');
var uuid = require("node-uuid");
var productservice = require('../services/productservice');
var resHandler = require("../common/res-handler");
var commonService = require("../common/commonService.js");
var utils = require("../common/utils.js");
exports.addnewproduct = function(req, res) {
  var userId = utils.getUserId(req.header('Authorization'));
  if (req.body.productname !== null || req.body.productname !== "" || req.body.productname !== undefined || req.body.packages !== null || req.body.packages !== undefined) {
    if (req.body.pics.length == 0 || !req.body.pics) {
      var primaryimage = config.get('defaultImageUrl')
      var pics=[{img:config.get('defaultImageUrl')}]
    } else {
      var primaryimage = req.body.pics[0].img;
      var pics=req.body.pics;
    }
    var type;
    if(req.body.producttype==1000){
      type=1006
    }else{
      type=req.body.producttype
    }
    var Id = uuid.v1();
    var products = new product({
      _id: Id,
      productId: Id,
      productName: req.body.productname,
      brandId: req.body.productbrand,
      createdBy: userId,
      ownedBy: req.headers['organisationid'],
      package: req.body.packages,
      type:type,
      productDescription: req.body.productdescription,
      specifications: req.body.specifications,
      images: pics,
      completeInfo: req.body.specifications,
      links:req.body.links,
      categoryId: req.body.productcategory,
      primaryImage: primaryimage
    });
    products.save(function(err, add) {
      if (err) {

        commonService.error(res, "Internal Server Error", {
          code: InternalServerError
        });
      } else {
      resHandler.success(res,add)
      }
    });
  }else{
    commonService.error(res, "InputsError", {
      code: InputsError
    });
  }
};
exports.addlike=function(req,res){
try{
  var userId = utils.getUserId(req.header('Authorization'));
  var key = {
    userId:userId
  }
  if(!req.body.productId){
    commonService.error(res, "InputsError", {
      code: InputsError
    });
  }else{
  product.update({
    _id: req.body.productId
  }, {
    $addToSet: {
      likes: key
    }
  }, {
    upsert: true
  }, function(err, info) {
    if (err) {
      commonService.error(res, err.message, {
        code: InternalServerError
      });
    } else {
      resHandler.update(res, info);
    }
  })
}
}catch(err){
  commonService.error(res, "Internal Server Error", {
    code: InternalServerError
  });
}
}
exports.movetovg=function(req,res){
try{
  var userId = utils.getUserId(req.header('Authorization'));
  var key = {
    userId:userId
  }
  if(!req.query.productId){
    commonService.error(res, "InputsError", {
      code: InputsError
    });
  }else{
  product.update({
    _id: req.query.productId
  }, {
    $set: {
      type: config.get('product:type:pendingApproval'),
    }
  }, {
    upsert: true
  }, function(err, info) {
    if (err) {
      commonService.error(res, err.message, {
        code: InternalServerError
      });
    } else {
      resHandler.update(res, info);
      notificationservice.sendnotification(req.headers['userid'],config.get('virtualgodownId'),"User requested to move product"+req.query.productId+"to virtualgodown");
    }
  })
}
}catch(err){
  commonService.error(res, "Internal Server Error", {
    code: InternalServerError
  });
}
}
exports.removelike=function(req,res){
try{
  var userId = utils.getUserId(req.header('Authorization'));
  var key = {
    userId:userId
  }
  if(!req.body.productId){
    commonService.error(res, "InputsError", {
      code: InputsError
    });
  }else{
  product.update({
    _id: req.body.productId
  }, {
    $pull: {
      likes: key
    }
  }, {
    upsert: true
  }, function(err, info) {
    if (err) {
      commonService.error(res, err.message, {
        code: InternalServerError
      });
    } else {
      resHandler.update(res, info);
    }
  })
}
}catch(err){
  commonService.error(res, "Internal Server Error", {
    code: InternalServerError
  });
}
}
exports.updateproduct = function(req, res) {
try{
  if (req.body.pics.length == 0 || !req.body.pics) {
    var primaryimage = config.get('defaultImageUrl')
    var pics=[{img:config.get('defaultImageUrl')}]
  } else {
    var primaryimage = req.body.pics[0].img;
    var pics=req.body.pics;
  }
  if(!req.body.productId && req.body.productname==null){
    commonService.error(res, "InputsError", {
      code: InputsError
    });
  }else{
  product.update({
    _id: req.body.productId
  }, {
    $set: {
      productName: req.body.productname,
      specifications: req.body.specifications,
      completeInfo: req.body.specifications,
      type: req.body.producttype,
      images: pics,
      links:req.body.links,
      brandId:req.body.brand
    }
  }, {
    upsert: true
  }, function(err, data) {
    if (err) {
      commonService.error(res, "Internal Server Error", {
        code: InternalServerError
      });
    } else {
      resHandler.success(res, data);
    }
  });
}
}catch(err){
  commonService.error(res, "Internal Server Error", {
    code: InternalServerError
  });
}
};
/*exports.oneshot = function(req, res) {
  productstock.remove({ _id: null }, function(err) {
      if (err) {
console.log(err);      }
      else {
console.log("success");      }
  });

};*/
exports.addvariantforproduct = function(req, res) {
  var userId = utils.getUserId(req.header('Authorization'));
  if (req.body.productname !== null || req.body.productname !== undefined || req.body.packages !== null || req.body.packages !== undefined || req.body.productbrand !== null || req.body.productbrand !== undefined) {
    if (req.body.pics.length == 0) {
      var primaryimage = config.get('defaultImageUrl');
    } else {
      var primaryimage = req.body.pics[0].img;
    }
    var materialId = req.body.materialId;
    var Id = uuid.v1();
    var variantId = uuid.v1();
    var products = new product({
      _id: Id,
      productId: Id,
      productName: req.body.productname,
      variantId: variantId,
      brandId: req.body.productbrand,
      type: req.body.producttype,
      createdBy: userId,
      ownedBy: req.headers['organisationid'],
      materialId: materialId,
      package: req.body.packages,
      specifications: req.body.specifications,
      images: req.body.pics,
      completeInfo: req.body.specifications,
      categoryId: req.body.productcategory,
      unit: req.body.productunit,
      status: config.get('status:product:inactive:pendingApproval'),
      primaryImage: req.body.pics[0].img
    });
    products.save(function(err, add) {
      if (err) {

        commonService.error(res, "Internal Server Error", {
          code: InternalServerError
        });
      } else {
        material.update({
          _id: materialId
        }, {
          $push: {
            brandmaterial: brandmaterialId
          }
        }, {
          upsert: true
        }, function(err, data) {
          if (err) {

            commonService.error(res, "Internal Server Error", {
              code: InternalServerError
            });
          } else {
            var variantinfo = variant({
              _id: variantId,
              type: req.body.producttype,
              createdBy: userId,
            });
            variantinfo.save(function(err, data) {
              if (err) {

                commonService.error(res, "Internal Server Error", {
                  code: InternalServerError
                });
              } else {
                var brandinfo = new brandmaterial({
                  _id: brandmaterialId,
                  materialId: materialId,
                  brandId: req.body.productbrand,
                  likes: [{
                    userId: userId
                  }]
                });
                brandinfo.save(function(err, info) {
                  if (err) {
                    commonService.error(res, err.message, {
                      code: InternalServerError
                    });

                  } else {
                    resHandler.success(res, add);
                  }
                });
              }
            });
          }
        });

      }
    });
  }
};
exports.delete = function(info, data, callback) {
  product.update({
    createdBy: info.userId
  }, {
    $set: {
      status: config.get('status:product:inactive:' + data + 'Deleted')
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
exports.autocomplete = function(req, res) {
  try {
    var info;
    if(req.query.type=='private'){
  info= {
      createdBy:req.headers['userid']
  }
}else{
    info={$or:[{productName: {
    "$regex": req.query.term,
    "$options": "i"
  },
  type: config.get('product:type:withInOrganisation'),
    status:config.get('status:product:active:createdwithsell')
},{productName: {
"$regex": req.query.term,
"$options": "i"
},
type: config.get('product:type:withInNetwork'),
status:config.get('status:product:active:createdwithsell')
},{productName: {
"$regex": req.query.term,
"$options": "i"
},
type: config.get('product:type:virtualgodown')
},{productName: {
"$regex": req.query.term,
"$options": "i"
},
createdBy:req.headers['userid']
}]}
}
    product.find(info).populate('categoryId').limit(5).exec(function(err, data) {
      if (err) {
        commonService.error(res, "Internal Server Error", {
          code: InternalServerError
        });
      } else {
          resHandler.success(res, data);
      }
    })
  } catch (err) {

    //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,"term":req.query.term });
    commonService.error(res, "Internal Server Error", {
      code: InternalServerError
    });

  }
};
exports.brandautocomplete = function(req, res) {

  try {
    var info;
    /*if(req.query.type=='private'){
      info={
        $or: [{
          productName: {
            "$regex": req.query.term,
            "$options": "i"
          },
          type: config.get('product:type:withInOrganisation'),
          collabrators: req.headers['organisationid'],
          categoryId:config.get('category:brand')
        }, {
          productName: {
            "$regex": req.query.term,
            "$options": "i"
          },
          type: config.get('product:type:withInOrganisation'),
          ownedBy: req.headers['organisationid'],
          categoryId:config.get('category:brand')

        }, {
          productName: {
            "$regex": req.query.term,
            "$options": "i"
          },
          type: config.get('product:type:withInNetwork'),
          ownedBy: req.headers['organisationid'],
          categoryId:config.get('category:brand')

        }]
      }
    }else{
      info={
        $or: [{
          productName: {
            "$regex": req.query.term,
            "$options": "i"
          },
          type: config.get('product:type:virtualgodown'),
          categoryId:config.get('category:brand')

        },{
          productName: {
            "$regex": req.query.term,
            "$options": "i"
          },
          type: config.get('product:type:withInOrganisation'),
          ownedBy: req.headers['organisationid'],
          categoryId:config.get('category:brand')

        }, {
          productName: {
            "$regex": req.query.term,
            "$options": "i"
          },
          type: config.get('product:type:withInOrganisation'),
          collabrators: req.headers['organisationid'],
          categoryId:config.get('category:brand')

        }, {
          productName: {
            "$regex": req.query.term,
            "$options": "i"
          },
          type: config.get('product:type:withInNetwork'),
          ownedBy: req.headers['organisationid'],
         categoryId:config.get('category:brand')

        }]
      }
    }*/
    product.find({productName: {
        "$regex": req.query.term,
        "$options": "i"
      },
      categoryId:config.get('category:brand')}).limit(5).exec(function(err, data) {
      if (err) {
        //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,"term":req.query.term });
        commonService.error(res, "Internal Server Error", {
          code: InternalServerError
        });
      } else {
        //log.info({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,"term":req.query.term });
        resHandler.success(res, data);
      }
    })
  } catch (err) {

    //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,"term":req.query.term });
    commonService.error(res, "Internal Server Error", {
      code: InternalServerError
    });

  }
};


exports.getSearchProductsbycategory = function(req, res) {
  try {
    product.find({
      categoryId: req.query.id
    }, function(err, data) {
      if (err) {
        //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,"productId":req.query.productId });
        commonService.error(res, "Internal Server Error", {
          code: InternalServerError
        });
      } else {
        //log.info({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,"productId":req.query.productId  });
        resHandler.success(res, data);
      }
    })
  } catch (err) {

    //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,"productId":req.query.productId  });
    commonService.error(res, "Internal Server Error", {
      code: InternalServerError
    });

  }
};
exports.getprivateproducts = function(req, res) {
  try {
    product.find({
      createdBy: req.headers['userid'],
      ownedBy: req.headers['organisationid']
    }, function(err, data) {
      if (err) {
        //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,"productId":req.query.productId });
        commonService.error(res, "Internal Server Error", {
          code: InternalServerError
        });
      } else {
        //log.info({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,"productId":req.query.productId  });
        resHandler.success(res, data);
      }
    })
  } catch (err) {

    //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,"productId":req.query.productId  });
    commonService.error(res, "Internal Server Error", {
      code: InternalServerError
    });

  }
};

exports.productdetails = function(req, res) {
  var userId = utils.getUserId(req.header('Authorization'));
  var info;
  if(req.query.productId){
    info= {
        _id:req.query.productId
    }
  }else{
  if(req.query.type=='private'){
info= {
    createdBy:req.headers['userid']
}
}else{
  info={$or:[{productName: {
  "$regex": req.query.term,
  "$options": "i"
},
type: config.get('product:type:withInOrganisation'),
  status:config.get('status:product:active:createdwithsell')
},{productName: {
"$regex": req.query.term,
"$options": "i"
},
type: config.get('product:type:withInNetwork'),
status:config.get('status:product:active:createdwithsell')
},{productName: {
"$regex": req.query.term,
"$options": "i"
},
type: config.get('product:type:virtualgodown')
},{productName: {
"$regex": req.query.term,
"$options": "i"
},
createdBy:req.headers['userid']
}]}
}
}
  try {
    product.find(
      info
    ).populate('categoryId brandId').populate({
      path: 'package',
      model: 'package'
    }).limit(5).exec(function(err, data) {
      if (err) {
        //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,"term":req.query.term });
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

exports.getproductsdata = function(req, res) {
  var start = new Date();
  var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  var products = [];
  try {
    product.find({
      $or: [{
        productName: {
          "$regex": req.query.term,
          "$options": "i"
        },
        type: config.get('product:type:virtualgodown')
      }, {
        productName: {
          "$regex": req.query.term,
          "$options": "i"
        },
        type: config.get('product:type:withInNetwork'),
        collabrators: req.headers['organisationid']
      }, {
        productName: {
          "$regex": req.query.term,
          "$options": "i"
        },
        createdBy: req.headers['userid']
      }]
    }).populate('brndId').exec(function(err, data) {
      if (err) {
        //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,"term":req.query.term  });
        commonService.error(res, "Internal Server Error", {
          code: InternalServerError
        });
      } else {
        if (data.length == 0) {
          //log.info({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,"term":req.query.term });
          resHandler.success(res, products);
        } else {
          for (i = 0; i < data.length; i++) {
            try {
              productstock.findOne({
                productId: data[i]._id,
                stockareaId: req.query.stockareaId
              }, function(err, dat) {
                if (err) {
                  //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,"term":req.query.term });
                  commonService.error(res, "Internal Server Error", {
                    code: InternalServerError
                  });
                } else {
                  if (!dat) {} else {

                    products.push(dat._id);
                  }
                }
              })
            } catch (err) {

              //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,"term":req.query.term });
              commonService.error(res, "Internal Server Error", {
                code: InternalServerError
              });

            }
          }
          productservice.process(req, res, data, products);
        }
      }
    })
  } catch (err) {

    //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,"term":req.query.term });
    commonService.error(res, "Internal Server Error", {
      code: InternalServerError
    });

  }
};
exports.process = function(req, res, data, products) {
  var start = new Date();
  var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  var productdata = [];

  for (j = 0; j < products.length; j++) {
    try {
      stockarea.findOne({
        _id: req.query.stockareaId,
        products: products[j]
      }, function(err, stockareainfo) {
        if (err) {
          //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,"stockareaId":req.query.stockareaId });
          commonService.error(res, "Internal Server Error", {
            code: InternalServerError
          });
        } else {
          try {
            productstock.findOne({
              _id: products[j]
            }, function(err, info) {
              if (err) {
                //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,"stockareaId":req.query.stockareaId });
                commonService.error(res, "Internal Server Error", {
                  code: InternalServerError
                });
              } else {
                for (z = 0; z < data.length; z++) {
                  if (data[z]._id == info.productId) {
                    var indata = data[z].toObject();
                    if (stockareainfo == null || stockareainfo == undefined) {
                      indata.added = false;
                      productdata.push(indata);
                      indata = null;
                    } else {
                      indata.added = true;
                      productdata.push(indata);
                      indata = null;
                    }
                  }

                }
              }
            })
          } catch (err) {

            //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,"stockareaId":req.query.stockareaId });
            commonService.error(res, "Internal Server Error", {
              code: InternalServerError
            });

          }
        }
      })
    } catch (err) {

      //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,"stockareaId":req.query.stockareaId });
      commonService.error(res, "Internal Server Error", {
        code: InternalServerError
      });

    }
  }
  //log.info({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start ,"stockareaId":req.query.stockareaId});
  resHandler.success(res, data);
}
exports.getinfobymaterial = function(req, res) {
  try {
    product.findOne({
      productId: req.query.productId
    }).exec(function(err, data) {
      if (err) {
        commonService.error(res, "Internal Server Error", {
          code: InternalServerError
        });
      } else {
        material.findOne({
          materialId: data.materialId
        }).populate('brands.brandId brands.packages').exec(function(err, info) {
          if (err) {
            commonService.error(res, "Internal Server Error", {
              code: InternalServerError
            });
          } else {
            variant.find({
              _id: data.variantId
            }, function(err, variantinfo) {
              if (err) {
                commonService.error(res, "Internal Server Error", {
                  code: InternalServerError
                });
              } else {
                var data = info.toObject();
                data.variant = variantinfo;
                resHandler.success(res, data);
              }
            })
          }
        })
      }
    })
  } catch (err) {

    //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start,'productId': req.query.productId });
    commonService.error(res, "Internal Server Error", {
      code: InternalServerError
    });

  }
}
exports.getproductinfobyid = function(req, res) {
  var start = new Date();
  var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  try {
    product.findOne({
      productId: req.query.productId
    }).populate('categoryId brandId').populate({
      path: 'package',
      model: 'package'
    }).populate({
      path:'links.productId',
      model:'product'
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
