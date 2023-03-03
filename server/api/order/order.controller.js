/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/orders              ->  index
 * POST    /api/orders              ->  create
 * GET     /api/orders/:id          ->  show
 * PUT     /api/orders/:id          ->  update
 * DELETE  /api/orders/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import db from '../../sqldb';
var cartController = require('../cart/cart.controller.js');
var Q = require('q');
var arraySort = require('array-sort');
var mailer = require("../../lib/mail.js")
var config = require("../../config/environment")
var payUMoneyConfig = require("../../payUMoneyConfig.json")
var uuid = require('uuid');
var crypto = require('crypto');
var wkhtmltopdf = require('wkhtmltopdf');
var Order = db.order;
var PaymentTransactionSession = db.payment_transaction_session;
const fs = require('fs');
var User = db.user;
var Product = db.product;

var Coupon = db.coupon;
var Cart = db.cart;
var CartProduct = db.cart_product;
var OrderProduct = db.order_product;
var Shipment = db.shipment;
var sequelize = db.sequelize;


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

export function adminViewFullOrder(req, res) {

  var script = 'select u.id as user_id, u.first_name, u.last_name, u.email, o.id as order_id, o.order_number, o.total_price, o.shipping_charge, o.total_discount_price, o.status, o.delivery_address, o.estimated_delivery_date, s.id as shipment_id, s.tracking_number, s.progress, s.dispatch_date, s.actual_delivery_date, c.id as coupon_id, c.code as coupon_code, c.minimum_cart, c.start_date, c.expiry_date, c.operation, c.value, c.is_single_use, c.description, c.terms';
  script += ' from "user" as u inner join (select * from "order" where id=' + req.params.order_id + ') as o on u.id=o.user_id left outer join "shipment" as s on o.id=s.order_id left join "coupon" as c on c.id=o.coupon_id';

  db.sequelize.query(script)
    .then(function(order) {

      var productScript = 'select p.id, p.name, p.sku, p.images, op.unit_price, op.quantity';
      productScript += ' from (select * from "order_product" where order_id=' + req.params.order_id + ') as op inner join "product" as p on op.product_id=p.id'

      db.sequelize.query(productScript)
        .then(function(products) {

          var response = {}

          response = order[0][0];
          response.products = products[0]

          res.status(200).json(response)
        })
    })
}

function generate(pdfContent, res) {
  //console.log("PDF-->"+pdfContent);
  var doc = wkhtmltopdf('' + pdfContent, {
    output: 'admin/export/exported.pdf'
  }, function(data) {
    //res.sendFile('INV_'+orderDetails[0].order_number+'.pdf' , { root : '../puliani-book-store/invoices/'}); // Set disposition and send it.
    // res.setHeader("Content-Type", "application/pdf");
    //res.setHeader('Content-type', "application/pdf");
    //console.log("path"+config.root+'/invoices/INV_'+orderDetails[0].order_number+'.pdf');
    //res.download(config.root+'/invoices/INV_'+orderDetails[0].order_number+'.pdf','report.pdf')
    res.status(200).json({
      "message": "Exported"
    });

    //var file = fs.createReadStream('invoices/INV_'+orderDetails[0].order_number+'.pdf');
    //var stat = fs.statSync('invoices/INV_'+orderDetails[0].order_number+'.pdf');
    //res.setHeader('Content-Length', stat.size);
    //res.setHeader('Content-Type', 'text/pdf');
    //res.setHeader('Content-Disposition', 'attachment; filename=quote.pdf');
    //file.pipe(res);
    //res.sendFile('INV_'+orderDetails[0].order_number+'.pdf',{ root : '../puliani-book-store/invoices/'})
  });
}
export function exportPDF(req, res) {
  if (req.body.user_id)
    arrangeOrders(req.body.user_id, res)
  if (req.body.order_id)
    arrangeOrder(req.body.order_id, res)
}


