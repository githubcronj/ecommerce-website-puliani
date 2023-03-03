'use strict';

export default function(sequelize, DataTypes) {
    return sequelize.define('product_category', {

    }, {
        classMethods: {
            associate: function(model) {
                var ProductCategory = model.product_category;
                var Product = model.product;
                var Category = model.category;

                Product.belongsToMany(Category, {

                    through: {
                        model: ProductCategory,
                        unique: false
                    },
                    foreignKey: 'product_id'

                })

                Category.belongsToMany(Product, {

                    through: {
                        model: ProductCategory,
                        unique: false
                    },
                    foreignKey: 'category_id'

                })



            }
        }
    });
}