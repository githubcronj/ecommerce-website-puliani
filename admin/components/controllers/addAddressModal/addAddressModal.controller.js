'use strict';

angular.module('pulianiBookStoreAdminApp')
  .controller('AddAddressModalCtrl', function ($scope, toaster, $uibModalInstance, type, data, key) {
    
    
	$scope.data = (type=='add')?{name:"",address:"",landmark:"",city:"",state:"",phone:"",pincode:""}:data;
	
	
	$scope.onAddressSubmit= function()
	{
		if(type=='add')
			checkout.addUserAddress($scope.data).then(function(data)
		   {
			  		  toaster.pop("info","Address added to Profile");
					  $uibModalInstance.close('added');
		   })
		else
			checkout.editUserAddress($scope.data,key).then(function(data)
		   {
			          toaster.pop("info","Address updated");
					  $uibModalInstance.close('edited');
		   })
	}
	
	
	  $scope.close = function () {
    $uibModalInstance.dismiss('cancel');
  };
	
  });
