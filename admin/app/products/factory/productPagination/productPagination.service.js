'use strict';

angular.module('pulianiBookStoreAdminApp')
  .service('productPagination', function () {
    var totalProductscount = 0;
    var factory = {};

    factory.setTotalProductCount = function(count){
      totalProductscount = count;
    }

    factory.getTotalProductCount = function(){
      return totalProductscount;
    }
    return factory;
  });
