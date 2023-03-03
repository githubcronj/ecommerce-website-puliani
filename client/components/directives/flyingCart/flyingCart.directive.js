'use strict';
angular.module('pulianiBookStoreApp')
  .directive('flyingCart', function () {
	function link(scope, element, attributes) {
    element.on('click', function(event){
      debugger;
      if(scope.defaultquantity && scope.defaultquantity<=parseInt(scope.unitsinstock)
        ||(!scope.defaultquantity && !scope.unitsinstock))
      {
      //alert(scope.isfromlanding);
      
      var cartElem = angular.element(document.getElementsByClassName("shopping-cart"));
      //console.log("bounds",cartElem.offset());
      var offsetTopCart = cartElem.offset().top;
      var offsetLeftCart = cartElem.offset().left;
      var widthCart = cartElem.prop('offsetWidth');
      var heightCart = cartElem.prop('offsetHeight');
	  //console.log("offsetTopCart:"+offsetTopCart+";offsetLeftCart:"+offsetLeftCart+";widthCart:"+widthCart+";heightCart"+heightCart);
      //var imgElem = angular.element(event.target.parentNode.parentNode.parentNode.childNodes[3].childNodes[1].childNodes[2].childNodes[2].childNodes[1]);
      var imgElem = angular.element(document.getElementById("bookTplImg_"+scope.imgid));
	  //console.log("ELEM",angular.element(event.target.parentNode.parentNode.parentNode.childNodes[3].childNodes[1].childNodes[2].childNodes[2].childNodes[1]));
      if(scope.isfromlanding)
      {
       var posPar = angular.element(document.getElementById("parentElm_"+scope.imgid));
      $('#flyingcontainer').css({ 'top': posPar.offset().top,'left':posPar.offset().left, width: '150px', height: '150px' });
      var parentElem = angular.element(document.getElementById("flyingcontainer"));
      }
      else
      var parentElem = angular.element(document.getElementById("parentElm_"+scope.imgid));
		console.log("parentElem",parentElem);
      var offsetLeft = imgElem.prop("offsetLeft");
      var offsetTop = imgElem.prop("offsetTop");
      var imgSrc = imgElem.prop("currentSrc");
      console.log(offsetLeft + ' ' + offsetTop + ' ' + imgSrc);
	  console.log(imgElem.offset().top+' '+imgElem.offset().left);
      var imgClone = angular.element('<img src="' + imgSrc + '"/>');
      imgClone.css({
        'height': '150px',
        'position': 'absolute',
        'top': offsetTop + 'px',
        'left': offsetLeft + 'px',
        'opacity': 0.5,
		'overflow': 'visible',
		'zIndex': 9999
      });
      imgClone.addClass('itemaddedanimate');
	console.log("calcPix",offsetLeftCart-imgElem.offset().left);
      parentElem.append(imgClone);
      setTimeout(function () {
        imgClone.css({
			'height': '75px',
			'top': (offsetTopCart-imgElem.offset().top + heightCart/2)+'px',
			'left': (offsetLeftCart-imgElem.offset().left + widthCart/2)+'px',
			'opacity': 0.5, 
			'overflow': 'visible',
			'zIndex': 9999
        });
      }, 500);
      setTimeout(function () {
        imgClone.css({
          'height': 0,
          'opacity': 0.5,
		  'overflow': 'visible',
		  'zIndex': 9999
          
        });
        cartElem.addClass('shakeit');
      }, 1000);
      setTimeout(function () {
        cartElem.removeClass('shakeit');
        imgClone.remove();
		  
		if(scope.isfromlanding)
		$('#flyingcontainer').css({ width: '1px', height: '1px' });
		  
      }, 1500);
    }
    });
  
  };
	
    return {
      template: '',
      restrict: 'EA',
      link: link,
	  scope: { 
        imgid : '=',
        isfromlanding : '=',
        defaultquantity:'=',
        unitsinstock:'='
          
      }
    };
  });
