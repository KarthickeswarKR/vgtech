'use strict';
vgApp.controller('dashboardHeaderController', ['$state', '$scope', 'dashboardService', 'loginService', '$uibModal', '$rootScope','$timeout','$http', function($state, $scope, dashboardService, loginService, $uibModal, $rootScope,$timeout,$http) {
  if ($rootScope.er !== true) {
    if (localStorage.getItem("access_token") == null || localStorage.getItem("access_token") == undefined) {
      $scope.access = false;
      $scope.loading = false;
    } else {
      $scope.access = true;
      $scope.loading = false;
      loginService.getUserDetails().then(function(result) {
        $rootScope.isAdmin = true;
        $rootScope.org = result.data.data.org;
        if ($rootScope.orgId == null || $rootScope.orgId == undefined || !$rootScope.org) {
          $rootScope.orgId = result.data.data.org[0].organisationId._id;
          $rootScope.orgname = $rootScope.org[0].organisationId.organisationId;
          $rootScope.orgstatus = $rootScope.org[0].organisationId.status;
        }
        if (result.data.data.status == "pendingstock") {
          $rootScope.userstatus = "pending";
        }
        $scope.value = 0;
        $rootScope.newmessages=0;
 var el = angular.element(document.querySelector('.notification'));
 var poll = function() {
                $timeout(function() {
                  if(localStorage.getItem("userId") && localStorage.getItem("access_token")){

                  $http({
                    url: domainURL + 'api/secured/authorize/notification/getinfo',
                    method: "GET",
                    ignoreLoadingBar: true,
                    headers: {
                      'Content-Type': 'application/json; charset=utf-8'
                    }
                  }).then(function(data){
                    $rootScope.notification=data.data.data.notification;
                    $rootScope.allnotification=data.data.data.allnotification;
                  $rootScope.messages=data.data.data.messages;
                  for(var i=0;i<$rootScope.messages.length;i++){
                    for(var j=0;j<$rootScope.messages[i].receiptent.length;j++){
                    if($rootScope.messages[i].receiptent[j].userId==$rootScope.userId &&$rootScope.messages[i].receiptent[j].status==201){
                      $rootScope.newmessages++;
                  }
                }}
                  if($scope.value!==$rootScope.notification.length){
                    if($rootScope.notification.length==0){
                    }else{
                  $scope.value=$rootScope.notification.length;
                  el.toggleClass('notify');
                }
                }
                  poll();
                })
              }
              }, 10000);
              };
              poll();
      }, function(err) {
        $scope.access = false;
        $scope.loading = false;
      });
    }
  }
  $scope.faq=function(){
    $state.go('faq');
  }
  $scope.settings=function(){
    $state.go('settings');
  }
  $scope.gohome=function(){
    $state.go('home');
  }
  $scope.poll=function(){
    if(localStorage.getItem("userId") && localStorage.getItem("access_token")){
    $scope.value = 0;
var el = angular.element(document.querySelector('.notification'));
var poll = function() {
            $timeout(function() {
              $http({
                url: domainURL + 'api/secured/authorize/notification/getinfo',
                method: "GET",
                ignoreLoadingBar: true,
                headers: {
                  'Content-Type': 'application/json; charset=utf-8'
                }
              }).then(function(data){
              $rootScope.notification=data.data.data.notification;
              $rootScope.allnotification=data.data.data.allnotification;
              $rootScope.messages=data.data.data.messages;
            if($scope.value!=$rootScope.notification.length){
              el.toggleClass('notify');
              $scope.value=$rootScope.notification.length;
            }
              poll();
            })
          }, 10000);
          };
          poll();
        }

  }
  $scope.updatenotification=function(id,stockareaid,productid,type){
  $rootScope.checktab(stockareaid,productid);
  dashboardService.updatenotification().then(function(result){
})
$scope.poll();
  }
  $scope.getInfo = function() {
    loginService.getUserDetails().then(function(result) {
      $rootScope.fullName = result.data.data.fullName;
      $rootScope.profilePic = result.data.data.profilePic;
      $rootScope.userId = result.data.data._id;
      $rootScope.org = result.data.data.org;
      if ($rootScope.orgId == null || $rootScope.orgId == undefined || !$rootScope.org) {
        $rootScope.orgId = result.data.data.org[0].organisationId._id;
        $rootScope.orgname = $rootScope.org[0].organisationId.organisationId;
        $rootScope.orgstatus = $rootScope.org[0].organisationId.status;
      }
      if (result.data.data.status == "pendingstock") {
        $rootScope.userstatus = "pending";
      }
    }, function(err) {
      $scope.access = false;
      $scope.loading = false;
    });
  };
  $scope.logout = function() {
    //$state.go("signUp2");

    dashboardService.logout(localStorage.getItem("userId"), localStorage.getItem("access_token")).then(function(result) {
      $rootScope.orgId = null;
      $rootScope.userId = null;
      localStorage.clear();
      $state.go("login");
    });
  };
  $scope.signup = function() {
    $state.go('signUp');

  };
  $scope.login = function() {
    $state.go('login');

  };
  $scope.messagetohelp=function(){
    $rootScope.helpmessage()
  }
  $scope.getOrgInfo = function(Id) {
    dashboardService.getorganisation(Id).then(function(result) {
      $rootScope.organisationinfo = result.data.data;
      var collabrators = result.data.data.collabrators;
      for (var i = 0; i < collabrators.length; i++) {
        if (collabrators[i].userId._id == $rootScope.userId) {
          if (collabrators[i].role == 'admin') {
            $rootScope.isAdmin = true;
          } else {
            $rootScope.isAdmin = false;
          }
        }
      }
    }, function(err) {
      Notification.error("organisation cannot be changed at this time");
    });
  };
  $scope.changeorg = function(Id) {
    for (var i = 0; i < $rootScope.org.length; i++) {
      if ($rootScope.org[i].organisationId._id == Id) {
        $rootScope.orgname = $rootScope.org[i].organisationId.organisationId;
        $rootScope.orgstatus = $rootScope.org[0].organisationId.status;
        dashboardService.getorganisation(Id).then(function(result) {
          $rootScope.orgId = Id;
          $rootScope.productName = null;
          $rootScope.productId = null;
          $rootScope.productstockId = null;
          $rootScope.editSelectedStockarea = null;
          localStorage.removeItem('selectedStockareaId');
          localStorage.removeItem('selectedStockareaName');
          $rootScope.organisationinfo = result.data.data;
          var collabrators = result.data.data.collabrators
        /*  for (var i = 0; i < collabrators.length; i++) {
            if (collabrators[i].userId._id == $rootScope.userId) {
              if (collabrators[i].role == 'admin') {
                $rootScope.isAdmin = true;
              } else {
                $rootScope.isAdmin = false;
              }
            }
          }*/

          $rootScope.isAdmin = true;

          $scope.getInfo();
          $state.go('home.virtualgodown');
          $state.reload();
        }, function(err) {
          Notification.error("organisation cannot be changed at this time");
        })

      }else{
        console.log("err");
      }
    }
  }
  $scope.profile = function() {
    $state.go("profile");
  };
  $scope.home = function() {
window.location.replace('/')
  };
  /*
     getUserDetails <-   informa

     $scope.userName = data.userName;
   */
  /*
dashboardService.getStockArea(localStorage.getItem("userId")).then(function (result) {
            if (result.data.stockarea != null) {
            	$scope.stockarea = result.data.stockarea;

            }
        }, function (error) {
            Notification.error('Stockarea Not Available');
            $log.info("Invalid UserName/Password");

        });
var trace1 = {
        x: [1, 2, 3, 4],
        y: [10, 15, 13, 17],
        type: 'scatter'
    };

    var trace2 = {
        x: [1, 2, 3, 4],
        y: [16, 5, 11, 9],
        type: 'scatter'
    };

    var trace3 = {
        x: [1, 2, 3, 4],
        y: [23, 4, 2, 6],
        type: 'scatter'
    };

    var trace4 = {
        x: [1, 2, 3, 4],
        y: [9, 11, 3, 12],
        type: 'scatter'
    };
    $scope.graphPlots = [trace1, trace2, trace3, trace4];
*/

}]);




vgApp.directive('linePlot', [function() {
  function linkFunc(scope, element, attrs) {
    scope.$watch('graphPlots', function(plots) {
      Plotly.newPlot(element[0], plots, {
        displayModeBar: false
      });
    });
  }

  return {
    link: linkFunc
  };
}]);

var country = 'IN';
var startDragPosition = {
  lat: 22.745154893908804,
  lng: 78.25780350000002
};

function addresComponent(type, geocodeResponse, shortName) {
  for (var i = 0; i < geocodeResponse.address_components.length; i++) {
    for (var j = 0; j < geocodeResponse.address_components[i].types.length; j++) {
      if (geocodeResponse.address_components[i].types[j] == type) {
        if (shortName) {
          return geocodeResponse.address_components[i].short_name;
        } else {
          return geocodeResponse.address_components[i].long_name;
        }
      }
    }
  }
  return '';
}
