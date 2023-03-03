'use strict';

angular.module('pulianiBookStoreApp')
  .factory('main', function (common) {
  
   var factory = {};
    
    
    
    factory.getBannerImages = function(body)
    {
        let BannerImages = common.callApi('GET','/api/banner_images/getAllBannerImages/10' ,'','','');
        return BannerImages;
    }

   factory.getNews = function()
    {
        let News = common.callApi('GET','/api/news/getAllNews/5' ,'','','');
        return News;
    }	
	
   
    return factory;
  });
