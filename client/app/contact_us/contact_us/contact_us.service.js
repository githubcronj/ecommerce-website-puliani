'use strict';
angular.module('pulianiBookStoreApp')
  .factory('contact_us', function (common) {
    var factory = {};
  
  factory.contactSave = function(body)
  {
    return common.callApi('POST','/api/feedbacks/createFeedback' ,'',{'Content-Type':'application/json'},body)
    .then(function(data){
       return data.data;
    })
   
  }
  
  return factory;
  });
