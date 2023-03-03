'use strict';

// Production specific configuration
// =================================
module.exports = {
  // Server IP
  ip:     process.env.OPENSHIFT_NODEJS_IP ||
          process.env.IP ||
          undefined,

  // Server port
  port:   process.env.OPENSHIFT_NODEJS_PORT ||
          process.env.PORT ||
          8080,

  sequelize: {
    uri:  process.env.SEQUELIZE_URI ||
          'postgres://postgres:password@localhost:5432/book-store',

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

  }
};
