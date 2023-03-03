'use strict';

describe('Controller: AddAddressModalCtrl', function () {

  // load the controller's module
  beforeEach(module('pulianiBookStoreApp'));

  var AddAddressModalCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AddAddressModalCtrl = $controller('AddAddressModalCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    1.should.equal(1);
  });
});
