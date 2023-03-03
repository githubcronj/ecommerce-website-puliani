'use strict';

angular.module('pulianiBookStoreAdminApp')
  .controller('ShellCtrl', function ($scope, shell ,$state, Auth, $uibModal, MyCart, $window) {
	  
		$scope.categories = shell.categories;
	    $scope.currentUser = {};
	    $scope.isLoggedIn = false;
        $scope.isEntered = false;

		shell.getNavCategories().then(function(data){
		   $scope.categories = data.data;
		});
         
	    $scope.onEnter = function()
		{
			$scope.isEntered = true;
		}
		
		$scope.onSearchSubmit = function(searchterm)
		{
			$state.go('product-category', { type:'search', value:searchterm, filter: '', name: '' });
			
		}
		
		  $scope.open = function (size) {	  
			  
  var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'loginModal.html',
      controller: 'ModalInstanceCtrl',
      size: size,
	  
    
    });
			  
modalInstance.result.then(function (data) {
	
		if(data == "success")
			isLoggedIn();
		else if(data == "register")
			$state.go("register");
	
    }, function () {
      console.log('Modal dismissed at: ' + new Date());
    });
			  
  };
		
		$scope.logoutUser = function()
		{
			Auth.logout();
			isLoggedIn();
			getCartData();
		}
		
	function isLoggedIn()
	{
		Auth.isLoggedIn(function(data){
		$scope.isLoggedIn = data;
		if(data)
		getCurrentUser();
		})
	}
	
	isLoggedIn();
		
		
	function getCurrentUser()
	{
	  Auth.getCurrentUser(function(data){
				$scope.currentUser = data;
		        getCartData();
			});
	}
	
 $scope.$on('AuthSuccess', function (event, args) {
  isLoggedIn();
 });
	
	
	function getCartData()
	{
	MyCart.getMyCart().then(function(data){
             $scope.myCartCount = data.data.products.length;
		     $scope.$broadcast('onUserStatusChange');
		 });
	}
	
	 getCartData();
	
 $scope.$on('checkCartShell', function (event, args) {
   getCartData();
 });
	
	

	
  });
 