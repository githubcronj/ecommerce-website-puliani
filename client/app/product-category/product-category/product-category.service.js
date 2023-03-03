'use strict';

angular.module('pulianiBookStoreApp')
  .factory('productCategory', function (common) {
	  
    var factory = {}; 
	
	factory.getProductsJson = {
	"limit":15,
	"offset":0,
	"sortBy":{
		"attribute":"discount_price",
		"direction":"DESC"
	}
	};
	
	factory.getProducts = function(body) {
		let products = common.callApi('POST','/api/products/productSearch' ,'',{'Content-Type':'application/json'},body);
		return products;
	}
	
    factory.getproductsCount = function(body) {
		let productsCount = common.callApi('POST','/api/products/productSearchCount' ,'',{'Content-Type':'application/json'},body);
		return productsCount;
	}
	
	factory.getBestSellers =function(body){
		let products = common.callApi('POST','/api/order_products/getBestSellers' ,'',{'Content-Type':'application/json'},body);
		return products;
	}

	factory.getproductsPriceRange = function(body) {
		let productsPriceRange = common.callApi('POST','/api/products/productSearchPriceRange' ,'',{'Content-Type':'application/json'},body);
		return productsPriceRange;
	}
	
	factory.getSortOptions = function() {
		let SortOptions = common.callApi('GET','api/products/getSortOptions' ,'','','');
		return SortOptions;
	}
	
	factory.getSearchProductCategoryTree =function(string)
	{
		let categorytree =  common.callApi('GET','/api/products/getSearchStringProductCategories/'+string,'','','');
		return categorytree;
	}
	
	factory.getCategoryProductCategoryTree =function(catid)
	{
		let categorytree =  common.callApi('GET','/api/products/getSubCategories/'+catid,'','','');
		return categorytree;
	}
	
	
	 factory.sliderConfig ={
	  range:{
		  min: 0,
		  max: 10050
	  },
	  minPrice: 1000,
	  maxPrice: 4000
	};
      return factory;
  });
