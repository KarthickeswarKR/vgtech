'use strict';

/**
 * @author PalMurugan C
 *
 * @Description System Related Services are handling here
 */

vgApp.service('SystemService',['localStorageService',function(localStorageService){

	var _default = {
		 serviceName : "/virtualgodown",
		 authServiceName : "/virtualgodown"
	}


	this.getCurrentInstance = function() {

		return _default;
	}

	/*
	 * Here we are getting current AccessToken
	 */
	this.getCurrentAccessToken = function(){

		var accessToken = localStorageService.get("accessToken");

		return accessToken;
	}

	/*
	 * Here we are getting currentUserId
	 */
	this.getCurrentUserId = function() {

		var userId = localStorageService.get("userId");

		return userId;
	}
}]);
