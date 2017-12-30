/**
 * Created by Karthick Eswar K R on 18/10/2016.
 */
 var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var buysell = new Schema({
    _id: String,
    buysellId:String,
    stockareaId:{
      type:String,
      ref:'stockarea'
    },
    destinationStockareaId:{
      type:String,
      ref:'stockarea'
    },
    actualDistance:{
      type:String
    },
    distance:Schema.Types.Mixed
    }, {strict: false});
module.exports = mongoose.model('buysell', buysell);
