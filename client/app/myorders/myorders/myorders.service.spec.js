'use strict';

describe('Service: myorders', function () {

  // load the service's module
  beforeEach(module('pulianiBookStoreApp'));

  // instantiate service
  var myorders;
  beforeEach(inject(function (_myorders_) {
    myorders = _myorders_;
  }));

  it('should do something', function () {
    !!myorders.should.be.true;
  });

});
