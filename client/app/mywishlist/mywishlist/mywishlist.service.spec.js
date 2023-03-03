'use strict';

describe('Service: mywishlist', function () {

  // load the service's module
  beforeEach(module('pulianiBookStoreApp'));

  // instantiate service
  var mywishlist;
  beforeEach(inject(function (_mywishlist_) {
    mywishlist = _mywishlist_;
  }));

  it('should do something', function () {
    !!mywishlist.should.be.true;
  });

});
