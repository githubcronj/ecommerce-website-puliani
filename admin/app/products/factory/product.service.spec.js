'use strict';

describe('Service: factory', function () {

  // load the service's module
  beforeEach(module('pulianiBookStoreAdminApp'));

  // instantiate service
  var factory;
  beforeEach(inject(function (_factory_) {
    factory = _factory_;
  }));

  it('should do something', function () {
    !!factory.should.be.true;
  });

});
