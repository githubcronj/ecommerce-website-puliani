/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/categories              ->  index
 * POST    /api/categories              ->  create
 * GET     /api/categories/:id          ->  show
 * PUT     /api/categories/:id          ->  update
 * DELETE  /api/categories/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import db from '../../sqldb';
import Q from 'q';
var productController = require('../product/product.controller.js');

var Product = db.product;
var Category = db.category;
var ProductCategory = db.product_category;

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

export function getDuplicateCategoryAlias(req, res) {

  var script = 'select  id, name, alias, parent_id from "category" where name in(select name from "category" group by name having count(id)>1) and active=true'
  db.sequelize.query(script)
    .then(function(categories) {

      categories = categories[0];
      if (categories.length === 0) {
        res.status(200).json(categories);
        return;
      }

      var count = 0;

      var categoryIdMapping = {};
      for (var i = 0; i < categories.length; i++) {

        categoryIdMapping[categories[i].id] = categories[i];
      }


      for (var i = 0; i < categories.length; i++) {

        productController.getParent(categories[i].id).then(function(catTree) {

          count++;

          var tree = catTree[0].name;
          for (var j = 1; j < catTree.length; j++) {

            tree += ' --> ' + catTree[j].name
          }
          categoryIdMapping[catTree[catTree.length - 1].id].categoryTree = tree;
          if (count === categories.length) {


            res.status(200).json(categories);
            return;
          }
        })
      }
    })
    .catch(function(err) {

      res.status(500).send(err);
    })
}

export function exportAllCategories(req, res) {


  var dataQuery = 'select c.id, c.name, c.alias, c.description, c.parent_id,(select pc.name from category pc where pc.id=c.parent_id) as parent_name from "category" c where active=true';
  dataQuery += " ORDER BY name ASC";

  db.sequelize.query(dataQuery)
    .then(function(categories) {


      categories = categories[0];

      var count = 0;

      var categoryIdMapping = {};
      for (var i = 0; i < categories.length; i++) {

        categoryIdMapping[categories[i].id] = categories[i];
      }


      for (var i = 0; i < categories.length; i++) {

        productController.getParent(categories[i].id).then(function(catTree) {

          count++;

          var tree = catTree[0].name;
          for (var j = 1; j < catTree.length; j++) {

            tree += ' --> ' + catTree[j].name
          }
          categoryIdMapping[catTree[catTree.length - 1].id].categoryTree = tree;
          if (count === categories.length) {


            res.status(200).json(categories);
            return;
          }

        })


      }
    })

}

// Gets a list of Categorys
export function index(req, res) {


  var dataQuery = 'select c.id, c.name, c.alias, c.description, c.parent_id,(select pc.name from category pc where pc.id=c.parent_id) as parent_name from "category" c where active=true';

  if (req.body.searchString !== undefined) {

    dataQuery += ' and CONCAT(c.name,\' \',c.description) ilike \'%' + req.body.searchString + '%\'';
  }
  if (req.body["sortBy"] !== undefined) {


    dataQuery += " ORDER BY " + req.body.sortBy.attribute + " " + req.body.sortBy.direction;
  }
  dataQuery += ' limit ' + req.body.limit + ' offset ' + req.body.offset + ';';


  db.sequelize.query(dataQuery)
    .then(function(categories) {


      categories = categories[0];

      var count = 0;

      var categoryIdMapping = {};
      for (var i = 0; i < categories.length; i++) {

        categoryIdMapping[categories[i].id] = categories[i];
      }


      for (var i = 0; i < categories.length; i++) {

        productController.getParent(categories[i].id).then(function(catTree) {

          count++;
          if (count === categories.length) {

            var countQuery = 'select count(*) from "category" where active=true';

            if (req.body.searchString !== undefined) {

              countQuery += ' and CONCAT(name,\' \',description) like \'%' + req.body.searchString + '%\';';
            }
            db.sequelize.query(countQuery).then(function(count) {

              var response = {};
              response.count = count[0][0].count;
              response.rows = categories
              res.status(200).json(response);
              return;
            })


          }

          var tree = catTree[0].name;
          for (var j = 1; j < catTree.length; j++) {

            tree += ' --> ' + catTree[j].name
          }
          categoryIdMapping[catTree[catTree.length - 1].id].categoryTree = tree;

        })


      }
    })

}

// Gets a single Category from the DB
export function show(req, res) {
  Category.find({
      where: {
        id: req.params.id
      }
    })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}


function isUniqueCategory(category) {

  return Category.find({
      where: {
        name: category
      }
    })
    .then(function(data) {

      if (data === null)
        return true;
      else
        return false;
    })

}

function isUniqueAlias(name, parent_id) {

  return Category.find({
      where: {
        name: name,
        parent_id: parent_id
      }
    })
    .then(function(data) {

      if (data === null)
        return true;
      else
        return false;
    })

}
// Creates a new Category in the DB
export function create(req, res) {

  isUniqueCategory(req.body.name)
    .then(function(result) {

      console.log("category unique", result)

      if (result === true) {

        req.body.alias = req.body.name;
        Category.create(req.body)
          .then(function(category) {

            res.status(200).json(category);
          })
          .catch(function(err) {

            res.status(500).json(err)
          })
      } else {

        var alias = req.body.name + req.body.parent_id;
        isUniqueAlias(req.body.name, req.body.parent_id)
          .then(function(result) {

            console.log("alias unique", result)

            if (result == false) {

              res.status(500).json("category already exists.")
              return;
            }
            req.body.alias = alias;
            Category.create(req.body)
              .then(function(category) {

                res.status(200).json(category);
              })
              .catch(function(err) {

                res.status(500).json(err)
              })

          })
      }
    })
}

