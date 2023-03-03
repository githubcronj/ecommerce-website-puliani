'use strict';
angular.module('pulianiBookStoreAdminApp')
.controller('loginCtrl',function($scope, Auth, toaster,$state ){

	$scope.loginAdmin=function(){

		Auth.login($scope.login).then(function(data){
		
		if(Auth.hasRole('admin')){
			$state.go('index.orderview',{pageno:1, attribute:'o.created_at', direction:'DESC',searchString:'', filter: 'all' });
		}
		else{
			toaster.pop("error","Login fail");
			//alert('fail');
		}

		}).catch(function(error){
            $scope.messageInvalid=error.message;

		});

	}

	
})