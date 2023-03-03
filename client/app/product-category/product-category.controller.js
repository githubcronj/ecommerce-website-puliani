'use strict';

angular.module('pulianiBookStoreApp')
  .controller('ProductCategoryCtrl', function ($scope, productCategory, $stateParams, $state) {
	  
    $scope.jsonbody = {
	"limit": 12 ,
	"offset":0,
	};
	$scope.sliderConfig =   productCategory.sliderConfig;
	$scope.responseProductsLength=-1;
	
	$scope.isScrollDisabled = true;
	$scope.Books = [];
	$scope.sortOptions = [];
	$scope.categoriestree =[];
	$scope.filter ="";
	$scope.pageType = $stateParams.type;
	$scope.catName = "";

	
		if($scope.pageType == "search")
		{
			$scope.jsonbody.searchString = decodeURIComponent($stateParams.value);
            delete $scope.jsonbody.category;
			getSearchProductCategoryTree(decodeURIComponent($stateParams.value));
			$scope.filter = $stateParams.value;
		}
		else if($scope.pageType == "category")
		{
			$scope.jsonbody.category =[];
			$scope.jsonbody.category.push(parseInt($stateParams.value));
			$scope.catName = $stateParams.name;
			
			if(!$stateParams.filter)
            delete $scope.jsonbody.searchString;
			else
			{
			$scope.filter = $stateParams.filter
		    $scope.jsonbody.searchString = decodeURIComponent($stateParams.filter);
			}
			
			getCategoryProductCategoryTree(parseInt($stateParams.value));
		}
		

	function getSearchProductCategoryTree(str)
	{
		productCategory.getSearchProductCategoryTree(str).then(function(data){
			
		$scope.categoriestree = $.merge( $scope.categoriestree, data.data );
		
		});
	}
	
	function getCategoryProductCategoryTree(id)
	{
		productCategory.getCategoryProductCategoryTree(id).then(function(data){
			
		$scope.categoriestree = $.merge( $scope.categoriestree, data.data );
		
		});
	}

	function getproducts(isFromFilter)
	{
    console.log("json body before fetching products");
    console.log($scope.jsonbody);
        if($scope.responseProductsLength!=0 || isFromFilter)
        {
        productCategory.getProducts($scope.jsonbody).then(function(data){
            $scope.responseProductsLength=data.data.length;
            $scope.Books = $.merge( $scope.Books, data.data )
            $scope.isScrollDisabled = false;
            console.log("products");
            console.log(data.data);
            });
        }
	}

    getproducts(false);	

	function getproductsPriceRange()
	{
	productCategory.getproductsPriceRange($scope.jsonbody).then(function(data){
		$scope.sliderConfig.range.min=(data.data.min_price)?Math.floor(data.data.min_price):0;
		$scope.sliderConfig.range.max=(data.data.max_price)?Math.ceil(data.data.max_price):0;
		$scope.sliderConfig.minPrice=(data.data.min_price)?Math.floor(data.data.min_price):0;
		$scope.sliderConfig.maxPrice=(data.data.max_price)?Math.ceil(data.data.max_price):0;
		});
      console.log("slider config");
      console.log($scope.sliderConfig);
	}

	getproductsPriceRange();

	function getproductsCount()
	{
	productCategory.getproductsCount($scope.jsonbody).then(function(data){
		$scope.totalcount = data.data.full_count;
		});
	}
    
    getproductsCount();

	$scope.myPagingFunction = function()
	{
		$scope.jsonbody.offset += $scope.jsonbody.limit;
		$scope.isScrollDisabled = true;

        //if($scope.totalcount-$scope.jsonbody.offset>0)
        getproducts(false);
        console.log("mypagingfunction");
		console.log($scope.jsonbody);
	}

    $scope.onSliderRelease = function()
    {
        $scope.isScrollDisabled = true;
		$scope.$apply(function () {
			$scope.Books = [];
            $scope.jsonbody.offset = 0;
			$scope.jsonbody.filters={'price':{}};
            $scope.jsonbody.filters.price.lowerPrice =  $scope.sliderConfig.minPrice;
            $scope.jsonbody.filters.price.upperPrice =  $scope.sliderConfig.maxPrice;

            
		});
        
        getproducts(true); //isFromPriceFilter
        getproductsCount()
        console.log("on slider release");
        console.log($scope.jsonbody);
    }
	
	
	
	productCategory.getSortOptions().then(function(data){
	$scope.sortOptions = $.merge( $scope.sortOptions, data.data );
	$scope.optionSelected =$scope.sortOptions[0].value;
	//alert(JSON.stringify($scope.sortOptions));
	});	
		
    $scope.onSortingChange = function()
	{
		$scope.isScrollDisabled = true;
		if($scope.optionSelected.attribute == "default_sorting")
		delete $scope.jsonbody.sortBy;
		else
		$scope.jsonbody.sortBy = $scope.optionSelected;
		$scope.jsonbody.offset = 0;
		$scope.Books = [];
        getproducts(true);
	}
	
	$scope.onCatSearchSubmit = function(searchstring)
	{
	   $state.go('product-category', { type:'category', value:parseInt($stateParams.value) , filter: searchstring});
	}
	
    $scope.onSearchTextClose=function()
    {
  	$state.go('product-category', { type:'category', value:parseInt($stateParams.value) , filter: "",});
    }

    //for percentage restrict for search

      $scope.pressed=function(e)
      {
      
      if((e.keyCode == 53) && e.shiftKey)
      {  
   	e.preventDefault();
   	e.stopPropagation();
      
      }
	}

  });

