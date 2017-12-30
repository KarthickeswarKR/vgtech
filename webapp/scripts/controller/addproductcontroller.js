vgApp.controller('addproductController', ['$scope', 'dashboardService', '$timeout', 'Notification', '$http', '$rootScope', '$state', '$q', function($scope, dashboardService, $timeout, Notification, $http, $rootScope, $state, $q) {
  $scope.search = null;
  $rootScope.newvariant = "false";
  $state.go('home.addproduct.addproductinfo');
  $scope.createtab=function(){
    if($scope.newvariant=='brand'){
      $state.go('home.addproduct.addbrand');
    }else{
      $state.go('home.addproduct.addproductinfo');
    }
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
