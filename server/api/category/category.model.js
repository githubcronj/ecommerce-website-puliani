'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('category', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING,
    alias: {

      type: DataTypes.STRING,
      unique: {
        msg: 'The specified Category alias is already in use.'
      }
    },

    description: DataTypes.TEXT,
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    thumbnail_url: DataTypes.STRING
  }, {

    classMethods: {
      associate: function(model) {

        var Category = model.category;

        Category.hasMany(Category, {

          foreignKey: "parent_id",
          unique: false,
          onDelete: "NO ACTION",
          onUpdate: "NO ACTION"
        });
      }

    }
  });
}