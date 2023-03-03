/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/product_categories              ->  index
 * POST    /api/product_categories              ->  create
 * GET     /api/product_categories/:id          ->  show
 * PUT     /api/product_categories/:id          ->  update
 * DELETE  /api/product_categories/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import db from '../../sqldb';
import Q from 'q';

var Product = db.product;
var Category = db.category;
var ProductCategory = db.product_category;
var sequelize = db.sequelize;

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

// Gets a list of ProductCategorys
export function index(req, res) {
  ProductCategory.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single ProductCategory from the DB
export function show(req, res) {
  ProductCategory.find({
      where: {
        id: req.params.id
      }
    })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new ProductCategory in the DB
export function create(req, res) {
  ProductCategory.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing ProductCategory in the DB
export function update(req, res) {
  if (req.body.id) {
    delete req.body.id;
  }
  ProductCategory.find({
      where: {
        id: req.params.id
      }
    })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a ProductCategory from the DB
export function destroy(req, res) {
  ProductCategory.find({
      where: {
        id: req.params.id
      }
    })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}




//   function getSubCategories(deferred, input, subcategories) {



//     Category.findAll({
//         attributes: ['id'],
//         where: {
//           parent_id: input
//         }
//       }).then(function(cat) {
//         if (cat.length !== 0) {

//           var result = createArray(cat,'id');

//           subcategories=subcategories.concat(result);
//           getSubCategories(deferred, result,subcategories);

//         } else
//           deferred.resolve(subcategories);

//       })
//       .catch(function(err) {

//         console.log("erorrr" + err);
//       })

//       return deferred.promise;

//   }

//   function prepareCategoryCountResponse(){



//   }


// export function getCategoryProductCount(req, res) {

//   var deferred=Q.defer();
//   var subcategories = [];
//   subcategories.push(parseInt(req.headers.id));

//   ProductCategory.findAll({
//     attributes: ['category_id', [sequelize.fn('COUNT', sequelize.col('*')), 'product_count']],
//     group: 'category_id',
//     order: 'category_id'

//   }).then(function(catProductCount) {

//     Category.findAll({

//       attributes: ['id'],
//       where: {
//         parent_id: req.headers.id
//       }

//     }).then(function(result) {

//       //console.log("result aaaasa ",result[0].array_to_json)
//       var input = createArray(result,'id');
//      subcategories= subcategories.concat(input);


//       getSubCategories(deferred, input, subcategories).then(function(output){

//         var totalCount=0;
//         console.log("output ",output);  
//         console.log("count ",createArray(catProductCount));  

//         var productPerCategory=createArray(catProductCount);
//         for(var i=0;i<output.length;i++){

//             for(var j=0;j<productPerCategory.length;j++){

//               if(productPerCategory[j].category_id===output[i])
//               {
//                   totalCount+=parseInt(productPerCategory[j].product_count);      
//                   break;
//               }
//             }
//         }


//         res.status(200).json(totalCount);

//       });

//     });



//   }).catch(function(err) {

//     console.log("error" + err);
//   })

// }

// function createArray(input,attribute) {
//   var result = [];
//   for (var i = 0; i < input.length; i++) {
//     if(attribute!=undefined)
//     result.push(input[i].dataValues[attribute]);
//   else
//     result.push(input[i].dataValues);
//   }
//   return result;
// }


function getSubCategories(deferred, input, subcategories, parent,productPerCategory) {



  Category.findAll({
      attributes: ['id','name'],
      where: {
        parent_id: input
      }
    }).then(function(cat) {
      if (cat.length !== 0) {

        
        var result = createArray(cat, 'id');

        for (var i = 0; i < result.length; i++)
          parent[input][result[i]] = {}

        //subcategories = subcategories.concat(result);
        for (var j = 0; j < result.length; j++)
          getSubCategories(deferred, result[j], subcategories, parent[input],productPerCategory);

      } else
        deferred.resolve(subcategories);

    })
    .catch(function(err) {

      deferred.reject(err);
    })

  return deferred.promise;

}

function prepareCategoryCountResponse() {



}


export function getCategoryProductCount(req, res) {

  var deferred = Q.defer();
  var subcategories = {};
  //  subcategories.push(parseInt(req.headers.id));

  ProductCategory.findAll({
    attributes: ['category_id', [sequelize.fn('COUNT', sequelize.col('*')), 'product_count']],
    group: 'category_id',
    order: 'category_id'

  }).then(function(catProductCount) {

    Category.findAll({

      attributes: ['id'],
      where: {
        parent_id: req.headers.id
      }

    }).then(function(result) {

      var subcategories = {};
      subcategories[req.headers.id] = {}
        
        // var input = createArray(result, 'id');
        //  subcategories = subcategories.concat(input);
      var productPerCategory = createArray(catProductCount);

      getSubCategories(deferred, req.headers.id, subcategories, subcategories,productPerCategory).then(function(output) {

        var totalCount = 0;
        
        // console.log("count ", createArray(catProductCount));

        // var productPerCategory = createArray(catProductCount);
        // for (var i = 0; i < output.length; i++) {

        //   for (var j = 0; j < productPerCategory.length; j++) {

        //     if (productPerCategory[j].category_id === output[i]) {
        //       totalCount += parseInt(productPerCategory[j].product_count);
        //       break;
        //     }
        //   }
        // }


        res.status(200).json(totalCount);

      });

    });



  }).catch(function(err) {

    
  })

}

function createArray(input, attribute) {z
  var result = [];
  for (var i = 0; i < input.length; i++) {
    if (attribute != undefined)
      result.push(input[i].dataValues[attribute]);
    else
      result.push(input[i].dataValues);
  }
  return result;
}