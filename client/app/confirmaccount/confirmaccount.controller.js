

'use strict';
angular.module('pulianiBookStoreApp')
  .controller('ConfirmaccountCtrl', function ($scope,$state,confirmaccount) {


 $scope.message = 'Hello';
  confirmaccount.validateLink($state.params.token).then(function(success){
    
    $scope.isValidLink = true;
    confirmaccount.setUserEmailStatus($state.params.token).then(function(success){
      console.log("success->",success);
    },function(error){
      console.log("error->",error);
    });
  },function(error){
    
    $scope.isValidLink = false;
  });

});


