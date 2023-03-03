'use strict';

angular.module('pulianiBookStoreAdminApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('index.dashboard', {
        url: '/dashboard',
        templateUrl: '../admin/app/dashboard/dashboard.html',
        controller: 'DashboardCtrl'
      });
  });