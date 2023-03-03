import db from '../sqldb';
var CronJob = require('cron').CronJob;
var config = require("../config/environment")
var mailer = require("./mail.js")
var mailConfig=require("../mailConfig.json");
var Wishlist = db.wishlist;
var User = db.user;
var Product = db.product;
var sequelize = db.sequelize;

// new CronJob('1 * * * * *', function() {

//   deleteWishlistExpiredData();
//   addWishlistNotify();
//   wishlistBeforeExpireNotify();
// }, null, true, "Asia/Calcutta");


new CronJob('00 05 15 * * 0-6', function() {

    // * Runs every day 
    // * at 03:00:00 AM.

    deleteWishlistExpiredData();
    addWishlistNotify();
    wishlistBeforeExpireNotify();
    addCartNotify();

  },
  null,
  true, /* Start the job right now */
  "Asia/Calcutta" /* Time zone of this job. */
);

function deleteWishlistData(user_id, product_id) {

  return Wishlist.destroy({
    where: {

      user_id: user_id,
      product_id: product_id
    }
  }).then(function() {

    return "Success";
  })
}

function deleteWishlistExpiredData() {

  sequelize.query("select user_id, product_id from wishlist where age(current_date, date_trunc('day', updated_at))='30 days'")
    .then(function(wishlistItems) {

      if (wishlistItems[0].length === 0)
        return;


      var count = 0;
      for (var i = 0; i < wishlistItems[0].length; i++) {

        deleteWishlistData(wishlistItems[0][i].user_id, wishlistItems[0][i].product_id)
          .then(function() {

            count++;

            if (count === wishlistItems[0].length) {

              console.log("Deleted Items: ", wishlistItems[0])
            }

          })

      }
    })
}

function sendMailCartNotify(user_id, product_id, subject) {

  User.getUser(User, ['email','first_name','last_name'], user_id, undefined)
    .then(function(user) {
      console.log("user--->"+JSON.stringify(user));
      var attributes = ['id', 'name', 'orignal_price', 'discount_price', 'images', 'attribute', 'units_in_stock'];

      Product.getProduct(Product, attributes, product_id, undefined)
        .then(function(product) {
          console.log("product--->"+JSON.stringify(product));
      
var html='<table>';
    html+='  <tbody>';
    html+='    <tr>';
    html+='       <td>';
    html+='         <p><span>Dear '+user.first_name+',&nbsp;</span><br /><br />OOPS You left something in your bag! We wanted to remind you before this sells out.<br /><span>We noticed that you were considering buying the following items:</span></p>';         
    html+='      </td>';
    html+=' </tr>';
    html+='   </tbody>';
    html+=' </table>';
    html+=' <table style="width: 100%;border-spacing: 0px;">';
    html+='   <thead>';
    html+=' <tr>';
    html+='  <td style="border-bottom:2px solid black;">&nbsp;</td>';
    html+=' <td style="border-bottom:2px solid black;"></td>';
    html+='  <td style="border-bottom:2px solid black;padding-bottom:10px" align="center">ITEM</td>';
    html+=' <td style="border-bottom:2px solid black;padding-bottom:10px" align="right">SUBTOTAL</td>';
    html+=' </tr>';
    html+=' </thead>';
    html+=' <tbody>';
    html+='  <tr>';
    html+='     <td valign="middle"></td>';
    html+='    <td  align="left" valign="top">';
    html+='         <p><a href='+mailConfig.baseURL+'/product?id='+product.id+'><img width=100 height=100 src=\"'+product.images[0].url+'\"></a></p>';
    html+='       </td>';
    html+='    <td style="padding-top: 10px;" align="center" valign="top"><a href='+mailConfig.baseURL+'/product?id='+product.id+'>'+product.name+'</a></td>';
    html+='       <td style="padding-top: 10px;" align="right" valign="top">Rs. '+product.orignal_price+'</td>';
    html+=' </tr>';
    html+=' <tr>';
    html+='       <td colspan="4">';
    html+='          <table style="width: 100%;">';
    html+='           <tbody>';
    html+='                 <tr>';
    html+='                            <td align="center"><td align="right"><a style="cursor:pointer" href=' +mailConfig.baseURL+ '/redirect?goto=mycart> <button dir="rtl" style="background-color: #4CAF50;border: none;color: white;padding: 5px 10px;text-align: center;text-decoration: none;cursor: pointer;display: inline-block;font-size: 16px;">Continue Shopping </button> </a><br /><br /></strong></td>';
    html+='          </tr>';
    html+='        </tbody>';
    html+='      </table>';
    html+='    </td>';
    html+='   </tr>';
    html+='  </tbody>';
    html+='</table>';

     //'<table>'+ 
     // '<tr> <th style="text-align:center;">'+
     // '</th>'+ 
     // '<th style="text-align:center;">'+
     // 'Item</th> <th style="text-align:center;">'+
      //'Amount</th> </tr>';
       //   html+='<tr> <td style="text-align:center"><img width=200 height=150 src=\"'+product.images[0].url+'\" alt="W3Schools.com"></td>';
       //   html+='<td style="text-align:center">'+product.name+'</td>';
        //  html+='<td style="text-align:center">'+product.orignal_price+'</td>';
          html+='</tr></table><br>';
          html+='<p style="font-size:10px">You have received this newsletter after signing up either when you made a purchase online or registered with us at <a style="cursor:pointer" href=' +mailConfig.baseURL+'> pulianilawbooks.com.</a></p>';
          mailer.sendMail(config.mail.sender, user.email, subject+'?' , null, html)

        })
    })
}

