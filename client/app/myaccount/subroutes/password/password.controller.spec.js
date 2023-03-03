'use strict';

describe('Controller: PasswordCtrl', function () {

  // load the controller's module
  beforeEach(module('pulianiBookStoreApp'));

  var PasswordCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PasswordCtrl = $controller('PasswordCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    1.should.equal(1);
  });
});
