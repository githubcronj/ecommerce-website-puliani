'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var bulkOrderCtrlStub = {
  index: 'bulkOrderCtrl.index',
  show: 'bulkOrderCtrl.show',
  create: 'bulkOrderCtrl.create',
  update: 'bulkOrderCtrl.update',
  destroy: 'bulkOrderCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var bulkOrderIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './bulk_order.controller': bulkOrderCtrlStub
});

describe('BulkOrder API Router:', function() {

  it('should return an express router instance', function() {
    bulkOrderIndex.should.equal(routerStub);
  });

  describe('GET /api/bulk_orders', function() {

    it('should route to bulkOrder.controller.index', function() {
      routerStub.get
        .withArgs('/', 'bulkOrderCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/bulk_orders/:id', function() {

    it('should route to bulkOrder.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'bulkOrderCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/bulk_orders', function() {

    it('should route to bulkOrder.controller.create', function() {
      routerStub.post
        .withArgs('/', 'bulkOrderCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/bulk_orders/:id', function() {

    it('should route to bulkOrder.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'bulkOrderCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/bulk_orders/:id', function() {

    it('should route to bulkOrder.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'bulkOrderCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/bulk_orders/:id', function() {

    it('should route to bulkOrder.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'bulkOrderCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