function sendMailWishlistBeforeExpireNotify(user_id, product_id, subject){


  User.getUser(User, ['email','first_name','last_name'], user_id, undefined)
    .then(function(user) {
      console.log("user--->"+JSON.stringify(user));
      var attributes = ['id', 'name', 'orignal_price', 'discount_price', 'images', 'attribute', 'units_in_stock'];

      Product.getProduct(Product, attributes, product_id, undefined)
        .then(function(product) {
          console.log("product--->"+JSON.stringify(product));
      
var html='<table>';
  html+='  <tbody>';
  html+='    <tr>';
  html+='       <td>';
  html+='         <p><span>Dear '+user.first_name+',&nbsp;</span><br /><br />Items added to your wishlist will not be saved after tomorrow. So don’t miss out!<br /><span>We noticed that you are interested in buying the following items:</span></p>';         
  html+='      </td>';
  html+=' </tr>';
  html+='   </tbody>';
  html+=' </table>';
  html+=' <table style="width: 100%;border-spacing: 0px;">';
  html+='   <thead>';
  html+=' <tr>';
  html+='  <td style="border-bottom:2px solid black;">&nbsp;</td>';
  html+=' <td style="border-bottom:2px solid black;"></td>';
  html+='  <td style="border-bottom:2px solid black;padding-bottom:10px" align="center">ITEM</td>';
  html+=' <td style="border-bottom:2px solid black;padding-bottom:10px" align="right">SUBTOTAL</td>';
  html+=' </tr>';
  html+=' </thead>';
  html+=' <tbody>';
  html+='  <tr>';
  html+='     <td valign="middle"></td>';
  html+='    <td align="left" valign="top">';
  html+='         <p><a href='+mailConfig.baseURL+'/product?id='+product.id+'><img width=100 height=100 src=\"'+product.images[0].url+'\"></a></p>';
  html+='       </td>';
  html+='    <td style="padding-top: 10px;" align="center" valign="top"><a href='+mailConfig.baseURL+'/product?id='+product.id+'>'+product.name+'</a></td>';
  html+='       <td style="padding-top: 10px;" align="right" valign="top">Rs. '+product.orignal_price+'</td>';
  html+=' </tr>';
  html+=' <tr style="border-bottom: 2px solid black;">';
  html+='       <td colspan="4">';
  html+='          <table style="width: 100%;">';
  html+='           <tbody>';
  html+='                 <tr>';
  html+='                            <td align="right"><a style="cursor:pointer" href=' +mailConfig.baseURL+ '/redirect?goto=mywishlist> <button dir="rtl" style="background-color: #4CAF50;border: none;color: white;padding: 5px 10px;text-align: center;text-decoration: none;cursor: pointer;display: inline-block;font-size: 16px;">Continue Shopping </button> </a><br /><br /></strong></td>';
  html+='          </tr>';
  html+='        </tbody>';
  html+='      </table>';
  html+='    </td>';
  html+='   </tr>';
  html+='  </tbody>';
  html+='</table>';

     //'<table>'+ 
     // '<tr> <th style="text-align:center;">'+
     // '</th>'+ 
     // '<th style="text-align:center;">'+
     // 'Item</th> <th style="text-align:center;">'+
      //'Amount</th> </tr>';
       //   html+='<tr> <td style="text-align:center"><img width=200 height=150 src=\"'+product.images[0].url+'\" alt="W3Schools.com"></td>';
       //   html+='<td style="text-align:center">'+product.name+'</td>';
        //  html+='<td style="text-align:center">'+product.orignal_price+'</td>';
          html+='</tr></table><br>';
          html+='<p style="font-size:10px">You have received this newsletter after signing up either when you made a purchase online or registered with us at <a style="cursor:pointer" href=' +mailConfig.baseURL+'> pulianilawbooks.com.</a></p>';
          mailer.sendMail(config.mail.sender, user.email, subject , null, html)

})
    })
}

function sendMail(user_id, product_id, subject, text, html) {

  User.getUser(User, ['email'], user_id, undefined)
    .then(function(user) {

      var attributes = ['id', 'name', 'orignal_price', 'discount_price', 'images', 'attribute', 'units_in_stock'];

      Product.getProduct(Product, attributes, product_id, undefined)
        .then(function(product) {
        mailer.sendMail(config.mail.sender, user.email, subject, null, html)

             })
    })
}


function addWishlistNotify() {
  
  sequelize.query("select user_id, product_id from wishlist where age(current_date, date_trunc('day', updated_at))='1 days'")
    .then(function(wishlistItems) {

      if (wishlistItems[0].length === 0)
        return;

      for (var i = 0; i < wishlistItems[0].length; i++) {

        sendMail(wishlistItems[0][i].user_id, wishlistItems[0][i].product_id, "Item Added To Wishlist", "Sample Text ", null);
      }
    })
}

function addCartNotify() {
  console.log("add cart");
 
  sequelize.query("select c.user_id, cp.product_id from cart_product as cp INNER JOIN cart as c on cp.cart_id=c.id where age(current_date, date_trunc('day', cp.updated_at))='1 days'")
    .then(function(cartItems) {

      if (cartItems[0].length === 0)
        return;

      for (var i = 0; i < cartItems[0].length; i++) {
        
        sendMailCartNotify(cartItems[0][i].user_id, cartItems[0][i].product_id, "Is this still on your mind");
      }
    })
}

function wishlistBeforeExpireNotify() {

  sequelize.query("select user_id, product_id from wishlist where age(current_date, date_trunc('day', updated_at))='29 days'")
    .then(function(wishlistItems) {
      if (wishlistItems[0].length === 0)
        return;

      //console.log("Wishlist Items ", wishlistItems[0].length);
      var count = 0;
      for (var i = 0; i < wishlistItems[0].length; i++) {

        sendMailWishlistBeforeExpireNotify(wishlistItems[0][i].user_id, wishlistItems[0][i].product_id, "Grab it before its gone!", "Sample Text ", null);
      }
    })
}