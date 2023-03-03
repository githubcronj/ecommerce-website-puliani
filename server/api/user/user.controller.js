'use strict';

import db from '../../sqldb';
import passport from 'passport';
import config from '../../config/environment';
import jwt from 'jsonwebtoken';

var User = db.user;



function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return function(err) {
    res.status(statusCode).json(err);
  }
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

/**
 * Get list of users
 * restriction: 'admin'
 */
export function index(req, res) {
  User.findAll({
      attributes: [
        'id',
        'first_name',
        'last_name',
        'dob',
        'phone_number',
        'gender',
        'email',
        'role',
        'provider'
      ]
    })
    .then(users => {
      res.status(200).json(users);
    })
    .catch(handleError(res));
}

export function exportUserData(req, res) {
  User.findAll({
      attributes: {
        exclude: ['id', 'password', 'salt', 'active', 'provider', 'facebook', 'twitter', 'google', 'github', 'updated_at']
      }
    })
    .then(users => {
      res.status(200).json(users);
    })
    .catch(handleError(res));
}

/**
 * Creates a new user
 */
export function create(req, res, next) {

  User.find({
      where: {
        email: req.body.email
      }
    })
    .then(function(user) {

      if (user === null) {

        var newUser = User.build(req.body);
        newUser.setDataValue('provider', 'local');
        //newUser.setDataValue('role', 'customer');
        newUser.save()
          .then(function(user) {
            var token = jwt.sign({
              id: user.id
            }, config.secrets.session, {
              expiresIn: 60 * 60 * 5
            });
            res.json({
              token
            });
          })
          .catch(validationError(res));
        return;
      } else if (req.body.role === 'admin' || user.role === 'admin') {

        res.status(500).json("Email already exists.")
        return;

      } else if (user.role === 'guest' && req.body.role === 'guest') {

        var token = jwt.sign({
          id: user.id
        }, config.secrets.session, {
          expiresIn: 60 * 60 * 5
        });
        res.json({
          token
        });
        return;
      } else if (user.role === 'customer' && req.body.role === 'guest') {

        res.status(500).json("Account already exists. Please login to checkout your order.");
        return;
      } else if (user.role === 'customer' && req.body.role === 'customer') {

        res.status(500).json("Email already exists.");
        return;
      } else if (user.role === 'guest' && req.body.role === 'customer') {

        user.role = 'customer';
        user.password = req.body.password;
        user.phone_number = req.body.phone_number;
        user.first_name = req.body.first_name;
        user.last_name = req.body.last_name;
        user.save()
          .then(function(savedUser) {

            var token = jwt.sign({
              id: user.id
            }, config.secrets.session, {
              expiresIn: 60 * 60 * 5
            });
            res.json({
              token
            });
          })
      }
    })

}

/**
 * Get a single user
 */
export function show(req, res, next) {
  var userId = req.params.id;

  User.find({
      where: {
        id: userId
      }
    })
    .then(user => {
      if (!user) {
        return res.status(404).end();
      }
      res.json(user.profile);
    })
    .catch(err => next(err));
}

export function getUser(req, res) {
  var userId = req.params.id;

  User.find({
      where: {
        id: userId
      },
      attributes: [
        'id',
        'first_name',
        'last_name',
        'dob',
        'phone_number',
        'gender',
        'email',
        'role',
        'provider'
      ]
    })
    .then(user => {
      if (!user) {
        return res.status(401).end();
      }
      res.json(user);
    })
    .catch(err => next(err));
}

/**
 * Deletes a user
 * restriction: 'admin'
 */
export function destroy(req, res) {
  User.destroy({
      id: req.params.id
    })
    .then(function() {
      res.status(204).end();
    })
    .catch(handleError(res));
}

/**
 * Change a users password
 */
export function changePassword(req, res, next) {
  var userId = req.user.id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.find({
      where: {
        id: userId
      }
    })
    .then(user => {
      if (user.authenticate(oldPass)) {
        user.password = newPass;
        return user.save()
          .then(() => {
            res.status(204).end();
          })
          .catch(validationError(res));
      } else {
        return res.status(403).json("Incorrect Old Password");
      }
    });
}

