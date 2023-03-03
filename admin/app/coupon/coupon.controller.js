'use strict';

angular.module('pulianiBookStoreAdminApp')
  .controller('CouponCtrl', function($scope, $uibModal, toaster, $http, mycoupons, $state, $location, pagination) {

    //Initialization
    $scope.maxSize = 5;
    $scope.couponPerPage = 5;
    $scope.totalItems = pagination.getTotalItemCount();

    $scope.jsonBody = {
      "sortBy": {
        "attribute": "id",
        "direction": "DESC",
      },
      "limit": 5,
      "offset": ($state.params.pageNumber - 1) * 5
    }

    $scope.currentPage = $state.params.pageNumber;
    $scope.jsonBody.sortBy.attribute = $state.params.attribute;
    $scope.jsonBody.sortBy.direction = $state.params.direction;
    //$scope.jsonBody.searchString = $scope.searchterm = ($state.params.searchString)?$state.params.searchString:"";
    if ($state.params.searchString) {
      $scope.jsonBody.searchString = $state.params.searchString;
      $scope.removeFilters = true;
    }

    if ($state.params.attribute !== 'id') {
      $scope.removeFilters = true;
    }

    $scope.clearFilters = function() {

      $state.go("index.coupon",{pageNumber: 1,attribute:'id',direction:'DESC'});
    }

    $scope.tableSorter = function(sortkey) {
      $state.go('index.coupon', {
        pageNumber: 1,
        attribute: sortkey,
        direction: ($scope.jsonBody.sortBy.direction == 'ASC') ? 'DESC' : 'ASC',
        searchString: $scope.jsonBody.searchString
      });
    }

    //Fetch Initial data After refreshing
    function getmycoupons() {
      mycoupons.getMyCoupons($scope.jsonBody).then(function(data) {
        $scope.coupons = data.data.rows;
        $scope.totalItems = data.data.count;
        pagination.setTotalItemCount(data.data.count);
        $scope.currentPage = $state.params.pageNumber;

      })
    }

    getmycoupons();

    //Paginatiion Functions
    $scope.setPage = function(pageNo) {
      $scope.currentPage = pageNo;
    };

    $scope.pageChanged = function() {
      $state.go('index.coupon', {
        pageNumber: $scope.currentPage
      });
    };

    //Opens Modal while adding coupon
    $scope.AddCoupon = function(size, type) {
      var modalInstance1 = $uibModal.open({
        animation: true,
        templateUrl: 'editCoupon.html',
        controller: 'EditCouponModalCtrl',
        size: 100,
        resolve: {
          couponData: function() {
            return {};
          },

          type: function() {
            return type;
          }
        }

      });
      modalInstance1.result.then(function(data) {}, function(data) {
        $scope.currentPage = 1;
        getmycoupons();
      });
    }

    //Opens Modal on Edit Coupon
    $scope.editCoupon = function(size, type, couponData) {

      couponData.minimum_cart = parseFloat(couponData.minimum_cart);
      couponData.value = parseFloat(couponData.value);

      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'editCoupon.html',
        controller: 'EditCouponModalCtrl',
        size: size,
        resolve: {

          couponData: function() {
            return couponData;
          },

          type: function() {
            return type;
          }

        }

      });

      modalInstance.result.then(function(data) {

      }, function(data) {
        //        Notification.success('successfully updated coupon');

        getmycoupons();

      });
    }

    //Delete Coupon
    $scope.deleteCopon = function(couponToBeDeleted) {
      var modalInstance1 = $uibModal.open({
        animation: true,
        templateUrl: 'confirmationBox.html',
        controller: 'EditCouponModalCtrl',
        size: 100,
        resolve: {
          couponData: function() {
            return couponToBeDeleted;
          },

          type: function() {
            return 'type';
          }
        }

      });
      modalInstance1.result.then(function(data) {
        //called when closed
      }, function(data) {
        getmycoupons();
        //called when dismissed
      });
    }


    $scope.sendCoupon = function(key) {
      var sendCouponModalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'sendCoupon.html',
        controller: 'sendCouponModalCtrl',
        size: 100,
        resolve: {
          couponData: function() {
            return key;
          }
        }

      });

      sendCouponModalInstance.result.then(function(data) {
        //called when closed
      }, function(data) {
        //called when dismissed
      });

    }



  });