'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('bulk_order', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_name: DataTypes.STRING,
    user_email: DataTypes.STRING,
    user_phone_number: DataTypes.STRING,
    text: DataTypes.STRING,
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  });
}