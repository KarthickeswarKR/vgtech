vgApp.controller('packagectrl', ['$sce', '$scope', 'dashboardService', 'productid', '$uibModalInstance', '$state', '$timeout', '$uibModal', '$rootScope', 'Notification', '$log', function($sce, $scope, dashboardService, productid, $uibModalInstance, $state, $timeout, $uibModal, $rootScope, Notification, $log) {
  $scope.close = function() {
    $uibModalInstance.dismiss('cancel');
  };
  $scope.punit="unit";
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
  $('#unit').removeClass('open');
}

  $scope.submit = function() {
    var data = {
      "productId": productid,
      "packagesize":$scope.packagesize,
      "packageshape":$scope.packageshape,
      "packagetype":$scope.packagetype,
      "unit": $scope.punit
    };
if(!$scope.packagesize || !$scope.punit){
  if(!$scope.packagesize){
Notification.error("package size is required");
}
if(!$scope.punit){
  Notification.error("package unit is required");
}
}else{
      dashboardService.addpackage(data).then(function(result) {
          Notification.success('package details updated successfully');
        $uibModalInstance.close('done');
    }, function(error) {
        Notification.error('Error adding package');
      });
}
}




}]);
vgApp.controller('suggestpackagectrl', ['$sce', '$scope', 'dashboardService', 'productid', '$uibModalInstance', '$state', '$timeout', '$uibModal', '$rootScope', 'Notification', '$log', function($sce, $scope, dashboardService, productid, $uibModalInstance, $state, $timeout, $uibModal, $rootScope, Notification, $log) {
  $scope.close = function() {
    $uibModalInstance.dismiss('cancel');
  };
  $scope.punit="unit";
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
  $('#unit').removeClass('open');
}

  $scope.submit = function() {
    var data = {
      "productId": productid,
      "packagesize":$scope.packagesize,
      "packageshape":$scope.packageshape,
      "packagetype":$scope.packagetype,
      "unit": $scope.punit
    };
if(!$scope.packagesize || !$scope.punit){
  if(!$scope.packagesize){
Notification.error("package size is required");
}
if(!$scope.punit){
  Notification.error("package unit is required");
}
}else{
      dashboardService.suggestpackage(data).then(function(result) {
          Notification.success('package details updated successfully');
        $uibModalInstance.close('done');
    }, function(error) {
        Notification.error('Error adding package');
      });
}
}




}]);
