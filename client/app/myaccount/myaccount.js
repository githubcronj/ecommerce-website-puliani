'use strict';

angular.module('pulianiBookStoreApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('myaccount', {
        url: '/myaccount',
        templateUrl: 'app/myaccount/myaccount.html',
        controller: 'MyaccountCtrl',
         authenticate: true
      });
  });
