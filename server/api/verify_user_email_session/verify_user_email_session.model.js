'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('verify_user_email_session', {
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
        var VerifyUserEmailSession = model.verify_user_email_session;
        var User = model.user;

        User.hasMany(VerifyUserEmailSession, {

          foreignKey: "user_id",
          unique: false,
          onDelete: "NO ACTION",
          onUpdate: "NO ACTION"

        });
      }
    }
  });
}