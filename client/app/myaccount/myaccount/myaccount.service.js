'use strict';

angular.module('pulianiBookStoreApp')
  .factory('myaccount', function (common , Auth, $q) {

	var factory = {};
	
	factory.updateUserProfile = function(body)
	{   
            return $q(function(resolve, reject) {
            Auth.isLoggedIn(function(isLoggedIn){
            if(isLoggedIn)
            {
                let updateProfile = common.callApi('PUT','/api/users/updateProfile' ,'',{'Content-Type':'application/json'},body);
                updateProfile.then(function(data){
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
