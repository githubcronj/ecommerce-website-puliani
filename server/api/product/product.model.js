'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('product', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },

    sku: {
      type: DataTypes.STRING,
      unique: {
        msg: 'The specified skuId already in use.'
      }
    },

    name: DataTypes.STRING,
    short_description: DataTypes.TEXT,
    long_description: DataTypes.TEXT,
    orignal_price: DataTypes.DECIMAL,
    discount_price: DataTypes.DECIMAL,
    images: DataTypes.ARRAY(DataTypes.JSON),
    units_in_stock: DataTypes.INTEGER,
    attribute: DataTypes.JSON

  }, {
    classMethods: {

      getProduct: function(Product, attributes, id, include) {

        return Product.find({

          include: include,
          attributes: attributes,
          where: {
            id: id,
            active: true
          },
          raw: true
        }).then(function(product) {
            
            product.orignal_price = parseFloat(''+product.orignal_price);
          product.discount_price = parseFloat(product.discount_price);
          product.units_in_stock = parseFloat(product.units_in_stock);
          

          return product;
        })
      },

      addFullTextIndex: function() {

        if (sequelize.options.dialect !== 'postgres') {

          return;
        }

        var searchFields1 = ['name', 'short_description', 'long_description', "attribute->>'author'", "attribute->>'publicationName'", "attribute->>'isbn'"];
        var searchFields = "coalesce(name,'') || ' ' || coalesce(short_description,'') || ' ' || coalesce(long_description,'') || ' ' || coalesce(attribute->>'author','') || ' ' || coalesce(attribute->>'publicationName','') || ' ' || coalesce(attribute->>'isbn','')";

        sequelize
          .query('ALTER TABLE product ADD COLUMN textsearchable_index_col TSVECTOR')
          .then(function() {

            return sequelize
              .query("UPDATE product SET textsearchable_index_col = to_tsvector('english', " + searchFields + ");")
              .error(console.log);
          }).then(function() {

            return sequelize
              .query('CREATE INDEX text_search_idx ON product USING gin(textsearchable_index_col);')
              .error(console.log);
          })
          .then(function() {

            return sequelize
              .query("CREATE OR REPLACE FUNCTION documents_search_trigger() RETURNS trigger AS $$ begin new.textsearchable_index_col := to_tsvector(coalesce(new.attribute->>'author','')) || to_tsvector(coalesce(new.name,'')) || to_tsvector(coalesce(new.short_description,'')) || to_tsvector(coalesce(new.long_description,'')) || to_tsvector(coalesce(new.attribute->>'publicationName','')) || to_tsvector(coalesce(new.attribute->>'isbn','')); return new; end $$ LANGUAGE plpgsql;")
              .catch(function(err) {

                console.log("error is ", err)
              });
          })
          .then(function() {

            return sequelize
              .query("CREATE TRIGGER text_vector_update BEFORE INSERT OR UPDATE ON product FOR EACH ROW EXECUTE PROCEDURE documents_search_trigger();")
              .catch(function(err) {

                console.log("error is ", err)
              });
          })
          .error(console.log);
      }
    }
  });
}