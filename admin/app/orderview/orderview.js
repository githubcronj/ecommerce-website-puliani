'use strict';

angular.module('pulianiBookStoreAdminApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('index.orderview', {
        url: '/orderview?pageno&attribute&direction&searchString&filter',
        templateUrl: '../admin/app/orderview/orderview.html',
        controller: 'OrderviewCtrl'
      });
  });