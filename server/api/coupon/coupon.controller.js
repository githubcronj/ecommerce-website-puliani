/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/coupons              ->  index
 * POST    /api/coupons              ->  create
 * GET     /api/coupons/:id          ->  show
 * PUT     /api/coupons/:id          ->  update
 * DELETE  /api/coupons/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import db from '../../sqldb';
import {sendSms} from '../../lib/sms'

var Coupon = db.coupon;

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

// Gets a list of Coupons
export function index(req, res) {

  var script = {};

  script.attribute = {
    exclude: ['created_at', 'updated_at', 'active']
  }


  if (req.body['sortBy'] !== undefined) {

    script.order = [
      [req.body['sortBy'].attribute, req.body['sortBy'].direction]
    ]
  }
  script.limit = req.body.limit;
  script.offset = req.body.offset;
  script.where = {
    active: true
  }


  Coupon.findAndCountAll(script)
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Coupon from the DB
export function show(req, res) {
  Coupon.find({
      where: {
        id: req.params.id
      }
    })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function findCoupon(req, res) {

  Coupon.find({

      where: {
        code: {
          $iLike: '%' + req.params.code + '%'
        },
        active: true
      }
    })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Coupon in the DB
export function create(req, res) {

  Coupon.create(req.body)
    .then(function(coupon) {
      
      if(req.body.is_single_use)
        {
           sendSms(req.body.upno,'Use PromoCode '+req.body.code+' on Puliani Law books website to grab benefits on your purchase.').then(function(data){
               
               res.status(200).json(coupon);
               
           }); 
        }
      else
        res.status(200).json(coupon);

    })
    .catch(function(err) {

      res.status(500).json(err);
    })
}


 export function sendCoupons(req, res) {
    
   sendSms(req.body.mobnos,'Use PromoCode '+req.body.code+' on Puliani Law books website to grab benefits on your purchase.'+(req.body.customMessage?req.body.customMessage:'')).then(function(data)
   {
   
       res.status(200).json({message:"success"});

   }); 

   if(req.body.sendAll==true)
   {
      if(sendAllSms(req.body.code,req.body.customMessage,0))
      res.status(200).json({message:"success"});
   }

   


}

function sendAllSms(promocode,customMessage,offset) {
 
  var mobilenos="";
  var dataQuery = 'select phone_number from "user" where active=true limit 200 offset '+offset;
  
   db.sequelize.query(dataQuery)
    .then(function(users) {
      console.log("users--->"+JSON.stringify(users[0]));
     if(users[0].length!=0)
     {
       for(var count=0;count<users[0].length;count++)
        {
       mobilenos+=users[0][count].phone_number.toString()+',';
        }
         sendSms(mobilenos,'Use PromoCode '+promocode+' on Puliani Law books website to grab benefits on your purchase.'+(customMessage?customMessage:'')).then(function(data)
         {
         console.log("data--->"+JSON.stringify(data)); 
        offset=offset+200;
        sendAllSms(promocode,customMessage,offset);

         }); 
     }
     else
     {
    return true;
      }
    })
  
   
   }
   


// Updates an existing Coupon in the DB
export function update(req, res) {

  Coupon.find({
      where: {
        id: req.body.id
      }
    })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(function(data) {

      
      res.status(200).json(data);
    })
    .catch(handleError(res));
}

// Deletes a Coupon from the DB
export function destroy(req, res) {

  Coupon.find({
      where: {
        id: req.body.coupon_id
      }
    })
    .then(function(coupon) {

      if (coupon === null) {

        res.status(500).json("Invalid Coupon");
        return;
      }

      coupon.active = false;
      coupon.save()
        .then(function() {
          res.status(200).json("Success");
        })
    })
}