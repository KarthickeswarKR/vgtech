vgApp.controller('addproductinfoController', ['$sce','$uibModal','$scope', 'dashboardService', '$timeout', 'Notification', '$http', '$rootScope', '$state', '$q', function($sce,$uibModal,$scope, dashboardService, $timeout, Notification, $http, $rootScope, $state, $q) {
  $scope.search = null;
  $rootScope.newvariant = "false";
  $scope.pictures = [];
  $scope.productimages = [];
  $scope.producttype=1001;
  $scope.productmaterials=[];
  $scope.referenceproducts=[{product:""}]
  $scope.changedescription=function(x){
    if(x.value==undefined){
      x.value=" ";
    }
    $scope.htmlTextToolTip = $sce.trustAsHtml('<font style="word-wrap:break-word;width:300px !important;height:200px !important;font-weight:100;overflow:auto;" class="packageNameTooltip">' + x.value + '</font>');
}
  $scope.addbrand = function() {
      var dialogInst = $uibModal.open({
        templateUrl: 'views/dashboard/addbrand.html',
        controller: 'addbrandController',
        size: 'md',
        resolve: {
          category:function(){
            return 'brand'
          }
        }
      });
      dialogInst.result.then(function(fmsid) {
        $scope.brand='';
        $scope.brnd='';

      }, function(data) {
        if(data.status=="success"){
          $scope.brand=data.id;
          document.getElementById('brandautocompletesearch').value=data.name;
        }else{
        $scope.brand='';
        $scope.brnd='';
      }
      });
  };
  $scope.createtab=function(){
    if($scope.newvariant=='brand'){
      $state.go('home.addproduct.addbrand');
    }else if($scope.newvariant=='category'){
      $state.go('home.addproduct.addcategory');
    }else{
      $state.go('home.addproduct.addproductinfo');
    }
  }
  dashboardService.category().then(function(response) {
    $scope.category = response.data;
  });
  /*$scope.punit="unit";
  dashboardService.units().then(function(response) {
    $scope.units = response.data;
    $scope.productunit=$scope.units[0]._id;
  });
  dashboardService.derivedunits().then(function(response) {
    $scope.derivedunits = response.data;
console.log($scope.derivedunits);
});*/
  $scope.unt="false";
  $scope.brd="false";
  $scope.link="false";
$scope.setproductunit=function(id,name){
  console.log(id);
  $scope.punit=name;
  $scope.productunit=id;
  $('#unit').removeClass('open');
}
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
  $scope.resize = function($event) {
  if (!$event || !$event.target || $event.target == undefined) {} else {
      $event.target.style.height = $event.target.scrollHeight + "px";
  }
  };
  $scope.cancel = function() {
    $state.go('home.virtualgodown');
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
          if(data.data.data.length==0){
            data.data.data.push({productName:'add a new brand'});
          }
          response($.map(data.data.data, function(item) {
            if(item.productName=='add a new brand'){
              return {
                label: item.productName
              }
            }else{
            return {
              label: item.productName,
              value: item.productName,
              Id: item.productId
            }
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
        if(ui.item.label=='add a new brand'){
          $scope.addbrand();
        }else{
        $scope.brand = ui.item.Id;
        $scope.branderror='false';
      }
    }
    });
  };

  $scope.categoryautocomplete = function(id) {
for(var i=0;i<$scope.category.length;i++){
if($scope.category[i]._id==id){
    $scope.productcategry = $scope.category[i].name;
  }
  }
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
        $scope.productmaterials.push({'productId':Id})
      }
    });
  };
  $scope.setmaterial = function(Id) {
     $scope.productmaterials.push({'productId':Id})
  }

  $scope.addproduct = function() {
    var temp = 0;
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
      $scope.pictures = [];
      var promises = [];
      if ($scope.productimages.length == 0) {
        $scope.spec = $scope.productdescription;
        var packages = ["a0e21c0-827b-11e7-bc65-2f4af1bcac66"];
        dashboardService.addproduct($scope.productname, $scope.productcategory, $scope.producttype, $scope.productdescription, $scope.brand, $rootScope.orgId, $scope.pictures, packages, $scope.spec, $scope.productmaterials,$scope.newvariant).then(function(response) {
          if(response.data.code=="200"){
          $state.go('home.virtualgodown');
          Notification.success("product added successfully")
        }else{
          Notification.error(response.data.message);
        }
        }, function(err) {
          Notification.error("error adding product")
        })
      } else {
        for (var z = 0; z < $scope.productimages.length; z++) {
          if (z == $scope.productimages.length - 1) {
            dashboardService.geturl().then(function(data) {
              $scope.pictures.push({
                "img": data.data.url
              });
              $scope.uploadproductimg1($scope.productimages[$scope.productimages.length - 1].img, data.data.name, data.data.signed_request);
              $scope.addproductinfo();
            })
          } else {
            $scope.uploadproductimg($scope.productimages[z].img);
          }
        }
      }
    }
  }
  $scope.addproductinfo = function() {
    $scope.spec = $scope.productdescription;
    var packages = ["a0e21c0-827b-11e7-bc65-2f4af1bcac66"];
    dashboardService.addproduct($scope.productname, $scope.productcategory, $scope.producttype, $scope.productdescription, $scope.brand, $rootScope.orgId, $scope.pictures, packages, $scope.spec, $scope.productmaterial, $scope.newvariant).then(function(response) {
      if(response.data.code=="200"){
      $state.go('home.virtualgodown');
      Notification.success("product added successfully")
    }else{
      Notification.error(response.data.message);
    }
    }, function(err) {
      Notification.error("error adding product")
    })
  }
  $scope.uploadproductimg = function(img) {
    dashboardService.geturl().then(function(data) {
      $scope.pictures.push({
        "img": data.data.url
      });
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
      return true;
    })
  }
  $scope.uploadproductimg1 = function(img, name, signed_request) {

    $scope.urltoFile(img, name + '.jpg', 'image/jpeg')
      .then(function(file) {
        var buf = file;
        $.ajax({
          type: "PUT",
          data: buf,
          url: signed_request,
          processData: false,
          contentType: 'image/jpeg',
          success: function(data1) {}.bind(this),
          error: function(xhr, status, err) {}.bind(this)
        });
      })
    return true;
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
    dashboardService.getbrands().then(function(result) {
      $scope.brands = result.data.data;
      if ($rootScope.orgstatus == 201) {
        $scope.productOwner = $rootScope.fullName;
      } else {
        $scope.productOwner = $rootScope.orgname + "(" + $rootScope.fullName + ")"
      }
    }, function(err) {
      Notification.error("cannot able to load brands")
    })
  }
}]);
