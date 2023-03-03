'use strict';

describe('Controller: MycartCtrl', function () {

  // load the controller's module
  beforeEach(module('pulianiBookStoreApp'));

  var MycartCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MycartCtrl = $controller('MycartCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    1.should.equal(1);
  });
});
