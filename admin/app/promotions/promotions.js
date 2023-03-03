'use strict';

angular.module('pulianiBookStoreAdminApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('index.promotions', {
        url: '/promotions',
        templateUrl: '../admin/app/promotions/promotions.html',
        controller: 'PromotionsCtrl'
      });
  });