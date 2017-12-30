/**
 * Created by Karthick Eswar K R on 18/10/2016.
 */
 var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var suggestproduct = new Schema({
    _id: String,
    materialId:{
      type:String,
      ref:'material'
    },
      specifications:Schema.Types.Mixed
    }, {strict: false});
module.exports = mongoose.model('suggestproduct', suggestproduct);
