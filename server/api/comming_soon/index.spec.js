'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var commingSoonCtrlStub = {
  index: 'commingSoonCtrl.index',
  show: 'commingSoonCtrl.show',
  create: 'commingSoonCtrl.create',
  update: 'commingSoonCtrl.update',
  destroy: 'commingSoonCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var commingSoonIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './comming_soon.controller': commingSoonCtrlStub
});

describe('CommingSoon API Router:', function() {

  it('should return an express router instance', function() {
    commingSoonIndex.should.equal(routerStub);
  });

  describe('GET /api/comming_soon/', function() {

    it('should route to commingSoon.controller.index', function() {
      routerStub.get
        .withArgs('/', 'commingSoonCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/comming_soon//:id', function() {

    it('should route to commingSoon.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'commingSoonCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/comming_soon/', function() {

    it('should route to commingSoon.controller.create', function() {
      routerStub.post
        .withArgs('/', 'commingSoonCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/comming_soon//:id', function() {

    it('should route to commingSoon.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'commingSoonCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/comming_soon//:id', function() {

    it('should route to commingSoon.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'commingSoonCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/comming_soon//:id', function() {

    it('should route to commingSoon.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'commingSoonCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
