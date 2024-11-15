const multer = require("multer");
const randomstring = require("randomstring");

const TYPE_IMAGES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/jpg": "jpg",
  "image/gif": "gif",
  "application/pdf" : "pdf",
  "application/octet-stream" : "docx",
  "application/octet-stream" : "doc",
  "text/plain" : "txt"
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    const extension = TYPE_IMAGES[file.mimetype];
    callback(null, randomstring.generate(11) + "." + extension);
	console.log(file.mimetype)
  },
});

module.exports = multer({ storage: storage });
