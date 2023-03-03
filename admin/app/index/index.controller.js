'use strict';

angular.module('pulianiBookStoreAdminApp')
  .controller('IndexCtrl', function ($scope, $state, Auth) {
  	

  	$scope.clickAncor = function(url){
  		$scope.currentUrl = url;
  	}
	
	$scope.logOut = function()
	{
		Auth.logout();
		$state.go('login');
	}
  });
