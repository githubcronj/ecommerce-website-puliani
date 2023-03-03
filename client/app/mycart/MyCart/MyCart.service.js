'use strict';

angular.module('pulianiBookStoreApp')
    .factory('MyCart', function(common, localStorageService, Auth, $q) {

        var factory = {};

        factory.getMyCart = function() {

            return $q(function(resolve, reject) {

                Auth.isLoggedIn(function(isLoggedIn) {

                    if (!isLoggedIn) {

                        if (localStorageService.get('products')) {

                            var MyCart = common.callApi('POST', '/api/carts/guestUserGetCartDetails/', '', {

                                'Content-Type': 'application/json'
                            }, (localStorageService.get('couponCode')) ? {

                                products: localStorageService.get('products'),
                                couponCode: localStorageService.get('couponCode')
                            } : {

                                products: localStorageService.get('products')
                            });

                            MyCart.then(function(data) {
                                if(data && data.data && data.data.coupon){
                                    if(data.data.coupon.warning){
                                        localStorage.removeItem("pulianiBookStoreApp.couponCode");
                                    }
                                }
                                resolve(data);
                            });
                        } else
                            resolve({
                                data: {
                                    products: []
                                }
                            });

                    } else {
                        var MyCart = common.callApi('GET', '/api/carts/getCartDetails/', '', '', '');
                        MyCart.then(function(data) {
                            resolve(data);

                        });

                    }
                })

            });

        }

        factory.guestUserAddtoCart = function() {
            return $q(function(resolve, reject) {

                Auth.isLoggedIn(function(isLoggedIn) {
                    if (isLoggedIn) {
                        if (localStorageService.get('products')) {
                            let guestAddCart = common.callApi('POST', '/api/carts/guestUserAddToCart', '', {
                                'Content-Type': 'application/json'
                            }, (localStorageService.get('couponCode')) ? {
                                products: localStorageService.get('products'),
                                couponCode: localStorageService.get('couponCode')
                            } : {
                                products: localStorageService.get('products')
                            });
                            guestAddCart.then(function(data) {
                                localStorageService.remove('products');
                                localStorageService.remove('couponCode');
                                //alert(JSON.stringify(data));
                                resolve({
                                    message: "success"
                                });

                            });
                        } else
                            resolve({
                                message: "No Products in cart"
                            });

                    } else {
                        reject({
                            error: "not logged in"
                        })
                    }
                });

            });

        }

        factory.addToCart = function(productid, quantity, unitsInStock) {

            return $q(function(resolve, reject) {

                Auth.isLoggedIn(function(isLoggedIn) {
                    if (!isLoggedIn) {

                        var products = (localStorageService.get('products')) ? localStorageService.get('products') : [];
                        console.log(products);

                        var isProductThere = false
                        angular.forEach(products, function(product, key) {
                           
                            if (product.product_id == productid) {

                                isProductThere = true;
                                if ((products[key].quantity + quantity) <= unitsInStock) {
                                   
                                    products[key].quantity = parseInt(products[key].quantity) + parseInt(quantity);
                                } else {
                                    reject({
                                        data: {
                                            message: "Specified quantity is not available!"
                                        }
                                    });
                                }
                                //products[key].quantity = parseInt(quantity);
                            }
                        });

                        if (!isProductThere && (quantity <= unitsInStock)) {

                            products.push({
                                product_id: productid,
                                quantity: quantity
                            });

                        } else if(!isProductThere && (quantity > unitsInStock)){
                            reject({
                                data: {
                                    message: "Specified quantity is not available!"
                                }
                            });
                            return;
                        }


                        localStorageService.set('products', products);
                        resolve({
                            message: "success"
                        });
                    } else {
                        let addCart = common.callApi('POST', '/api/carts/addToCart', '', {
                            'Content-Type': 'application/json'
                        }, {
                            product_id: productid,
                            quantity: quantity
                        });

                        addCart.then(function(data) {
                            //alert(JSON.stringify(data));
                            resolve({
                                message: "success"
                            });

                        })

                        .catch(function(error) {
                            reject(error);
                        })

                    }
                });
            });

        }

        factory.removeItemfromCart = function(productid) {
            return $q(function(resolve, reject) {

                Auth.isLoggedIn(function(isLoggedIn) {
                    if (!isLoggedIn) {
                        let cartItems = localStorageService.get('products');
                        angular.forEach(cartItems, function(item, key) {
                            if (item.product_id == productid)
                                cartItems.splice(key, 1)
                        });
                        localStorageService.set('products', cartItems);
                        resolve({
                            message: "success"
                        });
                    } else {
                        let removeProduct = common.callApi('DELETE', '/api/cart_products/removeProduct', '', {
                            'Content-Type': 'application/json'
                        }, {
                            product_id: productid
                        });
                        removeProduct.then(function(data) {
                            resolve({
                                message: "success"
                            });

                        });

                    }

                })

            });
        }

        factory.onQuantityChange = function(productid, quantity) {

            return $q(function(resolve, reject) {

                Auth.isLoggedIn(function(isLoggedIn) {
                    if (isLoggedIn) {
                        let quantityChange = common.callApi('PUT', '/api/carts/changeQuantity', '', {
                            'Content-Type': 'application/json'
                        }, {
                            product_id: productid,
                            quantity: quantity
                        });
                        quantityChange.then(function(data) {

                            resolve({
                                message: "success"
                            });

                        })

                    } else {
                        let cartItems = localStorageService.get('products');
                        angular.forEach(cartItems, function(item, key) {
                            if (item.product_id == productid) {
                                cartItems[key].quantity = quantity;
                            }

                        });
                        localStorageService.set('products', cartItems);
                        resolve({
                            message: "success"
                        });

                    }


                })

            });

        }

        factory.UserValidateCoupon = function(couponcode, subTotal) {
            return $q(function(resolve, reject) {

                Auth.isLoggedIn(function(isLoggedIn) {
                    if (isLoggedIn) {
                        let validateCoupon = common.callApi('POST', '/api/carts/applyCoupon', '', {
                            'Content-Type': 'application/json'
                        }, {
                            coupon_code: couponcode
                        });

                        validateCoupon.then(function(data) {
                            resolve({
                                message: "success"
                            });
                        }, function(error) {
                            reject(error);
                        })

                    } else {
                        let validateCoupon = common.callApi('POST', '/api/carts/guestUserApplyCoupon', '', {
                            'Content-Type': 'application/json'
                        }, {
                            coupon_code: couponcode
                        });

                        validateCoupon.then(function(data) {
                            if (subTotal >= data.data.minimum_cart) {
                                localStorageService.set('couponCode', couponcode);
                                resolve({
                                    message: "success"
                                });
                            } else {
                                reject({
                                    data: {
                                        message: "Minimium " + data.data.minimum_cart + "  amount in cart is required to apply this coupon"
                                    }
                                });
                            }
                        }, function(error) {
                            reject(error);
                        })

                    }

                })
            })

        }

        factory.LoginUserRemoveCoupon = function(couponcode) {
            let RemoveCoupon = common.callApi('POST', '/api/carts/removeCoupon', '', {
                'Content-Type': 'application/json'
            }, {
                coupon_code: couponcode
            });
            return RemoveCoupon;
        }

        factory.RemoveUserCoupon = function(couponcode) {
            let RemUserCoupon = common.callApi('POST', '/api/carts/removeCoupon', '', {
                'Content-Type': 'application/json'
            }, {
                coupon_code: couponcode
            });

            return $q(function(resolve, reject) {

                Auth.isLoggedIn(function(isLoggedIn) {
                    if (isLoggedIn) {
                        RemUserCoupon.then(function(data) {
                            resolve({
                                message: "success"
                            });
                        })
                    } else {
                        localStorageService.remove('couponCode');
                        resolve({
                            message: "success"
                        });
                    }
                })
            })

        }

        factory.addWishListToCart = function(productid) {
            let wishListToCart = common.callApi('POST', '/api/wishlists/addWishlistProductToCart', '', {
                'Content-Type': 'application/json'
            }, {
                product_id: productid
            });
            return wishListToCart;
        }

        return factory;

    });