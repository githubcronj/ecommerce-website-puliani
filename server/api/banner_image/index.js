'use strict';

var express = require('express');
var controller = require('./banner_image.controller');
var localFileUpload = require('../../lib/local.file.upload');
import * as auth from '../../auth/auth.service';

var router = express.Router();
//App Routes
router.get('/getAllBannerImages/:limit', controller.getAllBannerImages);
router.get('/:id', controller.show);

//Admin Routes
router.post('/getAllBannerImages', auth.hasRole('admin'), controller.index);
router.post('/addBannerImage/:sort_order', auth.hasRole('admin'), localFileUpload.bannerImageUpload(), controller.create);
router.put('/updateBannerImageStatus', auth.hasRole('admin'), controller.updateBannerImageStatus);
router.put('/updateBannerImagesSortOrder', auth.hasRole('admin'), controller.updateBannerImagesSortOrder);
router.delete('/deleteBannerImage', auth.hasRole('admin'), controller.destroy);

module.exports = router;