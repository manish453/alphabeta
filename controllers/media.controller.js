"use strict"
const logger = require("../utils/logger.util"),
	bluebird = require("bluebird"),
	path = require("path"),
	{ paginate_data } = require("../utils/pug.util"),
	{ dirpath, upload_img_dir, upload_img_thumb_dir } = require("../config/configuration"),
	multer = require("multer"),
	sharp = require('sharp'),
	sizeOf = require('image-size'),
	fs = require('fs'),
	MediaModel = Sqlmodels.media;


const controllerfilename = "media-controller",
	limit = 20;

exports.view = (req, res) => {
	try {
		res.render("media/");
	} catch (error) {
		logger.error(controllerfilename, "Catch-index ", error)
		res.status("500").send({
			status: "failed",
			message: "We broke something"
		})
	}
}


exports.paginate = async (req, res) => {
	try {
		let wquery = req.query,
			request = {
				where: [],
				attributes: ["img_id", "image", "thumb"],
				primary: "img_id",
				page: wquery.page,
				limit: limit,
				orderby: "img_id",
				order: "asc",
				templatePath: "./views/media/imglist.pug",
			}

		let data = await paginate_data(request, MediaModel);
		res.send(data)
	} catch (e) {
		logger.error(controllerfilename, "paginate ", e)
		res.status(500).json({ error: "Internal Error on our side. Sorry for the inconvience" })
	}
}

let storage = multer.diskStorage({
	destination: function (req, file, callback) {
		callback(null, dirpath + upload_img_dir)
	},
	filename: function (req, file, callback) {
		callback(null, file.fieldname + "-" + Date.now() + "-" + file.originalname)
	}
})

let upload = multer({
	storage: storage,
	fileFilter: function (req, file, callback) {
		let ext = path.extname(file.originalname).toLowerCase()
		if (ext !== ".jpg" && ext !== '.jpeg' && ext !== '.png' && ext !== '.PNG' && ext !== '.gif') {
			return callback(new Error("Only jpg, gif and png files are allowed!"))
		}
		callback(null, true)
	}
}).single("uploadfile")


exports.uploadimage = async (req, res) => {
	try {
		upload(req, res, async function (err) {
			try {
				if (err) {
					res.status(500).json({ error: "Error uploading file.\n" + err })
					return
				}
				let thumb_image = 'thumbnails-' + req.file.filename;
				let imageUrl = "/" + req.file.filename;
				sizeOf(dirpath + upload_img_dir + req.file.filename, function (err, dimensions) {
					let width = 200;
					let height = 200;
					if (!err && dimensions.height <= 200) {
					    height = null;
					}
					sharp(req.file.path).resize(width, height).toFile(upload_img_thumb_dir + thumb_image, (err, resizeImage) => {
						if (err) {
							res.status(500).json({ error: "Error creating thumbnail.\n" + err })
						} else {
							MediaModel.create({ 'image': imageUrl, thumb: '/'+thumb_image });
							res.status(200).json({ status: "ok", url: imageUrl })
						}
					})
				});
			} catch (tryerrinner) {
				logger.error(controllerfilename, "Image Upload", tryerrinner)
				res.status(500).json({ error: "Internal Error on our side. Sorry for the inconvience" })
			}
		})
	} catch (tryerr) {
		logger.error(controllerfilename, "Catch-index ", tryerr)
		res.status("500").send({
			status: "failed",
			message: "We broke something"
		})
	}
}

exports.delete = async (req, res) => {
	try {
		let id = req.body.img_id;
		let result = await MediaModel.findByPk(id);
		let imagePath = dirpath + upload_img_dir + result.image;
		let thumbPath = dirpath + upload_img_thumb_dir + result.thumb;
		if (fs.existsSync(imagePath)) {
			fs.unlink(imagePath, (err) => {
				if (err) throw err;
			});
		}
		if (fs.existsSync(thumbPath)) {
			fs.unlink(thumbPath, (err) => {
				if (err) throw err;
			});
		}
		await MediaModel.destroy({ where: { img_id: id } })
		res.json({ status: "success" })
	} catch (tryerr) {
		logger.error(controllerfilename, "Delete tryerror ", tryerr)
		res.status(500).json({ status: "failed", message: tryerr })
	}
}
