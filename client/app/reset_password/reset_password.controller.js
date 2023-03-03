

'use strict';

angular.module('pulianiBookStoreApp')
  .controller('ResetPasswordCtrl', function ($scope,resetpassword,$state,toaster) {
    
   $scope.message = 'Hello';
  $scope.isValidLink = undefined;
  $scope.password = {};
  resetpassword.isValidLink($state.params.token).then(function(success){
    $scope.isValidLink = true;
    },function(error){
      $scope.isValidLink = false;
    });
 
 function isPasswordAreMatching(){
  if($scope.password.password === $scope.password.confirmPassword){
    return true;
  }
  return false;
 }

 $scope.resetPassword = function(){
  if(isPasswordAreMatching()){
    $scope.isPasswordMatch = true;
    var body = {};
    body.token = $state.params.token;
    body.newPassword = $scope.password.password;
    resetpassword.resetPassword(body).then(function(success){
      toaster.pop('success','your password is updated successfully');
      $state.go('main');
    },function(error){
      console.log('error','something went wrog please try again later');
    })
  }
  else{
    $scope.isPasswordMatch = false;
  }
 }
  
  });
