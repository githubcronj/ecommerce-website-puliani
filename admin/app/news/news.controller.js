'use strict';


angular.module('pulianiBookStoreAdminApp')
  .controller('NewsCtrl', function($scope, $uibModal, $state, $location, mynews, pagination) {

    $scope.newsPerPage = 5;
    $scope.maxSize = 5;

    $scope.jsonBody = {
      "sortBy": {
        "attribute": "id",
        "direction": "DESC",
      },
      "limit": 5,
      "offset": ($state.params.pageNumber - 1) * 5
    }
    $scope.totalNews = pagination.getTotalItemCount();
    $scope.currentPage = $state.params.pageNumber;
    $scope.jsonBody.sortBy.attribute = $state.params.attribute;
    $scope.jsonBody.sortBy.direction = $state.params.direction;
    //$scope.jsonBody.searchString = $scope.searchterm = ($state.params.searchString)?$state.params.searchString:"";
    if ($state.params.searchString) {
      $scope.jsonBody.searchString = $state.params.searchString;
    }

    if ($state.params.attribute !== 'id') {
      $scope.removeFilters = true;
    }

    $scope.clearFilters = function() {

      $state.go('index.news', {
        pageNumber: 1,
        attribute: 'id',
        direction: 'DESC'
      });
    }

    $scope.tableSorter = function(sortkey) {
      $state.go('index.news', {
        pageNumber: 1,
        attribute: sortkey,
        direction: ($scope.jsonBody.sortBy.direction == 'ASC') ? 'DESC' : 'ASC',
        searchString: $scope.jsonBody.searchString
      });
    }

    var getNews = function() {
      mynews.getNews($scope.jsonBody).then(function(data) {
        $scope.news = data.data.rows;
        $scope.totalNews = data.data.count;
        pagination.setTotalItemCount($scope.totalNews);
        $scope.currentPage = $state.params.pageNumber;
      });
    }

    $scope.setPage = function(pageNo) {
      $scope.currentPage = pageNo;
    };

    $scope.pageChanged = function() {
      $state.go('index.news', {
        pageNumber: $scope.currentPage
      });
    };

    $scope.addNews = function(size, type, value) {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'newsModal.html',
        controller: 'NewsModalCtrl',
        size: size,
        resolve: {
          newsData: function() {
            return value;
          },

          type: function() {
            return type;
          }
        }
      });

      modalInstance.result.then(function(data) {

      }, function(data) {
        $scope.currentPage = 1;
        $scope.pageChanged();
        getNews();
      });
    }

    $scope.deleteNews = function(value) {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'confirmationBox.html',
        controller: 'NewsModalCtrl',
        size: 500,
        resolve: {
          newsData: function() {
            return value;
          },

          type: function() {
            return 'delete';
          }
        }
      });

      modalInstance.result.then(function(data) {

      }, function(data) {
        getNews();
      });

    }

    getNews();
  });