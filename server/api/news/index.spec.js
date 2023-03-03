'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var newsCtrlStub = {
  index: 'newsCtrl.index',
  show: 'newsCtrl.show',
  create: 'newsCtrl.create',
  update: 'newsCtrl.update',
  destroy: 'newsCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var newsIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './news.controller': newsCtrlStub
});

describe('News API Router:', function() {

  it('should return an express router instance', function() {
    newsIndex.should.equal(routerStub);
  });

  describe('GET /api/news', function() {

    it('should route to news.controller.index', function() {
      routerStub.get
        .withArgs('/', 'newsCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/news/:id', function() {

    it('should route to news.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'newsCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/news', function() {

    it('should route to news.controller.create', function() {
      routerStub.post
        .withArgs('/', 'newsCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/news/:id', function() {

    it('should route to news.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'newsCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/news/:id', function() {

    it('should route to news.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'newsCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/news/:id', function() {

    it('should route to news.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'newsCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
