/**
 * Created by Karthick Eswar K R on 18/10/2016.
 */
var resHandler = require("../common/res-handler");
var commonService = require("../common/commonService.js");
var order = require('../models/order');
module.exports = {
    updateproducts: function(productId,orderId) {
return order.update({orderId:orderId},{$push:{products:productId}},{upsert:true},function(err,add){
        if(err){
console.log(err);        }
          else{
              productstockservice.addproductstock(productId,orderId).then(function(data){

                  console.log("success in ps");
return data;
              }, function (err) {
console.log(err);    })
    console.log("success");

          }

});
    }
};
