'use strict';

angular.module('pulianiBookStoreApp')
	.controller('ShellCtrl', function($scope, shell, $http, $state, Auth, $uibModal, MyCart, $window) {

		$scope.categories = shell.categories;
		$scope.currentUser = {};
		$scope.isLoggedIn = false;
		shell.getNavCategories().then(function(data) {
			$scope.categories = data.data;
		});

		$scope.getProductAutoSuggestion = function(value) {
			let obj = {};
			obj.searchString = value;
			obj.limit = 10;

			return $http.post('/api/products/getAllProducts', obj).then(function(data) {
				return data.data;
			});
		}

		$scope.onSearchSubmit = function(searchterm) {
			$scope.searchterm = '';
			$state.go('product-category', {
				type: 'search',
				value: searchterm,
				filter: '',
				name: ''
			});
		}


		$scope.gotoHome = function() {
			
			if($state && $state.current && $state.current.name == 'main'){
				$("body").animate({scrollTop: 0}, "slow");

			}else{
				$state.go('main');
			}
		}

		$scope.open = function(size, currentTab, gotoPage) {
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'loginModal.html',
				controller: 'ModalInstanceCtrl',
				size: size,
				resolve: {

					currentTab: function() {

						return currentTab;
					},

					gotoPage: function() {

						return gotoPage;
					}
				}


			});

			modalInstance.result.then(function(data) {

				if (data == "success")
					isLoggedIn();
				else if (data == "register")
					$state.go("register");

			}, function() {
				console.log('Modal dismissed at: ' + new Date());
			});

		};



		$scope.logoutUser = function() {
			Auth.logout();
			isLoggedIn();
			getCartData();
		}

		function isLoggedIn() {

			Auth.isLoggedIn(function(data) {
				$scope.isLoggedIn = data;
				if (data)
					getCurrentUser();
			})
		}

		isLoggedIn();


		function getCurrentUser() {

			Auth.getCurrentUser(function(data) {
				$scope.currentUser = data;
				getCartData();
			});
		}

		$scope.$on('AuthSuccess', function(event, args) {

			isLoggedIn();
		});


		function getCartData() {

			MyCart.getMyCart().then(function(data) {
				$scope.myCartCount = data.data.products.length;
				$scope.$broadcast('onUserStatusChange');
			});
		}

		getCartData();

		$scope.$on('checkCartShell', function(event, args) {
			getCartData();

		});

		$scope.$on('openLoginModal', function(event, data) {
			$scope.open('lg', 'login', data);
		});

		//for percentage restrict for search

		$scope.pressed = function(e) {

			if ((e.keyCode == 53) && e.shiftKey) {
				e.preventDefault();
				e.stopPropagation();

			}
		}

		$scope.redirectTo = function(category) {

			if (category && category.subCategories && category.subCategories.length > 0) {

				$state.go("category", {
					type: 'category',
					name: category.name,
					id: category.id
				});
			} else {

				$state.go("product-category", {
					name: category.name,
					type: 'category',
					value: category.id
				});
			}

		}



	});