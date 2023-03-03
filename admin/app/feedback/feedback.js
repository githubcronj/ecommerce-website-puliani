'use strict';

angular.module('pulianiBookStoreAdminApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('index.feedback', {
        url: '/feedback?pageno&attribute&direction&searchString',
          templateUrl: '../admin/app/feedback/feedback.html',
          controller: 'feedbackCtrl'
      });
  });
