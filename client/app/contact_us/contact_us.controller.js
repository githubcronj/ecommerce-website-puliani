'use strict';
angular.module('pulianiBookStoreApp')
  .controller('contactUsCtrl', function ($scope,contact_us,toaster) {


$scope.contactSave=function()
{

contact_us.contactSave($scope.user).then(function(data)
{
        $scope.user = {};
        toaster.pop("info","successfully submitted");
	    console.log("Contact");
        console.log(data);
 })
}

});
