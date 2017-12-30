"use strict";

//map fn start
function showArrays(event, thise, flightPlanCoordinates, map, ids, tradeinfo, scope) {
  var linemap = [];
  for (var n = 0; n < flightPlanCoordinates.length; n++) {
    var stcolor;
    if (thise.no == n) {
      stcolor = '#42f44e';
      scope.tradeCost = tradeinfo[n].Cost;
      scope.tradeSourceId = ids[n];
    } else
      stcolor = '#bbc9c7';
    linemap[n] = new google.maps.Polyline({
      path: flightPlanCoordinates[n],
      strokeColor: stcolor,
      strokeOpacity: 0.6,
      strokeWeight: 0,
      id: ids[n],
      no: n,
      tradeinfo: tradeinfo[n]
    });
    linemap[n].setMap(map);
  }
}

//map fn end
vgApp.controller('homeController', ['$scope', 'dashboardService', '$log', 'Notification', '$uibModal', '$rootScope', '$http', '$window', '$state', '$sce', 'loginService','$stateParams', function($scope, dashboardService, $log, Notification, $uibModal, $rootScope, $http, $window, $state, $sce, loginService,$stateParams) {
  $rootScope.info = null;
  $scope.trade = false;
  $scope.firstRate = 0;
  $rootScope.indexloader='false';
  $scope.myFile = null;
  $scope.tab=$stateParams.tab;
$rootScope.checktab=function(stockareaid,productid){
  $scope.tab=6;
  $scope.notificationselectStockarea(stockareaid);
  $rootScope.productId=productid;
}
$rootScope.notify=function(){
Notification.clearAll();
  Notification.error({message: '<div style="display:inline-block;"><i style="color:white" class="fa fa-warning"></i> It seems you have a connectivity issue</div><font ng-click="closeAll()" style="float:right;margin-left:20px;display:inline-block">X</font>', positionY: 'top', positionX: 'center',delay:10000000000000,verticalSpacing: 150,horizontalSpacing: 50});
}
$scope.editproduct = function(productid) {
  $state.go('home.editproduct', {
  productId: productid
});
$scope.tab=5;
}
  $scope.myCroppedImage = '';
  $scope.myImage = '';
$scope.searchtype='product';
  $scope.subtab13 = function(productid) {
    $scope.subtab1 = 3;
    document.getElementById('searchresult').style.display = 'none';
    $scope.selectedtab11 = 'inactive';
    $scope.selectedtab12 = 'inactive';
    $scope.selectedtab13 = 'active';
    for (var i = 0; i < $scope.productsSearch.length; i++) {
      if ($scope.productsSearch[i].productId == productid) {
        $scope.privateproductId = productid;
        $scope.productOwner = $scope.productsSearch[i].productOwner;
        $scope.productname = $scope.productsSearch[i].productName;
        $scope.productdescription = $scope.productsSearch[i].specifications;
        $scope.productcategory = $scope.productsSearch[i].categoryId;
        $scope.producttype = $scope.productsSearch[i].categoryId;
        $scope.productimages = $scope.productsSearch[i].images;
      }
    }
  };
  var a = function($b,speed){
      var beeWidth = $b.width();

      $b.animate({
  				"top": "5%",
          "right":"7.5%"
  }, speed);
  };
var d = function($b,speed){
    var beeWidth = $b.width();

    $b.animate({
				"top": "100%"
}, speed);
};
var resetfly=function(){
  $(".messagefly").css('right','none');
  $(".messagefly").css('top','none');
  $(".messagefly").removeAttr( 'style' );
}
$rootScope.fly=function(){
  var width=screen.width;
  $(".messagefly").css('display','block');
  a($(".messagefly"), 1000);
  d($(".messagefly"), 800);
      resetfly();
};

  $scope.sellbuttontip=function(){
  $('.stockaredetailssellbutton').tooltip('show');
}
  $scope.createproduct = function(productid) {
    $scope.subtab1 = 3;
    $state.go('home.addproduct');
  };
  $scope.subtab12 = function() {
    document.getElementById('searchresult').style.display = 'none';
    $scope.subtab1 = 2;
    $scope.selectedtab11 = 'inactive';
    $scope.selectedtab12 = 'active';
    $scope.selectedtab13 = 'inactive';
  };
  $scope.subtab11 = function() {
    document.getElementById('searchresult').style.display = 'none';
    $scope.subtab1 = 1;
    $scope.selectedtab11 = 'active';
    $scope.selectedtab12 = 'inactive';
    $scope.selectedtab13 = 'inactive';
  };
  $scope.subtab1 = function() {
    $scope.subtab = 1;
    $scope.selectedtab1 = 'active';
    $scope.selectedtab2 = 'inactive';
    $scope.selectedtab3 = 'inactive';
  }
  $scope.subtab3 = function() {
    $scope.subtab = 3;
    $scope.selectedtab1 = 'inactive';
    $scope.selectedtab2 = 'inactive';
    $scope.selectedtab3 = 'active';
  }
  $scope.subtab2 = function() {
    $scope.subtab = 2;
    $scope.selectedtab1 = 'inactive';
    $scope.selectedtab2 = 'active';
    $scope.selectedtab3 = 'inactive';
  }
  $scope.validateEmail = function(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
  $scope.updatestockarea = function() {
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
        if(result.data.code=="200"){
        $scope.view = true;
        Notification.success('Stockarea Updated successfully');
      }else{
        Notification.error(result.data.message);
      }
      }, function(error) {
        Notification.error('Stockarea Not Added');
      });
    }
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
      "stylers": [

        {
          "color": "#cfcfcf"
        }
      ]
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
  $scope.viewstockarea = function() {
    $scope.view = true;
    $scope.newsa = false;
    $scope.stockareaId = localStorage.getItem('selectedStockareaId');
    var stockareaId=$scope.stockareaId
    $scope.readname = true;
    $scope.htmlTextToolTip = $sce.trustAsHtml('<div class="packageNameTooltip">You cannot change stockarea name.</div>');
    var styledMapType = new google.maps.StyledMapType(mapstyle, {
      name: 'Styled Map'
    });



    var myGeocoder = new google.maps.Geocoder({
      region: 'IN'
    });
    dashboardService.stockareaInfo($scope.stockareaId).then(function(data) {

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
  $scope.submitotp = function() {
    if ($scope.motp == null) {

    } else {
      loginService.submitotp($scope.motp).then(function(result) {
        if(result.data.code=="200"){
          $scope.otp = false;
          $scope.otp1 = false;
          $scope.viewstockarea();
          Notification.success("Mobile Number Verified Successfully");
      }else{
        Notification.error(result.data.message);
      }
      }, function(err) {
        Notification.error(err)
      });
    }
  }
  $scope.addprimarymobile = function() {
    if ($scope.mobilep !== null && $scope.mobilep !== $scope.mobile) {
      loginService.addprimarymobile($scope.mobilep).then(function(result) {
        if (result.data.code == 200) {
          $scope.viewstockarea();
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
    if ($scope.stockareaemailp == null || $scope.stockareaemailp == undefined || !$scope.stockareaemailp) {
      Notification.error("please select email");
    } else {
      loginService.addprimarystockarea($scope.stockareaemailp, $scope.stockareaId).then(function(result) {
        if (result.data.code == 200) {
          $scope.viewstockarea();
          Notification.success($scope.stockareaemailp + ' is made as your primary email');
        } else if (result.data.code == 413) {
          Notification.error($scope.stockareaemailp + " is not verified");
        } else {
          Notification.error($scope.stockareaemailp + " as primary update Failed");
        }
      }, function(err) {
        Notification.error($scope.stockareaemailp + " as primary update Failed");
      })
    }
  }
  $scope.addprimarymobilestockarea = function() {
    if ($scope.stockareamobilep == null || $scope.stockareamobilep == undefined || !$scope.stockareamobilep) {
      Notification.error("please select mobile number");
    } else {
      loginService.addprimarymobilestockarea($scope.stockareamobilep, $scope.stockareaId).then(function(result) {
        if (result.data.code == 200) {
          $scope.viewstockarea();
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
    if(email!==undefined && email!==null){
    loginService.deleteemail(email).then(function(result) {
      $scope.viewstockarea();
      Notification.success(email + ' deleted successfully');

    }, function(err) {
      Notification.error(email + "delete Failed");
    })
  }
  }

  $scope.deletemobile = function(mobile) {
    if(mobile!==undefined && mobile!==null){

    loginService.deletemobile(mobile).then(function(result) {
      $scope.viewstockarea();
      Notification.success(mobile + 'deleted successfully');

    }, function(err) {
      Notification.error(mobile + "delete Failed");
    })
}
  }
  $scope.deleteemailstockarea = function(email) {
    if(email!==undefined && email!==null){
    loginService.deleteemailstockarea(email, $scope.stockareaId).then(function(result) {
      $scope.viewstockarea();
      Notification.success(email + ' deleted successfully');

    }, function(err) {
      Notification.error(email + "delete Failed");
    })
  }
}
  $scope.deletemobilestockarea = function(mobile) {
    if(mobile!==undefined && mobile!==null){
    loginService.deletemobilestockarea(mobile, $scope.stockareaId).then(function(result) {
      $scope.viewstockarea();
      Notification.success(mobile + 'deleted successfully');

    }, function(err) {
      Notification.error(mobile + "delete Failed");
    })
  }
  }

  $scope.addnewmailstockarea = function() {
    if ($scope.stockareaemailnew == null || $scope.stockareaemailnew == undefined || !$scope.stockareaemailnew || !$scope.validateEmail($scope.stockareaemailnew)) {
      Notification.error('Enter a valid email id');
    } else {
      loginService.addnewmailstockarea($scope.stockareaemailnew, $scope.stockareaId).then(function(result) {
        $scope.viewstockarea();
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
    if ($scope.stockareamobilenew == null && $scope.stockareamobilenew == "+91") {} else {
      loginService.addnewmobilestockarea($scope.stockareamobilenew, $scope.code, $scope.stockareaId).then(function(result) {
        if (result.data.code != "200") {
          Notification.error('Mobile number already associated with another account');
        } else {
          Notification.success('Mobilenumber added successfully')
          $scope.stockareamobilenew = null;
          $scope.viewstockarea();
        }
      }, function(err) {
        Notification.error('Error adding Mobilenumber');
      })
    }
  }

  $scope.verify = function(email) {
    loginService.verify(email).then(function(result) {
      Notification.success('Mail sent successfully');
      $scope.viewstockarea();
    }, function(err) {
      Notification.error('Mail Not sent !Error');
    });
  };
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
    });
  };
  $scope.otp1 = false;
  $scope.verifymobile1 = function(mobile) {
    $scope.hours1 = 0;
    $scope.minutes1 = 60;
    loginService.verifymobile(mobile).then(function(result) {
      Notification.success('Otp sent successfully');
      var dialogInst = $uibModal.open({
        templateUrl: 'views/dashboard/otp.html',
        controller: 'otpctrl',
        backdrop: 'static',
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
          $scope.viewstockarea($scope.stockareaId);
        }
      });
    });

  };
  $scope.report = function(id,name) {
    $scope.id=id;
      var dialogInst = $uibModal.open({
        templateUrl: 'views/dashboard/report.html',
        controller: 'reportctrl',
        backdrop: 'static',
        size: 'md',
        resolve: {
          productid:function(){
            return $scope.id
          },
          name:function(){
            return name
          }
        }
      });
      dialogInst.result.then(function(fmsid) {

      }, function(data) {
        if (data == 'cancel') {

        } else {
        }
      });
  };
  $scope.addpackage = function(id) {
      var dialogInst = $uibModal.open({
        templateUrl: 'views/dashboard/addpackage.html',
        controller: 'packagectrl',
        backdrop: 'static',
        size: 'md',
        resolve: {
          productid:function(){
            return id
          }
        }
      });
      dialogInst.result.then(function(fmsid) {
        $scope.getSearchProducts(id,null);

      }, function(data) {
        if (data == 'cancel') {

        } else {
          $scope.getSearchProducts(id,null);
        }
      });
  };
  $scope.suggestpackage = function(id) {
      var dialogInst = $uibModal.open({
        templateUrl: 'views/dashboard/addpackage.html',
        controller: 'suggestpackagectrl',
        backdrop: 'static',
        size: 'md',
        resolve: {
          productid:function(){
            return id
          }
        }
      });
      dialogInst.result.then(function(fmsid) {

      }, function(data) {
        if (data == 'cancel') {

        } else {
        }
      });
  };

  $scope.latc = function() {
    if ($scope.latitude == null) {
      $scope.lat = "This feild is required";
    } else {
      $scope.lat = null;
    }
  };
  $scope.lonc = function() {
    if ($scope.longitude == null) {
      $scope.lon = "This feild is required";
    } else {
      $scope.lon = null;
    }
  };
  $scope.addc = function() {
    if ($scope.address1 == null) {
      $scope.add = "This feild is required";
    }
  };
  $scope.namec = function() {
    if ($scope.stockareaName == null) {
      $scope.na = "stockarea name is required";
    }
  };
  $scope.phc = function() {
    if ($scope.phone == null) {
      $scope.ph1 = "Phone number is required";
    }
  };
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
      });
    }
  };
$scope.sellbutton=function(){
  if($rootScope.type!='1000' && $rootScope.productowner!=$rootScope.userId){
    $scope.sellmsg="you don't have access to sell this product"
    return 'inactiveproduct';
  }else if($rootScope.stockareatype=='1005'){
    $scope.sellmsg="your can't sell a product from 'only-me' stockarea"
    return 'inactivestockarea';
  }else{
    $scope.sellmsg="sell this product"
    return 'active';
  }
}
  $scope.init = function() {
    $scope.subtab = 1;
    $scope.selectedtab1 = 'active';

    $scope.subtab1 = 1;
    $scope.selectedtab11 = 'active';
    $rootScope.editSelectedStockarea = false;
    if (localStorage.getItem("access_token") == null || localStorage.getItem("access_token") == undefined) {
      $state.go('login');
    } else {
      dashboardService.isAuthenticated().then(function(data) {
        dashboardService.category().then(function(response) {
          $scope.category = response.data;
        });
        dashboardService.types().then(function(response) {
          $scope.types = response.data;
        });
        dashboardService.stockareatypes().then(function(response) {
          $scope.stockareatypes = response.data;
        });
        dashboardService.codes().then(function(data) {
          $scope.codes = data.data.data.code;
          $scope.code = "+91";
        });
        dashboardService.getUserDetails().then(function(result) {
          dashboardService.getStockArea($rootScope.orgId).then(function(result) {
            $scope.stockarea = result.data.data;
            if (result.data.data.length > 0) {
              $rootScope.userstatus = 'success';
              if (localStorage.getItem('selectedStockareaId') == null || localStorage.getItem('selectedStockareaId') == undefined) {
                $scope.selectClassStockarea(result.data.data[0].stockareaId);
                $scope.getStockAreaProductFn(result.data.data[0].stockareaId);
                localStorage.setItem('selectedStockareaId', result.data.data[0].stockareaId);
                localStorage.setItem('selectedStockareaName', result.data.data[0].stockareaName);
                $rootScope.StockareaName=result.data.data[0].stockareaName;
                $scope.stockareaName = result.data.data[0].stockareaName;
                $rootScope.stockareaId = result.data.data[0].stockareaId;
                $rootScope.stockareatype=result.data.data[0].visiblity;
                for(var i=0;i<$scope.stockareatypes.length;i++){
                  if($rootScope.stockareatype==$scope.stockareatypes[i]._id){
                    $scope.selectedproductvisiblityvalue=$scope.stockareatypes[i].desc;
                    $scope.selectedproductvisiblity=$scope.stockareatypes[i]._id;
                  }
                }
              } else {
                $scope.selectClassStockarea(localStorage.getItem('selectedStockareaId'));
                $scope.getStockAreaProductFn(localStorage.getItem('selectedStockareaId'));
                $scope.stockareaName = localStorage.getItem('selectedStockareaName');

              }
            } else {
              $rootScope.userstatus = 'pending';
              $rootScope.loading = false;
              if (!$rootScope.stockareaopen || $rootScope.stockareaopen == false) {
                $scope.addStockarea1();
              }
            }
            $scope.getorganisation();
          }, function(error) {
            Notification.error('Stockarea Not Available');
            $log.info("Invalid UserName/Password");
          });

        });
      }, function(err) {
        $state.go('login');
      });
    }
  };
  $scope.getorganisation = function() {
    dashboardService.getorganisation($rootScope.orgId).then(function(info) {
      $rootScope.organisationinfo = info.data.data;
      var collabrators = info.data.data.collabrators;
      $scope.collabrators = [];
      for (var i = 0; i < collabrators.length; i++) {
        $scope.collabrators.push(collabrators[i].organisationId);
      }
    }, function(err) {
      Notification.error("organisation error");
    });
  };
  $scope.collabrator = function(Id) {
    dashboardService.collabrator(Id).then(function(result) {
      dashboardService.getProductStockInfo($rootScope.productId,$rootScope.stockareaId).then(function(resp){
      $rootScope.collabratorsinfo=resp.data.data.collabrators
      })
          }, function(err) {
      Notification.error("cannot able to process u r request at this moment");
    });
  };
  $scope.ignore = function(Id) {
    dashboardService.ignore(Id).then(function(result) {
      dashboardService.getProductStockInfo($rootScope.productId,$rootScope.stockareaId).then(function(resp){
      $rootScope.collabratorsinfo=resp.data.data.collabrators
      })
          }, function(err) {
      Notification.error("cannot able to process u r request at this moment");
    });
  };
  $scope.deletecollabrator = function(Id) {
    dashboardService.deletecollabrator(Id,$rootScope.productId).then(function(info) {
      dashboardService.getProductStockInfo($rootScope.productId,$rootScope.stockareaId).then(function(resp){
      $rootScope.collabratorsinfo=resp.data.data.collabrators
      })
        }, function(err) {
      Notification.error("organisation error");
    });
  };

  $scope.autoExpand = function(e) {
    var element = typeof e === 'object' ? e.target : document.getElementById(e);
    var scrollHeight = element.scrollHeight - 60; // replace 60 by the sum of padding-top and padding-bottom
    element.style.height = scrollHeight + "px";
  };

  function expand() {
    $scope.autoExpand('TextArea');
  }
  $scope.addlike = function(materialId, brandId) {
    var mid = materialId;
    dashboardService.addlike($scope.materialinfo._id, brandId).then(function(response) {
      $scope.getbrandmaterialinfo($scope.materialinfo._id, brandId);
    }, function(error) {
      Notification.error("brandmaterial error");
    });
  };
  $scope.removelike = function(materialId, brandId) {
    var mid = materialId;
    dashboardService.removelike($scope.materialinfo._id, brandId).then(function(response) {
      $scope.getbrandmaterialinfo($scope.materialinfo._id, brandId);
    }, function(error) {
      Notification.error("brandmaterial error");
    });
  };

  $scope.addStockarea1 = function(id) {
    var dialogInst = $uibModal.open({
      templateUrl: domainURL + 'views/dashboard/addStockarea.html',
      controller: 'addStockareaCtrl',
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
      resolve: {
        stockareaid: function() {
          return '13213223';
        },
        scope: function() {
          return $scope;
        },
        productid: function() {
          return '234234234';
        }
      }
    });
    $rootScope.stockareaopen = true;
    dialogInst.result.then(function(fmsid, info) {
      Notification.success('Stockarea created successfully');
      $rootScope.stockareaopen = false;
      $scope.init();
    }, function(err) {
      $rootScope.stockareaopen = false;

      //$scope.init();
    });
  };
  $scope.createorg = function() {
    $state.go('createorg');
  };

  $scope.addcollabrator = function() {
    var dialogInst = $uibModal.open({
      templateUrl: domainURL + 'views/dashboard/addcollabrator.html',
      controller: 'addcollabratorctrl',
      size: 'md',
      backdrop: 'static',
      resolve: {
        stockareaid: function() {
          return '13213223';
        },
        scope: function() {
          return $scope;
        },
        productid: function() {
          return '234234234';
        }
      }
    });
    dialogInst.result.then(function(fmsid) {
      dashboardService.getProductStockInfo($rootScope.productId,$rootScope.stockareaId).then(function(resp){
      $rootScope.collabratorsinfo=resp.data.data.collabrators
      })
          }, function(err) {
      //$scope.init();
    });
  };
  $scope.addStockarea = function(id) {
    var dialogInst = $uibModal.open({
      templateUrl: domainURL + 'views/dashboard/addStockarea.html',
      controller: 'addStockareaCtrl',
      backdrop: 'static',
      size: 'lg',
      resolve: {
        stockareaid: function() {
          return '13213223';
        },
        scope: function() {
          return $scope;
        },
        productid: function() {
          return '234234234';
        }
      }
    });
    dialogInst.result.then(function(fmsid) {
      Notification.success('Stockarea created successfully');
      $scope.init();
    }, function(err) {
      //$scope.init();
    });
  };
  $scope.myInterval = 3000;

  $scope.loadHome = function() {
    setheightandwidthofmaincontainer();
  };


  var map;
  $scope.RequestSellAccess=function(productid){

  }

  //map start
  $scope.setMapInfo = function(data) {
    dashboardService.getProductStockInfo($rootScope.productId,$rootScope.stockareaId).then(function(resp){
    $rootScope.collabratorsinfo=resp.data.data.collabrators
if(!$rootScope.center || $rootScope.center==null || $rootScope.center==undefined){
  var latlng = new google.maps.LatLng(data.source.latitude, data.source.longitude);
  var lat=data.source.latitude;
  var lng=data.source.longitude;
}else{
  var latlng = new google.maps.LatLng($rootScope.center.lat,$rootScope.center.lng);
  var lat=$rootScope.center.lat;
  var lng=$rootScope.center.lng;
}
var zoom;
if(!$scope.zoom){
  zoom=3;
}else{
  zoom=$scope.zoom;
}
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: zoom,
      fullscreenControl: false,
      center: {
        lat: lat,
        lng: lng
      },
      mapTypeId: 'roadmap',
      mapTypeControl: false,
      zoomControl: true,
      scaleControl: true,
      streetViewControl: false,
      styles: mapstyle
    });

    var mark = new RichMarker({
      position: new google.maps.LatLng(data.source.latitude, data.source.longitude),
      content: '<div><div class="pulse"></div><div class="dot"></div></div>',

      map: map
    });
    var tradeinfo = [];
    var linemap;
    var datadestinations = [];
    var ids = [];
    var markers = [];
    map.addListener('dragend', function(){
      var bounds = map.getBounds().toJSON();
      $rootScope.center=map.getCenter().toJSON()
      $scope.zoom=map.getZoom();
      console.log(bounds);
$scope.mapinfochange($rootScope.productId,localStorage.getItem('selectedStockareaId'),bounds);
      });
      map.addListener('zoom_changed', function(){
        var bounds = map.getBounds().toJSON();
        $rootScope.center=map.getCenter().toJSON()
        $scope.zoom=map.getZoom();
  $scope.mapinfochange($rootScope.productId,localStorage.getItem('selectedStockareaId'),bounds);
        });

    if (data.destinations != undefined)
      if (data.destinations.length > 0) {
        if (data.destinations[0] != null) {
          $scope.trade = true;
          for (var i = 0; i < data.destinations.length; i++) {
            datadestinations[i] = [{
                lat: data.source.latitude,
                lng: data.source.longitude
              },
              {
                lat: data.destinations[i].latitude,
                lng: data.destinations[i].longitude
              }
            ];
            tradeinfo[i] = data.destinations[i].tradeinfo;
            ids[i] = data.destinations[i].stockareaId;

            if ($rootScope.collabratorsinfo.filter(function(e) { return e.productstockId.stockareaId._id == data.destinations[i]._id && e.status.type=='active'}).length > 0) {
              if($rootScope.source!==null && $rootScope.source!==undefined){
                if(data.destinations[i]._id==$rootScope.source.source){
                  $scope.color = "orange";
                }else{
                  $scope.color = "#4c81bf";
                }
              }else{
                $scope.color = "#4c81bf";
              }
            } else {
              if(data.destinations[i].visiblity!==null && data.destinations[i].visiblity!==undefined){
                if(data.destinations[i].visiblity==1003){
                  $scope.color = "darkgreen";
                }else{
                  $scope.color = "orange";
                }
              }else{
                $scope.color = "darkgreen";
              }            }
            markers[i] = new google.maps.Marker({
              position: {
                lat: data.destinations[i].latitude,
                lng: data.destinations[i].longitude
              },
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 2,
                fillColor: $scope.color,
                strokeColor: $scope.color,
                fillOpacity: 1,
                strokeWeight: 2

              },
              zIndex: 1,
              map: map,
              posInfo: [{
                  lat: data.source.latitude,
                  lng: data.source.longitude
                },
                {
                  lat: data.destinations[i].latitude,
                  lng: data.destinations[i].longitude
                }
              ],
              tradeinfo: tradeinfo[i]
            });
            markers[i].addListener('click', function() {
              linemap.setMap(null);

              stcolor = '#42f44e';
              linemap = new google.maps.Polyline({
                path: this.posInfo,
                strokeColor: stcolor,
                strokeOpacity: 0.6,
                strokeWeight: 2,
                id: ids[n],
                no: n,
                tradeinfo: this.tradeinfo
              });
              linemap.setMap(map);
              google.maps.event.addDomListener(window, 'load');

              $scope.trade = true;
              //document.getElementById('tradeinfoCost').innerHTML = "Cost "+tradeinfo[0].Cost;
              document.getElementById('tradeinfoDistance').innerHTML = "Distance  &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp   :" + Math.round(this.tradeinfo.Distance) + "   KM";
              document.getElementById('tradeinfoPhoneNo').innerHTML = "Phone Number :" + this.tradeinfo.code + " " + Math.round(this.tradeinfo.Phone);
              document.getElementById('tradeinfoStockareaName').innerHTML = this.tradeinfo.stockareaName;
              var profileurl = domainURL + "productProfile/" + this.tradeinfo.stockareaName + "/" + this.tradeinfo.productName;
              if(this.tradeinfo.viewmore!==false){
                var n=this.tradeinfo.stockareaName;
                if ($rootScope.collabratorsinfo.filter(function(e) { return e.productstockId.stockareaId.stockareaName == n && e.status[e.status.length-1].type!=='active'}).length > 0) {
                  var sid=this.tradeinfo.stockareaId;
                  var oid=this.tradeinfo.organisationId;
                  document.getElementById('tradeinfoViewProfile').innerHTML = "<i id=\"link\" class=\"fa fa-link\"style=\" float:left;color:#4c81bf; \" title=\"pending\" data-placement='bottom' onmouseenter=\"$(this).tooltip('show')\" aria-hidden=\"true\"></i><a class=\"viewprofile\" href=\"" + profileurl + "\">View Profile</a>";
              }else if($rootScope.collabratorsinfo.filter(function(e) { return e.productstockId.stockareaId.stockareaName == n && e.status[e.status.length-1].type=='active'}).length > 0) {
                document.getElementById('tradeinfoViewProfile').innerHTML = "<i id=\"link\" class=\"fa fa-link\"style=\" float:left;color:#72bb53; \" title=\"connected\" data-placement='bottom' onmouseenter=\"$(this).tooltip('show')\" aria-hidden=\"true\"></i><a class=\"viewprofile\" href=\"" + profileurl + "\">View Profile</a>";
                }else{
                  var sid=this.tradeinfo.stockareaId;
                  var oid=this.tradeinfo.organisationId;
                  document.getElementById('tradeinfoViewProfile').innerHTML = "<i id=\"link\" title=\"connect\" data-placement='bottom' onmouseenter=\"$(this).tooltip('show')\" class=\"fa fa-link\"onClick=angular.element(this).scope().addcollabratorinfo('"+sid+"','"+oid+"') style=\" float:left \" aria-hidden=\"true\"></i><a class=\"viewprofile\" href=\"" + profileurl + "\">View Profile</a>";
                }
            }else{
              var n=this.tradeinfo.stockareaName;
              if ($rootScope.collabratorsinfo.filter(function(e) { return e.productstockId.stockareaId.stockareaName == n && e.status[e.status.length-1].type!=='active'}).length > 0) {
                var sid=this.tradeinfo.stockareaId;
                var oid=this.tradeinfo.organisationId;
              document.getElementById('tradeinfoViewProfile').innerHTML = "<i id=\"link\" class=\"fa fa-link\"style=\" float:left;color:#4c81bf; \" title=\"pending\" data-placement='bottom' onmouseenter=\"$(this).tooltip('show')\" aria-hidden=\"true\"></i>";
            }else if($rootScope.collabratorsinfo.filter(function(e) { return e.productstockId.stockareaId.stockareaName == n && e.status[e.status.length-1].type=='active'}).length > 0) {
                document.getElementById('tradeinfoViewProfile').innerHTML = "<i id=\"link\" class=\"fa fa-link\"style=\" float:left;color:#72bb53; \" title=\"connected\" data-placement='bottom' onmouseenter=\"$(this).tooltip('show')\" aria-hidden=\"true\"></i><a class=\"viewprofile\" href=\"" + profileurl + "\">View Profile</a>";
              }else{
                var sid=this.tradeinfo.stockareaId;
                var oid=this.tradeinfo.organisationId;
              document.getElementById('tradeinfoViewProfile').innerHTML = "<i id=\"link\" class=\"fa fa-link\" title=\"connect\" data-placement='bottom' onmouseenter=\"$(this).tooltip('show')\" onClick=angular.element(this).scope().addcollabratorinfo('"+sid+"','"+oid+"') style=\" float:left \" aria-hidden=\"true\"></i>";
            }
          }//<div id="tradeinfoViewProfile"><a class="viewprofile" ui-sref="">View Profile</a></div>
              //document.getElementById('tradeinfoViewProfile').innerHTML = "<a class=\"viewprofile\" ui-sref=/productProfile/"+tradeinfo[0].stockareaName+"/"+tradeinfo[0].productName+">View Profile</a>";
              //document.getElementById('tradeinfoTime').innerHTML = "Time "+tradeinfo[0].Time
              $scope.tradedistance = this.tradeinfo.Distance;


            });
          }
          var flightPlanCoordinates = datadestinations;
          var stcolor;
          for (var n = 0; n < flightPlanCoordinates.length; n++) {

            if (n == 0) {
              stcolor = '#42f44e';
              $scope.tradeCost = tradeinfo[n].Cost;
              $scope.tradeSourceId = ids[n];
              linemap = new google.maps.Polyline({
                path: flightPlanCoordinates[n],
                strokeColor: stcolor,
                strokeOpacity: 0.6,
                strokeWeight: 2,
                id: ids[n],
                no: n,
                tradeinfo: tradeinfo[n]
              });
              linemap.setMap(map);
            }
            $scope.trade = true;
            //document.getElementById('tradeinfoCost').innerHTML = "Cost "+tradeinfo[0].Cost;
            document.getElementById('tradeinfoDistance').innerHTML = "Distance     &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp:" + Math.round(tradeinfo[0].Distance) + "   KM";
            document.getElementById('tradeinfoPhoneNo').innerHTML = "Phone Number :" + tradeinfo[0].code + " " + Math.round(tradeinfo[0].Phone);
            document.getElementById('tradeinfoStockareaName').innerHTML = tradeinfo[0].stockareaName;
            var profileurl = domainURL + "productProfile/" + tradeinfo[0].stockareaName + "/" + tradeinfo[0].productName;
            if( tradeinfo[0].viewmore!==false){
              if ($rootScope.collabratorsinfo.filter(function(e) { return e.productstockId.stockareaId.stockareaName == tradeinfo[0].stockareaName && e.status[e.status.length-1].type!=='active'}).length > 0) {
                document.getElementById('tradeinfoViewProfile').innerHTML = "<i id=\"link\" class=\"fa fa-link\"style=\" float:left;color:#4c81bf; \" title=\"pending\" data-placement='bottom' onmouseenter=\"$(this).tooltip('show')\" aria-hidden=\"true\"></i><a class=\"viewprofile\" href=\"" + profileurl + "\">View Profile</a>";
            } else if ($rootScope.collabratorsinfo.filter(function(e) { return e.productstockId.stockareaId.stockareaName == tradeinfo[0].stockareaName && e.status[e.status.length-1].type=='active'}).length > 0) {
              document.getElementById('tradeinfoViewProfile').innerHTML = "<i id=\"link\" class=\"fa fa-link\"style=\" float:left;color:#72bb53; \" title=\"connected\" data-placement='bottom' onmouseenter=\"$(this).tooltip('show')\" aria-hidden=\"true\"></i><a class=\"viewprofile\" href=\"" + profileurl + "\">View Profile</a>";
              }else{
              document.getElementById('tradeinfoViewProfile').innerHTML = "<i  id=\"link\"  class=\"fa fa-link\"  title=\"connect\" data-placement='bottom' onmouseenter=\"$(this).tooltip('show')\" onClick=angular.element(this).scope().addcollabratorinfo('"+tradeinfo[0].stockareaId+"','"+tradeinfo[0].organisationId+"')   style=\"float:left\"aria-hidden=\"true\"></i><a class=\"viewprofile\" href=\"" + profileurl + "\">View Profile</a>";
            }
          }else{
            if ($rootScope.collabratorsinfo.filter(function(e) { return e.productstockId.stockareaId.stockareaName == tradeinfo[0].stockareaName && e.status[e.status.length-1].type!=='active'}).length > 0) {
            document.getElementById('tradeinfoViewProfile').innerHTML = "<i id=\"link\" class=\"fa fa-link\"style=\" float:left;color:#4c81bf; \" title=\"pending\" data-placement='bottom' onmouseenter=\"$(this).tooltip('show')\" aria-hidden=\"true\"></i>";
          } else if ($rootScope.collabratorsinfo.filter(function(e) { return e.productstockId.stockareaId.stockareaName == tradeinfo[0].stockareaName && e.status[e.status.length-1].type=='active'}).length > 0) {
              document.getElementById('tradeinfoViewProfile').innerHTML = "<i id=\"link\" class=\"fa fa-link\"style=\" float:left;color:#72bb53; \" title=\"connected\" data-placement='bottom' onmouseenter=\"$(this).tooltip('show')\" aria-hidden=\"true\"></i><a class=\"viewprofile\" href=\"" + profileurl + "\">View Profile</a>";
            }else{

            document.getElementById('tradeinfoViewProfile').innerHTML = "<i  id=\"link\"  class=\"fa fa-link\" title=\"connect\" data-placement='bottom' onmouseenter=\"$(this).tooltip('show')\" onClick=angular.element(this).scope().addcollabratorinfo('"+tradeinfo[0].stockareaId+"','"+tradeinfo[0].organisationId+"')   style=\"float:left\"aria-hidden=\"true\"></i>";
          }//<div id="tradeinfoViewProfile"><a class="viewprofile" ui-sref="">View Profile</a></div>
        }  //document.getElementById('tradeinfoViewProfile').innerHTML = "<a class=\"viewprofile\" ui-sref=/productProfile/"+tradeinfo[0].stockareaName+"/"+tradeinfo[0].productName+">View Profile</a>";
            //document.getElementById('tradeinfoTime').innerHTML = "Time "+tradeinfo[0].Time
            $scope.tradedistance = tradeinfo[0].Distance;
          }
        } else {
          $scope.trade = false;

        }
      } else {
        $scope.trade = false;

      }

})
  } //map end
  $scope.resetMapInfo = function() {

    $scope.setMapInfo($scope.mapInfo);
    setTimeout(function() {
      $scope.setMapInfo($scope.mapInfo);
    }, 100);

  };

  $scope.resetMap = function(data) {
    document.getElementById('tradeinfoDistance').innerHTML = null;
    document.getElementById('tradeinfoPhoneNo').innerHTML = null;
    document.getElementById('tradeinfoStockareaName').innerHTML = null;
    document.getElementById('tradeinfoViewProfile').innerHTML = "";
    $scope.tradedistance = null;
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 3,
      center: {
        lat: data.latitude,
        lng: parseFloat(data.longitude)
      },
      mapTypeId: 'roadmap',
      mapTypeControl: false,
      zoomControl: true,
      scaleControl: true,
      streetViewControl: false,
      styles: mapstyle
    });

  };
  //autocomplete start
  $scope.ownautocomplete = function() {
    $("#autocompletesearch").autocomplete({
      source: function(request, response) {
        $http({
          url: domainURL + 'api/secured/authorize/privateproduct/autocomplete',
          method: "GET",
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          },
          params: {
            term: request.term
          }
        }).then(function(data) {
          response($.map(data.data.data, function(item) {
            return {
              label: item.productName,
              value: item.productName,
              productId: item.productId
            };
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
        $scope.getSearchProducts(ui.item.productId, ui.item.value);
      }
    });
  };
  $scope.onenterkeyautocomplete = function(event) {
    if (event.which == 13) {
      $('#autocompletesearch').autocomplete('close');
      $scope.getSearchProducts(null, event.target.value);
    }
  };
  $('#fileInput').change(function() {
    $scope.newup = true;
  });
  $scope.uploadnewprofile = function() {
    $scope.newup = true;
  };

  $scope.uploadFile = function(file) {
    if (file) {
      // ng-img-crop
      var imageReader = new FileReader();
      imageReader.onload = function(image) {
        $scope.$apply(function($scope) {
          $scope.myImage = image.target.result;
        });
      };
    }
      $scope.newup = true;
      imageReader.readAsDataURL(file);
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
  };
  $scope.productimages = [];
  $scope.addcollabratorinfo=function(sid,oid) {
    dashboardService.getProductStockInfo($rootScope.productId,sid).then(function(resp){
    dashboardService.addcollabrator($rootScope.orgId, oid,sid,$rootScope.productId,$rootScope.productstockId,resp.data.data._id).then(function(result) {
if(result.data.code=="200"){
      Notification.success("collabrator request initiated");
    }else{
      Notification.error(result.data.message);
    }
    }, function(err) {
      Notification.error("Error initiating collabrator request");
    });
    })
  };
  $scope.stockDetails=[];
  $scope.uploadimg = function() {
    $('#imgScrollLeftBnt').show();
    $('#imgScrollRightBnt').show();
    $scope.productimages.push({
      img: $scope.myCroppedImage
    });
    $scope.newup = false;
  };
  $scope.changeproductvisiblity=function(id,desc){
    $scope.selectedproductvisiblityvalue=desc;
    $scope.selectedproductvisiblity=id;
    $('#visib').removeClass('open')
  }
  $scope.govg=function(){
if($scope.leftab==1){
  $state.reload('home.virtualgodown');
}else{
     $scope.leftab=1;
     $state.go('home.virtualgodown');
}
  }
  $scope.clickproduct = function(id) {

    var data = {
      categoryId: id
    }
    dashboardService.getSearchProductsInfo(data).then(function(result) {
      if (result.data.data != null) {
        var productsSearch = result.data.data;
        var products = $scope.products;
        for (var d = 0; d < productsSearch.length; d++) {
          for (var e = 0; e < products.length; e++) {
            if (productsSearch[d]._id == products[e].productId.productId) {
              productsSearch[d].state = "ADDED";
            }
          }
        }
        $scope.productsSearch = productsSearch;
        $scope.leftab = 1;
        $state.go('home.virtualgodown');
        document.getElementById('searchresult').style.display = 'block';
      } else {
        $scope.errorsearch = "No products";
      }

    })
  }
  $scope.updatenotification=function(){
    dashboardService.updatenotification().then(function(result){
})
  }
  $scope.getSearchProducts = function(productid, term) {
    $scope.productsSearch=null;
    if (productid == null) {
      var data = {
        term: term
      }
    } else {
      var data = {
        term: term,
        productId: productid
      }
    }
    dashboardService.getSearchProductsInfo(data).then(function(result) {
      if (result.data.data != null) {
        var productsSearch = result.data.data;
        var products = $scope.products;
        for (var d = 0; d < productsSearch.length; d++) {
          for (var e = 0; e < products.length; e++) {
            if (productsSearch[d]._id == products[e].productId.productId) {
              productsSearch[d].state = "ADDED";
            }
          }
        }
        $scope.productsSearch = productsSearch;
      } else {
        $scope.errorsearch = "No products";
        console.log("No products");
      }
    }, function(error) {
      Notification.error('Product Info Not Available');
      $log.info("Product Info Not Available");
    });
  };
  $scope.getSearchprivateProducts = function(productid, term) {
    document.getElementById('searchresult').style.display = 'block';
    dashboardService.getSearchprivateProductsInfo(productid, term).then(function(result) {
      if (result.data.data != null) {
        var productsSearch = result.data.data;
        var products = $scope.products;
        for (var d = 0; d < productsSearch.length; d++) {
          for (var e = 0; e < products.length; e++) {
            if (productsSearch[d]._id == products[e].productId.productId) {
              productsSearch[d].state = "ADDED";
            }
          }
        }
        $scope.productsSearch = productsSearch;
      } else {
        $scope.errorsearch = "No products";
      }
    }, function(error) {
      Notification.error('Product Info Not Available');
      $log.info("Product Info Not Available");
    });
  };
  $scope.subtab113 = function() {
    $scope.subtab1 = 3;
    document.getElementById('addproductdiv').style.display = 'block';
    document.getElementById('searchresult').style.display = 'none';
  }
  $scope.addproduct = function() {
    for (var z = 0; z < $scope.productimages.length; z++) {
      $scope.uploadproductimg($scope.productimages[z].img, z);
    }

  }
  $scope.sourceautocomplete = function() {
    $("#sourceautocompletesearch").autocomplete({
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
          headers: {
            'Content-Type': 'application/json'
          },
          url: domainURL + 'api/secured/authorize/brand/autocomplete',
          success: function(data) {

            var array = $.map(data.data, function(item) {
              return {
                label: item.brandName,
                value: item.brandName
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
        $scope.sourcesubmit(ui.item.value);
      }
    });
  }
  $scope.sourcesubmit = function(search) {
    if (search !== null) {
      dashboardService.brand(search).then(function(response) {
        $scope.sourcesearch = search;
        $scope.productbrand = response.data._id;
      }, function(data) {});
    } else {}

  };
  $scope.deleteproductimage = function(item) {
    var index = $scope.productimages.indexOf(item);
    $scope.productimages.splice(index, 1);
  }
  $scope.leftab3 = function() {
    var data = {
      type: 'private',
      term:" "
    }
    dashboardService.getSearchProductsInfo(data).then(function(result) {
      if (result.data.data != null) {
        var productsSearch = result.data.data;
        var products = $scope.products;
        if($scope.products==null || $scope.products==undefined || !$scope.products){

        }else{
        for (var d = 0; d < productsSearch.length; d++) {
          for (var e = 0; e < products.length; e++) {
            if (productsSearch[d]._id == products[e].productId.productId) {
              productsSearch[d].state = "ADDED";
            }
          }
        }
      }
        $scope.productsSearch = productsSearch;
      } else {
        $scope.errorsearch = "No products";
      }
    }, function(error) {
      Notification.error('Product Info Not Available');
      $log.info("Product Info Not Available");
    });
    $scope.leftab = 3;
    $rootScope.sid = localStorage.getItem('selectedStockareaId');
    $state.go('home.myorg');
  }
  $scope.leftab4 = function() {
    $scope.leftab = 4;
    $state.go('home.stockarea');
  }
  $scope.leftab2 = function() {
    dashboardService.getprivateproducts().then(function(response) {
      $scope.productsSearch = response.data.data;
      $scope.leftab = 2;
      $rootScope.sid = null;
      $rootScope.uid = $rootScope.userId;
      $state.go('home.ownedbyme')
    }, function(err) {
      Notification.error("Getting owned items error");
    })

  }
  $scope.leftab1 = function() {
    $rootScope.sid = null;
    $rootScope.uid = null;
    $scope.productsSearch = [];
    $scope.leftab = 1;
    $state.go('home.virtualgodown');
  }
  $scope.pictures = [];
  $scope.uploadproductimg = function(img, z) {
    var end = z;
    dashboardService.geturl(img).then(function(data) {
      $scope.pictures.push(data.data.url);
      var length = $scope.productimages.length - 1;
      $scope.urltoFile(img, data.data.name + '.jpg', 'image/jpeg')
        .then(function(file) {
          var buf = file;
          $.ajax({
            type: "PUT",
            data: buf,
            url: data.data.signed_request,
            processData: false,
            contentType: 'image/jpeg',
            success: function(data1) {}.bind(this),
            error: function(xhr, status, err) {}.bind(this)
          });
        })
      if (length == end) {
        var pics = [];
        for (var k = 0; k < $scope.pictures.length; k++) {
          pics.push({
            "img": $scope.pictures[k]
          })
        }
        dashboardService.addprivateproduct($scope.productOwner, $scope.productname, $scope.productcategory, $scope.producttype, $scope.productdescription, $scope.productbrand, $scope.productmanufacturer, $rootScope.orgId, pics).then(function(response) {
          Notification.success("product added successfully")
        }, function(err) {
          Notification.error("error adding product")
        })
      }
    })
  }

  $scope.stockareasubtab1 = function() {
    $scope.stockareasubtab = 1
  }
  $scope.stockareasubtab4 = function() {
      $scope.stockareasubtab = 4
    }
  $scope.stockareasubtab2 = function() {
    $scope.stockareasubtab = 2
  }
  $scope.stockareasubtab3 = function() {
    $scope.stockareasubtab = 3
  }
  //autocomplete end

  $rootScope.page = true;
  $rootScope.editSelectedStockarea = false;
  $scope.viewbuy = function(data, tradeSourceId) {
    var dialogInst = $uibModal.open({
      templateUrl: domainURL + 'views/dashboard/materialview.html',
      controller: 'AdminPagematerialviewctrl',
      size: 'lg',
      resolve: {
        productId: function() {
          return data;
        },
        tradeSourceId: function() {
          return tradeSourceId;
        },
        destinationStockareName: function() {
          return $scope.stockareaName;
        }
      }
    });
    dialogInst.result.then(function(fmsid) {}, function() {});
  }
  $scope.deleteproduct = function(productId) {
    $scope.selectedName = localStorage.getItem('selectedStockareaName')
    if(!productId || productId==null || productId==undefined){
      Notification.error("You have not added any products to your stockarea");
    }else{
    dashboardService.deleteProduct(localStorage.getItem('selectedStockareaId'), productId).then(function(result) {
      Notification.success("Product removed from" + localStorage.getItem('selectedStockareaName'));
    }, function(err) {
      Notification.error("Product removing error");
    });
  }
  }
  $scope.deletestockarea = function(name) {
    var stockareaName = localStorage.getItem('selectedStockareaName')
    if (stockareaName == name.toUpperCase()) {
      dashboardService.deleteStockarea(localStorage.getItem('selectedStockareaId')).then(function(result) {
        Notification.success("Stockarea deleted successfully");
        $scope.ds = true;
        window.location.reload();
      }, function(err) {
        Notification.error("Error deleting stockarea");
      });
    } else {
      Notification.error("Entered text doesn't match with the stockarea name you wish to delete");
    }

  };
  $scope.viewsell = function(productid) {
    var dialogInst = $uibModal.open({
      templateUrl: domainURL + 'views/dashboard/materialviewsell.html',
      controller: 'materialViewSellCtrl',
      size: 'lg',
      resolve: {
        productid: function() {
          return productid;
        }
      }
    });
    dialogInst.result.then(function(stockDetails) {
      $scope.stockDetails = stockDetails;
    }, function(stockDetails) {
      if (stockDetails == "cancel" || stockDetails == "backdrop click") {} else {
        $scope.stockDetails = stockDetails;
      }
    });
  }
  //InvoiceViewCtrl
  $scope.resetsearch = function() {
    $scope.search = null;
    $scope.productsSearch = null;
    $scope.getSearchProduct = null;
  };
  $scope.viewInvoice = function(order) {
    var orderId = order.orderId.orderId;
    for (var i = 0; i < $scope.orderInfo.length; i++) {
      $scope.orderInfo[i].active = false;
    }
    order.active = true;
    $scope.transactionInfo = order;


    // dashboardService.getOrderInvoice(localStorage.getItem('selectedStockareaId'),orderId).then(function(result){
    // $scope.transactionInfo = result.data.data;
    // },function(error){
    //   Notification.error('Cannot Process Transaction Details');
    // });


    // var dialogInst = $uibModal.open({
    //               templateUrl: '/views/dashboard/invoiceview.html',
    //               controller: 'InvoiceViewCtrl',
    //               size: 'lg',
    //               resolve: {
    //                 stockareaid: function () {
    //                     return '13213223';
    //                     },
    //                     orderid:function(){
    //                       return orderId;
    //                           }
    //                         }
    //                       });
    //               dialogInst.result.then(function(fmsid) {
    //                           }, function () {
    //                           });
  }
  $scope.dp = false;
  $scope.ds = false;
  //InvoiceViewCtrl END
  $scope.addProductsToStockarea = function(productid) {
    //$state.go("signUp2");
    var products = [];
    products.push(productid);
    if (!$scope.productInfo) {
      $scope.productInfo = {};
      $scope.productInfo.state = "ADDED";
    } else {
      $scope.productInfo.state = "ADDED";
    }
    for (var i = 0; i < $scope.productsSearch.length; i++) {
      if ($scope.productsSearch[i]._id == productid) {
        $scope.productsSearch[i].state = "ADDED"
      }
    }
    dashboardService.addProductsToStcokarea(localStorage.getItem('selectedStockareaId'), products).then(function(result) {
      Notification.success("Product added to " + localStorage.getItem('selectedStockareaName'))
      $scope.getStockAreaProductFn(localStorage.getItem('selectedStockareaId'));

    }, function(err) {
      Notification.error("error");
    });
  };



  $scope.renameStockarea = function() {

    dashboardService.renameStockarea($scope.renameStockareaValue, localStorage.getItem('selectedStockareaId')).then(function(result) {
      for (var i = $scope.stockarea.length - 1; i >= 0; i--) {
        if ($scope.stockarea[i].stockareaId == localStorage.getItem('selectedStockareaId'))
          $scope.stockarea[i].stockareaName = $scope.renameStockareaValue;
        $scope.stockareaName = $scope.renameStockareaValue;
      }
    });
  };
  // //Check Box Selection

  // Selected fruits
  $scope.selection = [];

  // Toggle selection for a given fruit by name
  $scope.toggleSelection = function toggleSelection(productName) {
    var idx = $scope.selection.indexOf(productName);

    // Is currently selected
    if (idx > -1) {
      $scope.selection.splice(idx, 1);
    }

    // Is newly selected
    else {
      $scope.selection.push(productName);
    }
  };
  $rootScope.loading = true;
  $scope.viewProductFn = function(productId) {
    $rootScope.loading = false;
    $scope.tab = 5;
  //  $scope.search=null;
$state.go('home.virtualgodown',{'productid':productId})
  };
  $scope.selectProductFn = function(productId, stockareaId) {
    $rootScope.loading = false;
    for (var i = 0; i < $scope.products.length; i++) {
      if ($scope.products[i].productId.productId == productId) {
        if ($scope.products[i].checked == false) {
          $scope.getProductDetails(productId, stockareaId);
          $scope.products[i].checked = true;
          $rootScope.productId = $scope.products[i].productId._id;
          $rootScope.type = $scope.products[i].productId.type;
          $rootScope.selectedproductcategory = $scope.products[i].productId.categoryId._id;
          $rootScope.productowner = $scope.products[i].productId.createdBy;
          $rootScope.productName = $scope.products[i].productId.productName
          $rootScope.productstockId = $scope.products[i]._id;
          $rootScope.source = $scope.products[i];
          dashboardService.getProductStockInfo(productId,stockareaId).then(function(resp){
          })
        }
      } else {
        $scope.products[i].checked = false;
      }
    }
  };
  $scope.getStockAreaProductFn = function(productStockareaId) {
    $rootScope.loading = true;
    dashboardService.getStockAreaProducts(localStorage.getItem("userId"), productStockareaId).then(function(result) {
      $rootScope.loading = false;
      $rootScope.productsinstockarea=result.data.data.products;
      $scope.products = result.data.data.products;
      if (result.data.data.products.length == 0) {
        $scope.trade = false;
        //$scope.setMapInfo(result.data.data);
        $scope.stockareaInfo = {};
        $scope.productInfo = {};
        $scope.orderInfo = [];
        $scope.productStockInfo = {};
        $rootScope.productName = null;
        $rootScope.productId = null;
        $rootScope.type==null;
        $rootScope.selectedproductcategory = null;
        $rootScope.productowner =null;
        $rootScope.productstockId = null;
        $scope.resetMap(result.data.data);
        dashboardService.getstockareainfo(localStorage.getItem('selectedStockareaId')).then(function(data) {
          $scope.setMapInfo(data.data.data);
        })
      }
      if (result.data.data.products != null) {
        for (var i = 0; i < result.data.data.products.length; i++) {
          if ($rootScope.productId == null || $rootScope.productId == undefined && $rootScope.productstockId !== productStockareaId) {
              $rootScope.productName = result.data.data.products[i].productId.productName;
              $rootScope.productId = result.data.data.products[i].productId._id;
              dashboardService.getProductStockInfo($rootScope.productId,$rootScope.stockareaId).then(function(resp){
              $rootScope.collabratorsinfo=resp.data.data.collabrators
              $rootScope.productstockId=resp.data.data._id
              })
              $rootScope.type = result.data.data.products[i].productId.type;
              $rootScope.selectedproductcategory = result.data.data.products[i].productId.categoryId._id;
              $rootScope.productowner =result.data.data.products[i].productId.createdBy;
              $rootScope.source = result.data.data.products[i];
              $rootScope.productstockId = productStockareaId;
              $scope.getProductDetails(result.data.data.products[i].productId.productId, result.data.data.products[i].stockareaId);
              result.data.data.products[i].checked = true;
          } else {
            if (result.data.data.products[i].productId._id == $rootScope.productId) {
              $scope.getProductDetails(result.data.data.products[i].productId.productId, result.data.data.products[i].stockareaId);
              dashboardService.getProductStockInfo($rootScope.productId,$rootScope.stockareaId).then(function(resp){
                $rootScope.collabratorsinfo=resp.data.data.collabrators
                $rootScope.productstockId=resp.data.data._id
              })
              result.data.data.products[i].checked = true;
            } else {
              result.data.data.products[i].checked = false;
            }
        }
        $scope.products = result.data.data.products;
      }
    }
    }, function(error) {
      Notification.error('Stockarea Not Available');
      $log.info("Invalid UserName/Password");
    });
  };
$scope.updatestockareavisiblity=function(){
  dashboardService.updatestockareavisiblity($scope.selectedproductvisiblity).then(function(resp){
    if(resp.data.code=="200"){
      $rootScope.stockareatype=$scope.selectedproductvisiblity;
      Notification.success("visiblity successfully updated");
    }else{
      Notification.success("visiblity update failed");
    }
  })

}
$scope.mapinfochange=function(productid,stockareaid,position){
if(!position || position==null || position==undefined){
$scope.position={"south": -26.785178341287427, "west": -19.26303710000002, "north": 43.03650486152034, "east": 175.50258789999998}
}else{
$scope.position=position;
}
  dashboardService.mapInfo(productid,stockareaid,$scope.position).then(function(result) {
    if (result.data.data != null) {
      $scope.mapInfo = result.data.data;
      if ($scope.mapInfo.destinations.length == 0) {
      }
      var myoverlay = new google.maps.OverlayView();
      myoverlay.draw = function() {
        this.getPanes().markerLayer.id = 'markerLayer';
      };
      myoverlay.setMap(map)
      $scope.setMapInfo($scope.mapInfo);

      $('#markerLayer img').css('animation', 'pulse' + ' 1s infinite alternate');
      $('#markerLayer img').css('-webkit-animation', 'pulse' + ' 1s infinite alternate')
    }

  }, function(error) {
    Notification.error('Map Info Not Available');
    $log.info("Map Info Not Available");
  });
}
  $scope.getProductDetails = function(productid,stockareaid,position) {
    $scope.trade = true;
if(!position || position==null || position==undefined){
  $scope.position={"south": -26.785178341287427, "west": -19.26303710000002, "north": 43.03650486152034, "east": 175.50258789999998}
}else{
  $scope.position=position;
}
    dashboardService.mapInfo(productid,stockareaid,$scope.position).then(function(result) {
      if (result.data.data != null) {
        $scope.mapInfo = result.data.data;
        if ($scope.mapInfo.destinations.length == 0) {
          $scope.trade = false;
        }
        var myoverlay = new google.maps.OverlayView();
        myoverlay.draw = function() {
          this.getPanes().markerLayer.id = 'markerLayer';
        };
        myoverlay.setMap(map)
        $scope.setMapInfo($scope.mapInfo);

        $('#markerLayer img').css('animation', 'pulse' + ' 1s infinite alternate');
        $('#markerLayer img').css('-webkit-animation', 'pulse' + ' 1s infinite alternate')
      }

    }, function(error) {
      Notification.error('Map Info Not Available');
      $log.info("Map Info Not Available");
    });

    $scope.setImageList = function() {
      $scope.setBtn();

    }

    $scope.imgScrollRightBntFn = function() {

      var scrolLeft = $('#imageList').scrollLeft() + 360;
      var scrollWidth = $('#imageList')[0].scrollWidth;
      if ((scrollWidth - scrolLeft) > 0) {
        if ((scrollWidth - scrolLeft) > 60) {
          $('#imageList').scrollLeft($('#imageList').scrollLeft() + 60);
        } else {
          $('#imageList').scrollLeft($('#imageList').scrollLeft() + scrollWidth - scrolLeft);
        }

      } else {
        $('#imgScrollRightBnt').hide();
      }
      $scope.setBtn();
    }
    $scope.imgScrollRightBntFn1 = function() {

      var scrolLeft = $('#imageList1').scrollLeft() + 360;
      var scrollWidth = $('#imageList1')[0].scrollWidth;
      if ((scrollWidth - scrolLeft) > 0) {
        if ((scrollWidth - scrolLeft) > 60) {
          $('#imageList1').scrollLeft($('#imageList1').scrollLeft() + 60);
        } else {
          $('#imageList1').scrollLeft($('#imageList1').scrollLeft() + scrollWidth - scrolLeft);
        }

      }
      $scope.setBtn1();
    };

    $scope.setBtn = function() {
      $('#imgScrollLeftBnt').hide();
      $('#imgScrollRightBnt').hide();
      var x = $('#imageList').scrollLeft();
      var y = 360;
      if($('#imageList')[0]){
      var z = $('#imageList')[0].scrollWidth;
      if (x > 0)
        $('#imgScrollLeftBnt').show();
      if (z > (x + y))
        $('#imgScrollRightBnt').show();
      }
    }
    $scope.setBtn1 = function() {
      $('#imgScrollLeftBnt').show();
      $('#imgScrollRightBnt').show();
      var x = $('#imageList1').scrollLeft();
      var y = 360;
      var z = $('#imageList1')[0].scrollWidth;
      if (x > 0)
        $('#imgScrollLeftBnt1').show();
      if (z > (x + y))
        $('#imgScrollRightBnt1').show();
    }
    $scope.imgScrollLeftBntFn = function() {

      var scrolLeft = $('#imageList').scrollLeft() + 360;
      var scrollWidth = $('#imageList')[0].scrollWidth;
      var scrollRight = (scrollWidth - scrolLeft) + 360;
      if (scrollRight < scrollWidth) {
        if ((scrollWidth - scrollRight) > 60) {
          $('#imageList').scrollLeft($('#imageList').scrollLeft() - 60);
        } else {
          $('#imageList').scrollLeft($('#imageList').scrollLeft() - (scrollWidth - scrollRight));
        }

      } else {
        $('#imgScrollLeftBnt').hide();
      }
      $scope.setBtn();
    }
    $scope.imgScrollLeftBntFn1 = function() {

      var scrolLeft = $('#imageList1').scrollLeft() + 360;
      var scrollWidth = $('#imageList1')[0].scrollWidth;
      var scrollRight = (scrollWidth - scrolLeft) + 360;
      if (scrollRight < scrollWidth) {
        if ((scrollWidth - scrollRight) > 60) {
          $('#imageList1').scrollLeft($('#imageList1').scrollLeft() - 60);
        } else {
          $('#imageList1').scrollLeft($('#imageList1').scrollLeft() - (scrollWidth - scrollRight));
        }

      }
      $scope.setBtn1();
    }

    $scope.setImgSrc = function(imgSrc) {
      $scope.imgSrc = imgSrc;
    }
    $scope.setImgSrc1 = function(imgSrc) {
      $scope.imgSrc1 = imgSrc;
    }
    dashboardService.productInfo(productid, stockareaid).then(function(result) {
      if (result.data.data != null) {
        $rootScope.productId = result.data.data._id;
        $rootScope.type = result.data.data.type;
        $rootScope.selectedproductcategory = result.data.data.categoryId._id;
        $rootScope.productowner = result.data.data.createdBy;
        $rootScope.ProductName = result.data.data.productName;
        $scope.productInfo = result.data.data;
        if ($scope.productInfo.images.length != 0)
          $scope.imgSrc = $scope.productInfo.images[0];
        $scope.setBtn();
        //  $scope.productinfopageopen(result.data.data._id, result.data.data.productName, $scope.productInfo.images, $scope.productInfo.specifications, "ADDED")
      }
    }, function(error) {
      Notification.error('Product Info Not Available');
      $log.info("Product Info Not Available");
    });

    $scope.loading1 = true;
    dashboardService.getProductStockInfo(productid, stockareaid).then(function(result) {
      $scope.loading1 = false;
      if (result.data.data != null) {
        $scope.productStockInfo = result.data.data;
        $scope.stockDetails = $scope.productStockInfo.stockDetails
        console.log($scope.stockDetails);
      }
    }, function(error) {
      Notification.error('Product Stock Info Not Available');
      $log.info("Product Stock Info Not Available");
    });


    dashboardService.stockareaInfo(productid, stockareaid).then(function(result) {
      if (result.data.data != null) {
        $rootScope.sorcestockid = stockareaid;
      }
    }, function(error) {
      Notification.error('Stockarea Info Not Available');
      $log.info("Stockarea Info Not Available");

    });

  };
  $scope.getbrandmaterialinfo = function(materialId, brandId) {
    dashboardService.getbrandmaterialinfo(materialId, brandId).then(function(response) {
      $scope.materialinfo = response.data.data;
    }, function(error) {
      Notification.error("brandmaterial error");
    })
  }
  $scope.productdescription = [{
    "key": "",
    "value": ""
  }]
  $scope.addproductdescription = function() {
    $scope.productdescription.push({
      "key": "",
      "value": ""
    })
  }
  $scope.removeproductdescription = function() {
    $scope.productdescription.pop()
  }

  $scope.approve = function(orderId) {
    dashboardService.conform(orderId).then(function(data) {
      Notification.sucess('order conformed');
      dashboardService.orderInfo(productid, stockareaid).then(function(result) {
        if (result.data.data != null) {
          $scope.orderInfo = result.data.data;
        }
      }, function(error) {
        Notification.error("Order Info Not Available");
        $log.info("Order Info Not Available");
      });
    }, function(Err) {
      Notification.error('Err');
    })
  }
  $scope.cancel = function(orderId) {
    dashboardService.cancel(orderId).then(function(data) {
      Notification.sucess('order cancelled successfully');
      dashboardService.orderInfo(productid, stockareaid).then(function(result) {
        if (result.data.data != null) {
          $scope.orderInfo = result.data.data;
        }
      }, function(error) {
        Notification.error("Order Info Not Available");
        $log.info("Order Info Not Available");
      });
    }, function(Err) {
      Notification.error('Err');
    })
  }
  $scope.deliveried = function(orderId) {
    dashboardService.deliveried(orderId).then(function(data) {
      Notification.Sucess('order cancelled successfully');
      dashboardService.orderInfo(productid, stockareaid).then(function(result) {
        if (result.data.data != null) {
          $scope.orderInfo = result.data.data;
        }
      }, function(error) {
        Notification.error("Order Info Not Available");
        $log.info("Order Info Not Available");
      });
    }, function(Err) {
      Notification.error('Err');
    })
  }
  $scope.selectStockarea = function(stockareaId, stockareaName,visiblity) {
    $scope.transactionInfo = null;
    $rootScope.productId = null;
    $rootScope.productstockId = null;
    $scope.products = null;
    $rootScope.stockareatype = null;
    $rootScope.type = null;
    $rootScope.selectedproductcategory = null;
    if (stockareaId != localStorage.getItem('selectedStockareaId')) {
      $scope.search = null;
      $scope.productsSearch;
      $scope.getSearchProduct = null;
      $scope.trade = false;
      //    $scope.productinfopageclose();
      $scope.getStockAreaProductFn(stockareaId);
      $scope.selectClassStockarea(stockareaId);
      localStorage.setItem('selectedStockareaId', stockareaId);
      localStorage.setItem('selectedStockareaName', stockareaName);
$rootScope.stockareatype=visiblity;
for(var i=0;i<$scope.stockareatypes.length;i++){
  if($rootScope.stockareatype==$scope.stockareatypes[i]._id){
    $scope.selectedproductvisiblityvalue=$scope.stockareatypes[i].desc;
    $scope.selectedproductvisiblity=$scope.stockareatypes[i]._id;
  }
}
      $rootScope.stockareaId = localStorage.getItem('selectedStockareaId');
      $scope.stockareaName = stockareaName;
      $rootScope.StockareaName=stockareaName;
      $scope.tab = 1;

    }
  }
  $scope.notificationselectStockarea = function(stockareaId) {
    $scope.transactionInfo = null;
    $rootScope.productstockId = null;

    if (stockareaId != localStorage.getItem('selectedStockareaId')) {
      $scope.search = null;
      $scope.productsSearch = null;
      $scope.getSearchProduct = null;
      $scope.trade = false;
      //    $scope.productinfopageclose();
      $scope.getStockAreaProductFn(stockareaId);
      $scope.selectClassStockarea(stockareaId);
      localStorage.setItem('selectedStockareaId', stockareaId);
      //localStorage.setItem('selectedStockareaName', stockareaName);
      dashboardService.getstockareainfo(stockareaId).then(function(data) {
      $rootScope.stockareaId = localStorage.getItem('selectedStockareaId');
      $scope.stockareaName = data.data.data.source.stockareaName;
      $rootScope.StockareaName=data.data.data.source.stockareaName;
      $rootScope.stockareatype=data.data.data.source.visiblity;
      for(var i=0;i<$scope.stockareatypes.length;i++){
        if($rootScope.stockareatype==$scope.stockareatypes[i]._id){
          $scope.selectedproductvisiblityvalue=$scope.stockareatypes[i].desc;
          $scope.selectedproductvisiblity=$scope.stockareatypes[i]._id;
        }
      }
      $scope.tab = 3;

    })
  }
}

  $scope.selectClassStockarea = function(stockareaId) {
    for (var i = 0; i < $scope.stockarea.length; i++) {
      if ($scope.stockarea[i].stockareaId == stockareaId)
        $scope.stockarea[i].selected = true;
      else
        $scope.stockarea[i].selected = false;
    }
  };
  $rootScope.addAStockarea = function(data) {
    $scope.stockarea[$scope.stockarea.length] = data;
    $scope.selectStockarea($scope.stockarea[$scope.stockarea.length - 1].stockareaId, $scope.stockarea[$scope.stockarea.length - 1].stockareaName, $scope.stockarea[$scope.stockarea.length - 1].visiblity);
  }


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
}]);

vgApp.controller('faqcontroller', ['$scope', 'dashboardService', '$timeout', 'Notification', function($scope, dashboardService, $timeout, Notification) {


}]);
vgApp.controller('ownedbymeController', ['$scope', 'dashboardService', '$timeout', 'Notification', function($scope, dashboardService, $timeout, Notification) {


}]);
vgApp.controller('virtualgodownhomeController', ['$scope', 'dashboardService', '$timeout', 'Notification', function($scope, dashboardService, $timeout, Notification) {


}]);

vgApp.directive('myPostRepeatDirective', function() {
  return function(scope, element, attrs) {
    if (scope.$last) {
      // iteration is complete, do whatever post-processing
      // is necessary
      setInterval(scope.setBtn(), 1000);

      $('#imgScrollLeftBnt').hide();
      $('#imgScrollRightBnt').hide();
      var x = $('#imageList').scrollLeft();
      var y = 360;
      var z = scope.$parent.productInfo.images.length * 128;

      if (x > 0)
        $('#imgScrollLeftBnt').show();
      if (z > (x + y))
        $('#imgScrollRightBnt').show();



    }
  };
});

vgApp.directive('myPostRepeatDirectiv', function() {
  return function(scope, element, attrs) {
    if (scope.$last) {

      // iteration is complete, do whatever post-processing
      // is necessary
      setInterval(scope.setBtn1(), 1000);

      $('#imgScrollLeftBnt1').show();
      $('#imgScrollRightBnt1').show();
      var x = $('#imageList1').scrollLeft();
      var y = 360;
      var z = scope.productimages.length * 128;

      if (x > 0)
        $('#imgScrollLeftBnt1').show();
      if (z > (x + y))
        $('#imgScrollRightBnt1').show();
    }
  };
});
