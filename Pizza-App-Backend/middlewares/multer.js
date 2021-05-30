const multer = require("multer");
const path = require("path");

const mimeTypeMap = {
	"image/png": "png",
	"image/jpeg": "jpg",
	"image/jpg": "jpg",
};
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const isValid = mimeTypeMap[file.mimetype];
		let error = new Error("Invalid Mime Type");
		if (isValid) {
			error = null;
		}
		cb(error, "images/");
	},
	filename: (req, file, cb) => {
		const name = file.originalname.toLowerCase().split(" ").join("-");
		const ext = mimeTypeMap[file.mimetype];
		cb(null, name + "-" + Date.now() + "." + ext);
	},
});

const upload = multer({
	storage: storage,
}).single("image");

module.exports = upload;
