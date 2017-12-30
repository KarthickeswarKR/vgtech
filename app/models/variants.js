/**
 * Created by Karthick Eswar K R on 18/10/2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var variants = new Schema({
  _id: String,
  variantId: String,
  variantName: {
    type: String,
    index: true,
    text: true
  },
  type: {
    type: String
  },
  materialId: {
    type: String,
    ref: 'material'
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
    type: Number,
    "default": 200
  },
  specifications: Schema.Types.Mixed
}, {
  strict: false
});
/*grades:[
  {
    id:String,
    name:{
      type:String
    }
  }
],
type:[
  {id:String,
    name:{
      type:String
    }
  }
]
*/
module.exports = mongoose.model('variants', variants);
