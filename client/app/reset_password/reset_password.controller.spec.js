'use strict';

describe('Component: ResetPasswordComponent', function () {

  // load the controller's module
  beforeEach(module('pulianiBookStoreApp'));

  var ResetPasswordComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    ResetPasswordComponent = $componentController('ResetPasswordComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    1.should.equal(1);
  });
});
