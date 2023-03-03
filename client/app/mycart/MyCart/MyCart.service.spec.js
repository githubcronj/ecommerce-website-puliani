'use strict';

describe('Service: MyCart', function () {

  // load the service's module
  beforeEach(module('pulianiBookStoreApp'));

  // instantiate service
  var MyCart;
  beforeEach(inject(function (_MyCart_) {
    MyCart = _MyCart_;
  }));

  it('should do something', function () {
    !!MyCart.should.be.true;
  });

});
