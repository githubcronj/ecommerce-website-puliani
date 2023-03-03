'use strict';

angular.module('pulianiBookStoreApp')
  .factory('product', function (common, $cookieStore) {
  
      var factory = {};

	factory.getProductDetail = function(id) {
		let ProductDetail = common.callApi('GET','api/products/productDetails/'+id ,'','','');
		return ProductDetail;
	}
	
 
    return factory;
  
  
  });
