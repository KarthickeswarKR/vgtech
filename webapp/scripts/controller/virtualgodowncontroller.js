
vgApp.controller('vgController', ['$scope', 'dashboardService', '$timeout', 'Notification', '$http', '$rootScope', '$state','$stateParams', function($scope, dashboardService, $timeout, Notification, $http, $rootScope, $state,$stateParams) {
  $rootScope.leftab = 1;
  $scope.myInterval = 3000;
  $scope.productsSearch = [];
  $scope.currentSliderIndex = 0;
  $scope.firstRate = 0;
  var data={
    term:" "
  }
    $scope.editproduct = function(productid) {
      $state.go('home.editproduct', {
      productId: productid
    });
  }
  $scope.deletepackage=function(productId,id){
    var data={"packageId":id}
    dashboardService.deletepackage(data).then(function(resp){
      Notification.success("package seleted successfully")
      $scope.getSearchProducts(productId,null);
    },function(err){
      Notification.error("error deleting package");
    })
  }

$scope.movetovg=function(Id){
  dashboardService.movetovg(Id).then(function(rep){
    Notification.success("product successfully moved to Virtualgodown");
  },function(err){
    Notification.error("error adding product to vg");
  })
}
   $scope.editbrand = function(brandid) {
      $state.go('home.editbrand', {
        brandId: brandid
      });
    }
  $scope.subtab11 = function() {
    document.getElementById('searchresult').style.display = 'none';
    $scope.subtab1 = 1;
    $scope.selectedtab11 = 'active';
    $scope.selectedtab12 = 'inactive';
    $scope.selectedtab13 = 'inactive';
  };
  $scope.subtab12 = function() {
    $scope.search = null;
    $scope.subtab1 = 2;
    $scope.selectedtab11 = 'inactive';
    $scope.selectedtab12 = 'active';
    $scope.selectedtab13 = 'inactive';
  }
  $scope.addproductlike = function(productId) {
    dashboardService.addproductlike(productId).then(function(response) {
      $scope.getSearchProducts(null,$scope.search);
    }, function(error) {
      Notification.error("brandmaterial error");
    });
  };
  $scope.removeproductlike = function(productId) {
    dashboardService.removeproductlike(productId).then(function(response) {
     $scope.getSearchProducts(null,$scope.search);
    }, function(error) {
      Notification.error("brandmaterial error");
    });
  };
    $scope.viewlikes = function(productId) {
      var datas = $scope.productsSearch;
      var info = false;
      for (var j = 0; j < datas.length; j++) {
        if (datas[j]._id == productId) {
          var likes = datas[j].likes;
          for (var k = 0; k < likes.length; k++) {
            if (likes[k].userId == localStorage.getItem('userId')) {
              info = true;
            }
          }
        }
      }
      return info;
    };
  $scope.getbrandmaterialinfo = function(materialId, brandId) {
    dashboardService.getbrandmaterialinfo(materialId, brandId).then(function(response) {
      $scope.materialinfo = response.data.data;
    }, function(error) {
      Notification.error("brandmaterial error");
    })
  }
  $scope.setBtn = function() {
    $('#imgScrollLeftBnt').hide();
    $('#imgScrollRightBnt').hide();
    var x = $('#imageList').scrollLeft();
    var y = 360;
    var z = $('#imageList')[0].scrollWidth;
    if (x > 0)
      $('#imgScrollLeftBnt').show();
    if (z > (x + y))
      $('#imgScrollRightBnt').show();
  }
  $scope.resize = function($event) {
    if (!$event || !$event.target || $event.target == undefined) {} else {
      $event.target.style.height = $event.target.scrollHeight + "px";
    }
  };
  $scope.setImgSrc1 = function(imgSrc) {
    $scope.imgSrc1 = imgSrc;
  }

  $scope.onenterkeyautocomplete = function(event) {
    if (event.which == 13) {
      $('#autocompletesearch').autocomplete('close');
      if($scope.searchtype=='product'){
      $scope.getSearchProducts(null, event.target.value);
    }else{
      $scope.getSearchBrands(null, event.target.value);
    }
    }
  };
  $scope.addProductsToStockarea = function(productid) {
    //$state.go("signUp2");
    var products = [];
    products.push(productid);
    if (!$scope.productInfo) {
      $scope.productInfo = {};
      $scope.productInfo.state = "ADDED";
    } else {
      $scope.productInfo.state = "ADDED";
    }
    for (var i = 0; i < $scope.productsSearch.length; i++) {
      if ($scope.productsSearch[i]._id == productid) {
        $scope.productsSearch[i].state = "ADDED"
      }
    }
    dashboardService.addProductsToStcokarea(localStorage.getItem('selectedStockareaId'), products).then(function(result) {
      Notification.success("Product added to " + localStorage.getItem('selectedStockareaName'))
      $scope.getStockAreaProductFn(localStorage.getItem('selectedStockareaId'));

    }, function(err) {
      Notification.error("error");
    });
  };

  $scope.getSearchProducts = function(productid, term) {
    document.getElementById('searchresult').style.display = 'block';
    if (productid == null) {
      var data = {
        term: term
      }
    } else {
      var data = {
        term: term,
        productId: productid
      }
    }
    dashboardService.getSearchProductsInfo(data).then(function(result) {
      if (result.data.data != null) {
        var productsSearch = result.data.data;
        var products = $scope.products;
        if($scope.products==null || $scope.products==undefined || !$scope.products){

        }else{
        for (var d = 0; d < productsSearch.length; d++) {
          for (var e = 0; e < products.length; e++) {
            if (productsSearch[d]._id == products[e].productId.productId) {
              productsSearch[d].state = "ADDED";
            }
          }
        }
      }
        $scope.productsSearch = productsSearch;
      } else {
        $scope.errorsearch = "No products";
      }
    }, function(error) {
      Notification.error('Product Info Not Available');
    });
  };
  $scope.getSearchBrands = function(brandId, term) {
    document.getElementById('searchresult').style.display = 'block';
    if (brandId == null) {
      var data = {
        term: term
      }
    } else {
      var data = {
        term: term,
        brandId: brandId
      }
    }
    dashboardService.getSearchBrandsInfo(data).then(function(result) {
      if (result.data.data != null) {
        var brandSearch = result.data.data;
        $scope.brandSearch = brandSearch;
      } else {
        $scope.errorsearch = "No products";
      }
    }, function(error) {
      Notification.error('Product Info Not Available');
    });
  };

  $scope.autocomplete = function() {
    if($scope.searchtype=='product'){
    $("#autocompletesearch").autocomplete({
      source: function(request, response) {
        $http({
          url: domainURL + 'api/secured/authorize/products/autocomplete',
          method: "GET",
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          },
          params: {
            term: request.term
          }
        }).then(function(data) {
          response($.map(data.data.data, function(item) {

            return {
              label: item.productName,
              value: item.productName,
              category: item.categoryId.name,
              productId: item.productId
            }
          }));

        });
      },
      minLength: 1,
      open: function() {},
      close: function() {

      },
      focus: function(event, ui) {

      },
      select: function(event, ui) {
        $scope.getSearchProducts(ui.item.productId, ui.item.value);
      }
    });
  }if($scope.searchtype=='brand'){
    $("#autocompletesearch").autocomplete({
      source: function(request, response) {
        $http({
          url: domainURL + 'api/brand/autocomplete',
          method: "GET",
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          },
          params: {
            term: request.term
          }
        }).then(function(data) {
          response($.map(data.data.data, function(item) {

            return {
              label: item.brandName,
              value: item.brandName,
              brandId: item._id
            }
          }));

        });
      },
      minLength: 1,
      open: function() {},
      close: function() {

      },
      focus: function(event, ui) {

      },
      select: function(event, ui) {
        $scope.getSearchBrands(ui.item.brandId, ui.item.value);
      }
    });
  }
  };
  $scope.height = function() {
    $scope.productsSearch = [];
    var height;
    var screenHeight = screen.height;
    screenHeight = window.innerHeight;
    if (screenHeight > (60 + 80 + 430 + 70)) {
      height = screenHeight - 60 - 80 - 70 - 20;
    //  document.getElementById("branddiv").style.height = height - (131) + 'px';
      //document.getElementById("productinfodiv").style.height = height - (131) + 'px';
      document.getElementById("searchresult").style.height = height + 'px';
    } else {
      height = 430;
  //    document.getElementById("branddiv").style.height = height - (131) + 'px';
      //document.getElementById("productinfodiv").style.height = height - (131) + 'px';
      document.getElementById("searchresult").style.height = height + 'px';
    }
    $scope.productsSearch=[];
    if(localStorage.getItem("access_token")){
      if($stateParams.productid){
        $scope.getSearchProducts($stateParams.productid, null);
      }

  }
  }
}]);
vgApp.controller('myorgController', ['$scope', 'dashboardService', '$timeout', 'Notification', '$http', '$rootScope', '$state', function($scope, dashboardService, $timeout, Notification, $http, $rootScope, $state) {
  $rootScope.leftab = 3;
  $scope.searchtype='product';
  $scope.productInfo = {};
  $scope.addproductlike = function(productId) {
    dashboardService.addproductlike(productId).then(function(response) {
      $scope.getSearchProducts(null,$scope.search);
    }, function(error) {
      Notification.error("brandmaterial error");
    });
  };
  $scope.removeproductlike = function(productId) {
    dashboardService.removeproductlike(productId).then(function(response) {
     $scope.getSearchProducts(null,$scope.search);
    }, function(error) {
      Notification.error("brandmaterial error");
    });
  };
    $scope.viewlikes = function(productId) {
      var datas = $scope.productsSearch;
      var info = false;
      for (var j = 0; j < datas.length; j++) {
        if (datas[j]._id == productId) {
          var likes = datas[j].likes;
          for (var k = 0; k < likes.length; k++) {
            if (likes[k].userId == localStorage.getItem('userId')) {
              info = true;
            }
          }
        }
      }
      return info;
    };

  $scope.subtab11 = function() {
    document.getElementById('searchresult').style.display = 'none';
    $scope.subtab1 = 1;
    $scope.selectedtab11 = 'active';
    $scope.selectedtab12 = 'inactive';
    $scope.selectedtab13 = 'inactive';
  };
  $scope.subtab12 = function() {
    $scope.subtab1 = 2;
    $scope.selectedtab11 = 'inactive';
    $scope.selectedtab12 = 'active';
    $scope.selectedtab13 = 'inactive';
  }
  $scope.addlike = function(materialId, brandId) {
    var mid = materialId;
    dashboardService.addlike($scope.materialinfo._id, brandId).then(function(response) {
      $scope.getbrandmaterialinfo($scope.materialinfo._id, brandId);
    }, function(error) {
      Notification.error("brandmaterial error");
    });
  };
  $scope.removelike = function(materialId, brandId) {
    var mid = materialId;
    dashboardService.removelike($scope.materialinfo._id, brandId).then(function(response) {
      $scope.getbrandmaterialinfo($scope.materialinfo._id, brandId);
    }, function(error) {
      Notification.error("brandmaterial error");
    });
  };
  /*$scope.addreview = function(materialId, brandId, message, firstRate) {
    var mid = materialId;
    dashboardService.addreview($scope.materialinfo._id, brandId, firstRate, message).then(function(response) {
      $scope.getbrandmaterialinfo($scope.materialinfo._id, brandId);
    }, function(error) {
      Notification.error("brandmaterial error");
    });
  };
  $scope.viewlikes = function(brandmaterialId, userid) {
    var datas = $scope.materialinfo.brandmaterial;
    var info = false;
    for (var j = 0; j < datas.length; j++) {
      if (datas[j]._id == brandmaterialId) {
        var likes = datas[j].likes;
        for (var k = 0; k < likes.length; k++) {
          if (likes[k].userId._id == localStorage.getItem('userId')) {
            info = true;
          }
        }
      }
    }
    return info;
  };
*/
  $scope.getbrandmaterialinfo = function(materialId, brandId) {
    dashboardService.getbrandmaterialinfo(materialId, brandId).then(function(response) {
      $scope.materialinfo = response.data.data;
    }, function(error) {
      Notification.error("brandmaterial error");
    })
  }
  $scope.setBtn = function() {
    $('#imgScrollLeftBnt').hide();
    $('#imgScrollRightBnt').hide();
    var x = $('#imageList').scrollLeft();
    var y = 360;
    var z = $('#imageList')[0].scrollWidth;
    if (x > 0)
      $('#imgScrollLeftBnt').show();
    if (z > (x + y))
      $('#imgScrollRightBnt').show();
  }
  $scope.resize = function($event) {
    if (!$event || !$event.target || $event.target == undefined) {} else {
      $event.target.style.height = $event.target.scrollHeight + "px";
    }
  };
  $scope.setImgSrc1 = function(imgSrc) {
    $scope.imgSrc1 = imgSrc;
  }

  $scope.onenterkeymyassetautocomplete = function(event) {
    if (event.which == 13) {
      $('#productautocompletesearch').autocomplete('close');
      $scope.getSearchProducts(null, event.target.value);
    }
  };
  $scope.addProductsToStockarea = function(productid) {
    var products = [];
    products.push(productid);
    if (!$scope.productInfo) {
      $scope.productInfo = {};
      $scope.productInfo.state = "ADDED";
    } else {
      $scope.productInfo.state = "ADDED";
    }
    for (var i = 0; i < $scope.productsSearch.length; i++) {
      if ($scope.productsSearch[i]._id == productid) {
        $scope.productsSearch[i].state = "ADDED"
      }
    }
    dashboardService.addProductsToStcokarea(localStorage.getItem('selectedStockareaId'), products).then(function(result) {
      Notification.success("Product added to " + localStorage.getItem('selectedStockareaName'))
      $scope.getStockAreaProductFn(localStorage.getItem('selectedStockareaId'));

    }, function(err) {
      Notification.error("error");
    });
  };

  $scope.getSearchProducts = function(productid, term) {
    document.getElementById('searchresult').style.display = 'block';
    if (productid == null) {
      var data = {
        term: term,
        type:'private'
      }
    } else {
      var data = {
        term: term,
        productId: productid,
        type:'private'
      }
    }
    dashboardService.getSearchProductsInfo(data).then(function(result) {
      if (result.data.data != null) {
        var productsSearch = result.data.data;
        var products = $scope.products;
        for (var d = 0; d < productsSearch.length; d++) {
          for (var e = 0; e < products.length; e++) {
            if (productsSearch[d]._id == products[e].productId.productId) {
              productsSearch[d].state = "ADDED";
            }
          }
        }
        $scope.productsSearch = productsSearch;
      } else {
        $scope.errorsearch = "No products";
      }
    }, function(error) {
      Notification.error('Product Info Not Available');
    });
  };

  $scope.productautocomplete = function() {
    $("#productautocompletesearch").autocomplete({
      source: function(request, response) {
        $http({
          url: domainURL + 'api/secured/authorize/products/autocomplete',
          method: "GET",
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          },
          params: {
            type: 'private',
            term: request.term
          }
        }).then(function(data) {
          response($.map(data.data.data, function(item) {

            return {
              label: item.productName,
              value: item.productName,
              productId: item.productId
            }
          }));

        });
      },
      minLength: 1,
      open: function() {},
      close: function() {

      },
      focus: function(event, ui) {

      },
      select: function(event, ui) {
          $scope.getSearchProducts(ui.item.productId, ui.item.value);
      }
    });
  };
  $scope.height = function() {
    var height;
    var screenHeight = screen.height;
    screenHeight = window.innerHeight;
    if (screenHeight > (60 + 80 + 430 + 70)) {
      height = screenHeight - 60 - 80 - 70 - 20;
      //document.getElementById("branddiv").style.height = height - (131) + 'px';
      //document.getElementById("productinfodiv").style.height = height - (131) + 'px';
      document.getElementById("searchresult").style.height = height + 'px';
//      document.getElementById("editproduct").style.height = height - (131) + 'px';
    } else {
      height = 430;
      //document.getElementById("branddiv").style.height = height - (131) + 'px';
      //document.getElementById("productinfodiv").style.height = height - (131) + 'px';
      document.getElementById("searchresult").style.height = height + 'px';
  //    document.getElementById("editproduct").style.height = height - (131) + 'px';

    }
    var data = {
      type: 'private',
      term:' '
    }

    dashboardService.getSearchProductsInfo(data).then(function(result) {
      if (result.data.data != null) {
        var productsSearch = result.data.data;
        var products = $scope.products;
        if($scope.products==null || $scope.products==undefined || !$scope.products){

        }else{
        for (var d = 0; d < productsSearch.length; d++) {
          for (var e = 0; e < products.length; e++) {
            if (productsSearch[d]._id == products[e].productId.productId) {
              productsSearch[d].state = "ADDED";
            }
          }
        }
      }
        $scope.productsSearch = productsSearch;
      } else {
        $scope.errorsearch = "No products";
      }
    }, function(error) {
      Notification.error('Product Info Not Available');
    });
  }
  $scope.pictures = [];

  $scope.updateproduct = function() {
    if ($scope.productimages.length == 0) {

    } else {
      for (var z = 0; z < $scope.productimages.length; z++) {
        if ($scope.productimages[z].img.indexOf('amazonaws') < -1) {
          $scope.uploadproductimg($scope.productimages[z].img, z);
        } else {
          $scope.pictures.push({
            "img": $scope.productimages[z].img
          })
        }
      }
    }
    $scope.spec = $scope.productdescription;
    dashboardService.updateproduct($scope.productId, $scope.productname, $scope.productcategory, $scope.producttype, $scope.productdescription, $scope.pictures, $scope.spec).then(function(response) {
      Notification.success("product updated successfully")
      //  $scope.productinfopageopen = ($scope.productId, $scope.productname, $scope.pictures, spec);
    }, function(err) {
      Notification.error("error updating product")
    })
  }
    $scope.uploadproductimg = function(img, z) {
    var end = z;
    dashboardService.geturl(img).then(function(data) {
      $scope.pictures.push({
        "img": data.data.url
      });
      var length = $scope.productimages.length - 1;
      $scope.urltoFile(img, data.data.name + '.jpg', 'image/jpeg')
        .then(function(file) {
          var buf = file;
          $.ajax({
            type: "PUT",
            data: buf,
            url: data.data.signed_request,
            processData: false,
            contentType: 'image/jpeg',
            success: function(data1) {}.bind(this),
            error: function(xhr, status, err) {}.bind(this)
          });
        })
    })
  }
  $scope.myCroppedImage = '';
  $scope.myFile = '';
  $('#fileInput').change(function() {
    $scope.newup = true;
  });
  $scope.uploadnewprofile = function() {
    $scope.newup = true;
  }

  $scope.uploadFile = function(file) {
    if (file) {
      // ng-img-crop
      var imageReader = new FileReader();
      imageReader.onload = function(image) {
        $scope.$apply(function($scope) {
          $scope.myImage = image.target.result;
        });
      };
      $scope.newup = true;
      imageReader.readAsDataURL(file);
    }
  };
  $scope.urltoFile = function(url, filename, mimeType) {
    return (fetch(url)
      .then(function(res) {
        return res.arrayBuffer();
      })
      .then(function(buf) {
        return new File([buf], filename, {
          type: mimeType
        });
      })
    );
  }
  $scope.productimages = [];
  $scope.uploadimg = function() {
    $('#imgScrollLeftBnt').show();
    $('#imgScrollRightBnt').show();
    $scope.productimages.push({
      img: $scope.myCroppedImage
    });
    $scope.newup = false;
  }
  $scope.deletepackage=function(productId,id){
    var data={"packageId":id}
    dashboardService.deletepackage(data).then(function(resp){
      Notification.success("package seleted successfully")
      $scope.getSearchProducts(productId,null);
    },function(err){
      Notification.error("error deleting package");
    })
  }


  $scope.addproductdescription = function() {
    $scope.productdescription.push({
      "key": "",
      "value": ""
    })
  }
  $scope.editproduct = function(productid) {
    $state.go('home.editproduct', {
    productId: productid
  });
}
  $scope.removeproductdescription = function() {
    $scope.productdescription.pop()
  }
  /*$scope.editproduct = function(productid) {
    $scope.productId = productid;
    $scope.subtab1 = 3;
    dashboardService.productInfo(productid).then(function(result) {
      $scope.productOwner = result.data.data.createdBy + "(" + result.data.data.ownedBy + ")";
      $scope.productname = result.data.data.productName;
      $scope.productcategory = result.data.data.categoryId;
      $scope.producttype = result.data.data.type;
      $scope.productdescription = result.data.data.completeInfo;
      $scope.brand = result.data.data.brandId.brandName;
      $scope.productimages = result.data.data.images
      if ($scope.productdescription == null || $scope.productdescription == undefined || !$scope.productdescription) {
        $scope.productdescription = [{
          "key": "",
          "value": ""
        }]
      }
    }, function(err) {
      Notification.error("Getting product error");
      $scope.subtab1 = 2;
    })
  }*/
}]);
