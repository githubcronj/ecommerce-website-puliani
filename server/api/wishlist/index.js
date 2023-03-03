'use strict';

var express = require('express');
var controller = require('./wishlist.controller');
import * as auth from '../../auth/auth.service';

var router = express.Router();

router.post('/addToWishlist', auth.isAuthenticated(), controller.addToWishlist);
router.post('/addWishlistProductToCart', auth.isAuthenticated(), controller.addWishlistProductToCart);

router.post('/getWishlistDetails', auth.isAuthenticated(), controller.getWishlistDetails);
router.delete('/removeProduct', auth.isAuthenticated(), controller.removeProduct);
router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;