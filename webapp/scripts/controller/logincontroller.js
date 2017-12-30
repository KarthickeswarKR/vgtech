'use strict';


vgApp.config(['$stateProvider', function($stateProvider) {

  $stateProvider.state('login', {
    url: '/login',
    templateUrl: 'views/login/login.html',
    controller: 'loginController'
  }).state('home', {
    url: "/",
    templateUrl: domainURL + 'views/dashboard/home.html',
    controller: 'homeController',
    authenticate: 'true',
    redirectTo: 'home.virtualgodown',
  }).state('home.virtualgodown', {
    url: "",
    controller: 'vgController',
    templateUrl: domainURL + 'views/dashboard/virtualgodown.html',
    params: {
      'type': 1,
      'productid':null
        }
  }).state('home.myorg', {
    url: "",
    controller: 'myorgController',
    templateUrl: domainURL + 'views/dashboard/myassets.html'
  }).state('home.mybrands', {
        url: "",
        controller: 'mybrandController',
        templateUrl: domainURL + 'views/dashboard/mybrands.html'
  }).state('home.stockarea', {
    url: "",
    controller: 'ownController',
    templateUrl: domainURL + 'views/dashboard/stockarea.html'
  }).state('home.addproduct', {
    url: "",
    templateUrl: domainURL + 'views/dashboard/new_addproductinfo.html',
    controller: 'addproductinfoController'
  /*}).state('home.addproduct.addproductinfo', {
    url: "",
    templateUrl: domainURL + 'views/dashboard/addproductinfo.html',
    controller: 'addproductinfoController'
  }).state('home.addproduct.addbrand', {
    url: "",
    templateUrl: domainURL + 'views/dashboard/addbrand.html',
    controller: 'addbrandController'
  }).state('home.addproduct.addcategory', {
    url: "",
    templateUrl: domainURL + 'views/dashboard/addcategory.html',
    controller: 'addcategoryController'*/
  }).state('home.editproduct', {
    url: "",
    templateUrl: domainURL + 'views/dashboard/editproduct.html',
    params: {
      'productId': null
    },
    controller: 'editproductController'
  }).state('home.editbrand', {
    url: "",
    templateUrl: domainURL + 'views/dashboard/editbrand.html',
    params: {
      'brandId': null
    },
    controller: 'editbrandController'
  }).state('suggestproduct', {
    url: "/suggestproduct",
    templateUrl: domainURL + 'views/dashboard/suggestproduct.html',
    controller: 'suggestproductController',
    authenticate: 'true'
  }).state('FAQ', {
    url: "/faq",
    templateUrl: domainURL + 'views/dashboard/faq.html',
    controller: 'faqcontroller'
  }).state('createorg', {
    url: '/createorganisation',
    templateUrl: domainURL + 'views/dashboard/createorg.html',
    controller: 'createorgctrl'
  }).state('forgotPassword', {
    url: '/forgotPassword',
    templateUrl: domainURL + 'views/login/forgot-password.html',
    controller: 'forgotPasswordController',
    params: {
      'term': null
    },
    authenticate: 'false'
  }).state('resetPassword', {
    url: '/resetPassword/:token',
    templateUrl: domainURL + 'views/login/reset-password.html',
    controller: 'resetPasswordController'
    }).state('onVerifyAction', {
    url: 'onVerifyAction/{token}',
    controller: 'onVerifyActionController',
    authenticate: 'true'
  }).state('verifyemail', {
    url: '/verifyemail/{token}',
    templateUrl: domainURL + 'views/login/verifyemail.html',
    controller: 'verifyemailcontroller',
    authenticate: 'false'
  }).state('collabrator', {
    url: '/collabrator/:token/:value',
    controller: 'collabratorctrl'
  }).state('signUp', {
    url: '/signUp',
    templateUrl: domainURL + 'views/login/signup.html',
    controller: 'signupController',
    authenticate: 'false'
  }).state('settings', {
    url: '/settings',
    templateUrl: domainURL + 'views/dashboard/settings.html',
    controller: 'settingsController',
    authenticate: 'true'
  }).state('profile', {
    url: '/profile',
    templateUrl: domainURL + 'views/dashboard/profile.html',
    controller: 'profileController',
    authenticate: 'true'
  }).state('productprofile', {
    url: '/productProfile/:stockareaName/:productName',
    templateUrl: domainURL + 'views/dashboard/productprofile.html',
    controller: 'ProductProfileCtrl',
    authenticate: 'true'
  });
}]);
vgApp.directive('fileModel', ['$parse', function($parse) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var model = $parse(attrs.fileModel);
      var modelSetter = model.assign;

      element.bind('change', function() {
        scope.$apply(function() {
          modelSetter(scope, element[0].files[0]);
        });
      });
    }
  };
}]);
/**
 * Login Controller
 * Here we are going to handle user authentication and all
 */
vgApp.controller('loginController', ['$scope', '$state', '$log', 'loginService', 'Notification', 'localStorageService', '$rootScope', '$http', '$stateParams', function($scope, $state, $log, loginService, Notification, localStorageService, $rootScope, $http, $stateParams) {
  /*
   * Function for authenticating user
   */
   $rootScope.indexloader='false';

   $scope.forgotlogin=function(){
     $state.go('forgotPassword',{"term":$scope.email})
   }
  $scope.signup = function() {
    $state.go('signUp');

  };
  $rootScope.highlightcollabrator=null;

  var accessToken = localStorage.getItem("access_token");
  var userId = localStorage.getItem("userId");

  $scope.init = function() {
    if ($rootScope.info == null || $rootScope.info == undefined || !$rootScope.info) {
      $rootScope.smsg = "null";
    } else if ($rootScope.info == "changepassword") {
      $rootScope.smsg = "We have successfully reseted your password please login to continue";
    } else if ($rootScope.info == "token") {
      $rootScope.info = null;
      $scope.errormessage = "The link you are trying to access is expired.Try again";
    }
    if (!localStorage.getItem('orgId') || localStorage.getItem('orgId') == null || localStorage.getItem('userId') == null || localStorage.getItem('orgId') == undefined || localStorage.getItem('userId') == undefined || localStorage.getItem('access_token') == undefined || localStorage.getItem('access_token') == null) {} else {
      $http({
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          'userId': userId,
          'access_token': accessToken
        },
        url: domainURL + 'api/token/checktoken'
      }).then(function(data) {

        $rootScope.info = null;
        $state.go('home.virtualgodown');
      }, function(xhr, status, err) {});
    }

    if ($rootScope.error == 404) {
      $scope.errormessage = "Requested URL is not available";
    } else if ($rootScope.error > 500) {
      $scope.errormessage = "Error occured in Server please try again after some time";
    }
  };
  $rootScope.notify=function(){
  Notification.clearAll();
  Notification.error({message: '<div style="display:inline-block;"><i style="color:white" class="fa fa-warning"></i> It seems you have a connectivity issue</div><font ng-click="closeAll()" style="float:right;margin-left:20px;display:inline-block">X</font>', positionY: 'top', positionX: 'center',delay:10000000000000,verticalSpacing: 150,horizontalSpacing: 50});
  }
  $scope.close = function() {
    $rootScope.errormessage = null;
  };
  $rootScope.page = false;

  $scope.fnAuthenticateUser = function() {
    // Calling authentication Service here with userName and Password
    loginService.authenticateUser($scope.email.toLowerCase(), $scope.password).then(function(data) {
      if (data.data.token) {
      localStorage.setItem("access_token", data.data.token);
      localStorage.setItem("userId", data.data.userId);
    }
      loginService.getUserDetails().then(function(result) {
        if (localStorageService.isSupported) {
          if (!data.data.token) {
            Notification.error(data.data.message);
          } else {
            $rootScope.fullName = result.data.data.fullName;
            $rootScope.profilePic = result.data.data.profilePic;
            $rootScope.userId = result.data.data._id;
            $rootScope.org = result.data.data.org;
            localStorage.setItem("orgId", result.data.data.org[0].organisationId._id);
            $rootScope.orgId = result.data.data.org[0].organisationId._id;
            $rootScope.orgname = $rootScope.org[0].organisationId.organisationId;
            $rootScope.orgstatus = $rootScope.org[0].organisationId.status;
            $log.info("User Authenticated Successfully");
            $state.go("home.virtualgodown");
          }
        } else {
          Notification.error('Invalid Username/Password');
        }
        if (result.data.data.status == "pendingstock") {
          $rootScope.userstatus = "pending";
        }
      }, function(err) {
        $scope.access = false;
        $scope.loading = false;
      });

    }).catch(function(error) {
      Notification.error('Invalid Username/Password');
      $log.info("Invalid UserName/Password");

    });
  };
}]);



