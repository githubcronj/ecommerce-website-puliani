
'use strict';

angular.module('pulianiBookStoreAdminApp')
  .factory('fileupload', function ($http) {
    var factory = {};

    factory.uploadFiles = function(data){
      var response = $http({
             url: "/api/products/localSingleProductImageUpload",
             method: "POST",
             data: data,
             transformRequest: angular.identity,
             headers: { 'Content-Type': undefined }
      });

return response;  
      
      
    }
	
	factory.uploadFilesToS3 = function(data){
      var response = $http({
             url: "/api/products/s3SingleProductImagesUpload",
             method: "POST",
             data: data,
             transformRequest: angular.identity,
             headers: { 'Content-Type': undefined }
         });
      return response;
    }
	
    factory.uploadEditedFiles = function(data,body){
      var formData = new FormData();

      var response = $http({
             url: "/api/products/s3SingleProductImagesUpload/"+body.product_name+"/"+body.product_id+"/"+body.sku,
             method: "POST",
             data: data,
             transformRequest: angular.identity,
             headers: { 'Content-Type' : undefined }
         });
      console.log("response",response);
      return response;
    }

    return factory;
  });
