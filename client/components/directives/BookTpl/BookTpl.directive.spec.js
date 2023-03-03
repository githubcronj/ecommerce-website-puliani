'use strict';

describe('Directive: BookTpl', function () {

  // load the directive's module and view
  beforeEach(module('pulianiBookStoreApp'));
  beforeEach(module('components/directives/BookTpl/BookTpl.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<-book-tpl></-book-tpl>');
    element = $compile(element)(scope);
    scope.$apply();
    element.text().should.equal('this is the BookTpl directive');
  }));
});
