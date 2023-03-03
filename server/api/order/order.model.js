'use strict';

export default function(sequelize, DataTypes) {
    return sequelize.define('order', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        order_number:DataTypes.STRING,
        total_price: DataTypes.DECIMAL,
        shipping_charge: DataTypes.DECIMAL,
        total_discount_price: DataTypes.DECIMAL,
        status: DataTypes.STRING,
        delivery_address: DataTypes.JSON,
        estimated_delivery_date: DataTypes.DATE
    }, {
        classMethods: {
            
            associate: function(model) {
                var Order = model.order;
                var Coupon = model.coupon;
                var User = model.user;


                User.hasMany(Order, {

                    foreignKey: "user_id",
                    onDelete: "NO ACTION",
                    onUpdate: "NO ACTION"
                });

                Coupon.hasMany(Order, {

                    foreignKey: "coupon_id",
                    onDelete: "NO ACTION",
                    onUpdate: "NO ACTION"
                });
            }
        }
    });
}