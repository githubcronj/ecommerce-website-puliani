'use strict';

describe('Service: contactUs', function () {

  // load the service's module
  beforeEach(module('pulianiBookStoreApp'));

  // instantiate service
  var contactUs;
  beforeEach(inject(function (_contactUs_) {
    contactUs = _contactUs_;
  }));

  it('should do something', function () {
    !!contactUs.should.be.true;
  });

});
