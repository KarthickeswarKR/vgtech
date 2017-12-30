vgApp.controller('reportctrl', ['$scope', 'dashboardService', '$timeout', 'Notification','$uibModalInstance','productid','name', function($scope, dashboardService, $timeout, Notification,$uibModalInstance,productid,name) {
  $scope.close = function() {
    $uibModalInstance.dismiss('cancel');
  };
  $scope.name=name;
  $scope.autoc=true;
$scope.reportproduct=function(){
  if($scope.msg!==null && $scope.msg && $scope.msg!==undefined){
dashboardService.addreport(productid,$scope.msg).then(function(resp){
  Notification.success("Product reported successfully");
  $uibModalInstance.dismiss('done');
},function(err){
  Notification.error("cannot able to report at this time")
})
}
}
}]);
