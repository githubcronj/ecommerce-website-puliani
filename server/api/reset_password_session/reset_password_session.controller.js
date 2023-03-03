/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/reset_password_sessions              ->  index
 * POST    /api/reset_password_sessions              ->  create
 * GET     /api/reset_password_sessions/:id          ->  show
 * PUT     /api/reset_password_sessions/:id          ->  update
 * DELETE  /api/reset_password_sessions/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import db from '../../sqldb';
var uuid = require('uuid');
var mailer = require("../../lib/mail.js")
var config = require("../../config/environment")
import jwt from 'jsonwebtoken';


var ResetPasswordSession = db.reset_password_session;
var User = db.user;

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function(entity) {
    return entity.updateAttributes(updates)
      .then(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.destroy()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of ResetPasswordSessions
export function index(req, res) {
  return ResetPasswordSession.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single ResetPasswordSession from the DB
export function show(req, res) {
  return ResetPasswordSession.find({
      where: {
        _id: req.params.id
      }
    })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new ResetPasswordSession in the DB
export function create(req, res) {

  User.find({

    attributes: ['id'],
    where: {

      active: true,
      email: req.body.email
    },
    raw: true

  }).then(function(user) {

    if (user === null) {

      res.status(500).json("Invalid User Email.")
      return;
    }
    var resetPasswordSession = {}
    resetPasswordSession.user_id = user.id;
    resetPasswordSession.token = uuid.v1();

    ResetPasswordSession.create(resetPasswordSession)
      .then(function(session) {

        var emailSubject = 'Reset Password';
        //var resetLink=req.get('host')+'/forgotpassword/'+session.dataValues.token;
        var html = '<p>Click below button to reset your password</p><button style="background-color:#4CAF50;padding:10px 20px 10px 20px;border-radius:3px;"><a style="color:white;" href=' + req.protocol + '://' + req.get('host') + '/resetpassword/' + session.dataValues.token + '>Reset Password </a></button>'

        mailer.sendMail(config.mail.sender, req.body.email, emailSubject, null, html)
          .then(function() {

            res.status(200).json("Success")
          })

          .catch(function(error){
            res.status(500).json("Internal server error, Please try again later")
          })
      })

  })
}

export function changePassword(req, res) {

  var script = 'select * from reset_password_session where active=true and token=\'' + req.body.token + '\' and created_at > current_date - 1'
  db.sequelize.query(script)
    .then(function(session) {

      if (session[0].length === 0) {

        res.status(500).json("Session Expired.")
        return;
      }
      User.find({

          where: {

            active: true,
            id: session[0][0].user_id
          }
        })
        .then(function(user) {


          user.password = req.body.newPassword;
          user.save()
            .then(function(user) {

              

              ResetPasswordSession.update({

                active: false
              }, {
                where: {

                  user_id: user.dataValues.id
                }

              }).then(function() {

                var token = jwt.sign({

                  id: user.id
                }, config.secrets.session, {

                  expiresIn: 60 * 60 * 5
                });
                res.json({

                  token
                });
              })
            })
        })
    })
}



export function validateLink(req, res) {

  var script = 'select * from reset_password_session where active=true and token=\'' + req.params.token + '\' and created_at > current_date - 1'
  db.sequelize.query(script)
    .then(function(session) {

      if (session[0].length === 0) {

        res.status(500).json("Session Expired.")
        return;
      } else
        res.status(200).json("Valid Session.")
    })
}

// Updates an existing ResetPasswordSession in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return ResetPasswordSession.find({
      where: {
        _id: req.params.id
      }
    })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a ResetPasswordSession from the DB
export function destroy(req, res) {
  return ResetPasswordSession.find({
      where: {
        _id: req.params.id
      }
    })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}