'use strict';

angular.module('pulianiBookStoreAdminApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('index.coupon', {
        url: '/coupon/?pageNumber&attribute&direction&searchString',
        templateUrl: '../admin/app/coupon/coupon.html',
        controller: 'CouponCtrl'
      });
  });
