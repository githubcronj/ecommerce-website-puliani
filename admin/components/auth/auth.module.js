'use strict';

angular.module('pulianiBookStoreAdminApp.auth', [
  'pulianiBookStoreAdminApp.constants',
  'pulianiBookStoreAdminApp.util',
  'ngCookies',
  'ui.router'
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
