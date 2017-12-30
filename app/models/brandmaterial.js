/**
 * Created by Karthick Eswar K R on 18/10/2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var brandmaterial = new Schema({
  _id: String,
  likeId: String,
  materialId: {
    type: String,
    ref: 'material'
  },
  likes: [{
    userId: {
      type: String,
      ref: 'Users'
    }
  }],
  reviews: [{
    userId: {
      type: String,
      ref: 'Users'
    },
    rating: {
      type: Number
    },
    message: {
      type: String
    },
    createdOn: {
      type: Date,
      "default": Date.now
    }
  }],
  brandId: {
    type: String,
    ref: 'brand'
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
  }
});
module.exports = mongoose.model('brandmaterial', brandmaterial);
