'use strict';

angular.module('pulianiBookStoreApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('redirect', {
         url: '/redirect?goto',
        templateUrl: 'app/redirect/redirect.html',
        controller: 'redirectCtrl'
      });
  });
