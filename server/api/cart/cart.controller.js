/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/carts              ->  index
 * POST    /api/carts              ->  create
 * GET     /api/carts/:id          ->  show
 * PUT     /api/carts/:id          ->  update
 * DELETE  /api/carts/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import db from '../../sqldb';
import Q from 'q';
var arraySort = require('array-sort');


var Cart = db.cart;
var Coupon = db.coupon;
var Product = db.product;
var CartProduct = db.cart_product;

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
    console.log("entity", entity);
    if (!entity) {
      if (message)
        res.status(404).json({
          message: message
        });
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

// Gets a list of Carts
export function index(req, res) {
  Cart.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Cart from the DB
export function show(req, res) {
  Cart.find({
      where: {
        id: req.params.id
      }
    })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Cart in the DB
export function create(req, res) {
  Cart.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Cart in the DB
export function update(req, res) {
  if (req.body.id) {
    delete req.body.id;
  }
  Cart.find({
      where: {
        id: req.params.id
      }
    })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Cart from the DB
export function destroy(req, res) {
  Cart.find({
      where: {
        id: req.params.id
      }
    })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

export function validateStock(product_id, quantity) {

  var defered = Q.defer();
  Product.getProduct(Product, ['units_in_stock'], product_id, undefined)

  .then(function(product) {

    if (product === null) {

      defered.reject("Invalid Product");
      return;

    } else if (quantity > product.units_in_stock) {

      defered.reject("Stock Not Available");
      return;
    } else
      defered.resolve();

  })
  return defered.promise;
}

export function guestUserApplyCoupon(req, res) {

  var attributes = ['id', 'code', 'minimum_cart', 'start_date', 'expiry_date', 'operation', 'value'];

  Coupon.getCoupon(Coupon, attributes, undefined, req.body.coupon_code)
    .then(handleEntityNotFound(res, "Invalid Coupon Code"))
    .then(respondWithResult(res))
    .catch(handleError(res));
}



function addProductToCart(productArray) {

  var defered = Q.defer();
  var index = 0;
  var count = 0;

  for (var i = 0; i < productArray.length; i++) {

    CartProduct.getCartProducts(CartProduct, undefined, productArray[i].cart_id, productArray[i].product_id)
      .then(function(product) {

        if (product.length === 0) {

          var promise = CartProduct.create(productArray[index]);

          index++;
          return promise;

        } else {

          var promise = CartProduct.update({

            quantity: parseInt(productArray[index].quantity)
          }, {

            where: {
              cart_id: productArray[index].cart_id,
              product_id: productArray[index].product_id
            }

          })

          index++;
          return promise;
        }
      }).then(function() {

        count++;
        if (count === productArray.length) {
          defered.resolve();
        }
      })
  }

  return defered.promise;
}



export function guestUserAddToCart(req, res) {

  var data = req.body;
  var count = 0;
  if (data.products.length === 0) {
    
    res.status(200).send("Success");
    return;
  }

  for (var i = 0; i < data.products.length; i++) {

    console.log("in for loop")

    validateStock(data.products[i].product_id, data.products[i].quantity).then(function() {

      count++;
      console.log("count ", count)

      if (count === data.products.length) {

        Cart
          .findOrCreate({
            where: {
              user_id: req.user.id
            }
          }).then(function(cart) {

            console.log("cart ", cart)

            var cartProductArray = [];

            for (var j = 0; j < data.products.length; j++) {

              var obj = {};
              obj.quantity = data.products[j].quantity;
              obj.cart_id = cart[0].dataValues.id;
              obj.product_id = data.products[j].product_id;

              cartProductArray.push(obj);
            }


            addProductToCart(cartProductArray).then(function() {

                console.log("product added to cart")

                if (data.couponCode === undefined) {

                  res.status(200).send("Success");
                  return;
                }

                Coupon.getCoupon(Coupon, undefined, undefined, data.couponCode).then(function(coupon) {

                  if (coupon === null) {

                    res.status(500).json("Invalid Coupon Code");
                    return;
                  }

                  cartTotal(req.user.id).then(function(price) {

                    if (coupon.minimum_cart <= price.subTotal) {


                      Cart.update({

                          coupon_id: coupon.id
                        }, {

                          where: {

                            user_id: req.user.id
                          }

                        }).then(function(result) {

                          res.status(200).json("Success");
                        })
                        .catch(function(err) {

                          res.status(500).json(err);
                        });

                    } else {

                      var error = {

                        minimum_cart: coupon.minimum_cart,
                        message: "Minimum Sub Total of the cart must be " + coupon.minimum_cart + " to use this coupon."
                      }

                      res.status(500).json(error);
                    }
                  })
                })
              })
              .catch(function(err) {

                if (err.name.valueOf() === 'SequelizeUniqueConstraintError')
                  res.status(409).send("Product Already Exists");
                else if (err.name.valueOf() === 'SequelizeForeignKeyConstraintError')
                  res.status(500).send("Invalid Product");
              });

          }).catch(function(err) {

            res.status(500).send("Invalid User");
          });
      }


    }).catch(function(err) {

      res.status(500).send(err);
    })
  }
}

export function calculateShippingCharges(price) {

  var shippingCharges = 50;
  if (price === 0) {

    return shippingCharges;
  }
  var mod = price % 1000;
  var devisor = Math.floor(price / 1000);
  if (mod !== 0) {

    devisor++;
  }

  if (devisor >= 1) {

    devisor -= 1;
  }
  if (devisor >= 1) {
    shippingCharges += (devisor * 25);
  }
  return shippingCharges;

}

function getShippingCharges(userId) {

  var defered = Q.defer();
  cartTotal(userId).then(function(price) {

      //console.log("pp", price)
      var shippingCharges = calculateShippingCharges(price.subTotal);
      defered.resolve(shippingCharges)
    })
    .catch(function(err) {

      defered.reject(err);
    })

  return defered.promise;
}

export function addToCart(req, res) {

  // getShippingCharges(req.user.id).then(function(charges) {

  //   //console.log("pa", charges)
  // })

  Cart.getCart(Cart, ['id'], undefined, req.user.id)
    .then(function(cart) {

      if (cart === null) {
        cart = {}
        cart.id = -1;
      }

      return CartProduct.getCartProducts(CartProduct, ['quantity'], cart.id, req.body.product_id);
    })
    .then(function(cartProduct) {

      var cartQuantity = 0;

      if (cartProduct.length === 0)
        cartQuantity = 0;
      else
        cartQuantity = cartProduct[0].quantity



      validateStock(req.body.product_id, parseInt(req.body.quantity) + parseInt(cartQuantity)).then(function() {


        Cart
          .findOrCreate({
            where: {
              user_id: req.user.id
            }
          }).then(function(cart) {



            CartProduct.getCartProducts(CartProduct, undefined, cart[0].dataValues.id, req.body.product_id)
              .then(function(product) {



                if (product.length === 0) {

                  CartProduct.create({

                      quantity: req.body.quantity,
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

                } else {

                  CartProduct.update({

                    quantity: parseInt(product[0].quantity) + parseInt(req.body.quantity)
                  }, {

                    where: {
                      cart_id: cart[0].dataValues.id,
                      product_id: req.body.product_id
                    }

                  }).then(function() {

                    res.status(200).send("Success");
                  })

                }
              })

          }).catch(function(err) {

            res.status(500).send("Invalid User");
          });

      }).catch(function(err) {

        res.status(500).send(err);
      })
    })
}

export function changeQuantity(req, res) {

  validateStock(req.body.product_id, req.body.quantity).then(function() {

    Cart.getCart(Cart, undefined, undefined, req.user.id)
      .then(function(cart) {

        CartProduct.update({

            quantity: req.body.quantity
          }, {

            where: {
              cart_id: cart.id,
              product_id: req.body.product_id
            }

          }).then(function() {

            res.status(200).send("Success");
          })
          .catch(function(err) {


            if (err.name.valueOf() === 'SequelizeForeignKeyConstraintError')
              res.status(500).send("Invalid Product");
            else
              res.status(500).send(err);
          });

      }).catch(function(err) {


        res.status(500).send("Invalid User");
      });

  }).catch(function(err) {

    res.status(500).json(err);
  })

}

export function cartTotal(user_id) {

  var defered = Q.defer();
  Cart.getCart(Cart, undefined, undefined, user_id)
    .then(function(cart) {

      if (cart === null) {

        defered.reject("Empty Cart");
        return;
      }
      //console.log("cart ",cart)

      return CartProduct.getCartProducts(CartProduct, undefined, cart.id, undefined)
    })
    .then(function(cartProducts) {

      //console.log("cartProducts",cartProducts)
      if (cartProducts === undefined) {

        defered.reject("Empty Cart");
        return;
      }

      if (cartProducts.length === 0) {

        defered.reject("Empty Cart");
        return;
      }

      var attributes = ['id', 'orignal_price', 'discount_price'];

      var actualTotal = 0;
      var subTotal = 0;
      var count = 0;
      var productQuantity = {}

      for (var j = 0; j < cartProducts.length; j++) {

        productQuantity[cartProducts[j].product_id] = cartProducts[j].quantity;
      }


      for (var i = 0; i < cartProducts.length; i++) {

        Product.getProduct(Product, attributes, cartProducts[i].product_id, undefined).then(function(product) {

          count++;
          actualTotal = actualTotal + (product.orignal_price * productQuantity[product.id]);
          subTotal = subTotal + (product.discount_price * productQuantity[product.id]);

          if (count === cartProducts.length) {

            var price = {};
            price.actualTotal = actualTotal;
            price.subTotal = subTotal;
            defered.resolve(price);
          }
        })
      }
    })
  return defered.promise;
}

export function applyCoupon(req, res) {

  Coupon.getCoupon(Coupon, undefined, undefined, req.body.coupon_code).then(function(coupon) {



    if (coupon === null) {

      res.status(500).json({
        message: "Invalid Coupon Code"
      });
      return;
    }

    cartTotal(req.user.id).then(function(price) {



      if (coupon.minimum_cart <= price.subTotal) {

        Cart.update({

            coupon_id: coupon.id
          }, {

            where: {

              user_id: req.user.id
            }

          }).then(function(result) {

            price.operation = coupon.operation;
            price.value = coupon.value;

            res.status(200).json(price);
          })
          .catch(function(err) {

            res.status(500).json(err.data);
          });

      } else {

        var error = {

          minimum_cart: coupon.minimum_cart,
          message: "Minimum Sub Total of the cart must be " + coupon.minimum_cart + " to use this coupon."
        }

        res.status(500).json(error);
      }
    }).catch(function(err) {

      res.status(500).json(err);

    })

  }).catch(function(err) {



    res.status(500).json(err);
  })

}

function getProductTotal(products) {

  var defered = Q.defer();

  var attributes = ['id', 'orignal_price', 'discount_price'];

  var actualTotal = 0;
  var subTotal = 0;
  var count = 0;
  var productQuantity = {}

  for (var j = 0; j < products.length; j++) {

    productQuantity[products[j].product_id] = products[j].quantity;
  }



  for (var i = 0; i < products.length; i++) {

    Product.getProduct(Product, attributes, products[i].product_id, undefined).then(function(product) {

      count++;
      actualTotal = actualTotal + (product.orignal_price * productQuantity[product.id]);
      subTotal = subTotal + (product.discount_price * productQuantity[product.id]);

      if (count === products.length) {

        var price = {};
        price.actualTotal = actualTotal;
        price.subTotal = subTotal;
        defered.resolve(price);
      }
    })
  }

  return defered.promise;
}


export function guestUserGetCartDetails(req, res) {

  var emptyCartResponse = {

    products: []
  }
  var products = req.body.products;

  if (products.length === 0) {

    res.status(200).json(emptyCartResponse);
    return;
  }

  var cartDetails = {};
  cartDetails.products = [];
  var attributes = ['id', 'name', 'orignal_price', 'discount_price', 'images', 'attribute', 'units_in_stock'];
  var count = 0;
  var productQuantity = {}

  for (var j = 0; j < products.length; j++) {

    productQuantity[products[j].product_id] = products[j].quantity;
  }

  for (var i = 0; i < products.length; i++) {

    Product.getProduct(Product, attributes, products[i].product_id, undefined).then(function(product) {

      count++;
      product.quantity = productQuantity[product.id]
      product.totalPrice = product.quantity * product.discount_price;
      cartDetails.products.push(product);



      if (count === products.length) {

        cartDetails.products = arraySort(cartDetails.products, 'name');



        getProductTotal(products).then(function(price) {

          var shippingCharges = calculateShippingCharges(price.subTotal);
          price.shippingCharges = shippingCharges;
          if (req.body.couponCode === undefined) {
            price.amountPayable = price.subTotal + shippingCharges;
            cartDetails.price = price;
            res.status(200).send(cartDetails);
            return;
          }

          var attributes = {
            exclude: ['active', 'created_at', 'updated_at']
          }

          Coupon.getCoupon(Coupon, attributes, undefined, req.body.couponCode).then(function(coupon) {


            if (coupon === null) {

              price.amountPayable = price.subTotal + shippingCharges;
              cartDetails.price = price;
              cartDetails.coupon = {}
              cartDetails.coupon.warning = "Invalid Coupon Code";

              res.status(200).send(cartDetails);
              return;
            }

            if (coupon.minimum_cart <= price.subTotal) {

              if (coupon.operation.valueOf() === 'fixed') {

                price.amountPayable = (price.subTotal - coupon.value) + shippingCharges;
                price.discountAmount = coupon.value;
              } else if (coupon.operation.valueOf() === 'percentage') {

                price.amountPayable = (price.subTotal - ((price.subTotal * coupon.value) / 100)) + shippingCharges;
                price.discountAmount = ((price.subTotal * coupon.value) / 100);
              }

              cartDetails.coupon = {}
              cartDetails.coupon.warning = null;
              cartDetails.coupon.details = coupon;

            } else {

              cartDetails.coupon = {}
              cartDetails.coupon.warning = "Coupon has removed due to insufficient cart amount.";

            }

            cartDetails.price = price;


            res.status(200).send(cartDetails);
            return;
          })

        })
      }
    })
  }
}

export function getCartDetails(req, res) {

  var emptyCartResponse = {

    products: []
  }

  Cart.find({
      where: {
        user_id: req.user.id
      }
    })
    .then(function(cart) {

      if (cart === null) {

        res.status(200).json(emptyCartResponse);
        return;
      }

      CartProduct.findAll({

        where: {

          cart_id: cart.dataValues.id
        }
      }).then(function(products) {

        if (products.length === 0) {

          res.status(200).json(emptyCartResponse);
          return;
        }

        var cartDetails = {};
        cartDetails.products = [];
        var attributes = ['id', 'name', 'orignal_price', 'discount_price', 'images', 'attribute', 'units_in_stock'];
        var count = 0;
        var productQuantity = {}

        for (var j = 0; j < products.length; j++) {

          productQuantity[products[j].dataValues.product_id] = parseInt(products[j].dataValues.quantity);
          //console.error("type ",typeof products[j].dataValues.quantity)
        }

        for (var i = 0; i < products.length; i++) {

          Product.getProduct(Product, attributes, products[i].dataValues.product_id, undefined)
            .then(function(product) {

              count++;
              product.quantity = productQuantity[product.id];

              product.totalPrice = product.quantity * product.discount_price;
              cartDetails.products.push(product);

              if (count === products.length) {

                cartDetails.products = arraySort(cartDetails.products, 'name');

                cartTotal(req.user.id).then(function(price) {

                  var shippingCharges = calculateShippingCharges(price.subTotal);
                  price.shippingCharges = shippingCharges;

                  if (cart.dataValues.coupon_id === null) {


                    price.amountPayable = price.subTotal + shippingCharges;
                    cartDetails.price = price;
                    res.status(200).send(cartDetails);
                    return;
                  }

                  var attributes = {
                    exclude: ['active', 'created_at', 'updated_at']
                  }

                  Coupon.getCoupon(Coupon, attributes, cart.dataValues.coupon_id, undefined)
                    .then(function(coupon) {


                      if (coupon === null) {


                        price.amountPayable = price.subTotal + shippingCharges;
                        cartDetails.price = price;
                        cartDetails.coupon = {}
                        cartDetails.coupon.warning = "Coupon Expired";

                        Cart.update({

                          coupon_id: null
                        }, {

                          where: {
                            id: req.user.id
                          }
                        })

                        res.status(200).send(cartDetails);
                        return;
                      }

                      if (coupon.minimum_cart <= price.subTotal) {

                        if (coupon.operation.valueOf() === 'fixed') {

                          price.amountPayable = (price.subTotal - coupon.value) + shippingCharges;
                          price.discountAmount = coupon.value;
                        } else if (coupon.operation.valueOf() === 'percentage') {

                          price.amountPayable = (price.subTotal - ((price.subTotal * coupon.value) / 100)) + shippingCharges;
                          price.discountAmount = ((price.subTotal * coupon.value) / 100);

                        }
                        cartDetails.coupon = {}
                        cartDetails.coupon.warning = null;
                        cartDetails.coupon.details = coupon;
                      } else {

                        cartDetails.coupon = {}
                        cartDetails.coupon.warning = "Coupon has removed due to insufficient cart amount.";

                        Cart.update({

                          coupon_id: null
                        }, {

                          where: {
                            id: req.user.id
                          }
                        })
                      }

                      cartDetails.price = price;


                      res.status(200).send(cartDetails);
                      return;
                    })

                })
              }
            })

        }
      })

    })
}

export function removeCoupon(req, res) {

  Coupon.find({

    where: {
      code: req.body.coupon_code,
      active: true
    }
  }).then(function(coupon) {


    Cart.update({

        coupon_id: null
      }, {

        where: {
          user_id: req.user.id
        }

      }).then(function() {

        res.status(200).json("Success");
      })
      .catch(function(err) {

        res.status(500).json(err);
      });
  })
}

function updateProductStock(products, operation) {

  var defered = Q.defer();
  var count = 0;
  var attributes = ['id', 'units_in_stock']
  var productQuantity = {}

  for (var i = 0; i < products.length; i++) {

    productQuantity[products[i].product_id] = products[i].quantity;

    Product.getProduct(Product, attributes, products[i].product_id, undefined)
      .then(function(product) {


        if (operation.valueOf() === 'reduce')
          var stock = parseInt(product.units_in_stock) - parseInt(productQuantity[product.id])
        else if (operation.valueOf() === 'add')
          var stock = parseInt(product.units_in_stock) + parseInt(productQuantity[product.id])

        Product.update({

          units_in_stock: stock
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


export function cartCheckout(req, res) {

  Cart.getCart(Cart, undefined, undefined, req.user.id)
    .then(function(cart) {

      if (cart === null) {

        res.status(500).send("Empty Cart");
        return;
      }

      CartProduct.getCartProducts(CartProduct, undefined, cart.id, undefined)
        .then(function(cartProducts) {

          if (cartProducts.length === 0) {

            res.status(200).send("Empty Cart");
            return;
          }

          if (cart.coupon_id !== null) {

            Coupon.getCoupon(Coupon, undefined, cart.coupon_id, undefined).then(function(coupon) {

              if (coupon === null) {

                res.status(500).send("Coupon Expired");
                return;
              }

              updateProductStock(cartProducts, 'reduce')
                .then(function() {

                  res.status(200).send("Success");
                  return;
                })
                .catch(function(err) {

                  res.status(500).send(err);
                  return;
                })

            })

          } else {
            updateProductStock(cartProducts, 'reduce')
              .then(function() {

                res.status(200).send("Success");
                return;
              })
              .catch(function(err) {

                res.status(500).send(err);
                return;
              })
          }

        })

    })
}