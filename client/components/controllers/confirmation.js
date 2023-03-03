'use strict';

angular.module('pulianiBookStoreApp')
  .controller('ConfirmationCtrl', function ($scope,$uibModalInstance, message) {
  		$scope.confirmationMessage = message;
  		
  		$scope.close = function(){
  			$uibModalInstance.close();
  		}

  		$scope.deleteNews = function(){
  			$uibModalInstance.dismiss("delete");
  		}

  });
