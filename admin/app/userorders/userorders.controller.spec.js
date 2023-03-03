'use strict';

describe('Component: UserordersComponent', function () {

  // load the controller's module
  beforeEach(module('pulianiBookStoreApp'));

  var UserordersComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    UserordersComponent = $componentController('UserordersComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    1.should.equal(1);
  });
});
