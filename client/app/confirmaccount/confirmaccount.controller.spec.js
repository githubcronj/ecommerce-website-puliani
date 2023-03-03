'use strict';

describe('Component: ConfirmaccountComponent', function () {

  // load the controller's module
  beforeEach(module('pulianiBookStoreApp'));

  var ConfirmaccountComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    ConfirmaccountComponent = $componentController('ConfirmaccountComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    1.should.equal(1);
  });
});
