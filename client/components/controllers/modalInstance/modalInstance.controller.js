'use strict';

angular.module('pulianiBookStoreApp')
  .controller('ModalInstanceCtrl', function ($scope,$state,$uibModalInstance,resetpassword, Auth, toaster, MyCart,currentTab,gotoPage) {
	
	  //$scope.currentTab = 'login';
	  $scope.currentTab=currentTab;
	  $scope.reset = {};
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
                      if(gotoPage)
                      $state.go(gotoPage);	
					  $uibModalInstance.close('success');
					});
		    },function(error){
			
			toaster.pop("error","Login Failed","Invalid Credentials");
			
			})
			
		}
	
	$scope.goToRegister = function(){
		
		$uibModalInstance.close('register');
	}
	
	$scope.navigate = function(tab){
			$scope.currentTab = tab;
	}

	$scope.sendVerificationLink = function(){
		var body = {};
		body.email =$scope.reset.email;
		$scope.inprogress = true;
		$scope.sentEmail = false;
		$scope.invalidEmail = false;
		$scope.temporaryEmail = $scope.reset.email;
		resetpassword.sendVerificationLink(body).then(function(success){
			$scope.inprogress = false;
			$scope.sentEmail = true;
			$scope.invalidEmail = false;
			$scope.reset.email = "";
		},function(error){
			$scope.inprogress = false;
			$scope.sentEmail = false;
			$scope.invalidEmail = true;
			console.log("handle error",error);
		})
	}
	
  });
