'use strict';

angular.module('pulianiBookStoreApp')
  .controller('MainController', function ($scope, main, productCategory) {

	$scope.jsonbody = {
	"limit": 45 ,
	"offset":0,
	"sortBy":{
		"attribute":"created_at",
		"direction":"DESC"
	}
	};
	
	$scope.BestSellerJson= {
    "limit":45,
    "offset":0
    }
	
   var slides_to_show_scroll = (($(window).width())>1200)?5:(($(window).width())>900)?4:(($(window).width())>600)?3:2;
	$scope.slickConfig = {
    enabled: true,
    autoplay: true,
    draggable: false,
    slidesToShow:slides_to_show_scroll,
    slidesToScroll:slides_to_show_scroll,
    autoplaySpeed: 3000
    };
	
	$scope.IMGslickConfig = {
    enabled: true,
    autoplay: true,
    draggable: true,  
    autoplaySpeed: 3000
    };
	
   
	$scope.isactive = 'tab1';
	$scope.onTabClick = function(tab)
	{
	  $scope.isactive = tab;
	  getProducts();
	}
    
    

	
	function getProducts()
	{
		console.log($scope.isactive);
		$scope.viewLoaded = false;
		if($scope.isactive == 'tab1')
		{
			productCategory.getProducts($scope.jsonbody).then(function(data){
			$scope.Books = data.data;
			$scope.viewLoaded = true;
			console.log($scope.Books);
			});
		}
		else if($scope.isactive == 'tab2')
		{
			productCategory.getBestSellers($scope.BestSellerJson).then(function(data){
			$scope.Books = data.data;
			$scope.viewLoaded = true;
			console.log($scope.Books);
			});
		}
	}
    
    getProducts();
    
    
    function getBannerImages()
    {
        main.getBannerImages().then(function(data){
           // alert(JSON.stringify(data));
		   $scope.slides = data.data;
			});
    }
    
    getBannerImages();
    
    
    function getNews()
    {
        main.getNews().then(function(data){
          // alert(JSON.stringify(data));
		   $scope.testimonals = data.data;
			});  
    }
    
    getNews();
	
  });
