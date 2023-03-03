'use strict';

describe('Controller: OrderviewCtrl', function () {

  // load the controller's module
  beforeEach(module('pulianiBookStoreAdminApp'));

  var OrderviewCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    OrderviewCtrl = $controller('OrderviewCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
