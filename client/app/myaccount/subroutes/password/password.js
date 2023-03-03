'use strict';

angular.module('pulianiBookStoreApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('myaccount.password', {
        url: '/password',
        templateUrl: 'app/myaccount/subroutes/password/password.html',
        controller: 'PasswordCtrl',
         authenticate: true
      });
  });
