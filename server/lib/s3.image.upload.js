var fs = require('fs');
var Q = require('q');
var path = require('path');
var aws = require('aws-sdk');
var awsS3Config = require("../awsS3Config.json");
var url = require("url");



var BUCKET_NAME = 'pulianitest';

aws.config.update(awsS3Config);
var s3 = new aws.S3();

var Client = require('thumbd').Client,
	client = new Client({

		awsKey: awsS3Config.accessKeyId,
		awsSecret: awsS3Config.secretAccessKey,
		s3Bucket: BUCKET_NAME,
		sqsQueue: 'ThumbnailCreator',
		awsRegion: awsS3Config.region,
		s3Acl: 'public-read'
	});



export function uploadAndResize(localPath, localFileName, fileUploadDir, uploadFileName) {

	var defered = Q.defer();
	try{

		client.upload(localPath + localFileName, fileUploadDir + uploadFileName, function(err) {

		if (err) {
			console.log("eror->",err);
			throw err;
		} else {
			client.thumbnail(fileUploadDir + uploadFileName, [{
				"suffix": "medium",
				"width": 360,
				"height": 360,
				"background": "white",
				"strategy": "%(command)s %(localPaths[0])s -resize %(width)sX%(height)s^ -gravity north -extent %(width)sX%(height)s  %(convertedPath)s"
			}, {
				"suffix": "thumb",
				"width": 100,
				"height": 100,
				"background": "white",
				"strategy": "%(command)s %(localPaths[0])s -resize %(width)sX%(height)s^ -gravity north -extent %(width)sX%(height)s  %(convertedPath)s"
			}], {
				//notify: 'https://callback.example.com'
			});
			var response = {};

			//https://s3-ap-southeast-1.amazonaws.com/pulianitest/1/5825c7d0-127f-4dac-b802-ca24efba2bcd-original.jpeg

			response.url = 'https://s3-' + awsS3Config.region + '.amazonaws.com/' + BUCKET_NAME + '/' + fileUploadDir;
			response.uploadFileName = uploadFileName;
			response.localFileName = localFileName;

			defered.resolve(response);
		}
	});
	}
	catch(e){
		console.log("exception e",e)
		defered.reject(e);
		return;
	}
	
	return defered.promise;
}

export function deleteImage(objects) {

	var defered = Q.defer();

	var images = [];

	for (var i = 0; i < objects.length; i++) {

		var parsed = url.parse(objects[i]).path.replace('/' + BUCKET_NAME + '/', '');
		var image = {};
		image.Key = parsed;
		images.push(image);
	}
	console.log("images s", images)
	var params = {

		Bucket: BUCKET_NAME,

		Delete: {
			Objects: images
		}
	};

	s3.deleteObjects(params, function(err, data) {

		if (err) {

			console.log(err, err.stack); // an error occurred
			defered.reject(err);
		} else {

			console.log("delete success ", data); // successful response
			defered.resolve(data);
		}
	});
	return defered.promise;
}



export function uploadFiles(localPath, localFileName, fileUploadDir, uploadFileName) {

	var defered = Q.defer();

	fs.readFile(localPath + localFileName, function(err, file) {
		if (err) {

			defered.reject(err);
		}

		var params = {
			ACL: 'public-read',
			Bucket: BUCKET_NAME,
			Key: uploadFileName,
			Body: file
		};

		s3.upload(params, function(err, data) {

			fs.unlink(localPath + localFileName, function(err) {

				if (err) {
					defered.reject(err);
				}
				console.log("PRINT FILE:", file);
				if (err) {
					defered.reject(err);
				} else {
					console.log("d", data)
					defered.resolve(data)
				}
			});
		});

	});

	return defered.promise;
}