'use strict';

angular.module('pulianiBookStoreAdminApp')
  .controller('DashboardCtrl', function($scope,$location,Global,dashboard) {  

		$scope.currencyType = Global.CURRENCY;
  		dashboard.getTotalRevenue().then(function(revenue){
  			$scope.totalRevenue = revenue;
  		});

  		dashboard.getTotalOrders().then(function(orders){
  			$scope.totalOrders = orders;
  		});
  });
