var multer = require('multer');
var fs = require('fs');
var path = require('path');

var rootDir = 'fileUploads/';

if (!fs.existsSync(rootDir)) {

  fs.mkdirSync(rootDir);
}

var singleProductImageUploadDir = 'fileUploads/singleProductImageUploads/';

if (!fs.existsSync(singleProductImageUploadDir)) {

  fs.mkdirSync(singleProductImageUploadDir);
}

var productImageStorage = multer.diskStorage({

  destination: function(req, file, cb) {
    cb(null, 'fileUploads/singleProductImageUploads/')
  },
  filename: function(req, file, cb) {

    var extension = path.extname(file.originalname);
    var fileName = path.basename(file.originalname, extension);
    cb(null, fileName+'_'+Date.now()+extension)
  }
})

var localSingleImageUpload = multer({

  storage: productImageStorage
});

export function localSingleProductImageUpload(){

	return localSingleImageUpload.array('singleProductImages')
}


var bannerImageUploadDir = 'fileUploads/bannerImageUploads/';

if (!fs.existsSync(bannerImageUploadDir)) {

  fs.mkdirSync(bannerImageUploadDir);
}

var bannerImageStorage = multer.diskStorage({

  destination: function(req, file, cb) {
    cb(null, 'fileUploads/bannerImageUploads/')
  },
  filename: function(req, file, cb) {

    var extension = path.extname(file.originalname);
    var fileName = path.basename(file.originalname, extension);
    cb(null, fileName+'_'+Date.now()+extension)
  }
})

var bannerImageUpload = multer({

  storage: bannerImageStorage
});

export function bannerImageUpload(){

  return bannerImageUpload.array('bannerImages')
}
