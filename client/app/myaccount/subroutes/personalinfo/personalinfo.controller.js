'use strict';

angular.module('pulianiBookStoreApp')
  .controller('PersonalinfoCtrl', function ($scope, Auth, myaccount, toaster) {
   
	$scope.$emit('onAccStateChange', { value : "myaccount.personalinfo" });
	
	 $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
     $scope.format = $scope.formats[0];
	
	$scope.popup = {opened: false};
	
	$scope.genderData = [{name:"Male",value:"male"},{name:"Female",value:"female"}]
	
	
	function getUserDetail()
	{	
	  Auth.getCurrentUser(function(data){
		  $scope.currentUserSrc = data;
			$scope.currentUser = {
									"first_name":data.first_name,
									"last_name":data.last_name,
									"dob":new Date(data.dob),
									"gender":data.gender,
									"phone_number":parseInt(data.phone_number['0'])
								 }
			

		});
	}
	
	getUserDetail();
	
	
	$scope.onInfoSubmit =function()
	{
		myaccount.updateUserProfile($scope.currentUser).then(function(data){
			
			$scope.currentUserSrc.first_name =$scope.currentUser.first_name;  
			$scope.currentUserSrc.last_name =$scope.currentUser.last_name;  
			$scope.currentUserSrc.phone_number['0'] =$scope.currentUser.phone_number;  
			$scope.currentUserSrc.gender =$scope.currentUser.gender;  
			Auth.updateCurrentUser($scope.currentUserSrc);
			$scope.$emit("AuthSuccess");
			toaster.pop("info","Profile Updated Successfully");
		})
	}
	
	
	$scope.open = function() {
	$scope.popup.opened = true;
	};
	
  });
