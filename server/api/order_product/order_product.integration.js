'use strict';

var app = require('../..');
import request from 'supertest';

var newOrderProduct;

describe('OrderProduct API:', function() {

  describe('GET /api/order_products', function() {
    var orderProducts;

    beforeEach(function(done) {
      request(app)
        .get('/api/order_products')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          orderProducts = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      orderProducts.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/order_products', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/order_products')
        .send({
          name: 'New OrderProduct',
          info: 'This is the brand new orderProduct!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newOrderProduct = res.body;
          done();
        });
    });

    it('should respond with the newly created orderProduct', function() {
      newOrderProduct.name.should.equal('New OrderProduct');
      newOrderProduct.info.should.equal('This is the brand new orderProduct!!!');
    });

  });

  describe('GET /api/order_products/:id', function() {
    var orderProduct;

    beforeEach(function(done) {
      request(app)
        .get('/api/order_products/' + newOrderProduct._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          orderProduct = res.body;
          done();
        });
    });

    afterEach(function() {
      orderProduct = {};
    });

    it('should respond with the requested orderProduct', function() {
      orderProduct.name.should.equal('New OrderProduct');
      orderProduct.info.should.equal('This is the brand new orderProduct!!!');
    });

  });

  describe('PUT /api/order_products/:id', function() {
    var updatedOrderProduct;

    beforeEach(function(done) {
      request(app)
        .put('/api/order_products/' + newOrderProduct._id)
        .send({
          name: 'Updated OrderProduct',
          info: 'This is the updated orderProduct!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedOrderProduct = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedOrderProduct = {};
    });

    it('should respond with the updated orderProduct', function() {
      updatedOrderProduct.name.should.equal('Updated OrderProduct');
      updatedOrderProduct.info.should.equal('This is the updated orderProduct!!!');
    });

  });

  describe('DELETE /api/order_products/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/order_products/' + newOrderProduct._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when orderProduct does not exist', function(done) {
      request(app)
        .delete('/api/order_products/' + newOrderProduct._id)
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
