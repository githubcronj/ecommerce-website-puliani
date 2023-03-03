'use strict';

describe('Component: BulkenquiryComponent', function () {

  // load the controller's module
  beforeEach(module('pulianiBookStoreAdminApp'));

  var BulkenquiryComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    BulkenquiryComponent = $componentController('BulkenquiryComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    1.should.equal(1);
  });
});
