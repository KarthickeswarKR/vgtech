var express = require('express');
var uuid = require("node-uuid");
var resHandler = require("../common/res-handler");
var commonService = require("../common/commonService.js");
var brandmaterial = require('../models/brandmaterial');
var material = require('../models/material');
var config = require('../config/config')
var InternalServerError = config.get('errorcodes:InternalServerError');
var InputsError = config.get('errorcodes:InputsError');
var DuplicateUser = config.get('errorcodes:DuplicateUser');
var DuplicateEmail = config.get('errorcodes:DuplicateEmail/Mobile');
var tokenExpired = config.get('errorcodes:tokenExpired');
var unauthorised = config.get('errorcodes:unauthorised');
var passwordNotMatch = config.get('errorcodes:passwordNotMatch');
var EmailNotverified = config.get('errorcodes:EmailNotverified');
exports.addlike = function(req, res, next) {
  try {
    var Id = uuid.v1();
    brandmaterial.findOne({
      brandId: req.body.brandId,
      materialId: req.body.materialId
    }, function(err, data) {
      if (err) {
        commonService.error(res, err.message, {
          code: InternalServerError
        });
      } else if (!data) {
        var brandinfo = new brandmaterial({
          _id: Id,
          materialId: req.body.materialId,
          brandId: req.body.brandId,
          likes: [{
            userId: req.headers['userid']
          }]
        });
        brandinfo.save(function(err, info) {
          if (err) {
            commonService.error(res, err.message, {
              code: InternalServerError
            });

          } else {
            material.update({
              _id: req.body.materialId
            }, {
              $push: {
                brandmaterial: info._id
              }
            }, {
              upsert: true
            }, function(err, data) {
              if (err) {
                commonService.error(res, err.message, {
                  code: InternalServerError
                });
              } else {
                resHandler.update(res, info);
              }
            })
          }
        })
      } else {
        var key = {
          userId: req.headers['userid']
        }
        brandmaterial.update({
          brandId: req.body.brandId,
          materialId: req.body.materialId
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
    });
  } catch (err) {
    commonService.error(res, err.message, {
      code: InternalServerError
    });
  }
};
exports.removelike = function(req, res, next) {
  try {
    var Id = uuid.v1();
    brandmaterial.findOne({
      brandId: req.body.brandId,
      materialId: req.body.materialId
    }, function(err, data) {
      if (err) {
        commonService.error(res, err.message, {
          code: InternalServerError
        });
      } else {
        var key = {
          userId: req.headers['userid']
        }
        brandmaterial.update({
          brandId: req.body.brandId,
          materialId: req.body.materialId,
          'likes.userId': req.headers['userid']
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
    });
  } catch (err) {
    commonService.error(res, err.message, {
      code: InternalServerError
    });
  }
};
exports.addreview = function(req, res, next) {
  try {
    var Id = uuid.v1();
    brandmaterial.findOne({
      brandId: req.body.brandId,
      materialId: req.body.materialId
    }, function(err, data) {
      if (err) {
        commonService.error(res, err.message, {
          code: InternalServerError
        });
      } else if (!data) {
        var brandinfo = new brandmaterial({
          _id: Id,
          materialId: req.body.materialId,
          brandId: req.body.brandId,
          reviews: [{
            message: req.body.message,
            userId: req.headers['userid']
          }]
        });
        brandinfo.save(function(err, info) {
          if (err) {
            commonService.error(res, err.message, {
              code: InternalServerError
            });

          } else {
            material.update({
              _id: req.body.materialId
            }, {
              $push: {
                brandmaterial: info._id
              }
            }, {
              upsert: true
            }, function(err, data) {
              if (err) {
                commonService.error(res, err.message, {
                  code: InternalServerError
                });
              } else {
                resHandler.update(res, info);
              }
            })
          }
        })
      } else {
        brandmaterial.findOne({
          brandId: req.body.brandId,
          materialId: req.body.materialId,
          'reviews.userId': req.headers['userid']
        }, function(err, info) {
          if (err) {
            commonService.error(res, err.message, {
              code: InternalServerError
            });
          } else if (!info) {
            var key = {
              userId: req.headers['userid'],
              message: req.body.message,
              rating: req.body.review
            }
            brandmaterial.update({
              brandId: req.body.brandId,
              materialId: req.body.materialId
            }, {
              $push: {
                reviews: key
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
          } else {
            var key = {
              userId: req.headers['userid'],
              message: req.body.message,
              rating: req.body.review
            }
            brandmaterial.update({
              brandId: req.body.brandId,
              materialId: req.body.materialId,
              'reviews.userId': req.headers['userid']
            }, {
              $set: {
                'reviews.$.message': req.body.message,
                'reviews.$.rating': req.body.review
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
    material.findOne({
      _id: req.query.materialId
    }).populate({
      path: 'brandmaterial',
      populate: {
        path: 'brandId likes.userId reviews.userId'
      }
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
