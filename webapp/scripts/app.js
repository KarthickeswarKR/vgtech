var vgApp = angular.module('vgApp', [
  'ui.router',
  'ui.bootstrap',
  'ui-notification',
  'LocalStorageModule',
  'angular-loading-bar',
  'angularValidator',
  'angularModalService',
  'angular-page-loader',
  'ngImgCrop',
  'slickCarousel'
]);

vgApp.config(['slickCarouselConfig', function (slickCarouselConfig) {
    slickCarouselConfig.dots = true;
    slickCarouselConfig.autoplay = false;
  }])

vgApp.config(['$urlRouterProvider', '$stateProvider', '$httpProvider', '$locationProvider', function($urlRouterProvider, $stateProvider, $httpProvider, $locationProvider) {

  $urlRouterProvider.otherwise('login');
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
}]);
vgApp.directive('ddc', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            elem.bind('click', function(){
                $timeout(function(){
                    elem.attr('disabled','disabled');
                }, 20);

                $timeout(function(){
                    elem.removeAttr('disabled');
                }, 500);
            });
        }
    };
});
vgApp.directive('onlyAlphabets', function() {
  return {
    require: 'ngModel',
    link: function(scope, element, attr, ngModelCtrl) {
      function fromUser(text) {
        var transformedInput = text.replace(/[^0-9a-z-]/g, '');
        if (transformedInput !== text) {
          ngModelCtrl.$setViewValue(transformedInput);
          ngModelCtrl.$render();
        }
        return transformedInput;
      }
      ngModelCtrl.$parsers.push(fromUser);
    }
  };
});
vgApp.directive('disallowSpaces', function() {
  return {
    restrict: 'A',

    link: function($scope, $element) {
      $element.bind('input', function() {
        $(this).val($(this).val().replace(/[$&,:;=?@|<>.^*()%! ]/, ''));
      });
    }
  };
});
vgApp.directive('numericOnly', function() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var re = RegExp(attrs.restrictTo);
      var exclude = /Backspace|Enter|Tab|Delete|Del|ArrowUp|Up|ArrowDown|Down|ArrowLeft|Left|ArrowRight|Right/;

      element[0].addEventListener('keydown', function(event) {
        if (!exclude.test(event.key) && !re.test(event.key)) {
          event.preventDefault();
        }
      });
    }
  }
});
vgApp.run(['$rootScope', '$state', 'loginService', '$q', '$location', function($rootScope, $state, loginService, $q, $location) {
  $rootScope.domainURL = domainURL;
  if (!localStorage.getItem('orgId') || localStorage.getItem('orgId') == null || localStorage.getItem('userId') == null || localStorage.getItem('orgId') == undefined || localStorage.getItem('userId') == undefined || localStorage.getItem('access_token') == undefined || localStorage.getItem('access_token') == null) {
if(window.location.pathname.indexOf('/login') >-1 || window.location.pathname.indexOf('/signUp')>-1  || window.location.pathname.indexOf('/onVerifyAction')>-1  || window.location.pathname.indexOf('/resetPassword')>-1 || window.location.pathname.indexOf('/forgotPassword')>-1 || window.location.pathname.indexOf('/verifyemail')>-1 || window.location.pathname.indexOf('/collabrator')>-1 || window.location.pathname.indexOf('/productProfile')>-1){
}else{
    $location.path('/login');
  }
  } else {
    $rootScope.orgId = localStorage.getItem('orgId')
    loginService.isAuthenticated().then(function(data) {
      loginService.getUserDetails().then(function(result) {
        $rootScope.isAdmin = true;
        $rootScope.fullName = result.data.data.fullName;
        $rootScope.profilePic = result.data.data.profilePic;
        $rootScope.userId = result.data.data._id;
        $rootScope.org = result.data.data.org;
        $rootScope.orgId = result.data.data.org[0].organisationId._id;
        $rootScope.orgname = $rootScope.org[0].organisationId.organisationId
        $rootScope.orgstatus = $rootScope.org[0].organisationId.status;
        if (result.data.data.status == "pendingstock") {
          $rootScope.userstatus = "pending";
        }
      }, function(err) {

      });
    }, function(err) {
      $location.path('/login');
    });
  }
}]);

vgApp.filter('format', function() {
  return function(item) {
    var t = item.split(/[- :]/);
    var d = new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5]);
    var time = d.getTime();
    return time;
  };
});
vgApp.config(['NotificationProvider', function(NotificationProvider) {
  NotificationProvider.setOptions({
    delay: 2000,
    startTop: 20,
    startRight: 10,
    verticalSpacing: 20,
    horizontalSpacing: 20,
    positionX: 'left',
    positionY: 'top'
  });
}]);
vgApp.directive('scrollIf', function($uiViewScroll) {
  return function(scope, element, attrs) {
    scope.$watch(attrs.scrollIf, function(value) {
      if (value) {
        $uiViewScroll(element);
      }
    });
  }
});

