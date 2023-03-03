'use strict';

var app = require('../..');
import request from 'supertest';

var newWishlist;

describe('Wishlist API:', function() {

  describe('GET /api/wishlists', function() {
    var wishlists;

    beforeEach(function(done) {
      request(app)
        .get('/api/wishlists')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          wishlists = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      wishlists.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/wishlists', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/wishlists')
        .send({
          name: 'New Wishlist',
          info: 'This is the brand new wishlist!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newWishlist = res.body;
          done();
        });
    });

    it('should respond with the newly created wishlist', function() {
      newWishlist.name.should.equal('New Wishlist');
      newWishlist.info.should.equal('This is the brand new wishlist!!!');
    });

  });

  describe('GET /api/wishlists/:id', function() {
    var wishlist;

    beforeEach(function(done) {
      request(app)
        .get('/api/wishlists/' + newWishlist._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          wishlist = res.body;
          done();
        });
    });

    afterEach(function() {
      wishlist = {};
    });

    it('should respond with the requested wishlist', function() {
      wishlist.name.should.equal('New Wishlist');
      wishlist.info.should.equal('This is the brand new wishlist!!!');
    });

  });

  describe('PUT /api/wishlists/:id', function() {
    var updatedWishlist;

    beforeEach(function(done) {
      request(app)
        .put('/api/wishlists/' + newWishlist._id)
        .send({
          name: 'Updated Wishlist',
          info: 'This is the updated wishlist!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedWishlist = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedWishlist = {};
    });

    it('should respond with the updated wishlist', function() {
      updatedWishlist.name.should.equal('Updated Wishlist');
      updatedWishlist.info.should.equal('This is the updated wishlist!!!');
    });

  });

  describe('DELETE /api/wishlists/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/wishlists/' + newWishlist._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when wishlist does not exist', function(done) {
      request(app)
        .delete('/api/wishlists/' + newWishlist._id)
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
