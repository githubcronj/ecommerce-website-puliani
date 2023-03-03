/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/products              ->  index
 * POST    /api/products              ->  create
 * GET     /api/products/:id          ->  show
 * PUT     /api/products/:id          ->  update
 * DELETE  /api/products/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import db from '../../sqldb';
import Q from 'q';
import config from '../../config/environment';
import expressJwt from 'express-jwt';
import path from 'path'
var awsS3Upload = require('../../lib/s3.image.upload');
var fs = require('fs');

var sequelize = db.sequelize;
var Product = db.product;
var Category = db.category;
var ProductCategory = db.product_category;


var validateJwt = expressJwt({
  secret: config.secrets.session
});



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

// Gets a list of Products
export function index(req, res) {

  var script = {};


  if (req.body.sortBy !== undefined) {

    script.order = [
      [req.body.sortBy.attribute, req.body.sortBy.direction]
    ]
  }
  script.active = true;
  script.limit = req.body.limit;
  script.offset = req.body.offset;

  Product.findAndCountAll(script)
    .then(respondWithResult(res))
    .catch(handleError(res));
}



// Gets a single Product from the DB
export function show(req, res) {

  var attributes = {
    exclude: ['active', 'created_at', 'updated_at']
  };

  // var include = [{
  //   attributes: [
  //     ['id', 'category_id'],
  //     ['name', 'category_name']
  //   ],
  //   model: Category
  // }];

  Product.getProduct(Product, attributes, req.params.id, undefined)
    .then(function(product) {

      Category.findAll({

          attributes: [
            ['id', 'id'],
            ['name', 'name']
          ],
          include: [{
            attributes: [
              ['id', 'id'],
            ],
            model: Product,
            where: {
              id: req.params.id,
              active: true
            }
          }],
          where: {

            active: true
          }
        })
        .then(function(category) {
         

          product.category = category;
          
           console.log(product);
          res.status(200).json(product);
        })
    })
}

// Creates a new Product in the DB
export function create(req, res) {

  var productData = req.body.product;
  var categoryData = req.body.category;


  if (productData.images.length !== 0) {

    var localPath = 'fileUploads/singleProductImageUploads/';
    var fileUploadDir = 'Product_Images/' + productData.sku + '/';

    var imageRequestDataMapping = {}

    for (var k = 0; k < productData.images.length; k++) {

      var key = path.basename(productData.images[k].url)
      imageRequestDataMapping[key] = productData.images[k];
    }

    for (var i = 0; i < productData.images.length; i++) {

      var localFileName = path.basename(productData.images[i].url)

      var uploadFileName = createS3UploadFileName(productData.name, localFileName);
      var count = 0;
      var responseMapping = {};
      var imagesData = []

      awsS3Upload.uploadAndResize(localPath, localFileName, fileUploadDir, uploadFileName)
        .then(function(response) {


          responseMapping[response.localFileName] = response;

          fs.unlink(localPath + response.localFileName, function() {

            count++;
            if (count === productData.images.length) {

              for (var j = 0; j < productData.images.length; j++) {

                var localFile = path.basename(productData.images[j].url)
                var file = responseMapping[localFile].uploadFileName;

                var extension = path.extname(file);
                var file = path.basename(file, extension);

                var imageInfo = {

                  url: responseMapping[localFile].url + file + extension,
                  type: imageRequestDataMapping[localFile].type,
                  active: true,
                  sort_order: imageRequestDataMapping[localFile].sort_order
                }
                imagesData.push(imageInfo);
              }

              productData.images = imagesData;

              createProduct(productData, categoryData);
            }
          });
        })
    }
  } else
    createProduct(productData, categoryData);

  function createProduct(productData, categoryData) {

    Product.create(productData)
      .then(function(product) {


        var productCategories = [];

        for (var l = 0; l < categoryData.length; l++) {

          var mapping = {};
          mapping.product_id = product.dataValues.id;
          mapping.category_id = categoryData[l];
          productCategories.push(mapping);
        }
        ProductCategory.bulkCreate(productCategories)
          .then(function(data) {

            res.status(200).json(product);
          })
      })
      .catch(function(err) {

        res.status(500).json(err);
      })
  }
}

