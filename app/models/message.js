/**
 * Created by Karthick Eswar K R on 18/10/2016.
 */
 var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var message = new Schema({
    _id: String,
    initiator:{
      type:String,
      ref:'Users'
    },
    receiptent:[{
userId:{
      type:String,
      ref:'Users'
    },
    organisationId:{
      type:String,
      ref:'organisation'
    },
    status:{
      type:Number,
      default:201
    }
  }],
    initiatorOrganisation:{
      type:String,
      ref:'organisation'
    },
    receiptentOrganisation:{
      type:String,
      ref:'organisation'
    },
    message:{
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
    "default": 201
}
});
module.exports = mongoose.model('message', message);
