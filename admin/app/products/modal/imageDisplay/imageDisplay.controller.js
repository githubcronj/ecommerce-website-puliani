'use strict';

angular.module('pulianiBookStoreAdminApp')
  .controller('imageDisplayCtrl', function ($scope, toaster,$uibModalInstance,images,index) {
    $scope.images = images;
    $scope.index = index

    $scope.close = function(){
      $uibModalInstance.dismiss();
    }

    $scope.changeImage = function(index){
      if(index<0){
        $scope.index = $scope.images.length-1;
      }
      else{
        $scope.index = index % $scope.images.length;
      }
    }
  });