function arrangeOrders(userid, res) {
  var pdfContent = "";
  var userId = userid
  var orderDetails = [];
  Order.findAll({

      attributes: {
        exclude: ['updated_at', 'user_id']
      },
      where: {
        user_id: userId
      },

      raw: true
    })
    .then(function(order) {

      if (order.length === 0) {

        res.status(200).json(order);
        return;
      }

      var attributes = {
        exclude: ['active', 'created_at', 'updated_at']
      }

      var count = 0;
      var orderData = {}
      var orderCouponMapping = {};

      for (var i = 0; i < order.length; i++) {

        orderCouponMapping[order[i].id] = order[i].coupon_id;
        orderData[order[i].id] = {}
      }

      for (var i = 0; i < order.length; i++) {

        orderData[order[i].id].orderInfo = order[i];

        OrderProduct.findAll({

          where: {

            order_id: order[i].id
          },
          raw: true
        })

        .then(function(orderProducts) {

          Shipment.find({

              where: {
                order_id: orderProducts[0].order_id
              }
            })
            .then(function(shipment) {

              if (shipment)
                orderData[orderProducts[0].order_id].shipment = shipment.dataValues;

              Coupon.getCoupon(Coupon, attributes, orderCouponMapping[orderProducts[0].order_id], undefined)

              .then(function(coupon) {

                orderData[orderProducts[0].order_id].coupon = coupon;

                count++;

                var productQuantity = {};

                var attributes = ['id', 'name', 'orignal_price', 'discount_price', 'images', 'attribute', 'units_in_stock'];

                for (var j = 0; j < orderProducts.length; j++) {
                  productQuantity[orderProducts[j].product_id] = orderProducts[j].quantity;
                }
                var count1 = 0;
                orderData[orderProducts[0].order_id].products = [];
                for (var j = 0; j < orderProducts.length; j++) {

                  Product.getProduct(Product, attributes, orderProducts[j].product_id, undefined)
                    .then(function(product) {

                      count1++;
                      product.quantity = productQuantity[product.id];
                      orderData[orderProducts[0].order_id].products.push(product);
                      if (count1 === orderProducts.length) {
                        orderDetails.push(orderData[orderProducts[0].order_id]);

                        if (orderProducts[0].order_id === order[order.length - 1].id) {

                          orderDetails = arraySort(orderDetails, 'orderInfo.created_at', {
                            reverse: true
                          });

                          orderDetails.forEach(function(order) {


                            pdfContent += '<div style="max-width:800px;margin:auto;box-shadow:white;font-size:16px;font-weight:700;line-height:24px;"> ' +
                              '<table> <tr>' +
                              '<td style="width:100%;text-align:left;">' +
                              '<b>Delivery Address:</b><br/>' + order.orderInfo.delivery_address.name + '<br/>' +
                              '<b>' + order.orderInfo.delivery_address.address + '</b><br/>' +
                              '<b>' + order.orderInfo.delivery_address.city + ' - ' + order.orderInfo.delivery_address.pincode + '</b><br/> </td></tr>' +
                              '<tr><td style="width:30%;font-weight: normal; text-align:left;"> Order No:<b>' + order.orderInfo.order_number +
                              '</b><br/> Date:<b>21/06/2016</b><br/> </td> </tr> </table><br><br>' +
                              '<table style="page-break-after:always; border-collapse: collapse;border: 1px solid black;">' +
                              '<tr> <th style="border-collapse: collapse;border: 1px solid black;text-align:center;">' +
                              'SI.NO</th> <th style="border-collapse: collapse;border: 1px solid black;text-align:center;">' +
                              'Product Description</th>' +
                              '<th style="border-collapse: collapse;border: 1px solid black;text-align:center;">' +
                              'Qty</th> <th style="border-collapse: collapse;border: 1px solid black;text-align:center;">' +
                              'Rate</th> <th style="border-collapse: collapse;border: 1px solid black;text-align:center;">' +
                              'Amount</th> </tr>';

                            var count = 1;
                            order.products.forEach(function(prod) {
                              pdfContent += '<tr> <td style="border-collapse: collapse;border: 1px solid black;width:10%;font-weight: normal; text-align:center;">' + (count++) + '</td>';
                              pdfContent += '<td style="border-collapse: collapse;border: 1px solid black;width:40%;text-align:center;font-weight: normal;">' + prod.name + '</td>';
                              pdfContent += '<td style="border-collapse: collapse;border: 1px solid black;width:10%;font-weight: normal; text-align:center;">' + prod.quantity + '</td>';
                              pdfContent += '<td style="border-collapse: collapse;border: 1px solid black;width:10%;font-weight: normal; text-align:center;">' + prod.discount_price + ' </td>';
                              pdfContent += '<td style="border-collapse: collapse;border: 1px solid black;width:10%;font-weight: normal; text-align:center;">' + (prod.discount_price * prod.quantity) + '</td> </tr>';
                            });


                            pdfContent += '<tr> <td style="border-top: 1px solid black;width:10%;font-weight: normal; text-align:left;">' +
                              '</td> <td style="border-top: 1px solid black;width:40%;font-weight: normal; text-align:left;">' +
                              '</td> <td style="border-top: 1px solid black;width:10%;font-weight: normal; text-align:left;">' +
                              '</td> <td style="border-top: 1px solid black;width:10%;font-weight: normal; text-align:center;">' +
                              'Order Value</td>' +
                              '<td style="border-top: 1px solid black;width:10%;font-weight: normal; text-align:center;">' + order.orderInfo.total_price + '</td> </tr>' +
                              '<tr> <td style="border-top: 1px solid black;width:10%;font-weight: normal; text-align:left;"></td>' +
                              '<td style="border-top: 1px solid black;width:40%;font-weight: normal; text-align:center;">Freight charges</td>' +
                              '<td style="border-top: 1px solid black;width:10%;font-weight: normal; text-align:center;">' + order.orderInfo.shipping_charge + '</td>' +
                              '<td style="border-top: 1px solid black;width:10%;font-weight: normal; text-align:center;">Total</td>' +
                              '<td style="border-top: 1px solid black;width:10%;font-weight: normal; text-align:center;">' + (parseFloat(order.orderInfo.shipping_charge) + parseFloat(order.orderInfo.total_price)) + '</td> </tr></table></div>';



                          });
                          generate(pdfContent, res)



                        }
                      }
                    })
                }
              })

            })
        })
      }
    })

  return true;
}

