'use strict';

angular.module('pulianiBookStoreAdminApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('index.users', {
        url: '/users?pageno&attribute&direction&searchString',
        templateUrl: '../admin/app/users/users.html',
        controller: 'UsersCtrl'
      });
  });
