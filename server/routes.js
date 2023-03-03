/**
 * Main application routes
 */

'use strict';

import errors from './components/errors';
import path from 'path';
var config = require('./config/environment');
var localFileUpload = require('./lib/local.file.upload');

var uploadCategory = require('./lib/category.populate');


export default function(app) {
  // Insert routes below


  app.use('/api/comming_soon/', require('./api/comming_soon'));
  app.use('/api/payment_transaction_sessions', require('./api/payment_transaction_session'));
  app.use('/api/verify_user_email_sessions', require('./api/verify_user_email_session'));
  app.use('/api/reset_password_sessions', require('./api/reset_password_session'));
  app.use('/api/bulk_orders', require('./api/bulk_order'));
  app.use('/api/feedbacks', require('./api/feedback'));

  app.use('/api/news', require('./api/news'));

  app.use('/api/banner_images', require('./api/banner_image'));
  app.use('/api/payments', require('./api/payment'));
  app.use('/api/shipments', require('./api/shipment'));
  app.use('/api/coupons', require('./api/coupon'));
  app.use('/api/order_products', require('./api/order_product'));
  app.use('/api/orders', require('./api/order'));
  app.use('/api/wishlists', require('./api/wishlist'));
  app.use('/api/cart_products', require('./api/cart_product'));
  app.use('/api/carts', require('./api/cart'));
  app.use('/api/product_categories', require('./api/product_category'));
  app.use('/api/categories', require('./api/category'));
  app.use('/api/products', require('./api/product'));
  //app.use('/api/things', require('./api/thing'));
  app.use('/api/users', require('./api/user'));

  app.use('/auth', require('./auth'));

  app.get('/getUploadFile', function(req, res) {

    //  console.log(__dirname+'/multipleUpload.html');
    res.sendFile(__dirname + '/multipleUpload.html')

  });

  app.post('/categoryPopulate', localFileUpload.localSingleProductImageUpload(), uploadCategory.populate);

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
    .get(errors[404]);

  app.route('/admin')
    .get((req, res) => {
      console.log("yo ", config.root)
      res.sendFile(path.resolve(path.join(config.root, 'admin/index.html')));
    });

  // All other routes should redirect to the index.html
  app.route('/*')
    .get((req, res) => {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
}