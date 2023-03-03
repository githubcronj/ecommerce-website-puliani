'use strict';

import crypto from 'crypto';
var authTypes = ['github', 'twitter', 'facebook', 'google'];

var validatePresenceOf = function(value) {
  return value && value.length;
};

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('user', {

    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    gender: DataTypes.STRING,
    dob: DataTypes.DATE,

    addresses: DataTypes.ARRAY(DataTypes.JSON),
    phone_number: DataTypes.ARRAY(DataTypes.STRING),

    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true
      }
    },
    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'customer'
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    provider: DataTypes.STRING,
    salt: DataTypes.STRING,
    facebook: DataTypes.TEXT,
    twitter: DataTypes.TEXT,
    google: DataTypes.TEXT,
    github: DataTypes.TEXT

  }, {

    /**
     * Virtual Getters
     */
    getterMethods: {
      // Public profile information
      profile: function() {
        return {
          'name': this.name,
          'role': this.role
        };
      },

      // Non-sensitive info we'll be putting in the token
      token: function() {
        return {
          'id': this.id,
          'role': this.role
        };
      }
    },

    /**
     * Pre-save hooks
     */
    hooks: {
      beforeBulkCreate: function(users, fields, fn) {
        var totalUpdated = 0;
        users.forEach(function(user) {
          user.updatePassword(function(err) {
            if (err) {
              return fn(err);
            }
            totalUpdated += 1;
            if (totalUpdated === users.length) {
              return fn();
            }
          });
        });
      },
      beforeCreate: function(user, fields, fn) {
        user.updatePassword(fn);
      },
      beforeUpdate: function(user, fields, fn) {
        if (user.changed('password')) {
          return user.updatePassword(fn);
        }
        fn();
      }
    },

    /**
     * Instance Methods
     */
    instanceMethods: {
      /**
       * Authenticate - check if the passwords are the same
       *
       * @param {String} password
       * @param {Function} callback
       * @return {Boolean}
       * @api public
       */
      authenticate: function(password, callback) {
        if (!callback) {
          return this.password === this.encryptPassword(password);
        }

        var _this = this;
        this.encryptPassword(password, function(err, pwdGen) {
          if (err) {
            callback(err);
          }

          if (_this.password === pwdGen) {
            callback(null, true);
          } else {
            callback(null, false);
          }
        });
      },

      /**
       * Make salt
       *
       * @param {Number} byteSize Optional salt byte size, default to 16
       * @param {Function} callback
       * @return {String}
       * @api public
       */
      makeSalt: function(byteSize, callback) {
        var defaultByteSize = 16;

        if (typeof arguments[0] === 'function') {
          callback = arguments[0];
          byteSize = defaultByteSize;
        } else if (typeof arguments[1] === 'function') {
          callback = arguments[1];
        }

        if (!byteSize) {
          byteSize = defaultByteSize;
        }

        if (!callback) {
          return crypto.randomBytes(byteSize).toString('base64');
        }

        return crypto.randomBytes(byteSize, function(err, salt) {
          if (err) {
            callback(err);
          }
          return callback(null, salt.toString('base64'));
        });
      },

      /**
       * Encrypt password
       *
       * @param {String} password
       * @param {Function} callback
       * @return {String}
       * @api public
       */
      encryptPassword: function(password, callback) {
        if (!password || !this.salt) {
          if (!callback) {
            return null;
          }
          return callback(null);
        }

        var defaultIterations = 10000;
        var defaultKeyLength = 64;
        var salt = new Buffer(this.salt, 'base64');

        if (!callback) {
          return crypto.pbkdf2Sync(password, salt, defaultIterations, defaultKeyLength)
            .toString('base64');
        }

        return crypto.pbkdf2(password, salt, defaultIterations, defaultKeyLength,
          function(err, key) {
            if (err) {
              callback(err);
            }
            return callback(null, key.toString('base64'));
          });
      },

      /**
       * Update password field
       *
       * @param {Function} fn
       * @return {String}
       * @api public
       */
      updatePassword: function(fn) {
        // Handle new/update passwords
        if (this.password) {
          if (!validatePresenceOf(this.password) && authTypes.indexOf(this.provider) === -1) {
            fn(new Error('Invalid password'));
          }

          // Make salt with a callback
          var _this = this;
          this.makeSalt(function(saltErr, salt) {
            if (saltErr) {
              fn(saltErr);
            }
            _this.salt = salt;
            _this.encryptPassword(_this.password, function(encryptErr, hashedPassword) {
              if (encryptErr) {
                fn(encryptErr);
              }
              _this.password = hashedPassword;
              fn(null);
            });
          });
        } else {
          fn(null);
        }
      }
    },
    classMethods: {

      getUser: function(User, attributes, id, email) {

        var where = {};

        where.active=true;

        if (id !== undefined)
          where.id = id;
        else if (email !== undefined)
          where.email = email;

        return User.find({

            attributes: attributes,
            where: where,
            raw: true
          })
          .then(function(user) {

            return user;
          })

      },

      isValidUser: function(User, parms, type) {

        var defered = Q.defer();

        var condition = {}
        condition.where = {}

        if (type.valueOf() === 'id')
          condition.where.id = parms;
        else if (type.valueOf() === 'email')
          condition.where.email = parms;


        User.find(condition).then(function(user) {

          if (user === null) {
            defered.resolve(false);
          } else
            defered.resolve(true);
        }).catch(function(err) {

          defered.reject(err);
        })

        return defered.promise;

      }
    }

  });

  return User;
};