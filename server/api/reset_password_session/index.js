'use strict';

var express = require('express');
var controller = require('./reset_password_session.controller');

var router = express.Router();

router.put('/changePassword', controller.changePassword);
router.get('/validateLink/:token', controller.validateLink);
router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/createSession', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;