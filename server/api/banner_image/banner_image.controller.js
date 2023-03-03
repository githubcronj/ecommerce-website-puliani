/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/banner_images              ->  index
 * POST    /api/banner_images              ->  create
 * GET     /api/banner_images/:id          ->  show
 * PUT     /api/banner_images/:id          ->  update
 * DELETE  /api/banner_images/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import db from '../../sqldb';
var awsS3Upload = require('../../lib/s3.image.upload');

var BannerImage = db.banner_image;

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function(entity) {
    return entity.updateAttributes(updates)
      .then(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.destroy()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

export function getAllBannerImages(req, res) {

  var script = {};
    script.attributes=['url','sort_order']
    script.order = [
      ['sort_order', 'ASC']
    ]
  
  script.limit = req.params.limit;  
  script.where = {};
  script.where.active=true;

  BannerImage.findAll(script)
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a list of BannerImages
export function index(req, res) {

  var script = {};

  if (req.body['sortBy'] !== undefined) {

    script.order = [
      [req.body['sortBy'].attribute, req.body['sortBy'].direction]
    ]
  }
  script.limit = req.body.limit;
  script.offset = req.body.offset;

  BannerImage.findAndCountAll(script)
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single BannerImage from the DB
export function show(req, res) {
  BannerImage.find({
      where: {
        id: req.params.id
      }
    })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}


export function s3SingleProductImagesUpload(req, res) {

  var localPath = 'fileUploads/singleProductImageUploads/';
  
  var fileUploadDir = 'Product_Images/' + req.params.sku + '/';
  var images = req.files;
  var responseMapping = {};
  var imagesData = []
  var count = 0;

  for (var i = 0; i < images.length; i++) {

    var localFileName = images[i].filename;
    var uploadFileName = createS3UploadFileName(localFileName);;

    awsS3Upload.uploadAndResize(localPath, localFileName, fileUploadDir, uploadFileName)
      .then(function(response) {

        

        responseMapping[response.localFileName] = response;

        fs.unlink(localPath + response.localFileName, function() {

          count++;
          if (count === images.length) {

            for (var j = 0; j < images.length; j++) {

              var localFile = path.basename(images[j].filename)
              var file = responseMapping[localFile].uploadFileName;

              var extension = path.extname(file);
              var file = path.basename(file, extension);

              var imageInfo = {

                url_orignal: responseMapping[localFile].url + file + extension,
                url_tiny: responseMapping[localFile].url + file + '_tiny' + extension,
                url_small: responseMapping[localFile].url + file + '_small' + extension,
                url_thumbnail: responseMapping[localFile].url + file + '_thumbnail' + extension,
                type: undefined,
                sort_order: undefined,
                active: true
              }

              imagesData.push(imageInfo);
            }
            Product.find({
                where: {
                  id: req.params.product_id,
                  active: true
                }
              })
              .then(function(product) {
                
                
                product.images = product.images.concat(imagesData);
                
                product.save()
                  .then(function() {

                    res.status(200).json(imagesData);
                  })
              })
          }
        });
      })
  }
}



// Creates a new BannerImage in the DB
export function create(req, res) {

  var localPath = 'fileUploads/bannerImageUploads/';
  var fileUploadDir = 'Banner_Images/';

  BannerImage.find({
      where: {

        sort_order: req.params.sort_order
      }
    })
    .then(function(bannerImage) {

      if (bannerImage !== null) {

        res.status(500).json("Sort Order is already present");
        return;
      }

      var localFilename = req.files[0].filename;
      var uploadFilename = localFilename;

      awsS3Upload.uploadFiles(localPath, localFilename, fileUploadDir, uploadFilename)
        .then(function(data) {

          var bannerImage = {}
          bannerImage.url = data.Location;
          bannerImage.sort_order = req.params.sort_order;

          BannerImage.create(bannerImage)
            .then(function(banner) {
              res.status(200).json(banner)
            })
        })

    })
}

// Updates an existing BannerImage in the DB
export function updateBannerImageStatus(req, res) {

  BannerImage.find({
      where: {
        id: req.body.imageId
      }
    })
    .then(handleEntityNotFound(res))
    .then(function(image) {

      image.active = req.body.isActive;
      image.save()
        .then(function(image) {

          res.status(200).json(image)
        })
    })
}

export function updateBannerImagesSortOrder(req, res) {

  BannerImage.find({
      where: {
        id: {
          $not: req.body.imageId
        },
        sort_order: req.body.sortOrder
      }
    })
    .then(function(bannerImage) {

      

      if (bannerImage !== null) {

        res.status(500).json("Sort Order is already present");
        return;
      }

      BannerImage.find({
          where: {
            id: req.body.imageId
          }
        })
        .then(handleEntityNotFound(res))
        .then(function(image) {

          

          image.sort_order = req.body.sortOrder;
          image.save()
            .then(function(ans) {

              res.status(200).json(ans)
            })
        })
    })
}

// Deletes a BannerImage from the DB
export function destroy(req, res) {

  awsS3Upload.deleteImage(req.body.images)
    .then(function(data) {

      BannerImage.find({
          where: {
            id: req.body.id
          }
        })
        .then(handleEntityNotFound(res))
        .then(removeEntity(res))
        .catch(handleError(res));
    })
    .catch(function(err) {

      res.status(500).json(err);
    })
}