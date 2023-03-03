'use strict';

angular.module('pulianiBookStoreApp')
  .factory('shell', function (common) {
	  
     var factory = {};
	 
     factory.getNavCategories = function() {
		let categories = common.callApi('GET','/api/categories/getTopCategories/' ,'','','');
		return categories;
	}
  
	 return factory;
  });
