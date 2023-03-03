'use strict';

describe('Controller: ProductCategoryCtrl', function () {

  // load the controller's module
  beforeEach(module('pulianiBookStoreApp'));

  var ProductCategoryCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProductCategoryCtrl = $controller('ProductCategoryCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    1.should.equal(1);
  });
});
