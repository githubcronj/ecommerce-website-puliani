'use strict';

export default function(sequelize, DataTypes) {
    return sequelize.define('cart', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        }
    }, {
        classMethods: {


            getCart: function(Cart, attributes, id, user_id) {

                var condition = {}
                condition.attributes = attributes;
                condition.where = {};

                if (id !== undefined) {
                    condition.where.id = id;
                } else if (user_id !== undefined) {
                    condition.where.user_id = user_id;
                }

                condition.raw = true;

                return Cart.find(condition).then(function(cart) {

                    return cart;
                })
            },
            associate: function(model) {
                var User = model.user;
                var Coupon = model.coupon;
                var Cart = model.cart;

                Cart.belongsTo(User, {

                    foreignKey: "user_id",
                    unique: 'unique_cart_user',
                    onDelete: "NO ACTION",
                    onUpdate: "NO ACTION"
                });

                Coupon.hasMany(Cart, {

                    foreignKey: "coupon_id",
                    unique: false,
                    onDelete: "NO ACTION",
                    onUpdate: "NO ACTION"
                });
            }

        }
    });
}