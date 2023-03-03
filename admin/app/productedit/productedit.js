'use strict';

angular.module('pulianiBookStoreAdminApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('index.productedit', {
        url: '/productedit?id&type&pageno',
        templateUrl: '../admin/app/productedit/productedit.html',
        controller: 'ProducteditCtrl'
      });
  });