function arrangeOrder(orderId, res) {
  var pdfContent = "";
  var orderid = orderId
  var orderDetails = [];
  Order.findAll({

      attributes: {
        exclude: ['updated_at', 'user_id']
      },
      where: {
        id: orderid
      },

      raw: true
    })
    .then(function(order) {

      if (order.length === 0) {

        res.status(200).json(order);
        return;
      }

      var attributes = {
        exclude: ['active', 'created_at', 'updated_at']
      }

      var count = 0;
      var orderData = {}
      var orderCouponMapping = {};

      for (var i = 0; i < order.length; i++) {

        orderCouponMapping[order[i].id] = order[i].coupon_id;
        orderData[order[i].id] = {}
      }

      for (var i = 0; i < order.length; i++) {

        orderData[order[i].id].orderInfo = order[i];

        OrderProduct.findAll({

          where: {

            order_id: order[i].id
          },
          raw: true
        })

        .then(function(orderProducts) {

          Shipment.find({

              where: {
                order_id: orderProducts[0].order_id
              }
            })
            .then(function(shipment) {

              if (shipment)
                orderData[orderProducts[0].order_id].shipment = shipment.dataValues;

              Coupon.getCoupon(Coupon, attributes, orderCouponMapping[orderProducts[0].order_id], undefined)

              .then(function(coupon) {

                orderData[orderProducts[0].order_id].coupon = coupon;

                count++;

                var productQuantity = {};

                var attributes = ['id', 'name', 'orignal_price', 'discount_price', 'images', 'attribute', 'units_in_stock'];

                for (var j = 0; j < orderProducts.length; j++) {
                  productQuantity[orderProducts[j].product_id] = orderProducts[j].quantity;
                }
                var count1 = 0;
                orderData[orderProducts[0].order_id].products = [];
                for (var j = 0; j < orderProducts.length; j++) {

                  Product.getProduct(Product, attributes, orderProducts[j].product_id, undefined)
                    .then(function(product) {

                      count1++;
                      product.quantity = productQuantity[product.id];
                      orderData[orderProducts[0].order_id].products.push(product);
                      if (count1 === orderProducts.length) {
                        orderDetails.push(orderData[orderProducts[0].order_id]);

                        if (orderProducts[0].order_id === order[order.length - 1].id) {

                          orderDetails = arraySort(orderDetails, 'orderInfo.created_at', {
                            reverse: true
                          });

                          orderDetails.forEach(function(order) {


                            pdfContent += '<div style="max-width:800px;margin:auto;box-shadow:white;font-size:16px;font-weight:700;line-height:24px;"> ' +
                              '<table> <tr>' +
                              '<td style="width:100%;text-align:left;">' +
                              '<b>Delivery Address:</b><br/>' + order.orderInfo.delivery_address.name + '<br/>' +
                              '<b>' + order.orderInfo.delivery_address.address + '</b><br/>' +
                              '<b>' + order.orderInfo.delivery_address.city + ' - ' + order.orderInfo.delivery_address.pincode + '</b><br/> </td></tr>' +
                              '<tr><td style="width:30%;font-weight: normal; text-align:left;"> Order No:<b>' + order.orderInfo.order_number +
                              '</b><br/> Date:<b>21/06/2016</b><br/> </td> </tr> </table><br><br>' +
                              '<table style="border-collapse: collapse;border: 1px solid black;">' +
                              '<tr> <th style="border-collapse: collapse;border: 1px solid black;text-align:center;">' +
                              'SI.NO</th> <th style="border-collapse: collapse;border: 1px solid black;text-align:center;">' +
                              'Product Description</th>' +
                              '<th style="border-collapse: collapse;border: 1px solid black;text-align:center;">' +
                              'Qty</th> <th style="border-collapse: collapse;border: 1px solid black;text-align:center;">' +
                              'Rate</th> <th style="border-collapse: collapse;border: 1px solid black;text-align:center;">' +
                              'Amount</th> </tr>';

                            var count = 1;
                            order.products.forEach(function(prod) {
                              pdfContent += '<tr> <td style="border-collapse: collapse;border: 1px solid black;width:10%;font-weight: normal; text-align:center;">' + (count++) + '</td>';
                              pdfContent += '<td style="border-collapse: collapse;border: 1px solid black;width:40%;text-align:center;font-weight: normal;">' + prod.name + '</td>';
                              pdfContent += '<td style="border-collapse: collapse;border: 1px solid black;width:10%;font-weight: normal; text-align:center;">' + prod.quantity + '</td>';
                              pdfContent += '<td style="border-collapse: collapse;border: 1px solid black;width:10%;font-weight: normal; text-align:center;">' + prod.discount_price + ' </td>';
                              pdfContent += '<td style="border-collapse: collapse;border: 1px solid black;width:10%;font-weight: normal; text-align:center;">' + (prod.discount_price * prod.quantity) + '</td> </tr>';
                            });


                            pdfContent += '<tr> <td style="border-top: 1px solid black;width:10%;font-weight: normal; text-align:left;">' +
                              '</td> <td style="border-top: 1px solid black;width:40%;font-weight: normal; text-align:left;">' +
                              '</td> <td style="border-top: 1px solid black;width:10%;font-weight: normal; text-align:left;">' +
                              '</td> <td style="border-top: 1px solid black;width:10%;font-weight: normal; text-align:center;">' +
                              'Order Value</td>' +
                              '<td style="border-top: 1px solid black;width:10%;font-weight: normal; text-align:center;">' + order.orderInfo.total_price + '</td> </tr>' +
                              '<tr> <td style="border-top: 1px solid black;width:10%;font-weight: normal; text-align:left;"></td>' +
                              '<td style="border-top: 1px solid black;width:40%;font-weight: normal; text-align:center;">Freight charges</td>' +
                              '<td style="border-top: 1px solid black;width:10%;font-weight: normal; text-align:center;">' + order.orderInfo.shipping_charge + '</td>' +
                              '<td style="border-top: 1px solid black;width:10%;font-weight: normal; text-align:center;">Total</td>' +
                              '<td style="border-top: 1px solid black;width:10%;font-weight: normal; text-align:center;">' + (parseFloat(order.orderInfo.shipping_charge) + parseFloat(order.orderInfo.total_price)) + '</td> </tr></table></div>';



                          });
                          generate(pdfContent, res)



                        }
                      }
                    })
                }
              })

            })
        })
      }
    })

  return true;
}



