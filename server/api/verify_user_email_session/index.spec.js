'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var verifyUserEmailSessionCtrlStub = {
  index: 'verifyUserEmailSessionCtrl.index',
  show: 'verifyUserEmailSessionCtrl.show',
  create: 'verifyUserEmailSessionCtrl.create',
  update: 'verifyUserEmailSessionCtrl.update',
  destroy: 'verifyUserEmailSessionCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var verifyUserEmailSessionIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './verify_user_email_session.controller': verifyUserEmailSessionCtrlStub
});

describe('VerifyUserEmailSession API Router:', function() {

  it('should return an express router instance', function() {
    verifyUserEmailSessionIndex.should.equal(routerStub);
  });

  describe('GET /api/verify_user_email_sessions', function() {

    it('should route to verifyUserEmailSession.controller.index', function() {
      routerStub.get
        .withArgs('/', 'verifyUserEmailSessionCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/verify_user_email_sessions/:id', function() {

    it('should route to verifyUserEmailSession.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'verifyUserEmailSessionCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/verify_user_email_sessions', function() {

    it('should route to verifyUserEmailSession.controller.create', function() {
      routerStub.post
        .withArgs('/', 'verifyUserEmailSessionCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/verify_user_email_sessions/:id', function() {

    it('should route to verifyUserEmailSession.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'verifyUserEmailSessionCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/verify_user_email_sessions/:id', function() {

    it('should route to verifyUserEmailSession.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'verifyUserEmailSessionCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/verify_user_email_sessions/:id', function() {

    it('should route to verifyUserEmailSession.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'verifyUserEmailSessionCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
