var express = require('express');
var imagethumb = require('../models/imagethumb.js');
var uuid = require("node-uuid");
var resHandler = require("../common/res-handler");
var commonService = require("../common/commonService.js");
var schedule = require('node-schedule');
var fs = require("fs");
var request = require('request').defaults({
  encoding: null
});
var aws = require('aws-sdk');
var AWS_ACCESS_KEY = 'AKIAJGBUR2YR6NMK4ZTA';
var AWS_SECRET_KEY = '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';
var S3_BUCKET = 'virtualgd';
var j = schedule.scheduleJob("1* * * * *", function() {

  try {

    imagethumb.find({
      status: "progress"
    }, function(err, data) {
      if (err) {
        console.log(err);
      } else if (data == null || data == [] || data == undefined || !data) {
        console.log("empty");
      } else {
        data.forEach(function(item) {
          try {
            var Id = item._id;
            var url = item.url;
            var name1 = url.split("https://s3.amazonaws.com/virtualgd/");
            var name2 = name1[1].split(".jpg");
            var name = name2[0];
          } catch (err) {
            console.log(err);
          }
          try {
            request({
              uri: url
            }, function(error, response, body) {
              if (body == null || body == undefined || !body || error) {
                imagethumb.update({
                  _id: Id
                }, {
                  $set: {
                    status: "incomplete"
                  }
                }, function(err, info) {
                  if (err) {
                    console.log("Error uploading data: ", perr);
                  } else {
                    Id = null;
                  }
                })
              } else {
                var data_uri_prefix = "data:" + "image/png" + ";base64,";
                var image = body.toString('base64');

                image = data_uri_prefix + image;

                aws.config.update({
                  accessKeyId: AWS_ACCESS_KEY,
                  secretAccessKey: AWS_SECRET_KEY
                });
                var s3 = new aws.S3();
                var key = name + "_t.png";
                image.resize(50, 50, function(err, image) {
                  var buf = new Buffer(image.replace(/^data:image\/\w+;base64,/, ""), 'base64');
                  var params = {
                    Bucket: S3_BUCKET,
                    Key: key,
                    Body: buf,
                    ACL: 'public-read',
                    ContentType: 'image/png'
                  };

                  s3.putObject(params, function(perr, pres) {
                    if (err) {
                      console.log("Error uploading data: ", perr);
                    } else {
                      imagethumb.update({
                        _id: Id
                      }, {
                        $set: {
                          status: "completed"
                        }
                      }, function(err, info) {
                        if (err) {
                          console.log("Error uploading data: ", perr);
                        } else {
                          Id = null;
                        }
                      })
                    }
                  });
                })
              }
            });
          } catch (err) {
            console.log(err);
          }
        })
      }
    })
  } catch (err) {
    console.log(err);
  }
});
exports.addservice = function(url) {

  var Id = uuid.v1();
  var user = new imagethumb({
    _id: Id,
    imagethumbId: Id,
    url: url
  });
  try {
    user.save(function(err, add) {
      if (err) {
        //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });
        console.log(err);
      } else {

      }
    })
  } catch (err) {
    //log.error({"ip":ip,"userid":req.headers['userid'],"url":req.originalUrl,"user-agent":req.headers['user-agent'],"host":req.hostname,"method":req.method,"responseTime": new Date() - start });
    console.log(err);
  }
}