export function updateProfile(req, res, next) {

  User.find({
      where: {
        id: req.user.id
      }

    })
    .then(function(user) {

      db.sequelize.query("update \"user\" set first_name='" + req.body.first_name + "', last_name='" + req.body.last_name + "', dob='" + req.body.dob + "', gender='" + req.body.gender + "', phone_number='{" + req.body.phone_number + "}' where id=" + req.user.id + ";")
        .then(function() {

          res.status(200).json("Success");
        })
        .catch(function(err) {

          res.status(500).json(err);
        })
    })
}


/**
 * Get my info
 */
export function me(req, res, next) {
  var userId = req.user.id;

  User.find({
      where: {
        id: userId
      },
      attributes: [
        'id',
        'first_name',
        'last_name',
        'dob',
        'phone_number',
        'gender',
        'email',
        'role',
        'provider'
      ]
    })
    .then(user => { // don't ever give out the password or salt
      if (!user) {
        return res.status(401).end();
      }
      res.json(user);
    })
    .catch(err => next(err));
}

export function getAllUsers(req, res) {

  var dataQuery = 'select id, first_name, last_name, role, gender, dob, addresses, phone_number, email from "user" where active=true';

  if (req.body.searchString !== undefined) {

    dataQuery += ' and CONCAT(first_name,\' \',last_name,\' \',email) ilike \'%' + req.body.searchString + '%\'';
  }
  if (req.body["sortBy"] !== undefined) {


    dataQuery += " ORDER BY " + req.body.sortBy.attribute + " " + req.body.sortBy.direction;
  }
  dataQuery += ' limit ' + req.body.limit + ' offset ' + req.body.offset + ';';

  db.sequelize.query(dataQuery)
    .then(function(users) {

      var countQuery = 'select count(*) from "user" where active=true';

      if (req.body.searchString !== undefined) {

        countQuery += ' and CONCAT(first_name,\' \',last_name,\' \',email) like \'%' + req.body.searchString + '%\';';
      }
      db.sequelize.query(countQuery).then(function(count) {

        var response = {};
        response.count = count[0][0].count;
        response.rows = users[0]
        res.status(200).json(response);
      })

    })
    .catch(function(err) {

      res.status(500).json(err);
    })
}


export function getAddresses(req, res) {

  var userId = req.user.id;

  User.find({

      attributes: [
        'addresses'
      ],
      where: {
        id: userId
      }
    })
    .then(function(addresses) {


      //console.log("addresses",(addresses.dataValues.addresses)?addresses.dataValues:{addresses:[]});
      res.status(200).json((addresses.dataValues.addresses) ? addresses.dataValues : {
        addresses: []
      });
    })
}

export function addAddress(req, res) {



  db.sequelize.query('update "user" set addresses= array_append(addresses,' + "'" + JSON.stringify(req.body.address) + "'" + ') where id =' + req.user.id + ';')
    .then(function(user) {

      res.status(200).json("Success");
    }).catch(function(err) {

      res.status(500).json(err);
    })
}

export function deleteAddress(req, res) {

  User.find({
      where: {
        id: req.user.id
      }
    })
    .then(user => {

      user.addresses.splice(parseInt(req.body.index), 1);
      user.addresses = user.addresses;

      return user.save()
        .then(() => {
          res.status(200).json("Success");
        })
        .catch(function(err) {

          res.status(500).json(err);
        })

    });
}

export function updateAddress(req, res) {

  User.find({
      where: {
        id: req.user.id
      }
    })
    .then(user => {


      user.addresses[parseInt(req.body.index)] = req.body.address;
      user.addresses = user.addresses;

      return user.save()
        .then(() => {
          res.status(200).json("Success");
        })
        .catch(function(err) {

          res.status(500).json(err);
        })

    });
}

/**
 * Authentication callback
 */
export function authCallback(req, res, next) {
  res.redirect('/');
}