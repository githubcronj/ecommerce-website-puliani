'use strict';

describe('Controller: ModalInstanceCtrl', function () {

  // load the controller's module
  beforeEach(module('pulianiBookStoreApp'));

  var ModalInstanceCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ModalInstanceCtrl = $controller('ModalInstanceCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    1.should.equal(1);
  });
});
