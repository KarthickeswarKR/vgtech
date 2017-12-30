vgApp.controller('messagecontroller', ['$scope', 'dashboardService', '$timeout', 'Notification', '$http', '$rootScope', '$state', function($scope, dashboardService, $timeout, Notification, $http, $rootScope, $state) {
$scope.showmessages=function(){
  $('#qnimate').addClass('popup-box-on');
  $("#messagebox").animate({ scrollTop: screen.height+screen.height }, 1000);
  dashboardService.updatemessage().then(function(data){

  })
}
$rootScope.helpmessage=function(){
  $scope.tolist=[];
  $scope.tolist.push({"userId":'065932a0-e748-11e7-9cf7-e1637e8c1ab9',"organisationId":'065932a1-e748-11e7-9cf7-e1637e8c1ab9'});
$("#messageautocompletesearch").val('help@VIRTUALGODOWN')
  $('#qnimate').addClass('popup-box-on');
  $("#messagebox").animate({ scrollTop: screen.height+screen.height }, 1000);
  dashboardService.updatemessage().then(function(data){

  })
}
$scope.down = function() {
               $timeout(function() {
                 $('#messagebox').animate({
                     scrollTop: $("body").height()
                 });
                 return false;
                 $scope.down();
             }, 10000);
             };
$scope.down()
$scope.close=function(){
  $('#qnimate').removeClass('popup-box-on');
}
$rootScope.highlightcollabrator=null;

$scope.parsedate=function(dateVal) {
  var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

    var date1 = dateVal.split('T')[0];
    var date = new Date(date1);
    var getDay = date.getDate();
    var getMonth = date.getMonth();
    var getYear = date.getFullYear();
    return  getDay +'-'+ monthNames[getMonth] + '-' +getYear
}
$scope.tolist=[];
  $scope.userautocomplete = function() {
    $("#messageautocompletesearch").autocomplete({
      position: {
       my: "left bottom",
       at: "left top"
   },
   classes: {
      "ui-autocomplete": "messageui",
  },
      source: function(request, response) {
        $http({
          url: domainURL + 'api/secured/users/messagetoautocomplete',
          method: "GET",
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          },
          params: {
            term: request.term
          }
        }).then(function(data) {
          console.log(data.data.data);
          response($.map(data.data.data, function(item) {

            return {
              label: item.label,
              value: item.label,
              userid: item.userId,
              orgid:item.organisationId
            }
          }));

        });
      },
      minLength: 1,
      open: function() {},
      close: function() {

      },
      focus: function(event, ui) {

      },
      select: function(event, ui) {
        $scope.tolist.push({"userId":ui.item.userid,"organisationId":ui.item.orgid});
      }
    });
  };
$scope.init=function(){
  $scope.textmessage=null;
  $scope.tolist=null;
  $scope.tosearch=null;
  $scope.Id=null;
  $scope.receiptentorganisation=null;
  dashboardService.getmessages().then(function(result){
    $rootScope.messages=result.data.data;
    $("#messagebox").animate({ scrollTop: $("#body").height() }, 1000);
 },function(err){
    console.log(err);
  })
}

$scope.addmessage = function() {
  if($scope.tolist==null ||$scope.tolist.length==0 || $scope.textmessage==null){
    var message;
    if($scope.tolist==null ||$scope.tolist.length==0 || $scope.tolist==undefined){
      message="To address required. "
    }
    if($scope.textmessage==null || $scope.textmessage==undefined){
      message="Enter the message"
    }
    Notification.error({message:message, positionY: 'top', positionX: 'right'});
  }else{
      dashboardService.addmessage($scope.textmessage,$scope.tolist).then(function(response) {
  $scope.down();
        $scope.init();
        $("#messagebox").animate({ scrollTop: $("#body").height() }, 1000);
      }, function(err) {
        Notification.error("error sending message")
      })
    }
}
}]);
