'use strict';

angular.module('pulianiBookStoreApp')
  .directive('catTree', function () {
    return {
      templateUrl: 'components/directives/catTree/catTree.html',
      restrict: 'E',
       scope: {
         cat: '=',
		 filter: '='
      }
    };
  });
