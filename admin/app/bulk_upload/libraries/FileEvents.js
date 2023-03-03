

// app.controller('FileEvents', ['$scope','$http','$filter', function($scope,$http,$filter) {
//     $scope.imageFiles=[];
//     var relativePath="";
//     $scope.folderPathOld="";
//     $scope.folderNameOld="";
//     $scope.folderPathNew="";
//     $scope.folderNameNew="";
//     $scope.noOfFolders=0;
//     $scope.noOfFiles=0;
//     $scope.csvFile=[];
//     $scope.folderFileMapping=[];
// 	$scope.matchedFolders=[];
	
	

//     $scope.processFiles = function(files){
//         angular.forEach(files, function(flowFile, i){
//             $scope.imageFiles.push(flowFile.file);
//         });
//         $scope.noOfFiles=$scope.imageFiles.length;
//         $scope.createFileFolderMapping();
       
//     };
  
//     $scope.createFileFolderMapping=function()
//     {
//         angular.forEach($scope.imageFiles, function(file, i){ 
//             var directoryRoot = file.webkitRelativePath.split("/");
//             var directoryName = directoryRoot[directoryRoot.length-2];
//             $scope.existingFolderName=$filter('filter')($scope.folderFileMapping,{folderName:directoryName})[0];
//             if($scope.existingFolderName!=null)
//             {
//                 angular.forEach($scope.folderFileMapping,function(image)
//                 {
//                     if(image.folderName==$scope.existingFolderName.folderName)
//                     {
//                         image.images.push(file);
//                     }
//                 });
//             }     
//             else
//             {
//                 $scope.folderFileMapping.push({
//                     folderName:directoryName,
//                     images:[file]
//                 });
//             }
//         });
		
// 		$scope.noOfFolders=$scope.folderFileMapping.length;
//     }
  
  
//     $scope.displayMapping=function()
//     {
//         angular.forEach($scope.csvFile,function(csvfile,i){
//             $scope.imgdirname=csvfile['Img Dir'];
//             if($scope.imgdirname)
// 			{
// 			//$scope.matchedCSVProducts.push(csvfile);
// 			console.log($scope.matchedFolders.push($filter('filter')($scope.folderFileMapping, {folderName: $scope.imgdirname.replace(/\r/g, '') },true)[0]));
//             //console.log($scope.folderFileMapping.filter((map) => map.folderName === $scope.imgdirname.replace(/\r/g, ''))[0]);
//              }
// 		});
 
 
//     }
  

    
		
		
		

// }]);


