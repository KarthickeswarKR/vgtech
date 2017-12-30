var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var sell = new Schema({
  _id: String,
  sellId: String,
  userId: {
    type: String,
    ref: 'Users'
  },
  location:{
       type: { type: String },
       coordinates:{
         type:Array
       }
   },
   unit:{
     type:String
   },
  stockareaId: {
    type: String,
    ref: 'stockarea'
  },
  productstockId: {
    type: String,
    ref: 'productstock'
  },
  productId: {
    type: String,
    ref: 'product'
  },

  minimumQuantity: {
    type: String
  },
  cost: {
    type: Number
  },
  quantityAvailable: {
    type: String
  },
  createdOn: {
    type: Date,
    "default": Date.now
  },
  sellaccess:{
    type:Array,
    ref:'stockarea'
  },
  updatedOn: {
    type: Date,
    "default": Date.now
  },
  status: {
    type: Number,
    "default": 200
  },
  package: Schema.Types.Mixed
}, {
  strict: false
});
//sell.index({ "location": "2dsphere" });
module.exports = mongoose.model('sell', sell);
