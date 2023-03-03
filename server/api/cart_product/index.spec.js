'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var cartProductCtrlStub = {
  index: 'cartProductCtrl.index',
  show: 'cartProductCtrl.show',
  create: 'cartProductCtrl.create',
  update: 'cartProductCtrl.update',
  destroy: 'cartProductCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var cartProductIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './cart_product.controller': cartProductCtrlStub
});

describe('CartProduct API Router:', function() {

  it('should return an express router instance', function() {
    cartProductIndex.should.equal(routerStub);
  });

  describe('GET /api/cart_products', function() {

    it('should route to cartProduct.controller.index', function() {
      routerStub.get
        .withArgs('/', 'cartProductCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/cart_products/:id', function() {

    it('should route to cartProduct.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'cartProductCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/cart_products', function() {

    it('should route to cartProduct.controller.create', function() {
      routerStub.post
        .withArgs('/', 'cartProductCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/cart_products/:id', function() {

    it('should route to cartProduct.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'cartProductCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/cart_products/:id', function() {

    it('should route to cartProduct.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'cartProductCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/cart_products/:id', function() {

    it('should route to cartProduct.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'cartProductCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
