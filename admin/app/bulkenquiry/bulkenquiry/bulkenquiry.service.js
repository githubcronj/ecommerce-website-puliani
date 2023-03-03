'use strict';

angular.module('pulianiBookStoreAdminApp')
  .factory('bulkenquiry', function (common) {
 
	var factory = {};
	
		factory.getBulkEnquiries = function(body)
		{
			let BulkOrders = common.callApi('POST','/api/bulk_orders/getAllBulkOrders' ,'',{'Content-Type':'application/json'},body);
			return BulkOrders;
		}
	
		
	return factory;
	
  });