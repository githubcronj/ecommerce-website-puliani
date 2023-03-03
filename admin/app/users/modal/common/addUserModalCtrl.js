'use strict';

angular.module('pulianiBookStoreAdminApp')
  .controller('addUserModalCtrl', function ($scope, $uibModalInstance, Auth, toaster) {

	$scope.close = function () {
		$uibModalInstance.dismiss();
	};

	$scope.onUserSubmit = function()
	{    $scope.user.role= 'admin';
		if($scope.user.password == $scope.user.cpassword)
		Auth.createUser($scope.user).then(function(data)
		    {

		    toaster.pop("success","User Created Success");
			$uibModalInstance.close();

			},function(error){
			toaster.pop("error","Adding User Failed","Email Already Exists");
				console.log(error);
			})
		else
			toaster.pop("error","Passwords do not match");
		//alert(JSON.stringify($scope.user));
	}


  });
