'use strict';

describe('Controller: PersonalinfoCtrl', function () {

  // load the controller's module
  beforeEach(module('pulianiBookStoreApp'));

  var PersonalinfoCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PersonalinfoCtrl = $controller('PersonalinfoCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    1.should.equal(1);
  });
});
