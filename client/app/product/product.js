'use strict';

angular.module('pulianiBookStoreApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('product', {
        url: '/product?id&name',
        templateUrl: 'app/product/product.html',
        controller: 'ProductCtrl'
      });
  });
