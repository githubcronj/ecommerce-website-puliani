'use strict';

angular.module('pulianiBookStoreAdminApp')
  .factory('userorders', function (common, $q) {
    
var factory = {};
	
		factory.getUser = function(body)
		{
			let User = common.callApi('GET','/api/users/getUser/'+body.id ,'',{'Content-Type':'application/json'});
			return User;
		}

		factory.exportPDF = function(body)
		{
			let pdf = common.callApi('POST','/api/orders/exportPDF/' ,'',{'Content-Type':'application/json'},body);
			return pdf;
		}

		return factory;

  });
