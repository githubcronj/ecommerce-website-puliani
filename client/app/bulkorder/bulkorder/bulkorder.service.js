'use strict';
angular.module('pulianiBookStoreApp')
  .factory('bulkorder', function (common) {
    var factory = {};
  
  factory.contactSave = function(body)
  {
    return common.callApi('POST','/api/bulk_orders/createBulkOrder' ,'',{'Content-Type':'application/json'},body)
    .then(function(data){
       return data.data;
    })
   
  }
  
  return factory;
  });