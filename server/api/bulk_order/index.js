'use strict';

var express = require('express');
var controller = require('./bulk_order.controller');
import * as auth from '../../auth/auth.service';

var router = express.Router();

router.post('/getAllBulkOrders', auth.hasRole('admin'), controller.index);
router.get('/:id', controller.show);
router.post('/createBulkOrder', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;