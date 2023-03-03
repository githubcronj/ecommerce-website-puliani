'use strict';

angular.module('pulianiBookStoreAdminApp')
    .controller('BulkUploadCtrl', function($scope, $state, $http, $filter,$uibModal, $q, myproducts, Products,PrductObject_CONFIG, fileupload, productEdit, bulkupload) {
        
        $scope.productCSVObject = PrductObject_CONFIG.productObject;
        $scope.BatchCount = Products;
        $scope.imageFiles = [];
        var relativePath = "";
        $scope.folderPathOld = "";
        $scope.folderNameOld = "";
        $scope.folderPathNew = "";
        $scope.folderNameNew = "";
        $scope.noOfFolders = 0;
        $scope.noOfFiles = 0;
        $scope.csvFile = [];
        $scope.folderFileMapping = [];
        $scope.matchedFolders = [];
        $scope.succesfullyUploadedProducts = 0;
        $scope.failedProducts = 0;
        $scope.warning = 0;
        $scope.batch = -1;
        $scope.csvfilename = undefined;
        $scope.selectedImageFolder = undefined;
        $scope.isvalidcsv;
        $scope.AllProducts = [];
        $scope.productDBObjectStructure = {
            images: [],
            sku: undefined,
            name: undefined,
            short_description: undefined,
            long_description: undefined,
            orignal_price: undefined,
            discount_price: undefined,
            units_in_stock: undefined,
            attribute: {
                author: undefined,
                publicationName: undefined,
                edition: undefined,
                year: undefined,
                binding: undefined,
                language: undefined,
                isbn: undefined
            }

        }

        $scope.logEntity =  [];
        
        $scope.createProductObject = function(rawObject) {
            var productDBObject = {
                images: [],
                attribute: {}
            };
            var imageDirectory = '';
            for (var key in $scope.productCSVObject) {
                if ($scope.productCSVObject[key] in $scope.productDBObjectStructure) {
                    productDBObject[$scope.productCSVObject[key]] = rawObject[key];
                } else {
                    productDBObject.attribute[$scope.productCSVObject[key]] = rawObject[key];
                }
            }
            imageDirectory = rawObject['Img Dir'];
            return { productDBObject: productDBObject, imageDirectory: imageDirectory };
        }

        $scope.processFiles = function(files) {

            $scope.selectedImageFolder = true;
            angular.forEach(files, function(flowFile, i) {
                $scope.imageFiles.push(flowFile.file);
            });
            
            $scope.noOfFiles = $scope.imageFiles.length;
            if($scope.csvfilename){
                $scope.createFileFolderMapping();
            }

        };

        $scope.getFileDetails = function(csvfile){

            $scope.fileselected = true;
            $scope.csvfilename = csvfile.files[0].name;
            if($scope.selectedImageFolder){
              $scope.createFileFolderMapping();
            }
        }

        var removeDoubleQuotesFromString = function(){
            return $scope.csvfile;
        }

        $scope.validateCsv = function(data){
            console.log("casv data->", data);
            $scope.isvalidcsv = isCsvFileValid(data);
            if(!$scope.isvalidcsv){
                $scope.csvFile = undefined;
            }else{
                // $scope.csvFile = removeDoubleQuotesFromString();
            }
        }

        function isCsvFileValid(data){

            if(data.length>0){
                for(var key in data[0]){
                    if($scope.productCSVObject[key]){

                    }else{
                        if(key!='Categories' && key!='Img Dir'){
                            return false;
                        }
                    }
                }

                var newObject = {};
                for(var key in data){
                    for(var subkey in data[key]){
                        if(data[key][subkey]){
                            data[key][subkey] = data[key][subkey].replace(/(^"|")/g,'');
                        }
                    }
                }
                $scope.csvFile = data;
                return true;
            }
            return false;
        }

        $scope.testedBulk = false;

        $scope.testBulkUpload = function(){
            
            $scope.bookhistory = {};
            var totalProducts = [];
            
            var bookName = getBookSuggestions()

                .then(function(success){
               
                for(var index in success){

                    var product = {
                        name:$scope.csvFile[index]['Product Name'],
                        similar : success[index].data,
                        categories:undefined,
                        noOfImages:0
                    }

                    totalProducts.push(product);
                    

                }

                var categoryNames = getCategoryName();

                
                getCategoryIDs(categoryNames)

                    .then(function(data){

                        for(var csv in $scope.csvFile){
                            
                            if(totalProducts[csv]){

                                 totalProducts[csv].categories = getCategory($scope.csvFile[csv]);
                            }

                            if($scope.folderFileMapping[$scope.csvFile[csv]['Img Dir']]){

                                totalProducts[csv].noOfImages = $scope.folderFileMapping[$scope.csvFile[csv]['Img Dir']].images.length;
                            }

                             
                        }

                        $scope.productsToUpload = totalProducts;
                        $scope.testedBulk = true;
                    });

                   
            
            });
           
             

        }
        $scope.uploadProducts = false;
        $scope.next = function(){

            $scope.uploadProducts = true;
        }
        
        $scope.redirectTo = function(productlist){

            $state.go(productlist,{pageno:1,attribute:'id',direction:'DESC'});
        }

        function keysrt(key,desc) {
            
            return function(a,b){
                return desc ? ~~(a[key] < b[key]) : ~~(a[key] > b[key]);
             }
        }

        $scope.createFileFolderMapping = function() {
            $scope.folderFileMapping = {};
            angular.forEach($scope.imageFiles, function(file, i) {

                var directoryRoot = file.webkitRelativePath.split("/");
                var directoryName = directoryRoot[directoryRoot.length - 2];
                var images = [];

                if ($scope.folderFileMapping[directoryName] && $scope.folderFileMapping[directoryName].images) {
                    images = $scope.folderFileMapping[directoryName].images;
                }

                images.push(file);

                images.sort(keysrt('name'));
                $scope.folderFileMapping[directoryName] = {
                    images: images
                }

            });
            console.log("$scope.folderFileMapping-->", $scope.folderFileMapping);
            $scope.noOfFolders = Object.keys($scope.folderFileMapping).length;
            $scope.showAllMatchingProducts();
        }

        function createFormData(files) {
            var data = new FormData();
            for (var i in files) {
                data.append("singleProductImages", files[i]);
            }
            return data;
        }
        function isCoverImage(imageArray,coverImageName){
           
            var splittedUrlArray = imageArray.split('/');
            var filenameFromS3 = splittedUrlArray[splittedUrlArray.length-1];
            var removing_underscore_Array =  filenameFromS3.split('_');
            var resultName = "";

            for(var i=0;i<removing_underscore_Array.length-1;i++){
                if(i>0){resultName = resultName.concat('_');}
                resultName = resultName.concat(removing_underscore_Array[i]); 
            }

            var extention = removing_underscore_Array[removing_underscore_Array.length-1].split('.');
            resultName = resultName.concat('.');
            resultName = resultName.concat(extention[extention.length-1]);
            if(coverImageName == resultName){
                return true;
            }

            else{
                return false;
            }

        }
        function formImageObject(imageArray,index) {
           
            var foldername = JSON.parse(JSON.stringify($scope.csvFile[index]['Img Dir']));
            var coverImageName = $scope.folderFileMapping[foldername].images[0].name;
            
            var images = [];
            var sortorder = 1;
            var currentIndex = undefined;
            var flag =true;
            for (var key in imageArray) {
                var temp = {};
                temp.type = isCoverImage(imageArray[key],coverImageName)? 'cover' : 'detailed';
                if(flag){
                    if(isCoverImage(imageArray[key],coverImageName)){
                        currentIndex = true;
                        temp.sort_order = 0;
                        flag = false;
                    }
                }
               
                if(currentIndex){
                    if(isCoverImage(imageArray[key],coverImageName) === false){
                        temp.sort_order = key;
                    }
                }
                else{
                    temp.sort_order + 1;
                }

                temp.url = imageArray[key];
                temp.active = true;
                images.push(temp);
            }
            return images;
        }


     
        function formProductBody(index,images){
            var body = {product:{}};
            var response = $scope.createProductObject($scope.csvFile[index]);
            var category = getCategory($scope.csvFile[index]);
            var categoryId = [];
            for(var i in category){
                categoryId.push(category[i].id);
            }
            body.category = categoryId;
            body.product = response.productDBObject;
            body.product.sku = generateUUID();
            body.product.images = [];
            return body;

        }

        function validateProduct(product){
            var mapObj = {
                'units_in_stock': 'Units in Stock',
                'name':'Product Name'
            }
            for(var key in product.product){
                if((key === 'units_in_stock' || key === 'name') && (product.product[key] === undefined || product.product[key] === '')){
                    return {
                    
                        flag:false,
                        message:mapObj[key] + " is not present in csv"
                    }
                                        }
                if(product.category && product.category.length == 0){
                    return {
                    
                        flag:false,
                        message:"Category is not present in csv"
                    }
                }
            }
            return {
                flag:true
            }
        }

        $scope.callCreateProductAPIInLoop = function(){
            $scope.showOverallSpinner = true;
            $scope.csvlength = $scope.csvFile.length-1;
            var ii = 0;
            $scope.totalProducts = $scope.csvFile.length-1;
            executeProductsInBatches();
              
        }

        function ExecuteSingleBatch(){
            var deferred = $q.defer();
            var arrayOfPromises = [];
            $scope.batch =$scope.batch + 1;
            var csvlenghtAtfunctionCall = $scope.csvlength;
            for(var i=(($scope.csvFile.length-1) - csvlenghtAtfunctionCall) ;i< (($scope.csvFile.length-1) - csvlenghtAtfunctionCall + $scope.BatchCount) && ($scope.csvlength>0); i++,$scope.csvlength--){
                var validation = validateProduct(formProductBody(i));
                $scope.AllProducts[i] = {};
                $scope.AllProducts[i].inProgress = true;

                if ($scope.csvFile && $scope.csvFile[i] && $scope.csvFile[i]['Img Dir']) {
                        
                        var foldername = JSON.parse(JSON.stringify($scope.csvFile[i]['Img Dir']));
                        if(validation.flag){
                            if($scope.folderFileMapping[foldername] && $scope.folderFileMapping[foldername].images.length > 0){
                                    var imageData = createFormData($scope.folderFileMapping[foldername].images);
                                    var promise =  createProductWithImages(i,imageData);
                                    arrayOfPromises.push(promise);

                           }else{
                                  $scope.warning++;
                                  $scope.AllProducts[i].message = 'We have uploaded product BUT';
                                  $scope.AllProducts[i].title = formProductBody(i).product.name;
                                  $scope.AllProducts[i].warning = true;
                                  $scope.AllProducts[i].noOfImages = "NO";
                                  var promise = createProductWithoutImages(i);
                                  arrayOfPromises.push(promise);
                           }
                        }
                        else{
                                  $scope.failedProducts++;
                                  $scope.AllProducts[i].message = validation.message;
                                  $scope.AllProducts[i].title = formProductBody(i).product.name;
                                  $scope.AllProducts[i].status = false;
                                  $scope.AllProducts[i].inProgress = false;
                        }
                }
                
                else{
                     $scope.warning++;
                     $scope.AllProducts[i].message = 'We have uploaded product BUT';
                     $scope.AllProducts[i].title = formProductBody(i).product.name;
                     $scope.AllProducts[i].warning = true;
                     $scope.AllProducts[i].noOfImages = "NO";
                     var promise = createProductWithoutImages(i);
                     arrayOfPromises.push(promise);
                }           
            }
            $q.all(arrayOfPromises).then(function(success){
                    deferred.resolve(success);
            },function(error){
                    deferred.reject(error);
            });
            
            return deferred.promise; 
        }
        function executeProductsInBatches(batch){
   
            ExecuteSingleBatch().then(function(success){
                if($scope.csvlength>0){
                    executeProductsInBatches();
                }
                else{
                    initialiseCSVFileAndImages();
                }

            },function(error){

            });
        }
        function createProductWithoutImages(temporaryIndex){
             var body = formProductBody(temporaryIndex);
             return productEdit.createProduct(body).then(function(productData){
                $scope.AllProducts[temporaryIndex].status = true;
                $scope.AllProducts[temporaryIndex].inProgress = false;
                  return productData;
             },function(error){
                $scope.failedProducts++;
                $scope.AllProducts[temporaryIndex].status = false;
                $scope.AllProducts[temporaryIndex].inProgress = false;
                return error;
             })
        }

        function createProductWithImages(temporaryIndex,imageData){

            return fileupload.uploadFiles(imageData)
                                        
                        .then(function(result) {
                                           
                            var body = formProductBody(temporaryIndex,imageData);
                            body.product.images = formImageObject(result.data,temporaryIndex);
                            $scope.AllProducts[temporaryIndex].title = body.product.name;
                             
                            return productEdit.createProduct(body)
                                
                                .then(function(productData){
                                   
                                   if($scope.bookhistory[body.product.name]){
                                    
                                        $scope.AllProducts[temporaryIndex].warning = true;
                                        $scope.AllProducts[temporaryIndex].status = true;
                                        $scope.AllProducts[temporaryIndex].inProgress = false;
                                        $scope.AllProducts[temporaryIndex].message = "Product is successfully updated but we found This product name is allready present in Databse. You can still edit records";
                                        $scope.AllProducts[temporaryIndex].noOfImages = result.data.length;
                                        $scope.warning++;
                                    
                                    }else{
                                        
                                        $scope.AllProducts[temporaryIndex].status = true;
                                        $scope.AllProducts[temporaryIndex].inProgress = false;
                                        $scope.AllProducts[temporaryIndex].message = "You have successfully uploaded product";
                                        $scope.AllProducts[temporaryIndex].noOfImages = result.data.length;
                                        $scope.succesfullyUploadedProducts++;
                                    }
                                    return productData;

                        })
                        
                        .catch(function(error){
                            console.log("error-->",error);
                            $scope.AllProducts[temporaryIndex].status = false;
                            $scope.AllProducts[temporaryIndex].inProgress = false;
                            $scope.AllProducts[temporaryIndex].message = "failed to upload product";
                            $scope.failedProducts++;
                            return error;
                        });

                    });
        }

        function initialiseCSVFileAndImages(){
            
            $scope.csvFile = undefined;
            $scope.csvlength = undefined;
            $scope.folderFileMapping = undefined;
            $scope.uploadComplete = true;
        }

        var getCategoryData = function(csvFiles){

              var categoryName = [];
             if(csvFiles.Categories){
                var categoryStringWithDoubleQuote = csvFiles.Categories.replace(/(^"|")/g,'');
                var categoryNameArrayFromSingleProduct = [];
                categoryNameArrayFromSingleProduct = categoryStringWithDoubleQuote.split(',');
                categoryName = categoryName.concat(categoryNameArrayFromSingleProduct);
            }
            var tempArray = [];
            for(var key in categoryName){
              tempArray.push($scope.CategoryNameToIDMapping[categoryName[key]]);
                   
            }
            return tempArray;
        }

        function getCategory(csvFiles){
             var categoryName = [];
             if(csvFiles.Categories){
                var categoryStringWithDoubleQuote = csvFiles.Categories.replace(/(^"|")/g,'');
                var categoryNameArrayFromSingleProduct = [];
                categoryNameArrayFromSingleProduct = categoryStringWithDoubleQuote.split(',');
                categoryName = categoryName.concat(categoryNameArrayFromSingleProduct);
            }
            var tempArray = [];
            for(var key in categoryName){
              tempArray.push($scope.CategoryNameToIDMapping[categoryName[key]]);
                   
            }
            return tempArray;
        }

        function getCategoryName(){
            var categoryName = [];
            
            for(var key in $scope.csvFile){
            
                 if($scope.csvFile[key].Categories){
                    var categoryStringWithDoubleQuote = $scope.csvFile[key].Categories.replace(/(^"|")/g,'');
                    var categoryNameArrayFromSingleProduct = [];
                    categoryNameArrayFromSingleProduct = categoryStringWithDoubleQuote.split(',');
                    categoryName = categoryName.concat(categoryNameArrayFromSingleProduct);
                }
            }
            return categoryName;
        }

        function formObjectStrucureOfCategory(data){
            
            var obj = {};
            
            for(var key in data){
                obj[data[key].name] = {
                    id:data[key].id,
                    parent:data[key].catTree,
                    name:data[key].name
                }
            }
            
            return obj;
        }

        function getCategoryIDs(data){

            return bulkupload.getCategoryIDs({categories:data})

                .then(function(data){
                
                    $scope.CategoryNameToIDMapping = formObjectStrucureOfCategory(data);
                    return data;

                });
        }

        
     
        $scope.displayMapping = function() {
            
           $scope.removeTestReport = true;
            $scope.callCreateProductAPIInLoop();
         
        }
        function getBookSuggestions(){
            var deferred = $q.defer();
            var arrayOfBookName = [];
            var arrayOfPromises = [];
            for(var key = 0; key < $scope.csvFile.length-1;key++){
                arrayOfBookName.push($scope.csvFile[key]['Product Name']);
            }

            for(var key = 0;key < arrayOfBookName.length; key++){
                var promise = productEdit.getProductNameAutoSuggest(arrayOfBookName[key]);
                arrayOfPromises.push(promise);
            }

            $q.all(arrayOfPromises)

                .then(function(success){
                    deferred.resolve(success);
                })

                .catch(function(error){
                    deferred.reject(error);
                });

            return deferred.promise;
        }
        $scope.showAllMatchingProducts = function() {
            $scope.Imagefolders = {};
            var count = 0;
            for (var key in $scope.csvFile) {
                if ($scope.csvFile[key]['Img Dir']) {
                    var foldername = JSON.parse(JSON.stringify($scope.csvFile[key]['Img Dir']));
                    $scope.Imagefolders[foldername] = true;
                }

            }
            for (var key in $scope.folderFileMapping) {
                if ($scope.Imagefolders[key]) {
                    count++;
                }
            }

            $scope.foundFoldersFromCsv = count;
            $scope.foundRecordsInCsv = $scope.csvFile.length;
            $scope.showInformation = true;
        }

        $scope.showProductDetail = function(productDetails, index){
            $scope.currentProduct = index;
        }
        $scope.hideProductDetails = function(){
            $scope.currentProduct = undefined;
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
        $scope.showCsvFileFormat = function(){
              var modalInstance1 = $uibModal.open({
              animation: true,
              templateUrl: 'csvformat.html',
              controller: 'csvFormatCtrl',
              size: 'lg'    

             });
             modalInstance1.result.then(function (data) {
                }, function (data) {
             });
        }

        $scope.showProductDetails = function(id){

            myproducts.getProductDetails(id)
                .then(function(data){
                    openModel(data.data);
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


    $scope.confirmUpload = function(){

        

        var confirmUpload = $uibModal.open({
            animation: true,
            templateUrl: 'confirmupload.html',
            controller: 'confirmUploadCtrl',
            size: 'lg',
            resolve : {
                info: function() {
                    return $scope.productsToUpload;
                },
            }

        });

        confirmUpload.result
            .then(function (data) {
                $scope.displayMapping();
             })

            .catch(function (data) {
                
            });
        }
    
});
