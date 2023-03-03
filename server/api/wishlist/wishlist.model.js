'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('wishlist', {
  
  }, {
    classMethods: {
      associate: function(model) {
        var Wishlist = model.wishlist;
        var User = model.user;
        var Product = model.product;

        Product.belongsToMany(User, {

          through: {
            model: Wishlist,
            unique: false
          },
          foreignKey: 'product_id'
        })

        User.belongsToMany(Product, {

          through: {
            model: Wishlist,
            unique: false
          },
          foreignKey: 'user_id'
        })
      }
    }
  });
}