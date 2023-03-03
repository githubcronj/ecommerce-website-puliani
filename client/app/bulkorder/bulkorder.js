'use strict';

angular.module('pulianiBookStoreApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('bulkorder', {
        url: '/bulk_enquiry',
        templateUrl: 'app/bulkorder/bulkorder.html',
        controller:'bulkOrderCtrl'
      });
  });
