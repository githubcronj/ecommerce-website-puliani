'use strict';

angular.module('pulianiBookStoreAdminApp')
  .controller('EditCouponModalCtrl', function ($scope, toaster, $uibModalInstance, couponData, type, mycoupons,$filter) {

	$scope.data = couponData;
    //alert(type);
    $scope.type=type;

	for(var key in $scope.data){
		if(key === 'start_date' || key === 'expiry_date'){
			$scope.data[key] = new Date(couponData[key]);
		}
	}

	$scope.isSingleUsedCoupon = function(value){
	   couponData.is_single_use = value;
	}
    

	$scope.onSaveCoupon = function()
	{ 
		if($scope.validateDate())
		{

	   if(type === 'edit'){
       mycoupons.updateCoupon($scope.data).then(function(data){
		 toaster.pop('success','Coupon updated successfully');
         $uibModalInstance.dismiss(data.data);
       },function(error){
		   toaster.pop('error',error.data.errors[0].message);
	   })
     }
     if(type === 'add'){
         //alert(JSON.stringify($scope.data));
       mycoupons.createCoupon($scope.data).then(function(data){
		 toaster.pop('success','Coupon added successfully');
         $uibModalInstance.dismiss(data.data);
       },function(error){
		   toaster.pop('error',error.data.errors[0].message);
	   })
     }
 }

	}

  $scope.deleteCoupon = function(response){
	  if(response){
    mycoupons.deleteCoupon({coupon_id:couponData.id}).then(function(data){
			  toaster.pop('success',"Coupon deleted successfully");
			  $uibModalInstance.dismiss(data);
			  
		  });
	  }
	  else{
		  $uibModalInstance.dismiss("error");
			  
	  }
    
  }

  $scope.validateDate=function()  {
        
        if($filter('date')($scope.data.start_date, 'yyyy/MM/dd') >$filter('date')($scope.data.expiry_date, 'yyyy/MM/dd') )
		{
			$scope.message="Start date is greater than the expiry date"
            return false;
        }
        else
        {
           $scope.message=null;
           return true;
        }
}
	$scope.close = function () {
    $uibModalInstance.dismiss();
  };

  });
