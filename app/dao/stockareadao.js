/**
 * Created by Karthick Eswar K R on 18/10/2016.
 */
var resHandler = require("../common/res-handler");
var commonService = require("../common/commonService.js");
var productstockservice=require('../services/productstockservice');

var stockarea = require('../models/stockarea');
module.exports = {
    updateproducts: function(productId,stockareaId) {

return productstockservice.addproductstock(productId,stockareaId).then(function(data){


  return data;

});
    },
    updatemail : function(req, res,stockareaId,email) {
    var info=stockarea.update({_id:stockareaId},{$push:{emails:{email:email}}},{upsert:true},function(err,data){
      if(err){
        commonService.error(res,err.message,{code:"362"});
      }
      else{
    return data;
      }
    })
    return info;
    }
};
