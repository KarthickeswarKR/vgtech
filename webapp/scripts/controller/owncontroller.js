vgApp.controller('ownController', ['$scope', 'dashboardService', '$timeout', 'Notification', '$http', '$rootScope', '$state', function($scope, dashboardService, $timeout, Notification, $http, $rootScope, $state) {
  $scope.deletepackage=function(productId,id){
    var data={"packageId":id}
    dashboardService.deletepackage(data).then(function(resp){
      Notification.success("package seleted successfully")
      $scope.getSearchProducts(productId,null);
    },function(err){
      Notification.error("error deleting package");
    })
  }

  $scope.height = function() {
    $scope.productsSearch=[];
    $scope.search='';
    var productsSearch = $scope.products;
    console.log(productsSearch);
    for (var d = 0; d < productsSearch.length; d++) {
          productsSearch[d].productId.state = "ADDED";
          $scope.productsSearch.push(productsSearch[d].productId)
    }
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
      //document.getElementById("branddiv").style.height = height - (127) + 'px';
      //document.getElementById("productinfodiv").style.height = height - (127) + 'px';
      document.getElementById("searchresult").style.height = height + 'px';
    }

  }
}]);
