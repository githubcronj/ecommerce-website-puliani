'use strict';
angular.module('pulianiBookStoreAdminApp')
	.controller('bulkEnquiryCtrl', function($scope, bulkenquiry, $state, $uibModal, pagination) {

		$scope.jsonBody = {
			"sortBy": {
				"attribute": "id",
				"direction": "DESC"
			},
			"limit": 5,
			"offset": ($state.params.pageno - 1) * 5,
			"searchString": ""
		}

		$scope.currentPage = $state.params.pageno;
		$scope.jsonBody.sortBy.attribute = $state.params.attribute;
		$scope.jsonBody.sortBy.direction = $state.params.direction;
		$scope.jsonBody.searchString = $scope.searchterm = ($state.params.searchString) ? $state.params.searchString : "";
		$scope.totalItems = pagination.getTotalItemCount();

		if ($state.params.searchString || $state.params.attribute !== 'id') {

			$scope.removeFilters = true;
		}

		$scope.clearFilters = function() {

			$state.go('index.bulkenquiry', {
				pageno: 1,
				attribute: 'id',
				direction: 'DESC',
				searchString: undefined
			});
		}

		$scope.setPage = function(pageNo) {
			$scope.currentPage = pageNo;
		};

		$scope.onPageClick = function() {
			$state.go('index.bulkenquiry', {
				pageno: $scope.currentPage,
				attribute: $scope.jsonBody.sortBy.attribute,
				direction: $scope.jsonBody.sortBy.direction,
				searchString: $scope.jsonBody.searchString
			});
		}

		$scope.tableSorter = function(sortkey) {
			$state.go('index.bulkenquiry', {
				pageno: 1,
				attribute: sortkey,
				direction: ($scope.jsonBody.sortBy.direction == 'ASC') ? 'DESC' : 'ASC',
				searchString: $scope.jsonBody.searchString
			});
		}

		function getBulkEnquiries() {
			bulkenquiry.getBulkEnquiries($scope.jsonBody).then(function(data) {
				//alert(JSON.stringify(data));
				$scope.totalItems = data.data.count;
				pagination.setTotalItemCount($scope.totalItems);
				$scope.bulkData = data.data.rows;
				$scope.currentPage = $state.params.pageno;
			})

		}

		getBulkEnquiries();

		$scope.onSearch = function(searchtext) {
			$state.go('index.bulkenquiry', {
				pageno: 1,
				attribute: 'id',
				direction: 'DESC',
				searchString: searchtext
			});
		}
	});