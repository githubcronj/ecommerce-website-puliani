'use strict';

describe('Component: BulkorderComponent', function () {

  // load the controller's module
  beforeEach(module('pulianiBookStoreApp'));

  var BulkorderComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    BulkorderComponent = $componentController('BulkorderComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    1.should.equal(1);
  });
});
