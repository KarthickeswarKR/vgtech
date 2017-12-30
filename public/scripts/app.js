'use strict';

// declare modules
var home=angular.module('home', ['ngRoute',
    'ngCookies'])

.config(['$routeProvider', function ($routeProvider) {

    $routeProvider
        .when('/home', {
            controller: 'homecontroller',
            templateUrl: 'static/modules/home/views/home.html',
            hideMenus: true
        });

}]);
