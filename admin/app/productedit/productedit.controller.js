'use strict';

angular.module('pulianiBookStoreAdminApp')
  .controller('ProducteditCtrl', function ($scope, $http, $filter, toaster, $state, $uibModal, $location, productEdit, myproducts , fileupload, $timeout) {
     var orderBy = $filter('orderBy');
    $scope.tabs = [
      { title:'data', content:'app/productedit/views/data.html' },
      { title:'image', content:'app/productedit/views/image.html'}
    ];
    $scope.currentTab = 'data';
    $scope.currentOperation = 'create';
    $scope.optionsList = [];
    $scope.data = {
      product : {
        images : [],
        sku:undefined,
        name:undefined,
        short_description:undefined,
        long_description:undefined,
        orignal_price:undefined,
        discount_price:undefined,
        units_in_stock:undefined,
        attribute:{
                  author:undefined,
                  publicationName:undefined,
                  edition:undefined,
                  isbn:undefined
                }

      }
    };

    var urlMapping = {};
    $scope.showSelectedFiles = false;
    $scope.showSpinner = false;
    $scope.showLoadingProduct = false;

    $scope.cover = {
        name: 0
      };

    $scope.category = {};
    if($state.params.id){
        $scope.currentOperation = 'edit';
      myproducts.getProductDetails($state.params.id).then(function(data){
        for(let key in $scope.data.product){
          $scope.data.product[key] = data.data[key];
        }
        //$scope.category.categories = data.data['category'];

        $scope.product_id = data.data.id;
        formSelecteCategoryArray(data.data);
        setDefaultCheckInRadioGroup();
        formImagesBySortOrder();
      });
    }
    $scope.generateSKU = function(){
        $scope.data.product.sku = generateUUID();
    }

    function generateUUID() {
            var d = new Date().getTime();
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = (d + Math.random()*16)%16 | 0;
                d = Math.floor(d/16);
                return (c=='x' ? r : (r&0x3|0x8)).toString(16);
            });
            return uuid;
    }

    function formSelecteCategoryArray(product){
        let arrayOfSelectedCategory = [];
        for(let key in product.category){
          let categoryObj = {};
          categoryObj.id = product.category[key].id;
          categoryObj.name = product.category[key].name;
          arrayOfSelectedCategory.push(categoryObj);
        }
        $scope.category.categories = arrayOfSelectedCategory;
    }
    function setDefaultCheckInRadioGroup(){
      let flag = false;
      for(let index in $scope.data.product.images){
        if($scope.data.product.images[index].type === 'cover'){
          setCoverImageData(index);
          break;
        }
        if($scope.data.product.images[index].type !== 'cover' && index == $scope.data.product.images.length-1){
          flag = true;
        }

      }
      if(flag){
        setCoverImageData(0);
      }
    }

    function formImagesBySortOrder(){
      for(let key in $scope.data.product.images){
          $scope.data.product.images[key].sort_order = parseInt($scope.data.product.images[key].sort_order);
      }
      $scope.data.product.images = orderBy($scope.data.product.images, 'sort_order', false);
      
    }

    function setCoverImageData(index1){
      $scope.cover.name = index1;
      $scope.data.product.images[index1].sort_order = 0;
      $scope.data.product.images[index1].type = 'cover';
      for(let index in $scope.data.product.images){
        if($scope.data.product.images[index].type !== 'cover' && $scope.data.product.images[index].sort_order == 0){
          $scope.data.product.images[index].sort_order = 1;
        }
      }
    }
    function getParentCaegories(searchValue){
        productEdit.getAutoSuggest(searchValue).then(function(data){
          $scope.optionsList = data.data;
        });
    }

    function createUniqueCategoryId (){
        // let categoryIdMapping = {};
        let uniqueCategories = [];

        for(let key in $scope.category.categories){
          uniqueCategories.push($scope.category.categories[key].id);
          //  categoryIdMapping[$scope.category.categories[key].id] = true;
       }
        // for(let key in $scope.category.categories){
        //     categoryIdMapping[$scope.category.categories[key].id] = true;
        // }
        //
        // for(let key in categoryIdMapping){
        //   uniqueCategories.push(key);
        // }
        $scope.data.category = uniqueCategories;
    }


    $scope.renderView = function(key){
        $scope.currentTab = key;
    }

    $scope.OpenCourse = function(event){
      getParentCaegories(event.$$childHead.$$nextSibling.inputValue);
    }

    $scope.onSubmitBookData = function(){
      $scope.currentTab = 'image';
    }

    $scope.isCoverImage = function(index){
        var temp = $scope.data.product.images[index].sort_order;
        for(let key in $scope.data.product.images){
          if($scope.data.product.images[key].type === 'cover'){
              temp = $scope.data.product.images[key].sort_order = temp;
          }
        }
        $scope.data.product.images[index].type = 'cover';
        $scope.data.product.images[index].sort_order = 0;
        $scope.cover.name = index;
        for(let key in $scope.data.product.images){
            if(key != index){
                $scope.data.product.images[key].type = 'detailed';
            }
        }

    }
    function validateData(){
      for(let key in $scope.data.product){
        if(key!= 'images' && key!='attribue' && key!='sku' && key!='short_description' && key!='long_description'){
          if($scope.data.product[key] === undefined || $scope.data.product[key] === ''){
            return false;
          }
        }
        if(key === 'attribute'){
          for(let subkey in $scope.data.product.attribute){
            if($scope.data.product.attribute[subkey] === undefined || $scope.data.product.attribute[subkey] === ''){
              return false;
            }
          }
        }
      }
      return true;
    }

    $scope.navigate = function(key){
      if($scope.isuniqueisbn){
        $scope.currentTab = key;
      }
    }

    $scope.createProduct = function(){
      let areValidEntries = validateData();
      if(areValidEntries){
        createUniqueCategoryId();
        if($scope.currentOperation === 'create'){
            callCreateProductAPI('save');
        }
        else{
          callUpdateProductAPI('edit');
        }
      }
      else{
        toaster.pop('error','please select all fields');
      }
    }

    $scope.createAnotherProduct = function(){
      createUniqueCategoryId();
      if($scope.currentOperation === 'create'){
          callCreateProductAPI('saveAndCreate');
      }
      else{
        callUpdateProductAPI('editAndCreate');
      }
    }
    function initialiseState(){
        $scope.data = {
          product : {
            images : []
          }
        };
        $scope.currentTab = 'data';
        $scope.category = {};
    }
    $scope. View = function(view){
        $scope.currentTab = view;
    }

    $scope.deleteImage = function(image,index){
          $scope.deleteImageIndex = index;
         if($state.params.id){
            OpenConfirmation(image,index);

         }
         else{
            deleteImageLocally(image);
          }
    }

    function createArrayOfAllImages(image){
        let imageArray = [];
        imageArray.push(image.url);
        return imageArray;
    }

    function deleteImageFromS3(images){
      let body = {};
      body.images = images;
      body.product_id = $scope.product_id;
      $scope.showSpinner = true;
       productEdit.deleteImageFromS3(body).then(function(data){
            $scope.showSpinner = false;
            updateImageArray();
            setDefaultCheckInRadioGroup();
        },function(err){
            $scope.showSpinner = false;
        });
    }

    function updateImageArray(){
      let index = $scope.deleteImageIndex;
      let updatedImages = [];
      for(let i in $scope.data.product.images){
          if(i != index){
              updatedImages.push($scope.data.product.images[i]);
          }
      }
      $scope.data.product.images = updatedImages;
    }

    function deleteImageLocally(image){
        productEdit.deleteImage({imageUrl : image.url}).then(function(data){
          let tempImg = [];
          for(let subkey in   $scope.data.product.images){
              if($scope.data.product.images[subkey].url != image.url){
                tempImg.push($scope.data.product.images[subkey]);
              }
          }
          $scope.data.product.images = tempImg;
      });
    }

    function callUpdateProductAPI(action){
       $scope.data.product_id = $scope.product_id;
       productEdit.updateProduct($scope.data).then(function(data){
          toaster.pop('success','product updated successfully');
          if(action === 'editAndCreate'){
              $state.go('index.productedit',{type: 'add',id:null});
              initialiseState();
          }
          else{
            $state.go('index.products',{pageno: $state.params.pageno,attribute:'id',direction:'DESC'});
          }


      },function(err){
        toaster.pop('error','please make sure you have selected unique SKU');
      });
    }

    function callCreateProductAPI (action){
      $scope.showLoadingProduct = true;
      $('body').css('opacity',0.5);
      $scope.data.product.sku = generateUUID();
      productEdit.createProduct($scope.data).then(function(data){
            $('body').css('opacity',1);
            $scope.showLoadingProduct = false;
            toaster.pop('success','product created successfully');
            if(action === 'save'){
              $state.go('index.products',{pageno: 1,attribute:'id',direction:'DESC'});
            }
            else{
              initialiseState();
            }
        },function(err){
          $scope.showLoadingProduct = false;
          $('body').css('opacity',1);
          toaster.pop('error','server respoding error');
        });
    }

    function OpenConfirmation(image,index){
      var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'confirmDeleteImage.html',
          controller: 'confirmDeleteImageCtrl',
          size: 'md',
          resolve : {
            message : function(){
                return 'Are you sure to delete this image';
            }
          }
        });
        modalInstance.result.then(function (data) {

        },function(flag){
            if(flag === 'yes'){
                deleteImageFromS3(createArrayOfAllImages(image));
           
            }
        });
    }

    $scope.getFileDetails = function (e) {
        $scope.showSelectedFiles = true;
        $scope.files = [];
        
        $scope.$apply(function () {
            // STORE THE FILE OBJECT IN AN ARRAY.
            for (var i = 0; i < e.files.length; i++) {
                $scope.files.push(e.files[i])
            }
        });
    };

    function createFormData(){
      var data = new FormData();
      for (var i in $scope.files) {
          data.append("singleProductImages", $scope.files[i]);
      }
      return data;
    }
    // NOW UPLOAD THE FILES.
    $scope.uploadFiles = function () {
        $scope.showSelectedFiles = false;
        $scope.showSpinner = true;
        if($state.params.type === 'add'){
            uploadImageWhileCreatingProduct(createFormData());
        }
        else{
            uploadImageWhileEditingProduct();
        }
        $scope.files = [];
    }

    function uploadImageWhileCreatingProduct(data){
      fileupload.uploadFiles(data).
        then(function (result) {
            $scope.showSpinner = false;
            updateImages(result.data);
        });
    }

    function updateImages(data){
      for(let key in data){
              let temporayImgObj = {};
              urlMapping[data[key]] = true;
              temporayImgObj.url = data[key];
              temporayImgObj.active = true;
              temporayImgObj.type = 'detailed';
              $scope.data.product.images.push(temporayImgObj);

      }
    }
    
    // need some logic
    function uploadImageWhileEditingProduct(){
      var imageData = new FormData();
      for (var i in $scope.files) {
          imageData.append("singleProductImages",$scope.files[i]);
      }
      let obj = {};
      obj.sku = $scope.data.product.sku;
      obj.product_id = $scope.product_id;
      obj.product_name= $scope.data.product.name;
      fileupload.uploadEditedFiles(imageData,obj).then(function (result) {
            $scope.showSpinner = false;
            updateEditedImages(result.data);
        },function(err){
           $scope.showSpinner = false;
           toaster.pop('error','something went wrong');
        });
    }

    function updateEditedImages(images){
        for(let key in images){
              let temporayImgObj = {};
              temporayImgObj.url = images[key].url;
              temporayImgObj.active = true;
              temporayImgObj.type = 'detailed';
              $scope.data.product.images.push(temporayImgObj);

      }
    }
    getParentCaegories('');
    
    
    
    /************************************Name of Product Auto Suggest******************************************/
        $scope.ProductNames = [];
        var timer=false;
        $scope.onProductNameType = function(searchterm)
        {
         if(timer){
             $timeout.cancel(timer);
         }   
         timer= $timeout(function(){
                     productEdit.getProductNameAutoSuggest(searchterm)
                       .then(function(data){
                           $scope.ProductNames = data.data;
                     });
                  },200)
        }

    
    
    
    /************************************Product Blur Event******************************************/   
        
        $scope.showSimilarProducts = false;
    
         $scope.onProductNameBlur = function()
         {
             $scope.showSimilarProducts = ($scope.ProductNames.length>0);                
         }
         
        
       $scope.onCloseClick = function(e)
       {
           e.preventDefault();
           e.stopPropagation();
           $scope.showSimilarProducts = false;
       }
       
       $scope.productOverview = function(id)
       {
           myproducts.getProductDetails(id).then(function(data){
           openModel(data.data);
        });

       }
       
       $scope.checkUniqueISBN = function(){
          productEdit.isUniqueISBN($scope.data.product.attribute.isbn)
            .then(function(success){      
              //console.log("data",success);
              if($scope.currentOperation != 'edit')
                $scope.isuniqueisbn = !success.data.isThere;
              else if((success.data.isThere && $state.params.id == success.data.id) || !success.data.isThere)
               $scope.isuniqueisbn = true;
              else
              $scope.isuniqueisbn = false;   
              
          },function(error){
            console.log("error",error);
            $scope.isuniqueisbn = true;
          });
       }
       
        var openModel = function(product){
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'productDetails.html',
          controller: 'ProductDetailModalCtrl',
          size: 'lg',
          resolve : {
              product: function() {
                return product;
              },
          }
        });
        modalInstance.result.then(function (data) {

        }, function (data) {

        });
      }
    
    
    

  });
