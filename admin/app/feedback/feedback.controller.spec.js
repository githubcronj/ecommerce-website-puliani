'use strict';

describe('Component: FeedbackComponent', function () {

  // load the controller's module
  beforeEach(module('pulianiBookStoreAdminApp'));

  var FeedbackComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    FeedbackComponent = $componentController('FeedbackComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    1.should.equal(1);
  });
});
