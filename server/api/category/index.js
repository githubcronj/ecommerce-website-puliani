'use strict';

var express = require('express');
var controller = require('./category.controller');
import * as auth from '../../auth/auth.service';

var router = express.Router();

router.get('/getTopCategories', controller.getTopCategories);
router.get('/getCategoryAutoSuggest/:limit/:searchString', auth.hasRole('admin'), controller.getCategoryAutoSuggest);
router.get('/getCategoryAutoSuggest/:limit/', auth.hasRole('admin'), controller.getCategoryAutoSuggest);
router.get('/getDuplicateCategoryAlias', auth.hasRole('admin'), controller.getDuplicateCategoryAlias);

router.get('/exportAllCategories',auth.hasRole('admin'), controller.exportAllCategories);
// router.get('/getParentCategory', controller.getParentCategory);
router.post('/getAllCategories',auth.hasRole('admin'), controller.index);
router.get('/:id', controller.show);
router.post('/createCategory', auth.hasRole('admin'), controller.create);
router.put('/editCategory', auth.hasRole('admin'), controller.update);
router.patch('/:id', controller.update);
router.delete('/deleteCategory', auth.hasRole('admin'), controller.destroy);

router.post('/getCategoryIdByName', auth.hasRole('admin'), controller.getCategoryIdByName);

module.exports = router;