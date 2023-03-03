'use strict';

// Development specific configuration
// ==================================
module.exports = {

  // Sequelize connection opions
  sequelize: {
    uri: 'postgres://postgres:password@localhost:5432/book-store',
    options: {
      logging: false,
      dialect: 'postgres',
      //storage: 'dev.sqlite',
      define: {
        timestamps: true,
        underscored: true,
         freezeTableName: true,
      }
    }
  },

  // Seed database on startup
  seedDB: false


};
