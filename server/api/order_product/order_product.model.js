'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('order_product', {
 
    unit_price: DataTypes.DECIMAL,
    quantity: DataTypes.DECIMAL

  }, {
    
    classMethods: {
      associate: function(model) {
        var OrderProduct = model.order_product;
        var Order = model.order;
        var Product = model.product;

        Product.belongsToMany(Order, {

          through: {
            model: OrderProduct,
            unique: false
          },
          foreignKey: 'product_id'
        })

        Order.belongsToMany(Product, {

          through: {
            model: OrderProduct,
            unique: false
          },
          foreignKey: 'order_id'
        })
      }
    }
  });
}