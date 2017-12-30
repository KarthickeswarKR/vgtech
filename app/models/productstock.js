var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var productstock = new Schema({
  _id: String,
  productstockId: String,
  productId: {
    type: String,
    ref: 'product',
    'alias': 'details'
  },
  stockareaId: {
    type: String,
    ref: 'stockarea'
  },
  source: {
    type: String,
    ref: 'stockarea'
  },
  unit: {
    type: String
  },
  collabrators: [{
    productstockId: {
      type: String,
      ref: 'productstock'
    },
    sellaccess:[{
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
    status: [{
      type: {
        type: String
      },
      token: {
        type: String
      },
      initiator: {
        type: String,
        ref: 'productstock'
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

  /*stockDetails:[{
    inStock: {
      type: Number,
      default: 0
    },
    incomingStock: {
      type: Number,
      default: 0
    },
    outgoingStock: {
      type: Number,
      default: 0
    },
    unit:{
      type:String
    }
  }],*/
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
  stockDetails:Schema.Types.Mixed
}, {
  strict: false
});
module.exports = mongoose.model('productstock', productstock);
