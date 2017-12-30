/**
 * Created by Karthick Eswar K R on 18/10/2016.
 */
 var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var derivedunit = new Schema({
    _id: String,
        baseunit: {
          type:String,
          ref:'unit'
        },
        name:{
          type:String
        },
        factor:{
          type:Number
        },
        operation:{
          type:String
        },
        unit:{
          type:String
        },
      createdOn: {
        type: Date,
        "default": Date.now
    },
    updatedOn: {
        type: Date,
        "default": Date.now
    },
    status: {
        type: String,
        "default": "unverified",
    }
});
module.exports = mongoose.model('derivedunit', derivedunit);
