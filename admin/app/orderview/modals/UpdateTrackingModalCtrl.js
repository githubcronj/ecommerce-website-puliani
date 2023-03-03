'use strict';

angular.module('pulianiBookStoreAdminApp')
  .controller('UpdateTrackingModalCtrl', function ($scope, toaster, $uibModalInstance, Order, orders, Filter  ) {

	$scope.close = function(){
      $uibModalInstance.dismiss();
    }
    
	$scope.jsonBody = {
    "order_id": Order.order_id,
    "order_status": Order.order_status,
    "shipment_id":"",
    "tracking_number": "",
    "progress": null,
    "dispatch_date": null,
    "actual_delivery_date": null
};
	
	$scope.filter = Filter.slice(1,5);

	
	
	function getOrderTrackingDetail()
	{
		orders.getOrderTrackingDetail(Order.order_id).then(function (result) {
            //alert(JSON.stringify(result));
			$scope.jsonBody.shipment_id = result.data.id;
			$scope.jsonBody.tracking_number = result.data.tracking_number;
        });
	}
	
	getOrderTrackingDetail();
    
    
	
	function setOption(option)
	{
		angular.forEach($scope.filter, function(value, key) {
		if(value.value ==  option)
		$scope.selectedFilter =  $scope.filter[key];
  
		});
	}
	
	$scope.isFilterChange = function(option)
	{
       setOption(option)
	}
	
	setOption(Order.order_status);
	
    $scope.updateTracking = function()
    {
        if(!$scope.jsonBody.tracking_number)
        {
            toaster.pop('error',"required tracking number");
            return false;
        }
        
		$scope.jsonBody.order_status = $scope.selectedFilter.value;
		 
        orders.updateOrderTrackingDetail($scope.jsonBody).then(function (result) {
            //alert(JSON.stringify(result));
			$uibModalInstance.close();
        });
        //alert($scope.data.tracking_number);
    }
	
})