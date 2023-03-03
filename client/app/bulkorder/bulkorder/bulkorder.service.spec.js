'use strict';

describe('Service: bulkorder', function () {

  // load the service's module
  beforeEach(module('pulianiBookStoreApp'));

  // instantiate service
  var bulkorder;
  beforeEach(inject(function (_bulkorder_) {
    bulkorder = _bulkorder_;
  }));

  it('should do something', function () {
    !!bulkorder.should.be.true;
  });

});
