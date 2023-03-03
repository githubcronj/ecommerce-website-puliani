'use strict';

angular.module('pulianiBookStoreAdminApp')
  .controller('confirmDeleteImageCtrl', function ($scope, toaster,$uibModal,$uibModalInstance, message) {
    $scope.message = message;

    $scope.close = function(){
      $uibModalInstance.dismiss();
    }
    
    $scope.confirmDelete = function(){
      $uibModalInstance.dismiss('yes');
    }

  });
