'use strict';

angular.module('pulianiBookStoreAdminApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('index.orders', {
        url: '/orders',
        templateUrl: '../admin/app/orders/orders.html',
        controller: 'OrdersCtrl'
      });
  });