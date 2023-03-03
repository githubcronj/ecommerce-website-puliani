'use strict';

describe('Service: myaccount', function () {

  // load the service's module
  beforeEach(module('pulianiBookStoreApp'));

  // instantiate service
  var myaccount;
  beforeEach(inject(function (_myaccount_) {
    myaccount = _myaccount_;
  }));

  it('should do something', function () {
    !!myaccount.should.be.true;
  });

});