// Gets a list of Orders
export function index(req, res) {

  var script = 'select u.email, o.id as order_id, o.order_number, o.total_discount_price, o.status as order_status, s.id as shipment_id, s.tracking_number';
  script += ' from "user" as u inner join "order" as o on u.id=o.user_id left outer join "shipment" as s on o.id=s.order_id';
  script += ' where CONCAT(u.first_name,\' \',u.last_name,\' \',u.email,\' \',o.order_number,\' \',s.tracking_number) ilike \'%' + req.body.searchString + '%\'';

  if (req.body.status !== undefined) {
    script += ' and o.status=\'' + req.body.status + '\'';
  }

  if (req.body["sortBy"] !== undefined) {

    script += ' order by ' + req.body.sortBy.attribute + ' ' + req.body.sortBy.direction;
  }
  script += ' limit ' + req.body.limit + ' offset ' + req.body.offset + ';';

  db.sequelize.query(script)
    .then(function(orders) {

      var countScript = 'select count(*)';
      countScript += ' from "user" as u inner join "order" as o on u.id=o.user_id left outer join "shipment" as s on o.id=s.order_id';
      countScript += ' where CONCAT(u.first_name,\' \',u.last_name,\' \',u.email,\' \',o.order_number,\' \',s.tracking_number) ilike \'%' + req.body.searchString + '%\'';

      if (req.body.status !== undefined) {
        countScript += ' and o.status=\'' + req.body.status + '\'';
      }

      db.sequelize.query(countScript)
        .then(function(count) {

          var response = {}
          response.count = count[0][0].count;
          response.rows = orders[0];

          res.status(200).json(response)
        })
    })
}


