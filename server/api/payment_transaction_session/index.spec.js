'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var paymentTransactionSessionCtrlStub = {
  index: 'paymentTransactionSessionCtrl.index',
  show: 'paymentTransactionSessionCtrl.show',
  create: 'paymentTransactionSessionCtrl.create',
  update: 'paymentTransactionSessionCtrl.update',
  destroy: 'paymentTransactionSessionCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var paymentTransactionSessionIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './payment_transaction_session.controller': paymentTransactionSessionCtrlStub
});

describe('PaymentTransactionSession API Router:', function() {

  it('should return an express router instance', function() {
    paymentTransactionSessionIndex.should.equal(routerStub);
  });

  describe('GET /api/payment_transaction_sessions', function() {

    it('should route to paymentTransactionSession.controller.index', function() {
      routerStub.get
        .withArgs('/', 'paymentTransactionSessionCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/payment_transaction_sessions/:id', function() {

    it('should route to paymentTransactionSession.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'paymentTransactionSessionCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/payment_transaction_sessions', function() {

    it('should route to paymentTransactionSession.controller.create', function() {
      routerStub.post
        .withArgs('/', 'paymentTransactionSessionCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/payment_transaction_sessions/:id', function() {

    it('should route to paymentTransactionSession.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'paymentTransactionSessionCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/payment_transaction_sessions/:id', function() {

    it('should route to paymentTransactionSession.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'paymentTransactionSessionCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/payment_transaction_sessions/:id', function() {

    it('should route to paymentTransactionSession.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'paymentTransactionSessionCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
