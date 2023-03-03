'use strict';

describe('Directive: catTree', function () {

  // load the directive's module and view
  beforeEach(module('pulianiBookStoreApp'));
  beforeEach(module('components/directives/catTree/catTree.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<cat-tree></cat-tree>');
    element = $compile(element)(scope);
    scope.$apply();
    element.text().should.equal('this is the catTree directive');
  }));
});
