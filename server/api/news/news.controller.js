/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/news              ->  index
 * POST    /api/news              ->  create
 * GET     /api/news/:id          ->  show
 * PUT     /api/news/:id          ->  update
 * DELETE  /api/news/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import db from '../../sqldb';

var News = db.news;

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


export function getAllNews(req, res) {

  var script = {};

  script.order = [
    ['created_at', 'DESC']
  ]

  script.limit = req.params.limit;

  script.where = {
    active: true
  }
  

  News.findAll(script)
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a list of Newss
export function index(req, res) {

  var script = {};

  if (req.body['sortBy'] !== undefined) {

    script.order = [
      [req.body['sortBy'].attribute, req.body['sortBy'].direction]
    ]
  }

  script.limit = req.body.limit;
  script.offset = req.body.offset;
  script.where = {
    active: true
  }

  News.findAndCountAll(script)
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single News from the DB
export function show(req, res) {
  News.find({
      where: {
        id: req.params.id
      }
    })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new News in the DB
export function create(req, res) {

  //req.body.user_id=req.user.id;

  News.create(req.body)
    .then(function(news) {
      res.status(200).json(news);
    })
    .catch(function(err) {

      res.status(500).json(err);
    })

}

// Updates an existing News in the DB
export function update(req, res) {

  News.find({
      where: {
        id: req.body.news_id
      }
    })
    .then(function(news) {
      if (news === null) {
        res.status(500).json("Invalid News");
        return;
      }

      news.description = req.body.details.description;
      news.title = req.body.details.title;
      news.save()
        .then(function(data) {
          res.status(200).json(data);
        })

    })
}

// Deletes a News from the DB
export function destroy(req, res) {

  News.find({
      where: {
        id: req.body.news_id
      }
    })
    .then(function(news) {

      if (news === null) {

        res.status(500).json("Invalid Coupon");
        return;
      }

      news.active = false;
      news.save()
        .then(function() {
          res.status(200).json("Success");
        })
    })
}