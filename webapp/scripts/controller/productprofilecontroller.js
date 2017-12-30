vgApp.controller('ProductProfileCtrl', ['$scope', 'dashboardService', '$stateParams', '$rootScope','Notification', function($scope, dashboardService, $stateParams, $rootScope,Notification) {
  $scope.profileStockareaName = $stateParams.stockareaName;
  $scope.profileProductName = $stateParams.productName;
  $rootScope.highlightcollabrator=null;

  $rootScope.loading = true;
  $scope.init=function(){
  dashboardService.getProductProfile($scope.profileStockareaName, $scope.profileProductName).then(function(result) {
    $scope.result = result.data.data;
    $rootScope.loading = false;
    $scope.fullName = $scope.result.selectedproduct.userinfo.fullName;
    $scope.collabratorsinfo = $scope.result.selectedproduct.userinfo.org;
    $scope.userName = $scope.result.selectedproduct.userinfo.userName;
    //$scope.profilepic=$scope.result.selectedproduct.userinfo.profilePic;
    $scope.stockareacreated = $scope.result.selectedproduct.stockareaInfo.createdOn.slice(0, 10);
    $scope.stockareaId= $scope.result.selectedproduct.stockareaInfo._id;
    $scope.phone = $scope.result.selectedproduct.stockareaInfo.phone;
    $scope.visiblity = $scope.result.selectedproduct.stockareaInfo.visiblity;
    if($scope.visiblity=="1003"){
      $scope.visi="public"
    }else{
      $scope.visi="private"
    }
    $scope.producttype = $scope.result.selectedproduct.type;
    $scope.productcollabrators = $scope.result.selectedproduct.productcollabrators;
    $scope.code = $scope.result.selectedproduct.stockareaInfo.code;
    $scope.location = $scope.result.selectedproduct.stockareaInfo.latitude+ "," +$scope.result.selectedproduct.stockareaInfo.longitude ;
    $scope.updatedstock = $scope.result.selectedproduct.sellinfo.updatedOn.slice(0, 10);
    $scope.dealingsince = $scope.result.selectedproduct.sellinfo.createdOn.slice(0, 10);
    $scope.url = $scope.result.selectedproduct.productinfo.productId.primaryImage;
    $scope.selldata = $scope.result.selectedproduct.sellinfo.package;
  });
}
$scope.updatesource=function(){
dashboardService.updatesource(localStorage.getItem('selectedStockareaId'),$rootScope.productId,$scope.stockareaId).then(function(data){
  Notification.success("source updates successfully");
},function(err){
  Notification.success("error updating source");
})
}
  $scope.changeimage = function(data) {
    if (data == 'brand') {
      $scope.url = $scope.result.selectedproduct.productinfo.productId.brandId.logo;
    } else if (data == 'package') {
      $scope.url = $scope.result.selectedproduct.productinfo.productId.package[0].img;
    } else {
      $scope.url = $scope.result.selectedproduct.productinfo.productId.primaryImage;
    }
  }
}]);
