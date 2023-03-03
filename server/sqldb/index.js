/**
 * Sequelize initialization module
 */

'use strict';

import path from 'path';
import config from '../config/environment';
import Sequelize from 'sequelize';
import fs from 'fs';
import lodash from 'lodash';
var sequelize = new Sequelize(config.sequelize.uri, config.sequelize.options);
var db = {};
var models = ['news', 'banner_image', 'payment' ,'shipment', 'coupon', 'order_product', 'order', 'wishlist', 'cart_product', 'cart', 'category', 'product_category','product', 'user','feedback','bulk_order','reset_password_session', 'verify_user_email_session','payment_transaction_session','comming_soon'];
// var models = ['account','student','college'];
var modelPathFormat = path.join(__dirname, '../api/{0}/{0}.model.js');

for (var i in models) {
	var model = sequelize.import(modelPathFormat.replace(/\{0\}/g, models[i]));
	console.log("model: ",model);
	db[model.name] = model;
}
// TODO: Uncomment after solving cyclic dependencies
Object.keys(db).forEach(function(modelName) {
	if ('associate' in db[modelName]) {

		db[modelName].associate(db)
	}
})


export default lodash.extend({
	sequelize: sequelize,
	Sequelize: Sequelize
}, db);