var csv = require('csv-parser')
var fs = require('fs')
import db from '../sqldb';
var Category = db.category;
var _ = require("lodash");
var Q = require('q');


function isUniqueCategory(category) {

	return Category.find({
			where: {
				name: category
			}
		})
		.then(function(data) {

			if (data === null)
				return true;
			else
				return false;
		})

}

function isUniqueAlias(name, parent_id) {

	return Category.find({
			where: {
				name: name,
				parent_id: parent_id
			}
		})
		.then(function(data) {

			if (data === null)
				return true;
			else
				return false;
		})

}

function create(data) {

	var deferred = Q.defer();
	isUniqueCategory(data.name)
		.then(function(result) {

			console.log("category unique", result)

			if (result === true) {

				data.alias = data.name;
				Category.create(data)
					.then(function(category) {

						deferred.resolve(category);
						return;
					})
					.catch(function(err) {

						deferred.reject(err);
						return;
					})
			} else {

				var alias = data.name + '-'+data.parent_id;
				isUniqueAlias(data.name, data.parent_id)
					.then(function(result) {

						console.log("alias unique", result, alias)

						if (result == false) {

							deferred.reject("category already exists.");
							return;
						}
						data.alias = alias;
						Category.create(data)
							.then(function(category) {

								deferred.resolve(category);
								return;
							})
							.catch(function(err) {

								deferred.reject(err)
								return;
							})

					})
			}
		})
	return deferred.promise;
}

var categorySrMapping = {};
var categories = [];
var srIdMapping = {};

function init(index, res) {

	var data = {};
	data.name = categories[index].name.toLowerCase().trim();
	data.parent_id = (categories[index].parent === '') ? null : categorySrMapping[categories[index].parent];

	console.log("category ", data)
	create(data)
		.then(function(category) {

			//console.log(category)
			categorySrMapping[categories[index].sr] = category.dataValues.id;
			index += 1;
			if (index === categories.length) {

				res.status(200).send("success")
				return;
			} else
				init(index, res);

		})
		.catch(function(err) {

			console.log("error: ", err)
			index += 1;
			if (index === categories.length) {

				res.status(200).send("success")
				return;
			} else
				init(index, res);
		})
}

export function populate(req, res) {

	console.log(req.files)

	fs.createReadStream(req.files[0].path)
		.pipe(csv())
		.on('data', function(data) {

			console.log(data)
			categorySrMapping[data.sr] = data;
			categories.push(data);
		})
		.on('end', function() {

			init(0, res);
		})
}