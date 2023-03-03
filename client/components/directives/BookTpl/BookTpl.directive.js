'use strict';

angular.module('pulianiBookStoreApp')
  .directive('bookTpl', function (Global, Auth, toaster, mywishlist, MyCart) {
    return {
      templateUrl: 'components/directives/BookTpl/BookTpl.html',
      restrict: 'E',
	   scope: { 
         book: '=',
        isfromlanding: '='
      },
	  controller: function ($scope) {
        $scope.currencyType = Global.CURRENCY;
		function getExtension(filename) {
	    
		   var indexoflastDot = filename.lastIndexOf('.');
		   return (indexoflastDot < 0) ? '' : filename.substr(indexoflastDot);
		}

		//Get path without extension
		function getPathWithoutExtension(filename){

			var indexoflastDot = filename.lastIndexOf('.');
		    return (indexoflastDot < 0) ? '' : filename.substr(0,indexoflastDot);
		}

    	//Get thumbnail image from origional image pathoflastDot
	    $scope.getMediumImage = function(image){
	    	
	    	return getPathWithoutExtension(image) + '_medium' + getExtension(image);
	    }


		 $scope.onAddToWishList = function(productid)
		 {
             
             mywishlist.AddToUserWishList({product_id:productid})
        	
        	.then(function(data){
				
				toaster.pop("info","Item added to wishlist");
			})
			
			.catch(function(error){
				
				if(error && error.errorTitle === 'Login required'){
					$scope.$emit('openLoginModal');
					
				}else{

					toaster.pop("error","Product is already added to wishlist!");
				}
				
				//toaster.pop("warning",error.errorTitle,error.errorDesc);
			});    
		 }
			 
			 
		$scope.onCartAdd = function(productid, quantity, unitsInStock)
		{

		 MyCart.addToCart(productid, quantity ,unitsInStock).then(function(data)
		 {
			$scope.$emit('checkCartShell');
			//toaster.pop("info","Item added to cart");
		 },
		  function(err){
			 toaster.pop("warning",err.data);
		 });

		}
	

       }
    };
  });
