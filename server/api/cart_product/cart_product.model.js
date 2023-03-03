'use strict';

export default function(sequelize, DataTypes) {
    return sequelize.define('cart_product', {

        quantity: DataTypes.INTEGER

    }, {
        classMethods: {

            updateCartProduct: function(CartProduct, cart_id, product_id) {

                CartProduct.update({

                    quantity: parseInt(product.quantity) + parseInt(productArray[index].quantity)
                }, {

                    where: {
                        cart_id: productArray[index].cart_id,
                        product_id: productArray[index].product_id
                    }

                })
            },

            getCartProducts: function(CartProduct, attributes, cart_id, product_id) {
                var where = {};

                if (cart_id !== undefined)
                    where.cart_id = cart_id

                if (product_id !== undefined)
                    where.product_id = product_id


                return CartProduct.findAll({
                    attributes: attributes,
                    where: where,
                    raw: true

                }).then(function(cartProduct) {

                    return cartProduct;
                })

            },
            associate: function(model) {
                var CartProduct = model.cart_product;
                var Cart = model.cart;
                var Product = model.product;

                Product.belongsToMany(Cart, {

                    through: {
                        model: CartProduct,
                        unique: false
                    },
                    foreignKey: 'product_id'
                })

                Cart.belongsToMany(Product, {

                    through: {
                        model: CartProduct,
                        unique: false
                    },
                    foreignKey: 'cart_id'
                })
            }
        }
    });
}