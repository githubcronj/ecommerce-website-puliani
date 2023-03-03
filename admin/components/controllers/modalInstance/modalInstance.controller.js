'use strict';

angular.module('pulianiBookStoreAdminApp')
  .controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, Auth, toaster, MyCart) {
	
	  $scope.close = function () {
    $uibModalInstance.dismiss('cancel');
  };
	
	
	$scope.loginUser = function()
		{
			//,user,errorconsole.log(Auth.login(username,password));
		Auth.login($scope.login).then(function(data)
		    {
					MyCart.guestUserAddtoCart().then(function(data)
					{
					  toaster.pop("success","Login Success");
					  $uibModalInstance.close('success');
					});
		    },function(error){
			
			toaster.pop("error","Login Failed","Invalid Credentials");
			
			})
			
		}
	
	$scope.goToRegister = function()
	{
		$uibModalInstance.close('register');
	}
	
	
  });
