'use strict';

angular.module('pulianiBookStoreApp')

  .controller('MyordersCtrl', function ($scope, myorders, Global, Auth, $state ,$uibModal) {
	
$scope.jsonbody = {
	"limit": 5,
	"offset":0,
};

$scope.isScrollDisabled = true;
$scope.myorders=[];
$scope.responseOrdersLength=-1;
	
	$scope.currencyType = Global.CURRENCY;

	$scope.myPagination=function()
	{
        
		$scope.isScrollDisabled=true;
		$scope.jsonbody.offset += $scope.jsonbody.limit;
		getMyOrders();

		

	}

	$scope.stopPropogation=function(e)
	{
    e.preventDefault();
    e.stopPropagation();

	}
	
	function getMyOrders()
	{
        console.log("json body before fetching products");
        console.log($scope.jsonbody);
      
        if($scope.responseOrdersLength!=0)
        {
 
		myorders.getMyOrders($scope.jsonbody).then(function(data)
	    {
	 
	    $scope.responseOrdersLength=data.data.length;
		$scope.myorders=$.merge($scope.myorders, data.data);
	    $scope.isScrollDisabled=false;
		console.log("myorders");
        console.log(data.data);

		//alert(JSON.stringify($scope.myorders));
		})
 
		
         }
		
	}

	//code for modal popup
 
  $scope.CourierLink="";
  $scope.animationsEnabled = true;
  $scope.openModal = function (size,e,trackNumber) {
  	var tracknum=trackNumber;
     e.preventDefault();
     e.stopPropagation();
     var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'TrackModalContent.html',
      controller: 
    function ModalInstanceTrackCtrl($scope, $uibModalInstance,$window)
    {
    $scope.TrackId=tracknum;
    $scope.track=function()
    {
        $window.location.href="http://firstflight.net:8081/single-web-tracking/singleTracking.do";

    }
    $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
    }
    },
    size: size
        });
    }


	getMyOrders();
    
    $scope.$on('onUserStatusChange', function (event, args) {
    Auth.isLoggedIn(function(isLoggedIn){
        if(!isLoggedIn)
         $state.go('main');
    })
    });
	
  });

