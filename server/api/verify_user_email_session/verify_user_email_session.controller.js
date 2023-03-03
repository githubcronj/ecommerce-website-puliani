/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/verify_user_email_sessions              ->  index
 * POST    /api/verify_user_email_sessions              ->  create
 * GET     /api/verify_user_email_sessions/:id          ->  show
 * PUT     /api/verify_user_email_sessions/:id          ->  update
 * DELETE  /api/verify_user_email_sessions/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import db from '../../sqldb';
var config = require("../../config/environment");
import jwt from 'jsonwebtoken';
var uuid = require('uuid');
var mailer = require("../../lib/mail.js")
var verifyEmailConfig = require('../verify_user_email_session/verifyEmailConfig.json');

var VerifyUserEmailSession = db.verify_user_email_session;
var User = db.user;
var sequelize = db.sequelize;


export function validateLink(req, res) {

  var script = 'select * from verify_user_email_session where active=true and token=\'' + req.params.token + '\' and created_at > current_date - 1'

  db.sequelize.query(script)
    .then(function(session) {

      if (session[0].length === 0) {

        res.status(500).json("Session Expired.")
        return;
      } else
        res.status(200).json("Valid Session.")
    })
}


export function setUserEmailAsVerified(req, res) {

  var script = 'select * from verify_user_email_session where active=true and token=\'' + req.params.token + '\' and created_at > current_date - 1'
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
      }).then(function(user) {

        console.log("user->", user);
        user.isEmailVerified = true;

        user.save()
          .then(function() {

            VerifyUserEmailSession.update({

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
    });
}

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
    var verifyUserEmail = {}
    verifyUserEmail.user_id = user.id;
    verifyUserEmail.token = uuid.v1();

    VerifyUserEmailSession.create(verifyUserEmail)
      .then(function(session) {

        var emailSubject = 'Verify Puliani Account';
        //var resetLink=req.get('host')+'/forgotpassword/'+session.dataValues.token;
        var html = '<p>Please click on below button to activate your Puliani Account</p><a href=' + req.protocol + '://' + req.get('host') + '/verifyaccount/' + session.dataValues.token + '> <button style="background-color: #4CAF50;border: none;color: white;padding: 5px 10px;text-align: center;text-decoration: none;cursor: pointer;display: inline-block;font-size: 16px;">Verify Account </button> </a>'

        mailer.sendMail(config.mail.sender, req.body.email, emailSubject, null, html)
          .then(function() {

            res.status(200).json("Success")
            sendRegistrationEmail(user, req);
          })
      })

  })
}

function sendRegistrationEmail(user, req) {
  console.log("user--->" + JSON.stringify(user));
  var script = 'select first_name,email from "user" where id=' + user.id;
  db.sequelize.query(script, {

      type: sequelize.QueryTypes.SELECT
    })
    .then(function(userDetails) {
      console.log("user--->" + JSON.stringify(userDetails));
      var html = '<span>Hi&nbsp;' + userDetails[0].first_name + ',</span><br><br>' +
        '<span>Greetings!</span><span><br class="kix-line-break" />' +
        '</span><span>' +
        '<br class="kix-line-break" /></span>' +
        '<span>Thank you for joining us and welcome to Puliani Law Books.</span>' +
        '<span><br class="kix-line-break" /></span>' +
        '<span>Sign&nbsp;in email&nbsp;</span>' +
        '<span>' + userDetails[0].email + '</span><br>' +
        '<span>If you forget your password, there is a link on the&nbsp;sign-in page to reset&nbsp;</span>' +
        '<span><br class="kix-line-break" /></span>' +
        '<span>your password.</span><span>&nbsp;</span>' +
        '<span>To view and update your account,&nbsp;</span>' +
        '<span><a href=\"' + req.protocol + '://' + req.get('host') + '/redirect?goto=myaccount\"' + '>click here</a><span>' +
        '<span><br class="kix-line-break" /></span><span><br class="kix-line-break" /></span></a>' +
        '<span>You can now:</span><span>' +
        '<br class="kix-line-break" /></span></p>' +
        '<ul>' +
        '  <li dir="ltr">' +
        ' <p dir="ltr"><span>Check your order status and history</span></p>' +
        '</li>' +
        '<li dir="ltr">' +
        '  <p dir="ltr"><span>Store and manage multiple delivery addresses</span></p>' +
        '</li>' +
        '<li dir="ltr">' +
        '<p dir="ltr"><span>Update your profile and preferences</span></p>' +
        '</li>' +
        '<li dir="ltr">' +
        '<p dir="ltr"><span>Enjoy speedier checkout next time you shop online</span></p>' +
        '</li>' +
        '</ul>' +
        '<p dir="ltr"><span><br class="kix-line-break" /></span><span>Now that you have&nbsp;signed&nbsp;up&nbsp;for our newsletters then you\'ll be the first to receive early previews of new releases and online exclusive promotions</span></p>' +
        '<p dir="ltr"><span> &rdquo;Explore <a href=\"' + req.protocol + '://' + req.get('host') + '\">Puliani Law Books.com</a>&rdquo;</span></p>' +
        '<p dir="ltr"><span style="font-size:10px">Thank you and happy shopping</span></p>' +
        '<span style="font-size:10px"><b>Puliani Customer Care Team</b></span>';

      mailer.sendMail(config.mail.sender, userDetails[0].email, "Successfully Registered", null, html);
    });

}



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

// Gets a list of VerifyUserEmailSessions
export function index(req, res) {
  return VerifyUserEmailSession.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single VerifyUserEmailSession from the DB
export function show(req, res) {
  return VerifyUserEmailSession.find({
      where: {
        _id: req.params.id
      }
    })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new VerifyUserEmailSession in the DB

// Updates an existing VerifyUserEmailSession in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return VerifyUserEmailSession.find({
      where: {
        _id: req.params.id
      }
    })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a VerifyUserEmailSession from the DB
export function destroy(req, res) {
  return VerifyUserEmailSession.find({
      where: {
        _id: req.params.id
      }
    })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}