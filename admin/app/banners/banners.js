'use strict';

angular.module('pulianiBookStoreAdminApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('index.banners', {
        url: '/banners?pageno&attribute&direction',
        templateUrl: '../admin/app/banners/banners.html',
        controller: 'bannersCtrl'
      });
  });
