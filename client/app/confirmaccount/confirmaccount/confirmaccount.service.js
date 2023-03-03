'use strict';

angular.module('pulianiBookStoreApp')
  .factory('confirmaccount', function (common) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var factory = {};
    factory.validateLink = function(token) {
    	return common.callApi('GET','/api/verify_user_email_sessions/validateLink/'+token ,'','','')
    		.then(function(data){
       			return data.data;
    	});
    }

    factory.setUserEmailStatus = function(token) {
    	return common.callApi('GET','/api/verify_user_email_sessions/setUserEmailAsVerified/'+token ,'','','')
    		.then(function(data){
       			return data.data;
    	});
    }

    factory.createSession = function(body) {
    	  return common.callApi('POST','/api/verify_user_email_sessions/createSession' ,'',{'Content-Type':'application/json'},body)
    		.then(function(data){
       		return data.data;
    	 })
    }

 	return factory;   
  });
