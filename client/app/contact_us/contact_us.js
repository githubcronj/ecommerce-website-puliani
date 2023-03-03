'use strict';

angular.module('pulianiBookStoreApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('contact_us', {
        url: '/contact_us',
        templateUrl: 'app/contact_us/contact_us.html',
        controller:'contactUsCtrl'
      });
  });
