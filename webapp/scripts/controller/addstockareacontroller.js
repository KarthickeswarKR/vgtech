
vgApp.controller('addStockareaCtrl', ['$scope', '$uibModalInstance', 'stockareaid', 'productid', '$state', 'dashboardService', '$timeout', '$uibModal', '$rootScope', 'scope', 'Notification', function($scope, $uibModalInstance, stockareaid, productid, $state, dashboardService, $timeout, $uibModal, $rootScope, scope, Notification) {
  //map start
  $scope.readname = false;
  $scope.adrs = false;
  var map2;
  dashboardService.stockareatypes().then(function(response) {
    $scope.types = response.data;
    $scope.stockareavisiblity=$scope.types[0]._id;
  });
  dashboardService.codes().then(function(data) {
    $scope.codes = data.data.data.code;
    $scope.code = "+91";
  });
  $scope.myregex = /[a-zA-Z0-9-]+/;
  $scope.space = function() {
    Notification.error("space is not allowed");
  };
  $rootScope.highlightcollabrator=null;

  var styledMapType = new google.maps.StyledMapType([{
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
      "elementType": "geometry.fill",
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
      "elementType": "labels",
      "stylers": [{
        "visibility": "off"
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
          "color": "#eeeeee"
        },
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text",
      "stylers": [{
        "visibility": "off"
      }]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [{
          "color": "#757575"
        },
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi.business",
      "stylers": [{
        "visibility": "off"
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
      "featureType": "poi.park",
      "elementType": "labels.text",
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
      "elementType": "labels",
      "stylers": [{
        "visibility": "off"
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
  ], {
    name: 'Styled Map'
  });

  var myGeocoder = new google.maps.Geocoder({
    region: 'IN'
  });
  $uibModalInstance.rendered.then(function() {
    var markers = [];
    var map2 = new google.maps.Map(document.getElementById('map2'), {
      //minZoom: 3,
      zoom: 3,
      fullscreenControl: false,
      center: new google.maps.LatLng(22.745154893908804, 78.25780350000002),
      mapTypeId: 'roadmap',
      mapTypeControl: false,
      streetViewControl: false,
      mapTypeControlOptions: {
        mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain',
          'styled_map'
        ]
      }
    });

    //  map2.mapTypes.set('styled_map', styledMapType);
    //  map2.setMapTypeId('styled_map');
    google.maps.event.trigger(map2, 'resize');
    var myLatLng = {
      lat: 22.745154893908804,
      lng: 78.25780350000002
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
    /*      var defaultBounds = new google.maps.LatLngBounds(
          new google.maps.LatLng(51.601476, -0.140634),
          new google.maps.LatLng(51.501476, -0.240634));*/
    //map2.fitBounds(defaultBounds);
    var input = document.getElementById('searchmap');
    map2.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
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
        map2.set({
          zoom: 3
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
    //map end
  });



  var id = productid;
  $scope.stockareaid = stockareaid;
  $scope.productid = productid;
  $scope.close = function() {
    if ($rootScope.userstatus !== 'pending') {
      $uibModalInstance.dismiss('cancel');
    }
  };
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
      });
    } else {
      $scope.na = null;
      $scope.state = null;
    }
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

    if ($scope.address == null) {
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
      $scope.ph = "Phone number is required";
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
  $scope.fnAddStockarea = function() {
    var data = {
      "stockareaName": $scope.stockareaName,
      "latitude": $scope.latitude,
      "longitude": $scope.longitude,
      "phone": $scope.phone,
      "code": $scope.code,
      "visiblity":$scope.stockareavisiblity,
      "organisationId": $rootScope.orgId
    };
    if ($scope.stockareaName !== null && $scope.latitude !== null && $scope.longitude !== null && $scope.phone !== null && $scope.exist == false && $scope.stockareaName !== undefined && $scope.latitude !== undefined && $scope.longitude !== undefined && $scope.phone !== undefined) {
      dashboardService.postAddStockarea(data).then(function(result) {
        if(result.data.code=="200"){
        scope.tab = 1;
        $uibModalInstance.close(result, "done");
      }else{
        Notification.error(result.data.message);
      }
      }, function(error) {
        Notification.error('Error creating stockarea!');
        $log.info("Stockarea Not Added");
      });
    } else {
      if ($scope.stockareaName == null || $scope.stockareaName == undefined) {
        $scope.na = "stockarea name required";
      }
      if($scope.latitude !== null || $scope.longitude !== null){
        Notification.error(" please select a location ");
      }
      if ($scope.phone == null) {
        $scope.phonestate = null;
        $scope.ph = "Phone number is required";
      }
    }
  };
}]);
