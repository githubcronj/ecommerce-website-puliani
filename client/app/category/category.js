'use strict';

angular.module('pulianiBookStoreApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('category', {
        url: '/category?id&name&type',
        templateUrl: 'app/category/category.html',
        controller: 'CategoryCtrl'
      });
  });
