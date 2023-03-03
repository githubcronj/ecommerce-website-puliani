'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('reset_password_session', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    token: DataTypes.STRING,
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    classMethods: {

      associate: function(model) {
        var ResetPasswordSession = model.reset_password_session;
        var User = model.user;

        User.hasMany(ResetPasswordSession, {

          foreignKey: "user_id",
          unique: false,
          onDelete: "NO ACTION",
          onUpdate: "NO ACTION"

        });
      }
    }
  });
}