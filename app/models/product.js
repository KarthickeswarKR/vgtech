var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var product = new Schema({
  _id: String,
  productId: String,
  productName: {
    type: String
  },
  categoryId: {
    type: String,
    ref: 'category'
  },
  likes: [{
    userId: {
      type: String,
      ref: 'Users'
    }
  }],
  brandId: {
    type: String,
    ref: 'product'
  },
  ownedBy: {
    type: String,
    ref: 'organisation'
  },
  collabrators: [{
    type: String
  }],
  sellaccess: [{
    type: String,
    ref:'stockarea'
  }],
  type: {
    type: String
  },
  createdBy: {
    type: String,
    ref: 'Users'
  },
  images: {
    type: Array
  },
  materialId: {
    type: String,
    ref: 'material'
  },
  primaryImage: {
    type: String
  },
  variantId: {
    type: String,
    ref: 'variants'
  },
  productDescription: {
    type: String
  },
  unit: {
    type: String,
    ref: 'unit'
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
  specifications: Schema.Types.Mixed,
  links: Schema.Types.Mixed,
  completeInfo: Schema.Types.Mixed,
  package: Schema.Types.Mixed
}, {
  strict: false
});
module.exports = mongoose.model('product', product);
