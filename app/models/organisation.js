/**
 * Created by Karthick Eswar K R on 18/10/2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var organisation = new Schema({
  _id: String,
  organisationId: String,
  organisationName: {
    type: String
  },
  userId: {
    type: String,
    ref:'Users'
  },
  stockareas:[{
    type:String,
    ref:'stockarea'
  }],
  collabrators: [{
    organisationId: {
      type: String,
      ref: 'organisation'
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
        ref: 'organisation'
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
    "default": 201
  }
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
module.exports = mongoose.model('organisation', organisation);
