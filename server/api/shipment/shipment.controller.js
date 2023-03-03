/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/shipments              ->  index
 * POST    /api/shipments              ->  create
 * GET     /api/shipments/:id          ->  show
 * PUT     /api/shipments/:id          ->  update
 * DELETE  /api/shipments/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import db from '../../sqldb';

var Shipment = db.shipment;
var Order = db.order;
var mailer = require("../../lib/mail.js");
var sms = require("../../lib/sms.js");
var mailConfig=require("../../mailConfig.json");
var config = require("../../config/environment");
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

// Gets a list of Shipments
export function index(req, res) {
  Shipment.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Shipment from the DB
export function show(req, res) {
  Shipment.find({
      where: {
        order_id: req.params.id
      }
    })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Shipment in the DB
export function create(req, res) {
  Shipment.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Shipment in the DB
export function update(req, res) {

  Order.find({
      where: {
        id: req.body.order_id
      }
    })
    .then(function(order) {

      order.status = req.body.order_status;
      order.save()
        .then(function(order) {
          console.log("order--->"+JSON.stringify(order));
          Shipment.find({
              where: {
                id: req.body.shipment_id
              }
            })
            .then(function(shipment) {
              console.log("shipment--->"+JSON.stringify(shipment));
              shipment.tracking_number = req.body.tracking_number;
              shipment.progress = req.body.progress;
              shipment.dispatch_date = req.body.dispatch_date;
              shipment.actual_delivery_date = req.body.actual_delivery_date;

              shipment.save()
                .then(function(result) {
                    if(order.status=="intransit")
                    {

                      sendShipmentEmail(order.user_id,shipment.tracking_number);
                      sendShipmentSms(order.user_id,shipment.tracking_number);
                    }

                  result.dataValues.order_status=order.status;
                  
                  res.status(200).json(result)
                })
            })
        })
    })


}

// Deletes a Shipment from the DB
export function destroy(req, res) {
  Shipment.find({
      where: {
        id: req.params.id
      }
    })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

function sendShipmentEmail(userid,trackingNumber)
{
console.log("user-->"+userid);
var script = 'select first_name,email from "user" where id='+userid;
db.sequelize.query(script, {

    type: sequelize.QueryTypes.SELECT
  })
    .then(function(userDetails) {
console.log("user--->"+JSON.stringify(userDetails));
  var html='<p>Hi '+ userDetails[0].first_name+',<br><br>';
html+='Good news! Your order is on its way. It will be with you soon, but if you want to keep an eye on ';
html+='it you can&nbsp;<a href="http://firstflight.net:8081/single-web-tracking/singleTracking.do">click here</a> &nbsp;to follow its journey.<br>';
html+='In the meantime,&nbsp;<a href=\"'+mailConfig.baseURL+'\">click here</a>&nbsp;to see what is new on site.<br>';
html+='For more information regarding your order, past order history or saved details, simply log ';
html+='into&nbsp;your <a href=\"'+mailConfig.baseURL+'/redirect?goto=myaccount\">Account</a><br><br>';
html+='<span style="font-size:10px"><b>Puliani Customer Care<b></span><br>';
html+='<span style="font-size:10px">Please do not reply to this email. If there is anything else you would like to know, please contact <a href=\"'+mailConfig.baseURL+'/contact_us\">Puliani Customer Care team</a></span>';
 
mailer.sendMail(config.mail.sender, userDetails[0].email, "Your Order Is Ready To Be Shipped", null, html);
});

}


function sendShipmentSms(userid,trackingNumber)
{
console.log("user-->"+userid);
var script = 'select first_name,email,phone_number from "user" where id='+userid;
db.sequelize.query(script, {

    type: sequelize.QueryTypes.SELECT
  })
    .then(function(userDetails) {
console.log("user--->"+JSON.stringify(userDetails));
 var smsContent='Hi '+userDetails[0].first_name+', Your order is ready to be shipped! Your tracking number is:'+trackingNumber+'. You can track your order here  http://firstflight.net:8081/single-web-tracking/singleTracking.do Thank you for shopping @ puliani law books';
     sms.sendSms(userDetails[0].phone_number[0],smsContent);
});

}