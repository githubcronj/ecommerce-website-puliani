/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/comming_soon/              ->  index
 * POST    /api/comming_soon/              ->  create
 * GET     /api/comming_soon//:id          ->  show
 * PUT     /api/comming_soon//:id          ->  update
 * DELETE  /api/comming_soon//:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import db from '../../sqldb';

var CommingSoon=db.comming_soon;
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

// Gets a list of CommingSoons
export function index(req, res) {
  return CommingSoon.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single CommingSoon from the DB
export function show(req, res) {
  return CommingSoon.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new CommingSoon in the DB
export function create(req, res) {
  return CommingSoon.create(req.body)
    .then(function(data){

      console.log("data ",data)
      res.status(200).send("success");
    })
    .catch(function(err){

      
      if(err.name==='SequelizeUniqueConstraintError'){

        console.log("err ",err.name)  
        res.status(500).send("SequelizeUniqueConstraintError");
        return;
      }
      else
        res.status(500).send("error");
      
    });
}

// Updates an existing CommingSoon in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return CommingSoon.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a CommingSoon from the DB
export function destroy(req, res) {
  return CommingSoon.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
