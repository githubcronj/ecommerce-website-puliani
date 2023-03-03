'use strict';

describe('Service: bulkenquiry', function () {

  // load the service's module
  beforeEach(module('pulianiBookStoreAdminApp'));

  // instantiate service
  var bulkenquiry;
  beforeEach(inject(function (_bulkenquiry_) {
    bulkenquiry = _bulkenquiry_;
  }));

  it('should do something', function () {
    !!bulkenquiry.should.be.true;
  });

});
