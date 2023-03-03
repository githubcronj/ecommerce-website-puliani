'use strict';

var app = require('../..');
import request from 'supertest';

var newBannerImage;

describe('BannerImage API:', function() {

  describe('GET /api/banner_images', function() {
    var bannerImages;

    beforeEach(function(done) {
      request(app)
        .get('/api/banner_images')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          bannerImages = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      bannerImages.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/banner_images', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/banner_images')
        .send({
          name: 'New BannerImage',
          info: 'This is the brand new bannerImage!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newBannerImage = res.body;
          done();
        });
    });

    it('should respond with the newly created bannerImage', function() {
      newBannerImage.name.should.equal('New BannerImage');
      newBannerImage.info.should.equal('This is the brand new bannerImage!!!');
    });

  });

  describe('GET /api/banner_images/:id', function() {
    var bannerImage;

    beforeEach(function(done) {
      request(app)
        .get('/api/banner_images/' + newBannerImage._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          bannerImage = res.body;
          done();
        });
    });

    afterEach(function() {
      bannerImage = {};
    });

    it('should respond with the requested bannerImage', function() {
      bannerImage.name.should.equal('New BannerImage');
      bannerImage.info.should.equal('This is the brand new bannerImage!!!');
    });

  });

  describe('PUT /api/banner_images/:id', function() {
    var updatedBannerImage;

    beforeEach(function(done) {
      request(app)
        .put('/api/banner_images/' + newBannerImage._id)
        .send({
          name: 'Updated BannerImage',
          info: 'This is the updated bannerImage!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedBannerImage = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedBannerImage = {};
    });

    it('should respond with the updated bannerImage', function() {
      updatedBannerImage.name.should.equal('Updated BannerImage');
      updatedBannerImage.info.should.equal('This is the updated bannerImage!!!');
    });

  });

  describe('DELETE /api/banner_images/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/banner_images/' + newBannerImage._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when bannerImage does not exist', function(done) {
      request(app)
        .delete('/api/banner_images/' + newBannerImage._id)
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
