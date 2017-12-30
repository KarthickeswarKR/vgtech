/**
 * Created by Karthick Eswar K R on 18/10/2016.
 */
 var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var imagethumb = new Schema({
    _id: String,
    imagethumbId:String,
    url:{
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
    "default": "progress"
}
});
module.exports = mongoose.model('imagethumb', imagethumb);
