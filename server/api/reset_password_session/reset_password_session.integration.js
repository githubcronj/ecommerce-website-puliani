'use strict';

var app = require('../..');
import request from 'supertest';

var newResetPasswordSession;

describe('ResetPasswordSession API:', function() {

  describe('GET /api/reset_password_sessions', function() {
    var resetPasswordSessions;

    beforeEach(function(done) {
      request(app)
        .get('/api/reset_password_sessions')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          resetPasswordSessions = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      resetPasswordSessions.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/reset_password_sessions', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/reset_password_sessions')
        .send({
          name: 'New ResetPasswordSession',
          info: 'This is the brand new resetPasswordSession!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newResetPasswordSession = res.body;
          done();
        });
    });

    it('should respond with the newly created resetPasswordSession', function() {
      newResetPasswordSession.name.should.equal('New ResetPasswordSession');
      newResetPasswordSession.info.should.equal('This is the brand new resetPasswordSession!!!');
    });

  });

  describe('GET /api/reset_password_sessions/:id', function() {
    var resetPasswordSession;

    beforeEach(function(done) {
      request(app)
        .get('/api/reset_password_sessions/' + newResetPasswordSession._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          resetPasswordSession = res.body;
          done();
        });
    });

    afterEach(function() {
      resetPasswordSession = {};
    });

    it('should respond with the requested resetPasswordSession', function() {
      resetPasswordSession.name.should.equal('New ResetPasswordSession');
      resetPasswordSession.info.should.equal('This is the brand new resetPasswordSession!!!');
    });

  });

  describe('PUT /api/reset_password_sessions/:id', function() {
    var updatedResetPasswordSession;

    beforeEach(function(done) {
      request(app)
        .put('/api/reset_password_sessions/' + newResetPasswordSession._id)
        .send({
          name: 'Updated ResetPasswordSession',
          info: 'This is the updated resetPasswordSession!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedResetPasswordSession = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedResetPasswordSession = {};
    });

    it('should respond with the updated resetPasswordSession', function() {
      updatedResetPasswordSession.name.should.equal('Updated ResetPasswordSession');
      updatedResetPasswordSession.info.should.equal('This is the updated resetPasswordSession!!!');
    });

  });

  describe('DELETE /api/reset_password_sessions/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/reset_password_sessions/' + newResetPasswordSession._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when resetPasswordSession does not exist', function(done) {
      request(app)
        .delete('/api/reset_password_sessions/' + newResetPasswordSession._id)
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
