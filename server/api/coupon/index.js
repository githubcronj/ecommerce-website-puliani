'use strict';

var express = require('express');
var controller = require('./coupon.controller');
import * as auth from '../../auth/auth.service';

var router = express.Router();

router.get('/findCoupon/:code',auth.hasRole('admin'), controller.findCoupon);
router.post('/getAllCoupons',auth.hasRole('admin'), controller.index);
router.get('/:id', controller.show);
router.post('/createCoupon',auth.hasRole('admin'), controller.create);
router.post('/sendCoupons',auth.hasRole('admin'), controller.sendCoupons);
router.put('/editCoupon', auth.hasRole('admin'),controller.update);
router.patch('/:id', controller.update);
router.delete('/deleteCoupon',auth.hasRole('admin'), controller.destroy);

module.exports = router;
