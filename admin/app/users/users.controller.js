'use strict';

angular.module('pulianiBookStoreAdminApp')
	.controller('UsersCtrl', function($scope, users, $state, $uibModal, pagination, $filter) {

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

			$state.go('index.users',{pageno: 1,attribute:'id',direction:'DESC',searchString:undefined});
		}

		$scope.setPage = function(pageNo) {
			$scope.currentPage = pageNo;
		};

		$scope.onPageClick = function() {
			$state.go('index.users', {
				pageno: $scope.currentPage,
				attribute: $scope.jsonBody.sortBy.attribute,
				direction: $scope.jsonBody.sortBy.direction,
				searchString: $scope.jsonBody.searchString
			});
		}

		$scope.tableSorter = function(sortkey) {
			$state.go('index.users', {
				pageno: 1,
				attribute: sortkey,
				direction: ($scope.jsonBody.sortBy.direction == 'ASC') ? 'DESC' : 'ASC',
				searchString: $scope.jsonBody.searchString
			});
		}

		function getUsers() {
			users.getUsers($scope.jsonBody).then(function(data) {
				//alert(JSON.stringify(data));
				$scope.totalItems = data.data.count;
				pagination.setTotalItemCount($scope.totalItems);
				$scope.userData = data.data.rows;
				$scope.currentPage = $state.params.pageno;
			})

		}

		getUsers();


		function getExportData() {
			users.getExportData().then(function(data) {
				$scope.ExportUsers = cleanArray(data.data);
				//alert(JSON.stringify($scope.ExportUsers));
			})
		}

		getExportData(false);


		function cleanArray(usrArr) {
			let temp = [];
			for (var i = 0; i < usrArr.length; i++) {
				let obj = {
					'First name': usrArr[i].first_name,
					'Last Name': usrArr[i].last_name,
					'Email': usrArr[i].email,
					'Date of Birth': (usrArr[i].dob) ? ($filter('date')(usrArr[i].dob, "dd/MM/yyyy")) : '',
					'Gender': usrArr[i].gender,
					'Email Verified': usrArr[i].isEmailVerified ? 'Yes' : 'No',
					'Role': usrArr[i].role,
					'Phone No': (usrArr[i].phone_number) ? usrArr[i].phone_number.toString() : '',
					'Address': (usrArr[i].addresses) ? getFormattedAddress(usrArr[i].addresses) : "",
					'Created': (usrArr[i].created_at) ? ($filter('date')(usrArr[i].created_at, "dd/MM/yyyy")) : ''
				};
				temp.push(obj);
			}

			return temp;
		}

		function getFormattedAddress(addr) {
			let Address = "";
			for (var i = 0; i < addr.length; i++) {
				Address += ((addr[i].name) ? (addr[i].name + ', ') : '') + ((addr[i].address) ? (addr[i].address + ', ') : '') + ((addr[i].landmark) ? (addr[i].landmark + ', ') : '') + ((addr[i].city) ? (addr[i].city + ', ') : '') + ((addr[i].state) ? (addr[i].state + ', ') : '') + ((addr[i].phone) ? (addr[i].phone + ', ') : '') + ((addr[i].pincode) ? (addr[i].pincode + ' ') : '') + "; ";
			}
			return Address;
		}

		$scope.onSearch = function(searchtext) {
			$state.go('index.users', {
				pageno: 1,
				attribute: 'id',
				direction: 'DESC',
				searchString: searchtext
			});
		}

		$scope.onOpenAddresses = function(user) {
			var addressModalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'openAddressModal.html',
				controller: 'userModalCtrl',
				size: 'lg',
				resolve: {
					user: function() {
						return user;
					},
					from: function() {
						return 'addresses';
					}
				}

			});
		}

		$scope.onOpenOrders = function(user) {
			/*var ordersModalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'openOrdersModal.html',
            controller: 'userModalCtrl',
			size: 'lg',
			resolve: {
				user: function(){
				return user;
				},
				from:function(){
				return 'orders';
				}
			}

		});*/

			$state.go('index.userorders', {
				userid: user.id
			});
		}

		$scope.onAddUser = function() {
			var addUserModalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'addUserModal.html',
				controller: 'addUserModalCtrl',
				size: 'lg'
			});

			addUserModalInstance.result.then(function(data) {

				getExportData(true);

				if ($state.params.attribute == "id" && $state.params.direction == "DESC" && $state.params.pageno == "1" && $state.params.searchString == "")
					getUsers();
				else
					$state.go('index.users', {
						pageno: 1,
						attribute: 'id',
						direction: 'DESC',
						searchString: ''
					});
			});
		}

	});