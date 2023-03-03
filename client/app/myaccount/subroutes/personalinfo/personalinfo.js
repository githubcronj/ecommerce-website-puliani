'use strict';

angular.module('pulianiBookStoreApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('myaccount.personalinfo', {
        url: '/personalinfo',
        templateUrl: 'app/myaccount/subroutes/personalinfo/personalinfo.html',
        controller: 'PersonalinfoCtrl',
        authenticate: true
      });
  });
