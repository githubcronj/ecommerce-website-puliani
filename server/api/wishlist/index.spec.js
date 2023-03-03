'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var wishlistCtrlStub = {
  index: 'wishlistCtrl.index',
  show: 'wishlistCtrl.show',
  create: 'wishlistCtrl.create',
  update: 'wishlistCtrl.update',
  destroy: 'wishlistCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var wishlistIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './wishlist.controller': wishlistCtrlStub
});

describe('Wishlist API Router:', function() {

  it('should return an express router instance', function() {
    wishlistIndex.should.equal(routerStub);
  });

  describe('GET /api/wishlists', function() {

    it('should route to wishlist.controller.index', function() {
      routerStub.get
        .withArgs('/', 'wishlistCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/wishlists/:id', function() {

    it('should route to wishlist.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'wishlistCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/wishlists', function() {

    it('should route to wishlist.controller.create', function() {
      routerStub.post
        .withArgs('/', 'wishlistCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/wishlists/:id', function() {

    it('should route to wishlist.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'wishlistCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/wishlists/:id', function() {

    it('should route to wishlist.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'wishlistCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/wishlists/:id', function() {

    it('should route to wishlist.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'wishlistCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
