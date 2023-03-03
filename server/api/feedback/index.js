'use strict';

var express = require('express');
var controller = require('./feedback.controller');
import * as auth from '../../auth/auth.service';

var router = express.Router();

router.post('/getAllFeedback', auth.hasRole('admin'), controller.index);
router.get('/:id', controller.show);
router.post('/createFeedback', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;