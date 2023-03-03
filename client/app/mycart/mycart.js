'use strict';

angular.module('pulianiBookStoreApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('mycart', {
        url: '/mycart',
        templateUrl: 'app/mycart/mycart.html',
        controller: 'MycartCtrl'
      });
  });
