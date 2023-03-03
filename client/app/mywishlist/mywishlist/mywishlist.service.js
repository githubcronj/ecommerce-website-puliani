'use strict';

angular.module('pulianiBookStoreApp')
  .factory('mywishlist', function (common, Auth, $q) {
	var factory = {};
	
	factory.AddToUserWishList = function(body)
    {   
         return $q(function(resolve, reject) {
            
            Auth.isLoggedIn(function(isLoggedIn){
            if(isLoggedIn)
            {
                let AddToWishList = common.callApi('POST','/api/wishlists/addToWishlist' ,'',{'Content-Type':'application/json'},body);
                 AddToWishList.then(function(data)
                    {
                        resolve(data);
                    },function(error)
                    {
                        reject({errorTitle:error.data}) 
                    });
                
            }
            else
            {
                reject({errorTitle:"Login required",errorDesc:"Cannot add to wishlist"});
            }
            
            
            })

        })  
	}
	
	factory.getMyWishList = function(body)
	{
        return $q(function(resolve, reject) {
            
            Auth.isLoggedIn(function(isLoggedIn){
            if(isLoggedIn)
            {
                let myWishList = common.callApi('POST','/api/wishlists/getWishlistDetails' ,'','',body);;
                 myWishList.then(function(data)
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
	
	factory.removeItemWishList = function(body)
	{
         return $q(function(resolve, reject) {
            
            Auth.isLoggedIn(function(isLoggedIn){
            if(isLoggedIn)
            {
                let removeWishListItem =  common.callApi('DELETE','/api/wishlists/removeProduct' ,'',{'Content-Type':'application/json'},body);
                 removeWishListItem.then(function(data)
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
