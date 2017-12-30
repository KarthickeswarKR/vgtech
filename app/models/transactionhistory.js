var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var transactionhistory = new Schema({
    _id:String,
    userId:{
      type:String,
      ref:'Users'
    },
    stockareaId:{
      type:String,
      ref:'stockarea'
    },
  orderId:
  {
    type:String,
    ref:'order'
  },
  productstockId:{
    type:String,
    ref:'productstock'
  },
  productId:{
    type:String,
    ref:'product'
  },

  destinationStockareaId:{
    type:String,
    ref:'stockarea'
  },
  sellId:{
    type:String,
    ref:'sell'
  },
  message:{
    type:String
  },
  type:{
    type:String
  },
  statusDescription:{
    type:String
  },
  statusCode:{
    type:String,
    ref:'statuscode'
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
      type: String
  },
  history:[Schema.Types.Mixed]
  }, {strict: false});
module.exports = mongoose.model('transactionhistory', transactionhistory);
