'use strict';

angular.module('pulianiBookStoreApp')
  .controller('PasswordCtrl', function ($scope, toaster, Auth) {
    
	 $scope.$emit('onAccStateChange', { value : "myaccount.password" });
	
	$scope.onChangePassword =function(oldpassword, newpassword, cnewpassword)
	{
		if(newpassword != cnewpassword)
		 toaster.pop("error","Password and Confirm Password do not match");
		else
		{
			Auth.changePassword(oldpassword,newpassword).then(function(data)
			{
			toaster.pop("success","Password Changed Successfully");
			},function(error){
			toaster.pop("error",error.data);

			})
		}
		
	}
	 
  });
