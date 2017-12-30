/**
 * Created by Karthick Eswar K R on 18/10/2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var material = new Schema({
  _id: String,
  materialId: String,
  materialName: {
    type: String
  },
  type: {
    type: String
  },
  brandmaterial: [{
    type: String,
    ref: 'brandmaterial'
  }],
  otherName: [{
    type: String,
    index: true,
    text: true
  }],
  brands: [{
    brandId: {
      type: String,
      ref: 'brand'
    },
    packages: [{
      type: String,
      ref: 'package'
    }]
  }],

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
module.exports = mongoose.model('material', material);
