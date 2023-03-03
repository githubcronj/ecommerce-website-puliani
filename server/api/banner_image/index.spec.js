'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var bannerImageCtrlStub = {
  index: 'bannerImageCtrl.index',
  show: 'bannerImageCtrl.show',
  create: 'bannerImageCtrl.create',
  update: 'bannerImageCtrl.update',
  destroy: 'bannerImageCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var bannerImageIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './banner_image.controller': bannerImageCtrlStub
});

describe('BannerImage API Router:', function() {

  it('should return an express router instance', function() {
    bannerImageIndex.should.equal(routerStub);
  });

  describe('GET /api/banner_images', function() {

    it('should route to bannerImage.controller.index', function() {
      routerStub.get
        .withArgs('/', 'bannerImageCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/banner_images/:id', function() {

    it('should route to bannerImage.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'bannerImageCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/banner_images', function() {

    it('should route to bannerImage.controller.create', function() {
      routerStub.post
        .withArgs('/', 'bannerImageCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/banner_images/:id', function() {

    it('should route to bannerImage.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'bannerImageCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/banner_images/:id', function() {

    it('should route to bannerImage.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'bannerImageCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/banner_images/:id', function() {

    it('should route to bannerImage.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'bannerImageCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
