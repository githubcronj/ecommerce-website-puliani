'use strict';

angular.module('pulianiBookStoreAdminApp')
  .controller('fullOrderViewModalCtrl', function ($scope, toaster, $uibModalInstance, orderId, orders , Global) {

	$scope.close = function(){
      $uibModalInstance.dismiss();
    }
	
	$scope.currency = Global.CURRENCY;
	
	function getFullOrderDetail()
	{
		orders.getFullOrderDetail(orderId).then(function (result) {
            //alert(JSON.stringify(result));
			$scope.Order = result.data;
        });
	}
	
	getFullOrderDetail();
	
})