'use strict';

describe('Controller: ProducteditCtrl', function () {

  // load the controller's module
  beforeEach(module('pulianiBookStoreAdminApp'));

  var ProducteditCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProducteditCtrl = $controller('ProducteditCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