// Updates an existing Product in the DB
export function update(req, res) {

  Product.find({
      where: {
        id: req.body.product_id
      }
    })
    .then(function(product) {
      if (product === null) {

        res.status(500).json("Invalid Product");
        return;
      }
      product.name = req.body.product.name;
      product.sku = req.body.product.sku;
      product.short_description = req.body.product.short_description;
      product.long_description = req.body.product.long_description;
      product.orignal_price = req.body.product.orignal_price;
      product.discount_price = req.body.product.discount_price;
      product.images = req.body.product.images;
      product.units_in_stock = req.body.product.units_in_stock;
      product.attribute = req.body.product.attribute;

      product.save().then(function() {

          ProductCategory.destroy({
            where: {

              product_id: req.body.product_id
            }
          }).then(function() {

            var productCategories = []
            for (var i = 0; i < req.body.category.length; i++) {

              var data = {}
              data.product_id = req.body.product_id;
              data.category_id = req.body.category[i];
              productCategories.push(data);
            }
            ProductCategory.bulkCreate(productCategories)
              .then(function() {

                res.status(200).json("Success");
              })
          })
        })
        .catch(function(err) {

          res.status(500).json(err);
        })
    })
}

// Deletes a Product from the DB
export function destroy(req, res) {

  Product.find({
    where: {

      id: req.body.product_id
    }
  }).then(function(product) {

    if (product === null) {

      res.status(500).json("Invalid Product.");
      return;
    }

    Product.update({

      active: false
    }, {
      where: {

        id: req.body.product_id
      }
    }).then(function() {

      res.status(200).json("Success");
    })
  })

}


// function createScript(conditions) {

//   var script = {}

//   if (conditions['filters'] !== undefined) {
//     script.where = {};
//     var filters = conditions['filters'];
//     if (filters['price'] !== undefined) {

//       script.where = {
//         discount_price: {
//           $between: [parseInt(filters['price'].lowerPrice), parseInt(filters['price'].upperPrice)]
//         }

//       }
//     }
//   }

//   var categories = conditions['category'];
//   if (conditions['category'] !== undefined) {

//     script.include = [{
//       model: Category,
//       where: {
//         id: categories
//       }
//     }];
//   }
//   if (conditions['sortBy'] !== undefined) {

//     script.order = [
//       [conditions['sortBy'].attribute, conditions['sortBy'].direction]
//     ]
//   }

//   if (conditions['offset'] !== undefined) {

//     script.offset = parseInt(conditions['offset'])
//   }


//   if (conditions['limit'] !== undefined) {

//     script.limit = parseInt(conditions['limit'])
//   }

//   script.subQuery = false

//   return script;

// }

