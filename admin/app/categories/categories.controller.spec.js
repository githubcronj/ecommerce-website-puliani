'use strict';

describe('Controller: CategoriesCtrl', function () {

  // load the controller's module
  beforeEach(module('pulianiBookStoreApp'));

  var CategoriesCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CategoriesCtrl = $controller('CategoriesCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    1.should.equal(1);
  });
});
