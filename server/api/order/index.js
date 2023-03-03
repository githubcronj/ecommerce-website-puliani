'use strict';

import * as auth from '../../auth/auth.service';
var express = require('express');
var controller = require('./order.controller');


var router = express.Router();

//router.post('/getAllOrders', controller.getAllOrders);

router.get('/getTotalOrdersRevenue', controller.getTotalOrdersRevenue);
router.get('/getTotalOrdersCount', controller.getTotalOrdersCount);
router.get('/adminViewFullOrder/:order_id', auth.hasRole('admin'), controller.adminViewFullOrder);
router.post('/getOrderDetailsAdmin', auth.hasRole('admin'), controller.getOrderDetails);
router.post('/exportPDF', auth.hasRole('admin'), controller.exportPDF);
router.post('/getOrderDetails', auth.isAuthenticated(), controller.getOrderDetails);
router.post('/createOrder', auth.isAuthenticated(), controller.createOrder);
router.post('/getAllOrders', controller.index);
router.post('/exportAllOrders', controller.exportAllOrders);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);
router.get('/getPayUMoneyShaKey/:addressIndex', auth.isAuthenticated(), controller.getPayUMoneyShaKey);


module.exports = router;