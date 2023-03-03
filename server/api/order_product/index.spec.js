'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var orderProductCtrlStub = {
  index: 'orderProductCtrl.index',
  show: 'orderProductCtrl.show',
  create: 'orderProductCtrl.create',
  update: 'orderProductCtrl.update',
  destroy: 'orderProductCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var orderProductIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './order_product.controller': orderProductCtrlStub
});

describe('OrderProduct API Router:', function() {

  it('should return an express router instance', function() {
    orderProductIndex.should.equal(routerStub);
  });

  describe('GET /api/order_products', function() {

    it('should route to orderProduct.controller.index', function() {
      routerStub.get
        .withArgs('/', 'orderProductCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/order_products/:id', function() {

    it('should route to orderProduct.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'orderProductCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/order_products', function() {

    it('should route to orderProduct.controller.create', function() {
      routerStub.post
        .withArgs('/', 'orderProductCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/order_products/:id', function() {

    it('should route to orderProduct.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'orderProductCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/order_products/:id', function() {

    it('should route to orderProduct.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'orderProductCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/order_products/:id', function() {

    it('should route to orderProduct.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'orderProductCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
