var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var package = new Schema({
  _id: String,
  packageId: String,
  name: {
    type: String
  },
  productId: {
    type: String
  },
  size: {
    type: Number
  },
  type: {
    type: String
  },
  shape: {
    type: String
  },
  unit: {
    type: String
  },
  createdOn: {
    type: Date,
    "default": Date.now
  },
  createdBy:{
    type:String
  },
  updatedOn: {
    type: Date,
    "default": Date.now
  },
  status: {
    type: Boolean,
    "default": false
  }
});
module.exports = mongoose.model('package', package);
