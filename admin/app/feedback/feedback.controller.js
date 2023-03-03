'use strict';
angular.module('pulianiBookStoreAdminApp')
	.controller('feedbackCtrl', function($scope, feedback, $state, $uibModal, pagination) {

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

			$state.go("index.feedback", {
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
			$state.go('index.feedback', {
				pageno: $scope.currentPage,
				attribute: $scope.jsonBody.sortBy.attribute,
				direction: $scope.jsonBody.sortBy.direction,
				searchString: $scope.jsonBody.searchString
			});
		}

		$scope.tableSorter = function(sortkey) {
			$state.go('index.feedback', {
				pageno: 1,
				attribute: sortkey,
				direction: ($scope.jsonBody.sortBy.direction == 'ASC') ? 'DESC' : 'ASC',
				searchString: $scope.jsonBody.searchString
			});
		}

		function getFeedbacks() {
			feedback.getFeedbacks($scope.jsonBody).then(function(data) {
				//alert(JSON.stringify(data));
				$scope.totalItems = data.data.count;
				pagination.setTotalItemCount($scope.totalItems);
				$scope.feedbackData = data.data.rows;
				$scope.currentPage = $state.params.pageno;
			})

		}

		getFeedbacks();

		$scope.onSearch = function(searchtext) {
			$state.go('index.feedback', {
				pageno: 1,
				attribute: 'id',
				direction: 'DESC',
				searchString: searchtext
			});
		}
	});