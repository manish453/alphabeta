"use strict"
const logger = require("../utils/logger.util");
const PagesModel = Sqlmodels.pages;
const MenusModel = Sqlmodels.menus;
const HomepageModel = Sqlmodels.homepage;
const bluebird = require("bluebird");
const { sendMail } = require("../utils/mailer.util");


const controllerfilename = "frontend-controller";

const getMenus = async () => {
	return new bluebird((resolve, reject) => {
		try {
			let data = MenusModel.findAll({
				where: { status: '1' },
				limit: 6,
				order: [['order_number', 'asc']]
			})
				.then(result => {
					resolve(result);
				})
				.catch(err => {
					reject(err)
				})
			return data;
		} catch (e) {
			logger.error(controllerfilename, "Catch-index ", e)
			reject(e)
		}
	});

}

exports.index = async (req, res) => {
	try {
		let homemeta = {};
		let homecontent = {};
		let menus = await getMenus();
		let result = await PagesModel.findOne({
			where: { slug: 'home' },
		})
		if (result) homemeta = result;
		let homedata = await HomepageModel.findAll({
			where: { status: 1 },
			order: [['order_number', 'asc']]
		})
		if (homedata) homecontent = homedata;
		let pagetype = "homepage";
		res.render("frontend/", { menus: menus, data: homemeta, homecontent: homecontent, pagetype: pagetype });

	} catch (error) {
		logger.error(controllerfilename, "Catch-index ", error)
		res.status("500").send({
			status: "failed",
			message: "We broke something"
		})
	}
}

exports.pages = async (req, res) => {
	try {
		const id = req.params.id;
		if (id == 'home') res.redirect("/");
		let menus = await getMenus();
		let result = await PagesModel.findOne({
			where: { slug: id },
		})
		let pagetype = "innerpage";
		if (result) {
			res.render("frontend/pages", { data: result, menus: menus, pagetype: pagetype });
		} else {
			res.status(300).render("frontend/error", { menus: menus, msg: "Page not found!" });
		}

	} catch (error) {
		logger.error(controllerfilename, "Catch-index ", error)
		res.status("500").send({
			status: "failed",
			message: "We broke something"
		})
	}
}


exports.contactForm = async (req, res) => {
	let request = req.body;
	let mail = {
		to: "connect2mks@gmail.com",
		//bcc:"connect2mks@gmail.com",
		subject: request.subject || "Get in touch Mail from Alpha beta solutions",
		content:
			'<table rules="all" style="border-color: #666;" cellpadding="10">' +
			'<tr style="background:#eee;"><td><strong>Name :</strong> </td><td>' + request.name + '</td></tr>' +
			'<tr><td><strong>Email : </strong> </td><td>' + request.email + '</td></tr>' +
			'<tr><td><strong>Phone : </strong> </td><td>' + request.subject + '</td></tr>' +
			'<tr><td><strong>Phone : </strong> </td><td>' + request.message + '</td></tr>' +
			'</table>'
	}
	sendMail(mail, false)
	res.json({ status: "ok" })
}