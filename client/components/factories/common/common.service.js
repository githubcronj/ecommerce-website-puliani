'use strict';

angular.module('pulianiBookStoreApp')
  .factory('common', function ($q, $http) {
	  
  var factory = {}; 
  
   factory.callApi = function(method, url, params, headers, body)
	  {
			let deffered = $q.defer();
			// Simple GET request example:
			$http({
				method: method,
				url: url,
				params: params,
				headers: headers,
				data: body
			}).then(function successCallback(response) {
				// this callback will be called asynchronously
				// when the response is available
				deffered.resolve(response);
			}, function errorCallback(error) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
				deffered.reject(error);
			});
			return deffered.promise;
       }
	   
	 return factory;
     
  });
