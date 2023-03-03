'use strict';

angular.module('pulianiBookStoreAdminApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('index', {
        url: '/index',
        templateUrl: '../admin/app/index/index.html',
        controller: 'IndexCtrl'
      });
  });