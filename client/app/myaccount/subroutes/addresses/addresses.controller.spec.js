'use strict';

describe('Controller: AddressesCtrl', function () {

  // load the controller's module
  beforeEach(module('pulianiBookStoreApp'));

  var AddressesCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AddressesCtrl = $controller('AddressesCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    1.should.equal(1);
  });
});
