vgApp.controller('createorgctrl', ['$scope', 'dashboardService', '$timeout', 'Notification', '$http', '$rootScope', '$state', '$window', function($scope, dashboardService, $timeout, Notification, $http, $rootScope, $state, $window) {
  /*if (!$rootScope.organisationinfo || $rootScope.organisationinfo == undefined || $rootScope.organisationinfo == null) {
    $scope.editorg = false;
    $scope.organisationName = null;
    $scope.sin = null;
    $scope.Id = null;
  } else {
    $scope.organisationName = $rootScope.organisationinfo.organisationName;
    $scope.sin = $rootScope.organisationinfo.sin;
    $scope.Id = $rootScope.orgId;
    $scope.editorg = true;
  }*/
  $rootScope.highlightcollabrator=null;
  $scope.edit = function() {
    $scope.editorg = false;
  }
  $scope.checkorgname = function() {
    if ($scope.organisationId == null || $scope.organisationId.length == undefined) {
      $scope.na = "organisation name is required";
      $scope.state = null;
    } else if ($scope.organisationId.length > 2) {
      $scope.na = null;
      dashboardService.checkorgname($scope.organisationId).then(function(resp) {
        $scope.exist = resp.data.data.exist;
        if ($scope.exist == false) {
          $scope.state = "exist";
        } else {
          $scope.state = "Not exist!";
        }
      })
    } else {
      $scope.na = null;
      $scope.state = null;
    }
  }
  $scope.new = function() {
    $scope.editorg = false;
    $scope.organisationName = null;
    $scope.sin = null;
    $scope.Id = null;
  }
  $scope.cancel = function() {
    $state.go('home.virtualgodown');
  }
  $scope.add = function() {
    if ($scope.state == "exist" && $scope.organisationName !== null && $scope.organisationId !== null) {
      dashboardService.addorg($scope.organisationName, $scope.organisationId).then(function(result) {
        if(result.data.code=="200"){
        Notification.success("organisation created successfully");
        localStorage.setItem("orgId", $scope.organisationId);
        $window.location.replace("/");
      }else{
        Notification.error(result.data.message);
      }
      }, function(err) {
        Notification.error("organisation create error");
      });
    } else {
      if($scope.organisationName==null){
      $scope.organisationName = "";
    }
    if($scope.organisationId == null){
      $scope.organisationId = "";
    }
    }
  };

}]);
