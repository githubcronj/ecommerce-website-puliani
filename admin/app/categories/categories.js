'use strict';

angular.module('pulianiBookStoreAdminApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('index.categories', {
        url: '/categories?pageno&attribute&direction&searchString',
        templateUrl: '../admin/app/categories/categories.html',
        controller: 'CategoriesCtrl'
      });
  });