function createProductSearchDetailsScript(conditions, name) {

  var script = '';
  if (name.valueOf() === 'count')
    script += 'SELECT count(*) AS full_count'
  else if (name.valueOf() === 'price range')
    script += 'SELECT max(prod.discount_price) AS max_price,min(prod.discount_price) AS min_price'

  if (conditions['category'] !== undefined) {

    script += ' FROM product as prod INNER JOIN product_category as pc ON pc.product_id=prod.id INNER JOIN (SELECT id as category_id FROM category WHERE id IN(' + conditions['category'] + ')) as cat ON cat.category_id=pc.category_id';
  } else {

    script += ' FROM product as prod'
  }

  script += " WHERE prod.active=TRUE"

  if (conditions['searchString'] !== undefined) {

    conditions['searchString'] = conditions['searchString'].replace(/[&\()|!':]/g, '');
    console.log("searchString ", conditions['searchString'])

    var searchWords = conditions['searchString'].split(' ');
    var searchStringInput = "" + searchWords[0] + ":*";
    for (var i = 1; i < searchWords.length; i++) {

      searchStringInput += " & " + searchWords[i] + ":*";
    }

    script += " AND prod.textsearchable_index_col @@ to_tsquery('english','" + searchStringInput + "')"
  }

  if (conditions['filters'] !== undefined) {

    var filters = conditions['filters'];

    if (filters['price'] !== undefined) {

      script += " AND prod.discount_price BETWEEN " + filters['price'].lowerPrice + " AND " + filters['price'].upperPrice;
    }
  }

  return script;
}

function createProductSearchScript(conditions, context) {

  var script = '';
  script += "SELECT prod.id,prod.name,prod.orignal_price,prod.discount_price,prod.units_in_stock,prod.images, CASE WHEN prod.created_at > current_date - 30 THEN 'true' ELSE 'false' END AS is_new"

  if (conditions['category'] !== undefined && conditions['category'].length !== 0) {

    script += ' FROM product as prod INNER JOIN product_category as pc ON pc.product_id=prod.id INNER JOIN (SELECT id as category_id FROM category WHERE id IN(' + conditions['category'] + ')) as cat ON cat.category_id=pc.category_id';
  } else {

    script += ' FROM product as prod'
  }

  script += " WHERE prod.active=TRUE"

  if (conditions['searchString'] !== undefined && conditions['searchString'].valueOf() !== "") {

    conditions['searchString'] = conditions['searchString'].replace(/[&\()|!':]/g, '');
    console.log("searchString ", conditions['searchString'])
    var searchWords = conditions['searchString'].split(' ');
    var searchStringInput = "" + searchWords[0] + ":*";
    for (var i = 1; i < searchWords.length; i++) {

      searchStringInput += " & " + searchWords[i] + ":*";
    }

    script += " AND prod.textsearchable_index_col @@ to_tsquery('english','" + searchStringInput + "')"
  }

  if (conditions['filters'] !== undefined) {

    var filters = conditions['filters'];

    if (filters['price'] !== undefined) {

      script += " AND prod.discount_price BETWEEN " + filters['price'].lowerPrice + " AND " + filters['price'].upperPrice;
    }
  }

  if (conditions['sortBy'] !== undefined) {

    script += " ORDER BY " + conditions['sortBy'].attribute + " " + conditions['sortBy'].direction;
  }

  if (conditions['limit'] !== undefined) {

    script += " LIMIT " + conditions['limit'];
  }

  if (conditions['offset'] !== undefined) {

    script += " OFFSET " + conditions['offset'];
  }

  return script;
}

function productSearchResponse(req, res, type) {

  var subcategories = [];
  if (req.body.category !== undefined && req.body.category.length !== 0) {

    subcategories = subcategories.concat(req.body.category);

    var sc = "with RECURSIVE sub_categories  as ( Select cat1.id ,cat1.parent_id,cat1.name from  category as  cat1 where cat1.id in(" + subcategories + ") union all select cat2.id,cat2.parent_id,cat2.name from category as  cat2 inner join sub_categories as r on cat2.parent_id= r.id) select id,parent_id,name from sub_categories order by id";
    sequelize.query(sc, {

      type: sequelize.QueryTypes.SELECT
    }).then(function(output) {



      var arr = [];
      for (var i = 0; i < output.length; i++) {
        arr.push(output[i].id);
      }

      req.body.category = arr;
      createResponse();

    })
  } else
    createResponse();


  function createResponse() {

    if (type.valueOf() === 'search')
      var script = createProductSearchScript(req.body);
    else if (type.valueOf() === 'count')
      var script = createProductSearchDetailsScript(req.body, "count");
    else if (type.valueOf() === 'price range')
      var script = createProductSearchDetailsScript(req.body, "price range");



    sequelize.query(script, {

      type: sequelize.QueryTypes.SELECT
    }).then(function(result) {

      if (type.valueOf() === 'search')
        res.status(200).json(result);

      else if (type.valueOf() === 'count')
        res.status(200).json(result[0]);

      else if (type.valueOf() === 'price range')
        res.status(200).json(result[0]);

    }).catch(function(err) {

      res.status(500).json(err);
    })

  }

}

export function productSearch(req, res) {

  productSearchResponse(req, res, "search");
}

export function productSearchCount(req, res) {

  productSearchResponse(req, res, "count");
}

export function productSearchPriceRange(req, res) {

  productSearchResponse(req, res, "price range");
}

export function getSortOptions(req, res) {

  res.status(200).json(config.sortOptions);
}


function createSearchStringCategoryScript(searchString, context) {

  var script = '';
  script += 'SELECT count(prod.id),cat.id'

  script += ' FROM product as prod INNER JOIN product_category as pc ON pc.product_id=prod.id INNER JOIN category as cat ON cat.id=pc.category_id';

  script += " WHERE prod.active=TRUE"

  if (searchString.valueOf() !== undefined && searchString.valueOf() !== "") {

    searchString = searchString.replace(/[&\()|!':]/g, '');
    console.log("searchString ", searchString)
    var searchWords = searchString.split(' ');
    var searchStringInput = "" + searchWords[0] + ":*";
    for (var i = 1; i < searchWords.length; i++) {

      searchStringInput += " & " + searchWords[i] + ":*";
    }

    script += " AND prod.textsearchable_index_col @@ to_tsquery('english','" + searchStringInput + "')"
  }

  script += " GROUP BY cat.id";

  script += " ORDER BY cat.id DESC";

  return script;
}

export function getParent(id) {

  var deffered = Q.defer();
  var sc = "with RECURSIVE cat_tree  as (Select cat1.id ,cat1.parent_id,cat1.name from  category as  cat1 where cat1.id=" + id + " union all select cat2.id,cat2.parent_id,cat2.name from category as  cat2 inner join cat_tree as r on cat2.id= r.parent_id) select id,parent_id,name from cat_tree order by id";

  sequelize.query(sc, {

    type: sequelize.QueryTypes.SELECT
  }).then(function(result) {

    deffered.resolve(result);

  }).catch(function(err) {

    deffered.reject(err);
  })

  return deffered.promise;
}

export function getSearchStringProductCategories(req, res) {

  var products = [];
  var script = createSearchStringCategoryScript(req.params.searchString);

  //var sc = "with RECURSIVE sub_categories  as ( Select cat1.id ,cat1.parent_id,cat1.name from  category as  cat1 where cat1.id in(" + subcategories + ") union all select cat2.id,cat2.parent_id,cat2.name from category as  cat2 inner join sub_categories as r on cat2.parent_id= r.id) select id,parent_id,name from sub_categories order by id";
  sequelize.query(script, {

    type: sequelize.QueryTypes.SELECT
  }).then(function(output) {



    products = output;
    var catTree = {};
    var count = 0;
    var history = {}


    if (products.length === 0)
      res.status(200).json(catTree);

    for (var i = 0; i < products.length; i++) {


      getParent(products[i].id).then(function(parent) {

        count++;
        var child = {}

        if (catTree[parent[0].id] !== undefined) {

          if (parent.length >= 2) {

            child = catTree[parent[0].id].child;
            child[parent[1].id] = {
              id: parent[1].id,
              name: parent[1].name,
            }

          }
        } else {

          if (parent.length >= 2) {

            child[parent[1].id] = {
              id: parent[1].id,
              name: parent[1].name,
            }

          }
          catTree[parent[0].id] = {
            id: parent[0].id,
            name: parent[0].name,
            child: child
          }
        }

        if (count === products.length) {
          var answer = [];


          for (var j in catTree) {
            if (catTree.hasOwnProperty(j)) {

              var subCat = [];
              var sub = catTree[j].child;

              for (var k in sub) {

                if ((sub).hasOwnProperty(k)) {

                  subCat.push(sub[k]);
                }
              }
              catTree[j].child = subCat;
              answer.push(catTree[j]);
            }

          }

          res.status(200).json(answer);
        }
      })
    }

  })
}

export function getSubCategories(req, res) {

  getParent(req.params.id).then(function(parent) {

    Category.findAll({
      attributes: ['id', 'name'],
      where: {
        parent_id: req.params.id,
        active: true
      }
    }).then(function(result) {

      var answer = [];
      var root = {};

      root.id = parent[0].id;
      root.name = parent[0].name;
      root.child = [];
      var currentRoot = root;

      for (var i = 1; i < parent.length; i++) {

        var obj = {}

        obj.id = parent[i].id;
        obj.name = parent[i].name;
        obj.child = [];

        currentRoot.child.push(obj);

        currentRoot = obj;
      }
      if (result.length === 0) {
        delete currentRoot["child"];
      }
      for (var i = 0; i < result.length; i++) {

        var obj = {}
        obj.id = result[i].dataValues.id;
        obj.name = result[i].dataValues.name;
        currentRoot.child.push(obj);
      }
      answer.push(root)

      res.status(200).json(answer);
    })
  })


}

export function localSingleProductImageUpload(req, res) {


  var images = req.files;

  var data = [];

  for (var i = 0; i < images.length; i++) {

    var url = '/localFileUploads/singleProductImageUploads/' + images[i].filename;
    data.push(url)
  }

  res.status(200).json(data);
}

export function localSingleProductImageDelete(req, res) {

  var localPath = 'fileUploads/singleProductImageUploads/';
  var fileName = path.basename(req.body.imageUrl)

  fs.unlink(localPath + fileName, function() {

    res.status(200).json("Success");
  })
}

export function s3SingleProductImagesDelete(req, res) {

  awsS3Upload.deleteImage(req.body.images)
    .then(function(data) {

      Product.find({
          where: {

            id: req.body.product_id,
            active: true
          }
        })
        .then(function(product) {

          var orignalUrl = "";
          var tempImages = product.images;

          for (var i = 0; i < req.body.images.length; i++) {

            var flag = _.remove(tempImages, function(n) {

              return n.url.valueOf() === req.body.images[i].valueOf();
            });

            if (flag.length !== 0) {

              break;
            }
          }
          product.images = tempImages;
          product.save()
            .then(function() {

              res.status(200).json("Success");
            })
        })
    })
    .catch(function(err) {

      res.status(500).json(err);

    })

}

function createS3UploadFileName(productName, localFileName) {

  var arr = localFileName.split("_");

  var uploadFileName = '' + productName + '_' + arr[arr.length - 1];

  return uploadFileName;
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
    var uploadFileName = createS3UploadFileName(req.params.product_name, localFileName);

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

                url: responseMapping[localFile].url + file + extension,
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

export function productNameAutoSuggest(req, res) {

  Product.findAll({
      attributes: ['id', 'name'],
      where: {
        active: true,
        name: {

          $ilike: req.params.searchString + '%'
        }
      },
      offset: 0,
      limit: req.params.limit
    })
    .then(function(products) {
      res.status(200).json(products);
    })
}

export function checkUniqueIsbn(req, res) {



  Product.findAll({
      where: {
        active: true,
        "attribute.isbn": req.params.isbn
      }
    })
    .then(function(products) {
      
//console.log("isbn",products[0].dataValues.id);

      if (products.length !== 0)
        res.status(200).json({id:products[0].dataValues.id,isThere:true});
      else
        res.status(200).json({id:products && products[0] ? products[0].dataValues.id : undefined,isThere:false});
    })
}

export function productAutoSuggestApp(req, res) {

  var script = '';
  script += 'SELECT name'

  script += ' FROM product'


  script += " WHERE active=TRUE"

  req.params.searchString = req.params.searchString.replace(/[&\()|!':]/g, '');
  console.log("searchString ", req.params.searchString)
  var searchWords = req.params.searchString.split(' ');
  var searchStringInput = "" + searchWords[0] + ":*";
  for (var i = 1; i < searchWords.length; i++) {

    searchStringInput += " & " + searchWords[i] + ":*";
  }


  script += " AND textsearchable_index_col @@ to_tsquery('english','" + searchStringInput + "')"

  script += " LIMIT " + req.params.limit;

  db.sequelize.query(script)
    .then(function(products) {

      res.status(200).json(products[0])
    })

}