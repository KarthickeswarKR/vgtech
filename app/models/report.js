/**
 * Created by Karthick Eswar K R on 18/10/2016.
 */
 var mongoose = require('mongoose'),
	Schema = mongoose.Schema,

	report = new Schema({
		productId: {
			type: String
  		},
message:{
  type:String
},
createdOn:{
  type:Date,
  default:Date.now
}
	});

module.exports = mongoose.model('report', report);
