'use strict';

angular.module('pulianiBookStoreAdminApp')
  .factory('banners', function (common) {
 
	var factory = {};
	
	factory.getBanners = function(body)
		{
			let Banners = common.callApi('POST','/api/banner_images/getAllBannerImages' ,'',{'Content-Type':'application/json'},body);
			return Banners;
		}
	
	factory.updateStatus = function(body)
		{
			let Status = common.callApi('PUT','/api/banner_images/updateBannerImageStatus' ,'',{'Content-Type':'application/json'},body);
			return Status;
		}
	
	factory.onBannerDelete = function(body)
		{
			let Delete = common.callApi('DELETE','/api/banner_images/deleteBannerImage ' ,'',{'Content-Type':'application/json'},body);
			return Delete;
		}
	
	factory.addBanner = function(body)
		{
			let adBanner = common.callApi('PUT','/api/banner_images/updateBannerImagesStatus' ,'',{'Content-Type':'application/json'},body);
			return adBanner;
		}
	
	factory.onSortChange = function(body)
	    {
		    let Sort =  common.callApi('PUT','/api/banner_images/updateBannerImagesSortOrder' ,'',{'Content-Type':'application/json'},body);
			return Sort;
	    }
	
	
		
	return factory;
	
  });
