'use strict';

angular.module('pulianiBookStoreApp')
  .controller('MyaccountCtrl', function ($scope,$state, Auth) {
    
	$scope.sideNavData =[{name:"Personal Info",icon:"glyphicon glyphicon-user",sref:"myaccount.personalinfo",isActive:"active"},
						 {name:"Addresses",icon:"glyphicon glyphicon-list-alt",sref:"myaccount.addresses",isActive:"inactive"},
						 {name:"Change Password",icon:"glyphicon glyphicon-lock",sref:"myaccount.password",isActive:"inactive"}];
	

	
	 $scope.$on('onAccStateChange', function (event, args) {
  
	angular.forEach($scope.sideNavData, function(value, key) {
		
  		if(args.value == value.sref)
	    $scope.sideNavData[key].isActive = "active";
		else
		$scope.sideNavData[key].isActive = "inactive";	
		
});
 });
	
	if($state.current.name == "myaccount")
	{
		$state.go("myaccount.personalinfo")
	}
	
	$scope.$on('onUserStatusChange', function (event, args) {
        Auth.isLoggedIn(function(isLoggedIn){
            if(!isLoggedIn)
             $state.go('main');
        })
	});
	
  });
