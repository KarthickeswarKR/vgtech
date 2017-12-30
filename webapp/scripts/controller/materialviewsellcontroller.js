vgApp.controller('materialViewSellCtrl', ['$sce', '$scope', 'dashboardService', 'productid', '$uibModalInstance', '$state', '$timeout', '$uibModal', '$rootScope', 'Notification', '$log', function($sce, $scope, dashboardService, productid, $uibModalInstance, $state, $timeout, $uibModal, $rootScope, Notification, $log) {
  $rootScope.highlightcollabrator=null;

  var stockareaId = localStorage.getItem('selectedStockareaId');
  $scope.htmlTextToolTip = $sce.trustAsHtml('<div style="background-color:white; color:white;"> Hello</div>');
  $scope.onChangePricePerPackage = function(data, $event) {
    $scope.addsellbutton = true;
    data.priceperpack = parseInt($event.target.value);
    $scope.htmlTextToolTip = $sce.trustAsHtml('<div class="packageNameTooltip">' + data.name + '</div>Price Per Package: ' + data.priceperpack + '<br> Cost Per Kg: ' + (data.priceperpack / data.size));
  };

  $scope.onChangeQuantityAvaliabity = function(data, $event) {
    $scope.addsellbutton = true;
    data.packagesAvailable = parseInt($event.target.value);


    var packagesAvailable = parseInt(data.packagesAvailable) || 0;
    var MinimumOrder = parseInt(data.MinimumOrder) || 0;



    if (packagesAvailable < MinimumOrder)
      data.AvaliabityError = true;
    else
      data.AvaliabityError = false;

    var errorText = '<div class="AvailError"> ERROR! <br> Available Quantity is less than Minmiun Quantity so you may not get listed.</div>';


    if (!data.AvaliabityError) {
      errorText = '';
    }

    $scope.htmlTextToolTip = $sce.trustAsHtml('<div class="packageNameTooltip">' + data.name + '</div>Quantity Avaliabity: ' + data.packagesAvailable + '<br> Cost: ' + (data.packagesAvailable * data.priceperpack) + '<br> Available Quantity in Kgs: ' + (data.packagesAvailable * data.size) + '<br> Cost Per Kg: ' + (data.priceperpack / data.size) + errorText);
  };
  $scope.addsellbutton = false;

  $scope.getAvailError = function(data) {
    var packagesAvailable = parseInt(data.packagesAvailable) || 0;
    var MinimumOrder = parseInt(data.MinimumOrder) || 0;
    if (packagesAvailable < MinimumOrder)
      data.AvaliabityError = true;
    else
      data.AvaliabityError = false;

  }
  $scope.onlyNumbers = /^\d+$/;

  $scope.onChangeMinmiunQuantity = function(data, $event) {
    $scope.addsellbutton = true;
    data.MinimumOrder = $event.target.value;



    var packagesAvailable = parseInt(data.packagesAvailable) || 0;
    var MinimumOrder = parseInt(data.MinimumOrder) || 0;

    if (packagesAvailable < MinimumOrder)
      data.AvaliabityError = true;
    else
      data.AvaliabityError = false;


    $scope.htmlTextToolTip = $sce.trustAsHtml('Minmiun Quantity' + data.MinimumOrder);



    if (data.priceperpack != undefined && data.priceperpack.trim() != '' && data.priceperpack != null)
      $scope.htmlTextToolTip = $sce.trustAsHtml('<div class="packageNameTooltip">' + data.name + '</div>Minmiun Quantity: ' + data.MinimumOrder + '<br> Cost: ' + (data.MinimumOrder * data.priceperpack) + '<br> Quantity in Kgs: ' + (data.MinimumOrder * data.size) + '<br> Cost Per Kg: ' + (data.priceperpack / data.size));


  };

  $scope.selection = [];
  $scope.toggleSelection = function toggleSelection(packageId) {
    var idx = $scope.selection.indexOf(packageId);

    // Is currently selected
    if (idx > -1) {
      $scope.selection.splice(idx, 1); //inactive
      for (var i = 0; i < $scope.packages.length; i++) {
        if ($scope.packages[i].packageId == packageId)
          $scope.packages[i].status = false;
      }
    }

    // Is newly selected
    else {
      $scope.selection.push(packageId); //active
      for (var i = 0; i < $scope.packages.length; i++) {
        if ($scope.packages[i].packageId == packageId)
          $scope.packages[i].status = true;
      }
    }
    $scope.addsellbutton = true;
  };


  $scope.setproductunit=function(id,name){
    console.log(id);
    $('#unit').removeClass('open');
    for(var i=0;i<$scope.packages.length;i++){
if($scope.packages[i].name=='custom'){
  $scope.packages[i].unit=name;
}
    }
  }
  $rootScope.sellloading = true;
  dashboardService.units().then(function(response) {
    $scope.units = response.data;
  });
  dashboardService.derivedunits().then(function(response) {
    $scope.derivedunits = response.data;
});
  dashboardService.getProductSellInfo(productid, stockareaId).then(function(result) {
    $rootScope.sellloading = false;
    if (result.data.data != null) {
      $scope.productSellInfo = result.data.data;
      $scope.unit = $scope.productSellInfo.productId.unit;
      $scope.stockareaname = $scope.productSellInfo.stockareaId.stockareaName
    //  $scope.materialname = $scope.productSellInfo.productId.materialId.materialName;
      //  $scope.variantname=$scope.productSellInfo.productId.variantId.variantName;
      //$scope.brandname=$scope.productSellInfo.productId.brandId.brandName;
      $scope.packages = $scope.productSellInfo.productId.package;
      for (var i = 0; i < $scope.packages.length; i++) {
        $scope.packages[i].status
        if ($scope.packages[i].status == true) {
          $scope.packages[i].MinimumOrder = parseInt($scope.packages[i].MinimumOrder);
          $scope.packages[i].packagesAvailable = parseInt($scope.packages[i].packagesAvailable);
          $scope.packages[i].priceperpack = parseInt($scope.packages[i].priceperpack);
          $scope.packages[i].status = JSON.parse($scope.packages[i].status);
          $scope.selection.push($scope.packages[i].packageId);
        }
      }
      $scope.currency = "INR";

    }
  }, function(error) {
    Notification.error('Product Sell Info Not Available');
    $log.info("Product Sell Info Not Available");
  });
  $scope.currency = ":NR";
  $scope.units = [{
      "name": "Kilogram"
    },
    {
      "name": "Ton"
    }
  ];
  $scope.sdUnit = "kilogram"
  $scope.unit = "kilogram";
  $scope.packages = [];
  $scope.custom = {};
  $scope.submit = function() {
    var data = {
      "stockareaId": stockareaId,
      "productId": productid,
      "productStockId": $scope.productSellInfo.productstockId,
      "packages": $scope.packages,
      "unit": $scope.unit
    };
    var regex = /^\d+$/;
    $scope.error = false;
    for (var l = 0; l < $scope.packages.length; l++) {
      if ($scope.packages[l].status == true) {
        if (!regex.test(parseInt($scope.packages[l].MinimumOrder)) || !regex.test(parseInt($scope.packages[l].packagesAvailable)) || !regex.test(parseInt($scope.packages[l].priceperpack))) {
          $scope.error = true;
        }
      }
    }
    if ($scope.error == false) {
      dashboardService.addSell(data).then(function(result) {
        if(result.data.code=="200"){
        Notification.success('Stock details updated successfully');
        dashboardService.getProductStockInfo(productid, stockareaId, $scope.productSellInfo.productstockId).then(function(result) {
          if (result.data.data != null) {
            $scope.productStockInfo = result.data.data;

            $uibModalInstance.dismiss($scope.productStockInfo.stockDetails);
          }
        }, function(error) {
          Notification.error('Error updating Stock details');
        });
      }else{
        Notification.error(result.data.message);
      }
      }, function(error) {
        Notification.error('Error updating Stock details');
        $log.info("Sell Not Added");

      });


    } else {
      Notification.error("Please check the inputs");
    }
  }




  $scope.close = function() {
    $uibModalInstance.dismiss('cancel');
  };

}]);
