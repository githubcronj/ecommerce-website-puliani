'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var productCategoryCtrlStub = {
  index: 'productCategoryCtrl.index',
  show: 'productCategoryCtrl.show',
  create: 'productCategoryCtrl.create',
  update: 'productCategoryCtrl.update',
  destroy: 'productCategoryCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var productCategoryIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './product_category.controller': productCategoryCtrlStub
});

describe('ProductCategory API Router:', function() {

  it('should return an express router instance', function() {
    productCategoryIndex.should.equal(routerStub);
  });

  describe('GET /api/product_categories', function() {

    it('should route to productCategory.controller.index', function() {
      routerStub.get
        .withArgs('/', 'productCategoryCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/product_categories/:id', function() {

    it('should route to productCategory.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'productCategoryCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/product_categories', function() {

    it('should route to productCategory.controller.create', function() {
      routerStub.post
        .withArgs('/', 'productCategoryCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/product_categories/:id', function() {

    it('should route to productCategory.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'productCategoryCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/product_categories/:id', function() {

    it('should route to productCategory.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'productCategoryCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/product_categories/:id', function() {

    it('should route to productCategory.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'productCategoryCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
