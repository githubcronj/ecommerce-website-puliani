'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('banner_image', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    url:DataTypes.STRING,
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    sort_order:DataTypes.INTEGER,
  });
}
