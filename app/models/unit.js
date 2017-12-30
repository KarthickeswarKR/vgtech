/**
 * Created by Karthick Eswar K R on 18/10/2016.
 */
 var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var unit = new Schema({
    _id: String,
    name: {
        type: String,
        required: true
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
module.exports = mongoose.model('unit', unit);
