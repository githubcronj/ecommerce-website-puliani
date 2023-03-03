'use strict';

angular.module('pulianiBookStoreAdminApp', [
  'pulianiBookStoreAdminApp.auth',
  'pulianiBookStoreAdminApp.constants',
  'pulianiBookStoreAdminApp.util',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap',
  'validation.match',
  'toaster',
  'ngAnimate',
  'multipleSelect',
  'angularSpinner',
  'flow',
  'ngCsv',
  'infinite-scroll'
 ])

  .config(function($urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .otherwise('/');
      // $locationProvider.html5Mode(true);
  })

  .constant('Global', {CURRENCY:"&#8377;"})
  
  .constant('Products',3)
  
  .constant('PrductObject_CONFIG', {
    productObject:{

       "Product SKU": "sku",
       "Product Name": "name",
       "Short Description": "short_description",
       "Long Description": "long_description",
       "Orignal Price": "orignal_price",
       "Price After Discount": "discount_price",
       "Units in Stock": "units_in_stock",
       
       "Author Name": "author",
       "Publication Name": "publicationName",
       "Edition": "edition",
        "Year": "year",
       "Binding": "binding",
       "Language": "language",
       "ISBN": "isbn" 
     }
});
