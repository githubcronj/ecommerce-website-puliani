'use strict';

angular.module('pulianiBookStoreAdminApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('index.bulkenquiry', {
        url: '/bulkenquiry?pageno&attribute&direction&searchString',
          templateUrl: '../admin/app/bulkenquiry/bulkenquiry.html',
          controller: 'bulkEnquiryCtrl'
      });
  });
