
'use strict';

angular.module('pulianiBookStoreAdminApp')
  .factory('mynews', function (common) {
    var factory = {};

  factory.getNews = function(body){
    console.log("body--><",body);
    let MyCoupon = common.callApi('POST','/api/news/getAllNews' ,'',{'Content-Type':'application/json'},body);
    return MyCoupon;
  }

  factory.saveNews = function(body){
    let MyCoupon = common.callApi('POST','/api/news/createNews' ,'',{'Content-Type':'application/json'},body);
    return MyCoupon;
  }

  factory.updateNews = function(body){
    let MyCoupon = common.callApi('PUT','/api/news/updateNews' ,'',{'Content-Type':'application/json'},body);
    return MyCoupon;
  }
  factory.deleteNews = function(body){
    let MyCoupon = common.callApi('DELETE','/api/news/deleteNews' ,'',{'Content-Type':'application/json'},body);
    return MyCoupon;
  }


  return factory;

  });
