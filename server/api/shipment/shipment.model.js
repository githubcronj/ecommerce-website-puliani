'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('shipment', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    
    tracking_number: DataTypes.STRING,
    progress: DataTypes.ARRAY(DataTypes.JSON),
    dispatch_date: DataTypes.DATE,
    actual_delivery_date: DataTypes.DATE

  },{
        classMethods: {
            associate: function(model) {
                var Shipment = model.shipment;
                var Order = model.order;

                Order.hasOne(Shipment, {
                    
                    foreignKey: "order_id",
                    onDelete: "NO ACTION",
                    onUpdate: "NO ACTION"
                });
            }
        }
    });
}