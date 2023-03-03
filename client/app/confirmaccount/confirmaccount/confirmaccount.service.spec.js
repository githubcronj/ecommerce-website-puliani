'use strict';

describe('Service: confirmaccount', function () {

  // load the service's module
  beforeEach(module('pulianiBookStoreApp'));

  // instantiate service
  var confirmaccount;
  beforeEach(inject(function (_confirmaccount_) {
    confirmaccount = _confirmaccount_;
  }));

  it('should do something', function () {
    !!confirmaccount.should.be.true;
  });

});
