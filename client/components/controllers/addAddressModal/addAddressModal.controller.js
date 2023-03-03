'use strict';

angular.module('pulianiBookStoreApp')
  .controller('AddAddressModalCtrl', function ($scope, checkout, toaster, $uibModalInstance, type, data, key) {
    
   
	$scope.data = {name:"",address:"",landmark:"",city:"",state:"",phone:"",pincode:""};
    
    if(type == "edit")
     angular.copy(data, $scope.data);
        
	$scope.type = type;

	$scope.onAddressSubmit= function()
	{
		if(type=='add')
			checkout.addUserAddress($scope.data).then(function(data)
		   {
			  		  toaster.pop("info","Address added to Profile");
					  $uibModalInstance.close('added');
		   },function(error){
                //alert(JSON.stringify(error));
            })
		else
			checkout.editUserAddress($scope.data,key).then(function(data)
		   {
			          toaster.pop("info","Address updated");
					  $uibModalInstance.close('edited');
		   },function(error){
                //alert(JSON.stringify(error));
            })
	}
	
	
	  $scope.close = function () {
    $uibModalInstance.dismiss('cancel');
  };
	
  });
