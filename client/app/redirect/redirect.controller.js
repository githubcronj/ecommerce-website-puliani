'use strict';

angular.module('pulianiBookStoreApp')
  .controller('redirectCtrl', function ($scope,Auth,$stateParams,$state) {
   
Auth.isLoggedIn(function(isLoggedIn){
        if(isLoggedIn)
         $state.go($stateParams.goto);
         else
         {

             $(document).ready(function(){
              setTimeout(function(){
              $state.go('main');
              $scope.$emit('openLoginModal',$stateParams.goto);

             }, 0)
         
        

         	})
       
    }

    })


    });