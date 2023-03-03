'use strict';

import * as auth from '../../auth/auth.service';

var express = require('express');
var controller = require('./product.controller');
var localFileUpload = require('../../lib/local.file.upload');


var router = express.Router();



router.post('/productSearch', controller.productSearch);
router.post('/productSearchCount', controller.productSearchCount);
router.post('/productSearchPriceRange', controller.productSearchPriceRange);
router.get('/getSortOptions', controller.getSortOptions);
router.get('/getSearchStringProductCategories/:searchString', controller.getSearchStringProductCategories);
router.get('/getSubCategories/:id', controller.getSubCategories);
//router.post('/getAllProducts', controller.index);
router.get('/productDetails/:id', controller.show);
router.patch('/:id', controller.update);
router.post('/getAllProducts', controller.productSearch);
router.post('/getAllProductsCount', controller.productSearchCount);
router.get('/productAutoSuggestApp/:searchString/:limit', controller.productAutoSuggestApp);


//Admin Routes
router.post('/s3SingleProductImagesUpload/:product_name/:product_id/:sku', auth.hasRole('admin'), localFileUpload.localSingleProductImageUpload(), controller.s3SingleProductImagesUpload);
router.post('/createProduct', auth.hasRole('admin'), controller.create);
router.put('/updateProduct', auth.hasRole('admin'), controller.update);
router.delete('/deleteProduct', auth.hasRole('admin'), controller.destroy);
router.post('/localSingleProductImageUpload', auth.hasRole('admin'), localFileUpload.localSingleProductImageUpload(), controller.localSingleProductImageUpload);
router.get('/productNameAutoSuggest/:limit/:searchString', auth.hasRole('admin'), controller.productNameAutoSuggest);
router.get('/checkUniqueIsbn/:isbn', auth.hasRole('admin'), controller.checkUniqueIsbn);
router.delete('/localSingleProductImageDelete', auth.hasRole('admin'), controller.localSingleProductImageDelete);
router.delete('/s3SingleProductImagesDelete', auth.hasRole('admin'), controller.s3SingleProductImagesDelete);

module.exports = router;