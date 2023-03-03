'use strict';

describe('Controller: MywishlistCtrl', function () {

  // load the controller's module
  beforeEach(module('pulianiBookStoreApp'));

  var MywishlistCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MywishlistCtrl = $controller('MywishlistCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    1.should.equal(1);
  });
});
