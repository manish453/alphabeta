"use strict";
let frontendport = process.env.fport
let adminport = process.env.port
let directory = __dirname + "/../"
let upload_img_dir = "/uploads/images/";
let upload_img_thumb_dir = "uploads/images/thumbnails/";

module.exports = {
	adminportal: process.env.admin,
	patientportal: process.env.padmin,
	dirpath: directory,
	environment: process.env.ENVIRONMENT,
	fileversion: "1.1.1",
	port: adminport,
	fport: frontendport,
	upload_img_dir: upload_img_dir,
	upload_img_thumb_dir : upload_img_thumb_dir
}