vgApp.config(['$urlRouterProvider', '$httpProvider', function($urlRouterProvider, $httpProvider) {

  $httpProvider.interceptors.push(['$injector', '$state', '$q', '$rootScope', function($injector, $state, $q, $rootScope) {


    return {
      request: function(config) {
        var canceler = $q.defer();
        config.timeout = canceler.promise;
        $rootScope.er = false
        if (config.url.indexOf('api/') > -1) {

          // create instance for systemService
          var systemService = $injector.get("SystemService");
          if (config.url.indexOf('productstock/getuserstockinfo') > -1) {
            $rootScope.er = true
          } else if (config.url.indexOf('oauth/token') > -1 || config.url.indexOf('users/adduser') > -1 || config.url.indexOf('users/forgetPassword') > -1 || config.url.indexOf('users/resetPassword') > -1 || config.url.indexOf('token/checktoken') > -1 || config.url.indexOf('users/validatetoken') > -1 ) {

            //config.url = systemService.getCurrentInstance().authServiceName + config.url;
            config.url = config.url;

          } else {
            var access_token = localStorage.getItem('access_token');
            var userId = localStorage.getItem('userId');

                if (access_token == null) {

              //canceler.resolve();
            } else {
              //config.url = systemService.getCurrentInstance().serviceName + config.url;
              config.url = config.url;
              config.headers.Authorization = "Bearer " + access_token;
              config.headers.userid = userId;
              config.headers.organisationid = $rootScope.orgId;
              config.headers.stockareaid=localStorage.getItem('selectedStockareaId');
            }
          }
        }

        return config;
      },
      responseError: function(response) {
        if (response) {}

        return $q.reject(response);
      }
    }

  }]);
}]);

vgApp.config(['$urlRouterProvider', '$httpProvider', function($urlRouterProvider, $httpProvider) {


  $httpProvider.interceptors.push(['$injector', '$location', '$q', '$rootScope', function($injector, $location, $q, $rootScope) {

    return {
      response: function(responseData) {
        return responseData;
      },
      responseError: function error(response) {
        switch (response.status) {
          case 404:
            $rootScope.errormessage = "Requested URL is not available";
            $location.path('/login');
            break;
          case 401:
            $location.path('/login');
            break;
          case 503:
            $rootScope.errormessage = "Error occured in Server please try again after some time"
            $location.path('/login');
            break;
          case 500:
              console.log("InternalServerError");
              break;
          case 625:
              console.log("inputserror");
              break;
          case 360:
              console.log("duplicateuser");
              break;
          case 385:
              console.log("duplicateemail");
              break;
          case 362:
          $location.path('/login');
              break;
         case 400:
            $location.path('/login');
              break;
         case 403:
              console.log("passwordNotMatch");
              break;
        case 413:
              console.log("EmailNotverified");
              break;
          default:
$rootScope.notify();
              break;
        }

        return $q.reject(response);
      }
    };

  }]);
}]);

vgApp.directive("monthpicker", function() {
  return {
    restrict: "A",
    require: "ngModel",
    link: function(scope, elem, attrs, ngModelCtrl) {
      var updateModel = function(dateText) {
        scope.$apply(function() {
          ngModelCtrl.$setViewValue(dateText);
        });
      };
      var options = {
        dateFormat: "mm/yy",
        onSelect: function(dateText) {
          updateModel(dateText);
        }
      };
      elem.datepicker(options);
    }
  }
});
vgApp.directive('autogrow', function () {
    return {

      restrict: 'A',
      link: function postLink(scope, element, attrs) {
          // hidding the scroll of textarea
          element.css('overflow', 'hidden');

          var update = function(){

              element.css("height", "auto");

              var height = element[0].scrollHeight;

              if(height > 0){

                  element.css("height", height + "px");
                }

          };

          scope.$watch(attrs.ngModel, function(){

              update();
          });

          attrs.$set("ngTrim", "false");
      }
    };
  });
vgApp.directive("datepicker", function() {
  return {
    restrict: "A",
    require: "ngModel",
    link: function(scope, elem, attrs, ngModelCtrl) {
      var updateModel = function(dateText) {
        scope.$apply(function() {
          ngModelCtrl.$setViewValue(dateText);
        });
      };
      var options = {
        dateFormat: "dd/mm/yy",
        onSelect: function(dateText) {
          updateModel(dateText);
        }
      };
      elem.datepicker(options);
    }
  }
});
var domainURL = window.location.origin + "/";
//var domainURL="https://cryptic-meadow-48081.herokuapp.com/"
//var domainURL = 'https://developserver.herokuapp.com/';
//var domainURL = 'http://localhost/';
//var domainURL = 'http://www.virtualgodown.com/';
