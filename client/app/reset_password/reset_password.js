

'use strict';

angular.module('pulianiBookStoreApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('reset_password', {
        url: '/resetpassword/:token',
        templateUrl: 'app/reset_password/reset_password.html',
        controller: 'ResetPasswordCtrl'
      });
  });
