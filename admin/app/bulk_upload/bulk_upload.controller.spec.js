'use strict';

describe('Component: BulkUploadComponent', function () {

  // load the controller's module
  beforeEach(module('pulianiBookStoreApp'));

  var BulkUploadComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    BulkUploadComponent = $componentController('BulkUploadComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    1.should.equal(1);
  });
});
