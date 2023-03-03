'use strict';

angular.module('pulianiBookStoreAdminApp')
  .factory('categories', function (common) {

	var factory = {};

	
	 factory.getCategories = function(body)
		{
			let Categories = common.callApi('POST','/api/categories/getAllCategories' ,'',{'Content-Type':'application/json'},body);
			return Categories;
		}
	 
	 factory.deleteCategory = function(body)
	  {
	       let deleteCat = common.callApi('DELETE','/api/categories/deleteCategory' ,'',{'Content-Type':'application/json'},body);
		   return deleteCat;
	  }
	 
	
	 factory.addCategory = function(body)
	  {
	       let addCat = common.callApi('POST','/api/categories/createCategory' ,'',{'Content-Type':'application/json'},body);
		   return addCat;
	  }
	 
	 factory.editCategory = function(body)
	  {
	       let editCat = common.callApi('PUT','/api/categories/editCategory' ,'',{'Content-Type':'application/json'},body);
		   return editCat;
	  }

	  factory.exportAll = function()
	  {

	  		return common.callApi('GET','/api/categories/exportAllCategories' ,'','','')
	  			
	  			.then(function(categories){

	  				return categories.data;
	  			})

	  			.catch(function(error){

	  				console.log("error->",error);
	  			});
	  }

	  factory.exportDuplicates = function()
	  {

	  		return common.callApi('GET','/api/categories/getDuplicateCategoryAlias' ,'','','')
	  			
	  			.then(function(categories){

	  				
	  				return categories.data;
	  			})

	  			.catch(function(error){

	  				console.log("error->",error);
	  			});
	  }

	return factory;
	
  });
