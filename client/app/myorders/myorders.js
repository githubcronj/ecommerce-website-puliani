'use strict';

angular.module('pulianiBookStoreApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('myorders', {
        url: '/myorders',
        templateUrl: 'app/myorders/myorders.html',
        controller: 'MyordersCtrl',
        authenticate: true
      });
  });
