'use strict';

import * as auth from '../../auth/auth.service';
var express = require('express');
var controller = require('./cart.controller');

var router = express.Router();


router.post('/guestUserGetCartDetails', controller.guestUserGetCartDetails);
router.post('/guestUserAddToCart', auth.isAuthenticated(), controller.guestUserAddToCart);
router.post('/addToCart', auth.isAuthenticated(), controller.addToCart);
router.post('/applyCoupon', auth.isAuthenticated(), controller.applyCoupon);
router.post('/guestUserApplyCoupon', controller.guestUserApplyCoupon);
router.post('/removeCoupon', auth.isAuthenticated(), controller.removeCoupon);

router.get('/getCartDetails', auth.isAuthenticated(), controller.getCartDetails);
router.put('/changeQuantity', auth.isAuthenticated(), controller.changeQuantity);
router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);


module.exports = router;