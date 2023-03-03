/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/cart_products              ->  index
 * POST    /api/cart_products              ->  create
 * GET     /api/cart_products/:id          ->  show
 * PUT     /api/cart_products/:id          ->  update
 * DELETE  /api/cart_products/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import db from '../../sqldb';

var CartProduct = db.cart_product;
var Cart = db.cart;
var cartController = require('../cart/cart.controller.js')

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

// Gets a list of CartProducts
export function index(req, res) {
  CartProduct.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single CartProduct from the DB
export function show(req, res) {
  CartProduct.find({
      where: {
        id: req.params.id
      }
    })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new CartProduct in the DB
export function create(req, res) {
  CartProduct.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing CartProduct in the DB
export function update(req, res) {
  if (req.body.id) {
    delete req.body.id;
  }
  CartProduct.find({
      where: {
        id: req.params.id
      }
    })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a CartProduct from the DB
export function destroy(req, res) {
  CartProduct.find({
      where: {
        id: req.params.id
      }
    })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}


export function removeProduct(req, res) {

  Cart
    .find({
      where: {
        user_id: req.user.id
      }
    }).then(function(cart) {

      CartProduct.find({

        where: {
          cart_id: cart.dataValues.id,
          product_id: req.body.product_id
        }
      }).then(function(product) {

        if (product === null) {
          res.status(500).json("Invalid Product");
          return;
        }

        product.destroy().then(function() {

          res.status(200).json("Success");
          return;

          // cartController.cartTotal(req.user.id)
          //   .then(function(price) {

          //     console.log("cart cartTotal ", price)
          //   })
          // CartProduct.count({
          //     where: {
          //       cart_id: cart.dataValues.id,
          //     }
          //   })
          //   .then(function(productCount) {

          //     //console.log("productCountt", productCount)

          //     if (productCount === 0) {

          //       Cart.find({

          //           where: {

          //             id: cart.dataValues.id,
          //             coupon_id: {
          //               $ne: null
          //             }
          //           }
          //         })
          //         .then(function(userCart) {

          //           if (userCart === null) {
          //             res.status(200).json("Success");
          //             return;
          //           }

          //           userCart.coupon_id = null;
          //           userCart.save()
          //             .then(function() {

          //               res.status(200).json("Success");
          //               return;
          //             })

          //         })
          //     } else {

          //       res.status(200).json("Success");
          //       return;
          //     }
          //   })


        })
      })
    }).catch(handleError(res));
}