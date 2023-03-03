'use strict';

var app = require('../..');
import request from 'supertest';

var newBulkOrder;

describe('BulkOrder API:', function() {

  describe('GET /api/bulk_orders', function() {
    var bulkOrders;

    beforeEach(function(done) {
      request(app)
        .get('/api/bulk_orders')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          bulkOrders = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      bulkOrders.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/bulk_orders', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/bulk_orders')
        .send({
          name: 'New BulkOrder',
          info: 'This is the brand new bulkOrder!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newBulkOrder = res.body;
          done();
        });
    });

    it('should respond with the newly created bulkOrder', function() {
      newBulkOrder.name.should.equal('New BulkOrder');
      newBulkOrder.info.should.equal('This is the brand new bulkOrder!!!');
    });

  });

  describe('GET /api/bulk_orders/:id', function() {
    var bulkOrder;

    beforeEach(function(done) {
      request(app)
        .get('/api/bulk_orders/' + newBulkOrder._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          bulkOrder = res.body;
          done();
        });
    });

    afterEach(function() {
      bulkOrder = {};
    });

    it('should respond with the requested bulkOrder', function() {
      bulkOrder.name.should.equal('New BulkOrder');
      bulkOrder.info.should.equal('This is the brand new bulkOrder!!!');
    });

  });

  describe('PUT /api/bulk_orders/:id', function() {
    var updatedBulkOrder;

    beforeEach(function(done) {
      request(app)
        .put('/api/bulk_orders/' + newBulkOrder._id)
        .send({
          name: 'Updated BulkOrder',
          info: 'This is the updated bulkOrder!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedBulkOrder = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedBulkOrder = {};
    });

    it('should respond with the updated bulkOrder', function() {
      updatedBulkOrder.name.should.equal('Updated BulkOrder');
      updatedBulkOrder.info.should.equal('This is the updated bulkOrder!!!');
    });

  });

  describe('DELETE /api/bulk_orders/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/bulk_orders/' + newBulkOrder._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when bulkOrder does not exist', function(done) {
      request(app)
        .delete('/api/bulk_orders/' + newBulkOrder._id)
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
