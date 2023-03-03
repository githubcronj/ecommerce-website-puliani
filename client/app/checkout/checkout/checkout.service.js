'use strict';

angular.module('pulianiBookStoreApp')
  .factory('checkout', function (common, Auth, $q) {
   
	var factory = {};
	
	factory.getUserAddress = function()
	{
         return $q(function(resolve, reject) {
            
            Auth.isLoggedIn(function(isLoggedIn){
            if(isLoggedIn)
            {
                var getAddress = common.callApi('GET','/api/users/getAddresses' ,'',{'Content-Type':'application/json'},'');
                 getAddress.then(function(data)
                    {
                        resolve(data);
                    });
            }
            else
            {
                reject({error:"not logged in"})
            }
            
            
            })

        })  
	}
	
	factory.addUserAddress = function(body)
	{
         return $q(function(resolve, reject) {
            
            Auth.isLoggedIn(function(isLoggedIn){
            if(isLoggedIn)
            {
                var addAddress = common.callApi('PUT','/api/users/addAddress/' ,'',{'Content-Type':'application/json'},{address:body});
                 addAddress.then(function(data)
                    {
                        resolve(data);
                    });
            }
            else
            {
                reject({error:"not logged in"})
            }
            
            
            })

        })  
         
	}
	
	factory.editUserAddress = function(body,index)
	{
        
        return $q(function(resolve, reject) {
            
            Auth.isLoggedIn(function(isLoggedIn){
            if(isLoggedIn)
            {
                var editAddress = common.callApi('PUT','/api/users/updateAddress/' ,'',{'Content-Type':'application/json'},{index:index,address:body});
                 editAddress.then(function(data)
                    {
                        resolve(data);
                    });
            }
            else
            {
                reject({error:"not logged in"})
            }
            
            
            })

        })  
	}
	
	factory.deleteUserAddress = function(index)
	{
        return $q(function(resolve, reject) {

            Auth.isLoggedIn(function(isLoggedIn){
            if(isLoggedIn)
            {
                var deleteAddress = common.callApi('PUT','/api/users/deleteAddress/' ,'',{'Content-Type':'application/json'},{index:index});
                 deleteAddress.then(function(data)
                    {
                        resolve(data);
                    });
            }
            else
            {
                reject({error:"not logged in"})
            }


            })

        })  
                
	}
		
	factory.placeUserOrder = function(body)
	{
        return $q(function(resolve, reject) {

            Auth.isLoggedIn(function(isLoggedIn){
            if(isLoggedIn)
            {
                var placeorder = common.callApi('POST','/api/orders/createOrder' ,'',{'Content-Type':'application/json'},body);
                placeorder.then(function(data)
                    {
                        resolve(data);
                    });
            }
            else
            {
                reject({error:"not logged in"})
            }


            })

        })  
        
	}
    
    factory.getPaymentDetails = function(index)
    {
         return $q(function(resolve, reject) {

            Auth.isLoggedIn(function(isLoggedIn){
            if(isLoggedIn)
            {
                var paymentDetails = common.callApi('GET','/api/orders/getPayUMoneyShaKey/'+index ,'','','');
                paymentDetails.then(function(data)
                    {
                        resolve(data);
                    });
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
