'use strict';

var app = require('../..');
import request from 'supertest';

var newCartProduct;

describe('CartProduct API:', function() {

  describe('GET /api/cart_products', function() {
    var cartProducts;

    beforeEach(function(done) {
      request(app)
        .get('/api/cart_products')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          cartProducts = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      cartProducts.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/cart_products', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/cart_products')
        .send({
          name: 'New CartProduct',
          info: 'This is the brand new cartProduct!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newCartProduct = res.body;
          done();
        });
    });

    it('should respond with the newly created cartProduct', function() {
      newCartProduct.name.should.equal('New CartProduct');
      newCartProduct.info.should.equal('This is the brand new cartProduct!!!');
    });

  });

  describe('GET /api/cart_products/:id', function() {
    var cartProduct;

    beforeEach(function(done) {
      request(app)
        .get('/api/cart_products/' + newCartProduct._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          cartProduct = res.body;
          done();
        });
    });

    afterEach(function() {
      cartProduct = {};
    });

    it('should respond with the requested cartProduct', function() {
      cartProduct.name.should.equal('New CartProduct');
      cartProduct.info.should.equal('This is the brand new cartProduct!!!');
    });

  });

  describe('PUT /api/cart_products/:id', function() {
    var updatedCartProduct;

    beforeEach(function(done) {
      request(app)
        .put('/api/cart_products/' + newCartProduct._id)
        .send({
          name: 'Updated CartProduct',
          info: 'This is the updated cartProduct!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedCartProduct = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedCartProduct = {};
    });

    it('should respond with the updated cartProduct', function() {
      updatedCartProduct.name.should.equal('Updated CartProduct');
      updatedCartProduct.info.should.equal('This is the updated cartProduct!!!');
    });

  });

  describe('DELETE /api/cart_products/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/cart_products/' + newCartProduct._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when cartProduct does not exist', function(done) {
      request(app)
        .delete('/api/cart_products/' + newCartProduct._id)
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
