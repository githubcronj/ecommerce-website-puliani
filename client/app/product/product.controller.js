'use strict';

angular.module('pulianiBookStoreApp')
	.controller('ProductCtrl', function($scope, $state, product, productCategory, $stateParams, Global, Auth, MyCart, toaster, $uibModal, $timeout, Fullscreen, mywishlist) {


		$scope.images = product.images;
		$scope.currencyType = Global.CURRENCY;

		$scope.jsonbody = {
			"limit": 12,
			"offset": 0,
			"category": [],
			"sortBy": {
				"attribute": "discount_price",
				"direction": "DESC"
			}
		};

		$scope.IMGslickConfig = {
			enabled: true,
			autoplay: false,
			draggable: true,
		};

		$scope.defaultQuantity = 1;

		$scope.isFullscreen = false;

		$scope.toggleFullScreen = function() {

			$scope.isFullscreen = !$scope.isFullscreen;
		}

		Auth.getCurrentUser(function(user) {
			if (user.email) {
				$scope.units_in_localStorage = 0;
			} else {
				var productCart = JSON.parse(localStorage.getItem('pulianiBookStoreApp.products'));
				if (productCart === null || productCart === undefined) {
					productCart = [];
				}
				for (var index = 0, length = productCart.length; index < length; index++) {
					if ($state.params.id == productCart[index].product_id) {
						$scope.units_in_localStorage = productCart[index].quantity;
					}
				}
				if (!$scope.units_in_localStorage) {
					$scope.units_in_localStorage = 0;
				}
			}
		});

		// Auth.getCurrentUser().then(function(data){
		// 	console.log("yahoo");
		// })

		// .catch(function(error){
		// 	console.log('fuck!');
		// })


		function regularBook() {
			$('#flipbook').css("background", "white");
			$('#flipbook').turn('size', 400, 300);

		}

		function zoomedInBook() {
			$('#flipbook').css("background", "black");
			$('#flipbook').turn('size', $(window).width() - ($(window).width() / 10), $(window).height() - ($(window).height() / 10));
		}


		Fullscreen.$on('FBFullscreen.change', function(evt, isFullscreenEnabled) {
			if (isFullscreenEnabled)
				zoomedInBook()
			else
				regularBook()
		});


		function getRelatedProducts() {
			productCategory.getProducts($scope.jsonbody).then(function(data) {
				$scope.RelBooks = data.data;
			});
		}


		product.getProductDetail($stateParams.id).then(function(data) {


			$scope.productDetail = data.data;

			$timeout(function() {
				$('#flipbook').css("display", "block");
				$("#flipbook").turn({
					width: 400,
					height: 300,
					autoCenter: true
				});

			}, 0);


			//alert(JSON.stringify(data.data.category[0].id));
			$scope.jsonbody.category.push(data.data.category[0].id);
			getRelatedProducts();


			/*
			angular.forEach($scope.productDetail.images, function(value, key) {
			$scope.productDetail.images[key].thumb = value.url;
			$scope.productDetail.images[key].img = value.url;
			$scope.productDetail.images[key].description = '';
			}); 
			*/
			//alert(JSON.stringify($scope.productDetail));
		});


		$scope.onCartAdd = function(productid, quantity, unitsInStock) {

			// if((quantity > ($scope.productDetail.units_in_stock - $scope.units_in_localStorage)) || quantity < 1){

			// 	var message = "Specified quantity is not available!";

			// 	if($scope.productDetail.units_in_stock - $scope.units_in_localStorage < 1){
			// 		message = "Product is out of stock!";
			// 	}

			// 	toaster.pop("error",message);
			// 	return;
			// }
			//if(quantity > unitsInStock){

			// var message = "Specified quantity is not available!";

			// if($scope.productDetail.units_in_stock - $scope.units_in_localStorage < 1){
			// 	message = "Product is out of stock!";
			// }

			// toaster.pop("error",message);
			// return;

			// 	toaster.pop("quantity required");
			// }

			// if(!Auth.isLoggedIn){
			// 	$scope.units_in_localStorage = $scope.units_in_localStorage + quantity;	
			// }

			if (quantity <= 0) {

				toaster.pop("error", "Quantity should be more than zero");
				return;
			}

			MyCart.addToCart(productid, quantity, unitsInStock)

			.then(function(data) {

				$scope.$emit('checkCartShell');
				//toaster.pop("info","Item added to cart");

			}, function(error) {
				toaster.pop("error", "Specified quantity is not available!");
			})
		}


		//manage click event on images
		$scope.onThumbClick = function(Overkey) {

			$("#flipbook").turn("page", Overkey + 1);
		}


		//Get Extension of file from path
		function getExtension(filename) {

			var indexoflastDot = filename.lastIndexOf('.');
			return (indexoflastDot < 0) ? '' : filename.substr(indexoflastDot);
		}

		//Get path without extension
		function getPathWithoutExtension(filename) {

			var indexoflastDot = filename.lastIndexOf('.');
			return (indexoflastDot < 0) ? '' : filename.substr(0, indexoflastDot);
		}

		//Get thumbnail image from origional image pathoflastDot
		$scope.getThumbnailImage = function(image) {

			return getPathWithoutExtension(image) + '_thumb' + getExtension(image);
		}


		$scope.onAddToWishList = function(productid) {

			mywishlist.AddToUserWishList({
				product_id: productid
			})

			.then(function(data) {

				toaster.pop("info", "Item added to wishlist");
			})

			.catch(function(error) {

				if (error && error.errorTitle === 'Login required') {
					$scope.$emit('openLoginModal');

				} else {

					toaster.pop("error", "Product is already added to wishlist!");
				}

				//toaster.pop("warning",error.errorTitle,error.errorDesc);
			});
		}


		//    $("#flipbook").bind("start", function(event, page, view) {
		//  		if (page.page==1 || page.page==$("#flipbook").turn("pages")) {
		//   			$("#clickhere").hide("slow");
		//  		}
		// });

		//    $("#flipbook").bind("first", function(event) {

		//   $("#clickhere").show("slow");
		// });

		//    $("#flipbook").bind("turned", function(event,page) {
		//   	   if(page==$("#flipbook").turn("pages") && (page%2==0))
		//       $("#clickhere").show("slow");
		// });



	});