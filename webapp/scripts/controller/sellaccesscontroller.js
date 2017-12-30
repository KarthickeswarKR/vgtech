
vgApp.controller('sellaccessctrl', ['$scope', '$uibModalInstance', 'stockareaid', 'productid', '$state', 'dashboardService', '$timeout', '$uibModal', '$rootScope', 'scope', 'Notification', function($scope, $uibModalInstance, stockareaid, productid, $state, dashboardService, $timeout, $uibModal, $rootScope, scope, Notification) {
  //map start
  $scope.readname = false;
  $scope.adrs = false;
  var map2;
  $rootScope.highlightcollabrator=null;
  $scope.close = function() {
      $uibModalInstance.dismiss('cancel');
  };
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
    var map = new google.maps.Map(document.getElementById('map2'), {
      //minZoom: 3,
      zoom: 3,
      fullscreenControl: false,
      center: new google.maps.LatLng(22.745154893908804, 78.25780350000002),
      mapTypeId: 'roadmap',
      mapTypeControl: false,
      streetViewControl: false,
    });
    var drawingManager = new google.maps.drawing.DrawingManager({

       drawingControl: true,
       drawingControlOptions: {
         position: google.maps.ControlPosition.TOP_CENTER,
         drawingModes: ['polygon']
       },
       markerOptions: {icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'},
       circleOptions: {
         fillColor: '#ffff00',
         fillOpacity: 1,
         strokeWeight: 5,
         clickable: false,
         editable: true,
         zIndex: 1
       }
     });

     drawingManager.setMap(map);
   google.maps.event.addListener(drawingManager, 'polygoncomplete', function (polygon) {
 var coordinates = (polygon.getPath().getArray());
var co=JSON.stringify(coordinates);
 console.log(co);


});

     // Define the LatLng coordinates for the polygon's path.
     var a =[{"lat":9.870437276290632,"lng":78.1955337524414},{"lat":9.90324500326577,"lng":78.1618881225586},{"lat":9.912038270107562,"lng":78.12686920166016},{"lat":9.882951950115636,"lng":78.07125091552734},{"lat":9.877878491063422,"lng":78.07605743408203},{"lat":9.871790236942253,"lng":78.07605743408203},{"lat":9.871451997300548,"lng":78.0685043334961},{"lat":9.875172614246278,"lng":78.06438446044922},{"lat":9.857922126831562,"lng":78.05889129638672},{"lat":9.855554342395859,"lng":78.07228088378906},{"lat":9.835596627067718,"lng":78.079833984375},{"lat":9.851495243815526,"lng":78.08670043945312},{"lat":9.845744768680643,"lng":78.11450958251953},{"lat":9.82138870534266,"lng":78.12137603759766},{"lat":9.796015900018244,"lng":78.11176300048828},{"lat":9.757783877843872,"lng":78.09356689453125},{"lat":9.686721575790171,"lng":78.10352325439453},{"lat":9.669799758186645,"lng":78.23261260986328},{"lat":9.712441104330008,"lng":78.3108901977539},{"lat":9.779099618309717,"lng":78.33698272705078},{"lat":9.810563212682444,"lng":78.29509735107422},{"lat":9.830184157433019,"lng":78.24462890625},{"lat":9.857922126831562,"lng":78.21990966796875},{"lat":9.871113757311363,"lng":78.20137023925781}];
      var b =[{"lat":15.562190330305713,"lng":79.53826904296875},{"lat":15.59922947885929,"lng":79.65911865234375},{"lat":15.578065068620155,"lng":79.77996826171875},{"lat":15.591293080633239,"lng":79.8541259765625},{"lat":15.538375926292062,"lng":79.947509765625},{"lat":15.525144512255302,"lng":80.04913330078125},{"lat":15.384839462641903,"lng":80.03814697265625},{"lat":15.281535661318262,"lng":80.0244140625},{"lat":15.13311303535822,"lng":79.95574951171875},{"lat":14.564976033268989,"lng":79.95849609375},{"lat":14.64736838389663,"lng":79.6728515625},{"lat":14.716447783648722,"lng":79.442138671875},{"lat":14.804093978789302,"lng":79.398193359375},{"lat":14.902321826141808,"lng":79.464111328125},{"lat":15.069471431702285,"lng":79.43939208984375},{"lat":15.228539583518842,"lng":79.486083984375},{"lat":15.390135715305219,"lng":79.5245361328125},{"lat":15.45632749004354,"lng":79.36798095703125},{"lat":15.556898478587641,"lng":79.36798095703125}];
         var c =[{"lat":21.207458730482642,"lng":71.015625},{"lat":21.268899719967695,"lng":70.3125},{"lat":21.667638606781576,"lng":70.235595703125},{"lat":21.871694635142717,"lng":69.884033203125},{"lat":22.156883186860703,"lng":69.63134765625},{"lat":22.329752304376473,"lng":69.6533203125},{"lat":22.309425841200188,"lng":69.993896484375},{"lat":22.502407459497753,"lng":70.257568359375},{"lat":22.664709810176827,"lng":70.46630859375},{"lat":22.63429269379353,"lng":71.16943359375},{"lat":22.268764039073965,"lng":71.466064453125},{"lat":22.09581971780769,"lng":71.905517578125},{"lat":21.861498734372567,"lng":71.87255859375},{"lat":22.01436065310321,"lng":71.356201171875},{"lat":21.82070785387502,"lng":71.356201171875},{"lat":21.48374090716327,"lng":71.553955078125}];
            var d =[{"lat":52.32191088594773,"lng":47.109375},{"lat":52.3755991766591,"lng":44.736328125},{"lat":51.890053935216926,"lng":42.890625},{"lat":50.233151832472245,"lng":39.9462890625},{"lat":52.214338608258196,"lng":34.9365234375},{"lat":54.80068486732233,"lng":32.3876953125},{"lat":57.562995459387146,"lng":31.8603515625},{"lat":60.34869562531862,"lng":34.892578125},{"lat":60.65164736580914,"lng":36.5625},{"lat":60.326947742998414,"lng":37.880859375},{"lat":60.326947742998414,"lng":40.3857421875},{"lat":58.81374171570781,"lng":41.923828125},{"lat":57.93818301220531,"lng":45.9228515625},{"lat":55.89995614406812,"lng":46.8896484375},{"lat":54.470037612805754,"lng":52.2509765625},{"lat":52.98833725339541,"lng":52.03125}];
               var e =     [{"lat":46.98025235521884,"lng":132.36328125},{"lat":47.30903424774781,"lng":130.2099609375},{"lat":48.80686346108517,"lng":129.5068359375},{"lat":49.95121990866204,"lng":125.68359375},{"lat":49.75287993415023,"lng":122.6953125},{"lat":50.064191736659104,"lng":119.7509765625},{"lat":48.60385760823255,"lng":118.740234375},{"lat":48.13676667969269,"lng":121.46484375},{"lat":44.715513732021336,"lng":119.6630859375},{"lat":43.70759350405294,"lng":121.9921875},{"lat":45.82879925192134,"lng":122.6513671875},{"lat":42.19596877629178,"lng":126.03515625},{"lat":42.87596410238257,"lng":129.4189453125},{"lat":44.87144275016589,"lng":129.111328125},{"lat":45.85941212790754,"lng":130.8251953125},{"lat":45.85941212790754,"lng":132.890625}];
                var f =[{"lat":61.12201916813026,"lng":104.4580078125},{"lat":62.89521754488204,"lng":99.404296875},{"lat":63.6267446447533,"lng":98.876953125},{"lat":64.07219957867282,"lng":99.66796875},{"lat":63.273182174650465,"lng":100.2392578125},{"lat":65.07213008560696,"lng":102.9638671875},{"lat":62.36999628130772,"lng":106.787109375},{"lat":61.95961583829658,"lng":106.34765625},{"lat":60.56537850464181,"lng":107.841796875},{"lat":60.34869562531862,"lng":107.05078125},{"lat":61.35461358468941,"lng":104.853515625}];
                   var g =[{"lat":5.878332109674328,"lng":-56.865234375},{"lat":3.5134210456400448,"lng":-57.919921875},{"lat":4.302591077119676,"lng":-60.8203125},{"lat":-2.108898659243126,"lng":-68.115234375},{"lat":-5.178482088522876,"lng":-69.609375},{"lat":-6.4899833326706515,"lng":-73.4765625},{"lat":-9.70905706861821,"lng":-71.71875},{"lat":-9.188870084473393,"lng":-64.599609375},{"lat":-12.125264218331578,"lng":-62.666015625},{"lat":-14.6048471550539,"lng":-57.65625},{"lat":-20.96143961409684,"lng":-56.865234375},{"lat":-23.644524198573677,"lng":-54.404296875},{"lat":-27.059125784374057,"lng":-53.4375},{"lat":-29.764377375163114,"lng":-56.77734375},{"lat":-32.39851580247401,"lng":-52.470703125},{"lat":-29.68805274985679,"lng":-50.9765625},{"lat":-28.226970038918342,"lng":-49.5703125},{"lat":-24.20688962239801,"lng":-48.69140625},{"lat":-22.268764039073965,"lng":-43.2421875},{"lat":-20.13847031245114,"lng":-40.4296875},{"lat":-15.876809064146757,"lng":-39.990234375},{"lat":-13.667338259654947,"lng":-39.990234375},{"lat":-7.798078531355303,"lng":-35.068359375},{"lat":-5.528510525692789,"lng":-35.68359375},{"lat":-5.0909441750333855,"lng":-37.79296875},{"lat":-3.337953961416472,"lng":-40.517578125},{"lat":-3.2502085616531686,"lng":-44.208984375},{"lat":-4.039617826768424,"lng":-46.318359375},{"lat":-2.284550660236957,"lng":-53.0859375},{"lat":-3.601142320158722,"lng":-57.919921875},{"lat":-2.3723687086440504,"lng":-58.359375},{"lat":0.4394488164139768,"lng":-51.240234375},{"lat":4.039617826768437,"lng":-51.943359375},{"lat":5.441022303717974,"lng":-54.140625}];
                      var h =[{"lat":42.48830197960228,"lng":-123.134765625},{"lat":46.01222384063236,"lng":-122.958984375},{"lat":45.9511496866914,"lng":-122.34375},{"lat":44.84029065139799,"lng":-122.51953125},{"lat":44.96479793033101,"lng":-120.673828125},{"lat":46.55886030311717,"lng":-119.794921875},{"lat":46.55886030311717,"lng":-116.54296875},{"lat":45.460130637921004,"lng":-116.71875},{"lat":42.74701217318067,"lng":-117.685546875},{"lat":41.83682786072715,"lng":-112.763671875},{"lat":36.24427318493909,"lng":-115.576171875},{"lat":35.67514743608468,"lng":-119.619140625},{"lat":38.41055825094609,"lng":-122.51953125}];
                         var i =[{"lat":-33.28461996888768,"lng":119.3994140625},{"lat":-34.88593094075314,"lng":118.037109375},{"lat":-34.921971036163754,"lng":116.4111328125},{"lat":-33.87041555094182,"lng":115.7080078125},{"lat":-31.12819929911196,"lng":116.3232421875},{"lat":-27.839076094777802,"lng":114.697265625},{"lat":-25.085598897064767,"lng":114.8291015625},{"lat":-22.471954507739216,"lng":116.982421875},{"lat":-23.84564988765934,"lng":119.794921875},{"lat":-23.1605633090483,"lng":121.9482421875},{"lat":-20.34462694382967,"lng":121.728515625},{"lat":-19.518375478601556,"lng":125.33203125},{"lat":-21.125497636606262,"lng":128.2763671875},{"lat":-26.82407078047018,"lng":128.14453125},{"lat":-29.726222319395493,"lng":125.9033203125},{"lat":-31.98944183792288,"lng":125.9033203125}];
                          var j =[{"lat":49.210420445650286,"lng":-70.48828125},{"lat":44.84029065139799,"lng":-77.080078125},{"lat":47.27922900257082,"lng":-82.96875},{"lat":49.32512199104001,"lng":-85.078125},{"lat":51.12421275782688,"lng":-81.650390625},{"lat":50.736455137010665,"lng":-78.92578125},{"lat":52.10650519075632,"lng":-77.080078125},{"lat":54.826007999094955,"lng":-77.16796875},{"lat":55.229023057406344,"lng":-67.763671875},{"lat":51.6180165487737,"lng":-63.6328125}];
                             var k =[{"lat":-9.622414142924805,"lng":22.8515625},{"lat":-4.740675384778361,"lng":21.533203125},{"lat":-5.353521355337322,"lng":17.314453125},{"lat":3.8642546157214084,"lng":20.830078125},{"lat":3.8642546157214084,"lng":29.619140625},{"lat":-3.5134210456400323,"lng":29.00390625},{"lat":-8.841651120809145,"lng":28.65234375},{"lat":-11.695272733029402,"lng":25.751953125},{"lat":-10.401377554543538,"lng":24.609375},{"lat":-10.401377554543538,"lng":22.8515625}];

var aTriangle = new google.maps.Polygon({
       paths: a,
       strokeColor: '#FA0FA0F',
       strokeOpacity: 0.8,
       strokeWeight: 2,
       fillColor: '#FF0000',
       fillOpacity: 0.35
     });
     aTriangle.setMap(map);
var bTriangle = new google.maps.Polygon({
       paths: b,
       strokeColor: '#FA0FA0F',
       strokeOpacity: 0.8,
       strokeWeight: 2,
       fillColor: '#FF0000',
       fillOpacity: 0.35
     });
     bTriangle.setMap(map);
var cTriangle = new google.maps.Polygon({
       paths: c,
       strokeColor: '#FA0FA0F',
       strokeOpacity: 0.8,
       strokeWeight: 2,
       fillColor: '#FF0000',
       fillOpacity: 0.35
     });
     cTriangle.setMap(map);
var dTriangle = new google.maps.Polygon({
       paths: d,
       strokeColor: '#FA0FA0F',
       strokeOpacity: 0.8,
       strokeWeight: 2,
       fillColor: 'blue',
       fillOpacity: 0.35
     });
     dTriangle.setMap(map);
var eTriangle = new google.maps.Polygon({
       paths: e,
       strokeColor: '#FA0FA0F',
       strokeOpacity: 0.8,
       strokeWeight: 2,
       fillColor: 'green',
       fillOpacity: 0.35
     });
     eTriangle.setMap(map);
var fTriangle = new google.maps.Polygon({
       paths: f,
       strokeColor: '#FA0FA0F',
       strokeOpacity: 0.8,
       strokeWeight: 2,
       fillColor: 'yellow',
       fillOpacity: 0.35
     });
     fTriangle.setMap(map);
var gTriangle = new google.maps.Polygon({
       paths: g,
       strokeColor: '#FA0FA0F',
       strokeOpacity: 0.8,
       strokeWeight: 2,
       fillColor: 'orange',
       fillOpacity: 0.35
     });
     gTriangle.setMap(map);
var hTriangle = new google.maps.Polygon({
       paths: h,
       strokeColor: '#FA0FA0F',
       strokeOpacity: 0.8,
       strokeWeight: 2,
       fillColor: '#FF0000',
       fillOpacity: 0.35
     });
     hTriangle.setMap(map);
var iTriangle = new google.maps.Polygon({
       paths: i,
       strokeColor: '#FA0FA0F',
       strokeOpacity: 0.8,
       strokeWeight: 2,
       fillColor: '#FF0000',
       fillOpacity: 0.35
     });
     iTriangle.setMap(map);
var jTriangle = new google.maps.Polygon({
       paths: j,
       strokeColor: '#FA0FA0F',
       strokeOpacity: 0.8,
       strokeWeight: 2,
       fillColor: '#FF0000',
       fillOpacity: 0.35
     });
     jTriangle.setMap(map);
var kTriangle = new google.maps.Polygon({
       paths: k,
       strokeColor: '#FA0FA0F',
       strokeOpacity: 0.8,
       strokeWeight: 2,
       fillColor: '#FF0000',
       fillOpacity: 0.35
     });
     kTriangle.setMap(map);


    //  map2.mapTypes.set('styled_map', styledMapType);
    //  map2.setMapTypeId('styled_map');
  /*  google.maps.event.trigger(map2, 'resize');
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
/*        marker = new google.maps.Marker({
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
    });*/
    //map end
  });
}]);
