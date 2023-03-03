'use strict';

angular.module('pulianiBookStoreAdminApp')
  .controller('NewsModalCtrl', function ($scope, $uibModalInstance, toaster, newsData, type, mynews) {
    $scope.close = function(){
      $uibModalInstance.dismiss('');
    }

    $scope.news = newsData;

    $scope.saveNews = function(){
      let body={};
      body = $scope.news;
      if(type === 'add'){
        mynews.saveNews(body).then(function(data){
            toaster.pop('success','News added successfully');
            $uibModalInstance.dismiss(data);
        });
      }
      if(type === 'edit'){
        let body = {};
        body.news_id = $scope.news.id;
        body.details = $scope.news;
        mynews.updateNews(body).then(function(data){
          toaster.pop('success','News updated successfully');
          $uibModalInstance.dismiss(data);
        });
      }
    }

    $scope.deleteNews = function(response){
      var body = {};
      body.news_id = newsData.id;
        if(response){
          mynews.deleteNews(body).then(function(data){
              toaster.pop('success','news deleted successfully');
              $uibModalInstance.dismiss(data);
          });
        }
        else{
          $uibModalInstance.dismiss();
        }
    }

  });
