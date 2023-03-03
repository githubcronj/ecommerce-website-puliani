'use strict';

angular.module('pulianiBookStoreAdminApp')
  .controller('UserOrdersCtrl', function ($scope, Global,users,userorders,$filter,$state,$window,usSpinnerService) {

$scope.isScrollDisabled=true;
$scope.responseOrdersLength=-1;
$scope.jsonbody = {
	"limit": 5,
	"offset":0,
};
$scope.showMessage=false;
$scope.userOrders=[];
$scope.myPagination=function()
	{
        
		$scope.isScrollDisabled=true;
		$scope.jsonbody.offset += $scope.jsonbody.limit;
		getUserOrders();

		

	}


	$scope.currencyType = Global.CURRENCY;
	$scope.close = function () {
		$uibModalInstance.close();
	};
    
function getUser()
	{
	userorders.getUser({"id":$state.params.userid}).then(function(data){
		$scope.user = data.data;
		getUserOrders();
		getAllOrders();
		
	})
		
	}


	
   function getUserOrders()
	{
    $scope.jsonbody.user_id=$scope.user.id;
      if($scope.responseOrdersLength!=0)
        {
	users.getUserOrders($scope.jsonbody).then(function(data){
		$scope.responseOrdersLength=data.data.length;
		$scope.userOrders =$.merge($scope.userOrders,data.data);
        $scope.isScrollDisabled=false;
		
	})
		}

	}


    function getAllOrders()
    {
$scope.startSpin();
users.getUserOrders({"user_id":$scope.user.id}).then(function(data){
	if(data.data.length==0)
		$scope.showMessage=true;
	$scope.stopSpin();
    $scope.ExportOrders=cleanArray(data.data);


});

    }
   
	function cleanArray(usrOrders)
    {
        let temp=[];
        for(var i=0; i<usrOrders.length; i++){
            let obj = {'Order Number':usrOrders[i].orderInfo.order_number,'Total Price':usrOrders[i].orderInfo.total_price,'Shipping Charge':usrOrders[i].orderInfo.shipping_charge,'Total Discount Price':usrOrders[i].orderInfo.total_discount_price,'Status':usrOrders[i].orderInfo.status,'Created':(usrOrders[i].orderInfo.created_at)?($filter('date')(usrOrders[i].orderInfo.created_at, "dd/MM/yyyy")):''};
            temp.push(obj);
        }
        
        return temp;
    }

    $scope.onBackClick = function()
	{
		$window.history.back();
	}
	getUser();

    $scope.Export=function()
    {
    	userorders.exportPDF({"user_id":$scope.user.id}).then(function(data){
         var link = document.createElement('a');
         link.href = 'export/exported.pdf';
         link.download =$scope.user.first_name+'-'+$scope.user.last_name+'_AllOrders.pdf';
         link.dispatchEvent(new MouseEvent('click'));
         console.log(data);

    	});
      

    }

     $scope.ExportOrder=function(order,e)
    {
       e.preventDefault();
       e.stopPropagation();
    	userorders.exportPDF({"order_id":order.orderInfo.id}).then(function(data){
         var link = document.createElement('a');
         link.href = 'export/exported.pdf';
         link.download =order.orderInfo.order_number+'.pdf';
         link.dispatchEvent(new MouseEvent('click'));
         console.log(data);

    	})
      

    }


$scope.startSpin = function() {
      if (!$scope.spinneractive) {
      
        usSpinnerService.spin('spinner-1');
        	$scope.spinneractive = true;
       
      }
    };

    $scope.stopSpin = function() {
      if ($scope.spinneractive) {
      	 usSpinnerService.stop('spinner-1');
         $scope.spinneractive = false;
      }
    };
    $scope.spinneractive = false;

 


})
