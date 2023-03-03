'use strict';

angular.module('pulianiBookStoreAdminApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('index.userorders', {
        url: '/userorders?userid',
        templateUrl: '../admin/app/userorders/userorders.html',
        controller: 'UserOrdersCtrl'
      });
  });
