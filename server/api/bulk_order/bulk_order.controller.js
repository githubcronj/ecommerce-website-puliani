/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/bulk_orders              ->  index
 * POST    /api/bulk_orders              ->  create
 * GET     /api/bulk_orders/:id          ->  show
 * PUT     /api/bulk_orders/:id          ->  update
 * DELETE  /api/bulk_orders/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import db from '../../sqldb';

var BulkOrder = db.bulk_order;

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

// Gets a list of BulkOrders
export function index(req, res) {

  var script = 'select *';
  script += ' from bulk_order'
  script += ' where CONCAT(user_name,\' \',user_email,\' \',user_phone_number,\' \',text) ilike \'%' + req.body.searchString + '%\'';

  if (req.body["sortBy"] !== undefined) {

    script += ' order by ' + req.body.sortBy.attribute + ' ' + req.body.sortBy.direction;
  }
  script += ' limit ' + req.body.limit + ' offset ' + req.body.offset + ';';


  db.sequelize.query(script)
    .then(function(data) {

      var countScript = 'select count(*) from bulk_order';
      countScript += ' where CONCAT(user_name,\' \',user_email,\' \',user_phone_number,\' \',text) ilike \'%' + req.body.searchString + '%\'';
      db.sequelize.query(countScript)
        .then(function(count) {

          
          var response = {};
          response.count = count[0][0].count;
          response.rows = data[0]
          res.status(200).json(response)

        })
    })
}

// Gets a single BulkOrder from the DB
export function show(req, res) {
  BulkOrder.find({
      where: {
        _id: req.params.id
      }
    })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new BulkOrder in the DB
export function create(req, res) {

  BulkOrder.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing BulkOrder in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  BulkOrder.find({
      where: {
        _id: req.params.id
      }
    })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a BulkOrder from the DB
export function destroy(req, res) {
  BulkOrder.find({
      where: {
        _id: req.params.id
      }
    })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}