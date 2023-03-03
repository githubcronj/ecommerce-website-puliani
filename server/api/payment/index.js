'use strict';

var express = require('express');
var controller = require('./payment.controller');
import * as auth from '../../auth/auth.service';

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/paymentSuccess', controller.paymentSuccess);
router.post('/paymentFailure',  controller.paymentFailure);

router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;