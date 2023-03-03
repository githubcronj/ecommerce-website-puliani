'use strict';

var express = require('express');
var controller = require('./verify_user_email_session.controller');

var router = express.Router();

router.get('/validateLink/:token', controller.validateLink);
router.get('/setUserEmailAsVerified/:token', controller.setUserEmailAsVerified);
router.post('/createSession', controller.create);
router.get('/', controller.index);
router.get('/:id', controller.show);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
