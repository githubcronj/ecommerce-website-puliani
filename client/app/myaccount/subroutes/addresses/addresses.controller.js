'use strict';

angular.module('pulianiBookStoreApp')
  .controller('AddressesCtrl', function ($scope, checkout, $uibModal, toaster) {
	
   $scope.$emit('onAccStateChange', { value : "myaccount.addresses" });
	
   function getUserAddress()
	{
		checkout.getUserAddress().then(function(data)
		{
		$scope.userAddress = data.data.addresses;
		})
		
	}
	
	getUserAddress();
	
	
	$scope.openAddress = function (size,type,data,key) {	  
			  
  var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'addAddressModal.html',
      controller: 'AddAddressModalCtrl',
      size: size,
	  resolve: {
    type: function () {
      return type;
    },
    data: function() {
      return data;
    },
    key: function() {
      return key;
    },
  }
    
    });
			  
modalInstance.result.then(function (data) {
	  getUserAddress();
    }, function () {
      console.log('Modal dismissed at: ' + new Date());
    });
			  
  };
	
	
	$scope.onAddressDelete = function(key)
	{
		
		var confirmation = confirm("Do you want to delete it?");
		if(confirmation)
		{
						
			checkout.deleteUserAddress(key).then(function(data){
			toaster.pop("info","Address deleted");
			getUserAddress();
				
			});
		}
	}
	
	
	
  });
