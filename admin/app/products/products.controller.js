'use strict';

angular.module('pulianiBookStoreAdminApp')

.controller('ProductsCtrl', function($scope, $http, $timeout, $uibModal, $location, myproducts, $state, pagination) {
  $scope.currentUrl = $location.$$url;
  $scope.focusinControl = {};
  $scope.searchterm = '';
  $scope.totalProducts = pagination.getTotalItemCount();
  $scope.jsonBody = {
    "sortBy": {
      "attribute": "id",
      "direction": "DESC",
    },
    "limit": 5,
    "offset": ($state.params.pageno - 1) * 5
  }

  $scope.currentPage = $state.params.pageno;
  $scope.jsonBody.sortBy.attribute = $state.params.attribute;
  $scope.jsonBody.sortBy.direction = $state.params.direction;
  //$scope.jsonBody.searchString = $scope.searchterm = ($state.params.searchString)?$state.params.searchString:"";
  if ($state.params.searchString) {
    $scope.jsonBody.searchString = $state.params.searchString;
    $scope.removeFilters = true;
  }

  if($state.params.attribute !== 'id'){
   $scope.removeFilters = true; 
  }


  $scope.tableSorter = function(sortkey) {
    $state.go('index.products', {
      pageno: 1,
      attribute: sortkey,
      direction: ($scope.jsonBody.sortBy.direction == 'ASC') ? 'DESC' : 'ASC',
      searchString: $scope.jsonBody.searchString
    });
  }


  $scope.onSearch = function(searchtext) {
    $state.go('index.products', {
      pageno: 1,
      attribute: 'id',
      direction: 'DESC',
      searchString: searchtext
    });
  }

  var getProductCount = function() {
    myproducts.getProductsCount($scope.jsonBody)
      .then(function(data) {
        $scope.totalProducts = data.data.full_count;
        pagination.setTotalItemCount($scope.totalProducts);
      });
  }


  var getProducts = function() {
    myproducts.getProducts($scope.jsonBody).then(function(data) {
      $scope.products = data;
      $scope.currentPage = $state.params.pageno;

    });
  }

  $scope.setPage = function(pageNo) {
    $scope.currentPage = pageNo;
  };

  $scope.pageChanged = function() {
    $state.go('index.products', {
      pageno: $scope.currentPage,
      attribute: $scope.jsonBody.sortBy.attribute,
      direction: $scope.jsonBody.sortBy.direction,
      searchString: $scope.jsonBody.searchString
    });
  };



  $scope.showProductDetails = function(product) {
    myproducts.getProductDetails(product.id).then(function(data) {
      openModel(data.data);
    });

  }

  $scope.clearFilters = function(){
    $state.go("index.products",{pageno: 1,searchString:undefined,attribute:'id',direction:'DESC'});
  }

  $scope.editProduct = function(values) {
    $state.go('index.productedit', {
      id: values.id,
      type: 'edit',
      pageno: $state.params.pageno
    });
  }

  $scope.deleteProduct = function(product) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'confirmDeleteProduct.html',
      controller: 'ProductDetailModalCtrl',
      size: 'lg',
      resolve: {
        product: function() {
          return product;
        },
      }
    });
    modalInstance.result.then(function(data) {
      getProductCount();
      getProducts();
    }, function(data) {

    });
  }

  var openModel = function(product) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'productDetails.html',
      controller: 'ProductDetailModalCtrl',
      size: 'lg',
      resolve: {
        product: function() {
          return product;
        },
      }
    });
    modalInstance.result.then(function(data) {

    }, function(data) {

    });
  }

  getProductCount();
  getProducts();

  $scope.getProductAutoSuggestion = function(val) {
    let obj = {};
    obj.searchtext = val;
    obj.limit = 10;
    return myproducts.getProducts(obj).then(function(data) {
      return data;
    })

  };
});