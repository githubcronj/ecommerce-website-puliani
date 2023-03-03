'use strict';

angular.module('pulianiBookStoreApp.auth', [
  'pulianiBookStoreApp.constants',
  'pulianiBookStoreApp.util',
  'ngCookies',
  'ui.router'
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
