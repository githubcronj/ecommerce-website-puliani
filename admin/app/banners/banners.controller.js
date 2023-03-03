'use strict';

angular.module('pulianiBookStoreAdminApp')
	.controller('bannersCtrl', function($scope, $state, $uibModal, banners, toaster, pagination) {

		$scope.jsonBody = {
			"sortBy": {
				"attribute": "id",
				"direction": "DESC"
			},
			"limit": 5,
			"offset": ($state.params.pageno - 1) * 5
		}

		$scope.currentPage = $state.params.pageno;
		$scope.jsonBody.sortBy.attribute = $state.params.attribute;
		$scope.jsonBody.sortBy.direction = $state.params.direction;
		$scope.totalItems = pagination.getTotalItemCount();
		
		if($state.params.attribute !== 'id'){

			$scope.removeFilters = true;
		}

		$scope.clearFilters = function(){

			$state.go('index.banners',{pageno: 1,attribute:'id',direction:'DESC'});
		}

		$scope.setPage = function(pageNo) {
			$scope.currentPage = pageNo;
		};

		$scope.onPageClick = function() {
			$state.go('index.banners', {
				pageno: $scope.currentPage,
				attribute: $scope.jsonBody.sortBy.attribute,
				direction: $scope.jsonBody.sortBy.direction,
				searchString: $scope.jsonBody.searchString
			});
		}

		$scope.tableSorter = function(sortkey) {
			$state.go('index.banners', {
				pageno: 1,
				attribute: sortkey,
				direction: ($scope.jsonBody.sortBy.direction == 'ASC') ? 'DESC' : 'ASC',
				searchString: $scope.jsonBody.searchString
			});
		}


		function getBanners() {
			banners.getBanners($scope.jsonBody).then(function(data) {
				//alert(JSON.stringify(data));
				$scope.totalItems = data.data.count;
				pagination.setTotalItemCount($scope.totalItems);
				$scope.banners = data.data.rows;
				$scope.currentPage = $state.params.pageno;

			})

		}


		getBanners();

		$scope.onStatusUpdate = function(id, active) {
			banners.updateStatus({
				"imageId": id,
				"isActive": !active
			}).then(function(data) {
				getBanners();
			})

		}

		$scope.resetSort = function(key) {
			$scope.banners[key].isreset = true;
		}

		$scope.resetSort = function(key) {
			$scope.banners[key].isreset = true;
		}

		$scope.saveSortOrder = function(id, sortorder) {

			banners.onSortChange({
				"imageId": id,
				"sortOrder": sortorder
			}).then(function(data) {
				getBanners();
			}, function(error) {
				toaster.pop("error", error.data);
			})
		}

		$scope.onEnlarge = function(data) {
			var EnlargeModalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'Enlarge.html',
				controller: 'bannerModalCtrl',
				size: 'lg',
				resolve: {
					data: function() {
						return data;
					}
				}

			});
			EnlargeModalInstance.result.then(function(data) {
				//called when closed
			}, function(data) {

			});

		}

		$scope.onAddBanner = function() {
			var addBannerModalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'addBanner.html',
				controller: 'bannerModalCtrl',
				size: 'lg',
				resolve: {
					data: function() {
						return '';
					}
				}

			});
			addBannerModalInstance.result.then(function(data) {

				if ($state.params.attribute == "id" && $state.params.direction == "DESC" && $state.params.pageno == "1")
					getBanners();
				else
					$state.go('index.banners', {
						pageno: 1,
						attribute: 'id',
						direction: 'DESC'
					});

			}, function(data) {

			});

		}

		$scope.onDeleteBannerModal = function(data) {
			var addBannerModalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'deleteBannerModal.html',
				controller: 'bannerModalCtrl',
				size: 'lg',
				resolve: {
					data: function() {
						return data;
					}
				}

			});
			addBannerModalInstance.result.then(function(data) {

				if ($state.params.attribute == "id" && $state.params.direction == "DESC" && $state.params.pageno == "1")
					getBanners();
				else
					$state.go('index.banners', {
						pageno: 1,
						attribute: 'id',
						direction: 'DESC'
					});

			}, function(data) {

			});
		}

	});