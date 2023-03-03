'use strict';

describe('Service: bulkUpload', function () {

  // load the service's module
  beforeEach(module('pulianiBookStoreApp'));

  // instantiate service
  var bulkUpload;
  beforeEach(inject(function (_bulkUpload_) {
    bulkUpload = _bulkUpload_;
  }));

  it('should do something', function () {
    !!bulkUpload.should.be.true;
  });

});
