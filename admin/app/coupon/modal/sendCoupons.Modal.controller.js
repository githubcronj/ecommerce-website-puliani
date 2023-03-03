'use strict';

angular.module('pulianiBookStoreAdminApp')
  .controller('sendCouponModalCtrl', function ($scope, toaster, $uibModalInstance, couponData, mycoupons) {
    
    $scope.couponData = couponData;
    

    $scope.close = function () {
        $uibModalInstance.dismiss();
    };
    
    $scope.onCouponSend = function(data)
    {
        data.code = $scope.couponData.code;
        mycoupons.sendCoupons(data).then(function(data){
           $uibModalInstance.dismiss();
           toaster.pop('success','promo code sent successfully')
        });
    }

  });
