'use strict';

var express = require('express');
var controller = require('./shipment.controller');
import * as auth from '../../auth/auth.service';

var router = express.Router();

router.get('/', controller.index);
router.get('/getShipmentDetails/:id', auth.isAuthenticated(), controller.show);
router.post('/', controller.create);
router.put('/updateShipment', auth.hasRole('admin'), controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;