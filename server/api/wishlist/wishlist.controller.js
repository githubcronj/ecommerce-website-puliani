/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/wishlists              ->  index
 * POST    /api/wishlists              ->  create
 * GET     /api/wishlists/:id          ->  show
 * PUT     /api/wishlists/:id          ->  update
 * DELETE  /api/wishlists/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import db from '../../sqldb';
var cartController = require('../cart/cart.controller.js');

var Wishlist = db.wishlist;
var CartProduct = db.cart_product;
var Cart = db.cart;
var Product = db.product;

function respondWithResult(res, message, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (message) {
      res.status(statusCode).json(message);
    } else {
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

function handleEntityNotFound(res, message) {
  return function(entity) {
    if (!entity) {
      if (message !== undefined)
        res.status(404).json(message);
      else
        res.status(404).json();
      return null;
    }
    return entity;
  };
}

function handleError(res, message, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    if (message) {
      res.status(statusCode).json(message);
    } else {
      res.status(statusCode).json(err);
    }
  };
}

// Gets a list of Wishlists
export function index(req, res) {
  Wishlist.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Wishlist from the DB
export function show(req, res) {
  Wishlist.find({
      where: {
        id: req.params.id
      }
    })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Wishlist in the DB
export function create(req, res) {
  Wishlist.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Wishlist in the DB
export function update(req, res) {
  if (req.body.id) {
    delete req.body.id;
  }
  Wishlist.find({
      where: {
        id: req.params.id
      }
    })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Wishlist from the DB
export function destroy(req, res) {
  Wishlist.find({
      where: {
        id: req.params.id
      }
    })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

export function addToWishlist(req, res) {

  Wishlist.create({

      user_id: req.user.id,
      product_id: req.body.product_id
    })
    .then(respondWithResult(res, "Success"))
    .catch(handleError(res, "Product Already Exists"));

}

export function removeProduct(req, res) {
  Wishlist.find({
      where: {
        user_id: req.user.id,
        product_id: req.body.product_id
      }
    })
    .then(handleEntityNotFound(res, "Product Doesn't Exist."))
    .then(function(product) {
      if (product !== null) {
        product.destroy()
          .then(respondWithResult(res, "Success"))
      }

    })
    .catch(handleError(res));
}

export function getWishlistDetails(req, res) {

  var wishListDetails = [];
  Wishlist.findAll({
      where: {
        user_id: req.user.id,
      },
      limit:req.body.limit,
      offset:req.body.offset,
      raw: true
    })
    .then(function(wishlistProducts) {

      if(wishlistProducts.length===0){

        res.status(200).json(wishlistProducts);
        return;
      }

      var attributes = ['id', 'name', 'orignal_price', 'short_description', 'long_description', 'discount_price', 'images', 'attribute', 'units_in_stock'];
      var count = 0;

      for (var i = 0; i < wishlistProducts.length; i++) {

        Product.getProduct(Product, attributes, wishlistProducts[i].product_id, undefined)
          .then(function(product) {

            count++;

            wishListDetails.push(product);
            if (count === wishlistProducts.length) {

              res.status(200).json(wishListDetails);
              return;
            }

          }).catch(function(err) {
            res.status(500).json(err);
          })
      }
    })
    .catch(handleError(res));
}

export function addWishlistProductToCart(req, res) {

  Cart.getCart(Cart, ['id'], undefined, req.user.id)
    .then(function(cart) {

      return CartProduct.getCartProducts(CartProduct, ['quantity'], cart.id, req.body.product_id);
    })
    .then(function(cartProduct) {

      if (cartProduct.length !== 0) {

        res.status(500).send("Product is already added to cart.");
        return;
      }

      cartController.validateStock(req.body.product_id, 1).then(function() {

        Cart
          .findOrCreate({
            where: {
              user_id: req.user.id
            }
          }).then(function(cart) {

            CartProduct.create({

                quantity: 1,
                cart_id: cart[0].dataValues.id,
                product_id: req.body.product_id

              }).then(function() {

                res.status(200).send("Success");
              })
              .catch(function(err) {

                if (err.name.valueOf() === 'SequelizeForeignKeyConstraintError')
                  res.status(500).send("Invalid Product");
                else
                  res.status(500).send(err);
              });
          })

      }).catch(function(err) {

        if (err.valueOf() === 'Stock Not Available')
          res.status(500).send("Stock Not Available");
      });

    }).catch(function(err) {

      res.status(500).send(err);
    })
}