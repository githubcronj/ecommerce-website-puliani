'use strict';

var app = require('../..');
import request from 'supertest';

var newCommingSoon;

describe('CommingSoon API:', function() {

  describe('GET /api/comming_soon/', function() {
    var commingSoons;

    beforeEach(function(done) {
      request(app)
        .get('/api/comming_soon/')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          commingSoons = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      commingSoons.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/comming_soon/', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/comming_soon/')
        .send({
          name: 'New CommingSoon',
          info: 'This is the brand new commingSoon!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newCommingSoon = res.body;
          done();
        });
    });

    it('should respond with the newly created commingSoon', function() {
      newCommingSoon.name.should.equal('New CommingSoon');
      newCommingSoon.info.should.equal('This is the brand new commingSoon!!!');
    });

  });

  describe('GET /api/comming_soon//:id', function() {
    var commingSoon;

    beforeEach(function(done) {
      request(app)
        .get('/api/comming_soon//' + newCommingSoon._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          commingSoon = res.body;
          done();
        });
    });

    afterEach(function() {
      commingSoon = {};
    });

    it('should respond with the requested commingSoon', function() {
      commingSoon.name.should.equal('New CommingSoon');
      commingSoon.info.should.equal('This is the brand new commingSoon!!!');
    });

  });

  describe('PUT /api/comming_soon//:id', function() {
    var updatedCommingSoon;

    beforeEach(function(done) {
      request(app)
        .put('/api/comming_soon//' + newCommingSoon._id)
        .send({
          name: 'Updated CommingSoon',
          info: 'This is the updated commingSoon!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedCommingSoon = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedCommingSoon = {};
    });

    it('should respond with the updated commingSoon', function() {
      updatedCommingSoon.name.should.equal('Updated CommingSoon');
      updatedCommingSoon.info.should.equal('This is the updated commingSoon!!!');
    });

  });

  describe('DELETE /api/comming_soon//:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/comming_soon//' + newCommingSoon._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when commingSoon does not exist', function(done) {
      request(app)
        .delete('/api/comming_soon//' + newCommingSoon._id)
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
