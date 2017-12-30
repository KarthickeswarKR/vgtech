/**
 * Created by Karthick Eswar K R on 18/10/2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var stockarea = new Schema({
  _id: String,
  stockareaId: {
    type: String
  },
  userId: {
    type: String,
    ref: 'Users'
  },
  visiblity:{
    type:Number
  },
  primaryemail: {
    type: String
  },
  mobiles: [{
    mobile: {
      type: String
    },
    code: {
      type: String
    },
    status: {
      type: String,
      default: 'unverified'
    },
    type: {
      type: String,
      default: 1,
      ref: 'statuscode'
    }
  }],
  emails: [{
    email: {
      type: String
    },
    status: {
      type: String,
      default: 'unverified'
    },
    type: {
      type: String,
      default: 1,
      ref: 'statuscode'
    }
  }],
  address: {
    type: String
  },
  code: {
    type: String,
    default: "+91"
  },
  country: {
    type: String,
    default: "India"
  },
  stockareaName: {
    type: String,
    required: true
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  products: [{
    type: String,
    ref: 'productstock'
  }],
  createdOn: {
    type: Date,
    "default": Date.now
  },
  updatedOn: {
    type: Date,
    "default": Date.now
  },
  phone: {
    type: String
  },
  organisationId: {
    type: String,
    ref: 'organisation'
  },
  collabrators: [{
    stockareaId: {
      type: String,
      ref: 'stockarea'
    },
    status: [{
      type: {
        type: String
      },
      token: {
        type: String
      },
      initiator: {
        type: String,
        ref: 'stockarea'
      },
      createdOn: {
        type: Date,
        default: Date.now
      }
    }],
    role: {
      type: String
    }
  }],
  status: {
    type: Number,
    "default": 202
  },
});

module.exports = mongoose.model('stockarea', stockarea);
