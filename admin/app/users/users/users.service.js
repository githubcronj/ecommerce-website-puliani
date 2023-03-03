'use strict';

angular.module('pulianiBookStoreAdminApp')
  .factory('users', function (common, $q) {
 
	var factory = {};
	
        factory.ExportUserData =[];
		factory.getUsers = function(body)
		{
			let Users = common.callApi('POST','/api/users/getAllUsers' ,'',{'Content-Type':'application/json'},body);
			return Users;
		}
		
		factory.getUserOrders = function(body)
		{
			let UserOrders = common.callApi('POST','/api/orders/getOrderDetailsAdmin' ,'',{'Content-Type':'application/json'},body);
			return UserOrders;
		}
        
        factory.getExportData = function(isSomethingModified)
		{
            return $q(function(resolve, reject) {
                
                if(factory.ExportUserData.length>0 && !isSomethingModified)
                resolve(factory.ExportUserData);
                else
                {
                    let Users = common.callApi('GET','/api/users/exportUserData' ,'','','');
                    Users.then(function(data){
                        resolve(data);
                    }) 
                }
            })  

		}
		
	return factory;
	
  });
