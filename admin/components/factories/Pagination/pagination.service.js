'use strict';

angular.module('pulianiBookStoreAdminApp')
  .service('pagination', function () {
    var totalProductscount = 0;
    var factory = {};

    factory.setTotalItemCount = function(count){
      totalProductscount = count;
    }

    factory.getTotalItemCount = function(){
      return totalProductscount;
    }
    return factory;
  });
