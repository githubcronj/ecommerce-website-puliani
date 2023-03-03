'use strict';

angular.module('pulianiBookStoreAdminApp')
  	 .factory('bulkupload', function (common) {
    	var factory = {};

  		factory.getCategoryIDs = function(body){
    		return common.callApi('POST','/api/categories/getCategoryIdByName' ,'',{'Content-Type':'application/json'},body)
    
      		.then(function(data){
        
        			return data.data;
      		});
  		}
  		return factory;
  });
