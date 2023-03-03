'use strict';

angular.module('pulianiBookStoreApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('myaccount.addresses', {
        url: '/addresses',
        templateUrl: 'app/myaccount/subroutes/addresses/addresses.html',
        controller: 'AddressesCtrl',
         authenticate: true
      });
  });