vgApp.controller('loginDashBoardController', ['$scope', '$state', '$http', '$location', '$log', 'loginService', 'Notification', 'localStorageService','$rootScope', function($scope, $state, $http, $location, $log, loginService, Notification, localStorageService,$rootScope) {
  /*
   * Function for authenticating user
   */
   $rootScope.indexloader='false';

   $rootScope.highlightcollabrator=null;
  var accessToken = localStorage.getItem("access_token");
  var userId = localStorage.getItem("userId");

  /* 		if(accessToken!==null){
   			$state.go('home')
   		}*/

  var accessToken = localStorage.getItem("access_token");
  var userId = localStorage.getItem("userId");
  if (accessToken === null) {
    if ($state.current.name == "login" || $state.current.name == "signUp" || $state.current.name == "forgotPassword") {} else {
      //if($state.current.name=="signUp" || $state.current.name=="resetPassword" || $state.current.name=="forgotPassword")
      $state.go("login");
    }
  } else {

    $http({
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        'userId': userId,
        'access_token': accessToken
      },
      url: domainURL + 'api/token/checktoken'
    }).then(function(data) {
      if ($state.current.name == "login" || $state.current.name == "signUp" || $state.current.name == "forgotPassword") {} else {
        //        $state.go('home.virtualgodown');
      }
    }, function(xhr, status, err) {
      localStorage.clear();
    });
  }
}]);



