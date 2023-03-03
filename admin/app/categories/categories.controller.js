'use strict';

angular.module('pulianiBookStoreAdminApp')
	.controller('CategoriesCtrl', function($scope, categories, $state, $uibModal, pagination) {

		$scope.jsonBody = {
			"searchString": "",
			"sortBy": {
				"attribute": "id",
				"direction": "DESC"
			},
			"limit": 5,
			"offset": ($state.params.pageno - 1) * 5
		};
		$scope.currentPage = $state.params.pageno;
		$scope.jsonBody.sortBy.attribute = $state.params.attribute;
		$scope.jsonBody.sortBy.direction = $state.params.direction;
		$scope.jsonBody.searchString = $scope.searchterm = ($state.params.searchString) ? $state.params.searchString : "";
		$scope.totalItems = pagination.getTotalItemCount();

		if ($state.params.searchString || $state.params.attribute !== 'id') {
			$scope.removeFilters = true;
		}

		$scope.clearFilers = function() {

			$state.go('index.categories', {
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
			$state.go('index.categories', {
				pageno: $scope.currentPage,
				attribute: $scope.jsonBody.sortBy.attribute,
				direction: $scope.jsonBody.sortBy.direction,
				searchString: $scope.jsonBody.searchString
			});
		}

		$scope.tableSorter = function(sortkey) {
			$state.go('index.categories', {
				pageno: 1,
				attribute: sortkey,
				direction: ($scope.jsonBody.sortBy.direction == 'ASC') ? 'DESC' : 'ASC',
				searchString: $scope.jsonBody.searchString
			});
		}

		function getCategories() {
			categories.getCategories($scope.jsonBody).then(function(data) {
				//alert(JSON.stringify(data));
				$scope.totalItems = data.data.count;
				pagination.setTotalItemCount($scope.totalItems);
				$scope.categories = data.data.rows;
				$scope.currentPage = $state.params.pageno;
			})

		}

		getCategories();

		$scope.onSearch = function(searchtext) {
			$state.go('index.categories', {
				pageno: 1,
				attribute: 'id',
				direction: 'DESC',
				searchString: searchtext
			});
		}


		$scope.onDeleteCategory = function(category) {

			var deleteCategoryModalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'deleteCategoryModal.html',
				controller: 'categoryModalCtrl',
				size: 'lg',
				resolve: {
					category: function() {
						return category;
					},
					type: function() {
						return 'delete';
					}
				}
			});

			deleteCategoryModalInstance.result.then(function(data) {
				if (data == "delete" || data == "add")
					getCategories();
				else
					$state.go('index.categories', {
						pageno: 1,
						attribute: 'id',
						direction: 'DESC',
						searchString: ''
					});
			});

		}


		$scope.onOpenCategoryModal = function(type, category) {
			var openCategoryModalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'addCategoryModal.html',
				controller: 'categoryModalCtrl',
				size: 'lg',
				resolve: {
					category: function() {
						return category;
					},
					type: function() {
						return type;
					}
				}
			});

			openCategoryModalInstance.result.then(function(data) {
				if (data == "edit")
					getCategories();
				else
					$state.go('index.categories', {
						pageno: 1,
						attribute: 'id',
						direction: 'DESC',
						searchString: ''
					});
			});
		}

		function getExportData() {
			categories.exportDuplicates()

			.then(function(data) {

				$scope.ExportDuplicateCategories = cleanArray(data);

			})
		}

		getExportData();

		function getAllCategories() {
			categories.exportAll()

			.then(function(data) {

				$scope.ExportCategories = cleanArray(data);

			})
		}

		getAllCategories();


		function cleanArray(categories) {
			let categoryRows = [];

			for (var i = 0; i < categories.length; i++) {

				let category = {
					'Sr No': i + 1,
					'Name': categories[i].name + " ",
					'Alias': categories[i].alias,
					'Hierachy': categories[i].categoryTree

				}

				categoryRows.push(category);
			}

			return categoryRows;
		}

	});