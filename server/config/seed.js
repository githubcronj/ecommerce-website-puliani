/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import sqldb from '../sqldb';
import faker from 'faker';
import Q from 'q';

var Product = sqldb.product;
var Category = sqldb.category;
var Coupon = sqldb.coupon;
var ProductCategory = sqldb.product_category;
var Cart = sqldb.cart;
var User = sqldb.user;
var CartProduct = sqldb.cart_product;
var Wishlist = sqldb.wishlist;
var BannerImage = sqldb.banner_image;
var News = sqldb.news;


export function createSeedDb() {

	var defered = Q.defer();

	//**Product Data**
	var productArray = [];

	for (var i = 0; i < 2000; i++) {

		var bind = "";

		if (i % 2 === 0) {

			var discount = 10;
			bind = "PB";
		} else {

			var discount = 20;
			bind = "HB";
		}


		var attributes = {};
		var imgs = [];

		attributes.author = faker.name.firstName() + " " + faker.name.lastName();

		attributes.publicationName = faker.company.companyName();

		attributes.edition = "" + i;

		attributes.year = "" + i;

		attributes.binding = bind;

		attributes.language = "English";

		attributes.isbn = faker.random.uuid();


		for (var j = 0; j < 5; j++) {
			if (j === 0)
				var imgType = 'cover'
			else
				var imgType = 'detailed'


			imgs[j] = {

				url: faker.image.avatar(),
				type: imgType,
				active: true,
				sort_order: j
			}
		}

		var orignalPrice = faker.commerce.price();

		if ((orignalPrice - discount) > 0)
			var discountPrice = orignalPrice - discount;
		else
			var discountPrice = orignalPrice;

		productArray[i] = {
			sku: "" + i,
			name: faker.commerce.productName(),
			short_description: faker.lorem.sentence(),
			long_description: faker.lorem.paragraph(),
			orignal_price: orignalPrice,
			discount_price: discountPrice,
			units_in_stock: i,
			attribute: attributes,
			images: imgs
		}
	}



	var categoryArray = [];
	var parentCategories = ['journals', 'lawyers', 'students', 'bare acts', 'state publications'];

	for (var i = 0; i < 5; i++) {

		categoryArray[i] = {
			name: parentCategories[i],
			alias: parentCategories[i],
			description: faker.lorem.paragraph(),
			thumbnail_url: faker.image.imageUrl()
		}

	}

	for (var i = 5; i < 25; i++) {

		var name = faker.hacker.adjective() + '' + i;
		categoryArray[i] = {
			name: name,
			alias: name,
			parent_id: ((i % 5) + 1),
			description: faker.lorem.paragraph(),
			thumbnail_url: faker.image.imageUrl()
		}

	}
	var temp = 6;
	for (var i = 25; i < 105; i++) {
		var name = faker.hacker.verb() + '' + i;
		categoryArray[i] = {
			name: name,
			alias: name,
			parent_id: temp,
			description: faker.lorem.paragraph(),
			thumbnail_url: faker.image.imageUrl()
		}
		temp++;
		if (temp === 26)
			temp = 6;

	}

	var productCategoryArray = [];

	for (var i = 0; i < 2000; i++) {

		productCategoryArray[i] = {
			product_id: i + 1,
			category_id: ((i % 105) + 1)
		}
	}


	var userArray = [];
	for (var i = 0; i < 10; i++) {
		userArray[i] = {

			first_name: faker.name.firstName(),
			last_name: faker.name.lastName(),
			gender: 'male',
			dob: faker.date.past(),
			addresses: [{
				name: faker.name.firstName() + faker.name.lastName(),
				address: faker.address.streetAddress(),
				landmark: faker.address.streetName(),
				city: faker.address.city(),
				state: faker.address.state(),
				phone: faker.phone.phoneNumber(),
				pincode: faker.address.zipCode()
			}],
			phone_number: [faker.phone.phoneNumber()],
			email: faker.internet.email().toLowerCase(),
			role: 'customer',
			password: 'bookstore',
			provider: 'local',
		}
	}
	userArray[10] = {
		first_name: 'suresh',
		last_name: 'varman',
		gender: 'male',
		dob: faker.date.past(),
		addresses: [{
			name: 'suresh',
			address: 'tn',
			landmark: 'tn',
			city: 'tn',
			state: 'tn',
			phone: '9999999999',
			pincode: '413001'
		}],
		phone_number: ['9999999999'],
		email: 'suresh.varman@cronj.com',
		role: 'admin',
		password: 'suresh',
		provider: 'local',
	}

	var newsArray = [];

	for (var i = 0; i < 20; i++) {

		newsArray[i] = {


			title: faker.name.firstName(),
			description: faker.lorem.paragraph()
		}
	}

	var wishlistArray = [];

	for (var i = 0; i < 50; i++) {


		wishlistArray[i] = {
			product_id: i + 1,
			user_id: ((i % 10) + 1)

		}
	}

	var couponArray = [];

	for (var i = 0; i < 10; i++) {

		var satrtDate = new Date();
		var expiryDate = new Date();
		expiryDate.setDate(expiryDate.getDate() + (20 * (i + 1)));

		if (i % 2 == 0)
			var opr = 'percentage';
		else
			var opr = 'fixed';

		couponArray[i] = {
			code: faker.random.number(),
			minimum_cart: 100 * i,
			start_date: satrtDate,
			expiry_date: expiryDate,
			operation: opr,
			value: i + 10,
			is_single_use: faker.random.boolean(),
			description: faker.lorem.paragraph(),
			terms: faker.lorem.paragraph()
		}

	}

	var cartArray = [];

	for (var i = 0; i < 10; i++) {

		if (i % 2 === 0) {

			cartArray[i] = {

				user_id: i + 1
			}
		} else {

			cartArray[i] = {

				user_id: i + 1,
				coupon_id: i + 1
			}
		}

	}

	var cartProductArray = [];

	for (var i = 0; i < 50; i++) {

		cartProductArray[i] = {
			cart_id: ((i % 10) + 1),
			product_id: i + 1,

			quantity: ((i % 5) + 1)
		}
	}

	var bannerImageArray = [];

	for (var i = 0; i < 10; i++) {

		bannerImageArray[i] = {

			url: faker.image.imageUrl(),
			active: true,
			sort_order: i
		}
	}



	Product.sync()
		.then(function() {

			return Product.bulkCreate(productArray);
		})
		.then(function() {

			return Category.sync();
		})
		.then(function() {

			return Category.bulkCreate(categoryArray);

		})
		.then(function() {

			return ProductCategory.sync();

		})
		.then(() => {

			return ProductCategory.bulkCreate(productCategoryArray)
		})
		.then(function() {

			return User.sync();
		})
		.then(function() {

			return User.bulkCreate(userArray);
		})
		.then(function() {

			return News.sync();
		})
		.then(function() {

			return News.bulkCreate(newsArray);
		}).then(function() {

			return Wishlist.sync()
		})
		.then(function() {

			return Wishlist.bulkCreate(wishlistArray);
		})
		.then(function() {

			return Coupon.sync();
		})
		.then(function() {

			return Coupon.bulkCreate(couponArray);
		})
		.then(function() {

			return Cart.sync();
		})
		.then(function() {

			return Cart.bulkCreate(cartArray);
		})
		.then(function() {

			return CartProduct.sync();
		})
		.then(function() {

			return CartProduct.bulkCreate(cartProductArray);
		})
		.then(function() {

			return BannerImage.sync();
		})
		.then(function() {

			return BannerImage.bulkCreate(bannerImageArray);
		})
		.then(function() {

			defered.resolve();
		});

	return defered.promise;
}