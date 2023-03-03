'use strict';

angular.module('pulianiBookStoreAdminApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('index.bulkupload', {
        url: '/bulkupload?view',
        templateUrl: '../admin/app/bulk_upload/bulk_upload.html',
        controller: 'BulkUploadCtrl'
      });
  });
