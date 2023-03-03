'use strict';

angular.module('pulianiBookStoreAdminApp')
    .config(function ($stateProvider) {
      $stateProvider
        .state('index.news', {
          url: '/news?pageNumber&attribute&direction&searchString',
          templateUrl: '../admin/app/news/news.html',
          controller: 'NewsCtrl'
        });
    });
