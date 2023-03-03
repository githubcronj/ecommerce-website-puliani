'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('payment_transaction_session', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },

    transaction_id: DataTypes.STRING,
    address_index: DataTypes.INTEGER,
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }

  }, {
    classMethods: {
      associate: function(model) {

        var User = model.user;
        var PaymentTransactionSession = model.payment_transaction_session;

        User.hasMany(PaymentTransactionSession, {

          foreignKey: "user_id",
          onDelete: "NO ACTION",
          onUpdate: "NO ACTION"
        });
      }
    }
  });
}