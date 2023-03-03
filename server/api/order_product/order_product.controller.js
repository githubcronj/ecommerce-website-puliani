/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/order_products              ->  index
 * POST    /api/order_products              ->  create
 * GET     /api/order_products/:id          ->  show
 * PUT     /api/order_products/:id          ->  update
 * DELETE  /api/order_products/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import db from '../../sqldb';
import Q from 'q';

var OrderProduct = db.order_product;
var Order = db.order;
var Product = db.product;
var Coupon = db.coupon;

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

// Gets a list of OrderProducts
export function index(req, res) {
  OrderProduct.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single OrderProduct from the DB
export function show(req, res) {
  OrderProduct.find({
      where: {
        id: req.params.id
      }
    })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new OrderProduct in the DB
export function create(req, res) {
  OrderProduct.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing OrderProduct in the DB
export function update(req, res) {
  if (req.body.id) {
    delete req.body.id;
  }
  OrderProduct.find({
      where: {
        id: req.params.id
      }
    })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a OrderProduct from the DB
export function destroy(req, res) {
  OrderProduct.find({
      where: {
        id: req.params.id
      }
    })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

export function getBestSellers(req, res) {

  var script = "SELECT product_id, SUM(quantity) AS total_quantity FROM order_product GROUP BY product_id ORDER BY total_quantity DESC LIMIT " + req.body.limit + " OFFSET " + req.body.offset;

  db.sequelize.query(script, {

      type: db.sequelize.QueryTypes.SELECT
    }).then(function(output) {



      var productTotalSellMapping = {};

      for (var j = 0; j < output.length; j++) {

        productTotalSellMapping[output[j].product_id] = output[j].total_quantity;
      }

      var productDetails = [];

      if (output.length === 0) {

        res.status(200).json(productDetails);
        return;
      }

      var count = 0;
      var attributes = ['id', 'name', 'orignal_price', 'discount_price', 'units_in_stock', 'images'];

      for (var i = 0; i < output.length; i++) {

        Product.getProduct(Product, attributes, output[i].product_id, undefined)
          .then(function(product) {

            product.totalSell = productTotalSellMapping[product.id]
            count++;

            productDetails.push(product);

            if (count === output.length) {


              res.status(200).json(productDetails);
            }
          })
      }

    })
    .catch(function(err) {


      res.status(500).json(err)
    });
}

export function getOrderProducts(req, res) {

  var data = {};
  var orderDetails = {}


  Order.find({

      attributes: {
        exclude: ['created_at', 'updated_at', 'user_id']
      },
      where: {
        user_id: req.user.id,
        order_number: req.params.order_number
      },
      raw: true
    })
    .then(function(order) {

      if (order === null) {

        res.status(200).json(orderDetails);
        return;
      }


      orderDetails.order = order;
      var attributes = {
        exclude: ['active', 'created_at', 'updated_at']
      }

      return Coupon.getCoupon(Coupon, attributes, order.coupon_id, undefined)
    })
    .then(function(coupon) {

      orderDetails.coupon = coupon;

      return OrderProduct.findAll({

        where: {

          order_id: orderDetails.order.id
        },
        raw: true
      })

    }).then(function(orderProducts) {

      if (orderProducts.length === 0) {
        
        orderDetails.products = [];
        res.status(200).json(orderDetails);
        return;
      }

      var productQuantity = {};

      var attributes = ['id', 'name', 'orignal_price', 'discount_price', 'images', 'attribute', 'units_in_stock'];

      for (var i = 0; i < orderProducts.length; i++) {
        productQuantity[orderProducts[i].product_id] = orderProducts[i].quantity;
      }
      var count = 0;
      orderDetails.products = [];
      for (var i = 0; i < orderProducts.length; i++) {

        Product.getProduct(Product, attributes, orderProducts[i].product_id, undefined)
          .then(function(product) {


            count++;
            product.quantity = productQuantity[product.id];
            orderDetails.products.push(product);
            if (count === orderProducts.length) {

              res.status(200).json(orderDetails);
            }
          })
      }
    })
}