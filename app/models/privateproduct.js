var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var privateproduct = new Schema({
  _id: String,
  productId: String,
  productName: {
    type: String
  },
  productOwner: {
    type: String,
    ref: 'organisation'
  },
  userId: {
    type: String,
    ref: 'Users'
  },
  categoryId: {
    type: String,
    ref: 'category'
  },
  brandId: {
    type: String,
    ref: 'brand'
  },
  manufacturer: {
    type: String
  },
  type: {
    type: String
  },
  unit: {
    type: String,
    ref: 'unit'
  },
  createdBy: {
    type: String,
    ref: 'Users'
  },
  createdOn: {
    type: Date,
    "default": Date.now
  },
  primaryImage: {
    type: String
  },
  updatedOn: {
    type: Date,
    "default": Date.now
  },
  status: {
    type: String,
    "default": "active"
  },
  specifications: Schema.Types.Mixed,
  images: Schema.Types.Mixed
}, {
  strict: false
});
module.exports = mongoose.model('privateproduct', privateproduct);
