'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var resetPasswordSessionCtrlStub = {
  index: 'resetPasswordSessionCtrl.index',
  show: 'resetPasswordSessionCtrl.show',
  create: 'resetPasswordSessionCtrl.create',
  update: 'resetPasswordSessionCtrl.update',
  destroy: 'resetPasswordSessionCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var resetPasswordSessionIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './reset_password_session.controller': resetPasswordSessionCtrlStub
});

describe('ResetPasswordSession API Router:', function() {

  it('should return an express router instance', function() {
    resetPasswordSessionIndex.should.equal(routerStub);
  });

  describe('GET /api/reset_password_sessions', function() {

    it('should route to resetPasswordSession.controller.index', function() {
      routerStub.get
        .withArgs('/', 'resetPasswordSessionCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/reset_password_sessions/:id', function() {

    it('should route to resetPasswordSession.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'resetPasswordSessionCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/reset_password_sessions', function() {

    it('should route to resetPasswordSession.controller.create', function() {
      routerStub.post
        .withArgs('/', 'resetPasswordSessionCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/reset_password_sessions/:id', function() {

    it('should route to resetPasswordSession.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'resetPasswordSessionCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/reset_password_sessions/:id', function() {

    it('should route to resetPasswordSession.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'resetPasswordSessionCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/reset_password_sessions/:id', function() {

    it('should route to resetPasswordSession.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'resetPasswordSessionCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
