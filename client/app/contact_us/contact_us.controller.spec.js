'use strict';

describe('Component: ContactUsComponent', function () {

  // load the controller's module
  beforeEach(module('pulianiBookStoreApp'));

  var ContactUsComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    ContactUsComponent = $componentController('ContactUsComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    1.should.equal(1);
  });
});
