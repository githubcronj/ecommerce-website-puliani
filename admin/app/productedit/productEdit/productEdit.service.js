'use strict';

angular.module('pulianiBookStoreAdminApp')
  .factory('productEdit', function (common) {

    var factory = {};

    factory.getAutoSuggest = function(searchValue){
      let MyCategories = common.callApi('GET','/api/categories/getCategoryAutoSuggest/6/'+searchValue ,'','','');
      return MyCategories;
    }

    factory.createProduct = function(body){
        let myProduct = common.callApi('POST','/api/products/createProduct/' ,'',{'Content-Type':'application/json'},body);
        return myProduct;
    }

    factory.deleteImage = function(body){
      let myProduct = common.callApi('DELETE','/api/products/localSingleProductImageDelete' ,'',{'Content-Type':'application/json'},body);
      return myProduct;
    }

    factory.deleteImageFromS3 = function(body){
      let myProduct = common.callApi('DELETE','/api/products/s3SingleProductImagesDelete' ,'',{'Content-Type':'application/json'},body);
      return myProduct;
    }
    factory.updateProduct = function(body){
      let myProduct = common.callApi('PUT','/api/products/updateProduct' ,'',{'Content-Type':'application/json'},body);
      return myProduct;
    }
    factory.updateImage = function(body){
      let myProduct = common.callApi('PUT','/api/products/s3SingleProductImagesUpload' ,'',{'Content-Type':'application/json'},body);
      return myProduct;
    }
    
    factory.getProductNameAutoSuggest = function(searchValue){
      let ProductAutoSuggest = common.callApi('GET','/api/products/productNameAutoSuggest/5/'+searchValue,'','','');
      return ProductAutoSuggest;
    }

    factory.isUniqueISBN = function(searchValue){
      let uniqueISBN = common.callApi('GET','/api/products/checkUniqueIsbn/'+searchValue,'','','');
      return uniqueISBN;
    }
    

    return factory;

  });
