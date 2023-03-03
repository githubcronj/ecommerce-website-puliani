'use strict';

describe('Service: resetpassword', function () {

  // load the service's module
  beforeEach(module('pulianiBookStoreApp'));

  // instantiate service
  var resetpassword;
  beforeEach(inject(function (_resetpassword_) {
    resetpassword = _resetpassword_;
  }));

  it('should do something', function () {
    !!resetpassword.should.be.true;
  });

});
