'use strict';

angular.module('pulianiBookStoreAdminApp')
  .controller('categoryModalCtrl', function ($scope, toaster, $uibModalInstance, categories, category, type, $http) {

	$scope.category = category;
	$scope.parents = [];
	$scope.type = type;
    //alert(JSON.stringify(category));
    //alert(type);
	$scope.deleteCategory = function(){
	categories.deleteCategory({"category_id":category.id}).then(function(data){
		  toaster.pop('success',"Category deleted successfully");
		  $uibModalInstance.close('delete');

	  });
	}
   

	$scope.getParentCaegories = function(val) {
		return $http.get('/api/categories/getCategoryAutoSuggest/6/'+val).then(function(response){
			$scope.parents = 	response.data;
			return response.data;
		});
	};
	
	if(type=="Edit"){
		$scope.getParentCaegories(category.parent_name);
		$scope.category.isParent = (!category.parent_id)?true:false;
	}
	


	
	$scope.onCategorySubmit = function()
	{
		var body = {};
		var parentid ="";
		if($scope.category.isParent)
		{
		   body = {name:$scope.category.name,description:$scope.category.description,parent_id:null};
		}
		else
		{
			angular.forEach($scope.parents, function(value, key) {
			
			 if(value.name == $scope.category.parent_name)
			 parentid = value.id;
				
			});
			
			if(parentid)
			body = {name:$scope.category.name,description:$scope.category.description,parent_id:parentid};
			else
			{
			 toaster.pop('error',"Parent Category do not exist");
			 return false;
			}
			
		}
		
		if(type=="Add")
		{
			categories.addCategory(body).then(function(data){
			toaster.pop('success',"Category created successfully");
			$uibModalInstance.close('add');
			},
			function(error){
			toaster.pop('error',error.data.message);	
			});
		}
		else if(type=="Edit")
		{
			body.id = category.id;
			categories.editCategory(body).then(function(data){
			toaster.pop('success',"Category edited successfully");
			$uibModalInstance.close('edit');
			},
			function(error){
			toaster.pop('error',error.data.message);	
			});
			
		}
	}
  
	$scope.close = function () {
		$uibModalInstance.dismiss();
	};

  });
