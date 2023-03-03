'use strict';

export default function(sequelize, DataTypes) {
    return sequelize.define('payment', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        payment_details:DataTypes.JSON

    }, {
        classMethods: {
            associate: function(model) {
                var Payment = model.payment;
                var Order = model.order;

                Order.hasMany(Payment, {

                    foreignKey: "order_id",
                    onDelete: "NO ACTION",
                    onUpdate: "NO ACTION"
                });
            }
        }
    });
}