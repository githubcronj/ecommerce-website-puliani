'use strict';

angular.module('pulianiBookStoreAdminApp')
  .factory('myproducts', function (common) {
    var factory = {};

    factory.getProducts = function(body){

      return common.callApi('POST','/api/products/getAllProducts' ,'',{'Content-Type':'application/json'},body)
      .then(function(response){
          return response.data;
      })
    }

    factory.getProductsCount = function(body){
        let myProducts = common.callApi('POST','/api/products/getAllProductsCount' ,'',{'Content-Type':'application/json'},body);
        return myProducts;
    }

    factory.getProductDetails = function(id){
          let myProducts = common.callApi('GET','/api/products/productDetails/'+id ,'',{'Content-Type':'application/json'},'');
          return myProducts;
    }
	
	factory.deleteProduct = function(body){
		  let delProd = common.callApi('DELETE','/api/products/deleteProduct' ,'',{'Content-Type':'application/json'},body);
		  return delProd;
	}

    return factory;

  });
