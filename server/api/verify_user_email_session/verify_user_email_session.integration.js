'use strict';

var app = require('../..');
import request from 'supertest';

var newVerifyUserEmailSession;

describe('VerifyUserEmailSession API:', function() {

  describe('GET /api/verify_user_email_sessions', function() {
    var verifyUserEmailSessions;

    beforeEach(function(done) {
      request(app)
        .get('/api/verify_user_email_sessions')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          verifyUserEmailSessions = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      verifyUserEmailSessions.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/verify_user_email_sessions', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/verify_user_email_sessions')
        .send({
          name: 'New VerifyUserEmailSession',
          info: 'This is the brand new verifyUserEmailSession!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newVerifyUserEmailSession = res.body;
          done();
        });
    });

    it('should respond with the newly created verifyUserEmailSession', function() {
      newVerifyUserEmailSession.name.should.equal('New VerifyUserEmailSession');
      newVerifyUserEmailSession.info.should.equal('This is the brand new verifyUserEmailSession!!!');
    });

  });

  describe('GET /api/verify_user_email_sessions/:id', function() {
    var verifyUserEmailSession;

    beforeEach(function(done) {
      request(app)
        .get('/api/verify_user_email_sessions/' + newVerifyUserEmailSession._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          verifyUserEmailSession = res.body;
          done();
        });
    });

    afterEach(function() {
      verifyUserEmailSession = {};
    });

    it('should respond with the requested verifyUserEmailSession', function() {
      verifyUserEmailSession.name.should.equal('New VerifyUserEmailSession');
      verifyUserEmailSession.info.should.equal('This is the brand new verifyUserEmailSession!!!');
    });

  });

  describe('PUT /api/verify_user_email_sessions/:id', function() {
    var updatedVerifyUserEmailSession;

    beforeEach(function(done) {
      request(app)
        .put('/api/verify_user_email_sessions/' + newVerifyUserEmailSession._id)
        .send({
          name: 'Updated VerifyUserEmailSession',
          info: 'This is the updated verifyUserEmailSession!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedVerifyUserEmailSession = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedVerifyUserEmailSession = {};
    });

    it('should respond with the updated verifyUserEmailSession', function() {
      updatedVerifyUserEmailSession.name.should.equal('Updated VerifyUserEmailSession');
      updatedVerifyUserEmailSession.info.should.equal('This is the updated verifyUserEmailSession!!!');
    });

  });

  describe('DELETE /api/verify_user_email_sessions/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/verify_user_email_sessions/' + newVerifyUserEmailSession._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when verifyUserEmailSession does not exist', function(done) {
      request(app)
        .delete('/api/verify_user_email_sessions/' + newVerifyUserEmailSession._id)
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
