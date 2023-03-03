'use strict';

var path = require('path');
var _ = require('lodash');

function requiredProcessEnv(name) {
  if (!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
}

// All configurations will extend these options
// ============================================
var all = {
  mail: {
    smtpConfig: {
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // use SSL 
      auth: {

        user: 'pulianibooktest@gmail.com',
        pass: 'bookstore1'
      }
    },
    sender: '"Puliani bookstore" <pulianibooktest@gmail.com>' // sender address 
  },

  env: process.env.NODE_ENV,

  // Root path of server
  root: path.normalize(__dirname + '/../../..'),

  // Server port
  port: process.env.PORT || 9000,

  // Server IP
  ip: process.env.IP || '0.0.0.0',

  // Should we populate the DB with sample data?
  seedDB: false,

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: 'puliani-book-store-secret'
  },

  // MongoDB connection options
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  },

  facebook: {
    clientID: process.env.FACEBOOK_ID || 'id',
    clientSecret: process.env.FACEBOOK_SECRET || 'secret',
    callbackURL: (process.env.DOMAIN || '') + '/auth/facebook/callback'
  },

  twitter: {
    clientID: process.env.TWITTER_ID || 'id',
    clientSecret: process.env.TWITTER_SECRET || 'secret',
    callbackURL: (process.env.DOMAIN || '') + '/auth/twitter/callback'
  },

  google: {
    clientID: process.env.GOOGLE_ID || 'id',
    clientSecret: process.env.GOOGLE_SECRET || 'secret',
    callbackURL: (process.env.DOMAIN || '') + '/auth/google/callback'
  },
  sortOptions: [{
    name: "DEFAULT SORTING",
    value: {
      attribute: "default_sorting",
      direction: "ASC"
    }

  }, {
    name: "SORT BY NEWNESS",
    value: {
      attribute: "prod.created_at",
      direction: "DESC"
    }

  }, {
    name: "SORT BY PRICE: LOW TO HIGH",
    value: {
      attribute: "prod.discount_price",
      direction: "ASC"
    }

  }, {
    name: "SORT BY PRICE: HIGH TO LOW",
    value: {
      attribute: "prod.discount_price",
      direction: "DESC"
    }

  }]



};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
  all,
  require('./shared'),
  require('./' + process.env.NODE_ENV + '.js') || {});