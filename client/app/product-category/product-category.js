'use strict';

angular.module('pulianiBookStoreApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('product-category', {
        url: '/product-category?type&value&filter&name',
        templateUrl: 'app/product-category/product-category.html',
        controller: 'ProductCategoryCtrl'
      });
  });
