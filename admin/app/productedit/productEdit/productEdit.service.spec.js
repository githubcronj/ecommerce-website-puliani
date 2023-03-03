'use strict';

describe('Service: productEdit', function () {

  // load the service's module
  beforeEach(module('pulianiBookStoreApp'));

  // instantiate service
  var productEdit;
  beforeEach(inject(function (_productEdit_) {
    productEdit = _productEdit_;
  }));

  it('should do something', function () {
    !!productEdit.should.be.true;
  });

});
