'use strict';

angular.module('pulianiBookStoreAdminApp')
  .factory('feedback', function (common) {
 
	var factory = {};
	
		factory.getFeedbacks = function(body)
		{
			let Feedbacks = common.callApi('POST','/api/feedbacks/getAllFeedback' ,'',{'Content-Type':'application/json'},body);
			return Feedbacks;
		}
	
		
	return factory;
	
  });