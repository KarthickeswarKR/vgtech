/**
 * Created by Karthick Eswar K R on 18/10/2016.
 */
 var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var masternotification = new Schema({
    _id: String,
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
}
});
module.exports = mongoose.model('masternotification', masternotification);
