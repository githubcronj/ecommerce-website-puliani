'use strict';

var app = require('../..');
import request from 'supertest';

var newProductCategory;

describe('ProductCategory API:', function() {

  describe('GET /api/product_categories', function() {
    var productCategorys;

    beforeEach(function(done) {
      request(app)
        .get('/api/product_categories')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          productCategorys = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      productCategorys.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/product_categories', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/product_categories')
        .send({
          name: 'New ProductCategory',
          info: 'This is the brand new productCategory!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newProductCategory = res.body;
          done();
        });
    });

    it('should respond with the newly created productCategory', function() {
      newProductCategory.name.should.equal('New ProductCategory');
      newProductCategory.info.should.equal('This is the brand new productCategory!!!');
    });

  });

  describe('GET /api/product_categories/:id', function() {
    var productCategory;

    beforeEach(function(done) {
      request(app)
        .get('/api/product_categories/' + newProductCategory._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          productCategory = res.body;
          done();
        });
    });

    afterEach(function() {
      productCategory = {};
    });

    it('should respond with the requested productCategory', function() {
      productCategory.name.should.equal('New ProductCategory');
      productCategory.info.should.equal('This is the brand new productCategory!!!');
    });

  });

  describe('PUT /api/product_categories/:id', function() {
    var updatedProductCategory;

    beforeEach(function(done) {
      request(app)
        .put('/api/product_categories/' + newProductCategory._id)
        .send({
          name: 'Updated ProductCategory',
          info: 'This is the updated productCategory!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedProductCategory = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedProductCategory = {};
    });

    it('should respond with the updated productCategory', function() {
      updatedProductCategory.name.should.equal('Updated ProductCategory');
      updatedProductCategory.info.should.equal('This is the updated productCategory!!!');
    });

  });

  describe('DELETE /api/product_categories/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/product_categories/' + newProductCategory._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when productCategory does not exist', function(done) {
      request(app)
        .delete('/api/product_categories/' + newProductCategory._id)
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
