'use strict';

describe('Service: productCategory', function () {

  // load the service's module
  beforeEach(module('pulianiBookStoreApp'));

  // instantiate service
  var productCategory;
  beforeEach(inject(function (_productCategory_) {
    productCategory = _productCategory_;
  }));

  it('should do something', function () {
    !!productCategory.should.be.true;
  });

});
