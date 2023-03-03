'use strict';

var express = require('express');
var controller = require('./news.controller');
import * as auth from '../../auth/auth.service';

var router = express.Router();

router.get('/getAllNews/:limit', controller.getAllNews);
router.post('/getAllNews', auth.hasRole('admin'), controller.index);
router.get('/:id', controller.show);
router.post('/createNews', auth.hasRole('admin'), controller.create);
router.put('/updateNews', auth.hasRole('admin'), controller.update);
router.patch('/:id', controller.update);
router.delete('/deleteNews', auth.hasRole('admin'), controller.destroy);

module.exports = router;