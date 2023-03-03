'use strict';
angular.module('pulianiBookStoreApp')
  .controller('bulkOrderCtrl', function ($scope,bulkorder,toaster) {


$scope.contactSave=function()
{
bulkorder.contactSave($scope.user).then(function(data)
{
        $scope.user = {};
        toaster.pop("info","successfully submitted");
	    console.log("Contact");
        console.log(data);
 })
}

});

