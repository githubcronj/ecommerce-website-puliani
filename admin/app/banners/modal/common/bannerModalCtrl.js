'use strict';

angular.module('pulianiBookStoreAdminApp')
  .controller('bannerModalCtrl', function ($scope, $uibModalInstance, toaster, data, $http, banners) {

	$scope.close = function () {
		$uibModalInstance.dismiss();
	}; 
	
	$scope.url =data.url;
   
   
	
	
	
	$scope.getFileDetails = function (e) {
        $scope.files = [];
        $scope.$apply(function () {

            // STORE THE FILE OBJECT IN AN ARRAY.
            for (var i = 0; i < e.files.length; i++) {
                $scope.files.push(e.files[i])
            }
        });
		
		 var oFReader = new FileReader();
		
        oFReader.readAsDataURL($scope.files[0]);

        oFReader.onload = function (oFREvent) {
			  $scope.$apply(function () {
            $scope.ImgPreview = oFREvent.target.result;
			  });
        };
        //console.log("files", $scope.files);
    };

    // NOW UPLOAD THE FILES.
    $scope.saveData = function () {
		
		if(!$scope.sortorder)
		{
			toaster.pop("error","Specify Sort Order");
			return false;
		}
		if(!$scope.files){
			toaster.pop("error","Please Select Image");
			return false;
		}
        $scope.showSpinner = true;
        //FILL FormData WITH FILE DETAILS.
        var data = new FormData();
        

		for (var i in $scope.files) {
		data.append("bannerImages", $scope.files[i]);
		}
        
        // ADD LISTENERS.
		
		$http({
			   url: "/api/banner_images/addBannerImage/"+$scope.sortorder,
			   method: "POST",
			   data: data,
			   transformRequest: angular.identity,
			   headers: { 'Content-Type': undefined }
		   }).then(function (result) {
			   // console.log("result",result);

				$scope.showSpinner = false;
				$uibModalInstance.close();
		   },function(error)
		  {
			$scope.showSpinner = false;
			toaster.pop('error',error.data);
		   })
	
    }
	
	$scope.onConfirmDelete = function()
	{
		let images =[];
		images.push($scope.url);
	    banners.onBannerDelete({images:images,id:data.id}).then(function(data){
		  $uibModalInstance.close();
		},function(error){
			toaster.pop("error",error);																
		})	
	}
	

	
	
  });
