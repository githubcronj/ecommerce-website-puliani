'use strict';

angular.module('pulianiBookStoreApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('mywishlist', {
        url: '/mywishlist',
        templateUrl: 'app/mywishlist/mywishlist.html',
        controller: 'MywishlistCtrl',
         authenticate: true
      });
  });
