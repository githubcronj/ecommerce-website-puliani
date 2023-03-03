'use strict';

describe('Service: shell', function () {

  // load the service's module
  beforeEach(module('pulianiBookStoreApp'));

  // instantiate service
  var shell;
  beforeEach(inject(function (_shell_) {
    shell = _shell_;
  }));

  it('should do something', function () {
    !!shell.should.be.true;
  });

});
