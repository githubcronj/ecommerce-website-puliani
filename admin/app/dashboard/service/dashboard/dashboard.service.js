'use strict';

angular.module('pulianiBookStoreAdminApp')
  .service('dashboard', function (common) {
  	var factory = {};
  	
  	factory.getTotalRevenue = function(){
  		return common.callApi('GET','/api/orders/getTotalOrdersRevenue' ,'',{'Content-Type':'application/json'},'')
  		.then(function(response){
  			return response.data;	
  		});
    	
  	}

  	factory.getTotalOrders = function(){
  		return common.callApi('GET','/api/orders/getTotalOrdersCount' ,'',{'Content-Type':'application/json'},'')
    	.then(function(response){
  			return response.data;	
  		});
  	}
  	return factory;
  });
