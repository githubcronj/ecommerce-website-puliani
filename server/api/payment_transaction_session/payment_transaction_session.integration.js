'use strict';

var app = require('../..');
import request from 'supertest';

var newPaymentTransactionSession;

describe('PaymentTransactionSession API:', function() {

  describe('GET /api/payment_transaction_sessions', function() {
    var paymentTransactionSessions;

    beforeEach(function(done) {
      request(app)
        .get('/api/payment_transaction_sessions')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          paymentTransactionSessions = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      paymentTransactionSessions.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/payment_transaction_sessions', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/payment_transaction_sessions')
        .send({
          name: 'New PaymentTransactionSession',
          info: 'This is the brand new paymentTransactionSession!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newPaymentTransactionSession = res.body;
          done();
        });
    });

    it('should respond with the newly created paymentTransactionSession', function() {
      newPaymentTransactionSession.name.should.equal('New PaymentTransactionSession');
      newPaymentTransactionSession.info.should.equal('This is the brand new paymentTransactionSession!!!');
    });

  });

  describe('GET /api/payment_transaction_sessions/:id', function() {
    var paymentTransactionSession;

    beforeEach(function(done) {
      request(app)
        .get('/api/payment_transaction_sessions/' + newPaymentTransactionSession._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          paymentTransactionSession = res.body;
          done();
        });
    });

    afterEach(function() {
      paymentTransactionSession = {};
    });

    it('should respond with the requested paymentTransactionSession', function() {
      paymentTransactionSession.name.should.equal('New PaymentTransactionSession');
      paymentTransactionSession.info.should.equal('This is the brand new paymentTransactionSession!!!');
    });

  });

  describe('PUT /api/payment_transaction_sessions/:id', function() {
    var updatedPaymentTransactionSession;

    beforeEach(function(done) {
      request(app)
        .put('/api/payment_transaction_sessions/' + newPaymentTransactionSession._id)
        .send({
          name: 'Updated PaymentTransactionSession',
          info: 'This is the updated paymentTransactionSession!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedPaymentTransactionSession = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedPaymentTransactionSession = {};
    });

    it('should respond with the updated paymentTransactionSession', function() {
      updatedPaymentTransactionSession.name.should.equal('Updated PaymentTransactionSession');
      updatedPaymentTransactionSession.info.should.equal('This is the updated paymentTransactionSession!!!');
    });

  });

  describe('DELETE /api/payment_transaction_sessions/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/payment_transaction_sessions/' + newPaymentTransactionSession._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when paymentTransactionSession does not exist', function(done) {
      request(app)
        .delete('/api/payment_transaction_sessions/' + newPaymentTransactionSession._id)
        .expect(404)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

  });

});
