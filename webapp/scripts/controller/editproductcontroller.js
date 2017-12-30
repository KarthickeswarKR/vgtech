
vgApp.controller('editproductController', ['$stateParams', '$scope', 'dashboardService', '$timeout', 'Notification', '$http', '$rootScope', '$state', '$q', function($stateParams, $scope, dashboardService, $timeout, Notification, $http, $rootScope, $state, $q) {
  $rootScope.highlightcollabrator=null;
  $scope.testbrand=function(){
    if($scope.brd=='true'){
  if(!$scope.brand || $scope.brand==null || $scope.brand==undefined){
    return false;
  }else{
    return true;
  }
    }else{
      return true;
    }
  }
  $scope.testlinks=function(){
    if($scope.link=='true'){
  if($scope.referenceproducts.length==$scope.productmaterials.length){
    return true;
  }else{
    return false;
  }
    }else{
      return true;
    }
  }

  $scope.updateproduct = function() {
    if ($scope.productname == null || $scope.productname == "" || $scope.productcategory == null || $scope.productcategory == "" || !$scope.testlinks() || !$scope.testbrand()) {
      var message;
      if ($scope.productname == null || $scope.productname == "") {
        $scope.productname = '';
        message='<div>Asset name is required.</div> '
      }
      if ($scope.productcategory == null || $scope.productcategory == "") {
        $scope.productcategory = '';
        message=message+'<div>Asset category is required.</div> '
      }
      if(!$scope.testlinks()){
        message=message+'<div>Asset you are trying to link is not in our system. please select the existing one or create a product for it.</div> ';
      }
      if(!$scope.testbrand()){
        $scope.branderror='true';
        message=message+'<div>Brand you trying to link to your product is not in our system. please add brand in our system before including it.</div> '
      }
      Notification.error({message: message, positionY: 'top', positionX: 'center',delay:2000,verticalSpacing: 1500,horizontalSpacing: 50});
    } else {
    if ($scope.productimages.length == 0) {
      $scope.spec = $scope.productdescription;
      dashboardService.updateproduct($scope.productId, $scope.productname, $scope.productcategory, $scope.producttype, $scope.productdescription,$scope.brand,$scope.pictures,$scope.spec, $scope.productmaterial).then(function(response) {
        Notification.success("product updated successfully")
        $state.go('home.virtualgodown');
        //  $scope.productinfopageopen = ($scope.productId, $scope.productname, $scope.pictures, spec);
      }, function(err) {
        Notification.error("error updating product")
      })
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
    dashboardService.updateproduct($scope.productId, $scope.productname, $scope.productcategory, $scope.producttype, $scope.productdescription,$scope.brand,$scope.pictures,$scope.spec, $scope.productmaterial).then(function(response) {
      Notification.success("product updated successfully")
      $state.go('home.virtualgodown');
      //  $scope.productinfopageopen = ($scope.productId, $scope.productname, $scope.pictures, spec);
    }, function(err) {
      Notification.error("error updating product")
    })
  }
}
  dashboardService.category().then(function(response) {
    $scope.category = response.data;
  });
/*  $scope.punit="unit";
  dashboardService.units().then(function(response) {
    $scope.units = response.data;
    $scope.productunit=$scope.units[0]._id;
  });
  dashboardService.derivedunits().then(function(response) {
    $scope.derivedunits = response.data;
console.log($scope.derivedunits);
  });
$scope.setproductunit=function(id,name){
  console.log(id);
  $scope.punit=name;
  $scope.productunit=id;
  $('#unit').removeClass('open')
}*/
$scope.brdtrue=function(){
  $scope.brd='true';
}
$scope.brd1=function(){
  $scope.brd='false';
}
  $scope.addproductlink=function(){
    $scope.referenceproducts.push({product:""})
  }
  $scope.removeproductlink=function(product){
    $scope.referenceproducts.pop();
  }
  $scope.resize = function($event) {
    if (!$event || !$event.target || $event.target == undefined) {} else {
      $event.target.style.height = $event.target.scrollHeight + "px";
    }
  };
  $scope.cancel = function() {
    $state.go('home.virtualgodown');
    $rootScope.leftab=1;
  }
  $scope.deleteproductimage = function(item) {
    var index = $scope.productimages.indexOf(item);
    $scope.productimages.splice(index, 1);
  }
  $scope.brandautocomplete = function() {
    $("#brandautocompletesearch").autocomplete({
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
              label: item.productName,
              value: item.productName,
              Id: item.productId
            }
          }));

        });
      },
      minLength: 1,
      open: function() {

      },
      close: function() {

      },
      focus: function(event, ui) {

      },
      select: function(event, ui) {
        $scope.brand = ui.item.Id;
        $scope.branderror="false";
      }
    });
  };
  $scope.categoryautocomplete = function() {
    $("#categoryautocomplete").autocomplete({
      source: function(request, response) {
          response($.map($scope.category, function(item) {
            return {
              label: item.name,
              value: item.name,
              Id: item._id
            }
          }));
      },
      minLength: 1,
      open: function() {

      },
      close: function() {

      },
      focus: function(event, ui) {

      },
      select: function(event, ui) {
        $scope.productcategory = ui.item.Id;
      }
    });
  };

  $scope.productautocomplete = function() {
    $("#productautocomplete").autocomplete({
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
              Id: item._id,
              specifications:item.specifications
            }
          }));

        });
      },
      minLength: 1,
      open: function() {

      },
      close: function() {

      },
      focus: function(event, ui) {

      },
      select: function(event, ui) {
        $scope.setmaterial(ui.item.Id);
      }
    });
  };
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

  $scope.addproductdescription = function() {
    $scope.productdescription.push({
      "key": "",
      "value": ""
    })
  }
  $scope.removeproductdescription = function() {
    $scope.productdescription.pop()
  }
  $scope.height = function() {
    var height;
    var screenHeight = screen.height;
    screenHeight = window.innerHeight;
    if (screenHeight > (60 + 80 + 430 + 70)) {
      height = screenHeight - 60 - 80 - 70 - 20;
      document.getElementById("addproduct").style.height = height - (53) + 'px';
    } else {
      height = 430;
      document.getElementById("addproduct").style.height = height - (53) + 'px';
    }
    $scope.productId = $stateParams.productId;
  $scope.referenceproducts=[];
    dashboardService.productInfo($stateParams.productId).then(function(result) {
      $scope.productOwner =  $rootScope.org.organisationId; + "(" + $rootScope.fullName + ")";
      $scope.productname = result.data.data.productName;
      $scope.productcategory = result.data.data.categoryId._id;
      $scope.productcategry = result.data.data.categoryId.name;
      $scope.producttype = result.data.data.type;
      $scope.links = result.data.data.links;
      if(!$scope.links || $scope.links.length==0){
        $scope.link='false';
        $scope.referenceproducts.push({product:""})
      }else{
        $scope.link='true';
      for(var i=0;i<$scope.links.length;i++){
        $scope.referenceproducts.push({product:$scope.links[i].productId.productName})
        $scope.productmaterials.push({product:$scope.links[i].productId._id})
      }
    }
      $scope.productdescription = result.data.data.completeInfo;
      if(result.data.data.brandId){
        $scope.brdtrue()
        $scope.brnd = result.data.data.brandId.productName;
        $scope.brand = result.data.data.brandId._id;
    }else{
      $scope.brd1()
    }
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

  }
}])
