'use strict';

angular.module('pulianiBookStoreApp')
  .factory('myorders', function (common, Auth, $q) {
    var factory = {};
	
	factory.getMyOrders = function(body)
	{
        return $q(function(resolve, reject) {

            Auth.isLoggedIn(function(isLoggedIn){
                if(isLoggedIn)
                {
                    let MyOrders = common.callApi('POST','/api/orders/getOrderDetails' ,'',{'Content-Type':'application/json'},body);
                    MyOrders.then(function(data){
                        resolve(data);
                    })
                }
                else
                {
                    reject({error:"not logged in"})
                }
            })

        })  
	}
	
	return factory;
  });
