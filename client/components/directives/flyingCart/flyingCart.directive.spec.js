'use strict';

describe('Directive: flyingCart', function () {

  // load the directive's module
  beforeEach(module('pulianiBookStoreApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<flying-cart></flying-cart>');
    element = $compile(element)(scope);
    element.text().should.equal('this is the flyingCart directive');
  }));
});