export function exportAllOrders(req, res) {

  var script = 'select u.email, o.id as order_id, o.order_number, o.total_discount_price, o.status as order_status, s.id as shipment_id, s.tracking_number';
  script += ' from "user" as u inner join "order" as o on u.id=o.user_id left outer join "shipment" as s on o.id=s.order_id';


  if (req.body["sortBy"] !== undefined) {

    script += ' order by ' + req.body.attribute + ' ' + req.body.direction + ';';
  }


  db.sequelize.query(script)
    .then(function(orders) {

      var response = {}
      response.rows = orders[0];

      res.status(200).json(response)
    })

}

export function getTotalOrdersCount(req, res) {

  Order.count()
    .then(function(count) {

      res.status(200).json(count);
    })
}

export function getTotalOrdersRevenue(req, res) {

  Order.sum('total_discount_price')
    .then(function(total) {

      res.status(200).json(total);
    })
}

// Gets a single Order from the DB
export function show(req, res) {
  Order.find({
      where: {
        id: req.params.id
      }
    })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Order in the DB
export function create(req, res) {
  Order.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Order in the DB
export function update(req, res) {
  if (req.body.id) {
    delete req.body.id;
  }
  Order.find({
      where: {
        id: req.params.id
      }
    })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Order from the DB
export function destroy(req, res) {
  Order.find({
      where: {
        id: req.params.id
      }
    })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

function createOrderObject(price, userId, deliveryAddress, status, coupon) {

  var shippingCharges=cartController.calculateShippingCharges(price.subTotal);
  var orderData = {

    total_price: price.subTotal,
    order_number: uuid.v1(),
    shipping_charge: shippingCharges,
    total_discount_price: price.amountPayable+shippingCharges,
    status: status,
    delivery_address: deliveryAddress,
    estimated_delivery_date: new Date(),
    user_id: userId,
  }

  if (coupon !== undefined)
    orderData.coupon_id = coupon.id;
  else
    orderData.coupon_id = null;

  return orderData;
}

function createOrderProductArray(products, productPrice, orderId) {

  var orderProductArray = [];
  for (var j = 0; j < products.length; j++) {

    var obj = {};
    obj.product_id = products[j].product_id;
    obj.quantity = products[j].quantity;
    obj.unit_price = productPrice[products[j].product_id];
    obj.order_id = orderId;
    orderProductArray.push(obj);
  }
  return orderProductArray;
}

function emptyUserCart(cartId, coupon) {

  var defered = Q.defer();
  CartProduct.destroy({
    where: {

      cart_id: cartId
    }
  }).then(function() {



    if (coupon !== undefined) {

      Cart.update({

        coupon_id: null
      }, {

        where: {

          id: cartId
        }
      }).then(function() {

        if (coupon.is_single_use) {

          Coupon.update({

            active: false
          }, {

            where: {
              id: coupon.id
            }
          }).then(function() {

            defered.resolve();
            return;
          })
        } else {

          defered.resolve();
          return;
        }
      }).catch(function(err) {

        defered.reject(err);
      })

    } else {

      defered.resolve();
    }

  }).catch(function(err) {

    defered.reject(err);
  })

  return defered.promise;
}

function saveOrder(price, products, productPrice, userId, deliveryAddress, cart, coupon) {

  var defered = Q.defer();

  var orderData = createOrderObject(price, userId, deliveryAddress, "processing", coupon);



  Order.create(orderData).then(function(order) {

    console.log("order--->" + JSON.stringify(order));

    Shipment.create({
        order_id: order.dataValues.id
      })
      .then(function(shipment) {
        console.log("shipment--->" + JSON.stringify(shipment));

        var orderProductArray = createOrderProductArray(products, productPrice, order.dataValues.id)


        OrderProduct.bulkCreate(orderProductArray)
          .then(function() {


            emptyUserCart(cart.id, coupon)
              .then(function() {



                defered.resolve(order.dataValues.id);
              })

          }).catch(function(err) {

            defered.reject(err);
          })
      })
  }).catch(function(err) {

    defered.reject(err);
  })

  return defered.promise;

}

function updateProductStock(products) {

  var defered = Q.defer();
  var count = 0;
  var attributes = ['id', 'units_in_stock']
  var productQuantity = {}

  for (var i = 0; i < products.length; i++) {

    productQuantity[products[i].product_id] = products[i].quantity;

    Product.getProduct(Product, attributes, products[i].product_id, undefined)
      .then(function(product) {

        Product.update({

          units_in_stock: parseInt(product.units_in_stock) - parseInt(productQuantity[product.id])
        }, {
          where: {

            id: product.id

          }
        }).then(function() {

          count++;
          if (count === products.length) {

            defered.resolve();
          }
        }).catch(function(err) {

          defered.reject(err);
        })

      })
  }
  return defered.promise;
}

export function createOrder(userId, deliveryAddress, status) {

  var defered = Q.defer();

  Cart.getCart(Cart, undefined, undefined, userId)
    .then(function(cart) {

      if (cart === null) {

        defered.reject("Empty Cart");
        return;
      }

      CartProduct.getCartProducts(CartProduct, undefined, cart.id, undefined)
        .then(function(cartProducts) {

          if (cartProducts.length === 0) {

            defered.reject("Empty Cart");
            return;
          }

          var productPrice = {};

          var attributes = ['id', 'discount_price'];
          var count = 0;

          for (var i = 0; i < cartProducts.length; i++) {

            Product.getProduct(Product, attributes, cartProducts[i].product_id, undefined)
              .then(function(product) {

                count++;
                productPrice[product.id] = product.discount_price;

                if (count === cartProducts.length) {

                  cartController.cartTotal(userId).then(function(price) {

                    if (cart.coupon_id === null) {

                      price.amountPayable = price.subTotal;



                      if (status.valueOf() === 'payment success'.valueOf()) {



                        saveOrder(price, cartProducts, productPrice, userId, deliveryAddress, cart).then(function(orderId) {


                          updateProductStock(cartProducts).then(function() {

                            defered.resolve(orderId)
                            return;
                          })

                        })
                      } else if (status.valueOf() === 'payment failed'.valueOf()) {

                        saveFailedOrder(price, cartProducts, productPrice, userId, deliveryAddress, cart).then(function(orderId) {

                          defered.resolve(orderId)
                          return;
                        })
                      }

                    } else {

                      Coupon.getCoupon(Coupon, undefined, cart.coupon_id, undefined).then(function(coupon) {

                        if (coupon === null) {

                          defered.reject("Coupon Expired")
                          return;
                        }

                        if (coupon.minimum_cart <= price.subTotal) {

                          if (coupon.operation.valueOf() === 'fixed') {

                            price.amountPayable = price.subTotal - coupon.value;
                            price.discountAmount = coupon.value;
                          } else if (coupon.operation.valueOf() === 'percentage') {

                            price.amountPayable = price.subTotal - ((price.subTotal * coupon.value) / 100);
                            price.discountAmount = ((price.subTotal * coupon.value) / 100);

                          }
                        }

                        if (status.valueOf() === 'payment success'.valueOf()) {
                          saveOrder(price, cartProducts, productPrice, userId, deliveryAddress, cart, coupon).then(function(orderId) {

                            updateProductStock(cartProducts).then(function() {

                              defered.resolve(orderId)
                              return;
                            })

                          })
                        } else if (status.valueOf() === 'payment failed'.valueOf()) {

                          saveFailedOrder(price, cartProducts, productPrice, userId, deliveryAddress, cart, coupon).then(function(orderId) {

                            defered.resolve(orderId)
                            return;
                          })
                        }

                      })
                    }

                  })
                }
              })

          }
        })

    })
  return defered.promise;
}

function saveFailedOrder(price, products, productPrice, userId, deliveryAddress, cart, coupon) {

  var defered = Q.defer();

  var orderData = createOrderObject(price, userId, deliveryAddress, "payment failed", coupon);

  Order.create(orderData).then(function(order) {

    var orderProductArray = createOrderProductArray(products, productPrice, order.dataValues.id)

    OrderProduct.bulkCreate(orderProductArray).then(function() {

      defered.resolve(order.dataValues.id);
      return;

    }).catch(function(err) {

      defered.reject(err);
    })

  }).catch(function(err) {

    defered.reject(err);
  })

  return defered.promise;
}

export function getOrderDetails(req, res) {

  if (req.body.user_id !== undefined) {

    var userId = req.body.user_id;
  } else
    var userId = req.user.id

  console.log("user id", userId)
  var orderDetails = [];

  Order.findAll({

      attributes: {
        exclude: ['updated_at', 'user_id']
      },
      where: {

        user_id: userId
      },

      limit: req.body.limit,
      offset: req.body.offset,
      raw: true
    })
    .then(function(order) {

      if (order.length === 0) {

        res.status(200).json(order);
        return;
      }
      console.log("order ",order)

      var attributes = {
        exclude: ['active', 'created_at', 'updated_at']
      }

      var count = 0;
      var orderData = {}
      var orderCouponMapping = {};

      for (var i = 0; i < order.length; i++) {

        orderCouponMapping[order[i].id] = order[i].coupon_id;
        orderData[order[i].id] = {}
      }

      for (var i = 0; i < order.length; i++) {

        orderData[order[i].id].orderInfo = order[i];

        OrderProduct.findAll({

          where: {

            order_id: order[i].id
          },
          raw: true
        })

        .then(function(orderProducts) {

          console.log("orderProducts",orderProducts)

          Shipment.find({

              where: {
                order_id: orderProducts[0].order_id
              }
            })
            .then(function(shipment) {

              console.log("shipment ",shipment)

              if (shipment)
                orderData[orderProducts[0].order_id].shipment = shipment.dataValues;

              Coupon.getCoupon(Coupon, attributes, orderCouponMapping[orderProducts[0].order_id], undefined)

              .then(function(coupon) {

                console.log("coupon ",coupon)

                orderData[orderProducts[0].order_id].coupon = coupon;

               

                var productQuantity = {};

                var attributes = ['id', 'name', 'orignal_price', 'discount_price', 'images', 'attribute', 'units_in_stock'];

                for (var j = 0; j < orderProducts.length; j++) {
                  productQuantity[orderProducts[j].product_id] = orderProducts[j].quantity;
                }
                var count1 = 0;
                orderData[orderProducts[0].order_id].products = [];
                for (var j = 0; j < orderProducts.length; j++) {

                  Product.getProduct(Product, attributes, orderProducts[j].product_id, undefined)
                    .then(function(product) {

                      count1++;
                      product.quantity = productQuantity[product.id];
                      orderData[orderProducts[0].order_id].products.push(product);
                      if (count1 === orderProducts.length) {
                        orderDetails.push(orderData[orderProducts[0].order_id]);
                         count++;
                        if (count === order.length) {

                          orderDetails = arraySort(orderDetails, 'orderInfo.created_at', {
                            reverse: true
                          });

                          res.status(200).json(orderDetails);
                          return;
                        }
                      }
                    })
                }
              })

            })
        })
      }
    })
}

function getOrderAmount(userId) {

  var defered = Q.defer();

  Cart.getCart(Cart, ['id', 'coupon_id'], undefined, userId)
    .then(function(cart) {

      cartController.cartTotal(userId).then(function(price) {

        if (cart.coupon_id === null) {

          price.amountPayable = price.subTotal;
          defered.resolve(price);
          return;

        } else {

          Coupon.getCoupon(Coupon, undefined, cart.coupon_id, undefined)
            .then(function(coupon) {

              if (coupon === null) {

                defered.reject("Coupon Expired")
                return;
              }

              if (coupon.minimum_cart <= price.subTotal) {

                if (coupon.operation.valueOf() === 'fixed') {

                  price.amountPayable = price.subTotal - coupon.value;
                  price.discountAmount = coupon.value;
                } else if (coupon.operation.valueOf() === 'percentage') {

                  price.amountPayable = price.subTotal - ((price.subTotal * coupon.value) / 100);
                  price.discountAmount = ((price.subTotal * coupon.value) / 100);

                }
              }

              defered.resolve(price)
              return;
            })
        }
      })
    })
  return defered.promise;
}

export function getPayUMoneyShaKey(req, res) {

  var shasum = crypto.createHash('sha512');
  var transactionId = uuid.v1();
  var successUrl = req.protocol + "://" + req.get('host') + payUMoneyConfig.success_url;
  var failureUrl = req.protocol + "://" + req.get('host') + payUMoneyConfig.failure_url;
  console.log(successUrl)
  console.log(failureUrl)

  PaymentTransactionSession.create({

      user_id: req.user.id,
      transaction_id: transactionId,
      address_index: req.params.addressIndex
    })
    .then(function() {

      var productInfo = "Books";

      User.getUser(User, ['first_name', 'email', 'phone_number'], req.user.id)
        .then(function(user) {

          getOrderAmount(req.user.id)
            .then(function(price) {

              var dataSequence = payUMoneyConfig.key + '|' + transactionId + '|' + price.amountPayable + '|' + productInfo + '|' + user.first_name + '|' + user.email + '|' + successUrl + '|' + failureUrl + '|||||||||' + payUMoneyConfig.salt;
              var resultKey = shasum.update(dataSequence).digest('hex');

              var response = {};

              response.hash = resultKey;
              response.key = payUMoneyConfig.key;
              response.txnid = transactionId;
              response.amount = price.amountPayable;
              response.productinfo = productInfo;
              response.firstname = user.first_name;
              response.phone = user.phone_number[0];
              response.email = user.email;

              response.udf1 = successUrl;
              response.udf2 = failureUrl;
              response.udf3 = req.params.addressIndex;
              response.payment_url = payUMoneyConfig.payment_url;
              response.surl = successUrl;
              response.furl = failureUrl;
              response.service_provider = payUMoneyConfig.service_provider;

              res.status(200).json(response);
            })
        })
    })
}