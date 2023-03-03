'use strict';

angular.module('pulianiBookStoreApp')
  .factory('resetpassword', function(common) {
    	var factory = {};

    	factory.sendVerificationLink = function(body){
    		let send = common.callApi('POST','/api/reset_password_sessions/createSession' ,'',{'Content-Type':'application/json'},body);
      		return send;
    	}

    	factory.isValidLink = function(token){
    		let isValid =  common.callApi('GET','/api/reset_password_sessions/validateLink/'+token ,'','','');
      		return isValid;
    	}
    	
    	factory.resetPassword = function(body){
    		let resetpassword =  common.callApi('PUT','/api/reset_password_sessions/changePassword' ,'',{'Content-Type':'application/json'},body);
      		return resetpassword;
    	}

    	return factory;

  });
