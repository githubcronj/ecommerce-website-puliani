'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('feedback', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_name: DataTypes.STRING,
    user_email: DataTypes.STRING,
    user_phone_number: DataTypes.STRING,
    text: DataTypes.STRING(1000),
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  });
}