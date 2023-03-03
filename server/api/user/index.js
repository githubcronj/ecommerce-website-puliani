'use strict';

import {
	Router
}
from 'express';
import * as controller from './user.controller';
import * as auth from '../../auth/auth.service';

var router = new Router();

router.post('/getAllUsers', auth.hasRole('admin'),controller.getAllUsers);
router.put('/updateProfile', auth.isAuthenticated(), controller.updateProfile);
router.put('/updateAddress', auth.isAuthenticated(), controller.updateAddress);
router.put('/deleteAddress', auth.isAuthenticated(), controller.deleteAddress);
router.put('/addAddress', auth.isAuthenticated(), controller.addAddress);
router.get('/getAddresses', auth.isAuthenticated(), controller.getAddresses);
router.get('/', auth.hasRole('admin'), controller.index);
router.get('/exportUserData', auth.hasRole('admin'), controller.exportUserData);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
router.put('/password', auth.isAuthenticated(), controller.changePassword);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.get('/getUser/:id', auth.hasRole('admin'), controller.getUser);
router.post('/', controller.create);

export default router;