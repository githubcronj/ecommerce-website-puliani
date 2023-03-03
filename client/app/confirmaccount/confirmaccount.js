
'use strict';

angular.module('pulianiBookStoreApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('confirmaccount', {
        url: '/verifyaccount/:token',
        templateUrl: 'app/confirmaccount/confirmaccount.html',
        controller:'ConfirmaccountCtrl'
      });
  });
