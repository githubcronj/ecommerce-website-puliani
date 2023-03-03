'use strict';

describe('Service: banners', function () {

  // load the service's module
  beforeEach(module('pulianiBookStoreApp'));

  // instantiate service
  var banners;
  beforeEach(inject(function (_banners_) {
    banners = _banners_;
  }));

  it('should do something', function () {
    !!banners.should.be.true;
  });

});
