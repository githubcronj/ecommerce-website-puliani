'use strict';

angular.module('pulianiBookStoreApp')
  .filter('restrictText', function () {
    
    return function(text, letters){

   		if(text.length > letters){
   			text = text.slice(0,letters);	
   			text+= '...';
   		}
   		
    	return text;
    }
   
  });