vgApp.controller('settingsController', ['$sce', '$scope', '$state', '$log', 'loginService', 'Notification', 'localStorageService', '$http', 'dashboardService', '$rootScope', '$timeout', '$uibModal', function($sce, $scope, $state, $log, loginService, Notification, localStorageService, $http, dashboardService, $rootScope, $timeout, $uibModal) {
  var fullname;
  var dob;
  $rootScope.indexloader='false';

  var address;
  $scope.validateEmail = function(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
  dashboardService.types().then(function(response) {
    $scope.types = response.data;
  });
  $rootScope.notify=function(){
  Notification.clearAll();
    Notification.error({message: '<div style="display:inline-block;margin-left:20px;"><i style="color:white" class="fa fa-warning"></i> Internet connection Error</div><font ng-click="closeAll()" style="float:right;display:inline-block">X</font>', positionY: 'top', positionX: 'center',delay:10000000000000,verticalSpacing: 50,horizontalSpacing: 20});
  }
  $scope.orgto = "till-now";
  $rootScope.highlightcollabrator=null;
  $scope.submitotp = function() {
    if ($scope.motp == null) {

    } else {
      loginService.submitotp($scope.motp).then(function(result) {
        $scope.otp = false;
        $scope.otp1 = false;
        $scope.init();
        $scope.editStockarea(localStorage.getItem('selectedStockareaId'));
        Notification.success("Mobile Number Verified Successfully");
      }, function(err) {
        Notification.error(err);
      });
    }
  };
  $scope.adrs = true;
  $scope.secmails = [];
  $scope.init = function() {
    $rootScope.loading = true;
    $scope.newsa = false;
    loginService.getUserDetails().then(function(data) {
      $rootScope.loading = false;
      $scope.newup = false;
      $scope.fullname = data.data.data.fullName;
      $scope.mobile = data.data.data.primaryMobile;
      $scope.mobilep = $scope.mobile;
      $rootScope.profilePic = data.data.data.profilePic;
      $scope.mobiles = data.data.data.mobile;
      $scope.email = data.data.data.userName;
      $scope.emailp = data.data.data.userName;
      $scope.emails = data.data.data.email;
      $scope.emailss = data.data.data.email;
      $scope.semail = data.data.data.secondaryEmail;
      if (data.data.data.dob == null || !data.data.data.dob || data.data.data.dob == undefined) {} else {
        $scope.dob = data.data.data.dob.slice(0, 10);
      }
      $scope.company = data.data.data.company;
      $scope.pincode = data.data.data.pincode;
      $scope.address = data.data.data.address;
      $scope.city = data.data.data.city;
      $scope.state = data.data.data.state;
      $scope.country = data.data.data.country;
      $scope.organisation = data.data.data.organisation;
      $scope.url = data.data.data.profilePic;
      $scope.myFile = null;
      for (var k = 0; k < $scope.emailss.length; k++) {
        if ($scope.emailss[k].email !== $scope.email) {
          $scope.secmails.push({
            "email": $scope.emailss[k].email
          });
        }
      }
      $scope.f = $scope.fullname;
      $scope.d = $scope.dob;
      $scope.a = $scope.address;
      dashboardService.getallstockareas($rootScope.orgId).then(function(result) {
        $scope.stockareas = result.data.data;
        if ($rootScope.editSelectedStockarea == true) {
          $scope.tab = 5;
          $scope.subtab = 1;
          $scope.viewstockarea(localStorage.getItem('selectedStockareaId'));
        }
      });
        });
    var map2;

  }
var mapstyle=[{
    "featureType": "administrative.country",
    "elementType": "geometry.fill",
    "stylers": [{
      "color": "#f5f5f5"
    }]
  },
  {
    "elementType": "geometry.fill",
    "stylers": [{
      "color": "#e6e6e6"
    }]
  },
  {
    "elementType": "labels.icon",
    "stylers": [{
      "visibility": "off"
    }]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [{
      "color": "#616161"
    }]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [{
      "color": "#f5f5f5"
    }]
  },
  {
    "featureType": "administrative.country",
    "elementType": "geometry.stroke",
    "stylers": [{
      "color": "#cfcfcf"
    }]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [{
      "color": "#bdbdbd"
    }]
  },
  {
    "featureType": "administrative.province",
    "elementType": "geometry.fill",
    "stylers": [{
        "color": "#e6e6e6"
      },
      {
        "weight": 1.5
      }
    ]
  },
  {
    "featureType": "administrative.province",
    "elementType": "geometry.stroke",
    "stylers": [{
      "color": "#cccccc"
    }]
  },
  {
    "featureType": "landscape.man_made",
    "elementType": "geometry.fill",
    "stylers": [{
      "color": "#f2f5f5"
    }]
  },
  {
    "featureType": "landscape.natural",
    "elementType": "geometry.fill",
    "stylers": [{
      "color": "#f2f5f5"
    }]
  },
  {
    "featureType": "landscape.natural.landcover",
    "elementType": "geometry",
    "stylers": [{
      "color": "#ffffff"
    }]
  },
  {
    "featureType": "landscape.natural.landcover",
    "elementType": "geometry.fill",
    "stylers": [{
      "color": "#f2f5f5"
    }]
  },
  {
    "featureType": "landscape.natural.landcover",
    "elementType": "geometry.stroke",
    "stylers": [{
      "color": "#ffffff"
    }]
  },
  {
    "featureType": "landscape.natural.terrain",
    "elementType": "geometry.fill",
    "stylers": [{
      "color": "#f2f5f5"
    }]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [{
      "visibility": "off",
      "color": "#eeeeee"
    }]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [{

      "visibility": "off",
      "color": "#757575"
    }]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [{
      "color": "#e5e5e5"
    }]
  },
  {
    "featureType": "road",
    "stylers": [{
      "visibility": "off"
    }]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [{
      "color": "#ffffff"
    }]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels.text.fill",
    "stylers": [{
      "color": "#757575"
    }]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [{
      "color": "#dadada"
    }]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [{
      "color": "#616161"
    }]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [{
      "color": "#9e9e9e"
    }]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [{
      "color": "#e5e5e5"
    }]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [{
      "color": "#eeeeee"
    }]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [{
      "color": "#c9c9c9"
    }]
  },
  {
    "featureType": "water",
    "elementType": "geometry.fill",
    "stylers": [{
        "color": "#b7e1ef"
      },
      {
        "weight": 2.5
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry.stroke",
    "stylers": [{
      "color": "#b3b3b3"
    }]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [{
      "color": "#9e9e9e"
    }]
  }
]

  dashboardService.codes().then(function(data) {
    $scope.codes = data.data.data.code;
    $scope.code = "+91";
  })
  $scope.ud = false;
  $scope.userd = function() {
    $scope.ud = true;
  }
  $scope.tab5 = function() {
    $scope.tab = 5;
    $scope.subtab = 1;
    $scope.viewstockarea($scope.stockareas[0]._id);
  };
  $scope.updateprofile = function() {
    var profile = {
      "fullName": $scope.fullname,
      "dob": $scope.dob,
      "address": $scope.address
    };
    if ($scope.f == $scope.fullname && $scope.d == $scope.dob && $scope.a == $scope.address) {} else {
      loginService.updateprofile(profile).then(function(result) {
        Notification.success("Personal information updated successfully.")
        $scope.init();
      }, function(err) {
        Notification.error("Error updating personal information");
      })
    }
  }

  $scope.updatepassword = function() {
    $scope.p = $scope.oldpassword;
    $scope.n = $scope.newpassword;
    loginService.updatepassword($scope.oldpassword, $scope.newpassword).then(function(result) {
      $scope.init();
      Notification.success('Password updated successfully');
      $scope.oldpassword = null;
      $scope.newpassword = null;
    }, function(err) {
      Notification.error("Error updating password");
    })
  }
  $scope.myFile = null;
  $scope.myCroppedImage = '';
  $scope.myImage = '';
  $scope.uploadFile = function(file) {
    if (file) {
      // ng-img-crop
      var imageReader = new FileReader();
      imageReader.onload = function(image) {
        $scope.$apply(function($scope) {
          $scope.myImage = image.target.result;
        });
      };
      imageReader.readAsDataURL(file);
    }
  };
  $scope.urltoFile = function(url, filename, mimeType) {
    return (fetch(url)
      .then(function(res) {
        return res.arrayBuffer();
      })
      .then(function(buf) {
        return new File([buf], filename, {
          type: mimeType
        });
      })
    );
  }

  //Usage example:

  $scope.progress = true;
  $scope.uploadimg = function() {
    loginService.geturl($scope.img).then(function(data) {
      $scope.urltoFile($scope.myCroppedImage, data.data.name + '.jpg', 'image/jpeg')
        .then(function(file) {
          var buf = file;
          var signedRequest = data.data.signed_request;
          var url = data.data.url;

          $scope.progress = false;
          $.ajax({
            type: "PUT",
            data: buf,
            url: signedRequest,
            processData: false,
            contentType: false,
            success: function(data) {
              loginService.updateprofilepic(url).then(function(data) {
                $rootScope.profilePic = url;
                $scope.progress = true;
                $scope.myCroppedImage = null;
                $state.reload();
                Notification.success('profile picture updated successfully');

              }, function(err) {
                Notification.error('profile picture update failed');

              });
            }.bind(this),
            error: function(xhr, status, err) {
              Notification.error('profile picture update failed');
            }.bind(this)
          });
        });
    });
  };
  $('#fileInput').change(function() {
    $scope.newup = true;
  });
  $scope.uploadnewprofile = function() {
    $scope.newup = true;
  };
  $rootScope.loading = true;
  $scope.viewstockarea = function(stockareaId) {
    $scope.view = true;
    $scope.newsa = false;
    $scope.stockareaId = stockareaId;
    $scope.readname = true;
    $scope.htmlTextToolTip = $sce.trustAsHtml('<div class="packageNameTooltip">You cannot change stockarea name.</div>');
    var styledMapType = new google.maps.StyledMapType(mapstyle, {
      name: 'Styled Map'
    });



    var myGeocoder = new google.maps.Geocoder({
      region: 'IN'
    });
    dashboardService.stockareaInfo(stockareaId).then(function(data) {

      $rootScope.loading = false;
      $scope.stockareaemails = data.data.data[0].emails;
      $scope.stockareamobiles = data.data.data[0].mobiles;
      $scope.stockareamobile = data.data.data[0].phone;
      $scope.stockareamobilep = data.data.data[0].phone;
      $scope.stockareaemail = data.data.data[0].primaryemail;
      $scope.stockareaemailp = data.data.data[0].primaryemail;
      $scope.stockareaId = data.data.data[0]._id;
      $scope.stockareaName = data.data.data[0].stockareaName;
      $scope.latitude = data.data.data[0].latitude;
      $scope.la = data.data.data[0].latitude;
      $scope.longitude = data.data.data[0].longitude;
      $scope.lon = data.data.data[0].longitude;
      $scope.address1 = data.data.data[0].address;
      $scope.add1 = data.data.data[0].address;
      $scope.phone = parseInt(data.data.data[0].phone);
      $scope.ph = parseInt(data.data.data[0].phone);
      $scope.lati = parseFloat($scope.latitude);
      $scope.lngi = parseFloat($scope.longitude);

      var markers = [];
      var map2 = new google.maps.Map(document.getElementById('map2'), {
        //minZoom: 3,
        zoom: 3,
        fullscreenControl: false,
        center: new google.maps.LatLng($scope.lati, $scope.lngi),
        mapTypeId: 'roadmap',
        mapTypeControl: false,
        streetViewControl: false,
        mapTypeControlOptions: {
          mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain',
            'styled_map'
          ]
        }
      });

      //		map2.mapTypes.set('styled_map', styledMapType);
      //	map2.setMapTypeId('styled_map');
      google.maps.event.trigger(map2, 'resize');
      //var myLatLng = {lat: 22.745154893908804, lng: 78.25780350000002};
      var myLatLng = {
        lat: $scope.lati,
        lng: $scope.lngi
      };
      var marker = new google.maps.Marker({
        position: myLatLng,
        draggable: false,
        optimized: false,
        map: map2
      });
      markers.push(marker);

    });
  };

  $scope.editStockarea = function(stockareaId) {
    $scope.view = false;
    $scope.newsa = false;
    $scope.stockareaId = stockareaId;
    $scope.readname = true;
    $scope.htmlTextToolTip = $sce.trustAsHtml('<div class="packageNameTooltip">You cannot change stockarea name.</div>');
    var styledMapType = new google.maps.StyledMapType(mapstyle, {
      name: 'Styled Map'
    });



    var myGeocoder = new google.maps.Geocoder({
      region: 'IN'
    });
    dashboardService.stockareaInfo(stockareaId).then(function(data) {

      $rootScope.loading = false;
      $scope.stockareaemails = data.data.data[0].emails;
      $scope.stockareamobiles = data.data.data[0].mobiles;
      $scope.stockareamobile = data.data.data[0].phone;
      $scope.stockareamobilep = data.data.data[0].phone;
      $scope.stockareaemail = data.data.data[0].primaryemail;
      $scope.stockareaemailp = data.data.data[0].primaryemail;
      $scope.stockareaId = data.data.data[0]._id;
      $scope.stockareaName = data.data.data[0].stockareaName;
      $scope.latitude = data.data.data[0].latitude;
      $scope.la = data.data.data[0].latitude;
      $scope.longitude = data.data.data[0].longitude;
      $scope.lon = data.data.data[0].longitude;
      $scope.address1 = data.data.data[0].address;
      $scope.add1 = data.data.data[0].address;
      $scope.phone = parseInt(data.data.data[0].phone);
      $scope.ph = parseInt(data.data.data[0].phone);
      $scope.lati = parseFloat($scope.latitude);
      $scope.lngi = parseFloat($scope.longitude);

      var markers = [];
      var map2 = new google.maps.Map(document.getElementById('map2'), {
        //minZoom: 3,
        zoom: 3,
        fullscreenControl: false,
        center: new google.maps.LatLng($scope.lati, $scope.lngi),
        mapTypeId: 'roadmap',
        mapTypeControl: false,
        streetViewControl: false,
        mapTypeControlOptions: {
          mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain',
            'styled_map'
          ]
        }
      });

      google.maps.event.trigger(map2, 'resize');
      //var myLatLng = {lat: 22.745154893908804, lng: 78.25780350000002};
      var myLatLng = {
        lat: $scope.lati,
        lng: $scope.lngi
      };
      var marker = new google.maps.Marker({
        position: myLatLng,
        draggable: true,
        optimized: false,
        map: map2
      });
      markers.push(marker);
      //displayPosition($scope,{lat: function(){return 51.501476;},lng: function(){return -0.140634; }});
      google.maps.event.addListener(marker, 'dragend', function(e) {
        displayPosition($scope, this.getPosition());
      });
      // click response
      google.maps.event.addListener(marker, 'click', function(e) {
        displayPosition($scope, this.getPosition());
      });

      var input = document.getElementById('searchmap');
      var searchBox = new google.maps.places.SearchBox(input);
      google.maps.event.addListener(searchBox, 'places_changed', function() {
        var places = searchBox.getPlaces();
        if (places.length == 0) {
          return;
        }
        for (var i = 0, marker; marker = markers[i]; i++) {
          marker.setMap(null);
        }
        markers = [];
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0, place; place = places[i]; i++) {
          var image = {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
          };
          map2.setOptions({
            minZoom: 1,
            maxZoom: 16
          });
          marker = new google.maps.Marker({
            draggable: true,
            map: map2,
            title: place.name,
            optimized: false,
            position: place.geometry.location
          });
          displayPosition($scope, place.geometry.location);
          // drag response
          google.maps.event.addListener(marker, 'dragend', function(e) {
            displayPosition($scope, this.getPosition());
          });
          // click response
          google.maps.event.addListener(marker, 'click', function(e) {
            displayPosition($scope, this.getPosition());
          });
          markers.push(marker);
          bounds.extend(place.geometry.location);
        }
        map2.fitBounds(bounds);
      });




      google.maps.event.addListener(map2, 'bounds_changed', function() {
        var bounds = map2.getBounds();
        searchBox.setBounds(bounds);
      });
    })
  }
  $scope.newstockarea = function() {
    $scope.view = false;
    $scope.newsa = true;
    $scope.readname = false;
    $scope.stockareaId = null;
    $scope.stockareaName = null;
    $scope.latitude = null;
    $scope.longitude = null;
    $scope.phone = null;
    $scope.stockareamobile = null;
    $scope.stockareamobiles = null;
    $scope.stockareaemails = null;
    $scope.stockareaemail = null;
    $scope.address1 = null;
    $scope.htmlTextToolTip = null;
  }
  $scope.addprimary = function() {
    if ($scope.pe == $scope.emailp) {} else {
      loginService.addprimary($scope.emailp).then(function(result) {
        if (result.data.code == 200) {
          $scope.pe = $scope.emailp;
          $scope.init();
          Notification.success($scope.emailp + 'is made as your primary email');
        } else if (result.data.code == 413) {
          Notification.error($scope.emailp + " is not verified");
        } else {
          Notification.error($scope.emailp + "as primary update Failed");
        }
      }, function(err) {
        Notification.error($scope.emailp + "as primary update Failed");
      })
    }
  }
  $scope.getstockareainfo = function(stockareaId) {
    dashboardService.stockareaInfo(stockareaId).then(function(data) {
      $scope.stockareaemails = data.data.data[0].emails;
      $scope.stockareamobiles = data.data.data[0].mobiles;
      $scope.stockareamobile = data.data.data[0].phone;
      $scope.stockareaemail = data.data.data[0].primaryemail;
      $scope.stockareaId = data.data.data[0]._id;
      $scope.stockareaName = data.data.data[0].stockareaName;
      $scope.stockareaemailp = $scope.stockareaemail;
      $scope.stockareamobilep = $scope.stockareamobile;
      $scope.latitude = data.data.data[0].latitude;
      $scope.longitude = data.data.data[0].longitude;
      $scope.address1 = data.data.data[0].address;
      $scope.phone = parseInt(data.data.data[0].phone);
      $scope.lati = parseFloat($scope.latitude);
      $scope.lngi = parseFloat($scope.longitude);


    })
  }
  $scope.addprimarymobile = function() {
    if ($scope.mobilep !== null || $scope.mobilep !== $scope.mobile) {
      loginService.addprimarymobile($scope.mobilep).then(function(result) {
        if (result.data.code == 200) {
          $scope.init();
          Notification.success($scope.mobilep + 'is made as your primary mobilenumber');
        } else if (result.data.code == 413) {
          Notification.error($scope.mobilep + " is not verified");
        } else {
          Notification.error($scope.mobilep + "as primary update Failed");
        }
      }, function(err) {
        Notification.error(" mobile number update Failed");
      })
    }
  }
  $scope.addprimarystockarea = function() {
    if ($scope.stockareaemailp == null || !$scope.stockareaemailp) {
      Notification.error("please select a valid email");
    } else {
      loginService.addprimarystockarea($scope.stockareaemailp, $scope.stockareaId).then(function(result) {
        if (result.data.code == 200) {
          $scope.getstockareainfo($scope.stockareaId);
          Notification.success($scope.stockareaemailp + 'is made as your primary email');
        } else if (result.data.code == 413) {
          Notification.error($scope.stockareaemailp + " is not verified");
        } else {
          Notification.error($scope.stockareaemailp + "as primary update Failed");
        }
      }, function(err) {
        Notification.error($scope.stockareaemailp + "as primary update Failed");
      })
    }
  }
  $scope.addprimarymobilestockarea = function() {
    if ($scope.stockareamobilep == null || !$scope.stockareamobilep) {
      Notification.error("please select a valid email");
    } else {
      loginService.addprimarymobilestockarea($scope.stockareamobilep, $scope.stockareaId).then(function(result) {
        if (result.data.code == 200) {
          $scope.getstockareainfo($scope.stockareaId);
          Notification.success($scope.stockareamobilep + 'is made as your primary mobilenumber');
        } else if (result.data.code == 413) {
          Notification.error($scope.stockareamobilep + " is not verified");
        } else {
          Notification.error($scope.stockareamobilep + "as primary update Failed");
        }
      }, function(err) {
        Notification.error(" mobile number update Failed");
      })
    }
  }
  $scope.id1 = false;
  $scope.deleteemail = function(email) {
    loginService.deleteemail(email).then(function(result) {
      $scope.init();
      Notification.success(email + ' deleted successfully');

    }, function(err) {
      Notification.error(email + "delete Failed");
    })
  }
  $scope.deletemobile = function(mobile) {
    loginService.deletemobile(mobile).then(function(result) {
      $scope.init();
      Notification.success(mobile + 'deleted successfully');

    }, function(err) {
      Notification.error(mobile + "delete Failed");
    })
  }
  $scope.deleteemailstockarea = function(email) {
    loginService.deleteemailstockarea(email, $scope.stockareaId).then(function(result) {
      $scope.getstockareainfo($scope.stockareaId);
      Notification.success(email + ' deleted successfully');
    }, function(err) {
      Notification.error(email + "delete Failed");
    })
  }
  $scope.deletemobilestockarea = function(mobile) {
    loginService.deletemobilestockarea(mobile, $scope.stockareaId).then(function(result) {
      $scope.getstockareainfo($scope.stockareaId);
      Notification.success(mobile + 'deleted successfully');

    }, function(err) {
      Notification.error(mobile + "delete Failed");
    })
  }
  $scope.addsecondary = function() {
    if ($scope.se == $scope.semail) {} else {
      loginService.addsecondary($scope.semail).then(function(result) {
        $scope.se = $scope.semail;
        $scope.init();
        Notification.success('seconday mail updated successfully');
      }, function(err) {
        Notification.error("Update Failed");
      })
    }
  }
  $scope.addnewmail = function() {
    if ($scope.pe == $scope.emailnew && $scope.pe == null || !$scope.validateEmail($scope.emailnew)) {
      Notification.error(" enter valid email Id ")
    } else {
      loginService.addnewmail($scope.emailnew).then(function(result) {
        if (result.data.code != "200") {
          Notification.error('Email id already associated with another account');
        } else {
          $scope.em = $scope.emailnew;
          Notification.success('Email added successfully');
          $scope.emailnew = null;
          $scope.init();
        }
      }, function(err) {
        Notification.error('Error adding emailId');
      })
    }
  }
  $scope.addnewmailstockarea = function() {
    if (!$scope.stockareaemailnew || $scope.stockareaemailnew == null || !$scope.validateEmail($scope.stockareaemailnew)) {
      Notification.error('Enter valid emailId');
    } else {
      loginService.addnewmailstockarea($scope.stockareaemailnew, $scope.stockareaId).then(function(result) {
        $scope.getstockareainfo($scope.stockareaId);
        if (result.data.code != "200") {
          Notification.error('email id already associated with another account');
        } else {
          Notification.success('Email added successfully')
          $scope.stockareaemailnew = null;
        }
      }, function(err) {
        Notification.error('Error adding emailId');
      })
    }
  }
  $scope.addnewmobilestockarea = function() {
    if ($scope.stockareamobilenew == null || $scope.stockareamobilenew == "+91") {} else {
      loginService.addnewmobilestockarea($scope.stockareamobilenew, $scope.code, $scope.stockareaId).then(function(result) {
        if (result.data.code != "200") {
          Notification.error('Mobile number already associated with another account');
        } else {
          Notification.success('Mobilenumber added successfully')
          $scope.stockareamobilenew = null;
          $scope.getstockareainfo($scope.stockareaId);
        }
      }, function(err) {
        Notification.error('Error adding Mobilenumber');
      })
    }
  }
  $scope.addnewmobile = function() {
    if ($scope.mobilenew == null || $scope.mobilenew == "+91") {} else {
      loginService.addnewmobile($scope.mobilenew, $scope.code).then(function(result) {
        if (result.data.code != "200") {
          Notification.error('Mobile NUmber already associated with another account');
        } else {
          Notification.success('Mobilenumber added successfully');
          $scope.mobilenew = null;
          $scope.init();
        }
      }, function(err) {
        Notification.error('Error adding Mobilenumber');
      });
    }
  };
  $scope.updateorganisation = function() {


    if ($scope.id == null) {
      if ($scope.orgname == null || $scope.orgas == null || $scope.orgfrom == null || $scope.orgto == null) {
        Notification.error("Please check the inputs");
      } else {
        loginService.updateorganisation($scope.orgname, $scope.orgas, $scope.orgfrom, $scope.orgto).then(function(result) {
          $scope.orgfrom = " ";
          $scope.orgas = " ";
          $scope.orgname = " ";
          $scope.orgto = "till-now";
          $scope.id = null;
          $scope.id1 = false;
          $scope.init();
          Notification.success("Organisation details added successfully.")
        }, function(err) {
          Notification.error("Error adding organisation details");
        });
      }
    } else {
      loginService.editorganisation($scope.id, $scope.orgname, $scope.orgas, $scope.orgfrom, $scope.orgto).then(function(result) {
        $scope.id1 = false;
        $scope.init();
        Notification.success("Organisation details edited successfully.")
      }, function(err) {
        Notification.error("Error updating organisation details");
      })
    }

  }
  $scope.selectorg = function(id) {
    $scope.id = id
    for (var j = 0; j < $scope.organisation.length; j++) {
      if ($scope.organisation[j]._id == id) {
        $scope.id1 = true;
        $scope.orgname = $scope.organisation[j].name;
        $scope.orgas = $scope.organisation[j].as;
        $scope.orgfrom = $scope.organisation[j].from;
        $scope.orgto = $scope.organisation[j].to;

      }
    }
  }
  $scope.resetorg = function() {
    $scope.orgfrom = "";
    $scope.orgas = "";
    $scope.orgname = "";
    $scope.orgto = "till-now";
    $scope.id1 = false;
  }
  $scope.showmap = true;
  $scope.addnew = function() {
    $scope.id1 = true;
    $scope.orgfrom = "";
    $scope.orgas = "";
    $scope.orgname = "";
    $scope.orgto = "till-now";
  }
  $scope.getDateFormat = function(bDate, eDate) {
    var beginDate = new Date(bDate);
    var endDate = new Date(eDate);

    if (beginDate.getDate() == endDate.getDate())
      return 'HH:mm';
    else
      return 'MM.yyyy';
  }
  $scope.editorganisation = function(id) {


    loginService.editorganisation(id, $scope.orgname, $scope.orgas, $scope.orgfrom, $scope.orgto).then(function(result) {
      $scope.init();
      Notification.success("Organisation details edited successfully")
    }, function(err) {
      Notification.error("Error updating organisation details");
    })
  }
  $scope.verify = function(email) {
    loginService.verify(email).then(function(result) {
      Notification.success('Mail sent successfully');
      $scope.init();
    }, function(err) {
      Notification.error('Mail Not sent !Error');
    })
  }
  $scope.otp = false;
  $scope.verifymobile = function(mobile) {
    $scope.hours = 0;
    $scope.minutes = 60;
    loginService.verifymobile(mobile).then(function(result) {
      if (result.data.code == 200) {
        $scope.otp = true;
        Notification.success('Otp sent successfully');
        $scope.countdown();
      } else {
        Notification.error('Otp Not sent !Error');

      }
    }, function(err) {
      Notification.error('Otp Not sent !Error');
    })
  }
  $scope.otp1 = false;
  $scope.verifymobile1 = function(mobile) {
    $scope.hours1 = 0;
    $scope.minutes1 = 60;
    loginService.verifymobile(mobile).then(function(result) {
      Notification.success('Otp sent successfully');
      var dialogInst = $uibModal.open({
        templateUrl: 'views/dashboard/otp.html',
        controller: 'otpctrl',
        size: 'sm',
        resolve: {
          minute: function() {
            return 60;
          },
          hour: function() {
            return 0;
          },
          stockareaId: function() {
            return $scope.stockareaId;
          }
        }
      });
      dialogInst.result.then(function(fmsid) {

      }, function(data) {
        if (data == 'cancel') {

        } else {
          $scope.init();
          $scope.viewstockarea($scope.stockareaId);
        }
      })
    });

  }
  $scope.account = 1;
  $scope.deleteuser = function() {
    loginService.deleteuser($scope.password).then(function(result) {
      if (result.data.code == "200") {
        Notification.success("User deleted Successfully");
        $scope.ud = false;
        localStorage.clear();
        $state.go("login");
      } else {
        Notification.error("you entered wrong password");
      }
    }, function(err) {
      Notification.error(err)
    });

  }

  $scope.countdown = function myhandler() {

    if ($scope.minutes == 0 && $scope.hours == 0) {
      return;
    } else {
      if ($scope.minutes == 0) {
        $scope.minutes = 60;
        $scope.hours--;
      } else {
        $scope.minutes--;
      }

    }
    $timeout(myhandler, 1000, $scope.false());
  }
  $scope.false = function() {
    if ($scope.minutes == 0) {
      $scope.otp = false;
    }
  }
  $scope.deleteemail = function(email) {
    loginService.deleteemail(email).then(function(result) {
      $scope.init();
      Notification.success(email + "deleted successfully")
    }, function(err) {
      Notification.error(email + "Delete failed");
    })
  }
  $scope.deleteorganisation = function(id) {
    loginService.deleteorganisation(id).then(function(result) {
      $scope.init();
      Notification.success("Organisation details deleted successfully")
    }, function(err) {
      Notification.error("Organisation delete failed");
    })
  }


  $scope.checkname = function() {
    if ($scope.stockareaName == null || $scope.stockareaName.length == undefined) {
      $scope.na = "stockarea name is required";
      $scope.state = null;
    } else if ($scope.stockareaName.length > 2) {
      $scope.na = null;
      dashboardService.checkname($scope.stockareaName).then(function(resp) {
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
  $scope.latc = function() {
    if ($scope.latitude == null) {
      $scope.lat = "This feild is required";
    } else {
      $scope.lat = null;
    }
  }
  $scope.lonc = function() {

    if ($scope.longitude == null) {
      $scope.lon = "This feild is required";
    } else {
      $scope.lon = null;
    }
  }
  $scope.addc = function() {

    if ($scope.address1 == null) {
      $scope.add = "This feild is required";
    }
  }
  $scope.namec = function() {

    if ($scope.stockareaName == null) {
      $scope.na = "stockarea name is required";
    }
  }
  $scope.phc = function() {
    if ($scope.phone == null) {
      $scope.ph1 = "Phone number is required";
    }
  }
  $scope.phonechange = function() {
    if ($scope.phone == null) {
      $scope.ph = "Phone number is required";
      $scope.phonestate = null;
    } else {
      $scope.ph = null;
      dashboardService.phonechange($scope.phone).then(function(resp) {
        $scope.exist = resp.data.data.exist;
        if ($scope.exist == false) {
          $scope.phonestate = "exist";
        } else {
          $scope.phonestate = "Not exist!";
        }
      })
    }
  }
  $scope.fnAddStockarea = function(stockareaId) {

    if ($scope.stockareaName !== null && $scope.latitude !== null && $scope.longitude !== null && $scope.phone !== null && $scope.stockareaName !== undefined && $scope.latitude !== undefined && $scope.longitude !== undefined && $scope.phone !== undefined) {
      if ($scope.stockareaId == null || $scope.stockareaId == undefined) {

        var data = {
          "stockareaName": $scope.stockareaName,
          "latitude": $scope.latitude,
          "longitude": $scope.longitude,
          "phone": $scope.phone,
          "code": $scope.code,
          "address": $scope.address1,
          "organisationId": $rootScope.orgId
        };
        if ($scope.exist == false) {
          dashboardService.postAddStockarea(data).then(function(result) {
            Notification.success('Stockarea added successfully');

            $state.go('home.virtualgodown');
          }, function(error) {
            Notification.error('Stockarea Not Added');
          });
        }
      } else {
        var data = {
          "Id": $scope.stockareaId,
          "latitude": $scope.latitude,
          "longitude": $scope.longitude,
          "phone": $scope.phone,
          "code": $scope.code,
          "address": $scope.address1
        };
        if ($scope.la === $scope.latitude && $scope.lon === $scope.longitude && $scope.ph === $scope.phone && $scope.add1 === $scope.address1) {} else {
          dashboardService.updatestockarea(data).then(function(result) {
            $scope.view = true;
            Notification.success('Stockarea Updated successfully');
          }, function(error) {
            Notification.error('Stockarea Not Added');
          });
        }
      }
    } else {
      if ($scope.stockareaName == null || $scope.stockareaName == undefined) {
        $scope.na = "stockarea name required";
      }
      if ($scope.phone == null) {
        $scope.phonestate = null;
        $scope.ph = "Phone number is required";
      }
    }
  }

}]);

vgApp.controller('profileController', ['$scope', '$state', '$log', 'loginService', 'Notification', 'localStorageService', '$rootScope', function($scope, $state, $log, loginService, Notification, localStorageService, $rootScope) {
  $rootScope.indexloader='false';

  $scope.options = {
    maximize: false, // very important otherwise it will overload the custom data
    data: {
      x: 261,
      y: 7,
      width: 56,
      height: 56
    } // those are arbitrary values
  };
  $scope.init = function() {
    $rootScope.loading = true;
    $scope.newup = false;
    loginService.getUserDetails().then(function(data) {
      $rootScope.loading = false;
      $scope.fullname = data.data.data.fullName;
      if (data.data.data.dob == null || !data.data.data.dob || data.data.data.dob == undefined) {} else {
        $scope.dob = data.data.data.dob.slice(0, 10);
      }
      $scope.mobile = data.data.data.phone;
      $scope.email = data.data.data.userName;
      $scope.company = data.data.data.company;
      $scope.address = data.data.data.address;
      $scope.url = data.data.data.profilePic;
    });
    loginService.gethistoryview().then(function(data) {
      $scope.history = data.data.data;
    });
  };
  $scope.myFile = null;
  $scope.myCroppedImage = '';
  $scope.myImage = '';
  $scope.uploadFile = function(file) {
    if (file) {
      // ng-img-crop
      var imageReader = new FileReader();
      imageReader.onload = function(image) {
        $scope.$apply(function($scope) {
          $scope.myImage = image.target.result;
        });
      };
      imageReader.readAsDataURL(file);
    }
  };
  $scope.urltoFile = function(url, filename, mimeType) {
    return (fetch(url)
      .then(function(res) {
        return res.arrayBuffer();
      })
      .then(function(buf) {
        return new File([buf], filename, {
          type: mimeType
        });
      })
    );
  }

  //Usage example:

  $scope.settings = function() {
    $state.go('settings')
  }
  $scope.progress = true;
  $scope.uploadimg = function() {
    loginService.geturl($scope.img).then(function(data) {
      $scope.urltoFile($scope.myCroppedImage, data.data.name + '.jpg', 'image/jpeg')
        .then(function(file) {
          var buf = file;
          var signedRequest = data.data.signed_request;
          var url = data.data.url;
          var image = new Image();
          image.src = $scope.myCroppedImage;
          $scope.progress = false;
          $.ajax({
            type: "PUT",
            data: buf,
            url: signedRequest,
            processData: false,
            contentType: false,
            success: function(data) {
              loginService.updateprofilepic(url).then(function(data) {
                $rootScope.profilePic = url;
                $scope.progress = true;
                Notification.success('profile picture updated successfully');
                $scope.myCroppedImage = null;
                $state.reload();
              }, function(err) {
                Notification.error('profile picture update failed');

              })
            }.bind(this),
            error: function(xhr, status, err) {
              Notification.error('profile picture update failed');
            }.bind(this)
          });
        })
    })
  }
  $('#fileInput').change(function() {
    $scope.newup = true;
  });
  $scope.uploadnewprofile = function() {
    $scope.newup = true;
  }
}]);
vgApp.controller('signupController', ['$scope', '$uibModal', '$rootScope', '$state', '$log', 'loginService', 'Notification', 'localStorageService', function($scope, $uibModal, $rootScope, $state, $log, loginService, Notification, localStorageService) {
  $scope.login = function() {
    $state.go('login')

  }
  $rootScope.indexloader='false';

  // Register user function calling here!
  var accessToken = localStorage.getItem("access_token");
  var userId = localStorage.getItem("userId");
  if (accessToken != null || accessToken != undefined) {
    loginService.isAuthenticated().then(function(data) {
      $state.go('home.virtualgodown')
    }, function(err) {})
  }
  $scope.validatepassword = function(password) {
  var re =   /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
  return re.test(password);
}
$scope.passwordchange=function(){
if($scope.userPassword == null){
  $scope.passworderror='empty';
}else if($scope.validatepassword($scope.userPassword)){
  $scope.passworderror=false;
}else{
  $scope.passworderror=true;
}
}
  $scope.emailchange = function() {
    if ($scope.email == null || $scope.email.length == undefined) {
      $scope.emailstate = 'empty';
    } else if ($scope.email.length > 6 && $scope.validateEmail($scope.email)) {
      loginService.emailchange($scope.email).then(function(resp) {
        $scope.exist = resp.data.data.exist;
        if ($scope.exist == false) {
          $scope.emailstate = "exist";
        } else {
          $scope.emailstate = "Not exist!";
        }
      })
    } else if ($scope.email.length < 6 || $scope.email.length == 6 || !$scope.validateEmail($scope.email)) {
      $scope.emailstate = "Not exist!";
    }
  }
  $scope.namechange=function(){
    if($scope.fullName == null){
      $scope.namestate='empty';
    }else{
      $scope.namestate='';
    }
  }
  $scope.useridchange = function() {
    if ($scope.userid == null || $scope.userid.length == undefined) {
      $scope.useridstate = 'empty';
    } else if ($scope.userid.length > 6) {
      loginService.useridchange($scope.userid).then(function(resp) {
        $scope.exist = resp.data.data.exist;
        if ($scope.exist == false) {
          $scope.useridstate = "exist";
        } else {
          $scope.useridstate = "Not exist!";
        }
      })
    } else{
      $scope.useridstate = "Not exist!";
    }
  }
  $scope.validateEmail = function(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
  $scope.viewTerms = function(data, tradeSourceId) {
    var dialogInst = $uibModal.open({
      templateUrl: domainURL + 'views/dashboard/terms.html',
      controller: 'termsController',
      size: 'lg'
      //windowClass: 'large-modal-terms'
    });
    dialogInst.result.then(function() {}, function() {});
  }
  $scope.fnRegisterUser = function() {
    $scope.data = {
      userid:$scope.userid,
      fullName: $scope.fullName,
      userName: $scope.email,
      password: $scope.userPassword
    };
    $scope.passwordchange();
    $scope.emailchange();
    $scope.namechange();
    $scope.useridchange();
    //$state.go("signUp2");
    if ($scope.emailstate == "exist" && $scope.useridstate=="exist" && $scope.validateEmail($scope.email) && $scope.validatepassword($scope.userPassword)) {
      loginService.registerUser($scope.data).then(function(result) {
        if(result.data.code=="200"){
        loginService.authenticateUser($scope.email.toLowerCase(), $scope.userPassword).then(function(data) {
          if(data.data.token){
          localStorage.clear();
          localStorage.setItem("access_token", data.data.token);
          localStorage.setItem("userId", data.data.userId);
          loginService.getUserDetails().then(function(result) {
              if (result.data.code!="200") {
                Notification.error(result.data.message);
              } else {

                $rootScope.fullName = result.data.data.fullName;
                $rootScope.profilePic = result.data.data.profilePic;
                $rootScope.userId = result.data.data._id;
                $rootScope.org = result.data.data.org;
                localStorage.setItem("orgId", result.data.data.org[0].organisationId._id);
                $rootScope.orgId = result.data.data.org[0].organisationId._id;
                $rootScope.orgname = $rootScope.org[0].organisationId.organisationId
                $rootScope.orgstatus = $rootScope.org[0].organisationId.status;
                $log.info("User Authenticated Successfully");
                $state.go("home.virtualgodown");
              }
            if (result.data.data.status == "pendingstock") {
              $rootScope.userstatus = "pending";
            }
          }, function(err) {
            $scope.access = false;
            $scope.loading = false;
          });
}else{
  Notification.error(data.data.message)
}
        },function(err) {
          Notification.error(err.data.message);
        });
      }else{
        Notification.error(result.data.message)
      }
      }, function(err) {
        Notification.error("Error! User Not added");
      });
    } else {

    }
  };
}]);

function displayPosition($scope, pos) {
  document.getElementById('latitude').value = pos.lat();
  document.getElementById('longitude').value = pos.lng();
  $scope.latitude = pos.lat();
  $scope.longitude = pos.lng();

}

vgApp.controller('forgotPasswordController', ['$scope', '$sce', 'loginService', 'Notification', '$state', 'localStorageService','$rootScope','$stateParams', function($scope, $sce, loginService, Notification, $state, localStorageService,$rootScope,$stateParams) {
  // Sending change password URL
  $rootScope.indexloader='false';

  localStorage.clear();
$scope.email=$stateParams.term
  $scope.changemail = function() {
    if ($scope.email == null) {
      $scope.errmg = "Email id required";
      console.log($scope.email);
      console.log("nulllllllllllllllllllllllllllllllllllll");
    } else {
      console.log($scope.email);
      console.log("nonnulllllllllllllllllllllllllllllllllllll");
      if(!$scope.validateEmail($scope.email)){
      $scope.errmg = "Email is invalid";
    }else{
      $scope.errmg = null;
    }
  }
}
  $scope.validateEmail = function(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
  $scope.msg = false;
  $scope.fnSendChangePasswordURL = function() {
    $scope.changemail();
    $scope.data = {
      username: $scope.email
    };
    if ($scope.validateEmail($scope.email)) {
      loginService.forgotPassword($scope.data).then(function(result) {

        if (result.data.status == "error") {
          Notification.error("Email id is not registered");
        } else {
          $scope.Message = "We have sent a reset link to your email";
          $scope.msg = true;
        }
      }, function(error) {
        Notification.error('Email id is not registered');
      });
    }
  };
}]);

vgApp.controller('onVerifyActionController', ['$scope', '$rootScope', 'loginService', '$stateParams', '$state', 'Notification', function($scope, $rootScope, loginService, $stateParams, $state, Notification) {
  $rootScope.highlightcollabrator=null;
  $rootScope.indexloader='false';

  loginService.verifyToken($stateParams.token).then(function(result) {

    if (result.data.status == "error") {
      Notification.error("Invalid Token");
    } else {
      $rootScope.userEmail = result.data.data.username;
      $state.go("resetPassword");
    }
  });
}]);
vgApp.controller('verifyemailcontroller', ['$scope', '$rootScope', 'loginService', '$stateParams', '$state', 'Notification', function($scope, $rootScope, loginService, $stateParams, $state, Notification) {
  $rootScope.highlightcollabrator=null;
  $rootScope.indexloader='false';

alert("i vf")
  loginService.verifyemail($stateParams.token, $stateParams.email).then(function(result) {

    if (result.data.status == "error") {
      Notification.error("Invalid Token");
    } else {
      $state.go('settings')
    }
  }, function(err) {
    Notification.error(err)
  });
}]);
vgApp.controller('resetPasswordController', ['$location', '$scope', '$rootScope', '$state', 'loginService', 'Notification', '$stateParams', 'localStorageService', function($location, $scope, $rootScope, $state, loginService, Notification, $stateParams, localStorageService) {
  $rootScope.highlightcollabrator=null;
  $rootScope.indexloader='false';

  $scope.init = function() {
    localStorage.clear();
    loginService.validatetoken($stateParams.token).then(function(result) {
      if (result.data.data.valid == true) {
        localStorage.clear();
      } else {
        $rootScope.info = "token";
        $state.go("login")
      }
    })
  }
  $scope.validatepassword = function(password) {
  var re =   /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
  return re.test(password);
}
  $scope.updatePassword = function() {
    if($scope.validatepassword($scope.confirmPassword)){
    $scope.data = {
      token: $stateParams.token,
      newPassword: $scope.confirmPassword
    };

    loginService.verifyToken($scope.data).then(function(result) {
      if (result.data.code == 200) {
        Notification.success("Password has been changed.");
        $rootScope.info = "changepassword";
        $state.go("login");
   } else {
        $rootScope.info = "token";
        $state.go("login");
      }
    }, function(error) {
      $rootScope.info = "token";
      $state.go("login");
    });
  }else{
    $scope.passworderror=true;
  }
  }
  $scope.passwordchange=function(){
  if($scope.confirmPassword == null){
    $scope.passworderror=null;
  }else if($scope.validatepassword($scope.confirmPassword)){
    $scope.passworderror=false;
  }else{
    $scope.passworderror=true;
  }
  }
}]);
vgApp.controller('collabratorctrl', ['$location', '$scope', '$rootScope', '$state', 'loginService', 'Notification', '$stateParams', 'localStorageService', function($location, $scope, $rootScope, $state, loginService, Notification, $stateParams, localStorageService) {
  var accessToken = localStorage.getItem("access_token");
  $rootScope.highlightcollabrator=null;

  $rootScope.indexloader='false';

  if ($stateParams.token !== null || $stateParams.token !== undefined || $stateParams.value !== null || $stateParams.value !== undefined) {
    if ($stateParams.value == 'accept') {
      loginService.collabrator($stateParams.token).then(function(result) {
        if (accessToken == null || accessToken == undefined) {
          $state.go('login')
        } else {
          if (result.data.data.orgId) {
            $rootScope.orgId = result.data.data.orgId;
            window.location.reload();
          } else {
            localStorage.clear();
            $state.go('login')
          }
        }
      }, function(err) {
        localStorage.clear();
        $state.go('login')
      })
    } else if ($stateParams.value == 'decline') {
      loginService.deletecollabratorrequest($stateParams.token).then(function(result) {
        if (accessToken == null || accessToken == undefined) {
          $state.go('login')
        } else {
          if (result.data.data.orgId) {
            $rootScope.orgId = result.data.data.orgId;
            window.location.reload();
          } else {
            localStorage.clear();
            $state.go('login')
          }
        }
      }, function(err) {
        localStorage.clear();
        $state.go('login')
      })
    }
  } else {
    localStorage.clear();
    $state.go('login')
  }
}]);

vgApp.controller('termsController', ['$uibModalInstance', '$scope', function($uibModalInstance, $scope) {
  $rootScope.indexloader='false';

  $scope.close = function() {
    $uibModalInstance.dismiss('cancel');
  };
}]);
vgApp.controller('suggestproductController', ['$scope', 'loginService', '$sce', 'Notification','$rootScope', function($scope, loginService, $sce, Notification,$rootScope) {
  $rootScope.indexloader='false';

  $scope.new = false;
  $scope.filter = {};
  $scope.show = {};
  $scope.newspec = false;
  $scope.onaddvar = function(key) {
    $scope.newvar = null;
    $scope.newvar1 = null;
    $scope.newspec = false;
    $scope.new = true;
    $scope.ki = key;
    var a = $('#newvar1').val("");
    var b = $('#newvar').val("");

  };
  $scope.varval = function(key, val) {
    $scope.filter[key] = val;
  }
  $scope.removevar = function() {
    $scope.new = false;
    var a = $('#newvar').val("");
  }
  $scope.removespec = function() {
    $scope.newspec = false;
    var a = $('#newvar1').val("");
  }
  $scope.MyFunc = function(key, newval) {
    $scope.htmlTextToolTip = $sce.trustAsHtml('<div class="packageNameTooltip">Press enter key to add<br> Press esc key to ignore</div>');
    var a = newval;
    if (key == null || key == undefined || a == null || a == undefined) {} else {
      $scope.new = false;
      for (key1 in $scope.filters) {
        if (key == key1) {
          var value = $scope.filters[key];
          $scope.filter[key] = a;
          value.push({
            "name": a,
            "status": false
          })
          a = $('#newvar').val("");

        }
      }
    }
  }
  $scope.delvar = function(key, newval) {
    var j;
    for (i = 0; i < $scope.filters[key].length; i++) {
      if ($scope.filters[key][i].name == newval) {
        j = i;
      }
    }
    $scope.filters[key].splice(j, 1);
  }
  $scope.delspec = function(key) {
    var j;
    for (key1 in $scope.filters) {
      if (key == key1) {
        delete $scope.filters[key]
      }
    }
  }
  $scope.newfilter = function() {
    $scope.htmlTextToolTip = $sce.trustAsHtml('<div class="packageNameTooltip">Press Enter key to add<br> Press esc key to ignore</div>');
    $scope.newspec = true;
    $scope.new = false;
    $scope.newvar = null;
    $scope.newvar1 = null;
  }
  $scope.MyFunc1 = function(a) {
    if (a == null || a == undefined) {} else {
      $scope.newspec = false;
      $scope.filters[a] = [];
      $scope.show[a] = false;
      a = $('#newvar1').val("");

    }
  }
  $scope.reset = function(key) {
    $scope.filter[key] = null;
    $scope.new = false;
    var a = $('#newvar').val("");
  }
  $scope.addsuggest = function() {
    loginService.addsuggest($scope.materialId, $scope.filter).then(function(data) {
      Notification.success("suggestion addded successfully")
    }, function(err) {
      Notification.error("Error adding suggestion")
    })
  }
  $scope.autocomplete = function() {
    $("#autocompletesearch").autocomplete({
      source: function(request, response) {
        $.ajax({
          dataType: "json",
          data: {
            term: request.term,
          },
          type: 'Get',
          contentType: 'application/json; charset=utf-8',
          xhrFields: {
            withCredentials: false
          },
          crossDomain: true,
          cache: true,
          url: domainURL + 'api/material/autocomplete',
          success: function(data) {

            var array = $.map(data.data, function(item) {
              return {
                label: item.materialName,
                value: item.materialName
              }
            });

            //call the filter here
            response($.ui.autocomplete.filter(array, request.term));
          },
          error: function(data) {

          }
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
        $scope.submit(ui.item.value);

      }
    });
  };
  $scope.submit = function(search) {
    if (search !== null) {
      $scope.term = search;
      var temp = {};
      var keys = [];
      var ky;
      loginService.material(search).then(function(response) {
        $scope.search = search;
        materialId = response.data._id;
        $scope.materialId = response.data._id;
        $scope.filters = response.data.specifications;
        for (kys in $scope.filters) {
          keys.push(kys);
        }
        $scope.showbox = keys[0];
      }, function(data) {});
    } else {}

  };
}]);
vgApp.controller('otpctrl', ['$scope', 'loginService', '$uibModalInstance', 'minute', 'hour', 'stockareaId', '$timeout', '$uibModal', 'Notification','$rootScope', function($scope, loginService, $uibModalInstance, minute, hour, stockareaId, $timeout, $uibModal, Notification,$rootScope) {
  $rootScope.highlightcollabrator=null;
  $scope.minutes1 = minute;
  $rootScope.indexloader='false';

  $scope.hours1 = hour;
  $scope.close = function() {
    $uibModalInstance.dismiss('cancel');
  };
  $scope.submitotp1 = function() {
    if ($scope.motp == null) {
      Notification.error("Enter a valid OTP");
    } else if($scope.motp.length==6){
      loginService.submitotp($scope.motp).then(function(result) {
        Notification.success("Mobile Number Verified Successfully");
        $uibModalInstance.dismiss(stockareaId);
      }, function(err) {
        Notification.error(err)
      });
    }
  }

  $scope.countdown1 = function myhandler() {

    if ($scope.minutes1 == 0 && $scope.hours1 == 0) {
      return;
    } else {
      if ($scope.minutes1 == 0) {
        $scope.minutes1 = 60;
        $scope.hours1--;
      } else {
        $scope.minutes1--;
      }

    }
    $timeout(myhandler, 1000, $scope.false1());
  }
  $scope.false1 = function() {
    if ($scope.minutes1 == 0) {
      $uibModalInstance.dismiss(stockareaId);
    }
  }

}]);
vgApp.controller('deleteuserctrl', ['$scope', 'loginService', '$uibModalInstance', 'userId', '$timeout', '$uibModal', 'Notification','$rootScope', function($scope, loginService, $uibModalInstance, userId, $timeout, $uibModal, Notification,$rootScope) {
  $rootScope.highlightcollabrator=null;

  $scope.close = function() {
    $uibModalInstance.dismiss('cancel');
  };
  $scope.delete = function() {
    loginService.deleteuser($scope.password).then(function(result) {
      if (result.data.code == "200") {
        Notification.success("User deleted Successfully");
        $uibModalInstance.dismiss("done");
      } else {
        Notification.success("you entered wrong password");
        $uibModalInstance.dismiss("cancel");
      }
    }, function(err) {
      Notification.error(err)
    });

  }

  $scope.countdown1 = function myhandler() {

    if ($scope.minutes1 == 0 && $scope.hours1 == 0) {
      return;
    } else {
      if ($scope.minutes1 == 0) {
        $scope.minutes1 = 60;
        $scope.hours1--;
      } else {
        $scope.minutes1--;
      }

    }
    $timeout(myhandler, 1000, $scope.false1());
  }
  $scope.false1 = function() {
    if ($scope.minutes1 == 0) {
      $uibModalInstance.dismiss(stockareaId);
    }
  };
}]);
