'use strict';

angular.module('pulianiBookStoreAdminApp')
  .config(function ($stateProvider) {

  		$stateProvider
        .state('login', {
        	
            url: '/',
            templateUrl: 'app/login/login.html',
            controller:'loginCtrl'
        });
  });
