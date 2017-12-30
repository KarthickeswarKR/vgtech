/**
 * Created by Karthick Eswar K R on 18/10/2016.
 */
 var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var notification = new Schema({
    _id: String,
    userId:{
      type:String,
      ref:'Users'
    },
    receiptent:{
      type:String,
      ref:'Users'
    },
    initiatorStockareaId:{
      type:String,
      ref:'stockarea'
    },
    receiptentStockareaId:{
      type:String,
      ref:'stockarea'
    },
    initiatorOrganisationId:{
      type:String,
      ref:'productstock'
    },
    receiptentOrganisationId:{
      type:String,
      ref:'productstock'
    },
    masterId:{
      type:String,
      ref:'masterNotification'
    },
    message:{
      type:String
    },
    type:{
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
module.exports = mongoose.model('notification', notification);
