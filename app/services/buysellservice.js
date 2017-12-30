var express = require('express');
var buysell = require('../models/buysell.js');
var uuid = require("node-uuid");
var config = require('../config/config');
var buysellservice = require('../services/buysellservice.js');
var distance = require('google-distance');
distance.apiKey = 'AIzaSyAgdp-bCCURd1QiGrNsplEOLo68b_FfflY';
var resHandler = require("../common/res-handler");
var stockarea = require('../models/stockarea');
var commonService = require("../common/commonService.js");
var schedule = require('node-schedule');
var request = require('request');
var GeoPoint = require('geopoint');
var j = schedule.scheduleJob("1* * * * *", function() {

  try {

    stockarea.find({
      status: config.get("status:stockarea:active:FindingDistance")
    }, function(err, data) {
      if (err) {
        console.log(err);
      } else if (data == null || data == [] || data == undefined) {
        console.log("empty");
      } else {
        data.forEach(function(item) {
          var stockareaId = item.stockareaId;
          var sourcelat = item.latitude;
          var sourcelng = item.longitude;
          try {
            stockarea.find({}).exec(function(err, data) {
              if (err) {
                console.log(err);
              } else if (data == null || data == [] || data == undefined) {
                console.log("empty");
              } else {
                data.forEach(function(item) {
                  buysellservice.addbuysell(stockareaId, sourcelat, sourcelng, item._id, item.latitude, item.longitude);
                })
              }
            })
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
exports.getinfo = function(req, res, item) {
  var info = buysell.findOne({
    $or: [{
      stockareaId: req.query.stockareaId,
      destinationStockareaId: item._id
    }, {
      stockareaId: item._id,
      destinationStockareaId: req.query.stockareaId
    }]
  }).exec(function(err, data) {
    return data;
  });
  return info;
}
exports.addbuysell = function(stockareaId, sourcelat, sourcelng, destinationStockareaId, deslat, deslng) {
  try {
    console.log("in buy selllll");
    console.log(deslat + "        " + deslng);
    buysell.findOne({
      stockareaId: stockareaId,
      destinationStockareaId: destinationStockareaId
    }).exec(function(err, data) {
      console.log("data");
      console.log(data);
      if (err) {
        console.log(err);
      } else if (data == null || data == [] || data == undefined) {
        /*  var o=sourcelat+","+sourcelng;
          var d=deslat+","+deslng;
            console.log(o);
            console.log(d);
            var url="https://maps.googleapis.com/maps/api/distancematrix/json?origins="+o+"&destinations="+d+"&key=AIzaSyAgdp-bCCURd1QiGrNsplEOLo68b_FfflY"
            request(url,function(err,response,data) {
              var dist=JSON.parse(data);

        if(err){
          console.log(err);
        }

        else{
          console.log("response");
          console.log(data);
          console.log("in sucessssssssssssssss");*/
          try{
            console.log(sourcelat);
            console.log(sourcelng);
        point1 = new GeoPoint(sourcelat, sourcelng);
        point2 = new GeoPoint(deslat, deslng);
        var d = point1.distanceTo(point2, true);
        var buysellId = uuid.v1();
        var dm = new buysell({
          _id: buysellId,
          stockareaId: stockareaId,
          destinationStockareaId: destinationStockareaId,
          //  distance:dist,
          actualDistance: d
        });
        dm.save(function(err, add) {
          if (err) {
            console.log(err);
          } else {
            try {
              stockarea.update({
                _id: stockareaId,
                status: config.get("status:stockarea:active:FindingDistance")
              }, {
                $set: {
                  status: config.get("status:stockarea:active:created")
                }
              }, {
                upsert: true
              }, function(err, data) {
                if (err) {
                  console.log(err);
                } else if (data == null || data == [] || data == undefined) {
                  console.log("empty")
                } else {
                  console.log("success");

                }
              })
            } catch (err) {
              console.log(err);
            }
          }
        });
      }catch(e){
        console.log(e);
      }
      } else {
        point1 = new GeoPoint(sourcelat, sourcelng);
        point2 = new GeoPoint(deslat, deslng);
        var d = point1.distanceTo(point2, true);

        buysell.update({
          stockareaId: stockareaId,
          destinationStockareaId: destinationStockareaId
        }, {
          $set: {
            actualDistance: d
          }
        }, {
          upsert: true
        }, function(err, add) {
          if (err) {
            console.log(err);
          } else {
            try {
              stockarea.update({
                _id: stockareaId,
                status: config.get("status:stockarea:active:FindingDistance")
              }, {
                $set: {
                  status: config.get("status:stockarea:active:created")
                }
              }, {
                upsert: true
              }, function(err, data) {
                if (err) {
                  console.log(err);
                } else if (data == null || data == [] || data == undefined) {
                  console.log("empty")
                } else {
                  console.log("success");

                }
              })
            } catch (err) {
              console.log(err);
            }
          }
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
}
