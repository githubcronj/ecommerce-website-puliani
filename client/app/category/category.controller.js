'use strict';

angular.module('pulianiBookStoreApp')
  .controller('CategoryCtrl', function ($scope,$state,$anchorScroll, $location, product, productCategory, $stateParams, Global, Auth, MyCart, toaster, $uibModal) {
    	
    	$scope.subCategory = {};
   		productCategory.getCategoryProductCategoryTree($state.params.id)

   			.then(function(subCategory){

   				formSubCategory(subCategory.data);
   			})

   			.catch(function(error){

   				console.log("error-->",error);
   			});
  		$scope.color1 = {
  			background:'blue'
  		}
  		$scope.mainCategory = $state.params.name;
  		console.log($scope.mainCategory);
  		var formSubCategory = function(subCategory){

  			var tmp = {};
  			subCategory = subCategory[0].child;
  			// for(var r=0;r<5;r++)
  			// 	subCategory.push(name:'pqrs',id:10);

  			for(var i=0;i<subCategory.length;i++){
			    var letter=subCategory[i].name.charAt(0);
			    
			    if( tmp[ letter] ==undefined){
			        tmp[ letter]=[]
			    }
			    
			    tmp[ letter].push( subCategory[i] );
			}


			$scope.subCateogories = sortObject(tmp);
			
  		}

  		$scope.redirectTo = function(category){

  			$state.go("product-category",{type:'category',value:category.id,name:category.name});
  		}

  		function sortObject(obj) {
		    var arr = [];
		    
		    for (var prop in obj) {
		        
		        if (obj.hasOwnProperty(prop)) {
		        
		            arr.push(prop);
		        }
		    }

		    arr = arr.sort();
		    var tempObj = {};
		    var length = 0;
		    for(var prop in arr){
		    	tempObj[arr[prop]] = obj[arr[prop]];
		    	length++;
		    }
		    
		    $scope.category = {
		    
		    	length : length
		    }

		    return tempObj;
		}

		 $scope.gotoAnchor = function(x) {
		      
		     var newHash = 'anchor' + x;
		     if ($location.hash() !== newHash) {
		        // set the $location.hash to `newHash` and
		        // $anchorScroll will automatically scroll to it
		        $location.hash('anchor' + x);
		      } else {
		        // call $anchorScroll() explicitly,
		        // since $location.hash hasn't changed
		        $anchorScroll();
      		}
      	}

		
  });
