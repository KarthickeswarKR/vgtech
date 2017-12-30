
vgApp.controller('addcollabratorctrl', ['$scope', 'dashboardService', '$uibModalInstance', '$timeout', '$uibModal', 'Notification', '$http', '$rootScope', function($scope, dashboardService, $uibModalInstance, $timeout, $uibModal, Notification, $http, $rootScope) {
  $scope.autoc = true;
  $scope.close = function() {
    $uibModalInstance.dismiss('cancel');
  };
  $scope.getSearchusers = function(Id, term) {
    $scope.Id = Id;
  };

  $scope.stockareaautocomplete = function() {
    $("#stockareaautocompletesearch").autocomplete({
      source: function(request, response) {
        $http({
          url: domainURL + 'api/secured/authorize/stockarea/autocomplete',
          method: "GET",
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          },
          params: {
            term: request.term,
            productId:$rootScope.productId

          }
        }).then(function(data) {
$scope.listsareas=data.data.data;
          response($.map(data.data.data, function(item) {
            if(item.organisationId.status==201){
              return {
                label: item.stockareaName,
                value: item.stockareaName,
                Id: item._id
              }
            }else{
              return {
                label: item.stockareaName,
                value: item.stockareaName,
                org: item.organisationId.organisationId,
                Id: item._id
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
        $scope.autoc = false;
        $scope.collabratorId = ui.item.org
        $scope.collabratorstockareaId = ui.item.Id
console.log("success");
      }
    })
  };
  $scope.add = function() {
    dashboardService.getProductStockInfo($rootScope.productId,$scope.collabratorstockareaId).then(function(resp){
    dashboardService.addcollabrator($rootScope.orgId, $scope.collabratorId,$scope.collabratorstockareaId,$rootScope.productId,$rootScope.productstockId,resp.data.data._id).then(function(result) {
      if(result.data.code=="200"){
      Notification.success("successfully mail sent to the collabrator");
      $uibModalInstance.close('done');
    }else{
      Notification.error(result.data.message);
    }
    }, function(err) {
      Notification.error(err.data.message);
    });
    })
  };

}]);
