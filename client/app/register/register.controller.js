'use strict';

angular.module('pulianiBookStoreApp')
  .controller('RegisterCtrl', function ($scope, Auth, toaster, MyCart, $state, confirmaccount) {
	
	
	$scope.userRegister = function()
	{
		$scope.user.role = 'customer';
		$scope.user.phone_number = [$scope.user.phone_number];
			Auth.createUser($scope.user).then(function(data)
		    {
		    	toaster.pop("success","You have successfully registered to Puliani"); 
		    	var body = {};
		    	body.email = $scope.user.email;
			    confirmaccount.createSession(body)
			    	.then(function(success){
			    		toaster.pop("success","We have sent you an email, please verify your account");
			    });
		    
			MyCart.guestUserAddtoCart().then(function(data){	
				$scope.$emit('AuthSuccess');
				$state.go('main');
			})
			},function(error){
			toaster.pop("error","Registration Failed","Email Already Exists");
				console.log(error);
			})
	
		
		//alert(JSON.stringify($scope.user));
	}
    
           $scope.validatePassword=function(id)  {
           	
           	if(id=="user_password")
           	document.getElementById("user_password2").setCustomValidity('');	 
            else
            document.getElementById("user_password").setCustomValidity('');	
        
             if($scope.user.password.length < 3)
		    document.getElementById("user_password").setCustomValidity("Password must be minimun 3 characters");
		    else if($scope.user.password!=$scope.user.cpassword)
		    document.getElementById(id).setCustomValidity("Passwords Don't Match");
             else
	         document.getElementById(id).setCustomValidity('');	 
              //empty string means no validation error
        }

   $scope.$on('onUserStatusChange', function (event, args) {
    Auth.isLoggedIn(function(isLoggedIn){
        if(isLoggedIn)
         $state.go('main');
    })
    });
	
  
  });
