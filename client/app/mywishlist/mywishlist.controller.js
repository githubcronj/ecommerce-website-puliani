'use strict';

angular.module('pulianiBookStoreApp')
  .controller('MywishlistCtrl', function ($scope, mywishlist, Global, MyCart, toaster, $state,$uibModal,  Auth) {
	
	$scope.currencyType = Global.CURRENCY;
	$scope.jsonbody = {
	"limit": 3,
	"offset":0
};

$scope.isScrollDisabled = true;
$scope.responseWishlistLength=-1;
$scope.wishlistdata=[];

   $scope.myPagination=function()
   {
		$scope.jsonbody.offset += $scope.jsonbody.limit;
		getMyWishList();

    }  



    function getMyWishList()
	{
    
       console.log("json body before fetching products");
       console.log($scope.jsonbody);
        $scope.isScrollDisabled=true;
        if($scope.responseWishlistLength!=0)
        {

		mywishlist.getMyWishList($scope.jsonbody).then(function(data){
	    $scope.responseWishlistLength=data.data.length;
		$scope.wishlistdata =$.merge($scope.wishlistdata, data.data); 
		$scope.isScrollDisabled=false;
	    console.log("mywishlist");
        console.log(data.data);
		})
	}
	}
	
	getMyWishList();
	
	
	$scope.onCartAdd = function(productid)
	{
		
	 MyCart.addWishListToCart(productid).then(function(data)
     {
		$scope.$emit('checkCartShell');
		//toaster.pop("info","Item added to cart");
	 },
	  function(err){
		//toaster.pop("warning",err.data);
	 });
		
	}
	
	$scope.onWishlistRemove = function(productid)
	{
	  	var modalInstance = $uibModal.open({
	  		animation: true,
		      templateUrl: 'confirmationBox.html',
		      controller: 'ConfirmationCtrl',
		       resolve:{
		       	message:function(){
		       		return "Do you really want to remove product from wishlist?"
				}
			  }
	  	})

	  	modalInstance.result
			.then(function(response){
				console.log("response->", response);
			})

			.catch(function(error){
				if(error === 'delete'){
					mywishlist.removeItemWishList({product_id:productid})
				   		.then(function(data){
					 	 //getMyWishList();
						angular.forEach($scope.wishlistdata, function(value, key) {
							if(value.id == productid)
							 $scope.wishlistdata.splice(key, 1);
						
						});
				   })
				}
			});
	   	
	}
	
	
	$scope.$on('onUserStatusChange', function (event, args) {
		if(!Auth.getToken())
        $state.go('main');
	});
	
	
  });
