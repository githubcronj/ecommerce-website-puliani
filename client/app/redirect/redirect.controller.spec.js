'use strict';

describe('Component: RedirectComponent', function () {

  // load the controller's module
  beforeEach(module('pulianiBookStoreApp'));

  var RedirectComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    RedirectComponent = $componentController('RedirectComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    1.should.equal(1);
  });
});
