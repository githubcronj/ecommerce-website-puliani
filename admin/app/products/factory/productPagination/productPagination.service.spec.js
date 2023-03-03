'use strict';

describe('Service: productPagination', function () {

  // load the service's module
  beforeEach(module('pulianiBookStoreApp'));

  // instantiate service
  var productPagination;
  beforeEach(inject(function (_productPagination_) {
    productPagination = _productPagination_;
  }));

  it('should do something', function () {
    !!productPagination.should.be.true;
  });

});
