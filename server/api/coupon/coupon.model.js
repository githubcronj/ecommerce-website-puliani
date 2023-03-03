'use strict';

var Q = require('q');

export default function(sequelize, DataTypes) {
  return sequelize.define('coupon', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    code: {
      type: DataTypes.STRING,
      unique: true
    },
    minimum_cart: DataTypes.DECIMAL,
    start_date: DataTypes.DATE,
    expiry_date: DataTypes.DATE,
    operation: DataTypes.STRING,
    value: DataTypes.DECIMAL,
    is_single_use: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    description: DataTypes.TEXT,
    terms: DataTypes.TEXT,
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    classMethods: {

      getCoupon: function(Coupon, attributes, id, code) {

        var date = new Date();
        var condition = {}
        condition.attributes = attributes;
        condition.where = {};

        if (id !== undefined) {

          condition.where.id = id;
        } else if (code !== undefined) {

          condition.where.code = code;
        }

        condition.where.start_date = {

          $lte: date
        }

        condition.where.expiry_date = {

          $gte: date
        }

        condition.where.active = true;

        return Coupon.find(condition).then(function(coupon) {

          if (coupon)
            return coupon.dataValues;
          else
            return coupon;

        })

      }

    }
  });
}