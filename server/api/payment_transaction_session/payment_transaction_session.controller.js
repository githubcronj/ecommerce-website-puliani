/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/payment_transaction_sessions              ->  index
 * POST    /api/payment_transaction_sessions              ->  create
 * GET     /api/payment_transaction_sessions/:id          ->  show
 * PUT     /api/payment_transaction_sessions/:id          ->  update
 * DELETE  /api/payment_transaction_sessions/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import {PaymentTransactionSession} from '../../sqldb';

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

// Gets a list of PaymentTransactionSessions
export function index(req, res) {
  PaymentTransactionSession.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single PaymentTransactionSession from the DB
export function show(req, res) {
  PaymentTransactionSession.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new PaymentTransactionSession in the DB
export function create(req, res) {
  PaymentTransactionSession.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing PaymentTransactionSession in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  PaymentTransactionSession.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a PaymentTransactionSession from the DB
export function destroy(req, res) {
  PaymentTransactionSession.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
