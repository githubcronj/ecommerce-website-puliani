/**
 * Main application file
 */

'use strict';

import express from 'express';
import sqldb from './sqldb';
import config from './config/environment';
import http from 'http';

// Populate databases with sample data


// Setup server
var app = express();
var server = http.createServer(app);
require('./config/express')(app);
require('./routes')(app);
require('./lib/cron.job.js');

console.log=function(){

}

// Start server
function startServer() {
	app.angularFullstack = server.listen(config.port, config.ip, function() {
		console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
	});
}

sqldb.sequelize.sync().then(function() {
		//sqldb.product.addFullTextIndex();

		if (config.seedDB) {
			var seed = require('./config/seed');
			seed.createSeedDb().then(function() {

				sqldb.product.addFullTextIndex();
			})
		}

	})
	.then(startServer)
	.catch(function(err) {
		console.log('Server failed to start due to error: %s', err);
	});

// Expose app
exports = module.exports = app;
