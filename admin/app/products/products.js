'use strict';

angular.module('pulianiBookStoreAdminApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('index.products', {
        url: '/products?pageno&attribute&direction&searchString',
        templateUrl: '../admin/app/products/products.html',
        controller: 'ProductsCtrl'
      });
  });
