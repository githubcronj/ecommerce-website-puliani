'use strict';

describe('Controller: MyordersCtrl', function () {

  // load the controller's module
  beforeEach(module('pulianiBookStoreApp'));

  var MyordersCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MyordersCtrl = $controller('MyordersCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    1.should.equal(1);
  });
});
