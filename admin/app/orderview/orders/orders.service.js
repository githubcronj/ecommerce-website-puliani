'use strict';

angular.module('pulianiBookStoreAdminApp')
  .factory('orders', function (common) {
   
   var factory = {};
   
	factory.getAllOrders = function(body){
		let AllOrders = common.callApi('POST','/api/orders/getAllOrders' ,'',{'Content-Type':'application/json'},body);
		return AllOrders;
	}

	factory.getAllOrdersExport = function(body){
		let AllOrders = common.callApi('POST','/api/orders/exportAllOrders' ,'',{'Content-Type':'application/json'},body);
		return AllOrders;
	}
   
	factory.getFullOrderDetail = function(id){
		let FullOrder = common.callApi('GET','/api/orders/adminViewFullOrder/'+id ,'','','');
		return FullOrder;
    }
    
    factory.getOrderTrackingDetail = function(id){
		let OrderTracking = common.callApi('GET','/api/shipments/getShipmentDetails/'+id ,'','','');
		return OrderTracking;
    }
    
    factory.updateOrderTrackingDetail = function(body){
		let OrderTracking = common.callApi('PUT','/api/shipments/updateShipment' ,'',{'Content-Type':'application/json'},body);
		return OrderTracking;
    }
	
   return factory;
  });
