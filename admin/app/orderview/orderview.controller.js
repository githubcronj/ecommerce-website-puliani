'use strict';

angular.module('pulianiBookStoreAdminApp')
	.controller('OrderviewCtrl', function($scope, $state, orders, Global, $uibModal) {

		$scope.jsonBody = {
			"status": "",
			"searchString": "",
			"sortBy": {
				"attribute": "o.created_at",
				"direction": "DESC"
			},
			"limit": 5,
			"offset": ($state.params.pageno - 1) * 5
		};

		$scope.json = {
			"attribute": "o.created_at",
			"direction": "DESC"
		}

		if($state.params.searchString || $state.params.filter!='all' || $state.params.attribute !== 'o.created_at'){
			$scope.searchIn = true;
		}
		

		$scope.filter = [{
			name: "All",
			value: "all"
		}, {
			name: "Processing",
			value: "processing"
		}, {
			name: "In Transit",
			value: "intransit"
		}, {
			name: "Completed",
			value: "completed"
		}, {
			name: "Cancelled",
			value: "cancelled"
		}, {
			name: "Payment Failed",
			value: "payment failed"
		}];

		angular.forEach($scope.filter, function(value, key) {
			if (value.value == $state.params.filter)
				$scope.selectedFilter = $scope.filter[key];

		});

		if ($scope.selectedFilter.value == "all")
			delete $scope.jsonBody.status;
		else
			$scope.jsonBody.status = $scope.selectedFilter.value;

		$scope.isFilterChange = function(item) {
			$state.go('index.orderview', {
				pageno: 1,
				attribute: 'o.created_at',
				direction: 'DESC',
				filter: item,
				searchString: ""
			});
		}



		$scope.currency = Global.CURRENCY;

		$scope.currentPage = $state.params.pageno;
		$scope.jsonBody.sortBy.attribute = $state.params.attribute;
		$scope.jsonBody.sortBy.direction = $state.params.direction;
		$scope.jsonBody.searchString = $scope.searchterm = ($state.params.searchString) ? $state.params.searchString : "";

		$scope.setPage = function(pageNo) {
			$scope.currentPage = pageNo;
		};

		$scope.onPageClick = function() {
			$state.go('index.orderview', {
				pageno: $scope.currentPage,
				attribute: $scope.jsonBody.sortBy.attribute,
				direction: $scope.jsonBody.sortBy.direction,
				searchString: $scope.jsonBody.searchString,
				filter: $scope.selectedFilter.value
			});
		}

		$scope.tableSorter = function(sortkey) {
			$state.go('index.orderview', {
				pageno: 1,
				attribute: sortkey,
				direction: ($scope.jsonBody.sortBy.direction == 'ASC') ? 'DESC' : 'ASC',
				searchString: $scope.jsonBody.searchString,
				filter: $scope.selectedFilter.value
			});
		}

		function getAllOrders() {

			orders.getAllOrders($scope.jsonBody).then(function(data) {
				//alert(JSON.stringify(data));
				$scope.totalItems = data.data.count;
				$scope.AllOrders = data.data.rows;
				$scope.currentPage = $state.params.pageno;
			})

		}

		function getAllOrdersForExport() {

			orders.getAllOrdersExport($scope.json).then(function(data) {

				$scope.ExportOrders = cleanArray(data.data.rows);

			})
		}


		getAllOrders();
		getAllOrdersForExport();

		$scope.onSearch = function(searchtext) {
			$state.go('index.orderview', {
				pageno: 1,
				attribute: 'o.created_at',
				direction: 'DESC',
				searchString: searchtext,
				filter: $scope.selectedFilter.value
			});
		}

		$scope.removeFilters = function(){
			$state.go("index.orderview",{pageno: 1,searchString:undefined,attribute:'o.created_at',direction:'DESC',filter:'all'});
		}

		$scope.onViewOrder = function(Order) {
			var viewOrderModalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'viewFullOrder.html',
				controller: 'fullOrderViewModalCtrl',
				size: 'lg',
				resolve: {
					orderId: function() {
						return Order.order_id;
					}
				}
			});

			viewOrderModalInstance.result.then(function(data) {

			});
		}

		$scope.onUpdateTracking = function(Order) {
			var UpdateTrackingModalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'UpdateTrackingModal.html',
				controller: 'UpdateTrackingModalCtrl',
				size: 'lg',
				resolve: {
					Order: function() {
						return Order;
					},
					Filter: function() {
						return $scope.filter;
					}
				}
			});

			UpdateTrackingModalInstance.result.then(function(data) {
				getAllOrders();
			});
		}

		function cleanArray(usrOrders) {
			let temp = [];
			for (var i = 0; i < usrOrders.length; i++) {
				let obj = {
					'Order Number': usrOrders[i].order_number,
					'Email': usrOrders[i].email,
					'Order Status': usrOrders[i].order_status,
					'Total Discount Price': usrOrders[i].total_discount_price
				};
				temp.push(obj);
			}

			return temp;
		}

	});