export function changeAlias(req, res) {

  Category.find({
      where: {
        id: req.body.category_id
      }
    })
    .then(function(category) {

      category.alias = req.body.alias;
      category.save()
        .then(function() {

          res.status(200).send("Success");
        })
        .catch(function(err) {

          res.status(500).send(err);
        })
    })
}


// Updates an existing Category in the DB
export function update(req, res) {

  Category.find({
      where: {
        id: req.body.id
      }
    })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Category from the DB
export function destroy(req, res) {

  Category.find({

      where: {

        id: req.body.category_id,
        active: true
      }
    })
    .then(function(category) {

      if (category === null) {

        res.status(500).json("Invalid Coupon");
        return;
      }

      var query = "with RECURSIVE cat_tree  as (Select cat1.id ,cat1.parent_id,cat1.name from  category as  cat1 where cat1.id=" + req.body.category_id + " union all select cat2.id,cat2.parent_id,cat2.name from category as  cat2 inner join cat_tree as r on cat2.parent_id= r.id) select id,parent_id,name from cat_tree order by id";

      db.sequelize.query(query)
        .then(function(subCategories) {

          var subCategories = subCategories[0];


          var count = 0;

          for (var i = 0; i < subCategories.length; i++) {

            Category.find({

                where: {

                  id: subCategories[i].id,
                  active: true
                }
              })
              .then(function(cat) {

                cat.active = false;
                cat.save()
                  .then(function() {
                    count++;
                    if (count === subCategories.length) {

                      res.status(200).json("Success");
                    }
                  })
              })
          }
        }).catch(function(err) {

          res.status(500).json(err);
        })

    })

}

export function getTopCategories(req, res) {


  var answer = [];

  Category.findAll({

    attributes: ['id', 'name'],
    where: {
      parent_id: null,
      active: true
    }

  }).then(function(cat) {



    var result = createArray(cat);
    console.log("came", result);
    var count = 0;

    for (var i = 0; i < result.length; i++) {



      result[i].subCategories = [];
      answer.push(result[i]);
      console.log("i", i);
      getSubCategories(result[i].id, result[i].subCategories).then(function() {

          count++;
          console.log(count);
          if (count === result.length)
            res.status(200).json(answer);
        })
        .catch(function(err) {

          console.log(err)
        });
    }

  });
}

function createArray(input, attribute) {
  var result = [];
  for (var i = 0; i < input.length; i++) {
    if (attribute != undefined)
      result.push(input[i].dataValues[attribute]);
    else
      result.push(input[i].dataValues);
  }
  return result;
}

function getSubCategories(input, parent) {
  console.log("in", input)

  var defered = Q.defer();

  Category.findAll({
      attributes: ['id', 'name'],
      where: {
        parent_id: input,
        active: true
      }
    }).then(function(cat) {

      var result = createArray(cat);

      for (var i = 0; i < result.length; i++) {

        parent.push(result[i])
      }
      defered.resolve();

    })
    .catch(function(err) {

      defered.reject(err);
    })

  return defered.promise;
}

export function getCategoryAutoSuggest(req, res) {

  // execute the search
  if (req.params.searchString === undefined)
    req.params.searchString = "";

  var query = 'select id, name from "category" where name ilike \'' + req.params.searchString + '%\' and active = true  order by name asc limit ' + req.params.limit;

  db.sequelize.query(query)
    .then(function(data) {

      res.status(200).json(data[0]);
    })
    .catch(function(err) {

      res.status(500).json(err);
    })
};

export function getCategoryIdByName(req, res) {

  for(var i=0; i<req.body.categories.length;i++){

    req.body.categories[i]=req.body.categories[i].toLowerCase().toString();
  }

  console.log(req.body.categories)

  Category.findAll({
      attributes: ['id', 'name', 'alias'],
      where: {

        active: true,
        alias: req.body.categories
      }
    })
    .then(function(categories) {

      if (categories.length === 0) {

        res.status(200).json(categories);
        return;
      }
      console.log("cat ", categories);

      var count = 0;
      for (var i = 0; i < categories.length; i++) {

        console.log(categories[i].id)
        productController.getParent(categories[i].id).then(function(catTree) {

          count++;
          var tree = catTree[0].name;
          for (var j = 1; j < catTree.length; j++) {

            tree += ' --> ' + catTree[j].name
          }

          for (var k = 0; k < categories.length; k++) {

            if (categories[k].id === catTree[catTree.length - 1].id) {
              categories[k].dataValues.catTree = tree;
              //console.log("tree", categories[k])
            }

          }
          if (count === categories.length) {

            res.status(200).json(categories);
            return;
          }
        })
      }
    })
}