'use strict';

/**
 *@Author Rajasekar
 *
 * @Description Dashboard service
 */


vgApp.factory('dashboardService', ['$http', function($http) {

  var sdo = {
    isAuthenticated: function() {
      var promise = $http({
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          'userId': localStorage.getItem('userId'),
          'access_token': localStorage.getItem('access_token')
        },
        url: domainURL + 'api/token/checktoken'
      }).then(function(data) {
        return data
      }, function(data) {
        return data;
      });
      return promise;
    },
    addpackage: function(data) {

      var promise = $http({
        url: domainURL + 'api/secured/package/addpackage',
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        data: data

      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });


      return promise;
    },
    deletepackage: function(data) {

      var promise = $http({
        url: domainURL + 'api/secured/package/deletepackage',
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        data: data

      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });


      return promise;
    },
    suggestpackage: function(data) {

      var promise = $http({
        url: domainURL + 'api/secured/package/suggestpackage',
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        data: data

      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });


      return promise;
    },
    category: function() {
      var promise = $http({
        url: domainURL + 'api/secured/unit/category',
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        },
      }).then(function(data) {

        return data;

      }, function(err) {
        return err;
      });
      return promise;
    },
    updatestockareavisiblity: function(id) {
      var promise = $http({
        url: domainURL + 'api/secured/stockarea/updatevisiblity',
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        data:{
          visiblity:id
        }
      }).then(function(data) {

        return data;

      }, function(err) {
        return err;
      });
      return promise;
    },
    addcategory: function(name,description) {
      var promise = $http({
        url: domainURL + 'api/secured/unit/addcategory',
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        data:{
          categoryname:name,
          categorydescription:description
        }
      }).then(function(data) {

        return data;

      }, function(err) {
        return err;
      });
      return promise;
    },
    addreport: function(Id,description) {
      var promise = $http({
        url: domainURL + 'api/secured/report/addreport',
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        data:{
          productId:Id,
          message:description
        }
      }).then(function(data) {

        return data;

      }, function(err) {
        return err;
      });
      return promise;
    },

    types: function() {
      var promise = $http({
        url: domainURL + 'api/secured/unit/types',
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        },
      }).then(function(data) {

        return data;

      }, function(err) {
        return err;
      });
      return promise;
    },
    stockareatypes: function() {
      var promise = $http({
        url: domainURL + 'api/secured/unit/stockareatypes',
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        },
      }).then(function(data) {

        return data;

      }, function(err) {
        return err;
      });
      return promise;
    },
    units: function() {
      var promise = $http({
        url: domainURL + 'api/secured/unit/units',
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        },
      }).then(function(data) {

        return data;

      }, function(err) {
        return err;
      });
      return promise;
    },
    derivedunits: function() {
      var promise = $http({
        url: domainURL + 'api/secured/unit/derivedunits',
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        },
      }).then(function(data) {

        return data;

      }, function(err) {
        return err;
      });
      return promise;
    },
    getsellbystockareaId: function(productid, stockareaId) {
      var promise = $http({
        url: domainURL + 'api/secured/authorize/sell/getsellbystockareaId?stockareaId=' + stockareaId + '&productId=' + productid,
        method: "get",
        headers: {
          'Content-Type': 'application/json'
        },

      }).then(function(data) {
        return data;

      }, function(err) {
        return err;

      });
      return promise;
    },
    getnotification: function() {
      var promise = $http({
        url: domainURL + 'api/secured/authorize/notification/getinfo',
        method: "get",
        headers: {
          'Content-Type': 'application/json'
        },

      }).then(function(data) {
        return data;

      }, function(err) {
        return err;

      });
      return promise;
    },
    getmessages: function() {
      var promise = $http({
        url: domainURL + 'api/secured/authorize/message/getinfo',
        method: "get",
        headers: {
          'Content-Type': 'application/json'
        },

      }).then(function(data) {
        return data;

      }, function(err) {
        return err;

      });
      return promise;
    },
    updatemessage: function() {
      var promise = $http({
        url: domainURL + 'api/secured/authorize/message/update',
        method: "post",
        headers: {
          'Content-Type': 'application/json'
        },

      }).then(function(data) {
        return data;

      }, function(err) {
        return err;

      });
      return promise;
    },
    addmessage: function(message,to) {
      var promise = $http({
        url: domainURL + 'api/secured/authorize/message/addmessage',
        method: "post",
        headers: {
          'Content-Type': 'application/json'
        },
        data:{
          "message":message,
          "to":to
        }
      }).then(function(data) {
        return data;

      }, function(err) {
        return err;

      });
      return promise;
    },
    updatenotification: function(id) {
      var promise = $http({
        url: domainURL + 'api/secured/authorize/notification/updatenotification',
        method: "post",
        headers: {
          'Content-Type': 'application/json'
        },
        data:{
          Id:id
        }
      }).then(function(data) {
        return data;

      }, function(err) {
        return err;

      });
      return promise;
    },
    getbrands: function(brandId,term) {
      var promise = $http({
        url: domainURL + 'api/brand/autocomplete?term=' +term,
        method: "get",
        headers: {
          'Content-Type': 'application/json'
        },

      }).then(function(data) {
        return data;

      }, function(err) {
        return err;

      });
      return promise;
    },

    getuserorginfo: function(name) {
      var promise = $http({
        url: domainURL + 'api/secured/authorize/organisation/getuserorginfo?term=' + name,
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          "term": name
        }
      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },
    checkorgname: function(name) {
      var promise = $http({
        url: domainURL + 'api/secured/authorize/organisation/checkorganisation?term=' + name,
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          "term": name
        }
      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },
    getbrandmaterialinfo: function(materialId, brandId) {
      var promise = $http({
        url: domainURL + 'api/secured/authorize/brandmaterial/getinfo?materialId=' + materialId + '&brandId=' + brandId,
        method: "get",
        headers: {
          'Content-Type': 'application/json'
        }

      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },
    addproductlike: function(productId) {
      var promise = $http({
        url: domainURL + 'api/secured/authorize/products/like',
        method: "post",
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          'productId': productId
                }

      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },
    removeproductlike: function(productId) {
      var promise = $http({
        url: domainURL + 'api/secured/authorize/products/unlike',
        method: "post",
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
        productId:productId
        }

      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },
    addreview: function(materialId, brandId, review, message) {
      var promise = $http({
        url: domainURL + 'api/secured/authorize/brandmaterial/addreview',
        method: "post",
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          'materialId': materialId,
          'brandId': brandId,
          'message': message,
          'review': review
        }

      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },
    getstockareainfo: function(stockareaId) {
      var promise = $http({
        url: domainURL + 'api/secured/authorize/stockarea/getstockareainfo?stockareaId=' + stockareaId,
        method: "get",
        headers: {
          'Content-Type': 'application/json'
        }

      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },
    getallstockareas: function() {
      var promise = $http({
        url: domainURL + 'api/secured/authorize/stockarea/getallstockareasofuser',
        method: "get",
        headers: {
          'Content-Type': 'application/json'
        }

      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },

    getProductProfile: function(stockareaName, productName) {
      var promise = $http({
        url: domainURL + 'api/productstock/getuserstockinfo?stockareaName=' + stockareaName + '&productName=' + productName,
        method: "get",
        headers: {
          'Content-Type': 'application/json'
        }

      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },
    updatesource: function(stockareaId,productId,sourceId) {
      var promise = $http({
        url: domainURL + 'api/secured/authorize/productstock/updatesource',
        method: "post",
        headers: {
          'Content-Type': 'application/json'
        },data:{
          stockareaId:stockareaId,
          productId:productId,
          sourceId:sourceId
        }
      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },

    codes: function() {
      var promise = $http({
        url: domainURL + 'api/secured/users/getcodes',
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },
    phonechange: function(no) {
      var promise = $http({
        url: domainURL + 'api/secured/users/checkphone',
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          "term": no
        }
      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },
    getUserDetails: function() {
      var promise = $http({
        url: domainURL + 'api/secured/users/getuser',
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(function(data) {

        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },

    checkname: function(name) {
      var promise = $http({
        url: domainURL + 'api/secured/authorize/stockarea/checkstockarea',
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          "term": name
        }
      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },
    // Service for getting stockarea
    getStockArea: function(Id) {

      var promise = $http({
        url: domainURL + 'api/secured/authorize/stockarea/getallstockareasofuser?orgId=' + Id,
        method: "GET",
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }

      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });

      return promise;
    },
    getorganisation: function(Id) {

      var promise = $http({
        url: domainURL + 'api/secured/authorize/organisation/getorganisation?orgId=' + Id,
        method: "GET",
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }

      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });

      return promise;
    },
    deletecollabrator: function(stockareaId,productId) {

      var promise = $http({
        url: domainURL + 'api/secured/authorize/organisation/deletecollabrator?stockareaId=' + stockareaId+'&productId='+productId,
        method: "GET",
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }

      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });

      return promise;
    },
    collabrator: function(data) {
      var promise = $http({
        url: domainURL + 'api/organisation/collabrator',
        method: "post",
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          token: data
        }
      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },
    ignore: function(data) {
      var promise = $http({
        url: domainURL + 'api/organisation/ignorecollabrator',
        method: "post",
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          token: data
        }
      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },


    addcollabrator: function(orgId, organisationId,stockareaId,productId,initiatorproductstockId,productstockId) {

      var promise = $http({
        url: domainURL + 'api/secured/authorize/organisation/addcollabrator',
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          orgId: orgId,
          organisationId: organisationId,
          stockareaId:stockareaId,
          productId:productId,
          initiatorproductstockId:initiatorproductstockId,
          productstockId:productstockId
        }

      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });

      return promise;
    },
    addorg: function(name, Id) {

      var promise = $http({
        url: domainURL + 'api/secured/authorize/organisation/addorganisation',
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          organisationName: name,
          organisationId: Id
        }

      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });

      return promise;
    },
    updateorg: function(Id, name, sin) {
      var promise = $http({
        url: domainURL + 'api/secured/authorize/organisation/updateorganisation',
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          organisationId: Id,
          organisationName: name,
          sin: sin
        }

      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });

      return promise;
    },
    geturl: function() {
      var promise = $http({
        url: domainURL + 'api/secured/users/geturl',
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },

    brand: function(name) {
      var promise = $http({
        url: domainURL + 'api/secured/authorize/brand/Id',
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          "name": name
        }
      }).then(function(data) {

        return data;

      }, function(err) {
        return err;
      });
      return promise;
    },
    brandinfo: function(info) {
      var promise = $http({
        url: domainURL + 'api/secured/authorize/brand/brandinfo?brandId='+info,
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(function(data) {

        return data;

      }, function(err) {
        return err;
      });
      return promise;
    },

    getStockAreaProducts: function(userId, stockareaId) {
      var promise = $http({
        url: domainURL + 'api/secured/authorize/stockarea/getproductsofstockarea?userId=' + userId + '&stockareaId=' + stockareaId,
        ContentType: 'application/x-www-form-urlencoded',
        method: "GET",
        dataType: 'json'

      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });

      return promise;
    },

    getprivateproducts: function() {
      var promise = $http({
        url: domainURL + 'api/secured/authorize/products/getprivateproducts',
        ContentType: 'application/x-www-form-urlencoded',
        method: "GET",
        dataType: 'json'

      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });

      return promise;
    },
    /*		getOrderHistory : function(stockareaId) {
    			var promise = $http({
    				url : domainURL + 'api/orders/getordersofstockarea',
    				method : "GET",
    				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    	            transformRequest: function(obj) {
    	                var str = [];
    	                for(var p in obj)
    	                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    	                return str.join("&");
    	            },
    	            data : {
    					"stockareaId":stockareaId
    				}
    			}).then(function(data) {
    				return data;
    			},function(data){
    				return data;
    			});
    			return promise;
    		},*/
    addProductsToStcokarea: function(stockareaId, products) {
      var data1 = {
        "stockareaId": stockareaId,
        "products": products
      };
      var promise = $http({
        url: domainURL + 'api/secured/authorize/stockarea/updateproducts',
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          "stockareaId": stockareaId,
          "products": products
        }

      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });

      return promise;
    },
    postAddStockarea: function(data) {

      var promise = $http({
        url: domainURL + 'api/secured/authorize/stockarea/addstockarea',
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        data: data

      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });

      return promise;
    },
    updatestockarea: function(data) {

      var promise = $http({
        url: domainURL + 'api/secured/authorize/stockarea/updatestockarea',
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        data: data

      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });

      return promise;
    },

    addSell: function(data) {

      var promise = $http({
        url: domainURL + 'api/secured/authorize/sell/addsell',
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        data: data

      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });


      return promise;
    },
    registerUser: function(data) {
      var promise = $http({
        url: domainURL + 'api/users/addUser',
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        data: data
      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },
    forgotPassword: function(data) {
      var promise = $http({
        url: domainURL + 'api/users/resetPassword',
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        data: data
      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },
    verifyToken: function(token) {
      var promise = $http({
        url: domainURL + 'api/users/onVerifyAction',
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        },
        params: {
          "token": token
        }
      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },
    deleteStockarea: function(stockareaId) {
      var promise = $http({
        url: domainURL + 'api/secured/authorize/stockarea/delete',
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          "stockareaId": stockareaId
        }
      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },
    mapInfo: function(productid, stockareaid, position) {
      var promise = $http({
        url: domainURL + 'api/secured/authorize/orders/getdestinationsforproduct',
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        ignoreLoadingBar: true,
data:{
  'stockareaId': stockareaid ,
  'productId' : productid,
  'position' : position
}
      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },
    productInfo: function(productid, stockareaid) {
      var promise = $http({
        url: domainURL + 'api/secured/authorize/products/getproductinfobyid?productId=' + productid,
        method: "get",
        headers: {
          'Content-Type': 'application/json'
        },

      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },
    getProductStockInfo: function(productid, stockareaid) {
      var promise = $http({
        url: domainURL + 'api/secured/authorize/productstock/getproductstockinfo?stockareaId=' + stockareaid + '&productId=' + productid,
        method: "get",
        headers: {
          'Content-Type': 'application/json'
        },

      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },

    movetovg: function(productid) {
      var promise = $http({
        url: domainURL + 'api/secured/authorize/products/movetovg?productId='+ productid,
        method: "get",
        headers: {
          'Content-Type': 'application/json'
        },

      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },

    getProductSellInfo: function(productid, stockareaid) {
      var promise = $http({
        url: domainURL + 'api/secured/authorize/productstock/getsellinfo?stockareaId=' + stockareaid + '&productId=' + productid,
        method: "get",
        headers: {
          'Content-Type': 'application/json'
        },

      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },
    getsell: function(productid, productstockId) {
      var promise = $http({
        url: domainURL + 'api/secured/authorize/sell/getsell?productstockId=' + productstockId + '&productId=' + productid,
        method: "get",
        headers: {
          'Content-Type': 'application/json'
        },

      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },
    stockareaInfo: function(stockareaid) {
      var promise = $http({
        url: domainURL + 'api/secured/authorize/stockarea/getstockarea?userId=' + localStorage.getItem('userId') + '&stockareaId=' + stockareaid,
        method: "get",
        headers: {
          'Content-Type': 'application/json'
        },

      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },

    getSearchProductsbycategory: function(id) {
      var promise = $http({
        url: domainURL + 'api/secured/authorize/products/getSearchProductsbycategory?id=' + id,
        method: "get",
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },

    addproduct: function(
      productname,
      productcategory,
      producttype,
      productdescription,
      productbrand,
      orgId, pics, packages, spec, material, newvariant) {
      var url = domainURL + 'api/secured/authorize/products/addproduct'
      var promise = $http({
        url: url,
        method: "post",
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          productname: productname,
          productcategory: productcategory,
          producttype: producttype,
          productdescription: productdescription,
          productbrand: productbrand,
          orgId: orgId,
          pics: pics,
          packages: packages,
          specifications: spec,
          links: material,
          newvariant: newvariant
        }
      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },
    addbrand: function(
      brandname,
      brandowner,
      brandtype,
      branddescription,pic) {
      var url = domainURL + 'api/secured/authorize/brand/addbrand'
      var promise = $http({
        url: url,
        method: "post",
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          brandname: brandname,
          brandowner: brandowner,
          brandtype: brandtype,
          branddescription: branddescription,
          logo: pic
        }
      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },
    updatebrand: function(brandId,
      brandname,
      branddescription,pic) {
      var url = domainURL + 'api/secured/authorize/brand/editbrand'
      var promise = $http({
        url: url,
        method: "post",
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          brandId:brandId,
          brandname: brandname,
          branddescription: branddescription,
          logo: pic
        }
      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },
    updateproduct: function(productId,
      productname,
      productcategory,
      producttype,
      productdescription,brand, pics, spec,links) {
      var url = domainURL + 'api/secured/authorize/products/updateproduct'
      var promise = $http({
        url: url,
        method: "post",
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          productId: productId,
          productname: productname,
          productcategory: productcategory,
          producttype: producttype,
          productdescription: productdescription,
          pics: pics,
          brand:brand,
          specifications: spec,
          links:links
        }
      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },

    getSearchProductsInfo: function(data) {
      var url = domainURL + 'api/secured/authorize/products/getproducts'
      var promise = $http({
        url: url,
        method: "get",
        headers: {
          'Content-Type': 'application/json'
        },
        params: data
      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },
    getSearchBrandsInfo: function(data) {
      var url = domainURL + 'api/secured/authorize/brand/getbrands'
      var promise = $http({
        url: url,
        method: "get",
        headers: {
          'Content-Type': 'application/json'
        },
        params: data
      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },
    logout: function(userId, access_token) {
      var promise = $http({
        url: domainURL + 'api/secured/token/logout',
        method: "get",
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          "userId": userId,
          "access_token": access_token
        }
      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },


    deleteProduct: function(stockareaId, productId) {
      var promise = $http({
        url: domainURL + 'api/secured/authorize/stockarea/deleteproduct',
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          "stockareaId": stockareaId,
          "productId": productId
        }
      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },
    renameStockarea: function(renameStockareaValue, stockareaId) {
      var promise = $http({
        url: domainURL + 'api/secured/authorize/stockarea/rename',
        method: "post",
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          "stockareaId": stockareaId,
          "stockareaName": renameStockareaValue
        }
      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    },
    updatePassword: function(data) {
      var promise = $http({
        url: domainURL + 'api/secured/users/updatePassword',
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        data: data
      }).then(function(data) {
        return data;

      }, function(data) {
        return data;

      });
      return promise;
    }
  };
  return sdo;
}]);
