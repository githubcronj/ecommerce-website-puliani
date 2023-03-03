'use strict';

angular.module('pulianiBookStoreApp', [
  'pulianiBookStoreApp.constants',
  'pulianiBookStoreApp.auth',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap',
  'ui-rangeSlider',
  'infinite-scroll',
  'ngAnimate',
  'toaster',
  'slickCarousel',
  'LocalStorageModule',
  'FBAngular',
  'ngMap'
])
  .config(function($urlRouterProvider, $locationProvider, localStorageServiceProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
	
	localStorageServiceProvider
    .setPrefix('pulianiBookStoreApp')
    .setStorageType('localStorage')
    .setNotify(true, true)
	
  })
.constant('Global', {CURRENCY:"&#8377;"});
