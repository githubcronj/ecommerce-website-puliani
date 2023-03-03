'use strict';

angular.module('pulianiBookStoreAdminApp')
  .controller('userModalCtrl', function ($scope,Global,$filter, $uibModalInstance, user, users, from) {

	$scope.user = user;
	$scope.currencyType = Global.CURRENCY;
	$scope.close = function () {
		$uibModalInstance.close();
	};

	
   function getUserOrders()
	{
	users.getUserOrders({"user_id":user.id}).then(function(data){
		$scope.userOrders = data.data;
		$scope.ExportOrders=cleanArray($scope.userOrders);
	})
		
	}

	function cleanArray(usrOrders)
    {
        let temp=[];
        for(var i=0; i<usrOrders.length; i++){
            let obj = {'Order Number':usrOrders[i].orderInfo.order_number,'Total Price':usrOrders[i].orderInfo.total_price,'Created':(usrOrders[i].orderInfo.created_at)?($filter('date')(usrOrders[i].orderInfo.created_at, "dd/MM/yyyy")):''};
            temp.push(obj);
        }
        
        return temp;
    }
	
	if(from == "orders")
	getUserOrders();
	
  });
