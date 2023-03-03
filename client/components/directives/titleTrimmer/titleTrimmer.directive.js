angular.module('pulianiBookStoreApp').directive('titleTrimmer', function() {
  return{
   restrict: 'A',   
   controller: function ($scope,$window,$filter) {

if($window.innerWidth<768 && $scope.book.name.length>20)
{
$scope.book.name=$filter('limitTo')($scope.book.name,20,0);
$scope.book.name+="...";
}
    //return {
      //template: '<h1 itemprop="name" class="hidden-xs product_title entry-title">{{productDetail.name}}</h1>'+
      //'<h1 itemprop="name" class="hidden-sm hidden-md hidden-lg product_title entry-title">{{productDetail.name.length<=10?productDetail.name:productDetail.name|limitTo:10}}{{productDetail.name.length>10?"...":""}}</h1>'
    //};
  }
}
});