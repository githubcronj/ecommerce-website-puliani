'use strict';

angular.module('pulianiBookStoreApp')
	.controller('MycartCtrl', function($scope, MyCart, Global, toaster, $uibModal) {

		$scope.currencyType = Global.CURRENCY;

		function getCartItems() {
			MyCart.getMyCart().then(function(data) {
				var data = data.data;

				for (var index in data.products) {
					data.products[index].quantity = parseInt(data.products[index].quantity);
				}

				$scope.cartData = data;
				if($scope.cartData && $scope.cartData.coupon && $scope.cartData.coupon.warning){
					toaster.pop("warning",$scope.cartData.coupon.warning);
					console.log("cart d data-->", $scope);
					$scope.couponcode = undefined;
				}

				
			})
		}

		getCartItems()

		$scope.removeItemfromCart = function(productid) {


			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'confirmationBox.html',
				controller: 'ConfirmationCtrl',
				resolve: {
					message: function() {
						return "Do you really want to remove product from the cart?"
					}
				}


			});

			modalInstance.result
				.then(function(response) {
					console.log("response->", response);
				})

			.catch(function(error) {
				if (error === 'delete') {
					MyCart.removeItemfromCart(productid).
					then(function(data) {

						getCartItems();
						$scope.$emit('checkCartShell');
					})
				}
			})

			//       MyCart.removeItemfromCart(productid).then(function(data)
			// {
			// getCartItems();
			// $scope.$emit('checkCartShell');
			// })
		}

		$scope.$on('onUserStatusChange', function(event, args) {

			getCartItems();
		});

		$scope.makeEditable = function(index) {
			$scope.edit = index;
		}

		var previous = null;

		$scope.validCartDetail = function(index, unitsInStock) {

			if ($scope.cartData && $scope.cartData.products && $scope.cartData.products[index]) {
				if ($scope.cartData.products[index].quantity > unitsInStock) {
					$scope.quantityExceed = true;
				} else {

					$scope.quantityExceed = false;
				}
			}
		}

		$scope.onQuantityChange = function(productid, quantity, unitsInStock, item) {


			if (!quantity) {

				toaster.pop("error", "Please specify valid quantity.");
				return;
			}

			if (quantity <= unitsInStock) {

				MyCart.onQuantityChange(productid, quantity)

				.then(function(data) {

					toaster.pop("info", "Item Quantity Updated");
					getCartItems();
					$scope.edit = undefined;
				});
			} else {
				toaster.pop("error", "Specified quantity is not available");

			}
		}

		$scope.onCouponSubmit = function(couponcode) {

			let subtotal = $scope.cartData.price.subTotal;
			MyCart.UserValidateCoupon(couponcode, subtotal)

			.then(function(data) {
				getCartItems();
			})

			.catch(function(error) {
				toaster.pop("warning", error.data.message);
			});
		}

		$scope.removeCoupon = function(couponcode) {

			MyCart.RemoveUserCoupon(couponcode).then(function(data) {
				getCartItems();
			});
		}


	});