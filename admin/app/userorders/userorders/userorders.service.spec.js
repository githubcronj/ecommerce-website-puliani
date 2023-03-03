'use strict';

describe('Service: userorders', function () {

  // load the service's module
  beforeEach(module('pulianiBookStoreApp'));

  // instantiate service
  var userorders;
  beforeEach(inject(function (_userorders_) {
    userorders = _userorders_;
  }));

  it('should do something', function () {
    !!userorders.should.be.true;
  });

});
