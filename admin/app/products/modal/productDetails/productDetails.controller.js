'use strict';

angular.module('pulianiBookStoreAdminApp')
  .controller('ProductDetailModalCtrl', function ($scope, toaster,$uibModal,$uibModalInstance, product, Global, myproducts) {
    $scope.product = product;
    $scope.images = [];

	$scope.currencyType = Global.CURRENCY;

    for(let image in product.images){
        $scope.images[product.images[image].sort_order] = product.images[image];
    }

    $scope.enlargeImage = function(index){
      openModel(index);
    };

    $scope.close = function(){
      $uibModalInstance.dismiss();
    }

  	$scope.confirmDelete = function(){
  		 myproducts.deleteProduct({product_id:product.id}).then(function(data){
              $uibModalInstance.close();
          });

  	}

    var openModel = function(index){
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'imageDisplay.html',
        controller: 'imageDisplayCtrl',
        size: 'lg',
        resolve:{
          images:function(){
            return $scope.product.images;
          },
          index:function(){
            return index;
          }
        }

      });
      modalInstance.result.then(function (data) {

      }, function (data) {

      });
    }




  });
