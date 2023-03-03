'use strict';

angular.module('pulianiBookStoreAdminApp')
    .controller('confirmUploadCtrl', function($uibModalInstance,$scope,info) {
    	var noCategory = 0, noImages = 0;
    	$scope.noOfProducts = info.length;
    	for(let index in info){

    		if(info[index].categories.length == 0){
    			noCategory++;
    		}

    		if(info[index].noOfImages == 0){
    			noImages++;
    		}
    	}
    	$scope.noCategory = noCategory;
    	$scope.noImages = noImages;
    	console.log(noImages,noCategory);
    	
    	$scope.cancel = function(){
    		$uibModalInstance.dismiss();
    	}

        $scope.close = function(upload){

            if(upload){
                $uibModalInstance.close();       
            }else{
                $uibModalInstance.dismiss();
            }
        }
});     